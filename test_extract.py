import yt_dlp
import sys

ydl_opts = {
    'quiet': False,
    'format': 'best',
    'no_warnings': True,
    'http_headers': {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
    },
    'sleep_interval': 2,
    'max_sleep_interval': 5,
}

try:
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info('https://www.tiktok.com/@thukabi1/live', download=False)
        print("Success:", info.get('url')[:50])
except Exception as e:
    print("Error:", str(e))
