import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  image: string;
  category: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  components: string[];
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  seoTitle: { type: String },
  seoDescription: { type: String },
  tags: [{ type: String }],
  difficulty: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'], 
    default: 'beginner' 
  },
  estimatedTime: { type: String, required: true },
  components: [{ type: String }]
}, {
  timestamps: true
});

ProjectSchema.index({ title: 'text', description: 'text', tags: 'text' });
ProjectSchema.index({ category: 1, isActive: 1 });
ProjectSchema.index({ difficulty: 1 });

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);