import type { Exam } from '@/types'
import { useNavigate } from 'react-router-dom'

import { FetchErrorFallback } from '@/components/fetch-error-fallback'
import { LoadingSpinner } from '@/components/loading-spinner'
import { MobileLayout } from '@/components/mobile-layout'
import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCachedFetch } from '@/hooks/use-cached-fetch'
import { DATA_PATHS } from '@/constants'

export function HomePage() {
  const navigate = useNavigate()
  const { data: exams, loading, error, retry } = useCachedFetch<Exam[]>(DATA_PATHS.EXAMS)

  return (
    <MobileLayout title="CertiPass">
      <div className="mb-6">
        <p className="text-muted-foreground text-sm">자격증을 선택하여 학습을 시작하세요</p>
      </div>

      {error ? (
        <FetchErrorFallback error={error} onRetry={retry} />
      ) : loading || !exams ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-3">
          {exams.map((exam) => (
            <Card
              key={exam.id}
              role="link"
              tabIndex={exam.isActive ? 0 : -1}
              className={`cursor-pointer transition-colors ${
                exam.isActive ? 'hover:border-primary/50' : 'cursor-not-allowed opacity-50'
              }`}
              onClick={() => exam.isActive && navigate(`/exam/${exam.id}`)}
              onKeyDown={(e) =>
                exam.isActive &&
                (e.key === 'Enter' || e.key === ' ') &&
                (e.preventDefault(), navigate(`/exam/${exam.id}`))
              }
              aria-label={`${exam.name} - ${exam.isActive ? '학습 가능' : '준비 중'}`}
            >
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{exam.name}</CardTitle>
                  <Badge variant={exam.isActive ? 'default' : 'secondary'}>
                    {exam.isActive ? '학습 가능' : '준비 중'}
                  </Badge>
                </div>
                <CardDescription className="text-sm">{exam.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </MobileLayout>
  )
}
