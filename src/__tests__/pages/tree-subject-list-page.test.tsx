import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TreeSubjectListPage } from '@/pages/tree-subject-list-page'

import { renderWithRoute, ROUTES, treeSubjectListPath } from '../helpers/render-with-route'

describe('TreeSubjectListPage', () => {
  function renderPage() {
    return renderWithRoute(<TreeSubjectListPage />, {
      route: treeSubjectListPath(),
      path: ROUTES.treeSubjectList,
    })
  }

  it('renders page title', () => {
    renderPage()
    expect(screen.getByText('개념 트리')).toBeInTheDocument()
  })

  it('shows 1차 시험 section', () => {
    renderPage()
    expect(screen.getByText('1차 시험')).toBeInTheDocument()
  })

  it('shows 2차 시험 section', () => {
    renderPage()
    expect(screen.getByText('2차 시험')).toBeInTheDocument()
  })

  it('renders subject cards with names', () => {
    renderPage()
    expect(screen.getByText('부동산학개론')).toBeInTheDocument()
    expect(screen.getByText('민법 및 민사특별법')).toBeInTheDocument()
  })

  it('shows node count badges', () => {
    renderPage()
    const badges = screen.getAllByText(/개 개념/)
    expect(badges.length).toBeGreaterThan(0)
  })

  it('shows question count badges', () => {
    renderPage()
    const badges = screen.getAllByText(/문항/)
    expect(badges.length).toBeGreaterThan(0)
  })

  it('subject cards are clickable', async () => {
    const user = userEvent.setup()
    renderPage()

    const card = screen.getByText('부동산학개론').closest('[data-slot="card"]')!
    // Should not throw on click
    await user.click(card)
  })
})
