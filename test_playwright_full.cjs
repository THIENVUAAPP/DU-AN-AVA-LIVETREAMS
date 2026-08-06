const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const logs = [];
  page.on('console', msg => logs.push('LOG: ' + msg.text()));
  page.on('pageerror', err => logs.push('ERROR: ' + err.toString()));
  
  try {
    await page.goto('http://localhost:5174/', {waitUntil: 'networkidle'});
    console.log('Homepage loaded.');
    
    // Check if the root has content (not a white screen)
    const rootHtml = await page.innerHTML('#root');
    if (rootHtml.length < 100) {
      console.log('ROOT IS EMPTY OR VERY SMALL! length:', rootHtml.length);
    } else {
      console.log('Root looks good. Length:', rootHtml.length);
    }
  } catch (e) {
    console.log('Error during test:', e.message);
  }
  
  if (logs.filter(l => l.includes('ERROR') || (l.includes('LOG') && l.toLowerCase().includes('error') && !l.includes('DevTools'))).length > 0) {
    console.log("ERRORS FOUND:");
    console.log(logs.join('\n'));
  } else {
    console.log("NO RUNTIME ERRORS FOUND!");
  }
  
  await browser.close();
})();
