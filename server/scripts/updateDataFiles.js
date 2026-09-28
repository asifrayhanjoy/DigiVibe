const fs = require('fs');
const path = require('path');

const targetCategoryRegex = /category:\s*["'](vpn|sim|subscriptions|ip|smm|telegram)["']/i;

function updateFilePrices(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let matchCount = 0;

  // Replace each object block { ... }
  const updatedContent = content.replace(/\{[^{}]*?\}/gs, (block) => {
    // Check if category is one of target categories
    if (!targetCategoryRegex.test(block)) {
      return block;
    }

    // Update price inside this object block
    return block.replace(/(price:\s*)(\d+(\.\d+)?)/, (pMatch, pPrefix, pVal) => {
      const oldP = parseFloat(pVal);
      const newP = Math.max(0, oldP - 5);
      matchCount++;
      return `${pPrefix}${newP}`;
    });
  });

  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log(`✅ ${path.basename(filePath)} updated (${matchCount} prices reduced by 5 BDT).`);
  return matchCount;
}

console.log('🚀 Updating static data files...');
updateFilePrices(path.resolve(__dirname, '../../data/products.ts'));
updateFilePrices(path.resolve(__dirname, '../../data/simOffers.ts'));
updateFilePrices(path.resolve(__dirname, '../../data/services.js'));
updateFilePrices(path.resolve(__dirname, '../seed/products.js'));
console.log('🎉 Static data files updated cleanly!');
