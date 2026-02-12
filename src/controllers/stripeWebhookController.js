const stripe = require('../config/stripe');
const db = require('../config/db');

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.sendStatus(400);
  }

  // ===== CHECKOUT SESSION COMPLETED =====

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    if (session.metadata?.payment_type === 'subscription') {
      const userId = session.metadata.userId;
      const days = Number(session.metadata.days);

      const expires = new Date();
      expires.setDate(expires.getDate() + days);

      await db.execute(`
        UPDATE users
        SET subscription_status = 'active',
            subscription_expires = ?
        WHERE id = ?
      `, [expires, userId]);

      console.log("✅ Subscription activated for user", userId);
    }
  }

  res.json({ received: true });
};
