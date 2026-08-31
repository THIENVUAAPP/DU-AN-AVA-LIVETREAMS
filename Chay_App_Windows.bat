@echo off
chcp 65001 >nul
title AVALIVE LIVESTREAM VIP PRO - PHẦN MỀM LIVESTREAM AI
cd /d "%~dp0"

echo =================================================================
echo   🚀 ĐANG KHỞI ĐỘNG HỆ THỐNG AVALIVE LIVESTREAM VIP PRO
echo =================================================================
echo.

set "NODE_EXE=node"
if exist "%~dp0node_portable\node.exe" (
    set "NODE_EXE=%~dp0node_portable\node.exe"
    echo [OK] Đã phát hiện Node.js Portable (Sẵn sàng 100%%)
) else (
    where node >nul 2>nul
    if %errorlevel% equ 0 (
        echo [OK] Đã phát hiện Node.js hệ thống
    ) else (
        echo [THÔNG BÁO] Đang kết nối Cloud Studio tại: https://avalivepro.vercel.app
        start "" https://avalivepro.vercel.app
        pause
        exit /b
    )
)

echo [1/2] Đang khởi chạy Hệ thống Xử lý Tín hiệu & TikTok Live Engine...
if exist "%~dp0core_system\backend\server.cjs" (
    cd /d "%~dp0core_system"
    start /b "" "%NODE_EXE%" backend/server.cjs >nul 2>nul
) else (
    start /b "" "%NODE_EXE%" backend/server.cjs >nul 2>nul
)

timeout /t 2 /nobreak >nul 2>nul

echo [2/2] Đang mở giao diện Phần mềm AvaLive Studio...
echo.
echo =================================================================
echo   ✨ PHẦN MỀM ĐÃ SẴN SÀNG HOẠT ĐỘNG!
echo   🌐 Địa chỉ máy chủ: http://localhost:3001
echo   💡 Vui lòng KHÔNG tắt cửa sổ màu đen này khi đang livestream.
echo =================================================================

set "APP_URL=http://localhost:3001"

start "" msedge.exe --app=%APP_URL% >nul 2>nul
if %errorlevel% equ 0 goto launched

start "" chrome.exe --app=%APP_URL% >nul 2>nul
if %errorlevel% equ 0 goto launched

start "" %APP_URL%

:launched
echo.
echo Nhấn phím bất kỳ hoặc đóng cửa sổ này để tắt phần mềm.
pause >nul
exit
