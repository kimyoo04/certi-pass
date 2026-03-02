import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MobileLayout } from "@/components/mobile-layout";
import { useQuizStore } from "@/stores/use-quiz-store";
import { QUERY_MODES } from "@/constants";

export function ResultPage() {
  const { examId, subjectId, chapterId } = useParams<{
    examId: string;
    subjectId: string;
    chapterId: string;
  }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") ?? QUERY_MODES.QUIZ;

  const chapterKey = `${examId}/${subjectId}/${chapterId}`;
  const progress = useQuizStore((s) => s.chapterProgress[chapterKey]);
  const resetChapterProgress = useQuizStore((s) => s.resetChapterProgress);

  const correct = progress?.correctIds.length ?? 0;
  const wrong = progress?.wrongIds.length ?? 0;
  const total = correct + wrong;
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

  const basePath = `/exam/${examId}/study/${subjectId}/${chapterId}`;

  return (
    <MobileLayout title="학습 결과" showBack>
      <div className="space-y-4">
        {/* Score Card */}
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-5xl mb-3">
              {percent === 100 ? "🏆" : percent >= 70 ? "🎉" : percent >= 40 ? "💪" : "📚"}
            </div>
            <p className="text-3xl font-bold mb-1">{percent}점</p>
            <p className="text-sm text-muted-foreground">
              {total}문제 중 {correct}문제 정답
            </p>
            <Progress value={percent} className="mt-4 h-3" />
          </CardContent>
        </Card>

        {/* Detail Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{correct}</p>
              <p className="text-xs text-muted-foreground">정답</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{wrong}</p>
              <p className="text-xs text-muted-foreground">오답</p>
            </CardContent>
          </Card>
        </div>

        {/* Message */}
        <div className="rounded-lg bg-muted p-4 text-sm">
          {percent === 100 ? (
            <p>완벽합니다! 모든 문제를 맞혔습니다.</p>
          ) : percent >= 70 ? (
            <p>잘 하셨습니다! 틀린 문제만 복습하면 더 좋은 결과를 얻을 수 있습니다.</p>
          ) : (
            <p>꾸준히 반복하면 실력이 늘어납니다. 오답 복습을 추천합니다.</p>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {wrong > 0 && (
            <Button
              className="w-full"
              variant="destructive"
              onClick={() => navigate(`${basePath}/quiz?mode=${QUERY_MODES.WRONG}`)}
            >
              오답만 다시 풀기 ({wrong}문제)
            </Button>
          )}
          <Button
            className="w-full"
            variant={wrong > 0 ? "outline" : "default"}
            onClick={() => navigate(`${basePath}/quiz`)}
          >
            {mode === QUERY_MODES.WRONG ? "전체 문제 풀기" : "처음부터 다시 풀기"}
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => {
              resetChapterProgress(chapterKey);
              navigate(`/exam/${examId}`);
            }}
          >
            진도 초기화 후 과목 선택으로
          </Button>
          <Button
            className="w-full"
            variant="ghost"
            onClick={() => navigate(`/exam/${examId}`)}
          >
            과목 선택으로 돌아가기
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
