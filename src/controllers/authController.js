const User = require('../models/user');
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
};
