require('dotenv').config();

console.log('MongoDB URI:', process.env.MONGO_URI); // Should print your MongoDB URI

const mongoose = require('mongoose');
const NFT = require('./models/NFT'); // Make sure this model is updated

async function updateExistingDocuments() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Update existing documents to include the new field with a default value
    await NFT.updateMany({}, { $set: { newField: 'Default Value' } });

    console.log('Documents updated successfully');
  } catch (error) {
    console.error('Error updating documents:', error);
  } finally {
    mongoose.connection.close();
  }
}

updateExistingDocuments();
