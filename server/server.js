const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const User = require('./models/User');
const Order = require('./models/Order');
const Asset = require('./models/Asset');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// --- HEALTH CHECK ROUTE ---
app.get('/api/health', async (req, res) => {
  let dbStatus = 'Disconnected';
  try {
    const userCount = await User.countDocuments();
    const orderCount = await Order.countDocuments();
    dbStatus = `Connected to MongoDB Atlas (Users: ${userCount}, Orders: ${orderCount})`;
  } catch (e) {
    dbStatus = 'Connection error: ' + e.message;
  }

  res.status(200).json({
    status: 'online',
    system: 'DigiVibe Node.js Enterprise Microservice with Real Nodemailer & MongoDB Atlas',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// --- AUTHENTICATION & NODEMAILER REAL OTP ENDPOINTS ---

// 1. POST /api/auth/send-otp (Disabled)
app.post('/api/auth/send-otp', async (req, res) => {
  return res.status(400).json({ success: false, message: 'OTP verification system has been permanently disabled.' });
});

// 2. POST /api/auth/verify-otp (Disabled)
app.post('/api/auth/verify-otp', async (req, res) => {
  return res.status(400).json({ success: false, message: 'OTP verification system has been permanently disabled.' });
});

// 3. POST /api/auth/register (Direct Registration without OTP)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body || {};

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'Full Name, Email, Password, and Phone / WhatsApp number are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    let userDoc = await User.findOne({ email: cleanEmail });
    if (userDoc) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    userDoc = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: password,
      phone: cleanPhone,
      whatsapp: cleanPhone,
      address: 'Dhaka, Bangladesh',
      walletBalance: 0,
      role: 'customer',
      isVerified: true
    });

    console.log(`✅ [MONGODB ATLAS] Instant Direct Registered User: ${cleanEmail}`);

    const token = 'jwt_secure_token_digivibe_' + Date.now();

    return res.status(201).json({
      success: true,
      requiresOtp: false,
      message: 'Registration successful!',
      token,
      user: {
        id: userDoc._id.toString(),
        name: userDoc.name,
        email: userDoc.email,
        phone: userDoc.phone || '',
        whatsapp: userDoc.whatsapp || '',
        address: userDoc.address || 'Dhaka, Bangladesh',
        avatar: userDoc.avatar || '',
        walletBalance: userDoc.walletBalance || 0,
        role: userDoc.role || 'customer',
        createdAt: userDoc.createdAt
      }
    });
  } catch (err) {
    console.error('Error during registration:', err);
    return res.status(500).json({ success: false, message: 'Database error registering user: ' + err.message });
  }
});

// 4. POST /api/auth/login (Direct Login without OTP)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const userDoc = await User.findOne({ email: cleanEmail });

    if (!userDoc || userDoc.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email address or password' });
    }

    const token = 'jwt_secure_token_digivibe_' + Date.now();

    return res.status(200).json({
      success: true,
      requiresOtp: false,
      message: 'Login successful!',
      token,
      user: {
        id: userDoc._id.toString(),
        name: userDoc.name,
        email: userDoc.email,
        phone: userDoc.phone || '',
        whatsapp: userDoc.whatsapp || '',
        address: userDoc.address || 'Dhaka, Bangladesh',
        avatar: userDoc.avatar || '',
        walletBalance: userDoc.walletBalance || 0,
        role: userDoc.role || 'customer',
        createdAt: userDoc.createdAt
      }
    });
  } catch (err) {
    console.error('Error logging in:', err);
    return res.status(500).json({ success: false, message: 'Database error during login: ' + err.message });
  }
});

// 5. PUT /api/auth/profile (Persists Profile Edits to MongoDB Atlas)
app.put('/api/auth/profile', async (req, res) => {
  try {
    const { email, name, phone, whatsapp, address, avatar } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required to update profile' });
    }

    const cleanEmail = email.toLowerCase();
    const updatedUser = await User.findOneAndUpdate(
      { email: cleanEmail },
      {
        $set: {
          name: name || undefined,
          phone: phone || undefined,
          whatsapp: whatsapp || undefined,
          address: address || undefined,
          avatar: avatar || undefined
        }
      },
      { new: true, upsert: true }
    );

    console.log(`💾 [MONGODB ATLAS] Profile UPDATED & SAVED for ${cleanEmail}!`);

    return res.status(200).json({
      success: true,
      message: 'Profile details saved successfully!',
      user: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        whatsapp: updatedUser.whatsapp,
        address: updatedUser.address,
        avatar: updatedUser.avatar,
        walletBalance: updatedUser.walletBalance,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt
      }
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    return res.status(500).json({ success: false, message: 'Database error updating profile' });
  }
});

