import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { spawn } from 'child_process';

export default defineConfig({
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    {
      name: 'local-vercel-api',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url.startsWith('/proxy-hls')) {
            const queryUrl = new URL(req.url, 'http://localhost').searchParams.get('url');
            if (!queryUrl) return next();
            try {
              const fetch = global.fetch;
              const response = await fetch(queryUrl, {
                headers: {
                  'Origin': 'https://www.tiktok.com',
                  'Referer': 'https://www.tiktok.com/',
                  'User-Agent': 'Mozilla/5.0'
                }
              });
              let text = await response.text();
              const baseUrl = queryUrl.substring(0, queryUrl.lastIndexOf('/') + 1);
              text = text.split('\n').map(line => {
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
              }).join('\n');
              res.setHeader('Access-Control-Allow-Origin', '*');
              if (req.method === 'OPTIONS') {
                  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
                  res.setHeader('Access-Control-Allow-Headers', '*');
                  res.statusCode = 200;
                  res.end();
                  return;
              }
              res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
              res.end(text);
            } catch (e) { res.statusCode = 500; res.end(e.toString()); }
            return;
          }
          
          if (req.url.startsWith('/proxy-ts')) {
            const queryUrl = new URL(req.url, 'http://localhost').searchParams.get('url');
            if (!queryUrl) return next();
            try {
              const fetch = global.fetch;
              const response = await fetch(queryUrl, {
                headers: {
                  'Origin': 'https://www.tiktok.com',
                  'Referer': 'https://www.tiktok.com/',
                  'User-Agent': 'Mozilla/5.0'
                }
              });
              res.setHeader('Access-Control-Allow-Origin', '*');
              if (req.method === 'OPTIONS') {
                  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
                  res.setHeader('Access-Control-Allow-Headers', '*');
                  res.statusCode = 200;
                  res.end();
                  return;
              }
              
              const contentType = response.headers.get('content-type');
              if (contentType) {
                  res.setHeader('Content-Type', contentType);
              } else {
                  res.setHeader('Content-Type', 'video/MP2T');
              }
              
              if (response.body.pipe) {
                  response.body.pipe(res);
              } else {
                  const { Readable } = await import('stream');
                  Readable.fromWeb(response.body).pipe(res);
              }

            } catch (e) { res.statusCode = 500; res.end(e.toString()); }
            return;
          }

          if (req.url.startsWith('/api/extract')) {
            // Fix for URL parsing in Vite dev server middleware
            const queryUrl = new URL(req.url, 'http://localhost').searchParams.get('url');
            
            if (!queryUrl) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'No URL provided' }));
              return;
            }

            const pythonProcess = spawn('./yt-dlp', [
              '--dump-json',
              '--quiet',
              '--no-warnings',
              '-f', 'best[protocol*=m3u8]/best',
              queryUrl
            ]);

            let data = '';
            let errorData = '';
            pythonProcess.stdout.on('data', (chunk) => data += chunk);
            pythonProcess.stderr.on('data', (chunk) => errorData += chunk);
            pythonProcess.on('close', (code) => {
              if (code !== 0 && errorData) {
                  console.error('yt-dlp error:', errorData);
              }
              res.setHeader('Content-Type', 'application/json');
              try {
                const parsed = JSON.parse(data);
                if (parsed.url) {
                    res.end(JSON.stringify({
                        streamUrl: parsed.url,
                        title: parsed.title,
                        viewers: parsed.view_count,
                        uploader: parsed.uploader,
                        thumbnail: parsed.thumbnail,
                        ext: parsed.ext,
                        protocol: parsed.protocol,
                        isLive: parsed.is_live
                    }));
                } else {
                    res.end(JSON.stringify({ error: 'No URL found', stderr: errorData }));
                }
              } catch (e) {
                res.end(JSON.stringify({ error: e.toString(), stderr: errorData }));
              }
            });
            return;
          }
          next();
        });
      }
    }
  ],
});
