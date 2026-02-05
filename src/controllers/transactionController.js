const mongoose = require('mongoose');
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
