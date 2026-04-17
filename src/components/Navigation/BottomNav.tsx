"use client";

import { PlusSquare, ArrowDownAZ, ArrowUpAZ, Info } from "lucide-react";
import { useSortStore } from "@/store/useSortStore";
import { useState } from "react";
import UploadBottomSheet from "@/components/Navigation/UploadBottomSheet";
import UploadForm from "@/components/Navigation/UploadForm";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { isSortDesc, toggleSort } = useSortStore();

  // 현재 경로가 /info 이면 컴포넌트 렌더링하지 않음
  const pathname = usePathname();
  if (pathname === "/info") return null;

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-100 z-50 md:hidden">
        <div className="flex justify-around items-center h-full px-2 pb-[env(safe-area-inset-bottom)]">
          {/* 정렬 (Sort) */}
          {/* <button
            className="flex flex-col items-center justify-center flex-1 h-full min-w-[60px] relative z-[9999] touch-none"
            style={{ WebkitTapHighlightColor: "transparent" }}
            onTouchStart={(e) => {
              toggleSort();
            }}
          >
            {isSortDesc ? <ArrowDownAZ size={24} /> : <ArrowUpAZ size={24} />}
            <span className="text-[10px] mt-1 font-medium">
              {isSortDesc ? "최신순" : "과거순"}
            </span>
          </button> */}

          {/* 정보 (info) */}
          <Link
            href="/info"
            className="flex flex-col items-center justify-center flex-1 h-full text-gray-700 active:scale-95 transition-transform"
          >
            <Info size={24} strokeWidth={2} />
            <span className="text-[10px] mt-1 font-medium">정보</span>
          </Link>

          {/* 추가 (Upload) */}
          <button
            className="flex flex-col items-center justify-center flex-1 h-full text-gray-700 active:scale-95 transition-transform"
            onClick={() => setIsUploadOpen(true)}
          >
            <PlusSquare size={24} strokeWidth={2} />
            <span className="text-[10px] mt-1 font-medium">추가</span>
          </button>
        </div>
      </nav>

      {/* 업로드 bottomSheet */}
      <UploadBottomSheet
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      >
        <UploadForm onSuccess={() => setIsUploadOpen(false)} />
      </UploadBottomSheet>
    </>
  );
}
