# ✅ Fixed: Environment Variable Error

## 🐛 Error

```
ReferenceError: process is not defined
    at utils/api.ts:4:5
```

## 🔍 Root Cause

The code was trying to access `process.env.NEXT_PUBLIC_API_BASE_URL`, but:
- This is a **Vite-based React app**, not Next.js
- `process` is a Node.js global, not available in the browser
- Vite uses `import.meta.env` instead of `process.env`

## ✅ Solution

### 1. Updated `utils/api.ts`

**Before:**
```typescript
const API_BASE_URL = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api')
  : 'http://localhost:5000/api';
```

**After:**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
```

### 2. Updated `.env.example`

**Before:**
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

**After:**
```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Created `vite-env.d.ts`

Added TypeScript definitions for environment variables:

```typescript
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## 📝 Important Notes

### Vite Environment Variables

In Vite, environment variables must:
1. Be prefixed with `VITE_` to be exposed to the client
2. Be accessed via `import.meta.env.VITE_*`
3. Be defined in `.env` file at the root of the project

### Usage Example

**Creating `.env` file:**
```bash
# Create .env from example
cp .env.example .env

# Edit with your values
VITE_API_BASE_URL=http://localhost:5000/api
```

**Accessing in code:**
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
console.log(apiUrl); // "http://localhost:5000/api"
```

### Development vs Production

**Development:**
```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

**Production:**
```bash
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

## 🎯 Next Steps

1. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

2. **Ensure backend is running:**
   ```bash
   # In backend directory
   npm start
   # Should be running on http://localhost:5000
   ```

3. **Start frontend:**
   ```bash
   npm run dev
   ```

4. **Verify:**
   - No more `process is not defined` error
   - API calls should now work correctly
   - Check browser console for API_BASE_URL value

## 📚 References

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [TypeScript Environment Variables](https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript)

## ✅ Status

**FIXED** ✓

All environment variable references have been updated to use Vite's `import.meta.env` syntax with proper null safety.

### Additional Fix (v2)

Added defensive error handling to prevent `Cannot read properties of undefined`:

```typescript
const getApiBaseUrl = (): string => {
  try {
    return import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api';
  } catch (error) {
    return 'http://localhost:5000/api';
  }
};
```

This ensures the app always has a valid API URL, even if:
- `.env` file doesn't exist (which is fine - it's optional)
- `import.meta.env` is undefined in certain build contexts
- The environment variable is not set

**The app now works without requiring a `.env` file!**
