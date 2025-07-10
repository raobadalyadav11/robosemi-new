import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { getUserFromRequest } from '@/lib/auth';

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

    const userData = await User.findById(user.userId);
    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      addresses: userData.addresses || []
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
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

    const addressData = await request.json();
    
    const userData = await User.findById(user.userId);
    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // If this is set as default, unset other defaults
    if (addressData.isDefault) {
      userData.addresses.forEach((addr: any) => {
        addr.isDefault = false;
      });
    }

    userData.addresses.push(addressData);
    await userData.save();

    return NextResponse.json({
      message: 'Address added successfully',
      addresses: userData.addresses
    });
  } catch (error) {
    console.error('Error adding address:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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
    const addressId = searchParams.get('id');
    const addressData = await request.json();
    
    const userData = await User.findById(user.userId);
    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const addressIndex = userData.addresses.findIndex(
      (addr: any) => addr._id.toString() === addressId
    );
    
    if (addressIndex === -1) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }

    // If this is set as default, unset other defaults
    if (addressData.isDefault) {
      userData.addresses.forEach((addr: any) => {
        addr.isDefault = false;
      });
    }

    userData.addresses[addressIndex] = { ...userData.addresses[addressIndex], ...addressData };
    await userData.save();

    return NextResponse.json({
      message: 'Address updated successfully',
      addresses: userData.addresses
    });
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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
    const addressId = searchParams.get('id');
    
    const userData = await User.findById(user.userId);
    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    userData.addresses = userData.addresses.filter(
      (addr: any) => addr._id.toString() !== addressId
    );
    await userData.save();

    return NextResponse.json({
      message: 'Address deleted successfully',
      addresses: userData.addresses
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}