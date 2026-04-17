const fs = require('fs');
const html = fs.readFileSync('warehouse_scrape.html', 'utf8');

const urls = [...html.matchAll(/(https:\/\/w\.ladicdn\.com\/[^\"\'\s\)]+\.(png|jpg|jpeg|webp|gif))/ig)].map(m => m[1]);
const uniqueUrls = [...new Set(urls)];

let out = '';
for (let i = 0; i < uniqueUrls.length; i++) {
    out += i + ': ' + uniqueUrls[i] + '\n';
}
fs.writeFileSync('all_urls.txt', out);
