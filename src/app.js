const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const authRoutes = require('./routes/authRoutes');
const stripeRoutes = require('./routes/stripeRoutes');   // 👈 ADD

const app = express();
// const mongoose = require('mongoose');

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});
// ROUTES
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stripe', stripeRoutes);   // 👈 ADD
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({ message: err.message });
});



module.exports = app;
