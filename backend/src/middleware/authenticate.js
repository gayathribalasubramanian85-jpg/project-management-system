import { verifyToken } from '../utils/jwt.js';
import { sendError } from '../utils/response.js';

/**
 * Authentication middleware.
 * Reads the JWT from the httpOnly cookie and attaches the decoded
 * payload to req.user. Returns 401 if missing or invalid.
 */
export const authenticate = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return sendError(res, 401, 'Authentication required. Please log in.');
    }

    const decoded = verifyToken(token);
    req.user = decoded; // { userId, email, iat, exp }
    next();
  } catch {
    return sendError(res, 401, 'Invalid or expired session. Please log in again.');
  }
};
