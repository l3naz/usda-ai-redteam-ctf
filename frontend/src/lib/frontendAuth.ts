// Frontend-only authentication utilities
// Stores users in localStorage and handles signup/signin without backend

interface StoredUser {
  id: string;
  email: string;
  username?: string;
  displayName?: string;
  passwordHash: string; // Simple hash for demo purposes (not secure!)
  createdAt: string;
  lastLoginAt?: string;
}

interface UserAccount {
  email: string;
  username?: string;
  displayName?: string;
}

/**
 * Simple hash function (for demo purposes only - NOT cryptographically secure!)
 * In production, use proper password hashing (bcrypt, Argon2, etc.)
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Generate a unique user ID
 */
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate username from email or display name
 */
function generateUsername(email: string, displayName?: string): string {
  const base = displayName 
    ? displayName.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20)
    : email.split('@')[0].toLowerCase();
  
  const random = Math.random().toString(36).substring(2, 8);
  return `${base}_${random}`;
}

/**
 * Get all users from localStorage
 */
function getStoredUsers(): StoredUser[] {
  try {
    const usersJson = localStorage.getItem('frontend_users');
    if (usersJson) {
      return JSON.parse(usersJson);
    }
  } catch (error) {
    console.error('Failed to parse stored users:', error);
  }
  return [];
}

/**
 * Save users to localStorage
 */
function saveStoredUsers(users: StoredUser[]): void {
  localStorage.setItem('frontend_users', JSON.stringify(users));
}

/**
 * Find user by email
 */
function findUserByEmail(email: string): StoredUser | null {
  const users = getStoredUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

/**
 * Find user by ID
 */
function findUserById(userId: string): StoredUser | null {
  const users = getStoredUsers();
  return users.find(u => u.id === userId) || null;
}

/**
 * Check if username is taken
 */
function isUsernameTaken(username: string): boolean {
  const users = getStoredUsers();
  return users.some(u => u.username?.toLowerCase() === username.toLowerCase());
}

/**
 * Sign up a new user (frontend-only)
 */
export function frontendSignup(
  email: string,
  password: string,
  fullName?: string,
  username?: string
): { success: boolean; user?: UserAccount; error?: string } {
  // Validation
  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }

  if (password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters long' };
  }

  // Check if user already exists
  if (findUserByEmail(email)) {
    return { success: false, error: 'User with this email already exists' };
  }

  // Generate username if not provided
  let finalUsername = username;
  if (!finalUsername) {
    finalUsername = generateUsername(email, fullName);
    
    // Ensure username is unique
    let attempts = 0;
    while (isUsernameTaken(finalUsername) && attempts < 10) {
      finalUsername = generateUsername(email, fullName);
      attempts++;
    }
  } else {
    // Check if provided username exists
    if (isUsernameTaken(finalUsername)) {
      return { success: false, error: 'Username already taken' };
    }
  }

  // Create user
  const newUser: StoredUser = {
    id: generateUserId(),
    email: email.toLowerCase(),
    username: finalUsername,
    displayName: fullName || null,
    passwordHash: simpleHash(password), // Simple hash (NOT secure!)
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  // Save user
  const users = getStoredUsers();
  users.push(newUser);
  saveStoredUsers(users);

  // Store current user session
  const userAccount: UserAccount = {
    email: newUser.email,
    username: newUser.username,
    displayName: newUser.displayName || newUser.username || newUser.email.split('@')[0],
  };

  // Store session data
  localStorage.setItem('usda_token', newUser.id); // Use user ID as token
  localStorage.setItem('userData', JSON.stringify({
    id: newUser.id,
    name: userAccount.displayName,
    email: newUser.email,
  }));

  return { success: true, user: userAccount };
}

/**
 * Sign in user (frontend-only)
 */
export function frontendSignin(
  email: string,
  password: string
): { success: boolean; user?: UserAccount; error?: string } {
  // Validation
  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }

  // Find user
  const user = findUserByEmail(email);
  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  // Verify password (simple hash comparison - NOT secure!)
  const passwordHash = simpleHash(password);
  if (user.passwordHash !== passwordHash) {
    return { success: false, error: 'Invalid email or password' };
  }

  // Update last login
  const users = getStoredUsers();
  const userIndex = users.findIndex(u => u.id === user.id);
  if (userIndex !== -1) {
    users[userIndex].lastLoginAt = new Date().toISOString();
    saveStoredUsers(users);
  }

  // Store session data
  const userAccount: UserAccount = {
    email: user.email,
    username: user.username,
    displayName: user.displayName || user.username || user.email.split('@')[0],
  };

  localStorage.setItem('usda_token', user.id); // Use user ID as token
  localStorage.setItem('userData', JSON.stringify({
    id: user.id,
    name: userAccount.displayName,
    email: user.email,
  }));

  return { success: true, user: userAccount };
}

/**
 * Get current user from token
 */
export function getCurrentUser(): UserAccount | null {
  try {
    const token = localStorage.getItem('usda_token');
    if (!token) return null;

    const user = findUserById(token);
    if (!user) {
      // Token invalid, clear it
      localStorage.removeItem('usda_token');
      localStorage.removeItem('userData');
      return null;
    }

    return {
      email: user.email,
      username: user.username,
      displayName: user.displayName || user.username || user.email.split('@')[0],
    };
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

/**
 * Verify if current token is valid
 */
export function verifyFrontendToken(): boolean {
  const token = localStorage.getItem('usda_token');
  if (!token) return false;

  const user = findUserById(token);
  return user !== null;
}

/**
 * Clear authentication
 */
export function clearFrontendAuth(): void {
  localStorage.removeItem('usda_token');
  localStorage.removeItem('userData');
}

