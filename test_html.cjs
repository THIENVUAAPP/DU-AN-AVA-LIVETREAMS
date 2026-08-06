const fs = require('fs');
async function test() {
    try {
        const fetch = global.fetch;
        const res = await fetch('https://www.tiktok.com/@phuonglenxx/live', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
            }
        });
        const text = await res.text();
        fs.writeFileSync('tiktok_live.html', text);
        const match = text.match(/"hls_pull_url":"([^"]+)"/);
        if (match) {
            console.log("Found HLS URL:", match[1].replace(/\\u002F/g, '/'));
        } else {
            console.log("Not found hls_pull_url");
        }
    } catch (e) {
        console.error(e);
    }
}
test();
