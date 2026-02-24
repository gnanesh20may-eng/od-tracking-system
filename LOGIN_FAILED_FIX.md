# 🔧 Login Failed - Troubleshooting Checklist

## ❌ You're seeing: "Login Failed" or error message

Let's fix this step by step.

---

## 🔍 First: What's the exact error message?

### Common Error Messages:

**Error 1: "Invalid credentials"**
```
Solution: User account doesn't exist or wrong password
- Did you create test users? npm run db:seed
- Or create personal account? .\register_user.ps1
- Check spelling of email/password
```

**Error 2: "Cannot reach backend"**
```
Solution: Backend is not running
- Run: cd backend && npm run dev
- Wait for: "Server running on port 5000"
```

**Error 3: "Network error" or "Failed to fetch"**
```
Solution: Frontend can't connect to backend
- Backend running? npm run dev
- Frontend .env correct? REACT_APP_API_URL=http://localhost:5000
- Restart frontend: npm start
```

**Error 4: "Database error"**
```
Solution: Database not initialized
- Run: cd backend && npm run db:init
- Then: npm run db:seed
- Then: npm run dev
```

**Error 5: "Email not registered"**
```
Solution: User account doesn't exist
- Create account: .\register_user.ps1
- Or: npm run db:seed
```

---

## ✅ Complete Diagnostic Checklist

### STEP 1: Check Backend

```bash
# Terminal 1 - Check if backend is in this folder
cd backend

# See what's in the folder
dir

# Started backend?
npm run dev
```

**Should see:**
```
✓ Backend server running on port 5000
✓ Database connected
```

If you see error, **STOP** and fix:
- Run `npm install` first
- Check PostgreSQL is running
- Check `.env` file has database credentials

---

### STEP 2: Check Database

**While backend is running, in another terminal:**

```bash
# Check database exists
psql -U postgres -c "\l"

# Should show: od_system database
```

**If od_system not listed:**
```bash
cd backend
npm run db:init          # Create tables
npm run db:seed          # Create test users
```

---

### STEP 3: Check Test Users or Personal Account

```bash
# Check if users exist
psql -U postgres -d od_system -c "SELECT email, role FROM staff;"
```

**Should show:**
```
email                 | role
----------------------+-------
staff@college.com     | staff
hod@college.com       | hod
admin@college.com     | admin
```

**If empty:**
```bash
cd backend
npm run db:seed          # Creates test users
```

**Or create your own:**
```powershell
.\register_user.ps1      # Interactive account creation
```

---

### STEP 4: Check Frontend Configuration

```bash
cd frontend

# Check .env file
type .env

# Or open it: frontend\.env
```

**Should contain:**
```
REACT_APP_API_URL=http://localhost:5000
```

**If wrong or missing:**
```bash
# Update it
echo REACT_APP_API_URL=http://localhost:5000 >> .env

# Or manually edit frontend/.env
```

---

### STEP 5: Check Login Credentials

When trying to login, use:

**If using test users (from npm run db:seed):**
```
Email:    staff@college.com
Password: password123
```

**If using personal account:**
```
Email:    your.email@college.com
Password: your_password_from_registration
```

**Common mistakes:**
- ❌ staffcollege.com → ✅ staff@college.com
- ❌ password123456 → ✅ password123
- ❌ Extra spaces → ✅ No spaces

---

## 🚨 Full Troubleshooting Procedure

Follow this in order:

### Problem 1: Backend not running
```bash
cd backend
npm install              # If not done
npm run dev             # Start backend
# Wait 5 seconds and see: "Server running on port 5000"
```

### Problem 2: Database not initialized
```bash
cd backend
npm run db:init         # Create tables
npm run db:seed         # Create test users
```

### Problem 3: Verify users exist
```bash
psql -U postgres -d od_system -c "SELECT * FROM staff;"
# Should show 3 test users or your personal accounts
```

### Problem 4: Check frontend .env
```bash
cd frontend
type .env
# Should have: REACT_APP_API_URL=http://localhost:5000
```

### Problem 5: Restart everything
```bash
# Stop backend - Press Ctrl+C
# Stop frontend - Press Ctrl+C

# Clean start
cd backend
npm run dev

# New terminal
cd frontend
npm start

# Browser - Open fresh
http://localhost:3000
```

---

## 🎯 Step-by-Step Fix (Do This Now)

### Terminal 1 - Backend:
```bash
cd backend
npm install
npm run db:init
npm run db:seed
npm run dev
```

**Wait for:**
```
✓ Backend server running on port 5000
```

