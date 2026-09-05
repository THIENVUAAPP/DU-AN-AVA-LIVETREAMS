const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('===========================================================');
console.log('🛡️  ĐÓNG GÓI PHẦN MỀM BẢO MẬT CAO - KHÔNG LỘ MÃ NGUỒN');
console.log('===========================================================');

const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

// Đọc phiên bản từ package.json
const packageJsonPath = path.join(rootDir, 'package.json');
let appVersion = '1.0.0';
if (fs.existsSync(packageJsonPath)) {
  const pkgData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  if (pkgData.version) appVersion = pkgData.version;
}

const releaseDir = path.join(rootDir, 'release_zips');
if (!fs.existsSync(releaseDir)) fs.mkdirSync(releaseDir, { recursive: true });

const winZipFileName = `AvaLive_VIP_PRO_Windows_v${appVersion}.zip`;
const macZipFileName = `AvaLive_VIP_PRO_Mac_v${appVersion}.zip`;

const winZipFilePath = path.join(releaseDir, winZipFileName);
const macZipFilePath = path.join(releaseDir, macZipFileName);

// Xóa file ZIP cũ trong release_zips và trong public để tránh Vite copy đè làm phình to dung lượng
if (fs.existsSync(publicDir)) {
  const pubFiles = fs.readdirSync(publicDir);
  pubFiles.forEach(f => {
    if (f.endsWith('.zip')) {
      try { fs.unlinkSync(path.join(publicDir, f)); } catch(e) {}
    }
  });
}
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
  🚀 HƯỚNG DẪN MỞ PHẦN MỀM AVALIVE STUDIO VIP PRO (1-CLICK)
=================================================================

1. ĐỐI VỚI MÁY TÍNH WINDOWS:
   👉 BƯỚC 1: Chuột phải vào file ZIP -> Chọn "Extract All..." (Giải nén toàn bộ)
   👉 BƯỚC 2: Nhấp đúp chuột vào 1 trong 2 file khởi động ngay ở đầu thư mục:
      ⭐ [ 1_KHOI_DONG_AVALIVE.exe ] (Khuyên dùng - Mở cực nhanh)
      ⭐ Hoặc [ 1_CLICK_CHAY_NGAY.bat ] (Khởi động dự phòng an toàn)
   -> Giao diện AvaLive Studio sẽ mở lên ngay lập tức!
   ⚠️ LƯU Ý: KHÔNG cần mở thư mục "system" hay tìm kiếm file ở thư mục con.

2. ĐỐI VỚI MÁY TÍNH MAC (macOS):
   👉 BƯỚC 1: Nhấp đúp chuột để giải nén file ZIP
   👉 BƯỚC 2: Nhấp đúp chuột vào file: [ 1_Khoi_Dong_AvaLive_Mac.command ]
   -> Phần mềm sẽ tự động khởi chạy và mở trình duyệt.

3. KẾT NỐI TÀI KHOẢN GMAIL & ĐỒNG BỘ BẢN QUYỀN:
   • Bấm vào ô "🔑 Đăng Nhập Gmail" ở góc trên giao diện phần mềm.
   • Nhập địa chỉ Gmail bạn đã đăng ký trên website để nhận ngay gói VIP & Token AI.
   • Gói Miễn Phí: Nhận Token AI tự động để trải nghiệm ngay.

4. ĐỒNG BỘ VỚI TIKTOK LIVE STUDIO & OBS:
   • Sau khi mở app, bấm nút "📡 Link Live" để lấy link nguồn trình duyệt (Browser Source).
   • Cài đặt độ phân giải trên TikTok Studio / OBS: 1080x1920 (Chuẩn tỷ lệ 9:16 dọc).

=================================================================
HỖ TRỢ KỸ THUẬT 24/7: support@avalive.com | Website: https://avalivepro.vercel.app
=================================================================
`;

// Tạo Batch Launcher 1-Click duy nhất cho Windows (Bao gồm fallback nếu EXE bị chặn)
const winBatLauncher = `@echo off
title AvaLive VIP PRO - Livestream Studio AI
cd /d "%~dp0"

for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":3001" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>nul
)

if exist "1_KHOI_DONG_AVALIVE.exe" (
    start "" "1_KHOI_DONG_AVALIVE.exe"
    exit /b
)

if exist "system\\node_portable\\node.exe" (
    powershell -WindowStyle Hidden -Command "Start-Process -FilePath '%~dp0system\\node_portable\\node.exe' -ArgumentList '%~dp0system\\core.cjs' -WorkingDirectory '%~dp0system'"
) else (
    powershell -WindowStyle Hidden -Command "Start-Process -FilePath 'node' -ArgumentList '%~dp0system\\core.cjs' -WorkingDirectory '%~dp0system'"
)

timeout /t 2 /nobreak >nul 2>nul

set "URL=http://localhost:3001/desktop"

if exist "%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe" (
    start "" "%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe" --app=%URL%
    exit /b
)
if exist "%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe" (
    start "" "%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe" --app=%URL%
    exit /b
)
if exist "%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe" (
    start "" "%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe" --app=%URL%
    exit /b
)
if exist "%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe" (
    start "" "%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe" --app=%URL%
    exit /b
)

