"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { getPostsAllWithCursor } from "@/app/actions/post";
import supabaseLoader from "@/utils/supabaseLoader";
import Link from "next/link";
import { useSortStore } from "@/store/useSortStore";
import Image from "next/image";

export default function InfinitePhotoList({
  initialPhotos = [],
  initialCursor,
}: {
  initialPhotos: any[];
  initialCursor: any;
}) {
  if (!initialPhotos) return null;

  const [morePhotos, setMorePhotos] = useState<any[]>([]); //  서버에서 더 불러온 '추가 데이터'만 관리
  const [cursor, setCursor] = useState(initialCursor);
  const [ref, inView] = useInView(); // 바닥 감지용 hook
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  // 렌더링할 최종 리스트 = [부모가 주는 낙관적 데이터 + 내가 더 불러온 데이터]
  // 이렇게 하면 부모가 사진을 한 장 추가하자마자 바로 반영
  // key 중복 방지
  let allPhotos = [...initialPhotos, ...morePhotos].reduce((acc, current) => {
    const x = acc.find((item: any) => item.id === current.id);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, [] as any[]);

  // 정렬
  const sortOrder = useSortStore((state) => state.sortOrder);
  allPhotos = [...allPhotos].sort((a, b) => {
    return sortOrder === "desc"
      ? b.createdAt - a.createdAt
      : a.createdAt - b.createdAt;
  });

  // 무한 스크롤 관련 코드
  useEffect(() => {
    if (inView && cursor && !isLoading) {
      loadMorePhoto();
    }
  }, [inView, cursor, isLoading]);

  const loadMorePhoto = async () => {
    // 이미 로딩 중이거나 커서가 없으면 탈출
    if (isLoading || !cursor) return;

    setIsLoading(true); // 로딩 시작
    try {
      const { posts: fetchedPhotos, nextCursor } =
        await getPostsAllWithCursor(cursor);

      setMorePhotos((prev) => [...prev, ...fetchedPhotos]);
      setCursor(nextCursor);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-0.5 md:gap-1.5">
        {allPhotos.map((post: any, index: number) => (
          <Link key={post.id} href={`/post/${post.id}`} scroll={false}>
            <div
              className={
                "relative aspect-[4/5] overflow-hidden group cursor-pointer " +
                `${isLoading ? "animate-pulse bg-gray-100" : ""} `
              }
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
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 "
              />

              {/* 묶음사진인 경우 아이콘 노출 */}
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
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>

      {cursor && <div ref={ref} className="h-20" />}
    </>
  );
}
