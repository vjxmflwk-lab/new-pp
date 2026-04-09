"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GuestbookSchema } from "@/lib/schemas";

export type ActionState = {
  success: boolean;
  error: string | null;
};

// 게시글 등록
export async function createGuestbookEntry(
  prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const rawData = {
    email: formData.get("email"),
    body: formData.get("body"),
  };

  const validatedFields = GuestbookSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return {
      success: false,
      error:
        validatedFields.error.flatten().fieldErrors.body?.[0] ||
        validatedFields.error.flatten().fieldErrors.email?.[0] ||
        "입력값을 확인해주세요.",
    };
  }

  const { email, body } = validatedFields.data;

  if (!email || !body) return { error: "내용을 입력해주세요", success: false };

  try {
    await prisma.guestbook.create({
      data: { email, body },
    });

    revalidatePath("/");

    return { success: true, error: null };
  } catch (e) {
    return { error: "오류발생!@", success: false };
  }
}

// 게시글 삭제
export async function deleteGuestbookEntry(id: number) {
  try {
    await prisma.guestbook.delete({
      where: { id },
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    return { success: false, error: "삭제에 실패했슴당!!!" };
  }
}
