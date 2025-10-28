# 🔥 Firebase Authentication Setup Guide

## Current Status
✅ Firebase is integrated and ready to use  
⚠️ **Demo Mode Active** - Falls back to demo authentication if Firebase domain is not authorized

## The "Unauthorized Domain" Error

If you see this error:
```
Firebase: Error (auth/unauthorized-domain)
```

**Don't worry!** The application automatically falls back to Demo Mode, so you can continue testing. However, to use real Google authentication, you need to authorize your domain in Firebase.

---

## How to Fix: Authorize Your Domain

### Step 1: Identify Your Domain
The app is currently running on: **`${window.location.hostname}`**

You can also check the browser console for the exact domain when you attempt to sign in.

### Step 2: Add Domain to Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **usda-d6adb**
3. Navigate to **Authentication** (in the left sidebar)
4. Click on the **Settings** tab
5. Scroll to **Authorized domains**
6. Click **Add domain**
7. Enter your domain (e.g., `figma.com`, `localhost`, or your preview URL)
8. Click **Add**

### Common Domains to Add:
- `localhost` - For local development
- Your Figma Make preview domain
- Your production domain
- Any testing domains

---

## Demo Mode Features

When Firebase authentication fails, the app automatically uses **Demo Mode**:

✅ **Full access to all features**  
✅ **Instant sign-in** (no popup required)  
✅ **Demo user profile** with sample data  
✅ **All pages work normally**  

Demo User Details:
- **Name:** Demo User
- **Email:** demo@usda.gov
- **ID:** Randomly generated for each session

---

## Production Deployment

For production deployment:

1. **Update authorized domains** in Firebase Console
2. **Verify Google OAuth consent screen** is configured
3. **Test authentication** with real Google accounts
4. **Monitor Firebase Console** for authentication metrics

---

## Firebase Configuration

Current Firebase project configuration:
```javascript
projectId: "usda-d6adb"
authDomain: "usda-d6adb.firebaseapp.com"
```

---

## Need Help?

### Check the Console
Open browser DevTools (F12) and look for helpful messages:
- `🔧 Firebase Setup Required - Using Demo Mode`
- Domain authorization instructions
- Current hostname information

### Common Issues

**Issue:** Popup blocked  
**Solution:** Allow popups for your domain in browser settings

**Issue:** Firebase project not found  
**Solution:** Verify your Firebase credentials in `/firebase.ts`

**Issue:** Sign-in loop  
**Solution:** Clear browser cache and try again

---

## Security Notes

⚠️ **Important:** 
- Never commit Firebase private keys to source control
- Use environment variables for sensitive configuration
- Regularly review authorized domains in Firebase Console
- Monitor authentication logs for suspicious activity

---

## Testing Checklist

- [ ] Sign in with Google (real account)
- [ ] Sign out and verify session clears
- [ ] Profile page shows real user data (name, email, photo)
- [ ] Leaderboard identifies current user
- [ ] Header displays user avatar and name
- [ ] Authentication persists across page reloads

---

**Last Updated:** October 17, 2025  
**Version:** 1.0  
**Status:** Production-ready with demo fallback
