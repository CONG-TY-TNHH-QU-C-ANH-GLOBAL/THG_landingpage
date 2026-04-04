const fs = require('fs');

const rawData = fs.readFileSync('./src/data/larkPolicies.json', 'utf8');
const policies = JSON.parse(rawData);

const viRegex = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;

async function translate(text) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|vi`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.responseStatus !== 200) {
    if (String(data.responseStatus) === '429') throw new Error('429');
    console.warn(`MyMemory warn: ${data.responseStatus}`);
    return text;
  }
  return data.responseData.translatedText;
}

async function run() {
  console.log("Starting translation using MyMemory API...");
  let count = 0;

  for (let i = 0; i < policies.length; i++) {
    const lines = policies[i].content.split('\n');
    for (let j = 0; j < lines.length; j++) {
      const line = lines[j].trim();
      if (!line) continue;
      if (viRegex.test(line)) continue;
      if (!/[a-zA-Z]{5,}/.test(line) || line.length <= 10) continue;

      // Parse markdown prefixes
      let mdPrefix = '';
      let mdSuffix = '';
      let text = line;

      const hMatch = text.match(/^(### )(.*?)$/);
      if (hMatch) { mdPrefix = hMatch[1]; text = hMatch[2]; }

      let listPrefix = '';
      if (text.startsWith('• ')) {
        listPrefix = '• '; text = text.slice(2);
      } else {
        const numMatch = text.match(/^([0-9A-Z\-\(\)]+[.,\)] )/);
        if (numMatch) { listPrefix = numMatch[1]; text = text.slice(numMatch[1].length); }
      }

      if (!text || (!(/[a-zA-Z]{5,}/.test(text)))) continue;
      if (text.length > 490) {
        console.log(`[skip-long] ${text.substring(0, 50)}`);
        continue;
      }

      try {
        const translated = await translate(text);
        lines[j] = mdPrefix + listPrefix + translated + mdSuffix;
        count++;
        if (count % 10 === 0) console.log(`[${count}] OK: "${text.substring(0, 25)}" -> "${translated.substring(0, 25)}"`);
        await new Promise(r => setTimeout(r, 380));
      } catch (e) {
        console.error("Error:", e.message, "on:", text.substring(0, 40));
        if (e.message === '429') {
          console.log("Rate limit! Saving progress...");
          policies[i].content = lines.join('\n');
          fs.writeFileSync('./src/data/larkPolicies.json', JSON.stringify(policies, null, 2));
          process.exit(1);
        }
      }
    }
    policies[i].content = lines.join('\n');
    console.log(`Policy ${i + 1}/${policies.length} done`);
  }

  fs.writeFileSync('./src/data/larkPolicies.json', JSON.stringify(policies, null, 2));
  console.log(`\nAll done! Translated ${count} lines.`);
}

run();
