const express = require('express');
const router = express.Router();

const { ownerLogin } = require('../controllers/ownerAuthController');
const ownerAuth = require('../middleware/ownerAuth');
const { getOwnerDashboard } =
  require('../controllers/ownerDashboardController');

router.post('/login', ownerLogin);
router.get('/test', ownerAuth, (req,res)=>{
  res.json({ msg: 'Owner access granted' });
});
router.get('/dashboard', ownerAuth, getOwnerDashboard);

module.exports = router;
