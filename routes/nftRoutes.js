const express = require('express');
const { getNFT, fetchAndSaveNFTMetadata } = require('../controllers/nftController');
const router = express.Router();

// Get NFT from MongoDB
router.get('/:contractAddress/:tokenId', getNFT);

// Fetch and Save NFT metadata to MongoDB
router.post('/fetch', async (req, res) => {
  const { contractAddress, tokenId } = req.body;
  if (!contractAddress || !tokenId) {
    return res.status(400).json({ message: 'Contract address and token ID are required' });
  }
  
  try {
    await fetchAndSaveNFTMetadata(contractAddress, tokenId);
    res.json({ message: 'NFT metadata fetched and saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching and saving NFT metadata', error: error.message });
  }
});

module.exports = router;
