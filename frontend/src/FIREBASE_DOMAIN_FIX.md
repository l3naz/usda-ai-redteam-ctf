# 🔧 Firebase Unauthorized Domain Error - FIXED

## Error Message
```
Authentication error: FirebaseError: Firebase: Error (auth/unauthorized-domain).
```

## 🎯 Root Cause

Firebase requires all domains to be explicitly authorized in the Firebase Console before OAuth sign-in can work. This is a security feature to prevent unauthorized use of your Firebase project.

---

## ✅ Solution: Authorize Your Domain in Firebase Console

### **Step 1: Open Firebase Console**

1. Go to: https://console.firebase.google.com/
2. Select your project: **usda-d6adb**
3. Navigate to **Authentication** in the left sidebar
4. Click on the **Settings** tab (⚙️ icon)
5. Scroll to **Authorized domains**

---

### **Step 2: Add Your Domain**

You need to add the domain where your app is running. Common scenarios:

#### **For Local Development (localhost):**
Add these domains if not already present:
```
localhost
127.0.0.1
```

#### **For Figma Make Preview:**
Add the Figma Make preview domain (this will be shown in your browser URL):
```
<your-figma-make-domain>.preview.figma.com
```

#### **For Production Deployment:**
Add your production domain:
```
yourdomain.com
www.yourdomain.com
```

---

### **Step 3: Verify Authorization**

1. In Firebase Console → Authentication → Settings → Authorized domains
2. Ensure your current domain is listed
3. Click **Add domain** if needed
4. Enter the domain (without `http://` or `https://`)
5. Click **Save**

---

## 🚀 Quick Fix Steps

### **1. Check Your Current Domain**
Look at your browser's address bar. Examples:
```
http://localhost:5173          → Domain: localhost
http://127.0.0.1:5173          → Domain: 127.0.0.1
https://abc123.figma.com       → Domain: abc123.figma.com
```

### **2. Add Domain to Firebase**
```bash
# Firebase Console Path:
Authentication → Settings (gear icon) → Authorized domains → Add domain
```

### **3. Add These Common Domains**
For development, make sure these are all authorized:
- `localhost`
- `127.0.0.1`
- Your Figma Make preview domain (check browser URL)

### **4. Refresh Your App**
After adding the domain:
1. Refresh your browser
2. Try logging in again
3. The error should be resolved

---

## 📋 Complete Authorized Domains Checklist

In Firebase Console, ensure these domains are authorized:

### **Development:**
- [ ] `localhost`
- [ ] `127.0.0.1`

### **Figma Make:**
- [ ] Your Figma preview domain (e.g., `*.preview.figma.com`)
- [ ] Check the exact domain in your browser's address bar

### **Production (if applicable):**
- [ ] Your production domain
- [ ] www version of your domain

---

## 🔍 How to Find Your Exact Domain

### **Method 1: Browser Address Bar**
```javascript
// Look at the URL in your browser:
https://abc123xyz.preview.figma.com/app
         ↓
Domain: abc123xyz.preview.figma.com
```

### **Method 2: JavaScript Console**
```javascript
// Run in browser console:
console.log(window.location.hostname);
// Output: "abc123xyz.preview.figma.com"
```

### **Method 3: Check Firebase Error**
The Firebase error sometimes includes the domain:
```
auth/unauthorized-domain: This domain (abc123.figma.com) is not authorized
```

---

## 🛠️ Alternative: Test with Mock Authentication

If you want to test the app without configuring Firebase domains, you can temporarily use mock authentication:

### **Create Mock Auth for Testing:**

1. Create `/utils/mockAuth.ts`:
```typescript
// Mock authentication for testing without Firebase domains

export const mockSignInWithGoogle = async () => {
  return {
    uid: "mock-user-123",
    email: "test.user@usda.gov",
    displayName: "Test User",
    photoURL: null
  };
};

export const mockGetIdToken = async () => {
  return "mock-firebase-token-123";
};

export const mockSignOut = async () => {
  return Promise.resolve();
};
```

2. Temporarily modify `/pages/LandingPage.tsx`:
```typescript
// For testing only - comment out Firebase imports
// import { signInWithGoogle, signOut as firebaseSignOut, getFirebaseIdToken } from "../firebase";

// Import mock functions instead
import { 
  mockSignInWithGoogle as signInWithGoogle,
  mockGetIdToken as getFirebaseIdToken,
  mockSignOut as firebaseSignOut 
} from "../utils/mockAuth";
```

