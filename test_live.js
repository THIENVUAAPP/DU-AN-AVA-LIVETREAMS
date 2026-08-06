const { execSync } = require('child_process');
try {
    const out = execSync('./yt-dlp --dump-json --quiet --no-warnings -f "best[protocol*=m3u8]/best" "https://www.tiktok.com/@ninh.2708/live"').toString();
    console.log("Output length:", out.length);
} catch (e) {
    console.log("Error:", e.message);
}
