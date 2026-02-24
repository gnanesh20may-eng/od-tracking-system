# Login Troubleshooting Guide

## Problem: "ID is not login" or Login Fails

This guide will help you fix login issues step by step.

---

## Quick Diagnosis

### 1. Check if Backend is Running
**Error:** "Cannot reach backend" or "Network error"

**How to check:**
1. Open command prompt
2. Run: `netstat -ano | findstr :5000`
3. If no results, backend is NOT running

**Fix:**
```bash
cd backend
npm run dev
```
Should show:
```
✓ Backend server running on port 5000
```

---

### 2. Check if Database is Initialized
**Error:** "Database error" or server crashes

**How to check:**
1. Open command prompt
2. Run: `psql -U postgres -d od_system -c "SELECT COUNT(*) FROM staff;"`
3. If error, database not initialized

**Fix:**
```bash
cd backend
npm run db:init
```
Should show:
```
✓ Staff table created
✓ Duty_requests table created
✓ Location_logs table created
```

---

### 3. Check if Test Users Exist
**Error:** "Invalid credentials" even with correct password

**How to check:**
1. Open command prompt
2. Run: `psql -U postgres -d od_system -c "SELECT email, role FROM staff;"`
3. Should show 3 users: staff@college.com, hod@college.com, admin@college.com

**Fix:**
```bash
cd backend
npm run db:seed
```
Should show:
```
✅ Created STAFF: staff@college.com
✅ Created HOD: hod@college.com
✅ Created ADMIN: admin@college.com
```

---

## Step-by-Step Troubleshooting

### Issue: "Invalid credentials"

