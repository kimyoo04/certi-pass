import { AlertTriangleIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface FetchErrorFallbackProps {
  error: Error
  onRetry: () => void
  message?: string
}

export function FetchErrorFallback({
  error,
  onRetry,
  message = '데이터를 불러오는 중 오류가 발생했습니다.',
}: FetchErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertTriangleIcon className="text-muted-foreground mb-3 h-10 w-10" />
      <p className="mb-1 font-semibold">{message}</p>
      <p className="text-muted-foreground mb-4 text-sm">{error.message}</p>
      <Button onClick={onRetry}>다시 시도</Button>
    </div>
  )
}
