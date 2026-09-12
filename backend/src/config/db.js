import { PrismaClient } from '@prisma/client';

/**
 * Singleton Prisma client.
 * Re-using a single instance avoids exhausting the connection pool
 * during hot-reloads in development.
 */

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
