# 🚀 Quick Start Guide - USDA AI Red Team Training

Get up and running with the fully integrated backend in **5 minutes**.

---

## ✅ What's Already Implemented

**Good news!** The backend integration is **100% complete**. You don't need to write any code.

All features are working:
- ✅ Firebase Authentication (Google + Microsoft OAuth)
- ✅ Backend token exchange
- ✅ JWT storage and management
- ✅ Leaderboard API integration
- ✅ Score updates
- ✅ Protected routes
- ✅ Error handling
- ✅ Original Figma design preserved

---

## 📋 Prerequisites

### 1. Node.js Installed
```bash
node --version  # Should be v16 or higher
npm --version   # Should be v8 or higher
```

### 2. Backend Server Ready
Your backend must be running at `http://localhost:5000/api` with these endpoints:

- `POST /auth/firebase-login` - Exchange Firebase token for JWT
- `GET /leaderboard` - Fetch all users and scores
- `POST /leaderboard/update` - Update user score

*(See `/test-integration.md` for detailed endpoint specifications)*

---

## 🏃 Step-by-Step Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: (Optional) Configure Environment
```bash
# Copy example file
cp .env.example .env

# The default settings work out of the box:
# VITE_API_BASE_URL=http://localhost:5000/api
```

**Note:** The `.env` file is **optional**. The app works without it using default settings.

### Step 3: Start Backend Server
```bash
# In your backend directory
cd /path/to/your/backend
npm start

# Backend should be running at:
# http://localhost:5000
```

**Verify backend is running:**
```bash
curl http://localhost:5000/api/health
# Expected: {"status":"ok"} or similar
```

### Step 4: Start Frontend
```bash
# In this directory
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 5: Open Browser
```
http://localhost:5173
```

You should see the USDA AI Red Team Training landing page.

### Step 6: Test Login
1. Click **"Sign in with Google"** or **"Sign in with Microsoft"**
2. Complete OAuth authentication
3. You should be redirected to the **Leaderboard** page
4. Check browser console (F12) - should see no errors

---

## 🧪 Quick Test

### Test Authentication Flow
1. **Login:** Click "Sign in with Google"
2. **Check Token:** Open browser console (F12):
   ```javascript
   console.log(localStorage.getItem('usda_token'));
   // Should show JWT token string
   ```
3. **Check User Data:**
   ```javascript
   console.log(localStorage.getItem('userData'));
   // Should show: {"id":1,"name":"...","email":"..."}
   ```

### Test Leaderboard
1. **Navigate:** Should auto-redirect after login
2. **Check Network:** Open Network tab (F12)
   - Should see: `GET http://localhost:5000/api/leaderboard`
   - Status: `200 OK`
   - Response: Array of users with scores

### Test Score Update
1. **Complete a module:** Navigate to Learn → Pick a module → Complete quiz (≥80%)
2. **Check leaderboard:** Score should update automatically
3. **Check Network:** Should see `POST /leaderboard/update`

---

## 🔍 Troubleshooting

### ❌ Backend Not Responding
```bash
# Check if backend is running
curl http://localhost:5000/api/health

# If not running, start it:
cd /path/to/backend
npm start
```

### ❌ CORS Errors in Console
Your backend needs CORS enabled:

```javascript
// In your backend server.js or app.js
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',  // Vite dev server
  credentials: true
}));
```

### ❌ "Cannot read property 'getIdToken' of null"
- Firebase auth not initialized yet
- Wait a moment and try again
- Check Firebase config in `/firebase.ts`

### ❌ Login Redirects but No User Data
1. **Check Network tab:** Look for `/auth/firebase-login` request
2. **Check Response:** Should include `user` and `token`
3. **Check Backend logs:** Should show successful token validation

### ❌ Environment Variable Not Loading
```bash
# Restart dev server after creating/modifying .env
# Stop server: Ctrl+C
npm run dev
```

---

## 📁 Project Structure

```
/
├── .env.example                    # Environment config template
├── BACKEND_INTEGRATION_COMPLETE.md # Detailed integration docs
├── test-integration.md             # Testing guide
├── QUICK_START.md                  # This file
│
├── components/
│   ├── auth/
│   │   └── AuthModal.tsx           # ✅ Login UI + Firebase → Backend flow
│   └── shared/
│       └── Header.tsx              # Navigation + user menu
│
├── context/
│   └── UserContext.tsx             # ✅ User state + auth management
│
├── pages/
│   ├── LandingPage.tsx             # Public landing page
│   ├── LeaderboardPage.tsx         # ✅ Leaderboard with backend API
│   ├── LearnPage.tsx               # Training modules
│   └── ...
│
├── utils/
│   └── api.ts                      # ✅ Backend API integration layer
│
├── firebase.ts                     # ✅ Firebase config + auth functions
└── App.tsx                         # Main app + routing
```

