const mongoose = require('mongoose');

const nftSchema = new mongoose.Schema({
  contractAddress: {
    type: String,
    required: true
  },
  tokenId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: 'No Name'
  },
  description: {
    type: String,
    default: 'No Description'
  },
  image: {
    type: String,
    default: 'No Image Available'
  }
});

module.exports = mongoose.model('NFT', nftSchema);
