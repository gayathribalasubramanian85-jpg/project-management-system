import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { prisma } from './config/db.js';
import app from './app.js';

const PORT = env.port;

/**
 * Attempt to verify database connectivity.
 * In development, a missing DB should not prevent the server from starting —
 * it logs a warning and continues so other endpoints (health check, etc.) work.
 * In production the process exits on DB failure.
 */
async function checkDatabase() {
  try {
    await prisma.$connect();
    logger.info('Database connection established.');
  } catch (error) {
    if (env.nodeEnv === 'production') {
      logger.error('Failed to connect to database (production — exiting):', error);
      process.exit(1);
    } else {
      logger.warn(
        'Could not connect to database — update DATABASE_URL in backend/.env. ' +
          'Server will still start; DB-dependent routes will fail until connected.'
      );
    }
  }
}

async function startServer() {
  await checkDatabase();

  const server = app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT} [${env.nodeEnv}]`);
    logger.info(`Health check: http://localhost:${PORT}/api/health`);
  });

  // ─── Graceful shutdown ──────────────────────────────────────────────────────
  const shutdown = async (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await prisma.$disconnect();
      logger.info('Database disconnected. Process exiting.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer();
