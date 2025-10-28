# Backend Integration Guide

This document explains how the USDA AI Red Team Training Game frontend connects to the Express.js backend.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

**Note:** This is a Vite-based React app, so environment variables must be prefixed with `VITE_`.

For production, update this to your production backend URL.

## 🔐 Authentication Flow

### Firebase + Backend JWT Authentication

The application uses a hybrid authentication system:

1. **Firebase Authentication** - Handles user sign-in via Google/Microsoft OAuth
2. **Backend JWT** - Issues JWT tokens for API authorization

### Login Process

```
┌─────────┐         ┌──────────┐         ┌─────────┐
│  User   │────────>│ Firebase │────────>│ Backend │
└─────────┘         └──────────┘         └─────────┘
     │                    │                    │
     │  1. Click Login    │                    │
     │───────────────────>│                    │
     │                    │                    │
     │  2. OAuth Popup    │                    │
     │<───────────────────│                    │
     │                    │                    │
     │  3. Approve        │                    │
     │───────────────────>│                    │
     │                    │                    │
     │  4. Firebase Token │                    │
     │<───────────────────│                    │
     │                    │                    │
     │  5. Send Firebase Token                 │
     │────────────────────────────────────────>│
     │                    │                    │
     │  6. Return JWT + User Data              │
     │<────────────────────────────────────────│
     │                    │                    │
     │  7. Store JWT in localStorage           │
     │  8. Redirect to Leaderboard             │
     │                                          │
```

### Implementation Details

#### 1. User clicks Google/Microsoft login button

Located in: `components/auth/AuthModal.tsx`

```typescript
const handleFirebaseAuth = async (provider: 'google' | 'microsoft') => {
  // Sign in with Firebase
  const firebaseUser = provider === 'google' 
    ? await signInWithGoogle()
    : await signInWithMicrosoft();
  
  // Get Firebase ID token
  const idToken = await getFirebaseIdToken();
  
  // Send to backend
  const response = await loginWithFirebase(idToken);
  
  // Store JWT
  localStorage.setItem('usda_token', response.token);
  
  // Update user context
  setUser(userData);
}
```

#### 2. Backend verifies Firebase token

Backend endpoint: `POST /auth/firebase-login`

**Request:**
```json
{
  "token": "<FIREBASE_ID_TOKEN>"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@usda.gov"
  },
  "token": "<JWT_TOKEN>"
}
```

#### 3. JWT stored in localStorage

The JWT token is stored as `usda_token` and included in all subsequent API requests.

## 📡 API Endpoints

### Authentication

#### POST /auth/firebase-login
Exchanges Firebase ID token for backend JWT.

**Request:**
```json
{
  "token": "<FIREBASE_ID_TOKEN>"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@usda.gov"
  },
  "token": "<JWT_TOKEN>"
}
```

#### GET /auth/verify
Verifies if the current JWT is valid.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "valid": true,
  "user": { ... }
}
```

### Leaderboard

#### GET /leaderboard
Fetches leaderboard data sorted by score.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Admin",
    "score": 200,
    "avatar": "https://..."
  },
  {
    "id": 2,
    "name": "Player2",
    "score": 150
  }
]
```

#### POST /leaderboard/update
Updates user's score on the leaderboard.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request:**
```json
{
  "userId": 1,
  "points": 50
}
```

**Response:**
```json
{
  "success": true,
  "newScore": 250
}
```

### User Progress (Optional)

#### POST /progress/sync
Syncs user progress to backend.

**Request:**
```json
{
  "userId": 1,
  "completedModules": [1, 2, 3],
  "totalScore": 300,
  "moduleProgress": { ... }
}
```

#### GET /progress/:userId
Fetches user progress from backend.

**Response:**
```json
{
  "userId": 1,
  "completedModules": [1, 2, 3],
  "totalScore": 300,
  "moduleProgress": { ... }
}
```

## 🔒 Protected Routes

The following pages require authentication:

- `/learn` - Learn modules
- `/play` - Challenge environment
- `/leaderboard` - Leaderboard
- `/profile` - User profile

If a user tries to access these pages without authentication:
1. They're shown the login modal
2. After successful login, they're redirected to the leaderboard
3. The JWT token is automatically included in all API requests

## 🛠️ API Utility Functions

Located in: `utils/api.ts`

### Authentication
- `loginWithFirebase(firebaseToken: string)` - Exchange Firebase token for JWT
- `verifyToken()` - Check if current JWT is valid
- `getAuthToken()` - Get stored JWT token
- `setAuthToken(token: string)` - Store JWT token
- `clearAuthToken()` - Remove JWT token

### Leaderboard
- `fetchLeaderboard()` - Get leaderboard data
- `updateLeaderboardScore(userId: number, points: number)` - Update user score

### Health Check
- `checkAPIHealth()` - Check if backend is reachable

## 🎯 Usage Examples

### Making Authenticated API Calls

```typescript
import { fetchLeaderboard, updateLeaderboardScore } from './utils/api';

// Fetch leaderboard
const data = await fetchLeaderboard();

// Update score (automatically includes JWT token)
await updateLeaderboardScore(userId, 50);
```

### Checking Authentication

```typescript
import { useAuth } from './hooks/useAuth';

function MyComponent() {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <p>Please log in</p>;
  }
  
  return <p>Welcome, {user.displayName}!</p>;
}
```

### Logout

```typescript
import { useUser } from './context/UserContext';

function LogoutButton() {
  const { logout } = useUser();
  
  const handleLogout = async () => {
    await logout(); // Clears Firebase session + JWT token
  };
  
  return <button onClick={handleLogout}>Logout</button>;
}
```

## 🔐 Security Features

1. **Firebase Authentication** - Industry-standard OAuth 2.0
2. **JWT Tokens** - Secure, stateless authentication
3. **Automatic Token Refresh** - Tokens are refreshed on Firebase auth state changes
4. **Protected Routes** - Client-side route protection
5. **401 Handling** - Automatic redirect to login on unauthorized requests
6. **CORS Support** - Backend must whitelist frontend origin

## 🐛 Error Handling

The application includes comprehensive error handling:

- **Network errors** - Toast notification with retry option
- **Authentication errors** - User-friendly error messages
- **401 Unauthorized** - Auto-redirect to login and clear token
- **API failures** - Graceful fallback to cached/mock data

## 📦 Dependencies

### Frontend
- `firebase` - Firebase SDK for authentication
- `sonner` - Toast notifications
- React Context API - Global state management

### Backend (Required)
- Express.js server running on `http://localhost:5000`
- Firebase Admin SDK for token verification
- JWT library for token generation
- CORS middleware

## 🚀 Getting Started

1. **Set up backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your backend URL
   ```

   Example `.env` file:
   ```bash
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

3. **Start frontend:**
   ```bash
   npm install
   npm run dev
   ```

4. **Test authentication:**
   - Click "Login" button
   - Sign in with Google/Microsoft
   - Should redirect to Leaderboard after successful login

## 📝 Notes

- **Localhost Development:** Backend must be running on `http://localhost:5000`
- **Production:** Update `VITE_API_BASE_URL` in `.env` to production backend URL
- **Environment Variables:** All Vite environment variables must be prefixed with `VITE_`
- **Firebase Console:** Ensure authorized domains are configured
- **CORS:** Backend must allow requests from your frontend origin

## 🔗 Related Files

- `utils/api.ts` - API utility functions
- `firebase.ts` - Firebase configuration
- `context/UserContext.tsx` - User state management
- `components/auth/AuthModal.tsx` - Login UI
- `pages/LeaderboardPage.tsx` - Leaderboard implementation
- `components/shared/Header.tsx` - Logout button
