import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Question } from "@/types";
import { STORAGE_KEYS } from "@/constants";

interface QuestionEditState {
  /** Per-question edit overlays keyed by question ID */
  questionEdits: Record<string, Partial<Question>>;

  /** Store an edit overlay for a question */
  setQuestionEdit: (questionId: string, edits: Partial<Question>) => void;

  /** Remove edit overlay (revert to original) */
  removeQuestionEdit: (questionId: string) => void;

  /** Merge original question with any stored edits */
  getEditedQuestion: <T extends Question>(original: T) => T;

  /** Clear all edits */
  resetAll: () => void;
}

export const useQuestionEditStore = create<QuestionEditState>()(
  persist(
    (set, get) => ({
      questionEdits: {},

      setQuestionEdit: (questionId, edits) => {
        set((state) => ({
          questionEdits: { ...state.questionEdits, [questionId]: edits },
        }));
      },

      removeQuestionEdit: (questionId) => {
        set((state) => {
          const { [questionId]: _, ...rest } = state.questionEdits;
          void _;
          return { questionEdits: rest };
        });
      },

      getEditedQuestion: <T extends Question>(original: T): T => {
        const edits = get().questionEdits[original.id];
        if (!edits) return original;
        return { ...original, ...edits } as T;
      },

      resetAll: () => set({ questionEdits: {} }),
    }),
    {
      name: STORAGE_KEYS.QUESTION_EDITS,
      partialize: (state) => ({ questionEdits: state.questionEdits }),
    }
  )
);
