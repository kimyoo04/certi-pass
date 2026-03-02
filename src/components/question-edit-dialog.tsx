import { useState } from 'react'
import type { FillInTheBlankQuestion, MultipleChoiceQuestion, Question } from '@/types'
import { PlusIcon, Trash2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useQuestionEditStore } from '@/stores/use-question-edit-store'
import { QUESTION_TYPES } from '@/constants'

interface QuestionEditDialogProps {
  question: Question
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuestionEditDialog({ question, open, onOpenChange }: QuestionEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <QuestionEditDialogContent
          key={question.id}
          question={question}
          onOpenChange={onOpenChange}
        />
      )}
    </Dialog>
  )
}

function QuestionEditDialogContent({
  question,
  onOpenChange,
}: {
  question: Question
  onOpenChange: (open: boolean) => void
}) {
  const { setQuestionEdit, removeQuestionEdit, questionEdits } = useQuestionEditStore()

  const merged = (() => {
    const edits = questionEdits[question.id]
    return edits ? { ...question, ...edits } : question
  })()

  const [content, setContent] = useState(merged.content)
  const [explanation, setExplanation] = useState(merged.explanation)
  // MC-specific
  const [options, setOptions] = useState<string[]>(() =>
    merged.type === QUESTION_TYPES.MULTIPLE_CHOICE
      ? [...(merged as MultipleChoiceQuestion).options]
      : [],
  )
  const [correctIndex, setCorrectIndex] = useState(() =>
    merged.type === QUESTION_TYPES.MULTIPLE_CHOICE
      ? (merged as MultipleChoiceQuestion).correctIndex
      : 0,
  )
  // Fill-blank-specific
  const [answer, setAnswer] = useState(() =>
    merged.type === QUESTION_TYPES.FILL_IN_THE_BLANK
      ? (merged as FillInTheBlankQuestion).answer
      : '',
  )

  const handleSave = () => {
    if (question.type === QUESTION_TYPES.MULTIPLE_CHOICE) {
      setQuestionEdit(question.id, {
        content,
        explanation,
        options,
        correctIndex,
      } as Partial<MultipleChoiceQuestion>)
    } else {
      setQuestionEdit(question.id, {
        content,
        explanation,
        answer,
      } as Partial<FillInTheBlankQuestion>)
    }
    onOpenChange(false)
  }

  const handleReset = () => {
    removeQuestionEdit(question.id)
    onOpenChange(false)
  }

  const updateOption = (index: number, value: string) => {
    setOptions((prev) => prev.map((o, i) => (i === index ? value : o)))
  }

  const addOption = () => {
    setOptions((prev) => [...prev, ''])
  }

  const removeOption = (index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index))
    if (correctIndex >= options.length - 1) {
      setCorrectIndex(Math.max(0, options.length - 2))
    }
  }

  const hasEdits = !!questionEdits[question.id]

  return (
    <DialogContent className="max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>문제 편집</DialogTitle>
        <DialogDescription>
          {question.id} ({question.type === QUESTION_TYPES.MULTIPLE_CHOICE ? '객관식' : '빈칸뚫기'})
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">문제 내용</label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="resize-y"
          />
        </div>

        {question.type === QUESTION_TYPES.MULTIPLE_CHOICE && (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium">선택지</label>
              <div className="space-y-2">
                {options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-muted-foreground w-5 shrink-0 text-xs">{idx + 1}.</span>
                    <Input
                      value={opt}
                      onChange={(e) => updateOption(idx, e.target.value)}
                      className="flex-1"
                    />
                    {options.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 shrink-0 p-0"
                        onClick={() => removeOption(idx)}
                      >
                        <Trash2Icon className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-2 gap-1" onClick={addOption}>
                <PlusIcon className="h-3.5 w-3.5" />
                선택지 추가
              </Button>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">정답</label>
              <Select
                value={String(correctIndex)}
                onValueChange={(v) => setCorrectIndex(Number(v))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {options.map((_, idx) => (
                    <SelectItem key={idx} value={String(idx)}>
                      {idx + 1}번
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {question.type === QUESTION_TYPES.FILL_IN_THE_BLANK && (
          <div>
            <label className="mb-1 block text-sm font-medium">정답</label>
            <Input value={answer} onChange={(e) => setAnswer(e.target.value)} />
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium">해설</label>
          <Textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            rows={3}
            className="resize-y"
          />
        </div>
      </div>

      <DialogFooter className="gap-2">
        {hasEdits && (
          <Button variant="destructive" size="sm" onClick={handleReset}>
            원래대로
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
          취소
        </Button>
        <Button size="sm" onClick={handleSave}>
          저장
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
