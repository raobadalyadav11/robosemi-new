import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);