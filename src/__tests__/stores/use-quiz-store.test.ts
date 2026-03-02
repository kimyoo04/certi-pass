import { useQuizStore } from '@/stores/use-quiz-store'

import { ALL_QUESTIONS } from '../helpers/mock-data'

describe('useQuizStore', () => {
  const chapterKey = 'realtor/sub_1/ch_1'

  describe('setQuestions', () => {
    it('stores questions and resets session state', () => {
      useQuizStore.setState({ currentIndex: 5, selectedAnswer: 2, showExplanation: true })
      useQuizStore.getState().setQuestions(ALL_QUESTIONS)

      const state = useQuizStore.getState()
      expect(state.questions).toEqual(ALL_QUESTIONS)
      expect(state.currentIndex).toBe(0)
      expect(state.selectedAnswer).toBeNull()
      expect(state.showExplanation).toBe(false)
      expect(state.revealedBlanks).toEqual({})
    })
  })

  describe('goToQuestion', () => {
    it('updates index and clears selection', () => {
      useQuizStore.setState({ selectedAnswer: 1, showExplanation: true })
      useQuizStore.getState().goToQuestion(3)

      const state = useQuizStore.getState()
      expect(state.currentIndex).toBe(3)
      expect(state.selectedAnswer).toBeNull()
      expect(state.showExplanation).toBe(false)
    })
  })

  describe('selectAnswer', () => {
    it('sets selected answer and shows explanation', () => {
      useQuizStore.getState().selectAnswer(2)

      const state = useQuizStore.getState()
      expect(state.selectedAnswer).toBe(2)
      expect(state.showExplanation).toBe(true)
    })
  })

  describe('revealBlank', () => {
    it('sets blank to revealed', () => {
      useQuizStore.getState().revealBlank('q_001')
      expect(useQuizStore.getState().revealedBlanks['q_001']).toBe(true)
    })

    it('stays true on second call (idempotent)', () => {
      useQuizStore.getState().revealBlank('q_001')
      useQuizStore.getState().revealBlank('q_001')
      expect(useQuizStore.getState().revealedBlanks['q_001']).toBe(true)
    })
  })

  describe('recordMcAnswer', () => {
    it('records correct answer in correctIds', () => {
      useQuizStore.getState().recordMcAnswer(chapterKey, 'q_004', true, 3)

      const progress = useQuizStore.getState().chapterProgress[chapterKey]
      expect(progress?.correctIds).toContain('q_004')
      expect(progress?.wrongIds).not.toContain('q_004')
    })

    it('records wrong answer in wrongIds', () => {
      useQuizStore.getState().recordMcAnswer(chapterKey, 'q_004', false, 3)

      const progress = useQuizStore.getState().chapterProgress[chapterKey]
      expect(progress?.wrongIds).toContain('q_004')
      expect(progress?.correctIds).not.toContain('q_004')
    })

    it('moves question from wrongIds to correctIds on re-answer', () => {
      useQuizStore.getState().recordMcAnswer(chapterKey, 'q_004', false, 3)
      expect(useQuizStore.getState().chapterProgress[chapterKey]?.wrongIds).toContain('q_004')

      useQuizStore.getState().recordMcAnswer(chapterKey, 'q_004', true, 3)
      const progress = useQuizStore.getState().chapterProgress[chapterKey]
      expect(progress?.correctIds).toContain('q_004')
      expect(progress?.wrongIds).not.toContain('q_004')
    })

    it('moves question from correctIds to wrongIds on re-answer', () => {
      useQuizStore.getState().recordMcAnswer(chapterKey, 'q_004', true, 3)
      useQuizStore.getState().recordMcAnswer(chapterKey, 'q_004', false, 3)

      const progress = useQuizStore.getState().chapterProgress[chapterKey]
      expect(progress?.wrongIds).toContain('q_004')
      expect(progress?.correctIds).not.toContain('q_004')
    })

    it('stores totalMc in progress', () => {
      useQuizStore.getState().recordMcAnswer(chapterKey, 'q_004', true, 5)
      expect(useQuizStore.getState().chapterProgress[chapterKey]?.totalMc).toBe(5)
    })
  })

  describe('recordBlankReveal', () => {
    it('adds questionId to revealedIds', () => {
      useQuizStore.getState().recordBlankReveal(chapterKey, 'q_001', 3)

      const progress = useQuizStore.getState().chapterProgress[chapterKey]
      expect(progress?.revealedIds).toContain('q_001')
    })

    it('does not duplicate on second call (idempotent)', () => {
      useQuizStore.getState().recordBlankReveal(chapterKey, 'q_001', 3)
      useQuizStore.getState().recordBlankReveal(chapterKey, 'q_001', 3)

      const progress = useQuizStore.getState().chapterProgress[chapterKey]
      expect(progress?.revealedIds.filter((id) => id === 'q_001')).toHaveLength(1)
    })

    it('stores totalBlank in progress', () => {
      useQuizStore.getState().recordBlankReveal(chapterKey, 'q_001', 7)
      expect(useQuizStore.getState().chapterProgress[chapterKey]?.totalBlank).toBe(7)
    })
  })

  describe('resetChapterProgress', () => {
    it('removes the chapter key from progress', () => {
      useQuizStore.getState().recordMcAnswer(chapterKey, 'q_004', true, 3)
      expect(useQuizStore.getState().chapterProgress[chapterKey]).toBeDefined()

      useQuizStore.getState().resetChapterProgress(chapterKey)
      expect(useQuizStore.getState().chapterProgress[chapterKey]).toBeUndefined()
    })
  })

  describe('reset', () => {
    it('clears session state but preserves chapterProgress', () => {
      useQuizStore.getState().setQuestions(ALL_QUESTIONS)
      useQuizStore.getState().recordMcAnswer(chapterKey, 'q_004', true, 3)
      useQuizStore.getState().selectAnswer(2)

      useQuizStore.getState().reset()

      const state = useQuizStore.getState()
      expect(state.questions).toEqual([])
      expect(state.currentIndex).toBe(0)
      expect(state.selectedAnswer).toBeNull()
      expect(state.showExplanation).toBe(false)
      expect(state.revealedBlanks).toEqual({})
      // chapterProgress preserved
      expect(state.chapterProgress[chapterKey]).toBeDefined()
    })
  })
})
