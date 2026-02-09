// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     console.log('Connecting to MongoDB...');
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log('MongoDB connected');
//   } catch (error) {
//     console.error('MongoDB connection failed:', error.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;





require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


module.exports = pool;


