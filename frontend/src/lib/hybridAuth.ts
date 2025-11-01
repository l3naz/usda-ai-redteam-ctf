// Hybrid authentication utilities
// Tries backend API first, falls back to frontend-only auth if backend is unavailable

import { signup as apiSignup, signin as apiSignin, verifyToken, getProfile } from '../utils/api';
import { frontendSignup, frontendSignin, getCurrentUser as getFrontendUser, verifyFrontendToken, clearFrontendAuth } from './frontendAuth';

// Get API base URL (same as in api.ts)
const getApiBaseUrl = (): string => {
  try {
    return import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5100';
  } catch (error) {
    return 'http://localhost:5100';
  }
};

const API_BASE_URL = getApiBaseUrl();

interface UserAccount {
  email: string;
  username?: string;
  displayName?: string;
  id?: string;
}

interface AuthResult {
  success: boolean;
  user?: UserAccount;
  error?: string;
  isBackendAuth?: boolean;
}

/**
 * Check if backend API is available
 */
async function isBackendAvailable(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
    
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Hybrid signup - tries backend first, falls back to frontend
 */
export async function hybridSignup(
  email: string,
  password: string,
  fullName?: string,
  username?: string
): Promise<AuthResult> {
  // Try backend first
  try {
    const backendAvailable = await isBackendAvailable();
    if (backendAvailable) {
      const response = await apiSignup({
        email,
        password,
        fullName,
        username,
      });

      if (response.token && response.user) {
        return {
          success: true,
          user: {
            email: response.user.email,
            username: response.user.username,
            displayName: response.user.name,
            id: response.user.id,
          },
          isBackendAuth: true,
        };
      }
    }
  } catch (error: any) {
    console.log('Backend signup failed, falling back to frontend auth:', error.message);
    // Fall through to frontend auth
  }

  // Fallback to frontend-only auth
  const result = frontendSignup(email, password, fullName, username);
  if (result.success && result.user) {
    return {
      success: true,
      user: {
        ...result.user,
        id: localStorage.getItem('usda_token') || undefined,
      },
      isBackendAuth: false,
    };
  }

  return result;
}

/**
 * Hybrid signin - tries backend first, falls back to frontend
 */
export async function hybridSignin(
  email: string,
  password: string
): Promise<AuthResult> {
  // Try backend first
  try {
    const backendAvailable = await isBackendAvailable();
    if (backendAvailable) {
      const response = await apiSignin({
        email,
        password,
      });

      if (response.token && response.user) {
        return {
          success: true,
          user: {
            email: response.user.email,
            username: response.user.username,
            displayName: response.user.name,
            id: response.user.id,
          },
          isBackendAuth: true,
        };
      }
    }
  } catch (error: any) {
    console.log('Backend signin failed, falling back to frontend auth:', error.message);
    // Fall through to frontend auth
  }

  // Fallback to frontend-only auth
  const result = frontendSignin(email, password);
  if (result.success && result.user) {
    return {
      success: true,
      user: {
        ...result.user,
        id: localStorage.getItem('usda_token') || undefined,
      },
      isBackendAuth: false,
    };
  }

  return result;
}

/**
 * Hybrid get current user - tries backend first, falls back to frontend
 */
export async function getHybridCurrentUser(): Promise<UserAccount | null> {
  // Check if we have a backend token
  const token = localStorage.getItem('usda_token');
  if (!token) return null;

  // Try backend first if token looks like a JWT (contains dots)
  if (token.includes('.')) {
    try {
      const isValid = await verifyToken();
      if (isValid) {
        try {
          const profile = await getProfile();
          return {
            email: profile.email,
            username: profile.username,
            displayName: profile.name,
            id: profile.id,
          };
        } catch (error) {
          console.log('Backend profile fetch failed, falling back to frontend:', error);
          // Fall through to frontend
        }
      }
    } catch (error) {
      console.log('Backend token verification failed, falling back to frontend:', error);
      // Fall through to frontend
    }
  }

  // Fallback to frontend auth
  return getFrontendUser();
}

/**
 * Hybrid verify token - tries backend first, falls back to frontend
 */
export async function verifyHybridToken(): Promise<boolean> {
  const token = localStorage.getItem('usda_token');
  if (!token) return false;

  // If token looks like a JWT, try backend verification
  if (token.includes('.')) {
    try {
      return await verifyToken();
    } catch (error) {
      console.log('Backend token verification failed, falling back to frontend:', error);
      // Fall through to frontend
    }
  }

  // Fallback to frontend verification
  return verifyFrontendToken();
}

/**
 * Hybrid logout - clears both backend and frontend auth
 */
export function clearHybridAuth(): void {
  // Clear frontend auth
  clearFrontendAuth();
  
  // Backend logout is handled by clearing the token (stateless JWT)
  // Additional cleanup if needed
}

