"use client";

import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased selection:bg-blue-100">
        {/* PC로 진입 시 제한. 향후 구현 예정 */}
        <div className="hidden md:flex fixed inset-0 z-[9999] bg-white items-center justify-center p-10 text-center">
          <div>
            <h1 className="text-2xl font-bold mb-4">
              📱 모바일 전용 사이트입니다
            </h1>
            <p className="text-gray-500 text-sm">
              이 사이트는 모바일 화면에 최적화되어 있습니다.
              <br />
              PC화면도 개발중이니 기다려주세요~~~~~
              <br />
            </p>
          </div>
        </div>

        <div className="flex min-h-screen md:hidden">
          <main className="flex-1 md:ml-[240px] md:pb-0">
            <QueryProvider>{children}</QueryProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
