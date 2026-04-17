const fs = require('fs');
const html = fs.readFileSync('warehouse_scrape.html', 'utf8');

const urls = [...html.matchAll(/(https:\/\/w\.ladicdn\.com\/[^\"\'\s\)]+\.(png|jpg|jpeg|webp|gif))/ig)].map(m => m[1]);
const uniqueUrls = [...new Set(urls)];

for (var i = 0; i < 27; i++) {
    console.log(i + ': ' + uniqueUrls[i]);
}
