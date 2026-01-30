const mongoose = require('mongoose');

const pendingAdminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true }, // hashed
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PendingAdmin', pendingAdminSchema);
