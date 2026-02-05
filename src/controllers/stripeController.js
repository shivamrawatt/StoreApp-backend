const stripe = require('../config/stripe');
const Transaction = require('../models/transaction');

// CREATE STRIPE PAYMENT INTENT
exports.createStripePaymentIntent = async (req, res) => {
  try {
     console.log("STRIPE INTENT REQ:", req.body);
    console.log("SHOP:", req.shopId);
    const { transactionId } = req.body;

    const tx = await Transaction.findOne({
      _id: transactionId,
      shopId: req.shopId,           // ⭐ MULTI-SHOP FILTER
    });

    if (!tx) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (tx.paymentMethod !== 'CARD') {
      return res.status(400).json({ message: 'Stripe allowed only for CARD' });
    }

    if (tx.total < 50) {
      return res.status(400).json({
        message: 'Minimum card payment amount is ₹50',
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(tx.total * 100),
      currency: 'inr',

      metadata: {
        customerName: tx.customerName,
        customerMobile: tx.customerMobile,
        transactionId: tx._id.toString(),
        shopId: req.shopId.toString(),     // ⭐ IMPORTANT
      },
    });

    tx.stripePaymentIntentId = paymentIntent.id;
    tx.stripeClientSecret = paymentIntent.client_secret;
    await tx.save();

    res.json({ clientSecret: paymentIntent.client_secret });

  } catch (error) {
    res.status(500).json({
      message: error?.raw?.message || 'Stripe intent failed',
    });
  }
};


// CONFIRM PAYMENT
exports.confirmStripePayment = async (req, res) => {
  const { transactionId } = req.body;

  const tx = await Transaction.findOne({
    _id: transactionId,
    shopId: req.shopId,              // ⭐ FILTER
  });

  if (!tx) {
    return res.status(404).json({ message: 'Transaction not found' });
  }

  tx.paymentStatus = 'PAID';
  await tx.save();

  res.json({ success: true });
};


// MARK FAILED
exports.markStripePaymentFailed = async (req, res) => {
  try {
    const { transactionId } = req.body;

    const tx = await Transaction.findOne({
      _id: transactionId,
      shopId: req.shopId,            // ⭐ FILTER
    });

    if (!tx) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    tx.paymentStatus = 'FAILED';
    await tx.save();

    res.json({ success: true, transaction: tx });

  } catch {
    res.status(500).json({ message: 'Failed to mark payment as FAILED' });
  }
};


