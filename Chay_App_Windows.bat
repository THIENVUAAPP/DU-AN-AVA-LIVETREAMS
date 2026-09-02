@echo off
chcp 65001 >nul
title AVALIVE LIVESTREAM VIP PRO - PHẦN MỀM LIVESTREAM AI
cd /d "%~dp0"

echo =================================================================
echo   🚀 ĐANG KHỞI ĐỘNG HỆ THỐNG AVALIVE LIVESTREAM VIP PRO
echo =================================================================
echo.

rem 1. Dọn dẹp các phiên bản cũ bị treo cổng 3001 nếu có
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":3001" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>nul
)

rem 2. Kiểm tra bộ chạy Node.js
set "NODE_EXE=node"
if exist "%~dp0system\node_portable\node.exe" (
    set "NODE_EXE=%~dp0system\node_portable\node.exe"
    echo [OK] Đã kết nối Hệ thống Runtime Portable tích hợp sẵn
) else if exist "%~dp0node_portable\node.exe" (
    set "NODE_EXE=%~dp0node_portable\node.exe"
    echo [OK] Đã kết nối Hệ thống Runtime Portable tích hợp sẵn
) else (
    where node >nul 2>nul
    if %errorlevel% equ 0 (
        echo [OK] Đã kết nối Node.js hệ thống
    ) else (
        echo [THÔNG BÁO] Đang kết nối Cloud Studio tại: https://avalivepro.vercel.app
        start "" https://avalivepro.vercel.app
        pause
        exit /b
    )
)

rem 3. Khởi chạy máy chủ Backend xử lý TikTok Live
echo [1/2] Đang kích hoạt Bộ xử lý Tín hiệu & TikTok Live Engine...
if exist "%~dp0system\core.cjs" (
    cd /d "%~dp0system"
    start "AvaLive_Backend_Server" /b "%NODE_EXE%" core.cjs
) else if exist "%~dp0core.cjs" (
    start "AvaLive_Backend_Server" /b "%NODE_EXE%" core.cjs
) else (
    start "AvaLive_Backend_Server" /b "%NODE_EXE%" backend/server.cjs
)

rem 4. Chờ 1.5 giây để Server sẵn sàng
timeout /t 2 /nobreak >nul 2>nul

echo [2/2] Đang mở giao diện Phần mềm AvaLive Studio...
echo.
echo =================================================================
echo   ✨ PHẦN MỀM ĐÃ SẴN SÀNG HOẠT ĐỘNG!
echo   🌐 Địa chỉ máy chủ: http://127.0.0.1.nip.io:3001
echo   💡 Vui lòng KHÔNG tắt cửa sổ màu đen này khi đang livestream.
echo =================================================================

set "APP_URL=http://127.0.0.1.nip.io:3001/?update_cache=%RANDOM%"

rem 5. Mở ứng dụng ở chế độ Cửa Sổ Desktop Native App
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --app=%APP_URL%
    goto launched
)
if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" --app=%APP_URL%
    goto launched
)
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app=%APP_URL%
    goto launched
)
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" --app=%APP_URL%
    goto launched
)
if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" (
    start "" "%LocalAppData%\Google\Chrome\Application\chrome.exe" --app=%APP_URL%
    goto launched
)

rem Mở bằng trình duyệt mặc định nếu không tìm thấy đường dẫn riêng
start "" %APP_URL%

:launched
echo.
echo 👉 Nhấn phím bất kỳ hoặc đóng cửa sổ này khi muốn tắt phần mềm.
pause >nul
exit
