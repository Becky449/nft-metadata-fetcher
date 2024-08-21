const mongoose = require('mongoose');

const nftSchema = new mongoose.Schema({
    tokenId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
});

const NFT = mongoose.model('NFT', nftSchema);

module.exports = NFT;
