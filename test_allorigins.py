import urllib.request
import urllib.parse
import json
import re

def extract_tiktok(url):
    try:
        proxy_url = f"https://api.allorigins.win/get?url={urllib.parse.quote(url)}"
        req = urllib.request.Request(proxy_url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req, timeout=10)
        data = json.loads(res.read().decode('utf-8'))
        html = data.get('contents', '')
        
        hls_match = re.search(r'"hls_pull_url":"([^"]+)"', html)
        if hls_match:
            stream_url = hls_match.group(1).replace('\\u002F', '/').replace('\\/', '/')
            print("HLS:", stream_url)
            return
            
        print("Not found in HTML. length:", len(html))
    except Exception as e:
        print("Error:", e)

extract_tiktok('https://www.tiktok.com/@trinhlinhh19/live')
