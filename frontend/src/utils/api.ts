// API utility functions for backend communication
// 🔐 ENV PLACEHOLDER — API URL must be configured in environment variables
// Configure VITE_API_BASE_URL in your .env file (see README.md)

import { validateMockUser, isMockUser } from '../lib/mockUsers';

// Safely access environment variables with fallback
const getApiBaseUrl = (): string => {
  try {
    // Production: Set VITE_API_BASE_URL in deployment platform (Netlify/Vercel)
    // Development: Set in .env file
    return import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api';
  } catch (error) {
    return 'http://localhost:5000/api';
  }
};

const API_BASE_URL = getApiBaseUrl();

// Get stored JWT token
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('usda_token');
};

// Set stored JWT token
export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('usda_token', token);
};

// Clear stored JWT token
export const clearAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('usda_token');
};

// Generic fetch wrapper with auth headers
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Add auth token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle 401 Unauthorized - redirect to login
    if (response.status === 401) {
      clearAuthToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
      throw new Error('Unauthorized - please log in again');
    }

    // Handle other non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }

    // Parse JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error - please check your connection');
  }
}

// ============================================
// Authentication API
// ============================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
  };
  token: string;
}

/**
 * Login with email and password
 */
export async function loginWithEmail(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  // ========================================
  // 🚨 TEMPORARY MOCK USER — REMOVE BEFORE PRODUCTION
  // ========================================
  // TEMP MOCK USER — remove before production
  // Check if credentials match any mock user from mockUsers.ts
  const mockUser = validateMockUser(credentials.email, credentials.password);
  
  if (mockUser) {
    const mockResponse: AuthResponse = {
      user: {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
      },
      token: 'mock_jwt_token_dev_only', // Mock JWT token
    };

    // Store mock JWT token
    setAuthToken(mockResponse.token);

    // Simulate network delay for realistic testing
    await new Promise(resolve => setTimeout(resolve, 500));

    return mockResponse;
  }
  // ========================================
  // END TEMPORARY MOCK USER
  // ========================================

  const response = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  // Store JWT token
  if (response.token) {
    setAuthToken(response.token);
  }

  return response;
}

/**
 * Sign up with email and password
 */
export async function signupWithEmail(
  credentials: SignupCredentials
): Promise<AuthResponse> {
  const response = await apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  // Store JWT token
  if (response.token) {
    setAuthToken(response.token);
  }

  return response;
}

/**
 * Request password reset
 */
export async function requestPasswordReset(
  email: string
): Promise<{ success: boolean; message: string }> {
  return apiFetch<{ success: boolean; message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * Verify if current token is valid
 */
export async function verifyToken(): Promise<boolean> {
  try {
    await apiFetch('/auth/verify', { method: 'GET' });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Logout user (optional backend call)
 */
export async function logout(): Promise<void> {
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } catch (error) {
    // Ignore errors - we'll clear local storage anyway
    console.error('Logout API error:', error);
  } finally {
    clearAuthToken();
  }
}

// ============================================
// Leaderboard API
// ============================================

export interface LeaderboardEntry {
  id: number;
  name: string;
  score: number;
  rank?: number;
  avatar?: string;
}

/**
 * Fetch leaderboard data
 */
export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const leaderboard = await apiFetch<LeaderboardEntry[]>('/leaderboard', {
      method: 'GET',
    });
    
    // TEMP MOCK USER — remove before production
    // Filter out mock users from public leaderboard
    return leaderboard.filter(entry => !isMockUser(entry.id));
  } catch (error) {
    // Silently fall back to mock data when API is unavailable (expected in development)
    // Return mock leaderboard data when API is unavailable
    return [
      { id: 1001, name: 'Sarah Chen', score: 950, avatar: '' },
      { id: 1002, name: 'Michael Rodriguez', score: 920, avatar: '' },
      { id: 1003, name: 'Emily Johnson', score: 890, avatar: '' },
      { id: 1004, name: 'James Wilson', score: 875, avatar: '' },
      { id: 1005, name: 'Amanda Martinez', score: 850, avatar: '' },
      { id: 1006, name: 'David Thompson', score: 825, avatar: '' },
      { id: 1007, name: 'Lisa Anderson', score: 800, avatar: '' },
      { id: 1008, name: 'Robert Garcia', score: 775, avatar: '' },
      { id: 1009, name: 'Jennifer Lee', score: 750, avatar: '' },
      { id: 1010, name: 'Christopher Brown', score: 725, avatar: '' },
      { id: 1011, name: 'Jessica Taylor', score: 700, avatar: '' },
      { id: 1012, name: 'Matthew Davis', score: 675, avatar: '' },
      { id: 1013, name: 'Ashley Miller', score: 650, avatar: '' },
      { id: 1014, name: 'Daniel Moore', score: 625, avatar: '' },
      { id: 1015, name: 'Stephanie White', score: 600, avatar: '' },
    ];
  }
}

/**
 * Update user score on leaderboard
 */
export async function updateLeaderboardScore(
  userId: number,
  points: number
): Promise<{ success: boolean; newScore?: number }> {
  try {
    return await apiFetch<{ success: boolean; newScore?: number }>(
      '/leaderboard/update',
      {
        method: 'POST',
        body: JSON.stringify({ userId, points }),
      }
    );
  } catch (error) {
    // Silently fall back to local storage when API is unavailable (expected in development)
    // Return success to allow local progress tracking even when API is down
    return { success: true };
  }
}

// ============================================
// User Progress API (Optional - for syncing)
// ============================================

export interface UserProgressData {
  userId: number;
  completedModules: number[];
  totalScore: number;
  moduleProgress: Record<number, any>;
}

/**
 * Sync user progress to backend
 */
export async function syncUserProgress(
  progressData: UserProgressData
): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>('/progress/sync', {
    method: 'POST',
    body: JSON.stringify(progressData),
  });
}

/**
 * Fetch user progress from backend
 */
export async function fetchUserProgress(
  userId: number
): Promise<UserProgressData> {
  return apiFetch<UserProgressData>(`/progress/${userId}`, {
    method: 'GET',
  });
}

// ============================================
// Health Check
// ============================================

/**
 * Check if backend API is reachable
 */
export async function checkAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
}
