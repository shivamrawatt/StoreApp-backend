const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ['admin', 'staff'],
      default: 'admin',
    },

    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true
    },

    // ✅ NEW PROFILE FIELDS (safe add)
    name: String,
    email: String,
    mobile: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