**Checklist:**
- [ ] Email is exactly: `staff@college.com` (case doesn't matter)
- [ ] Password is exactly: `password123`
- [ ] No extra spaces before/after

**If still failing:**

1. **Reset test users:**
```bash
cd backend
npm run db:seed
```

2. **Verify in database:**
```bash
psql -U postgres -d od_system -c "SELECT email FROM staff WHERE email='staff@college.com';"
```

3. **Check password hash:**
```bash
psql -U postgres -d od_system -c "SELECT email, password FROM staff WHERE email='staff@college.com';"
```
Should return a long bcrypt hash starting with `$2b$`

---

### Issue: "Cannot reach backend" or "Failed to fetch"

**Checklist:**
- [ ] Backend running on port 5000?
- [ ] Frontend has correct API URL?
- [ ] Network/Firewall blocking requests?

**Fix:**

1. **Verify backend is running:**
```bash
cd backend
npm run dev
```
You should see: `Server running on port 5000`

2. **Check frontend .env:**
```bash
cd frontend
cat .env
```
Should contain: `REACT_APP_API_URL=http://localhost:5000`

3. **If .env is wrong, update it:**
```bash
# Windows
echo REACT_APP_API_URL=http://localhost:5000 >> .env

# Or manually edit frontend/.env
```

4. **Restart frontend:**
```bash
cd frontend
npm start
```

---

### Issue: "Database error" or "Connection refused"

**Checklist:**
- [ ] PostgreSQL server is running?
- [ ] Database exists: `od_system`?
- [ ] .env has correct credentials?

**Fix:**

1. **Check PostgreSQL is running:**
```bash
# Windows - Test connection
psql -U postgres -c "\l"
```
Should list databases

2. **Check .env file:**
```bash
cd backend
cat .env
```
Should show:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=od_system
```

3. **Verify database exists:**
```bash
psql -U postgres -c "\l"
```
Should include: `od_system`

4. **Recreate database if needed:**
```bash
psql -U postgres -c "DROP DATABASE IF EXISTS od_system;"
psql -U postgres -c "CREATE DATABASE od_system;"
cd backend
npm run db:init
npm run db:seed
```

---

### Issue: "Port 5000 already in use"

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Fix:**

1. **Find process using port 5000:**
```bash
netstat -ano | findstr :5000
```
Returns PID number

2. **Kill the process:**
```bash
taskkill /PID <number_from_above> /F
```

Example:
```bash
netstat -ano | findstr :5000
# Output: TCP    127.0.0.1:5000         0.0.0.0:0        LISTENING       4128
taskkill /PID 4128 /F
```

3. **Restart backend:**
```bash
cd backend
npm run dev
```

---

### Issue: "npm command not found"

**Error:** `npm is not recognized as an internal or external command`

**Fix:**

1. **Check Node.js installation:**
```bash
node --version
npm --version
```

2. **If not found, install Node.js:**
   - Download from: https://nodejs.org
   - Install with default options
   - Restart command prompt
   - Try again

3. **Add to PATH (if needed):**
   - Find Node.js installation folder (usually `C:\Program Files\nodejs`)
   - Add to Windows PATH environment variable
   - Restart command prompt

---

### Issue: "Package not found" during npm install

**Error:** `npm ERR! 404 Not Found - npm ERR! 404`

**Fix:**

1. **Clear npm cache:**
```bash
npm cache clean --force
```

2. **Delete node_modules and reinstall:**
```bash
cd backend
rm -r node_modules
npm install
```

3. **Use older npm version:**
```bash
npm install -g npm@8
npm install
```

---

## Backend vs Frontend Issues

### Backend Issues (npm run dev fails)
- Cannot connect to database
- Port already in use
- Dependencies not installed
- .env file missing

**Check logs in Terminal 1 where backend is running**

### Frontend Issues (npm start fails)
- API endpoint wrong
- Dependencies not installed
- Port 3000 already in use
- .env file missing

**Check logs in Terminal 2 where frontend is running**

### Login Issues (Can't login after both running)
- Invalid credentials (user doesn't exist)
- Test users not created
- Database tables not created
- JWT secret misconfigured

**Check browser Console (F12)**

---

## Full System Verification Checklist

```
BACKEND SETUP:
☐ PostgreSQL installed and running
☐ backend/.env file exists with DB credentials
☐ npm install completed in backend folder
☐ npm run db:init succeeded
☐ npm run db:seed succeeded
☐ npm run dev running and showing "port 5000"

FRONTEND SETUP:
☐ frontend/.env file exists
☐ REACT_APP_API_URL=http://localhost:5000
☐ npm install completed in frontend folder
☐ npm start running and showing "Compiled successfully"
☐ Browser can access http://localhost:3000

LOGIN TEST:
☐ Login page loads
☐ Email field accepts input
☐ Password field accepts input
☐ Login button is clickable
☐ Can login with staff@college.com / password123
☐ Dashboard loads after login
```

---

## Complete Fresh Start (Nuclear Option)

If nothing works, start completely fresh:

### 1. Stop everything
- Close all terminals
- Wait 30 seconds

### 2. Clean backend
```bash
cd backend
rm -r node_modules
rm package-lock.json
npm cache clean --force
npm install
npm run db:init
npm run db:seed
npm run dev
```

### 3. Clean frontend (new terminal)
```bash
cd frontend
rm -r node_modules
rm package-lock.json
npm cache clean --force
npm install
npm start
```

### 4. Test login
- Open http://localhost:3000
- Login with: staff@college.com / password123

---

## Getting Help: What Info to Provide

If you need help, provide:

1. **Error message:** Exact error from console
2. **Where it happens:** Login page? Backend startup? Frontend?
3. **Command output:** What does `npm run dev` show?
4. **Database check:** 
   ```bash
   psql -U postgres -d od_system -c "SELECT COUNT(*) FROM staff;"
   ```
5. **.env contents:**
   ```bash
   cat backend/.env
   cat frontend/.env
   ```

---

## Common Error Messages

| Error | Meaning | Fix |
|-------|---------|-----|
| "Invalid credentials" | User doesn't exist or wrong password | Run `npm run db:seed` |
| "Cannot reach backend" | Frontend can't connect to port 5000 | Start backend with `npm run dev` |
| "EADDRINUSE" | Port already in use | Kill process using port 5000 |
| "ENOENT" | File not found | Run in correct directory (backend or frontend) |
| "Connection refused" | Can't reach PostgreSQL | Start PostgreSQL service |
| "Module not found" | Dependencies not installed | Run `npm install` |

---

## Debug Commands

**Check backend:**
```bash
cd backend
npm run dev
# Look for: "Server running on port 5000"
# Look for: "Listening on port 5000"
```

**Check database:**
```bash
psql -U postgres
\c od_system
SELECT * FROM staff;
\q
```

**Check frontend:**
```bash
npm start
# Look for: "Compiled successfully!"
# Open: http://localhost:3000
# Check browser console: F12 → Console
```

**Test API:**
```bash
curl http://localhost:5000/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d "{"email":"staff@college.com","password":"password123"}"
```

---

## Still Having Issues?

1. **Check all three must-runs are active:**
   - PostgreSQL running
   - Backend running (port 5000)
   - Frontend running (port 3000)

2. **Try the fresh start option** above

3. **Check file permissions:**
   - .env files readable
   - backend/node_modules writable
   - frontend/node_modules writable

4. **Update Node.js and npm:**
   ```bash
   node --version   # Should be 14 or higher
   npm --version    # Should be 6 or higher
   ```

5. **Check for typos:**
   - Email: `staff@college.com` (not `staffcollege.com`)
   - Password: `password123` (not `password1234`)
   - URL: `http://localhost:3000` (not `localhost:3000`)

---

## Success Indicators

✅ **Backend started successfully:**
```
✓ Database connected
✓ Server running on port 5000
```

✅ **Frontend started successfully:**
```
Compiled successfully!
You can now view the app in the browser
Local: http://localhost:3000
```

✅ **Login successful:**
```
Directed to /dashboard
Sees "Welcome, [Name] ([Role])"
```

Once you see all three, login should work! 🎉
