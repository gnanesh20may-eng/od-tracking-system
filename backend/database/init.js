const pool = require('../src/db');

/**
 * Initialize Database Schema
 * Creates all necessary tables for the OD Verification System
 */
async function initializeDatabase() {
  const client = await pool.connect();
  
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

    // Create DUTY_REQUESTS table
    await client.query(`
      CREATE TABLE IF NOT EXISTS duty_requests (
        id SERIAL PRIMARY KEY,
        staff_id INTEGER NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
        duty_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        radius INTEGER DEFAULT 500 NOT NULL,
        token VARCHAR(255) UNIQUE NOT NULL,
        status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACTIVE', 'VERIFIED', 'VIOLATION', 'COMPLETED')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Duty_requests table created');

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
    process.exit(0);
  } catch (error) {
    console.error('✗ Database initialization error:', error);
    process.exit(1);
  } finally {
    client.release();
  }
}

initializeDatabase();
