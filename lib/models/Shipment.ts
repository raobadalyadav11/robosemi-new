import mongoose, { Document, Schema } from 'mongoose';

export interface IShipment extends Document {
  order: mongoose.Types.ObjectId;
  shiprocketOrderId: number;
  shipmentId: number;
  awbCode?: string;
  courierCompanyId?: number;
  courierName?: string;
  trackingUrl?: string;
  status: 'created' | 'assigned' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'returned' | 'cancelled';
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  pickupLocation: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  deliveryLocation: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  dimensions: {
    length: number;
    breadth: number;
    height: number;
    weight: number;
  };
  shippingCharges: number;
  codCharges?: number;
  trackingHistory: Array<{
    status: string;
    statusDetail: string;
    date: Date;
    location?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ShipmentSchema = new Schema<IShipment>({
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  shiprocketOrderId: { type: Number, required: true },
  shipmentId: { type: Number, required: true },
  awbCode: { type: String },
  courierCompanyId: { type: Number },
  courierName: { type: String },
  trackingUrl: { type: String },
  status: { 
    type: String, 
    enum: ['created', 'assigned', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'returned', 'cancelled'],
    default: 'created'
  },
  estimatedDelivery: { type: Date },
  actualDelivery: { type: Date },
  pickupLocation: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true }
  },
  deliveryLocation: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true }
  },
  dimensions: {
    length: { type: Number, required: true },
    breadth: { type: Number, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true }
  },
  shippingCharges: { type: Number, required: true },
  codCharges: { type: Number, default: 0 },
  trackingHistory: [{
    status: { type: String, required: true },
    statusDetail: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String }
  }]
}, {
  timestamps: true
});

ShipmentSchema.index({ order: 1 });
ShipmentSchema.index({ awbCode: 1 });
ShipmentSchema.index({ status: 1 });

export default mongoose.models.Shipment || mongoose.model<IShipment>('Shipment', ShipmentSchema);