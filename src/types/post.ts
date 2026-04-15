import { Prisma } from "@prisma/client";
import { getPostById } from "@/app/actions/post";

/*
    {
      media: {
          id: string;
          createdAt: Date;
          orderIndex: number;
          postId: string;
          mediaUrl: string;
          mediaType: $Enums.MediaType;
          thumbnailUrl: string | null;
      }[];
    } & {
        id: string;
        caption: string | null;
        createdAt: Date;
        updatedAt: Date;
    }
*/
export type PostType = Exclude<
  Prisma.PromiseReturnType<typeof getPostById>,
  null
>;

/*
    {
      id: string;
      createdAt: Date;
      orderIndex: number;
      postId: string;
      mediaUrl: string;
      mediaType: $Enums.MediaType;
      thumbnailUrl: string | null;
    }
 */
export type PostMediaType = PostType["media"][number];
