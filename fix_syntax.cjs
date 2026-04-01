const fs = require('fs');
let code = fs.readFileSync('src/pages/InternationalPricingPage.tsx', 'utf8');

// The broken broken strings:
// label: "🇨🇳 <span translate="no">CN</span> → <span translate="no">US</span> (Seller)",
code = code.replace(/label: "🇨🇳 <span translate="no">CN<\/span> → <span translate="no">US<\/span> \(Seller\)"/g, 'label: <>🇨🇳 <span translate="no">CN</span> → <span translate="no">US</span> (Seller)</>');
code = code.replace(/label: "🇨🇳 <span translate="no">CN<\/span> → <span translate="no">US<\/span> \(TikTok\)"/g, 'label: <>🇨🇳 <span translate="no">CN</span> → <span translate="no">US</span> (TikTok)</>');
code = code.replace(/label: "🇻🇳 <span translate="no">VN<\/span> → <span translate="no">US<\/span> \(Seller\)"/g, 'label: <>🇻🇳 <span translate="no">VN</span> → <span translate="no">US</span> (Seller)</>');
code = code.replace(/label: "🇻🇳 <span translate="no">VN<\/span> → <span translate="no">US<\/span> \(TikTok\)"/g, 'label: <>🇻🇳 <span translate="no">VN</span> → <span translate="no">US</span> (TikTok)</>');

// Also check if any other places got broken quotes:
// nameVi: "🇻🇳/🇨🇳 Priority <span translate="no">VN/CN</span> → <span translate="no">US</span>"
code = code.replace(/nameVi: "🇻🇳\/🇨🇳 Priority <span translate="no">VN\/CN<\/span> → <span translate="no">US<\/span>"/g, 'nameVi: <>🇻🇳/🇨🇳 Priority <span translate="no">VN/CN</span> → <span translate="no">US</span></>');

code = code.replace(/nameVi: "🇨🇳 <span translate="no">CN<\/span> → <span translate="no">US<\/span> Ship by Label"/g, 'nameVi: <>🇨🇳 <span translate="no">CN</span> → <span translate="no">US</span> Ship by Label</>');

code = code.replace(/nameVi: "🇻🇳 Standard <span translate="no">VN<\/span> → Worldwide"/g, 'nameVi: <>🇻🇳 Standard <span translate="no">VN</span> → Worldwide</>');

code = code.replace(/nameVi: "🇨🇳 Standard <span translate="no">CN<\/span> → Worldwide"/g, 'nameVi: <>🇨🇳 Standard <span translate="no">CN</span> → Worldwide</>');

// Also Express tab badges:
// badge="<span translate="no">VN</span> → <span translate="no">US</span>"
code = code.replace(/badge="<span translate="no">VN<\/span> → <span translate="no">US<\/span>"/g, 'badge={<><span translate="no">VN</span> → <span translate="no">US</span></>}');
code = code.replace(/badge="<span translate="no">CN<\/span> → <span translate="no">US<\/span>"/g, 'badge={<><span translate="no">CN</span> → <span translate="no">US</span></>}');


fs.writeFileSync('src/pages/InternationalPricingPage.tsx', code, 'utf8');
console.log("Fixed syntax errors");
