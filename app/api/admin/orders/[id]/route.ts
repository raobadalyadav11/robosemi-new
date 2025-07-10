import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { getUserFromRequest } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    
    const user = getUserFromRequest(request);
    if (!user || !['admin', 'staff'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderStatus, trackingNumber } = await request.json();
    
    const order = await Order.findByIdAndUpdate(
      params.id, 
      { orderStatus, trackingNumber }, 
      { new: true }
    );
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}