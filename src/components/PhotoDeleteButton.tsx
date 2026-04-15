"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function PhotoDeleteButton({
  id,
  imageUrl,
}: {
  id: string;
  imageUrl: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const storagePath = imageUrl.split("/public/photos/")[1];

    if (!storagePath) {
      alert("파일 경로를 찾을 수 없습니다.");
      return;
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      style={{ color: isPending ? "gray" : "red" }}
      className="w-full flex items-center justify-center gap-2 border border-red-100 text-red-600 py-2.5 rounded-lg text-sm font-medium hover:bg-red-50 transition"
    >
      <Trash2 size={16} /> {isPending ? "삭제 중..." : "삭제"}
    </button>
  );
}
