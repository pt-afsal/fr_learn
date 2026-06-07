export type ViewId =
  | 'today'
  | 'plan'
  | 'learn'
  | 'practice'
  | 'progress'
  | 'settings'

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2'
export type LearningLevel = Exclude<CefrLevel, 'B2'>
export type TargetLevel = 'A2' | 'B1' | 'B1-mastery'
export type LanguageMode = 'en' | 'fr'
export type AiProvider = 'disabled' | 'ollama'
export type QuestionType = 'multiple-choice' | 'fill'
export type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
export type CoreItemType = 'grammar' | 'vocabulary' | 'conjugation'
export type ActivityType =
  | 'grammar-lesson'
  | 'grammar-practice'
  | 'vocabulary-review'
  | 'conjugation'
  | 'reading'
  | 'writing'
  | 'pronunciation'
  | 'weekly-review'
export type ItemType = CoreItemType | ActivityType

export const dayKeys: DayKey[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]

export type WeeklyAvailability = Record<DayKey, number>


export interface GrammarMistake {
  incorrect: string
  correct: string
  explanation: string
}

export interface GrammarLessonGuide {
  goals: string[]
  rules: string[]
  commonMistakes: GrammarMistake[]
  memoryTip: string
  quickReference?: Array<{ label: string; value: string }>
}

export interface SkillTopic {
  id: string
  level: CefrLevel
  area: string
  titleEn: string
  titleFr: string
  explanationEn: string
  explanationFr: string
  examples: string[]
  confidence: number
  difficulty?: number
  prerequisites?: string[]
  estimatedMinutes?: number
  sequence?: number
  source?: 'seed' | 'totem' | 'personal'
  lessonGuide?: GrammarLessonGuide
}

export interface Question {
  id: string
  topicId: string
  type: QuestionType
  promptEn: string
  promptFr: string
  choices?: string[]
  correctAnswer: string
  explanationEn: string
  explanationFr: string
}

export interface VocabDeck {
  id: string
  title: string
  description: string
  level: CefrLevel
  tags: string[]
  difficulty?: number
  estimatedMinutes?: number
  sequence?: number
  source?: 'seed' | 'totem' | 'personal'
  dossierId?: string
}

export interface VocabCard {
  id: string
  deckId: string
  frontFr: string
  backEn: string
  gender?: 'm' | 'f' | 'm/f'
  exampleFr: string
  exampleEn: string
  notes?: string
  tags: string[]
  confidence: number
  dueAt: string
  intervalDays: number
  difficulty?: number
}

export interface VerbEntry {
  id: string
  infinitive: string
  meaning: string
  level: CefrLevel
  group: 'regular -er' | 'regular -ir' | 'regular -re' | 'irregular'
  auxiliary: 'avoir' | 'etre'
  reflexive: boolean
  conjugations: Record<string, Record<string, string>>
  mastery: Record<string, number>
  difficulty?: number
  estimatedMinutes?: number
  sequence?: number
  source?: 'seed' | 'totem' | 'personal'
}

export interface AttemptLog {
  id?: number
  itemId: string
  itemType: ItemType
  label: string
  correct: boolean
  answer: string
  createdAt: string
}

export interface UserSettings {
  id: 'main'
  learnerName: string
  onboardingCompleted: boolean
  currentLevel: LearningLevel
  targetLevel: TargetLevel
  weeklyAvailability: WeeklyAvailability
  languageMode: LanguageMode
  speechEnabled: boolean
  speechRecognitionEnabled: boolean
  aiProvider: AiProvider
  aiModel: string
  ollamaHost: string
  // Kept for migration from the original project.
  weeklyStudyHours?: number
  studyDaysPerWeek?: number
}

export interface PlannedTask {
  id: string
  date: string
  type: ActivityType
  title: string
  detail: string
  estimatedMinutes: number
  contentId?: string
  source: 'planner' | 'curated' | 'ai'
  optional?: boolean
}

export interface TaskCompletion {
  id: string
  taskId: string
  date: string
  completedAt: string
  score?: number
}

export interface ReadingQuestion {
  id: string
  prompt?: string
  promptFr?: string
  promptEn?: string
  choices: string[]
  correctAnswer: string
  explanation?: string
  explanationFr?: string
  explanationEn?: string
}

export interface ReadingExercise {
  id: string
  level: CefrLevel
  title?: string
  titleFr?: string
  titleEn?: string
  theme?: string
  text: string
  questions: ReadingQuestion[]
  vocabularyHighlights?: Array<{ term: string; meaning: string }>
  grammarTags?: string[]
  estimatedMinutes?: number
  generated?: boolean
}

export interface ReadingAttempt {
  id: string
  exerciseId: string
  answers: Record<string, string>
  score: number
  completedAt: string
}

export interface WritingPrompt {
  id: string
  level: CefrLevel
  title?: string
  titleFr?: string
  titleEn?: string
  descriptionFr?: string
  descriptionEn?: string
  wordCountTarget?: number
  grammarChecklist?: string[]
  starterSentence?: string
  modelAnswerStructure?: string
  task?: string
  checklist?: string[]
  starter?: string
}

export interface WritingScores {
  taskCompletion: number
  grammar: number
  vocabulary: number
  clarity: number
}

export interface WritingEvaluation {
  scores: WritingScores
  correctedText: string
  importantMistakes: Array<{ original: string; correction: string; explanation: string }>
  rewritePractice: string[]
  positiveComment: string
  recommendedGrammarTopic: string
}

export interface WritingAttempt {
  id: string
  promptId: string
  originalText: string
  correctedText?: string
  feedback?: WritingEvaluation
  completedAt: string
}

export interface PronunciationAttempt {
  id: string
  expectedText: string
  recognizedText: string
  similarity: number
  feedback?: string
  completedAt: string
}

export interface LearningSnapshot {
  topics: SkillTopic[]
  questions: Question[]
  decks: VocabDeck[]
  cards: VocabCard[]
  verbs: VerbEntry[]
  attempts: AttemptLog[]
  taskCompletions: TaskCompletion[]
  writingAttempts: WritingAttempt[]
  readingAttempts: ReadingAttempt[]
  pronunciationAttempts: PronunciationAttempt[]
  generatedReadings: ReadingExercise[]
  settings: UserSettings
}

export interface AiConfig {
  provider: AiProvider
  model: string
  host: string
}

export interface AiReadingRequest {
  level: LearningLevel
  topic: string
  grammarFocus?: string
}

export interface AiPracticeRequest {
  level: LearningLevel
  kind: 'grammar' | 'vocabulary' | 'conjugation'
  focus: string
}

export interface AiPracticeExercise {
  title: string
  instructions: string
  questions: Array<{
    prompt: string
    choices?: string[]
    correctAnswer: string
    explanation: string
  }>
}

export interface CurriculumDossier {
  id: string
  level: CefrLevel
  totemLevel?: string | number
  number: number
  titleFr: string
  titleEn: string
  grammarTopicIds: string[]
  vocabDeckIds: string[]
  verbIds: string[]
  communicativeFunctions: string[]
  phoneticsNotes?: string
}
