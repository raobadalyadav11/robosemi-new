import { NextRequest, NextResponse } from 'next/server';
import { shiprocketService } from '@/lib/shiprocket';

export async function POST(request: NextRequest) {
  try {
    const { pickupPostcode, deliveryPostcode, weight, cod } = await request.json();

    if (!pickupPostcode || !deliveryPostcode || !weight) {
      return NextResponse.json(
        { error: 'Pickup postcode, delivery postcode, and weight are required' },
        { status: 400 }
      );
    }

    const rates = await shiprocketService.getShippingRates(
      pickupPostcode,
      deliveryPostcode,
      weight,
      cod || false
    );

    return NextResponse.json(rates);
  } catch (error) {
    console.error('Error calculating shipping rates:', error);
    return NextResponse.json(
      { error: 'Failed to calculate shipping rates' },
      { status: 500 }
    );
  }
}