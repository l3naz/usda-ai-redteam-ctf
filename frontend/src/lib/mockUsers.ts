/**
 * Mock Users Repository
 * 
 * Contains temporary mock user accounts for development and testing.
 * 
 * ⚠️ IMPORTANT: Remove this entire file before production deployment.
 */

export interface MockUser {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
}

// TEMP MOCK USER — remove before production
export const MOCK_USERS: MockUser[] = [
  {
    id: 9999,
    email: "nithin@n",
    password: "admin",
    name: "Nithin N.",
    role: "Tester",
  },
];

/**
 * Validates mock user credentials
 * @param email - User email
 * @param password - User password
 * @returns Mock user if credentials match, undefined otherwise
 */
export function validateMockUser(
  email: string,
  password: string
): MockUser | undefined {
  return MOCK_USERS.find(
    (user) => user.email === email && user.password === password
  );
}

/**
 * Checks if a user ID belongs to a mock user
 * @param userId - User ID to check
 * @returns True if the user is a mock user
 */
export function isMockUser(userId: number): boolean {
  return MOCK_USERS.some((user) => user.id === userId);
}

/**
 * Gets all mock user IDs for filtering purposes
 * @returns Array of mock user IDs
 */
export function getMockUserIds(): number[] {
  return MOCK_USERS.map((user) => user.id);
}
