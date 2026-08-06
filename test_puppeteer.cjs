const puppeteer = require('puppeteer');

(async () => {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    let streamUrl = null;

    page.on('request', request => {
        const url = request.url();
        if (url.includes('.flv') || url.includes('.m3u8')) {
            console.log("Found stream URL:", url);
            streamUrl = url;
        }
    });

    console.log("Navigating to TikTok live...");
    try {
        await page.goto('https://www.tiktok.com/@bf_apex03/live', { waitUntil: 'networkidle2', timeout: 15000 });
    } catch (e) {
        console.log("Navigation timeout or error:", e.message);
    }
    
    // Wait a bit more just in case
    await new Promise(r => setTimeout(r, 5000));
    
    if (streamUrl) {
        console.log("SUCCESS! Stream URL:", streamUrl);
    } else {
        console.log("FAILED to find stream URL.");
    }

    await browser.close();
})();
