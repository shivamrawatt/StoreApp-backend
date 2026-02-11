const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const {
  login,
  ownerInviteAdmin,
  adminSignupWithInvite,
  verifyAdminOtpAndCreate,
  getMyProfile,
} = require('../controllers/authController');


/* ===============================
   OWNER → INVITE ADMIN
================================ */
router.post('/owner/invite-admin', auth, ownerInviteAdmin);


/* ===============================
   ADMIN SIGNUP (INVITE FLOW)
================================ */
router.post('/admin/signup-invite', adminSignupWithInvite);
router.post('/admin/verify-otp', verifyAdminOtpAndCreate);


/* ===============================
   LOGIN
================================ */
router.post('/login', login);


/* ===============================
   PROFILE
================================ */
router.get('/me', auth, getMyProfile);


module.exports = router;
