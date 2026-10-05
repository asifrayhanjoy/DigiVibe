import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;

if (!MONGO_URI) {
  console.error('❌ Missing MONGODB_URI in environment variables.');
  process.exit(1);
}

// VPN Price Spec Mapping
export const vpnTargetSpecs = [
  // Nord VPN: ৳25 & ৳150
  { id: 'vpn-nord-35', title: 'Nord VPN', duration: '7 Days', basePrice: 25, targetPrice: 31 },
  { id: 'vpn-nord-160', title: 'Nord VPN', duration: '30 Days', basePrice: 150, targetPrice: 156 },

  // Proton VPN: ৳45
  { id: 'vpn-proton-55', title: 'Proton VPN', basePrice: 45, targetPrice: 51 },

  // Express VPN: ৳20 & ৳100
  { id: 'vpn-express-30', title: 'Express VPN', duration: '3 Days', basePrice: 20, targetPrice: 26 },
  { id: 'vpn-express-110', title: 'Express VPN', duration: '30 Days', basePrice: 100, targetPrice: 106 },

  // Surfshark VPN: ৳25
  { id: 'vpn-surfshark-35', title: 'Surfshark VPN', basePrice: 25, targetPrice: 31 },

  // IP Vanish VPN: ৳25
  { id: 'vpn-ipvanish-35', title: 'IP Vanish VPN', basePrice: 25, targetPrice: 31 },

  // Avast Secureline VPN: ৳25 & ৳65
  { id: 'vpn-avast-35', title: 'Avast Secureline VPN', duration: '7 Days', basePrice: 25, targetPrice: 31 },
  { id: 'vpn-avast-75', title: 'Avast Secureline VPN', duration: '30 Days', basePrice: 65, targetPrice: 71 },

  // Cyberghost VPN: ৳20
  { id: 'vpn-cyberghost-30', title: 'Cyberghost VPN', basePrice: 20, targetPrice: 26 },

  // HMA VPN: ৳25 & ৳65
  { id: 'vpn-hma-35', title: 'HMA VPN', duration: '7 Days', basePrice: 25, targetPrice: 31 },
  { id: 'vpn-hma-75', title: 'HMA VPN', duration: '30 Days', basePrice: 65, targetPrice: 71 },

  // Potato VPN: ৳25
  { id: 'vpn-potato-35', title: 'Potato VPN', basePrice: 25, targetPrice: 31 },

  // PIA VPN: ৳25 & ৳165
  { id: 'vpn-pia-35', title: 'PIA VPN', duration: '7 Days', basePrice: 25, targetPrice: 31 },
  { id: 'vpn-pia-175', title: 'PIA VPN (Only 1 Device)', duration: '30 Days', basePrice: 165, targetPrice: 171 },

  // Bitdefender VPN: ৳25 & ৳65
  { id: 'vpn-bitdefender-35', title: 'Bitdefender VPN', duration: '7 Days', basePrice: 25, targetPrice: 31 },
  { id: 'vpn-bitdefender-75', title: 'Bitdefender VPN', duration: '30 Days', basePrice: 65, targetPrice: 71 },

  // AVG VPN: ৳25
  { id: 'vpn-avg-35', title: 'AVG VPN', basePrice: 25, targetPrice: 31 },

  // Vypr VPN: ৳20
  { id: 'vpn-vypr-30', title: 'Vypr VPN', basePrice: 20, targetPrice: 26 },

  // X VPN: ৳25
  { id: 'vpn-xvpn-35', title: 'X VPN', basePrice: 25, targetPrice: 31 },

  // Comet VPN: ৳23
  { id: 'vpn-comet-33', title: 'Comet VPN', basePrice: 23, targetPrice: 29 },

  // VPN Proxy Master: ৳25
  { id: 'vpn-proxymaster-35', title: 'VPN Proxy Master', basePrice: 25, targetPrice: 31 },

  // Pure VPN: ৳25
  { id: 'vpn-pure-35', title: 'Pure VPN', basePrice: 25, targetPrice: 31 },

  // Hotspot Shield VPN: ৳25
  { id: 'vpn-hotspot-35', title: 'Hotspot Shield VPN', basePrice: 25, targetPrice: 31 },

  // Goose VPN: ৳25
  { id: 'vpn-goose-35', title: 'Goose VPN', basePrice: 25, targetPrice: 31 },

  // Adguard VPN: ৳25
  { id: 'vpn-adguard-35', title: 'Adguard VPN', basePrice: 25, targetPrice: 31 },

  // Norton VPN: ৳25
  { id: 'vpn-norton-35', title: 'Norton VPN', basePrice: 25, targetPrice: 31 },

  // Turbo VPN: ৳25
  { id: 'vpn-turbo-35', title: 'Turbo VPN', basePrice: 25, targetPrice: 31 },

  // Bebra VPN: ৳20
  { id: 'vpn-bebra-30', title: 'Bebra VPN', basePrice: 20, targetPrice: 26 },

  // Octohide VPN: ৳25 & ৳45
  { id: 'vpn-octohide-35', title: 'Octohide VPN', duration: '7 Days', basePrice: 25, targetPrice: 31 },
  { id: 'vpn-octohide-55', title: 'Octohide VPN (Pro)', duration: '14 Days', basePrice: 45, targetPrice: 51 },

  // Panda VPN: ৳20
  { id: 'vpn-panda-30', title: 'Panda VPN', basePrice: 20, targetPrice: 26 },

  // Quark VPN: ৳25
  { id: 'vpn-quark-35', title: 'Quark VPN', basePrice: 25, targetPrice: 31 },

  // Sky VPN: ৳25
  { id: 'vpn-sky-35', title: 'Sky VPN', basePrice: 25, targetPrice: 31 },

  // G-Data VPN: ৳25
  { id: 'vpn-gdata-35', title: 'G-Data VPN', basePrice: 25, targetPrice: 31 },

  // VPN 360: ৳25
  { id: 'vpn-360-35', title: 'VPN 360', basePrice: 25, targetPrice: 31 },

  // Mysterium VPN: ৳1400
  { id: 'vpn-mysterium-1410', title: 'Mysterium VPN', basePrice: 1400, targetPrice: 1406 },

  // Ultra VPN: ৳25
  { id: 'vpn-ultra-35', title: 'Ultra VPN', basePrice: 25, targetPrice: 31 }
];

