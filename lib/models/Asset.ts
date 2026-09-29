import mongoose, { Schema } from "mongoose";

const AssetSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    credentials: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Completed", "Expired"],
      default: "Active",
    },
    invoiceUrl: {
      type: String,
      default: "#",
    },
    deliveryNotes: {
      type: String,
      default: "",
    },
    deliveryFiles: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Asset || mongoose.model("Asset", AssetSchema);
