# 🧪 Backend Integration Testing Guide

This guide helps you verify that the backend integration is working correctly.

---

## Prerequisites

### 1. Backend Server Running
```bash
# Your backend should be running at:
http://localhost:5000

# Test with:
curl http://localhost:5000/api/health
```

### 2. Required Backend Endpoints

Your backend must implement these endpoints:

#### Authentication
```
POST /api/auth/firebase-login
Content-Type: application/json

Request:
{
  "token": "<firebase_id_token>"
}

Response:
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@usda.gov"
  },
  "token": "<JWT_TOKEN>"
}
```

#### Leaderboard - Get All
```
GET /api/leaderboard
Authorization: Bearer <JWT_TOKEN>

Response:
[
  { "id": 1, "name": "Admin", "score": 200 },
  { "id": 2, "name": "Player2", "score": 150 }
]
```

#### Leaderboard - Update Score
```
POST /api/leaderboard/update
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

Request:
{
  "userId": 1,
  "points": 50
}

Response:
{
  "success": true,
  "newScore": 250
}
```

---

## Test Scenarios

### ✅ Scenario 1: User Login (Google)

**Steps:**
1. Open app: `http://localhost:5173`
2. Click "Sign in with Google"
3. Complete Google OAuth flow
4. Check browser console (F12)

**Expected Results:**
```javascript
// Console should show:
"Firebase login successful"
"Backend authentication successful"

// localStorage should contain:
localStorage.getItem('usda_token')     // JWT token string
localStorage.getItem('userData')       // {"id":1,"name":"...","email":"..."}

// Browser should redirect to:
http://localhost:5173#leaderboard
```

**Backend Logs (should show):**
```
POST /api/auth/firebase-login - 200 OK
Token validated for user: john@usda.gov
```

---

### ✅ Scenario 2: User Login (Microsoft)

**Steps:**
1. Open app: `http://localhost:5173`
2. Click "Sign in with Microsoft"
3. Complete Microsoft OAuth flow

**Expected Results:**
- Same as Scenario 1
- Redirects to leaderboard
- Token stored in localStorage
- User data displayed in header

---

### ✅ Scenario 3: Leaderboard Display

**Steps:**
1. Login successfully (Scenario 1 or 2)
2. Navigate to Leaderboard page
3. Open Network tab (F12 → Network)

**Expected Results:**

**Network Request:**
```
GET http://localhost:5000/api/leaderboard
Status: 200 OK
Headers:
  Authorization: Bearer eyJhbGc...
```

**Response:**
```json
[
  { "id": 1, "name": "Admin", "score": 200 },
  { "id": 2, "name": "Player2", "score": 150 }
]
```

