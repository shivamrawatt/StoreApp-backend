const express = require('express');
const router = express.Router();

const {
  createStripePaymentIntent,
  confirmStripePayment,
  markStripePaymentFailed,
  createSubscriptionCheckout
} = require('../controllers/stripeController');

const auth = require('../middleware/auth');

/* ===== ALL ROUTES REQUIRE AUTH ===== */
router.use(auth);

/* ===== PRODUCT CARD PAYMENT ===== */
router.post('/create-intent', createStripePaymentIntent);
router.post('/confirm', confirmStripePayment);
router.post('/failed', markStripePaymentFailed);

/* ===== SUBSCRIPTION CHECKOUT ===== */
router.post('/subscription-checkout', createSubscriptionCheckout);
router.post(
  '/subscription-intent',
  requireAuth,
  stripeController.createSubscriptionIntent
);


module.exports = router;
