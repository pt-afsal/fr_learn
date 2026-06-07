import { curatedReadingExercises, curatedWritingPrompts } from './contentRegistry'
import type {
  ActivityType,
  CefrLevel,
  DayKey,
  LearningLevel,
  LearningSnapshot,
  PlannedTask,
  SkillTopic,
  TargetLevel,
  UserSettings,
  VocabDeck,
  VerbEntry,
} from '../types'
import { dayKeys } from '../types'

export interface PlannedDay {
  day: DayKey
  date: string
  availableMinutes: number
  tasks: PlannedTask[]
}

export interface WeekPlan {
  weekStart: string
  days: PlannedDay[]
  totalMinutes: number
}

const dayIndex: Record<DayKey, number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
}

const levelRank: Record<CefrLevel, number> = { A1: 1, A2: 2, B1: 3, B2: 4 }

export function targetForLevel(level: LearningLevel): TargetLevel {
  if (level === 'A1') return 'A2'
  if (level === 'A2') return 'B1'
  return 'B1-mastery'
}

export function getWeekStart(date = new Date()) {
  const copy = new Date(date)
  const currentDay = copy.getDay()
  const diff = currentDay === 0 ? -6 : 1 - currentDay
  copy.setDate(copy.getDate() + diff)
  copy.setHours(0, 0, 0, 0)
  return toDateKey(copy)
}

export function toDateKey(date: Date) {
  return date.toLocaleDateString('en-CA')
}

