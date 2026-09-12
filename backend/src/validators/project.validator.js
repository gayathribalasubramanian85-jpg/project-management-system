import { body } from 'express-validator';

/**
 * Validation chains for project endpoints.
 * Fully implemented in Phase 3.
 */

const PROJECT_STATUSES = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'];

export const createProjectValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Project name is required.')
    .isLength({ max: 150 }).withMessage('Project name must not exceed 150 characters.'),

  body('description')
    .optional()
    .trim(),

  body('status')
    .optional()
    .isIn(PROJECT_STATUSES).withMessage(`Status must be one of: ${PROJECT_STATUSES.join(', ')}.`),

  body('startDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('Start date must be a valid date (YYYY-MM-DD).'),

  body('endDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('End date must be a valid date (YYYY-MM-DD).'),
];

export const updateProjectValidator = createProjectValidator;
