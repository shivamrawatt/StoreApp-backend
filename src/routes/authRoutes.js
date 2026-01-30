const express = require('express');
const router = express.Router();

const {
  login,
  requestAdminWithDetails,
  verifyAdminOtpAndCreate,
} = require('../controllers/authController');

// ================= ADMIN SIGNUP + OTP FLOW =================
router.post('/request-admin-with-details', requestAdminWithDetails);
router.post('/verify-admin-otp', verifyAdminOtpAndCreate);

// ================= LOGIN =================
router.post('/login', login);

module.exports = router;
