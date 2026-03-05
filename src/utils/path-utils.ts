/** Creates a consistent chapter progress key used across stores and pages */
export function makeChapterKey(examId: string, subjectId: string, chapterId: string): string {
  return `${examId}/${subjectId}/${chapterId}`
}

/** Creates the study mode page URL (quiz or blank) */
export function makeStudyPath(
  examId: string,
  subjectId: string,
  chapterId: string,
  mode: 'quiz' | 'blank',
): string {
  return `/exam/${examId}/study/${subjectId}/${chapterId}/${mode}`
}

/** Creates the study result page URL */
export function makeResultPath(
  examId: string,
  subjectId: string,
  chapterId: string,
  mode: string,
): string {
  return `/exam/${examId}/study/${subjectId}/${chapterId}/result?mode=${mode}`
}

/** Creates the concept tree page URL for a subject */
export function makeTreePath(examId: string, subjectId: string): string {
  return `/exam/${examId}/tree/${subjectId}`
}
