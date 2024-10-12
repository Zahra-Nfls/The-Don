import { NextResponse } from 'next/server';

type Bill = {
    name: string;
    dueDate: string;
    amount: number;
};

let bills: Bill[] = []; // Explicitly typed array

export async function POST(request: Request) {
    const newBill = await request.json();
    bills.push(newBill); // Add new bill to the array
    return NextResponse.json(bills);
}
