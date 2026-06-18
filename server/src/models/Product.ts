import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  category: mongoose.Types.ObjectId;
  image?: string;
  isAvailable: boolean;
  order: number;
  allergens?: string[];
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    image: { type: String },
    isAvailable: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    allergens: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', ProductSchema);
