import { z } from "zod";

export const GuestbookSchema = z.object({
  email: z.string().email("올바른 형싱이 아니얌;"),
  body: z.string().min(5, "최소 5글자 이상 입력행;").max(100, "최대 100자얌"),
});

export type GuestbookInput = z.infer<typeof GuestbookSchema>;

// 낙관적 업데이트를 위해 id 등이 포함된 전체 타입 정의
export type GuestbookEntry = GuestbookInput & {
  id: number;
  createdAt?: Date; // 선택 사항
};
