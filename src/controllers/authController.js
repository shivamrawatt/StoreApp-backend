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


// ================= LOGIN =================

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const [rows] = await db.execute(`
      SELECT 
        u.*,
        s.id   AS shopId,
        s.name AS shopName
      FROM users u
      JOIN shops s ON u.shop_id = s.id
      WHERE u.username = ?
    `, [username]);

    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
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

    // check existing username
    const [exist] = await db.execute(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );

    if (exist.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(`
      INSERT INTO pending_admins
      (username,password,shop_name,name,email,mobile,otp,verified,expires_at)
      VALUES (?,?,?,?,?,?,?,?,?)
    `, [
      username,
      hashedPassword,
      shopName,
      name,
      email,
      mobile,
      otp,
      0,
      new Date(Date.now() + 5 * 60 * 1000)
    ]);

    sendEmail({
  to: process.env.OWNER_EMAIL,
  subject: 'Admin Approval OTP',
  text: `OTP for admin "${username}" (shop: "${shopName}") = ${otp}`,
}).catch(e => console.error("MAIL ERROR:", e.message));


    res.json({ message: 'OTP sent for admin approval' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= ADMIN SIGNUP STEP 2 =================

exports.verifyAdminOtpAndCreate = async (req, res) => {
  const conn = await db.getConnection();

  try {
    const { username, otp } = req.body;

    const [rows] = await conn.execute(`
      SELECT *
      FROM pending_admins
      WHERE username = ?
        AND otp = ?
        AND verified = 0
        AND expires_at > NOW()
    `, [username, otp]);

    const pending = rows[0];

    if (!pending) {
      conn.release();
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    await conn.beginTransaction();

    // create shop
    const [shopResult] = await conn.execute(`
      INSERT INTO shops
      (name, owner_email, owner_username)
      VALUES (?,?,?)
    `, [
      pending.shop_name,
      process.env.OWNER_EMAIL,
      pending.username
    ]);

    const shopId = shopResult.insertId;

    // create admin user
    await conn.execute(`
      INSERT INTO users
      (username,password,role,shop_id,name,email,mobile)
      VALUES (?,?,?,?,?,?,?)
    `, [
      pending.username,
      pending.password,
      'admin',
      shopId,
      pending.name,
      pending.email,
      pending.mobile
    ]);

    // mark pending verified
    await conn.execute(`
      UPDATE pending_admins
      SET verified = 1
      WHERE id = ?
    `, [pending.id]);

    await conn.commit();
    conn.release();

    res.json({ message: 'Admin + Shop created successfully' });

  } catch (error) {
    await conn.rollback();
    conn.release();
    res.status(500).json({ message: error.message });
  }
};



// ================= PROFILE =================

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
        s.id   AS shopId,
        s.name AS shopName
      FROM users u
      JOIN shops s ON u.shop_id = s.id
      WHERE u.id = ?
    `, [req.userId]);

    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
