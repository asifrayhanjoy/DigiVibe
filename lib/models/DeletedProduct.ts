import mongoose, { Schema } from "mongoose";

const DeletedProductSchema = new Schema(
  {
    productId: { type: String, required: true, unique: true, index: true },
    deletedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.DeletedProduct || mongoose.model("DeletedProduct", DeletedProductSchema);
