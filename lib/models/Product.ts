import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    productId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    category: { type: String, required: true, index: true },
    subtitle: { type: String },
    operator: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    duration: { type: String, default: "7 Days" },
    rating: { type: Number, default: 4.8 },
    reviews: { type: Number, default: 120 },
    tag: { type: String },
    badge: { type: String },
    badgeColor: { type: String },
    logo: { type: String },
    image: { type: String },
    logoType: { type: String },
    icon: { type: String, default: "Sparkles" },
    inStock: { type: Boolean, default: true },
    stock: { type: String, default: "In Stock" },
    features: [{ type: String }],
    popular: { type: Boolean, default: false },
    usdPrice: { type: String },
    unit: { type: String },
    delivery: { type: String },
    description: { type: String },
    overview: { type: String },
    minQuantity: { type: Number },
    maxQuantity: { type: Number },
    terms: { type: String },
    priceNote: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
