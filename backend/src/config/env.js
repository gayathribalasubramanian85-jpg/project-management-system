import dotenv from 'dotenv';

dotenv.config();

/**
 * Centralised, validated environment configuration.
 * The app fails fast at startup if required variables are missing.
 */

const required = ['DATABASE_URL', 'JWT_SECRET'];

for (const key of required) {
  if (!process.env[key]) {
    process.stderr.write(`[config] Missing required environment variable: ${key}\n`);
    process.exit(1);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,

  databaseUrl: process.env.DATABASE_URL,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,

  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 min
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX, 10) || 10,
};
