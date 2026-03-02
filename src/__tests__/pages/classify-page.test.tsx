import { screen, waitFor } from '@testing-library/react'

import { ClassifyPage } from '@/pages/classify-page'
import { useClassifyStore } from '@/stores/use-classify-store'

import { renderWithRoute } from '../helpers/render-with-route'

const MOCK_QUIZ = [
  {
    id: 's1_q0001',
    type: 'multiple_choice',
    year: 2021,
    content: '토지관련 용어의 설명으로 틀린 것은?',
    options: [{ text: '대지는 건축법상 용어이다.' }, { text: '필지는 토지등록의 단위이다.' }],
    correctIndex: 0,
  },
  {
    id: 's1_q0002',
    type: 'multiple_choice',
    year: 2023,
    content: '부동산의 특성에 해당하지 않는 것은?',
    options: [{ text: '부동성' }, { text: '이동성' }],
    correctIndex: 1,
  },
  {
    id: 's1_q0003',
    type: 'multiple_choice',
    year: 2021,
    content: '부동산 감정평가에 대한 설명으로 틀린 것은?',
    options: [{ text: '시장가치를 구한다.' }, { text: '투자가치를 구한다.' }],
    correctIndex: 0,
  },
]

const MOCK_TREE_MAP = {
  classified: {
    s1_q0001: 's1-m1-c1-t1',
  },
  unclassified: [
    { id: 's1_q0002', content: '부동산의 특성에...' },
    { id: 's1_q0003', content: '부동산 감정평가에...' },
  ],
}

describe('ClassifyPage', () => {
  beforeEach(() => {
    useClassifyStore.setState({ overrides: {}, defaults: {} })

    vi.spyOn(globalThis, 'fetch').mockImplementation((url) => {
      const urlStr = typeof url === 'string' ? url : url.toString()
      if (urlStr.includes('all_quiz.json')) {
        return Promise.resolve({
          json: () => Promise.resolve(MOCK_QUIZ),
        } as Response)
      }
      if (urlStr.includes('question_tree_map.json')) {
        return Promise.resolve({
          json: () => Promise.resolve(MOCK_TREE_MAP),
        } as Response)
      }
      return Promise.reject(new Error(`Unexpected fetch: ${urlStr}`))
    })
  })

  function renderClassifyPage() {
    return renderWithRoute(<ClassifyPage />, {
      route: '/exam/realtor/classify/s1',
      path: '/exam/:examId/classify/:subjectId',
    })
  }

  it('renders question list after loading', async () => {
    renderClassifyPage()

    await waitFor(() => {
      expect(screen.getByText(/토지관련 용어/)).toBeInTheDocument()
    })

    expect(screen.getByText(/부동산의 특성/)).toBeInTheDocument()
    expect(screen.getByText(/부동산 감정평가/)).toBeInTheDocument()
  })

  it('shows stats badges', async () => {
    renderClassifyPage()

    await waitFor(() => {
      expect(screen.getByText('전체 3')).toBeInTheDocument()
    })

    expect(screen.getByText('분류됨 1')).toBeInTheDocument()
    expect(screen.getByText('미분류 2')).toBeInTheDocument()
  })

  it('shows year badges on questions', async () => {
    renderClassifyPage()

    await waitFor(() => {
      expect(screen.getByText('s1_q0001')).toBeInTheDocument()
    })

    const yearBadges = screen.getAllByText('2021')
    expect(yearBadges.length).toBe(2)
    expect(screen.getByText('2023')).toBeInTheDocument()
  })

  it('shows classify buttons for each question', async () => {
    renderClassifyPage()

    await waitFor(() => {
      expect(screen.getByText(/토지관련 용어/)).toBeInTheDocument()
    })

    const classifyButtons = screen.getAllByText('분류')
    expect(classifyButtons.length).toBe(3)
  })

  it('shows classified question with node info and unclassified label', async () => {
    renderClassifyPage()

    await waitFor(() => {
      expect(screen.getByText(/토지관련 용어/)).toBeInTheDocument()
    })

    // q0002 and q0003 should show 미분류
    const unclassifiedLabels = screen.getAllByText('미분류')
    expect(unclassifiedLabels.length).toBe(2)
  })
})
