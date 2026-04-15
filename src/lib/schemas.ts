import { z } from "zod";

// 방명록
export const GuestbookSchema = z.object({
  email: z.string().email("올바른 형싱이 아니얌;"),
  body: z.string().min(5, "최소 5글자 이상 입력행;").max(100, "최대 100자얌"),
});
export type GuestbookInput = z.infer<typeof GuestbookSchema>;
export type GuestbookEntry = GuestbookInput & {
  id: number;
  createdAt?: Date;
};

// 이미지
export const ImageUploadSchema = z.object({
  images: z
    .array(z.instanceof(File))
    .min(1, "최소 한 장은 선택해주세요")
    .max(10, "최대 10장까지만 선택 가능합니다."),
  caption: z.string().max(100, "설명은 100자 이내로 입력해주세요."),
});
export type ImageInput = z.infer<typeof ImageUploadSchema>;
// 낙관적 업데이트를 위해 id 등이 포함된 전체 타입 정의
export type ImageEntry = ImageInput & {
  id: number;
  isOptimistic: boolean;
  createdAt?: Date;
};
