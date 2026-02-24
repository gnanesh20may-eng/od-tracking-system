const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const {
  createDuty,
  getAllDuties,
  getStaffDuties,
  getDutyById,
  getDutyByToken,
  startDutyTracking,
  completeDuty,
  updateDuty,
  deleteDuty,
  getDutyStatistics,
} = require('../controllers/dutyController');

const router = express.Router();

/**
 * Duty Management Routes
 */

// Create a new duty request (HOD/Admin only)
router.post('/', authenticate, authorize(['hod', 'admin']), createDuty);

// Get all duty requests (Admin/HOD only)
router.get('/all', authenticate, authorize(['admin', 'hod']), getAllDuties);

// Get duty statistics (Admin/HOD only)
router.get('/statistics', authenticate, authorize(['admin', 'hod']), getDutyStatistics);

// Get duty by token (for tracking page)
router.get('/track/:token', getDutyByToken);

// Get staff's own duties
router.get('/staff/duties', authenticate, getStaffDuties);

// Get specific staff's duties (Admin/HOD only)
router.get('/staff/:staffId', authenticate, authorize(['admin', 'hod']), getStaffDuties);

// Get duty by ID
router.get('/:dutyId', authenticate, getDutyById);

// Start duty tracking
router.post('/:dutyId/start', authenticate, startDutyTracking);

// Complete duty
router.post('/:dutyId/complete', authenticate, authorize(['admin', 'hod']), completeDuty);

// Update duty request
router.put('/:dutyId', authenticate, authorize(['admin', 'hod']), updateDuty);

// Delete duty request
router.delete('/:dutyId', authenticate, authorize(['admin', 'hod']), deleteDuty);

module.exports = router;
