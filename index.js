const {Web3} = require('web3');
const axios = require('axios'); // For making HTTP requests
const connectDB = require('./db');
const NFT = require('./models/NFT');
require('dotenv').config();

// const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/ac9f071ede3849e5b6d753e58573ed7f'));
// const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/58d853d820744b848331cd9794de43ca', {
//   timeout: 30000 // Set timeout to 30 seconds
// }));
// const options = {method: 'GET', headers: {accept: 'application/json'}};

// fetch('https://eth-mainnet.g.alchemy.com/nft/v3/CWTUObpyImlVuUJlfn4n8JRjW-5pL_Zj/getNFTsForOwner?owner=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045&withMetadata=true&pageSize=100', options)
//   .then(response => response.json())
//   .then(response => console.log(response))
//   .catch(err => console.error(err));
const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.g.alchemy.com/nft/v3/CWTUObpyImlVuUJlfn4n8JRjW-5pL_Zj'));

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
