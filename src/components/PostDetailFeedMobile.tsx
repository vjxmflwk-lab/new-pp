"use client";

import { useEffect, useState } from "react";
import { useSortStore } from "@/store/useSortStore";
import { PostType } from "@/types";
import PostDetail from "./PostDetail";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Loader2 } from "lucide-react";
import { getPostById } from "@/app/actions";

export default function PostDetailFeedMobile({
  initialPosts,
  initialTargetId,
  isIntercepted,
}: {
  initialPosts: PostType[];
  initialTargetId: string;
  isIntercepted: boolean; // 인터셉트 여부(true:메인에서 진입, false:url로 진입)
}) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  // 정렬 기준
  const isSortDesc = useSortStore((state) => state.isSortDesc);

  // 이미 삭제된 포스터를 선택해 상세 진입한 경우 메인으로 돌아감
  useEffect(() => {
    const checkDeletedPost = async () => {
      const post = await getPostById(initialTargetId);
      if (!post) {
        alert("해당 포스터는 삭제됐거나 찾을 수 없습니다.");
        window.location.href = "/";
        return;
      }
    };
    checkDeletedPost();
  }, []);

  // 초기 진입 시 클릭한 포스트로 스크롤 이동
  useEffect(() => {
    // URL에 해시가 없다면 붙여줌으로써 브라우저 네이티브 스크롤 트리거
    if (window.location.hash !== `#post-${initialTargetId}`) {
      window.location.replace(`#post-${initialTargetId}`);
    }

    // url로 진입한 경우 스크롤 깜빡임을 보여주지 않기 위해 지연시간 적용
    if (isIntercepted) {
      setIsReady(true);
    } else {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [initialTargetId]);

  // 스크롤 시 URL 업데이트 (Intersection Observer)
  useEffect(() => {
    if (!isReady) return;

    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("data-post-id");
          if (id) {
            // 주소창 업데이트 (해시 없이 깔끔하게 유지하고 싶을 때)
            window.history.replaceState(null, "", `/post/${id}`);
          }
        }
      });
    }, observerOptions);

    const postElements = document.querySelectorAll(".post-item");
    postElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [isReady, initialPosts]); // isReady가 true가 되는 순간 Observer 실행

  // 목록으로 버튼
  const handleClose = () => {
    router.refresh(); // 서버 액션 초기화
    if (isIntercepted) {
      router.back(); // 메인에서 진입했으면 뒤로가기
    } else {
      router.replace("/"); // url로 진입했으면 메인으로
    }
  };

  return (
    <div className="relative h-full overflow-y-auto bg-white">
      {/* --- 상단 고정 헤더 --- */}
      <nav className="sticky top-0 z-50 flex h-14 items-center border-b bg-white/95  backdrop-blur-sm">
        <button
          onClick={handleClose}
          className="flex h-10 w-30 items-center justify-center rounded-full outline-none select-none"
          aria-label="뒤로 가기"
        >
          <ArrowLeft className="h-6 w-6 text-gray-800" />
          <h2 className="ml-2 text-base font-bold text-gray-900">메인으로</h2>
        </button>
      </nav>

      {/* --- 포스트 리스트 --- */}
      <div className={`${isReady ? "hidden" : "visible"}`}>
        <div className="flex fixed inset-0 bg-red items-center justify-center p-10 text-center">
          <span className=" text-base font-bold text-gray-700">
            불러오는 중
          </span>
          <Loader2 className="ml-1 mt-0.5 h-5 w-5 animate-spin text-blue-300" />
        </div>
      </div>

      <div className={`${isReady ? "visible" : "invisible"}`}>
        {(isSortDesc ? initialPosts : initialPosts.toReversed()).map((post) => (
          <article
            key={post.id}
            id={`post-${post.id}`}
            data-post-id={post.id}
            className="post-item border-b border-gray-100 last:border-none scroll-mt-14"
          >
            <PostDetail post={post} />
          </article>
        ))}
      </div>

      {/* 마지막 게시물 아래 여백 (URL 감지 및 스크롤 여유) */}
      <div className="h-[40vh]" />
    </div>
  );
}