**Files with ✅ = Backend integration implemented**

---

## 🔐 How Authentication Works

```
1. User clicks "Sign in with Google/Microsoft"
   ↓
2. Firebase OAuth popup opens
   ↓
3. User completes OAuth flow
   ↓
4. Firebase returns user + ID token
   ↓
5. Frontend sends Firebase token to backend:
   POST /auth/firebase-login
   Body: { "token": "<firebase_id_token>" }
   ↓
6. Backend validates token and responds:
   { "user": {...}, "token": "<JWT>" }
   ↓
7. Frontend stores JWT in localStorage:
   Key: "usda_token"
   ↓
8. Frontend updates user context
   ↓
9. Redirect to /leaderboard
   ✅ User is now authenticated!
```

All subsequent API calls include:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 📊 Backend API Endpoints Required

### 1. Firebase Login
```http
POST /api/auth/firebase-login
Content-Type: application/json

{
  "token": "<firebase_id_token>"
}

Response: 200 OK
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@usda.gov"
  },
  "token": "<JWT_TOKEN>"
}
```

### 2. Get Leaderboard
```http
GET /api/leaderboard
Authorization: Bearer <JWT_TOKEN>

Response: 200 OK
[
  { "id": 1, "name": "Admin", "score": 200 },
  { "id": 2, "name": "Player2", "score": 150 }
]
```

### 3. Update Score
```http
POST /api/leaderboard/update
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "userId": 1,
  "points": 50
}

Response: 200 OK
{
  "success": true,
  "newScore": 250
}
```

### 4. Health Check (Optional)
```http
GET /api/health

Response: 200 OK
{ "status": "ok" }
```

---

## 🎯 What You Can Do Now

### ✅ Already Working:
- Login with Google
- Login with Microsoft
- View leaderboard (fetched from backend)
- Complete training modules
- Update scores automatically
- Logout and clear session

### 🚀 Next Steps (Optional):
- Add profile update API
- Sync progress to backend
- Add real-time leaderboard updates (WebSocket)
- Add admin dashboard
- Deploy to production

---

## 🌐 Production Deployment

### Update Environment Variables

**Create `.env.production`:**
```bash
VITE_API_BASE_URL=https://api.your-domain.com/api
```

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

### Important Production Notes:
1. Use HTTPS for all API calls
2. Update Firebase authorized domains
3. Configure CORS on backend for production domain
4. Consider HttpOnly cookies instead of localStorage
5. Implement token refresh mechanism
6. Add rate limiting on backend

---

## 📚 Additional Documentation

| Document | Purpose |
|----------|---------|
| `BACKEND_INTEGRATION_COMPLETE.md` | Full integration details |
| `test-integration.md` | Testing guide with all scenarios |
| `FIREBASE_SETUP.md` | Firebase configuration |
| `TROUBLESHOOTING.md` | Common issues and solutions |
| `.env.example` | Environment variables template |

---

## 🆘 Need Help?

### Check These First:
1. **Browser Console (F12):** Look for error messages
2. **Network Tab (F12):** Check API request/response
3. **Backend Logs:** Check if requests are reaching backend
4. **localStorage:** Verify token is stored

### Debug Commands:
```javascript
// Open browser console (F12)

// Check auth state
console.log('Token:', localStorage.getItem('usda_token'));
console.log('User:', localStorage.getItem('userData'));

// Test API manually
const token = localStorage.getItem('usda_token');
fetch('http://localhost:5000/api/leaderboard', {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(r => r.json())
  .then(console.log);
```

---

## ✅ Success Checklist

After following this guide, you should have:

- [x] Frontend running on http://localhost:5173
- [x] Backend running on http://localhost:5000
- [x] Login with Google works
- [x] Login with Microsoft works
- [x] Redirects to leaderboard after login
- [x] JWT token stored in localStorage
- [x] Leaderboard displays user data from backend
- [x] No console errors
- [x] Original Figma design preserved

**If all boxes checked → Integration successful! 🎉**

---

## 🎉 You're Ready!

The integration is complete and working. Just start both servers and test the login flow.

**Questions?** Check the detailed documentation in `/BACKEND_INTEGRATION_COMPLETE.md`.

**Happy Training! 🚀**
