const fs = require('fs');
const content = fs.readFileSync('src/data/pricingData.ts', 'utf8');
const lines = content.split('\n');
const keys = lines.filter(line => line.includes(': ['));
console.log("Keys found:");
console.log(keys.map(k => k.trim()));
