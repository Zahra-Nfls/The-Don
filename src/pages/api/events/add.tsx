    // pages/api/events/add.tsx
    import { NextApiRequest, NextApiResponse } from 'next';
    import connectToDatabase from '../../../lib/db'; // Make sure this imports correctly

    export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
        // Wait for the database connection to be established
        const client = await connectToDatabase();
        const db = client.db('workingHoursDB'); // Specify your database name

        // Extract data from the request body
        const { startTime, endTime, location, hourSalary } = req.body;

        // Insert new event data into the collection
        const result = await db.collection('events').insertOne({
            startTime,
            endTime,
            location,
            hourSalary,
            createdAt: new Date(),
        });

        // Send back a response
        res.status(201).json({ message: 'Event added successfully!', result });
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
    }
