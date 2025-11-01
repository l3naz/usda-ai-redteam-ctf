import express from 'express'
import {main,postapi,metadata} from '../Controllers/main.js'
import authRoutes from './authRoutes.js'
import leaderboardRoutes from './leaderboardRoutes.js'

const router = express.Router()

// Health check
router.get('/',main)

// Authentication routes
router.use('/auth', authRoutes)

// Leaderboard routes
router.use('/leaderboard', leaderboardRoutes)

// API routes
router.post('/metadata',metadata)

router.post('/api',postapi)

export default router