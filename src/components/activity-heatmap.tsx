interface ActivityHeatmapProps {
  activityLog: Record<string, number>
}

function getColorClass(count: number): string {
  if (count === 0) return 'bg-muted'
  if (count <= 2) return 'bg-green-200 dark:bg-green-900'
  if (count <= 5) return 'bg-green-400 dark:bg-green-700'
  return 'bg-green-600 dark:bg-green-500'
}

export function ActivityHeatmap({ activityLog }: ActivityHeatmapProps) {
  const WEEKS = 16
  const DAYS = WEEKS * 7 // 112일

  // 오늘 기준으로 112일 전부터의 날짜 배열 생성 (일요일 시작 기준 정렬)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // 첫 번째 칸이 일요일이 되도록 시작일 계산
  const endDate = new Date(today)
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - (DAYS - 1))

  // 시작일을 일요일로 맞추기
  const dayOfWeek = startDate.getDay() // 0=일, 6=토
  startDate.setDate(startDate.getDate() - dayOfWeek)

  // 날짜 배열 생성
  const dates: Date[] = []
  const cur = new Date(startDate)
  while (cur <= endDate || dates.length % 7 !== 0) {
    dates.push(new Date(cur))
    cur.setDate(cur.getDate() + 1)
    if (dates.length > WEEKS * 7 + 6) break
  }

  // 주 단위로 분할
  const weeks: Date[][] = []
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7))
  }

  const totalDays = Object.keys(activityLog).filter((d) => activityLog[d] > 0).length
  const totalQuestions = Object.values(activityLog).reduce((a, b) => a + b, 0)

  const formatDate = (d: Date) => d.toISOString().slice(0, 10)

  const todayStr = formatDate(today)

  return (
    <div>
      <div className="overflow-x-auto">
        <div className="flex gap-[3px]" style={{ minWidth: `${weeks.length * 14}px` }}>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((date, di) => {
                const dateStr = formatDate(date)
                const count = activityLog[dateStr] ?? 0
                const isFuture = date > today
                const isToday = dateStr === todayStr
                return (
                  <div
                    key={di}
                    title={`${dateStr}: ${count}문제`}
                    className={`h-[11px] w-[11px] rounded-[2px] ${
                      isFuture ? 'bg-muted opacity-30' : getColorClass(count)
                    } ${isToday ? 'ring-1 ring-primary ring-offset-1' : ''}`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="text-muted-foreground mt-2 flex gap-3 text-xs">
        <span>총 {totalDays}일 학습</span>
        <span>총 {totalQuestions}문제 풀이</span>
      </div>
    </div>
  )
}
