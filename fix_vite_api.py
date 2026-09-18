with open('vite.config.js', 'r') as f:
    content = f.read()

old_print = "print(json.dumps({'streamUrl': info.get('url'), 'title': info.get('title')}))"
new_print = "print(json.dumps({'streamUrl': info.get('url'), 'title': info.get('title'), 'viewers': info.get('view_count'), 'uploader': info.get('uploader'), 'thumbnail': info.get('thumbnail')}))"
content = content.replace(old_print, new_print)

with open('vite.config.js', 'w') as f:
    f.write(content)
