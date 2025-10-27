# 🔧 Authentication Troubleshooting Guide

Complete guide to fixing authentication issues in the USDA AI Red Team Training Game.

---

## 🚨 Common Error: `auth/unauthorized-domain`

### **Error Message:**
```
FirebaseError: Firebase: Error (auth/unauthorized-domain).
```

### **What This Means:**
Your current domain is not authorized in Firebase Console. This is a **security feature** - Firebase only allows authentication from pre-approved domains.

### **✅ Fix (2 minutes):**

#### **Step 1: Identify Your Domain**
```javascript
// Look at browser address bar:
http://localhost:5173       → Domain: localhost
https://abc.figma.com/app   → Domain: abc.figma.com

// Or run in browser console:
console.log(window.location.hostname);
```

#### **Step 2: Add Domain to Firebase**
1. Open: https://console.firebase.google.com/project/usda-d6adb/authentication/settings
2. Scroll to **"Authorized domains"**
3. Click **"Add domain"**
4. Enter domain: `localhost` or `abc.figma.com`
   - ⚠️ **NO** `http://` or `https://`
   - ⚠️ **NO** port numbers like `:5173`
5. Click **Save**

#### **Step 3: Test**
1. Wait 30-60 seconds
2. Clear browser cache (Ctrl+Shift+Delete)
3. Refresh page
4. Try login again
5. ✅ Should work!

### **Common Domains to Add:**

| Environment | Domain to Add |
|------------|---------------|
| Local Dev (Vite) | `localhost` |
| Local Dev (Alt) | `127.0.0.1` |
| Figma Preview | Check your browser URL (e.g., `abc123.figma.com`) |
| Production | Your production domain |

### **Still Not Working?**

**Common Mistakes:**
- ❌ Added `http://localhost` → Should be `localhost`
- ❌ Added `localhost:5173` → Should be `localhost`
- ❌ Added wrong domain → Check browser URL exactly
- ❌ Didn't wait → Wait 60 seconds after adding
- ❌ Didn't clear cache → Clear browser cache

---

## 🚨 Error: `auth/popup-closed-by-user`

### **Error Message:**
```
FirebaseError: Firebase: Error (auth/popup-closed-by-user).
```

### **What This Means:**
You closed the Google sign-in popup before completing authentication.

### **✅ Fix:**
1. Click Login button again
2. Complete the entire sign-in flow
3. Don't close the popup until redirected

### **Why This Happens:**
- User clicked "X" on popup
- User pressed ESC key
- Popup was blocked by browser
- User clicked outside popup (in some browsers)

---

## 🚨 Error: `auth/popup-blocked`

### **What This Means:**
Your browser is blocking the OAuth popup window.

### **✅ Fix:**

**Chrome/Edge:**
1. Look for blocked popup icon in address bar (🚫)
2. Click icon → "Always allow popups"
3. Try login again

**Firefox:**
1. Look for popup blocked notification
2. Click "Options" → "Allow popups for this site"
3. Try login again

**Safari:**
1. Safari → Preferences → Websites → Pop-up Windows
2. Find your domain → Allow
3. Try login again

---

## 🚨 Network Errors

### **Error: `Failed to fetch` or `Network request failed`**

### **Possible Causes:**

#### **1. Backend Not Running**
```bash
# Check if backend is running
curl http://localhost:5000/api/health

# If no response, start backend:
cd /path/to/backend
npm start
```

#### **2. Wrong API URL**
```bash
# Check environment variable
echo $VITE_API_BASE_URL

# Should be: http://localhost:5000/api
# If wrong, update .env file
```

#### **3. CORS Issues**
```javascript
// Backend should have CORS enabled:
// Check backend logs for CORS errors

// Backend should include:
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-domain.com'],
  credentials: true
}));
```

#### **4. Firewall/Network Issues**
- Check firewall isn't blocking localhost:5000
- Try accessing http://localhost:5000/api directly
- Check antivirus isn't blocking connections

---

## 🚨 Login Successful But No Redirect

### **Symptoms:**
- Google OAuth completes successfully
- Token stored in localStorage
- But page doesn't navigate to leaderboard

### **✅ Fix:**

#### **Check 1: Browser Console**
```javascript
// Open console (F12) and check for errors
// Look for navigation errors
```

#### **Check 2: localStorage**
```javascript
// Check if token was stored
console.log(localStorage.getItem('usda_token'));
// Should show JWT token
```

#### **Check 3: Navigation Function**
```javascript
// Verify onNavigate prop is passed correctly
// Check parent component passing onNavigate to LandingPage
```

---

## 🚨 Token Not Persisting After Refresh

### **Symptoms:**
- Login works
- Page refresh logs user out
- Token disappears from localStorage

### **✅ Fix:**

#### **Check 1: Browser Privacy Settings**
```
Chrome: Settings → Privacy → Cookies → Allow all cookies
Firefox: Settings → Privacy → Standard
Safari: Preferences → Privacy → Uncheck "Block all cookies"
```

#### **Check 2: Incognito/Private Mode**
- localStorage may not persist in private browsing
- Test in regular browser window

