import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Room from '@/lib/models/Room';
import Booking from '@/lib/models/Booking';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const checkInDate = searchParams.get('checkInDate');
    const checkOutDate = searchParams.get('checkOutDate');

    if (!checkInDate || !checkOutDate) {
      // If no dates provided, return all rooms (for debugging)
      const rooms = await Room.find({});
      return NextResponse.json(rooms);
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Find all bookings that overlap with the requested dates and are not cancelled
    const overlappingBookings = await Booking.find({
      $and: [
        { checkInDate: { $lt: checkOut } },
        { checkOutDate: { $gt: checkIn } },
        { status: { $ne: 'cancelled' } }
      ]
    }).select('room');

    // Get room IDs that are booked
    const bookedRoomIds = overlappingBookings.map(booking => booking.room.toString());

    // Find rooms that are available and not booked
    const availableRooms = await Room.find({
      status: { $regex: /^available$/i },
      _id: { $nin: bookedRoomIds }
    });

    return NextResponse.json(availableRooms);
  } catch (error) {
    console.error('Error fetching available rooms:', error);
    return NextResponse.json({ error: 'Failed to fetch available rooms' }, { status: 500 });
  }
}