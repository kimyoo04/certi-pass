import { useEffect, useMemo, useRef, useState } from 'react'
import type { Curriculum } from '@/types'
import { ChevronDownIcon, ChevronUpIcon, ClockIcon, PlayIcon, SearchIcon, XIcon } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { FetchErrorFallback } from '@/components/fetch-error-fallback'
import { LoadingSpinner } from '@/components/loading-spinner'
import { MobileLayout } from '@/components/mobile-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cachedFetch, useCachedFetch } from '@/hooks/use-cached-fetch'
import { DATA_PATHS } from '@/constants'

const MAX_RESULTS = 150
const HISTORY_KEY = 'certipass-search-history'
const MAX_HISTORY = 10

// ─── 검색 기록 유틸 ──────────────────────────────────────────────────────────

function loadHistory(): string[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveHistory(keyword: string, prev: string[]): string[] {
  const next = [keyword, ...prev.filter((k) => k !== keyword)].slice(0, MAX_HISTORY)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
  return next
}

function removeHistory(keyword: string, prev: string[]): string[] {
  const next = prev.filter((k) => k !== keyword)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
  return next
}

function clearHistory(): string[] {
  localStorage.removeItem(HISTORY_KEY)
  return []
}

// ─── 타입 ────────────────────────────────────────────────────────────────────

interface SearchableQuestion {
  id: string
  type: string
  content: string
  year?: number
  subjectId: string
  subjectName: string
  options?: string[]
  correctIndex?: number
  explanation?: string
  chapterId: string
}

// ─── 키워드 하이라이팅 ────────────────────────────────────────────────────────

function highlight(text: string, keyword: string): React.ReactNode {
  if (!keyword.trim()) return text
  const lower = keyword.toLowerCase()
  const lowerText = text.toLowerCase()
  const idx = lowerText.indexOf(lower)
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 dark:bg-yellow-800 rounded-[2px]">
        {text.slice(idx, idx + keyword.length)}
      </mark>
      {highlight(text.slice(idx + keyword.length), keyword)}
    </>
  )
}

// ─── 결과 카드 ───────────────────────────────────────────────────────────────

interface QuestionCardProps {
  q: SearchableQuestion
  keyword: string
  examId: string
}

