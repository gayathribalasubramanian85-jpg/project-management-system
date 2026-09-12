import { body } from 'express-validator';

/**
 * Validation chains for task endpoints.
 * Fully implemented in Phase 4.
 */

const TASK_STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

export const createTaskValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Task name is required.')
    .isLength({ max: 150 }).withMessage('Task name must not exceed 150 characters.'),

  body('description')
    .optional()
    .trim(),

  body('priority')
    .optional()
    .isIn(TASK_PRIORITIES).withMessage(`Priority must be one of: ${TASK_PRIORITIES.join(', ')}.`),

  body('status')
    .optional()
    .isIn(TASK_STATUSES).withMessage(`Status must be one of: ${TASK_STATUSES.join(', ')}.`),

  body('dueDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('Due date must be a valid date (YYYY-MM-DD).'),

  body('projectId')
    .notEmpty().withMessage('Project ID is required.')
    .isInt({ min: 1 }).withMessage('Project ID must be a positive integer.'),
];

export const updateTaskValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 150 }).withMessage('Task name must not exceed 150 characters.'),

  body('description')
    .optional()
    .trim(),

  body('priority')
    .optional()
    .isIn(TASK_PRIORITIES).withMessage(`Priority must be one of: ${TASK_PRIORITIES.join(', ')}.`),

  body('status')
    .optional()
    .isIn(TASK_STATUSES).withMessage(`Status must be one of: ${TASK_STATUSES.join(', ')}.`),

  body('dueDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('Due date must be a valid date (YYYY-MM-DD).'),
];
