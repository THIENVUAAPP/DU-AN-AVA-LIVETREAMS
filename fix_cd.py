import re

with open('scripts/create_standalone_zip.cjs', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace cd /d "%~dp0system" with cd system
content = content.replace('cd /d "%~dp0system"', 'cd system')

# Replace NODE_EXE=system\node_portable\node.exe with node_portable\node.exe
# because we will CD into system before running it?
# Wait, where is NODE_EXE set? Before CD!
# So if we set NODE_EXE=node_portable\node.exe, it will be correct AFTER we cd system.
content = content.replace('set "NODE_EXE=system\\\\node_portable\\\\node.exe"', 'set "NODE_EXE=node_portable\\\\node.exe"')
content = content.replace('if exist "system\\\\node_portable\\\\node.exe" (', 'if exist "system\\\\node_portable\\\\node.exe" (')

# Also replace "%~dp0" with "." in other places if any, but "%~dp0" at the top is fine (cd /d "%~dp0").
# If it fails, it stays in current dir.
# Wait, powershell -Command "Get-ChildItem -Path '%~dp0' -Recurse" -> '%~dp0' might be mangled.
# Change to '.'
content = content.replace("Get-ChildItem -Path '%~dp0'", "Get-ChildItem -Path '.'")
content = content.replace('attrib +h "%~dp0system"', 'attrib +h "system"')

with open('scripts/create_standalone_zip.cjs', 'w', encoding='utf-8') as f:
    f.write(content)
