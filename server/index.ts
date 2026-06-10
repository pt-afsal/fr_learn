import cors from 'cors'
import express, { type Request, type Response } from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'

const app = express()
const port = Number(process.env.PORT ?? 8787)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

app.use(cors({ origin: true }))
app.use(express.json({ limit: '2mb' }))

const aiConfigSchema = z.object({
  provider: z.enum(['ollama', 'groq', 'gemini', 'disabled']).default('ollama'),
  model: z.string().min(1).default('gemma4:e2b-it-q4_K_M'),
  host: z.string().url().optional().default('http://localhost:11434'),
  timeoutMs: z.number().int().min(1000).max(1800000).optional().default(600000),
  groqApiKey: z.string().optional().default(''),
  geminiApiKey: z.string().optional().default(''),
})

const levelSchema = z.enum(['A1', 'A2', 'B1'])

const readingSchema = z.object({
  id: z.string(),
  level: levelSchema,
  title: z.string(),
  theme: z.string(),
  text: z.string(),
  vocabularyHighlights: z.array(z.object({ term: z.string(), meaning: z.string() })).max(8),
  grammarTags: z.array(z.string()).max(6),
  estimatedMinutes: z.number().int().min(5).max(45),
  questions: z.array(z.object({
    id: z.string(),
    prompt: z.string(),
    choices: z.array(z.string()).min(3).max(4),
    correctAnswer: z.string(),
    explanation: z.string(),
  })).min(3).max(5),
})

const writingEvaluationSchema = z.object({
  scores: z.object({
    taskCompletion: z.number().min(0).max(10),
    grammar: z.number().min(0).max(10),
    vocabulary: z.number().min(0).max(10),
    clarity: z.number().min(0).max(10),
  }),
  correctedText: z.string(),
  importantMistakes: z.array(z.object({ original: z.string(), correction: z.string(), explanation: z.string() })).max(6),
  rewritePractice: z.array(z.string()).max(4),
  positiveComment: z.string(),
  recommendedGrammarTopic: z.string(),
})

const explanationSchema = z.object({
  explanation: z.string(),
  examples: z.array(z.string()).min(2).max(5),
  commonMistakes: z.array(z.string()).max(4),
  miniQuiz: z.array(z.object({ prompt: z.string(), answer: z.string() })).max(3),
})

const practiceSchema = z.object({
  title: z.string(),
  instructions: z.string(),
  questions: z.array(z.object({
    prompt: z.string(),
    choices: z.array(z.string()).optional(),
    correctAnswer: z.string(),
    explanation: z.string(),
  })).min(3).max(8),
})

const pronunciationSchema = z.object({
  feedback: z.string(),
  focusWords: z.array(z.string()).max(5),
  practicePhrases: z.array(z.string()).max(4),
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'Flâneur local server' })
})

