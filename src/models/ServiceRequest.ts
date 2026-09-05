import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { RequestStatus } from "@/types";

export interface ServiceRequestDoc extends Document {
  user: mongoose.Types.ObjectId;
  provider: mongoose.Types.ObjectId;
  service: string;
  description: string;
  location: {
    district: string;
    area: string;
    address?: string;
  };
  preferredDate: string;
  preferredTime?: string;
  budget?: number;
  phone: string;
  photos: string[];
  status: RequestStatus;
  emergency: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceRequestSchema = new Schema<ServiceRequestDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: Schema.Types.ObjectId, ref: "Provider", required: true },
    service: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    location: {
      district: { type: String, required: true, default: "Sherpur" },
      area: { type: String, required: true },
      address: { type: String },
    },
    preferredDate: { type: String, required: true },
    preferredTime: { type: String },
    budget: { type: Number, min: 0 },
    phone: { type: String, required: true },
    photos: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending",
    },
    emergency: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ServiceRequestSchema.index({ user: 1, status: 1, createdAt: -1 });
ServiceRequestSchema.index({ provider: 1, status: 1, createdAt: -1 });
ServiceRequestSchema.index({ provider: 1, status: 1 });
ServiceRequestSchema.index({ status: 1, createdAt: -1 });
ServiceRequestSchema.index({ emergency: 1, createdAt: -1 });

export const ServiceRequest: Model<ServiceRequestDoc> =
  mongoose.models.ServiceRequest ||
  mongoose.model<ServiceRequestDoc>("ServiceRequest", ServiceRequestSchema);

export default ServiceRequest;