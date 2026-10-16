const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const uri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;

async function checkAndMigrateSmmPrices() {
  if (!uri) {
    console.error('No MONGODB_URI found in environment variables.');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('Connected successfully.');

  const collection = mongoose.connection.collection('products');

  // Query all products in database where category matches smm, social, or id starts with smm-
  const query = {
    $or: [
      { category: 'smm' },
      { category: 'social' },
      { category: /social/i },
      { category: /smm/i },
      { productId: /^smm-/i },
      { id: /^smm-/i }
    ]
  };

  const smmProducts = await collection.find(query).toArray();
  console.log(`Found ${smmProducts.length} SMM products in MongoDB.`);

  if (smmProducts.length === 0) {
    console.log('No SMM products found in DB.');
    await mongoose.disconnect();
    return;
  }

  console.log('\nCurrent SMM products in DB:');
  smmProducts.forEach((p, idx) => {
    console.log(`${idx + 1}. [${p.productId || p.id}] "${p.title}" - Current Price: ৳${p.price} (USD: ${p.usdPrice || 'N/A'})`);
  });

  const usdRate = 127; // Approx 1 USD = 127 BDT
  const operations = [];

  for (const prod of smmProducts) {
    const currentPrice = Number(prod.price) || 0;
    const newPrice = currentPrice + 5;
    const newOriginalPrice = prod.originalPrice ? Number(prod.originalPrice) + 5 : Math.round(newPrice * 1.2);
    const newUsdPrice = `$${(newPrice / usdRate).toFixed(2)}`;

    // Skip if already migrated
    if (prod.smmPriceMigrated) {
      continue;
    }

    operations.push({
      updateOne: {
        filter: { _id: prod._id },
        update: {
          $set: {
            price: newPrice,
            originalPrice: newOriginalPrice,
            usdPrice: newUsdPrice,
            smmPriceMigrated: true,
            updatedAt: new Date().toISOString()
          }
        }
      }
    });
  }

  if (operations.length > 0) {
    const result = await collection.bulkWrite(operations);
    console.log(`\nSuccessfully updated ${result.modifiedCount} products with +৳5.00.`);
  }

  // Verify updated prices
  const updatedProducts = await collection.find(query).toArray();
  console.log('\nUpdated SMM products in DB:');
  updatedProducts.forEach((p, idx) => {
    console.log(`${idx + 1}. [${p.productId || p.id}] "${p.title}" - New Price: ৳${p.price} (USD: ${p.usdPrice})`);
  });

  await mongoose.disconnect();
  console.log('\nMigration complete.');
}

checkAndMigrateSmmPrices().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
