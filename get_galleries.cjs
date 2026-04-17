const fs = require('fs');
const html = fs.readFileSync('warehouse_scrape.html', 'utf8');

const g7 = html.substring(html.indexOf('id=\"GALLERY7\"'), html.indexOf('id=\"GALLERY7\"') + 5000);
const g8 = html.substring(html.indexOf('id=\"GALLERY8\"'), html.indexOf('id=\"GALLERY8\"') + 5000);

const extractImages = (str) => {
    return [...str.matchAll(/data-src=\"([^\"]+)\"/g)].map(m => m[1]);
};

console.log('Gallery 7 images:', extractImages(g7));
console.log('Gallery 8 images:', extractImages(g8));
