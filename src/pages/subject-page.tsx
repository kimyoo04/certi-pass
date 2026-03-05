import { useState } from "react";
import type { Curriculum, Subject } from "@/types";
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
import { makeChapterKey, makeStudyPath } from "@/utils/path-utils";
import { DATA_PATHS, getExamConfig } from "@/constants";

interface SubjectGridSectionProps {
  title: string;
  description?: string;
  subjects: Subject[];
  renderCard: (subject: Subject) => React.ReactNode;
}

function SubjectGridSection({
  title,
  description,
  subjects,
  renderCard,
}: SubjectGridSectionProps) {
  return (
    <div className="space-y-1.5">
      <div className="px-1">
        <h2 className="text-muted-foreground text-xs font-medium">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-0.5 text-[11px]">{description}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">{subjects.map(renderCard)}</div>
    </div>
  );
}

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
  } = useCachedFetch<Curriculum>(examId ? DATA_PATHS.CURRICULUM(examId) : null);

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

  if (!examId) return null;

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
            {
              label: "학습 현황",
              icon: "📊",
              path: `/exam/${examId}/dashboard`,
            },
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
            <SearchIcon className="h-5 w-5" aria-hidden />
            <span className="text-xs font-medium">문제 검색</span>
          </button>
        </div>

        {/* 개념 플래시카드 */}
        <SubjectGridSection
          title="개념 플래시카드"
          subjects={curriculum.subjects}
          renderCard={(subject) => (
            <Card
              key={`flashcard-${subject.id}`}
              className="hover:border-primary/50 cursor-pointer py-0 gap-0 transition-colors"
              onClick={() =>
                navigate(`/exam/${examId}/flashcards/${subject.id}`)
              }
            >
              <CardHeader className="p-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm" aria-hidden>🃏</span>
                  <CardTitle className="truncate text-xs font-medium">
                    {subject.name}
                  </CardTitle>
                </div>
              </CardHeader>
            </Card>
          )}
        />

        {/* 모의고사 — 전체 문제를 타이머 안에 풀고 채점 */}
        <SubjectGridSection
          title="모의고사"
          description="시간 제한 내에 전체 문제를 풀고 최종 점수 확인"
          subjects={curriculum.subjects}
          renderCard={(subject) => {
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
                    <span className="text-sm" aria-hidden>📝</span>
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
          }}
        />

        {/* OX 퀴즈 */}
        <SubjectGridSection
          title="OX 퀴즈"
          description="맞으면 O, 틀리면 X — 핵심 개념을 빠르게 확인"
          subjects={curriculum.subjects}
          renderCard={(subject) => (
            <Card
              key={`ox-${subject.id}`}
              className="hover:border-primary/50 cursor-pointer py-0 gap-0 transition-colors"
              onClick={() => navigate(`/exam/${examId}/ox/${subject.id}`)}
            >
              <CardHeader className="p-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm" aria-hidden>⭕</span>
                  <CardTitle className="truncate text-xs font-medium">
                    {subject.name}
                  </CardTitle>
                </div>
              </CardHeader>
            </Card>
          )}
        />

        {/* 문제 분류 */}
        <SubjectGridSection
          title="문제 분류"
          description="개념별로 문제 분류하기"
          subjects={curriculum.subjects}
          renderCard={(subject) => (
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
          )}
        />

        {/* 기출문제 풀기 — 챕터별 1문제씩, 즉시 해설 */}
        <div className="space-y-1.5">
          <div className="px-1">
            <h2 className="text-muted-foreground text-xs font-medium">
              기출문제 풀기
            </h2>
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
                  aria-controls={`quiz-panel-${subject.id}`}
                >
                  <h2 className="text-base font-semibold">{subject.name}</h2>
                  <ChevronDownIcon
                    className={`text-muted-foreground h-5 w-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
                {isExpanded && (
                  <div
                    id={`quiz-panel-${subject.id}`}
                    className="space-y-2"
                  >
                    {subject.chapters.map((chapter) => {
                      const chapterKey = makeChapterKey(examId, subject.id, chapter.id);
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
                            navigate(makeStudyPath(examId, subject.id, chapter.id, "quiz"))
                          }
                          onKeyDown={(e) =>
                            (e.key === "Enter" || e.key === " ") &&
                            (e.preventDefault(),
                            navigate(makeStudyPath(examId, subject.id, chapter.id, "quiz")))
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
            <h2 className="text-muted-foreground text-xs font-medium">
              빈칸 뚫기
            </h2>
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
                  aria-controls={`blank-panel-${subject.id}`}
                >
                  <h2 className="text-base font-semibold">{subject.name}</h2>
                  <ChevronDownIcon
                    className={`text-muted-foreground h-5 w-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
                {isExpanded && (
                  <div
                    id={`blank-panel-${subject.id}`}
                    className="space-y-2"
                  >
                    {subject.chapters.map((chapter) => {
                      const chapterKey = makeChapterKey(examId, subject.id, chapter.id);
                      const prog = chapterProgress[chapterKey];
                      const revealedCount = prog?.revealedIds.length ?? 0;
                      const total = prog?.totalBlank ?? 0;
                      const percent =
                        total > 0
                          ? Math.round((revealedCount / total) * 100)
                          : 0;

                      return (
                        <Card
                          key={chapter.id}
                          role="link"
                          tabIndex={0}
                          className="hover:border-primary/50 cursor-pointer py-0 gap-0 transition-colors"
                          onClick={() =>
                            navigate(makeStudyPath(examId, subject.id, chapter.id, "blank"))
                          }
                          onKeyDown={(e) =>
                            (e.key === "Enter" || e.key === " ") &&
                            (e.preventDefault(),
                            navigate(makeStudyPath(examId, subject.id, chapter.id, "blank")))
                          }
                        >
                          <CardHeader className="p-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm font-medium">
                                {chapter.name}
                              </CardTitle>
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
