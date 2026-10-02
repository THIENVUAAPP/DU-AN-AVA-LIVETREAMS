import re

with open('src/main.jsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = re.sub(r"const APP_VERSION = '.*?';", "const APP_VERSION = '5.4.36';", content)
with open('src/main.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/components/genaidol/UpdateNotificationModal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = re.sub(r"export const APP_VERSION = '.*?';", "export const APP_VERSION = '5.4.36';", content)
with open('src/components/genaidol/UpdateNotificationModal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
