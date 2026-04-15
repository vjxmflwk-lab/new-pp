"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import infoPhoto from "../../../public/images/info.jpg";

const sections = [
  {
    title: "코어 언어 & 프레임워크",
    items: [
      { label: "언어", value: "React 19, TypeScript" },
      { label: "프레임워크", value: "Next.js 15" },
      { label: "런타임", value: "Node.js 24" },
    ],
  },
  {
    title: "상태관리 & 통신",
    items: [
      { label: "Server상태", value: "Next Server Actions" },
      { label: "Client상태", value: "Zustand" },
      {
        label: "통신/캐싱",
        value: "TanStack Query",
      },
      { label: "유효성검증", value: "Zod" },
    ],
  },
  {
    title: "스타일",
    items: [
      { label: "CSS프레임워크", value: "Tailwind" },
      { label: "UI컴포넌트", value: "shadcn/ui" },
    ],
  },
  {
    title: "백앤드 & DB",
    items: [
      { label: "서버 인프라", value: "Vercel" },
      { label: "DB", value: "Supabase (PostgreSQL)" },
      { label: "ORM", value: "Prisma" },
    ],
  },
  {
    title: "DevOps",
    items: [
      { label: "패키지매니저", value: "pnpm" },
      { label: "단위테스트", value: "Jest" },
      { label: "빌드", value: "Turbopack (Bundler), SWC (Compiler)" },
      { label: "CI/CD", value: "GitHub Actions" },
    ],
  },
];

export default function InfoPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 고정 헤더 영역 */}
      <nav className="sticky top-0 z-10 flex h-14 items-center border-b bg-white/80 px-4 backdrop-blur-md">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-full active:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="ml-2 text-lg font-bold text-gray-900">메인으로</h1>
      </nav>

      {/*  정보 영역 */}

      <main className="p-3 space-y-3">
        <div className="max-w-2xl mx-auto p-8 bg-white text-[#1a1a1a] font-sans">
          <div>
            <h3 className="text-[20px] font-bold tracking-tight text-gray-700">
              김<span className="text-pink-300">재</span>
              <span className="text-yellow-300">이</span> 사진 올리는 사이트 ㅋ
            </h3>
            <div className="mb-10 flex justify-center pt-7">
              <div className="w-full max-w-[350px] rounded-x0.5 overflow-hidden border border-gray-100 shadow-sm">
                <Image src={infoPhoto} alt="" priority />
              </div>
            </div>
          </div>

          <div className="h-1 w-full bg-gray-100 border-y border-gray-100 my-10" />

          <div className=" space-y-10 text-gray-700">
            <h1 className="text-[18px] font-bold tracking-tight "></h1>
            {sections.map((section, idx) => (
              <div key={idx} className="space-y-2 mb-5">
                {/* 섹션 제목 */}
                <h3 className="text-[14px] font-bold tracking-tight">
                  {section.title}
                </h3>

                {/* 리스트 아이템 */}
                <ul className="space-y-1 pl-5 text-[12px]">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="relative list-disc pl-0">
                      <span>{item.label}:</span>{" "}
                      <span className=" text-gray-800">{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <footer className="pt-10 text-[12px] text-gray-400"></footer>
      </main>
    </div>
  );
}
