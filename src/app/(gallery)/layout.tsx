export default function GalleryLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      {/* 메인 콘텐츠 */}
      <div className="relative z-0">{children}</div>

      {/* 모달 슬롯: 내용이 없을 때 터치를 방해하지 않도록 pointer-events-none 처리*/}
      <div className="fixed inset-0 z-[100] pointer-events-none">
        <div className="pointer-events-auto">{modal}</div>
      </div>
    </div>
  );
}

// 사이트 메타데이터
export const metadata = {
  title: {
    default: "김재이 갤러리",
    template: "",
  },
  description: "",
  openGraph: {
    title: "김재이 갤러리",
    description: "",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/images/meta_thumbnail.png`],
  },
};
