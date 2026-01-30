const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const PendingAdmin = require('../models/PendingAdmin');
const sendEmail = require('../utils/sendEmail'); // ✅ fixed case


// ================= LOGIN =================

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= ADMIN SIGNUP FLOW =================

// Step 1: Submit details → generate OTP → email owner
exports.requestAdminWithDetails = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    await PendingAdmin.create({
      username,
      password: hashedPassword,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
      verified: false,
    });

    await sendEmail({
      to: process.env.OWNER_EMAIL,
      subject: 'Admin Approval OTP',
      text: `OTP to approve admin "${username}": ${otp}\nValid for 5 minutes.`,
    });

    res.json({ message: 'OTP sent for admin approval' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Step 2: Verify OTP → create admin
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

    await User.create({
      username: pending.username,
      password: pending.password,
      role: 'admin',
    });

    pending.verified = true;
    await pending.save();

    res.json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
