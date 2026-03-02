/* eslint-disable react-refresh/only-export-components */
import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

export const ROUTES = {
  quiz: '/exam/:examId/study/:subjectId/:chapterId/quiz',
  blank: '/exam/:examId/study/:subjectId/:chapterId/blank',
  result: '/exam/:examId/study/:subjectId/:chapterId/result',
  studyMode: '/exam/:examId/study/:subjectId/:chapterId',
} as const

export const TEST_PARAMS = {
  examId: 'realtor',
  subjectId: 'sub_1',
  chapterId: 'ch_1',
}

export function basePath() {
  return `/exam/${TEST_PARAMS.examId}/study/${TEST_PARAMS.subjectId}/${TEST_PARAMS.chapterId}`
}

export function chapterKey() {
  return `${TEST_PARAMS.examId}/${TEST_PARAMS.subjectId}/${TEST_PARAMS.chapterId}`
}

interface RenderWithRouteOptions {
  route: string
  path: string
  search?: string
}

export function renderWithRoute(ui: ReactElement, { route, path, search }: RenderWithRouteOptions) {
  const initialEntry = search ? `${route}${search}` : route

  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path={path} element={ui} />
      </Routes>
    </MemoryRouter>,
  )
}
