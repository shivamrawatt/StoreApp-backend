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

  /* ============================================
     PAYMENT SHEET SUBSCRIPTION SUCCESS
  ============================================ */

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;

    console.log("WEBHOOK HIT payment_intent.succeeded");
    console.log("META:", pi.metadata);

    if (pi.metadata?.type === 'subscription') {
      const userId = Number(pi.metadata.userId);
      const plan = pi.metadata.plan;

      const daysMap = {
        weekly: 7,
        monthly: 30,
        annual: 365,
      };

      const days = daysMap[plan] || 0;

      const expires = new Date();
      expires.setDate(expires.getDate() + days);

      const [r] = await db.execute(`
        UPDATE users
        SET subscription_status = 'active',
            subscription_plan = ?,
            subscription_expires = ?
        WHERE id = ?
      `, [plan, expires, userId]);

      console.log("UPDATED ROWS:", r.affectedRows);
      console.log("✅ Subscription upgraded:", userId, plan);
    }
  }

  res.json({ received: true });
};
