const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('===========================================================');
console.log('🛡️  ĐÓNG GÓI PHẦN MỀM BẢO MẬT CAO - KHÔNG LỘ MÃ NGUỒN');
console.log('===========================================================');

const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const winZipFilePath = path.join(publicDir, 'AvaLive_VIP_PRO_Windows_v2.zip');
const macZipFilePath = path.join(publicDir, 'AvaLive_VIP_PRO_Mac_v2.zip');

// Xóa file ZIP cũ và dist cũ trước khi build để tránh Vite copy đè làm phình to dung lượng
if (fs.existsSync(winZipFilePath)) fs.unlinkSync(winZipFilePath);
if (fs.existsSync(macZipFilePath)) fs.unlinkSync(macZipFilePath);
const distDir = path.join(rootDir, 'dist');
if (fs.existsSync(distDir)) fs.rmSync(distDir, { recursive: true, force: true });

// 1. Biên dịch Vite Frontend
console.log('\n[1/4] Đang biên dịch Frontend (Vite Production Build)...');
try {
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
} catch (err) {
  console.error('❌ Lỗi khi build frontend:', err);
  process.exit(1);
}

// 2. Biên dịch & Mã hóa toàn bộ Backend Core bằng esbuild (Giấu kín 100% mã nguồn)
console.log('\n[2/4] Đang biên dịch & mã hóa toàn bộ Backend Core (Bảo mật mã nguồn)...');
const stagingDir = path.join(rootDir, '.temp_bundle_staging');
if (fs.existsSync(stagingDir)) fs.rmSync(stagingDir, { recursive: true, force: true });
fs.mkdirSync(stagingDir, { recursive: true });

const bundledCorePath = path.join(stagingDir, 'core.cjs');

try {
  execSync(`npx esbuild backend/server.cjs --bundle --platform=node --target=node18 --format=cjs --minify --outfile="${bundledCorePath}"`, {
    cwd: rootDir,
    stdio: 'inherit'
  });
  console.log('   -> ✅ Đã mã hóa và đóng gói Backend Core thành công (Không lộ source code)!');
} catch (err) {
  console.error('❌ Lỗi khi bundle backend:', err);
  process.exit(1);
}

// 3. Chuẩn bị nội dung Hướng dẫn sử dụng ngắn gọn
const huongDanContent = `=================================================================
  🚀 HƯỚNG DẪN SỬ DỤNG PHẦN MỀM AVALIVE LIVESTREAM VIP PRO
=================================================================

1. ĐỐI VỚI MÁY TÍNH WINDOWS:
   👉 BẮT BUỘC: Hãy giải nén file ZIP này (Chuột phải chọn Extract All...)
   👉 Sau khi giải nén, nhấp đúp chuột vào file: [ 1_Khoi_Dong_AvaLive_Windows.bat ]
   -> Phần mềm sẽ tự động mở giao diện ứng dụng để sử dụng ngay!

   💡 MẸO NẾU WINDOWS 11 HIỆN THÔNG BÁO BẢO VỆ SMART APPS:
      • Nhấp chuột phải vào file nén [ AvaLive_VIP_PRO_Windows_v2.zip ] (trước khi giải nén)
      • Chọn "Properties" (Thuộc tính) -> Tích chọn ô "Unblock" (Bỏ chặn) ở góc dưới -> Bấm "OK".
      • Giải nén file ZIP (Click chuột phải chọn Extract All...)
      • Mở file [ 1_Khoi_Dong_AvaLive_Windows.bat ] là chạy siêu mượt 100%!

2. KẾT NỐI TÀI KHOẢN GMAIL & ĐỒNG BỘ BẢN QUYỀN:
   • Bấm vào ô "🔑 Đăng Nhập Gmail" ở góc trên giao diện phần mềm.
   • Đăng nhập 1-Click hoặc nhập địa chỉ Gmail bạn đã đăng ký/mua gói trên web để nhận diện ngay gói VIP & Token AI.
   • Gói Miễn Phí (Dùng Thử): Tự động nhận 100 Token AI và full tính năng để sử dụng ngay.

3. ĐỐI VỚI MÁY TÍNH MAC (macOS):
   👉 Nhấp đúp chuột vào file: [ 1_Khoi_Dong_AvaLive_Mac.command ]
   -> Phần mềm sẽ tự động khởi chạy.
   (Nếu macOS hiện thông báo bảo mật lần đầu: Click chuột phải vào file -> Chọn "Open" -> Bấm "Open").

4. ĐỒNG BỘ VỚI TIKTOK LIVE STUDIO & OBS:
   • Sau khi mở app, vào mục "Studio Phát Sóng" để lấy link nguồn trình duyệt (Browser Source).
   • Dán link vào OBS hoặc TikTok LIVE Studio để đồng bộ hình ảnh, âm thanh, giọng đọc và bình luận tự động.

-----------------------------------------------------------------
HỖ TRỢ KỸ THUẬT 24/7: support@avalive.com | Website: https://avalivepro.vercel.app
=================================================================
`;

