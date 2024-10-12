// src/pages/api/bills/index.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await client.connect();
        const db = client.db('workingHoursDB');
        const billsCollection = db.collection('bills');

        switch (req.method) {
            case 'GET': {
                const bills = await billsCollection.find().toArray();
                return res.status(200).json(bills);
            }
            case 'POST': {
                const newBill = req.body;
                await billsCollection.insertOne(newBill);
                return res.status(201).json({ message: 'Bill created successfully' });
            }
            case 'DELETE': {
                const { id } = req.query;
                if (!id || typeof id !== 'string') {
                    return res.status(400).json({ message: 'Invalid ID' });
                }
                await billsCollection.deleteOne({ _id: new ObjectId(id) });
                return res.status(200).json({ message: 'Bill deleted successfully' });
            }
            case 'PUT': {
                const { id } = req.query;
                const updatedBill = req.body;
                if (!id || typeof id !== 'string') {
                    return res.status(400).json({ message: 'Invalid ID' });
                }
                await billsCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedBill }
                );
                return res.status(200).json({ message: 'Bill updated successfully' });
            }
            default:
                res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
                return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error connecting to database', error });
    }
}
