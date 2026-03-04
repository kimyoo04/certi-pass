import type { Flashcard } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { STORAGE_KEYS } from '@/constants'

// Custom cards keyed by "examId/subjectId"
type CustomCards = Record<string, Flashcard[]>

interface FlashcardState {
  customCards: CustomCards
  addCard: (examId: string, subjectId: string, card: Omit<Flashcard, 'id'>) => void
  deleteCard: (examId: string, subjectId: string, cardId: string) => void
  getCustomCards: (examId: string, subjectId: string) => Flashcard[]
}

export const useFlashcardStore = create<FlashcardState>()(
  persist(
    (set, get) => ({
      customCards: {},

      addCard: (examId, subjectId, card) => {
        const key = `${examId}/${subjectId}`
        const existing = get().customCards[key] ?? []
        const id = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
        set((s) => ({
          customCards: {
            ...s.customCards,
            [key]: [...existing, { ...card, id }],
          },
        }))
      },

      deleteCard: (examId, subjectId, cardId) => {
        const key = `${examId}/${subjectId}`
        const existing = get().customCards[key] ?? []
        set((s) => ({
          customCards: {
            ...s.customCards,
            [key]: existing.filter((c) => c.id !== cardId),
          },
        }))
      },

      getCustomCards: (examId, subjectId) => {
        return get().customCards[`${examId}/${subjectId}`] ?? []
      },
    }),
    {
      name: STORAGE_KEYS.FLASHCARDS,
      partialize: (s) => ({ customCards: s.customCards }),
    },
  ),
)
