import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalytics extends Document {
  type: 'page_view' | 'product_view' | 'add_to_cart' | 'purchase' | 'search' | 'email_open' | 'email_click';
  userId?: mongoose.Types.ObjectId;
  sessionId: string;
  productId?: mongoose.Types.ObjectId;
  orderId?: mongoose.Types.ObjectId;
  campaignId?: mongoose.Types.ObjectId;
  page?: string;
  searchQuery?: string;
  value?: number;
  metadata: Record<string, any>;
  userAgent: string;
  ipAddress: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  createdAt: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>({
  type: { 
    type: String, 
    enum: ['page_view', 'product_view', 'add_to_cart', 'purchase', 'search', 'email_open', 'email_click'],
    required: true 
  },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  sessionId: { type: String, required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign' },
  page: { type: String },
  searchQuery: { type: String },
  value: { type: Number },
  metadata: { type: Schema.Types.Mixed, default: {} },
  userAgent: { type: String, required: true },
  ipAddress: { type: String, required: true },
  referrer: { type: String },
  utmSource: { type: String },
  utmMedium: { type: String },
  utmCampaign: { type: String },
  utmTerm: { type: String },
  utmContent: { type: String }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

AnalyticsSchema.index({ type: 1, createdAt: -1 });
AnalyticsSchema.index({ userId: 1, createdAt: -1 });
AnalyticsSchema.index({ sessionId: 1 });

export default mongoose.models.Analytics || mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);