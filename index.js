const { Network, Alchemy } = require('alchemy-sdk');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const NFT = require('./models/NFT'); // Ensure the NFT model is properly set up

dotenv.config();

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY, // Store API key in .env file
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

// MongoDB connection
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

// Fetch and save NFT metadata by contract address and token ID
async function fetchAndSaveNFTMetadata(contractAddress, tokenId) {
  try {
    await connectDB();

    // Fetch NFT metadata from a contract by token ID
    const nft = await alchemy.nft.getNftMetadata(contractAddress, tokenId);
    console.log('Fetched NFT metadata:', nft);

    // Safely handle potential undefined or empty media array
    const nftData = {
      tokenId: nft.tokenId,
      name: nft.title || 'No Name',
      description: nft.description || 'No Description',
      image: nft.media && Array.isArray(nft.media) && nft.media.length > 0 
              ? nft.media[0].gateway 
              : 'No Image Available',
    };

    // Save to MongoDB
    const newNFT = new NFT(nftData);
    await newNFT.save();
    console.log('NFT metadata saved to MongoDB:', nftData);

  } catch (error) {
    console.error('Error fetching or saving NFT metadata:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Replace with the desired contract address and token ID
fetchAndSaveNFTMetadata("0x76be3b62873462d2142405439777e971754e8e77", "10570"); // Example contract address and token ID
