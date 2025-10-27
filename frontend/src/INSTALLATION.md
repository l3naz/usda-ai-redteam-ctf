# USDA AI Red Team Training Game - Installation Guide

## Quick Start

The application works immediately with **no additional setup required**. All authentication uses secure mock data for reliable demo and training purposes.

```bash
# That's it! Just run the app
npm run dev
```

### Real Firebase Authentication (Optional - For Production Only)

If deploying to production and need real Google Sign-In:

1. Install Firebase:
   ```bash
   npm install firebase
   ```

2. Add your domain to Firebase Console:
   - Go to Firebase Console > Authentication > Settings
   - Add your domain to "Authorized domains"

3. Uncomment the Firebase implementation in `/firebase.ts`

**Note:** Mock authentication is recommended for training/demo environments for reliability.

## Features

### Authentication Options (All work without external dependencies)

1. **Google Sign-In (Mock)** ✅ 
   - Click "Continue with Google" button
   - Instantly signs in as demo user (Sarah Chen)
   - Perfect for training scenarios

2. **Email/Password** ✅
   - Click "Get Started" on landing page
   - Enter any email/password to access the platform
   - Validates format but accepts any credentials for demo

3. **Microsoft Sign-In (Mock)** ✅
   - Available on sign-in screen
   - Instant authentication for demos

## Troubleshooting

### Page Not Loading

1. **Hard refresh** the browser (Ctrl+Shift+R or Cmd+Shift+R)
2. **Check browser console** for error messages
3. **Verify packages** are installed:
   ```bash
   npm install
   ```

### No Firebase Errors! ✅

The app now uses mock authentication by default:
- ✅ No Firebase setup required
- ✅ No external API dependencies  
- ✅ Works instantly in any environment
- ✅ Perfect for federal/secure environments

### Theme Issues

- Toggle between light/dark mode using the sun/moon icon
- Theme preference is saved in localStorage

## Application Structure

- **Landing Page** - Public access (no auth required)
- **Dashboard** - Protected (requires authentication)
- **Learn** - Interactive OWASP Top 10 modules
- **Play** - CTF-style challenges
- **Leaderboard** - Track your progress
- **Profile** - User settings and achievements

## Development

```bash
# Install dependencies (if needed)
npm install

# Start development server
npm run dev

# That's it! No Firebase or external APIs needed
```

## Support

For issues or questions:
- Check the browser console for error messages
- Review the file structure in `/`
- All page components are in `/pages`
- Shared components are in `/components/shared`

---

**Note:** This is a federal training platform. All features work without external dependencies, ensuring reliability in government environments.
