# Quick Login Reference Card

## 🚀 Quick Start (Copy & Paste)

### Backend Terminal:
```bash
cd backend
npm install
npm run db:init
npm run db:seed
npm run dev
```

### Frontend Terminal:
```bash
cd frontend
npm install
npm start
```

### Browser:
```
http://localhost:3000
```

---

## 📝 Test Credentials

| Role  | Email              | Password    |
|-------|------------------|------------|
| Staff | staff@college.com  | password123 |
| HOD   | hod@college.com    | password123 |
| Admin | admin@college.com  | password123 |

---

## ✅ Login Steps

1. Ensure backend is running: `npm run dev` (in backend folder)
2. Ensure frontend is running: `npm start` (in frontend folder)
3. Open: `http://localhost:3000`
4. Enter email and password from table above
5. Click **Login**

---

## 🔧 If Login Fails

### Credentials not working?
```bash
cd backend
npm run db:seed
```

### Can't connect to backend?
- Check backend is running on port 5000
- Check frontend `.env` has: `REACT_APP_API_URL=http://localhost:5000`

### Database error?
```bash
cd backend
npm run db:init
npm run db:seed
```

---

## 📁 File Structure
```
backend/
  ├── .env (database config)
  ├── src/server.js (port 5000)
  └── database/
      ├── init.js (create tables)
      └── seedUsers.js (create test users)

frontend/
  ├── .env (API URL)
  ├── src/pages/Login.js
  └── src/App.js
```

---

## 🎯 After Login

**Dashboard Access:**
- HOD & Admin: `/dashboard`
- All: `/history` (location history)
- Public: `/track/:token` (tracking link)

---

## 💡 Common Issues

| Issue | Solution |
|-------|----------|
| "Invalid credentials" | Run `npm run db:seed` in backend |
| "Cannot reach backend" | Start backend with `npm run dev` |
| "Port 5000 in use" | Kill process or use different port |
| "Database error" | Run `npm run db:init` then `npm run db:seed` |

---

## 📞 Debug Commands

**See backend logs:**
```bash
cd backend
npm run dev
```

**See frontend logs:**
- Open browser: F12 → Console

**Reset everything:**
```bash
# Backend
cd backend
npm run db:init
npm run db:seed
npm run dev

# Frontend (new terminal)
cd frontend
npm start
```

---

**Status Check:**
- Backend running? Port 5000 listening?
- Frontend running? Port 3000 accessible?
- Database initialized? Check with `npm run db:init`
- Test users created? Check with `npm run db:seed`

Once all green ✅, login should work!
