import re

with open('scripts/create_standalone_zip.cjs', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all occurrences of "%~dp0system" with "system"
content = content.replace('"%~dp0system"', '"system"')
content = content.replace('"%~dp0system\\\\', '"system\\\\')
content = content.replace('"%~dp0system\\', '"system\\')

with open('scripts/create_standalone_zip.cjs', 'w', encoding='utf-8') as f:
    f.write(content)
