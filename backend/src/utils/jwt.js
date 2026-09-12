import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Sign a JWT for the given user payload.
 * @param {{ userId: number, email: string }} payload
 * @returns {string} Signed token
 */
export const signToken = (payload) => {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
};

/**
 * Verify and decode a JWT.
 * Throws if invalid or expired.
 * @param {string} token
 * @returns {{ userId: number, email: string }}
 */
export const verifyToken = (token) => {
  return jwt.verify(token, env.jwtSecret);
};
