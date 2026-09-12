import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

/**
 * Global Express error handler.
 * Must be registered LAST — after all routes.
 * Keeps stack traces out of production responses.
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack, path: req.path, method: req.method });

  // Prisma known errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: 'A record with that value already exists.',
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Record not found.',
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message =
    env.nodeEnv === 'production' && statusCode === 500
      ? 'An unexpected error occurred.'
      : err.message || 'An unexpected error occurred.';

  return res.status(statusCode).json({
    success: false,
    message,
    ...(env.nodeEnv === 'development' && { stack: err.stack }),
  });
};
