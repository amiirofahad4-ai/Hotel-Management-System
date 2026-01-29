import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Room from '@/lib/models/Room';

// GET all rooms
export async function GET() {
  try {
    await dbConnect();
    const rooms = await Room.find({});
    return NextResponse.json(rooms);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
  }
}

// CREATE a new room
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const room = await Room.create(body);
    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }
}
