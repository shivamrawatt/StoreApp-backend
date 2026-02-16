const stripe = require('../config/stripe');

exports.handleStripeWebhook = (req, res) => {
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
    return res.status(400).send(`Webhook Error`);
  }

  console.log("EVENT TYPE:", event.type);

  res.json({ received: true });
};
