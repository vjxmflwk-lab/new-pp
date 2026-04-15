const PROJECT_ID = "uwyskfxfmjmhyoikvdlh";

export default function supabaseLoader({ src, width, quality }: any) {
  // src가 이미 전체 URL인 경우와 경로만 있는 경우를 대응
  const url = src.includes("supabase.co")
    ? src
    : `https://${PROJECT_ID}.supabase.co/storage/v1/object/public/photos/${src}`;

  // format=webp와 width를 파라미터로 넘겨 서버 부하를 줄입니다.
  return `${url}?width=${width.toString()}&quality=${quality || 60}`;
}
