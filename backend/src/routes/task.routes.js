import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { createTaskValidator, updateTaskValidator } from '../validators/task.validator.js';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/task.controller.js';

const router = Router();

// All task routes require authentication
router.use(authenticate);

// GET /api/tasks?projectId=&search=&status=&priority=
router.get('/', getAllTasks);

// GET /api/tasks/:id
router.get('/:id', getTaskById);

// POST /api/tasks
router.post('/', createTaskValidator, validate, createTask);

// PUT /api/tasks/:id
router.put('/:id', updateTaskValidator, validate, updateTask);

// DELETE /api/tasks/:id
router.delete('/:id', deleteTask);

export default router;
