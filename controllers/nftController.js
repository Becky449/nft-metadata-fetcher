const NFT = require('../models/NFT');
const { Network, Alchemy } = require('alchemy-sdk');
require('dotenv').config();

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

// Fetch and save NFT metadata by contract address and token ID
const fetchAndSaveNFTMetadata = async (contractAddress, tokenId) => {
  try {
    const nft = await alchemy.nft.getNftMetadata(contractAddress, tokenId);
    console.log('Fetched NFT metadata:', nft);

    const nftData = {
      contractAddress: nft.contract.address,
      tokenId: nft.tokenId,
      name: nft.name || nft.title || 'No Name',
      description: nft.description || 'No Description',
      image: nft.image?.originalUrl
          ? nft.image.originalUrl
          : nft.raw?.metadata?.image 
          ? `https://ipfs.io/ipfs/${nft.raw.metadata.image.split('ipfs://')[1]}`
          : 'No Image Available',
    };

    const newNFT = new NFT(nftData);
    await newNFT.save();
    console.log('NFT metadata saved to MongoDB:', nftData);
  } catch (error) {
    console.error('Error fetching or saving NFT metadata:', error);
  }
};

// Get NFT from MongoDB by contract address and token ID
const getNFT = async (req, res) => {
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
};

module.exports = { fetchAndSaveNFTMetadata, getNFT };
