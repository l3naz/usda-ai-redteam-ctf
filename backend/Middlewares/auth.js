// Authentication Middleware
// Protects routes by verifying JWT tokens

import { verifyToken, extractTokenFromHeader } from '../lib/auth.js';
import { logger } from '../lib/logger.js';

/**
 * Middleware to verify JWT token and attach user info to request
 */
export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        error: 'No token provided. Please log in.',
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error.message === 'Invalid or expired token') {
      return res.status(401).json({
        error: 'Invalid or expired token. Please log in again.',
      });
    }

    logger.error({ error }, 'Authentication middleware error');
    return res.status(500).json({
      error: 'Authentication error',
    });
  }
}

/**
 * Optional authentication - doesn't fail if no token, just adds user if present
 */
export async function optionalAuthenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (token) {
      const decoded = verifyToken(token);
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    }

    next();
  } catch (error) {
    // Ignore errors for optional auth
    next();
  }
}

/**
 * Middleware to check if user has required role
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
      });
    }

    next();
  };
}

