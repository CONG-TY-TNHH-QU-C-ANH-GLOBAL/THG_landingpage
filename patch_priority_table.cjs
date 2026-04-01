const fs = require('fs');
let code = fs.readFileSync('src/pages/InternationalPricingPage.tsx', 'utf8').replace(/\r\n/g, '\n');

// 1. Fix PriceTable rendering & Split Priority Table
const targetRegex = /<PriceTable\s+title="Bảng Giá Chi Tiết"\s+badge=\{`\$\{routeConfig\.name\} \· \$\{CARGO_LABELS\[cargo\]\}`\}\s+note="Cập nhật: 29\/03\/2026"\s+data=\{currentData\}\s+columns=\{tableColumns\}\s+\/>/m;

const replaceString = `{route === "pri-vncn-us" ? (
                  <div className="flex flex-col gap-6">
                    <PriceTable
                      title="Bảng Giá Chi Tiết VN ➝ US (Priority)"
                      badge={<div className="flex items-center gap-1"><span className="notranslate font-bold" translate="no">Priority VN ➝ US</span> <span className="opacity-50">·</span> <span>{CARGO_LABELS[cargo]}</span></div>}
                      note="Cập nhật: 29/03/2026"
                      data={(pricingData as any)["uspsVn"] || []}
                      columns={[{key: "us", label: "Cước ($)"}]}
                    />
                    <PriceTable
                      title="Bảng Giá Chi Tiết CN ➝ US (Priority)"
                      badge={<div className="flex items-center gap-1"><span className="notranslate font-bold" translate="no">Priority CN ➝ US</span> <span className="opacity-50">·</span> <span>{CARGO_LABELS[cargo]}</span></div>}
                      note="Cập nhật: 29/03/2026"
                      data={(pricingData as any)["uspsCn"] || []}
                      columns={[{key: "us", label: "Cước ($)"}]}
                    />
                  </div>
                ) : (
                  <PriceTable
                    title="Bảng Giá Chi Tiết"
                    badge={<div className="flex items-center gap-1">{routeConfig.name} <span className="opacity-50">·</span> <span>{CARGO_LABELS[cargo]}</span></div>}
                    note="Cập nhật: 29/03/2026"
                    data={currentData}
                    columns={tableColumns}
                  />
                )}`;

if (code.match(targetRegex)) {
    code = code.replace(targetRegex, replaceString);
    console.log("Patched PriceTable rendering!");
} else {
    console.log("Could not find PriceTable target");
}

// 2. Wrap CN and US with translate="no" in ROUTES declaration
code = code.replace(/CN → US Ship by Label/g, '<span translate="no">CN</span> → <span translate="no">US</span> Ship by Label');
code = code.replace(/Priority VN\/CN → US/g, 'Priority <span translate="no">VN/CN</span> → <span translate="no">US</span>');
code = code.replace(/Standard VN → Worldwide/g, 'Standard <span translate="no">VN</span> → Worldwide');
code = code.replace(/Standard CN → Worldwide/g, 'Standard <span translate="no">CN</span> → Worldwide');
code = code.replace(/VN → US \(Seller\)/g, '<span translate="no">VN</span> → <span translate="no">US</span> (Seller)');
code = code.replace(/CN → US \(Seller\)/g, '<span translate="no">CN</span> → <span translate="no">US</span> (Seller)');
code = code.replace(/VN → US \(TikTok\)/g, '<span translate="no">VN</span> → <span translate="no">US</span> (TikTok)');
code = code.replace(/CN → US \(TikTok\)/g, '<span translate="no">CN</span> → <span translate="no">US</span> (TikTok)');

// 3. Fix the "CN – US Ship by Label" text rendering in the info panel (Line 869)
code = code.replace(/CN – US Ship by Label/g, '<span translate="no">CN</span> – <span translate="no">US</span> Ship by Label');


// Ensure PricingData typing allows indexing by string properly to prevent TS errors
if (!code.includes('import { pricingData } from "../data/pricingData";')) {
    // It's already imported
}

fs.writeFileSync('src/pages/InternationalPricingPage.tsx', code, 'utf8');
console.log("File saved");
