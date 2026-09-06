import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';

// Sử dụng HTTP chuẩn cho local (localhost / 127.0.0.1) để TikTok LIVE Studio kết nối trực tiếp mượt mà 100% không bị chặn SSL
const useHttpsEnv = process.env.VITE_USE_HTTPS === 'true';
const devCertPath = path.resolve(__dirname, 'certs/dev-cert.pem');
const devKeyPath = path.resolve(__dirname, 'certs/dev-key.pem');
const httpsConfig = useHttpsEnv && fs.existsSync(devCertPath) && fs.existsSync(devKeyPath)
  ? { cert: fs.readFileSync(devCertPath), key: fs.readFileSync(devKeyPath) }
  : undefined;

export default defineConfig({
  base: '/',
  server: {
    port: 5173,
    open: false,
    host: true,
    https: httpsConfig,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true
      },
      '/socket.io': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        ws: true
      }
    }
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
          if (req.url.startsWith('/uploads/')) {
            const cleanPath = req.url.split('?')[0];
            const filePath = path.resolve(__dirname, 'backend' + cleanPath);
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              const stat = fs.statSync(filePath);
              const fileSize = stat.size;
              const range = req.headers.range;
              const ext = path.extname(filePath).toLowerCase();
              const contentType = ext === '.mp4' ? 'video/mp4' : ext === '.webm' ? 'video/webm' : ext === '.mov' ? 'video/quicktime' : ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'application/octet-stream';

              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
              res.setHeader('Access-Control-Allow-Headers', '*');

              if (req.method === 'OPTIONS') {
                res.statusCode = 204;
                res.end();
                return;
              }

              if (req.method === 'HEAD') {
                res.setHeader('Content-Length', fileSize);
                res.setHeader('Content-Type', contentType);
                res.setHeader('Accept-Ranges', 'bytes');
                res.statusCode = 200;
                res.end();
                return;
              }

              if (range) {
                const parts = range.replace(/bytes=/, "").split("-");
                let start = 0;
                let end = fileSize - 1;

                if (parts[0] === '' && parts[1]) {
                  const suffix = parseInt(parts[1], 10);
                  if (!isNaN(suffix) && suffix > 0) {
                    start = Math.max(0, fileSize - suffix);
                    end = fileSize - 1;
                  }
                } else {
                  start = parseInt(parts[0], 10);
                  if (isNaN(start) || start < 0 || start >= fileSize) {
                    res.statusCode = 416;
                    res.setHeader('Content-Range', `bytes */${fileSize}`);
                    res.end();
                    return;
                  }

                  if (parts[1] && parts[1].trim() !== '') {
                    end = parseInt(parts[1], 10);
                    if (isNaN(end) || end >= fileSize) end = fileSize - 1;
                  } else {
                    const CHUNK_SIZE = 8 * 1024 * 1024; // 8MB
                    end = Math.min(start + CHUNK_SIZE - 1, fileSize - 1);
                  }
                }

                const chunksize = (end - start) + 1;
                res.writeHead(206, {
                  'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                  'Accept-Ranges': 'bytes',
                  'Content-Length': chunksize,
                  'Content-Type': contentType,
                });

                const file = fs.createReadStream(filePath, { start, end });
                req.on('close', () => { try { file.destroy(); } catch (e) {} });
                file.on('error', () => { try { file.destroy(); } catch (e) {} });
                file.pipe(res);
              } else {
                res.writeHead(200, {
                  'Content-Length': fileSize,
                  'Content-Type': contentType,
                  'Accept-Ranges': 'bytes',
                });
                const file = fs.createReadStream(filePath);
                req.on('close', () => { try { file.destroy(); } catch (e) {} });
                file.on('error', () => { try { file.destroy(); } catch (e) {} });
                file.pipe(res);
              }
              return;
            }
          }

          if (req.url.startsWith('/proxy-page')) {
            const queryUrl = new URL(req.url, 'http://localhost').searchParams.get('url');
            if (!queryUrl) return next();
            try {
              const fetch = global.fetch;
              const response = await fetch(queryUrl, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
                  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                  'Accept-Language': 'en-US,en;q=0.5',
                }
              });
              let html = await response.text();
              
              // Inject base tag
              const baseUrl = new URL(queryUrl).origin + '/';
              html = html.replace('<head>', `<head><base href="${baseUrl}">`);
              
              // Copy headers but omit security headers that prevent iframe embedding
              response.headers.forEach((value, key) => {
                const lowerKey = key.toLowerCase();
                if (!['x-frame-options', 'content-security-policy', 'content-encoding', 'transfer-encoding'].includes(lowerKey)) {
                  res.setHeader(key, value);
                }
              });
              
              res.setHeader('Content-Type', 'text/html; charset=utf-8');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(html);
            } catch (e) {
              res.statusCode = 500;
              res.end(e.toString());
            }
            return;
          }

          if (req.url.startsWith('/proxy-hls')) {
            const queryUrl = new URL(req.url, 'http://localhost').searchParams.get('url');
            if (!queryUrl) return next();
            try {
              const fetch = global.fetch;
              const response = await fetch(queryUrl, {
                headers: {
                  'Origin': 'https://www.tiktok.com',
                  'Referer': 'https://www.tiktok.com/',
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
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
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
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
                  response.body.pipe(res).on('error', (e) => console.log('Stream pipe error:', e.message));
              } else {
                  const { Readable } = await import('stream');
                  const nodeStream = Readable.fromWeb(response.body);
                  nodeStream.on('error', (e) => console.log('Node stream error:', e.message));
                  nodeStream.pipe(res).on('error', (e) => console.log('Response pipe error:', e.message));
              }

            } catch (e) { 
              if (!res.headersSent) {
                res.statusCode = 500; 
                res.end(e.toString()); 
              }
            }
            return;
          }

          
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
               
               const options = {
                  method: 'HEAD',
                  headers: {
                     'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                     'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                     'Accept-Language': 'en-US,en;q=0.5'
                  }
               };
               const request = client.request(queryUrl, options, (response) => {
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

          if (req.url.startsWith('/api/tts')) {
            try {
              const urlObj = new URL(req.url, 'http://localhost');
              const text = urlObj.searchParams.get('text') || 'Xin chào';
              const lang = urlObj.searchParams.get('lang') || 'vi';
              const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(lang)}&q=${encodeURIComponent(text.slice(0, 200))}`;
              
              const https = await import('https');
              const gReq = https.get(googleUrl, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                  'Referer': 'https://translate.google.com/'
                }
              }, (gRes) => {
                res.setHeader('Content-Type', 'audio/mpeg');
                res.setHeader('Cache-Control', 'public, max-age=86400');
                gRes.pipe(res);
              });
              gReq.on('error', (err) => {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              });
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
            return;
          }

          if (req.url.startsWith('/api/gemini-reply')) {
            let bodyStr = '';
            req.on('data', chunk => { bodyStr += chunk; });
            req.on('end', async () => {
              try {
                const body = JSON.parse(bodyStr || '{}');
                const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || body.apiKey;
                if (!apiKey) {
                  res.statusCode = 503;
                  res.end(JSON.stringify({ error: 'Chưa cấu hình GEMINI_API_KEY' }));
                  return;
                }
                const prompt = body.kind === 'gift' 
                  ? `Bạn là MC livestream TikTok. Khán giả "${body.username || 'bạn'}" vừa tặng "${body.giftName || 'món quà'}". Viết 1 câu cảm ơn tự nhiên, hài hước, không quá 25 từ, không nói tục, chỉ trả về đúng 1 câu thoại tiếng Việt.`
                  : body.kind === 'welcome'
                    ? `Bạn là MC livestream TikTok. Khán giả "${body.username || 'bạn'}" vừa vào xem. Viết 1 câu chào mừng tự nhiên, duyên dáng, không quá 25 từ, không nói tục, chỉ trả về đúng 1 câu thoại tiếng Việt.`
                    : `Bạn là ${body.role === 'game' ? 'Bình luận viên game' : 'Trợ lý livestream bán hàng'} thông minh, thân thiện. Khán giả "${body.username || 'bạn'}" vừa hỏi/bình luận: "${body.question || body.comment || ''}". Trả lời thông minh, đúng câu hỏi, ngắn gọn (1-2 câu, dưới 25 từ), lịch sự, tuyệt đối không nói tục. Chỉ trả về đúng 1 câu thoại tiếng Việt.`;

                const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.85, maxOutputTokens: 100 }
                  })
                });
                const data = await gRes.json();
                const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()?.replace(/^["“]|["”]$/g, '') || 'Dạ cảm ơn bạn đã tương tác cùng livestream nha!';
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ text, audioBase64: null }));
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }

          // /api/extract has been completely removed to avoid yt-dlp dependencies
          next();
        });
      }
    },
    {
      name: 'remove-large-zips-for-vercel',
      closeBundle() {
        if (process.env.VERCEL) {
          const distDir = path.resolve(__dirname, 'dist');
          if (fs.existsSync(distDir)) {
            const files = fs.readdirSync(distDir);
            for (const file of files) {
              if (file.endsWith('.zip') || file.endsWith('.exe')) {
                try {
                  fs.unlinkSync(path.join(distDir, file));
                  console.log(`[Vercel Build Optimizer] Removed ${file} from dist to comply with Vercel 50MB limit.`);
                } catch (e) {}
              }
            }
          }
        }
      }
    }
  ],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) {
              return 'vendor-three';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
          }
        }
      }
    }
  }
});
