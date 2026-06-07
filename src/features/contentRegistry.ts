import { readingExercises as originalReadingExercises, writingPrompts as originalWritingPrompts } from '../a2B1Curriculum'
import { totemReadingExercises } from '../readingExercises'
import { totemWritingPrompts } from '../writingPrompts'
import type { ReadingExercise, WritingPrompt } from '../types'
import { offlineReadingBank } from './readingBank'

function dedupeById<T extends { id: string }>(items: T[]) {
  return Array.from(new Map(items.map((item) => [item.id, item])).values())
}

export const curatedReadingExercises: ReadingExercise[] = dedupeById([
  ...totemReadingExercises,
  ...originalReadingExercises,
  ...offlineReadingBank,
])

export const curatedWritingPrompts: WritingPrompt[] = dedupeById([
  ...totemWritingPrompts,
  ...originalWritingPrompts,
])
