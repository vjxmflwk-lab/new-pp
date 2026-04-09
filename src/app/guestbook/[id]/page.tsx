import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function GuestbookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. URL에서 ID 가져오기 (문자열이므로 숫자로 변환)
  const entryId = parseInt(id);

  // 2. DB에서 해당 아이디의 글 하나만 조회
  const entry = await prisma.guestbook.findUnique({
    where: { id: entryId },
  });

  // 3. 글이 없으면 404 페이지로 던지기
  if (!entry) {
    notFound();
  }

  return (
    <div className="p-8">
      <Link href="/" className="text-blue-500 underline mb-4 inline-block">
        ← 목록으로
      </Link>
      <div className="border p-6 rounded-lg shadow-sm">
        <h1 className="text-xl font-bold mb-2">{entry.email}님의 글</h1>
        <p className="text-gray-700 whitespace-pre-wrap">{entry.body}</p>
        <p className="text-sm text-gray-400 mt-4">
          작성일: {entry.createdAt.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
