import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || ''; // Ensure this is set in your .env
let cachedClient: MongoClient | null = null;
let cachedDb: any = null; // Change `any` to your database type if needed

export default async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return cachedDb; // Return the cached database instance
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000, // Set a timeout for server selection
  });

  try {
    await client.connect();
    cachedClient = client;
    cachedDb = client.db(); // Get the database instance
    return cachedDb; // Return the database instance
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Could not connect to database');
  }
}