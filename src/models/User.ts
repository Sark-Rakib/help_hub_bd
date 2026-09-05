import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { Role } from "@/types";

export interface UserDoc extends Document {
  name: string;
  email?: string;
  phone: string;
  password: string;
  role: Role;
  avatar?: string;
  phoneVerified: boolean;
  blocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<UserDoc>(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },
    password: { type: String, required: [true, "Password is required"], minlength: 6 },
    role: {
      type: String,
      enum: ["user", "provider", "admin"],
      default: "user",
    },
    avatar: { type: String },
    phoneVerified: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.index({ phone: 1 }, { unique: true });
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

export const User: Model<UserDoc> =
  mongoose.models.User || mongoose.model<UserDoc>("User", UserSchema);

export default User;