const Product = require('../models/product.js');

// GET all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product
      .find({ shopId: req.shopId })   // ⭐ FILTER
      .sort({ name: 1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// CREATE product (with Cloudinary image) — MERGE IF NAME EXISTS
exports.createProduct = async (req, res) => {
  try {
    let { name, stock, price, unit } = req.body;

    if (!name || !stock || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const normalizedName = name.trim().toLowerCase();

    // 🔥 FIND EXISTING PRODUCT USING nameLower
    const existingProduct = await Product.findOne({
      shopId: req.shopId, 
      nameLower: normalizedName,
    });

    if (existingProduct) {
      // 🔥 Optional safety: prevent unit mismatch
      if (unit && existingProduct.unit !== unit) {
        return res.status(400).json({
          message: `Unit mismatch. Existing unit is ${existingProduct.unit}`,
        });
      }

      // 🔥 MERGE STOCK
      existingProduct.stock += Number(stock);

      // Optional: update price
      existingProduct.price = Number(price);

      // Optional: update image
      if (req.file) {
        existingProduct.image = req.file.path;
      }

      await existingProduct.save();

      return res.status(200).json({
        message: 'Product exists. Stock merged.',
        product: existingProduct,
        merged: true,
      });
    }

    // 🔥 CREATE NEW PRODUCT
    const product = await Product.create({
       shopId: req.shopId,     
      name: name.trim(),
      stock: Number(stock),
      price: Number(price),
      unit,
      image: req.file ? req.file.path : '',
    });

    res.status(201).json({
      message: 'New product created',
      product,
      merged: false,
    });
  } catch (error) {
    console.error('Create product error:', error);

    // Handle duplicate key error cleanly
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Product with this name already exists',
      });
    }

    res.status(400).json({ message: error.message });
  }
};

// UPDATE product (optional new image)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updates = {
      ...req.body,
    };

    if (req.file) {
      updates.image = req.file.path;
    }

    // If name is updated, also update nameLower
    if (updates.name) {
      updates.nameLower = updates.name.trim().toLowerCase();
    }

    const product = await Product.findOneAndUpdate(
  { _id: id, shopId: req.shopId },   // ⭐
  updates,
  { new: true }
);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(400).json({ message: error.message });
  }
};

// DELETE product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOneAndDelete({
  _id: id,
  shopId: req.shopId,               // ⭐
});


    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(400).json({ message: error.message });
  }
};

// UPDATE STOCK (increment or decrement)
exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { change } = req.body;

   const product = await Product.findOne({
  _id: id,
  shopId: req.shopId,               // ⭐
});


    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const newStock = product.stock + Number(change);

    if (newStock < 0) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    product.stock = newStock;
    await product.save();

    res.json(product);
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(400).json({ message: error.message });
  }
};
