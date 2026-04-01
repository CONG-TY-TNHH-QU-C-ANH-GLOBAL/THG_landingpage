const fs = require('fs');
const content = fs.readFileSync('src/data/pricingData.ts', 'utf8');

function getFirstRow(key) {
    const startIndex = content.indexOf(`"${key}": [`);
    if (startIndex === -1) return "Not found";
    const startRow = content.indexOf('{', startIndex);
    const endRow = content.indexOf('}', startRow);
    return content.substring(startRow, endRow + 1);
}

console.log("tiktokVnSeller:", getFirstRow('tiktokVnSeller'));
console.log("tiktokCnSeller:", getFirstRow('tiktokCnSeller'));
console.log("tiktokVnTiktok:", getFirstRow('tiktokVnTiktok'));
