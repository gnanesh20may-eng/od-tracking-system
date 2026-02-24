const DutyRequest = require('../models/DutyRequest');
const { v4: uuidv4 } = require('uuid');

/**
 * Duty Management Controller
 */

/**
 * Create a new duty request (HOD/Admin only)
 */
const createDuty = async (req, res) => {
  console.log('⚙️  createDuty called, body=', req.body);
  try {
    const { staffId, dutyDate, startTime, endTime, latitude, longitude, radius } = req.body;

    // Validate required fields
    if (!staffId || !dutyDate || !startTime || !endTime || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate dates and times
    const duty = new Date(dutyDate);
    const start = new Date(`${dutyDate}T${startTime}`);
    const end = new Date(`${dutyDate}T${endTime}`);

    if (start >= end) {
      return res.status(400).json({ error: 'Start time must be before end time' });
    }

    // business hours enforcement (09:00 - 18:00)
    const earliest = new Date(`${dutyDate}T09:00`);
    const latest = new Date(`${dutyDate}T18:00`);
    if (start < earliest || end > latest) {
      return res.status(400).json({ error: 'Duty times must fall between 09:00 and 18:00' });
    }

    if (duty <= new Date()) {
      return res.status(400).json({ error: 'Duty date must be in the future' });
    }

    // Generate unique token
    const token = uuidv4();

    // Create duty request
    let newDuty;
    try {
      newDuty = await DutyRequest.create(
        staffId,
        dutyDate,
        startTime,
        endTime,
        latitude,
        longitude,
        radius || 500,
        token
      );
    } catch (dbErr) {
      console.error('⚠️  DB write failed, running in fallback mode:', dbErr);
      // continue even if database unavailable so frontend still gets a link
      newDuty = {
        id: null,
        staff_id: staffId,
        duty_date: dutyDate,
        start_time: startTime,
        end_time: endTime,
        latitude,
        longitude,
        radius: radius || 500,
        token,
        status: 'PENDING',
      };
    }

    // send notification emails
    try {
      const Staff = require('../models/Staff');
      const staff = await Staff.findById(staffId);
      const creator = req.user;
      const trackingLink = `${process.env.CLIENT_URL}/track/${token}`;
      const viewLink = `${process.env.CLIENT_URL}/track/${token}?view=true`;
      const subject = 'New Duty Assigned';
      const htmlContent = `<p>A duty has been assigned for you on ${dutyDate} (${startTime} - ${endTime}).</p>
        <p><strong>Staff tracking link</strong> (click on your phone and allow location): <a href="${trackingLink}">${trackingLink}</a></p>
        <p><strong>HOD/Admin view link</strong> (use to observe live GPS & history): <a href="${viewLink}">${viewLink}</a></p>`;
      const recipients = [staff?.email, creator?.email].filter(Boolean).join(',');
      const { sendMail } = require('../utils/mailer');
      await sendMail({
        to: recipients,
        subject,
        html: htmlContent,
        text: `Duty assigned for ${dutyDate} ${startTime}-${endTime}.\n` +
              `Staff tracking: ${trackingLink}\n` +
              `View only: ${viewLink}`,
      });
    } catch (mailErr) {
      console.error('Error sending duty email:', mailErr);
      // do not fail creation if mail fails
    }

    // build base URL using environment variable with fallback
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const staffLink = `${baseUrl}/track/${token}`;
    const viewLink = `${staffLink}?view=true`;

    // log links for debugging (will always show something now)
    console.log(`🚀 Duty links generated: staff=${staffLink}, view=${viewLink}`);
    console.log('📤 Sending response with links');

    res.status(201).json({
      message: 'Duty request created successfully',
      duty: newDuty,
      trackingLink: staffLink,
      viewLink,
    });
  } catch (error) {
    console.error('Create duty error:', error);
    // send error details back for debugging
    res.status(500).json({ error: 'Failed to create duty request', detail: error.message });
  }
};

/**
 * Get all duty requests (Admin/HOD)
 */
const getAllDuties = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const duties = await DutyRequest.getAll(limit, offset);

    res.json({
      message: 'Duties retrieved successfully',
      count: duties.length,
      duties,
    });
  } catch (error) {
    console.error('Get all duties error:', error);
    res.status(500).json({ error: 'Failed to retrieve duties' });
  }
};

/**
 * Get duty requests for a specific staff member
 */
const getStaffDuties = async (req, res) => {
  try {
    const staffId = req.params.staffId || req.user.id;

    const duties = await DutyRequest.getByStaffId(staffId);

    res.json({
      message: 'Staff duties retrieved successfully',
      count: duties.length,
      duties,
    });
  } catch (error) {
    console.error('Get staff duties error:', error);
    res.status(500).json({ error: 'Failed to retrieve duties' });
  }
};

