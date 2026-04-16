"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { getPostsAllWithCursor } from "@/app/actions/post";
import supabaseLoader from "@/utils/supabaseLoader";
import Link from "next/link";
import { useSortStore } from "@/store/useSortStore";
import Image from "next/image";
import { PostType } from "@/types";
import { useRouter } from "next/navigation";

export default function InfinitePostList({
  initialPosts = [],
  initialCursor,
}: {
  initialPosts: PostType[];
  initialCursor: string | null;
}) {
  if (!initialPosts) return null;

  const router = useRouter();

  const [morePosts, setMorePosts] = useState<PostType[]>([]);
  const [cursor, setCursor] = useState(initialCursor);
  const [ref, inView] = useInView({ threshold: 0.5 }); // 바닥 감지용 hook
  const [isFetching, setIsFetching] = useState(false);

  const isSortDesc = useSortStore((state) => state.isSortDesc);

  // 전체 데이터 합치기 및 정렬
  const allPosts = useMemo(() => {
    const combined = [...initialPosts, ...morePosts];
    const uniquePhotos = combined.filter(
      (v, i, a) => a.findIndex((t) => t.id === v.id) === i,
    );

    return uniquePhotos.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return isSortDesc ? timeB - timeA : timeA - timeB;
    });
  }, [initialPosts, morePosts, isSortDesc]);

  // 데이터 추가 로드 함수 (useCallback으로 메모이제이션)
  const loadMore = useCallback(async () => {
    if (isFetching || !cursor) return;

    setIsFetching(true);
    try {
      const { posts, nextCursor } = await getPostsAllWithCursor(cursor);
      setMorePosts((prev) => [...prev, ...posts]);
      setCursor(nextCursor);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setIsFetching(false);
    }
  }, [cursor, isFetching]);

  // 무한 스크롤 감지
  useEffect(() => {
    if (inView) loadMore();
  }, [inView, loadMore]);

  // 정렬 순서가 바뀌면 스크롤 상태를 초기화
  useEffect(() => {
    setMorePosts([]);
    setCursor(initialCursor);
  }, [initialCursor]);

  // 이 컴포넌트가 마운트될 때(진입 시) 서버 데이터를 강제로 refresh
  // 이렇게 하면 서버 컴포넌트가 initialPhotos를 새로 받아오고,
  // morePhotos 상태는 initialPhotos가 바뀔 때 자연스럽게 동기화되도록 설계
  useEffect(() => {
    router.refresh();
  }, [router]);

  return (
    <>
      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-0.5 md:gap-1.5">
        {allPosts.map((post: PostType, index: number) => (
          <Link key={post.id} href={`/post/${post.id}`} scroll={false}>
            <div
              className={`relative aspect-[4/5] overflow-hidden group cursor-pointer bg-gray-100  ${
                isFetching ? "animate-pulse" : ""
              }`}
            >
              <Image
                loader={supabaseLoader}
                src={post.media[0]?.thumbnailUrl || post.media[0]?.mediaUrl}
                alt="gallery"
                fill
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
                priority={index < 6 ? true : false}
                fetchPriority={index < 6 ? "high" : "auto"}
                loading={index < 6 ? "eager" : "lazy"}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105  ease-in-out"
              />
              {post.media?.length > 1 && (
                <div className="absolute right-2 top-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
                  >
                    <path
                      d="M19 9H11C9.89543 9 9 9.89543 9 11V19C9 20.1046 9.89543 21 11 21H19C20.1046 21 21 20.1046 21 19V11C21 9.89543 20.1046 9 19 9Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* 로딩 인디케이터 */}
      {isFetching && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* 바닥 감지용. 하단bar 높이만큼 추가 */}
      <div ref={ref} className="h-20 w-full"></div>
    </>
  );
}
