const express = require('express');
const router = express.Router();

const {
  createTransaction,
  getTransactions,
  getSummary,
} = require('../controllers/transactionController');

router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/summary', getSummary);

module.exports = router;
