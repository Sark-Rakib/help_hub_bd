import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface FavoriteDoc extends Document {
  user: mongoose.Types.ObjectId;
  provider: mongoose.Types.ObjectId;
  createdAt: Date;
}

const FavoriteSchema = new Schema<FavoriteDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: Schema.Types.ObjectId, ref: "Provider", required: true },
  },
  { timestamps: true }
);

FavoriteSchema.index({ user: 1, provider: 1 }, { unique: true });
FavoriteSchema.index({ user: 1, createdAt: -1 });

export const Favorite: Model<FavoriteDoc> =
  mongoose.models.Favorite ||
  mongoose.model<FavoriteDoc>("Favorite", FavoriteSchema);

export default Favorite;