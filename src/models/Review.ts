import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ReviewDoc extends Document {
  user: mongoose.Types.ObjectId;
  provider: mongoose.Types.ObjectId;
  serviceRequest: mongoose.Types.ObjectId;
  rating: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<ReviewDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: Schema.Types.ObjectId, ref: "Provider", required: true },
    serviceRequest: {
      type: Schema.Types.ObjectId,
      ref: "ServiceRequest",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

// A user can review a provider only once per completed request
ReviewSchema.index(
  { user: 1, serviceRequest: 1 },
  { unique: true }
);
ReviewSchema.index({ provider: 1, createdAt: -1 });
ReviewSchema.index({ provider: 1, rating: -1 });

export const Review: Model<ReviewDoc> =
  mongoose.models.Review || mongoose.model<ReviewDoc>("Review", ReviewSchema);

export default Review;