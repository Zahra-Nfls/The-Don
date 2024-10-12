// pages/api/events/route.tsx
import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const client = await connectToDatabase(); // Await the connection
        const db = client.db('workingHoursDB'); // Access the database after connection

        if (req.method === 'GET') {
            // Get all bills
            const bills = await db.collection('bills').find().toArray();
            res.status(200).json(bills);
        } else if (req.method === 'POST') {
            // Create a new bill
            const bill = req.body; // Use req.body to get the new bill
            await db.collection('bills').insertOne(bill);
            res.status(201).json({ message: 'Bill created successfully' });
        } else if (req.method === 'PUT') {
            // Update an existing bill
            const updatedBill = req.body; // Get updated bill data from request body
            const id = updatedBill._id; // Get ID from the updated bill

            const result = await db.collection('bills').updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        name: updatedBill.name,
                        dueDate: updatedBill.dueDate,
                        amount: updatedBill.amount,
                        isPaid: updatedBill.isPaid,
                        paymentDate: updatedBill.paymentDate,
                    },
                }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ message: 'Bill not found' });
            }

            res.status(200).json({ message: 'Bill updated successfully' });
        } else if (req.method === 'DELETE') {
            // Delete a bill
            const id = req.query.id as string; // Get ID from the query and cast to string
            const result = await db.collection('bills').deleteOne({ _id: new ObjectId(id) });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Bill not found' });
            }

            res.status(200).json({ message: 'Bill deleted successfully' });
        } else {
            // Method not allowed
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error connecting to database', error });
    }
}