app.post('/api/ai/status', async (req, res) => {
  const parsed = aiConfigSchema.safeParse(req.body)
  if (!parsed.success) return validationError(res, parsed.error)
  try {
    const { provider, host, model, groqApiKey, geminiApiKey } = parsed.data
    if (provider === 'groq') {
      if (!groqApiKey || !groqApiKey.trim()) {
        return res.json({ ok: false, models: [], selectedModelAvailable: false, error: 'Groq API Key is not set.' })
      }
      const response = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { 'Authorization': `Bearer ${groqApiKey.trim()}` },
        signal: AbortSignal.timeout(8000)
      })
      if (!response.ok) throw new Error(`Groq returned HTTP ${response.status}`)
      const data = await response.json() as { data?: Array<{ id: string }> }
      const models = (data.data ?? []).map((item) => item.id)
      res.json({ ok: true, models, selectedModelAvailable: models.includes(model) })
    } else if (provider === 'gemini') {
      if (!geminiApiKey || !geminiApiKey.trim()) {
        return res.json({ ok: false, models: [], selectedModelAvailable: false, error: 'Gemini API Key is not set.' })
      }
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiApiKey.trim()}`, {
        signal: AbortSignal.timeout(8000)
      })
      if (!response.ok) throw new Error(`Gemini returned HTTP ${response.status}`)
      const data = await response.json() as { models?: Array<{ name: string }> }
      const models = (data.models ?? []).map((item) => item.name.replace(/^models\//, ''))
      res.json({ ok: true, models, selectedModelAvailable: models.includes(model) })
    } else {
      const targetHost = validateHost(host ?? 'http://localhost:11434')
      const response = await fetch(`${targetHost}/api/tags`, { signal: AbortSignal.timeout(8000) })
      if (!response.ok) throw new Error(`Ollama returned HTTP ${response.status}`)
      const result = await response.json() as { models?: Array<{ name?: string; model?: string }> }
      const models = (result.models ?? []).map((item) => item.name ?? item.model).filter(Boolean)
      res.json({ ok: true, models, selectedModelAvailable: models.includes(model) })
    }
  } catch (error) {
    sendAiError(res, error)
  }
})

app.post('/api/ai/test', async (req, res) => {
  const parsed = aiConfigSchema.safeParse(req.body)
  if (!parsed.success) return validationError(res, parsed.error)
  try {
    const output = await callAi(parsed.data, 'Reply with a friendly one-sentence confirmation that the local French-learning assistant is ready.', {
      type: 'object',
      properties: { message: { type: 'string' } },
      required: ['message'],
    })
    res.json(z.object({ message: z.string() }).parse(output))
  } catch (error) {
    sendAiError(res, error)
  }
})

app.post('/api/ai/explain', async (req, res) => {
  const bodySchema = aiConfigSchema.extend({
    level: levelSchema,
    topic: z.string().min(1),
    lesson: z.string().min(1),
    language: z.enum(['en', 'fr']).default('en'),
  })
  const parsed = bodySchema.safeParse(req.body)
  if (!parsed.success) return validationError(res, parsed.error)
  try {
    const { level, topic, lesson, language } = parsed.data
    const prompt = `You are a careful French teacher. Explain the following French grammar lesson for a ${level} learner. Use ${language === 'en' ? 'simple English' : 'simple French'} for explanations. Keep French examples natural and appropriate for ${level}. Do not introduce advanced exceptions unless necessary.\n\nTopic: ${topic}\nLesson: ${lesson}\n\nReturn a concise explanation, 2-5 examples, common mistakes, and a short mini quiz.`
    const output = await callAi(parsed.data, prompt, jsonSchemaForExplanation)
    res.json(explanationSchema.parse(output))
  } catch (error) {
    sendAiError(res, error)
  }
})

app.post('/api/ai/generate-reading', async (req, res) => {
  const bodySchema = aiConfigSchema.extend({
    level: levelSchema,
    topic: z.string().min(1),
    grammarFocus: z.string().optional(),
  })
  const parsed = bodySchema.safeParse(req.body)
  if (!parsed.success) return validationError(res, parsed.error)
  try {
    const { level, topic, grammarFocus } = parsed.data
    const length = level === 'A1' ? '60-100' : level === 'A2' ? '110-180' : '190-280'
    const count = level === 'A1' ? 3 : 4
    const id = `ai-${level.toLowerCase()}-${Date.now()}`
    const prompt = `Create one original French reading-comprehension exercise for a ${level} learner.\nTopic: ${topic}.\nTarget passage length: ${length} words.\n${grammarFocus ? `Use this grammar naturally where appropriate: ${grammarFocus}.` : ''}\nCreate exactly ${count} multiple-choice questions. Each correctAnswer must exactly equal one item in its choices array. Explanations should be short and helpful. Keep all passage and question text in French. Vocabulary meanings can be in English. Use this exact id: ${id}. Set estimatedMinutes appropriately. Return JSON only.`
    const output = await callAi(parsed.data, prompt, jsonSchemaForReading)
    const exercise = readingSchema.parse(output)
    if (exercise.questions.some((question) => !question.choices.includes(question.correctAnswer))) {
      throw new Error('The generated reading exercise contained an invalid answer choice. Generate another exercise or try a different model.')
    }
    res.json({ ...exercise, id, level, generated: true })
  } catch (error) {
    sendAiError(res, error)
  }
})

app.post('/api/ai/evaluate-writing', async (req, res) => {
  const bodySchema = aiConfigSchema.extend({
    level: levelSchema,
    task: z.string().min(1),
    checklist: z.array(z.string()).default([]),
    text: z.string().min(1).max(8000),
  })
  const parsed = bodySchema.safeParse(req.body)
  if (!parsed.success) return validationError(res, parsed.error)
  try {
    const { level, task, checklist, text } = parsed.data
    const prompt = `You are a supportive French writing teacher evaluating a ${level} learner. Correct the student's response without rewriting it into advanced French. Preserve the student's meaning and keep corrections appropriate for ${level}. Score each category from 0 to 10. Mention at most six important mistakes. Give short explanations in English. Provide up to four rewrite-practice sentences.\n\nTask: ${task}\nChecklist: ${checklist.join('; ')}\nStudent text:\n${text}`
    const output = await callAi(parsed.data, prompt, jsonSchemaForWriting)
    res.json(writingEvaluationSchema.parse(output))
  } catch (error) {
    sendAiError(res, error)
  }
})

app.post('/api/ai/generate-practice', async (req, res) => {
  const bodySchema = aiConfigSchema.extend({
    level: levelSchema,
    kind: z.enum(['grammar', 'vocabulary', 'conjugation']),
    focus: z.string().min(1),
  })
  const parsed = bodySchema.safeParse(req.body)
  if (!parsed.success) return validationError(res, parsed.error)
  try {
    const { level, kind, focus } = parsed.data
    const prompt = `Create a short ${kind} practice set for a French learner at ${level}. Focus: ${focus}. Create 5 questions. Keep explanations in simple English. When using choices, ensure the correct answer exactly matches one choice. Return JSON only.`
    const output = await callAi(parsed.data, prompt, jsonSchemaForPractice)
    res.json(practiceSchema.parse(output))
  } catch (error) {
    sendAiError(res, error)
  }
})

app.post('/api/ai/pronunciation-feedback', async (req, res) => {
  const bodySchema = aiConfigSchema.extend({
    expectedText: z.string().min(1),
    recognizedText: z.string().min(1),
  })
  const parsed = bodySchema.safeParse(req.body)
  if (!parsed.success) return validationError(res, parsed.error)
  try {
    const { expectedText, recognizedText } = parsed.data
    const prompt = `A French learner read a sentence aloud. Speech-to-text returned a transcription. Compare the expected and recognized texts. Explain likely pronunciation areas to practise, while clearly noting that transcription comparison is only an approximation and not a phonetic diagnosis. Give practical advice in English.\nExpected: ${expectedText}\nRecognized: ${recognizedText}`
    const output = await callAi(parsed.data, prompt, jsonSchemaForPronunciation)
    res.json(pronunciationSchema.parse(output))
  } catch (error) {
    sendAiError(res, error)
  }
})

const dist = path.join(root, 'dist')
app.use(express.static(dist))
app.use((_req, res) => {
  res.sendFile(path.join(dist, 'index.html'), (error) => {
    if (error) res.status(404).send('Build not found. Run npm run build, or use npm run dev during development.')
  })
})

app.listen(port, () => {
  console.log(`Flâneur server listening on http://localhost:${port}`)
})

