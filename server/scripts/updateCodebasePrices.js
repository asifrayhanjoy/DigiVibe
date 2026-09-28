const fs = require('fs');
const path = require('path');

const targetCats = ['vpn', 'VPN', 'sim', 'SIM', 'subscriptions', 'Subscriptions', 'ip', 'IP', 'smm', 'SMM', 'telegram', 'Telegram'];

function isTargetCategory(cat) {
  if (!cat) return false;
  return targetCats.includes(cat.toLowerCase()) || targetCats.includes(cat);
}

// 1. Update data/services.js
const servicesPath = path.resolve(__dirname, '../../data/services.js');
let servicesCode = fs.readFileSync(servicesPath, 'utf8');

// We will update prices in services.js using regex or object processing
// In services.js, objects look like:
// category: "vpn", ... price: 160
// Or inline objects.

// Let's parse services by splitting into blocks or using AST/regex matching
console.log('Updating data/services.js...');

let updatedServicesCount = 0;
// Match items with category: "cat" or category: 'cat' and price: N
servicesCode = servicesCode.replace(
  /(category:\s*["'](vpn|sim|subscriptions|ip|smm|telegram)["'][\s\S]*?price:\s*)(\d+(\.\d+)?)/gi,
  (match, prefix, cat, priceStr) => {
    const oldPrice = parseFloat(priceStr);
    const newPrice = Math.max(0, oldPrice - 5);
    updatedServicesCount++;
    return `${prefix}${newPrice}`;
  }
);

fs.writeFileSync(servicesPath, servicesCode, 'utf8');
console.log(`✅ data/services.js updated (${updatedServicesCount} price entries modified).`);

// 2. Update data/products.ts
const productsTsPath = path.resolve(__dirname, '../../data/products.ts');
let productsCode = fs.readFileSync(productsTsPath, 'utf8');
let updatedProductsCount = 0;

productsCode = productsCode.replace(
  /(category:\s*["'](VPN|smm|telegram)["'][\s\S]*?price:\s*)(\d+(\.\d+)?)/gi,
  (match, prefix, cat, priceStr) => {
    const oldPrice = parseFloat(priceStr);
    const newPrice = Math.max(0, oldPrice - 5);
    updatedProductsCount++;
    return `${prefix}${newPrice}`;
  }
);

fs.writeFileSync(productsTsPath, productsCode, 'utf8');
console.log(`✅ data/products.ts updated (${updatedProductsCount} price entries modified).`);

// 3. Update data/simOffers.ts
const simOffersTsPath = path.resolve(__dirname, '../../data/simOffers.ts');
let simCode = fs.readFileSync(simOffersTsPath, 'utf8');
let updatedSimCount = 0;

simCode = simCode.replace(
  /(category:\s*["']sim["'][\s\S]*?price:\s*)(\d+(\.\d+)?)/gi,
  (match, prefix, cat, priceStr) => {
    const oldPrice = parseFloat(priceStr);
    const newPrice = Math.max(0, oldPrice - 5);
    updatedSimCount++;
    return `${prefix}${newPrice}`;
  }
);

fs.writeFileSync(simOffersTsPath, simCode, 'utf8');
console.log(`✅ data/simOffers.ts updated (${updatedSimCount} price entries modified).`);

// 4. Update server/seed/products.js
const seedPath = path.resolve(__dirname, '../seed/products.js');
let seedCode = fs.readFileSync(seedPath, 'utf8');
let updatedSeedCount = 0;

seedCode = seedCode.replace(
  /(category:\s*["'](VPN|sim)["'][\s\S]*?price:\s*)(\d+(\.\d+)?)/gi,
  (match, prefix, cat, priceStr) => {
    const oldPrice = parseFloat(priceStr);
    const newPrice = Math.max(0, oldPrice - 5);
    updatedSeedCount++;
    return `${prefix}${newPrice}`;
  }
);

fs.writeFileSync(seedPath, seedCode, 'utf8');
console.log(`✅ server/seed/products.js updated (${updatedSeedCount} price entries modified).`);

console.log('\n🎉 ALL STATIC CODEBASE DATA FILES UPDATED SUCCESSFULLY!');
