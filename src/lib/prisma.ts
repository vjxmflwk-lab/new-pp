import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // log: ["query"], // 터미널에 실제 SQL 쿼리가 찍힘
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
