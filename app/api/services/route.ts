import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Service from '@/lib/models/Service';

export async function GET() {
  try {
    await connectDB();
    const services = await Service.find({ isActive: true }).sort({ createdAt: -1 });
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, description, price, category, isActive } = body;

    // Validate required fields
    if (!name || !description || price === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const service = new Service({
      name,
      description,
      price: parseFloat(price),
      category: category || 'General',
      isActive: isActive !== undefined ? isActive : true,
    });

    await service.save();
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}