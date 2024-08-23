const express = require('express');
const connectDB = require('./db');
const nftRoutes = require('./routes/nftRoutes');

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use routes
app.use('/api', nftRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
