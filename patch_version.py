import re

with open('src/main.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r"const APP_VERSION = '.*?';", "const APP_VERSION = '5.4.35';", content)

with open('src/main.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
