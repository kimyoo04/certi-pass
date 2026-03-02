import { HashRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "@/pages/home-page";
import { SubjectPage } from "@/pages/subject-page";
import { StudyModePage } from "@/pages/study-mode-page";
import { FillBlankPage } from "@/pages/fill-blank-page";
import { QuizPage } from "@/pages/quiz-page";
import { ResultPage } from "@/pages/result-page";
import { TreeSubjectListPage } from "@/pages/tree-subject-list-page";
import { TreeViewPage } from "@/pages/tree-view-page";
import { ClassifyPage } from "@/pages/classify-page";
import { MockExamPage } from "@/pages/mock-exam-page";
import { MockExamResultPage } from "@/pages/mock-exam-result-page";
import { DashboardPage } from "@/pages/dashboard-page";
import { ContactPage } from "@/pages/contact-page";
import { NotFoundPage } from "@/pages/not-found-page";
import { ErrorBoundary } from "@/components/error-boundary";

function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/exam/:examId" element={<SubjectPage />} />
          <Route path="/exam/:examId/dashboard" element={<DashboardPage />} />
          <Route path="/exam/:examId/tree" element={<TreeSubjectListPage />} />
          <Route path="/exam/:examId/tree/:subjectId" element={<TreeViewPage />} />
          <Route path="/exam/:examId/classify/:subjectId" element={<ClassifyPage />} />
          <Route path="/exam/:examId/mock/:subjectId" element={<MockExamPage />} />
          <Route path="/exam/:examId/mock/:subjectId/result" element={<MockExamResultPage />} />
          <Route path="/exam/:examId/study/:subjectId/:chapterId" element={<StudyModePage />} />
          <Route path="/exam/:examId/study/:subjectId/:chapterId/blank" element={<FillBlankPage />} />
          <Route path="/exam/:examId/study/:subjectId/:chapterId/quiz" element={<QuizPage />} />
          <Route path="/exam/:examId/study/:subjectId/:chapterId/result" element={<ResultPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
}

export default App;
