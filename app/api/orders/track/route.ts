import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import Shipment from '@/lib/models/Shipment';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('order');
    const email = searchParams.get('email');

    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Order number is required' },
        { status: 400 }
      );
    }

    // Find order by order number
    let query: any = { orderNumber };
    
    // If email is provided, add it to query for guest tracking
    if (email) {
      const order = await Order.findOne(query).populate('user', 'email');
      if (!order || order.user.email !== email) {
        return NextResponse.json(
          { error: 'Order not found or email does not match' },
          { status: 404 }
        );
      }
    }

    const order = await Order.findOne(query).populate('user', 'name email');
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Get shipment information if available
    const shipment = await Shipment.findOne({ order: order._id });

    // Create tracking timeline
    const timeline = [
      {
        status: 'Order Placed',
        date: order.createdAt,
        completed: true,
        description: 'Your order has been confirmed'
      },
      {
        status: 'Processing',
        date: order.orderStatus === 'processing' || order.orderStatus === 'shipped' || order.orderStatus === 'delivered' ? order.updatedAt : null,
        completed: ['processing', 'shipped', 'delivered'].includes(order.orderStatus),
        description: 'Order is being prepared'
      },
      {
        status: 'Shipped',
        date: order.orderStatus === 'shipped' || order.orderStatus === 'delivered' ? order.updatedAt : null,
        completed: ['shipped', 'delivered'].includes(order.orderStatus),
        description: 'Order has been shipped'
      },
      {
        status: 'Delivered',
        date: order.orderStatus === 'delivered' ? order.updatedAt : null,
        completed: order.orderStatus === 'delivered',
        description: 'Order has been delivered'
      }
    ];

    return NextResponse.json({
      order: {
        orderNumber: order.orderNumber,
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
        total: order.total,
        items: order.items,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,
        trackingNumber: order.trackingNumber
      },
      shipment: shipment ? {
        awbCode: shipment.awbCode,
        courierName: shipment.courierName,
        status: shipment.status,
        estimatedDelivery: shipment.estimatedDelivery,
        trackingHistory: shipment.trackingHistory
      } : null,
      timeline
    });
  } catch (error) {
    console.error('Error tracking order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}