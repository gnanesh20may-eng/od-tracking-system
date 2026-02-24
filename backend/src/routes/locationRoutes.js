const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const {
  logLocation,
  getLocationLogs,
  getLatestLocation,
  getLocationStatistics,
  getLocationsByTimeRange,
  getLiveLocationData,
} = require('../controllers/locationController');

const router = express.Router();

/**
 * Location Tracking Routes
 */

// Log location during duty tracking
router.post('/log/:dutyId', logLocation);

// Get all location logs for a duty
router.get('/:dutyId', authenticate, getLocationLogs);

// Get latest location for a duty
router.get('/:dutyId/latest', authenticate, getLatestLocation);

// Get location statistics for a duty
router.get('/:dutyId/statistics', authenticate, getLocationStatistics);

// Get locations within time range
router.get('/:dutyId/range', authenticate, getLocationsByTimeRange);

// Get live location data for all active duties (Admin/HOD only)
router.get('/live/all', authenticate, authorize(['admin', 'hod']), getLiveLocationData);

module.exports = router;
