# 🔧 Troubleshooting Guide

## Common Errors and Solutions

### ✅ FIXED: `Cannot read properties of undefined (reading 'VITE_API_BASE_URL')`

**Error Message:**
```
TypeError: Cannot read properties of undefined (reading 'VITE_API_BASE_URL')
    at utils/api.ts:3:37
```

**Root Cause:**
- `import.meta.env` was being accessed without proper null checking
- This can happen during build/bundling or in certain environments

**Solution Applied:**
✅ Added defensive try-catch wrapper
✅ Made `VITE_API_BASE_URL` optional in TypeScript definitions
✅ Provided safe fallback to `http://localhost:5000/api`

**Code Changes:**

```typescript
// Before:
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// After:
const getApiBaseUrl = (): string => {
  try {
    return import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api';
  } catch (error) {
    return 'http://localhost:5000/api';
  }
};

const API_BASE_URL = getApiBaseUrl();
```

**Status:** ✅ FIXED

---

## Environment Variable Setup

### Creating `.env` File

If you want to customize the backend API URL:

```bash
# 1. Copy the example file
cp .env.example .env

# 2. Edit with your values (optional)
# If you don't create this file, it will default to http://localhost:5000/api
```

**Example `.env`:**
```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

### Important Notes

1. **Optional Configuration:** The `.env` file is **optional**. The app works without it using the default URL.

2. **Restart Dev Server:** If you create/modify `.env`, restart the dev server:
   ```bash
   # Stop the server (Ctrl+C)
   # Then start again
   npm run dev
   ```

3. **Vite Prefix Required:** All environment variables must start with `VITE_`

4. **Not Committed:** `.env` files are gitignored and not committed to the repository

---

## Firebase Authentication Issues

### Error: `auth/unauthorized-domain`

**Cause:** Your domain is not authorized in Firebase Console

**Solution:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (usda-d6adb)
3. Go to Authentication > Settings > Authorized domains
4. Add your domain:
   - `localhost` (for development)
   - Your production domain

### Error: `auth/popup-closed-by-user`

**Cause:** User closed the OAuth popup before completing sign-in

**Solution:** This is expected behavior. User simply needs to try again.

---

## Backend Connection Issues

### Error: Network error or CORS error

**Symptoms:**
- Login works but API calls fail
- Console shows CORS errors
- "Unable to connect to server" message

**Solution:**

1. **Check Backend is Running:**
   ```bash
   # Backend should be running on http://localhost:5000
   curl http://localhost:5000/api/health
   ```

2. **Configure CORS in Backend:**
   ```javascript
   // In your Express backend
   const cors = require('cors');
   
   app.use(cors({
     origin: 'http://localhost:3000', // Your frontend URL
     credentials: true
   }));
   ```

3. **Check Backend URL:**
   ```bash
   # Verify the URL in console
   # Should log: "API Base URL: http://localhost:5000/api"
   ```

### Error: 401 Unauthorized on API calls

**Symptoms:**
- Login works
- But leaderboard/API calls return 401
- Automatically redirected to login

**Solution:**

1. **Check JWT Token:**
   ```javascript
   // In browser console
   localStorage.getItem('usda_token')
   // Should return a JWT token string
   ```

2. **Verify Backend Token Verification:**
   - Ensure backend verifies JWT tokens correctly
   - Check Authorization header is being sent
   - Verify JWT secret matches between frontend/backend

3. **Check Token Expiry:**
   - Tokens might have expired
   - Try logging out and logging in again

---

## Build/Bundle Issues

### TypeScript Errors with `import.meta.env`

**Error:**
```
Property 'VITE_API_BASE_URL' does not exist on type 'ImportMetaEnv'
```

**Solution:**
✅ Already fixed in `vite-env.d.ts`

The type definitions now properly declare the environment variables:
```typescript
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  // ... other vars
}
```

---

## Testing the Integration

### Quick Test Checklist

1. **✅ Frontend Starts:**
   ```bash
   npm run dev
   # Should start on http://localhost:3000
   ```

2. **✅ Backend Running:**
   ```bash
   curl http://localhost:5000/api/health
   # Should return 200 OK
   ```

3. **✅ Login Works:**
   - Click "Login" button
   - Select Google or Microsoft
   - Complete OAuth flow
   - Should redirect to Leaderboard

4. **✅ API Calls Work:**
   - Leaderboard should load data
   - Console should show successful API calls
   - No CORS errors

5. **✅ Logout Works:**
   - Click logout button in header
   - Should clear token
   - Should redirect to home page

---

## Debug Mode

### Enable Verbose Logging

Add this to see API calls in console:

```typescript
// In utils/api.ts, add logging:
console.log('API Base URL:', API_BASE_URL);
console.log('Making request to:', endpoint);
console.log('Auth token:', getAuthToken() ? 'Present' : 'Missing');
```

### Check Browser Console

Open Developer Tools (F12) and check:
- Network tab for API calls
- Console tab for errors
- Application tab > Local Storage for tokens

---

## Still Having Issues?

### Information to Gather

1. **Error Message:** Full error from console
2. **Browser:** Chrome, Firefox, Safari, etc.
3. **OS:** Windows, Mac, Linux
4. **Node Version:** `node --version`
5. **Backend Status:** Is it running? What port?
6. **Steps to Reproduce:** What did you do before the error?

### Common Quick Fixes

1. **Clear Cache:**
   ```bash
   # Clear browser cache
   # Or hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
   ```

2. **Clear LocalStorage:**
   ```javascript
   // In browser console
   localStorage.clear();
   // Then refresh page
   ```

3. **Restart Dev Server:**
   ```bash
   # Stop (Ctrl+C) and restart
   npm run dev
   ```

4. **Reinstall Dependencies:**
   ```bash
   rm -rf node_modules
   npm install
   npm run dev
   ```

---

## Status of Known Issues

| Issue | Status | Notes |
|-------|--------|-------|
| `process is not defined` | ✅ FIXED | Changed to `import.meta.env` |
| `Cannot read VITE_API_BASE_URL` | ✅ FIXED | Added null safety |
| CORS errors | ⚠️ Backend Config | Need to enable CORS in backend |
| Firebase unauthorized domain | ℹ️ Config Required | Add domain in Firebase Console |

---

## Environment Setup Summary

**What's Required:**
- ✅ Node.js installed
- ✅ npm packages installed (`npm install`)
- ✅ Backend running on port 5000

**What's Optional:**
- `.env` file (uses defaults if not present)
- Custom API URL configuration

**Default Configuration:**
- API URL: `http://localhost:5000/api`
- Frontend: `http://localhost:3000`
- All environment variables have safe defaults

---

## ✅ Current Status

**All Critical Errors Fixed:**
- ✅ Environment variable access is now safe
- ✅ Proper TypeScript definitions in place
- ✅ Defensive error handling implemented
- ✅ Safe fallback to default API URL

**The app should now run without errors!** 🎉