**UI Display:**
- Table shows all users
- Sorted by score (highest first)
- Rank numbers displayed (#1, #2, #3...)
- Current user highlighted with "You" badge
- Trophy icons for top 3

---

### ✅ Scenario 4: Score Update

**Steps:**
1. Login and go to Leaderboard
2. Complete a module quiz with score ≥ 80%
3. Watch leaderboard update

**Expected Backend Call:**
```
POST http://localhost:5000/api/leaderboard/update
Headers:
  Authorization: Bearer eyJhbGc...
  Content-Type: application/json

Body:
{
  "userId": 1,
  "points": 50
}

Response:
{
  "success": true,
  "newScore": 250
}
```

**UI Changes:**
- Toast notification: "+50 points added!"
- Leaderboard refreshes automatically
- User's score updated in table
- Rank may change based on new score

---

### ✅ Scenario 5: Token Persistence

**Steps:**
1. Login successfully
2. Refresh the page (F5)
3. Check if user is still logged in

**Expected Results:**
- User remains logged in
- No auth modal appears
- User data displayed in header
- Can access protected pages

**How it works:**
```javascript
// On page load, UserContext checks:
1. Firebase auth state (via onAuthStateChanged)
2. localStorage.getItem('usda_token')
3. localStorage.getItem('userData')

// If all present → user is logged in
// If missing → redirect to login
```

---

### ✅ Scenario 6: Logout

**Steps:**
1. Login successfully
2. Click user menu → Logout
3. Check localStorage

**Expected Results:**

**localStorage cleared:**
```javascript
localStorage.getItem('usda_token')    // null
localStorage.getItem('userData')      // null
```

**Firebase signed out:**
```javascript
firebase.auth().currentUser  // null
```

**UI Changes:**
- Redirected to landing page
- Header hidden
- Protected pages inaccessible
- Toast: "Logged out successfully"

---

### ✅ Scenario 7: Unauthorized Access (401)

**Steps:**
1. Login successfully
2. Open browser console
3. Manually delete token:
   ```javascript
   localStorage.removeItem('usda_token')
   ```
4. Try to access Leaderboard

**Expected Results:**

**Backend Response:**
```
GET /api/leaderboard
Status: 401 Unauthorized
```

**Frontend Handling:**
```javascript
// api.ts automatically:
1. Detects 401 status
2. Clears localStorage
3. Redirects to login page
4. Shows error toast
```

**User sees:**
- Redirected to landing page
- Auth modal opens
- Toast: "Unauthorized - please log in again"

---

### ✅ Scenario 8: Network Error Handling

**Steps:**
1. Stop backend server
2. Try to login or access leaderboard

**Expected Results:**

**Frontend Behavior:**
- Loading spinner appears
- After timeout: Error toast
- User-friendly error message
- Fallback to mock data (leaderboard only)

**Console Message:**
```
Failed to load leaderboard: Network error
```

**UI Display:**
- Error toast: "Failed to load leaderboard data"
- Mock data displayed as fallback:
  ```javascript
  [
    { id: 1, name: "Admin", score: 200, rank: 1 },
    { id: 2, name: "Player2", score: 150, rank: 2 }
  ]
  ```

---

## Browser Console Tests

Open browser console (F12) and run these commands:

### Check Current Auth State
```javascript
// Get stored token
console.log('Token:', localStorage.getItem('usda_token'));

// Get user data
console.log('User:', JSON.parse(localStorage.getItem('userData') || '{}'));

// Check if logged in
console.log('Authenticated:', !!localStorage.getItem('usda_token'));
```

### Test API Endpoints Manually
```javascript
// Get leaderboard
const token = localStorage.getItem('usda_token');
fetch('http://localhost:5000/api/leaderboard', {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(r => r.json())
  .then(data => console.log('Leaderboard:', data));

// Update score
fetch('http://localhost:5000/api/leaderboard/update', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ userId: 1, points: 25 })
})
  .then(r => r.json())
  .then(data => console.log('Update result:', data));
```

### Clear Everything (Fresh Start)
```javascript
// Clear all auth data
localStorage.clear();
sessionStorage.clear();

// Reload page
window.location.reload();
```

---

## Backend Testing with cURL

### Test Health Endpoint
```bash
curl http://localhost:5000/api/health
# Expected: {"status":"ok"}
```

### Test Login (needs real Firebase token)
```bash
# Get Firebase token from browser console first:
# console.log(await firebase.auth().currentUser.getIdToken())

curl -X POST http://localhost:5000/api/auth/firebase-login \
  -H "Content-Type: application/json" \
  -d '{"token":"<firebase_token_here>"}'

# Expected:
# {
#   "user": {"id":1,"name":"...","email":"..."},
#   "token":"<JWT_TOKEN>"
# }
```

### Test Leaderboard
```bash
# Replace <JWT_TOKEN> with actual token
curl http://localhost:5000/api/leaderboard \
  -H "Authorization: Bearer <JWT_TOKEN>"

# Expected: [{"id":1,"name":"Admin","score":200},...]
```

### Test Score Update
```bash
curl -X POST http://localhost:5000/api/leaderboard/update \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"points":50}'

# Expected: {"success":true,"newScore":250}
```

---

## Common Issues & Solutions

### ❌ "Cannot read property 'getIdToken' of null"
**Cause:** User not logged in to Firebase
**Solution:** 
```javascript
// Wait for auth state to initialize
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log('User ready:', user.email);
  }
});
```

### ❌ "CORS Error: No 'Access-Control-Allow-Origin'"
**Cause:** Backend CORS not configured
**Solution (Backend):**
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### ❌ "401 Unauthorized" on every request
**Cause:** JWT token expired or invalid
**Solution:**
```javascript
// Clear and re-login
localStorage.clear();
// Then login again via UI
```

### ❌ "Network request failed"
**Cause:** Backend server not running
**Solution:**
```bash
# Start backend
cd backend
npm start
# or
node server.js
```

### ❌ Token not persisting after refresh
**Cause:** localStorage blocked or cleared
**Solution:**
```javascript
// Check if localStorage is available
if (typeof Storage !== "undefined") {
  console.log('localStorage available');
} else {
  console.error('localStorage not supported');
}

// Check browser privacy settings
// Disable "Clear cookies on close" if enabled
```

---

## Success Criteria Checklist

### Authentication
- [ ] Google login redirects to leaderboard
- [ ] Microsoft login redirects to leaderboard
- [ ] JWT token saved in localStorage as "usda_token"
- [ ] User data saved in localStorage as "userData"
- [ ] User name displayed in header after login
- [ ] Firebase and backend tokens both working

### Leaderboard
- [ ] Leaderboard displays all users
- [ ] Users sorted by score (highest first)
- [ ] Current user highlighted with "You" badge
- [ ] Rank numbers correct (#1, #2, #3...)
- [ ] Trophy icons for top 3 users
- [ ] Search functionality works
- [ ] Refresh button updates data

### Security
- [ ] JWT token attached to API requests
- [ ] Authorization header: "Bearer <token>"
- [ ] 401 responses trigger logout
- [ ] Protected pages require login
- [ ] Logout clears all tokens

### User Experience
- [ ] Loading spinners during API calls
- [ ] Error toasts on failure
- [ ] Success toasts on completion
- [ ] Smooth page transitions
- [ ] No visual design changes
- [ ] Original Figma styling preserved

---

## Performance Benchmarks

### Expected Response Times
- Firebase login: **< 2 seconds**
- Backend token exchange: **< 500ms**
- Leaderboard fetch: **< 300ms**
- Score update: **< 200ms**

### Monitor in Browser
```javascript
// Add to console
performance.getEntriesByType('resource')
  .filter(r => r.name.includes('localhost:5000'))
  .forEach(r => {
    console.log(r.name, `${r.duration.toFixed(0)}ms`);
  });
```

---

## 🎉 Integration Test Report Template

```
USDA AI Red Team Training - Backend Integration Test
Date: _____________
Tester: _____________

AUTHENTICATION
[ ] Google OAuth login                     PASS / FAIL
[ ] Microsoft OAuth login                  PASS / FAIL
[ ] Token exchange with backend            PASS / FAIL
[ ] JWT stored in localStorage             PASS / FAIL
[ ] Redirect to leaderboard                PASS / FAIL

LEADERBOARD
[ ] Fetch leaderboard data                 PASS / FAIL
[ ] Display users sorted by score          PASS / FAIL
[ ] Highlight current user                 PASS / FAIL
[ ] Update score functionality             PASS / FAIL
[ ] Refresh button works                   PASS / FAIL

SECURITY
[ ] JWT attached to requests               PASS / FAIL
[ ] 401 handling (auto-logout)             PASS / FAIL
[ ] Protected routes enforced              PASS / FAIL

ERROR HANDLING
[ ] Network error handling                 PASS / FAIL
[ ] Token expiration handling              PASS / FAIL
[ ] User-friendly error messages           PASS / FAIL

PERSISTENCE
[ ] Token persists after page refresh      PASS / FAIL
[ ] User stays logged in after refresh     PASS / FAIL
[ ] Logout clears all data                 PASS / FAIL

VISUAL DESIGN
[ ] Original Figma design preserved        PASS / FAIL
[ ] No unintended style changes            PASS / FAIL
[ ] All colors match specification         PASS / FAIL

Overall Status: _____________ (PASS / FAIL)
Notes: _________________________________
```

---

## Additional Resources

- **Backend Integration Guide:** `/BACKEND_INTEGRATION_COMPLETE.md`
- **Firebase Setup:** `/FIREBASE_SETUP.md`
- **Environment Config:** `/.env.example`
- **Troubleshooting:** `/TROUBLESHOOTING.md`

---

**Happy Testing! 🚀**

If you encounter any issues not covered here, check the browser console and network tab for detailed error messages.
