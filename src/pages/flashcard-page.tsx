import { useMemo, useState } from 'react'
import type { Flashcard, FlashcardDeck } from '@/types'
import { ChevronLeftIcon, ChevronRightIcon, PencilIcon, RotateCcwIcon } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { FetchErrorFallback } from '@/components/fetch-error-fallback'
import { LoadingSpinner } from '@/components/loading-spinner'
import { MobileLayout } from '@/components/mobile-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useFlashcardStore } from '@/stores/use-flashcard-store'
import { useCachedFetch } from '@/hooks/use-cached-fetch'
import { useSwipe } from '@/hooks/use-swipe'
import { DATA_PATHS } from '@/constants'

export function FlashcardPage() {
  const { examId, subjectId } = useParams<{ examId: string; subjectId: string }>()
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const getCustomCards = useFlashcardStore((s) => s.getCustomCards)
  const customCards = getCustomCards(examId!, subjectId!)

  const {
    data: deck,
    loading,
    error,
    retry,
  } = useCachedFetch<FlashcardDeck>(DATA_PATHS.FLASHCARDS(examId!, subjectId!))

  const allCards = useMemo<Flashcard[]>(
    () => (deck ? [...deck.cards, ...customCards] : []),
    [deck, customCards],
  )

  const goNext = () => {
    if (currentIndex >= allCards.length - 1) return
    setCurrentIndex((i) => i + 1)
    setIsFlipped(false)
  }

  const goPrev = () => {
    if (currentIndex <= 0) return
    setCurrentIndex((i) => i - 1)
    setIsFlipped(false)
  }

  const { onTouchStart, onTouchEnd } = useSwipe({
    onSwipeLeft: goNext,
    onSwipeRight: goPrev,
  })

  if (error) {
    return (
      <MobileLayout title="개념 플래시카드" showBack>
        <FetchErrorFallback error={error} onRetry={retry} />
      </MobileLayout>
    )
  }

  if (loading || !deck) {
    return (
      <MobileLayout title="개념 플래시카드" showBack>
        <LoadingSpinner />
      </MobileLayout>
    )
  }

  const card = allCards[currentIndex]
  const progress = Math.round(((currentIndex + 1) / allCards.length) * 100)
  const isCustomCard = card?.id.startsWith('custom_')

  return (
    <MobileLayout title={deck.subjectName} showBack>
      <div className="flex flex-col gap-6">
        {/* Progress + Edit button */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">
            {currentIndex + 1} / {allCards.length}
          </span>
          <div className="bg-muted mx-4 h-1.5 flex-1 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground h-7 px-2"
            onClick={() => navigate(`/exam/${examId}/flashcards/${subjectId}/edit`)}
            aria-label="카드 편집"
          >
            <PencilIcon className="mr-1 h-3.5 w-3.5" />
            편집
          </Button>
        </div>

        {/* Category + custom badge */}
        <div className="flex items-center justify-center gap-1.5">
          {card.category && (
            <Badge variant="secondary" className="text-xs">
              {card.category}
            </Badge>
          )}
          {isCustomCard && (
            <Badge variant="outline" className="border-primary/50 text-primary text-xs">
              내 카드
            </Badge>
          )}
        </div>

        {/* Card */}
        <div
          className="relative cursor-pointer select-none"
          style={{ perspective: '1000px' }}
          onClick={() => setIsFlipped((f) => !f)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          role="button"
          tabIndex={0}
          aria-label={isFlipped ? '앞면 보기' : '뒷면 보기'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setIsFlipped((f) => !f)
            }
            if (e.key === 'ArrowRight') goNext()
            if (e.key === 'ArrowLeft') goPrev()
          }}
        >
          <div
            className="relative transition-transform duration-500"
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              minHeight: '280px',
            }}
          >
            {/* Front - Term */}
            <div
              className="bg-card absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 p-8 shadow-md"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <p className="text-muted-foreground mb-6 text-xs">탭하여 정의 보기</p>
              <h2 className="text-center text-2xl leading-snug font-bold">{card.term}</h2>
            </div>

            {/* Back - Definition */}
            <div
              className="border-primary/40 bg-primary/5 absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 p-8 shadow-md"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <p className="text-muted-foreground mb-4 text-xs">탭하여 키워드 보기</p>
              <p className="text-center text-base leading-relaxed whitespace-pre-line">
                {card.definition}
              </p>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ minHeight: '280px' }} className="invisible" aria-hidden />

        {/* Navigation */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="flex-1"
            aria-label="이전 카드"
          >
            <ChevronLeftIcon className="mr-1 h-5 w-5" />
            이전
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFlipped(false)}
            aria-label="카드 초기화"
            className="shrink-0"
          >
            <RotateCcwIcon className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={goNext}
            disabled={currentIndex === allCards.length - 1}
            className="flex-1"
            aria-label="다음 카드"
          >
            다음
            <ChevronRightIcon className="ml-1 h-5 w-5" />
          </Button>
        </div>

        {/* Completion message */}
        {currentIndex === allCards.length - 1 && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center dark:border-green-900 dark:bg-green-950/30">
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              🎉 모든 카드를 학습했습니다!
            </p>
            <button
              className="mt-1 text-xs text-green-600 underline underline-offset-2 dark:text-green-500"
              onClick={() => {
                setCurrentIndex(0)
                setIsFlipped(false)
              }}
            >
              처음부터 다시 보기
            </button>
          </div>
        )}
      </div>
    </MobileLayout>
  )
}
