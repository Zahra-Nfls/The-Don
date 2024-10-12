    import { NextResponse } from 'next/server';
    import connectToDatabase from '@/lib/db'; // Adjust path as necessary
    import { ObjectId } from 'mongodb';
    export async function GET() {
    const db = await connectToDatabase();
    const collection = db.collection('events');
    const events = await collection.find({}).toArray();
    return NextResponse.json(events);
    }

    export async function POST(req: Request) {
    const db = await connectToDatabase();
    const collection = db.collection('events');
    const newEvent = await req.json();

    const result = await collection.insertOne(newEvent);
    return NextResponse.json({ message: 'Event added', result });
    }

    export async function PUT(req: Request) {
    const db = await connectToDatabase();
    const collection = db.collection('events');
    const updatedEvent = await req.json();

    const result = await collection.updateOne(
        { _id: new ObjectId(updatedEvent.id) }, // Ensure you pass the correct id
        { $set: updatedEvent }
    );

    return NextResponse.json({ message: 'Event updated', result });
    }

    export async function DELETE(req: Request) {
    const db = await connectToDatabase();
    const collection = db.collection('events');
    const { id } = await req.json();

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: 'Event deleted', result });
    }
