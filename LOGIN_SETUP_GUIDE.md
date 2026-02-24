# Login Setup Guide - Quick Fix

## Problem
You're getting a login error - "ID is not login" or credentials not working.

## Solution - 3 Steps

### Step 1: Initialize Database
Run this in the backend folder:
```bash
cd backend
npm run db:init
```
✅ This creates all necessary tables in PostgreSQL

### Step 2: Create Test Users
Run this command:
```bash
npm run db:seed
```
✅ Creates 3 test user accounts automatically

**Output will show:**
```
✅ Created STAFF: gokul@gmail.com
✅ Created HOD: hod@college.com
✅ Created ADMIN: admin@college.com

Use these credentials to login:

STAFF:
  Email: gokul@gmail.com
  Password: gokul123

HOD:
  Email: hod@college.com
  Password: password123

ADMIN:
  Email: admin@college.com
  Password: password123
```

### Step 3: Update Frontend .env
Make sure frontend has the correct API URL:

File: `frontend/.env`
```
REACT_APP_API_URL=http://localhost:5000
```

## Full Startup Procedure

### Terminal 1 - Backend Setup:
```bash
cd backend
npm install
npm run db:init
npm run db:seed
npm run dev
```

Output should show:
```
✅ Backend server running on port 5000
✅ Connected to PostgreSQL
```

### Terminal 2 - Frontend Setup:
```bash
cd frontend
npm install
npm start
```

Output should show:
```
Compiled successfully!
You can now view the app in the browser
Local: http://localhost:3000
```

### Terminal 3 - Open Browser:
```
http://localhost:3000
```

## Step-by-Step Login

1. **Frontend loads** at `http://localhost:3000`
2. **You see login page** with Email and Password fields
3. **Enter test credentials:**
   - Email: `gokul@gmail.com`
   - Password: `gokul123`
4. **Click Login button**
5. **Success!** - You'll see the dashboard

## Test Users Explained

### 1. STAFF User
```
Email: staff@college.com
Password: password123
Role: Staff Member
Can: Track location during duty, view own history
Cannot: Create duties, view other staff
```

### 2. HOD User
```
Email: hod@college.com
Password: password123
Role: Head of Department
Can: Create duties, assign to staff, view location history, access dashboard
Cannot: Delete other HODs, system settings
```

### 3. ADMIN User
```
Email: admin@college.com
Password: password123
Role: Administrator
Can: Full system access, create all users, view everything
Cannot: None - full access
```

## Troubleshooting

### Error: "Cannot find database"
**Solution:** 
1. PostgreSQL is not running
2. `.env` file not set up correctly
3. Database name/credentials wrong

**Fix:**
```bash
# Check .env file
cd backend
cat .env
```

Should have:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=od_system
```

### Error: "Email and password are required"
**Problem:** Empty fields
**Solution:** Fill in both email and password fields

### Error: "Invalid credentials"
**Problem:** Wrong email or password
**Solution:** 
1. Verify you typed it correctly
2. Run `npm run db:seed` again to reset test users
3. Copy-paste from this guide to avoid typos

### Error: "Port 5000 already in use"
**Problem:** Backend already running
**Solution:**
```bash
# Kill the process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Error: "Cannot GET /api/auth/login"
**Problem:** Frontend can't reach backend
**Solution:** 
1. Check backend is running on port 5000
2. Check frontend `.env` has correct `REACT_APP_API_URL`
3. Restart frontend: Stop and run `npm start` again

## What Happens During Login

1. **Frontend** sends email + password to backend
2. **Backend** looks up user by email in database
3. **Backend** compares hashed password (using bcrypt)
4. **If match:** Generates JWT token
5. **Token stored** in browser localStorage
6. **Frontend** redirects to dashboard
7. **All future requests** include JWT token

## After Successful Login

### If STAFF:
- Click "My History" to see location tracking
- Can only see own data

### If HOD:
- See "Dashboard" button
- Can create duties for staff
- Can view all location history
- Can see compliance statistics

### If ADMIN:
- See "Dashboard" button
- Can access all features
- Can create users (via API)
- Full system access

## Creating More Test Users (Via API)

After logging in as ADMIN, you can create more users via API:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Staff",
    "email": "newstaff@college.com",
    "password": "password123",
    "role": "staff",
    "department": "Engineering"
  }'
```

## Manual Database User Creation

If seed script doesn't work, create manually:

```bash
# Connect to PostgreSQL
psql -U postgres -d od_system

# Insert test user
INSERT INTO staff (name, email, password, role, department) 
VALUES (
  'Test Staff',
  'test@college.com',
  '$2b$10$...',  -- bcrypt hash
  'staff',
  'Engineering'
);
```

**Note:** Password must be bcrypted. Use seed script instead.

## Reset Everything (Fresh Start)

If something goes wrong, reset completely:

```bash
# 1. Delete database (if using PostgreSQL)
psql -U postgres -c "DROP DATABASE od_system;"
psql -U postgres -c "CREATE DATABASE od_system;"

# 2. Re-initialize
cd backend
npm run db:init
npm run db:seed

# 3. Restart backend
npm run dev
```

## Security Notes

⚠️ **For Development Only:**
- Test passwords are simple: `password123`
- Never use these in production
- Change passwords immediately when deploying

🔐 **For Production:**
- Use strong, unique passwords
- Store passwords securely (already using bcrypt)
- Use HTTPS instead of HTTP
- Add rate limiting
- Add email verification

## Success Checklist

- [ ] PostgreSQL installed and running
- [ ] Backend folder has `.env` file
- [ ] `npm run db:init` completed without errors
- [ ] `npm run db:seed` created 3 users
- [ ] Backend running: `npm run dev`
- [ ] Frontend running: `npm start`
- [ ] Can access `http://localhost:3000`
- [ ] Can login with test credentials
- [ ] Dashboard loads after login

## Next Steps

Once logged in:

### For STAFF:
1. Wait for HOD/Admin to create a duty
2. Click on the tracking link
3. Allow location permissions
4. Start location tracking
5. View location history

### For HOD:
1. Go to Dashboard
2. Create a new duty for a staff member
3. Set location and time
4. Share tracking link with staff
5. Monitor real-time location
6. View location history

### For ADMIN:
1. Access dashboard
2. Create multiple duties
3. Create more staff users (via API)
4. Monitor system statistics
5. View compliance reports

## Support Commands

**Check backend logs:**
```bash
cd backend
npm run dev
```

**Check frontend errors:**
- Open browser DevTools (F12)
- Go to Console tab
- Check Network tab for API calls

**Restart clean:**
```bash
# Kill all processes
# Restart backend and frontend
npm run dev  # in backend folder
npm start    # in frontend folder
```

## Common Login Workflow

```
1. Start Backend
   ↓
2. Start Frontend  
   ↓
3. Open http://localhost:3000
   ↓
4. See Login Page
   ↓
5. Enter: staff@college.com / password123
   ↓
6. Click Login
   ↓
7. See Dashboard
   ↓
✅ Success!
```

Need help? Check the error messages in:
- Backend console (where `npm run dev` is running)
- Frontend browser console (F12)
- PostgreSQL logs

Good luck! 🚀
