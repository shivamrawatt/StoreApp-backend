const express = require('express');
const router = express.Router();
const {
  createStripePaymentIntent,
  confirmStripePayment,markStripePaymentFailed
} = require('../controllers/stripeController');

router.post('/create-intent', createStripePaymentIntent);
router.post('/confirm', confirmStripePayment);
router.post('/failed', markStripePaymentFailed);


module.exports = router;
