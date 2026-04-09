import { create } from "zustand";

interface UserState {
  isLoggedIn: boolean;
  toggleLoggin: () => void;
}
export const useUserStore = create<UserState>((set) => ({
  isLoggedIn: false,
  toggleLoggin: () => set((state) => ({ isLoggedIn: !state.isLoggedIn })),
}));
