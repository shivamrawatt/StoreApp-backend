const express = require('express');
const router = express.Router();

const {
  ownerRegister,
  ownerLogin
} = require('../controllers/ownerAuthController');

const ownerAuth = require('../middleware/ownerAuth');

const {
  getOwnerDashboard
} = require('../controllers/ownerDashboardController');


router.post('/register', ownerRegister);
router.post('/login', ownerLogin);

router.get('/dashboard', ownerAuth, getOwnerDashboard);

module.exports = router;
