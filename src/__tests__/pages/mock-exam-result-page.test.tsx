import type { MockExamResult } from '@/types'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { MockExamResultPage } from '@/pages/mock-exam-result-page'
import { useMockExamStore } from '@/stores/use-mock-exam-store'

import { MC_QUESTIONS } from '../helpers/mock-data'
import { mockExamResultPath, renderWithRoute, ROUTES } from '../helpers/render-with-route'

const MOCK_RESULT: MockExamResult = {
  id: 'mock-1',
  examId: 'realtor',
  subjectId: 's1',
  subjectName: '부동산학개론',
  totalQuestions: 3,
  correctCount: 2,
  timeSpentSeconds: 305, // 5분 5초
  timestamp: Date.now(),
  answers: {
    q_004: 4, // correct
    q_005: 0, // correct
    q_006: 0, // wrong (correct is 4)
  },
  questionIds: ['q_004', 'q_005', 'q_006'],
}

describe('MockExamResultPage', () => {
  function renderPage() {
    return renderWithRoute(<MockExamResultPage />, {
      route: mockExamResultPath('s1'),
      path: ROUTES.mockExamResult,
    })
  }

  function setResultState() {
    useMockExamStore.setState({
      questions: MC_QUESTIONS,
      answers: MOCK_RESULT.answers,
      isFinished: true,
      isStarted: false,
      examHistory: [MOCK_RESULT],
    })
  }

  it('shows empty state when no questions', () => {
    renderPage()
    expect(screen.getByText('결과를 불러올 수 없습니다.')).toBeInTheDocument()
  })

  it('shows score percentage', () => {
    setResultState()
    renderPage()
    // 2/3 correct = 67%
    expect(screen.getByText('67%')).toBeInTheDocument()
  })

  it('shows correct count out of total', () => {
    setResultState()
    renderPage()
    expect(screen.getByText('2 / 3 정답')).toBeInTheDocument()
  })

  it('shows pass badge when score >= 60%', () => {
    setResultState()
    renderPage()
    expect(screen.getByText('합격 기준 통과')).toBeInTheDocument()
  })

  it('shows fail badge when score < 60%', () => {
    useMockExamStore.setState({
      questions: MC_QUESTIONS,
      answers: {
        q_004: 0, // wrong
        q_005: 1, // wrong
        q_006: 0, // wrong
      },
      isFinished: true,
      isStarted: false,
      examHistory: [{ ...MOCK_RESULT, correctCount: 0 }],
    })
    renderPage()
    expect(screen.getByText(/합격 기준 미달/)).toBeInTheDocument()
  })

  it('shows time spent', () => {
    setResultState()
    renderPage()
    expect(screen.getByText(/5분 5초/)).toBeInTheDocument()
  })

  it('shows 문제 리뷰 section', () => {
    setResultState()
    renderPage()
    expect(screen.getByText('문제 리뷰')).toBeInTheDocument()
  })

  it('shows O/X marks for correct/incorrect answers', () => {
    setResultState()
    renderPage()

    const oMarks = screen.getAllByText('O')
    const xMarks = screen.getAllByText('X')
    expect(oMarks.length).toBe(2)
    expect(xMarks.length).toBe(1)
  })

  it('expands question detail on click', async () => {
    const user = userEvent.setup()
    setResultState()
    renderPage()

    // Click on first question to expand
    const questionCard = screen.getByText(/Q1\./).closest('[data-slot="card"]')!
    await user.click(questionCard)

    // Should show options after expanding
    await waitFor(() => {
      expect(screen.getByText(/부동성\(위치의 고정성\)/)).toBeInTheDocument()
    })
  })

  it('shows back to subject button', () => {
    setResultState()
    renderPage()
    expect(screen.getByText('과목 선택으로 돌아가기')).toBeInTheDocument()
  })
})
