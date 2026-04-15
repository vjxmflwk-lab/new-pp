"use client";

import { useRef, useState } from "react";
import { ImageUploadSchema } from "@/lib/schemas";
import { uploadPost } from "@/app/actions/post";
import imageCompression from "browser-image-compression";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export default function UploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
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

    e.target.value = "";
  };

  /*
    선택한 사진들 중 특정 사진 삭제 기능
  */
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  /*
    업로드 버튼 동작
  */
  const handleSubmit = async () => {
    // 총 용량 및 개별 용량 제한
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB
    let totalSize = 0;

    for (const file of images) {
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name}의 용량이 너무 큽니다 (최대 10MB)`);
        return;
      }
      totalSize += file.size;
    }

    if (totalSize > MAX_TOTAL_SIZE) {
      alert("전체 용량이 100MB를 초과했습니다. 사진을 줄여주세요.");
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

    setIsUploading(true);

    const files = validatedData.data.images;

    try {
      const uploadPromises = files.map(async (file) => {
        const options = {
          maxSizeMB: 1, // 최대 용량 1MB로 제한
          maxWidthOrHeight: 1920, // 가로세로 최대 1920px (FHD급)
          useWebWorker: true, // 별도 스레드에서 처리 (UI 버벅임 방지)
          fileType: "image/webp",
        };

        // 압축 수행
        const compressedFile = await imageCompression(file, options);

        const fileExt = compressedFile.name.split(".").pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Supabase Storage 업로드
        // vercel 통신 용량 제한으로 클라이언트에서 직접 supabase로 업로드
        const { error: storageError } = await supabase.storage
          .from("photos")
          .upload(filePath, compressedFile, {
            cacheControl: "31536000",
            upsert: true,
          });

        if (storageError) throw storageError;

        // 퍼블릭 URL 생성
        const {
          data: { publicUrl },
        } = supabase.storage.from("photos").getPublicUrl(filePath);

        return publicUrl; // URL만 반환하도록 변경
      });

      // 모든 파일이 supabase에 업로드될 때까지 대기
      const uploadedUrls = await Promise.all(uploadPromises);

      // post 테이블 저장용 server action 호출
      const result = await uploadPost(uploadedUrls, caption);

      if (result.success) {
        alert("등록 완료!");
        onSuccess();

        // 폼 초기화
        setImages([]);
        setPreviews([]);
        setCaption("");
      }
    } catch (error) {
      console.error("Upload/DB Error:", error);
      throw new Error("다중 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-2">
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
        className="hidden "
      />
      <textarea
        placeholder="설명을 입력하세요..."
        className="w-full p-4 bg-gray-50 rounded-xl h-32 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      다중 업로드는 개발중...
      {/* <button
        className="w-full py-4 bg-blue-500 text-white rounded-xl font-bold active:scale-[0.98] transition-transform"
        onTouchStart={handleSubmit}
      >
        {images.length}개의 게시물 등록하기
      </button> */}
      <button
        type="button"
        className={`w-full py-4 rounded-xl font-bold transition-transform active:scale-[0.98] flex items-center justify-center gap-2 ${
          isUploading
            ? "bg-gray-400 text-white cursor-not-allowed" // 업로드 중일 때 스타일
            : "bg-blue-500 text-white hover:bg-blue-600" // 평소 스타일
        }`}
        onTouchStart={!isUploading ? handleSubmit : undefined}
        onClick={!isUploading ? handleSubmit : undefined} // 일반 클릭 대응
        disabled={isUploading} // 실제 버튼 기능 차단
      >
        {isUploading ? (
          <>
            {/* 간단한 스피너 아이콘 (선택 사항) */}
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>업로드 중...</span>
          </>
        ) : (
          <span>{images.length}개의 게시물 등록하기</span>
        )}
      </button>
    </div>
  );
}
