const pool = require('../src/db');

/**
 * Initialize Database Schema
 * Creates all necessary tables for the OD Verification System
 * Exported as a function so server can run migrations on startup.
 */
async function initializeDatabase() {
  let client;
  try {
    client = await pool.connect();
  } catch (err) {
    console.warn('⚠️  Cannot obtain DB client for migration:', err.message);
    return;
  }

  try {
    console.log('Creating database tables...');

    // Create STAFF table
    await client.query(`
      CREATE TABLE IF NOT EXISTS staff (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('staff', 'hod', 'admin')),
        department VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Staff table created');

    // Ensure optional contact columns exist for staff
    await client.query(`
      ALTER TABLE staff
      ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
      ADD COLUMN IF NOT EXISTS reg_no VARCHAR(100);
    `);
    console.log('✓ Staff optional columns ensured (phone, reg_no)');

    // Create DUTY_REQUESTS table (no GPS stored here)
    await client.query(`
      CREATE TABLE IF NOT EXISTS duty_requests (
        id SERIAL PRIMARY KEY,
        staff_id INTEGER NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
        duty_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        radius INTEGER DEFAULT 500 NOT NULL,
        token VARCHAR(255) UNIQUE NOT NULL,
        status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACTIVE', 'VERIFIED', 'VIOLATION', 'COMPLETED')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Duty_requests table created (no lat/lon columns)');

    // Create LOCATION_LOGS table
    await client.query(`
      CREATE TABLE IF NOT EXISTS location_logs (
        id SERIAL PRIMARY KEY,
        duty_id INTEGER NOT NULL REFERENCES duty_requests(id) ON DELETE CASCADE,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        accuracy DECIMAL(10, 2),
        status VARCHAR(50) DEFAULT 'VALID' CHECK (status IN ('VALID', 'VIOLATION')),
        distance_from_location DECIMAL(10, 2),
        logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Location_logs table created');

      // Create TRACKING_LINKS table for student-generated tracking links (final schema)
      await client.query(`
        CREATE TABLE IF NOT EXISTS tracking_links (
          id SERIAL PRIMARY KEY,
          token TEXT UNIQUE NOT NULL,
          student_email TEXT NOT NULL,
          student_name TEXT NOT NULL,
          reg_no TEXT NOT NULL,
          phone TEXT NOT NULL,
          tutor_email TEXT,
          hod_email TEXT,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          is_used BOOLEAN DEFAULT FALSE
        );
      `);
      console.log('✓ Tracking_links table created (final schema)');

      // Create TRACKING_LOCATIONS table to store locations reported via tokens
      await client.query(`
        CREATE TABLE IF NOT EXISTS tracking_locations (
          id SERIAL PRIMARY KEY,
          tracking_id INTEGER NOT NULL REFERENCES tracking_links(id) ON DELETE CASCADE,
          latitude DECIMAL(10,8) NOT NULL,
          longitude DECIMAL(11,8) NOT NULL,
          accuracy DECIMAL(10,2),
          user_agent TEXT,
          ip_address TEXT,
          raw_payload JSONB,
          received_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✓ Tracking_locations table created (with audit fields)');

    // Create indexes for better query performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_staff_email ON staff(email);
      CREATE INDEX IF NOT EXISTS idx_duty_staff_id ON duty_requests(staff_id);
      CREATE INDEX IF NOT EXISTS idx_duty_date ON duty_requests(duty_date);
      CREATE INDEX IF NOT EXISTS idx_location_duty_id ON location_logs(duty_id);
      CREATE INDEX IF NOT EXISTS idx_location_logged_at ON location_logs(logged_at);
    `);
    console.log('✓ Indexes created');

    console.log('✓ Database initialization completed successfully');
  } catch (error) {
    console.error('✗ Database initialization error:', error.message || error);
  } finally {
    try { if (client) client.release(); } catch (e) {}
  }
}

// If run directly, execute migration and exit with appropriate code
if (require.main === module) {
  initializeDatabase().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = initializeDatabase;
