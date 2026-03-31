const fs = require('fs');
const path = require('path');

// 1. Rebalance InternationalPricingPage tables
const intlPath = path.join(__dirname, 'src', 'pages', 'InternationalPricingPage.tsx');
let intl = fs.readFileSync(intlPath, 'utf8');

// Increase table base text size
intl = intl.replace(/text-xs/g, 'text-[13px]');

// Increase header sizes
intl = intl.replace(/text-\[10px\]/g, 'text-[12px]');

// Balance header padding
intl = intl.replace(/px-3 py-2/g, 'px-4 py-3');

// Balance row padding
intl = intl.replace(/px-3 py-1\.5/g, 'px-4 py-2.5');

// Force table fonts
intl = intl.replace(/className="w-full border-collapse/g, 'className="w-full border-collapse font-serif');

fs.writeFileSync(intlPath, intl, 'utf8');
console.log("Rebalanced InternationalPricingPage paddings/fonts");

// 2. Rebalance DomesticPricingPage tables
const domPath = path.join(__dirname, 'src', 'pages', 'DomesticPricingPage.tsx');
let dom = fs.readFileSync(domPath, 'utf8');

// Increase base text size
dom = dom.replace(/text-sm/g, 'text-[13px]');

// Force table fonts
dom = dom.replace(/className="w-full text-sm/g, 'className="w-full text-[13px] font-serif');

// Header generic
dom = dom.replace(/px-4 py-3/g, 'px-5 py-3');

fs.writeFileSync(domPath, dom, 'utf8');
console.log("Rebalanced DomesticPricingPage paddings/fonts");
