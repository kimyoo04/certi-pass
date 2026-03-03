import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TreeViewPage } from '@/pages/tree-view-page'
import { useTreeStore } from '@/stores/use-tree-store'

import { mockFetch } from '../helpers/mock-data'
import { renderWithRoute, ROUTES, treeViewPath } from '../helpers/render-with-route'

const MOCK_TREE_MAP = { classified: {} }

describe('TreeViewPage', () => {
  beforeEach(() => {
    mockFetch(MOCK_TREE_MAP)
    // Reset tree store customizations
    useTreeStore.setState({ customTrees: {} })
  })

  function renderPage(subjectId = 's1') {
    return renderWithRoute(<TreeViewPage />, {
      route: treeViewPath(subjectId),
      path: ROUTES.treeView,
    })
  }

  it('renders subject name in title', () => {
    renderPage()
    expect(screen.getByText('부동산학개론')).toBeInTheDocument()
  })

  it('shows node count badge', () => {
    renderPage()
    expect(screen.getByText(/개 개념/)).toBeInTheDocument()
  })

  it('renders search input', () => {
    renderPage()
    expect(screen.getByPlaceholderText('개념 검색...')).toBeInTheDocument()
  })

  it('filters tree nodes on search', async () => {
    const user = userEvent.setup()
    renderPage()

    const searchInput = screen.getByPlaceholderText('개념 검색...')
    await user.type(searchInput, '부동산학 총론')

    await waitFor(() => {
      expect(screen.getByText('부동산학 총론')).toBeInTheDocument()
    })
  })

  it('shows no results message for empty search', async () => {
    const user = userEvent.setup()
    renderPage()

    const searchInput = screen.getByPlaceholderText('개념 검색...')
    await user.type(searchInput, 'XYZNONEXISTENT')

    await waitFor(() => {
      expect(screen.getByText('검색 결과가 없습니다.')).toBeInTheDocument()
    })
  })

  it('toggle expand/collapse all works', async () => {
    const user = userEvent.setup()
    renderPage()

    // Find the expand/collapse toggle button
    const toggleBtn = screen.getByTitle('모두 펼치기')
    await user.click(toggleBtn)

    await waitFor(() => {
      expect(screen.getByTitle('모두 접기')).toBeInTheDocument()
    })
  })

  it('toggles edit mode', async () => {
    const user = userEvent.setup()
    renderPage()

    const editBtn = screen.getByTitle('편집 모드')
    await user.click(editBtn)

    await waitFor(() => {
      expect(screen.getByTitle('편집 완료')).toBeInTheDocument()
    })
  })

  it('shows error page for unknown subject', () => {
    renderWithRoute(<TreeViewPage />, {
      route: treeViewPath('unknown'),
      path: ROUTES.treeView,
    })

    expect(screen.getByText('과목을 찾을 수 없습니다.')).toBeInTheDocument()
  })
})
