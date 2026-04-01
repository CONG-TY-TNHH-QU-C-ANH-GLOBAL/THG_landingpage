const fs = require('fs');
let code = fs.readFileSync('src/pages/InternationalPricingPage.tsx', 'utf8');

// The global replace injected double quotes `translate="no"` into JavaScript double-quoted string literals.
// By replacing it with single quotes, it will be valid both inside JSX and inside string literals.
code = code.replace(/translate="no"/g, "translate='no'");

fs.writeFileSync('src/pages/InternationalPricingPage.tsx', code, 'utf8');
console.log("Fixed translate quotes");
