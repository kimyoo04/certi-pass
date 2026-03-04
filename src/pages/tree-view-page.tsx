import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronsUpDown, Pencil, RotateCcw, Search } from 'lucide-react'
import { useParams } from 'react-router-dom'

import { MobileLayout } from '@/components/mobile-layout'
import { TreeNodeForm } from '@/components/tree-node-form'
import { TreeNodeItem } from '@/components/tree-node-item'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useClassifyStore } from '@/stores/use-classify-store'
import { useTreeStore } from '@/stores/use-tree-store'
import { useCachedFetch } from '@/hooks/use-cached-fetch'
import { countNodes, filterTree, generateNodeId, getChildLevel } from '@/utils/tree-utils'
import { allSubjects } from '@/data/exam-tree'
import type { TreeNode } from '@/types/tree'
import { DATA_PATHS } from '@/constants'

export function TreeViewPage() {
  const { examId, subjectId } = useParams<{ examId: string; subjectId: string }>()
  const subject = allSubjects.find((s) => s.id === subjectId)

  const { getTree, addNode, updateNode, deleteNode, resetSubject, customTrees } = useTreeStore()
  const tree = getTree(subjectId!)
  const isCustomized = !!customTrees[subjectId!]

  const {
    overrides: classifyOverrides,
    defaults: classifyDefaults,
    loadDefaults,
  } = useClassifyStore()

  const { data: treeMapData } = useCachedFetch<{ classified?: Record<string, string> }>(
    examId && subjectId ? DATA_PATHS.QUESTION_TREE_MAP(examId, subjectId) : null,
  )

  useEffect(() => {
    if (treeMapData?.classified) loadDefaults(treeMapData.classified)
  }, [treeMapData, loadDefaults])

  // Compute per-node question counts from classification data
  const questionCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    const allMappings = { ...classifyDefaults, ...classifyOverrides }
    for (const [qId, nodeId] of Object.entries(allMappings)) {
      // Only count questions belonging to this subject
      if (qId.startsWith(subjectId + '_')) {
        counts[nodeId] = (counts[nodeId] || 0) + 1
      }
    }
    return counts
  }, [classifyDefaults, classifyOverrides, subjectId])

  const hasQuestionCounts = Object.keys(questionCounts).length > 0

  const [search, setSearch] = useState('')
  const [expandAll, setExpandAll] = useState(false)
  const [editMode, setEditMode] = useState(false)

  // CRUD state
  const [formOpen, setFormOpen] = useState(false)
  const [editingNode, setEditingNode] = useState<TreeNode | null>(null)
  const [addParentId, setAddParentId] = useState<string | null>(null)
  const [addParentLevel, setAddParentLevel] = useState<TreeNode['level']>('major')
  const [deleteTarget, setDeleteTarget] = useState<TreeNode | null>(null)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)

  const filteredTree = useMemo(() => (search ? filterTree(tree, search) : tree), [tree, search])

  const nodeCount = useMemo(() => countNodes(tree), [tree])

  const handleEdit = useCallback((node: TreeNode) => {
    setEditingNode(node)
    setAddParentId(null)
    setFormOpen(true)
  }, [])

  const handleAddChild = useCallback((parentNode: TreeNode) => {
    setEditingNode(null)
    setAddParentId(parentNode.id)
    setAddParentLevel(getChildLevel(parentNode.level))
    setFormOpen(true)
  }, [])

  const handleDelete = useCallback((node: TreeNode) => {
    setDeleteTarget(node)
  }, [])

  const confirmDelete = useCallback(() => {
    if (deleteTarget && subjectId) {
      deleteNode(subjectId, deleteTarget.id)
      setDeleteTarget(null)
    }
  }, [deleteTarget, subjectId, deleteNode])

  const handleFormSubmit = useCallback(
    (data: Omit<TreeNode, 'id' | 'children'>) => {
      if (!subjectId) return

      if (editingNode) {
        updateNode(subjectId, editingNode.id, data)
      } else if (addParentId) {
        const newNode: TreeNode = {
          id: generateNodeId(addParentId),
          ...data,
        }
        addNode(subjectId, addParentId, newNode)
      }
      setFormOpen(false)
      setEditingNode(null)
      setAddParentId(null)
    },
    [subjectId, editingNode, addParentId, updateNode, addNode],
  )

  if (!subject) {
    return (
      <MobileLayout title="오류" showBack>
        <p className="text-muted-foreground py-10 text-center">과목을 찾을 수 없습니다.</p>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout title={subject.name} showBack>
      <div className="space-y-3">
        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              placeholder="개념 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-8"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => setExpandAll((v) => !v)}
            title={expandAll ? '모두 접기' : '모두 펼치기'}
          >
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
          <Button
            variant={editMode ? 'default' : 'outline'}
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => setEditMode((v) => !v)}
            title={editMode ? '편집 완료' : '편집 모드'}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <Badge variant="outline" className="text-xs">
            {nodeCount}개 개념
          </Badge>
          {isCustomized && (
            <Badge variant="secondary" className="text-xs">
              편집됨
            </Badge>
          )}
          {editMode && isCustomized && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 gap-1 text-xs"
              onClick={() => setResetDialogOpen(true)}
            >
              <RotateCcw className="h-3 w-3" />
              초기화
            </Button>
          )}
        </div>

        {/* Tree */}
        <div className="rounded-lg border p-1">
          {filteredTree.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center text-sm">
              {search ? '검색 결과가 없습니다.' : '트리 데이터가 없습니다.'}
            </p>
          ) : (
            filteredTree.map((node) => (
              <TreeNodeItem
                key={node.id}
                node={node}
                editMode={editMode}
                defaultOpen={expandAll}
                questionCounts={hasQuestionCounts ? questionCounts : undefined}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddChild={handleAddChild}
              />
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <TreeNodeForm
        open={formOpen}
        onOpenChange={setFormOpen}
        node={editingNode}
        defaultLevel={addParentId ? addParentLevel : undefined}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>노드 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.label}"을(를) 삭제하시겠습니까?
              {deleteTarget?.children && deleteTarget.children.length > 0 && (
                <span className="text-destructive mt-1 block font-medium">
                  하위 {deleteTarget.children.length}개 노드도 함께 삭제됩니다.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Confirmation */}
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>기본값으로 초기화</AlertDialogTitle>
            <AlertDialogDescription>
              편집한 내용을 모두 삭제하고 기본 트리로 복원하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                resetSubject(subjectId!)
                setResetDialogOpen(false)
              }}
            >
              초기화
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MobileLayout>
  )
}
