const express = require('express');
const router = express.Router();

const { ownerLogin } = require('../controllers/ownerAuthController');
const ownerAuth = require('../middleware/ownerAuth');

router.post('/login', ownerLogin);
router.get('/test', ownerAuth, (req,res)=>{
  res.json({ msg: 'Owner access granted' });
});

module.exports = router;
