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

rem 1.5. Tự động tin cậy chứng chỉ HTTPS nội bộ vào kho chứng chỉ của tài khoản hiện tại
rem (để trình duyệt KHÔNG hiện cảnh báo bảo mật khi mở app - không cần quyền Administrator)
if exist "certs\dev-cert.pem" (
    certutil -addstore -f -user "ROOT" "certs\dev-cert.pem" >nul 2>nul
)

rem 2. Mở trình duyệt web tự động ngay
start "" https://localhost:3001

rem 3. Kiểm tra Node.js Portable & Khởi chạy Backend Server
set NODE_EXE=node
if exist "node_portable\node.exe" (
    set NODE_EXE="%cd%\node_portable\node.exe"
    echo ✅ Đã phát hiện Node.js Portable ^(Chạy độc lập^)
) else (
    where node >nul 2>nul
    if %errorlevel% equ 0 (
        echo ✅ Đã phát hiện Node.js ^(Hệ thống^)
    ) else (
        echo ⚠️ Chưa phát hiện Node.js, đang mở bản Cloud Studio đồng bộ tại: https://avalivepro.vercel.app
        start "" https://avalivepro.vercel.app
        echo.
        echo 👉 Vui lòng tải lại bản cài đặt chuẩn có kèm Node.js Portable hoặc tự cài đặt từ https://nodejs.org!
        pause
        exit /b
    )
)

rem Tự động cài đặt dependencies nếu chưa có
if not exist "app_data\node_modules\" (
    echo ⏳ Lan dau chay: Dang tu dong thiet lap moi truong ^(vui long doi vai giay^)...
    cd app_data
    call %NODE_EXE% %~dp0node_portable\npm -g --prefix "%cd%" install --omit=dev 2>nul
    if errorlevel 1 call npm install --omit=dev
    cd ..
    echo ✅ Cai dat hoan tat!
    echo.
)

echo 📡 Đang khởi động Server TikTok Live Connector & Giao Diện Studio...
echo 🌐 Ứng dụng đang mở tại: https://localhost:3001
echo.
cd app_data
%NODE_EXE% backend/server.cjs

