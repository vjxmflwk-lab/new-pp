"use client";

import { useState } from "react";
import { PostType } from "@/types";
import { MoreVertical, Bookmark, Share2, Edit3, Trash2 } from "lucide-react";
import { deletePost, updatePostCaption } from "@/app/actions/post";
import { useRouter } from "next/navigation";
import { downloadAllImages } from "@/utils/download";

const MAX_LENGTH = 100;

export default function PostDetail({ post }: { post: PostType }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 삼점메뉴
  const [current, setCurrent] = useState(1); // 슬라이더
  const [isSubmitting, setIsSubmitting] = useState(false); // 수정 액션중 여부
  const [isEditing, setIsEditing] = useState(false); // 수정모드 여부
  const [editedCaption, setEditedCaption] = useState(post.caption || ""); // caption 수정 영역

  const router = useRouter();

  const onScroll = (e: any) => {
    const x = e.target.scrollLeft;
    const width = e.target.clientWidth;
    setCurrent(Math.round(x / width) + 1);
  };

  // 삭제
  const handleDelete = async () => {
    if (!confirm("정말 이 게시물을 삭제하시겠습니까?")) return;

    try {
      const result = await deletePost(post.id);

      if (result.success) {
        setIsMenuOpen(false);
        router.push("/", { scroll: false });
      } else {
        alert(result.errors);
      }
    } catch (e) {
      alert("삭제에 실패했습니다.");
    }
  };

  // 이미지 저장
  const handleDownload = async () => {
    if (!post.media || post.media.length === 0) return;

    // 현재 보고 있는 이미지의 원본 URL 가져오기
    const index = post.media[0]?.orderIndex || 0;
    const currentImage = post.media[index].mediaUrl;

    const fileName = `${post.id}_${index}.jpg`;

    setIsMenuOpen(false);
    await downloadAllImages(post.media, post.id);
  };

  // 공유 기능
  const handleShare = async () => {
    // 공유할 현재 포스트의 절대 경로 URL 생성
    const shareUrl = `${window.location.origin}/post/${post.id}`;
    const shareData = {
      title: "나의 갤러리",
      text: post.caption || "사진을 확인해보세요!",
      url: shareUrl,
    };

    try {
      // 모바일 기기 기본 공유 기능 시도
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // 미지원 환경(PC 등)일 경우 클립보드 복사
        await navigator.clipboard.writeText(shareUrl);
        alert("링크가 클립보드에 복사되었습니다.");
      }
    } catch (err) {
      console.error("공유 실패:", err);
    } finally {
      setIsMenuOpen(false);
    }
  };

  // caption 수정
  const handleUpdate = async () => {
    setIsSubmitting(true);
    const result = await updatePostCaption(post.id, editedCaption);

    if (result.success) {
      setIsEditing(false);
      router.push("/", { scroll: false });
    } else {
      alert(result.errors);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col w-full bg-white pb-2">
      {/* 이미지 슬라이더 영역 */}
      <div className="relative overflow-hidden group">
        <div
          onScroll={onScroll}
          className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide"
        >
          {post.media.map((m: any) => (
            <div key={m.id} className="w-full flex-shrink-0 snap-center">
              <img
                src={m.mediaUrl}
                alt=""
                className="w-full aspect-square object-cover"
              />
            </div>
          ))}
        </div>

        {/* 페이지네이션 배지 (우상단) */}
        {post.media.length > 1 && (
          <div className="absolute right-3 top-3 bg-black/70 px-2 py-1 rounded-full text-[10px] font-medium text-white tracking-widest pointer-events-none">
            {current}/{post.media.length}
          </div>
        )}
      </div>

      {/* 인터랙션 및 콘텐츠 영역 */}
      <div className="px-4 py-3 relative">
        {/* 인디케이터 (도트) - 사진이 여러 장일 때만 노출 */}
        {post.media.length > 1 && (
          <div className="flex justify-center items-center gap-1 mb-2">
            {post.media.map((_: any, i: number) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  current === i + 1
                    ? "w-1.5 h-1.5 bg-blue-500"
                    : "w-1 h-1 bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
        {/* 캡션(설명) 영역 */}
        {isEditing ? (
          // 편집 모드
          <div className="flex flex-col gap-2">
            <div className="relative">
              <textarea
                value={editedCaption}
                onChange={(e) => setEditedCaption(e.target.value)}
                maxLength={MAX_LENGTH} // 브라우저 레벨에서 100자 이상 입력 차단
                className="w-full text-[13px] border border-gray-200 rounded-md p-2 pr-2 pb-6 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px] resize-none"
                placeholder="문구 입력..."
                autoFocus
              />

              {/* 글자 수 카운터 */}
              <div
                className={`absolute bottom-2 right-2 text-[10px] font-medium ${
                  editedCaption.length >= MAX_LENGTH
                    ? "text-red-500"
                    : "text-gray-400"
                }`}
              >
                {editedCaption.length} / {MAX_LENGTH}
              </div>
            </div>

            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedCaption(post.caption || "");
                }}
                className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleUpdate}
                disabled={isSubmitting || editedCaption.length === 0}
                className="px-3 py-1.5 bg-blue-500 text-white rounded-md font-medium disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? "저장 중..." : "완료"}
              </button>
            </div>
          </div>
        ) : (
          // 일반 모드
          <div className="flex flex-col gap-1 pr-6">
            <p className="text-[13px] text-gray-800 leading-snug whitespace-pre-wrap">
              <span className="font-semibold mr-2 text-[14px]">
                {editedCaption}
              </span>
            </p>
            <span className="text-[10px] text-gray-400 mt-1">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>

            {/* 우하단 삼점메뉴 */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="absolute right-2 top-4 p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors"
            >
              <MoreVertical size={20} />
            </button>
          </div>
        )}

        {/* 삼점메뉴 팝업 */}
        {isMenuOpen && (
          <>
            {/* 바깥 클릭 시 닫기 위한 투명 백드롭 */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsMenuOpen(false)}
            />

            <div className="absolute right-4 bottom-12 z-20 w-25 bg-white border border-blue-100 rounded-xl shadow-lg overflow-hidden py-1 animate-in fade-in zoom-in duration-200 text-gray-800 font-medium">
              <button
                onClick={handleDownload}
                className="flex w-full items-center px-4  py-3 text-sm "
              >
                <Bookmark size={16} className="mr-3" /> 저장
              </button>
              <button
                onClick={handleShare}
                className="flex w-full items-center px-4 py-3 text-sm 0"
              >
                <Share2 size={16} className="mr-3" /> 공유
              </button>
              <button
                onClick={() => {
                  setIsEditing(true);
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center px-4 py-3 text-sm "
              >
                <Edit3 size={16} className="mr-3" /> 수정
              </button>
              <button
                onClick={handleDelete}
                className="flex w-full items-center px-4 py-3 text-sm text-red-500 "
              >
                <Trash2 size={16} className="mr-3" /> 삭제
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
