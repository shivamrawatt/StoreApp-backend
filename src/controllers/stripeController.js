/*const stripe = require('../config/stripe');
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
};*/




const stripe = require('../config/stripe');
const db = require('../config/db');


// ================= CREATE STRIPE PAYMENT INTENT =================

exports.createStripePaymentIntent = async (req, res) => {
  try {
    const { transactionId } = req.body;

    const [rows] = await db.execute(`
      SELECT *
      FROM transactions
      WHERE id = ?
      AND shop_id = ?
    `, [transactionId, req.user.shopId]);

    const tx = rows[0];

    if (!tx) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (tx.payment_method !== 'CARD') {
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
        transactionId: tx.id.toString(),
        shopId: req.user.shopId.toString(),
      },
    });

    await db.execute(`
      UPDATE transactions
      SET stripe_payment_intent_id = ?,
          stripe_client_secret = ?
      WHERE id = ?
      AND shop_id = ?
    `, [
      paymentIntent.id,
      paymentIntent.client_secret,
      tx.id,
      req.user.shopId
    ]);

    res.json({ clientSecret: paymentIntent.client_secret });

  } catch (error) {
    res.status(500).json({
      message: error?.raw?.message || 'Stripe intent failed',
    });
  }
};



// ================= CONFIRM PAYMENT =================

exports.confirmStripePayment = async (req, res) => {
  const conn = await db.getConnection();

  try {
    const { transactionId } = req.body;
    const shopId = req.user.shopId;

    await conn.beginTransaction();

    // ✅ prevent double confirm
    const [txUpdate] = await conn.execute(`
      UPDATE transactions
      SET payment_status = 'PAID'
      WHERE id = ?
      AND shop_id = ?
      AND payment_status != 'PAID'
    `, [transactionId, shopId]);

    if (txUpdate.affectedRows === 0) {
      await conn.rollback();
      conn.release();
      return res.json({ alreadyPaid: true });
    }

    const [items] = await conn.execute(`
      SELECT product_id, quantity
      FROM transaction_items
      WHERE transaction_id = ?
    `, [transactionId]);

    for (const it of items) {
      const [r] = await conn.execute(`
        UPDATE products
        SET stock = stock - ?
        WHERE id = ?
        AND shop_id = ?
        AND stock >= ?
      `, [
        it.quantity,
        it.product_id,
        shopId,
        it.quantity
      ]);

      if (r.affectedRows === 0) {
        throw new Error(`Stock conflict for product ${it.product_id}`);
      }
    }

    await conn.commit();
    conn.release();

    res.json({ success: true });

  } catch (error) {
    await conn.rollback();
    conn.release();
    console.error("STRIPE CONFIRM ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};



// ================= MARK FAILED =================

exports.markStripePaymentFailed = async (req, res) => {
  try {
    const { transactionId } = req.body;

    await db.execute(`
      UPDATE transactions
      SET payment_status = 'FAILED'
      WHERE id = ?
      AND shop_id = ?
    `, [transactionId, req.user.shopId]);

    res.json({ success: true });

  } catch {
    res.status(500).json({
      message: 'Failed to mark payment as FAILED'
    });
  }
};

// ================= SUBSCRIPTION CHECKOUT =================

const PLAN_MAP = {
  weekly:  { amount: 5900, name: 'Weekly Subscription', days: 7 },
  monthly: { amount: 14900, name: 'Monthly Subscription', days: 30 },
  annual:  { amount: 139900, name: 'Annual Subscription', days: 365 },
};

exports.createSubscriptionCheckout = async (req, res) => {
  try {
    const { plan } = req.body;

    const p = PLAN_MAP[plan];
    if (!p) {
      return res.status(400).json({ message: 'Invalid plan' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],

      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: { name: p.name },
          unit_amount: p.amount,
        },
        quantity: 1,
      }],

      success_url: process.env.CLIENT_URL + '/payment-success',
      cancel_url: process.env.CLIENT_URL + '/payment-cancel',

      metadata: {
        payment_type: 'subscription',
        userId: req.user.id.toString(),
        plan,
        days: p.days.toString(),
      },
    });

    res.json({ url: session.url });

  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Subscription checkout failed' });
  }
};

// stripeController.js

exports.createSubscriptionIntent = async (req, res) => {
  const { plan } = req.body;

  const prices = {
    weekly: 5900,
    monthly: 14900,
    annual: 139900,
  };

  const amount = prices[plan];

  const intent = await stripe.paymentIntents.create({
    amount,
    currency: 'inr',
    metadata: {
      type: 'subscription',
      plan,
      userId: req.user.id,
    },
  });

  res.json({
    clientSecret: intent.client_secret,
  });
};





