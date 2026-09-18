const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  console.log("Navigating to http://127.0.0.1.nip.io:5173/live ...");
  await page.goto('http://127.0.0.1.nip.io:5173/live', { waitUntil: 'networkidle2' });
  
  console.log("Waiting 3 seconds...");
  await new Promise(r => setTimeout(r, 3000));
  
  const content = await page.content();
  console.log("Body length:", content.length);
  if (content.includes('🔴 LIVE AI IDOL')) {
      console.log("Found 🔴 LIVE AI IDOL text!");
  } else {
      console.log("Did NOT find 🔴 LIVE AI IDOL text.");
  }
  
  await browser.close();
})();
