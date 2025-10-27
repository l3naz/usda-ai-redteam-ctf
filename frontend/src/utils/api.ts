// API utility functions for backend communication

// Safely access environment variables with fallback
const getApiBaseUrl = (): string => {
  try {
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

export interface FirebaseLoginPayload {
  token: string;
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
 * Send Firebase ID token to backend for authentication
 */
export async function loginWithFirebase(
  firebaseToken: string
): Promise<AuthResponse> {
  const response = await apiFetch<AuthResponse>('/auth/firebase-login', {
    method: 'POST',
    body: JSON.stringify({ token: firebaseToken }),
  });

  // Store JWT token
  if (response.token) {
    setAuthToken(response.token);
  }

  return response;
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
  return apiFetch<LeaderboardEntry[]>('/leaderboard', {
    method: 'GET',
  });
}

/**
 * Update user score on leaderboard
 */
export async function updateLeaderboardScore(
  userId: number,
  points: number
): Promise<{ success: boolean; newScore?: number }> {
  return apiFetch<{ success: boolean; newScore?: number }>(
    '/leaderboard/update',
    {
      method: 'POST',
      body: JSON.stringify({ userId, points }),
    }
  );
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
