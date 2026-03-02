import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { getLevelLabel } from '@/utils/tree-utils'
import type { TreeLevel, TreeNode } from '@/types/tree'

interface TreeNodeFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  node: TreeNode | null
  defaultLevel?: TreeLevel
  onSubmit: (data: Omit<TreeNode, 'id' | 'children'>) => void
}

const levels: TreeLevel[] = ['major', 'middle', 'minor', 'category', 'concept', 'description']

export function TreeNodeForm({
  open,
  onOpenChange,
  node,
  defaultLevel,
  onSubmit,
}: TreeNodeFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <TreeNodeFormContent
          key={node?.id ?? 'new'}
          node={node}
          defaultLevel={defaultLevel}
          onOpenChange={onOpenChange}
          onSubmit={onSubmit}
        />
      )}
    </Dialog>
  )
}

function TreeNodeFormContent({
  node,
  defaultLevel,
  onOpenChange,
  onSubmit,
}: {
  node: TreeNode | null
  defaultLevel?: TreeLevel
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Omit<TreeNode, 'id' | 'children'>) => void
}) {
  const [label, setLabel] = useState(node?.label ?? '')
  const [level, setLevel] = useState<TreeLevel>(node?.level ?? defaultLevel ?? 'major')
  const [importance, setImportance] = useState(node?.importance ?? 0)
  const [examFrequency, setExamFrequency] = useState(node?.examFrequency ?? '')
  const [description, setDescription] = useState(node?.description ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!label.trim()) return

    const data: Omit<TreeNode, 'id' | 'children'> = {
      label: label.trim(),
      level,
    }
    if (importance > 0) data.importance = importance
    if (examFrequency.trim()) data.examFrequency = examFrequency.trim()
    if (description.trim()) data.description = description.trim()

    onSubmit(data)
  }

  return (
    <DialogContent className="max-w-sm">
      <DialogHeader>
        <DialogTitle>{node ? '노드 수정' : '노드 추가'}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">이름</label>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="개념 이름"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">레벨</label>
          <Select value={level} onValueChange={(v) => setLevel(v as TreeLevel)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {levels.map((l) => (
                <SelectItem key={l} value={l}>
                  {getLevelLabel(l)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">중요도</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`text-lg transition-colors ${
                  star <= importance ? 'text-amber-500' : 'text-muted-foreground/30'
                }`}
                onClick={() => setImportance(star === importance ? 0 : star)}
              >
                ★
              </button>
            ))}
            {importance > 0 && (
              <span className="text-muted-foreground ml-1 self-center text-xs">{importance}/5</span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">출제빈도</label>
          <Input
            value={examFrequency}
            onChange={(e) => setExamFrequency(e.target.value)}
            placeholder="예: 매회 3-4문제"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">설명</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="개념 설명 (선택)"
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button type="submit" disabled={!label.trim()}>
            {node ? '수정' : '추가'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
