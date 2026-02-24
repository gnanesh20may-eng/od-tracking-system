const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const {
  register,
  login,
  getProfile,
  updateProfile,
} = require('../controllers/authController');

const router = express.Router();

/**
 * Authentication Routes
 */

// Register a new staff member (Public - anyone can register)
router.post('/register', register);

// Login
router.post('/login', login);

// Get current user profile
router.get('/profile', authenticate, getProfile);

// Update user profile
router.put('/profile', authenticate, updateProfile);

module.exports = router;
