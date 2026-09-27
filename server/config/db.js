const mongoose = require('mongoose');

const connectDB = async () => {
  const connUri = process.env.MONGO_URI || process.env.DATABASE_URL;

  if (!connUri) {
    console.error('❌ MONGODB_ERROR: Neither MONGO_URI nor DATABASE_URL is defined in .env!');
    return;
  }

  try {
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ Connected to MongoDB Atlas: ${conn.connection.name || 'DigiVibe'}`);
    console.log(`📡 Host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Atlas Connection Error: ${error.message}`);
    // Non-fatal warning in development mode to allow offline fallback
  }
};

module.exports = connectDB;
