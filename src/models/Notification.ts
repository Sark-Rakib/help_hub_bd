import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { NotificationType } from "@/types";

export interface NotificationDoc extends Document {
  user: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<NotificationDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        "new_request",
        "request_accepted",
        "request_rejected",
        "request_completed",
        "new_review",
        "provider_verified",
        "admin_announcement",
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

NotificationSchema.index({ user: 1, read: 1, createdAt: -1 });

export const Notification: Model<NotificationDoc> =
  mongoose.models.Notification ||
  mongoose.model<NotificationDoc>("Notification", NotificationSchema);

export default Notification;