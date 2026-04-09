// 서버단
import { prisma } from "@/lib/prisma";
import GuestbookContainer from "@/app/components/GuestbookContainer";
import ThemeToggle from "./components/ThemeToggle";

export default async function Home() {
  const messages = await prisma.guestbook.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <main>
      <ThemeToggle />

      {/* 서버에서 가져온 데이터를 클라이언트 컴포넌트에 주입 */}
      <GuestbookContainer initialMessages={messages} />
    </main>
  );
}
