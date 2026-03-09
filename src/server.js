/*require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db'); // ✅ ADD THIS
connectDB(); // ✅ CALL MONGODB

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});*/




require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} and CI/CD added`);
});



