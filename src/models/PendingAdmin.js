const mongoose = require('mongoose');

const pendingAdminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },

  shopName: { type: String, required: true },

  // ✅ NEW
  name: String,
  email: String,
  mobile: String,

  otp: { type: String, required: true },
  verified: { type: Boolean, default: false },

  expiresAt: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('PendingAdmin', pendingAdminSchema);
