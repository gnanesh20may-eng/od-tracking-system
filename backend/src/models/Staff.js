const pool = require('../db');

/**
 * Staff Model - Database operations for staff
 */

const Staff = {
  /**
   * Create a new staff member
   */
  async create(name, email, password, role, department) {
    const query = `
      INSERT INTO staff (name, email, password, role, department)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, role, department, created_at
    `;
    const result = await pool.query(query, [name, email, password, role, department]);
    return result.rows[0];
  },

  /**
   * Find staff by email
   */
  async findByEmail(email) {
    const query = 'SELECT * FROM staff WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  /**
   * Find staff by ID
   */
  async findById(id) {
    const query = 'SELECT id, name, email, role, department, created_at FROM staff WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  /**
   * Get all staff members
   */
  async getAll() {
    const query = 'SELECT id, name, email, role, department, created_at FROM staff ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  },

  /**
   * Get staff by role
   */
  async getByRole(role) {
    const query = 'SELECT id, name, email, role, department, created_at FROM staff WHERE role = $1 ORDER BY name';
    const result = await pool.query(query, [role]);
    return result.rows;
  },

  /**
   * Update staff information
   */
  async update(id, name, department) {
    const query = `
      UPDATE staff 
      SET name = $2, department = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, name, email, role, department
    `;
    const result = await pool.query(query, [id, name, department]);
    return result.rows[0];
  },

  /**
   * Delete staff member
   */
  async delete(id) {
    const query = 'DELETE FROM staff WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
};

module.exports = Staff;
