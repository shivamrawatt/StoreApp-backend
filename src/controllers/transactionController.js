const Transaction = require('../models/transaction');



exports.createTransaction = async (req, res) => {
  try {
    // 🔥 LOG FOR DEBUG (KEEP FOR NOW)
    console.log('CREATE TX BODY:', req.body);

    const {
      items,
      total,
      paymentMethod,
      paymentStatus,
      customerName,
      customerMobile,
    } = req.body;

    // 🔥 EXPLICIT VALIDATION (CLEAR ERROR)
    if (!customerName || !customerMobile) {
      return res.status(400).json({
        message: 'Customer name and mobile are required',
      });
    }

    const tx = await Transaction.create({
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
        $match: { paymentStatus: 'PAID' } // ✅ ONLY PAID
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
