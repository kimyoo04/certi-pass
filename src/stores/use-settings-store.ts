import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { STORAGE_KEYS } from '@/constants'

interface SettingsState {
  examDate: string | null // 'YYYY-MM-DD'
  setExamDate: (date: string | null) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      examDate: null,
      setExamDate: (date) => set({ examDate: date }),
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
    },
  ),
)
