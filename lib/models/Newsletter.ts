import mongoose, { Document, Schema } from 'mongoose';

export interface INewsletter extends Document {
  email: string;
  name?: string;
  source: string;
  interests: string[];
  status: 'active' | 'unsubscribed' | 'bounced';
  tags: string[];
  customFields: Record<string, any>;
  subscribedAt: Date;
  unsubscribedAt?: Date;
  lastEmailSent?: Date;
  emailsSent: number;
  emailsOpened: number;
  emailsClicked: number;
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterSchema = new Schema<INewsletter>({
  email: { type: String, required: true, unique: true, lowercase: true },
  name: { type: String, trim: true },
  source: { type: String, required: true },
  interests: [{ type: String }],
  status: { type: String, enum: ['active', 'unsubscribed', 'bounced'], default: 'active' },
  tags: [{ type: String }],
  customFields: { type: Schema.Types.Mixed, default: {} },
  subscribedAt: { type: Date, default: Date.now },
  unsubscribedAt: { type: Date },
  lastEmailSent: { type: Date },
  emailsSent: { type: Number, default: 0 },
  emailsOpened: { type: Number, default: 0 },
  emailsClicked: { type: Number, default: 0 }
}, {
  timestamps: true
});

NewsletterSchema.index({ email: 1 });
NewsletterSchema.index({ status: 1 });

export default mongoose.models.Newsletter || mongoose.model<INewsletter>('Newsletter', NewsletterSchema);