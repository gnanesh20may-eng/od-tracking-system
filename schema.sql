-- PostgreSQL Schema for Smart OD Verification System
-- FINAL CORRECT VERSION

BEGIN;

-- =========================
-- STAFF TABLE
-- =========================
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

-- =========================
-- DUTY REQUESTS (NO GPS HERE)
-- =========================
CREATE TABLE IF NOT EXISTS duty_requests (
  id SERIAL PRIMARY KEY,
  staff_id INTEGER NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  duty_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  token TEXT UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'ACTIVE', 'VERIFIED', 'VIOLATION', 'COMPLETED')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TRACKING LINKS
-- =========================
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- LIVE GPS LOCATION LOGS
-- =========================
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

-- =========================
-- INDEXES
-- =========================
CREATE INDEX IF NOT EXISTS idx_staff_email ON staff(email);
CREATE INDEX IF NOT EXISTS idx_duty_staff_id ON duty_requests(staff_id);
CREATE INDEX IF NOT EXISTS idx_duty_date ON duty_requests(duty_date);
CREATE INDEX IF NOT EXISTS idx_tracking_token ON tracking_links(token);
CREATE INDEX IF NOT EXISTS idx_tracking_location_time ON tracking_locations(created_at);

-- =========================
-- SAMPLE USERS (OPTIONAL)
-- =========================
INSERT INTO staff (name, email, password, role, department)
VALUES
  ('Staff User', 'staff@college.com', 'hashed_password', 'staff', 'IT'),
  ('HOD User', 'hod@college.com', 'hashed_password', 'hod', 'IT'),
  ('Admin User', 'admin@college.com', 'hashed_password', 'admin', 'Administration')
ON CONFLICT (email) DO NOTHING;

COMMIT;