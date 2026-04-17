const fs = require('fs');
const html = fs.readFileSync('warehouse_scrape.html', 'utf8');

const matchJSON = html.match(/LADI_CAMP_CONFIG\s*=\s*(.*?);/);
if (!matchJSON) { console.log('no config'); process.exit(1); }
const config = JSON.parse(matchJSON[1]);

const textMap = {};
[...html.matchAll(/id=\"([A-Z0-9_]+)\"[^>]*>(.*?)<\/(h[1-6]|p|div|span|b|ul|li)>/gi)].forEach(m => {
    let t = m[2].replace(/<[^>]+>/g, '').trim();
    if (t) textMap[m[1]] = t;
});

let cssMatch = html.match(/<style id=\"style_ladi\"[^>]*>(.*?)<\/style>/is);
if (!cssMatch) cssMatch = html.match(/<style[^>]*>(#SECTION.*?)<\/style>/is);
let css = cssMatch ? cssMatch[1] : '';
const cMap = {};
[...css.matchAll(/#([A-Z0-9_]+)\s*{([^}]+)}/g)].forEach(m => {
    const id = m[1];
    const rules = m[2];
    const topMatch = rules.match(/top:\s*([0-9.]+)px/);
    if (topMatch) cMap[id] = parseFloat(topMatch[1]);
});

const elements = [];
Object.entries(config).forEach(([id, obj]) => {
    if (!cMap[id]) return;
    let type = 'unknown', val = '';
    if (obj.a === 'video') { type = 'video'; val = obj.ci; }
    else if (obj.a === 'image') { type = 'image'; val = html.match(new RegExp('id=\"' + id + '\"[^>]*data-src=\"([^\"]+)\"'))?.[1] || ''; }
    else if (id in textMap) { type = obj.a; val = textMap[id]; }

    if (val) {
        elements.push({ id, type, top: cMap[id], val });
    }
});

elements.sort((a, b) => a.top - b.top);

const vids = ['VIDEO19', 'VIDEO20', 'VIDEO21'];
vids.forEach(vidId => {
    const v = elements.find(x => x.id === vidId);
    if (v) {
        console.log('=== AROUND VIDEO: ' + v.val + ' ===');
        const near = elements.filter(x => Math.abs(x.top - v.top) < 600);
        near.forEach(n => console.log('y=' + n.top + ' [' + n.type + '] ' + n.val.substring(0, 100)));
    }
});
