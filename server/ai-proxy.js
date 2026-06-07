import 'dotenv/config'
import express from 'express'

const app = express()
const port = Number(process.env.AI_PROXY_PORT ?? 8787)

app.use(express.json({ limit: '2mb' }))

app.get('/api/health', (_request, response) => {
  response.json({ ok: true })
})

app.post('/api/ai/explain', async (request, response) => {
  await handleAiAction(request, response, buildExplainPrompt)
})

app.post('/api/ai/generate-practice', async (request, response) => {
  await handleAiAction(request, response, buildPracticePrompt)
})

app.post('/api/ai/check-sentence', async (request, response) => {
  await handleAiAction(request, response, buildSentenceCheckPrompt)
})

app.post('/api/ai/deck-from-text', async (request, response) => {
  await handleAiAction(request, response, buildDeckPrompt)
})

async function handleAiAction(request, response, promptBuilder) {
  const provider = request.body.provider ?? process.env.AI_PROVIDER ?? 'disabled'
  const model = request.body.model ?? process.env.AI_MODEL
  const ollamaHost = request.body.ollamaHost ?? process.env.OLLAMA_HOST ?? 'http://localhost:11434'

  if (provider === 'disabled') {
    response.status(400).json({ error: 'AI provider is disabled.' })
    return
  }

  try {
    const prompt = promptBuilder(request.body)
    const text = await callProvider({ provider, model, ollamaHost, prompt })
    response.json({ text })
  } catch (error) {
    response.status(502).json({ error: error instanceof Error ? error.message : 'AI provider failed.' })
  }
}

async function callProvider({ provider, model, ollamaHost, prompt }) {
  if (provider === 'ollama') return callOllama({ model: model || 'llama3.1', ollamaHost, prompt })
  if (provider === 'groq') return callGroq({ model: model || 'llama-3.3-70b-versatile', prompt })
  if (provider === 'gemini') return callGemini({ model: model || 'gemini-2.0-flash', prompt })
  throw new Error(`Unsupported provider: ${provider}`)
}

async function callOllama({ model, ollamaHost, prompt }) {
  const response = await fetch(`${ollamaHost.replace(/\/$/, '')}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        { role: 'system', content: frenchTutorSystemPrompt() },
        { role: 'user', content: prompt },
      ],
    }),
  })

  if (!response.ok) throw new Error(`Ollama returned ${response.status}.`)
  const payload = await response.json()
  return payload.message?.content ?? ''
}

async function callGroq({ model, prompt }) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('Missing GROQ_API_KEY in .env.')

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: frenchTutorSystemPrompt() },
        { role: 'user', content: prompt },
      ],
      temperature: 0.4,
    }),
  })

  if (!response.ok) throw new Error(`Groq returned ${response.status}.`)
  const payload = await response.json()
  return payload.choices?.[0]?.message?.content ?? ''
}

async function callGemini({ model, prompt }) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('Missing GEMINI_API_KEY in .env.')

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: frenchTutorSystemPrompt() }],
        },
        contents: [{ parts: [{ text: prompt }] }],
      }),
    },
  )

  if (!response.ok) throw new Error(`Gemini returned ${response.status}.`)
  const payload = await response.json()
  return payload.candidates?.[0]?.content?.parts?.map((part) => part.text).join('\n') ?? ''
}

function frenchTutorSystemPrompt() {
  return [
    'You are a concise French tutor for a personal learning app.',
    'Prefer clear examples, CEFR-aware explanations, and practical corrections.',
    'Do not invent user progress data. Keep responses short unless asked for a drill.',
  ].join(' ')
}

function buildExplainPrompt(body) {
  return body.prompt ?? `Explain this French learning issue: ${body.issue ?? 'a grammar mistake'}`
}

function buildPracticePrompt(body) {
  return [
    `Create five French practice questions for: ${body.topic ?? 'mixed A2 grammar'}.`,
    'Return compact JSON with prompt, answer, and explanation fields.',
  ].join('\n')
}

function buildSentenceCheckPrompt(body) {
  return [
    `Correct this French sentence: ${body.sentence ?? ''}`,
    'Give the corrected sentence and one short reason.',
  ].join('\n')
}

function buildDeckPrompt(body) {
  return [
    'Extract useful French vocabulary cards from this text.',
    'Return compact JSON array with frontFr, backEn, exampleFr, exampleEn, and tags.',
    body.text ?? '',
  ].join('\n')
}

app.listen(port, () => {
  console.log(`AI proxy listening on http://localhost:${port}`)
})
