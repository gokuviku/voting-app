const mongoose = require ('mongose')
require('dotenv').config();

const mongo_uri = process.env.MONGO_URL_LOCAL ||'mongodb://localhost:27017'; // Replace this with your MongoDB URI
const dbName = 'votes'; // Replace this with your database name

let client;

async function connectDB() {
    try {
        client = await mongoose.connect(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
        return client.db(dbName);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

// function getDB() {
//     if (!client) {
//         throw new Error('Call connectDB first');
//     }
//     return client.db(dbName);
// }

// function closeDB() {
//     if (client) {
//         return client.close();
//     }
// }

module.exports = { connectDB };
