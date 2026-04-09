import { useThemeStore } from "@/store/useThemeStore";
import { act } from "react";

describe("ThemeStore (Zustand)", () => {
  // 매 테스트 전에 스토어 초기화 (Persist 때문에 값이 남아있을 수 있음)
  beforeEach(() => {
    act(() => {
      useThemeStore.setState({ isDarkMode: false });
    });
  });

  it("초기값은 라이트 모드(false)여야 한다", () => {
    const state = useThemeStore.getState();
    expect(state.isDarkMode).toBe(false);
  });

  it("toggleDarkMode를 호출하면 값이 반전되어야 한다", () => {
    // 1. 첫 번째 토글
    act(() => {
      useThemeStore.getState().toggleDarkMode();
    });
    expect(useThemeStore.getState().isDarkMode).toBe(true);

    // 2. 두 번째 토글
    act(() => {
      useThemeStore.getState().toggleDarkMode();
    });
    expect(useThemeStore.getState().isDarkMode).toBe(false);
  });
});
