const stripe = require('../config/stripe');
const db = require('../config/db');

exports.handleStripeWebhook = async (req, res) => {
  console.log("🔥 WEBHOOK ENTRY");

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("SIGNATURE FAIL:", err.message);
    return res.status(400).send('Webhook Error');
  }

  console.log("EVENT TYPE:", event.type);

  /* ===============================
     SUBSCRIPTION PAYMENT SUCCESS
  =============================== */

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;

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

      try {

        // ✅ YOUR EXISTING CODE (UNCHANGED)

        const [r] = await db.execute(`
          UPDATE users
          SET subscription_status = 'active',
              subscription_plan = ?,
              subscription_expires = ?
          WHERE id = ?
        `, [plan, expires, userId]);

        console.log("✅ SUB UPDATED rows:", r.affectedRows);


        // 🔥 NEW CODE ADDED (TRANSACTION LOG)

        const amount = pi.amount_received / 100;
        const paidAt = new Date();

        await db.execute(`
          INSERT INTO subscription_transactions
          (user_id,plan,amount,status,paid_at)
          VALUES (?,?,?,?,?)
        `, [
          userId,
          plan,
          amount,
          'PAID',
          paidAt
        ]);

        console.log("💰 TRANSACTION INSERTED");

      } catch (e) {
        console.log("DB ERROR:", e.message);
      }
    }
  }

  res.json({ received: true });
};