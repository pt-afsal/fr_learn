import type { VocabCard, VocabDeck, VerbEntry } from './types'

export interface ParsedVocabRow {
  frontFr: string
  backEn: string
  exampleFr?: string
  exampleEn?: string
  gender?: VocabCard['gender']
  notes?: string
  tags: string[]
}

export interface MatchPair {
  prompt: string
  answer: string
  cardId: string
}

export interface ConjugationRound {
  verb: VerbEntry
  tense: string
  person: string
  correct: string
  prompt: string
  choices: string[]
}

export function createPersonalDeck(
  title: string,
  description: string,
  level: VocabDeck['level'],
  tags: string[],
): VocabDeck {
  return {
    id: `deck-${crypto.randomUUID()}`,
    title: title.trim(),
    description: description.trim() || 'Personal study set.',
    level,
    tags,
    source: 'personal',
  }
}

export function createPersonalCards(deckId: string, rows: ParsedVocabRow[]): VocabCard[] {
  const dueAt = new Date().toISOString()
  return rows.map((row) => ({
    id: `card-${crypto.randomUUID()}`,
    deckId,
    frontFr: row.frontFr.trim(),
    backEn: row.backEn.trim(),
    exampleFr: row.exampleFr?.trim() || `Je revise : ${row.frontFr.trim()}.`,
    exampleEn: row.exampleEn?.trim() || `Review: ${row.backEn.trim()}.`,
    gender: row.gender,
    notes: row.notes?.trim() || '',
    tags: row.tags,
    confidence: 0,
    dueAt,
    intervalDays: 1,
  }))
}

export function parseVocabCsv(text: string): ParsedVocabRow[] {
  const rows = parseCsv(text).filter((row) => row.some((cell) => cell.trim()))
  if (!rows.length) return []

  const normalizedHeader = rows[0].map(normalizeHeader)
  const hasHeader = normalizedHeader.includes('frontfr') || normalizedHeader.includes('french') || normalizedHeader.includes('backen') || normalizedHeader.includes('english')
  const body = hasHeader ? rows.slice(1) : rows

  return body
    .map((row) => {
      if (hasHeader) {
        const map = Object.fromEntries(normalizedHeader.map((key, index) => [key, row[index]?.trim() ?? '']))
        return {
          frontFr: map.frontfr || map.french || map.term || '',
          backEn: map.backen || map.english || map.translation || '',
          exampleFr: map.examplefr || map.sentencefr || map.frexample || '',
          exampleEn: map.exampleen || map.sentenceen || map.enexample || '',
          gender: normalizeGender(map.gender),
          notes: map.notes || '',
          tags: splitTags(map.tags || map.tag || ''),
        }
      }

      return {
        frontFr: row[0]?.trim() ?? '',
        backEn: row[1]?.trim() ?? '',
        exampleFr: row[2]?.trim() ?? '',
        exampleEn: row[3]?.trim() ?? '',
        gender: normalizeGender(row[4]),
        notes: row[5]?.trim() ?? '',
        tags: splitTags(row[6] ?? ''),
      }
    })
    .filter((row) => row.frontFr && row.backEn)
}

export function shuffle<T>(items: T[]): T[] {
  const next = [...items]
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
  }
  return next
}

export function buildMatchPairs(cards: VocabCard[], count = 6): MatchPair[] {
  return shuffle(cards)
    .slice(0, count)
    .map((card) => ({ prompt: card.frontFr, answer: card.backEn, cardId: card.id }))
}

export function buildConjugationRounds(
  verbs: VerbEntry[],
  roundCount: number,
  tenseFilter: string,
  mode: 'write' | 'multiple-choice',
): ConjugationRound[] {
  const persons = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles']
  const pool = shuffle(verbs).flatMap((verb) => {
    const tenses = Object.keys(verb.conjugations).filter((tense) => tenseFilter === 'all' || tense === tenseFilter)
    return tenses.flatMap((tense) =>
      persons.flatMap((person) => {
        const correct = verb.conjugations[tense]?.[person]
        return correct
          ? [{ verb, tense, person, correct, prompt: `${person} ${verb.infinitive}` }]
          : []
      }),
    )
  })

  return shuffle(pool).slice(0, roundCount).map((round) => ({
    ...round,
    choices: mode === 'multiple-choice' ? buildChoices(round.verb, round.tense, round.person, round.correct, pool) : [],
  }))
}

function buildChoices(
  verb: VerbEntry,
  tense: string,
  person: string,
  answer: string,
  pool: Array<{ verb: VerbEntry; tense: string; person: string; correct: string }>,
) {
  const sameTenseForms = [
    ...new Set(
      Object.entries(verb.conjugations[tense] ?? {})
        .filter(([currentPerson, value]) => currentPerson !== person && value && normalizeLoose(value) !== normalizeLoose(answer))
        .map(([, value]) => value as string),
    ),
  ]

  const sameVerbForms = [
    ...new Set(
      Object.entries(verb.conjugations)
        .flatMap(([currentTense, forms]) =>
          Object.entries(forms ?? {})
            .filter(([currentPerson, value]) =>
              (currentTense !== tense || currentPerson !== person) &&
              value &&
              normalizeLoose(value) !== normalizeLoose(answer),
            )
            .map(([, value]) => value as string),
        ),
    ),
  ]

  const fallbackForms = [
    ...new Set(
      pool
        .filter((item) => normalizeLoose(item.correct) !== normalizeLoose(answer))
        .map((item) => item.correct),
    ),
  ]

  const distractors = [...shuffle(sameTenseForms), ...shuffle(sameVerbForms), ...shuffle(fallbackForms)]
    .filter((value, index, items) => items.findIndex((item) => normalizeLoose(item) === normalizeLoose(value)) === index)
    .slice(0, 3)

  return shuffle([answer, ...distractors])
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let value = ''
  let quoted = false

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    const next = text[index + 1]

    if (char === '"') {
      if (quoted && next === '"') {
        value += '"'
        index += 1
      } else {
        quoted = !quoted
      }
      continue
    }

    if (char === ',' && !quoted) {
      row.push(value)
      value = ''
      continue
    }

    if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') index += 1
      row.push(value)
      rows.push(row)
      row = []
      value = ''
      continue
    }

    value += char
  }

  if (value || row.length) {
    row.push(value)
    rows.push(row)
  }

  return rows
}

function normalizeHeader(value: string) {
  return value.toLowerCase().replace(/[^a-z]/g, '')
}

function splitTags(value: string) {
  return value
    .split(/[|;]+|,\s*/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function normalizeGender(value?: string) {
  if (!value) return undefined
  const normalized = value.trim().toLowerCase()
  if (normalized === 'm' || normalized === 'f' || normalized === 'm/f') return normalized as VocabCard['gender']
  return undefined
}

function normalizeLoose(value: string) {
  return value.trim().toLocaleLowerCase('fr-FR')
}
