import axiosInstance from './axiosInstance.js';

/**
 * Register a new user account.
 * @param {{ fullName: string, email: string, password: string }} data
 * @returns {{ user: { id, fullName, email, createdAt } }}
 */
export const register = async ({ fullName, email, password }) => {
  const res = await axiosInstance.post('/auth/register', { fullName, email, password });
  return res.data.data; // { user }
};

/**
 * Log in with email + password.
 * The server sets an httpOnly JWT cookie on success.
 * @param {{ email: string, password: string }} data
 * @returns {{ user: { id, fullName, email, createdAt } }}
 */
export const login = async ({ email, password }) => {
  const res = await axiosInstance.post('/auth/login', { email, password });
  return res.data.data; // { user }
};

/**
 * Log out — clears the JWT cookie on the server.
 */
export const logout = async () => {
  await axiosInstance.post('/auth/logout');
};

/**
 * Fetch the current authenticated user's profile.
 * Used on app load to restore auth state from the existing cookie.
 * @returns {{ user: { id, fullName, email, createdAt } }}
 */
export const getMe = async () => {
  const res = await axiosInstance.get('/auth/me');
  return res.data.data; // { user }
};
