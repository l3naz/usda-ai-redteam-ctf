# Quick Start - Mock Authentication

## How to Use the Platform

### Logging In
1. Navigate to the landing page
2. Click the **"Login"** button in the top right
3. When the modal opens, click **"Sign In"** (credentials are auto-filled)
4. You'll be signed in as **Nithin N** (nithin@usda.gov)
5. You're now logged in and can access all features!

### What You Can Do
- ✅ Access Dashboard - View your progress overview
- ✅ Learn Page - Browse OWASP Top 10 LLM vulnerabilities
- ✅ Play Page - Complete interactive challenges
- ✅ Leaderboard - See rankings (you'll appear at rank #9)
- ✅ Profile - View and edit your profile information

### Logging Out
- Click the **logout icon** (arrow) in the top right header
- You'll be signed out and returned to the landing page
- Your mock session will be cleared

### Session Persistence
- Your login persists across page refreshes
- If you close and reopen the browser, you'll still be logged in
- Session data is stored locally in your browser

### Mock User Details
```
Name: Nithin N
Email: nithin@usda.gov
Department: AI Center of Excellence
Rank: #9 on Leaderboard
Modules Completed: 4/10
Score: 365 points
```

### Developer Notes
- No real authentication happens
- No data leaves your browser
- Perfect for development and testing
- Works completely offline
- No API keys or Firebase setup needed

### Troubleshooting

**If login doesn't work:**
1. Clear localStorage in browser DevTools
2. Refresh the page
3. Try logging in again

**If you're stuck on the landing page:**
1. Check browser console for errors
2. Make sure localStorage is enabled
3. Try incognito/private browsing mode

**To reset everything:**
```javascript
// Open browser console and run:
localStorage.clear();
location.reload();
```

## For Developers

### How It Works
- Mock user object created in `AuthModal.tsx`
- User stored in React Context (`UserContext.tsx`)
- Session persisted to localStorage
- No Firebase or external APIs involved

### Customizing the Mock User
Edit `/components/auth/AuthModal.tsx`, line ~40:

```typescript
const mockUser: User = {
  uid: "mock-user-nithin-" + Date.now(),
  email: "nithin@usda.gov",        // ← Change email here
  displayName: "Nithin N",          // ← Change name here
  photoURL: null,
  emailVerified: true,
  isAnonymous: false,
};
```

### Adding Multiple Mock Users
You can create different mock users for testing:

```typescript
// In AuthModal.tsx
const mockUsers = {
  admin: {
    uid: "admin-123",
    displayName: "Admin User",
    email: "admin@usda.gov",
    // ...
  },
  regular: {
    uid: "user-456",
    displayName: "Nithin N",
    email: "nithin@usda.gov",
    // ...
  }
};

// Select based on form input
const mockUser = mockUsers.regular;
```

### Re-enabling Firebase
See `/MOCK_AUTH_MIGRATION.md` for complete instructions on reverting to Firebase authentication.

---

**Platform Status**: ✅ Fully functional with mock authentication  
**Last Updated**: October 17, 2025  
**Version**: Mock Auth v1.0
