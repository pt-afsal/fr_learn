import Dexie, { type Table } from 'dexie'
import {
  defaultSettings,
  seedCards,
  seedDecks,
  seedQuestions,
  seedTopics,
  seedVerbs,
} from './seed'
import type {
  AttemptLog,
  LearningSnapshot,
  PronunciationAttempt,
  Question,
  ReadingAttempt,
  ReadingExercise,
  SkillTopic,
  TaskCompletion,
  UserSettings,
  VocabCard,
  VocabDeck,
  VerbEntry,
  WritingAttempt,
} from './types'

class FrenchLearningDb extends Dexie {
  topics!: Table<SkillTopic, string>
  questions!: Table<Question, string>
  decks!: Table<VocabDeck, string>
  cards!: Table<VocabCard, string>
  verbs!: Table<VerbEntry, string>
  attempts!: Table<AttemptLog, number>
  settings!: Table<UserSettings, string>
  taskCompletions!: Table<TaskCompletion, string>
  writingAttempts!: Table<WritingAttempt, string>
  readingAttempts!: Table<ReadingAttempt, string>
  pronunciationAttempts!: Table<PronunciationAttempt, string>
  generatedReadings!: Table<ReadingExercise, string>

  constructor() {
    super('lexpert-francais')
    this.version(1).stores({
      topics: 'id, level, area, confidence',
      questions: 'id, topicId, type',
      decks: 'id, level',
      cards: 'id, deckId, dueAt, confidence, *tags',
      verbs: 'id, infinitive, level',
      attempts: '++id, itemId, itemType, createdAt',
      settings: 'id',
    })
    this.version(2).stores({
      topics: 'id, level, area, confidence',
      questions: 'id, topicId, type',
      decks: 'id, level',
      cards: 'id, deckId, dueAt, confidence, *tags',
      verbs: 'id, infinitive, level',
      attempts: '++id, itemId, itemType, createdAt',
      settings: 'id',
      taskCompletions: 'id, taskId, date, completedAt',
      writingAttempts: 'id, promptId, completedAt',
      readingAttempts: 'id, exerciseId, completedAt',
      pronunciationAttempts: 'id, completedAt',
      generatedReadings: 'id, level, generated',
    })
  }
}

export const db = new FrenchLearningDb()

export async function seedDatabase() {
  const a1TopicIds = seedTopics.filter((topic) => topic.level === 'A1').map((topic) => topic.id)
  if (a1TopicIds.length) {
    await db.questions.where('topicId').anyOf(a1TopicIds).delete()
  }
  await upsertSeedItems(db.topics, seedTopics, (existing) => ({ confidence: existing.confidence }))
  await upsertSeedItems(db.questions, seedQuestions)
  await upsertSeedItems(db.decks, seedDecks)
  await upsertSeedItems(db.cards, seedCards, (existing) => ({
    confidence: existing.confidence,
    dueAt: existing.dueAt,
    intervalDays: existing.intervalDays,
  }))
  await upsertSeedItems(db.verbs, seedVerbs, (existing, seed) => ({
    mastery: { ...seed.mastery, ...existing.mastery },
  }))

  const existing = await db.settings.get('main')
  if (!existing) {
    await db.settings.put(defaultSettings)
    return
  }

  const migratedAvailability = existing.weeklyAvailability ?? availabilityFromLegacy(existing)
  const migrated: UserSettings = {
    ...defaultSettings,
    ...existing,
    currentLevel: (existing.currentLevel as string) === 'B2' ? 'B1' : existing.currentLevel,
    targetLevel: (existing.targetLevel as string) === 'B2' ? 'B1-mastery' : existing.targetLevel,
    weeklyAvailability: migratedAvailability,
    aiProvider: existing.aiProvider === 'ollama' ? 'ollama' : 'disabled',
  }
  await db.settings.put(migrated)
}

