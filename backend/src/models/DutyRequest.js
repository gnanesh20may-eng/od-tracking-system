const pool = require('../db');

/**
 * DutyRequest Model - Database operations for duty requests
 */

const DutyRequest = {
  /**
   * Create a new duty request
   */
  async create(staffId, dutyDate, startTime, endTime, latitude, longitude, radius, token) {
    const query = `
      INSERT INTO duty_requests (staff_id, duty_date, start_time, end_time, latitude, longitude, radius, token, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDING')
      RETURNING *
    `;
    const result = await pool.query(query, [
      staffId,
      dutyDate,
      startTime,
      endTime,
      latitude,
      longitude,
      radius,
      token,
    ]);
    return result.rows[0];
  },

  /**
   * Find duty request by token
   */
  async findByToken(token) {
    const query = `
      SELECT dr.*, s.name, s.email
      FROM duty_requests dr
      JOIN staff s ON dr.staff_id = s.id
      WHERE dr.token = $1
    `;
    const result = await pool.query(query, [token]);
    return result.rows[0];
  },

  /**
   * Find duty request by ID
   */
  async findById(id) {
    const query = `
      SELECT dr.*, s.name, s.email, s.department
      FROM duty_requests dr
      JOIN staff s ON dr.staff_id = s.id
      WHERE dr.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  /**
   * Get duty requests for a specific staff member
   */
  async getByStaffId(staffId) {
    const query = `
      SELECT * FROM duty_requests
      WHERE staff_id = $1
      ORDER BY duty_date DESC, start_time DESC
    `;
    const result = await pool.query(query, [staffId]);
    return result.rows;
  },

  /**
   * Get all active duty requests for a specific date
   */
  async getActiveByDate(date) {
    const query = `
      SELECT dr.*, s.name, s.email, s.department
      FROM duty_requests dr
      JOIN staff s ON dr.staff_id = s.id
      WHERE dr.duty_date = $1 AND dr.status IN ('ACTIVE', 'VERIFIED')
      ORDER BY dr.start_time
    `;
    const result = await pool.query(query, [date]);
    return result.rows;
  },

  /**
   * Get all duty requests with pagination
   */
  async getAll(limit = 50, offset = 0) {
    const query = `
      SELECT dr.*, s.name, s.email, s.department
      FROM duty_requests dr
      JOIN staff s ON dr.staff_id = s.id
      ORDER BY dr.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  },

  /**
   * Update duty status
   */
  async updateStatus(id, status) {
    const query = `
      UPDATE duty_requests
      SET status = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id, status]);
    return result.rows[0];
  },

  /**
   * Update duty request
   */
  async update(id, dutyDate, startTime, endTime, latitude, longitude, radius) {
    const query = `
      UPDATE duty_requests
      SET duty_date = $2, start_time = $3, end_time = $4,
          latitude = $5, longitude = $6, radius = $7,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id, dutyDate, startTime, endTime, latitude, longitude, radius]);
    return result.rows[0];
  },

  /**
   * Delete duty request
   */
  async delete(id) {
    const query = 'DELETE FROM duty_requests WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  /**
   * Get duty statistics for dashboard
   */
  async getStatistics(startDate, endDate) {
    const query = `
      SELECT 
        COUNT(*) as total_duties,
        SUM(CASE WHEN status = 'VERIFIED' THEN 1 ELSE 0 END) as verified,
        SUM(CASE WHEN status = 'VIOLATION' THEN 1 ELSE 0 END) as violations,
        SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending
      FROM duty_requests
      WHERE duty_date BETWEEN $1 AND $2
    `;
    const result = await pool.query(query, [startDate, endDate]);
    return result.rows[0];
  },
};

module.exports = DutyRequest;
