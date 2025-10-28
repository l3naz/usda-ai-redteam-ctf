# ⚡ Quick Fix: Unauthorized Domain Error

## 🚨 Error
```
Firebase: Error (auth/unauthorized-domain)
```

## ✅ Solution (2 minutes)

### **Step 1: Find Your Domain**
Look at your browser's address bar and note the domain:
```
Example: https://abc123.figma.com/app
         Domain: abc123.figma.com
```

### **Step 2: Open Firebase Console**
Click this link: https://console.firebase.google.com/project/usda-d6adb/authentication/settings

### **Step 3: Add Your Domain**
1. Scroll down to **"Authorized domains"** section
2. Click **"Add domain"** button
3. Enter your domain (e.g., `localhost` or `abc123.figma.com`)
   - ⚠️ Do NOT include `http://`, `https://`, or port numbers
4. Click **Save**

### **Step 4: Refresh and Test**
1. Wait 30 seconds
2. Refresh your browser
3. Try logging in again
4. ✅ Should work now!

---

## 📋 Common Domains to Add

For **local development**, add:
- `localhost`
- `127.0.0.1`

For **Figma Make**, add:
- Your exact Figma preview domain (check browser URL)

---

## 🎯 Quick Checklist

- [ ] Found my current domain (browser address bar)
- [ ] Opened Firebase Console (link above)
- [ ] Clicked "Add domain"
- [ ] Entered domain WITHOUT http:// or port
- [ ] Clicked Save
- [ ] Waited 30 seconds
- [ ] Refreshed browser
- [ ] Tested login
- [ ] ✅ Works!

---

**That's it! No code changes needed - just Firebase configuration.**

For detailed instructions, see `/FIREBASE_DOMAIN_FIX.md`
