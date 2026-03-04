import { useMemo, useState } from 'react'
import type { Flashcard, FlashcardDeck } from '@/types'
import { CheckIcon, DownloadIcon, PencilIcon, PlusIcon, Trash2Icon, XIcon } from 'lucide-react'
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

const NEW_CATEGORY_VALUE = '__new__'

function CategorySelect({
  value,
  onChange,
  categories,
}: {
  value: string
  onChange: (v: string) => void
  categories: string[]
}) {
  const [addingNew, setAddingNew] = useState(!categories.includes(value) && value !== '')
  const [newInput, setNewInput] = useState(addingNew ? value : '')

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === NEW_CATEGORY_VALUE) {
      setAddingNew(true)
      setNewInput('')
      onChange('')
    } else {
      setAddingNew(false)
      onChange(e.target.value)
    }
  }

  const handleConfirmNew = () => {
    const trimmed = newInput.trim()
    if (!trimmed) return
    onChange(trimmed)
    setAddingNew(false)
  }

  const handleCancelNew = () => {
    setAddingNew(false)
    setNewInput('')
    onChange('')
  }

  if (addingNew) {
    return (
      <div className="flex gap-2">
        <input
          type="text"
          value={newInput}
          onChange={(e) => setNewInput(e.target.value)}
          placeholder="새 카테고리 이름"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); handleConfirmNew() }
            if (e.key === 'Escape') handleCancelNew()
          }}
          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="button"
          onClick={handleConfirmNew}
          disabled={!newInput.trim()}
          className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent disabled:opacity-40 transition-colors"
          aria-label="카테고리 확인"
        >
          <CheckIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleCancelNew}
          className="rounded-md border px-3 py-2 text-sm hover:bg-accent transition-colors"
          aria-label="취소"
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <select
      value={value}
      onChange={handleSelectChange}
      className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
    >
      <option value="">카테고리 없음</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
      <option value={NEW_CATEGORY_VALUE}>+ 새 카테고리 추가</option>
    </select>
  )
}

export function FlashcardEditorPage() {
  const { examId, subjectId } = useParams<{ examId: string; subjectId: string }>()
  const [term, setTerm] = useState('')
  const [definition, setDefinition] = useState('')
  const [category, setCategory] = useState('')

  const addCard = useFlashcardStore((s) => s.addCard)
  const updateCard = useFlashcardStore((s) => s.updateCard)
  const deleteCard = useFlashcardStore((s) => s.deleteCard)
  const getCustomCards = useFlashcardStore((s) => s.getCustomCards)
  const customCards = getCustomCards(examId!, subjectId!)

  const {
    data: deck,
    loading,
    error,
    retry,
  } = useCachedFetch<FlashcardDeck>(DATA_PATHS.FLASHCARDS(examId!, subjectId!))

  const categories = useMemo<string[]>(() => {
    if (!deck) return []
    const all = [...deck.cards, ...customCards]
      .map((c) => c.category)
      .filter((c): c is string => !!c)
    return [...new Set(all)].sort()
  }, [deck, customCards])

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
              <label className="text-xs text-muted-foreground font-medium">카테고리 (선택)</label>
              <CategorySelect value={category} onChange={setCategory} categories={categories} />
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
              JSON을 내보내서{' '}
              <code className="font-mono">
                public/data/{examId}/{subjectId}/flashcards.json
              </code>{' '}
              파일로 교체하면 영구 저장됩니다.
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
                categories={categories}
                onUpdate={(patch) => updateCard(examId!, subjectId!, card.id, patch)}
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

function CustomCardItem({
  card,
  categories,
  onUpdate,
  onDelete,
}: {
  card: Flashcard
  categories: string[]
  onUpdate: (patch: Omit<Flashcard, 'id'>) => void
  onDelete: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [term, setTerm] = useState(card.term)
  const [definition, setDefinition] = useState(card.definition)
  const [category, setCategory] = useState(card.category ?? '')

  const handleSave = () => {
    const trimmedTerm = term.trim()
    const trimmedDef = definition.trim()
    if (!trimmedTerm || !trimmedDef) return
    onUpdate({ term: trimmedTerm, definition: trimmedDef, category: category.trim() || undefined })
    setEditing(false)
  }

  const handleCancel = () => {
    setTerm(card.term)
    setDefinition(card.definition)
    setCategory(card.category ?? '')
    setEditing(false)
  }

  if (editing) {
    return (
      <Card className="border-primary/50">
        <CardContent className="p-3 space-y-2">
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="키워드 (앞면)"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            autoFocus
          />
          <textarea
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            placeholder="정의 (뒷면)"
            rows={3}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          <CategorySelect value={category} onChange={setCategory} categories={categories} />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!term.trim() || !definition.trim()}
              className="flex-1"
            >
              <CheckIcon className="h-3.5 w-3.5 mr-1" />
              저장
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancel} className="flex-1">
              <XIcon className="h-3.5 w-3.5 mr-1" />
              취소
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

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
          <div className="flex shrink-0 gap-0.5">
            <button
              onClick={() => setEditing(true)}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
              aria-label="카드 수정"
            >
              <PencilIcon className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onDelete}
              className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded"
              aria-label="카드 삭제"
            >
              <Trash2Icon className="h-3.5 w-3.5" />
            </button>
          </div>
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
