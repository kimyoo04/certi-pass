import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { StudyModePage } from '@/pages/study-mode-page'
import { useQuizStore } from '@/stores/use-quiz-store'

import { PROGRESS_MIXED } from '../helpers/mock-data'
import { basePath, chapterKey, renderWithRoute, ROUTES } from '../helpers/render-with-route'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderStudyMode() {
  return renderWithRoute(<StudyModePage />, {
    route: basePath(),
    path: ROUTES.studyMode,
  })
}

describe('StudyModePage', () => {
  it('shows base mode cards', () => {
    renderStudyMode()

    expect(screen.getByText('빈칸 뚫기')).toBeInTheDocument()
    expect(screen.getByText('기출 문제 풀기')).toBeInTheDocument()
  })

  it("hides '오답만 풀기' when no wrong answers", () => {
    renderStudyMode()

    expect(screen.queryByText('오답만 풀기')).not.toBeInTheDocument()
  })

  it("shows '오답만 풀기' with count when wrongs exist", () => {
    useQuizStore.setState({
      chapterProgress: { [chapterKey()]: PROGRESS_MIXED },
    })

    renderStudyMode()

    expect(screen.getByText('오답만 풀기')).toBeInTheDocument()
    expect(screen.getByText('2문제')).toBeInTheDocument()
  })

  it('shows 학습 현황 when progress exists', () => {
    useQuizStore.setState({
      chapterProgress: { [chapterKey()]: PROGRESS_MIXED },
    })

    renderStudyMode()

    expect(screen.getByText('학습 현황')).toBeInTheDocument()
  })

  it('hides 학습 현황 when no progress', () => {
    renderStudyMode()

    expect(screen.queryByText('학습 현황')).not.toBeInTheDocument()
  })

  it('navigates to blank page when clicking 빈칸 뚫기', async () => {
    const user = userEvent.setup()
    renderStudyMode()

    await user.click(screen.getByText('빈칸 뚫기'))

    expect(mockNavigate).toHaveBeenCalledWith(`${basePath()}/blank`)
  })

  it('navigates to quiz page when clicking 기출 문제 풀기', async () => {
    const user = userEvent.setup()
    renderStudyMode()

    await user.click(screen.getByText('기출 문제 풀기'))

    expect(mockNavigate).toHaveBeenCalledWith(`${basePath()}/quiz`)
  })
})
