import http from 'http';
import https from 'https';

export const config = {
  api: {
    responseLimit: false,
  },
};

export default function handler(req, res) {
  const streamUrl = req.query.url;
  if (!streamUrl) {
    return res.status(400).send('Missing stream URL');
  }

  const isHls = streamUrl.includes('.m3u8') || streamUrl.includes('/hls');
  const isTs = streamUrl.includes('.ts');
  let contentType = 'video/x-flv';
  if (isHls) contentType = 'application/vnd.apple.mpegurl';
  else if (isTs) contentType = 'video/mp2t';

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Content-Type', contentType);

  const fetchStream = (targetUrl) => {
    try {
      const parsedUrl = new URL(targetUrl);
      const clientLib = parsedUrl.protocol === 'http:' ? http : https;

      const proxyReq = clientLib.get(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Referer': 'https://www.tiktok.com/',
          'Origin': 'https://www.tiktok.com'
        }
      }, (proxyRes) => {
        if (proxyRes.statusCode === 301 || proxyRes.statusCode === 302) {
          const redirectUrl = proxyRes.headers.location;
          if (redirectUrl) {
            return fetchStream(redirectUrl);
          }
        }

        proxyRes.pipe(res);
        proxyRes.on('error', (err) => {
          console.warn('[Vercel Stream Proxy pipe error]:', err.message);
          res.end();
        });
      });

      proxyReq.on('error', (err) => {
        console.warn('[Vercel Stream Proxy req error]:', err.message);
        if (!res.headersSent) res.status(500).send('Proxy error');
        else res.end();
      });

      req.on('close', () => {
        proxyReq.destroy();
      });
    } catch (e) {
      console.warn('[Vercel Stream Proxy URL error]:', e.message);
      if (!res.headersSent) res.status(500).send('Proxy error');
    }
  };

  fetchStream(streamUrl);
}
