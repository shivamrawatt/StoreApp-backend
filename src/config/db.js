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





const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'shopdb',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;


