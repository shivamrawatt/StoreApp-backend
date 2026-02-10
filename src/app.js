const express = require('express');
const cors = require('cors');

// ✅ DB IMPORT (FIX)
const db = require('./config/db');

const productRoutes = require('./routes/productRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const authRoutes = require('./routes/authRoutes');
const stripeRoutes = require('./routes/stripeRoutes');

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());


// ================= HEALTH CHECK =================
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});


// ================= DB TEST ROUTE =================
app.get('/api/db-test', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 as test');

    res.json({
      success: true,
      message: "DB connected",
      result: rows
    });

  } catch (err) {
    console.error("DB TEST ERROR:", err);

    res.status(500).json({
      success: false,
      message: "DB failed",
      error: err.message
    });
  }
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.OWNER_EMAIL,
    pass: process.env.OWNER_EMAIL_APP_PASSWORD,
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000
});

// ================= ROUTES =================
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stripe', stripeRoutes);


// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({ message: err.message });
});


module.exports = app;
