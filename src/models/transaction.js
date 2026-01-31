const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: String,
        price: Number,
        quantity: Number,
        unit: String,
      },
    ],

    total: {
      type: Number,
      required: true,
    },

    time: {
      type: Date,
      default: Date.now,
    },

    paymentMethod: {
      type: String,
      enum: ['CASH', 'CARD'],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED'],
      default: 'PENDING',
    },

    // 🔥 NEW FIELDS
    customerName: {
      type: String,
      required: true,
    },

    customerMobile: {
      type: String,
      required: true,
    },

    stripePaymentIntentId: String,
    stripeClientSecret: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
