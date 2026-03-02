/** Tree hierarchy levels for exam content taxonomy */
export type TreeLevel =
  | 'subject' // 과목
  | 'major' // 대단원 (편)
  | 'middle' // 중단원 (장)
  | 'minor' // 소단원 (절)
  | 'category' // 개념 체계 분류
  | 'concept' // 특정 개념
  | 'description' // 설명

export interface TreeNode {
  id: string
  label: string
  level: TreeLevel
  importance?: number // 1-5 (★ rating, 출제 빈도)
  examFrequency?: string // e.g., "매회 3-4문제"
  children?: TreeNode[]
  description?: string // leaf node 설명
}

export interface ExamSubject {
  id: string
  name: string
  examType: 'first' | 'second' // 1차/2차 시험
  questionCount: number // 과목당 문항 수
  tree: TreeNode[]
}

export interface ExamStructure {
  firstExam: ExamSubject[]
  secondExam: ExamSubject[]
}
