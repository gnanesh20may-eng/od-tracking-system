# Login Flow - Visual Guide

## Login Process Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│           USER OPENS http://localhost:3000          │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│         React Frontend Loads (port 3000)            │
│         • Login Page Component                      │
│         • Form with Email + Password fields        │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│        USER ENTERS CREDENTIALS & CLICKS LOGIN       │
│        Email: staff@college.com                     │
│        Password: password123                        │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  Frontend sends: POST /api/auth/login               │
│  with { email, password } to                        │
│  http://localhost:5000                             │
└────────────────────┬────────────────────────────────┘
                     │
         ┌───────────┴────────────┐
         │                        │
         ▼                        ▼
    ┌─────────────┐          ┌──────────────┐
    │  BACKEND    │          │  DATABASE    │
    │  Receives   │          │  PostgreSQL  │
    │  Request    │─────────▶│ Checks if    │
    └─────────────┘          │ user exists  │
                             └──────────────┘
                                    │
                    ┌───────────────┴──────────────────┐
                    │                                  │
            Found ◀─┴──▲                      ◀─ Not Found
                    │  │
                    ▼  │
            ┌──────────────────┐
            │ Verify Password  │
            │ Using bcrypt     │
            └────────┬─────────┘
                     │
         ┌───────────┴────────────┐
         │                        │
    ✅ MATCH              ❌ NO MATCH
         │                        │
         ▼                        ▼
    Generate JWT          Return Error:
    Save to DB      "Invalid credentials"
    Return Token           │
         │                 │
         ▼                 ▼
    Frontend            Frontend
    Stores JWT          Shows error
    in localStorage      message
         │
         ▼
    Redirect to /dashboard
         │
         ▼
    ✅ LOGIN SUCCESS ✅
```

---

## What Should Happen at Each Step

### Step 1: Browser Page Loads
```
✅ You see login form with:
   - Email input field
   - Password input field
   - Login button
   - "OD Verification System" title
```

### Step 2: Enter Credentials
```
✅ Type in Email: staff@college.com
✅ Type in Password: password123
✅ Can see password as dots (*****)
```

### Step 3: Click Login
```
✅ Button shows "Logging in..." (loading state)
✅ Cannot click again while logging in
✅ Frontend makes API request to backend
```

### Step 4: Backend Process
```
✅ Backend receives request
✅ Looks up user in PostgreSQL
✅ Compares password hash
✅ Generates JWT token
✅ Returns token to frontend
```

### Step 5: Frontend Stores Token
```
✅ Receives JWT token from backend
✅ Stores in browser localStorage
✅ Auto-includes in all future requests
```

### Step 6: Success - Redirect
```
✅ Redirects to /dashboard
✅ Sees "Welcome, [Your Name] ([Role])"
✅ Can see navigation menu
```

---

## System Architecture During Login

```
┌──────────────┐              ┌──────────────┐
│   BROWSER    │              │   NODE.JS    │
│  (localhost) │              │   (Backend)  │
│              │              │              │
│ ┌──────────┐ │   HTTP       │ ┌──────────┐ │
│ │ React    │─┼─ REQUEST ───▶│ │ Express  │ │
│ │ App      │ │ JSON Body    │ │ Server   │ │
│ │          │ │              │ │  :5000   │ │
│ │ Login    │ │   HTTP       │ │          │ │
│ │ Component│◀─┼─ RESPONSE ──│ │ Auth     │ │
│ │          │ │ JWT + User   │ │ Routes   │ │
│ └──────────┘ │              │ └────┬─────┘ │
│              │              │      │       │
│ localStorage │              │      ▼       │
│ JWT token    │              │ ┌─────────┐ │
└──────────────┘              │ │Postgres │ │
                              │ │Database │ │
                              │ │         │ │
                              │ │staff    │ │
                              │ │table    │ │
                              │ └─────────┘ │
                              └──────────────┘
```

---

## Directory Check Before Login

```
✅ Backend Ready:
   backend/
   ├── .env (database config)
   ├── node_modules/ (installed)
   ├── src/
   │  ├── server.js (running on :5000)
   │  ├── controllers/authController.js
   │  ├── models/Staff.js
   │  └── routes/authRoutes.js
   └── database/
      ├── init.js (tables created)
      └── seedUsers.js (test users created)

✅ Frontend Ready:
   frontend/
   ├── .env (API_URL configured)
   ├── node_modules/ (installed)
   ├── src/
   │  ├── pages/Login.js (displaying)
   │  ├── context/AuthContext.js (managing state)
   │  └── services/api.js (API calls)
   └── public/ (served on :3000)

✅ Database Ready:
   ODpostgreSQL:
   └── od_system (database)
      ├── staff (3 test users)
      ├── duty_requests (empty for now)
      └── location_logs (empty for now)
```

---

## Success Checklist - What to See

### Terminal 1 - Backend Console
```bash
$ npm run dev

✓ Backend server running on port 5000
✓ Database connected successfully
```

### Terminal 2 - Frontend Console
```bash
$ npm start

