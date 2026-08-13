from http.server import BaseHTTPRequestHandler
from urllib import parse
import urllib.request

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        query = parse.parse_qs(parse.urlparse(self.path).query)
        url = query.get('url', [None])[0]
        
        if not url:
            self.send_response(400)
            self.end_headers()
            return
            
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response:
                data = response.read()
                
            self.send_response(200)
            self.send_header('Content-Type', 'video/MP2T')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Cache-Control', 'public, max-age=31536000')
            self.end_headers()
            self.wfile.write(data)
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(str(e).encode('utf-8'))
