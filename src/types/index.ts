export interface Exam {
  id: string
  name: string
  description: string
  isActive: boolean
}

export interface Chapter {
  id: string
  name: string
}

export interface Subject {
  id: string
  name: string
  chapters: Chapter[]
}

export interface Curriculum {
  examId: string
  subjects: Subject[]
}

export interface FillInTheBlankQuestion {
  id: string
  type: 'fill_in_the_blank'
  content: string
  answer: string
  explanation: string
}

export interface MultipleChoiceQuestion {
  id: string
  type: 'multiple_choice'
  year: number
  content: string
  options: string[]
  correctIndex: number
  explanation: string
}

export type Question = FillInTheBlankQuestion | MultipleChoiceQuestion

/** Mock exam result stored in LocalStorage */
export interface MockExamResult {
  id: string
  examId: string
  subjectId: string
  subjectName: string
  totalQuestions: number
  correctCount: number
  timeSpentSeconds: number
  timestamp: number
  answers: Record<string, number> // questionId → selectedIndex
  questionIds: string[]
}

/** Per-chapter progress stored in LocalStorage */
export interface ChapterProgress {
  /** IDs of correctly answered MC questions */
  correctIds: string[]
  /** IDs of incorrectly answered MC questions */
  wrongIds: string[]
  /** IDs of revealed fill-in-the-blank questions */
  revealedIds: string[]
  /** Total MC questions in this chapter */
  totalMc: number
  /** Total fill-in-the-blank questions in this chapter */
  totalBlank: number
}
