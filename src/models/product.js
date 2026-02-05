const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    shopId: {                         // ⭐ NEW
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    nameLower: {
      type: String,
      required: true,
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

// ⭐ UNIQUE PER SHOP (NOT GLOBAL)
productSchema.index(
  { shopId: 1, nameLower: 1 },
  { unique: true }
);

productSchema.pre('validate', async function () {
  if (this.name) {
    this.nameLower = this.name.trim().toLowerCase();
  }
});

module.exports = mongoose.model('Product', productSchema);
