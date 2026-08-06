import re

with open('vite.config.js', 'r') as f:
    content = f.read()

endpoint = """
          if (req.url.startsWith('/api/resolve-redirect')) {
            const queryUrl = new URL(req.url, 'http://localhost').searchParams.get('url');
            if (!queryUrl) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'No URL provided' }));
              return;
            }
            try {
               const https = await import('https');
               const http = await import('http');
               const client = queryUrl.startsWith('https') ? https : http;
               
               // We only need the headers to get the 'location' header
               const request = client.request(queryUrl, { method: 'HEAD' }, (response) => {
                  let finalUrl = queryUrl;
                  if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                      finalUrl = response.headers.location;
                  }
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ url: finalUrl }));
               });
               request.on('error', (e) => {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ url: queryUrl }));
               });
               request.end();
            } catch (e) {
               res.setHeader('Content-Type', 'application/json');
               res.end(JSON.stringify({ url: queryUrl }));
            }
            return;
          }
"""

if "/api/resolve-redirect" not in content:
    content = content.replace("if (req.url.startsWith('/api/extract')) {", endpoint + "\n          if (req.url.startsWith('/api/extract')) {")
    with open('vite.config.js', 'w') as f:
        f.write(content)
