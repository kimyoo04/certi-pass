import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { FillBlankPage } from '@/pages/fill-blank-page'
import { useQuizStore } from '@/stores/use-quiz-store'

import { BLANK_QUESTIONS, mockFetch } from '../helpers/mock-data'
import { basePath, chapterKey, renderWithRoute, ROUTES } from '../helpers/render-with-route'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => vi.fn() }
})

function renderBlank() {
  return renderWithRoute(<FillBlankPage />, {
    route: `${basePath()}/blank`,
    path: ROUTES.blank,
  })
}

describe('FillBlankPage', () => {
  beforeEach(() => {
    mockFetch()
  })

  it('shows loading spinner before data loads', () => {
    vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {}))
    renderBlank()
    expect(screen.getByText('빈칸 뚫기')).toBeInTheDocument()
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it("renders content with '?' placeholder", async () => {
    renderBlank()

    await waitFor(() => {
      expect(screen.getByText('?')).toBeInTheDocument()
    })

    // Content parts around [BLANK] should be visible
    expect(screen.getByText(/부동산의 자연적 특성 중/)).toBeInTheDocument()
  })

  it('shows counter in title and progress bar and Q badge', async () => {
    renderBlank()

    await waitFor(() => {
      expect(screen.getByText(`빈칸 뚫기 (1/${BLANK_QUESTIONS.length})`)).toBeInTheDocument()
    })

    expect(screen.getByText('Q1')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it("shows '정답 보기' button before reveal", async () => {
    renderBlank()

    await waitFor(() => {
      expect(screen.getByText('정답 보기')).toBeInTheDocument()
    })
  })

  it("reveals answer when clicking '?'", async () => {
    const user = userEvent.setup()
    renderBlank()

    await waitFor(() => {
      expect(screen.getByText('?')).toBeInTheDocument()
    })

    await user.click(screen.getByText('?'))

    expect(screen.getByText(BLANK_QUESTIONS[0].answer)).toBeInTheDocument()
  })

  it("reveals answer when clicking '정답 보기'", async () => {
    const user = userEvent.setup()
    renderBlank()

    await waitFor(() => {
      expect(screen.getByText('정답 보기')).toBeInTheDocument()
    })

    await user.click(screen.getByText('정답 보기'))

    expect(screen.getByText(BLANK_QUESTIONS[0].answer)).toBeInTheDocument()
  })

  it('shows explanation after reveal', async () => {
    const user = userEvent.setup()
    renderBlank()

    await waitFor(() => {
      expect(screen.getByText('정답 보기')).toBeInTheDocument()
    })

    await user.click(screen.getByText('정답 보기'))

    expect(screen.getByText(BLANK_QUESTIONS[0].explanation)).toBeInTheDocument()
    expect(screen.getByText('해설')).toBeInTheDocument()
  })

  it("hides '정답 보기' button after reveal", async () => {
    const user = userEvent.setup()
    renderBlank()

    await waitFor(() => {
      expect(screen.getByText('정답 보기')).toBeInTheDocument()
    })

    await user.click(screen.getByText('정답 보기'))

    expect(screen.queryByText('정답 보기')).not.toBeInTheDocument()
  })

  it('records blank reveal in store', async () => {
    const user = userEvent.setup()
    renderBlank()

    await waitFor(() => {
      expect(screen.getByText('정답 보기')).toBeInTheDocument()
    })

    await user.click(screen.getByText('정답 보기'))

    const progress = useQuizStore.getState().chapterProgress[chapterKey()]
    expect(progress?.revealedIds).toContain(BLANK_QUESTIONS[0].id)
  })

  it("disables '이전' on first question", async () => {
    renderBlank()

    await waitFor(() => {
      expect(screen.getByText('?')).toBeInTheDocument()
    })

    expect(screen.getByText('이전')).toBeDisabled()
  })

  it("disables '다음' on last question", async () => {
    renderBlank()

    await waitFor(() => {
      expect(screen.getByText('?')).toBeInTheDocument()
    })

    // Navigate to last
    const user = userEvent.setup()
    for (let i = 0; i < BLANK_QUESTIONS.length - 1; i++) {
      await user.click(screen.getByText('다음'))
    }

    await waitFor(() => {
      expect(screen.getByText(`Q${BLANK_QUESTIONS.length}`)).toBeInTheDocument()
    })

    expect(screen.getByText('다음')).toBeDisabled()
  })

  it('navigation resets to new question state', async () => {
    const user = userEvent.setup()
    renderBlank()

    await waitFor(() => {
      expect(screen.getByText('정답 보기')).toBeInTheDocument()
    })

    // Reveal first question
    await user.click(screen.getByText('정답 보기'))
    expect(screen.getByText(BLANK_QUESTIONS[0].answer)).toBeInTheDocument()

    // Navigate to next
    await user.click(screen.getByText('다음'))

    await waitFor(() => {
      expect(screen.getByText('Q2')).toBeInTheDocument()
    })

    // Should have new '?' placeholder
    expect(screen.getByText('?')).toBeInTheDocument()
    expect(screen.getByText('정답 보기')).toBeInTheDocument()
  })
})
