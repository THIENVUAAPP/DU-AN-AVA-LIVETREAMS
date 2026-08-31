const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('===========================================================');
console.log('📦 BẮT ĐẦU ĐÓNG GÓI BỘ CÀI STANDALONE ZIP CHO WINDOWS & MAC');
console.log('===========================================================');

const rootDir = path.join(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const macZipFileName = 'AvaLive_VIP_PRO_Mac.zip';
const winZipFileName = 'AvaLive_VIP_PRO_Windows.zip';
const macZipFilePath = path.join(publicDir, macZipFileName);
const winZipFilePath = path.join(publicDir, winZipFileName);

// 0. Xóa các file zip cũ để tránh Vite copy vào dist (gây lặp vô tận / Zip Bomb)
if (fs.existsSync(macZipFilePath)) fs.unlinkSync(macZipFilePath);
if (fs.existsSync(winZipFilePath)) fs.unlinkSync(winZipFilePath);

// 1. Build frontend dist mới nhất
console.log('\n[1/4] Đang biên dịch Frontend sang bản phát hành dist/ mới nhất...');
try {
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
} catch (err) {
  console.error('❌ Lỗi khi build frontend:', err);
  process.exit(1);
}

// 2. Tạo thư mục core_system (chứa toàn bộ backend + dist + dependencies cần thiết)
console.log('\n[2/4] Đang chuẩn bị lõi phần mềm core_system...');
const stagingDir = path.join(rootDir, '.temp_package_staging');
if (fs.existsSync(stagingDir)) fs.rmSync(stagingDir, { recursive: true, force: true });
fs.mkdirSync(stagingDir, { recursive: true });

const coreSystemDir = path.join(stagingDir, 'core_system');
fs.mkdirSync(coreSystemDir, { recursive: true });

// Copy dist, backend (trừ uploads rác), package.json vào core_system
execSync(`cp -R dist backend package.json package-lock.json "${coreSystemDir}/"`, { cwd: rootDir });
const coreUploadsDir = path.join(coreSystemDir, 'backend', 'uploads');
if (fs.existsSync(coreUploadsDir)) {
  fs.rmSync(coreUploadsDir, { recursive: true, force: true });
}
fs.mkdirSync(coreUploadsDir, { recursive: true });
fs.writeFileSync(path.join(coreUploadsDir, '.gitkeep'), '');
if (fs.existsSync(path.join(rootDir, 'certs'))) {
  execSync(`cp -R certs "${coreSystemDir}/"`, { cwd: rootDir });
}
if (fs.existsSync(path.join(rootDir, '.env.example'))) {
  execSync(`cp .env.example "${coreSystemDir}/.env"`, { cwd: rootDir });
}

// Cài đặt / sao chép các dependencies backend cốt lõi vào core_system/node_modules
console.log('   -> Đang tinh gọn thư viện Backend Runtime...');
const coreNodeModules = path.join(coreSystemDir, 'node_modules');
fs.mkdirSync(coreNodeModules, { recursive: true });

const essentialModules = [
  'express', 'socket.io', 'cors', 'multer', 'dotenv', 'tiktok-live-connector',
  'accepts', 'array-flatten', 'body-parser', 'bytes', 'content-disposition',
  'content-type', 'cookie', 'cookie-signature', 'debug', 'depd', 'encodeurl',
  'escape-html', 'etag', 'finalhandler', 'fresh', 'http-errors', 'inherits',
  'ipaddr.js', 'media-typer', 'merge-descriptors', 'methods', 'mime', 'mime-db',
  'mime-types', 'ms', 'negotiator', 'on-finished', 'parseurl', 'path-to-regexp',
  'proxy-addr', 'qs', 'range-parser', 'raw-body', 'safe-buffer', 'safer-buffer',
  'send', 'serve-static', 'setprototypeof', 'statuses', 'toidentifier', 'type-is',
  'unpipe', 'utils-merge', 'vary', 'engine.io', 'engine.io-parser', 'socket.io-parser',
  'ws', 'base64id', 'protobufjs', '@protobufjs', 'axios', 'follow-redirects', 'form-data',
  'combined-stream', 'delayed-stream', 'asynckit', 'mime-types', 'proxy-from-env'
];

for (const mod of essentialModules) {
  const srcModPath = path.join(rootDir, 'node_modules', mod);
  const destModPath = path.join(coreNodeModules, mod);
  if (fs.existsSync(srcModPath) && !fs.existsSync(destModPath)) {
    try {
      execSync(`cp -R "${srcModPath}" "${destModPath}"`);
    } catch (e) {}
  }
}

// 3. Tạo file Hướng dẫn sử dụng
const huongDanContent = `=================================================================
  🚀 HƯỚNG DẪN SỬ DỤNG PHẦN MỀM AVALIVE LIVESTREAM VIP PRO
=================================================================

1. ĐỐI VỚI MÁY TÍNH WINDOWS:
   👉 Nhấp đúp chuột vào file: [ Khoi_Dong_AvaLive.bat ]
   -> Phần mềm sẽ tự động khởi động và mở cửa sổ ứng dụng để sử dụng ngay!

2. ĐỐI VỚI MÁY TÍNH MAC (macOS):
   👉 Nhấp đúp chuột vào file: [ Khoi_Dong_AvaLive_Mac.command ]
   -> Phần mềm sẽ tự động khởi chạy.
   (Nếu macOS hiện thông báo bảo mật lần đầu: Click chuột phải vào file -> Chọn "Open" -> Bấm "Open").

3. ĐỒNG BỘ VỚI TIKTOK LIVE STUDIO & OBS:
   • Sau khi mở app, vào mục "Studio Phát Sóng" để lấy link nguồn trình duyệt (Browser Source).
   • Dán link vào OBS hoặc TikTok LIVE Studio để đồng bộ hình ảnh, âm thanh, giọng đọc và bình luận tự động.

-----------------------------------------------------------------
HỖ TRỢ KỸ THUẬT 24/7: support@avalive.com | Website: https://avalivepro.vercel.app
=================================================================
`;

// Tạo file Batch Launcher cho Windows
const winBatLauncher = `@echo off
chcp 65001 >nul
title AVALIVE LIVESTREAM VIP PRO - PHẦN MỀM LIVESTREAM AI
cd /d "%~dp0"

echo =================================================================
echo   🚀 ĐANG KHỞI ĐỘNG HỆ THỐNG AVALIVE LIVESTREAM VIP PRO
echo =================================================================
echo.

set "NODE_EXE=node"
if exist "%~dp0node_portable\\node.exe" (
    set "NODE_EXE=%~dp0node_portable\\node.exe"
    echo [OK] Đã phát hiện Node.js Portable ^(Sẵn sàng 100%^)
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
cd /d "%~dp0core_system"
start /b "" "%NODE_EXE%" backend/server.cjs >nul 2>nul

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
`;

// Tạo file Command Launcher cho Mac
const macCommandLauncher = `#!/bin/bash
DIR="$( cd "$( dirname "\${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "================================================================="
echo "  🍏 ĐANG KHỞI ĐỘNG HỆ THỐNG AVALIVE LIVESTREAM VIP PRO (macOS)"
echo "================================================================="
echo ""

cd "$DIR/core_system"
node backend/server.cjs &
SERVER_PID=$!

sleep 2

if [ -d "/Applications/Google Chrome.app" ]; then
    open -na "Google Chrome" --args --app="http://localhost:3001"
elif [ -d "/Applications/Microsoft Edge.app" ]; then
    open -na "Microsoft Edge" --args --app="http://localhost:3001"
else
    open "http://localhost:3001"
fi

echo "✨ Phần mềm đã mở thành công tại: http://localhost:3001"
echo "Nhấn Ctrl+C để dừng."
wait $SERVER_PID
`;

// 3. ĐÓNG GÓI CHO WINDOWS
console.log('\n[3/4] Đang đóng gói bản Windows...');
const winStaging = path.join(rootDir, '.temp_win_pkg');
if (fs.existsSync(winStaging)) fs.rmSync(winStaging, { recursive: true, force: true });
fs.mkdirSync(winStaging, { recursive: true });

execSync(`cp -R "${coreSystemDir}" "${winStaging}/"`);
fs.writeFileSync(path.join(winStaging, 'Khoi_Dong_AvaLive.bat'), winBatLauncher);
fs.writeFileSync(path.join(winStaging, 'Chay_App_Windows.bat'), winBatLauncher);
fs.writeFileSync(path.join(winStaging, 'HUONG_DAN_SU_DUNG.txt'), huongDanContent);

// Tải Node.js Portable gọn nhẹ cho Windows
const nodePortableDir = path.join(winStaging, 'node_portable');
fs.mkdirSync(nodePortableDir, { recursive: true });
const nodeZipPath = path.join(winStaging, 'node.zip');

try {
  console.log('   -> Đang tải Node.js Portable tối ưu cho Windows (~35MB)...');
  execSync(`curl -sL -o "${nodeZipPath}" "https://nodejs.org/dist/v20.11.1/node-v20.11.1-win-x64.zip"`);
  execSync(`unzip -q -j "${nodeZipPath}" "node-v20.11.1-win-x64/node.exe" -d "${nodePortableDir}"`);
  fs.unlinkSync(nodeZipPath);
  console.log('   -> ✅ Đã tích hợp Node.js Portable thành công!');
} catch (e) {
  console.warn('   ⚠️ Không tải được node portable, sẽ sử dụng node hệ thống:', e.message);
  if (fs.existsSync(nodeZipPath)) fs.unlinkSync(nodeZipPath);
}

execSync(`cd "${winStaging}" && zip -q -r "${winZipFilePath}" . -x "*.DS_Store"`);
fs.rmSync(winStaging, { recursive: true, force: true });

// 4. ĐÓNG GÓI CHO MAC
console.log('\n[4/4] Đang đóng gói bản Mac...');
const macStaging = path.join(rootDir, '.temp_mac_pkg');
if (fs.existsSync(macStaging)) fs.rmSync(macStaging, { recursive: true, force: true });
fs.mkdirSync(macStaging, { recursive: true });

execSync(`cp -R "${coreSystemDir}" "${macStaging}/"`);
const macLauncher = path.join(macStaging, 'Khoi_Dong_AvaLive_Mac.command');
fs.writeFileSync(macLauncher, macCommandLauncher);
fs.chmodSync(macLauncher, 0o755);
fs.writeFileSync(path.join(macStaging, 'HUONG_DAN_SU_DUNG.txt'), huongDanContent);

execSync(`cd "${macStaging}" && zip -q -r "${macZipFilePath}" . -x "*.DS_Store"`);
fs.rmSync(macStaging, { recursive: true, force: true });
fs.rmSync(stagingDir, { recursive: true, force: true });

const winSizeMB = (fs.statSync(winZipFilePath).size / (1024 * 1024)).toFixed(1);
const macSizeMB = (fs.statSync(macZipFilePath).size / (1024 * 1024)).toFixed(1);

console.log('\n===========================================================');
console.log(`🎉 ĐÓNG GÓI HOÀN TẤT THÀNH CÔNG!`);
console.log(`📁 Windows ZIP: public/${winZipFileName} (${winSizeMB} MB)`);
console.log(`📁 Mac ZIP:     public/${macZipFileName} (${macSizeMB} MB)`);
console.log('===========================================================\n');
