import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ServiceOrder from '@/lib/models/ServiceOrder';
import Service from '@/lib/models/Service';
import Transaction from '@/lib/models/Transaction';
import Account from '@/lib/models/Account';

export async function GET() {
  try {
    await connectDB();
    const serviceOrders = await ServiceOrder.find()
      .populate('service', 'name price')
      .populate('customer', 'name phone email')
      .populate('booking', 'room checkInDate checkOutDate')
      .sort({ dateProvided: -1 });
    return NextResponse.json(serviceOrders);
  } catch (error) {
    console.error('Error fetching service orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { service, booking, customer, quantity, unitPrice, dateProvided, status, notes } = body;

    // Validate required fields
    if (!service || !customer) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get service details
    const serviceDoc = await Service.findById(service);
    if (!serviceDoc) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const qty = quantity || 1;
    const price = unitPrice || serviceDoc.price;
    const totalAmount = qty * price;

    const serviceOrder = new ServiceOrder({
      service,
      booking,
      customer,
      quantity: qty,
      unitPrice: price,
      totalAmount,
      dateProvided: dateProvided ? new Date(dateProvided) : new Date(),
      status: status || 'Completed',
      notes,
    });

    await serviceOrder.save();

    // Create expense transaction if status is Completed
    if (serviceOrder.status === 'Completed') {
      const defaultAccount = await Account.findOne();
      if (defaultAccount) {
        const transaction = new Transaction({
          date: serviceOrder.dateProvided,
          type: 'Expense',
          amount: serviceOrder.totalAmount,
          description: `Service: ${serviceDoc.name} - Order ID: ${serviceOrder._id}`,
          account: defaultAccount._id,
          reference: 'Service',
          referenceId: serviceOrder._id,
        });
        await transaction.save();

        // Update account balance
        defaultAccount.balance -= serviceOrder.totalAmount;
        await defaultAccount.save();
      }
    }

    const populatedOrder = await ServiceOrder.findById(serviceOrder._id)
      .populate('service', 'name price')
      .populate('customer', 'name phone email')
      .populate('booking', 'room checkInDate checkOutDate');

    return NextResponse.json(populatedOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating service order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}