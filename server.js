const express = require('express');
const connectDB = require('./db');
const NFT = require('./models/NFT');
require('dotenv').config();

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Define API routes
app.get('/nfts/:tokenId', async (req, res) => {
    try {
        const nft = await NFT.findOne({ tokenId: req.params.tokenId });
        if (!nft) {
            return res.status(404).json({ message: 'NFT not found' });
        }
        res.json(nft);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
