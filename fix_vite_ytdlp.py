with open('vite.config.js', 'r') as f:
    content = f.read()

import re

old_spawn = """
            const pythonProcess = spawn('python3', [
              '-c',
              `
import yt_dlp
import json
import sys

url = sys.argv[1]
ydl_opts = {'quiet': True, 'format': 'best[protocol^=m3u8]/best', 'no_warnings': True}
try:
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        print(json.dumps({'streamUrl': info.get('url'), 'title': info.get('title'), 'viewers': info.get('view_count'), 'uploader': info.get('uploader'), 'thumbnail': info.get('thumbnail')}))
except Exception as e:
    print(json.dumps({'error': str(e)}))
              `,
              queryUrl
            ]);
"""

new_spawn = """
            const pythonProcess = spawn('./yt-dlp', [
              '--dump-json',
              '--quiet',
              '--no-warnings',
              '-f', 'best[protocol^=m3u8]/best',
              queryUrl
            ]);
"""

if old_spawn.strip() in content:
    content = content.replace(old_spawn.strip(), new_spawn.strip())
else:
    # Just in case whitespace doesn't match
    pass # Will handle differently if needed

with open('vite.config.js', 'w') as f:
    f.write(content)
