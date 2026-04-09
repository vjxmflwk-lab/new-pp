"use client";
import { createGuestbookEntry, ActionState } from "@/app/actions";
import { GuestbookSchema } from "@/lib/schemas";
import { useActionState } from "react";
import { useRef, useEffect } from "react";

export default function GuestbookForm({
  addOptimistic,
}: {
  addOptimistic: (entry: any) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState<
    ActionState | null,
    FormData
  >(async (prevState, formData) => {
    const rawData = {
      email: formData.get("email"),
      body: formData.get("body"),
    };

    // 1. Zod로 검증 실행
    const validated = GuestbookSchema.safeParse(rawData);

    if (validated.success) {
      // 2. 검증된 데이터를 사용하여 낙관적 업데이트 실행
      // validated.data는 Zod 덕분에 이미 { email: string, body: string } 타입입니다.
      addOptimistic({
        ...validated.data,
        id: -1, // 임시 ID
        createdAt: new Date(),
      });
    }

    return await createGuestbookEntry(prevState, formData);
  }, null);

  // 성공 시 폼 초기화
  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="mb-10">
      <form
        ref={formRef}
        action={formAction}
        className="space-y-4 p-6 bg-white border rounded-xl shadow-sm"
      >
        <div>
          <input
            name="email"
            type="email"
            placeholder="이메일 주소"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            required
          />
        </div>
        <div>
          <textarea
            name="body"
            placeholder="따뜻한 한마디를 남겨주세요."
            rows={3}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            required
          />
        </div>

        {state?.error && (
          <p className="text-red-500 text-sm font-medium">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 disabled:bg-slate-300 transition-colors"
        >
          {isPending ? "전송 중..." : "방명록 등록하기"}
        </button>
      </form>
    </div>
  );
}
