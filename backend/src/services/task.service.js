import { prisma } from '../config/db.js';

/**
 * Helper — throws 404 whether the task doesn't exist OR isn't owned
 * by the requesting user. Prevents existence leakage (no 403).
 */
const notFound = () => {
  const err = new Error('Task not found.');
  err.statusCode = 404;
  return err;
};

/**
 * Verify the project exists AND is owned by userId.
 * Throws 404 if not — prevents creating tasks on another user's project.
 */
const verifyProjectOwnership = async (projectId, userId) => {
  const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
  if (!project) {
    const err = new Error('Project not found.');
    err.statusCode = 404;
    throw err;
  }
  return project;
};

/**
 * Get all tasks owned by a user.
 * Supports optional projectId scope, search (name contains),
 * status filter, and priority filter.
 *
 * @param {number} userId
 * @param {{ projectId?, search?, status?, priority? }} filters
 */
export const findAllTasks = async (userId, { projectId, search = '', status = '', priority = '' } = {}) => {
  return prisma.task.findMany({
    where: {
      userId,
      ...(projectId && { projectId: Number(projectId) }),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(search && { name: { contains: search } }),
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      description: true,
      priority: true,
      status: true,
      dueDate: true,
      createdAt: true,
      updatedAt: true,
      projectId: true,
    },
  });
};

/**
 * Get a single task by ID, scoped to the owning user.
 *
 * @param {number} id
 * @param {number} userId
 */
export const findTaskById = async (id, userId) => {
  const task = await prisma.task.findFirst({
    where: { id, userId },
    select: {
      id: true,
      name: true,
      description: true,
      priority: true,
      status: true,
      dueDate: true,
      createdAt: true,
      updatedAt: true,
      projectId: true,
    },
  });
  if (!task) throw notFound();
  return task;
};

/**
 * Create a new task.
 * Validates that the target project is owned by userId before creating.
 *
 * @param {{ name, description, priority, status, dueDate, projectId }} data
 * @param {number} userId
 */
export const createTask = async (data, userId) => {
  const { name, description, priority, status, dueDate, projectId } = data;

  // Ownership check on the parent project
  await verifyProjectOwnership(Number(projectId), userId);

  return prisma.task.create({
    data: {
      name,
      description: description || null,
      priority: priority || 'MEDIUM',
      status: status || 'PENDING',
      dueDate: dueDate ? new Date(dueDate) : null,
      projectId: Number(projectId),
      userId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      priority: true,
      status: true,
      dueDate: true,
      createdAt: true,
      updatedAt: true,
      projectId: true,
    },
  });
};

/**
 * Update a task — ownership checked via WHERE userId = userId.
 *
 * @param {number} id
 * @param {{ name?, description?, priority?, status?, dueDate? }} data
 * @param {number} userId
 */
export const updateTask = async (id, data, userId) => {
  const existing = await prisma.task.findFirst({ where: { id, userId } });
  if (!existing) throw notFound();

  const { name, description, priority, status, dueDate } = data;

  return prisma.task.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description: description || null }),
      ...(priority !== undefined && { priority }),
      ...(status !== undefined && { status }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
    },
    select: {
      id: true,
      name: true,
      description: true,
      priority: true,
      status: true,
      dueDate: true,
      createdAt: true,
      updatedAt: true,
      projectId: true,
    },
  });
};

/**
 * Delete a task — ownership verified before deletion.
 *
 * @param {number} id
 * @param {number} userId
 */
export const deleteTask = async (id, userId) => {
  const existing = await prisma.task.findFirst({ where: { id, userId } });
  if (!existing) throw notFound();
  await prisma.task.delete({ where: { id } });
};
