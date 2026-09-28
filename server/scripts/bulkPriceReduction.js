require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');

// Import services data
const path = require('path');

async function runBulkPriceReduction() {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB Atlas');

    // 1. Load all services definitions from data/services.js using tsx/import or require
    // We can load products from data files directly in JS
    const servicesFilePath = path.resolve(__dirname, '../../data/services.js');
    // Transpile or load services file dynamically if needed, or import
    const { SERVICES } = require(servicesFilePath);

    console.log(`📦 Loaded ${SERVICES.length} products from data files.`);

    // 2. Ensure all products are seeded/upserted into MongoDB Atlas
    console.log('🌱 Upserting all products into MongoDB Atlas...');
    let seededCount = 0;
    for (const item of SERVICES) {
      const isAvailable = item.inStock !== false && item.stock !== 'Out of Stock' && item.stock !== 'Stock Out';
      const productPayload = {
        productId: item.id,
        title: item.title,
        category: item.category, // e.g. "vpn", "sim", "subscriptions", "ip", "smm", "telegram", "email"
        subtitle: item.subtitle || item.badge || '',
        operator: item.operator,
        price: item.price,
        originalPrice: item.originalPrice || (item.price + 20),
        duration: item.validity || item.duration || '30 Days',
        rating: item.rating || 4.8,
        reviews: item.reviews || 120,
        tag: item.badge || item.tag,
        badgeColor: item.badgeColor,
        logo: item.logo || item.image,
        image: item.image || item.logo,
        inStock: isAvailable,
        stock: item.stock || (isAvailable ? 'In Stock' : 'Stock Out'),
        features: item.features || [],
        popular: !!item.popular
      };

      await Product.findOneAndUpdate(
        { productId: item.id },
        { $set: productPayload },
        { upsert: true, returnDocument: 'after' }
      );
      seededCount++;
    }
    console.log(`✅ Upserted ${seededCount} products in MongoDB Atlas.`);

    // 3. Define target categories mapping and filter
    const targetCategoryMap = {
      vpn: 'VPN Services',
      VPN: 'VPN Services',
      sim: 'SIM Offers',
      SIM: 'SIM Offers',
      subscriptions: 'AI Tools',
      Subscriptions: 'AI Tools',
      ip: 'IP & Proxies',
      IP: 'IP & Proxies',
      smm: 'SMM Growth',
      SMM: 'SMM Growth',
      telegram: 'Telegram',
      Telegram: 'Telegram'
    };

    const targetCategories = Object.keys(targetCategoryMap);

    console.log('\n📉 Starting Bulk Price Reduction (-5 BDT) for target categories...');

    // Find target products
    const targetProducts = await Product.find({
      category: { $in: targetCategories }
    });

    console.log(`Found ${targetProducts.length} matching documents in MongoDB Atlas.`);

    const categoryBreakdown = {
      'VPN Services': 0,
      'SIM Offers': 0,
      'AI Tools': 0,
      'IP & Proxies': 0,
      'SMM Growth': 0,
      'Telegram': 0
    };

    let totalUpdated = 0;
    const bulkOps = [];

    for (const doc of targetProducts) {
      const oldPrice = doc.price;
      const newPrice = Math.max(0, oldPrice - 5);

      bulkOps.push({
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: { price: newPrice } }
        }
      });

      const catLabel = targetCategoryMap[doc.category] || doc.category;
      if (categoryBreakdown[catLabel] !== undefined) {
        categoryBreakdown[catLabel]++;
      }
      totalUpdated++;
    }

    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps);
    }

    console.log('\n==================================================');
    console.log('🎉 BULK PRICE REDUCTION SUCCESS LOG');
    console.log('==================================================');
    console.log(`Total Products Updated in MongoDB: ${totalUpdated}`);
    console.log('Category Breakdown:');
    Object.entries(categoryBreakdown).forEach(([cat, count]) => {
      console.log(`  - ${cat}: ${count} products updated (-5 BDT)`);
    });
    console.log('==================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error in bulk price reduction script:', err);
    process.exit(1);
  }
}

runBulkPriceReduction();
