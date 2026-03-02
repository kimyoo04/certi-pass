import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/constants";

interface ClassifyState {
  /** User manual overrides: questionId → treeNodeId */
  overrides: Record<string, string>;
  /** Default classifications loaded from JSON: questionId → treeNodeId */
  defaults: Record<string, string>;

  /** Load default classifications from JSON data */
  loadDefaults: (data: Record<string, string>) => void;

  /** Get the node ID for a question (override takes priority) */
  getNodeId: (questionId: string) => string | undefined;

  /** Set a manual classification */
  setClassification: (questionId: string, nodeId: string) => void;

  /** Remove a manual override (revert to default or unclassified) */
  removeOverride: (questionId: string) => void;
}

export const useClassifyStore = create<ClassifyState>()(
  persist(
    (set, get) => ({
      overrides: {},
      defaults: {},

      loadDefaults: (data) => {
        set({ defaults: data });
      },

      getNodeId: (questionId) => {
        const state = get();
        return state.overrides[questionId] ?? state.defaults[questionId];
      },

      setClassification: (questionId, nodeId) => {
        set((state) => ({
          overrides: { ...state.overrides, [questionId]: nodeId },
        }));
      },

      removeOverride: (questionId) => {
        set((state) => {
          const { [questionId]: _, ...rest } = state.overrides;
          void _;
          return { overrides: rest };
        });
      },
    }),
    {
      name: STORAGE_KEYS.CLASSIFY,
      partialize: (state) => ({ overrides: state.overrides }),
    }
  )
);
