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
        server.middlewares.use((req, res, next) => {
          if (req.url.startsWith('/api/extract')) {
            // Fix for URL parsing in Vite dev server middleware
            const queryUrl = new URL(req.url, 'http://localhost').searchParams.get('url');
            
            if (!queryUrl) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'No URL provided' }));
              return;
            }

            const pythonProcess = spawn('python3', [
              '-c',
              `
import yt_dlp
import json
import sys

url = sys.argv[1]
ydl_opts = {'quiet': True, 'format': 'best', 'no_warnings': True}
try:
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        print(json.dumps({'streamUrl': info.get('url'), 'title': info.get('title')}))
except Exception as e:
    print(json.dumps({'error': str(e)}))
              `,
              queryUrl
            ]);

            let data = '';
            pythonProcess.stdout.on('data', (chunk) => data += chunk);
            pythonProcess.on('close', () => {
              res.setHeader('Content-Type', 'application/json');
              res.end(data);
            });
            return;
          }
          next();
        });
      }
    }
  ],
});
