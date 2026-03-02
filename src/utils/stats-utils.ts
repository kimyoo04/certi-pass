import type { ChapterProgress, Curriculum } from '@/types'

export interface SubjectStats {
  subjectId: string
  subjectName: string
  correctCount: number
  wrongCount: number
  totalAttempted: number
  accuracy: number // 0-100
}

export interface OverallStats {
  totalCorrect: number
  totalWrong: number
  totalAttempted: number
  accuracy: number
}

export function aggregateBySubject(
  progress: Record<string, ChapterProgress>,
  curriculum: Curriculum,
): SubjectStats[] {
  return curriculum.subjects.map((subject) => {
    let correctCount = 0
    let wrongCount = 0

    // Collect unique IDs across chapters (avoid double-counting from "all" chapter)
    const uniqueCorrectIds = new Set<string>()
    const uniqueWrongIds = new Set<string>()

    for (const chapter of subject.chapters) {
      if (chapter.id === 'all') continue // Skip aggregate chapter to avoid double-counting
      const key = `${curriculum.examId}/${subject.id}/${chapter.id}`
      const p = progress[key]
      if (p) {
        p.correctIds.forEach((id) => uniqueCorrectIds.add(id))
        p.wrongIds.forEach((id) => uniqueWrongIds.add(id))
      }
    }

    // If only "all" chapter was used, fall back to it
    if (uniqueCorrectIds.size === 0 && uniqueWrongIds.size === 0) {
      const allKey = `${curriculum.examId}/${subject.id}/all`
      const p = progress[allKey]
      if (p) {
        p.correctIds.forEach((id) => uniqueCorrectIds.add(id))
        p.wrongIds.forEach((id) => uniqueWrongIds.add(id))
      }
    }

    // Remove overlap: if a question is in both correct and wrong, count latest (wrong wins since it's re-attempted)
    for (const id of uniqueWrongIds) {
      uniqueCorrectIds.delete(id)
    }

    correctCount = uniqueCorrectIds.size
    wrongCount = uniqueWrongIds.size
    const totalAttempted = correctCount + wrongCount

    return {
      subjectId: subject.id,
      subjectName: subject.name,
      correctCount,
      wrongCount,
      totalAttempted,
      accuracy: totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0,
    }
  })
}

export function getOverallStats(subjectStats: SubjectStats[]): OverallStats {
  const totalCorrect = subjectStats.reduce((sum, s) => sum + s.correctCount, 0)
  const totalWrong = subjectStats.reduce((sum, s) => sum + s.wrongCount, 0)
  const totalAttempted = totalCorrect + totalWrong

  return {
    totalCorrect,
    totalWrong,
    totalAttempted,
    accuracy: totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0,
  }
}

export function getWeakAreas(stats: SubjectStats[], threshold = 60): SubjectStats[] {
  return stats.filter((s) => s.totalAttempted > 0 && s.accuracy < threshold)
}
