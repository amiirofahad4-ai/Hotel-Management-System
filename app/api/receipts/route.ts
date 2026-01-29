import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Receipt from '@/lib/models/Receipt';
import Customer from '@/lib/models/Customer';
import Booking from '@/lib/models/Booking';
import Account from '@/lib/models/Account';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customer');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let query: any = {};

    if (customerId) query.customer = customerId;
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const receipts = await Receipt.find(query)
      .populate('customer', 'name phone email')
      .populate('booking', 'room checkInDate checkOutDate')
      .populate('account', 'name institution')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Receipt.countDocuments(query);

    return NextResponse.json({
      receipts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching receipts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { customer, booking, paymentMethod, amount, date, description, account, status } = body;

    // Validate required fields
    if (!customer || !paymentMethod || !amount || !account) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify customer exists
    const customerDoc = await Customer.findById(customer);
    if (!customerDoc) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Verify account exists
    const accountDoc = await Account.findById(account);
    if (!accountDoc) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // If booking provided, verify it exists
    if (booking) {
      const bookingDoc = await Booking.findById(booking);
      if (!bookingDoc) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
      }
    }

    const receipt = new Receipt({
      customer,
      booking,
      paymentMethod,
      amount: parseFloat(amount),
      date: date ? new Date(date) : new Date(),
      description,
      account,
      status: status || 'Pending',
    });

    await receipt.save();

    const populatedReceipt = await Receipt.findById(receipt._id)
      .populate('customer', 'name phone email')
      .populate('booking', 'room checkInDate checkOutDate')
      .populate('account', 'name institution');

    return NextResponse.json(populatedReceipt, { status: 201 });
  } catch (error) {
    console.error('Error creating receipt:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}