export function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours} h ${rest} min` : `${hours} h`
}

export function settingsWeeklyMinutes(settings: UserSettings) {
  return dayKeys.reduce((total, day) => total + settings.weeklyAvailability[day], 0)
}

export function generateWeekPlan(snapshot: LearningSnapshot, weekStart = getWeekStart()): WeekPlan {
  const topics = relevantTopics(snapshot)
  const decks = relevantDecks(snapshot)
  const verbs = relevantVerbs(snapshot)
  const readings = [...curatedReadingExercises, ...snapshot.generatedReadings].filter((exercise) =>
    isLevelRelevant(exercise.level, snapshot.settings.currentLevel),
  )
  const writings = curatedWritingPrompts.filter((prompt) => isLevelRelevant(prompt.level, snapshot.settings.currentLevel))
  const weekStartDate = new Date(`${weekStart}T00:00:00`)
  const days = dayKeys.map((day) => {
    const date = new Date(weekStartDate)
    date.setDate(date.getDate() + dayIndex[day])
    const dateKey = toDateKey(date)
    return {
      day,
      date: dateKey,
      availableMinutes: snapshot.settings.weeklyAvailability[day],
      tasks: planDay(
        snapshot,
        dateKey,
        snapshot.settings.weeklyAvailability[day],
        topics,
        decks,
        verbs,
        readings,
        writings,
      ),
    }
  })
  addCurrentWeekCarryover(days, snapshot)
  injectWeeklyReview(days)
  return { weekStart, days, totalMinutes: days.reduce((sum, day) => sum + day.availableMinutes, 0) }
}

export function getTaskById(plan: WeekPlan, taskId: string) {
  return plan.days.flatMap((day) => day.tasks).find((task) => task.id === taskId)
}

function planDay(
  snapshot: LearningSnapshot,
  date: string,
  minutes: number,
  topics: SkillTopic[],
  decks: VocabDeck[],
  verbs: VerbEntry[],
  readings: ReturnType<typeof relevantReadings>,
  writings: typeof curatedWritingPrompts,
) {
  if (minutes <= 0) return []
  const weakTopic = pick(topics, `${date}-topic`)
  const dueDeck = selectDueDeck(snapshot, decks, date)
  const weakVerb = pick(verbs, `${date}-verb`)
  const reading = pick(readings, `${date}-reading`)
  const writing = pick(writings, `${date}-writing`)
  const pronunciationText = weakTopic?.examples[0] ?? 'Je voudrais améliorer ma prononciation en français.'

  const candidates: Array<Omit<PlannedTask, 'id' | 'date'>> = [
    {
      type: 'vocabulary-review',
      title: 'Review vocabulary',
      detail: dueDeck ? dueDeck.title : 'Review due flashcards',
      estimatedMinutes: minutes <= 30 ? 10 : 15,
      contentId: dueDeck?.id,
      source: 'planner',
    },
    {
      type: 'grammar-lesson',
      title: weakTopic ? `Learn: ${weakTopic.titleEn}` : 'Review a grammar lesson',
      detail: weakTopic?.area ?? 'Grammar path',
      estimatedMinutes: minutes <= 45 ? 10 : 20,
      contentId: weakTopic?.id,
      source: 'planner',
    },
    {
      type: 'conjugation',
      title: weakVerb ? `Conjugation: ${weakVerb.infinitive}` : 'Conjugation drill',
      detail: weakVerb?.meaning ?? 'Practice core verbs',
      estimatedMinutes: 15,
      contentId: weakVerb?.id,
      source: 'planner',
    },
    {
      type: 'grammar-practice',
      title: 'Grammar practice',
      detail: weakTopic ? `Exercises for ${weakTopic.titleEn}` : 'Targeted practice',
      estimatedMinutes: 15,
      contentId: weakTopic?.id,
      source: 'planner',
    },
    {
      type: 'reading',
      title: reading ? `Reading: ${reading.title ?? reading.titleEn ?? reading.id}` : 'Reading comprehension',
      detail: reading?.theme ?? 'Read and answer questions',
      estimatedMinutes: reading?.estimatedMinutes ?? 20,
      contentId: reading?.id,
      source: 'curated',
    },
    {
      type: 'pronunciation',
      title: 'Pronunciation practice',
      detail: pronunciationText,
      estimatedMinutes: 10,
      contentId: weakTopic?.id,
      source: 'planner',
    },
    {
      type: 'writing',
      title: writing ? `Writing: ${writing.title ?? writing.titleEn ?? writing.id}` : 'Writing practice',
      detail: writing?.task ?? writing?.descriptionEn ?? 'Write a short response and request feedback',
      estimatedMinutes: snapshot.settings.currentLevel === 'B1' ? 30 : 20,
      contentId: writing?.id,
      source: 'curated',
    },
  ]

  const priorities = activityPriorities(minutes, date)
  const tasks: PlannedTask[] = []
  let used = 0
  for (const type of priorities) {
    const candidate = candidates.find((item) => item.type === type)
    if (!candidate) continue
    if (used + candidate.estimatedMinutes > minutes && tasks.length > 0) continue
    tasks.push({ ...candidate, id: `${date}-${candidate.type}-${tasks.length + 1}`, date })
    used += candidate.estimatedMinutes
  }
  if (!tasks.length) {
    const candidate = candidates[0]
    tasks.push({ ...candidate, id: `${date}-${candidate.type}-1`, date, estimatedMinutes: minutes })
  }

  // Longer study days become two varied blocks rather than one oversized lesson.
  if (minutes >= 150) {
    const extraReading = pick(readings, `${date}-reading-second-session`)
    const extras: Array<Omit<PlannedTask, 'id' | 'date'>> = [
      {
        type: 'reading',
        title: extraReading ? `Second session reading: ${extraReading.title ?? extraReading.titleEn ?? extraReading.id}` : 'Second session reading',
        detail: extraReading?.theme ?? 'Additional comprehension practice after a break',
        estimatedMinutes: extraReading?.estimatedMinutes ?? 20,
        contentId: extraReading?.id,
        source: 'curated',
        optional: true,
      },
      {
        type: 'grammar-practice',
        title: 'Second session grammar review',
        detail: weakTopic ? `Reinforce ${weakTopic.titleEn}` : 'Reinforce a weak grammar topic',
        estimatedMinutes: 15,
        contentId: weakTopic?.id,
        source: 'planner',
        optional: true,
      },
      {
        type: 'vocabulary-review',
        title: 'Second session vocabulary review',
        detail: dueDeck?.title ?? 'Extra spaced-repetition round',
        estimatedMinutes: 15,
        contentId: dueDeck?.id,
        source: 'planner',
        optional: true,
      },
      {
        type: 'pronunciation',
        title: 'Second session pronunciation',
        detail: pronunciationText,
        estimatedMinutes: 10,
        contentId: weakTopic?.id,
        source: 'planner',
        optional: true,
      },
    ]
    for (const extra of extras) {
      if (used + extra.estimatedMinutes > minutes) continue
      tasks.push({ ...extra, id: `${date}-${extra.type}-second-${tasks.length + 1}`, date })
      used += extra.estimatedMinutes
    }
  }
  return tasks
}

function activityPriorities(minutes: number, date: string): ActivityType[] {
  if (minutes <= 15) return ['vocabulary-review']
  if (minutes <= 30) return ['vocabulary-review', 'grammar-lesson', 'pronunciation']
  if (minutes <= 45) return ['vocabulary-review', 'grammar-lesson', 'conjugation', 'pronunciation']
  if (minutes <= 75) return ['vocabulary-review', 'grammar-lesson', 'grammar-practice', 'conjugation', 'pronunciation']
  if (minutes <= 120) return ['vocabulary-review', 'grammar-lesson', 'grammar-practice', 'conjugation', 'reading', 'pronunciation', 'writing']
  const writingFirst = stableHash(date) % 2 === 0
  return writingFirst
    ? ['vocabulary-review', 'grammar-lesson', 'grammar-practice', 'conjugation', 'reading', 'writing', 'pronunciation']
    : ['vocabulary-review', 'grammar-lesson', 'grammar-practice', 'reading', 'conjugation', 'pronunciation', 'writing']
}

function addCurrentWeekCarryover(days: PlannedDay[], snapshot: LearningSnapshot) {
  const today = toDateKey(new Date())
  const completed = new Set(snapshot.taskCompletions.map((item) => item.taskId))
  const missed = days
    .filter((day) => day.date < today)
    .flatMap((day) => day.tasks)
    .filter((task) => !task.optional && !completed.has(task.id))
    .slice(0, 2)
  if (!missed.length) return
  const futureDays = days.filter((day) => day.date >= today && day.availableMinutes > 0)
  for (const task of missed) {
    const destination = futureDays.find((day) => remainingMinutes(day) >= Math.min(task.estimatedMinutes, 20))
    if (!destination) break
    const minutes = Math.min(task.estimatedMinutes, Math.max(10, remainingMinutes(destination)))
    destination.tasks.push({
      ...task,
      id: `${destination.date}-catch-up-${task.id}`,
      date: destination.date,
      title: `Catch up: ${task.title}`,
      detail: `Rescheduled from ${task.date}. ${task.detail}`,
      estimatedMinutes: minutes,
      source: 'planner',
    })
  }
}

function remainingMinutes(day: PlannedDay) {
  return day.availableMinutes - day.tasks.reduce((sum, task) => sum + task.estimatedMinutes, 0)
}

function topicUnlocked(topic: SkillTopic, allTopics: SkillTopic[]) {
  if (!topic.prerequisites?.length) return true
  return topic.prerequisites.every((id) => (allTopics.find((candidate) => candidate.id === id)?.confidence ?? 0) >= 55)
}

function injectWeeklyReview(days: PlannedDay[]) {
  const eligible = [...days].filter((day) => day.availableMinutes >= 90).sort((a, b) => b.availableMinutes - a.availableMinutes)
  const day = eligible[0]
  if (!day) return
  const used = day.tasks.reduce((sum, task) => sum + task.estimatedMinutes, 0)
  if (day.availableMinutes - used < 20) return
  day.tasks.push({
    id: `${day.date}-weekly-review-${day.tasks.length + 1}`,
    date: day.date,
    type: 'weekly-review',
    title: 'Weekly review',
    detail: 'Revisit mistakes and check what should return next week.',
    estimatedMinutes: Math.min(30, day.availableMinutes - used),
    source: 'planner',
    optional: true,
  })
}

function relevantTopics(snapshot: LearningSnapshot) {
  const levels = levelWindow(snapshot.settings.currentLevel)
  const candidates = snapshot.topics
    .filter((topic) => levels.includes(topic.level) && topic.level !== 'B2')
    .sort((a, b) => a.confidence - b.confidence || (a.sequence ?? 999) - (b.sequence ?? 999))
  const unlocked = candidates.filter((topic) => topicUnlocked(topic, snapshot.topics))
  return (unlocked.length ? unlocked : candidates).slice(0, 30)
}

function relevantDecks(snapshot: LearningSnapshot) {
  const levels = levelWindow(snapshot.settings.currentLevel)
  return snapshot.decks.filter((deck) => levels.includes(deck.level) && deck.level !== 'B2')
}

function relevantVerbs(snapshot: LearningSnapshot) {
  const levels = levelWindow(snapshot.settings.currentLevel)
  return snapshot.verbs
    .filter((verb) => levels.includes(verb.level) && verb.level !== 'B2')
    .sort((a, b) => average(Object.values(a.mastery)) - average(Object.values(b.mastery)))
    .slice(0, 50)
}

function relevantReadings(snapshot: LearningSnapshot) {
  return [...curatedReadingExercises, ...snapshot.generatedReadings].filter((exercise) =>
    isLevelRelevant(exercise.level, snapshot.settings.currentLevel),
  )
}

function selectDueDeck(snapshot: LearningSnapshot, decks: VocabDeck[], date: string) {
  const dueCards = snapshot.cards.filter((card) => new Date(card.dueAt).getTime() <= Date.now())
  const countByDeck = new Map<string, number>()
  dueCards.forEach((card) => countByDeck.set(card.deckId, (countByDeck.get(card.deckId) ?? 0) + 1))
  return [...decks].sort((a, b) => (countByDeck.get(b.id) ?? 0) - (countByDeck.get(a.id) ?? 0))[stableHash(date) % Math.max(1, Math.min(5, decks.length))]
    ?? pick(decks, date)
}

function levelWindow(level: LearningLevel): CefrLevel[] {
  if (level === 'A1') return ['A1', 'A2']
  if (level === 'A2') return ['A1', 'A2', 'B1']
  return ['A2', 'B1']
}

function isLevelRelevant(contentLevel: CefrLevel, currentLevel: LearningLevel) {
  if (contentLevel === 'B2') return false
  const rank = levelRank[contentLevel]
  const current = levelRank[currentLevel]
  return rank >= Math.max(1, current - 1) && rank <= Math.min(3, current + 1)
}

function pick<T>(items: T[], seed: string): T | undefined {
  if (!items.length) return undefined
  return items[stableHash(seed) % items.length]
}

function stableHash(value: string) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return Math.abs(hash)
}

function average(values: number[]) {
  if (!values.length) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}
