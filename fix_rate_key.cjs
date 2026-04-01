const fs = require('fs');
let code = fs.readFileSync('src/pages/InternationalPricingPage.tsx', 'utf8');

// Update column key 'us' to 'rate' specifically for uspsVn and uspsCn components
code = code.replace(/columns=\{\[\{key: "us", label: "Cước \(\$\)"\}\]\}/g, 'columns={[{key: "rate", label: "Cước ($)"}]}');

fs.writeFileSync('src/pages/InternationalPricingPage.tsx', code, 'utf8');
console.log("Updated us to rate");
