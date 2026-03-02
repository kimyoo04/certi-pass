import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Tag, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MobileLayout } from "@/components/mobile-layout";
import { TreeNodePicker } from "@/components/tree-node-picker";
import { useClassifyStore } from "@/stores/use-classify-store";
import { useTreeStore } from "@/stores/use-tree-store";
import { flattenTree } from "@/utils/tree-utils";
import { allSubjects } from "@/data/exam-tree";
import type { TreeNode } from "@/types/tree";
import { DATA_PATHS } from "@/constants";

interface QuizQuestion {
  id: string;
  type: string;
  year: number;
  content: string;
  options?: { text: string }[];
  correctIndex?: number;
}

function getNodeLabel(flatNodes: TreeNode[], nodeId: string): string {
  const node = flatNodes.find((n) => n.id === nodeId);
  return node?.label ?? nodeId;
}

export function ClassifyPage() {
  const { examId, subjectId } = useParams<{ examId: string; subjectId: string }>();
  const subject = allSubjects.find((s) => s.id === subjectId);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

  const { overrides, defaults, loadDefaults, getNodeId, setClassification, removeOverride } =
    useClassifyStore();
  const tree = useTreeStore((s) => s.getTree(subjectId!));
  const flatNodes = useMemo(() => flattenTree(tree), [tree]);

  // Load questions
  useEffect(() => {
    if (!examId || !subjectId) return;
    let cancelled = false;
    fetch(DATA_PATHS.ALL_QUIZ(examId!, subjectId!))
      .then((res) => res.json())
      .then((data: QuizQuestion[]) => {
        if (!cancelled) {
          setQuestions(data);
          setLoading(false);
        }
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [examId, subjectId]);

  // Load default classifications
  useEffect(() => {
    if (!examId || !subjectId) return;
    fetch(DATA_PATHS.QUESTION_TREE_MAP(examId!, subjectId!))
      .then((res) => res.json())
      .then((data: { classified: Record<string, string> }) => {
        if (data.classified) loadDefaults(data.classified);
      })
      .catch(() => {});
  }, [examId, subjectId, loadDefaults]);

  // Stats
  const stats = useMemo(() => {
    const total = questions.length;
    let classified = 0;
    for (const q of questions) {
      if (overrides[q.id] || defaults[q.id]) classified++;
    }
    return { total, classified, unclassified: total - classified };
  }, [questions, overrides, defaults]);

  // Years for filter
  const years = useMemo(() => {
    const yrs = new Set(questions.map((q) => q.year));
    return [...yrs].sort((a, b) => b - a);
  }, [questions]);

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    let result = questions;
    if (filter === "unclassified") {
      result = result.filter((q) => !getNodeId(q.id));
    } else if (filter.startsWith("y")) {
      const year = parseInt(filter.slice(1));
      result = result.filter((q) => q.year === year);
    }
    return result;
  }, [questions, filter, getNodeId]);

  const openPicker = useCallback((questionId: string) => {
    setActiveQuestionId(questionId);
    setPickerOpen(true);
  }, []);

  const handleNodeSelect = useCallback(
    (nodeId: string) => {
      if (activeQuestionId) {
        setClassification(activeQuestionId, nodeId);
        setPickerOpen(false);
        setActiveQuestionId(null);
      }
    },
    [activeQuestionId, setClassification]
  );

  if (!subject) {
    return (
      <MobileLayout title="오류" showBack>
        <p className="text-center py-10 text-muted-foreground">과목을 찾을 수 없습니다.</p>
      </MobileLayout>
    );
  }

  if (loading) {
    return (
      <MobileLayout title={`${subject.name} 분류`} showBack>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title={`${subject.name} 분류`} showBack>
      <div className="space-y-3">
        {/* Stats */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">
            전체 {stats.total}
          </Badge>
          <Badge variant="default" className="text-xs">
            분류됨 {stats.classified}
          </Badge>
          {stats.unclassified > 0 && (
            <Badge variant="destructive" className="text-xs">
              미분류 {stats.unclassified}
            </Badge>
          )}
        </div>

        {/* Filter */}
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="unclassified">미분류만</SelectItem>
            {years.map((y) => (
              <SelectItem key={y} value={`y${y}`}>
                {y}년
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Question list */}
        <div className="space-y-2">
          {filteredQuestions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              표시할 문제가 없습니다.
            </p>
          ) : (
            filteredQuestions.map((q) => {
              const nodeId = getNodeId(q.id);
              const isOverridden = !!overrides[q.id];

              return (
                <div
                  key={q.id}
                  className="rounded-lg border p-3 space-y-1.5"
                >
                  {/* Header */}
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      {q.year}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{q.id}</span>
                  </div>

                  {/* Content */}
                  <p className="text-sm line-clamp-2">{q.content}</p>

                  {/* Classification */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {nodeId ? (
                      <>
                        <Badge
                          variant="secondary"
                          className="text-xs max-w-[200px] truncate"
                        >
                          {getNodeLabel(flatNodes, nodeId)}
                        </Badge>
                        {isOverridden && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => removeOverride(q.id)}
                            title="수동 분류 제거"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">미분류</span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs gap-1 ml-auto"
                      onClick={() => openPicker(q.id)}
                    >
                      <Tag className="h-3 w-3" />
                      분류
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* TreeNodePicker Dialog */}
      <TreeNodePicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        subjectId={subjectId!}
        selectedNodeId={activeQuestionId ? getNodeId(activeQuestionId) : undefined}
        onSelect={handleNodeSelect}
      />
    </MobileLayout>
  );
}
