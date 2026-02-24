# How to Use Location History Feature

## Quick Start Guide

### For Admin/HOD Users

#### Step 1: Access Location History
1. Log in with admin or HOD credentials
2. You'll see the navigation header at the top
3. Click "Location History" button in the navigation bar or on the Dashboard

#### Step 2: Select a Date
1. Use the date picker to select any previous date
2. Or use navigation buttons:
   - **← Previous Day**: Go back one day
   - **Next Day →**: Go forward one day (up to today)
   - **Today**: Jump to current date

#### Step 3: Choose a Duty
1. A dropdown list shows all duties for the selected date
2. Each duty shows: Staff Name, Time Window, and Current Status
3. Select a duty to view its location history

#### Step 4: Review Location Statistics
The system displays 4 key metrics:
- **Total Locations**: Total points captured (usually ~1 per 30 seconds)
- **Valid**: Points within the duty location geofence
- **Violations**: Points outside the duty location geofence  
- **Violation %**: Percentage of violations out of total

#### Step 5: Analyze Location Details
Scroll through the location history to see:
- **Time**: When each location was captured (HH:MM:SS)
- **Status**: VALID ✓ (green) or VIOLATION ✗ (red)
- **Coordinates**: Exact latitude and longitude
- **Accuracy**: GPS accuracy in meters
- **Distance**: How far from duty location

### For Staff Users

#### Step 1: Access Your History
1. Log in with staff credentials
2. Click "My History" in the navigation bar
3. Your personal data is automatically selected

#### Step 2: Select a Date
- Use the same date navigation as above
- Can only view your own duties and location data

#### Step 3: Review Your Tracking
- Select a duty to see how you were tracked
- Check if any violations occurred
- Review your location accuracy

## Practical Examples

### Example 1: Verify Staff Compliance
**Scenario**: HOD wants to verify if staff attended duty location

1. Navigate to Location History
2. Select the staff member from dropdown
3. Select the duty date
4. Choose the specific duty
5. Check **Violation %** - Low % = Good compliance
6. Review location details for specific timestamps

### Example 2: Investigate a Violation
**Scenario**: Staff had high violation percentage

1. Open Location History for that staff and date
2. Select the problematic duty
3. Scroll through locations with VIOLATION status
4. Check **Time** and **Distance** columns
5. Note the timeframe when violations occurred
6. Discuss with staff member about that time period

### Example 3: Generate a Compliance Report
**Scenario**: Calculate weekly compliance

1. For each day of the week, check Location History
2. Note the Violation % for each duty
3. Calculate average violation percentage
4. Document patterns (which times/locations have issues)

## Feature Highlights

### Smart Date Navigation
- Can't go beyond today's date (prevents viewing future data)
- Quick buttons for common actions
- Direct date picker for specific dates
- Visual feedback showing selected date

### Comprehensive Statistics
```
Total Locations: 52
Valid:     48 (92.3%)
Violations: 4 (7.7%)
```

### Detailed Location Records
Each record shows:
- **14:32:45** - VALID - Lat: 13.0827, Lon: 80.2108 - Accuracy: 28.5m - Distance: 42.3m

### Responsive Design
- Works on desktop, tablet, and mobile
- Touch-friendly buttons and selectors
- Scrollable location list for small screens

## Tips & Tricks

1. **Quick Check**: Check Violation % first to spot non-compliance
2. **Time Patterns**: Look for violations at same time each day
3. **Location Trends**: Check if violations happen in specific areas
4. **GPS Accuracy**: Higher accuracy (lower number) = better location data
5. **Export Data**: Note down violation details for future reference

## Common Questions

**Q: Why can't I see today's data in detail?**
A: Duties are typically assigned for specific dates. View data from previous duty dates for complete records.

**Q: What does VALID/VIOLATION mean?**
A: **VALID**: Staff was within the duty location geofence
   **VIOLATION**: Staff was outside the duty location geofence

**Q: How accurate is GPS location?**
A: Accuracy varies based on environment. Urban areas (5-15m), Open areas (5-10m), Indoor areas (20-100m)

**Q: Can I see real-time location?**
A: No, location history shows past data. Real-time tracking happens during active duty tracking.

**Q: Why are some locations missing?**
A: Staff must explicitly enable location tracking and grant permissions. Some gaps may occur if:
- Location tracking wasn't started
- Browser permissions were denied
- Network connection was lost
- Device was off or in airplane mode

**Q: How often is location captured?**
A: Every 30 seconds during active duty tracking

**Q: Can I change the geofence radius?**
A: Currently, radius is 500m by default. Contact admin to change it in duty creation.

## Navigation Menu

The top navigation bar provides quick access to:

```
[OD Tracking System] [Dashboard] [Location History]     [Your Name] (role) [Logout]
```

- **Dashboard**: Create and manage duties (Admin/HOD only)
- **Location History**: View past location data (All users)
- **Logout**: Sign out of the system

## Keyboard Shortcuts

While in Location History:
- **Tab**: Navigate between form fields
- **Enter**: Select date or duty
- **Arrow Keys**: Scroll through location list
- **Page Up/Down**: Scroll location history faster

## Support & Troubleshooting

If you face issues:

1. **No duties showing**: 
   - Check if duties were created for that date
   - Verify staff member ID is correct

2. **No location data**:
   - Verify location tracking was started during duty
   - Check browser geolocation permissions

3. **Inaccurate data**:
   - GPS accuracy depends on location and weather
   - Urban areas are generally more accurate

4. **Slow loading**:
   - Large amounts of location data may take time
   - Try viewing smaller date ranges

5. **Browser issues**:
   - Try refreshing the page
   - Clear browser cache
   - Use a modern browser (Chrome, Firefox, Safari, Edge)

## Next Steps

- Review location history regularly
- Identify patterns in staff compliance
- Use data to improve duty scheduling
- Plan location-specific interventions if needed