**If you get errors, CHECK:**
- PostgreSQL running? (On Windows: Services → PostgreSQL)
- backend/.env exists and has correct database credentials?

### Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm start
```

**Wait for:**
```
Compiled successfully!
You can now view the app in the browser at:
Local: http://localhost:3000
```

### Browser:
```
Go to: http://localhost:3000
```

**Login with:**
```
Email: staff@college.com
Password: password123
```

**If fails, press F12 and check Console for error message**

---

## 🔍 Check Browser Console for Errors

1. **Open browser at http://localhost:3000**
2. **Press F12** (or right-click → Inspect)
3. **Go to Console tab**
4. **Look for red error messages**

### Common browser errors:

**"Cannot read property 'login' of undefined"**
- AuthContext not working
- Solution: Restart frontend `npm start`

**"401 Unauthorized"**
- Password wrong
- Solution: Check password spelling, try db:seed again

**"404 Not Found"**
- API endpoint doesn't exist
- Solution: Backend not running, start with `npm run dev`

**"Network error"**
- Can't reach backend
- Solution: Start backend `cd backend && npm run dev`

---

## 📋 Verification Commands

**Check backend is running:**
```bash
netstat -ano | findstr :5000
# Should show something listening on port 5000
```

**Check frontend is running:**
```bash
netstat -ano | findstr :3000
# Should show something listening on port 3000
```

**Check database:**
```bash
psql -U postgres -d od_system -c "SELECT COUNT(*) FROM staff;"
# Should return: count = 3 (or more if you created personal accounts)
```

**Check credentials:**
```bash
psql -U postgres -d od_system -c "SELECT email, role FROM staff;"
# Should show all accounts
```

---

## 💡 Most Common Causes

### 1. Backend Not Running (80% of issues)
```bash
# Check if running
netstat -ano | findstr :5000

# If nothing:
cd backend
npm run dev

# Wait for "Server running on port 5000"
```

### 2. Database Empty (15% of issues)
```bash
# Check users
psql -U postgres -d od_system -c "SELECT * FROM staff;"

# If empty:
cd backend
npm run db:seed
```

### 3. Wrong Credentials (4% of issues)
```
Email spelling: staff@college.com (not staffcollege.com)
Password: password123 (exactly)
Capital letters? Check carefully
Extra spaces? Delete them
```

### 4. Frontend Wrong Config (1% of issues)
```bash
# Check frontend/.env
cd frontend
type .env

# Should have: REACT_APP_API_URL=http://localhost:5000
```

---

## 🎯 Quick Fix (5 Minutes)

```bash
# Kill everything
# Close all terminals

# Fresh start
cd backend
npm run db:init
npm run db:seed
npm run dev

# New terminal
cd frontend
npm start

# Browser
# Open http://localhost:3000
# Login: staff@college.com / password123
```

---

## If Still Failing

**Copy this and run in backend:**
```bash
cd backend

echo "Checking environment..."
type .env
echo.

echo "Checking database..."
psql -U postgres -d od_system -c "SELECT email, role FROM staff;" 

echo.
echo "Starting server..."
npm run dev
```

**Then in another terminal, check frontend .env:**
```bash
cd frontend
type .env
npm start
```

**Then in browser:**
- Open: http://localhost:3000
- Press F12
- Go to Console tab
- Try to login
- **Send me the error message from Console**

---

## What NOT to Do

❌ Don't use wrong email:
- ❌ admin@college.com (if trying to login as staff)
- ❌ staffcollege.com (missing @)
- ❌ staff@college.c0m (zero instead of o)

❌ Don't skip database setup:
- ❌ Just start backend without npm run db:init
- ❌ Skip npm run db:seed

❌ Don't have wrong frontend config:
- ❌ REACT_APP_API_URL=http://backend:5000
- ❌ REACT_APP_API_URL=localhost:5000 (missing http://)

---

## Success Looks Like

### Backend console:
```
✓ Backend server running on port 5000
```

### Frontend console:
```
Compiled successfully!
You can now view the app in the browser at:
Local: http://localhost:3000
```

### Browser after login:
```
Redirects to /dashboard
Shows: "Welcome, John Staff (staff)"
```

---

## Next: Tell Me

When you try to login and see "Login Failed":

1. **What exact error message do you see?**
2. **Is backend running?** (See "Server running on port 5000"?)
3. **Did you run npm run db:seed?**
4. **What credentials are you using?**
5. **Open browser console (F12) - what errors show up?**

Share these and I can help pinpoint the exact issue!

---

**Start with the Quick Fix above and let me know what happens!** 🚀
