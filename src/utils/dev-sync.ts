/**
 * Dev-only: subscribe to zustand stores and persist changes to JSON files
 * via the Vite dev server plugin.
 */
import { useClassifyStore } from '@/stores/use-classify-store'
import { useQuestionEditStore } from '@/stores/use-question-edit-store'
import { useTreeStore } from '@/stores/use-tree-store'
import { patchQuestions, saveJsonFile } from '@/utils/dev-persist'

/** Extract subject ID from question ID pattern `s{N}_q{NNNN}` */
function subjectFromQuestionId(qId: string): string | null {
  const match = qId.match(/^(s\d+)_/)
  return match ? match[1] : null
}

export function initDevSync(): void {
  if (!import.meta.env.DEV) return

  console.log('[dev-sync] Initializing store → JSON file sync')

  // 1. Tree store → tree_overrides.json
  useTreeStore.subscribe((state, prev) => {
    if (state.customTrees === prev.customTrees) return
    for (const [subjectId, tree] of Object.entries(state.customTrees)) {
      if (prev.customTrees[subjectId] !== tree) {
        saveJsonFile(`realtor/${subjectId}/tree_overrides.json`, tree)
      }
    }
  })

  // 2. Classify store → question_tree_map.json
  useClassifyStore.subscribe((state, prev) => {
    if (state.overrides === prev.overrides) return

    // Group overrides by subject
    const bySubject: Record<string, Record<string, string>> = {}
    const merged = { ...state.defaults, ...state.overrides }
    for (const [qId, nodeId] of Object.entries(merged)) {
      const subj = subjectFromQuestionId(qId)
      if (!subj) continue
      if (!bySubject[subj]) bySubject[subj] = {}
      bySubject[subj][qId] = nodeId
    }

    for (const [subjectId, classified] of Object.entries(bySubject)) {
      saveJsonFile(`realtor/${subjectId}/question_tree_map.json`, { classified })
    }
  })

  // 3. Question edits → patch quiz JSON files
  useQuestionEditStore.subscribe((state, prev) => {
    if (state.questionEdits === prev.questionEdits) return

    // Group edits by subject
    const bySubject: Record<string, Record<string, Record<string, unknown>>> = {}
    for (const [qId, edits] of Object.entries(state.questionEdits)) {
      const subj = subjectFromQuestionId(qId)
      if (!subj) continue
      if (!bySubject[subj]) bySubject[subj] = {}
      bySubject[subj][qId] = edits as Record<string, unknown>
    }

    for (const [subjectId, edits] of Object.entries(bySubject)) {
      patchQuestions(`realtor/${subjectId}`, edits)
    }
  })
}
