import type { MultipleChoiceQuestion } from '@/types'

import { useMockExamStore } from '@/stores/use-mock-exam-store'

function makeMcQuestions(count: number): MultipleChoiceQuestion[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `q_${String(i).padStart(3, '0')}`,
    type: 'multiple_choice' as const,
    year: 2024,
    content: `Question ${i}`,
    options: ['A', 'B', 'C', 'D'],
    correctIndex: i % 4,
    explanation: `Explanation ${i}`,
  }))
}

describe('useMockExamStore', () => {
  const allQuestions = makeMcQuestions(100)

  describe('startExam', () => {
    it('selects 40 questions and resets session', () => {
      useMockExamStore.getState().startExam('realtor', 's1', '부동산학개론', allQuestions)

      const state = useMockExamStore.getState()
      expect(state.questions).toHaveLength(40)
      expect(state.isStarted).toBe(true)
      expect(state.isFinished).toBe(false)
      expect(state.currentIndex).toBe(0)
      expect(state.remainingSeconds).toBe(50 * 60)
      expect(Object.keys(state.answers)).toHaveLength(0)
    })

    it('shuffles questions (not same order as input)', () => {
      useMockExamStore.getState().startExam('realtor', 's1', '부동산학개론', allQuestions)
      const ids = useMockExamStore.getState().questions.map((q) => q.id)
      const firstForty = allQuestions.slice(0, 40).map((q) => q.id)
      // Very unlikely to be identical after shuffle
      expect(ids).not.toEqual(firstForty)
    })
  })

  describe('selectAnswer', () => {
    it('stores answer for question', () => {
      useMockExamStore.getState().startExam('realtor', 's1', 'test', allQuestions)
      const qId = useMockExamStore.getState().questions[0].id

      useMockExamStore.getState().selectAnswer(qId, 2)
      expect(useMockExamStore.getState().answers[qId]).toBe(2)
    })

    it('overwrites previous answer', () => {
      useMockExamStore.getState().startExam('realtor', 's1', 'test', allQuestions)
      const qId = useMockExamStore.getState().questions[0].id

      useMockExamStore.getState().selectAnswer(qId, 1)
      useMockExamStore.getState().selectAnswer(qId, 3)
      expect(useMockExamStore.getState().answers[qId]).toBe(3)
    })
  })

  describe('goToQuestion', () => {
    it('updates current index', () => {
      useMockExamStore.getState().startExam('realtor', 's1', 'test', allQuestions)
      useMockExamStore.getState().goToQuestion(5)
      expect(useMockExamStore.getState().currentIndex).toBe(5)
    })
  })

  describe('tick', () => {
    it('decrements remaining seconds', () => {
      useMockExamStore.getState().startExam('realtor', 's1', 'test', allQuestions)
      const before = useMockExamStore.getState().remainingSeconds
      useMockExamStore.getState().tick()
      expect(useMockExamStore.getState().remainingSeconds).toBe(before - 1)
    })

    it('does not go below 0', () => {
      useMockExamStore.setState({ remainingSeconds: 0 })
      useMockExamStore.getState().tick()
      expect(useMockExamStore.getState().remainingSeconds).toBe(0)
    })
  })

  describe('finishExam', () => {
    it('creates result with correct count and adds to history', () => {
      useMockExamStore.getState().startExam('realtor', 's1', '부동산학개론', allQuestions)
      const questions = useMockExamStore.getState().questions

      // Answer first 3 correctly
      for (let i = 0; i < 3; i++) {
        useMockExamStore.getState().selectAnswer(questions[i].id, questions[i].correctIndex)
      }
      // Answer 4th incorrectly
      useMockExamStore.getState().selectAnswer(questions[3].id, (questions[3].correctIndex + 1) % 4)

      const result = useMockExamStore.getState().finishExam()

      expect(result.correctCount).toBe(3)
      expect(result.totalQuestions).toBe(40)
      expect(result.subjectName).toBe('부동산학개론')
      expect(useMockExamStore.getState().isFinished).toBe(true)
      expect(useMockExamStore.getState().isStarted).toBe(false)
      expect(useMockExamStore.getState().examHistory).toHaveLength(1)
      expect(useMockExamStore.getState().examHistory[0].id).toBe(result.id)
    })

    it('limits history to 50 entries', () => {
      // Pre-fill 50 entries
      const fakeHistory = Array.from({ length: 50 }, (_, i) => ({
        id: `mock-${i}`,
        examId: 'realtor',
        subjectId: 's1',
        subjectName: 'test',
        totalQuestions: 40,
        correctCount: 20,
        timeSpentSeconds: 1800,
        timestamp: i,
        answers: {},
        questionIds: [],
      }))
      useMockExamStore.setState({ examHistory: fakeHistory })

      useMockExamStore.getState().startExam('realtor', 's1', 'test', allQuestions)
      useMockExamStore.getState().finishExam()

      expect(useMockExamStore.getState().examHistory).toHaveLength(50)
    })
  })

  describe('resetSession', () => {
    it('clears session state but preserves history', () => {
      useMockExamStore.getState().startExam('realtor', 's1', 'test', allQuestions)
      useMockExamStore.getState().finishExam()
      const historyCount = useMockExamStore.getState().examHistory.length

      useMockExamStore.getState().resetSession()

      const state = useMockExamStore.getState()
      expect(state.questions).toHaveLength(0)
      expect(state.isStarted).toBe(false)
      expect(state.isFinished).toBe(false)
      expect(state.examHistory).toHaveLength(historyCount)
    })
  })
})
