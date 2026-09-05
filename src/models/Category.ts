import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface CategoryDoc extends Document {
  slug: string;
  name: string;
  nameBn: string;
  description: string;
  icon?: string;
  popular: boolean;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<CategoryDoc>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    nameBn: { type: String },
    description: { type: String, trim: true },
    icon: { type: String },
    popular: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CategorySchema.index({ slug: 1 }, { unique: true });
CategorySchema.index({ active: 1, order: 1 });
CategorySchema.index({ popular: 1 });

export const Category: Model<CategoryDoc> =
  mongoose.models.Category ||
  mongoose.model<CategoryDoc>("Category", CategorySchema);

export default Category;