import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { updateSM2, type SM2Record } from '@/utils/sm2'
import { STORAGE_KEYS } from '@/constants'

interface SM2State {
  sm2Data: Record<string, SM2Record>
  sm2SortEnabled: boolean

  updateQuestion: (questionId: string, quality: 0 | 1 | 2 | 3 | 4 | 5) => void
  toggleSM2Sort: () => void
}

export const useSM2Store = create<SM2State>()(
  persist(
    (set) => ({
      sm2Data: {},
      sm2SortEnabled: false,

      updateQuestion: (questionId, quality) =>
        set((state) => ({
          sm2Data: {
            ...state.sm2Data,
            [questionId]: updateSM2(state.sm2Data[questionId], quality),
          },
        })),

      toggleSM2Sort: () => set((state) => ({ sm2SortEnabled: !state.sm2SortEnabled })),
    }),
    {
      name: STORAGE_KEYS.SM2,
    },
  ),
)
