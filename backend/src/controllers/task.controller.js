import * as taskService from '../services/task.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * GET /api/tasks
 * Query params: ?projectId=&search=&status=&priority=
 */
export const getAllTasks = async (req, res, next) => {
  try {
    const { projectId, search = '', status = '', priority = '' } = req.query;
    const tasks = await taskService.findAllTasks(req.user.userId, {
      projectId,
      search,
      status,
      priority,
    });
    return sendSuccess(res, 200, 'Tasks retrieved.', { tasks });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/tasks/:id
 */
export const getTaskById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 400, 'Invalid task ID.');
    const task = await taskService.findTaskById(id, req.user.userId);
    return sendSuccess(res, 200, 'Task retrieved.', { task });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/tasks
 */
export const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.body, req.user.userId);
    return sendSuccess(res, 201, 'Task created.', { task });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/tasks/:id
 * Handles both full updates and mark-as-complete (just send { status: 'COMPLETED' }).
 */
export const updateTask = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 400, 'Invalid task ID.');
    const task = await taskService.updateTask(id, req.body, req.user.userId);
    return sendSuccess(res, 200, 'Task updated.', { task });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/tasks/:id
 */
export const deleteTask = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 400, 'Invalid task ID.');
    await taskService.deleteTask(id, req.user.userId);
    return sendSuccess(res, 200, 'Task deleted.');
  } catch (err) {
    next(err);
  }
};
