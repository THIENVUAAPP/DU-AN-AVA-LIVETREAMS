import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  
  try {
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle0', timeout: 15000 });
    console.log('Main page loaded');
    
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('span'));
      const target = btns.find(el => el.textContent.includes('Live Studio'));
      if(target) target.click();
    });
    
    await new Promise(r => setTimeout(r, 2000));
    console.log('Clicked Live Studio');
    
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const target = btns.find(el => el.textContent.includes('Cài đặt Sự kiện AI'));
      if(target) target.click();
    });
    
    await new Promise(r => setTimeout(r, 2000));
    console.log('Clicked Cài đặt Sự kiện AI');
    
  } catch(e) {
    console.log('ERROR:', e.message);
  }
  await browser.close();
})();
