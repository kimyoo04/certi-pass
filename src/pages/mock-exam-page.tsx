import { useCallback, useEffect, useState } from 'react'
import type { Curriculum, MultipleChoiceQuestion } from '@/types'
import { useNavigate, useParams } from 'react-router-dom'

import { ExamTimer } from '@/components/exam-timer'
import { MobileLayout } from '@/components/mobile-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useMockExamStore } from '@/stores/use-mock-exam-store'
import { DATA_PATHS } from '@/constants'

export function MockExamPage() {
  const { examId, subjectId } = useParams<{ examId: string; subjectId: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const {
    questions,
    answers,
    currentIndex,
    remainingSeconds,
    isStarted,
    isFinished,
    startExam,
    selectAnswer,
    goToQuestion,
    finishExam,
  } = useMockExamStore()

  // Load questions and start exam
  useEffect(() => {
    if (isStarted || isFinished) {
      setLoading(false)
      return
    }

    const loadAndStart = async () => {
      try {
        const [quizRes, currRes] = await Promise.all([
          fetch(DATA_PATHS.ALL_QUIZ(examId!, subjectId!)),
          fetch(DATA_PATHS.CURRICULUM(examId!)),
        ])
        const allQuestions: MultipleChoiceQuestion[] = await quizRes.json()
        const curriculum: Curriculum = await currRes.json()
        const subject = curriculum.subjects.find((s) => s.id === subjectId)
        startExam(examId!, subjectId!, subject?.name ?? subjectId!, allQuestions)
      } finally {
        setLoading(false)
      }
    }

    loadAndStart()
  }, [examId, subjectId, isStarted, isFinished, startExam])

  // Auto-submit on timer expiry
  useEffect(() => {
    if (isStarted && remainingSeconds <= 0) {
      handleSubmit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingSeconds, isStarted])

  const handleSubmit = useCallback(() => {
    finishExam()
    navigate(`/exam/${examId}/mock/${subjectId}/result`, { replace: true })
  }, [finishExam, navigate, examId, subjectId])

  const handleSelect = useCallback(
    (questionId: string, idx: number) => {
      selectAnswer(questionId, idx)
    },
    [selectAnswer],
  )

  if (loading) {
    return (
      <MobileLayout title="모의고사" showBack>
        <div className="flex items-center justify-center py-20">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
        </div>
      </MobileLayout>
    )
  }

  if (questions.length === 0) {
    return (
      <MobileLayout title="모의고사" showBack>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground">문제를 불러올 수 없습니다.</p>
          <Button className="mt-4" onClick={() => navigate(-1)}>
            돌아가기
          </Button>
        </div>
      </MobileLayout>
    )
  }

  const question = questions[currentIndex]
  const selectedIdx = answers[question.id] ?? null
  const answeredCount = Object.keys(answers).length

  return (
    <MobileLayout
      title={
        <div className="flex items-center gap-2">
          <span className="text-sm">모의고사</span>
          <ExamTimer />
        </div>
      }
      showBack
    >
      <div className="space-y-3">
        {/* Question navigator grid */}
        <div className="grid grid-cols-8 gap-1">
          {questions.map((q, i) => {
            const isAnswered = q.id in answers
            const isCurrent = i === currentIndex
            return (
              <button
                key={q.id}
                className={`h-8 rounded text-xs font-medium transition-colors ${
                  isCurrent
                    ? 'bg-primary text-primary-foreground'
                    : isAnswered
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-muted text-muted-foreground'
                }`}
                onClick={() => goToQuestion(i)}
              >
                {i + 1}
              </button>
            )
          })}
        </div>

        {/* Question card */}
        <Card>
          <CardContent className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Badge variant="outline">Q{currentIndex + 1}</Badge>
              {question.year && (
                <Badge variant="secondary" className="text-xs">
                  {question.year}년
                </Badge>
              )}
            </div>

            <p className="mb-5 text-base leading-relaxed font-medium">{question.content}</p>

            <div className="space-y-2">
              {question.options.map((option, idx) => {
                const isSelected = selectedIdx === idx
                return (
                  <button
                    key={idx}
                    className={`w-full cursor-pointer rounded-lg border p-3 text-left text-sm transition-colors active:scale-[0.98] ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleSelect(question.id, idx)}
                  >
                    <span className="text-muted-foreground mr-2 font-medium">{idx + 1}.</span>
                    {option}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Navigation + Submit */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            disabled={currentIndex === 0}
            onClick={() => goToQuestion(currentIndex - 1)}
          >
            이전
          </Button>
          {currentIndex < questions.length - 1 ? (
            <Button className="flex-1" onClick={() => goToQuestion(currentIndex + 1)}>
              다음
            </Button>
          ) : (
            <Button className="flex-1" variant="default" onClick={handleSubmit}>
              제출
            </Button>
          )}
        </div>

        {/* Submit button always visible */}
        <Button variant="outline" className="w-full" onClick={handleSubmit}>
          제출하기 ({answeredCount}/{questions.length} 답변)
        </Button>
      </div>
    </MobileLayout>
  )
}
