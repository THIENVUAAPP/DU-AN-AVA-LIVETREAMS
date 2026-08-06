const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] });
  const context = await browser.newContext({ permissions: ['camera', 'microphone'] });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push('CONSOLE.ERROR: ' + msg.text());
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });

  await page.click('text=VÀO STUDIO');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '/private/tmp/claude-501/-Users-nguyenthien-Downloads-D---N-AVA-LIVETREAMS/2362e79e-0b28-41f0-9ad7-04b53a76014d/scratchpad/02-studio.png' });

  // try to find a nav item for Production/Broadcast Studio
  const candidates = ['Studio Sản Xuất', 'Production Studio', 'Studio Phát Sóng', 'Broadcast', 'Studio'];
  for (const c of candidates) {
    const loc = page.locator(`text=${c}`).first();
    if (await loc.count() > 0) {
      console.log('Found nav candidate:', c);
    }
  }

  await page.screenshot({ path: '/private/tmp/claude-501/-Users-nguyenthien-Downloads-D---N-AVA-LIVETREAMS/2362e79e-0b28-41f0-9ad7-04b53a76014d/scratchpad/03-after-nav-scan.png' });

  // Enable the fake webcam
  await page.click('text=BẬT WEBCAM THẬT');
  await page.waitForTimeout(2500);
  await page.screenshot({ path: '/private/tmp/claude-501/-Users-nguyenthien-Downloads-D---N-AVA-LIVETREAMS/2362e79e-0b28-41f0-9ad7-04b53a76014d/scratchpad/04-webcam-on.png' });
  console.log('ERRORS after webcam on:', JSON.stringify(errors, null, 2));

  // Toggle through the background removal modes
  const modes = ['Tách Xanh', 'Mờ Bokeh', 'Phông Gốc', 'Tách Phông AI'];
  for (const m of modes) {
    try {
      await page.click(`text=${m}`, { timeout: 5000 });
    } catch (e) {
      console.log(`FAILED to click "${m}":`, e.message.split('\n')[0]);
      const count = await page.locator(`text=${m}`).count();
      console.log(`  locator count for "${m}":`, count);
      continue;
    }
    await page.waitForTimeout(1500);
    console.log(`After clicking "${m}", errors so far:`, errors.length);
  }
  await page.screenshot({ path: '/private/tmp/claude-501/-Users-nguyenthien-Downloads-D---N-AVA-LIVETREAMS/2362e79e-0b28-41f0-9ad7-04b53a76014d/scratchpad/05-after-mode-toggles.png' });

  const found = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('button'));
    return all.map(b => JSON.stringify(b.innerText)).filter(t => t.includes('h Ph') || t.includes('AI'));
  });
  console.log('Button texts containing Ph/AI:', found);

  // Drag the chroma smoothness / tolerance sliders if visible (chroma mode)
  await page.click('text=Tách Xanh');
  await page.waitForTimeout(800);
  const sliders = await page.locator('input[type=range]').all();
  console.log('Slider count in chroma mode:', sliders.length);
  for (const s of sliders) {
    const box = await s.boundingBox();
    if (box) {
      await s.fill(String(80)).catch(() => {});
    }
  }
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/private/tmp/claude-501/-Users-nguyenthien-Downloads-D---N-AVA-LIVETREAMS/2362e79e-0b28-41f0-9ad7-04b53a76014d/scratchpad/06-sliders-moved.png' });

  console.log('FINAL ERRORS:', JSON.stringify(errors, null, 2));
  await browser.close();
  console.log('ERRORS:', JSON.stringify(errors, null, 2));
})();
