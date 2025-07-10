import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import User from '@/lib/models/User';
import Product from '@/lib/models/Product';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const user = getUserFromRequest(request);
    if (!user || !['admin', 'staff'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [totalOrders, totalUsers, totalProducts, orders, products] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Product.countDocuments(),
      Order.find().select('total orderStatus'),
      Product.find().select('stock')
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = orders.filter(order => order.orderStatus === 'pending').length;
    const lowStockProducts = products.filter(product => product.stock < 10).length;

    return NextResponse.json({
      totalOrders,
      totalUsers,
      totalProducts,
      totalRevenue,
      pendingOrders,
      lowStockProducts,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}