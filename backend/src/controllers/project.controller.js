import * as projectService from '../services/project.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * GET /api/projects
 * Query params: ?search=name&status=IN_PROGRESS
 */
export const getAllProjects = async (req, res, next) => {
  try {
    const { search = '', status = '' } = req.query;
    const projects = await projectService.findAllProjects(req.user.userId, { search, status });
    return sendSuccess(res, 200, 'Projects retrieved.', { projects });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/projects/:id
 */
export const getProjectById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 400, 'Invalid project ID.');
    const project = await projectService.findProjectById(id, req.user.userId);
    return sendSuccess(res, 200, 'Project retrieved.', { project });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/projects
 */
export const createProject = async (req, res, next) => {
  try {
    const project = await projectService.createProject(req.body, req.user.userId);
    return sendSuccess(res, 201, 'Project created.', { project });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/projects/:id
 */
export const updateProject = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 400, 'Invalid project ID.');
    const project = await projectService.updateProject(id, req.body, req.user.userId);
    return sendSuccess(res, 200, 'Project updated.', { project });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/projects/:id
 */
export const deleteProject = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 400, 'Invalid project ID.');
    await projectService.deleteProject(id, req.user.userId);
    return sendSuccess(res, 200, 'Project deleted.');
  } catch (err) {
    next(err);
  }
};
