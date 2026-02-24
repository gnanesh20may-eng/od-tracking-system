# Frontend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
REACT_APP_LOCATION_TRACKING_INTERVAL=30000
```

### 3. Start Development Server
```bash
npm start
```

Frontend runs on `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── pages/           - Page components
│   │   ├── Login.js
│   │   ├── Dashboard.js
│   │   └── TrackDuty.js
│   ├── components/      - Reusable components
│   │   ├── ProtectedRoute.js
│   │   ├── MapComponent.js
│   │   ├── LocationHistory.js
│   │   └── DutyDetails.js
│   ├── context/         - React Context
│   │   ├── AuthContext.js
│   │   └── LocationContext.js
│   ├── services/        - API calls
│   │   └── api.js
│   ├── styles/          - CSS files
│   ├── App.js
│   ├── index.js
│   └── index.css
├── public/
│   └── index.html
├── package.json
├── .env.example
└── README.md
```

## Component Architecture

### Pages
- **Login** - Authentication page with email/password
- **Dashboard** - HOD/Admin dashboard for duty management
- **TrackDuty** - Staff location tracking page

### Components
- **ProtectedRoute** - Route guard for authenticated users
- **MapComponent** - Leaflet map display with markers
- **LocationHistory** - List of tracked locations
- **DutyDetails** - Duty information display

### Context
- **AuthContext** - User authentication state and methods
- **LocationContext** - Location tracking state management

### Services
- **api.js** - Centralized API calls using Axios
  - Automatic JWT token injection
  - Error handling with redirect on 401
  - API methods for all endpoints

## Features

### Authentication Flow
1. User enters email and password
2. System validates credentials with backend
3. JWT token received and stored in localStorage
4. User redirected to dashboard or tracking page based on role

### Duty Management
- HOD/Admin can create duties with:
  - Staff member assignment
  - Duty date and time
  - Location coordinates
  - Geofence radius
- Unique tracking link generated
- Staff notified with link

### Location Tracking
- Staff opens tracking link
- Authenticates with credentials
- Grants location permission
- System captures location every 30 seconds
- Real-time geofence validation
- Auto-stops after duty end time

## Styling

All components use CSS modules and custom CSS:
- **Global Styles** - `index.css` (typography, colors, utilities)
- **Component Styles** - Dedicated CSS files in `styles/` folder
- **Responsive Design** - Mobile-first approach
- **Color Scheme** - Primary (#2E5BF8), Success (#00C851), Danger (#FF4444)

## API Integration

### Authentication
```javascript
import { useAuth } from '../context/AuthContext';

const { login, logout, user, isAuthenticated } = useAuth();
```

### API Calls
```javascript
import { dutyAPI, locationAPI } from '../services/api';

// Create duty
// When a duty is created the backend returns a link that should be sent to the staff member.
// Email notifications are sent automatically and include two URLs:
// 1. staff tracking link: `/track/:token` (mobile users click and allow location to start tracking)
// 2. view link: `/track/:token?view=true` (HOD/Admin clicks to open the same page and see live GPS & history)
const response = await dutyAPI.createDuty(...);

// Log location
const response = await locationAPI.logLocation(dutyId, lat, lon, accuracy);
```

## Routing

```javascript
/login                  - Public login page
/track/:token          - Public tracking page (requires token)
/dashboard             - Protected admin/HOD dashboard
/                      - Redirect to login
```

## Environment Variables

```
REACT_APP_API_URL                      - Backend API base URL
REACT_APP_MAP_TILE_URL                - OpenStreetMap tile URL
REACT_APP_LOCATION_TRACKING_INTERVAL   - Location capture interval (ms)
```

## Key Hooks

### useAuth
```javascript
const { user, token, login, logout, hasRole, isAuthenticated } = useAuth();
```

### useLocation
```javascript
const { startTracking, stopTracking, currentLocation, isTracking } = useLocation();
```

## Map Integration

Uses Leaflet.js with OpenStreetMap:
- Display duty location with custom marker
- Show geofence as circle overlay
- Display current staff location
- Click markers for info popups

## Location Tracking

Browser Geolocation API with:
- High accuracy mode enabled
- 10-second timeout
- 30-second capture interval
- Auto-stop after duty end time
- Explicit user consent required

## Error Handling

- Network errors displayed to user
- Invalid tokens redirect to login
- Validation messages for form inputs
- 404 errors for missing resources

## Development Tips

1. **Hot Reload** - Changes automatically refresh
2. **Dev Tools** - Use React DevTools extension
3. **Network Tab** - Monitor API calls
4. **Console** - Check for warnings/errors
5. **Responsive Testing** - Use browser dev tools

## Building for Production

```bash
npm run build
```

Creates optimized production build in `build/` folder.

## Troubleshooting

**API Connection Error**
- Check backend is running on port 5000
- Verify REACT_APP_API_URL in .env
- Clear browser cache

**Location Permission Denied**
- Grant browser geolocation permission
- Check device location services are enabled
- HTTPS required in production

**Map Not Rendering**
- Verify leaflet is installed
- Check map container has height
- Verify network access to OpenStreetMap tiles

**Authentication Issues**
- Clear localStorage: `localStorage.clear()`
- Verify backend token generation
- Check token format in API calls

## Performance Optimization

- Code splitting with React.lazy
- Memoization of expensive calculations
- Conditional rendering to reduce DOM
- Debouncing location updates
- Image optimization

## Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast compliance
- Mobile-friendly design

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Testing

Can be extended with Jest and React Testing Library:
```bash
npm test
```

## Deployment

1. Build: `npm run build`
2. Deploy `build/` to static hosting
3. Configure API endpoint for production
4. Setup HTTPS/SSL certificate
5. Configure CORS on backend for production URL
