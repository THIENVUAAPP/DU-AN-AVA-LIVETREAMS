const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('===========================================================');
console.log('🛡️  ĐÓNG GÓI PHẦN MỀM BẢO MẬT CAO - KHÔNG LỘ MÃ NGUỒN');
console.log('===========================================================');

const rootDir = path.join(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const macZipFileName = 'AvaLive_VIP_PRO_Mac.zip';
const winZipFileName = 'AvaLive_VIP_PRO_Windows.zip';
const macZipFilePath = path.join(publicDir, macZipFileName);
const winZipFilePath = path.join(publicDir, winZipFileName);

// 0. Dọn dẹp các file zip cũ
if (fs.existsSync(macZipFilePath)) fs.unlinkSync(macZipFilePath);
if (fs.existsSync(winZipFilePath)) fs.unlinkSync(winZipFilePath);

// 1. Biên dịch Frontend
console.log('\n[1/4] Đang biên dịch Frontend (Vite Production Build)...');
try {
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
} catch (err) {
  console.error('❌ Lỗi khi build frontend:', err);
  process.exit(1);
}

// 2. Biên dịch & Mã hóa (Bundle + Minify) Backend thành 1 file nhị phân duy nhất
console.log('\n[2/4] Đang biên dịch & mã hóa toàn bộ Backend Core (Bảo mật mã nguồn)...');
const tempBundleDir = path.join(rootDir, '.temp_bundle_staging');
if (fs.existsSync(tempBundleDir)) fs.rmSync(tempBundleDir, { recursive: true, force: true });
fs.mkdirSync(tempBundleDir, { recursive: true });

const bundledCorePath = path.join(tempBundleDir, 'core.cjs');
try {
  execSync(`npx esbuild backend/server.cjs --bundle --platform=node --target=node18 --format=cjs --minify --outfile="${bundledCorePath}"`, { cwd: rootDir, stdio: 'inherit' });
  console.log('   -> ✅ Đã mã hóa và đóng gói Backend Core thành công (Không lộ source code)!');
} catch (err) {
  console.error('❌ Lỗi khi bundle backend:', err);
  process.exit(1);
}

// 3. Chuẩn bị nội dung Hướng dẫn sử dụng
const huongDanContent = `=================================================================
  🚀 HƯỚNG DẪN SỬ DỤNG PHẦN MỀM AVALIVE LIVESTREAM VIP PRO
=================================================================

1. ĐỐI VỚI MÁY TÍNH WINDOWS:
   👉 Nhấp đúp chuột vào file: [ Khoi_Dong_AvaLive.bat ]
   -> Phần mềm sẽ tự động khởi động và mở giao diện ứng dụng để sử dụng ngay!

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

// Tạo Batch Launcher cho Windows
const winBatLauncher = `@echo off
chcp 65001 >nul
title AVALIVE LIVESTREAM VIP PRO - PHẦN MỀM LIVESTREAM AI
cd /d "%~dp0"

echo =================================================================
echo   🚀 ĐANG KHỞI ĐỘNG HỆ THỐNG AVALIVE LIVESTREAM VIP PRO
echo =================================================================
echo.

set "NODE_EXE=node"
if exist "%~dp0system\\node_portable\\node.exe" (
    set "NODE_EXE=%~dp0system\\node_portable\\node.exe"
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

echo [1/2] Đang kích hoạt Bộ xử lý Tín hiệu & TikTok Live Engine...
cd /d "%~dp0system"
start /b "" "%NODE_EXE%" core.cjs >nul 2>nul

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

// Tạo Command Launcher cho Mac
const macCommandLauncher = `#!/bin/bash
DIR="$( cd "$( dirname "\${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "================================================================="
echo "  🍏 ĐANG KHỞI ĐỘNG HỆ THỐNG AVALIVE LIVESTREAM VIP PRO (macOS)"
echo "================================================================="
echo ""

cd "$DIR/system"
node core.cjs &
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

// 3. ĐÓNG GÓI BẢN WINDOWS
console.log('\n[3/4] Đang đóng gói bản Windows an toàn & bảo mật...');
const winStaging = path.join(rootDir, '.temp_win_secure');
if (fs.existsSync(winStaging)) fs.rmSync(winStaging, { recursive: true, force: true });
fs.mkdirSync(winStaging, { recursive: true });

const winSystemDir = path.join(winStaging, 'system');
fs.mkdirSync(winSystemDir, { recursive: true });

// Copy compiled backend core
fs.copyFileSync(bundledCorePath, path.join(winSystemDir, 'core.cjs'));

// Copy compiled frontend dist into system/app
execSync(`cp -R "${path.join(rootDir, 'dist')}" "${path.join(winSystemDir, 'app')}"`);

// Copy certs if exist
if (fs.existsSync(path.join(rootDir, 'certs'))) {
  execSync(`cp -R "${path.join(rootDir, 'certs')}" "${path.join(winSystemDir, 'certs')}"`);
}

// Create empty uploads directory
fs.mkdirSync(path.join(winSystemDir, 'uploads'), { recursive: true });

// Launcher files in root of Windows ZIP
fs.writeFileSync(path.join(winStaging, 'Khoi_Dong_AvaLive.bat'), winBatLauncher);
fs.writeFileSync(path.join(winStaging, 'HUONG_DAN_SU_DUNG.txt'), huongDanContent);

// Tải Node.js Portable cho Windows
const nodePortableDir = path.join(winSystemDir, 'node_portable');
fs.mkdirSync(nodePortableDir, { recursive: true });
const nodeZipPath = path.join(winStaging, 'node.zip');

try {
  console.log('   -> Đang tích hợp Node.js Portable (~35MB)...');
  execSync(`curl -sL -o "${nodeZipPath}" "https://nodejs.org/dist/v20.11.1/node-v20.11.1-win-x64.zip"`);
  execSync(`unzip -q -j "${nodeZipPath}" "node-v20.11.1-win-x64/node.exe" -d "${nodePortableDir}"`);
  fs.unlinkSync(nodeZipPath);
} catch (e) {
  console.warn('   ⚠️ Không tải được node portable:', e.message);
  if (fs.existsSync(nodeZipPath)) fs.unlinkSync(nodeZipPath);
}

execSync(`cd "${winStaging}" && zip -q -r "${winZipFilePath}" . -x "*.DS_Store"`);
fs.rmSync(winStaging, { recursive: true, force: true });

// 4. ĐÓNG GÓI BẢN MAC
console.log('\n[4/4] Đang đóng gói bản Mac an toàn & bảo mật...');
const macStaging = path.join(rootDir, '.temp_mac_secure');
if (fs.existsSync(macStaging)) fs.rmSync(macStaging, { recursive: true, force: true });
fs.mkdirSync(macStaging, { recursive: true });

const macSystemDir = path.join(macStaging, 'system');
fs.mkdirSync(macSystemDir, { recursive: true });

// Copy compiled backend core
fs.copyFileSync(bundledCorePath, path.join(macSystemDir, 'core.cjs'));

// Copy compiled frontend dist into system/app
execSync(`cp -R "${path.join(rootDir, 'dist')}" "${path.join(macSystemDir, 'app')}"`);

// Copy certs if exist
if (fs.existsSync(path.join(rootDir, 'certs'))) {
  execSync(`cp -R "${path.join(rootDir, 'certs')}" "${path.join(macSystemDir, 'certs')}"`);
}

// Create empty uploads directory
fs.mkdirSync(path.join(macSystemDir, 'uploads'), { recursive: true });

const macLauncher = path.join(macStaging, 'Khoi_Dong_AvaLive_Mac.command');
fs.writeFileSync(macLauncher, macCommandLauncher);
fs.chmodSync(macLauncher, 0o755);
fs.writeFileSync(path.join(macStaging, 'HUONG_DAN_SU_DUNG.txt'), huongDanContent);

execSync(`cd "${macStaging}" && zip -q -r "${macZipFilePath}" . -x "*.DS_Store"`);
fs.rmSync(macStaging, { recursive: true, force: true });
fs.rmSync(tempBundleDir, { recursive: true, force: true });

const winSizeMB = (fs.statSync(winZipFilePath).size / (1024 * 1024)).toFixed(1);
const macSizeMB = (fs.statSync(macZipFilePath).size / (1024 * 1024)).toFixed(1);

console.log('\n===========================================================');
console.log(`🎉 ĐÓNG GÓI BẢO MẬT HOÀN TẤT THÀNH CÔNG!`);
console.log(`🔒 Tuyệt đối không lộ source code dự án`);
console.log(`📁 Windows ZIP: public/${winZipFileName} (${winSizeMB} MB)`);
console.log(`📁 Mac ZIP:     public/${macZipFileName} (${macSizeMB} MB)`);
console.log('===========================================================\n');
