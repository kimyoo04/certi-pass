import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MobileLayout } from "@/components/mobile-layout";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <MobileLayout title="페이지를 찾을 수 없습니다">
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-5xl mb-4">404</p>
        <p className="font-semibold mb-1">요청하신 페이지가 존재하지 않습니다</p>
        <p className="text-sm text-muted-foreground mb-6">
          주소를 다시 확인해 주세요
        </p>
        <Button onClick={() => navigate("/")}>홈으로 돌아가기</Button>
      </div>
    </MobileLayout>
  );
}
