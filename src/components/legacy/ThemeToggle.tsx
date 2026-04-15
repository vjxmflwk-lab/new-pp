"use client";

import { useThemeStore } from "@/store/useThemeStore";

export default function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <button
        onClick={toggleDarkMode}
        className="p-2 border rounded-full bg-gray-200 dark:bg-gray-800 transition-colors"
      >
        {isDarkMode ? "🌙 다크모드" : "☀️ 라이트모드"}
      </button>
    </div>
  );
}
