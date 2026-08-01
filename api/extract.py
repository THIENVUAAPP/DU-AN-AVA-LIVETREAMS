from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import yt_dlp
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        query_components = parse_qs(urlparse(self.path).query)
        url = query_components.get("url", [None])[0]
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        if not url:
            self.wfile.write(json.dumps({'error': 'No URL provided'}).encode('utf-8'))
            return
            
        ydl_opts = {'quiet': True, 'format': 'best[ext=flv]/best', 'no_warnings': True}
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                res = {
                    'streamUrl': info.get('url'), 
                    'ext': info.get('ext'),
                    'title': info.get('title'), 
                    'viewers': info.get('view_count'), 
                    'uploader': info.get('uploader'), 
                    'thumbnail': info.get('thumbnail')
                }
                self.wfile.write(json.dumps(res).encode('utf-8'))
        except Exception as e:
            self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
