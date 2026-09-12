import bcrypt from 'bcrypt';
import { env } from '../config/env.js';

/**
 * Hash a plain-text password.
 * @param {string} plain
 * @returns {Promise<string>} bcrypt hash
 */
export const hashPassword = (plain) => {
  return bcrypt.hash(plain, env.bcryptRounds);
};

/**
 * Compare a plain-text password against a stored hash.
 * @param {string} plain
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export const comparePassword = (plain, hash) => {
  return bcrypt.compare(plain, hash);
};
