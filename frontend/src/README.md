# README - Integration Guide

## USDA AI Red Team Training Game

### Project Overview
**Name:** USDA AI Red Team Training Game  
**Purpose:** Professional federal training platform teaching cybersecurity concepts through interactive learning modules  
**Features:** Learn, Play, Dashboard, Profile, and Leaderboard pages with real-time progress tracking

### Deployment
**Hosted at:** `[DEPLOYMENT_URL_PLACEHOLDER]`  
**Build Command:** `npm run build`  
**Dev Server:** `npm run dev`

---

## Integration Points

### Frontend Configuration
**Location:** `src/firebase.ts`  
**Type:** Client-side Firebase configuration (public API keys - safe for browser)

```typescript
// Example structure - replace with your actual values
{
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

⚠️ **Note:** Firebase client-side API keys are safe to expose in frontend code. They are restricted by Firebase Security Rules and authorized domains.

---

### Backend REST API
**Location:** `src/utils/api.ts`  
**Base URL:** `http://localhost:5000/api` (development) or `YOUR_PRODUCTION_API_URL` (production)

**Endpoints:**
- `POST /auth/google` - Google OAuth token exchange
- `POST /auth/microsoft` - Microsoft OAuth token exchange
- `GET /user/progress` - Fetch user progress
- `PUT /user/progress` - Update user progress
- `GET /leaderboard` - Fetch leaderboard data

---

### Database
**Type:** PostgreSQL (server-side only)  
**Access:** Backend API handles all database operations  
**Schema:** Managed by backend team

---

### Authentication Flow
**Provider:** Firebase Authentication  
**Methods:** Google OAuth, Microsoft OAuth  
**Token Storage:** JWT tokens stored in localStorage as `usda_token`

**Flow:**
1. User clicks Google/Microsoft sign-in
2. Firebase handles OAuth popup
3. Frontend exchanges Firebase ID token with backend
4. Backend validates token and returns JWT
5. JWT stored locally and used for authenticated API requests

---

## Environment Variables

### ⚠️ SECURITY NOTICE
**No secret values are stored in this codebase.**  
All sensitive configuration must be set via environment variables.

### Frontend (.env)
```bash
# Firebase Configuration (PUBLIC - safe for client-side)
VITE_FIREBASE_API_KEY=YOUR_API_KEY_HERE
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID

# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend (server/.env - PRIVATE)
```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Firebase Admin SDK (SERVER ONLY - NEVER EXPOSE)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com

# JWT
JWT_SECRET=your-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=production
```

---

## Code Locations Reference

### Frontend Public Config
📄 **File:** `src/firebase.ts`  
🔓 **Type:** Public API keys (safe to expose)  
💡 **Usage:** Firebase client SDK initialization

### Backend Private Config
📄 **Files:**
- `server/.env` - Environment variables
- `server/config/serviceAccount.json` - Firebase Admin SDK credentials (NEVER commit)

🔐 **Type:** PRIVATE KEYS (server-only)  
⚠️ **Security:** Never expose these values. Use server-side environment variables only.

### CI/CD Environment Variables
**Platforms:** Netlify / Vercel / GitHub Actions  
**Setup:** Configure secrets in platform settings:
- Netlify: Site Settings → Environment Variables
- Vercel: Project Settings → Environment Variables
- GitHub: Repository Settings → Secrets and Variables

---

## Security Best Practices

### ✅ DO:
- Store all secrets in environment variables
- Use `.env` files locally (add to `.gitignore`)
- Use cloud secret managers for production (AWS Secrets Manager, Google Secret Manager, etc.)
- Rotate keys regularly
- Use different credentials for dev/staging/production
- Enable Firebase Security Rules to restrict client access

### ❌ DON'T:
- Commit `.env` files to version control
- Hardcode API keys or secrets in code
- Share credentials via email or chat
- Use production credentials in development
- Expose backend private keys to frontend

---

## Getting Started

1. **Clone the repository**
   ```bash
   git clone [REPOSITORY_URL]
   cd usda-ai-redteam
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

---

## Support

For integration support or questions:
- Backend API: Contact backend team
- Firebase Setup: See Firebase Console documentation
- Deployment: See platform-specific guides (Netlify/Vercel)

---

**Last Updated:** 2025-01-27  
**Version:** 1.0.0
