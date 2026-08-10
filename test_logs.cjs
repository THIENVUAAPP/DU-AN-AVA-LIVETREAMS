const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const logs = [];
  page.on('console', msg => logs.push(`PAGE LOG: ${msg.text()}`));
  page.on('pageerror', error => logs.push(`PAGE ERROR: ${error.message}`));
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    
    // Set localStorage and reload
    await page.evaluate(() => {
      localStorage.setItem('avalive_current_user', JSON.stringify({ name: "Tester", plan: "PRO" }));
    });
    
    await page.reload({ waitUntil: 'networkidle0' });
    
    await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a, button, div'));
      const btn = links.find(el => el.textContent.trim() === 'Sàn Nhảy');
      if (btn) btn.click();
    });
    
    await new Promise(r => setTimeout(r, 2000));
    const text = await page.evaluate(() => document.body.innerText);
    console.log("Body text starts with:", text.substring(0, 100).replace(/\n/g, ' '));
    console.log("Logs:\n", logs.join('\n'));
    
    // Switch to TikTok Tab
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const tiktokBtn = btns.find(b => b.textContent.includes('Sàn Nhảy TikTok') || b.textContent.includes('Kết Nối TikTok Live'));
      if (tiktokBtn) tiktokBtn.click();
    });
    await new Promise(r => setTimeout(r, 2000));
    const text2 = await page.evaluate(() => document.body.innerText);
    console.log("Body text after TikTok tab:", text2.substring(0, 100).replace(/\n/g, ' '));
    
  } finally {
    await browser.close();
  }
})();
