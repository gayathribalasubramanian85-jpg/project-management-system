import { validationResult } from 'express-validator';
import { sendError } from '../utils/response.js';

/**
 * Runs after express-validator chains.
 * If any validation errors exist, returns a 422 with the full error list.
 * Otherwise calls next().
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, 422, 'Validation failed.', errors.array());
  }
  next();
};
