import { Metadata } from "next";
import { notFound } from "next/navigation";
import PostDetailFeedMobile from "@/components/PostDetailFeedMobile";
import GalleryPage from "@/app/(gallery)/page";
import { getPostById, getPostsAll } from "@/app/actions/post";

export const dynamic = "force-dynamic";

export default async function DirectEnteredPostDetail({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const allPosts = await getPostsAll();

  if (!allPosts) return notFound();

  return (
    <main className="relative min-h-screen">
      {/* /(gallery)/page.tsx를 배경에 깔아둠 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <GalleryPage />
      </div>

      <div className="fixed inset-0 z-50 bg-white md:hidden">
        <PostDetailFeedMobile
          initialPosts={allPosts}
          initialTargetId={id}
          isIntercepted={false}
        />
      </div>
    </main>
  );
}

// 각 페이지 메타데이터
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const post = await getPostById(id);

  if (!post) {
    return { title: "포스트를 찾을 수 없습니다" };
  }

  return {
    title: `김재이 갤러리 | ${post.caption?.slice(0, 10)}...`,
    openGraph: {
      title: "김재이 갤러리",
      description:
        `${post.caption?.slice(0, 10)}...` || "공유된 이미지를 확인해보세요.",
      images: [
        {
          url:
            post.media[0]?.thumbnailUrl ||
            `${process.env.NEXT_PUBLIC_BASE_URL}/images/meta_thumbnail.png`,
          width: 800,
          height: 600,
        },
      ],
    },
  };
}
