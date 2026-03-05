import { screen, waitFor } from '@testing-library/react'

import { DashboardPage } from '@/pages/dashboard-page'
import { useMockExamStore } from '@/stores/use-mock-exam-store'
import { useQuizStore } from '@/stores/use-quiz-store'

import { renderWithRoute } from '../helpers/render-with-route'

const MOCK_CURRICULUM = {
  examId: 'realtor',
  subjects: [
    {
      id: 's1',
      name: '부동산학개론',
      chapters: [{ id: 'all', name: '전체 기출문제' }],
    },
    {
      id: 's2',
      name: '민법 및 민사특별법',
      chapters: [{ id: 'all', name: '전체 기출문제' }],
    },
  ],
}

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: () => Promise.resolve(MOCK_CURRICULUM),
    } as Response)
  })

  function renderDashboard() {
    return renderWithRoute(<DashboardPage />, {
      route: '/exam/realtor/dashboard',
      path: '/exam/:examId/dashboard',
    })
  }

  it('shows loading spinner initially', () => {
    renderDashboard()

    expect(screen.getByText('학습 현황')).toBeInTheDocument()
  })

  it('renders empty state when no progress', async () => {
    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText('아직 풀이한 문제가 없습니다.')).toBeInTheDocument()
    })
  })

  it('shows overall accuracy when progress exists', async () => {
    // Must set full state to work with persist middleware
    useQuizStore.setState(
      {
        questions: [],
        currentIndex: 0,
        selectedAnswer: null,
        showExplanation: false,
        revealedBlanks: {},
        wrongOnlyMode: false,
        shuffleEnabled: false,
        activityLog: {},
        chapterProgress: {
          'realtor/s1/all': {
            correctIds: ['q1', 'q2', 'q3'],
            wrongIds: ['q4'],
            revealedIds: [],
            totalMc: 4,
            totalBlank: 0,
          },
        },
      },
      true,
    )

    renderDashboard()

    await waitFor(() => {
      // 75% appears in overall stats and subject card
      expect(screen.getAllByText('75%').length).toBeGreaterThanOrEqual(1)
    })
  })

  it('shows per-subject stats', async () => {
    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText('과목별 현황')).toBeInTheDocument()
    })
    // Both subjects should render in the list
    expect(screen.getAllByText('부동산학개론')).toHaveLength(1)
    expect(screen.getByText('민법 및 민사특별법')).toBeInTheDocument()
  })

  it('shows weak area when accuracy below 60%', async () => {
    useQuizStore.setState(
      {
        questions: [],
        currentIndex: 0,
        selectedAnswer: null,
        showExplanation: false,
        revealedBlanks: {},
        wrongOnlyMode: false,
        shuffleEnabled: false,
        activityLog: {},
        chapterProgress: {
          'realtor/s1/all': {
            correctIds: ['q1'],
            wrongIds: ['q2', 'q3'],
            revealedIds: [],
            totalMc: 3,
            totalBlank: 0,
          },
        },
      },
      true,
    )

    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText(/약점 과목/)).toBeInTheDocument()
    })
  })

  it('shows recent mock exam history', async () => {
    useMockExamStore.setState({
      examHistory: [
        {
          id: 'exam-1',
          examId: 'realtor',
          subjectId: 's1',
          subjectName: '부동산학개론',
          totalQuestions: 40,
          correctCount: 30,
          timeSpentSeconds: 1800,
          timestamp: Date.now(),
        },
      ],
    })

    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText('최근 모의고사')).toBeInTheDocument()
    })
    expect(screen.getByText(/30\/40/)).toBeInTheDocument()
  })
})
