import urllib.request
import json
import re

url = "https://www.tiktok.com/@bf_doran_05/live"
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'})
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
    room_id_match = re.search(r'room_id=(\d+)', html)
    if room_id_match:
        print("Room ID:", room_id_match.group(1))
    else:
        print("Room ID not found")
except Exception as e:
    print("Error:", e)
