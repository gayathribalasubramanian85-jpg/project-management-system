import { prisma } from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';

/**
 * Register a new user.
 * Throws a 409 AppError if the email is already taken.
 *
 * @param {{ fullName: string, email: string, password: string }} data
 * @returns {{ user: { id, fullName, email, createdAt }, token: string }}
 */
export const registerUser = async ({ fullName, email, password }) => {
  // Check uniqueness before hashing to fail fast
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('An account with that email already exists.');
    err.statusCode = 409;
    throw err;
  }

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: { fullName, email, password: hashed },
    select: { id: true, fullName: true, email: true, createdAt: true },
  });

  const token = signToken({ userId: user.id, email: user.email });
  return { user, token };
};

/**
 * Validate credentials and return a signed JWT.
 * Always throws a generic 401 — never reveals whether the email exists.
 *
 * @param {{ email: string, password: string }} data
 * @returns {{ user: { id, fullName, email, createdAt }, token: string }}
 */
export const loginUser = async ({ email, password }) => {
  const INVALID = new Error('Invalid email or password.');
  INVALID.statusCode = 401;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw INVALID;

  const valid = await comparePassword(password, user.password);
  if (!valid) throw INVALID;

  const token = signToken({ userId: user.id, email: user.email });

  // Never include the password hash in the returned object
  const { password: _pw, ...safeUser } = user;
  return { user: safeUser, token };
};

/**
 * Return the public profile of the currently authenticated user.
 * Used by the frontend on page refresh to restore auth state.
 *
 * @param {number} userId
 * @returns {{ id, fullName, email, createdAt }}
 */
export const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, fullName: true, email: true, createdAt: true },
  });
  if (!user) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
  }
  return user;
};
