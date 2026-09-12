import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

/**
 * Skip rate limiting for localhost in development.
 * This prevents the limiter from blocking repeated manual/test requests
 * during development. In production all IPs are subject to limits.
 */
const skipInDev = (req) => {
  if (env.nodeEnv !== 'production') {
    const ip = req.ip || req.connection.remoteAddress || '';
    return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
  }
  return false;
};

/**
 * Strict rate limiter for authentication endpoints.
 * Protects against brute-force credential attacks.
 */
export const authRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax,
  standardHeaders: true,  // Return RateLimit-* headers
  legacyHeaders: false,
  skip: skipInDev,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});

/**
 * General API rate limiter — more lenient.
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInDev,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});
