const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// ✅ REGISTER PRODUCT ROUTES
app.use('/api/products', productRoutes);

module.exports = app;
