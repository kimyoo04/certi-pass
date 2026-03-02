import { useState } from 'react'
import { ChevronRight, Pencil, Plus, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { getLevelColor, getLevelLabel } from '@/utils/tree-utils'
import type { TreeNode } from '@/types/tree'

interface TreeNodeItemProps {
  node: TreeNode
  depth?: number
  editMode?: boolean
  defaultOpen?: boolean
  questionCounts?: Record<string, number>
  onEdit?: (node: TreeNode) => void
  onDelete?: (node: TreeNode) => void
  onAddChild?: (parentNode: TreeNode) => void
}

export function TreeNodeItem({
  node,
  depth = 0,
  editMode = false,
  defaultOpen = false,
  questionCounts,
  onEdit,
  onDelete,
  onAddChild,
}: TreeNodeItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const hasChildren = node.children && node.children.length > 0
  const indent = depth * 16

  // Compute question count for this node and its subtree
  const getSubtreeCount = (n: TreeNode): number => {
    if (!questionCounts) return 0
    let count = questionCounts[n.id] || 0
    if (n.children) {
      for (const child of n.children) count += getSubtreeCount(child)
    }
    return count
  }
  const qCount = questionCounts ? getSubtreeCount(node) : 0

  const questionBadge =
    questionCounts && qCount > 0 ? (
      <Badge variant="secondary" className="bg-blue-100 px-1.5 py-0 text-[10px] text-blue-700">
        {qCount}문제
      </Badge>
    ) : null

  const importanceDots = node.importance ? (
    <span className="inline-flex -translate-y-1 items-center gap-px">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`inline-block h-1 w-1 rounded-full ${
            i < node.importance! ? 'bg-amber-500' : 'bg-muted-foreground/20'
          }`}
        />
      ))}
    </span>
  ) : null

  if (!hasChildren) {
    return (
      <div
        className="group hover:bg-accent/50 flex items-start gap-2 rounded-md px-2 py-1.5"
        style={{ paddingLeft: `${indent + 8}px` }}
      >
        <div className="bg-muted-foreground/40 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge className={`px-1.5 py-0 text-[10px] ${getLevelColor(node.level)}`}>
              {getLevelLabel(node.level)}
            </Badge>
            <span className="text-sm">{node.label}</span>
            {importanceDots}
            {questionBadge}
          </div>
          {node.examFrequency && (
            <p className="text-muted-foreground mt-0.5 text-xs">{node.examFrequency}</p>
          )}
          {node.description && (
            <p className="text-muted-foreground mt-0.5 text-xs">{node.description}</p>
          )}
        </div>
        {editMode && (
          <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onAddChild?.(node)}
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit?.(node)}>
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive h-6 w-6"
              onClick={() => onDelete?.(node)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div
        className="group hover:bg-accent/50 flex items-center gap-1 rounded-md"
        style={{ paddingLeft: `${indent}px` }}
      >
        <CollapsibleTrigger asChild>
          <button className="flex flex-1 items-center gap-1.5 px-2 py-1.5 text-left">
            <ChevronRight
              className={`text-muted-foreground h-4 w-4 shrink-0 transition-transform ${
                isOpen ? 'rotate-90' : ''
              }`}
            />
            <Badge className={`px-1.5 py-0 text-[10px] ${getLevelColor(node.level)}`}>
              {getLevelLabel(node.level)}
            </Badge>
            <span className="text-sm font-medium">{node.label}</span>
            {importanceDots}
            {node.examFrequency && (
              <span className="text-muted-foreground text-[10px]">({node.examFrequency})</span>
            )}
            {questionBadge}
            <span className="text-muted-foreground text-[10px]">({node.children!.length})</span>
          </button>
        </CollapsibleTrigger>
        {editMode && (
          <div className="flex shrink-0 gap-0.5 pr-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onAddChild?.(node)}
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit?.(node)}>
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive h-6 w-6"
              onClick={() => onDelete?.(node)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
      <CollapsibleContent>
        {node.description && (
          <p
            className="text-muted-foreground px-2 pb-1 text-xs"
            style={{ paddingLeft: `${indent + 32}px` }}
          >
            {node.description}
          </p>
        )}
        {node.children!.map((child) => (
          <TreeNodeItem
            key={child.id}
            node={child}
            depth={depth + 1}
            editMode={editMode}
            defaultOpen={defaultOpen}
            questionCounts={questionCounts}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddChild={onAddChild}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}
