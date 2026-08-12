const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  const outDir = process.env.OUT_DIR || '.';
  console.log('Navigating...');
  await page.goto('http://localhost:3000/en/thg-fulfill', { waitUntil: 'networkidle' });
  
  // Try port 3001 if 3000 doesn't have it
  try {
     await page.waitForSelector('#process', { timeout: 3000 });
  } catch (e) {
     console.log('Trying port 3001...');
     await page.goto('http://localhost:3001/en/thg-fulfill', { waitUntil: 'networkidle' });
  }

  // Hide the next.js error overlay if present
  await page.evaluate(() => {
    const errorOverlay = document.querySelector('nextjs-portal');
    if (errorOverlay) {
      errorOverlay.style.display = 'none';
    }
  });

  console.log('Scrolling to process section...');
  await page.locator('#process').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000); // Wait for initial scroll

  // The 5 stages
  const stages = [
    { name: 'ORDER', index: 0 },
    { name: 'PRODUCE', index: 1 },
    { name: 'FULFILL', index: 2 },
    { name: 'SHIP', index: 3 },
    { name: 'DELIVER', index: 4 }
  ];

  for (const stage of stages) {
    console.log(`Activating stage: ${stage.name}`);
    // Find the button inside ProcessSceneController
    const btn = page.locator('#process button').nth(stage.index);
    await btn.click({ force: true });
    
    // Wait for CSS transitions (duration is ~1000ms)
    await page.waitForTimeout(1500);

    const screenshotPath = path.join(outDir, `audit_desktop_${stage.name.toLowerCase()}.png`);
    await page.screenshot({ path: screenshotPath });
    console.log(`Captured ${screenshotPath}`);
  }

  // Mobile viewport
  await page.setViewportSize({ width: 390, height: 844 });
  console.log('Switching to mobile viewport...');
  await page.locator('#process').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  for (const stage of stages) {
    console.log(`Activating mobile stage: ${stage.name}`);
    const btn = page.locator('#process button').nth(stage.index);
    await btn.click({ force: true });
    await page.waitForTimeout(1500);
    const screenshotPath = path.join(outDir, `audit_mobile_${stage.name.toLowerCase()}.png`);
    await page.screenshot({ path: screenshotPath });
    console.log(`Captured ${screenshotPath}`);
  }

  await browser.close();
  console.log('Done.');
})();
