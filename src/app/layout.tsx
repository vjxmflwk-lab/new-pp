"use client";

import "./globals.css";
import { useEffect, useState } from "react";
import QueryProvider from "@/providers/QueryProvider";
import { useThemeStore } from "@/store/useThemeStore";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDarkMode } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // 컴포넌트가 브라우저에 마운트된 후에만 렌더링을 허용합니다.
  useEffect(() => {
    setMounted(true);
  }, []);

  // 마운트되기 전에는 에러 방지를 위해 기본 레이아웃만 보여줍니다.
  if (!mounted) {
    return (
      <html lang="ko">
        <body>{children}</body>
      </html>
    );
  }

  return (
    <html lang="ko" className={isDarkMode ? "dark" : ""}>
      <body className="bg-white text-black dark:bg-slate-900 dark:text-white transition-colors duration-300">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
