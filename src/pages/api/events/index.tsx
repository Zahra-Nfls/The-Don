import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const client = new MongoClient(uri);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await client.connect();
    const db = client.db('workingHoursDB');
    const eventsCollection = db.collection('events');

    if (req.method === 'GET') {
      const events = await eventsCollection.find().toArray();
      res.status(200).json(events);
    } else if (req.method === 'POST') {
      const event = req.body;
      await eventsCollection.insertOne(event);
      res.status(201).json({ message: 'Event created successfully' });
    } else if (req.method === 'PUT') {
      const updatedEvent = req.body;
      const id = updatedEvent._id; // Get ID from the request body
      if (typeof id !== 'string') {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
      
      const result = await eventsCollection.updateOne(
        { _id: new ObjectId(id) }, // Use ObjectId here
        { $set: { 
            endTime: updatedEvent.endTime,
            startTime: updatedEvent.startTime,
            location: updatedEvent.location,
            hourSalary: updatedEvent.hourSalary 
        }}
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Event not found' });
      }

      res.status(200).json({ message: 'Event updated successfully' });
    } else if (req.method === 'DELETE') {
      const id = req.query.id; // Get ID from the query
      if (typeof id !== 'string') {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
      
      const result = await eventsCollection.deleteOne({ _id: new ObjectId(id) }); // Use ObjectId here

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Event not found' });
      }

      res.status(200).json({ message: 'Event deleted successfully' });
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error connecting to database', error });
  }
}
