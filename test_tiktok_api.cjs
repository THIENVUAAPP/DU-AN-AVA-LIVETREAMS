const https = require('https');
https.get('https://webcast.tiktok.com/webcast/room/info_by_user/?unique_id=milimnfriend', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.data && json.data.stream_url) {
                console.log("STREAM FOUND:");
                console.log(json.data.stream_url.flv_pull_url);
            } else {
                console.log("NO STREAM URL. JSON:", JSON.stringify(json).substring(0, 500));
            }
        } catch(e) { console.error(e); }
    });
});