export async function loadSnapshot(): Promise<LearningSnapshot> {
  await seedDatabase()
  const [
    topics,
    questions,
    decks,
    cards,
    verbs,
    attempts,
    settings,
    taskCompletions,
    writingAttempts,
    readingAttempts,
    pronunciationAttempts,
    generatedReadings,
  ] = await Promise.all([
    db.topics.toArray(),
    db.questions.toArray(),
    db.decks.toArray(),
    db.cards.toArray(),
    db.verbs.toArray(),
    db.attempts.orderBy('createdAt').reverse().limit(120).toArray(),
    db.settings.get('main'),
    db.taskCompletions.orderBy('completedAt').reverse().toArray(),
    db.writingAttempts.orderBy('completedAt').reverse().toArray(),
    db.readingAttempts.orderBy('completedAt').reverse().toArray(),
    db.pronunciationAttempts.orderBy('completedAt').reverse().toArray(),
    db.generatedReadings.toArray(),
  ])

  return {
    topics,
    questions,
    decks,
    cards,
    verbs,
    attempts,
    taskCompletions,
    writingAttempts,
    readingAttempts,
    pronunciationAttempts,
    generatedReadings,
    settings: { ...defaultSettings, ...settings },
  }
}

export async function updateSettings(settings: UserSettings) {
  await db.settings.put(settings)
}

export async function saveDeckWithCards(deck: VocabDeck, cards: VocabCard[]) {
  await db.transaction('rw', db.decks, db.cards, async () => {
    await db.decks.put(deck)
    if (cards.length) await db.cards.bulkPut(cards)
  })
}

export async function logAttempt(attempt: Omit<AttemptLog, 'id' | 'createdAt'>) {
  await db.attempts.add({ ...attempt, createdAt: new Date().toISOString() })
}

export async function completeTask(taskId: string, date: string, score?: number) {
  const completedAt = new Date().toISOString()
  await db.taskCompletions.put({ id: taskId, taskId, date, completedAt, score })
}

export async function saveReadingAttempt(attempt: ReadingAttempt) {
  await db.readingAttempts.put(attempt)
}

export async function saveWritingAttempt(attempt: WritingAttempt) {
  await db.writingAttempts.put(attempt)
}

export async function savePronunciationAttempt(attempt: PronunciationAttempt) {
  await db.pronunciationAttempts.put(attempt)
}

export async function saveGeneratedReading(exercise: ReadingExercise) {
  await db.generatedReadings.put({ ...exercise, generated: true })
}

export async function updateTopicConfidence(topicId: string, correct: boolean, answer: string, label: string) {
  const topic = await db.topics.get(topicId)
  if (!topic) return
  await db.topics.update(topicId, { confidence: clamp(topic.confidence + (correct ? 8 : -12)) })
  await logAttempt({ itemId: topicId, itemType: 'grammar', label, correct, answer })
}

export async function updateCardReview(cardId: string, rating: 'again' | 'difficult' | 'good' | 'easy') {
  const card = await db.cards.get(cardId)
  if (!card) return
  const { intervalDays, confidenceDelta } = calculateReview(rating, card.intervalDays)
  const due = new Date()
  due.setDate(due.getDate() + intervalDays)
  await db.cards.update(cardId, {
    confidence: clamp(card.confidence + confidenceDelta),
    intervalDays,
    dueAt: due.toISOString(),
  })
  await logAttempt({
    itemId: cardId,
    itemType: 'vocabulary',
    label: card.frontFr,
    correct: rating === 'good' || rating === 'easy',
    answer: rating,
  })
}

export async function updateVerbMastery(
  verbId: string,
  tense: string,
  correct: boolean,
  answer: string,
  label: string,
) {
  const verbEntry = await db.verbs.get(verbId)
  if (!verbEntry) return
  await db.verbs.update(verbId, {
    mastery: {
      ...verbEntry.mastery,
      [tense]: clamp((verbEntry.mastery[tense] ?? 20) + (correct ? 8 : -12)),
    },
  })
  await logAttempt({ itemId: verbId, itemType: 'conjugation', label, correct, answer })
}

export async function exportSnapshot(): Promise<LearningSnapshot> {
  return loadSnapshot()
}

