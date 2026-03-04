import { useCallback, useEffect, useMemo, useState } from 'react'
import type { MultipleChoiceQuestion, Question } from '@/types'
import { BookmarkCheckIcon, BookmarkIcon, BrainIcon, PencilIcon, ShuffleIcon } from 'lucide-react'
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
import { useSM2Store } from '@/stores/use-sm2-store'
import { useCachedFetch } from '@/hooks/use-cached-fetch'
import { useSwipe } from '@/hooks/use-swipe'
import { fisherYatesShuffle } from '@/utils/shuffle'
import { sm2Sort } from '@/utils/sm2'
import { DATA_PATHS, QUERY_MODES, QUESTION_TYPES } from '@/constants'

export function QuizPage() {
  const { examId, subjectId, chapterId } = useParams<{
    examId: string
    subjectId: string
    chapterId: string
  }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode')
  const wrongOnly = mode === QUERY_MODES.WRONG
  const bookmarkOnly = mode === QUERY_MODES.BOOKMARK

  const {
    questions,
    currentIndex,
    selectedAnswer,
    showExplanation,
    chapterProgress,
    shuffleEnabled,
    setQuestions,
    goToQuestion,
    selectAnswer,
    recordMcAnswer,
    incrementActivity,
  } = useQuizStore()

  const { sm2Data, sm2SortEnabled, updateQuestion: updateSM2Question, toggleSM2Sort } = useSM2Store()

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

  const mcQuestions = useMemo(() => {
    let all = questions
      .filter((q): q is MultipleChoiceQuestion => q.type === QUESTION_TYPES.MULTIPLE_CHOICE)
      .map((q) => getEditedQuestion(q))
    if (wrongOnly) {
      const wrongIds = chapterProgress[chapterKey]?.wrongIds ?? []
      all = all.filter((q) => wrongIds.includes(q.id))
    }
    if (bookmarkOnly) {
      all = all.filter((q) => isBookmarked(q.id))
    }
    if (sm2SortEnabled) {
      return sm2Sort(all, sm2Data)
    }
    if (shuffleEnabled) {
      return fisherYatesShuffle(all, chapterKey)
    }
    return all
  }, [
    questions,
    wrongOnly,
    bookmarkOnly,
    chapterProgress,
    chapterKey,
    shuffleEnabled,
    sm2SortEnabled,
    sm2Data,
    getEditedQuestion,
    isBookmarked,
  ])

  const handleSelect = useCallback(
    (idx: number) => {
      if (selectedAnswer !== null) return
      selectAnswer(idx)
      const question = mcQuestions[Math.min(currentIndex, mcQuestions.length - 1)]
      const correct = idx === question.correctIndex
      recordMcAnswer(chapterKey, question.id, correct, mcQuestions.length)
      updateSM2Question(question.id, correct ? 4 : 1)
      incrementActivity()
    },
    [selectedAnswer, selectAnswer, mcQuestions, currentIndex, recordMcAnswer, chapterKey, updateSM2Question, incrementActivity],
  )

  const safeIndex = Math.min(currentIndex, Math.max(mcQuestions.length - 1, 0))
  const isLast = safeIndex === mcQuestions.length - 1

  const swipeHandlers = useSwipe({
    onSwipeLeft: () => !isLast && goToQuestion(safeIndex + 1),
    onSwipeRight: () => safeIndex > 0 && goToQuestion(safeIndex - 1),
  })

  if (fetchError) {
    return (
      <MobileLayout
        title={wrongOnly ? '오답 풀기' : bookmarkOnly ? '북마크 문제' : '기출 문제'}
        showBack
      >
        <FetchErrorFallback error={fetchError} onRetry={fetchRetry} />
      </MobileLayout>
    )
  }

  if (fetchLoading) {
    return (
      <MobileLayout
        title={wrongOnly ? '오답 풀기' : bookmarkOnly ? '북마크 문제' : '기출 문제'}
        showBack
      >
        <LoadingSpinner />
      </MobileLayout>
    )
  }

  if (mcQuestions.length === 0) {
    return (
      <MobileLayout
        title={wrongOnly ? '오답 풀기' : bookmarkOnly ? '북마크 문제' : '기출 문제'}
        showBack
      >
        <div className="flex flex-col items-center justify-center py-20 text-center">
          {questions.length === 0 ? (
            <LoadingSpinner />
          ) : (
            <>
              <p className="mb-3 text-4xl">{bookmarkOnly ? '📑' : '🎉'}</p>
              <p className="mb-1 font-semibold">
                {bookmarkOnly ? '북마크한 문제가 없습니다' : '오답이 없습니다!'}
              </p>
              <p className="text-muted-foreground mb-4 text-sm">
                {bookmarkOnly
                  ? '문제 풀이 중 북마크 아이콘을 눌러 추가하세요'
                  : '모든 문제를 맞혔습니다'}
              </p>
              <Button onClick={() => navigate(-1)}>돌아가기</Button>
            </>
          )}
        </div>
      </MobileLayout>
    )
  }

  const question = mcQuestions[safeIndex]
  const isCorrect = selectedAnswer === question.correctIndex
  const progressPercent = ((safeIndex + 1) / mcQuestions.length) * 100

  return (
    <MobileLayout
      title={`${wrongOnly ? '오답 풀기' : bookmarkOnly ? '북마크 문제' : '기출 문제'} (${safeIndex + 1}/${mcQuestions.length})`}
      showBack
    >
      <div className="space-y-4" {...swipeHandlers}>
        <div className="flex items-center gap-2">
          <Progress value={progressPercent} className="h-2 flex-1" />
          <button
            onClick={() => useQuizStore.getState().toggleShuffle()}
            className={`flex h-7 items-center gap-1 rounded-full px-2 text-xs transition-colors ${
              shuffleEnabled
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
            title="랜덤 셔플"
          >
            <ShuffleIcon className="h-3 w-3" />
          </button>
          <button
            onClick={toggleSM2Sort}
            className={`flex h-7 items-center gap-1 rounded-full px-2 text-xs transition-colors ${
              sm2SortEnabled
                ? 'bg-purple-500 text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
            title="SM-2 복습 순서"
          >
            <BrainIcon className="h-3 w-3" />
          </button>
        </div>

        <Card>
          <CardContent className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Badge variant="outline">Q{safeIndex + 1}</Badge>
              {question.year && (
                <Badge variant="secondary" className="text-xs">
                  {question.year}년 기출
                </Badge>
              )}
              {wrongOnly && (
                <Badge variant="destructive" className="text-xs">
                  오답 복습
                </Badge>
              )}
              {bookmarkOnly && (
                <Badge variant="secondary" className="text-xs">
                  북마크
                </Badge>
              )}
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

            <p className="mb-5 text-base leading-relaxed font-medium">{question.content}</p>

            <div className="space-y-2">
              {question.options.map((option, idx) => {
                let optionStyle = 'border-border hover:border-primary/50'

                if (selectedAnswer !== null) {
                  if (idx === question.correctIndex) {
                    optionStyle = 'border-green-500 bg-green-50 dark:bg-green-950'
                  } else if (idx === selectedAnswer && !isCorrect) {
                    optionStyle = 'border-red-500 bg-red-50 dark:bg-red-950'
                  } else {
                    optionStyle = 'border-border opacity-50'
                  }
                }

                return (
                  <button
                    key={idx}
                    className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${optionStyle} ${
                      selectedAnswer === null
                        ? 'cursor-pointer active:scale-[0.98]'
                        : 'cursor-default'
                    }`}
                    onClick={() => handleSelect(idx)}
                    disabled={selectedAnswer !== null}
                  >
                    <span className="text-muted-foreground mr-2 font-medium">{idx + 1}.</span>
                    {option}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {showExplanation && (
          <Card
            className={
              isCorrect
                ? 'border-green-200 dark:border-green-800'
                : 'border-red-200 dark:border-red-800'
            }
          >
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">{isCorrect ? '🎉' : '😢'}</span>
                <span className="text-sm font-semibold">
                  {isCorrect ? '정답입니다!' : '오답입니다'}
                </span>
              </div>
              <p
                className={`text-sm leading-relaxed ${question.explanation ? 'text-muted-foreground' : 'text-muted-foreground/60 italic'}`}
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
            </CardContent>
          </Card>
        )}

        <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky bottom-0 -mx-4 flex gap-2 border-t px-4 py-3 backdrop-blur">
          <Button
            variant="outline"
            className="flex-1"
            disabled={safeIndex === 0}
            onClick={() => goToQuestion(safeIndex - 1)}
          >
            이전 문제
          </Button>
          {isLast && showExplanation ? (
            <Button
              className="flex-1"
              onClick={() =>
                navigate(
                  `/exam/${examId}/study/${subjectId}/${chapterId}/result?mode=${wrongOnly ? QUERY_MODES.WRONG : QUERY_MODES.QUIZ}`,
                )
              }
            >
              결과 보기
            </Button>
          ) : (
            <Button
              className="flex-1"
              disabled={isLast}
              onClick={() => goToQuestion(safeIndex + 1)}
            >
              다음 문제
            </Button>
          )}
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
