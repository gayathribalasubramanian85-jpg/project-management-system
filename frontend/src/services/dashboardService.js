import axiosInstance from './axiosInstance.js';

/**
 * Fetch aggregated dashboard statistics for the authenticated user.
 * @returns {Promise<{
 *   totalProjects, projectsNotStarted, projectsInProgress, projectsCompleted,
 *   totalTasks, pendingTasks, inProgressTasks, completedTasks
 * }>}
 */
export const getDashboardStats = async () => {
  const res = await axiosInstance.get('/dashboard');
  return res.data.data.stats;
};
