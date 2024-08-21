const express = require('express');
const mongoose = require('mongoose');
const NFT = require('./models/NFT');
require('dotenv').config();

const app = express();
app.use(express.json());

// Connect to MongoDB
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

// Define API routes
app.get('/nfts/:contractAddress/:tokenId', async (req, res) => {
    try {
        const { contractAddress, tokenId } = req.params;
        const nft = await NFT.findOne({ contractAddress, tokenId });
        if (!nft) {
            return res.status(404).json({ message: 'NFT not found' });
        }
        res.json(nft);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
