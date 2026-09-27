const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
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
    enum: ['Active', 'Completed', 'Expired'],
    default: 'Active',
  },
  invoiceUrl: {
    type: String,
    default: '#',
  }
}, {
  timestamps: true,
});

module.exports = mongoose.models.Asset || mongoose.model('Asset', AssetSchema);
