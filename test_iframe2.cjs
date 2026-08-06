const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://www.tiktok.com/embed/@nx.cielo9/live?autoplay=1&muted=1');
  await page.screenshot({path: 'iframe2.png'});
  await browser.close();
})();
