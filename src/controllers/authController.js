/*const User = require('../models/user');
const PendingAdmin = require('../models/PendingAdmin');
const Shop = require('../models/shop');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');


// ================= LOGIN =================

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

   const user = await User.findOne({ username })
  .populate('shopId', 'name');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        shopId: user.shopId
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

   res.json({
  token,
  user: {
    id: user._id,
    username: user.username,
    role: user.role,

    shopId: user.shopId?._id,
    shopName: user.shopId?.name,   // ⭐ ADD THIS

    name: user.name,
    email: user.email,
    mobile: user.mobile,
  },
});


  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= ADMIN SIGNUP STEP 1 =================

exports.requestAdminWithDetails = async (req, res) => {
  try {
    const {
      username,
      password,
      shopName,
      name,
      email,
      mobile
    } = req.body;

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    await PendingAdmin.create({
      username,
      password: hashedPassword,
      shopName,
      name,
      email,
      mobile,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      verified: false,
    });

    await sendEmail({
      to: process.env.OWNER_EMAIL,
      subject: 'Admin Approval OTP',
      text: `OTP for admin "${username}" (shop: "${shopName}") = ${otp}`,
    });

    res.json({ message: 'OTP sent for admin approval' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= ADMIN SIGNUP STEP 2 =================

exports.verifyAdminOtpAndCreate = async (req, res) => {
  try {
    const { username, otp } = req.body;

    const pending = await PendingAdmin.findOne({
      username,
      otp,
      verified: false,
      expiresAt: { $gt: new Date() },
    });

    if (!pending) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const shop = await Shop.create({
      name: pending.shopName,
      ownerEmail: process.env.OWNER_EMAIL,
      ownerUsername: pending.username,
    });

    await User.create({
      username: pending.username,
      password: pending.password,
      role: 'admin',
      shopId: shop._id,

      // ✅ PROFILE FIELDS
      name: pending.name,
      email: pending.email,
      mobile: pending.mobile,
    });

    pending.verified = true;
    await pending.save();

    res.json({ message: 'Admin + Shop created successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= PROFILE =================

exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('shopId', 'name');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      shopName: user.shopId?.name,
      shopId: user.shopId?._id,
    });

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}; */




const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/SendEmail');


/* =====================================================
   SIGNUP REQUEST — CREATE USER + SEND OTP
===================================================== */

exports.signupRequest = async (req, res) => {
  try {
    const { username, password, name, email, mobile } = req.body;

    // check existing user
    const [exist] = await db.execute(
      "SELECT id FROM users WHERE username=? OR email=?",
      [username, email]
    );

    if (exist.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await db.execute(`
      INSERT INTO users
      (username,password,name,email,mobile,role,email_verified,otp,otp_expires,subscription_status)
      VALUES (?,?,?,?,?,'admin',0,?,?,'inactive')
    `, [
      username,
      hashed,
      name,
      email,
      mobile,
      otp,
      new Date(Date.now() + 5 * 60 * 1000)
    ]);

    await sendEmail({
      to: email,
      subject: "Verify your admin account",
      text: `Your verification OTP is: ${otp}`
    });

    res.json({ message: "OTP sent to email" });

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};



/* =====================================================
   VERIFY OTP — CREATE SHOP + ACTIVATE USER
===================================================== */

exports.signupVerify = async (req, res) => {
  const conn = await db.getConnection();

  try {
    const { otp } = req.body;

    const [[user]] = await conn.execute(`
      SELECT id FROM users
      WHERE otp = ?
        AND email_verified = 0
        AND otp_expires > NOW()
    `, [otp]);

    if (!user) {
      conn.release();
      return res.status(400).json({
        message: "Invalid or expired OTP"
      });
    }

    await conn.execute(`
      UPDATE users
      SET email_verified = 1,
          otp = NULL,
          otp_expires = NULL
      WHERE id = ?
    `, [user.id]);

    conn.release();

    res.json({
      message: "OTP verified successfully"
    });

  } catch (e) {
    conn.release();
    res.status(500).json({ message: e.message });
  }
};


/* =====================================================
   LOGIN — ALLOW ONLY VERIFIED EMAIL
===================================================== */

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const [rows] = await db.execute(`
      SELECT u.*, s.id AS shopId, s.name AS shopName
      FROM users u
      LEFT JOIN shops s ON u.shop_id = s.id
      WHERE u.username = ?
    `, [username]);

    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.email_verified) {
      return res.status(403).json({
        message: "Please verify your email OTP first"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        shopId: user.shop_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        shopId: user.shop_id,
        shopName: user.shopName,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        subscriptionStatus: user.subscription_status
      }
    });

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};



/* =====================================================
   PROFILE
===================================================== */

exports.getMyProfile = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT
        u.id,
        u.username,
        u.name,
        u.email,
        u.mobile,
        u.role,
        u.subscription_status,
        u.subscription_expires,
        s.id AS shopId,
        s.name AS shopName
      FROM users u
      LEFT JOIN shops s ON u.shop_id = s.id
      WHERE u.id = ?
    `, [req.userId]);

    if (!rows[0]) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
