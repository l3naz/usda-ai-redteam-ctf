# Security Guidelines

## 🔐 Environment Variables & Secrets Management

### Critical Security Rules

1. **NEVER commit secrets to version control**
   - All `.env` files are in `.gitignore`
   - Use `.env.example` as a template with placeholders only
   - Real credentials go in `.env` (local) or platform environment variables (production)

2. **Separate public and private credentials**
   - **PUBLIC (client-side):** Firebase client API keys → Safe to expose, restricted by Firebase rules
   - **PRIVATE (server-side):** Firebase Admin SDK, database passwords, JWT secrets → NEVER expose to frontend

3. **Use environment-specific credentials**
   - Development: Local `.env` file
   - Staging: Platform environment variables (Netlify/Vercel)
   - Production: Cloud secret manager (AWS Secrets Manager, Google Secret Manager)

---

## 📁 File Security Matrix

### ✅ SAFE to commit (public)
- `src/firebase.ts` - Uses environment variables with placeholders
- `src/utils/api.ts` - API client with env-based URLs
- `.env.example` - Template with placeholder values only
- All component files with env variable references

### ⛔ NEVER commit (private)
- `.env` - Contains actual credentials
- `.env.local`, `.env.production` - Environment-specific secrets
- `serviceAccount.json` - Firebase Admin SDK private key
- Any file with real API keys, passwords, or tokens

---

## 🔧 Configuration Locations

### Frontend (Client-Side) - PUBLIC
**File:** `src/firebase.ts`  
**Variables:** `VITE_FIREBASE_*`  
**Security:** Public API keys restricted by Firebase Security Rules  
**Storage:** `.env` file or platform environment variables

### Backend (Server-Side) - PRIVATE
**Files:** `server/.env`, `server/config/`  
**Variables:** Database passwords, Firebase Admin SDK, JWT secrets  
**Security:** NEVER expose to client, server-only access  
**Storage:** Server environment variables or cloud secret manager

---

## 🚀 Deployment Security Checklist

### Before Deploying:

- [ ] Remove all hardcoded credentials from code
- [ ] Verify `.env` is in `.gitignore`
- [ ] Confirm `.env.example` has placeholders only
- [ ] Set environment variables in deployment platform
- [ ] Enable Firebase Security Rules
- [ ] Configure authorized domains in Firebase Console
- [ ] Use HTTPS for all production endpoints
- [ ] Enable CORS restrictions on backend API
- [ ] Rotate credentials regularly

### Platform-Specific Setup:

**Netlify:**
1. Site Settings → Environment Variables
2. Add all `VITE_*` variables
3. Redeploy after adding variables

**Vercel:**
1. Project Settings → Environment Variables
2. Add variables for Production/Preview/Development
3. Redeploy to apply changes

**GitHub Actions:**
1. Repository Settings → Secrets and Variables → Actions
2. Add secrets (never expose in logs)
3. Reference via `${{ secrets.SECRET_NAME }}`

---

## 🛡️ Firebase Security

### Client-Side API Keys (PUBLIC)
```typescript
// ✅ SAFE - These are public and restricted by Firebase rules
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
```

**Why it's safe:**
- Firebase restricts these keys by authorized domains
- Security Rules control data access, not API keys
- Keys are meant to be public in client apps

### Server-Side Admin SDK (PRIVATE)
```json
// ⛔ NEVER expose - Server only
{
  "type": "service_account",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "firebase-adminsdk@project.iam.gserviceaccount.com"
}
```

**Security:**
- Store in `server/.env` or cloud secret manager
- NEVER send to frontend
- NEVER commit to version control
- Use only in backend API

---

## 🔍 Security Audit Commands

```bash
# Check for accidentally committed secrets
git log -p | grep -i "api_key\|password\|secret"

# Scan for .env files in git history
git log --all --full-history -- .env

# Remove sensitive file from git history (if committed by mistake)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
```

---

## 📞 Security Incident Response

If credentials are accidentally exposed:

1. **Immediately rotate all exposed credentials**
   - Firebase: Regenerate API keys in Console
   - Backend: Change database passwords, JWT secrets
   - Tokens: Invalidate all issued JWTs

2. **Remove from version control**
   - Use `git filter-branch` to purge from history
   - Force push to remote (coordinate with team)

3. **Notify team and security officer**
   - Document what was exposed and when
   - Update security procedures

4. **Review and improve**
   - Add pre-commit hooks to catch secrets
   - Use tools like `git-secrets` or `gitleaks`
   - Conduct security training

---

## 🔗 Additional Resources

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/rules)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [Git Secrets Tool](https://github.com/awslabs/git-secrets)
- [Gitleaks - Secret Scanner](https://github.com/gitleaks/gitleaks)

---

**Last Updated:** 2025-01-27  
**Security Contact:** [Add security team contact]