Compiled successfully!
You can now view the app in the browser

  Local:            http://localhost:3000
```

### Browser - http://localhost:3000
```
┌──────────────────────────────────────┐
│   OD Verification System             │
│   Staff Login                        │
│                                      │
│  Email: [_____________________]      │
│                                      │
│  Password: [__________________]      │
│                                      │
│    [         Login          ]         │
│                                      │
│ Staff account required for access    │
└──────────────────────────────────────┘

Type: staff@college.com
Type: password123
Click Login
```

### After Login - Dashboard Page
```
┌──────────────────────────────────────┐
│ OD Verification Dashboard            │
│                              [Logout] │
│                                      │
│ Welcome, John Staff (staff)          │
│                                      │
│ ✓ Dashboard loaded                   │
│ ✓ Navigation menu visible            │
│ ✓ Can click on options               │
└──────────────────────────────────────┘
```

---

## Login Test Workflow (Step by Step)

### Preparation Phase
```
TERMINAL 1:
$ cd backend
$ npm run dev
[WAIT for: "Server running on port 5000"]

TERMINAL 2:
$ cd frontend
$ npm start  
[WAIT for: "Compiled successfully!"]

BROWSER:
$ Navigate to http://localhost:3000
```

### Login Phase
```
1. See login page loaded ✓
2. Fill in email: staff@college.com
3. Fill in password: password123
4. Click "Login" button
5. Wait 2-3 seconds for response
```

### Expected Outcome
```
Option A: SUCCESS ✅
├─ No error message
├─ Page redirects to /dashboard
├─ Sees "Welcome, [Name] ([Role])"
└─ Can see navigation menu

Option B: FAILURE ❌
├─ Error message appears
├─ Message explains problem
├─ Can try again
└─ Check troubleshooting guide
```

---

## Environment Variables (What Should Be Set)

### backend/.env
```ini
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=od_system
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000
```

### frontend/.env
```ini
REACT_APP_API_URL=http://localhost:5000
REACT_APP_MAP_TILES=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
REACT_APP_TRACKING_INTERVAL=30000
```

---

## Network Request During Login

### Frontend Sends:
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "staff@college.com",
  "password": "password123"
}
```

### Backend Returns (Success):
```
HTTP/1.1 200 OK

{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Staff",
    "email": "staff@college.com",
    "role": "staff",
    "department": "Computer Science"
  }
}
```

### Backend Returns (Failure):
```
HTTP/1.1 400 Bad Request

{
  "error": "Invalid credentials"
}
```

---

## What Database Looks Like

### Before Seed:
```
PostgreSQL database "od_system":

staff table:
  (empty - 0 rows)
```

### After Seed:
```
PostgreSQL database "od_system":

staff table (3 rows):
  id │ name       │ email              │ role  │ department
  1  │ John Staff │ staff@college.com  │ staff │ Computer Science
  2  │ Jane HOD   │ hod@college.com    │ hod   │ Computer Science
  3  │ Admin User │ admin@college.com  │ admin │ Administration

Password field: (30+ character bcrypt hash)
Example: $2b$10$ufZAK0XPsdjKxfKKrKzv...(rest of hash)
```

---

## Authentication Flow Summary

```
User Input
    │
    ▼
Frontend Form
    │
    ▼ (validates not empty)
Send POST /api/auth/login
    │
    ▼ (network request)
Backend authController.login()
    │
    ▼ (check request body)
Staff.findByEmail(email)
    │
    ▼ (query database)
Get user password hash from DB
    │
    ├─────────────┐
    │             │
 Found?      Not Found
    │             │
    ▼             ▼
comparePassword  Error: "Invalid c
    │            redentials"
    ├─────┐
    │     │
Match? No Match
    │     │
    ▼     ▼
Generate "Invalid
JWT  credentials"
    │
    ▼
Send Token + User Info
    │
    ▼
Frontend Stores Token
    │
    ▼
Redirect to Dashboard
    │
    ▼
✅ SUCCESS ✅
```

---

## Common Mistakes to Avoid

```
❌ MISTAKE                    ✅ CORRECT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
staffcollege.com         →   staff@college.com
password123456          →   password123
admin@gmail.com         →   admin@college.com
Running without backend →   npm run dev first
Starting frontend first →   Start backend first
Typos in email/password →   Copy from guide
Wrong port (8000)       →   Port 5000 for backend
Forgetting to seed      →   npm run db:seed
Not installing deps     →   npm install first
```

---

## Quick Reference - Ready to Login?

✅ **Backend Started?**
```
npm run dev shows "Server running on port 5000"
```

✅ **Frontend Started?**
```
npm start shows "Compiled successfully!"
```

✅ **Browser Ready?**
```
Can access http://localhost:3000
```

✅ **Test Users Created?**
```
npm run db:seed completed
```

✅ **Credentials Ready?**
```
Email: staff@college.com
Password: password123
```

If all ✅ → **Login should work!** 🎉
