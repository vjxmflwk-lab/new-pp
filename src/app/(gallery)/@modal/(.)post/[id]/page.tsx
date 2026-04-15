import { notFound } from "next/navigation";
import PostDetailFeedMobile from "@/components/PostDetailFeedMobile";
import { getPostsAll } from "@/app/actions/post";

export default async function InterceptedPostDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const allPosts = await getPostsAll();

  if (!allPosts) return notFound();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white md:bg-black/70">
      <div className="h-full w-full overflow-y-auto bg-white md:h-[90vh] md:max-w-5xl md:rounded-lg">
        <PostDetailFeedMobile
          initialPosts={allPosts}
          targetId={id}
          isIntercepted={true}
        />
      </div>
    </div>

    //  PC용 소스
    //
    // <PhotoModalFrame>
    //   <div className="relative flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-2xl max-w-7xl w-full h-[85vh] md:h-[90vh]">
    //     <div className="relative flex-1 bg-gray-900 flex items-center justify-center overflow-hidden">
    //       <Image
    //         src={post.media[0]?.mediaUrl}
    //         alt={post.caption || ""}
    //         fill
    //         priority
    //         sizes="(max-width: 768px) 100vw, 75vw"
    //         className="object-contain"
    //       />
    //     </div>
    //     {/* 정보 영역 */}
    //     <div className="w-full md:w-80 p-5 flex flex-col border-l border-gray-100 bg-white">
    //       <div className="flex-1 py-10 space-y-3 overflow-y-auto text-2xl text-gray-700">
    //         <p>
    //           <span className="font-semibold text-gray-700 mr-2">
    //             {post.caption}
    //           </span>
    //         </p>
    //       </div>
    //       {/* 하단 영역 */}
    //       <div className="pt-4 border-t border-gray-100 mt-auto space-y-2.5">
    //         {/* 삭제 버튼 */}
    //         <PhotoDeleteButton
    //           id={post.media[0]?.id}
    //           imageUrl={post.media[0]?.mediaUrl}
    //         />
    //         {/* 닫기 버튼 */}
    //         <PhotoModalCloseButton />
    //       </div>
    //     </div>

    //     {/* PC 전용 우측 상단 닫기 아이콘 */}
    //     <button
    //       className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 p-1.5 rounded-full hover:bg-gray-100 hidden md:block"
    //       // onClick={() => window.history.back()}
    //     >
    //       <X size={20} />
    //     </button>
    //   </div>
    // </PhotoModalFrame>
  );
}
