import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  discount?: number;
  images: string[];
  category: string;
  subcategory?: string;
  brand: string;
  sku: string;
  stock: number;
  minStock: number;
  specifications: Record<string, any>;
  tags: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  seoTitle?: string;
  seoDescription?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  discount: { type: Number, min: 0, max: 100 },
  images: [{ type: String, required: true }],
  category: { type: String, required: true },
  subcategory: { type: String },
  brand: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  stock: { type: Number, required: true, min: 0 },
  minStock: { type: Number, default: 5 },
  specifications: { type: Schema.Types.Mixed, default: {} },
  tags: [{ type: String }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  weight: { type: Number },
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number }
  },
  seoTitle: { type: String },
  seoDescription: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ rating: -1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);