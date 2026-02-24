# Location History Feature Documentation

## Overview
The Location History feature allows users to view and analyze previous day/duty location tracking data. This enables HOD, Admin, and Staff members to review location records, verify duty compliance, and identify patterns over time.

## Key Features

### 1. **Date Navigation**
- Easily navigate between previous days
- Jump to specific dates using date picker
- Quick navigation buttons (Previous Day, Next Day, Today)
- Cannot navigate beyond today's date

### 2. **Duty Selection**
- View all duties for a selected date
- Filter by specific duty to see its location history
- Displays duty start/end times and current status
- Shows all tracked duties with time windows

### 3. **Location Statistics**
- **Total Logs**: Total number of location points captured
- **Valid Locations**: Points within the geofence radius
- **Violations**: Points outside the geofence radius
- **Violation Percentage**: Calculated ratio of violations to total logs

### 4. **Location Details**
Each location record displays:
- **Timestamp**: Exact time the location was captured (HH:MM:SS)
- **Status**: VALID (inside geofence) or VIOLATION (outside geofence)
- **Latitude/Longitude**: GPS coordinates
- **Accuracy**: GPS accuracy in meters
- **Distance**: Distance from duty location in meters

### 5. **Role-Based Access**
- **Admin**: View all staff location history and all duties
- **HOD**: View staff under their department
- **Staff**: View their own location history only

## Components

### HistoricalLocationViewer Component
Located in `frontend/src/components/HistoricalLocationViewer.js`

```javascript
<HistoricalLocationViewer staffId={staffId} />
```

**Props:**
- `staffId`: ID of staff member to view history for
- `dutyId` (optional): Pre-selected duty ID

**Features:**
- Date range selection
- Duty filtering
- Statistics display
- Location list with scrolling
- Error handling and loading states

### ViewHistoricalDuties Page
Located in `frontend/src/pages/ViewHistoricalDuties.js`

**Features:**
- Staff member selection (for admin/hod)
- Historical location viewer integration
- Recent duties summary
- Responsive layout

## Routes

### Navigation Links
- **Dashboard**: `/dashboard` (Admin/HOD only)
- **Location History**: `/history` (All authenticated users)

### API Endpoints Used
1. **Get Location Logs**
   ```
   GET /api/locations/:dutyId?limit=1000&offset=0
   ```
   Get location logs for a specific duty

2. **Get Location Statistics**
   ```
   GET /api/locations/:dutyId/statistics
   ```
   Get statistics for a duty location tracking

3. **Get Live Location Data**
   ```
   GET /api/dashboard/live-location-data?date=YYYY-MM-DD
   ```
   Get all location data for a specific date

## Usage Workflow

### For Admin/HOD Users:
1. Click "Location History" button on Dashboard or from Navigation
2. Select a staff member (optional - shows all by default)
3. Choose a date using the date picker or navigation buttons
4. Select a specific duty from the dropdown
5. View location history and statistics
6. Analyze violation patterns and duty compliance

### For Staff Users:
1. Click "My History" in Navigation
2. Automatically shows their own data
3. Select a date to view
4. Review their location tracking records
5. Track their compliance per duty

## Styling

### CSS Files:
- `LocationHistory.css`: Main styles for the historical viewer
- `Navigation.css`: Navigation header styles

### Key CSS Classes:
- `.historical-viewer`: Main container
- `.date-navigation`: Date picker controls
- `.duty-selection`: Duty dropdown section
- `.location-stats`: Statistics grid
- `.location-history`: History list container
- `.history-item`: Individual location record
- `.status-badge`: Status indicator badge
- `.historical-duties-page`: Full page container
- `.past-duties-summary`: Recent duties display

## Features in Detail

### Date Navigation
```javascript
- Previous Day: Decrements date by 1 day
- Next Day: Increments date (max = today)
- Today: Jumps to current date
- Date Picker: Direct date selection
```

### Statistics Calculation
The component displays:
- **Total Logs**: Count of all location entries
- **Valid Locations**: Entries with status = 'VALID'
- **Violations**: Entries with status = 'VIOLATION'
- **Violation %**: (violations / total) * 100

### Geofence Validation
Each location is compared against the duty's geofence:
- **VALID**: Distance from duty location ≤ geofence radius
- **VIOLATION**: Distance from duty location > geofence radius

## Error Handling

The component includes error handling for:
- Failed duty fetching
- Failed location history retrieval
- Failed statistics retrieval
- Network errors
- No data available for selected date

## Performance Considerations

- **Pagination**: Limits location logs to most recent 1000 entries
- **Lazy Loading**: Data fetched only when date/duty changes
- **Scrollable Container**: Max height 500px for location lists
- **Efficient Queries**: Uses indexed database queries on duty_date and logged_at

## Future Enhancements

1. **Export to CSV/PDF**: Download location history reports
2. **Map Visualization**: Show location points on interactive map
3. **Timeline View**: Visual timeline of movements
4. **Heat Maps**: Show frequency of violations by location
5. **Filtering**: Filter by status (valid/violation)
6. **Time Range**: Select custom date ranges (not just single date)
7. **Notifications**: Alert on violations in real-time
8. **Comparison**: Compare multiple duties or periods
9. **Analytics**: Generate compliance reports
10. **Geofence Editor**: Adjust geofence radius in history view

## Troubleshooting

### No duties found for selected date
- The staff member may not have had any duties scheduled for that date
- Check if the duty was created properly in the system
- Try a different date range

### Missing location data
- The staff member may not have started location tracking
- Location tracking may have ended before duty completion
- Browser geolocation permissions may not have been granted

### Violation count seems high
- Check the geofence radius - it may be too small
- Verify GPS accuracy is acceptable for the environment
- Consider network connectivity issues affecting location precision

### Performance issues with large datasets
- The system loads up to 1000 location logs
- Consider viewing smaller date ranges
- Database indexes should be in place for optimal query performance

## Related Features

- **Live Duty Tracking**: Track location in real-time during duty
- **Dashboard**: Manage and monitor duties
- **Geofence Validation**: Automatic location validation
- **Location Logging**: Continuous location capture every 30 seconds
