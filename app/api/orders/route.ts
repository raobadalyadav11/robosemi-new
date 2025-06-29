import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import { getUserFromRequest } from '@/lib/auth';
import { sendEmail, generateOrderConfirmationEmail } from '@/lib/email';

function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `RBS${timestamp.slice(-6)}${random}`;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    let query: any = {};
    
    // If not admin/staff, only show user's orders
    if (user.role === 'user') {
      query.user = user.userId;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const orderData = await request.json();
    
    // Validate products and calculate totals
    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of orderData.items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        return NextResponse.json(
          { error: `Product ${item.name} is not available` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const finalPrice = product.discount 
        ? product.price * (1 - product.discount / 100)
        : product.price;

      calculatedSubtotal += finalPrice * item.quantity;
      
      validatedItems.push({
        product: product._id,
        name: product.name,
        price: finalPrice,
        quantity: item.quantity,
        image: product.images[0],
      });

      // Update stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = new Order({
      orderNumber: generateOrderNumber(),
      user: user.userId,
      items: validatedItems,
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress,
      subtotal: calculatedSubtotal,
      discount: orderData.discount || 0,
      shippingCost: orderData.shippingCost || 0,
      tax: orderData.tax || 0,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod,
      couponCode: orderData.couponCode,
      notes: orderData.notes,
    });

    await order.save();
    await order.populate('user', 'name email');

    // Send confirmation email
    try {
      await sendEmail({
        to: order.user.email,
        subject: `Order Confirmation - ${order.orderNumber}`,
        html: generateOrderConfirmationEmail(order),
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}