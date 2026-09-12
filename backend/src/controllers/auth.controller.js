import { registerUser, loginUser, getMe } from '../services/auth.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { env } from '../config/env.js';

/** Cookie options — httpOnly prevents JS access (XSS mitigation) */
const cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',  // HTTPS only in prod
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,      // 7 days in ms
};

/**
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    const { user, token } = await registerUser({ fullName, email, password });

    res.cookie('token', token, cookieOptions);
    return sendSuccess(res, 201, 'Account created successfully.', { user });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser({ email, password });

    res.cookie('token', token, cookieOptions);
    return sendSuccess(res, 200, 'Logged in successfully.', { user });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/logout
 * Clears the JWT cookie — no DB interaction needed.
 */
export const logout = (_req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'strict',
  });
  return sendSuccess(res, 200, 'Logged out successfully.');
};

/**
 * GET /api/auth/me
 * Returns the current user's profile.
 * Used by the frontend to restore auth state on page refresh.
 */
export const me = async (req, res, next) => {
  try {
    const user = await getMe(req.user.userId);
    return sendSuccess(res, 200, 'User retrieved.', { user });
  } catch (err) {
    next(err);
  }
};