function QuestionCard({ q, keyword, examId }: QuestionCardProps) {
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()

  const handleGoToQuiz = () => {
    navigate(`/exam/${examId}/study/${q.subjectId}/${q.chapterId}/quiz`)
  }

  return (
    <Card className="cursor-pointer" onClick={() => setExpanded((v) => !v)}>
      <CardContent className="p-3">
        <div className="mb-1.5 flex flex-wrap items-center gap-1">
          <Badge variant="outline" className="text-[10px]">
            {q.type === 'multiple_choice' ? '객관식' : '빈칸'}
          </Badge>
          <Badge variant="secondary" className="text-[10px]">
            {q.subjectName}
          </Badge>
          {q.year && (
            <Badge variant="secondary" className="text-[10px]">
              {q.year}년
            </Badge>
          )}
          <div className="ml-auto text-muted-foreground">
            {expanded ? <ChevronUpIcon className="h-3.5 w-3.5" /> : <ChevronDownIcon className="h-3.5 w-3.5" />}
          </div>
        </div>
        <p className="text-sm leading-relaxed">{highlight(q.content, keyword)}</p>

        {expanded && (
          <div className="mt-3 space-y-2" onClick={(e) => e.stopPropagation()}>
            {q.options && q.options.length > 0 && (
              <div className="space-y-1">
                {q.options.map((opt, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-1.5 rounded-md px-2 py-1 text-xs ${
                      idx === q.correctIndex
                        ? 'bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <span className="shrink-0 font-medium">{idx + 1}.</span>
                    <span>
                      {highlight(opt, keyword)}
                      {idx === q.correctIndex && <span className="ml-1 font-bold text-green-600">✓</span>}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {q.explanation && (
              <p className="text-muted-foreground rounded-md bg-muted/50 px-2 py-1.5 text-xs leading-relaxed">
                💡 {q.explanation}
              </p>
            )}
            <Button
              size="sm"
              variant="outline"
              className="mt-1 h-7 gap-1 text-xs"
              onClick={handleGoToQuiz}
            >
              <PlayIcon className="h-3 w-3" />
              바로 풀기
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─── 메인 페이지 ─────────────────────────────────────────────────────────────

export function SearchPage() {
  const { examId } = useParams<{ examId: string }>()
  const {
    data: curriculum,
    loading: currLoading,
    error: currError,
    retry: currRetry,
  } = useCachedFetch<Curriculum>(DATA_PATHS.CURRICULUM(examId!))

  const [allQuestions, setAllQuestions] = useState<SearchableQuestion[]>([])
  const [questionsLoading, setQuestionsLoading] = useState(false)

  const [keyword, setKeyword] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'multiple_choice' | 'fill_in_the_blank'>('all')

  const [history, setHistory] = useState<string[]>(loadHistory)
  const commitTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load all questions from all subjects
  useEffect(() => {
    if (!curriculum) return
    let cancelled = false
    setQuestionsLoading(true)

    const promises = curriculum.subjects.map((subject) =>
      cachedFetch<SearchableQuestion[]>(DATA_PATHS.ALL_QUIZ(examId!, subject.id)).then(
        (questions) =>
          questions.map((q) => ({
            ...q,
            subjectId: subject.id,
            subjectName: subject.name,
            chapterId: q.year ? `y${q.year}` : 'all',
          })),
      ),
    )

    Promise.all(promises)
      .then((results) => {
        if (!cancelled) {
          setAllQuestions(results.flat())
          setQuestionsLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setQuestionsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [curriculum, examId])

  // 검색어 변경 시 500ms 후 기록 저장
  useEffect(() => {
    if (commitTimer.current) clearTimeout(commitTimer.current)
    if (!keyword.trim()) return
    commitTimer.current = setTimeout(() => {
      setHistory((prev) => saveHistory(keyword.trim(), prev))
    }, 500)
    return () => {
      if (commitTimer.current) clearTimeout(commitTimer.current)
    }
  }, [keyword])

  const applyHistory = (term: string) => setKeyword(term)

  const years = useMemo(() => {
    const yrs = new Set<number>()
    for (const q of allQuestions) {
      if (q.year) yrs.add(q.year)
    }
    return [...yrs].sort((a, b) => b - a)
  }, [allQuestions])

  const filteredQuestions = useMemo(() => {
    let result = allQuestions

    if (subjectFilter !== 'all') {
      result = result.filter((q) => q.subjectId === subjectFilter)
    }
    if (yearFilter !== 'all') {
      const year = parseInt(yearFilter)
      result = result.filter((q) => q.year === year)
    }
    if (typeFilter !== 'all') {
      result = result.filter((q) => q.type === typeFilter)
    }
    if (keyword.trim()) {
      const lower = keyword.toLowerCase()
      result = result.filter(
        (q) =>
          q.content.toLowerCase().includes(lower) ||
          q.options?.some((opt) => opt.toLowerCase().includes(lower)) ||
          q.explanation?.toLowerCase().includes(lower),
      )
    }

    return result.slice(0, MAX_RESULTS)
  }, [allQuestions, keyword, subjectFilter, yearFilter, typeFilter])

  if (currError) {
    return (
      <MobileLayout title="문제 검색" showBack>
        <FetchErrorFallback error={currError} onRetry={currRetry} />
      </MobileLayout>
    )
  }

  if (currLoading || !curriculum) {
    return (
      <MobileLayout title="문제 검색" showBack>
        <LoadingSpinner />
      </MobileLayout>
    )
  }

  const hasFilters = keyword.trim() || subjectFilter !== 'all' || yearFilter !== 'all' || typeFilter !== 'all'

  return (
    <MobileLayout title="문제 검색" showBack>
      <div className="space-y-3">
        {/* 검색 입력 */}
        <div className="relative">
          <SearchIcon className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            placeholder="키워드로 문제 검색..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="h-9 pl-8 pr-8"
          />
          {keyword && (
            <button
              className="text-muted-foreground hover:text-foreground absolute top-2.5 right-2.5"
              onClick={() => setKeyword('')}
              aria-label="검색어 지우기"
            >
              <XIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* 필터 */}
        <div className="flex gap-2">
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="h-9 flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 과목</SelectItem>
              {curriculum.subjects.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="h-9 w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}년
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 타입 필터 */}
        <div className="flex gap-1.5">
          {(['all', 'multiple_choice', 'fill_in_the_blank'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${
                typeFilter === t
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {t === 'all' ? '전체' : t === 'multiple_choice' ? '객관식' : '빈칸'}
            </button>
          ))}
        </div>

        {/* 결과 영역 */}
        {questionsLoading ? (
          <LoadingSpinner />
        ) : !hasFilters ? (
          /* 검색어 없을 때: 최근 검색 기록 */
          history.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1 text-xs">
                  <ClockIcon className="h-3 w-3" />
                  최근 검색
                </span>
                <button
                  className="text-muted-foreground hover:text-foreground text-xs"
                  onClick={() => setHistory(clearHistory())}
                >
                  전체 삭제
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {history.map((term) => (
                  <div key={term} className="bg-muted flex items-center gap-1 rounded-full pl-3 pr-1.5 py-1">
                    <button
                      className="text-sm"
                      onClick={() => applyHistory(term)}
                    >
                      {term}
                    </button>
                    <button
                      className="text-muted-foreground hover:text-foreground flex h-4 w-4 items-center justify-center rounded-full"
                      onClick={() => setHistory((prev) => removeHistory(term, prev))}
                      aria-label={`${term} 삭제`}
                    >
                      <XIcon className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground py-10 text-center text-sm">
              검색어를 입력하거나 필터를 선택하세요
            </p>
          )
        ) : filteredQuestions.length === 0 ? (
          <p className="text-muted-foreground py-10 text-center text-sm">검색 결과가 없습니다</p>
        ) : (
          <>
            <p className="text-muted-foreground text-xs">
              {filteredQuestions.length}개 결과
              {filteredQuestions.length === MAX_RESULTS && ` (최대 ${MAX_RESULTS}개 표시)`}
            </p>
            <div className="space-y-2">
              {filteredQuestions.map((q) => (
                <QuestionCard key={q.id} q={q} keyword={keyword} examId={examId!} />
              ))}
            </div>
          </>
        )}
      </div>
    </MobileLayout>
  )
}
