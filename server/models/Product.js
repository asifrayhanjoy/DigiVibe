const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    subtitle: { type: String, default: '100% Full Fresh VPN ✅' },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    duration: { type: String, default: '7 Days' },
    rating: { type: Number, default: 4.8 },
    reviews: { type: Number, default: 120 },
    tag: { type: String },
    badgeColor: { type: String },
    logo: { type: String },
    inStock: { type: Boolean, default: true },
    stock: { type: String, default: 'In Stock' },
    features: [{ type: String }],
    popular: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);
