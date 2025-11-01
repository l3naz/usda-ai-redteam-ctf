// Simple authentication utilities
// Frontend-only authentication using localStorage

/**
 * Get auth token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('usda_token');
}

/**
 * Clear auth token from localStorage
 */
export function clearAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('usda_token');
}

/**
 * Check if user is authenticated by verifying token exists
 */
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  return token !== null && token.length > 0;
}

/**
 * Get user data from localStorage
 */
export function getUserData(): { id: string; name: string; email: string } | null {
  try {
    const userData = localStorage.getItem("userData");
    if (userData) {
      return JSON.parse(userData);
    }
  } catch (error) {
    console.error("Failed to parse user data:", error);
  }
  return null;
}

/**
 * Clear authentication data
 */
export function clearAuth(): void {
  clearAuthToken();
  localStorage.removeItem("userData");
}

/**
 * Set user data in localStorage
 */
export function setUserData(userData: { id: string; name: string; email: string }): void {
  localStorage.setItem("userData", JSON.stringify(userData));
}

