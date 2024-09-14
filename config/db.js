const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  }
});

async function createIndexes(db) {
  try {
    const collection = db.collection('tasks');

    // Create indexes to optimize query performance
    await collection.createIndex({ status: 1, priority: 1, dueDate: 1 });
    console.log('Index created on status, priority, and dueDate');
    
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB");

    const db = client.db('task_management');  // Replace with your actual database name

    // Create indexes when the database connection is established
    await createIndexes(db);

    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);  // Exit the app if connection fails
  }
}

module.exports = connectToMongoDB;
