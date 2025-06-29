import mongoose, { Document, Schema } from 'mongoose';

export interface ILead extends Document {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: 'website' | 'social' | 'email' | 'referral' | 'advertisement' | 'other';
  campaign?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  score: number;
  interests: string[];
  notes: string;
  assignedTo?: mongoose.Types.ObjectId;
  lastContactedAt?: Date;
  convertedAt?: Date;
  value?: number;
  tags: string[];
  customFields: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, trim: true },
  company: { type: String, trim: true },
  source: { 
    type: String, 
    enum: ['website', 'social', 'email', 'referral', 'advertisement', 'other'],
    default: 'website'
  },
  campaign: { type: String },
  utmSource: { type: String },
  utmMedium: { type: String },
  utmCampaign: { type: String },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'],
    default: 'new'
  },
  score: { type: Number, default: 0, min: 0, max: 100 },
  interests: [{ type: String }],
  notes: { type: String, default: '' },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  lastContactedAt: { type: Date },
  convertedAt: { type: Date },
  value: { type: Number, min: 0 },
  tags: [{ type: String }],
  customFields: { type: Schema.Types.Mixed, default: {} }
}, {
  timestamps: true
});

LeadSchema.index({ email: 1 });
LeadSchema.index({ status: 1 });
LeadSchema.index({ source: 1 });
LeadSchema.index({ assignedTo: 1 });
LeadSchema.index({ createdAt: -1 });

export default mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);