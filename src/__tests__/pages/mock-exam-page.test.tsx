import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { MockExamPage } from '@/pages/mock-exam-page'
import { useMockExamStore } from '@/stores/use-mock-exam-store'

import { MC_QUESTIONS, MOCK_CURRICULUM, mockFetchMultiple } from '../helpers/mock-data'
import { mockExamPath, renderWithRoute, ROUTES } from '../helpers/render-with-route'

describe('MockExamPage', () => {
  function renderPage(subjectId = 's1') {
    return renderWithRoute(<MockExamPage />, {
      route: mockExamPath(subjectId),
      path: ROUTES.mockExam,
    })
  }

  function setStartedState() {
    useMockExamStore.setState({
      questions: MC_QUESTIONS,
      answers: {},
      currentIndex: 0,
      remainingSeconds: 50 * 60,
      isStarted: true,
      isFinished: false,
      examId: 'realtor',
      subjectId: 's1',
      subjectName: '부동산학개론',
    })
  }

  beforeEach(() => {
    mockFetchMultiple({
      all_quiz: MC_QUESTIONS,
      curriculum: MOCK_CURRICULUM,
    })
  })

  it('shows loading spinner initially', () => {
    renderPage()
    expect(screen.getByRole('status', { name: '로딩 중' })).toBeInTheDocument()
  })

  it('renders question after exam starts', async () => {
    setStartedState()
    renderPage()

    await waitFor(() => {
      expect(screen.getByText(MC_QUESTIONS[0].content)).toBeInTheDocument()
    })
  })

  it('shows question navigator grid', async () => {
    setStartedState()
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })

    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('shows options for the current question', async () => {
    setStartedState()
    renderPage()

    await waitFor(() => {
      expect(screen.getByText(MC_QUESTIONS[0].options[0])).toBeInTheDocument()
    })

    MC_QUESTIONS[0].options.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument()
    })
  })

  it('selects an answer when clicking an option', async () => {
    const user = userEvent.setup()
    setStartedState()
    renderPage()

    await waitFor(() => {
      expect(screen.getByText(MC_QUESTIONS[0].options[0])).toBeInTheDocument()
    })

    await user.click(screen.getByText(MC_QUESTIONS[0].options[1]))

    const state = useMockExamStore.getState()
    expect(state.answers[MC_QUESTIONS[0].id]).toBe(1)
  })

  it('navigates to next question with 다음 button', async () => {
    const user = userEvent.setup()
    setStartedState()
    renderPage()

    await waitFor(() => {
      expect(screen.getByText(MC_QUESTIONS[0].content)).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: '다음' }))

    await waitFor(() => {
      expect(screen.getByText(MC_QUESTIONS[1].content)).toBeInTheDocument()
    })
  })

  it('disables 이전 button on first question', async () => {
    setStartedState()
    renderPage()

    await waitFor(() => {
      expect(screen.getByText(MC_QUESTIONS[0].content)).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: '이전' })).toBeDisabled()
  })

  it('shows year badge when question has year', async () => {
    setStartedState()
    renderPage()

    await waitFor(() => {
      expect(screen.getByText(`${MC_QUESTIONS[0].year}년`)).toBeInTheDocument()
    })
  })

  it('shows Q badge with question number', async () => {
    setStartedState()
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Q1')).toBeInTheDocument()
    })
  })

  it('shows answered count in submit button', async () => {
    setStartedState()
    useMockExamStore.setState({
      answers: { [MC_QUESTIONS[0].id]: 0 },
    })
    renderPage()

    await waitFor(() => {
      expect(screen.getByText(`제출하기 (1/${MC_QUESTIONS.length} 답변)`)).toBeInTheDocument()
    })
  })

  it('shows empty state when no questions loaded', async () => {
    useMockExamStore.setState({
      questions: [],
      isStarted: true,
      isFinished: false,
    })
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('문제를 불러올 수 없습니다.')).toBeInTheDocument()
    })
  })
})
