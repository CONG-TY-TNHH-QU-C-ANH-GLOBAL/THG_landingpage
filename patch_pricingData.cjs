const fs = require('fs');

const scraped = JSON.parse(fs.readFileSync('scraped_data.json', 'utf8'));
let code = fs.readFileSync('src/data/pricingData.ts', 'utf8');

function replaceArray(key, newArray) {
    const startIndex = code.indexOf(`"${key}": [`);
    if (startIndex === -1) {
        console.log(`Key ${key} not found for replacement!`);
        return false;
    }
    const arrayStart = code.indexOf('[', startIndex);

    // Find the end of the array by tracking brackets
    let depth = 0;
    let arrayEnd = -1;
    for (let i = arrayStart; i < code.length; i++) {
        if (code[i] === '[') depth++;
        if (code[i] === ']') depth--;
        if (depth === 0) {
            arrayEnd = i;
            break;
        }
    }

    if (arrayEnd === -1) {
        console.log(`Could not find end of array ${key}`);
        return false;
    }

    const newArrayString = JSON.stringify(newArray, null, 4).replace(/"kg"/g, '"kg"').replace(/"rate"/g, '"rate"');
    code = code.substring(0, arrayStart) + newArrayString + code.substring(arrayEnd + 1);
    console.log(`Successfully replaced array: ${key}`);
    return true;
}

// Replace Priority VN->US with correct exact numbers ($7.31... instead of $5.81...)
replaceArray('uspsVn', scraped.priorityVnUs);

// Replace TikTok VN->US (the scrape says TikTok VN->US is exactly Priority VN->US)
replaceArray('tiktokVnTiktok', scraped.priorityVnUs);

// ADD tiktokCnSeller if it's missing
if (!code.includes('"tiktokCnSeller": [')) {
    console.log("tiktokCnSeller not found! Injecting it...");
    // Find where another tiktok array is and insert it
    const injectionPoint = code.indexOf('"tiktokCnUk": [');
    if (injectionPoint !== -1) {
        const insertPayload = `\n  "tiktokCnSeller": ${JSON.stringify(scraped.sellerCnUs, null, 4)},\n`;
        code = code.substring(0, injectionPoint) + insertPayload + code.substring(injectionPoint);
        console.log("Injected tiktokCnSeller");
    }
} else {
    replaceArray('tiktokCnSeller', scraped.sellerCnUs);
}

fs.writeFileSync('src/data/pricingData.ts', code, 'utf8');
console.log("Updated pricingData.ts with scraped legacy numbers.");