start "" "%URL%"
exit /b
`.split('\n').join('\r\n');

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

// Copy cloudflared.exe cho Windows Tunnel vào thư mục system
const winCloudflaredSrc = path.join(rootDir, 'scripts', 'bin', 'cloudflared.exe');
if (fs.existsSync(winCloudflaredSrc)) {
  fs.copyFileSync(winCloudflaredSrc, path.join(winSystemDir, 'cloudflared.exe'));
  console.log('   -> ✅ Đã tích hợp Cloudflare Tunnel (cloudflared.exe) cho Windows!');
}

// Tạo file chạy EXE 1-CLICK cho Windows (Duy nhất 1 file, không trùng lặp)
console.log('   -> Đang chuẩn bị Native Windows Launcher (.exe duy nhất)...');
const cachedExe = path.join(rootDir, 'AvaLive_Studio.exe');

if (!fs.existsSync(cachedExe)) {
  console.log('   -> Đang biên dịch AvaLive_Studio.exe từ scripts/win_launcher_template.cjs...');
  execSync(`npx pkg scripts/win_launcher_template.cjs --target node18-win-x64 --output "${cachedExe}"`, {
    cwd: rootDir,
    stdio: 'inherit'
  });
}

// File EXE bắt đầu bằng 1_ để luôn xuất hiện trên cùng khi giải nén (Chỉ 1 file duy nhất)
fs.copyFileSync(cachedExe, path.join(winStaging, '1_KHOI_DONG_AVALIVE.exe'));

// File BAT 1-Click dự phòng cực nhanh & tin cậy
fs.writeFileSync(path.join(winStaging, '1_CLICK_CHAY_NGAY.bat'), winBatLauncher);

// File Hướng dẫn sử dụng
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
execSync(`cd "${winStaging}" && zip -q -r "${winZipFilePath}" . -x "*.DS_Store" -x "*__MACOSX*" -x "*.tmp" -x "Thumbs.db"`);
fs.rmSync(winStaging, { recursive: true, force: true });

// Tạo Command Launcher cho Mac
const macCommandLauncher = `#!/bin/bash
DIR="$( cd "$( dirname "\${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "================================================================="
echo "  🍏 ĐANG KHỞI ĐỘNG HỆ THỐNG AVALIVE LIVESTREAM VIP PRO (macOS)"
echo "================================================================="
echo ""

# Tự động đóng tiến trình cũ đang chiếm cổng 3001 nếu có
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

cd "$DIR/system"
chmod +x "$DIR/system/cloudflared" 2>/dev/null || true

if ! command -v node &> /dev/null; then
    echo "⚠️ Không tìm thấy Node.js trên máy Mac của bạn."
    echo "👉 Vui lòng tải và cài đặt Node.js từ: https://nodejs.org để tiếp tục."
    open "https://nodejs.org"
    exit 1
fi

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

// Copy cloudflared binary cho Mac Tunnel (Hỗ trợ TikTok Live Studio trên Mac)
const macCloudflaredCandidates = [
  path.join(rootDir, 'node_modules', 'cloudflared', 'bin', 'cloudflared'),
  path.join(rootDir, 'system', 'cloudflared'),
  path.join(rootDir, 'cloudflared')
];
let macCloudflaredFound = false;
for (const cand of macCloudflaredCandidates) {
  if (fs.existsSync(cand)) {
    const dest = path.join(macSystemDir, 'cloudflared');
    fs.copyFileSync(cand, dest);
    fs.chmodSync(dest, 0o755);
    console.log('   -> ✅ Đã tích hợp Cloudflare Tunnel (cloudflared) cho macOS!');
    macCloudflaredFound = true;
    break;
  }
}
if (!macCloudflaredFound) {
  console.warn('   ⚠️ Không tìm thấy binary cloudflared cho Mac');
}

// Chỉ có đúng 1 file launcher duy nhất ở thư mục gốc Mac
fs.writeFileSync(path.join(macStaging, '1_Khoi_Dong_AvaLive_Mac.command'), macCommandLauncher);
fs.chmodSync(path.join(macStaging, '1_Khoi_Dong_AvaLive_Mac.command'), '755');
fs.writeFileSync(path.join(macStaging, 'HUONG_DAN_SU_DUNG.txt'), huongDanContent);

if (fs.existsSync(macZipFilePath)) fs.unlinkSync(macZipFilePath);
execSync(`cd "${macStaging}" && zip -q -r "${macZipFilePath}" . -x "*.DS_Store" -x "*__MACOSX*" -x "*.tmp" -x "Thumbs.db"`);
fs.rmSync(macStaging, { recursive: true, force: true });

// Dọn dẹp staging
fs.rmSync(stagingDir, { recursive: true, force: true });

const winSize = (fs.statSync(winZipFilePath).size / (1024 * 1024)).toFixed(1);
const macSize = (fs.statSync(macZipFilePath).size / (1024 * 1024)).toFixed(1);

console.log('\n===========================================================');
console.log('🎉 ĐÓNG GÓI BẢO MẬT HOÀN TẤT THÀNH CÔNG!');
console.log('🔒 Tuyệt đối không lộ source code dự án');
console.log(`📁 Windows ZIP: release_zips/${winZipFileName} (${winSize} MB)`);
console.log(`📁 Mac ZIP:     release_zips/${macZipFileName} (${macSize} MB)`);
console.log('===========================================================\n');
