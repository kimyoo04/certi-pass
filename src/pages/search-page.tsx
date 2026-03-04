import { useEffect, useMemo, useState } from 'react'
import type { Curriculum } from '@/types'
import { SearchIcon } from 'lucide-react'
import { useParams } from 'react-router-dom'

import { FetchErrorFallback } from '@/components/fetch-error-fallback'
import { LoadingSpinner } from '@/components/loading-spinner'
import { MobileLayout } from '@/components/mobile-layout'
import { Badge } from '@/components/ui/badge'
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

const MAX_RESULTS = 50

interface SearchableQuestion {
  id: string
  type: string
  content: string
  year?: number
  subjectId: string
  subjectName: string
}

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

  // Load all questions from all subjects
  useEffect(() => {
    if (!curriculum) return
    let cancelled = false
    setQuestionsLoading(true)

    const promises = curriculum.subjects.map((subject) =>
      cachedFetch<SearchableQuestion[]>(DATA_PATHS.ALL_QUIZ(examId!, subject.id)).then(
        (questions) =>
          questions.map((q) => ({ ...q, subjectId: subject.id, subjectName: subject.name })),
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

  // Get unique years
  const years = useMemo(() => {
    const yrs = new Set<number>()
    for (const q of allQuestions) {
      if (q.year) yrs.add(q.year)
    }
    return [...yrs].sort((a, b) => b - a)
  }, [allQuestions])

  // Filter questions
  const filteredQuestions = useMemo(() => {
    let result = allQuestions

    if (subjectFilter !== 'all') {
      result = result.filter((q) => q.subjectId === subjectFilter)
    }

    if (yearFilter !== 'all') {
      const year = parseInt(yearFilter)
      result = result.filter((q) => q.year === year)
    }

    if (keyword.trim()) {
      const lower = keyword.toLowerCase()
      result = result.filter((q) => q.content.toLowerCase().includes(lower))
    }

    return result.slice(0, MAX_RESULTS)
  }, [allQuestions, keyword, subjectFilter, yearFilter])

  const getTypeBadge = (type: string) => {
    return type === 'multiple_choice' ? '객관식' : '빈칸'
  }

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

  const hasFilters = keyword.trim() || subjectFilter !== 'all' || yearFilter !== 'all'

  return (
    <MobileLayout title="문제 검색" showBack>
      <div className="space-y-3">
        {/* Search input */}
        <div className="relative">
          <SearchIcon className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            placeholder="키워드로 문제 검색..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="h-9 pl-8"
          />
        </div>

        {/* Filters */}
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

        {/* Results */}
        {questionsLoading ? (
          <LoadingSpinner />
        ) : !hasFilters ? (
          <p className="text-muted-foreground py-10 text-center text-sm">
            검색어를 입력하거나 필터를 선택하세요
          </p>
        ) : filteredQuestions.length === 0 ? (
          <p className="text-muted-foreground py-10 text-center text-sm">검색 결과가 없습니다</p>
        ) : (
          <>
            <p className="text-muted-foreground text-xs">
              {filteredQuestions.length === MAX_RESULTS
                ? `최대 ${MAX_RESULTS}개 표시`
                : `${filteredQuestions.length}개 결과`}
            </p>
            <div className="space-y-2">
              {filteredQuestions.map((q) => (
                <Card key={q.id}>
                  <CardContent className="p-3">
                    <div className="mb-1.5 flex flex-wrap items-center gap-1">
                      <Badge variant="outline" className="text-[10px]">
                        {getTypeBadge(q.type)}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        {q.subjectName}
                      </Badge>
                      {q.year && (
                        <Badge variant="secondary" className="text-[10px]">
                          {q.year}년
                        </Badge>
                      )}
                    </div>
                    <p className="line-clamp-2 text-sm">{q.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </MobileLayout>
  )
}
