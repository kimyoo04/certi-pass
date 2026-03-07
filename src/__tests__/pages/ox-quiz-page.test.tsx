import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { OXQuizPage } from '@/pages/ox-quiz-page'

import { OX_QUESTIONS } from '../helpers/mock-data'
import { oxQuizPath, renderWithRoute, ROUTES } from '../helpers/render-with-route'

function mockFetchOX() {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    json: () => Promise.resolve(OX_QUESTIONS),
  } as Response)
}

function renderOXQuiz() {
  return renderWithRoute(<OXQuizPage />, {
    route: oxQuizPath('s1'),
    path: ROUTES.oxQuiz,
  })
}

describe('OXQuizPage', () => {
  beforeEach(() => {
    mockFetchOX()
  })

  it('shows loading spinner before data loads', () => {
    vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {}))
    renderOXQuiz()
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('renders first question statement after loading', async () => {
    renderOXQuiz()

    await waitFor(() => {
      expect(screen.getByText(OX_QUESTIONS[0].statement)).toBeInTheDocument()
    })
  })

  it('shows counter in title', async () => {
    renderOXQuiz()

    await waitFor(() => {
      expect(screen.getByText(`OX 퀴즈 (1/${OX_QUESTIONS.length})`)).toBeInTheDocument()
    })
  })

  it('shows progress bar', async () => {
    renderOXQuiz()

    await waitFor(() => {
      expect(screen.getByText(OX_QUESTIONS[0].statement)).toBeInTheDocument()
    })

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('shows O and X buttons', async () => {
    renderOXQuiz()

    await waitFor(() => {
      expect(screen.getByText(OX_QUESTIONS[0].statement)).toBeInTheDocument()
    })

    expect(screen.getByText('O')).toBeInTheDocument()
    expect(screen.getByText('X')).toBeInTheDocument()
  })

  it('shows correct feedback when answering correctly (O for true)', async () => {
    const user = userEvent.setup()
    renderOXQuiz()

    await waitFor(() => {
      expect(screen.getByText(OX_QUESTIONS[0].statement)).toBeInTheDocument()
    })

    // First question answer is true → click O
    await user.click(screen.getByText('O'))

    await waitFor(() => {
      expect(screen.getByText('✓ 정답입니다!')).toBeInTheDocument()
    })
  })

  it('shows wrong feedback when answering incorrectly', async () => {
    const user = userEvent.setup()
    renderOXQuiz()

    await waitFor(() => {
      expect(screen.getByText(OX_QUESTIONS[0].statement)).toBeInTheDocument()
    })

    // First question answer is true → click X (wrong)
    await user.click(screen.getByText('X'))

    await waitFor(() => {
      expect(screen.getByText(/✗ 오답!/)).toBeInTheDocument()
    })
  })

  it('shows explanation after answering', async () => {
    const user = userEvent.setup()
    renderOXQuiz()

    await waitFor(() => {
      expect(screen.getByText(OX_QUESTIONS[0].statement)).toBeInTheDocument()
    })

    await user.click(screen.getByText('O'))

    await waitFor(() => {
      expect(screen.getByText(OX_QUESTIONS[0].explanation)).toBeInTheDocument()
    })
  })

  it('shows 다음 문제 button after answering', async () => {
    const user = userEvent.setup()
    renderOXQuiz()

    await waitFor(() => {
      expect(screen.getByText(OX_QUESTIONS[0].statement)).toBeInTheDocument()
    })

    await user.click(screen.getByText('O'))

    await waitFor(() => {
      expect(screen.getByText('다음 문제')).toBeInTheDocument()
    })
  })

  it('O and X buttons are disabled after answering', async () => {
    const user = userEvent.setup()
    renderOXQuiz()

    await waitFor(() => {
      expect(screen.getByText(OX_QUESTIONS[0].statement)).toBeInTheDocument()
    })

    await user.click(screen.getByText('O'))

    await waitFor(() => {
      expect(screen.getByText('O')).toBeDisabled()
      expect(screen.getByText('X')).toBeDisabled()
    })
  })

  it('navigates to next question after clicking 다음 문제', async () => {
    const user = userEvent.setup()
    renderOXQuiz()

    await waitFor(() => {
      expect(screen.getByText(OX_QUESTIONS[0].statement)).toBeInTheDocument()
    })

    await user.click(screen.getByText('O'))
    await waitFor(() => expect(screen.getByText('다음 문제')).toBeInTheDocument())
    await user.click(screen.getByText('다음 문제'))

    await waitFor(() => {
      expect(screen.getByText(OX_QUESTIONS[1].statement)).toBeInTheDocument()
    })
    expect(screen.getByText(`OX 퀴즈 (2/${OX_QUESTIONS.length})`)).toBeInTheDocument()
  })

  it('shows 결과 보기 button on last question', async () => {
    const user = userEvent.setup()
    renderOXQuiz()

    // Navigate to last question
    for (let i = 0; i < OX_QUESTIONS.length - 1; i++) {
      await waitFor(() => expect(screen.getByText(OX_QUESTIONS[i].statement)).toBeInTheDocument())
      await user.click(screen.getByText('O'))
      await waitFor(() => expect(screen.getByText('다음 문제')).toBeInTheDocument())
      await user.click(screen.getByText('다음 문제'))
    }

    // Last question: answer it
    await waitFor(() =>
      expect(screen.getByText(OX_QUESTIONS[OX_QUESTIONS.length - 1].statement)).toBeInTheDocument(),
    )
    await user.click(screen.getByText('O'))

    await waitFor(() => {
      expect(screen.getByText('결과 보기')).toBeInTheDocument()
    })
  })

  it('shows result screen with accuracy after completing all questions', async () => {
    const user = userEvent.setup()
    renderOXQuiz()

    for (let i = 0; i < OX_QUESTIONS.length - 1; i++) {
      await waitFor(() => expect(screen.getByText(OX_QUESTIONS[i].statement)).toBeInTheDocument())
      await user.click(screen.getByText('O'))
      await waitFor(() => expect(screen.getByText('다음 문제')).toBeInTheDocument())
      await user.click(screen.getByText('다음 문제'))
    }

    await waitFor(() =>
      expect(screen.getByText(OX_QUESTIONS[OX_QUESTIONS.length - 1].statement)).toBeInTheDocument(),
    )
    await user.click(screen.getByText('O'))
    await waitFor(() => expect(screen.getByText('결과 보기')).toBeInTheDocument())
    await user.click(screen.getByText('결과 보기'))

    await waitFor(() => {
      expect(screen.getByText('다시 풀기')).toBeInTheDocument()
      expect(screen.getByText(/%/)).toBeInTheDocument()
    })
  })

  it('tracks correct and wrong counts in stats', async () => {
    const user = userEvent.setup()
    renderOXQuiz()

    await waitFor(() => {
      expect(screen.getByText(OX_QUESTIONS[0].statement)).toBeInTheDocument()
    })

    // Initially 0 / 0
    expect(screen.getByText('✓ 0')).toBeInTheDocument()
    expect(screen.getByText('✗ 0')).toBeInTheDocument()

    // First question answer is true → click X (wrong)
    await user.click(screen.getByText('X'))

    await waitFor(() => {
      expect(screen.getByText('✓ 0')).toBeInTheDocument()
      expect(screen.getByText('✗ 1')).toBeInTheDocument()
    })
  })

  it('shows empty state when no questions', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: () => Promise.resolve([]),
    } as Response)

    renderOXQuiz()

    await waitFor(() => {
      expect(screen.getByText('OX 문제가 없습니다')).toBeInTheDocument()
    })
  })

  it('resets to first question after 다시 풀기', async () => {
    const user = userEvent.setup()
    renderOXQuiz()

    // Complete all questions quickly
    for (let i = 0; i < OX_QUESTIONS.length - 1; i++) {
      await waitFor(() => expect(screen.getByText(OX_QUESTIONS[i].statement)).toBeInTheDocument())
      await user.click(screen.getByText('O'))
      await waitFor(() => expect(screen.getByText('다음 문제')).toBeInTheDocument())
      await user.click(screen.getByText('다음 문제'))
    }

    await waitFor(() =>
      expect(screen.getByText(OX_QUESTIONS[OX_QUESTIONS.length - 1].statement)).toBeInTheDocument(),
    )
    await user.click(screen.getByText('O'))
    await waitFor(() => expect(screen.getByText('결과 보기')).toBeInTheDocument())
    await user.click(screen.getByText('결과 보기'))

    await waitFor(() => expect(screen.getByText('다시 풀기')).toBeInTheDocument())
    await user.click(screen.getByText('다시 풀기'))

    await waitFor(() => {
      expect(screen.getByText(OX_QUESTIONS[0].statement)).toBeInTheDocument()
      expect(screen.getByText(`OX 퀴즈 (1/${OX_QUESTIONS.length})`)).toBeInTheDocument()
    })
  })
})
