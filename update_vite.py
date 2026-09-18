with open('vite.config.js', 'r') as f:
    content = f.read()

import re

# Find the middleware array or configureServer
new_configure = """
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url.startsWith('/proxy-hls')) {
            const queryUrl = new URL(req.url, 'http://localhost').searchParams.get('url');
            if (!queryUrl) return next();
            try {
              const fetch = (await import('node-fetch')).default || fetch;
              const response = await fetch(queryUrl, {
                headers: {
                  'Origin': 'https://www.tiktok.com',
                  'Referer': 'https://www.tiktok.com/',
                  'User-Agent': 'Mozilla/5.0'
                }
              });
              let text = await response.text();
              const baseUrl = queryUrl.substring(0, queryUrl.lastIndexOf('/') + 1);
              text = text.split('\\n').map(line => {
                const trimmed = line.trim();
                if (!trimmed) return line;
                if (trimmed.startsWith('#')) {
                  if (trimmed.includes('URI="')) {
                    return trimmed.replace(/URI="([^"]+)"/, (match, uri) => {
                      const absoluteUri = uri.startsWith('http') ? uri : baseUrl + uri;
                      return `URI="/proxy-hls?url=${encodeURIComponent(absoluteUri)}"`;
                    });
                  }
                  return line;
                }
                const absoluteUrl = trimmed.startsWith('http') ? trimmed : baseUrl + trimmed;
                return `/proxy-ts?url=${encodeURIComponent(absoluteUrl)}`;
              }).join('\\n');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
              res.end(text);
            } catch (e) { res.statusCode = 500; res.end(e.toString()); }
            return;
          }
          
          if (req.url.startsWith('/proxy-ts')) {
            const queryUrl = new URL(req.url, 'http://localhost').searchParams.get('url');
            if (!queryUrl) return next();
            try {
              const fetch = (await import('node-fetch')).default || fetch;
              const response = await fetch(queryUrl, {
                headers: {
                  'Origin': 'https://www.tiktok.com',
                  'Referer': 'https://www.tiktok.com/',
                  'User-Agent': 'Mozilla/5.0'
                }
              });
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Content-Type', 'video/MP2T');
              response.body.pipe(res);
            } catch (e) { res.statusCode = 500; res.end(e.toString()); }
            return;
          }
"""

content = content.replace("configureServer(server) {", new_configure)

# Also ensure yt-dlp in vite.config.js uses m3u8
content = content.replace("ydl_opts = {'quiet': True, 'format': 'best[ext=flv]/best', 'no_warnings': True}", "ydl_opts = {'quiet': True, 'format': 'best[protocol^=m3u8]/best', 'no_warnings': True}")

with open('vite.config.js', 'w') as f:
    f.write(content)
