const express = require('express');
const router = express.Router();
const { fetchAndSaveNFTMetadata, getNFT } = require('../controllers/nftController');

// Route to fetch and save NFT metadata
router.post('/nfts/:contractAddress/:tokenId', async (req, res) => {
  try {
    const { contractAddress, tokenId } = req.params;
    await fetchAndSaveNFTMetadata(contractAddress, tokenId);
    res.status(200).json({ message: 'NFT metadata fetched and saved' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching or saving NFT metadata', error: error.message });
  }
});

// Route to get NFT metadata from MongoDB
router.get('/nfts/:contractAddress/:tokenId', getNFT);

module.exports = router;
