"use client";

import { useOptimistic } from "react";
import { GuestbookEntry } from "@/lib/schemas";
import GuestbookForm from "./GuestbookForm";
import GuestList from "./GuestList";

export default function GuestbookContainer({
  initialMessages,
}: {
  initialMessages: GuestbookEntry[];
}) {
  // // 낙관적 업데이트
  // const [optimisticMessages, addOptimisticMessage] = useOptimistic<
  //   GuestbookEntry[],
  //   GuestbookEntry
  // >(initialMessages, (state, newMessage) => [newMessage, ...state]);

  const [optimisticMessages, setOptimisticMessages] = useOptimistic(
    initialMessages,
    (state, { type, payload }: { type: "ADD" | "DELETE"; payload: any }) => {
      if (type === "ADD") return [payload, ...state];
      if (type === "DELETE") return state.filter((msg) => msg.id !== payload); // ID가 일치하지 않는 것만 남김
      return state;
    },
  );

  // 폼에 넘겨줄 래퍼 함수
  const addOptimistic = (newEntry: GuestbookEntry) => {
    setOptimisticMessages({ type: "ADD", payload: newEntry });
  };

  // 삭제 버튼에 넘겨줄 래퍼 함수
  const deleteOptimistic = (id: number) => {
    setOptimisticMessages({ type: "DELETE", payload: id });
  };

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">방명록</h1>

      <GuestbookForm addOptimistic={addOptimistic} />
      <GuestList messages={optimisticMessages} onDelete={deleteOptimistic} />
    </main>
  );
}
