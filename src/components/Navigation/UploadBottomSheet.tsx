"use client";

import { useEffect } from "react";
interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function BottomSheet({ isOpen, onClose, children }: Props) {
  // 시트가 열릴 때 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <>
      {/* 배경 레이어 */}
      <div
        className={`fixed inset-0 bg-black/50 z-[10000] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* 바텀 시트 컨텐츠 */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[10001] transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="p-4">
          {/* 상단 핸들 */}
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
          <div className="max-h-[80vh] overflow-y-auto">{children}</div>
        </div>
      </div>
    </>
  );
}
