const Staff = require('../models/Staff');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');

/**
 * Authentication Controller
 */

/**
 * Register a new staff member (Admin/HOD only)
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate role
    if (!['staff', 'hod', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Check if staff already exists
    const existingStaff = await Staff.findByEmail(email);
    if (existingStaff) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create staff
    const newStaff = await Staff.create(name, email, hashedPassword, role, department);

    res.status(201).json({
      message: 'Staff registered successfully',
      staff: newStaff,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

/**
 * Login staff member
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // quick bypass when not running in production (NODE_ENV undefined or development)
    if ((!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') && email && password) {
      // return a fake staff object so frontend can continue without DB
      return res.json({
        message: 'Login bypassed (dev)',
        token: 'dev-token',
        staff: { id: null, name: email.split('@')[0], email, role: 'staff', department: null },
      });
    }

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find staff by email
    const staff = await Staff.findByEmail(email);
    
    if (!staff) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, staff.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken({
      id: staff.id,
      email: staff.email,
      role: staff.role,
      name: staff.name,
    });

    res.json({
      message: 'Login successful',
      token,
      staff: {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        department: staff.department,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

/**
 * Get current user profile
 */
const getProfile = async (req, res) => {
  try {
    const staffId = req.user.id;
    const staff = await Staff.findById(staffId);

    if (!staff) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    res.json({
      message: 'Profile retrieved successfully',
      staff,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
};

/**
 * Update staff profile
 */
const updateProfile = async (req, res) => {
  try {
    const staffId = req.user.id;
    const { name, department } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const updatedStaff = await Staff.update(staffId, name, department);

    res.json({
      message: 'Profile updated successfully',
      staff: updatedStaff,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};
