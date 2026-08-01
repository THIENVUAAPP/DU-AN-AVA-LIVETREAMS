with open('api/extract.py', 'r') as f:
    content = f.read()

old_res = """                    'streamUrl': info.get('url'), 
                    'title': info.get('title'), 
                    'viewers': info.get('view_count'), 
                    'uploader': info.get('uploader'), 
                    'thumbnail': info.get('thumbnail')"""

new_res = """                    'streamUrl': info.get('url'), 
                    'ext': info.get('ext'),
                    'title': info.get('title'), 
                    'viewers': info.get('view_count'), 
                    'uploader': info.get('uploader'), 
                    'thumbnail': info.get('thumbnail')"""
content = content.replace(old_res, new_res)

with open('api/extract.py', 'w') as f:
    f.write(content)
