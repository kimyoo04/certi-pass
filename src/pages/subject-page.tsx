import { useState } from "react";
import type { Curriculum } from "@/types";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { FetchErrorFallback } from "@/components/fetch-error-fallback";
import { LoadingSpinner } from "@/components/loading-spinner";
import { MobileLayout } from "@/components/mobile-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuizStore } from "@/stores/use-quiz-store";
import { useCachedFetch } from "@/hooks/use-cached-fetch";
import { DATA_PATHS, getExamConfig } from "@/constants";

export function SubjectPage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const chapterProgress = useQuizStore((s) => s.chapterProgress);
  // 접두사로 두 어코디언을 독립적으로 관리: 'quiz:s1', 'blank:s1'
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(
    new Set(),
  );

  const {
    data: curriculum,
    loading,
    error,
    retry,
  } = useCachedFetch<Curriculum>(DATA_PATHS.CURRICULUM(examId!));

  const toggle = (key: string) => {
    setExpandedSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  if (error) {
    return (
      <MobileLayout title="과목 선택" showBack>
        <FetchErrorFallback error={error} onRetry={retry} />
      </MobileLayout>
    );
  }

  if (loading || !curriculum) {
    return (
      <MobileLayout title="과목 선택" showBack>
        <LoadingSpinner />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="과목 선택" showBack>
      <div className="space-y-8">
        {/* 상단 유틸리티 버튼 */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "학습 현황", icon: "📊", path: `/exam/${examId}/dashboard` },
            { label: "개념 트리", icon: "📚", path: `/exam/${examId}/tree` },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              className="bg-muted/60 hover:bg-muted flex flex-col items-center gap-1.5 rounded-xl py-3 transition-colors"
              onClick={() => navigate(item.path)}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
          <button
            type="button"
            className="bg-muted/60 hover:bg-muted flex flex-col items-center gap-1.5 rounded-xl py-3 transition-colors"
            onClick={() => navigate(`/exam/${examId}/search`)}
          >
            <SearchIcon className="h-5 w-5" />
            <span className="text-xs font-medium">문제 검색</span>
          </button>
        </div>

        {/* 개념 플래시카드 */}
        <div className="space-y-1.5">
          <h2 className="text-muted-foreground px-1 text-xs font-medium">
            개념 플래시카드
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {curriculum.subjects.map((subject) => (
              <Card
                key={`flashcard-${subject.id}`}
                className="hover:border-primary/50 cursor-pointer py-0 gap-0 transition-colors"
                onClick={() =>
                  navigate(`/exam/${examId}/flashcards/${subject.id}`)
                }
              >
                <CardHeader className="p-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">🃏</span>
                    <CardTitle className="truncate text-xs font-medium">
                      {subject.name}
                    </CardTitle>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* 모의고사 — 전체 문제를 타이머 안에 풀고 채점 */}
        <div className="space-y-1.5">
          <div className="px-1">
            <h2 className="text-muted-foreground text-xs font-medium">모의고사</h2>
            <p className="text-muted-foreground mt-0.5 text-[11px]">
              시간 제한 내에 전체 문제를 풀고 최종 점수 확인
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {curriculum.subjects.map((subject) => {
              const config = getExamConfig(subject.id);
              const qCount = config.questionsPerExam;
              const minutes = config.durationMinutes;
              return (
                <Card
                  key={`mock-${subject.id}`}
                  className="hover:border-primary/50 cursor-pointer py-0 gap-0 transition-colors"
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
                          {qCount}문제 · {minutes}분 제한
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* OX 퀴즈 */}
        <div className="space-y-1.5">
          <div className="px-1">
            <h2 className="text-muted-foreground text-xs font-medium">OX 퀴즈</h2>
            <p className="text-muted-foreground mt-0.5 text-[11px]">
              맞으면 O, 틀리면 X — 핵심 개념을 빠르게 확인
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {curriculum.subjects.map((subject) => (
              <Card
                key={`ox-${subject.id}`}
                className="hover:border-primary/50 cursor-pointer py-0 gap-0 transition-colors"
                onClick={() => navigate(`/exam/${examId}/ox/${subject.id}`)}
              >
                <CardHeader className="p-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">⭕</span>
                    <CardTitle className="truncate text-xs font-medium">{subject.name}</CardTitle>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* 문제 분류 */}
        <div className="space-y-1.5">
          <h2 className="text-muted-foreground px-1 text-xs font-medium">
            문제 분류
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {curriculum.subjects.map((subject) => (
              <Card
                key={`classify-${subject.id}`}
                className="hover:border-primary/50 cursor-pointer py-0 gap-0 transition-colors"
                onClick={() =>
                  navigate(`/exam/${examId}/classify/${subject.id}`)
                }
              >
                <CardHeader className="p-2.5">
                  <CardTitle className="truncate text-xs font-medium">
                    {subject.name}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* 기출문제 풀기 — 챕터별 1문제씩, 즉시 해설 */}
        <div className="space-y-1.5">
          <div className="px-1">
            <h2 className="text-muted-foreground text-xs font-medium">기출문제 풀기</h2>
            <p className="text-muted-foreground mt-0.5 text-[11px]">
              챕터별로 1문제씩 풀고 즉시 해설 확인
            </p>
          </div>
          {curriculum.subjects.map((subject) => {
            const key = `quiz:${subject.id}`;
            const isExpanded = expandedSubjects.has(key);
            return (
              <div key={subject.id}>
                <button
                  type="button"
                  className="hover:bg-accent/50 mb-2 flex w-full items-center justify-between rounded-lg px-1 py-1.5 text-left transition-colors"
                  onClick={() => toggle(key)}
                  aria-expanded={isExpanded}
                >
                  <h2 className="text-base font-semibold">{subject.name}</h2>
                  <ChevronDownIcon
                    className={`text-muted-foreground h-5 w-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>
                {isExpanded && (
                  <div className="space-y-2">
                    {subject.chapters.map((chapter) => {
                      const chapterKey = `${examId}/${subject.id}/${chapter.id}`;
                      const prog = chapterProgress[chapterKey];
                      const answered = prog
                        ? prog.correctIds.length + prog.wrongIds.length
                        : 0;
                      const total = prog?.totalMc ?? 0;
                      const percent =
                        total > 0 ? Math.round((answered / total) * 100) : 0;
                      const wrongCount = prog?.wrongIds.length ?? 0;

                      return (
                        <Card
                          key={chapter.id}
                          role="link"
                          tabIndex={0}
                          className="hover:border-primary/50 cursor-pointer py-0 gap-0 transition-colors"
                          onClick={() =>
                            navigate(
                              `/exam/${examId}/study/${subject.id}/${chapter.id}/quiz`,
                            )
                          }
                          onKeyDown={(e) =>
                            (e.key === "Enter" || e.key === " ") &&
                            (e.preventDefault(),
                            navigate(
                              `/exam/${examId}/study/${subject.id}/${chapter.id}/quiz`,
                            ))
                          }
                        >
                          <CardHeader className="p-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm font-medium">
                                {chapter.name}
                              </CardTitle>
                              <div className="flex items-center gap-1.5">
                                {wrongCount > 0 && (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs"
                                  >
                                    오답 {wrongCount}
                                  </Badge>
                                )}
                                {total > 0 ? (
                                  <Badge
                                    variant={
                                      percent === 100 ? "default" : "outline"
                                    }
                                    className="text-xs"
                                  >
                                    {percent}%
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs">
                                    시작하기
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {total > 0 && (
                              <Progress
                                value={percent}
                                className="mt-2 h-1.5"
                              />
                            )}
                          </CardHeader>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 빈칸 뚫기 — 챕터별 핵심 키워드 학습 */}
        <div className="space-y-1.5">
          <div className="px-1">
            <h2 className="text-muted-foreground text-xs font-medium">빈칸 뚫기</h2>
            <p className="text-muted-foreground mt-0.5 text-[11px]">
              핵심 키워드를 가리고 떠올리며 개념 암기
            </p>
          </div>
          {curriculum.subjects.map((subject) => {
            const key = `blank:${subject.id}`;
            const isExpanded = expandedSubjects.has(key);
            return (
              <div key={subject.id}>
                <button
                  type="button"
                  className="hover:bg-accent/50 mb-2 flex w-full items-center justify-between rounded-lg px-1 py-1.5 text-left transition-colors"
                  onClick={() => toggle(key)}
                  aria-expanded={isExpanded}
                >
                  <h2 className="text-base font-semibold">{subject.name}</h2>
                  <ChevronDownIcon
                    className={`text-muted-foreground h-5 w-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>
                {isExpanded && (
                  <div className="space-y-2">
                    {subject.chapters.map((chapter) => {
                      const chapterKey = `${examId}/${subject.id}/${chapter.id}`;
                      const prog = chapterProgress[chapterKey];
                      const revealedCount = prog?.revealedIds.length ?? 0;
                      const total = prog?.totalBlank ?? 0;
                      const percent =
                        total > 0 ? Math.round((revealedCount / total) * 100) : 0;

                      return (
                        <Card
                          key={chapter.id}
                          role="link"
                          tabIndex={0}
                          className="hover:border-primary/50 cursor-pointer py-0 gap-0 transition-colors"
                          onClick={() =>
                            navigate(
                              `/exam/${examId}/study/${subject.id}/${chapter.id}/blank`,
                            )
                          }
                          onKeyDown={(e) =>
                            (e.key === "Enter" || e.key === " ") &&
                            (e.preventDefault(),
                            navigate(
                              `/exam/${examId}/study/${subject.id}/${chapter.id}/blank`,
                            ))
                          }
                        >
                          <CardHeader className="p-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm font-medium">
                                {chapter.name}
                              </CardTitle>
                              {total > 0 ? (
                                <Badge
                                  variant={percent === 100 ? "default" : "outline"}
                                  className="text-xs"
                                >
                                  {percent}%
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  시작하기
                                </Badge>
                              )}
                            </div>
                            {total > 0 && (
                              <Progress
                                value={percent}
                                className="mt-2 h-1.5"
                              />
                            )}
                          </CardHeader>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </MobileLayout>
  );
}
