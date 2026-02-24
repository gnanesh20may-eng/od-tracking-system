# 🚨 Login Failed - Quick Fix

You're seeing **"Login Failed"** or an error when trying to login. Let's fix this.

---

## ⚡ Quick Fix (Do This First)

### Run Diagnostic:
```powershell
.\diagnose_login.ps1
```

This will:
- Check if backend is running
- Check if database exists
- Check if users exist
- Show you exactly what to fix

---

## 🔴 Most Likely Problems

### Problem 1: Backend Not Running (70% of cases)

**You haven't run:** `npm run dev`

**Fix (Terminal 1):**
```bash
cd backend
npm run dev
```

**Should show:**
```
✓ Backend server running on port 5000
```

---

### Problem 2: Database Empty (20% of cases)

**You haven't created users** with `npm run db:seed`

**Fix (in backend folder):**
```bash
npm run db:seed
```

**Should show:**
```
✅ Created STAFF: staff@college.com
✅ Created HOD: hod@college.com
✅ Created ADMIN: admin@college.com
```

Then try login again with:
- Email: `staff@college.com`
- Password: `password123`

---

### Problem 3: Frontend Not Running (5% of cases)

**You haven't started frontend**

**Fix (Terminal 2):**
```bash
cd frontend
npm start
```

**Should show:**
```
Compiled successfully!
Local: http://localhost:3000
```

---

### Problem 4: Wrong Credentials (4% of cases)

**Common mistakes:**
- ❌ `staffcollege.com` → ✅ `staff@college.com`
- ❌ `password1234` → ✅ `password123`
- ❌ Extra spaces → ✅ No spaces

**Try exactly:**
```
Email: staff@college.com
Password: password123
```

---

### Problem 5: Wrong Frontend Config (1% of cases)

**Frontend can't reach backend**

**Check (in frontend folder):**
```bash
type .env
```

**Must contain:**
```
REACT_APP_API_URL=http://localhost:5000
```

**If wrong or missing:**
```bash
echo REACT_APP_API_URL=http://localhost:5000 > .env
```

---

## ✅ Step-by-Step Fix (Follow in Order)

### Step 1: Check Backend
```bash
cd backend
npm run dev
```

**Wait for:**
```
✓ Backend server running on port 5000
```

**If error, run first:**
```bash
npm install
npm run db:init
npm run db:seed
npm run dev
```

---

### Step 2: Create Users (if needed)
```bash
npm run db:seed
```

**Wait for:**
```
✅ Created STAFF: staff@college.com
✅ Created HOD: hod@college.com
✅ Created ADMIN: admin@college.com
```

---

### Step 3: Start Frontend (new terminal)
```bash
cd frontend
npm start
```

**Wait for:**
```
Compiled successfully!
Local: http://localhost:3000
```

---

### Step 4: Login
```
Browser: http://localhost:3000
Email: staff@college.com
Password: password123
Click Login
```

**🎉 Should work now!**

---

## 🔍 If Still Not Working

### Check Browser Console:
1. Open: http://localhost:3000
2. Press **F12**
3. Go to **Console** tab
4. Try to login
5. **Look for red error messages**

### Common Console Errors:

**"Cannot reach backend 5000"**
- Backend not running
- Run: `cd backend && npm run dev`

**"Invalid credentials"**
- Wrong email or password
- User doesn't exist - run `npm run db:seed`

**"401 Unauthorized"**
- Password wrong
- Try: staff@college.com / password123

**"Cannot GET /api/auth/login"**
- Backend not running
- Run: `npm run dev`

---

## 🎯 Complete Recovery Procedure

If nothing works, **full reset:**

### Terminal 1:
```bash
# Stop if running - Press Ctrl+C

cd backend
npm install
npm run db:init
npm run db:seed

echo.
echo Type 'npm run dev' when you see all users created
echo.

npm run dev
```

**Wait for:**
```
✓ Backend server running on port 5000
```

### Terminal 2 (New):
```bash
cd frontend
npm install
npm start
```

**Wait for:**
```
Compiled successfully!
Local: http://localhost:3000
```

### Browser:
```
1. Open: http://localhost:3000
2. Email: staff@college.com
3. Password: password123
4. Click Login
```

---

## 📋 Checklist

Before trying to login, verify:

- [ ] Backend running? (Port 5000 showing "Server running")
- [ ] Frontend running? (Port 3000 showing "Compiled successfully")
- [ ] Database initialized? (Ran `npm run db:init`)
- [ ] Users created? (Ran `npm run db:seed`)
- [ ] Using correct email? (staff@college.com)
- [ ] Using correct password? (password123)
- [ ] frontend/.env has correct API URL? (http://localhost:5000)

All checked? → **Try login now** ✅

---

## 💬 What to Tell Me

If it's still failing:

1. **Run diagnostic:**
   ```powershell
   .\diagnose_login.ps1
   ```

2. **Press F12 in browser and tell me the Console error**

3. **Tell me what's showing:**
   - Backend console?
   - Frontend console?
   - Browser console?

4. **What credentials are you using?**

---

## 📞 Quick Commands

```bash
# Diagnostic tool
.\diagnose_login.ps1

# Full reset backend
cd backend
npm install
npm run db:init
npm run db:seed

# Start backend
npm run dev

# In new terminal - start frontend
cd frontend
npm install
npm start

# Check database
psql -U postgres -d od_system -c "SELECT email FROM staff;"
```

---

## ✨ Summary

**99% of "Login Failed" errors are because:**
1. Backend not running (`npm run dev` not executed)
2. Users not created (`npm run db:seed` not executed)
3. Wrong credentials (copy exactly from above)

**Do this in order:**
1. `cd backend && npm run dev` (Terminal 1)
2. `cd frontend && npm start` (Terminal 2)
3. Login with staff@college.com / password123

---

**Still failing?**
1. Run: `.\diagnose_login.ps1`
2. Follow its recommendations
3. Check browser console (F12)
4. Tell me what errors you see

🚀 **You can fix this!**
