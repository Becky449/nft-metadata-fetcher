const {Web3} = require('web3');
const axios = require('axios'); // For making HTTP requests
const connectDB = require('./db');
const NFT = require('./models/NFT');
require('dotenv').config();


const uriABI = [
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "uri",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

const tokenContract = "0x76be3b62873462d2142405439777e971754e8e77";
const tokenId = 10570;

const contract = new web3.eth.Contract(uriABI, tokenContract);

async function getNFTMetadata() {
    try {
        await connectDB();

        const metadataURI = await contract.methods.uri(tokenId).call();
        console.log("Metadata URI:", metadataURI);

        const response = await axios.get(metadataURI);
        const metadata = response.data;

        const nft = new NFT({
            tokenId: tokenId,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
        });

        await nft.save();
        console.log("NFT metadata saved to MongoDB");
    } catch (error) {
        console.error("Error fetching or saving NFT metadata:", error);
    }
}

getNFTMetadata();
