import fs from 'fs';

(async () => {
  const html = fs.readFileSync('dom.html', 'utf-8');
  console.log('HTML Length:', html.length);
  console.log('Has #process:', html.includes('id="process"'));
  console.log('Has Intake:', html.includes('Intake'));
  console.log('Has button:', html.includes('<button'));
  
  // Find index of process
  const idx = html.indexOf('id="process"');
  if (idx !== -1) {
    console.log('Snippet around process:', html.substring(idx - 50, idx + 100));
  }
})();
