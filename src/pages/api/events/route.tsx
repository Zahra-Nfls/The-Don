    // pages/api/events/route.tsx
    import { NextApiRequest, NextApiResponse } from 'next';
    import connectToDatabase from '../../../lib/db';
    import { ObjectId } from 'mongodb'; // Make sure to import ObjectId

    export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const client = await connectToDatabase(); // Await the connection
        const db = client.db('workingHoursDB'); // Access the database after connection

        if (req.method === 'GET') {
        const events = await db.collection('events').find().toArray(); // Use db here
        res.status(200).json(events);
        } else if (req.method === 'POST') {
        const event = req.body;
        await db.collection('events').insertOne(event);
        res.status(201).json({ message: 'Event created successfully' });
        } else if (req.method === 'PUT') {
        const updatedEvent = req.body;
        const id = updatedEvent._id; // Get ID from the request body
        const result = await db.collection('events').updateOne(
            { _id: new ObjectId(id) },
            {
            $set: {
                endTime: updatedEvent.endTime,
                startTime: updatedEvent.startTime,
                location: updatedEvent.location,
                hourSalary: updatedEvent.hourSalary,
            },
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event updated successfully' });
        } else if (req.method === 'DELETE') {
        const id = req.query.id as string; // Get ID from the query and cast to string
        const result = await db.collection('events').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event deleted successfully' });
        } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error connecting to database', error });
    }
    }
