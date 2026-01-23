const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');

router.post('/register', register); // one-time admin creation
router.post('/login', login);

module.exports = router;
