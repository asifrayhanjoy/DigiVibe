import fs from 'fs';
import path from 'path';
import { vpnTargetSpecs } from './smartVpnPriceUpdate';

function updateStaticFiles() {
  console.log("🔄 Syncing static codebase data files with smart VPN prices (+6 BDT)...");

  // Map for easy ID / Title lookup
  const specMap = new Map();
  vpnTargetSpecs.forEach(s => {
    if (s.id) specMap.set(s.id, s.targetPrice);
  });

  // 1. Update data/products.ts
  const productsTsPath = path.resolve(__dirname, '../../data/products.ts');
  let productsCode = fs.readFileSync(productsTsPath, 'utf8');

  vpnTargetSpecs.forEach(s => {
    if (s.id && s.targetPrice) {
      // Regex to match object with id: "s.id", ... price: N
      const regex = new RegExp(`(id:\\s*["']${s.id}["'][\\s\\S]*?price:\\s*)(\\d+)`, 'g');
      productsCode = productsCode.replace(regex, (m, p1, p2) => {
        const curPrice = parseInt(p2, 10);
        if (curPrice < s.targetPrice) {
          return `${p1}${s.targetPrice}`;
        }
        return m;
      });
    }
  });
  fs.writeFileSync(productsTsPath, productsCode, 'utf8');
  console.log("✅ data/products.ts updated.");

  // 2. Update server/seed/products.js
  const seedProductsPath = path.resolve(__dirname, '../seed/products.js');
  let seedCode = fs.readFileSync(seedProductsPath, 'utf8');

  vpnTargetSpecs.forEach(s => {
    if (s.id && s.targetPrice) {
      const regex = new RegExp(`(id:\\s*["']${s.id}["'][\\s\\S]*?price:\\s*)(\\d+)`, 'g');
      seedCode = seedCode.replace(regex, (m, p1, p2) => {
        const curPrice = parseInt(p2, 10);
        if (curPrice < s.targetPrice) {
          return `${p1}${s.targetPrice}`;
        }
        return m;
      });
    }
  });
  fs.writeFileSync(seedProductsPath, seedCode, 'utf8');
  console.log("✅ server/seed/products.js updated.");

  console.log("🎉 All static codebase data files synchronized.");
}

updateStaticFiles();
