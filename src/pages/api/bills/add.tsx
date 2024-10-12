import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../../lib/db';
import Bill from '../../../models/Bill';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { name, dueDate, amount } = req.body;

        try {
            await connectToDatabase();
            const newBill = new Bill({ name, dueDate, amount });
            await newBill.save();
            return res.status(201).json(newBill);
        } catch (error) {
            console.error('Error saving bill:', error);
            return res.status(500).json({ message: 'Error adding bill' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
