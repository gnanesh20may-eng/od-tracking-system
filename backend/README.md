# Backend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database
Create `.env` file:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=od_verification_system
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
API_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000
```

### 3. Create Database
```sql
CREATE DATABASE od_verification_system;
```

### 4. Initialize Schema
```bash
npm run db:init
```

### 5. Start DEV Server
```bash
npm run dev
```

Server runs on `http://localhost:5000`

## API Endpoints Summary

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register (Admin/HOD only)
- `GET /api/auth/profile` - Get profile
- `PUT /api/auth/profile` - Update profile

### Duty Management
- `POST /api/duties` - Create duty (emails notifications are sent; configure SMTP via .env)
- `GET /api/duties/all` - Get all duties
- `GET /api/duties/track/:token` - Get duty by token
- `GET /api/duties/:dutyId` - Get duty by ID
- `POST /api/duties/:dutyId/start` - Start tracking
- `POST /api/duties/:dutyId/complete` - Complete duty
- `DELETE /api/duties/:dutyId` - Delete duty

### Location Tracking
- `POST /api/locations/log/:dutyId` - Log location
- `GET /api/locations/:dutyId` - Get location logs
- `GET /api/locations/:dutyId/latest` - Get latest location
- `GET /api/locations/:dutyId/statistics` - Get statistics
- `GET /api/locations/live/all` - Get live data

## Project Structure

```
backend/
├── src/
│   ├── controllers/     - Business logic
│   ├── models/         - Database queries
│   ├── routes/         - API endpoints
│   ├── middleware/     - Auth & error handling
│   ├── utils/          - Helper functions
│   ├── db.js          - Database connection
│   └── server.js      - Main server
├── database/
│   ├── init.js        - Database initialization
│   └── schema.sql     - SQL schema
├── package.json
├── .env.example
└── README.md
```

## Middleware

### Authentication Middleware
Validates JWT tokens and attaches user info to request.

```javascript
app.use('/api/protected-routes', authenticate);
```

### Authorization Middleware
Checks if user has required role.

```javascript
router.post('/create', authorize(['admin', 'hod']), createDuty);
```

## Database Operations

All database operations use parameterized queries to prevent SQL injection.

### Example Query
```javascript
const result = await pool.query(
  'SELECT * FROM staff WHERE id = $1',
  [userId]
);
```

## Error Handling

Comprehensive error handling with descriptive messages and proper HTTP status codes.

```javascript
- 400: Bad Request (validation error)
- 401: Unauthorized (authentication failed)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Server Error
```

## Security Features

1. **JWT Authentication** - Secure token-based auth
2. **Password Hashing** - bcrypt with 10 rounds
3. **CORS** - Restricted to frontend origin
4. **Helmet.js** - HTTP security headers
5. **Environment Variables** - Sensitive data protection
6. **Parameterized Queries** - SQL injection prevention

## Geolocation Utilities

### Haversine Distance Calculation
```javascript
const distance = calculateHaversineDistance(lat1, lon1, lat2, lon2);
// Returns distance in meters
```

### Geofence Validation
```javascript
const isValid = isWithinGeofence(staffLat, staffLon, dutyLat, dutyLon, radius);
// Returns true if staff is within geofence
```

## Testing/Sample Data

Database initialization includes sample data:
- 3 users (1 staff, 1 HOD, 1 admin)
- Test credentials available in database

## Development Tips

1. Use `npm run dev` for hot reloading with nodemon
2. Check console for API request logs
3. Use Postman or curl for testing endpoints
4. Enable detailed logging in development mode

## Production Deployment

1. Build frontend: `npm run build`
2. Set NODE_ENV=production
3. Use strong JWT_SECRET
4. Enable HTTPS
5. Set up proper database backups
6. Configure rate limiting
7. Add monitoring and logging

## Troubleshooting

**Database Connection Error**
- Verify PostgreSQL is running
- Check .env credentials
- Ensure database exists

**Port Already in Use**
- Change PORT in .env
- Or kill process: `lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9`

**JWT Token Error**
- Verify JWT_SECRET is set
- Check token hasn't expired
- Ensure correct Bearer prefix in Authorization header
