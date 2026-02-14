const db = require('../config/db');

exports.getOwnerDashboard = async (req, res) => {
  try {

    // shop names only
    const [shops] = await db.query(
      'SELECT id, name FROM shops ORDER BY created_at DESC'
    );

    // admin users only
    const [admins] = await db.query(`
      SELECT
        id,
        username,
        name,
        email,
        mobile,
        subscription_status,
        subscription_expires,
        created_at
      FROM users
      WHERE role='admin'
      ORDER BY created_at DESC
    `);

    // subscription transactions
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
      JOIN users u ON t.user_id = u.id
      ORDER BY t.paid_at DESC
    `);

    res.json({
      shops,
      admins,
      subscriptionTransactions: txns
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Dashboard error' });
  }
};
