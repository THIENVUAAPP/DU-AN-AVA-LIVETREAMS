const axios = require('axios');

async function test() {
  try {
    const roomId = '7398188165683268370'; // Example roomId
    // Test webcast room info API
    const res = await axios.get(`https://webcast.tiktok.com/webcast/room/info/?room_id=${roomId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    
    console.log("Response keys:", Object.keys(res.data));
    if (res.data.data && res.data.data.stream_url) {
      console.log("STREAM URL FOUND:", res.data.data.stream_url.rtmp_pull_url);
    } else {
      console.log(res.data);
    }
  } catch (e) {
    console.error("Error:", e.message);
  }
}
test();
