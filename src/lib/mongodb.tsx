// lib/mongodb.ts
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';

if (!uri) {
    throw new Error('Please add your Mongo URI to .env.local');
}

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
    // Use a cached client during development to avoid creating a new connection every time.
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // Create a new client in production.
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

export default clientPromise;