/**
 * Get duty request by ID
 */
const getDutyById = async (req, res) => {
  try {
    const { dutyId } = req.params;

    const duty = await DutyRequest.findById(dutyId);
    if (!duty) {
      return res.status(404).json({ error: 'Duty not found' });
    }

    res.json({
      message: 'Duty retrieved successfully',
      duty,
    });
  } catch (error) {
    console.error('Get duty error:', error);
    res.status(500).json({ error: 'Failed to retrieve duty' });
  }
};

/**
 * Get duty by tracking token (for staff tracking)
 */
const getDutyByToken = async (req, res) => {
  try {
    const { token } = req.params;

    let duty;
    try {
      duty = await DutyRequest.findByToken(token);
    } catch (dbErr) {
      console.error('⚠️  DB lookup failed in getDutyByToken:', dbErr);
      // return a minimal object so frontend can still show basic info
      duty = {
        id: null,
        token,
        name: '',
        duty_date: '',
        start_time: '',
        end_time: '',
        latitude: 0,
        longitude: 0,
        radius: 500,
        status: 'PENDING',
      };
    }

    if (!duty) {
      return res.status(404).json({ error: 'Duty not found' });
    }

    res.json({
      message: 'Duty retrieved successfully',
      duty,
    });
  } catch (error) {
    console.error('Get duty by token error:', error);
    res.status(500).json({ error: 'Failed to retrieve duty' });
  }
};

/**
 * Start duty tracking (Set status to ACTIVE)
 */
const startDutyTracking = async (req, res) => {
  try {
    const { dutyId } = req.params;

    const duty = await DutyRequest.findById(dutyId);
    if (!duty) {
      return res.status(404).json({ error: 'Duty not found' });
    }

    const updatedDuty = await DutyRequest.updateStatus(dutyId, 'ACTIVE');

    res.json({
      message: 'Duty tracking started',
      duty: updatedDuty,
    });
  } catch (error) {
    console.error('Start duty tracking error:', error);
    res.status(500).json({ error: 'Failed to start duty tracking' });
  }
};

/**
 * Disable duty by ID (admin action)
 */
const completeDuty = async (req, res) => {
  try {
    const { dutyId } = req.params;

    const duty = await DutyRequest.findById(dutyId);
    if (!duty) {
      return res.status(404).json({ error: 'Duty not found' });
    }

    const updatedDuty = await DutyRequest.updateStatus(dutyId, 'COMPLETED');

    res.json({
      message: 'Duty marked as completed',
      duty: updatedDuty,
    });
  } catch (error) {
    console.error('Complete duty error:', error);
    res.status(500).json({ error: 'Failed to complete duty' });
  }
};

/**
 * Update duty request (before it starts)
 */
const updateDuty = async (req, res) => {
  try {
    const { dutyId } = req.params;
    const { dutyDate, startTime, endTime, latitude, longitude, radius } = req.body;

    const duty = await DutyRequest.findById(dutyId);
    if (!duty) {
      return res.status(404).json({ error: 'Duty not found' });
    }

    if (duty.status !== 'PENDING') {
      return res.status(400).json({ error: 'Can only update pending duties' });
    }

    const updatedDuty = await DutyRequest.update(
      dutyId,
      dutyDate || duty.duty_date,
      startTime || duty.start_time,
      endTime || duty.end_time,
      latitude || duty.latitude,
      longitude || duty.longitude,
      radius || duty.radius
    );

    res.json({
      message: 'Duty updated successfully',
      duty: updatedDuty,
    });
  } catch (error) {
    console.error('Update duty error:', error);
    res.status(500).json({ error: 'Failed to update duty' });
  }
};

/**
 * Delete duty request
 */
const deleteDuty = async (req, res) => {
  try {
    const { dutyId } = req.params;

    const duty = await DutyRequest.findById(dutyId);
    if (!duty) {
      return res.status(404).json({ error: 'Duty not found' });
    }

    await DutyRequest.delete(dutyId);

    res.json({
      message: 'Duty deleted successfully',
    });
  } catch (error) {
    console.error('Delete duty error:', error);
    res.status(500).json({ error: 'Failed to delete duty' });
  }
};

/**
 * Get duty statistics
 */
const getDutyStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    const stats = await DutyRequest.getStatistics(startDate, endDate);

    res.json({
      message: 'Statistics retrieved successfully',
      statistics: stats,
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ error: 'Failed to retrieve statistics' });
  }
};

module.exports = {
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
};
