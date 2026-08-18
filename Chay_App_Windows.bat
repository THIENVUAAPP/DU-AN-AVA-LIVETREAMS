@echo off
chcp 65001 >nul
title AVALIVE LIVESTREAM VIP PRO - 1-CLICK RUN (WINDOWS)
cd /d "%~dp0"

echo =================================================================
echo   🚀 ĐANG KHỞI ĐỘNG HỆ THỐNG AVALIVE LIVESTREAM VIP PRO (WINDOWS)
echo =================================================================
echo.

rem 1. Kiểm tra Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️ CHÚ Ý: Chưa tìm thấy Node.js trên máy tính của bạn.
    echo 👉 Vui lòng tải và cài đặt Node.js miễn phí tại: https://nodejs.org (Bản LTS khuyên dùng)
    echo Sau khi cài xong, chỉ cần nhấn đúp chuột vào file này một lần nữa để chạy!
    echo.
    pause
    exit /b 1
)

echo ✅ Đã phát hiện Node.js

rem 2. Tạo file cấu hình .env nếu chưa có
if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul
        echo ⚙️ Đã tự động khởi tạo file cấu hình .env
    )
)

rem 3. Tự động cài đặt thư viện cần thiết nếu chưa có
if not exist "node_modules\express" (
    echo 📦 Đang tự động nạp thư viện hệ thống lần đầu (chỉ mất vài giây)...
    call npm install --omit=dev --no-audit --no-fund
    echo ✅ Cài đặt thư viện hoàn tất!
)

echo 📡 Đang khởi động Server TikTok Live Connector & Giao Diện Game...
echo 🌐 Ứng dụng sẽ tự động mở tại: http://localhost:3001
echo.

rem 4. Mở trình duyệt web tự động sau 2 giây
start "" http://localhost:3001

rem 5. Khởi chạy Backend Server
node backend/server.cjs

pause
