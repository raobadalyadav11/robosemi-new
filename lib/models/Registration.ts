import mongoose, { Document, Schema } from 'mongoose';

export interface IRegistration extends Document {
  userName: string;
  userEmail: string;
  userPhone: string;
  trainingId: mongoose.Types.ObjectId;
  registeredAt: Date;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentId?: string;
  amount: number;
  status: 'registered' | 'confirmed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>({
  userName: { type: String, required: true, trim: true },
  userEmail: { 
    type: String, 
    required: true, 
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  userPhone: { 
    type: String, 
    required: true, 
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  trainingId: { type: Schema.Types.ObjectId, ref: 'Training', required: true },
  registeredAt: { type: Date, default: Date.now },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed'], 
    default: 'pending' 
  },
  paymentId: { type: String },
  amount: { type: Number, required: true, min: 0 },
  status: { 
    type: String, 
    enum: ['registered', 'confirmed', 'cancelled'], 
    default: 'registered' 
  },
  notes: { type: String }
}, {
  timestamps: true
});

RegistrationSchema.index({ userEmail: 1, trainingId: 1 }, { unique: true });
RegistrationSchema.index({ trainingId: 1 });
RegistrationSchema.index({ registeredAt: -1 });

export default mongoose.models.Registration || mongoose.model<IRegistration>('Registration', RegistrationSchema);