const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  createTransaction,
  getTransactions,
  getSummary,deleteTransaction
} = require('../controllers/transactionController');

router.use(auth);
router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/summary', getSummary);
router.delete('/:id', deleteTransaction);


module.exports = router;
