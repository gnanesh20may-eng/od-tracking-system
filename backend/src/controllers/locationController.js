const LocationLog = require('../models/LocationLog');
const DutyRequest = require('../models/DutyRequest');
const { isWithinGeofence, calculateHaversineDistance } = require('../utils/geolocation');

/**
 * Location Tracking Controller
 */

/**
 * Log staff location during duty
 */
const logLocation = async (req, res) => {
  try {
    const { dutyId } = req.params;
    const { latitude, longitude, accuracy } = req.body;

    // Validate required fields
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // Fetch duty request
    const duty = await DutyRequest.findById(dutyId);
    if (!duty) {
      return res.status(404).json({ error: 'Duty not found' });
    }

    // Check if duty is active
    if (duty.status !== 'ACTIVE') {
      return res.status(400).json({ error: 'Duty is not active' });
    }

    // Ensure current time falls within the duty's scheduled hours
    const now = new Date();
    const start = new Date(`${duty.duty_date}T${duty.start_time}`);
    const end = new Date(`${duty.duty_date}T${duty.end_time}`);
    if (now < start || now > end) {
      return res.status(400).json({ error: 'Location logging allowed only during duty hours' });
    }

    // Calculate distance from duty location
    const distance = calculateHaversineDistance(
      latitude,
      longitude,
      duty.latitude,
      duty.longitude
    );

    // Check if location is within geofence
    const isWithin = isWithinGeofence(
      latitude,
      longitude,
      duty.latitude,
      duty.longitude,
      duty.radius
    );

    const locationStatus = isWithin ? 'VALID' : 'VIOLATION';

    // Create location log
    const locationLog = await LocationLog.create(
      dutyId,
      latitude,
      longitude,
      accuracy || null,
      locationStatus,
      distance
    );

    // Update duty status if violation detected
    if (!isWithin && duty.status === 'ACTIVE') {
      await DutyRequest.updateStatus(dutyId, 'VIOLATION');
    }

    res.status(201).json({
      message: 'Location logged successfully',
      locationLog,
      withinGeofence: isWithin,
      distanceInMeters: distance.toFixed(2),
    });
  } catch (error) {
    console.error('Log location error:', error);
    res.status(500).json({ error: 'Failed to log location' });
  }
};

/**
 * Get all location logs for a duty
 */
const getLocationLogs = async (req, res) => {
  try {
    const { dutyId } = req.params;
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    // Verify duty exists
    const duty = await DutyRequest.findById(dutyId);
    if (!duty) {
      return res.status(404).json({ error: 'Duty not found' });
    }

    const logs = await LocationLog.getByDutyIdPaginated(dutyId, limit, offset);

    res.json({
      message: 'Location logs retrieved successfully',
      count: logs.length,
      logs,
    });
  } catch (error) {
    console.error('Get location logs error:', error);
    res.status(500).json({ error: 'Failed to retrieve location logs' });
  }
};

/**
 * Get latest location for a duty
 */
const getLatestLocation = async (req, res) => {
  try {
    const { dutyId } = req.params;

    // Verify duty exists
    const duty = await DutyRequest.findById(dutyId);
    if (!duty) {
      return res.status(404).json({ error: 'Duty not found' });
    }

    const latestLocation = await LocationLog.getLatestLocation(dutyId);
    if (!latestLocation) {
      return res.status(404).json({ error: 'No location logs found for this duty' });
    }

    res.json({
      message: 'Latest location retrieved successfully',
      location: latestLocation,
    });
  } catch (error) {
    console.error('Get latest location error:', error);
    res.status(500).json({ error: 'Failed to retrieve latest location' });
  }
};

/**
 * Get location statistics for a duty
 */
const getLocationStatistics = async (req, res) => {
  try {
    const { dutyId } = req.params;

    // Verify duty exists
    const duty = await DutyRequest.findById(dutyId);
    if (!duty) {
      return res.status(404).json({ error: 'Duty not found' });
    }

    const stats = await LocationLog.getStatistics(dutyId);

    const violationPercentage =
      stats.total_logs > 0 ? ((stats.violation_locations / stats.total_logs) * 100).toFixed(2) : 0;

    res.json({
      message: 'Location statistics retrieved successfully',
      statistics: {
        ...stats,
        violationPercentage: parseFloat(violationPercentage),
      },
    });
  } catch (error) {
    console.error('Get location statistics error:', error);
    res.status(500).json({ error: 'Failed to retrieve location statistics' });
  }
};

/**
 * Get location logs within a time range
 */
const getLocationsByTimeRange = async (req, res) => {
  try {
    const { dutyId } = req.params;
    const { startTime, endTime } = req.query;

    if (!startTime || !endTime) {
      return res.status(400).json({ error: 'startTime and endTime are required' });
    }

    // Verify duty exists
    const duty = await DutyRequest.findById(dutyId);
    if (!duty) {
      return res.status(404).json({ error: 'Duty not found' });
    }

    const logs = await LocationLog.getByTimeRange(dutyId, startTime, endTime);

    res.json({
      message: 'Location logs retrieved successfully',
      count: logs.length,
      logs,
    });
  } catch (error) {
    console.error('Get locations by time range error:', error);
    res.status(500).json({ error: 'Failed to retrieve location logs' });
  }
};

/**
 * Get live location data for dashboard (for HOD/Admin)
 */
const getLiveLocationData = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];

    // Get all active duties for today
    const activeDuties = await DutyRequest.getActiveByDate(date);

    // Fetch latest location for each active duty
    const liveData = await Promise.all(
      activeDuties.map(async (duty) => {
        const latestLocation = await LocationLog.getLatestLocation(duty.id);
        const stats = await LocationLog.getStatistics(duty.id);

        return {
          dutyId: duty.id,
          staffName: duty.name,
          staffEmail: duty.email,
          department: duty.department,
          status: duty.status,
          dutyDate: duty.duty_date,
          startTime: duty.start_time,
          endTime: duty.end_time,
          geofenceLocation: {
            latitude: duty.latitude,
            longitude: duty.longitude,
            radius: duty.radius,
          },
          currentLocation: latestLocation
            ? {
                latitude: latestLocation.latitude,
                longitude: latestLocation.longitude,
                accuracy: latestLocation.accuracy,
                timestamp: latestLocation.logged_at,
              }
            : null,
          statistics: stats,
        };
      })
    );

    res.json({
      message: 'Live location data retrieved successfully',
      date,
      count: liveData.length,
      liveData,
    });
  } catch (error) {
    console.error('Get live location data error:', error);
    res.status(500).json({ error: 'Failed to retrieve live location data' });
  }
};

module.exports = {
  logLocation,
  getLocationLogs,
  getLatestLocation,
  getLocationStatistics,
  getLocationsByTimeRange,
  getLiveLocationData,
};
