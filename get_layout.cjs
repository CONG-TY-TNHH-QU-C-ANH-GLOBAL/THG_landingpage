const fs = require('fs');
const html = fs.readFileSync('warehouse_scrape.html', 'utf8');

const scriptMatch = html.match(/<script type=\"application\/json\" id=\"script_ladipage_camp_config\">([\s\S]*?)<\/script>/);
let config = null;
if (scriptMatch) {
    config = JSON.parse(scriptMatch[1]);
} else {
    const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
    for (let s of scripts) {
        if (s.includes('VIDEO19')) {
            const jsonStr = s.substring(s.indexOf('{'), s.lastIndexOf('}') + 1);
            try { config = JSON.parse(jsonStr); } catch (e) { }
        }
    }
}

if (!config) { console.log('Still no config'); process.exit(1); }

const textMap = {};
[...html.matchAll(/id=\"([A-Z0-9_]+)\"[^>]*>(.*?)<\/(h[1-6]|p|div|span|b|ul|li)>/gi)].forEach(m => {
    let t = m[2].replace(/<[^>]+>/g, '').trim();
    if (t) textMap[m[1]] = t;
});

let cssMatch = html.match(/<style id=\"style_ladi\"[^>]*>([\s\S]*?)<\/style>/i);
if (!cssMatch) cssMatch = html.match(/<style[^>]*>([\s\S]*?#SECTION[\s\S]*?)<\/style>/i);
let css = cssMatch ? cssMatch[1] : '';
const cMap = {};
[...css.matchAll(/#([A-Z0-9_]+)\s*{([^}]+)}/g)].forEach(m => {
    const id = m[1];
    const rules = m[2];
    const topMatch = rules.match(/top:\s*([-0-9.]+)px/);
    if (topMatch) cMap[id] = parseFloat(topMatch[1]);
});

const elements = [];
Object.entries(config).forEach(([id, obj]) => {
    if (!cMap[id]) return;
    let type = 'unknown', val = '';
    if (obj.a === 'video') { type = 'video'; val = obj.ci; }
    else if (obj.a === 'image') {
        const imgMatch = html.match(new RegExp('id=\"' + id + '\"[^>]*data-src=\"([^\"]+)\"'));
        if (imgMatch) type = 'image', val = imgMatch[1];
    }
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
        const near = elements.filter(x => Math.abs(x.top - v.top) < 250);
        near.forEach(n => {
            if (n.val.length > 0)
                console.log('y=' + n.top + ' [' + n.type + '] ' + n.val.substring(0, 100));
        });
    }
});
