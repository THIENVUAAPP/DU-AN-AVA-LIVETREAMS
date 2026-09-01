import re

with open('scripts/create_standalone_zip.cjs', 'r', encoding='utf-8') as f:
    content = f.read()

new_node_check = """set "NODE_EXE=node"
if exist "%~dp0system\\\\node_portable\\\\node.exe" (
    set "NODE_EXE=%~dp0system\\\\node_portable\\\\node.exe"
    echo [OK] Da ket noi He thong Runtime Portable tich hop san
    goto start_server
)

where node >nul 2>nul
if not errorlevel 1 (
    echo [OK] Da ket noi Node.js he thong
    goto start_server
)

echo [THONG BAO] Đang ket noi Cloud Studio tai: https://avalivepro.vercel.app/desktop
start "" https://avalivepro.vercel.app/desktop
pause
exit /b

:start_server"""

old_node_check = """set "NODE_EXE=node"
if exist "%~dp0system\\\\node_portable\\\\node.exe" (
    set "NODE_EXE=%~dp0system\\\\node_portable\\\\node.exe"
    echo [OK] Đã kết nối Hệ thống Runtime Portable tích hợp sẵn
) else (
    where node >nul 2>nul
    if %errorlevel% equ 0 (
        echo [OK] Đã kết nối Node.js hệ thống
    ) else (
        echo [THÔNG BÁO] Đang kết nối Cloud Studio tại: https://avalivepro.vercel.app/desktop
        start "" https://avalivepro.vercel.app/desktop
        pause
        exit /b
    )
)"""

content = content.replace(old_node_check, new_node_check)
content = content.replace('Tín hiệu & TikTok', 'Tín hiệu ^& TikTok')
content = content.replace('Recurse | Unblock', 'Recurse ^| Unblock')

# Force CRLF for the .bat file
content = re.sub(r'(const winBatLauncher = `[^`]+`);', r'\g<1>.replace(/\\n/g, "\\r\\n");', content)

with open('scripts/create_standalone_zip.cjs', 'w', encoding='utf-8') as f:
    f.write(content)
