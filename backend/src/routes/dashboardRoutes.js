const express = require('express');
const Staff = require('../models/Staff');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * Dashboard/Admin Routes
 */

// Get all staff (Admin only)
router.get('/staff', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const staff = await Staff.getAll();
    res.json({
      message: 'Staff list retrieved successfully',
      count: staff.length,
      staff,
    });
  } catch (error) {
    console.error('Get all staff error:', error);
    res.status(500).json({ error: 'Failed to retrieve staff list' });
  }
});

// Get staff by role (Admin only)
router.get('/staff/role/:role', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { role } = req.params;

    if (!['staff', 'hod', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const staff = await Staff.getByRole(role);
    res.json({
      message: 'Staff retrieved successfully',
      count: staff.length,
      staff,
    });
  } catch (error) {
    console.error('Get staff by role error:', error);
    res.status(500).json({ error: 'Failed to retrieve staff' });
  }
});

// Get single staff details (Admin/HOD - for their own staff)
router.get('/staff/:staffId', authenticate, async (req, res) => {
  try {
    const { staffId } = req.params;

    // Only allow admin, hod to view any staff, or staff to view themselves
    if (req.user.role !== 'admin' && req.user.role !== 'hod' && req.user.id !== parseInt(staffId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    res.json({
      message: 'Staff retrieved successfully',
      staff,
    });
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ error: 'Failed to retrieve staff' });
  }
});

// Delete staff member (Admin only)
router.delete('/staff/:staffId', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { staffId } = req.params;

    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    await Staff.delete(staffId);

    res.json({
      message: 'Staff deleted successfully',
    });
  } catch (error) {
    console.error('Delete staff error:', error);
    res.status(500).json({ error: 'Failed to delete staff' });
  }
});

module.exports = router;
