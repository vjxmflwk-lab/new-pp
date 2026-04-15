"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function PhotoModalFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

  // 배경 클릭 시 닫기 로직
  const onDismiss = (e: React.MouseEvent) => {
    // 클릭한 대상이 정확히 '검은 배경(overlay)'일 때만 뒤로가기 실행
    if (e.target === overlayRef.current) {
      router.back();
    }
  };

  // Esc 키 눌렀을 때 닫기 (디테일!)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.back();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return (
    <div
      ref={overlayRef}
      onClick={onDismiss}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-2 md:p-6 backdrop-blur-sm"
    >
      {children}
    </div>
  );
}
