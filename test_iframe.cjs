const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://www.tiktok.com/embed/v2/nx.cielo9?lang=vi-VN');
  await page.screenshot({path: 'iframe.png'});
  await browser.close();
})();
