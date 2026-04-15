"use server";

import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { cache } from "react";

// action 응답 타입
export type ActionResponseType = {
  success: boolean;
  message?: string;
  errors?: string | null;
};

// post 한 개 조회
export const getPostById = cache(async (id: string) => {
  return await prisma.post.findUnique({
    where: { id },
    include: { media: { orderBy: { orderIndex: "asc" } } },
  });
});

// 전체 post조회
export const getPostsAll = cache(async () => {
  return await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { media: { orderBy: { orderIndex: "asc" } } },
  });
});

// 전체 post 조회 with cursor
export async function getPostsAllWithCursor(
  cursor?: string,
  isSortDesc: boolean = true,
) {
  try {
    const limit = 15;

    const posts = await prisma.post.findMany({
      include: {
        media: {
          orderBy: {
            orderIndex: "asc",
          },
        },
      },
      take: limit,
      skip: cursor ? 1 : 0, // 커서가 있으면 그 다음 데이터부터
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: isSortDesc ? "desc" : "asc" },
    });

    // 다음 가져올 데이터가 있는지 확인을 위해 마지막 ID 반환
    const nextCursor =
      posts.length === limit ? posts[posts.length - 1].id : undefined;

    return { posts: posts || [], nextCursor: nextCursor || null };
  } catch (e) {
    console.error("데이터 불러오기 실패:", e);
    return { posts: [], nextCursor: null }; // 에러 시 안전장치
  }
}

// post 업로드
export async function uploadPost(
  uploadedUrls: string[],
  caption: string,
): Promise<ActionResponseType> {
  try {
    // Prisma를 사용하여 1:N 구조로 데이터 저장
    await prisma.post.create({
      data: {
        caption: caption,
        media: {
          create: uploadedUrls.map((url, index) => ({
            mediaUrl: url,
            mediaType: "IMAGE", // 나중에 확장자 체크 로직 넣어서 VIDEO 분기 가능
            orderIndex: index,
            thumbnailUrl: url, // 이미지의 경우 일단 원본과 동일하게 설정
          })),
        },
      },
    });

    revalidatePath("/");
    return { success: true, errors: null };
  } catch (error) {
    console.error("Upload/DB Error:", error);
    throw new Error("다중 업로드 중 오류가 발생했습니다.");
  }
}

// post 삭제
export async function deletePost(postId: string): Promise<ActionResponseType> {
  try {
    // 삭제할 포스트의 미디어 정보 가져오기
    const post = await getPostById(postId);

    // 해당 포스터가 DB에 존재하지 않는 경우
    if (!post) {
      return {
        success: false,
        errors: "해당 포스터는 삭제됐거나 찾을 수 없습니다.",
      };
    }

    // Supabase Storage부터 개별 파일들 삭제
    const filePaths = post.media.map((m) => {
      // URL에서 파일명만 추출 (경로 구조에 따라 수정 필요)
      return m.mediaUrl.split("/").pop() as string;
    });

    // storage 버킷부터 삭제
    if (filePaths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from("photos")
        .remove(filePaths);

      if (storageError) console.error("Storage 삭제 실패:", storageError);
    }

    // DB에서 삭제 (Post를 지우면 Media는 OnDelete: Cascade에 의해 삭제됨)
    await prisma.post.delete({
      where: { id: postId },
    });

    // 캐시 갱신 및 경로 업데이트
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, errors: "삭제 중 오류가 발생했습니다." };
  }
}

// post caption 수정
export async function updatePostCaption(
  postId: string,
  newCaption: string,
): Promise<ActionResponseType> {
  // 삭제할 포스트의 미디어 정보 가져오기
  const post = await getPostById(postId);

  // 해당 포스터가 DB에 존재하지 않는 경우
  if (!post) {
    return {
      success: false,
      errors: "해당 포스터는 삭제됐거나 찾을 수 없습니다.",
    };
  }

  try {
    await prisma.post.update({
      where: { id: postId },
      data: { caption: newCaption },
    });

    revalidatePath("/"); // 메인 리스트 갱신
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, errors: "수정 중 오류가 발생했습니다." };
  }
}
