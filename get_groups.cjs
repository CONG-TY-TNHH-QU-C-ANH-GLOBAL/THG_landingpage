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
        if (s.includes('VIDEO19')) {
            const jsonStr = s.substring(s.indexOf('{'), s.lastIndexOf('}') + 1);
            try { config = JSON.parse(jsonStr); } catch (e) { }
        }
    }
}

if (!config) { console.log('Still no config'); process.exit(1); }

const textMap = {};
([...html.matchAll(/id=\"([A-Z0-9_]+)\"[^>]*>(.*?)<\/(h[1-6]|p|div|span|b|ul|li)>/gi)]).forEach(m => {
    let t = m[2].replace(/<[^>]+>/g, '').trim();
    if (t) textMap[m[1]] = t;
});

const vids = ['VIDEO19', 'VIDEO20', 'VIDEO21'];
vids.forEach(vid => {
    const parentId = config[vid]?.p;
    console.log(vid, 'parent:', parentId);
    if (parentId) {
        Object.entries(config).forEach(([id, obj]) => {
            if (obj.p === parentId && id !== vid) {
                console.log(' Sibling', id, obj.a, textMap[id] ? textMap[id].substring(0, 200) : '');
            }
        });
    } else {
        console.log(vid, 'has no parent Group!');
    }
});
