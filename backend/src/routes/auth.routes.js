import { Router } from 'express';
import { register, login, logout, me } from '../controllers/auth.controller.js';
import { registerValidator, loginValidator } from '../validators/auth.validator.js';
import { authenticate } from '../middleware/authenticate.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// POST /api/auth/register
router.post('/register', authRateLimiter, registerValidator, validate, register);

// POST /api/auth/login
router.post('/login', authRateLimiter, loginValidator, validate, login);

// POST /api/auth/logout
router.post('/logout', logout);

// GET /api/auth/me  — requires valid JWT cookie
router.get('/me', authenticate, me);

export default router;
