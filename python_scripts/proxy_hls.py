from http.server import BaseHTTPRequestHandler
from urllib import parse, request
import urllib.request
import re

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
                m3u8_content = response.read().decode('utf-8')
            
            # Replace all TS URLs (assuming they start with http or we need to handle relative)
            # TikTok usually returns absolute URLs in their M3U8.
            # We will use regex to find all URLs and replace them.
            # A URL in m3u8 is usually on a line by itself and doesn't start with #
            
            lines = m3u8_content.split('\n')
            modified_lines = []
            
            base_url = url[:url.rfind('/') + 1]
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                if line.startswith('#'):
                    # If it's a nested m3u8 playlist, proxy that too
                    if 'URI="' in line:
                        def replacer(match):
                            orig_url = match.group(1)
                            if not orig_url.startswith('http'):
                                orig_url = base_url + orig_url
                            return f'URI="/api/proxy_hls?url={parse.quote(orig_url)}"'
                        line = re.sub(r'URI="([^"]+)"', replacer, line)
                    modified_lines.append(line)
                else:
                    # It's a URL
                    if not line.startswith('http'):
                        line = base_url + line
                    # Route to proxy_ts
                    proxy_url = f"/api/proxy_ts?url={parse.quote(line)}"
                    modified_lines.append(proxy_url)
                    
            modified_m3u8 = '\n'.join(modified_lines)
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/vnd.apple.mpegurl')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(modified_m3u8.encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(str(e).encode('utf-8'))
