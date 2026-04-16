import { getPostsAllWithCursor } from "@/app/actions/post";
import BottomNav from "@/components/Navigation/BottomNav";
import InfinitePostList from "@/components/InfinitePostList";

export const revalidate = 60; // 서버 캐시 유통기한 1분

export default async function GalleryPage() {
  const response = await getPostsAllWithCursor();
  const posts = response?.posts || [];
  const nextCursor = response?.nextCursor || null;

  return (
    <div className="mx-auto">
      <InfinitePostList initialPosts={posts} initialCursor={nextCursor} />
      <BottomNav />
    </div>
  );
}
