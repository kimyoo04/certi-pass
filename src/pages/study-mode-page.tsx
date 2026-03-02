import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MobileLayout } from "@/components/mobile-layout";
import { useQuizStore } from "@/stores/use-quiz-store";

export function StudyModePage() {
  const { examId, subjectId, chapterId } = useParams<{
    examId: string;
    subjectId: string;
    chapterId: string;
  }>();
  const navigate = useNavigate();
  const basePath = `/exam/${examId}/study/${subjectId}/${chapterId}`;

  const chapterKey = `${examId}/${subjectId}/${chapterId}`;
  const progress = useQuizStore((s) => s.chapterProgress[chapterKey]);
  const shuffleEnabled = useQuizStore((s) => s.shuffleEnabled);
  const toggleShuffle = useQuizStore((s) => s.toggleShuffle);
  const wrongCount = progress?.wrongIds.length ?? 0;

  const modes = [
    {
      id: "blank",
      title: "빈칸 뚫기",
      description: "핵심 키워드를 빈칸으로 가린 문장을 학습합니다",
      icon: "📝",
      path: `${basePath}/blank`,
    },
    {
      id: "quiz",
      title: "기출 문제 풀기",
      description: "1문제씩 객관식 기출문제를 풀어봅니다",
      icon: "📋",
      path: `${basePath}/quiz`,
    },
    {
      id: "tree",
      title: "개념 트리 보기",
      description: "이 과목의 핵심 개념을 트리 구조로 확인합니다",
      icon: "📚",
      path: `/exam/${examId}/tree/${subjectId}`,
    },
  ];

  return (
    <MobileLayout title="학습 모드 선택" showBack>
      <div className="space-y-3">
        {modes.map((mode) => (
          <Card
            key={mode.id}
            className="cursor-pointer transition-colors hover:border-primary/50"
            onClick={() => navigate(mode.path)}
          >
            <CardHeader className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{mode.icon}</span>
                <div>
                  <CardTitle className="text-base">{mode.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {mode.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}

        {wrongCount > 0 && (
          <Card
            className="cursor-pointer border-red-200 transition-colors hover:border-red-400 dark:border-red-900"
            onClick={() => navigate(`${basePath}/quiz?mode=wrong`)}
          >
            <CardHeader className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔄</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">오답만 풀기</CardTitle>
                    <Badge variant="destructive" className="text-xs">
                      {wrongCount}문제
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    틀린 문제만 다시 풀어봅니다
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        <button
          type="button"
          role="switch"
          aria-checked={shuffleEnabled}
          aria-label="문제 셔플"
          className="flex w-full items-center justify-between rounded-lg border p-3 text-left cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={toggleShuffle}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🔀</span>
            <div>
              <p className="text-sm font-medium">문제 셔플</p>
              <p className="text-xs text-muted-foreground">문제 순서를 무작위로 섞습니다</p>
            </div>
          </div>
          <div
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
              shuffleEnabled ? "bg-primary" : "bg-muted"
            }`}
          >
            <div
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                shuffleEnabled ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </div>
        </button>

        {progress && (progress.correctIds.length + progress.wrongIds.length) > 0 && (
          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="font-medium mb-1">학습 현황</p>
            <div className="flex gap-4 text-muted-foreground">
              <span>정답: <span className="text-green-600 font-medium">{progress.correctIds.length}</span></span>
              <span>오답: <span className="text-red-600 font-medium">{progress.wrongIds.length}</span></span>
              {progress.revealedIds.length > 0 && (
                <span>빈칸: <span className="font-medium">{progress.revealedIds.length}</span></span>
              )}
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
