const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
