const fs = require('fs');
const html = fs.readFileSync('warehouse_scrape.html', 'utf8');
const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
for (let s of scripts) {
    if (s.includes('GALLERY8') || s.includes('GALLERY')) {
        // Find LADI_CAMP_CONFIG
        const idx = s.indexOf('LADI_CAMP_CONFIG = {');
        if (idx !== -1) {
            const start = idx + 19;
            const end = s.lastIndexOf('};') + 1;
            const jsonStr = s.substring(start, end);
            fs.writeFileSync('config.json', jsonStr);
            console.log('Saved to config.json');
            break;
        }
    }
}
