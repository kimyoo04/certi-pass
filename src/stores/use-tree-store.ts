import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TreeNode } from "@/types/tree";
import { allSubjects } from "@/data/exam-tree";
import { deepCloneTree, addChildNode, updateNodeInTree, removeNode } from "@/utils/tree-utils";
import { STORAGE_KEYS } from "@/constants";

interface TreeState {
  /** Custom trees keyed by subjectId (copy-on-write from defaults) */
  customTrees: Record<string, TreeNode[]>;

  /** Get tree for a subject: custom if exists, otherwise default */
  getTree: (subjectId: string) => TreeNode[];

  /** Ensure a mutable (custom) copy exists for the subject */
  ensureMutable: (subjectId: string) => TreeNode[];

  /** Add a child node under parentId */
  addNode: (subjectId: string, parentId: string, child: TreeNode) => void;

  /** Update a node's properties */
  updateNode: (subjectId: string, nodeId: string, updates: Partial<Omit<TreeNode, "id" | "children">>) => void;

  /** Delete a node by ID */
  deleteNode: (subjectId: string, nodeId: string) => void;

  /** Reset a subject to default tree data */
  resetSubject: (subjectId: string) => void;

  /** Reset all custom trees */
  resetAll: () => void;
}

function getDefaultTree(subjectId: string): TreeNode[] {
  const subject = allSubjects.find((s) => s.id === subjectId);
  return subject?.tree ?? [];
}

export const useTreeStore = create<TreeState>()(
  persist(
    (set, get) => ({
      customTrees: {},

      getTree: (subjectId) => {
        const custom = get().customTrees[subjectId];
        return custom ?? getDefaultTree(subjectId);
      },

      ensureMutable: (subjectId) => {
        const state = get();
        if (state.customTrees[subjectId]) return state.customTrees[subjectId];

        const cloned = deepCloneTree(getDefaultTree(subjectId));
        set({
          customTrees: { ...state.customTrees, [subjectId]: cloned },
        });
        return cloned;
      },

      addNode: (subjectId, parentId, child) => {
        const tree = deepCloneTree(get().ensureMutable(subjectId));
        addChildNode(tree, parentId, child);
        set((state) => ({
          customTrees: { ...state.customTrees, [subjectId]: tree },
        }));
      },

      updateNode: (subjectId, nodeId, updates) => {
        const tree = deepCloneTree(get().ensureMutable(subjectId));
        updateNodeInTree(tree, nodeId, updates);
        set((state) => ({
          customTrees: { ...state.customTrees, [subjectId]: tree },
        }));
      },

      deleteNode: (subjectId, nodeId) => {
        const tree = deepCloneTree(get().ensureMutable(subjectId));
        removeNode(tree, nodeId);
        set((state) => ({
          customTrees: { ...state.customTrees, [subjectId]: tree },
        }));
      },

      resetSubject: (subjectId) => {
        set((state) => {
          const { [subjectId]: _, ...rest } = state.customTrees;
          void _;
          return { customTrees: rest };
        });
      },

      resetAll: () => set({ customTrees: {} }),
    }),
    {
      name: STORAGE_KEYS.TREE,
      partialize: (state) => ({ customTrees: state.customTrees }),
    }
  )
);
