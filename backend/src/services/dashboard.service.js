import { prisma } from '../config/db.js';

/**
 * Aggregate dashboard statistics for the authenticated user.
 * All queries are scoped to userId — never leaks other users' data.
 *
 * Uses Promise.all to run all counts in parallel for performance.
 *
 * @param {number} userId
 * @returns {{
 *   totalProjects: number,
 *   projectsNotStarted: number,
 *   projectsInProgress: number,
 *   projectsCompleted: number,
 *   totalTasks: number,
 *   pendingTasks: number,
 *   inProgressTasks: number,
 *   completedTasks: number,
 * }}
 */
export const getDashboardStats = async (userId) => {
  const [
    totalProjects,
    projectsNotStarted,
    projectsInProgress,
    projectsCompleted,
    totalTasks,
    pendingTasks,
    inProgressTasks,
    completedTasks,
  ] = await Promise.all([
    // Projects
    prisma.project.count({ where: { userId } }),
    prisma.project.count({ where: { userId, status: 'NOT_STARTED' } }),
    prisma.project.count({ where: { userId, status: 'IN_PROGRESS' } }),
    prisma.project.count({ where: { userId, status: 'COMPLETED' } }),
    // Tasks
    prisma.task.count({ where: { userId } }),
    prisma.task.count({ where: { userId, status: 'PENDING' } }),
    prisma.task.count({ where: { userId, status: 'IN_PROGRESS' } }),
    prisma.task.count({ where: { userId, status: 'COMPLETED' } }),
  ]);

  return {
    totalProjects,
    projectsNotStarted,
    projectsInProgress,
    projectsCompleted,
    totalTasks,
    pendingTasks,
    inProgressTasks,
    completedTasks,
  };
};
