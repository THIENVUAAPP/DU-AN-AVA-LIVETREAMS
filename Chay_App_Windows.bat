@echo off
chcp 65001 >nul
title AVALIVE LIVESTREAM VIP PRO - 1-CLICK RUN (WINDOWS)
cd /d "%~dp0"

echo =================================================================
echo   🚀 ĐANG KHỞI ĐỘNG HỆ THỐNG AVALIVE LIVESTREAM VIP PRO (WINDOWS)
echo =================================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️ CHÚ Ý: Chưa tìm thấy Node.js trên máy tính của bạn.
    echo 👉 Vui lòng tải và cài đặt Node.js miễn phí tại: https://nodejs.org (Bản LTS)
    echo Sau khi cài xong, chỉ cần nhấn đúp chuột vào file này một lần nữa để chạy!
    echo.
    pause
    exit /b 1
)

echo ✅ Đã phát hiện Node.js
echo 📡 Đang khởi động Server TikTok Live Connector & Giao Diện Game...
echo.

rem Mở trình duyệt web tự động sau 2 giây
start "" http://localhost:3001

rem Khởi chạy Backend Server
node backend/server.cjs

pause
