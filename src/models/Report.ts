import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { ReportTargetType } from "@/types";

export interface ReportDoc extends Document {
  reporter: mongoose.Types.ObjectId;
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  description?: string;
  status: "pending" | "resolved" | "dismissed";
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<ReportDoc>(
  {
    reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetType: {
      type: String,
      enum: ["user", "provider", "review"],
      required: true,
    },
    targetId: { type: String, required: true },
    reason: { type: String, required: true, trim: true },
    description: { type: String, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ["pending", "resolved", "dismissed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

ReportSchema.index({ targetType: 1, targetId: 1 });
ReportSchema.index({ status: 1, createdAt: -1 });
ReportSchema.index({ reporter: 1 });

export const Report: Model<ReportDoc> =
  mongoose.models.Report || mongoose.model<ReportDoc>("Report", ReportSchema);

export default Report;