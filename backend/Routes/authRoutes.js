// Authentication Routes

import express from 'express';
import {
  signup,
  signin,
  getProfile,
  verifyTokenEndpoint,
} from '../Controllers/authController.js';
import { authenticate } from '../Middlewares/auth.js';

const router = express.Router();

/**
 * Public routes
 */
router.post('/signup', signup);
router.post('/signin', signin);

/**
 * Protected routes
 */
router.get('/verify', authenticate, verifyTokenEndpoint);
router.get('/profile', authenticate, getProfile);

export default router;

