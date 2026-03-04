import { useState } from 'react'
import type { Curriculum } from '@/types'
import { ChevronDownIcon, SearchIcon } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { FetchErrorFallback } from '@/components/fetch-error-fallback'
import { LoadingSpinner } from '@/components/loading-spinner'
import { MobileLayout } from '@/components/mobile-layout'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useQuizStore } from '@/stores/use-quiz-store'
import { useCachedFetch } from '@/hooks/use-cached-fetch'
import { DATA_PATHS, getExamConfig } from '@/constants'

export function SubjectPage() {
  const { examId } = useParams<{ examId: string }>()
  const navigate = useNavigate()
  const chapterProgress = useQuizStore((s) => s.chapterProgress)
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set())

  const {
    data: curriculum,
    loading,
    error,
    retry,
  } = useCachedFetch<Curriculum>(DATA_PATHS.CURRICULUM(examId!))

  const toggleSubject = (subjectId: string) => {
    setExpandedSubjects((prev) => {
      const next = new Set(prev)
      if (next.has(subjectId)) {
        next.delete(subjectId)
      } else {
        next.add(subjectId)
      }
      return next
    })
  }

  if (error) {
    return (
      <MobileLayout title="과목 선택" showBack>
        <FetchErrorFallback error={error} onRetry={retry} />
      </MobileLayout>
    )
  }

  if (loading || !curriculum) {
    return (
      <MobileLayout title="과목 선택" showBack>
        <LoadingSpinner />
      </MobileLayout>
    )
  }

  return (
    <MobileLayout title="과목 선택" showBack>
      <div className="space-y-4">
        <Card
          role="link"
          tabIndex={0}
          className="border-primary/30 bg-primary/5 hover:border-primary/50 cursor-pointer transition-colors"
          onClick={() => navigate(`/exam/${examId}/dashboard`)}
          onKeyDown={(e) =>
            (e.key === 'Enter' || e.key === ' ') &&
            (e.preventDefault(), navigate(`/exam/${examId}/dashboard`))
          }
        >
          <CardHeader className="p-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">📊</span>
              <div>
                <CardTitle className="text-sm font-medium">학습 현황</CardTitle>
                <p className="text-muted-foreground text-xs">전체 진도율과 과목별 정답률 확인</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card
          role="link"
          tabIndex={0}
          className="border-primary/30 bg-primary/5 hover:border-primary/50 cursor-pointer transition-colors"
          onClick={() => navigate(`/exam/${examId}/tree`)}
          onKeyDown={(e) =>
            (e.key === 'Enter' || e.key === ' ') &&
            (e.preventDefault(), navigate(`/exam/${examId}/tree`))
          }
        >
          <CardHeader className="p-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">📚</span>
              <div>
                <CardTitle className="text-sm font-medium">개념 트리</CardTitle>
                <p className="text-muted-foreground text-xs">과목별 핵심 개념을 트리 구조로 학습</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card
          role="link"
          tabIndex={0}
          className="border-primary/30 bg-primary/5 hover:border-primary/50 cursor-pointer transition-colors"
          onClick={() => navigate(`/exam/${examId}/search`)}
          onKeyDown={(e) =>
            (e.key === 'Enter' || e.key === ' ') &&
            (e.preventDefault(), navigate(`/exam/${examId}/search`))
          }
        >
          <CardHeader className="p-3">
            <div className="flex items-center gap-2">
              <SearchIcon className="text-primary h-5 w-5" />
              <div>
                <CardTitle className="text-sm font-medium">문제 검색</CardTitle>
                <p className="text-muted-foreground text-xs">키워드로 문제를 검색하고 필터링</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="space-y-1.5">
          <h2 className="text-muted-foreground px-1 text-xs font-medium">모의고사</h2>
          <div className="grid grid-cols-2 gap-2">
            {curriculum.subjects.map((subject) => {
              const config = getExamConfig(subject.id)
              const qCount = config.questionsPerExam
              const minutes = config.durationMinutes
              return (
                <Card
                  key={`mock-${subject.id}`}
                  className="hover:border-primary/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/exam/${examId}/mock/${subject.id}`)}
                >
                  <CardHeader className="p-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">📝</span>
                      <div>
                        <CardTitle className="truncate text-xs font-medium">
                          {subject.name}
                        </CardTitle>
                        <p className="text-muted-foreground text-[10px]">
                          {qCount}문제 / {minutes}분
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-muted-foreground px-1 text-xs font-medium">문제 분류</h2>
          <div className="grid grid-cols-2 gap-2">
            {curriculum.subjects.map((subject) => (
              <Card
                key={`classify-${subject.id}`}
                className="hover:border-primary/50 cursor-pointer transition-colors"
                onClick={() => navigate(`/exam/${examId}/classify/${subject.id}`)}
              >
                <CardHeader className="p-2.5">
                  <CardTitle className="truncate text-xs font-medium">{subject.name}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-muted-foreground px-1 text-xs font-medium">기출문제</h2>
          {curriculum.subjects.map((subject) => {
            const isExpanded = expandedSubjects.has(subject.id)
            return (
              <div key={subject.id}>
                <button
                  type="button"
                  className="hover:bg-accent/50 mb-2 flex w-full items-center justify-between rounded-lg px-1 py-1.5 text-left transition-colors"
                  onClick={() => toggleSubject(subject.id)}
                  aria-expanded={isExpanded}
                >
                  <h2 className="text-base font-semibold">{subject.name}</h2>
                  <ChevronDownIcon
                    className={`text-muted-foreground h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>
                {isExpanded && (
                  <div className="space-y-2">
                    {subject.chapters.map((chapter) => {
                      const key = `${examId}/${subject.id}/${chapter.id}`
                      const prog = chapterProgress[key]
                      const answered = prog ? prog.correctIds.length + prog.wrongIds.length : 0
                      const total = prog?.totalMc ?? 0
                      const percent = total > 0 ? Math.round((answered / total) * 100) : 0
                      const wrongCount = prog?.wrongIds.length ?? 0

                      return (
                        <Card
                          key={chapter.id}
                          role="link"
                          tabIndex={0}
                          className="hover:border-primary/50 cursor-pointer transition-colors"
                          onClick={() =>
                            navigate(`/exam/${examId}/study/${subject.id}/${chapter.id}`)
                          }
                          onKeyDown={(e) =>
                            (e.key === 'Enter' || e.key === ' ') &&
                            (e.preventDefault(),
                            navigate(`/exam/${examId}/study/${subject.id}/${chapter.id}`))
                          }
                        >
                          <CardHeader className="p-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm font-medium">{chapter.name}</CardTitle>
                              <div className="flex items-center gap-1.5">
                                {wrongCount > 0 && (
                                  <Badge variant="destructive" className="text-xs">
                                    오답 {wrongCount}
                                  </Badge>
                                )}
                                {total > 0 ? (
                                  <Badge
                                    variant={percent === 100 ? 'default' : 'outline'}
                                    className="text-xs"
                                  >
                                    {percent}%
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs">
                                    학습하기
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {total > 0 && <Progress value={percent} className="mt-2 h-1.5" />}
                          </CardHeader>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </MobileLayout>
  )
}
