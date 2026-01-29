import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Account from '@/lib/models/Account';

export async function GET() {
  try {
    await connectDB();
    const accounts = await Account.find().sort({ createdAt: -1 });
    return NextResponse.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, institution, balance, type, accountNumber, description } = body;

    // Validate required fields
    if (!name || !institution || !type || !accountNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if account number already exists
    const existingAccount = await Account.findOne({ accountNumber });
    if (existingAccount) {
      return NextResponse.json({ error: 'Account number already exists' }, { status: 400 });
    }

    const account = new Account({
      name,
      institution,
      balance: balance || 0,
      type,
      accountNumber,
      description,
    });

    await account.save();
    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    console.error('Error creating account:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}