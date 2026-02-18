const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const {
  signupRequest,
  signupVerify,
  login,
  getMyProfile
} = require('../controllers/authController');

router.post('/signup-request', signupRequest);
router.post('/signup-verify', signupVerify);
router.post('/login', login);
router.get('/me', auth, getMyProfile);

module.exports = router;
