import urllib.request

url = "https://pull-hls-f16-sg01.tiktokcdn.com/game/stream-1560983914465460308_hd/index.m3u8?expire=1786852707&sign=c11a59eef9ba43afdc66ebc4b2fd3dbf"
try:
    response = urllib.request.urlopen(url)
    content = response.read().decode('utf-8')
    print("M3U8 Content:")
    print(content)
except Exception as e:
    print(e)
