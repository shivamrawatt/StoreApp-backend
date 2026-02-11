const db = require('../config/db');

module.exports = async function requireSubscription(req, res, next) {
  try {
    const userId = req.userId;

    const [[u]] = await db.execute(`
      SELECT subscription_status, subscription_expires
      FROM users
      WHERE id=?
    `, [userId]);

    if (!u) {
      return res.status(401).json({ message: "User not found" });
    }

    if (u.subscription_status !== 'active') {
      return res.status(403).json({
        message: "Subscription required"
      });
    }

    if (u.subscription_expires && new Date(u.subscription_expires) < new Date()) {
      return res.status(403).json({
        message: "Subscription expired"
      });
    }

    next();const db = require('../config/db');

module.exports = async function requireSubscription(req, res, next) {
  try {
    const [rows] = await db.execute(
      "SELECT subscription_status, subscription_expires FROM users WHERE id=?",
      [req.userId]
    );

    const u = rows[0];

    if (!u) {
      return res.status(401).json({ message: "User not found" });
    }

    if (u.subscription_status !== 'active') {
      return res.status(402).json({
        code: "SUBSCRIPTION_REQUIRED",
        message: "Subscription required"
      });
    }

    if (u.subscription_expires && new Date(u.subscription_expires) < new Date()) {
      return res.status(402).json({
        code: "SUBSCRIPTION_EXPIRED",
        message: "Subscription expired"
      });
    }

    next();

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
