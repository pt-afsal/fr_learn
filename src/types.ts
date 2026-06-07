export type ViewId =
  | 'dashboard'
  | 'grammar'
  | 'vocabulary'
  | 'conjugation'
  | 'practice'
  | 'studio'
  | 'settings'

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2'
export type LanguageMode = 'en' | 'fr'
export type ItemType = 'grammar' | 'vocabulary' | 'conjugation'
export type QuestionType = 'multiple-choice' | 'fill'
export type AiProvider = 'disabled' | 'ollama' | 'groq' | 'gemini'

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
  currentLevel: CefrLevel
  targetLevel: CefrLevel
  weeklyStudyHours: number
  studyDaysPerWeek: number
  languageMode: LanguageMode
  speechEnabled: boolean
  speechRecognitionEnabled: boolean
  aiProvider: AiProvider
  aiModel: string
  ollamaHost: string
}

export interface LearningSnapshot {
  topics: SkillTopic[]
  questions: Question[]
  decks: VocabDeck[]
  cards: VocabCard[]
  verbs: VerbEntry[]
  attempts: AttemptLog[]
  settings: UserSettings
}

export interface Mission {
  id: string
  type: ItemType
  title: string
  detail: string
  progress: number
  action: string
  targetView: ViewId
}
