"use client";

import { useRef, useState } from "react";
import { ImageUploadSchema } from "@/lib/schemas";
import { uploadPost } from "@/app/actions/post";

export default function UploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  /*
    사진 선택했을 때 화면에 띄워주기
  */
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // 최대 개수 제한 (예: 10장)
    if (images.length + files.length > 10) {
      alert("사진은 최대 10장까지 선택 가능합니다.");
      return;
    }

    // 파일 객체 저장
    setImages((prev) => [...prev, ...files]);

    // 프리뷰 생성 (Promise.all 활용)
    const newPreviews = await Promise.all(
      files.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }),
    );

    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  /*
    특정 사진 삭제 기능
  */
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  /*
    등록 버튼 동작
  */
  const handleSubmit = async () => {
    // 총 용량 및 개별 용량 제한
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const MAX_TOTAL_SIZE = 30 * 1024 * 1024; // 30MB
    let totalSize = 0;

    for (const file of images) {
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name}의 용량이 너무 큽니다 (최대 5MB)`);
        return;
      }
      totalSize += file.size;
    }

    if (totalSize > MAX_TOTAL_SIZE) {
      alert("전체 용량이 30MB를 초과했습니다. 사진을 줄여주세요.");
      return;
    }

    // zod 유효성 검증 시작
    const data = {
      images: images,
      caption: caption,
    };

    const validatedData = ImageUploadSchema.safeParse(data);

    if (!validatedData.success) {
      const errorMessage =
        validatedData.error.flatten().fieldErrors.images?.[0] ||
        validatedData.error.flatten().fieldErrors.caption?.[0] ||
        "실패했습니다. 관리자에게 문의해주세요.";
      alert(errorMessage);
      return;
    }
    // zod 유효성 검증 종료

    const files = validatedData.data.images;

    // action 호출
    const result = await uploadPost(files, caption);
    if (result.success) {
      alert("등록 완료!");
      onSuccess();

      // 폼 초기화
      setImages([]);
      setPreviews([]);
      setCaption("");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 이미지 리스트 영역 (가로 스크롤) */}
      <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
        {/* 추가 버튼 */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex-shrink-0 w-32 aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer snap-start"
        >
          <span className="text-gray-400 text-2xl">+</span>
        </div>

        {/* 선택된 이미지들 */}
        {previews.map((url, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 w-32 aspect-square snap-start"
          >
            <img
              src={url}
              alt={`preview ${index}`}
              className="w-full h-full object-cover rounded-xl"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute -top-1 -right-1 bg-black text-white w-6 h-6 rounded-full text-xs flex items-center justify-center border border-white"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        multiple
        className="hidden"
      />
      <textarea
        placeholder="설명을 입력하세요..."
        className="w-full p-4 bg-gray-50 rounded-xl h-32 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      참고: 다중 업로드는 개발중
      <button
        className="w-full py-4 bg-blue-500 text-white rounded-xl font-bold active:scale-[0.98] transition-transform"
        onTouchStart={handleSubmit}
      >
        {images.length}개의 게시물 등록하기
      </button>
    </div>
  );
}
