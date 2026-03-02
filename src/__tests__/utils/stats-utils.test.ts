import type { ChapterProgress, Curriculum } from '@/types'

import { aggregateBySubject, getOverallStats, getWeakAreas } from '@/utils/stats-utils'

const curriculum: Curriculum = {
  examId: 'realtor',
  subjects: [
    {
      id: 's1',
      name: '부동산학개론',
      chapters: [
        { id: 'all', name: '전체' },
        { id: 'y2024', name: '2024' },
        { id: 'y2023', name: '2023' },
      ],
    },
    {
      id: 's2',
      name: '민법',
      chapters: [
        { id: 'all', name: '전체' },
        { id: 'y2024', name: '2024' },
      ],
    },
  ],
}

describe('aggregateBySubject', () => {
  it('returns stats for each subject', () => {
    const progress: Record<string, ChapterProgress> = {}
    const stats = aggregateBySubject(progress, curriculum)
    expect(stats).toHaveLength(2)
    expect(stats[0].subjectId).toBe('s1')
    expect(stats[1].subjectId).toBe('s2')
  })

  it("aggregates across year chapters (excludes 'all' to avoid double count)", () => {
    const progress: Record<string, ChapterProgress> = {
      'realtor/s1/y2024': {
        correctIds: ['a', 'b'],
        wrongIds: ['c'],
        revealedIds: [],
        totalMc: 40,
        totalBlank: 0,
      },
      'realtor/s1/y2023': {
        correctIds: ['d'],
        wrongIds: [],
        revealedIds: [],
        totalMc: 40,
        totalBlank: 0,
      },
    }
    const stats = aggregateBySubject(progress, curriculum)
    expect(stats[0].correctCount).toBe(3)
    expect(stats[0].wrongCount).toBe(1)
    expect(stats[0].totalAttempted).toBe(4)
    expect(stats[0].accuracy).toBe(75)
  })

  it("falls back to 'all' chapter when no year chapters have data", () => {
    const progress: Record<string, ChapterProgress> = {
      'realtor/s2/all': {
        correctIds: ['x'],
        wrongIds: ['y'],
        revealedIds: [],
        totalMc: 100,
        totalBlank: 0,
      },
    }
    const stats = aggregateBySubject(progress, curriculum)
    expect(stats[1].correctCount).toBe(1)
    expect(stats[1].wrongCount).toBe(1)
  })

  it('returns 0 accuracy for subjects with no progress', () => {
    const stats = aggregateBySubject({}, curriculum)
    expect(stats[0].accuracy).toBe(0)
    expect(stats[0].totalAttempted).toBe(0)
  })
})

describe('getOverallStats', () => {
  it('sums all subject stats', () => {
    const stats = [
      {
        subjectId: 's1',
        subjectName: 'A',
        correctCount: 10,
        wrongCount: 5,
        totalAttempted: 15,
        accuracy: 67,
      },
      {
        subjectId: 's2',
        subjectName: 'B',
        correctCount: 20,
        wrongCount: 0,
        totalAttempted: 20,
        accuracy: 100,
      },
    ]
    const overall = getOverallStats(stats)
    expect(overall.totalCorrect).toBe(30)
    expect(overall.totalWrong).toBe(5)
    expect(overall.totalAttempted).toBe(35)
    expect(overall.accuracy).toBe(86)
  })

  it('returns 0 for empty stats', () => {
    const overall = getOverallStats([])
    expect(overall.accuracy).toBe(0)
    expect(overall.totalAttempted).toBe(0)
  })
})

describe('getWeakAreas', () => {
  it('returns subjects below threshold', () => {
    const stats = [
      {
        subjectId: 's1',
        subjectName: 'A',
        correctCount: 2,
        wrongCount: 8,
        totalAttempted: 10,
        accuracy: 20,
      },
      {
        subjectId: 's2',
        subjectName: 'B',
        correctCount: 9,
        wrongCount: 1,
        totalAttempted: 10,
        accuracy: 90,
      },
    ]
    const weak = getWeakAreas(stats, 60)
    expect(weak).toHaveLength(1)
    expect(weak[0].subjectId).toBe('s1')
  })

  it('excludes subjects with no attempts', () => {
    const stats = [
      {
        subjectId: 's1',
        subjectName: 'A',
        correctCount: 0,
        wrongCount: 0,
        totalAttempted: 0,
        accuracy: 0,
      },
    ]
    expect(getWeakAreas(stats)).toHaveLength(0)
  })
})
