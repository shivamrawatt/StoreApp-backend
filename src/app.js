const express = require('express');
const cors = require('cors');

const db = require('./config/db');

const productRoutes = require('./routes/productRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const authRoutes = require('./routes/authRoutes');
const stripeRoutes = require('./routes/stripeRoutes');
const sendEmail = require('./utils/SendEmail');

const app = express();

/* ================= CORS ================= */
app.use(cors());

/* ================= STRIPE WEBHOOK — MUST BE BEFORE express.json ================= */
app.use('/stripe', require('./routes/webhookRoutes'));

/* ================= NORMAL JSON PARSER ================= */
app.use(express.json());

/* ================= HEALTH CHECK ================= */
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

/* ================= DB TEST ================= */
app.get('/api/db-test', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 as test');
    res.json({ success: true, message: "DB connected", result: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ================= SMTP TEST ================= */
app.get("/smtp-test", async (req,res)=>{
  try{
    await sendEmail({
      to: process.env.OWNER_EMAIL,
      subject: "Brevo Test",
      text: "Brevo mail working"
    });
    res.send("Brevo mail sent");
  } catch(e){
    res.send(e.message);
  }
});

/* ================= API ROUTES ================= */
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stripe', stripeRoutes);

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({ message: err.message });
});

module.exports = app;
