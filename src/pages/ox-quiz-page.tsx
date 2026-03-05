import { useState } from 'react'
import type { OXQuestion } from '@/types'
import { useParams } from 'react-router-dom'

import { FetchErrorFallback } from '@/components/fetch-error-fallback'
import { LoadingSpinner } from '@/components/loading-spinner'
import { MobileLayout } from '@/components/mobile-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useSwipe } from '@/hooks/use-swipe'
import { useCachedFetch } from '@/hooks/use-cached-fetch'
import { DATA_PATHS } from '@/constants'

export function OXQuizPage() {
  const { examId, subjectId } = useParams<{ examId: string; subjectId: string }>()

  const {
    data: questions,
    loading,
    error,
    retry,
  } = useCachedFetch<OXQuestion[]>(
    examId && subjectId ? DATA_PATHS.OX_QUIZ(examId, subjectId) : null,
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null)
  const [stats, setStats] = useState({ correct: 0, wrong: 0 })

  const safeQuestions = questions ?? []
  const isDone = currentIndex >= safeQuestions.length
  const safeIndex = isDone ? safeQuestions.length - 1 : currentIndex
  const question = safeQuestions[safeIndex]
  const isAnswered = selectedAnswer !== null
  const isLast = safeIndex === safeQuestions.length - 1
  const progressPercent = safeQuestions.length > 0 ? ((safeIndex + 1) / safeQuestions.length) * 100 : 0

  const handleAnswer = (answer: boolean) => {
    if (isAnswered) return
    setSelectedAnswer(answer)
    const isCorrect = answer === question.answer
    setStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      wrong: prev.wrong + (isCorrect ? 0 : 1),
    }))
  }

  const handleNext = () => {
    setSelectedAnswer(null)
    setCurrentIndex((i) => i + 1)
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setStats({ correct: 0, wrong: 0 })
  }

  const swipeHandlers = useSwipe({
    onSwipeLeft: () => {
      if (isAnswered && !isLast) handleNext()
    },
    onSwipeRight: () => {
      if (isAnswered && safeIndex > 0 && !isAnswered) return
    },
  })

  if (!examId || !subjectId) return null

  if (error) {
    return (
      <MobileLayout title="OX 퀴즈" showBack>
        <FetchErrorFallback error={error} onRetry={retry} />
      </MobileLayout>
    )
  }

  if (loading || !questions) {
    return (
      <MobileLayout title="OX 퀴즈" showBack>
        <LoadingSpinner />
      </MobileLayout>
    )
  }

  if (safeQuestions.length === 0) {
    return (
      <MobileLayout title="OX 퀴즈" showBack>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground mb-2 text-lg font-medium">OX 문제가 없습니다</p>
          <p className="text-muted-foreground text-sm">이 과목에는 아직 OX 퀴즈가 준비되지 않았습니다.</p>
        </div>
      </MobileLayout>
    )
  }

  // 완료 화면
  if (isDone) {
    const total = stats.correct + stats.wrong
    const accuracy = total > 0 ? Math.round((stats.correct / total) * 100) : 0
    return (
      <MobileLayout title="OX 퀴즈" showBack>
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
          <div className="text-6xl">{accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👍' : '📚'}</div>
          <div>
            <p className="text-2xl font-bold">{accuracy}%</p>
            <p className="text-muted-foreground text-sm mt-1">
              {stats.correct}개 정답 / {stats.wrong}개 오답
            </p>
          </div>
          <Button onClick={handleRestart} size="lg" className="w-full max-w-xs">
            다시 풀기
          </Button>
        </div>
      </MobileLayout>
    )
  }

  const isCorrect = isAnswered && selectedAnswer === question.answer

  return (
    <MobileLayout title={`OX 퀴즈 (${safeIndex + 1}/${safeQuestions.length})`} showBack>
      <div className="flex flex-col gap-4" {...swipeHandlers}>
        {/* 진행 + 통계 */}
        <div className="space-y-1.5">
          <Progress value={progressPercent} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground px-0.5">
            <span className="text-green-600 font-medium">✓ {stats.correct}</span>
            <span className="text-red-500 font-medium">✗ {stats.wrong}</span>
          </div>
        </div>

        {/* 문제 */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm min-h-[200px] flex flex-col justify-center">
          <div className="mb-4">
            <Badge variant="outline" className="text-[10px]">Q{safeIndex + 1}</Badge>
          </div>
          <p className="text-base leading-relaxed font-medium text-center">{question.statement}</p>
        </div>

        {/* OX 버튼 */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleAnswer(true)}
            disabled={isAnswered}
            className={`rounded-2xl py-8 text-5xl font-bold transition-all active:scale-95 ${
              isAnswered
                ? question.answer === true
                  ? 'bg-green-100 text-green-600 dark:bg-green-900/40 ring-2 ring-green-500'
                  : selectedAnswer === true
                    ? 'bg-red-100 text-red-400 dark:bg-red-900/30 opacity-60'
                    : 'bg-muted text-muted-foreground opacity-40'
                : 'bg-blue-50 text-blue-500 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30'
            }`}
          >
            O
          </button>
          <button
            type="button"
            onClick={() => handleAnswer(false)}
            disabled={isAnswered}
            className={`rounded-2xl py-8 text-5xl font-bold transition-all active:scale-95 ${
              isAnswered
                ? question.answer === false
                  ? 'bg-green-100 text-green-600 dark:bg-green-900/40 ring-2 ring-green-500'
                  : selectedAnswer === false
                    ? 'bg-red-100 text-red-400 dark:bg-red-900/30 opacity-60'
                    : 'bg-muted text-muted-foreground opacity-40'
                : 'bg-red-50 text-red-500 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30'
            }`}
          >
            X
          </button>
        </div>

        {/* 결과 + 해설 */}
        {isAnswered && (
          <div
            className={`rounded-xl p-4 space-y-2 ${
              isCorrect
                ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800'
            }`}
          >
            <p className={`text-sm font-bold ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              {isCorrect ? '✓ 정답입니다!' : `✗ 오답! 정답은 ${question.answer ? 'O' : 'X'}입니다`}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">{question.explanation}</p>
          </div>
        )}

        {/* 다음 버튼 */}
        {isAnswered && (
          <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky bottom-0 -mx-4 border-t px-4 py-3 backdrop-blur">
            {isLast ? (
              <Button className="w-full" onClick={() => setCurrentIndex(safeQuestions.length)}>
                결과 보기
              </Button>
            ) : (
              <Button className="w-full" onClick={handleNext}>
                다음 문제
              </Button>
            )}
          </div>
        )}
      </div>
    </MobileLayout>
  )
}
