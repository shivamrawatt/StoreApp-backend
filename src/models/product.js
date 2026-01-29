const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    nameLower: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    unit: {
      type: String,
      default: 'kg',
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// 🔥 FIXED: Async hook (NO next())
productSchema.pre('validate', async function () {
  if (this.name) {
    this.nameLower = this.name.trim().toLowerCase();
  }
});

module.exports = mongoose.model('Product', productSchema);
