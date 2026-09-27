const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    enum: ['login', 'signup'],
    default: 'login',
  },
  userData: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // Auto delete expired OTP documents from MongoDB Atlas
  }
}, {
  timestamps: true,
});

module.exports = mongoose.models.Otp || mongoose.model('Otp', OtpSchema);
