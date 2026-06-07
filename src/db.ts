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
  Question,
  SkillTopic,
  UserSettings,
  VocabCard,
  VocabDeck,
  VerbEntry,
} from './types'

class FrenchLearningDb extends Dexie {
  topics!: Table<SkillTopic, string>
  questions!: Table<Question, string>
  decks!: Table<VocabDeck, string>
  cards!: Table<VocabCard, string>
  verbs!: Table<VerbEntry, string>
  attempts!: Table<AttemptLog, number>
  settings!: Table<UserSettings, string>

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
  }
}

export const db = new FrenchLearningDb()

export async function seedDatabase() {
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

  const settings = await db.settings.get('main')
  if (!settings) {
    await db.settings.put(defaultSettings)
  } else {
    const migratedSettings = { ...defaultSettings, ...settings }
    if (JSON.stringify(migratedSettings) !== JSON.stringify(settings)) {
      await db.settings.put(migratedSettings)
    }
  }
}

export async function loadSnapshot(): Promise<LearningSnapshot> {
  await seedDatabase()
  const [topics, questions, decks, cards, verbs, attempts, settings] = await Promise.all([
    db.topics.toArray(),
    db.questions.toArray(),
    db.decks.toArray(),
    db.cards.toArray(),
    db.verbs.toArray(),
    db.attempts.orderBy('createdAt').reverse().limit(20).toArray(),
    db.settings.get('main'),
  ])

  return {
    topics,
    questions,
    decks,
    cards,
    verbs,
    attempts,
    settings: { ...defaultSettings, ...settings },
  }
}

export async function updateSettings(settings: UserSettings) {
  await db.settings.put(settings)
}

export async function logAttempt(attempt: Omit<AttemptLog, 'id' | 'createdAt'>) {
  await db.attempts.add({
    ...attempt,
    createdAt: new Date().toISOString(),
  })
}

export async function updateTopicConfidence(topicId: string, correct: boolean, answer: string, label: string) {
  const topic = await db.topics.get(topicId)
  if (!topic) return
  const delta = correct ? 8 : -12
  await db.topics.update(topicId, {
    confidence: clamp(topic.confidence + delta),
  })
  await logAttempt({ itemId: topicId, itemType: 'grammar', label, correct, answer })
}

export async function updateCardReview(cardId: string, correct: boolean, answer: string) {
  const card = await db.cards.get(cardId)
  if (!card) return

  const nextInterval = correct ? nextSpacedInterval(card.intervalDays) : 0
  const due = new Date()
  due.setDate(due.getDate() + nextInterval)

  await db.cards.update(cardId, {
    confidence: clamp(card.confidence + (correct ? 10 : -15)),
    intervalDays: nextInterval || 1,
    dueAt: due.toISOString(),
  })
  await logAttempt({ itemId: cardId, itemType: 'vocabulary', label: card.frontFr, correct, answer })
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

export async function addDeck(deck: VocabDeck) {
  await db.decks.put(deck)
}

export async function addCard(card: VocabCard) {
  await db.cards.put(card)
}

export async function addTopic(topic: SkillTopic, question?: Question) {
  await db.topics.put(topic)
  if (question) await db.questions.put(question)
}

export async function addVerb(verbEntry: VerbEntry) {
  await db.verbs.put(verbEntry)
}

export async function exportSnapshot(): Promise<LearningSnapshot> {
  const [topics, questions, decks, cards, verbs, attempts, settings] = await Promise.all([
    db.topics.toArray(),
    db.questions.toArray(),
    db.decks.toArray(),
    db.cards.toArray(),
    db.verbs.toArray(),
    db.attempts.toArray(),
    db.settings.get('main'),
  ])

  return {
    topics,
    questions,
    decks,
    cards,
    verbs,
    attempts,
    settings: { ...defaultSettings, ...settings },
  }
}

export async function importSnapshot(snapshot: LearningSnapshot) {
  await db.topics.clear()
  await db.questions.clear()
  await db.decks.clear()
  await db.cards.clear()
  await db.verbs.clear()
  await db.attempts.clear()
  await db.settings.clear()
  await db.topics.bulkPut(snapshot.topics ?? [])
  await db.questions.bulkPut(snapshot.questions ?? [])
  await db.decks.bulkPut(snapshot.decks ?? [])
  await db.cards.bulkPut(snapshot.cards ?? [])
  await db.verbs.bulkPut(snapshot.verbs ?? [])
  await db.attempts.bulkPut(snapshot.attempts ?? [])
  await db.settings.put({ ...defaultSettings, ...snapshot.settings })
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

function nextSpacedInterval(current: number) {
  if (current <= 0) return 1
  if (current === 1) return 3
  if (current === 3) return 7
  if (current === 7) return 14
  if (current === 14) return 30
  return 45
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
