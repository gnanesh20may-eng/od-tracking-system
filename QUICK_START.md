# Quick Start Guide - OD Verification System

Get the system up and running in 10 minutes!

## 📋 Prerequisites

- **Node.js** v14+ ([Download](https://nodejs.org))
- **PostgreSQL** 12+ ([Download](https://www.postgresql.org/download))
- **Git** ([Download](https://git-scm.com))
- **npm** (comes with Node.js)

## 🚀 Quick Setup

### Step 1: Create PostgreSQL Database

**Windows (using pgAdmin or command line):**
```bash
psql -U postgres
CREATE DATABASE od_verification_system;
\q
```

**macOS/Linux:**
```bash
createdb od_verification_system
```

### Step 2: Backend Setup (Terminal 1)

```bash
# Navigate to backend
cd backend

# Copy environment file
cp .env.example .env

# Edit .env (set your database credentials)
# For Windows: notepad .env
# For macOS/Linux: nano .env

# Install dependencies
npm install

# Initialize database
npm run db:init

# Start server
npm run dev
```

✅ Backend ready at: `http://localhost:5000`

### Step 3: Frontend Setup (Terminal 2)

```bash
# Navigate to frontend
cd frontend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start frontend
npm start
```

✅ Frontend ready at: `http://localhost:3000`

---

## 🔑 Default Test Credentials

After running `npm run db:init`, use these to login:

| Role | Email | Password |
|------|-------|----------|
| Staff | gokul@gmail.com | gokul123 |
| HOD | hod@college.com | password123 |
| Admin | admin@college.com | password123 |

**Note:** Passwords in the database are hashed. For testing, reset them:
```bash
# In psql
UPDATE staff SET password = '$2b$10$...' WHERE email = 'john@college.com';
```

Or create new test accounts via API.

---

## 🧪 Testing the System

### 1. Login Test
1. Open `http://localhost:3000/login`
2. Enter email: `gokul@gmail.com`
3. Enter password: `gokul123`
4. Should redirect to dashboard

### 2. Create Duty Test (As HOD)
1. Login with HOD account
2. Click "Create New Duty"
3. Fill in:
   - Staff ID: `2`
   - Duty Date: Tomorrow's date
   - Start Time: `09:00`
   - End Time: `17:00`
   - Latitude: `28.5355`
   - Longitude: `77.3910`
   - Radius: `500`
4. Submit
5. You will receive a tracking link; the same link (and a view-only variant with `?view=true`) is emailed to the staff and HOD.
   - **Staff link** – used on the student's phone to start geolocation tracking after consent
   - **View link** – allows HOD/Admin to open the page and view live GPS/ history for that duty

### 3. Location Tracking Test
1. Open the tracking link in new window
2. Login with staff credentials
3. Grant location permission
4. Check "I consent to location tracking"
5. Location updates should appear every 30 seconds

### 4. API Test (Using cURL)

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@college.com","password":"password"}'
```

**Create Duty:**
```bash
curl -X POST http://localhost:5000/api/duties \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "staffId": 2,
    "dutyDate": "2026-02-25",
    "startTime": "09:00",
    "endTime": "17:00",
    "latitude": 28.5355,
    "longitude": 77.3910,
    "radius": 500
  }'
```

---

## 📁 Project Structure Summary

```
od-system/
├── backend/
│   ├── src/server.js          ← Main backend entry
│   ├── .env.example           ← Config template
│   └── package.json          
├── frontend/
│   ├── src/App.js             ← Main frontend entry
│   ├── .env.example           ← Config template
│   └── package.json
├── README.md                  ← Full documentation
├── API_DOCUMENTATION.md       ← API endpoints
└── DEPLOYMENT.md              ← Production guide
```

---

## 🔧 Common Issues & Solutions

### Issue: "Cannot find module" Error

**Solution:**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Database Connection Error

**Solution:**
1. Verify PostgreSQL is running
2. Check `.env` credentials
3. Ensure database exists:
   ```bash
   psql -U postgres -l  # List databases
   ```

### Issue: Port 5000 Already in Use

**Solution - Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Solution - macOS/Linux:**
```bash
lsof -i :5000
kill -9 <PID>
```

### Issue: Location Permission Denied

**Solution:**
- Click browser permission request
- Or check Settings → Privacy → Location

### Issue: API Calls Failing (CORS Error)

**Solution:**
- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env`
- Clear browser cache: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)

---

## 📊 System Architecture

```
User Browser
    ↓
React Frontend (Port 3000)
    ↓
Express API (Port 5000)
    ↓
PostgreSQL Database
```

**Flow for Duty Tracking:**
1. HOD creates duty → API stores in DB
2. System generates unique token
3. Staff gets tracking link: `/track/{token}`
4. Staff logs in and grants location access
5. System captures location every 30 seconds
6. Backend validates geofence using Haversine formula
7. Status updated: VALID or VIOLATION
8. Dashboard shows real-time updates

---

## 🎯 Key Features to Test

- ✅ Authentication (login/register)
- ✅ Role-based access (staff/HOD/admin)
- ✅ Duty creation and management
- ✅ Location tracking with geofence
- ✅ Real-time location updates
- ✅ Violation detection
- ✅ Location history
- ✅ Dashboard statistics

---

## 📡 API Endpoints Quick Reference

**Authentication**
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register

**Duties**
- `POST /api/duties` - Create duty
- `GET /api/duties/all` - List all
- `GET /api/duties/track/:token` - Get by token
- `POST /api/duties/:id/start` - Start tracking

**Locations**
- `POST /api/locations/log/:dutyId` - Log location
- `GET /api/locations/:dutyId` - Get logs
- `GET /api/locations/:dutyId/latest` - Latest location
- `GET /api/locations/:dutyId/statistics` - Stats

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete reference.

---

## 🛠️ Environment Configuration

### Backend `.env` Example
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=od_verification_system
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=super_secret_key_min32chars_required
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
API_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000
```

### Frontend `.env` Example
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
REACT_APP_LOCATION_TRACKING_INTERVAL=30000
```

---

## 📚 Learning Resources

- **Backend Structure:** See [backend/README.md](./backend/README.md)
- **Frontend Structure:** See [frontend/README.md](./frontend/README.md)
- **Complete Documentation:** See [README.md](./README.md)
- **API Reference:** See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Deployment:** See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🎓 Next Steps

1. **Understand the Code**
   - Review `backend/src/server.js`
   - Review `frontend/src/App.js`
   - Check database schema in `backend/database/schema.sql`

2. **Extend Features**
   - Add email notifications
   - Implement real-time updates with WebSockets
   - Add export to PDF/CSV
   - Implement multi-language support

3. **Deploy to Production**
   - Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
   - Setup SSL/HTTPS
   - Configure domain
   - Setup monitoring

---

## 🆘 Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| Module not found | Run `npm install` again |
| DB connection error | Check `.env` and PostgreSQL |
| Port in use | Kill existing process |
| CORS error | Check API URL in frontend `.env` |
| Location not working | Grant browser permission |
| Map not showing | Clear cache, verify Leaflet installed |
| Authentication failed | Check JWT_SECRET in `.env` |

---

## 💡 Pro Tips

1. **Use Postman** to test APIs before frontend
2. **Check browser DevTools** (F12) for errors
3. **Use `npm run dev`** for hot reload in backend
4. **Clear cache** if changes don't appear
5. **Check terminal logs** for error details
6. **Use localhost:3000** for all development (not IP address)

---

## 📞 Quick Reference

```bash
# Backend commands
cd backend
npm install        # Install dependencies
npm run db:init   # Initialize database
npm run dev       # Start with auto-reload
npm start         # Start production

# Frontend commands
cd frontend
npm install       # Install dependencies
npm start         # Start development server
npm run build     # Build for production
npm test          # Run tests

# Database commands
createdb od_verification_system    # Create DB
psql -U postgres od_verification_system  # Connect
\q               # Exit psql
```

---

## ✨ System Ready?

When you see these messages, everything is running:

**Backend:**
```
==================================================
OD Verification System - Backend Server
Server running on port 5000
==================================================
```

**Frontend:**
```
webpack compiled with warnings
On Your Network: http://192.168.x.x:3000
Compiled Successfully!
You can now view od-verification-frontend in the browser.
```

---

**Happy Testing! 🎉**

For detailed documentation, see the main [README.md](./README.md)