// Tạo Batch Launcher 1-Click duy nhất cho Windows
const winBatLauncher = `@echo off
title AvaLive VIP PRO - Livestream Studio AI

pushd "%~dp0" 2>nul

for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":3001" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>nul
)

if exist "system\node_portable\node.exe" (
    start "" /b "system\node_portable\node.exe" "system\core.cjs"
) else (
    start "" /b node "system\core.cjs"
)

timeout /t 2 /nobreak >nul 2>nul

set "URL=http://localhost:3001/desktop"

if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --app=%URL%
    exit /b
)
if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" --app=%URL%
    exit /b
)
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app=%URL%
    exit /b
)
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" --app=%URL%
    exit /b
)
if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" (
    start "" "%LocalAppData%\Google\Chrome\Application\chrome.exe" --app=%URL%
    exit /b
)

start "" "%URL%"
exit /b
`.split('\n').join('\r\n');

// VBScript chạy ngầm không hiện cửa sổ CMD đen
const winVbsLauncher = `Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "1_Khoi_Dong_AvaLive_Windows.bat", 0, False
`.split('\n').join('\r\n');


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
    open -na "Google Chrome" --args --app="http://localhost:3001/desktop"
elif [ -d "/Applications/Microsoft Edge.app" ]; then
    open -na "Microsoft Edge" --args --app="http://localhost:3001/desktop"
else
    open "http://localhost:3001/desktop"
fi

echo "✨ Phần mềm đã mở thành công tại: http://localhost:3001/desktop"
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

// Chỉ có đúng 1 file launcher duy nhất ở thư mục gốc Windows
fs.writeFileSync(path.join(winStaging, '1_Khoi_Dong_AvaLive_Windows.bat'), winBatLauncher);
fs.writeFileSync(path.join(winStaging, '2_Chay_Nhanh_An_Cua_So_Den.vbs'), winVbsLauncher);
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

if (fs.existsSync(winZipFilePath)) fs.unlinkSync(winZipFilePath);
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

// Chỉ có đúng 1 file launcher duy nhất ở thư mục gốc Mac
fs.writeFileSync(path.join(macStaging, '1_Khoi_Dong_AvaLive_Mac.command'), macCommandLauncher);
fs.chmodSync(path.join(macStaging, '1_Khoi_Dong_AvaLive_Mac.command'), '755');
fs.writeFileSync(path.join(macStaging, 'HUONG_DAN_SU_DUNG.txt'), huongDanContent);

if (fs.existsSync(macZipFilePath)) fs.unlinkSync(macZipFilePath);
execSync(`cd "${macStaging}" && zip -q -r "${macZipFilePath}" . -x "*.DS_Store"`);
fs.rmSync(macStaging, { recursive: true, force: true });

// Dọn dẹp staging
fs.rmSync(stagingDir, { recursive: true, force: true });

// BẮT BUỘC: Copy file ZIP sang thư mục dist/ để Server tĩnh (Express) có thể cho phép người dùng tải xuống đúng file thực tế thay vì bị lỗi 404 trả về trang HTML.
if (fs.existsSync(distDir)) {
  fs.copyFileSync(winZipFilePath, path.join(distDir, 'AvaLive_VIP_PRO_Windows_v2.zip'));
  fs.copyFileSync(macZipFilePath, path.join(distDir, 'AvaLive_VIP_PRO_Mac_v2.zip'));
  console.log('\n[INFO] Đã copy thành công các file ZIP sang thư mục dist/ để phục vụ tải xuống trực tuyến.');
}

const winSize = (fs.statSync(winZipFilePath).size / (1024 * 1024)).toFixed(1);
const macSize = (fs.statSync(macZipFilePath).size / (1024 * 1024)).toFixed(1);

console.log('\n===========================================================');
console.log('🎉 ĐÓNG GÓI BẢO MẬT HOÀN TẤT THÀNH CÔNG!');
console.log('🔒 Tuyệt đối không lộ source code dự án');
console.log(`📁 Windows ZIP: public/AvaLive_VIP_PRO_Windows_v2.zip (${winSize} MB)`);
console.log(`📁 Mac ZIP:     public/AvaLive_VIP_PRO_Mac_v2.zip (${macSize} MB)`);
console.log('===========================================================\n');
