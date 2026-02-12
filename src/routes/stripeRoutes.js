const express = require('express');
const router = express.Router();

const {
  createStripePaymentIntent,
  confirmStripePayment,
  markStripePaymentFailed,
  createSubscriptionCheckout,
  createSubscriptionIntent, // ✅ add this
} = require('../controllers/stripeController');

const auth = require('../middleware/auth');

/* ===== ALL ROUTES REQUIRE AUTH ===== */
router.use(auth);

/* ===== PRODUCT CARD PAYMENT ===== */
router.post('/create-intent', createStripePaymentIntent);
router.post('/confirm', confirmStripePayment);
router.post('/failed', markStripePaymentFailed);

/* ===== SUBSCRIPTION ===== */

// old browser checkout (keep if still needed)
router.post('/subscription-checkout', createSubscriptionCheckout);

// new in-app PaymentSheet intent
router.post('/subscription-intent', createSubscriptionIntent);

module.exports = router;
