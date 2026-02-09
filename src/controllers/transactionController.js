/*const mongoose = require('mongoose');
const Transaction = require('../models/transaction');


// CREATE TRANSACTION
exports.createTransaction = async (req, res) => {
  try {
    console.log('CREATE TX BODY:', req.body);

    const {
      items,
      total,
      paymentMethod,
      paymentStatus,
      customerName,
      customerMobile,
    } = req.body;

    if (!customerName || !customerMobile) {
      return res.status(400).json({
        message: 'Customer name and mobile are required',
      });
    }

    const tx = await Transaction.create({
      shopId: req.shopId,      // ✅ MUST be inside object
      items,
      total,
      paymentMethod,
      paymentStatus,
      customerName,
      customerMobile,
    });

    res.status(201).json(tx);

  } catch (error) {
    console.error('TX ERROR:', error.message);
    res.status(400).json({ message: error.message });
  }
};


// GET TRANSACTIONS
exports.getTransactions = async (req, res) => {
  try {
    const txs = await Transaction
      .find({ shopId: req.shopId })
      .sort({ createdAt: -1 });

    res.json(txs);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// SUMMARY
exports.getSummary = async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      {
        $match: {
          shopId: new mongoose.Types.ObjectId(req.shopId),
          paymentStatus: 'PAID'
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$total' },
          count: { $sum: 1 },
        },
      },
    ]);

    const summary = result[0] || { totalSales: 0, count: 0 };
    res.json(summary);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE TRANSACTION
exports.deleteTransaction = async (req, res) => {
  try {
    const tx = await Transaction.findOneAndDelete({
      _id: req.params.id,
      shopId: req.shopId, // safety — only delete own shop data
    });

    if (!tx) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};*/



const db = require('../config/db');


// ================= CREATE TRANSACTION =================

exports.createTransaction = async (req, res) => {
  const conn = await db.getConnection();

  try {
    const shopId = req.user.shopId;

    const {
      items,
      total,
      paymentMethod,
      paymentStatus,
      customerName,
      customerMobile,
    } = req.body;

    if (!customerName || !customerMobile) {
      conn.release();
      return res.status(400).json({
        message: 'Customer name and mobile are required',
      });
    }

    if (!items || items.length === 0) {
      conn.release();
      return res.status(400).json({
        message: 'Items required',
      });
    }

    await conn.beginTransaction();

    // ---------- insert transaction ----------
    const [txResult] = await conn.execute(`
      INSERT INTO transactions
      (shop_id,total,payment_method,payment_status,customer_name,customer_mobile)
      VALUES (?,?,?,?,?,?)
    `, [
      shopId,
      total,
      paymentMethod,
      paymentStatus,
      customerName,
      customerMobile
    ]);

    const transactionId = txResult.insertId;

    // ---------- insert items ----------
    for (const item of items) {
      await conn.execute(`
        INSERT INTO transaction_items
        (transaction_id,product_id,name,price,quantity,unit)
        VALUES (?,?,?,?,?,?)
      `, [
        transactionId,
        item.productId,
        item.name,
        item.price,
        item.quantity,
        item.unit
      ]);
    }

    // ✅ REDUCE STOCK ONLY FOR CASH
    if (paymentMethod === 'CASH') {
      for (const item of items) {

        const [r] = await conn.execute(`
          UPDATE products
          SET stock = stock - ?
          WHERE id = ?
          AND shop_id = ?
          AND stock >= ?
        `, [
          item.quantity,
          item.productId,
          shopId,
          item.quantity
        ]);

        if (r.affectedRows === 0) {
          throw new Error(`Insufficient stock for product ${item.productId}`);
        }
      }
    }

    await conn.commit();
    conn.release();

    res.status(201).json({
      id: transactionId,
      message: 'Transaction created'
    });

  } catch (error) {
    await conn.rollback();
    conn.release();
    console.error('CREATE TX ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};



// ================= GET TRANSACTIONS =================

exports.getTransactions = async (req, res) => {
  try {
    const shopId = req.user.shopId;

    const [txRows] = await db.execute(`
      SELECT *
      FROM transactions
      WHERE shop_id = ?
      ORDER BY created_at DESC
    `, [shopId]);

    if (txRows.length === 0) return res.json([]);

    const ids = txRows.map(t => t.id);
    const placeholders = ids.map(() => '?').join(',');

    const [itemRows] = await db.execute(`
      SELECT *
      FROM transaction_items
      WHERE transaction_id IN (${placeholders})
    `, ids);

    const itemsMap = {};

    for (const it of itemRows) {
      if (!itemsMap[it.transaction_id]) {
        itemsMap[it.transaction_id] = [];
      }
      itemsMap[it.transaction_id].push({
        productId: it.product_id,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        unit: it.unit
      });
    }

    const result = txRows.map(t => ({
      id: t.id,
      total: Number(t.total),

      customerName: t.customer_name,
      customerMobile: t.customer_mobile,

      paymentMethod: t.payment_method,
      paymentStatus: t.payment_status,

      createdAt: t.created_at,
      time: t.time,

      items: itemsMap[t.id] || []
    }));

    console.log("TX RESULT SAMPLE:", result[0]);

    res.json(result);

  } catch (e) {
    console.error("GET TX ERROR:", e);
    res.status(500).json({ message: e.message });
  }
};



// ================= SUMMARY =================

exports.getSummary = async (req, res) => {
  try {
    const shopId = req.user.shopId;

    const [rows] = await db.execute(`
      SELECT
        COALESCE(SUM(total),0) AS totalSales,
        COUNT(*) AS count
      FROM transactions
      WHERE shop_id = ?
      AND payment_status = 'PAID'
    `, [shopId]);

    res.json(rows[0]);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= DELETE TRANSACTION =================

exports.deleteTransaction = async (req, res) => {
  const conn = await db.getConnection();

  try {
    const shopId = req.user.shopId;
    const txId = req.params.id;

    await conn.beginTransaction();

    const [txRows] = await conn.execute(`
      SELECT payment_status
      FROM transactions
      WHERE id=? AND shop_id=?
    `, [txId, shopId]);

    if (!txRows.length) {
      await conn.rollback();
      conn.release();
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const paymentStatus = txRows[0].payment_status;

    const [items] = await conn.execute(`
      SELECT product_id, quantity
      FROM transaction_items
      WHERE transaction_id = ?
    `, [txId]);

    // ✅ restore stock only if PAID
    if (paymentStatus === 'PAID') {
      for (const item of items) {
        await conn.execute(`
          UPDATE products
          SET stock = stock + ?
          WHERE id = ? AND shop_id = ?
        `, [
          item.quantity,
          item.product_id,
          shopId
        ]);
      }
    }

    await conn.execute(
      `DELETE FROM transaction_items WHERE transaction_id = ?`,
      [txId]
    );

    await conn.execute(`
      DELETE FROM transactions
      WHERE id = ? AND shop_id = ?
    `, [txId, shopId]);

    await conn.commit();
    conn.release();

    res.json({ message: 'Transaction deleted' });

  } catch (error) {
    await conn.rollback();
    conn.release();
    res.status(500).json({ message: error.message });
  }
};
