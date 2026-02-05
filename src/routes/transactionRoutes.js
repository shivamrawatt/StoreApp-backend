const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  createTransaction,
  getTransactions,
  getSummary,
} = require('../controllers/transactionController');

router.use(auth);
router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/summary', getSummary);

module.exports = router;
