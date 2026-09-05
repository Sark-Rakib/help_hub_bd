import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ProviderServiceDoc {
  name: string;
  description?: string;
  price: number;
  priceType: "fixed" | "hourly" | "negotiable";
}

export interface WorkHoursDoc {
  day: string;
  open: string;
  close: string;
}

export interface ProviderDoc extends Document {
  user: mongoose.Types.ObjectId;
  businessName: string;
  slug: string;
  category: string;
  description: string;
  about?: string;
  services: ProviderServiceDoc[];
  experience: number;
  location: {
    district: string;
    area: string;
    address?: string;
  };
  phone: string;
  whatsapp?: string;
  email?: string;
  workingHours: WorkHoursDoc[];
  photos: string[];
  avatar?: string;
  verified: boolean;
  featured: boolean;
  featuredAt?: Date;
  rating: number;
  reviewCount: number;
  startingPrice?: number;
  availability: "available" | "busy" | "offline";
  blocked: boolean;
  blockedReason?: string;
  applicationStatus: "pending" | "approved" | "rejected";
  applicationNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProviderServiceSchema = new Schema<ProviderServiceDoc>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    priceType: {
      type: String,
      enum: ["fixed", "hourly", "negotiable"],
      default: "fixed",
    },
  },
  { _id: true }
);

const WorkHoursSchema = new Schema<WorkHoursDoc>(
  {
    day: { type: String, required: true },
    open: { type: String, required: true },
    close: { type: String, required: true },
  },
  { _id: false }
);

const ProviderSchema = new Schema<ProviderDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    businessName: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: { type: String, required: true },
    description: { type: String, required: true, trim: true },
    about: { type: String, trim: true },
    services: { type: [ProviderServiceSchema], default: [] },
    experience: { type: Number, default: 1, min: 0 },
    location: {
      district: { type: String, required: true, default: "Sherpur" },
      area: { type: String, required: true },
      address: { type: String },
    },
    phone: { type: String, required: true },
    whatsapp: { type: String },
    email: { type: String, trim: true, lowercase: true },
    workingHours: { type: [WorkHoursSchema], default: [] },
    photos: { type: [String], default: [] },
    avatar: { type: String },
    verified: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    featuredAt: { type: Date },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    startingPrice: { type: Number, min: 0 },
    availability: {
      type: String,
      enum: ["available", "busy", "offline"],
      default: "available",
    },
    blocked: { type: Boolean, default: false },
    blockedReason: { type: String },
    applicationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
    applicationNote: { type: String },
  },
  { timestamps: true }
);

// Search + filter indexes
ProviderSchema.index({ slug: 1 }, { unique: true });
ProviderSchema.index({ category: 1, "location.district": 1 });
ProviderSchema.index({ category: 1, verified: -1, rating: -1 });
ProviderSchema.index({ verified: -1, featured: -1, rating: -1 });
ProviderSchema.index({ featured: -1, verified: -1 });
ProviderSchema.index({ businessName: "text", description: "text", about: "text" });
ProviderSchema.index({ user: 1 });
ProviderSchema.index({ applicationStatus: 1 });

export const Provider: Model<ProviderDoc> =
  mongoose.models.Provider ||
  mongoose.model<ProviderDoc>("Provider", ProviderSchema);

export default Provider;