import { prisma } from '../config/db.js';

/**
 * Helper — throws a 404 whether the project doesn't exist OR isn't owned
 * by the requesting user. This prevents existence leakage (no 403).
 */
const notFound = () => {
  const err = new Error('Project not found.');
  err.statusCode = 404;
  return err;
};

/**
 * Get all projects owned by a user.
 * Supports optional search (name contains) and status filter.
 *
 * @param {number} userId
 * @param {{ search?: string, status?: string }} filters
 * @returns {Promise<Project[]>}
 */
export const findAllProjects = async (userId, { search = '', status = '' } = {}) => {
  return prisma.project.findMany({
    where: {
      userId,
      ...(status && { status }),
      ...(search && {
        name: { contains: search },
      }),
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      startDate: true,
      endDate: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { tasks: true } },
    },
  });
};

/**
 * Get a single project by ID, scoped to the owning user.
 *
 * @param {number} id
 * @param {number} userId
 * @returns {Promise<Project>}
 */
export const findProjectById = async (id, userId) => {
  const project = await prisma.project.findFirst({
    where: { id, userId },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      startDate: true,
      endDate: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { tasks: true } },
    },
  });
  if (!project) throw notFound();
  return project;
};

/**
 * Create a new project for the authenticated user.
 *
 * @param {{ name, description, status, startDate, endDate }} data
 * @param {number} userId
 * @returns {Promise<Project>}
 */
export const createProject = async (data, userId) => {
  const { name, description, status, startDate, endDate } = data;
  return prisma.project.create({
    data: {
      name,
      description: description || null,
      status: status || 'NOT_STARTED',
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      userId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      startDate: true,
      endDate: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * Update a project — ownership checked via WHERE userId = userId.
 *
 * @param {number} id
 * @param {{ name?, description?, status?, startDate?, endDate? }} data
 * @param {number} userId
 * @returns {Promise<Project>}
 */
export const updateProject = async (id, data, userId) => {
  // Verify ownership first
  const existing = await prisma.project.findFirst({ where: { id, userId } });
  if (!existing) throw notFound();

  const { name, description, status, startDate, endDate } = data;

  return prisma.project.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description: description || null }),
      ...(status !== undefined && { status }),
      ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
      ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
    },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      startDate: true,
      endDate: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * Delete a project — cascades to all its tasks via DB foreign key.
 *
 * @param {number} id
 * @param {number} userId
 */
export const deleteProject = async (id, userId) => {
  const existing = await prisma.project.findFirst({ where: { id, userId } });
  if (!existing) throw notFound();
  await prisma.project.delete({ where: { id } });
};
