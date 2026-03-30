const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'src', 'assets', 'catalog');
const outputDir = path.join(__dirname, 'public', 'catalog', 'items');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function processScreenshots() {
    const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.png'));
    let globalCount = 1;

    for (const file of files) {
        console.log(`Processing ${file}...`);
        const image = await Jimp.read(path.join(inputDir, file));

        const width = image.bitmap.width;
        const height = image.bitmap.height;

        // The Ladipage catalog typically has 5 columns on desktop
        // We will slice the image into 5 equal columns
        const columns = 5;
        const cardWidth = Math.floor(width / columns);

        // Assuming 1 row per screenshot vertically since the user took many screenshots
        // Wait, let's just slice vertically. But the bottom might have pagination or something?
        // We will just do 5 equal parts horizontally, and full height vertically

        for (let c = 0; c < columns; c++) {
            const x = c * cardWidth;
            const clone = image.clone();

            // Crop: (x, y, w, h)
            clone.crop(x, 0, cardWidth, height);

            const outPath = path.join(outputDir, `card_${globalCount.toString().padStart(3, '0')}.png`);
            await clone.writeAsync(outPath);
            console.log(`Saved ${outPath}`);
            globalCount++;
        }
    }

    console.log(`Finished processing ${globalCount - 1} cards.`);
}

processScreenshots().catch(console.error);
