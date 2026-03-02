import type { ChapterProgress, Question } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { STORAGE_KEYS } from '@/constants'

interface QuizState {
  // Session state (not persisted)
  questions: Question[]
  currentIndex: number
  selectedAnswer: number | null
  showExplanation: boolean
  revealedBlanks: Record<string, boolean>
  wrongOnlyMode: boolean

  // Persisted state
  chapterProgress: Record<string, ChapterProgress>
  shuffleEnabled: boolean

  // Session actions
  setQuestions: (questions: Question[]) => void
  goToQuestion: (index: number) => void
  selectAnswer: (index: number) => void
  revealBlank: (questionId: string) => void
  setWrongOnlyMode: (enabled: boolean) => void
  toggleShuffle: () => void
  reset: () => void

  // Progress actions
  recordMcAnswer: (
    chapterKey: string,
    questionId: string,
    correct: boolean,
    totalMc: number,
  ) => void
  recordBlankReveal: (chapterKey: string, questionId: string, totalBlank: number) => void
  getChapterProgress: (chapterKey: string) => ChapterProgress | undefined
  resetChapterProgress: (chapterKey: string) => void
}

const emptyProgress = (): ChapterProgress => ({
  correctIds: [],
  wrongIds: [],
  revealedIds: [],
  totalMc: 0,
  totalBlank: 0,
})

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      questions: [],
      currentIndex: 0,
      selectedAnswer: null,
      showExplanation: false,
      revealedBlanks: {},
      wrongOnlyMode: false,
      chapterProgress: {},
      shuffleEnabled: false,

      setQuestions: (questions) =>
        set({
          questions,
          currentIndex: 0,
          selectedAnswer: null,
          showExplanation: false,
          revealedBlanks: {},
        }),

      goToQuestion: (index) =>
        set({ currentIndex: index, selectedAnswer: null, showExplanation: false }),

      selectAnswer: (index) => set({ selectedAnswer: index, showExplanation: true }),

      revealBlank: (questionId) =>
        set((state) => ({
          revealedBlanks: {
            ...state.revealedBlanks,
            [questionId]: true,
          },
        })),

      setWrongOnlyMode: (enabled) => set({ wrongOnlyMode: enabled }),

      toggleShuffle: () => set((state) => ({ shuffleEnabled: !state.shuffleEnabled })),

      reset: () =>
        set({
          questions: [],
          currentIndex: 0,
          selectedAnswer: null,
          showExplanation: false,
          revealedBlanks: {},
          wrongOnlyMode: false,
        }),

      recordMcAnswer: (chapterKey, questionId, correct, totalMc) =>
        set((state) => {
          const prev = state.chapterProgress[chapterKey] ?? emptyProgress()
          const correctIds = prev.correctIds.filter((id) => id !== questionId)
          const wrongIds = prev.wrongIds.filter((id) => id !== questionId)
          if (correct) {
            correctIds.push(questionId)
          } else {
            wrongIds.push(questionId)
          }
          return {
            chapterProgress: {
              ...state.chapterProgress,
              [chapterKey]: { ...prev, correctIds, wrongIds, totalMc },
            },
          }
        }),

      recordBlankReveal: (chapterKey, questionId, totalBlank) =>
        set((state) => {
          const prev = state.chapterProgress[chapterKey] ?? emptyProgress()
          const revealedIds = prev.revealedIds.includes(questionId)
            ? prev.revealedIds
            : [...prev.revealedIds, questionId]
          return {
            chapterProgress: {
              ...state.chapterProgress,
              [chapterKey]: { ...prev, revealedIds, totalBlank },
            },
          }
        }),

      getChapterProgress: (chapterKey) => get().chapterProgress[chapterKey],

      resetChapterProgress: (chapterKey) =>
        set((state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [chapterKey]: _, ...rest } = state.chapterProgress
          return { chapterProgress: rest }
        }),
    }),
    {
      name: STORAGE_KEYS.QUIZ,
      partialize: (state) => ({
        chapterProgress: state.chapterProgress,
        shuffleEnabled: state.shuffleEnabled,
      }),
    },
  ),
)
