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

          if (req.url.startsWith('/api/extract')) {
            // Fix for URL parsing in Vite dev server middleware
            const queryUrl = new URL(req.url, 'http://localhost').searchParams.get('url');
            
            if (!queryUrl) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'No URL provided' }));
              return;
            }

            if (queryUrl.includes('tiktok.com')) {
              try {
                // Sử dụng puppeteer-extra và stealth plugin để lách Captcha/WAF
                const puppeteerExtra = (await import('puppeteer-extra')).default;
                const StealthPlugin = (await import('puppeteer-extra-plugin-stealth')).default;
                puppeteerExtra.use(StealthPlugin());

                const browser = await puppeteerExtra.launch({ 
                    headless: true, 
                    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
                });
                const page = await browser.newPage();
                
                const userAgents = [
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
                ];
                await page.setUserAgent(userAgents[Math.floor(Math.random() * userAgents.length)]);
                
                await page.goto(queryUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
                
                // Chờ thẻ SIGI_STATE xuất hiện để tránh lỗi context bị huỷ do redirect
                await page.waitForSelector('#SIGI_STATE', { timeout: 15000 }).catch(() => console.log('SIGI_STATE wait timeout'));
                
                // Trích xuất trực tiếp trạng thái phòng live từ mã nguồn HTML (SIGI_STATE)
                // Cách này lách 100% AI của TikTok vì không cần chờ tải video, lấy tận gốc link luồng Live
                const sigiState = await page.evaluate(() => {
                    const script = document.getElementById('SIGI_STATE');
                    return script ? script.textContent : null;
                });
                
                await browser.close();

                res.setHeader('Content-Type', 'application/json');
                
                if (sigiState) {
                    try {
                        const data = JSON.parse(sigiState);
                        const userInfo = data.LiveRoom.liveRoomUserInfo.user;
                        const isLive = data.LiveRoom.liveRoomUserInfo.liveRoom.status === 2;
                        
                        if (isLive) {
                            const streamDataStr = data.LiveRoom.liveRoomUserInfo.liveRoom.streamData.pull_data.stream_data;
                            const streamData = JSON.parse(streamDataStr);
                            
                            // Ưu tiên lấy flv độ phân giải cao nhất (origin -> uhd -> hd -> sd)
                            const qualities = ['origin', 'uhd', 'hd', 'sd', 'ld'];
                            let streamUrl = null;
                            let protocol = 'flv';
                            
                            for (const quality of qualities) {
                                if (streamData.data[quality] && streamData.data[quality].main) {
                                    if (streamData.data[quality].main.hls) {
                                        streamUrl = streamData.data[quality].main.hls;
                                        protocol = 'hls';
                                        break;
                                    } else if (streamData.data[quality].main.flv) {
                                        streamUrl = streamData.data[quality].main.flv;
                                        protocol = 'flv';
                                        break;
                                    }
                                }
                            }
                            
                            if (streamUrl) {
                                res.end(JSON.stringify({
                                    streamUrl: streamUrl,
                                    title: 'TikTok Live',
                                    ext: protocol === 'flv' ? 'flv' : 'm3u8',
                                    protocol: protocol,
                                    isLive: true
                                }));
                                return;
                            }
                        }
                    } catch (e) {
                        console.log('Error parsing SIGI_STATE:', e.message);
                    }
                }
                
                // Nếu không lấy được hoặc không live, để nó rơi xuống yt-dlp xử lý tiếp cho video thường
              } catch (e) {
                 console.log('Puppeteer extraction failed, falling back to yt-dlp', e.message);
              }
            }

            // Fallback to yt-dlp for non-TikTok URLs (e.g. Shopee, YouTube)
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
