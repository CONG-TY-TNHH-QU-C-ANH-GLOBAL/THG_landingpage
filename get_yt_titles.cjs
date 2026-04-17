const https = require('https');

const urls = [
    'https://www.youtube.com/shorts/wcJ_iwwDcBM',
    'https://www.youtube.com/shorts/Gi_zlY_Hmw4',
    'https://www.youtube.com/shorts/qeADCwk23JU'
];

urls.forEach(url => {
    https.get(url, (resp) => {
        let data = '';
        resp.on('data', chunk => data += chunk);
        resp.on('end', () => {
            const match = data.match(/<title>(.*?)<\/title>/);
            if (match) {
                console.log(url, '->', match[1]);
            }
        });
    });
});
