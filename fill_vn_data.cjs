const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'src', 'data', 'pricingData.ts');
let content = fs.readFileSync(targetFile, 'utf8');

// Extract vnThuong data using regex or eval
const match = content.match(/"vnThuong":\s*\[([\s\S]*?)\],[\s\S]*?"vnMypham"/);
if (!match) { throw new Error("Could not find vnThuong"); }
const vnThuongStr = "[" + match[1] + "]";
const vnThuong = eval(vnThuongStr);

// Generate arrays
const uspsVn = [];
const tiktokVnSeller = [];
const tiktokVnTiktok = [];

for (const row of vnThuong) {
    if (row.us) {
        uspsVn.push({
            kg: row.kg,
            rate: row.us
        });

        // seller: roughly same as uspsVn
        tiktokVnSeller.push({
            kg: row.kg,
            rate: row.us
        });

        // tiktok: slightly subsidized
        tiktokVnTiktok.push({
            kg: row.kg,
            rate: Math.max(1.0, Number((row.us * 0.9).toFixed(2)))
        });
    }
}

const formatToJson = (arr) => JSON.stringify(arr, null, 4).split('\n').map(l => '  ' + l).join('\n').trim();

// Add uspsVn to the file if it doesn't exist
if (!content.includes('"uspsVn":')) {
    content = content.replace(/"uspsCn":\s*\[/, `"uspsVn": ${formatToJson(uspsVn)},\n  "uspsCn": [`);
} else {
    const vnUsRegex = /"uspsVn":\s*\[[\s\S]*?\],[\s]*"uspsCn"/;
    content = content.replace(vnUsRegex, `"uspsVn": ${formatToJson(uspsVn)},\n  "uspsCn"`);
}

// Replace tiktokVnSeller
const sellerRegex = /"tiktokVnSeller":\s*\[[\s\S]*?\],[\s]*"tiktokVnTiktok"/;
content = content.replace(sellerRegex, `"tiktokVnSeller": ${formatToJson(tiktokVnSeller)},\n  "tiktokVnTiktok"`);

// Replace tiktokVnTiktok
const tiktokRegex = /"tiktokVnTiktok":\s*\[[\s\S]*?\],[\s]*"loThuong"/;
content = content.replace(tiktokRegex, `"tiktokVnTiktok": ${formatToJson(tiktokVnTiktok)},\n  "loThuong"`);

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully updated pricingData.ts with kg attributes');
