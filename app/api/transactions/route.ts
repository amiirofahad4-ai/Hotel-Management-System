import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/lib/models/Transaction';
import Account from '@/lib/models/Account';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('account');
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let query: any = {};

    if (accountId) query.account = accountId;
    if (type) query.type = type;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const transactions = await Transaction.find(query)
      .populate('account', 'name institution')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments(query);

    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { date, type, amount, description, account, reference, referenceId, category } = body;

    // Validate required fields
    if (!type || !amount || !description || !account || !reference) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create transaction
    const transaction = new Transaction({
      date: date ? new Date(date) : new Date(),
      type,
      amount: parseFloat(amount),
      description,
      account,
      reference,
      referenceId,
      category,
    });

    await transaction.save();

    // Update account balance
    const accountDoc = await Account.findById(account);
    if (!accountDoc) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    if (type === 'Income') {
      accountDoc.balance += parseFloat(amount);
    } else if (type === 'Expense') {
      accountDoc.balance -= parseFloat(amount);
    }

    await accountDoc.save();

    const populatedTransaction = await Transaction.findById(transaction._id).populate('account', 'name institution');

    return NextResponse.json(populatedTransaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}