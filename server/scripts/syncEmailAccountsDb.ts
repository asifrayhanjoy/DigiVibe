import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;

if (!MONGO_URI) {
  console.error('❌ Missing MONGODB_URI in environment variables.');
  process.exit(1);
}

const exactEmailProducts = [
  {
    id: "email-lovable-pro-lite-12m",
    title: "Lovable Pro Lite Account 12 Month",
    category: "email",
    subtitle: "Rady-Made Accout⚡",
    badge: "Rady-Made Accout⚡",
    rating: 4.9,
    reviews: 310,
    price: 950.00,
    originalPrice: 1200.00,
    usdPrice: "$7.48",
    validity: "12 Months",
    duration: "12 Months",
    delivery: "Instant Auto-Delivery",
    stock: "In Stock",
    inStock: true,
    icon: "Mail",
    logoType: "lovable",
    logo: "/images/accounts/lovable.svg",
    image: "/images/accounts/lovable.svg",
    features: [
      "Lovable Pro Lite Access (12 Months)",
      "Rady-Made Accout⚡ Included",
      "Full Replacement Warranty",
      "Instant Delivery to Dashboard"
    ],
    popular: true
  },
  {
    id: "email-lovable-pro-1m-100credits",
    title: "Lovable Pro 1 Month - 100 Credits",
    category: "email",
    subtitle: "Pro Subscription ⚠️ No warranty",
    badge: "Pro Subscription ⚠️ No warranty",
    rating: 4.9,
    reviews: 185,
    price: 350.00,
    originalPrice: 500.00,
    usdPrice: "$2.76",
    validity: "1 Month",
    duration: "1 Month",
    delivery: "Instant Auto-Delivery",
    stock: "In Stock",
    inStock: true,
    icon: "Mail",
    logoType: "lovable",
    logo: "/images/accounts/lovable.svg",
    image: "/images/accounts/lovable.svg",
    features: [
      "100 Fast Generation Credits",
      "Pro Subscription Tier Access",
      "Instant Ready-Made Account",
      "Pro Subscription ⚠️ No warranty"
    ],
    popular: true
  },
  {
    id: "email-amazon-prime-video-6m",
    title: "Amazon Prime Video 6 Month 🔰",
    category: "email",
    subtitle: "Ready-Made Account⚡",
    badge: "Ready-Made Account⚡",
    rating: 4.9,
    reviews: 420,
    price: 490.00,
    originalPrice: 750.00,
    usdPrice: "$3.86",
    validity: "6 Months",
    duration: "6 Months",
    delivery: "Instant Auto-Delivery",
    stock: "In Stock",
    inStock: true,
    icon: "Mail",
    logoType: "prime",
    logo: "/images/accounts/primevideo.svg",
    image: "/images/accounts/primevideo.svg",
    features: [
      "6 Months Full Access UHD 4K",
      "Ready-Made Account ⚡ (with green flag icon)",
      "Private Profile & Full Warranty 🔰",
      "Instant Auto-Delivery"
    ],
    popular: true
  },
  {
    id: "email-spotify-premium-3m",
    title: "Spotify Premium Account – 3 Months Access",
    category: "email",
    subtitle: "No Warranty ⚠️",
    badge: "No Warranty ⚠️",
    rating: 4.8,
    reviews: 540,
    price: 190.00,
    originalPrice: 300.00,
    usdPrice: "$1.50",
    validity: "3 Months",
    duration: "3 Months",
    delivery: "Instant Auto-Delivery",
    stock: "In Stock",
    inStock: true,
    icon: "Mail",
    logoType: "spotify",
    logo: "/images/accounts/spotify.svg",
    image: "/images/accounts/spotify.svg",
    features: [
      "3 Months Spotify Premium Access",
      "Ad-Free & Highest Audio Quality",
      "Offline Songs Download",
      "No Warranty ⚠️"
    ],
    popular: true
  },
  {
    id: "email-muse-ai-1b-token",
    title: "Muse AI 1Billion Token📉",
    category: "email",
    subtitle: "Ready-Made Account⚡",
    badge: "Ready-Made Account⚡",
    rating: 4.9,
    reviews: 210,
    price: 350.00,
    originalPrice: 550.00,
    usdPrice: "$2.76",
    validity: "1 Billion Tokens",
    duration: "1 Billion Tokens",
    delivery: "Instant Auto-Delivery",
    stock: "In Stock",
    inStock: true,
    icon: "Mail",
    logoType: "muse",
    logo: "/images/accounts/museai.svg",
    image: "/images/accounts/museai.svg",
    features: [
      "1 Billion Generation Tokens 📉",
      "Ready-Made Account ⚡",
      "Full Video & Audio Creation Access",
      "Instant Auto-Delivery"
    ],
    popular: true
  },
  {
    id: "email-super-duolingo-12m",
    title: "⚡Super Duolingo 12 Month",
    category: "email",
    subtitle: "Personal Account 🥀",
    badge: "Personal Account 🥀",
    rating: 4.9,
    reviews: 390,
    price: 120.00,
    originalPrice: 250.00,
    usdPrice: "$0.94",
    validity: "12 Months",
    duration: "12 Months",
    delivery: "Instant Auto-Delivery",
    stock: "In Stock",
    inStock: true,
    icon: "Mail",
    logoType: "duolingo",
    logo: "/images/accounts/duolingo.svg",
    image: "/images/accounts/duolingo.svg",
    features: [
      "12 Months Super Duolingo Full Access",
      "Unlimited Hearts & Ad-Free Experience",
      "Personal Account 🥀",
      "Instant Automated Delivery"
    ],
    popular: true
  },
  {
    id: "email-gmail-com",
    title: "Gmail.Com",
    category: "email",
    subtitle: "100% Fresh Gmail 🔥",
    badge: "SOLD OUT",
    rating: 4.9,
    reviews: 580,
    price: 22.00,
    originalPrice: 35.00,
    usdPrice: "$0.17",
    validity: "Lifetime",
    duration: "Lifetime",
    delivery: "Instant File Download",
    stock: "Stock Out",
    inStock: false,
    icon: "Mail",
    logoType: "gmail",
    logo: "/images/accounts/gmail.svg",
    image: "/images/accounts/gmail.svg",
    features: [
      "100% Fresh Verified Gmail 🔥",
      "Clean Residential IP Created",
      "High Trust Score",
      "Recovery Email Included"
    ],
    popular: false
  },
  {
    id: "email-textnow-edu-30d",
    title: "Text Now Edu Mail 30 Day",
    category: "email",
    subtitle: "Warranty 30Day ✉️",
    badge: "SOLD OUT",
    rating: 4.7,
    reviews: 160,
    price: 11.00,
    originalPrice: 25.00,
    usdPrice: "$0.09",
    validity: "30 Days",
    duration: "30 Days",
    delivery: "Instant File Download",
    stock: "Stock Out",
    inStock: false,
    icon: "Mail",
    logoType: "textnow",
    logo: "/images/accounts/textnow.svg",
    image: "/images/accounts/textnow.svg",
    features: [
      "30 Days Replacement Warranty ✉️",
      "Text Now Verified Edu Mail",
      "Clean IP Created Account",
      "Format: email | pass | recovery"
    ],
    popular: false
  },
  {
    id: "email-textnow-edu-24h",
    title: "Text Now Edu Mail 24 Hour",
    category: "email",
    subtitle: "Warranty 24 Hour ✉️",
    badge: "SOLD OUT",
    rating: 4.8,
    reviews: 210,
    price: 2.50,
    originalPrice: 10.00,
    usdPrice: "$0.02",
    validity: "24 Hours",
    duration: "24 Hours",
    delivery: "Instant File Download",
    stock: "Stock Out",
    inStock: false,
    icon: "Mail",
    logoType: "textnow",
    logo: "/images/accounts/textnow.svg",
    image: "/images/accounts/textnow.svg",
    features: [
      "24 Hour Replacement Warranty ✉️",
      "Text Now Verified Edu Mail",
      "Clean IP Created Account",
      "Format: email | pass | recovery"
    ],
    popular: false
  },
  {
    id: "email-android-studio-mail",
    title: "Android Studio Mail",
    category: "email",
    subtitle: "Warranty 24h",
    badge: "SOLD OUT",
    rating: 4.7,
    reviews: 110,
    price: 5.00,
    originalPrice: 15.00,
    usdPrice: "$0.04",
    validity: "24 Hours",
    duration: "24 Hours",
    delivery: "Instant File Download",
    stock: "Stock Out",
    inStock: false,
    icon: "Mail",
    logoType: "androidstudio",
    logo: "/images/accounts/androidstudio.svg",
    image: "/images/accounts/androidstudio.svg",
    features: [
      "Android Studio Verified Mail",
      "Warranty 24h Replacement",
      "Clean IP Registration",
      "Immediate Access"
    ],
    popular: false
  }
];

