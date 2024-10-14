import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb'; // Adjust the import path as necessary

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            // Connect to the database
            const client = await clientPromise;
            const db = client.db(); // Use your database name if needed

            // Extract event data from the request body
            const { _id, ...event } = req.body; // Destructure to remove _id if it exists

            // Insert the event into the MongoDB collection
            const result = await db.collection('events').insertOne(event); // Ensure 'events' is the correct collection name

            // Respond with the newly created event, including its generated _id
            res.status(201).json({
                message: 'Event added successfully',
                event: {
                    ...event,
                    _id: result.insertedId // Get the inserted ID directly from the result
                }
            });
        } catch (error) {
            console.error('Error adding event:', error);
            res.status(500).json({ message: 'Error adding event' });
        }
    } else {
        // Handle method not allowed
        res.status(405).json({ message: 'Method not allowed' });
    }
}