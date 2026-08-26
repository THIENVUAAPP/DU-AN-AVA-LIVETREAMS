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
        copy .env.example .env >nul
    )
)

rem 2. Mở trình duyệt web tự động ngay
start "" http://localhost:3001

rem 3. Kiểm tra Node.js & Khởi chạy Backend Server
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️ CHÚ Ý: Chưa tìm thấy Node.js trên máy tính của bạn.
    echo 👉 Vui lòng tải và cài đặt Node.js miễn phí tại: https://nodejs.org
    echo Sau khi cài xong, chỉ cần nhấn đúp chuột vào file này một lần nữa để chạy!
    echo.
    pause
    exit /b 1
)

echo ✅ Đã phát hiện Node.js
echo 📡 Đang khởi động Server TikTok Live Connector & Giao Diện Game...
echo 🌐 Ứng dụng đang mở tại: http://localhost:3001
echo.

node backend/server.cjs

pause
