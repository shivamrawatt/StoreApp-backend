/* const Product = require('../models/product.js');

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
*/



const db = require('../config/db');


// ================= GET PRODUCTS =================

exports.getProducts = async (req, res) => {
  try {
    const shopId = req.user.shopId;

    const [rows] = await db.execute(
      `SELECT * FROM products
       WHERE shop_id = ?
       ORDER BY name`,
      [shopId]
    );

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};



// ================= CREATE PRODUCT =================

exports.createProduct = async (req, res) => {

  console.log("TOKEN USER:", req.user);

  try {
    const { name, stock, price, unit } = req.body;
    const shopId = req.user.shopId;

    const image = req.file ? req.file.path : '';

    const nameLower = name.trim().toLowerCase();

    await db.execute(
      `INSERT INTO products
       (shop_id, name, name_lower, stock, unit, price, image)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [shopId, name, nameLower, stock, unit, price, image]
    );

    res.json({ message: 'Product created' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Create failed' });
  }
};



// ================= UPDATE PRODUCT =================

exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const shopId = req.user.shopId;

    const { name, stock, price, unit } = req.body;

    let sql = `
      UPDATE products
      SET name=?, name_lower=?, stock=?, price=?, unit=?
    `;

    const values = [
      name,
      name.trim().toLowerCase(),
      stock,
      price,
      unit,
    ];

    if (req.file) {
      sql += `, image=?`;
      values.push(req.file.path);
    }

    sql += ` WHERE id=? AND shop_id=?`;
    values.push(id, shopId);

    await db.execute(sql, values);

    res.json({ message: 'Product updated' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
};



// ================= DELETE PRODUCT =================

exports.deleteProduct = async (req, res) => {

  console.log("DELETE ID:", req.params.id);
console.log("SHOP:", req.shopId);

  try {
    const id = req.params.id;
    const shopId = req.user.shopId;

    await db.execute(
      `DELETE FROM products
       WHERE id=? AND shop_id=?`,
      [id, shopId]
    );

    res.json({ message: 'Product deleted' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed' });
  }
};



// ================= UPDATE STOCK =================
exports.updateStock = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { stock, change } = req.body;
    const shopId = req.user.shopId;   // ⭐ FIXED

    console.log("UPDATE STOCK INPUT:", {
      id,
      stock,
      change,
      shopId
    });

    if (!id) {
      return res.status(400).json({ message: "Product id missing" });
    }

    if (stock !== undefined) {
      await db.execute(`
        UPDATE products
        SET stock = ?
        WHERE id = ?
        AND shop_id = ?
      `, [Number(stock), id, shopId]);

      return res.json({ success: true, mode: "set" });
    }

    if (change !== undefined) {
      await db.execute(`
        UPDATE products
        SET stock = stock + ?
        WHERE id = ?
        AND shop_id = ?
      `, [Number(change), id, shopId]);

      return res.json({ success: true, mode: "change" });
    }

    return res.status(400).json({
      message: "Provide stock or change"
    });

  } catch (e) {
    console.error("UPDATE STOCK ERROR:", e);
    res.status(500).json({ message: e.message });
  }
};



