# OD System - Complete API Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer {token}
```

---

## 1. AUTHENTICATION ENDPOINTS

### 1.1 Login
**Endpoint:** `POST /auth/login`  
**Access:** Public  
**Description:** Authenticate user and get JWT token

**Request:**
```json
{
  "email": "john@college.com",
  "password": "secure_password"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "staff": {
    "id": 1,
    "name": "John Doe",
    "email": "john@college.com",
    "role": "staff",
    "department": "IT"
  }
}
```

**Error (401):**
```json
{
  "error": "Invalid credentials"
}
```

---

### 1.2 Register Staff
**Endpoint:** `POST /auth/register`  
**Access:** Admin, HOD only  
**Description:** Register a new staff member

**Request:**
```json
{
  "name": "Jane Smith",
  "email": "jane@college.com",
  "password": "secure_password",
  "role": "staff",
  "department": "HR"
}
```

**Response (201):**
```json
{
  "message": "Staff registered successfully",
  "staff": {
    "id": 5,
    "name": "Jane Smith",
    "email": "jane@college.com",
    "role": "staff",
    "department": "HR",
    "created_at": "2026-02-17T10:30:00Z"
  }
}
```

**Errors:**
- `400` - Missing required fields
- `409` - Email already registered
- `403` - Access denied (insufficient permissions)

---

### 1.3 Get Profile
**Endpoint:** `GET /auth/profile`  
**Access:** Authenticated users  
**Description:** Get current user's profile

**Response (200):**
```json
{
  "message": "Profile retrieved successfully",
  "staff": {
    "id": 1,
    "name": "John Doe",
    "email": "john@college.com",
    "role": "staff",
    "department": "IT",
    "created_at": "2026-02-17T10:30:00Z"
  }
}
```

---

### 1.4 Update Profile
**Endpoint:** `PUT /auth/profile`  
**Access:** Authenticated users  
**Description:** Update user's profile

**Request:**
```json
{
  "name": "John Smith",
  "department": "Finance"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "staff": {
    "id": 1,
    "name": "John Smith",
    "email": "john@college.com",
    "role": "staff",
    "department": "Finance"
  }
}
```

---

## 2. DUTY MANAGEMENT ENDPOINTS

### 2.1 Create Duty

> After duty creation the response includes a `trackingLink` that staff can use. A separate **view link** (`?view=true`) is generated and emailed to allow HOD/admin to see live GPS & history.
**Endpoint:** `POST /duties`  
**Access:** Admin, HOD only  
**Description:** Create a new duty request for a staff member

**Request:**
```json
{
  "staffId": 2,
  "dutyDate": "2026-02-25",
  "startTime": "09:00",
  "endTime": "17:00",
  "latitude": 28.5355,
  "longitude": 77.3910,
  "radius": 500
}
```

**Response (201):**
```json
{
  "message": "Duty request created successfully",
  "duty": {
    "id": 15,
    "staff_id": 2,
    "duty_date": "2026-02-25",
    "start_time": "09:00",
    "end_time": "17:00",
    "latitude": "28.5355000",
    "longitude": "77.3910000",
    "radius": 500,
    "token": "550e8400-e29b-41d4-a716-446655440000",
    "status": "PENDING",
    "created_at": "2026-02-17T10:30:00Z"
  },
  "trackingLink": "http://localhost:3000/track/550e8400-e29b-41d4-a716-446655440000"
}
```

**Errors:**
- `400` - Missing fields or invalid data
- `403` - Access denied

---

### 2.2 Get All Duties
**Endpoint:** `GET /duties/all`  
**Access:** Admin, HOD only  
**Description:** Get all duty requests with pagination

**Query Parameters:**
```
limit=50  (default: 50, max: 100)
offset=0  (default: 0)
```

**Response (200):**
```json
{
  "message": "Duties retrieved successfully",
  "count": 5,
  "duties": [
    {
      "id": 15,
      "staff_id": 2,
      "duty_date": "2026-02-25",
      "start_time": "09:00",
      "end_time": "17:00",
      "latitude": "28.5355000",
      "longitude": "77.3910000",
      "radius": 500,
      "token": "550e8400-e29b-41d4-a716-446655440000",
      "status": "PENDING",
      "name": "Jane Smith",
      "email": "jane@college.com",
      "department": "IT"
    }
  ]
}
```

---

### 2.3 Get Duty by Token
**Endpoint:** `GET /duties/track/:token`  
**Access:** Public (tracking page access)  
**Description:** Get duty request using unique token

**Parameters:**
```
token: 550e8400-e29b-41d4-a716-446655440000
```

**Response (200):**
```json
{
  "message": "Duty retrieved successfully",
  "duty": {
    "id": 15,
    "staff_id": 2,
    "duty_date": "2026-02-25",
    "start_time": "09:00",
    "end_time": "17:00",
    "latitude": "28.5355000",
    "longitude": "77.3910000",
    "radius": 500,
    "token": "550e8400-e29b-41d4-a716-446655440000",
    "status": "PENDING",
    "name": "Jane Smith",
    "email": "jane@college.com"
  }
}
```

**Error (404):**
```json
{
  "error": "Duty not found"
}
```

---

### 2.4 Get Staff Duties
**Endpoint:** `GET /duties/staff` (own duties) or `GET /duties/staff/:staffId` (admin/hod)  
**Access:** Authenticated users  
**Description:** Get duties for a specific staff member

**Response (200):**
```json
{
  "message": "Staff duties retrieved successfully",
  "count": 3,
  "duties": [
    {
      "id": 15,
      "staff_id": 2,
      "duty_date": "2026-02-25",
      "start_time": "09:00",
      "end_time": "17:00",
      "status": "ACTIVE",
      "created_at": "2026-02-17T10:30:00Z"
    }
  ]
}
```

---

### 2.5 Get Duty Details
**Endpoint:** `GET /duties/:dutyId`  
**Access:** Authenticated users  
**Description:** Get specific duty request details

**Parameters:**
```
dutyId: 15
```

**Response (200):**
```json
{
  "message": "Duty retrieved successfully",
  "duty": {
    "id": 15,
    "staff_id": 2,
    "duty_date": "2026-02-25",
    "start_time": "09:00",
    "end_time": "17:00",
    "latitude": "28.5355000",
    "longitude": "77.3910000",
    "radius": 500,
    "token": "550e8400-e29b-41d4-a716-446655440000",
    "status": "ACTIVE",
    "name": "Jane Smith",
    "email": "jane@college.com",
    "department": "IT"
  }
}
```

---

### 2.6 Start Duty Tracking
**Endpoint:** `POST /duties/:dutyId/start`  
**Access:** Authenticated users  
**Description:** Set duty status to ACTIVE (start tracking)

**Parameters:**
```
dutyId: 15
```

**Response (200):**
```json
{
  "message": "Duty tracking started",
  "duty": {
    "id": 15,
    "status": "ACTIVE",
    "updated_at": "2026-02-25T09:00:00Z"
  }
}
```

---

### 2.7 Complete Duty
**Endpoint:** `POST /duties/:dutyId/complete`  
**Access:** Admin, HOD only  
**Description:** Mark duty as completed

**Parameters:**
```
dutyId: 15
```

**Response (200):**
```json
{
  "message": "Duty marked as completed",
  "duty": {
    "id": 15,
    "status": "COMPLETED",
    "updated_at": "2026-02-25T17:00:00Z"
  }
}
```

---

### 2.8 Update Duty
**Endpoint:** `PUT /duties/:dutyId`  
**Access:** Admin, HOD only  
**Description:** Update pending duty request (only if PENDING status)

**Request:**
```json
{
  "dutyDate": "2026-02-26",
  "startTime": "10:00",
  "endTime": "18:00",
  "latitude": 28.5400,
  "longitude": 77.3950,
  "radius": 600
}
```

**Response (200):**
```json
{
  "message": "Duty updated successfully",
  "duty": {
    "id": 15,
    "duty_date": "2026-02-26",
    "start_time": "10:00",
    "end_time": "18:00",
    "latitude": "28.5400000",
    "longitude": "77.3950000",
    "radius": 600
  }
}
```

**Error (400):**
```json
{
  "error": "Can only update pending duties"
}
```

---

### 2.9 Delete Duty
**Endpoint:** `DELETE /duties/:dutyId`  
**Access:** Admin, HOD only  
**Description:** Delete a duty request

**Parameters:**
```
dutyId: 15
```

**Response (200):**
```json
{
  "message": "Duty deleted successfully"
}
```

---

### 2.10 Get Duty Statistics
**Endpoint:** `GET /duties/statistics`  
**Access:** Admin, HOD only  
**Description:** Get duty statistics for date range

**Query Parameters:**
```
startDate=2026-02-01
endDate=2026-02-28
```

**Response (200):**
```json
{
  "message": "Statistics retrieved successfully",
  "statistics": {
    "total_duties": 24,
    "verified": 20,
    "violations": 3,
    "pending": 1
  }
}
```

---

## 3. LOCATION TRACKING ENDPOINTS
> Location logs can only be recorded when a duty is active and the current time falls between the duty's start and end times (default business hours 09:00–18:00).
### 3.1 Log Location
**Endpoint:** `POST /locations/log/:dutyId`  
**Access:** Public (during tracking)  
**Description:** Log staff's GPS location during duty

**Parameters:**
```
dutyId: 15
```

**Request:**
```json
{
  "latitude": 28.5355,
  "longitude": 77.3910,
  "accuracy": 10.5
}
```

**Response (201):**
```json
{
  "message": "Location logged successfully",
  "locationLog": {
    "id": 145,
    "duty_id": 15,
    "latitude": "28.5355000",
    "longitude": "77.3910000",
    "accuracy": "10.50",
    "status": "VALID",
    "distance_from_location": "245.67",
    "logged_at": "2026-02-25T14:30:00Z"
  },
  "withinGeofence": true,
  "distanceInMeters": "245.67"
}
```

---

### 3.2 Get Location Logs
**Endpoint:** `GET /locations/:dutyId`  
**Access:** Authenticated users  
**Description:** Get all location logs for a duty with pagination

**Parameters:**
```
dutyId: 15
limit=100 (optional)
offset=0 (optional)
```

**Response (200):**
```json
{
  "message": "Location logs retrieved successfully",
  "count": 48,
  "logs": [
    {
      "id": 145,
      "duty_id": 15,
      "latitude": "28.5355000",
      "longitude": "77.3910000",
      "accuracy": "10.50",
      "status": "VALID",
      "distance_from_location": "245.67",
      "logged_at": "2026-02-25T14:30:00Z"
    }
  ]
}
```

---

### 3.3 Get Latest Location
**Endpoint:** `GET /locations/:dutyId/latest`  
**Access:** Authenticated users  
**Description:** Get most recent location for a duty

**Parameters:**
```
dutyId: 15
```

**Response (200):**
```json
{
  "message": "Latest location retrieved successfully",
  "location": {
    "id": 192,
    "duty_id": 15,
    "latitude": "28.5350000",
    "longitude": "77.3915000",
    "accuracy": "8.75",
    "status": "VALID",
    "distance_from_location": "320.45",
    "logged_at": "2026-02-25T16:45:00Z"
  }
}
```

---

### 3.4 Get Location Statistics
**Endpoint:** `GET /locations/:dutyId/statistics`  
**Access:** Authenticated users  
**Description:** Get location tracking statistics

**Parameters:**
```
dutyId: 15
```

**Response (200):**
```json
{
  "message": "Location statistics retrieved successfully",
  "statistics": {
    "total_logs": 48,
    "valid_locations": 46,
    "violation_locations": 2,
    "first_log": "2026-02-25T09:00:00Z",
    "last_log": "2026-02-25T17:00:00Z",
    "violationPercentage": 4.17
  }
}
```

---

### 3.5 Get Locations by Time Range
**Endpoint:** `GET /locations/:dutyId/range`  
**Access:** Authenticated users  
**Description:** Get locations captured within specific time range

**Parameters:**
```
dutyId: 15
startTime=2026-02-25T12:00:00Z
endTime=2026-02-25T14:00:00Z
```

**Response (200):**
```json
{
  "message": "Location logs retrieved successfully",
  "count": 24,
  "logs": [...]
}
```

---

### 3.6 Get Live Location Data
**Endpoint:** `GET /locations/live/all`  
**Access:** Admin, HOD only  
**Description:** Get real-time location data for all active duties

**Query Parameters:**
```
date=2026-02-25 (optional, defaults to today)
```

**Response (200):**
```json
{
  "message": "Live location data retrieved successfully",
  "date": "2026-02-25",
  "count": 3,
  "liveData": [
    {
      "dutyId": 15,
      "staffName": "Jane Smith",
      "staffEmail": "jane@college.com",
      "department": "IT",
      "status": "ACTIVE",
      "dutyDate": "2026-02-25",
      "startTime": "09:00",
      "endTime": "17:00",
      "geofenceLocation": {
        "latitude": "28.5355000",
        "longitude": "77.3910000",
        "radius": 500
      },
      "currentLocation": {
        "latitude": "28.5350000",
        "longitude": "77.3915000",
        "accuracy": "8.75",
        "timestamp": "2026-02-25T16:45:00Z"
      },
      "statistics": {
        "total_logs": 48,
        "valid_locations": 46,
        "violation_locations": 2,
        "first_log": "2026-02-25T09:00:00Z",
        "last_log": "2026-02-25T16:45:00Z",
        "violationPercentage": 4.17
      }
    }
  ]
}
```

---

## 4. DASHBOARD/ADMIN ENDPOINTS

### 4.1 Get All Staff
**Endpoint:** `GET /dashboard/staff`  
**Access:** Admin only  
**Description:** Get list of all staff members

**Response (200):**
```json
{
  "message": "Staff list retrieved successfully",
  "count": 15,
  "staff": [
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@college.com",
      "role": "staff",
      "department": "IT",
      "created_at": "2026-02-17T10:30:00Z"
    }
  ]
}
```

---

### 4.2 Get Staff by Role
**Endpoint:** `GET /dashboard/staff/role/:role`  
**Access:** Admin only  
**Description:** Get staff filtered by role

**Parameters:**
```
role: staff | hod | admin
```

**Response (200):**
```json
{
  "message": "Staff retrieved successfully",
  "count": 8,
  "staff": [...]
}
```

---

### 4.3 Get Staff Details
**Endpoint:** `GET /dashboard/staff/:staffId`  
**Access:** Admin, HOD (for own staff), or self  
**Description:** Get specific staff member details

**Parameters:**
```
staffId: 2
```

**Response (200):**  
Same as individual staff object

**Error (403):**
```json
{
  "error": "Access denied"
}
```

---

### 4.4 Delete Staff
**Endpoint:** `DELETE /dashboard/staff/:staffId`  
**Access:** Admin only  
**Description:** Delete a staff member

**Parameters:**
```
staffId: 2
```

**Response (200):**
```json
{
  "message": "Staff deleted successfully"
}
```

---

## Status Codes

```
200 OK              - Request successful
201 Created         - Resource created
400 Bad Request     - Invalid input
401 Unauthorized    - Authentication required
403 Forbidden       - Access denied
404 Not Found       - Resource not found
409 Conflict        - Resource already exists
500 Server Error    - Internal error
```

---

## Error Response Format

All errors follow this format:
```json
{
  "error": "Error message describing what went wrong"
}
```

---

## Rate Limiting
Not implemented by default but can be added using `express-rate-limit`.

---

## CORS
Configured to allow requests from `http://localhost:3000` (configurable via `.env`)

---

## Security Notes

1. **Always use HTTPS** in production
2. **JWT tokens expire** after 7 days
3. **Passwords are hashed** using bcrypt
4. **All queries are parameterized** to prevent SQL injection
5. **Environment variables** protect sensitive data
6. **CORS** restricts cross-origin requests
