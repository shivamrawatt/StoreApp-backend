const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const {
  login,
  requestAdminWithDetails,
  verifyAdminOtpAndCreate,
  getMyProfile,
} = require('../controllers/authController');

// ADMIN SIGNUP FLOW
router.post('/request-admin-with-details', requestAdminWithDetails);
router.post('/verify-admin-otp', verifyAdminOtpAndCreate);

// LOGIN
router.post('/login', login);

// PROFILE
router.get('/me', auth, getMyProfile);

module.exports = router;
