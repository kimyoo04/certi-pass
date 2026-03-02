import { useEffect, useState } from 'react'
import type { Curriculum } from '@/types'
import { useNavigate, useParams } from 'react-router-dom'

import { MobileLayout } from '@/components/mobile-layout'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useQuizStore } from '@/stores/use-quiz-store'
import { DATA_PATHS, getExamConfig } from '@/constants'

export function SubjectPage() {
  const { examId } = useParams<{ examId: string }>()
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null)
  const navigate = useNavigate()
  const chapterProgress = useQuizStore((s) => s.chapterProgress)

  useEffect(() => {
    fetch(DATA_PATHS.CURRICULUM(examId!))
      .then((res) => res.json())
      .then(setCurriculum)
  }, [examId])

  if (!curriculum) {
    return (
      <MobileLayout title="로딩 중..." showBack>
        <div className="flex items-center justify-center py-20">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout title="과목 선택" showBack>
      <div className="space-y-4">
        <Card
          className="border-primary/30 bg-primary/5 hover:border-primary/50 cursor-pointer transition-colors"
          onClick={() => navigate(`/exam/${examId}/dashboard`)}
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
          className="border-primary/30 bg-primary/5 hover:border-primary/50 cursor-pointer transition-colors"
          onClick={() => navigate(`/exam/${examId}/tree`)}
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

        {curriculum.subjects.map((subject) => (
          <div key={subject.id}>
            <h2 className="mb-2 text-base font-semibold">{subject.name}</h2>
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
                    className="hover:border-primary/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/exam/${examId}/study/${subject.id}/${chapter.id}`)}
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
          </div>
        ))}
      </div>
    </MobileLayout>
  )
}
