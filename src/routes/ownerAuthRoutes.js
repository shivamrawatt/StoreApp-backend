const express = require('express');
const router = express.Router();

const { ownerLogin } = require('../controllers/ownerAuthController');

router.post('/login', ownerLogin);

module.exports = router;
