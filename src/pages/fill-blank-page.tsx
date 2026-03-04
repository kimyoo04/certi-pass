import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FillInTheBlankQuestion, Question } from '@/types'
import { BookmarkCheckIcon, BookmarkIcon, PencilIcon } from 'lucide-react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { FetchErrorFallback } from '@/components/fetch-error-fallback'
import { LoadingSpinner } from '@/components/loading-spinner'
import { MobileLayout } from '@/components/mobile-layout'
import { QuestionEditDialog } from '@/components/question-edit-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useBookmarkStore } from '@/stores/use-bookmark-store'
import { useQuestionEditStore } from '@/stores/use-question-edit-store'
import { useQuizStore } from '@/stores/use-quiz-store'
import { useCachedFetch } from '@/hooks/use-cached-fetch'
import { useSwipe } from '@/hooks/use-swipe'
import { DATA_PATHS, QUERY_MODES, QUESTION_TYPES } from '@/constants'

export function FillBlankPage() {
  const { examId, subjectId, chapterId } = useParams<{
    examId: string
    subjectId: string
    chapterId: string
  }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const bookmarkOnly = searchParams.get('mode') === QUERY_MODES.BOOKMARK

  const {
    questions,
    currentIndex,
    revealedBlanks,
    setQuestions,
    goToQuestion,
    revealBlank,
    recordBlankReveal,
  } = useQuizStore()

  const getEditedQuestion = useQuestionEditStore((s) => s.getEditedQuestion)
  const [editTarget, setEditTarget] = useState<Question | null>(null)
  const { isBookmarked, toggleBookmark } = useBookmarkStore()

  const chapterKey = `${examId}/${subjectId}/${chapterId}`

  const {
    data: fetchedQuestions,
    loading: fetchLoading,
    error: fetchError,
    retry: fetchRetry,
  } = useCachedFetch<Question[]>(DATA_PATHS.CHAPTER_QUIZ(examId!, subjectId!, chapterId!))

  useEffect(() => {
    if (fetchedQuestions) setQuestions(fetchedQuestions)
  }, [fetchedQuestions, setQuestions])

  const blankQuestions = useMemo(() => {
    let all = questions
      .filter((q): q is FillInTheBlankQuestion => q.type === QUESTION_TYPES.FILL_IN_THE_BLANK)
      .map((q) => getEditedQuestion(q))
    if (bookmarkOnly) {
      all = all.filter((q) => isBookmarked(q.id))
    }
    return all
  }, [questions, getEditedQuestion, bookmarkOnly, isBookmarked])

  const handleReveal = useCallback(
    (questionId: string) => {
      revealBlank(questionId)
      recordBlankReveal(chapterKey, questionId, blankQuestions.length)
    },
    [revealBlank, recordBlankReveal, chapterKey, blankQuestions.length],
  )

  const safeIndex = Math.min(currentIndex, Math.max(blankQuestions.length - 1, 0))
  const isLast = safeIndex === blankQuestions.length - 1

  const swipeHandlers = useSwipe({
    onSwipeLeft: () => !isLast && goToQuestion(safeIndex + 1),
    onSwipeRight: () => safeIndex > 0 && goToQuestion(safeIndex - 1),
  })

  if (fetchError) {
    return (
      <MobileLayout title="빈칸 뚫기" showBack>
        <FetchErrorFallback error={fetchError} onRetry={fetchRetry} />
      </MobileLayout>
    )
  }

  if (fetchLoading || questions.length === 0) {
    return (
      <MobileLayout title="빈칸 뚫기" showBack>
        <LoadingSpinner />
      </MobileLayout>
    )
  }

  if (blankQuestions.length === 0) {
    return (
      <MobileLayout title="빈칸 뚫기" showBack>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground mb-2 text-lg font-medium">
            빈칸 뚫기 문제가 없습니다
          </p>
          <p className="text-muted-foreground text-sm">
            이 단원에는 아직 빈칸 뚫기 문제가 준비되지 않았습니다.
          </p>
        </div>
      </MobileLayout>
    )
  }

  const question = blankQuestions[safeIndex]
  const isRevealed = !!revealedBlanks[question.id]
  const progressPercent = ((safeIndex + 1) / blankQuestions.length) * 100

  const renderContent = (content: string, answer: string, revealed: boolean) => {
    const parts = content.split('[BLANK]')
    return (
      <span className="text-base leading-relaxed">
        {parts[0]}
        <button
          type="button"
          className={`inline-block min-w-[3rem] rounded-md px-2 py-0.5 text-center font-bold transition-all ${
            revealed
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-primary/10 text-primary border-primary cursor-pointer border-b-2 border-dashed'
          }`}
          onClick={() => !revealed && handleReveal(question.id)}
          aria-label={revealed ? `정답: ${answer}` : '정답 보기'}
          disabled={revealed}
        >
          {revealed ? answer : '?'}
        </button>
        {parts[1]}
      </span>
    )
  }

  return (
    <MobileLayout title={`빈칸 뚫기 (${safeIndex + 1}/${blankQuestions.length})`} showBack>
      <div className="space-y-4" {...swipeHandlers}>
        <Progress value={progressPercent} className="h-2" />

        <Card>
          <CardContent className="p-5">
            <div className="mb-4">
              <div className="mb-3 flex items-center gap-2">
                <Badge variant="outline">Q{safeIndex + 1}</Badge>
                <div className="ml-auto flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => toggleBookmark(question.id)}
                    aria-label={isBookmarked(question.id) ? '북마크 해제' : '북마크 추가'}
                  >
                    {isBookmarked(question.id) ? (
                      <BookmarkCheckIcon className="text-primary h-4 w-4" />
                    ) : (
                      <BookmarkIcon className="h-4 w-4" />
                    )}
                  </Button>
                  {import.meta.env.DEV && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => setEditTarget(question)}
                    >
                      <PencilIcon className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="mt-2">
                {renderContent(question.content, question.answer, isRevealed)}
              </div>
            </div>

            {!isRevealed && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={() => handleReveal(question.id)}
              >
                정답 보기
              </Button>
            )}

            {isRevealed && (
              <div className="bg-muted mt-4 rounded-lg p-3">
                <p className="text-muted-foreground mb-1 text-xs font-medium">해설</p>
                <p
                  className={`text-sm ${question.explanation ? '' : 'text-muted-foreground/60 italic'}`}
                >
                  {question.explanation || '해설이 아직 준비되지 않았습니다.'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full gap-1 text-xs"
                  onClick={() => navigate(`/exam/${examId}/tree/${subjectId}`)}
                >
                  📚 관련 개념 보기
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky bottom-0 -mx-4 flex gap-2 border-t px-4 py-3 backdrop-blur">
          <Button
            variant="outline"
            className="flex-1"
            disabled={safeIndex === 0}
            onClick={() => goToQuestion(safeIndex - 1)}
          >
            이전
          </Button>
          <Button
            className="flex-1"
            disabled={safeIndex === blankQuestions.length - 1}
            onClick={() => goToQuestion(safeIndex + 1)}
          >
            다음
          </Button>
        </div>
      </div>

      {import.meta.env.DEV && editTarget && (
        <QuestionEditDialog
          question={editTarget}
          open={!!editTarget}
          onOpenChange={(open) => !open && setEditTarget(null)}
        />
      )}
    </MobileLayout>
  )
}
