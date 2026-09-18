const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://www.tiktok.com/@choosemee6666/live', { waitUntil: 'networkidle2' });
  const content = await page.content();
  if (content.includes('LIVE')) {
      console.log('Page loaded successfully');
      console.log('Is LIVE text found:', content.includes('LIVE'));
  } else {
      console.log('Failed to load page or LIVE not found');
  }
  await page.screenshot({path: 'choosemee6666.png'});
  await browser.close();
})();
