import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { createProjectValidator, updateProjectValidator } from '../validators/project.validator.js';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/project.controller.js';

const router = Router();

// All project routes require authentication
router.use(authenticate);

// GET /api/projects?search=&status=
router.get('/', getAllProjects);

// GET /api/projects/:id
router.get('/:id', getProjectById);

// POST /api/projects
router.post('/', createProjectValidator, validate, createProject);

// PUT /api/projects/:id
router.put('/:id', updateProjectValidator, validate, updateProject);

// DELETE /api/projects/:id
router.delete('/:id', deleteProject);

export default router;
