import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { simOfferProducts } from '../../data/simOffers';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;

if (!MONGO_URI) {
  console.error('❌ Missing MONGODB_URI in environment variables.');
  process.exit(1);
}

async function runSimOffersSync() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI!);
    console.log('✅ Connected to MongoDB Atlas successfully.');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection failed.');
    }
    const collection = db.collection('products');

    console.log(`📦 Loaded ${simOfferProducts.length} SIM offers from data/simOffers.ts.`);

    let updatedCount = 0;
    let insertedCount = 0;
    const bulkOps: any[] = [];

    for (const itemObj of simOfferProducts) {
      const item = itemObj as any;
      const isAvailable = item.inStock !== false && item.stock !== 'Out of Stock' && item.stock !== 'Stock Out' && item.stock !== 'Sold Out';
      const finalStock = item.stock || (isAvailable ? 'In Stock' : 'Out of Stock');
      const finalPrice = Number(item.price);
      const originalPrice = item.originalPrice ? Number(item.originalPrice) : Math.round(finalPrice * 1.2);

      const updatePayload = {
        productId: item.id,
        title: item.title.trim(),
        category: 'sim',
        subtitle: item.subtitle || item.badge || '',
        operator: item.operator || '',
        price: finalPrice,
        originalPrice: originalPrice,
        duration: item.duration || item.validity || '30 Days',
        rating: item.rating || 4.8,
        reviews: item.reviews || 120,
        tag: item.badge || item.tag || item.subtitle || '',
        badge: item.badge || item.subtitle || '',
        badgeColor: item.badgeColor || '',
        logo: item.logo || item.image || '',
        image: item.image || item.logo || '',
        icon: item.icon || 'Smartphone',
        inStock: isAvailable,
        stock: finalStock,
        features: Array.isArray(item.features) && item.features.length > 0 ? item.features : ['100% Guaranteed Activation', 'Direct Mobile Recharge', '24/7 Support'],
        popular: !!item.popular,
        delivery: 'Drive Recharge / Instant',
      };

      bulkOps.push({
        updateOne: {
          filter: { productId: item.id },
          update: {
            $set: updatePayload,
            $setOnInsert: { createdAt: new Date() }
          },
          upsert: true
        }
      });
    }

    if (bulkOps.length > 0) {
      console.log(`⚡ Executing bulkWrite for ${bulkOps.length} SIM offers...`);
      const result = await collection.bulkWrite(bulkOps);
      updatedCount = result.modifiedCount;
      insertedCount = result.upsertedCount;
      console.log('✅ bulkWrite completed.');
      console.log(`   - Modified/Updated documents: ${result.modifiedCount}`);
      console.log(`   - Upserted/Inserted documents: ${result.upsertedCount}`);
      console.log(`   - Matched documents: ${result.matchedCount}`);
    }

    // Verify DB count
    const totalSimsInDb = await collection.countDocuments({
      category: { $in: ['sim', 'SIM', 'SIM Offers'] }
    });

    // Sample output of updated items in DB
    const sampleDbItems = await collection.find({
      category: { $in: ['sim', 'SIM', 'SIM Offers'] }
    }).limit(10).toArray();

    console.log('\n==================================================');
    console.log('🎉 SIM OFFERS DATABASE SYNC SUCCESSFUL!');
    console.log('==================================================');
    console.log(`Total SIM Offers in MongoDB Atlas now: ${totalSimsInDb}`);
    console.log('\nSample Updated SIM Offers in MongoDB:');
    sampleDbItems.forEach((p, idx) => {
      console.log(`  ${idx + 1}. [${p.operator}] ${p.title} | Updated Price: ৳${p.price} | ID: ${p.productId}`);
    });
    console.log('==================================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during SIM offers DB sync:', err);
    process.exit(1);
  }
}

runSimOffersSync();
