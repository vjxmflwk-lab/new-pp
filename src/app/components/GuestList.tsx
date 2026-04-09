"use client";

import Link from "next/link";
import { useTransition } from "react";
import { deleteGuestbookEntry } from "@/app/actions";

interface Message {
  id: number;
  email: string;
  body: string;
}

export default function GuestList({
  messages,
  onDelete,
}: {
  messages: Message[];
  onDelete: (id: number) => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (id: number) => {
    if (!confirm("진짜 삭제함?")) return;

    startTransition(async () => {
      // 낙관적 업데이트 수행
      onDelete(id);

      const result = await deleteGuestbookEntry(id);

      if (!result.success) {
        alert(result.error);
      }
    });
  };

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div key={msg.id}>
          <Link
            href={`/guestbook/${msg.id}`}
            className={`block p-4 border rounded-lg transition ${
              msg.id === -1 ? "opacity-50 italic" : "hover:border-blue-500"
            }`}
          >
            <div className="flex justify-between">
              <span className="font-bold">{msg.email}</span>
              {msg.id === -1 && (
                <span className="text-xs text-blue-500">전송 중...</span>
              )}
            </div>
            <p className="text-gray-600">{msg.body}</p>
          </Link>
          <button
            className="text-red-500 hover:bg-red-50 p-2 rounded text-sm"
            onClick={() => handleDelete(msg.id)}
          >
            삭제
          </button>
        </div>
      ))}
    </div>
  );
}
