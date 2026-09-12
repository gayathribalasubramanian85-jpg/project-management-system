import { getDashboardStats } from '../services/dashboard.service.js';
import { sendSuccess } from '../utils/response.js';

/**
 * GET /api/dashboard
 * Returns aggregated statistics for the authenticated user.
 */
export const getDashboard = async (req, res, next) => {
  try {
    const stats = await getDashboardStats(req.user.userId);
    return sendSuccess(res, 200, 'Dashboard stats retrieved.', { stats });
  } catch (err) {
    next(err);
  }
};
