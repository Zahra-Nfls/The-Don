import { MongoClient } from 'mongodb';

// Extend the global NodeJS namespace to include `_mongoClientPromise`.
declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}
export {};