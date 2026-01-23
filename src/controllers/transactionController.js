const Transaction = require('../models/transaction');

// CREATE transaction (checkout)
exports.createTransaction = async (req, res) => {
  try {
    const { items, total } = req.body;

    const tx = await Transaction.create({
      items,
      total,
    });

    res.status(201).json(tx);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET all transactions (history)
exports.getTransactions = async (req, res) => {
  try {
    const txs = await Transaction.find().sort({ createdAt: -1 });
    res.json(txs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET sales summary
exports.getSummary = async (req, res) => {
  try {
    const result = await Transaction.aggregate([
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
