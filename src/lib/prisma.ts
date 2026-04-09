import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // log: ["query"], // 터미널에 실제 SQL 쿼리가 찍혀서 공부할 때 도움됩니다!
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
