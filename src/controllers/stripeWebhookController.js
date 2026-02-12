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

  /* =================================================
     PAYMENT SHEET — SUBSCRIPTION INTENT SUCCESS
  ================================================= */

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;

    if (pi.metadata?.type === 'subscription') {
      const userId = pi.metadata.userId;
      const plan = pi.metadata.plan;

      const daysMap = {
        weekly: 7,
        monthly: 30,
        annual: 365,
      };

      const days = daysMap[plan] || 0;

      const expires = new Date();
      expires.setDate(expires.getDate() + days);

      await db.execute(`
        UPDATE users
        SET subscription_status = 'active',
            subscription_plan = ?,
            subscription_expires = ?
        WHERE id = ?
      `, [plan, expires, userId]);

      console.log("✅ Subscription updated:", userId, plan);
    }
  }

  /* =================================================
     OLD CHECKOUT FLOW (keep for safety)
  ================================================= */

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

      console.log("✅ Checkout subscription activated:", userId);
    }
  }

  res.json({ received: true });
};
