import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';
import Transaction from '@/lib/models/Transaction';
import Account from '@/lib/models/Account';

// Connect to MongoDB is handled by dbConnect

export async function GET() {
  try {
    await dbConnect();
    const bookings = await Booking.find({}).populate('customer').populate('room');
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const booking = new Booking(body);
    await booking.save();
    await booking.populate('customer');
    await booking.populate('room');
    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Booking ID and status are required' }, { status: 400 });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const oldStatus = booking.status;
    booking.status = status;
    await booking.save();

    // If status changed to 'checked-out', create an income transaction
    if (oldStatus !== 'checked-out' && status === 'checked-out') {
      // Find the first available account to record the income
      const defaultAccount = await Account.findOne();
      if (defaultAccount) {
        const transaction = new Transaction({
          date: new Date(),
          type: 'Income',
          amount: booking.totalAmount,
          description: `Room booking payment - Booking ID: ${booking._id}`,
          account: defaultAccount._id,
          reference: 'Booking',
          referenceId: booking._id,
        });
        await transaction.save();

        // Update account balance
        defaultAccount.balance += booking.totalAmount;
        await defaultAccount.save();
      }
    }

    await booking.populate('customer');
    await booking.populate('room');
    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
