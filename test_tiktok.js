const https = require('https');
const url = 'https://www.tiktok.com/@thoitrangmevabe/live';

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/"roomId":"(\d+)"/);
    if (match) {
      console.log('Room ID:', match[1]);
      const roomUrl = `https://webcast.tiktok.com/webcast/room/info/?room_id=${match[1]}`;
      https.get(roomUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res2) => {
        let data2 = '';
        res2.on('data', chunk => data2 += chunk);
        res2.on('end', () => {
          console.log('Room Info Length:', data2.length);
          if (data2.includes('stream_url')) console.log('Found stream_url!');
        });
      });
    } else {
      console.log('No roomId found');
    }
  });
});
