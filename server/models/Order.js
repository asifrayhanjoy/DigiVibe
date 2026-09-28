const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  userEmail: {
    type: String,
    required: true,
    index: true,
  },
  items: {
    type: Array,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  trxId: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Rejected', 'processing', 'delivered', 'failed', 'refunded'],
    default: 'Pending',
  }
}, {
  timestamps: true,
});

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);
