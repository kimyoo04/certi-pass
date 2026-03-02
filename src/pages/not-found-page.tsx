import { useNavigate } from 'react-router-dom'

import { MobileLayout } from '@/components/mobile-layout'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <MobileLayout title="페이지를 찾을 수 없습니다">
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="mb-4 text-5xl">404</p>
        <p className="mb-1 font-semibold">요청하신 페이지가 존재하지 않습니다</p>
        <p className="text-muted-foreground mb-6 text-sm">주소를 다시 확인해 주세요</p>
        <Button onClick={() => navigate('/')}>홈으로 돌아가기</Button>
      </div>
    </MobileLayout>
  )
}
