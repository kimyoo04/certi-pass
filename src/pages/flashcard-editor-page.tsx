import { useState } from 'react'
import type { Flashcard, FlashcardDeck } from '@/types'
import { DownloadIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { useParams } from 'react-router-dom'

import { FetchErrorFallback } from '@/components/fetch-error-fallback'
import { LoadingSpinner } from '@/components/loading-spinner'
import { MobileLayout } from '@/components/mobile-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCachedFetch } from '@/hooks/use-cached-fetch'
import { useFlashcardStore } from '@/stores/use-flashcard-store'
import { DATA_PATHS } from '@/constants'

export function FlashcardEditorPage() {
  const { examId, subjectId } = useParams<{ examId: string; subjectId: string }>()
  const [term, setTerm] = useState('')
  const [definition, setDefinition] = useState('')
  const [category, setCategory] = useState('')

  const addCard = useFlashcardStore((s) => s.addCard)
  const deleteCard = useFlashcardStore((s) => s.deleteCard)
  const getCustomCards = useFlashcardStore((s) => s.getCustomCards)
  const customCards = getCustomCards(examId!, subjectId!)

  const {
    data: deck,
    loading,
    error,
    retry,
  } = useCachedFetch<FlashcardDeck>(DATA_PATHS.FLASHCARDS(examId!, subjectId!))

  const handleAdd = () => {
    const trimmedTerm = term.trim()
    const trimmedDef = definition.trim()
    if (!trimmedTerm || !trimmedDef) return
    addCard(examId!, subjectId!, {
      term: trimmedTerm,
      definition: trimmedDef,
      category: category.trim() || undefined,
    })
    setTerm('')
    setDefinition('')
    setCategory('')
  }

  const handleExport = () => {
    if (!deck) return
    const merged: FlashcardDeck = {
      ...deck,
      cards: [...deck.cards, ...customCards],
    }
    const blob = new Blob([JSON.stringify(merged, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `flashcards.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (error) {
    return (
      <MobileLayout title="플래시카드 편집" showBack>
        <FetchErrorFallback error={error} onRetry={retry} />
      </MobileLayout>
    )
  }

  if (loading || !deck) {
    return (
      <MobileLayout title="플래시카드 편집" showBack>
        <LoadingSpinner />
      </MobileLayout>
    )
  }

  return (
    <MobileLayout title={`${deck.subjectName} 편집`} showBack>
      <div className="space-y-6">
        {/* Add form */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h2 className="text-sm font-semibold">새 카드 추가</h2>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground font-medium">
                키워드 (앞면) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="예: 부동성"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground font-medium">
                정의 (뒷면) <span className="text-red-500">*</span>
              </label>
              <textarea
                value={definition}
                onChange={(e) => setDefinition(e.target.value)}
                placeholder="예: 토지는 위치가 고정되어 이동이 불가능한 특성..."
                rows={4}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground font-medium">
                카테고리 (선택)
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="예: 토지의 특성"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button
              onClick={handleAdd}
              disabled={!term.trim() || !definition.trim()}
              className="w-full"
            >
              <PlusIcon className="h-4 w-4 mr-1.5" />
              카드 추가
            </Button>
          </CardContent>
        </Card>

        {/* Export */}
        {customCards.length > 0 && (
          <div className="rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-4 space-y-2">
            <p className="text-blue-700 dark:text-blue-400 text-sm font-medium">
              내 카드 {customCards.length}개가 추가되었습니다
            </p>
            <p className="text-blue-600 dark:text-blue-500 text-xs">
              JSON을 내보내서 <code className="font-mono">public/data/{examId}/{subjectId}/flashcards.json</code> 파일로 교체하면 영구 저장됩니다.
            </p>
            <Button variant="outline" size="sm" onClick={handleExport} className="w-full mt-1">
              <DownloadIcon className="h-4 w-4 mr-1.5" />
              JSON 내보내기 ({deck.cards.length + customCards.length}개)
            </Button>
          </div>
        )}

        {/* Custom cards list */}
        {customCards.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-medium text-muted-foreground px-1">
              내가 추가한 카드 ({customCards.length}개)
            </h2>
            {customCards.map((card) => (
              <CustomCardItem
                key={card.id}
                card={card}
                onDelete={() => deleteCard(examId!, subjectId!, card.id)}
              />
            ))}
          </div>
        )}

        {/* Official cards list */}
        <div className="space-y-2">
          <h2 className="text-xs font-medium text-muted-foreground px-1">
            기본 카드 ({deck.cards.length}개)
          </h2>
          {deck.cards.map((card) => (
            <OfficialCardItem key={card.id} card={card} />
          ))}
        </div>
      </div>
    </MobileLayout>
  )
}

function CustomCardItem({ card, onDelete }: { card: Flashcard; onDelete: () => void }) {
  return (
    <Card className="border-primary/30">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              {card.category && (
                <Badge variant="secondary" className="text-[10px] shrink-0">
                  {card.category}
                </Badge>
              )}
              <span className="text-sm font-medium truncate">{card.term}</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 whitespace-pre-line">
              {card.definition}
            </p>
          </div>
          <button
            onClick={onDelete}
            className="shrink-0 text-muted-foreground hover:text-destructive transition-colors p-1 rounded"
            aria-label="카드 삭제"
          >
            <Trash2Icon className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

function OfficialCardItem({ card }: { card: Flashcard }) {
  return (
    <Card className="opacity-60">
      <CardContent className="p-3">
        <div className="flex items-center gap-1.5 mb-1">
          {card.category && (
            <Badge variant="outline" className="text-[10px] shrink-0">
              {card.category}
            </Badge>
          )}
          <span className="text-sm font-medium truncate">{card.term}</span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 whitespace-pre-line">
          {card.definition}
        </p>
      </CardContent>
    </Card>
  )
}