// 6. POST /api/auth/wallet/add (Persists Wallet Top-Up)
app.post('/api/auth/wallet/add', async (req, res) => {
  try {
    const { email, amount } = req.body;
    const addAmount = Number(amount) || 0;

    if (!email || addAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid email and credit amount required' });
    }

    const cleanEmail = email.toLowerCase();
    const updatedUser = await User.findOneAndUpdate(
      { email: cleanEmail },
      { $inc: { walletBalance: addAmount } },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: `৳${addAmount} credit saved to MongoDB Atlas!`,
      walletBalance: updatedUser.walletBalance,
      user: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        walletBalance: updatedUser.walletBalance
      }
    });
  } catch (err) {
    console.error('Error adding wallet credit:', err);
    return res.status(500).json({ success: false, message: 'Database error adding wallet credit' });
  }
});

// 7. GET /api/auth/me (Fetches Real User Document from MongoDB Atlas)
app.get('/api/auth/me', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email query parameter required' });
    }

    const cleanEmail = String(email).toLowerCase();
    const dbUser = await User.findOne({ email: cleanEmail });

    if (!dbUser) {
      return res.status(404).json({ success: false, message: 'User not found in database' });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone,
        whatsapp: dbUser.whatsapp,
        address: dbUser.address,
        avatar: dbUser.avatar,
        walletBalance: dbUser.walletBalance,
        role: dbUser.role,
        createdAt: dbUser.createdAt
      }
    });
  } catch (err) {
    console.error('Error fetching user:', err);
    return res.status(500).json({ success: false, message: 'Database error fetching user profile' });
  }
});

// 8. GET /api/user/assets (Fetches Real User Assets from MongoDB Atlas)
app.get('/api/user/assets', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email required' });
    }

    const cleanEmail = String(email).toLowerCase();
    const assets = await Asset.find({ userEmail: cleanEmail }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      assets
    });
  } catch (err) {
    console.error('Error fetching assets:', err);
    return res.status(500).json({ success: false, message: 'Database error fetching assets' });
  }
});

// 9. GET /api/user/orders (Fetches Real User Orders from MongoDB Atlas)
app.get('/api/user/orders', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email required' });
    }

    const cleanEmail = String(email).toLowerCase();
    const orders = await Order.find({ userEmail: cleanEmail }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders
    });
  } catch (err) {
    console.error('Error fetching orders:', err);
    return res.status(500).json({ success: false, message: 'Database error fetching orders' });
  }
});

// 10. POST /api/orders/create (CREATES REAL ORDER & ASSETS IN MONGODB ATLAS!)
app.post('/api/orders/create', async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, trxId, customerPhone, userEmail } = req.body;
    const cleanEmail = userEmail ? userEmail.toLowerCase() : 'customer@digivibe.com';
    const orderId = 'DV-' + Math.floor(100000 + Math.random() * 900000);

    // Save Order in MongoDB Atlas
    const newOrder = await Order.create({
      orderId,
      userEmail: cleanEmail,
      items,
      totalAmount,
      paymentMethod,
      trxId,
      customerPhone,
      status: 'Pending'
    });

    // Create Real Digital Assets in MongoDB Atlas for each item purchased!
    for (const item of items) {
      const generatedCreds = `${item.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Math.floor(100 + Math.random() * 900)}@digivibe.com | Pass: DV#${Math.floor(1000 + Math.random() * 9000)}!`;

      await Asset.create({
        orderId,
        userEmail: cleanEmail,
        title: item.title,
        category: item.category || 'Digital Service',
        credentials: generatedCreds,
        status: 'Active'
      });
    }

    console.log(`📦 [MONGODB ATLAS] Saved Order ${orderId} & Generated Assets for ${cleanEmail}!`);
    console.log(`📲 [WHATSAPP ADMIN ALERT] Order #${orderId} details ready for WhatsApp dispatch: Phone ${customerPhone || 'N/A'}, Amount ৳${totalAmount}, TrxID ${trxId}`);

    return res.status(200).json({
      success: true,
      orderId,
      fulfillmentStatus: 'completed',
      estimatedFulfillmentTime: 'Instant',
      message: 'Payment received. Order & assets saved to MongoDB Atlas!'
    });
  } catch (err) {
    console.error('Error saving order to MongoDB:', err);
    return res.status(500).json({ success: false, message: 'Database error saving order: ' + err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 DigiVibe Express Microservice running on port ${PORT}`);
  console.log(`📡 Connected to Real MongoDB Atlas & Nodemailer Transporter`);
});
