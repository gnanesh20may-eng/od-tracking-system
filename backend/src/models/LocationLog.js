const pool = require('../db');

/**
 * LocationLog Model - Database operations for location tracking
 */

const LocationLog = {
  /**
   * Create a new location log entry
   */
  async create(dutyId, latitude, longitude, accuracy, status, distanceFromLocation) {
    const query = `
      INSERT INTO location_logs (duty_id, latitude, longitude, accuracy, status, distance_from_location)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await pool.query(query, [
      dutyId,
      latitude,
      longitude,
      accuracy,
      status,
      distanceFromLocation,
    ]);
    return result.rows[0];
  },

  /**
   * Get all location logs for a specific duty
   */
  async getByDutyId(dutyId) {
    const query = `
      SELECT * FROM location_logs
      WHERE duty_id = $1
      ORDER BY logged_at ASC
    `;
    const result = await pool.query(query, [dutyId]);
    return result.rows;
  },

  /**
   * Get location logs with pagination
   */
  async getByDutyIdPaginated(dutyId, limit = 100, offset = 0) {
    const query = `
      SELECT * FROM location_logs
      WHERE duty_id = $1
      ORDER BY logged_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [dutyId, limit, offset]);
    return result.rows;
  },

  /**
   * Get location logs for a time range
   */
  async getByTimeRange(dutyId, startTime, endTime) {
    const query = `
      SELECT * FROM location_logs
      WHERE duty_id = $1 AND logged_at BETWEEN $2 AND $3
      ORDER BY logged_at ASC
    `;
    const result = await pool.query(query, [dutyId, startTime, endTime]);
    return result.rows;
  },

  /**
   * Count violations for a duty
   */
  async getViolationCount(dutyId) {
    const query = `
      SELECT COUNT(*) as violation_count
      FROM location_logs
      WHERE duty_id = $1 AND status = 'VIOLATION'
    `;
    const result = await pool.query(query, [dutyId]);
    return result.rows[0].violation_count;
  },

  /**
   * Get latest location for a duty
   */
  async getLatestLocation(dutyId) {
    const query = `
      SELECT * FROM location_logs
      WHERE duty_id = $1
      ORDER BY logged_at DESC
      LIMIT 1
    `;
    const result = await pool.query(query, [dutyId]);
    return result.rows[0];
  },

  /**
   * Get location statistics for a duty
   */
  async getStatistics(dutyId) {
    const query = `
      SELECT 
        COUNT(*) as total_logs,
        SUM(CASE WHEN status = 'VALID' THEN 1 ELSE 0 END) as valid_locations,
        SUM(CASE WHEN status = 'VIOLATION' THEN 1 ELSE 0 END) as violation_locations,
        MIN(logged_at) as first_log,
        MAX(logged_at) as last_log
      FROM location_logs
      WHERE duty_id = $1
    `;
    const result = await pool.query(query, [dutyId]);
    return result.rows[0];
  },

  /**
   * Delete location logs for a duty
   */
  async deleteByDutyId(dutyId) {
    const query = 'DELETE FROM location_logs WHERE duty_id = $1';
    await pool.query(query, [dutyId]);
  },
};

module.exports = LocationLog;
