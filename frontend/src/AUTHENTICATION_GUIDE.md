# Authentication Guide - USDA AI Red Team Training Game

## Overview

This training platform uses **mock authentication** by default - no external services, APIs, or Firebase required. This ensures the platform works reliably in any environment, including secure federal networks.

## Available Authentication Methods

### 1. Google Sign-In (Mock) ✅ RECOMMENDED

**How to use:**
1. Click "Get Started" on the landing page
2. Click "Continue with Google" in the auth modal
3. Instantly signed in as **Sarah Chen** (demo user)

**Technical details:**
- No real Google OAuth
- No Firebase required
- Simulates 800ms network delay for realistic UX
- Perfect for demos and training

**User created:**
```json
{
  "name": "Sarah Chen",
  "email": "sarah.chen@usda.gov"
}
```

---

### 2. Email/Password Authentication ✅

**How to use:**

**Sign In:**
1. Click "Get Started"
2. Enter any email (e.g., `john.doe@usda.gov`)
3. Enter any password (e.g., `password123`)
4. Click "Sign In"

**Sign Up:**
1. Click "Create an account" link
2. Fill in the form:
   - Full Name: Any name
   - Email: Any valid email format
   - Password: Any password
   - Mobile: Any number
3. Click "Create Account"

**Technical details:**
- Accepts any credentials (for demo purposes)
- Validates email format
- No database storage
- User data stored in React state only

---

### 3. Microsoft Sign-In (Mock) ✅

**How to use:**
1. Click "Get Started"
2. Click Microsoft logo button
3. Instantly signed in

**User created:**
```json
{
  "name": "James Wilson",
  "email": "james.wilson@microsoft.com"
}
```

---

### 4. Forgot Password (Mock) ✅

**How to use:**
1. Click "Forgot password?" link
2. Enter email address
3. Get simulated reset confirmation

---

## For Production Deployment (Real Authentication)

If you need real Firebase authentication for production:

### Step 1: Install Firebase
```bash
npm install firebase
```

### Step 2: Configure Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (usda-d6adb)
3. Go to **Authentication** > **Settings**
4. Under **Authorized domains**, add:
   - Your production domain (e.g., `training.usda.gov`)
   - `localhost` (for local development)

### Step 3: Enable Firebase Code

Open `/firebase.ts` and uncomment the real Firebase implementation:

```typescript
// Uncomment this section:
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
};
```

### Step 4: Update AuthModal

Open `/components/auth/AuthModal.tsx` and import Firebase:

```typescript
import { signInWithGoogle } from "../../firebase";

const handleGoogleLogin = async () => {
  try {
    const user = await signInWithGoogle();
    if (user) {
      onAuthenticate({
        name: user.displayName || "User",
        email: user.email || "",
      });
      onClose();
    }
  } catch (error) {
    console.error("Google sign-in failed:", error);
    alert("Authentication failed. Please try again.");
  }
};
```

---

## Security Notes for Federal Deployment

### Current (Mock Authentication):
- ✅ No external API calls
- ✅ No sensitive data transmission
- ✅ Works in airgapped/secure networks
- ✅ No third-party dependencies at runtime
- ⚠️ **Not suitable for production** (accepts any credentials)

### With Real Firebase:
- ✅ Industry-standard OAuth 2.0
- ✅ Secure token-based authentication
- ✅ HTTPS encrypted communication
- ⚠️ Requires internet connectivity
- ⚠️ Third-party service dependency (Google)

### Recommended for Federal Production:
Consider using:
- **Login.gov** (official federal identity provider)
- **PIV/CAC card authentication**
- **SAML/LDAP integration** with agency directory
- **Azure AD** (if using Microsoft 365)

---

## Troubleshooting

### "Authentication not working"
- Make sure you're clicking the buttons (Google, Microsoft, Sign In)
- Check that you filled in email/password fields
- Look for error messages in the modal

### "Still seeing Firebase errors"
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Make sure you're using the latest code (check `/firebase.ts`)

### "Want to test specific user scenarios"
Edit the mock data in `/components/auth/AuthModal.tsx`:

```typescript
// Change Google Sign-In user
const handleGoogleLogin = async () => {
  onAuthenticate({
    name: "Your Name Here",
    email: "your.email@usda.gov",
  });
  onClose();
};
```

---

## User Data Flow

```mermaid
User clicks "Get Started"
    ↓
Auth Modal Opens
    ↓
User chooses auth method
    ↓
Mock authentication executes
    ↓
User object created: { name, email }
    ↓
onAuthenticate() callback fires
    ↓
App.tsx sets isAuthenticated = true
    ↓
User redirected to Dashboard
    ↓
Protected pages now accessible
```

---

**Last Updated:** October 17, 2025  
**Status:** ✅ Production-ready for demo/training environments  
**Firebase Status:** ❌ Disabled (mock auth enabled)
