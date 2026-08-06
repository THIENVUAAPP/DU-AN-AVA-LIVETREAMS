const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  try {
    await page.goto('http://localhost:5174/', {waitUntil: 'networkidle'});
    // Also try to check what's in #root
    const rootHtml = await page.innerHTML('#root');
    console.log('ROOT HTML LENGTH:', rootHtml.length);
  } catch (e) {
    console.log('Timeout or goto error:', e.message);
  }
  await browser.close();
})();
