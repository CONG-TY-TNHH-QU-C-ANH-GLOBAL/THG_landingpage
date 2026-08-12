import fs from 'fs';
import * as cheerio from 'cheerio';

(async () => {
  const html = fs.readFileSync('dom.html', 'utf-8');
  const $ = cheerio.load(html);
  console.log('Buttons inside #process:', $('#process button').length);
  console.log('HTML of #process:', $('#process').html().substring(0, 500));
})();
