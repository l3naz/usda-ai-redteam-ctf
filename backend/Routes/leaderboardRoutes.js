// Leaderboard Routes

import express from 'express';
import {
  getLeaderboard,
  updateLeaderboardScore,
} from '../Controllers/leaderboardController.js';
import { authenticate } from '../Middlewares/auth.js';

const router = express.Router();

/**
 * Public route - anyone can view leaderboard
 */
router.get('/', getLeaderboard);

/**
 * Protected route - only authenticated users can update their score
 */
router.post('/update', authenticate, updateLeaderboardScore);

export default router;

