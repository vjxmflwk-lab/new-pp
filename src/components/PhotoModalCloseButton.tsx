"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CloseButton() {
  // 모달이 올라왔을 때 배경 그리드의 스크롤 방지 코드
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  const router = useRouter();

  return (
    <button
      className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
      onClick={() => router.back()}
    >
      뒤로가기
    </button>
  );
}
