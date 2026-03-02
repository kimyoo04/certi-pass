import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/constants";

interface BookmarkState {
  bookmarks: Record<string, boolean>;
  toggleBookmark: (questionId: string) => void;
  isBookmarked: (questionId: string) => boolean;
  getBookmarkedIds: () => string[];
  clearBookmarks: () => void;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: {},

      toggleBookmark: (questionId) =>
        set((state) => {
          const next = { ...state.bookmarks };
          if (next[questionId]) {
            delete next[questionId];
          } else {
            next[questionId] = true;
          }
          return { bookmarks: next };
        }),

      isBookmarked: (questionId) => !!get().bookmarks[questionId],

      getBookmarkedIds: () => Object.keys(get().bookmarks),

      clearBookmarks: () => set({ bookmarks: {} }),
    }),
    {
      name: STORAGE_KEYS.BOOKMARKS,
      partialize: (state) => ({ bookmarks: state.bookmarks }),
    }
  )
);
