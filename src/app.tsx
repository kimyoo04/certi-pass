import { lazy, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'

import { ErrorBoundary } from '@/components/error-boundary'
import { LoadingSpinner } from '@/components/loading-spinner'
import { HomePage } from '@/pages/home-page'
import { StudyModePage } from '@/pages/study-mode-page'
import { SubjectPage } from '@/pages/subject-page'

const QuizPage = lazy(() => import('@/pages/quiz-page').then((m) => ({ default: m.QuizPage })))
const FillBlankPage = lazy(() =>
  import('@/pages/fill-blank-page').then((m) => ({ default: m.FillBlankPage })),
)
const ResultPage = lazy(() =>
  import('@/pages/result-page').then((m) => ({ default: m.ResultPage })),
)
const DashboardPage = lazy(() =>
  import('@/pages/dashboard-page').then((m) => ({ default: m.DashboardPage })),
)
const TreeViewPage = lazy(() =>
  import('@/pages/tree-view-page').then((m) => ({ default: m.TreeViewPage })),
)
const TreeSubjectListPage = lazy(() =>
  import('@/pages/tree-subject-list-page').then((m) => ({ default: m.TreeSubjectListPage })),
)
const ClassifyPage = lazy(() =>
  import('@/pages/classify-page').then((m) => ({ default: m.ClassifyPage })),
)
const MockExamPage = lazy(() =>
  import('@/pages/mock-exam-page').then((m) => ({ default: m.MockExamPage })),
)
const MockExamResultPage = lazy(() =>
  import('@/pages/mock-exam-result-page').then((m) => ({ default: m.MockExamResultPage })),
)
const SearchPage = lazy(() =>
  import('@/pages/search-page').then((m) => ({ default: m.SearchPage })),
)
const ContactPage = lazy(() =>
  import('@/pages/contact-page').then((m) => ({ default: m.ContactPage })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/not-found-page').then((m) => ({ default: m.NotFoundPage })),
)

function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/exam/:examId" element={<SubjectPage />} />
            <Route path="/exam/:examId/dashboard" element={<DashboardPage />} />
            <Route path="/exam/:examId/tree" element={<TreeSubjectListPage />} />
            <Route path="/exam/:examId/tree/:subjectId" element={<TreeViewPage />} />
            <Route path="/exam/:examId/search" element={<SearchPage />} />
            <Route path="/exam/:examId/classify/:subjectId" element={<ClassifyPage />} />
            <Route path="/exam/:examId/mock/:subjectId" element={<MockExamPage />} />
            <Route path="/exam/:examId/mock/:subjectId/result" element={<MockExamResultPage />} />
            <Route path="/exam/:examId/study/:subjectId/:chapterId" element={<StudyModePage />} />
            <Route
              path="/exam/:examId/study/:subjectId/:chapterId/blank"
              element={<FillBlankPage />}
            />
            <Route path="/exam/:examId/study/:subjectId/:chapterId/quiz" element={<QuizPage />} />
            <Route
              path="/exam/:examId/study/:subjectId/:chapterId/result"
              element={<ResultPage />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </ErrorBoundary>
  )
}

export default App
