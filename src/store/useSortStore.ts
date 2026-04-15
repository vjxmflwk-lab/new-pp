import { create } from "zustand";

interface SortState {
  isSortDesc: boolean;
  toggleSort: () => void;
}

export const useSortStore = create<SortState>((set) => ({
  isSortDesc: true, // 기본값: 최신순

  toggleSort: () =>
    set((state) => ({
      isSortDesc: state.isSortDesc ? false : true,
    })),
}));
