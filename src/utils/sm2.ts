export interface SM2Record {
  repetitions: number
  interval: number
  easinessFactor: number
  nextReviewDate: number // Unix timestamp (ms)
}

/**
 * SM-2 알고리즘으로 복습 일정을 업데이트한다.
 * quality: 0~5 (0=완전 오답, 5=완벽 정답)
 */
export function updateSM2(
  record: SM2Record | undefined,
  quality: 0 | 1 | 2 | 3 | 4 | 5,
): SM2Record {
  const ef = record?.easinessFactor ?? 2.5
  const n = record?.repetitions ?? 0
  const prevInterval = record?.interval ?? 1

  // EF 업데이트
  const newEF = Math.max(1.3, ef + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))

  let newInterval: number
  let newRepetitions: number

  if (quality < 3) {
    // 오답: 처음부터 다시 시작
    newRepetitions = 0
    newInterval = 1
  } else {
    newRepetitions = n + 1
    if (n === 0) {
      newInterval = 1
    } else if (n === 1) {
      newInterval = 6
    } else {
      newInterval = Math.round(prevInterval * newEF)
    }
  }

  const now = Date.now()
  const nextReviewDate = now + newInterval * 24 * 60 * 60 * 1000

  return {
    repetitions: newRepetitions,
    interval: newInterval,
    easinessFactor: newEF,
    nextReviewDate,
  }
}

/**
 * SM-2 우선순위 정렬:
 * 1. 새 문제 (SM-2 데이터 없음) — 가장 먼저
 * 2. 기한 초과 (nextReviewDate <= 오늘) — 오래된 것 먼저
 * 3. 미래 복습 (nextReviewDate > 오늘) — 날짜 오름차순
 */
export function sm2Sort<T extends { id: string }>(
  items: T[],
  sm2Data: Record<string, SM2Record>,
): T[] {
  const now = Date.now()

  return [...items].sort((a, b) => {
    const ra = sm2Data[a.id]
    const rb = sm2Data[b.id]

    const isNewA = !ra
    const isNewB = !rb

    if (isNewA && isNewB) return 0
    if (isNewA) return -1
    if (isNewB) return 1

    const overdueA = ra.nextReviewDate <= now
    const overdueB = rb.nextReviewDate <= now

    if (overdueA && overdueB) return ra.nextReviewDate - rb.nextReviewDate
    if (overdueA) return -1
    if (overdueB) return 1

    return ra.nextReviewDate - rb.nextReviewDate
  })
}
