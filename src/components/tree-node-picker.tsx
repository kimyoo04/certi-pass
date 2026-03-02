import { useMemo, useState } from 'react'
import { Check, ChevronRight, Search } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useTreeStore } from '@/stores/use-tree-store'
import { filterTree, getLevelColor, getLevelLabel } from '@/utils/tree-utils'
import type { TreeNode } from '@/types/tree'

interface TreeNodePickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subjectId: string
  selectedNodeId?: string
  onSelect: (nodeId: string, nodePath: string) => void
}

function getNodePath(nodes: TreeNode[], targetId: string, path: string[] = []): string | null {
  for (const node of nodes) {
    const currentPath = [...path, node.label]
    if (node.id === targetId) return currentPath.join(' > ')
    if (node.children) {
      const found = getNodePath(node.children, targetId, currentPath)
      if (found) return found
    }
  }
  return null
}

function PickerNode({
  node,
  depth = 0,
  selectedId,
  onSelect,
  defaultOpen = false,
}: {
  node: TreeNode
  depth?: number
  selectedId?: string
  onSelect: (id: string) => void
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const hasChildren = node.children && node.children.length > 0
  const isSelected = node.id === selectedId
  const indent = depth * 16

  if (!hasChildren) {
    return (
      <button
        className={`hover:bg-accent/50 flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left ${
          isSelected ? 'bg-primary/10 ring-primary/30 ring-1' : ''
        }`}
        style={{ paddingLeft: `${indent + 8}px` }}
        onClick={() => onSelect(node.id)}
      >
        <div className="bg-muted-foreground/40 mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full" />
        <Badge className={`px-1.5 py-0 text-[10px] ${getLevelColor(node.level)}`}>
          {getLevelLabel(node.level)}
        </Badge>
        <span className="flex-1 text-sm">{node.label}</span>
        {isSelected && <Check className="text-primary h-4 w-4 shrink-0" />}
      </button>
    )
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div
        className={`hover:bg-accent/50 flex items-center gap-1 rounded-md ${
          isSelected ? 'bg-primary/10 ring-primary/30 ring-1' : ''
        }`}
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
            <span className="flex-1 text-sm font-medium">{node.label}</span>
          </button>
        </CollapsibleTrigger>
        <Button
          variant={isSelected ? 'default' : 'ghost'}
          size="sm"
          className="mr-1 h-6 shrink-0 text-xs"
          onClick={() => onSelect(node.id)}
        >
          {isSelected ? <Check className="h-3 w-3" /> : '선택'}
        </Button>
      </div>
      <CollapsibleContent>
        {node.children!.map((child) => (
          <PickerNode
            key={child.id}
            node={child}
            depth={depth + 1}
            selectedId={selectedId}
            onSelect={onSelect}
            defaultOpen={defaultOpen}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

export function TreeNodePicker({
  open,
  onOpenChange,
  subjectId,
  selectedNodeId,
  onSelect,
}: TreeNodePickerProps) {
  const [search, setSearch] = useState('')
  const tree = useTreeStore((s) => s.getTree(subjectId))

  const filteredTree = useMemo(() => (search ? filterTree(tree, search) : tree), [tree, search])

  const handleSelect = (nodeId: string) => {
    const path = getNodePath(tree, nodeId)
    onSelect(nodeId, path ?? nodeId)
    onOpenChange(false)
    setSearch('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] flex-col gap-3 p-4">
        <DialogHeader>
          <DialogTitle className="text-base">트리 노드 선택</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            placeholder="개념 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-8"
          />
        </div>

        {selectedNodeId && (
          <div className="text-muted-foreground bg-muted/50 rounded-md px-2 py-1 text-xs">
            현재: {getNodePath(tree, selectedNodeId) ?? selectedNodeId}
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border p-1">
          {filteredTree.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center text-sm">
              {search ? '검색 결과가 없습니다.' : '트리 데이터가 없습니다.'}
            </p>
          ) : (
            filteredTree.map((node) => (
              <PickerNode
                key={node.id}
                node={node}
                selectedId={selectedNodeId}
                onSelect={handleSelect}
                defaultOpen={!!search}
              />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
