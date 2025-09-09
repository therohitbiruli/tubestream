// In frontend/src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// This prevents Prisma Client from being initialized multiple times in development
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export default prisma;