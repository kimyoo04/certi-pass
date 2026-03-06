// ─── Storage Keys (Zustand persist + localStorage) ───────────────────────────

export const STORAGE_KEYS = {
  QUIZ: 'certipass-quiz',
  TREE: 'certipass-tree',
  CLASSIFY: 'certipass-classify',
  QUESTION_EDITS: 'certipass-question-edits',
  BOOKMARKS: 'certipass-bookmarks',
  MOCK_EXAM: 'certipass-mock-exam',
  THEME: 'certipass-theme',
  FLASHCARDS: 'certipass-flashcards',
  SM2: 'certipass-sm2',
  SETTINGS: 'certipass-settings',
} as const

// ─── Exam Configuration ──────────────────────────────────────────────────────

const SMALL_SUBJECT_IDS = new Set(['s4', 's6'])

export const EXAM_CONFIG = {
  SMALL: {
    questionsPerExam: 20,
    durationSeconds: 25 * 60,
    durationMinutes: 25,
  },
  NORMAL: {
    questionsPerExam: 40,
    durationSeconds: 50 * 60,
    durationMinutes: 50,
  },
} as const

export const MAX_EXAM_HISTORY = 50
export const PASSING_SCORE_PERCENT = 60

export function getExamConfig(subjectId: string) {
  const isSmall = SMALL_SUBJECT_IDS.has(subjectId)
  return isSmall ? EXAM_CONFIG.SMALL : EXAM_CONFIG.NORMAL
}

// ─── Data File Paths ─────────────────────────────────────────────────────────

const BASE_DATA_URL = `${import.meta.env.BASE_URL}data`

export const DATA_PATHS = {
  EXAMS: `${BASE_DATA_URL}/exams.json`,
  CURRICULUM: (examId: string) => `${BASE_DATA_URL}/${examId}/curriculum.json`,
  CHAPTER_QUIZ: (examId: string, subjectId: string, chapterId: string) =>
    `${BASE_DATA_URL}/${examId}/${subjectId}/${chapterId}_quiz.json`,
  ALL_QUIZ: (examId: string, subjectId: string) =>
    `${BASE_DATA_URL}/${examId}/${subjectId}/all_quiz.json`,
  QUESTION_TREE_MAP: (examId: string, subjectId: string) =>
    `${BASE_DATA_URL}/${examId}/${subjectId}/question_tree_map.json`,
  FLASHCARDS: (examId: string, subjectId: string) =>
    `${BASE_DATA_URL}/${examId}/${subjectId}/flashcards.json`,
  OX_QUIZ: (examId: string, subjectId: string) =>
    `${BASE_DATA_URL}/${examId}/${subjectId}/ox_quiz.json`,
} as const

// ─── Query Parameter Modes ───────────────────────────────────────────────────

export const QUERY_MODES = {
  WRONG: 'wrong',
  BOOKMARK: 'bookmark',
  QUIZ: 'quiz',
  BLANK: 'blank',
} as const

// ─── Question Types ──────────────────────────────────────────────────────────

export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  FILL_IN_THE_BLANK: 'fill_in_the_blank',
  OX_QUIZ: 'ox_quiz',
} as const
