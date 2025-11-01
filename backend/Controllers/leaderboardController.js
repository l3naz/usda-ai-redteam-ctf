// Leaderboard Controller
// Handles fetching and updating leaderboard data

import { PrismaClient } from '../generated/prisma/index.js';
import { logger } from '../lib/logger.js';

const prisma = new PrismaClient();

/**
 * Get leaderboard - fetches all users sorted by XP/score
 */
export async function getLeaderboard(req, res, next) {
  try {
    // Fetch all users with their XP totals, ordered by xpTotal descending
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        xpTotal: true,
      },
      orderBy: {
        xpTotal: 'desc',
      },
    });

    // Transform users to leaderboard format
    const leaderboard = users.map((user) => ({
      id: user.id,
      name: user.displayName || user.username || user.email.split('@')[0],
      score: user.xpTotal || 0,
    }));

    logger.info({ count: leaderboard.length }, 'Leaderboard fetched');

    res.json(leaderboard);
  } catch (error) {
    logger.error({ error }, 'Get leaderboard error');
    next(error);
  }
}

/**
 * Update user score (add XP to user's total)
 */
export async function updateLeaderboardScore(req, res, next) {
  try {
    const userId = req.user?.userId;
    const { points } = req.body;

    // Validation
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }

    if (!points || typeof points !== 'number' || points < 0) {
      return res.status(400).json({
        error: 'Invalid points value',
      });
    }

    // Get current user to check current score
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xpTotal: true },
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    // Update user's XP total
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        xpTotal: {
          increment: points,
        },
      },
      select: {
        id: true,
        xpTotal: true,
      },
    });

    logger.info({ userId, points, newScore: updatedUser.xpTotal }, 'Leaderboard score updated');

    res.json({
      success: true,
      newScore: updatedUser.xpTotal,
    });
  } catch (error) {
    logger.error({ error }, 'Update leaderboard score error');
    next(error);
  }
}

