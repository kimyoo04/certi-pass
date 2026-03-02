import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { QuizPage } from '@/pages/quiz-page'
import { useQuizStore } from '@/stores/use-quiz-store'

import { MC_QUESTIONS, mockFetch, PROGRESS_MIXED } from '../helpers/mock-data'
import { basePath, chapterKey, renderWithRoute, ROUTES } from '../helpers/render-with-route'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderQuiz(search?: string) {
  return renderWithRoute(<QuizPage />, {
    route: `${basePath()}/quiz`,
    path: ROUTES.quiz,
    search,
  })
}

describe('QuizPage', () => {
  beforeEach(() => {
    mockFetch()
  })

  it('shows loading spinner before data loads', () => {
    vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {}))
    renderQuiz()
    expect(screen.getByText('기출 문제')).toBeInTheDocument()
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('renders first MC question with content, options, year badge, Q badge', async () => {
    renderQuiz()

    await waitFor(() => {
      expect(screen.getByText(MC_QUESTIONS[0].content)).toBeInTheDocument()
    })

    expect(screen.getByText('Q1')).toBeInTheDocument()
    expect(screen.getByText('2023년 기출')).toBeInTheDocument()

    for (const option of MC_QUESTIONS[0].options) {
      expect(screen.getByText(option)).toBeInTheDocument()
    }
  })

  it('shows progress bar and counter in title', async () => {
    renderQuiz()

    await waitFor(() => {
      expect(screen.getByText(`기출 문제 (1/${MC_QUESTIONS.length})`)).toBeInTheDocument()
    })

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('shows correct answer feedback with green highlight', async () => {
    const user = userEvent.setup()
    renderQuiz()

    await waitFor(() => {
      expect(screen.getByText(MC_QUESTIONS[0].content)).toBeInTheDocument()
    })

    const correctOption = screen.getByText(MC_QUESTIONS[0].options[MC_QUESTIONS[0].correctIndex])
    await user.click(correctOption)

    expect(screen.getByText('정답입니다!')).toBeInTheDocument()
    expect(screen.getByText(MC_QUESTIONS[0].explanation)).toBeInTheDocument()
  })

  it('shows wrong answer feedback with red highlight', async () => {
    const user = userEvent.setup()
    renderQuiz()

    await waitFor(() => {
      expect(screen.getByText(MC_QUESTIONS[0].content)).toBeInTheDocument()
    })

    // Select wrong answer (index 0, correct is 4)
    const wrongOption = screen.getByText(MC_QUESTIONS[0].options[0])
    await user.click(wrongOption)

    expect(screen.getByText('오답입니다')).toBeInTheDocument()
  })

  it('disables options after selection', async () => {
    const user = userEvent.setup()
    renderQuiz()

    await waitFor(() => {
      expect(screen.getByText(MC_QUESTIONS[0].content)).toBeInTheDocument()
    })

    await user.click(screen.getByText(MC_QUESTIONS[0].options[0]))

    const optionButtons = MC_QUESTIONS[0].options.map((opt) =>
      screen.getByText(opt).closest('button'),
    )
    for (const btn of optionButtons) {
      expect(btn).toBeDisabled()
    }
  })

  it('records MC answer in store on selection', async () => {
    const user = userEvent.setup()
    renderQuiz()

    await waitFor(() => {
      expect(screen.getByText(MC_QUESTIONS[0].content)).toBeInTheDocument()
    })

    // Select wrong answer
    await user.click(screen.getByText(MC_QUESTIONS[0].options[0]))

    const progress = useQuizStore.getState().chapterProgress[chapterKey()]
    expect(progress?.wrongIds).toContain(MC_QUESTIONS[0].id)
  })

  it("disables '이전 문제' on first question", async () => {
    renderQuiz()

    await waitFor(() => {
      expect(screen.getByText(MC_QUESTIONS[0].content)).toBeInTheDocument()
    })

    expect(screen.getByText('이전 문제')).toBeDisabled()
  })

  it("'다음 문제' advances to next question", async () => {
    const user = userEvent.setup()
    renderQuiz()

    await waitFor(() => {
      expect(screen.getByText(MC_QUESTIONS[0].content)).toBeInTheDocument()
    })

    await user.click(screen.getByText('다음 문제'))

    await waitFor(() => {
      expect(screen.getByText(MC_QUESTIONS[1].content)).toBeInTheDocument()
    })
    expect(screen.getByText('Q2')).toBeInTheDocument()
  })

  it("shows '결과 보기' button on last question after answering", async () => {
    const user = userEvent.setup()
    renderQuiz()

    await waitFor(() => {
      expect(screen.getByText(MC_QUESTIONS[0].content)).toBeInTheDocument()
    })

    // Navigate to last question
    for (let i = 0; i < MC_QUESTIONS.length - 1; i++) {
      await user.click(screen.getByText('다음 문제'))
    }

    // Answer the last question
    await waitFor(() => {
      expect(screen.getByText(MC_QUESTIONS[MC_QUESTIONS.length - 1].content)).toBeInTheDocument()
    })

    await user.click(screen.getByText(MC_QUESTIONS[MC_QUESTIONS.length - 1].options[0]))

    expect(screen.getByText('결과 보기')).toBeInTheDocument()
  })

  it("navigates to result page on '결과 보기' click", async () => {
    const user = userEvent.setup()
    renderQuiz()

    await waitFor(() => {
      expect(screen.getByText(MC_QUESTIONS[0].content)).toBeInTheDocument()
    })

    // Go to last question
    for (let i = 0; i < MC_QUESTIONS.length - 1; i++) {
      await user.click(screen.getByText('다음 문제'))
    }

    await waitFor(() => {
      expect(screen.getByText(MC_QUESTIONS[MC_QUESTIONS.length - 1].content)).toBeInTheDocument()
    })

    await user.click(screen.getByText(MC_QUESTIONS[MC_QUESTIONS.length - 1].options[0]))

    await user.click(screen.getByText('결과 보기'))
    expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('/result?mode=quiz'))
  })

  describe('wrong-only mode', () => {
    it("filters to wrong questions and shows '오답 풀기' title", async () => {
      useQuizStore.setState({
        chapterProgress: { [chapterKey()]: PROGRESS_MIXED },
      })

      renderQuiz('?mode=wrong')

      await waitFor(() => {
        // PROGRESS_MIXED has q_005, q_006 as wrong
        expect(screen.getByText(MC_QUESTIONS[1].content)).toBeInTheDocument()
      })

      expect(screen.getByText(/오답 풀기/)).toBeInTheDocument()
      expect(screen.getByText('오답 복습')).toBeInTheDocument()
    })

    it("shows '오답이 없습니다!' when no wrong answers exist", async () => {
      renderQuiz('?mode=wrong')

      await waitFor(() => {
        expect(screen.getByText('오답이 없습니다!')).toBeInTheDocument()
      })
    })
  })

  describe('wrong-only mode with progress having wrongs', () => {
    it('shows correct filtered count in title', async () => {
      useQuizStore.setState({
        chapterProgress: { [chapterKey()]: PROGRESS_MIXED },
      })

      renderQuiz('?mode=wrong')

      await waitFor(() => {
        expect(screen.getByText(/오답 풀기 \(1\/2\)/)).toBeInTheDocument()
      })
    })
  })

  it('records correct answer in correctIds', async () => {
    const user = userEvent.setup()
    renderQuiz()

    await waitFor(() => {
      expect(screen.getByText(MC_QUESTIONS[0].content)).toBeInTheDocument()
    })

    // Select correct answer
    await user.click(screen.getByText(MC_QUESTIONS[0].options[MC_QUESTIONS[0].correctIndex]))

    const progress = useQuizStore.getState().chapterProgress[chapterKey()]
    expect(progress?.correctIds).toContain(MC_QUESTIONS[0].id)
  })
})
