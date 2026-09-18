const url = 'https://www.tiktok.com/@choosemee6666/live';
fetch(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
}).then(res => res.text()).then(html => {
  const match = html.match(/<script id="SIGI_STATE" type="application\/json">(.*?)<\/script>/s);
  if (match) {
    const data = JSON.parse(match[1]);
    console.log(Object.keys(data));
    console.log("Room data found!");
  } else {
    console.log("No SIGI_STATE found!");
    console.log(html.substring(0, 500));
  }
}).catch(console.error);
