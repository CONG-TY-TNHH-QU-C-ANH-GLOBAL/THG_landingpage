const https = require('https');

const APP_ID = 'cli_a9475b5764f8ded4';
const APP_SECRET = 'OWLjVhFyO1821jSEWpZolhq1VS72oFoY';
const SPREADSHEET_TOKEN = 'GeOhsIMqrhJ3JztNKVDlfWi9gAe';

function request(options, bodyData = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve(data);
                }
            });
        });
        req.on('error', reject);
        if (bodyData) {
            req.write(JSON.stringify(bodyData));
        }
        req.end();
    });
}

async function main() {
    try {
        // 1. Get Tenant Access Token
        console.log("Fetching token...");
        const tokenRes = await request({
            hostname: 'open.larksuite.com',
            path: '/open-apis/auth/v3/tenant_access_token/internal/',
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }, {
            app_id: APP_ID,
            app_secret: APP_SECRET
        });

        if (tokenRes.code !== 0) {
            console.error("Auth failed Error:", tokenRes);
            return;
        }
        const token = tokenRes.tenant_access_token;

        // 2. Get Spreadsheet Meta
        console.log("Fetching metadata...");
        const metaRes = await request({
            hostname: 'open.larksuite.com',
            path: `/open-apis/sheets/v2/spreadsheets/${SPREADSHEET_TOKEN}/metainfo`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        require('fs').writeFileSync('d:\\THG_official\\rebuild-your-site-12\\meta.json', JSON.stringify(metaRes, null, 2));
        console.log("Wrote meta.json");

    } catch (err) {
        console.error("Error:", err);
    }
}

main();