export async function importSnapshot(snapshot: LearningSnapshot) {
  await Promise.all([
    db.topics.clear(),
    db.questions.clear(),
    db.decks.clear(),
    db.cards.clear(),
    db.verbs.clear(),
    db.attempts.clear(),
    db.settings.clear(),
    db.taskCompletions.clear(),
    db.writingAttempts.clear(),
    db.readingAttempts.clear(),
    db.pronunciationAttempts.clear(),
    db.generatedReadings.clear(),
  ])
  await db.topics.bulkPut(snapshot.topics ?? [])
  await db.questions.bulkPut(snapshot.questions ?? [])
  await db.decks.bulkPut(snapshot.decks ?? [])
  await db.cards.bulkPut(snapshot.cards ?? [])
  await db.verbs.bulkPut(snapshot.verbs ?? [])
  await db.attempts.bulkPut(snapshot.attempts ?? [])
  await db.settings.put({ ...defaultSettings, ...snapshot.settings })
  await db.taskCompletions.bulkPut(snapshot.taskCompletions ?? [])
  await db.writingAttempts.bulkPut(snapshot.writingAttempts ?? [])
  await db.readingAttempts.bulkPut(snapshot.readingAttempts ?? [])
  await db.pronunciationAttempts.bulkPut(snapshot.pronunciationAttempts ?? [])
  await db.generatedReadings.bulkPut(snapshot.generatedReadings ?? [])
}

export async function resetProgress() {
  const settings = await db.settings.get('main')
  await Promise.all([
    db.topics.clear(),
    db.questions.clear(),
    db.decks.clear(),
    db.cards.clear(),
    db.verbs.clear(),
    db.attempts.clear(),
    db.taskCompletions.clear(),
    db.writingAttempts.clear(),
    db.readingAttempts.clear(),
    db.pronunciationAttempts.clear(),
    db.generatedReadings.clear(),
  ])
  await db.topics.bulkPut(seedTopics)
  await db.questions.bulkPut(seedQuestions)
  await db.decks.bulkPut(seedDecks)
  await db.cards.bulkPut(seedCards)
  await db.verbs.bulkPut(seedVerbs)
  await db.settings.put({ ...defaultSettings, ...settings, onboardingCompleted: false })
}

export function normalizeAnswer(value: string) {
  return value
    .trim()
    .toLocaleLowerCase('fr-FR')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[’']/g, "'")
    .replace(/\s+/g, ' ')
}

function calculateReview(rating: 'again' | 'difficult' | 'good' | 'easy', current: number) {
  if (rating === 'again') return { intervalDays: 1, confidenceDelta: -15 }
  if (rating === 'difficult') return { intervalDays: Math.max(1, Math.round(current * 1.3)), confidenceDelta: -3 }
  if (rating === 'easy') return { intervalDays: Math.max(4, Math.round(current * 2.6)), confidenceDelta: 14 }
  return { intervalDays: nextSpacedInterval(current), confidenceDelta: 9 }
}

function nextSpacedInterval(current: number) {
  if (current <= 1) return 3
  if (current <= 3) return 7
  if (current <= 7) return 14
  if (current <= 14) return 30
  return 45
}

function availabilityFromLegacy(settings: Partial<UserSettings>) {
  const hours = settings.weeklyStudyHours ?? 5
  const days = Math.max(1, settings.studyDaysPerWeek ?? 5)
  const daily = Math.round((hours * 60) / days / 15) * 15
  const keys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const
  return Object.fromEntries(keys.map((day, index) => [day, index < days ? daily : 0])) as UserSettings['weeklyAvailability']
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value))
}

async function upsertSeedItems<T extends { id: string }>(
  table: Table<T, string>,
  items: T[],
  preserve?: (existing: T, seed: T) => Partial<T>,
) {
  const ids = items.map((item) => item.id)
  const existingItems = await table.bulkGet(ids)
  const mergedItems = items.map((item, index) => {
    const existing = existingItems[index]
    return existing ? { ...item, ...preserve?.(existing, item) } : item
  })
  if (mergedItems.length) await table.bulkPut(mergedItems)
}
