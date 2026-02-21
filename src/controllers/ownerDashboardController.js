const db = require('../config/db');

exports.getOwnerDashboard = async (req, res) => {
  try {

    /* =========================
       SHOPS
    ========================== */

    const [shops] = await db.query(`
      SELECT 
        id,
        name,
        created_at
      FROM shops
      ORDER BY created_at DESC
    `);


    /* =========================
       ADMINS WITH SHOP NAME
    ========================== */

    const [admins] = await db.query(`
     SELECT
  u.id,
  u.username,
  u.name,
  u.email,
  u.mobile,
  u.subscription_status,
  u.subscription_expires,
  u.created_at,
  s.name AS shopName
FROM users u
LEFT JOIN shops s
  ON s.id = u.shop_id
WHERE u.role='admin'
ORDER BY u.created_at DESC
    `);


    /* =========================
       SUBSCRIPTION TRANSACTIONS
    ========================== */

    const [txns] = await db.query(`
      SELECT
        t.id,
        t.plan,
        t.amount,
        t.status,
        t.paid_at,
        u.username,
        u.email
      FROM subscription_transactions t
      JOIN users u 
        ON t.user_id = u.id
      ORDER BY t.paid_at DESC
    `);


    /* =========================
       RESPONSE
    ========================== */

    res.json({
      shops,
      admins,
      subscriptionTransactions: txns
    });

  } catch (err) {
    console.error('Owner Dashboard Error:', err);
    res.status(500).json({ msg: 'Dashboard error' });
  }
};