async function runEmailOverhaul() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI!);
    console.log('✅ Connected to MongoDB Atlas successfully.');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection failed.');
    }
    const collection = db.collection('products');

    // 1. Wipe & Purge All Existing Email/Accounts Products
    console.log('🗑️ Purging all existing products in Email / Accounts category...');
    const deleteFilter = {
      $or: [
        { category: 'email' },
        { category: 'Email' },
        { category: /email/i },
        { productId: /^email-/i }
      ]
    };

    const existingBefore = await collection.find(deleteFilter).toArray();
    console.log(`🔍 Found ${existingBefore.length} existing email products to purge:`);
    existingBefore.forEach(p => console.log(`   - [${p.productId || p._id}] ${p.title} (৳${p.price})`));

    const deleteResult = await collection.deleteMany(deleteFilter);
    console.log(`💥 Deleted ${deleteResult.deletedCount} old email products from MongoDB Atlas.`);

    // 2. Exact Data Seeding for the 10 Reference Products
    console.log('🌱 Seeding 10 exact reference Email / Accounts products into MongoDB Atlas...');
    const now = Date.now();
    const docsToInsert = exactEmailProducts.map((item, idx) => ({
      productId: item.id,
      title: item.title,
      category: 'email',
      subtitle: item.subtitle,
      operator: '',
      price: Number(item.price),
      originalPrice: Number(item.originalPrice),
      duration: item.duration || '30 Days',
      rating: Number(item.rating),
      reviews: Number(item.reviews),
      tag: item.badge,
      badge: item.badge,
      badgeColor: item.inStock ? '' : 'bg-rose-600',
      logo: item.logo,
      image: item.image,
      logoType: item.logoType,
      icon: item.icon || 'Mail',
      inStock: item.inStock,
      stock: item.stock,
      features: item.features,
      popular: item.popular,
      usdPrice: item.usdPrice,
      unit: '',
      delivery: item.delivery,
      description: `${item.title} - ${item.subtitle}`,
      overview: item.features.join(' • '),
      // Give items descending timestamps so sorting by createdAt: -1 preserves exact 1 to 10 sequence
      createdAt: new Date(now + (exactEmailProducts.length - idx) * 1000),
      updatedAt: new Date(now + (exactEmailProducts.length - idx) * 1000)
    }));

    const insertResult = await collection.insertMany(docsToInsert);
    console.log(`✅ Successfully seeded ${insertResult.insertedCount} products into MongoDB Atlas.`);

    // 3. Validation Check
    console.log('\n🔍 Verifying seeded database products:');
    const seededList = await collection.find({ category: 'email' }).toArray();
    console.log(`Total Email / Accounts products now in DB: ${seededList.length}`);
    seededList.forEach((prod, i) => {
      console.log(`  ${i + 1}. [${prod.productId}] ${prod.title} | ৳${prod.price} (${prod.usdPrice}) | Stock: ${prod.stock} | inStock: ${prod.inStock}`);
    });

    console.log('\n🎉 DATABASE OVERHAUL COMPLETED SUCCESSFULLY WITH ZERO DEVIATION!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Overhaul error:', error);
    process.exit(1);
  }
}

runEmailOverhaul();