export async function runSmartVpnUpdate() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI!);
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database connection failed.');

    const collection = db.collection('products');

    const dbProducts = await collection.find({
      category: { $in: ['vpn', 'VPN', 'VPN Services'] }
    }).toArray();

    console.log(`🔍 Found ${dbProducts.length} VPN cards in MongoDB Atlas.`);

    const bulkOps: any[] = [];
    const logs: string[] = [];
    let updatedCount = 0;
    let untouchedCount = 0;

    for (const doc of dbProducts) {
      const spec = vpnTargetSpecs.find(s => {
        if (s.id && (doc.productId === s.id || doc.id === s.id)) return true;
        if (s.duration && doc.duration) {
          return doc.title.trim().toLowerCase() === s.title.toLowerCase() && doc.duration === s.duration;
        }
        return doc.title.trim().toLowerCase() === s.title.toLowerCase();
      });

      if (!spec) {
        logs.push(`🛡️ [EXTRA / UNMATCHED] "${doc.title}" (ID: ${doc.productId}) - DB Price: ৳${doc.price} -> REMAINS UNTOUCHED`);
        untouchedCount++;
        continue;
      }

      const currentPrice = Number(doc.price);
      const targetPrice = spec.targetPrice;

      // Smart rule: If current DB price < targetPrice (i.e. <= basePrice or lower/equal), update to targetPrice (+6 BDT over base).
      // If current DB price is already higher than targetPrice, leave untouched.
      if (currentPrice < targetPrice) {
        bulkOps.push({
          updateOne: {
            filter: { _id: doc._id },
            update: { $set: { price: targetPrice } }
          }
        });
        logs.push(`✅ [UPDATED] "${doc.title}" (${doc.duration || ''}) - Old DB Price: ৳${currentPrice} <= Target: ৳${targetPrice} -> NEW PRICE: ৳${targetPrice}`);
        updatedCount++;
      } else {
        logs.push(`🛡️ [ALREADY HIGHER / UNTOUCHED] "${doc.title}" (${doc.duration || ''}) - Current DB Price: ৳${currentPrice} >= Target: ৳${targetPrice} -> REMAINS UNTOUCHED`);
        untouchedCount++;
      }
    }

    if (bulkOps.length > 0) {
      await collection.bulkWrite(bulkOps);
    }

    console.log('\n==================================================');
    console.log('🎉 SMART VPN PRICE UPDATE EXECUTION SUMMARY');
    console.log('==================================================');
    logs.forEach(l => console.log(l));
    console.log('--------------------------------------------------');
    console.log(`Total DB VPN Cards Processed: ${dbProducts.length}`);
    console.log(`Total Cards Updated (+6 BDT Markup): ${updatedCount}`);
    console.log(`Total Cards Untouched (Higher / Extra): ${untouchedCount}`);
    console.log('==================================================\n');

    await mongoose.disconnect();
    return { success: true, updatedCount, untouchedCount, total: dbProducts.length, logs };
  } catch (err: any) {
    console.error('❌ Error during smart VPN price update:', err);
    throw err;
  }
}

if (require.main === module) {
  runSmartVpnUpdate().then(() => process.exit(0)).catch(() => process.exit(1));
}
