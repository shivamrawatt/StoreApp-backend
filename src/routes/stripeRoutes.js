const express = require('express');
const router = express.Router();
const {
  createStripePaymentIntent,
  confirmStripePayment,markStripePaymentFailed
} = require('../controllers/stripeController');
const auth = require('../middleware/auth');

router.use(auth);
router.post('/create-intent', createStripePaymentIntent);
router.post('/confirm', confirmStripePayment);
router.post('/failed', markStripePaymentFailed);

module.exports = router;
