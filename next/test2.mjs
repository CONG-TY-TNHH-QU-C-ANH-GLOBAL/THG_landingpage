import fs from 'fs';

const html = fs.readFileSync('dom.html', 'utf-8');
const idx = html.indexOf('id="process"');
if (idx !== -1) {
  const processHtml = html.substring(idx - 100, idx + 1000);
  console.log(processHtml);
} else {
  console.log('Not found');
}
