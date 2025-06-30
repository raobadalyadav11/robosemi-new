import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import Shipment from '@/lib/models/Shipment';
import { getUserFromRequest } from '@/lib/auth';
import { shiprocketService } from '@/lib/shiprocket';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const user = getUserFromRequest(request);
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { orderId } = await request.json();

    const order = await Order.findById(orderId).populate('user', 'name email');
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if shipment already exists
    const existingShipment = await Shipment.findOne({ order: orderId });
    if (existingShipment) {
      return NextResponse.json(
        { error: 'Shipment already exists for this order' },
        { status: 400 }
      );
    }

    // Calculate total weight and dimensions
    const totalWeight = order.items.reduce((weight: number, item: { weight: any; quantity: number; }) => weight + (item.weight || 0.5) * item.quantity, 0);
    const dimensions = {
      length: 20, // Default dimensions in cm
      breadth: 15,
      height: 10,
      weight: Math.max(totalWeight, 0.5) // Minimum 0.5kg
    };

    // Prepare Shiprocket order data
    const shiprocketOrderData = {
      order_id: order.orderNumber,
      order_date: order.createdAt.toISOString().split('T')[0],
      pickup_location: "Primary", // Default pickup location
      billing_customer_name: order.billingAddress.name.split(' ')[0],
      billing_last_name: order.billingAddress.name.split(' ').slice(1).join(' ') || '',
      billing_address: order.billingAddress.street,
      billing_city: order.billingAddress.city,
      billing_pincode: order.billingAddress.zipCode,
      billing_state: order.billingAddress.state,
      billing_country: order.billingAddress.country,
      billing_email: order.user.email,
      billing_phone: order.billingAddress.phone,
      shipping_is_billing: order.shippingAddress.street === order.billingAddress.street,
      shipping_customer_name: order.shippingAddress.name.split(' ')[0],
      shipping_last_name: order.shippingAddress.name.split(' ').slice(1).join(' ') || '',
      shipping_address: order.shippingAddress.street,
      shipping_city: order.shippingAddress.city,
      shipping_pincode: order.shippingAddress.zipCode,
      shipping_state: order.shippingAddress.state,
      shipping_country: order.shippingAddress.country,
      shipping_phone: order.shippingAddress.phone,
      order_items: order.items.map((item: { name: any; product: { toString: () => any; }; quantity: any; price: any; }) => ({
        name: item.name,
        sku: item.product.toString(),
        units: item.quantity,
        selling_price: item.price,
        discount: 0,
        tax: 0,
        hsn: 0
      })),
      payment_method: order.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
      shipping_charges: order.shippingCost,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: order.discount,
      sub_total: order.subtotal,
      length: dimensions.length,
      breadth: dimensions.breadth,
      height: dimensions.height,
      weight: dimensions.weight
    };

    // Create order in Shiprocket
    const shiprocketResponse = await shiprocketService.createOrder(shiprocketOrderData);

    // Create shipment record
    const shipment = new Shipment({
      order: orderId,
      shiprocketOrderId: shiprocketResponse.order_id,
      shipmentId: shiprocketResponse.shipment_id,
      status: 'created',
      pickupLocation: {
        name: 'RoboSemi Warehouse',
        address: 'Mumbai, Maharashtra',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        phone: '+91 98765 43210'
      },
      deliveryLocation: {
        name: order.shippingAddress.name,
        address: order.shippingAddress.street,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        pincode: order.shippingAddress.zipCode,
        phone: order.shippingAddress.phone
      },
      dimensions,
      shippingCharges: order.shippingCost,
      codCharges: order.paymentMethod === 'cod' ? order.total * 0.02 : 0 // 2% COD charges
    });

    await shipment.save();

    // Update order status
    order.orderStatus = 'processing';
    await order.save();

    return NextResponse.json({
      success: true,
      shipment,
      shiprocketResponse
    });
  } catch (error) {
    console.error('Error creating shipment:', error);
    return NextResponse.json(
      { error: 'Failed to create shipment' },
      { status: 500 }
    );
  }
}