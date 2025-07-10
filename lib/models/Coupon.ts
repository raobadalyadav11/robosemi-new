import mongoose, { Document, Schema } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  type: { type: String, enum: ['percentage', 'fixed'], required: true },
  value: { type: Number, required: true, min: 0 },
  minOrderValue: { type: Number, default: 0, min: 0 },
  maxDiscount: { type: Number, min: 0 },
  usageLimit: { type: Number, default: 100, min: 1 },
  usedCount: { type: Number, default: 0, min: 0 },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date, required: true }
}, {
  timestamps: true
});

export default mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);