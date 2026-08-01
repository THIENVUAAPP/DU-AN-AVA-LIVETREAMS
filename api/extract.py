import yt_dlp
import json
from http.server import BaseHTTPRequestHandler
from urllib import parse

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        s = self.path
        query_components = dict(parse.parse_qsl(parse.urlsplit(s).query))
        url = query_components.get('url', [''])[0]
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.end_headers()

        if not url:
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'No URL provided'}).encode('utf-8'))
            return
            
        ydl_opts = {'quiet': True, 'format': 'best[ext=flv]/best', 'no_warnings': True}
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                stream_url = info.get('url')
                title = info.get('title')
                self.wfile.write(json.dumps({'streamUrl': stream_url, 'title': title}).encode('utf-8'))
        except Exception as e:
            self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
