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
fetchAndSaveNFTMetadata("0x524cAB2ec69124574082676e6F654a18df49A048", "6198");
// fetchAndSaveNFTMetadata("0x495f947276749Ce646f68AC8c248420045cb7b5e", "24913202380792386291683512650245515028805536071723299612486033281263467495425")
