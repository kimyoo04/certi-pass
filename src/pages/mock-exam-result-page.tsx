import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { MobileLayout } from '@/components/mobile-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useMockExamStore } from '@/stores/use-mock-exam-store'
import { PASSING_SCORE_PERCENT } from '@/constants'

export function MockExamResultPage() {
  const { examId } = useParams<{ examId: string; subjectId: string }>()
  const navigate = useNavigate()
  const { questions, answers, examHistory } = useMockExamStore()
  const resetSession = useMockExamStore((s) => s.resetSession)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Use the most recent result from history
  const latestResult = examHistory[0]

  const results = useMemo(() => {
    return questions.map((q) => ({
      question: q,
      selectedIndex: answers[q.id] ?? -1,
      isCorrect: answers[q.id] === q.correctIndex,
    }))
  }, [questions, answers])

  const correctCount = results.filter((r) => r.isCorrect).length
  const totalQuestions = results.length
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
  const timeSpent = latestResult ? latestResult.timeSpentSeconds : 0
  const minutes = Math.floor(timeSpent / 60)
  const seconds = timeSpent % 60

  const handleBackToSubject = () => {
    resetSession()
    navigate(`/exam/${examId}`, { replace: true })
  }

  if (totalQuestions === 0) {
    return (
      <MobileLayout title="모의고사 결과" showBack>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground">결과를 불러올 수 없습니다.</p>
          <Button className="mt-4" onClick={handleBackToSubject}>
            과목 선택으로 돌아가기
          </Button>
        </div>
      </MobileLayout>
    )
  }

  const passed = percentage >= PASSING_SCORE_PERCENT

  return (
    <MobileLayout title="모의고사 결과" showBack>
      <div className="space-y-4">
        {/* Score Card */}
        <Card
          className={
            passed ? 'border-green-200 dark:border-green-900' : 'border-red-200 dark:border-red-900'
          }
        >
          <CardContent className="p-5 text-center">
            <p className="mb-2 text-5xl font-bold">{percentage}%</p>
            <p className="mb-1 text-lg font-medium">
              {correctCount} / {totalQuestions} 정답
            </p>
            <div className="text-muted-foreground flex items-center justify-center gap-3 text-sm">
              <span>
                소요 시간: {minutes}분 {seconds}초
              </span>
            </div>
            <Badge variant={passed ? 'default' : 'destructive'} className="mt-3">
              {passed ? '합격 기준 통과' : `합격 기준 미달 (${PASSING_SCORE_PERCENT}%)`}
            </Badge>
            <Progress value={percentage} className="mt-3 h-2" />
          </CardContent>
        </Card>

        {/* Question Review */}
        <div>
          <h2 className="text-muted-foreground mb-2 px-1 text-sm font-medium">문제 리뷰</h2>
          <div className="space-y-2">
            {results.map((r, idx) => {
              const isExpanded = expandedId === r.question.id
              return (
                <Card
                  key={r.question.id}
                  className={`cursor-pointer transition-colors ${
                    r.isCorrect ? '' : 'border-red-100 dark:border-red-950'
                  }`}
                  onClick={() => setExpandedId(isExpanded ? null : r.question.id)}
                >
                  <CardHeader className="p-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${r.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                      >
                        {r.isCorrect ? 'O' : 'X'}
                      </span>
                      <CardTitle className="line-clamp-1 flex-1 text-sm font-normal">
                        Q{idx + 1}. {r.question.content}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  {isExpanded && (
                    <CardContent className="px-3 pt-0 pb-3">
                      <div className="space-y-1.5 text-sm">
                        {r.question.options.map((opt, optIdx) => {
                          let style = ''
                          if (optIdx === r.question.correctIndex) {
                            style = 'text-green-700 dark:text-green-400 font-medium'
                          } else if (optIdx === r.selectedIndex && !r.isCorrect) {
                            style = 'text-red-600 dark:text-red-400 line-through'
                          } else {
                            style = 'text-muted-foreground'
                          }
                          return (
                            <p key={optIdx} className={style}>
                              {optIdx + 1}. {opt}
                              {optIdx === r.question.correctIndex && ' ✓'}
                              {optIdx === r.selectedIndex &&
                                optIdx !== r.question.correctIndex &&
                                ' ←'}
                            </p>
                          )
                        })}
                        {r.selectedIndex === -1 && (
                          <p className="text-xs text-amber-600 dark:text-amber-400">미답변</p>
                        )}
                        {r.question.explanation && (
                          <div className="bg-muted mt-2 rounded p-2">
                            <p className="text-muted-foreground text-xs">
                              {r.question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pb-4">
          <Button className="w-full" onClick={handleBackToSubject}>
            과목 선택으로 돌아가기
          </Button>
        </div>
      </div>
    </MobileLayout>
  )
}
