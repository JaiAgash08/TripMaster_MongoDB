// db_connect.js
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'tripmaster_db';
let db;

async function connectToDatabase() {
    try {
        if (!db) {
            const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
            await client.connect();
            db = client.db(dbName);
            console.log('Connected to MongoDB');
        }
        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

module.exports = connectToDatabase;
