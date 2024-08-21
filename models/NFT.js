const mongoose = require('mongoose');

const nftSchema = new mongoose.Schema({
  tokenId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
});

module.exports = mongoose.model('NFT', nftSchema);