#### **Check 3: localStorage Quota**
```javascript
// Check if localStorage is available
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
  console.log('✅ localStorage working');
} catch (e) {
  console.error('❌ localStorage blocked:', e);
}
```

---

## 🚨 "Invalid Token" Error from Backend

### **Symptoms:**
- Firebase login succeeds
- Backend returns 401 or "Invalid token"

### **✅ Fix:**

#### **Check 1: Backend Firebase Config**
```javascript
// Backend should have Firebase Admin SDK configured
// Check backend has correct Firebase project ID

// Backend .env should have:
FIREBASE_PROJECT_ID=usda-d6adb
// Or service account JSON
```

#### **Check 2: Token Format**
```javascript
// Check token being sent to backend
const token = await user.getIdToken();
console.log('Token length:', token.length);
// Should be ~900-1200 characters
```

#### **Check 3: Clock Sync**
- Ensure your system clock is correct
- Firebase tokens have expiration times
- Wrong system time causes validation failures

---

## 🚨 Logout Not Working

### **Symptoms:**
- Click Logout but still logged in
- Token not cleared from localStorage

### **✅ Fix:**

#### **Check 1: localStorage Clearing**
```javascript
// Manual cleanup
localStorage.removeItem('usda_token');
localStorage.removeItem('userData');
location.reload();
```

#### **Check 2: Firebase Sign Out**
```javascript
// Check Firebase sign out is called
import { signOut } from 'firebase/auth';
import { auth } from './firebase';

await signOut(auth);
```

#### **Check 3: Hard Refresh**
- Press Ctrl+Shift+R (hard refresh)
- Or clear all site data in dev tools

---

## 🧪 Testing Checklist

### **Pre-Flight Checks:**
- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173
- [ ] Firebase domain authorized
- [ ] Browser allows popups
- [ ] Internet connection working

### **Login Flow:**
- [ ] Click Login button
- [ ] Popup appears (not blocked)
- [ ] Complete Google OAuth
- [ ] No console errors
- [ ] Token stored in localStorage
- [ ] Redirected to leaderboard
- [ ] Welcome toast appears

### **Logout Flow:**
- [ ] Click Logout button
- [ ] Token removed from localStorage
- [ ] Firebase session cleared
- [ ] Redirected to home
- [ ] Logout toast appears

---

## 🔍 Debugging Tools

### **Browser Console Commands:**

```javascript
// Check authentication state
console.log('Token:', localStorage.getItem('usda_token'));
console.log('User:', localStorage.getItem('userData'));

// Check Firebase auth state
import { auth } from './firebase';
console.log('Firebase user:', auth.currentUser);

// Test backend connection
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

// Clear all auth data
localStorage.clear();
location.reload();
```

### **Network Tab:**
1. Open DevTools (F12)
2. Go to Network tab
3. Click Login
4. Check for:
   - Firebase auth requests (accounts.google.com)
   - Backend API calls (localhost:5000)
   - Any 4xx or 5xx errors

### **Application Tab:**
1. Open DevTools (F12)
2. Go to Application tab
3. Check:
   - localStorage → Should have `usda_token`
   - Cookies → Check Firebase cookies
   - Session Storage → Check any cached data

---

## 📞 Still Having Issues?

### **Gather This Information:**

1. **Error Message:**
   - Exact error from browser console
   - Screenshot if possible

2. **Environment:**
   - Browser (Chrome/Firefox/Safari)
   - Operating System
   - Frontend URL (localhost:5173?)
   - Backend URL (localhost:5000?)

3. **What You've Tried:**
   - List of troubleshooting steps attempted
   - Results of each step

4. **Console Output:**
   - Copy full error from browser console
   - Include network tab errors

### **Quick Diagnostics:**

```bash
# Run these commands and share output:

# 1. Check frontend is running
curl http://localhost:5173

# 2. Check backend is running
curl http://localhost:5000/api/health

# 3. Check environment variables
cat .env

# 4. Check browser localStorage
# In browser console:
console.log(localStorage);
```

---

## ✅ Success Criteria

Your authentication is working when:

- ✅ Click Login → Google popup appears
- ✅ Complete OAuth → No errors
- ✅ Token stored in localStorage
- ✅ Redirect to leaderboard
- ✅ Welcome toast appears
- ✅ Page refresh → Still logged in
- ✅ Logout button visible
- ✅ Click Logout → Token cleared
- ✅ Redirect to home
- ✅ Login button visible again

---

## 📚 Related Documentation

- **Quick Fix Guide:** `/QUICK_FIX_UNAUTHORIZED_DOMAIN.md`
- **Detailed Domain Fix:** `/FIREBASE_DOMAIN_FIX.md`
- **Integration Summary:** `/AUTH_INTEGRATION_SUMMARY.md`
- **Firebase Setup:** `/FIREBASE_SETUP.md`
- **Backend Integration:** `/BACKEND_INTEGRATION_COMPLETE.md`

---

**Last Updated:** After auth integration  
**Status:** Comprehensive troubleshooting guide  
**Coverage:** All common authentication issues
