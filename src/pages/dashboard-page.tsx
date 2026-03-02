import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MobileLayout } from "@/components/mobile-layout";
import { useQuizStore } from "@/stores/use-quiz-store";
import { useMockExamStore } from "@/stores/use-mock-exam-store";
import { aggregateBySubject, getOverallStats, getWeakAreas } from "@/utils/stats-utils";
import type { Curriculum } from "@/types";
import { DATA_PATHS } from "@/constants";

export function DashboardPage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const chapterProgress = useQuizStore((s) => s.chapterProgress);
  const examHistory = useMockExamStore((s) => s.examHistory);

  useEffect(() => {
    fetch(DATA_PATHS.CURRICULUM(examId!))
      .then((res) => res.json())
      .then(setCurriculum);
  }, [examId]);

  const subjectStats = useMemo(
    () => (curriculum ? aggregateBySubject(chapterProgress, curriculum) : []),
    [chapterProgress, curriculum]
  );

  const overall = useMemo(() => getOverallStats(subjectStats), [subjectStats]);
  const weakAreas = useMemo(() => getWeakAreas(subjectStats), [subjectStats]);

  const recentExams = useMemo(
    () =>
      examHistory
        .filter((e) => e.examId === examId)
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5),
    [examHistory, examId]
  );

  if (!curriculum) {
    return (
      <MobileLayout title="학습 현황" showBack>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="학습 현황" showBack>
      <div className="space-y-4">
        {/* Overall Stats */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium">전체 학습 현황</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {overall.totalAttempted === 0 ? (
              <p className="text-sm text-muted-foreground">아직 풀이한 문제가 없습니다.</p>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{overall.accuracy}%</span>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>
                      총 <span className="font-medium text-foreground">{overall.totalAttempted}</span>문제 풀이
                    </p>
                    <p>
                      <span className="text-green-600 dark:text-green-400">{overall.totalCorrect}</span> 정답 /{" "}
                      <span className="text-red-600 dark:text-red-400">{overall.totalWrong}</span> 오답
                    </p>
                  </div>
                </div>
                <Progress value={overall.accuracy} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weak Areas */}
        {weakAreas.length > 0 && (
          <Card className="border-amber-200 dark:border-amber-900">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-400">
                약점 과목 (정답률 60% 미만)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-2">
                {weakAreas.map((s) => (
                  <div key={s.subjectId} className="flex items-center justify-between">
                    <span className="text-sm">{s.subjectName}</span>
                    <Badge variant="destructive" className="text-xs">
                      {s.accuracy}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Per-Subject Stats */}
        <div>
          <h2 className="mb-2 text-sm font-medium text-muted-foreground px-1">과목별 현황</h2>
          <div className="space-y-2">
            {subjectStats.map((s) => (
              <Card
                key={s.subjectId}
                className="cursor-pointer transition-colors hover:border-primary/50"
                onClick={() => navigate(`/exam/${examId}`)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{s.subjectName}</span>
                    <div className="flex items-center gap-1.5">
                      {s.totalAttempted > 0 && (
                        <Badge
                          variant={s.accuracy >= 80 ? "default" : s.accuracy >= 60 ? "secondary" : "destructive"}
                          className="text-xs"
                        >
                          {s.accuracy}%
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {s.totalAttempted}문제
                      </span>
                    </div>
                  </div>
                  {s.totalAttempted > 0 ? (
                    <Progress value={s.accuracy} className="h-1.5" />
                  ) : (
                    <p className="text-xs text-muted-foreground">아직 풀이 기록 없음</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mock Exam History */}
        {recentExams.length > 0 && (
          <div>
            <h2 className="mb-2 text-sm font-medium text-muted-foreground px-1">최근 모의고사</h2>
            <div className="space-y-2">
              {recentExams.map((exam) => {
                const percentage = Math.round((exam.correctCount / exam.totalQuestions) * 100);
                const date = new Date(exam.timestamp);
                const minutes = Math.floor(exam.timeSpentSeconds / 60);
                return (
                  <Card key={exam.id}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{exam.subjectName}</span>
                        <Badge
                          variant={percentage >= 60 ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {exam.correctCount}/{exam.totalQuestions} ({percentage}%)
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>
                          {date.getMonth() + 1}/{date.getDate()} {date.getHours()}:{String(date.getMinutes()).padStart(2, "0")}
                        </span>
                        <span>{minutes}분 소요</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
