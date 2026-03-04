import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'

import { useMockExamStore } from '@/stores/use-mock-exam-store'
import { useQuizStore } from '@/stores/use-quiz-store'
import { clearFetchCache } from '@/hooks/use-cached-fetch'

// Mock window.matchMedia for jsdom (used by useTheme)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

beforeEach(() => {
  useQuizStore.setState({
    questions: [],
    currentIndex: 0,
    selectedAnswer: null,
    showExplanation: false,
    revealedBlanks: {},
    wrongOnlyMode: false,
    chapterProgress: {},
    shuffleEnabled: false,
  })
  useMockExamStore.setState({
    questions: [],
    answers: {},
    currentIndex: 0,
    remainingSeconds: 50 * 60,
    isStarted: false,
    isFinished: false,
    examId: '',
    subjectId: '',
    subjectName: '',
    examHistory: [],
  })
  localStorage.clear()
  clearFetchCache()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})
