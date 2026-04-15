import { create } from "zustand";

interface SortState {
  sortOrder: "desc" | "asc";
  toggleSort: () => void;
}

export const useSortStore = create<SortState>((set) => ({
  sortOrder: "desc", // 기본값: 최신순

  toggleSort: () =>
    set((state) => ({
      sortOrder: state.sortOrder === "desc" ? "asc" : "desc",
    })),
}));
