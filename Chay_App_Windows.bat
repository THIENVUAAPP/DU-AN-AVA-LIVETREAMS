@echo off
chcp 65001 >nul
title AVALIVE LIVESTREAM VIP PRO - 1-CLICK RUN (WINDOWS)
cd /d "%~dp0"

echo =================================================================
echo   🚀 ĐANG KHỞI ĐỘNG HỆ THỐNG AVALIVE LIVESTREAM VIP PRO (WINDOWS)
echo =================================================================
echo.

if exist "app_data" (
    cd app_data
)

rem 1. Tạo file cấu hình .env nếu chưa có
if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul 2>nul
    )
)

rem 2. Mở trình duyệt web tự động ngay
start "" http://localhost:3001

rem 3. Kiểm tra Node.js & Khởi chạy Backend Server
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo ✅ Đã phát hiện Node.js
    echo 📡 Đang khởi động Server TikTok Live Connector & Giao Diện Studio...
    echo 🌐 Ứng dụng đang mở tại: http://localhost:3001
    echo.
    node backend/server.cjs
) else (
    echo ⚠️ Chưa phát hiện Node.js, đang mở bản Cloud Studio đồng bộ tại: https://avalivepro.vercel.app
    start "" https://avalivepro.vercel.app
    echo.
    echo 👉 Bạn cũng có thể cài đặt Node.js miễn phí tại: https://nodejs.org để chạy Server cục bộ!
    pause
)