async function callAi(
  config: z.infer<typeof aiConfigSchema>,
  prompt: string,
  format: Record<string, unknown>,
): Promise<unknown> {
  const { provider, model, host, timeoutMs, groqApiKey, geminiApiKey } = config

  if (provider === 'groq') {
    if (!groqApiKey || !groqApiKey.trim()) {
      throw new Error('Groq API Key is not configured. Please set it in Settings.')
    }
    const finalPrompt = `${prompt}\n\nYou MUST respond with valid JSON matching this schema:\n${JSON.stringify(format, null, 2)}`
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey.trim()}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: finalPrompt }],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
      signal: AbortSignal.timeout(timeoutMs ?? 60000),
    })
    if (!response.ok) {
      const detail = await response.text()
      throw new Error(`Groq returned HTTP ${response.status}: ${detail.slice(0, 300)}`)
    }
    const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> }
    const content = data.choices?.[0]?.message?.content
    if (!content) throw new Error('Groq returned an empty response.')
    try {
      return JSON.parse(content)
    } catch {
      throw new Error('The Groq model response was not valid JSON. Try again or select another model.')
    }
  }

  if (provider === 'gemini') {
    if (!geminiApiKey || !geminiApiKey.trim()) {
      throw new Error('Gemini API Key is not configured. Please set it in Settings.')
    }
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey.trim()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: format,
          temperature: 0.3,
        },
      }),
      signal: AbortSignal.timeout(timeoutMs ?? 60000),
    })
    if (!response.ok) {
      const detail = await response.text()
      throw new Error(`Gemini returned HTTP ${response.status}: ${detail.slice(0, 300)}`)
    }
    const data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!content) throw new Error('Gemini returned an empty response.')
    try {
      return JSON.parse(content)
    } catch {
      throw new Error('The Gemini model response was not valid JSON. Try again or select another model.')
    }
  }

  const finalHost = validateHost(host ?? 'http://localhost:11434')
  const response = await fetch(`${finalHost}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      think: false,
      format,
      options: { temperature: 0.3 },
    }),
    signal: AbortSignal.timeout(timeoutMs ?? 600000),
  })
  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`Ollama returned HTTP ${response.status}: ${detail.slice(0, 300)}`)
  }
  const data = await response.json() as { response?: string }
  if (!data.response) throw new Error('Ollama returned an empty response.')
  try {
    return JSON.parse(data.response) as unknown
  } catch {
    throw new Error('The model response was not valid JSON. Try again or select another Ollama model.')
  }
}

function validateHost(rawHost: string) {
  const host = rawHost.replace(/\/$/, '')
  const url = new URL(host)
  const localNames = new Set(['localhost', '127.0.0.1', '::1'])
  if (!localNames.has(url.hostname) && process.env.ALLOW_REMOTE_OLLAMA !== 'true') {
    throw new Error('For safety, the bundled server accepts local Ollama hosts only. Set ALLOW_REMOTE_OLLAMA=true to use a trusted remote host.')
  }
  return host
}

function validationError(res: Response, error: z.ZodError) {
  return res.status(400).json({ ok: false, error: 'Invalid request.', details: error.flatten() })
}

function sendAiError(res: Response, error: unknown) {
  const rawMessage = error instanceof Error ? error.message : 'Unknown AI error.'
  let message = rawMessage
  if (rawMessage === 'fetch failed') {
    message = 'Network request failed. Please check your internet connection or local settings.'
  }
  res.status(502).json({ ok: false, error: message })
}

const jsonSchemaForExplanation = {
  type: 'object',
  properties: {
    explanation: { type: 'string' },
    examples: { type: 'array', items: { type: 'string' } },
    commonMistakes: { type: 'array', items: { type: 'string' } },
    miniQuiz: { type: 'array', items: { type: 'object', properties: { prompt: { type: 'string' }, answer: { type: 'string' } }, required: ['prompt', 'answer'] } },
  },
  required: ['explanation', 'examples', 'commonMistakes', 'miniQuiz'],
}

const jsonSchemaForReading = {
  type: 'object',
  properties: {
    id: { type: 'string' }, level: { type: 'string', enum: ['A1', 'A2', 'B1'] }, title: { type: 'string' }, theme: { type: 'string' }, text: { type: 'string' }, estimatedMinutes: { type: 'integer' },
    vocabularyHighlights: { type: 'array', items: { type: 'object', properties: { term: { type: 'string' }, meaning: { type: 'string' } }, required: ['term', 'meaning'] } },
    grammarTags: { type: 'array', items: { type: 'string' } },
    questions: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, prompt: { type: 'string' }, choices: { type: 'array', items: { type: 'string' } }, correctAnswer: { type: 'string' }, explanation: { type: 'string' } }, required: ['id', 'prompt', 'choices', 'correctAnswer', 'explanation'] } },
  },
  required: ['id', 'level', 'title', 'theme', 'text', 'vocabularyHighlights', 'grammarTags', 'estimatedMinutes', 'questions'],
}

const jsonSchemaForWriting = {
  type: 'object',
  properties: {
    scores: { type: 'object', properties: { taskCompletion: { type: 'number' }, grammar: { type: 'number' }, vocabulary: { type: 'number' }, clarity: { type: 'number' } }, required: ['taskCompletion', 'grammar', 'vocabulary', 'clarity'] },
    correctedText: { type: 'string' },
    importantMistakes: { type: 'array', items: { type: 'object', properties: { original: { type: 'string' }, correction: { type: 'string' }, explanation: { type: 'string' } }, required: ['original', 'correction', 'explanation'] } },
    rewritePractice: { type: 'array', items: { type: 'string' } },
    positiveComment: { type: 'string' }, recommendedGrammarTopic: { type: 'string' },
  },
  required: ['scores', 'correctedText', 'importantMistakes', 'rewritePractice', 'positiveComment', 'recommendedGrammarTopic'],
}

const jsonSchemaForPractice = {
  type: 'object',
  properties: {
    title: { type: 'string' }, instructions: { type: 'string' },
    questions: { type: 'array', items: { type: 'object', properties: { prompt: { type: 'string' }, choices: { type: 'array', items: { type: 'string' } }, correctAnswer: { type: 'string' }, explanation: { type: 'string' } }, required: ['prompt', 'correctAnswer', 'explanation'] } },
  },
  required: ['title', 'instructions', 'questions'],
}

const jsonSchemaForPronunciation = {
  type: 'object',
  properties: { feedback: { type: 'string' }, focusWords: { type: 'array', items: { type: 'string' } }, practicePhrases: { type: 'array', items: { type: 'string' } } },
  required: ['feedback', 'focusWords', 'practicePhrases'],
}
