import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Shipment from '@/lib/models/Shipment';
import { shiprocketService } from '@/lib/shiprocket';

export async function GET(
  request: NextRequest,
  { params }: { params: { awb: string } }
) {
  try {
    await connectDB();
    
    const awbCode = params.awb;

    // Get tracking info from Shiprocket
    const trackingData = await shiprocketService.trackShipment(awbCode);

    // Update local shipment record
    const shipment = await Shipment.findOne({ awbCode });
    if (shipment && trackingData.tracking_data) {
      const latestStatus = trackingData.tracking_data.track_status;
      shipment.status = mapShiprocketStatus(latestStatus);
      
      // Update tracking history
      if (trackingData.tracking_data.shipment_track) {
        shipment.trackingHistory = trackingData.tracking_data.shipment_track.map((track: any) => ({
          status: track.current_status,
          statusDetail: track.status_detail,
          date: new Date(track.date),
          location: track.location
        }));
      }

      await shipment.save();
    }

    return NextResponse.json({
      success: true,
      trackingData,
      shipment
    });
  } catch (error) {
    console.error('Error tracking shipment:', error);
    return NextResponse.json(
      { error: 'Failed to track shipment' },
      { status: 500 }
    );
  }
}

function mapShiprocketStatus(shiprocketStatus: string): string {
  const statusMap: Record<string, string> = {
    'Order Confirmed': 'created',
    'Pickup Generated': 'assigned',
    'Picked Up': 'picked_up',
    'In Transit': 'in_transit',
    'Out For Delivery': 'out_for_delivery',
    'Delivered': 'delivered',
    'RTO Initiated': 'returned',
    'Cancelled': 'cancelled'
  };

  return statusMap[shiprocketStatus] || 'created';
}