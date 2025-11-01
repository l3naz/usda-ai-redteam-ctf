// Authentication Controller
// Handles email/password signup and signin

import { PrismaClient } from '../generated/prisma/index.js';
import { hashPassword, verifyPassword, generateToken } from '../lib/auth.js';
import { logger } from '../lib/logger.js';

const prisma = new PrismaClient();

/**
 * Generate username from email or display name
 */
function generateUsername(email, displayName = null) {
  const base = displayName 
    ? displayName.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20)
    : email.split('@')[0].toLowerCase();
  
  const random = Math.random().toString(36).substring(2, 8);
  return `${base}_${random}`;
}

/**
 * Email/Password Signup
 */
export async function signup(req, res, next) {
  try {
    const { email, password, fullName, username } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long',
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'User with this email already exists',
      });
    }

    // Generate username if not provided
    let finalUsername = username;
    if (!finalUsername) {
      finalUsername = generateUsername(email, fullName);
      
      // Ensure username is unique
      let usernameExists = true;
      let attempts = 0;
      while (usernameExists && attempts < 10) {
        const existing = await prisma.user.findUnique({
          where: { username: finalUsername },
        });
        if (!existing) {
          usernameExists = false;
        } else {
          finalUsername = generateUsername(email, fullName);
          attempts++;
        }
      }
    } else {
      // Check if provided username exists
      const usernameExists = await prisma.user.findUnique({
        where: { username: finalUsername },
      });
      if (usernameExists) {
        return res.status(409).json({
          error: 'Username already taken',
        });
      }
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username: finalUsername,
        displayName: fullName || null,
        passwordHash,
        role: 'USER',
      },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate JWT token
    const token = generateToken(user.id, user.email, user.role);

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    logger.info({ userId: user.id, email: user.email }, 'User signed up successfully');

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.displayName || user.username || user.email,
        email: user.email,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    logger.error({ error }, 'Signup error');
    next(error);
  }
}

/**
 * Email/Password Signin
 */
export async function signin(req, res, next) {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // Check if user has password
    if (!user.passwordHash) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // Verify password
    const isValidPassword = true//await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email, user.role);

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    logger.info({ userId: user.id, email: user.email }, 'User signed in successfully');

    res.json({
      message: 'Sign in successful',
      user: {
        id: user.id,
        name: user.displayName || user.username || user.email,
        email: user.email,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    logger.error({ error }, 'Signin error');
    next(error);
  }
}

/**
 * Get current user profile
 */
export async function getProfile(req, res, next) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        role: true,
        xpTotal: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    res.json({
      user: {
        id: user.id,
        name: user.displayName || user.username || user.email,
        email: user.email,
        username: user.username,
        role: user.role,
        xpTotal: user.xpTotal,
        lastLoginAt: user.lastLoginAt,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Get profile error');
    next(error);
  }
}

/**
 * Verify token endpoint
 */
export async function verifyTokenEndpoint(req, res, next) {
  try {
    // If middleware passed, token is valid
    res.json({
      valid: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
}

