import mongoose, { Document, Schema } from 'mongoose';

export interface ITraining extends Document {
  title: string;
  description: string;
  image?: string;
  category: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  startDate: Date;
  endDate?: Date;
  price: number;
  instructor: string;
  instructorBio?: string;
  maxParticipants: number;
  currentParticipants: number;
  location: string;
  mode: 'online' | 'offline' | 'hybrid';
  prerequisites: string[];
  learningOutcomes: string[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
}

const TrainingSchema = new Schema<ITraining>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  image: { type: String },
  category: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'], 
    required: true 
  },
  duration: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  price: { type: Number, required: true, min: 0 },
  instructor: { type: String, required: true },
  instructorBio: { type: String },
  maxParticipants: { type: Number, required: true, min: 1 },
  currentParticipants: { type: Number, default: 0 },
  location: { type: String, required: true },
  mode: { 
    type: String, 
    enum: ['online', 'offline', 'hybrid'], 
    required: true 
  },
  prerequisites: [{ type: String }],
  learningOutcomes: [{ type: String }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  seoTitle: { type: String },
  seoDescription: { type: String },
  tags: [{ type: String }]
}, {
  timestamps: true
});

TrainingSchema.index({ title: 'text', description: 'text', tags: 'text' });
TrainingSchema.index({ category: 1, isActive: 1 });
TrainingSchema.index({ startDate: 1 });
TrainingSchema.index({ price: 1 });

export default mongoose.models.Training || mongoose.model<ITraining>('Training', TrainingSchema);