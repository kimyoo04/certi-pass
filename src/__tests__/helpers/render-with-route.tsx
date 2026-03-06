/* eslint-disable react-refresh/only-export-components */
import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

export const ROUTES = {
  quiz: '/exam/:examId/study/:subjectId/:chapterId/quiz',
  blank: '/exam/:examId/study/:subjectId/:chapterId/blank',
  result: '/exam/:examId/study/:subjectId/:chapterId/result',
  studyMode: '/exam/:examId/study/:subjectId/:chapterId',
  mockExam: '/exam/:examId/mock/:subjectId',
  mockExamResult: '/exam/:examId/mock/:subjectId/result',
  treeSubjectList: '/exam/:examId/tree',
  treeView: '/exam/:examId/tree/:subjectId',
  oxQuiz: '/exam/:examId/ox/:subjectId',
} as const

const TEST_PARAMS = {
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

export function mockExamPath(subjectId = 's1') {
  return `/exam/${TEST_PARAMS.examId}/mock/${subjectId}`
}

export function mockExamResultPath(subjectId = 's1') {
  return `/exam/${TEST_PARAMS.examId}/mock/${subjectId}/result`
}

export function treeSubjectListPath() {
  return `/exam/${TEST_PARAMS.examId}/tree`
}

export function treeViewPath(subjectId = 's1') {
  return `/exam/${TEST_PARAMS.examId}/tree/${subjectId}`
}

export function oxQuizPath(subjectId = 's1') {
  return `/exam/${TEST_PARAMS.examId}/ox/${subjectId}`
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
