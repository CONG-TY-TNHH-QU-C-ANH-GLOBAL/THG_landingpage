const fs = require('fs');
let code = fs.readFileSync('src/data/pricingData.ts', 'utf8');

// The JSON from the browser subagent used "fee" instead of "rate"
// I need to change "fee": to "rate": across the entire file just in case
code = code.replace(/"fee":/g, '"rate":');

fs.writeFileSync('src/data/pricingData.ts', code, 'utf8');
console.log("Fixed fee prop to rate prop");
