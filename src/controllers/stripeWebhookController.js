const stripe = require('../config/stripe');
const db = require('../config/db');

exports.handleStripeWebhook = async (req, res) => {
 console.log("WEBHOOK ENTRY HIT");
  console.log("Buffer:", Buffer.isBuffer(req.body));


  const sig = req.headers['stripe-signature'];
  let event;

  //VERIFY STRIPE SIGNATURE
 

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("WEBHOOK HIT:", event.type);

  } catch (err) {
    console.error(" Webhook signature error:", err.message);
    return res.sendStatus(400);
  }

  // HANDLE EVENTS
  

  try {

    //PAYMENT INTENT SUCCESS (PaymentSheet / In-App) 

    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object;

      console.log("PI META:", pi.metadata);

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
          const [r] = await db.execute(`
            UPDATE users
            SET subscription_status = 'active',
                subscription_plan = ?,
                subscription_expires = ?
            WHERE id = ?
          `, [plan, expires, userId]);

          console.log("✅ Subscription updated:",
            "user =", userId,
            "plan =", plan,
            "rows =", r.affectedRows
          );

        } catch (dbErr) {
          console.error("DB UPDATE FAILED:", dbErr.message);
        }
      }
    }

    //CHECKOUT SESSION SUCCESS (Browser Checkout Flow)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      console.log("CHECKOUT META:", session.metadata);

      if (session.metadata?.type === 'subscription') {

        const userId = Number(session.metadata.userId);
        const plan = session.metadata.plan;

        const daysMap = {
          weekly: 7,
          monthly: 30,
          annual: 365,
        };

        const days = daysMap[plan] || 0;

        const expires = new Date();
        expires.setDate(expires.getDate() + days);

        try {
          const [r] = await db.execute(`
            UPDATE users
            SET subscription_status = 'active',
                subscription_plan = ?,
                subscription_expires = ?
            WHERE id = ?
          `, [plan, expires, userId]);

          console.log("✅ Checkout subscription updated:",
            "user =", userId,
            "plan =", plan,
            "rows =", r.affectedRows
          );

        } catch (dbErr) {
          console.error("DB UPDATE FAILED:", dbErr.message);
        }
      }
    }

  } catch (handlerErr) {
    console.error("Webhook handler error:", handlerErr.message);
  }

  //  ALWAYS ACK STRIPE

  res.json({ received: true });
};
