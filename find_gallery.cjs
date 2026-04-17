const fs = require('fs');
const html = fs.readFileSync('warehouse_scrape.html', 'utf8');

const matchJSON = html.match(/window\.LadiPageScript\.runtime=(.*?);/s)
    || html.match(/LADI_CAMP_CONFIG\s*=\s*(.*?);/s);

let config = null;
if (matchJSON) {
    try { config = JSON.parse(matchJSON[1]); } catch (e) { }
}

if (!config) {
    const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
    for (let s of scripts) {
        if (s.includes('GALLERY8')) {
            const jsonStr = s.substring(s.indexOf('{'), s.lastIndexOf('}') + 1);
            try { config = JSON.parse(jsonStr); } catch (e) { }
        }
    }
}

if (!config) { console.log('Still no config'); process.exit(1); }

const galleries = Object.keys(config).filter(k => config[k].a === 'gallery' || k.includes('GALLERY'));
galleries.forEach(g => {
    console.log('===', g, '===');
    let urls = [];
    Object.entries(config).forEach(([id, obj]) => {
        if (obj.p === g && obj.a === 'image') {
            const imgMatch = html.match(new RegExp('id=\"' + id + '\"[^>]*data-src=\"([^\"]+)\"'));
            if (imgMatch) urls.push(imgMatch[1]);
        }
    });
    if (urls.length > 0) {
        console.log('Found child images:', urls);
    } else {
        if (config[g].a === 'gallery') {
            console.log('No child images found. Looking for items/ci...');
            console.log(config[g]);
            // Extract from DOM
            const gHtml = html.substring(html.indexOf('id="' + g + '"'), html.indexOf('id="' + g + '"') + 5000);
            const domUrls = [...gHtml.matchAll(/data-src=\"([^\"]+)\"/g)].map(x => x[1]);
            console.log('DOM Extracted URLs:', domUrls);
        }
    }
});