**⚠️ Note:** This is only for testing the UI flow. Backend integration will not work with mock auth.

---

## 📱 Firebase Console Quick Access

### **Direct Links:**
- **Project Console:** https://console.firebase.google.com/project/usda-d6adb
- **Authentication Settings:** https://console.firebase.google.com/project/usda-d6adb/authentication/settings
- **Authorized Domains:** https://console.firebase.google.com/project/usda-d6adb/authentication/settings (scroll down)

---

## ✅ Verification Steps

After adding your domain to Firebase, verify the fix:

### **1. Clear Browser Cache**
```bash
# Chrome/Edge:
Ctrl + Shift + Delete → Clear browsing data → Cached images and files

# Or use Incognito mode
```

### **2. Test Login Flow**
1. Refresh your app
2. Click the **Login** button
3. Google OAuth popup should appear
4. Complete authentication
5. Should redirect to leaderboard without errors

### **3. Check Console**
```javascript
// No errors should appear:
✅ No "auth/unauthorized-domain" error
✅ Login successful
✅ Token stored in localStorage
```

---

## 🎯 Expected Behavior After Fix

### **Before Fix:**
```
Click Login → Error: auth/unauthorized-domain → Login fails
```

### **After Fix:**
```
Click Login → Google OAuth popup → Authenticate → Success → Redirect to Leaderboard
```

---

## 🔐 Security Note

Firebase requires domain authorization for security reasons:
- **Prevents**: Unauthorized apps from using your Firebase project
- **Protects**: Your OAuth credentials and Firebase resources
- **Ensures**: Only your domains can authenticate users

This is a **feature, not a bug** - it protects your application.

---

## 📞 Still Having Issues?

### **Common Mistakes:**

1. **Including protocol in domain**
   - ❌ Wrong: `https://localhost`
   - ✅ Correct: `localhost`

2. **Including port in domain**
   - ❌ Wrong: `localhost:5173`
   - ✅ Correct: `localhost`

3. **Wildcard domains**
   - Firebase doesn't support wildcards like `*.figma.com`
   - You must add the exact domain

4. **Not refreshing after adding domain**
   - Wait 1-2 minutes after adding domain
   - Clear browser cache
   - Try in incognito mode

### **Debug Checklist:**

- [ ] Correct domain added (no http://, no port)
- [ ] Domain matches browser address bar exactly
- [ ] Waited 1-2 minutes after adding
- [ ] Cleared browser cache
- [ ] Tried in incognito mode
- [ ] Firebase Console shows domain as authorized

---

## 🎨 No Code Changes Needed

**Important:** This is a **configuration issue**, not a code issue. The code is correct - you just need to authorize your domain in Firebase Console.

### **Files That Are Already Correct:**
- ✅ `/firebase.ts` - Configuration is correct
- ✅ `/pages/LandingPage.tsx` - Login logic is correct
- ✅ `/utils/api.ts` - Backend integration is correct

**No code changes are required - only Firebase Console configuration.**

---

## 📊 Summary

| Issue | Solution | Time |
|-------|----------|------|
| Unauthorized domain error | Add domain to Firebase Console | 2 min |
| Domain: localhost | Add "localhost" to authorized domains | 1 min |
| Figma preview domain | Add exact preview URL to authorized domains | 1 min |

---

## ✅ Final Checklist

- [ ] Opened Firebase Console
- [ ] Navigated to Authentication → Settings
- [ ] Found "Authorized domains" section
- [ ] Added your current domain (check browser address bar)
- [ ] Saved changes
- [ ] Waited 1-2 minutes
- [ ] Cleared browser cache
- [ ] Refreshed app
- [ ] Tested login again
- [ ] ✅ Login works!

---

**Status:** 🔧 Configuration Required (No Code Changes)  
**Impact:** Blocks OAuth login until domain is authorized  
**Fix Time:** ~2 minutes  
**Difficulty:** Easy (just Firebase Console configuration)

Once you add your domain to the Firebase Console authorized domains list, the OAuth login will work immediately!
