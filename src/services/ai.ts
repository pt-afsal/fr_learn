import type {
  AiConfig,
  AiPracticeExercise,
  AiPracticeRequest,
  AiReadingRequest,
  LanguageMode,
  LearningLevel,
  ReadingExercise,
  WritingEvaluation,
} from '../types'

export interface AiExplanation {
  explanation: string
  examples: string[]
  commonMistakes: string[]
  miniQuiz: Array<{ prompt: string; answer: string }>
}

export interface PronunciationFeedback {
  feedback: string
  focusWords: string[]
  practicePhrases: string[]
}

export interface AiStatus {
  ok: boolean
  models: string[]
  selectedModelAvailable: boolean
}

export function aiConfigFromSettings(settings: { aiProvider: 'disabled' | 'ollama'; aiModel: string; ollamaHost: string; ollamaTimeoutMs: number }): AiConfig {
  return { provider: settings.aiProvider, model: settings.aiModel, host: settings.ollamaHost, timeoutMs: settings.ollamaTimeoutMs }
}

export async function testAi(config: AiConfig) {
  assertEnabled(config)
  return post<{ message: string }>('/api/ai/test', config)
}

export async function getAiStatus(config: AiConfig) {
  assertEnabled(config)
  return post<AiStatus>('/api/ai/status', config)
}

export async function explainGrammar(
  config: AiConfig,
  payload: { level: LearningLevel; topic: string; lesson: string; language: LanguageMode },
) {
  assertEnabled(config)
  return post<AiExplanation>('/api/ai/explain', { ...config, ...payload })
}

export async function generateReading(config: AiConfig, request: AiReadingRequest) {
  assertEnabled(config)
  return post<ReadingExercise>('/api/ai/generate-reading', { ...config, ...request })
}

export async function evaluateWriting(
  config: AiConfig,
  payload: { level: LearningLevel; task: string; checklist: string[]; text: string },
) {
  assertEnabled(config)
  return post<WritingEvaluation>('/api/ai/evaluate-writing', { ...config, ...payload })
}

export async function generatePractice(config: AiConfig, request: AiPracticeRequest) {
  assertEnabled(config)
  return post<AiPracticeExercise>('/api/ai/generate-practice', { ...config, ...request })
}

export async function getPronunciationFeedback(
  config: AiConfig,
  expectedText: string,
  recognizedText: string,
) {
  assertEnabled(config)
  return post<PronunciationFeedback>('/api/ai/pronunciation-feedback', { ...config, expectedText, recognizedText })
}

async function post<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await response.json().catch(() => ({ error: 'The local server returned an invalid response.' })) as { error?: string }
  if (!response.ok) throw new Error(data.error ?? `Request failed with HTTP ${response.status}.`)
  return data as T
}

function assertEnabled(config: AiConfig) {
  if (config.provider !== 'ollama') throw new Error('Enable Ollama in Settings before using an AI activity.')
}
