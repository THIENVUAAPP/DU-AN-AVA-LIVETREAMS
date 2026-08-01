with open('api/extract.py', 'r') as f:
    content = f.read()

old_opts = "ydl_opts = {'quiet': True, 'format': 'best[ext=flv]/best', 'no_warnings': True}"
new_opts = "ydl_opts = {'quiet': True, 'format': 'best[protocol^=m3u8]/best', 'no_warnings': True}"
content = content.replace(old_opts, new_opts)

with open('api/extract.py', 'w') as f:
    f.write(content)
