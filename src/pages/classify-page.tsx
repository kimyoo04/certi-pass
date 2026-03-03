import { useCallback, useEffect, useMemo, useState } from 'react'
import { Tag, X } from 'lucide-react'
import { useParams } from 'react-router-dom'

import { FetchErrorFallback } from '@/components/fetch-error-fallback'
import { LoadingSpinner } from '@/components/loading-spinner'
import { MobileLayout } from '@/components/mobile-layout'
import { TreeNodePicker } from '@/components/tree-node-picker'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCachedFetch } from '@/hooks/use-cached-fetch'
import { useClassifyStore } from '@/stores/use-classify-store'
import { useTreeStore } from '@/stores/use-tree-store'
import { flattenTree } from '@/utils/tree-utils'
import { allSubjects } from '@/data/exam-tree'
import type { TreeNode } from '@/types/tree'
import { DATA_PATHS } from '@/constants'

interface QuizQuestion {
  id: string
  type: string
  year: number
  content: string
  options?: { text: string }[]
  correctIndex?: number
}

function getNodeLabel(flatNodes: TreeNode[], nodeId: string): string {
  const node = flatNodes.find((n) => n.id === nodeId)
  return node?.label ?? nodeId
}

export function ClassifyPage() {
  const { examId, subjectId } = useParams<{ examId: string; subjectId: string }>()
  const subject = allSubjects.find((s) => s.id === subjectId)

  const [filter, setFilter] = useState<string>('all')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null)

  const { overrides, defaults, loadDefaults, getNodeId, setClassification, removeOverride } =
    useClassifyStore()
  const tree = useTreeStore((s) => s.getTree(subjectId!))
  const flatNodes = useMemo(() => flattenTree(tree), [tree])

  const { data: questions, loading, error: fetchError, retry: fetchRetry } = useCachedFetch<QuizQuestion[]>(
    examId && subjectId ? DATA_PATHS.ALL_QUIZ(examId, subjectId) : null,
  )

  const { data: treeMapData } = useCachedFetch<{ classified: Record<string, string> }>(
    examId && subjectId ? DATA_PATHS.QUESTION_TREE_MAP(examId, subjectId) : null,
  )

  useEffect(() => {
    if (treeMapData?.classified) loadDefaults(treeMapData.classified)
  }, [treeMapData, loadDefaults])

  const safeQuestions = useMemo(() => questions ?? [], [questions])

  // Stats
  const stats = useMemo(() => {
    const total = safeQuestions.length
    let classified = 0
    for (const q of safeQuestions) {
      if (overrides[q.id] || defaults[q.id]) classified++
    }
    return { total, classified, unclassified: total - classified }
  }, [safeQuestions, overrides, defaults])

  // Years for filter
  const years = useMemo(() => {
    const yrs = new Set(safeQuestions.map((q) => q.year))
    return [...yrs].sort((a, b) => b - a)
  }, [safeQuestions])

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    let result = safeQuestions
    if (filter === 'unclassified') {
      result = result.filter((q) => !getNodeId(q.id))
    } else if (filter.startsWith('y')) {
      const year = parseInt(filter.slice(1))
      result = result.filter((q) => q.year === year)
    }
    return result
  }, [safeQuestions, filter, getNodeId])

  const openPicker = useCallback((questionId: string) => {
    setActiveQuestionId(questionId)
    setPickerOpen(true)
  }, [])

  const handleNodeSelect = useCallback(
    (nodeId: string) => {
      if (activeQuestionId) {
        setClassification(activeQuestionId, nodeId)
        setPickerOpen(false)
        setActiveQuestionId(null)
      }
    },
    [activeQuestionId, setClassification],
  )

  if (!subject) {
    return (
      <MobileLayout title="오류" showBack>
        <p className="text-muted-foreground py-10 text-center">과목을 찾을 수 없습니다.</p>
      </MobileLayout>
    )
  }

  if (fetchError) {
    return (
      <MobileLayout title={`${subject.name} 분류`} showBack>
        <FetchErrorFallback error={fetchError} onRetry={fetchRetry} />
      </MobileLayout>
    )
  }

  if (loading) {
    return (
      <MobileLayout title={`${subject.name} 분류`} showBack>
        <LoadingSpinner />
      </MobileLayout>
    )
  }

  return (
    <MobileLayout title={`${subject.name} 분류`} showBack>
      <div className="space-y-3">
        {/* Stats */}
        <div className="flex flex-wrap items-center gap-2">
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
            <p className="text-muted-foreground py-6 text-center text-sm">
              표시할 문제가 없습니다.
            </p>
          ) : (
            filteredQuestions.map((q) => {
              const nodeId = getNodeId(q.id)
              const isOverridden = !!overrides[q.id]

              return (
                <div key={q.id} className="space-y-1.5 rounded-lg border p-3">
                  {/* Header */}
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="shrink-0 text-[10px]">
                      {q.year}
                    </Badge>
                    <span className="text-muted-foreground text-xs">{q.id}</span>
                  </div>

                  {/* Content */}
                  <p className="line-clamp-2 text-sm">{q.content}</p>

                  {/* Classification */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {nodeId ? (
                      <>
                        <Badge variant="secondary" className="max-w-[200px] truncate text-xs">
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
                      <span className="text-muted-foreground text-xs">미분류</span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto h-6 gap-1 text-xs"
                      onClick={() => openPicker(q.id)}
                    >
                      <Tag className="h-3 w-3" />
                      분류
                    </Button>
                  </div>
                </div>
              )
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
  )
}
