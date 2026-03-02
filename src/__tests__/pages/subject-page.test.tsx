import { screen, waitFor } from '@testing-library/react'

import { SubjectPage } from '@/pages/subject-page'

import { renderWithRoute } from '../helpers/render-with-route'

const MOCK_CURRICULUM = {
  examId: 'realtor',
  subjects: [
    {
      id: 's1',
      name: '부동산학개론',
      chapters: [
        { id: 'all', name: '전체 기출문제 (200문제)' },
        { id: 'y2024', name: '2024년 기출 (40문제)' },
        { id: 'y2016', name: '2016년 기출 (40문제)' },
      ],
    },
    {
      id: 's2',
      name: '민법 및 민사특별법',
      chapters: [{ id: 'all', name: '전체 기출문제 (197문제)' }],
    },
  ],
}

describe('SubjectPage', () => {
  beforeEach(() => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: () => Promise.resolve(MOCK_CURRICULUM),
    } as Response)
  })

  function renderSubjectPage() {
    return renderWithRoute(<SubjectPage />, {
      route: '/exam/realtor',
      path: '/exam/:examId',
    })
  }

  it('renders 개념 트리 card', async () => {
    renderSubjectPage()

    await waitFor(() => {
      expect(screen.getByText('개념 트리')).toBeInTheDocument()
    })
  })

  it('renders 문제 분류 section', async () => {
    renderSubjectPage()

    await waitFor(() => {
      expect(screen.getByText('문제 분류')).toBeInTheDocument()
    })
  })

  it('renders subject chapters including 2016', async () => {
    renderSubjectPage()

    await waitFor(() => {
      expect(screen.getByText('전체 기출문제 (200문제)')).toBeInTheDocument()
    })

    expect(screen.getByText('2016년 기출 (40문제)')).toBeInTheDocument()
  })
})
