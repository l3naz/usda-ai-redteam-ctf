# 🚀 START HERE - Fix Auth Error

## ⚠️ You're seeing: `auth/unauthorized-domain` error

---

## ✅ Quick Fix (2 minutes)

### **Step 1: Find Your Domain**
Look at your browser's address bar:
```
Example URL: https://abc123.figma.com/app
Your domain: abc123.figma.com
```

Common domains:
- Local development: `localhost`
- Figma Make: `abc123.figma.com` (check your URL)

---

### **Step 2: Add Domain to Firebase**

**Click this link:**  
👉 https://console.firebase.google.com/project/usda-d6adb/authentication/settings

Then:
1. Scroll down to **"Authorized domains"** section
2. Click **"Add domain"** button
3. Type your domain: `localhost` OR `abc123.figma.com`
   - ⚠️ **Important:** Don't include `http://`, `https://`, or `:5173`
4. Click **"Save"**

---

### **Step 3: Test**
1. Wait 30 seconds ⏳
2. Refresh your browser 🔄
3. Click **Login** button 🔐
4. ✅ Should work now!

---

## 📚 More Help Needed?

Choose based on your situation:

| Document | Use When |
|----------|----------|
| **This guide** | You just need to fix the domain error ← START HERE |
| `/QUICK_FIX_UNAUTHORIZED_DOMAIN.md` | Need slightly more detail |
| `/FIREBASE_DOMAIN_FIX.md` | Want complete explanation |
| `/TROUBLESHOOTING_AUTH.md` | Having different errors |
| `/AUTH_INTEGRATION_SUMMARY.md` | Want to understand the whole system |

---

## ❓ FAQ

**Q: Why is this happening?**  
A: Firebase security feature - only approved domains can authenticate.

**Q: Is my code broken?**  
A: No! Code is perfect. Just needs configuration.

**Q: Do I need to add port numbers?**  
A: No! Just domain: `localhost` NOT `localhost:5173`

**Q: Do I need http:// or https://?**  
A: No! Just domain: `myapp.com` NOT `https://myapp.com`

**Q: How long does it take?**  
A: ~30 seconds after saving in Firebase Console

**Q: Will I need to do this again?**  
A: Only if you change domains (e.g., deploy to production)

---

## ✅ Success Checklist

After adding domain, verify everything works:

- [ ] Login button appears
- [ ] Click Login → Google popup opens
- [ ] Complete sign-in → No errors
- [ ] See "Welcome back" message
- [ ] Redirected to leaderboard
- [ ] Logout button appears
- [ ] Refresh page → Still logged in

---

## 🎯 Quick Visual Guide

```
┌─────────────────────────────────────────────┐
│ 1. Browser URL Bar                          │
│    https://abc123.figma.com/app             │
│            ↓                                │
│    Domain: abc123.figma.com                 │
└─────────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 2. Firebase Console                         │
│    → Authentication                         │
│    → Settings (gear icon)                   │
│    → Authorized domains                     │
│    → Add domain                             │
│    → Type: abc123.figma.com                 │
│    → Save                                   │
└─────────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 3. Test                                     │
│    → Wait 30 seconds                        │
│    → Refresh browser                        │
│    → Click Login                            │
│    → ✅ Works!                              │
└─────────────────────────────────────────────┘
```

---

## 🆘 Still Not Working?

Try these in order:

1. **Wait longer** - Give it 60 seconds
2. **Clear cache** - Ctrl+Shift+Delete
3. **Check domain spelling** - Must match browser URL exactly
4. **Try incognito** - Rule out browser cache
5. **Check console** - F12 → Console tab for other errors

If still stuck, see `/TROUBLESHOOTING_AUTH.md`

---

**That's it! Just add your domain to Firebase and you're done.** 🎉
