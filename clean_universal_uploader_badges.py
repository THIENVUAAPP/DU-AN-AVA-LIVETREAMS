import re

with open('src/components/UniversalFileUploader.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the specific block of empty badges
content = re.sub(r'<div className="flex flex-wrap items-center gap-2">\s*<span className="px-3 py-1 rounded-full bg-purple[^>]+>\s*<\/span>\s*<span className="px-3 py-1 rounded-full bg-emerald[^>]+>\s*<\/span>\s*<\/div>', '', content)

with open('src/components/UniversalFileUploader.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
