import { Prisma } from "@prisma/client";
import { getPostById } from "@/app/actions/post";

export type PostType = Exclude<
  Prisma.PromiseReturnType<typeof getPostById>,
  null
>;
