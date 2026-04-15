import { getPostsAllWithCursor } from "@/app/actions/post";
import BottomNav from "@/components/Navigation/BottomNav";
import InfinitePhotoList from "@/components/InfinitePhotoList";

export default async function GalleryPage() {
  const response = await getPostsAllWithCursor();
  const posts = response?.posts || [];
  const nextCursor = response?.nextCursor || null;

  return (
    <div className="mx-auto">
      <InfinitePhotoList initialPhotos={posts} initialCursor={nextCursor} />
      <BottomNav />
    </div>
  );
}
