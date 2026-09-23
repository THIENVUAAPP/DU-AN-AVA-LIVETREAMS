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

// 🛡️ Dọn dẹp sạch sẽ thư mục uploads để file ZIP giải nén không chứa bất kỳ video chạy nền nào
['backend/uploads', 'uploads'].forEach(d => {
  const uploadPath = path.join(rootDir, d);
  if (fs.existsSync(uploadPath)) {
    fs.readdirSync(uploadPath).forEach(f => {
      if (f !== '.gitkeep') {
        try { fs.unlinkSync(path.join(uploadPath, f)); } catch(e) {}
      }
    });
  }
});

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
chcp 65001 >nul
title AvaLive VIP PRO - Livestream Studio AI
cd /d "%~dp0"
if exist "system" attrib +h "system" >nul 2>nul

echo =========================================================
echo    🚀 DANG KHOI DONG AVALIVE STUDIO VIP PRO...
echo =========================================================
echo.

:: 1. Dong tien trinh cu dang chiem cong 3001 neu co
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":3001" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>nul
)

:: 2. Chay Backend Core bang Node Portable hoac Node he thong
set "NODE_BIN=%~dp0system\\node_portable\\node.exe"
if not exist "%NODE_BIN%" set "NODE_BIN=node"

cd /d "%~dp0system"
start "" /B "%NODE_BIN%" core.cjs > server_log.txt 2>&1
cd /d "%~dp0"

:: 3. Cho server san sang tren cong 3001 (Polling kiem tra san sang)
set "URL=http://localhost:3001/desktop"
set /a attempts=0

:WAIT_LOOP
set /a attempts+=1
timeout /t 1 /nobreak >nul 2>nul
netstat -aon 2>nul | findstr ":3001" | findstr "LISTENING" >nul 2>nul
if %ERRORLEVEL% equ 0 goto OPEN_APP
if %attempts% geq 20 goto OPEN_APP
goto WAIT_LOOP

:OPEN_APP
echo ✅ May chu da san sang! Dang mo giao dien ung dung...

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
if exist "%LOCALAPPDATA%\\Google\\Chrome\\Application\\chrome.exe" (
    start "" "%LOCALAPPDATA%\\Google\\Chrome\\Application\\chrome.exe" --app=%URL%
    exit /b
)
if exist "%LOCALAPPDATA%\\CocCoc\\Browser\\Application\\browser.exe" (
    start "" "%LOCALAPPDATA%\\CocCoc\\Browser\\Application\\browser.exe" --app=%URL%
    exit /b
)
if exist "%ProgramFiles%\\CocCoc\\Browser\\Application\\browser.exe" (
    start "" "%ProgramFiles%\\CocCoc\\Browser\\Application\\browser.exe" --app=%URL%
    exit /b
)
if exist "%ProgramFiles(x86)%\\CocCoc\\Browser\\Application\\browser.exe" (
    start "" "%ProgramFiles(x86)%\\CocCoc\\Browser\\Application\\browser.exe" --app=%URL%
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

// Copy compiled frontend dist into system/app and system/dist
execSync(`cp -R "${path.join(rootDir, 'dist')}" "${path.join(winSystemDir, 'app')}"`);
execSync(`cp -R "${path.join(rootDir, 'dist')}" "${path.join(winSystemDir, 'dist')}"`);

// Copy certs if exist
if (fs.existsSync(path.join(rootDir, 'certs'))) {
  execSync(`cp -R "${path.join(rootDir, 'certs')}" "${path.join(winSystemDir, 'certs')}"`);
}

// Create empty uploads directory
fs.mkdirSync(path.join(winSystemDir, 'uploads'), { recursive: true });

// Copy cloudflared.exe cho Windows Tunnel vào thư mục system
const winCloudflaredCandidates = [
  path.join(rootDir, 'scripts', 'bin', 'cloudflared.exe'),
  path.join(rootDir, '.cache_bin', 'cloudflared.exe'),
  path.join(rootDir, 'system', 'cloudflared.exe')
];
let winCloudflaredFound = false;
for (const c of winCloudflaredCandidates) {
  if (fs.existsSync(c)) {
    fs.copyFileSync(c, path.join(winSystemDir, 'cloudflared.exe'));
    console.log(`   -> ✅ Đã tích hợp Cloudflare Tunnel (cloudflared.exe) cho Windows từ: ${c}`);
    winCloudflaredFound = true;
    break;
  }
}
if (!winCloudflaredFound) {
  try {
    console.log('   -> Đang tải cloudflared.exe cho Windows...');
    const dlTarget = path.join(winSystemDir, 'cloudflared.exe');
    execSync(`curl -sL -o "${dlTarget}" "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"`);
    fs.mkdirSync(path.join(rootDir, '.cache_bin'), { recursive: true });
    fs.copyFileSync(dlTarget, path.join(rootDir, '.cache_bin', 'cloudflared.exe'));
    console.log('   -> ✅ Đã tải và tích hợp Cloudflare Tunnel cho Windows thành công!');
    winCloudflaredFound = true;
  } catch (e) {
    console.warn('   ⚠️ Không tải được cloudflared.exe:', e.message);
  }
}

// Tạo file chạy EXE 1-CLICK cho Windows (Duy nhất 1 file, không trùng lặp)
console.log('   -> Đang chuẩn bị Native Windows Launcher (.exe duy nhất)...');
const cachedExe = path.join(rootDir, 'AvaLive_Studio.exe');

console.log('   -> Đang biên dịch AvaLive_Studio.exe mới nhất từ scripts/win_launcher_template.cjs...');
execSync(`npx pkg scripts/win_launcher_template.cjs --target node18-win-x64 --output "${cachedExe}"`, {
  cwd: rootDir,
  stdio: 'inherit'
});

// File EXE bắt đầu bằng 1_ để luôn xuất hiện trên cùng khi giải nén (Chỉ 1 file duy nhất)
fs.copyFileSync(cachedExe, path.join(winStaging, '1_KHOI_DONG_AVALIVE.exe'));

// File BAT 1-Click dự phòng cực nhanh & tin cậy
fs.writeFileSync(path.join(winStaging, '1_CLICK_CHAY_NGAY.bat'), winBatLauncher);

// File Hướng dẫn sử dụng
fs.writeFileSync(path.join(winStaging, 'HUONG_DAN_SU_DUNG.txt'), huongDanContent);

// Tải hoặc copy Node.js Portable cho Windows
const nodePortableDir = path.join(winSystemDir, 'node_portable');
fs.mkdirSync(nodePortableDir, { recursive: true });
const cachedNodeExe = path.join(rootDir, '.cache_bin', 'node.exe');

if (fs.existsSync(cachedNodeExe)) {
  console.log('   -> ✅ Đã tích hợp Node.js Portable từ local cache!');
  fs.copyFileSync(cachedNodeExe, path.join(nodePortableDir, 'node.exe'));
} else {
  const nodeZipPath = path.join(winStaging, 'node.zip');
  try {
    console.log('   -> Đang tải Node.js Portable (~35MB)...');
    execSync(`curl -sL -o "${nodeZipPath}" "https://nodejs.org/dist/v20.11.1/node-v20.11.1-win-x64.zip"`);
    execSync(`unzip -q -j "${nodeZipPath}" "node-v20.11.1-win-x64/node.exe" -d "${nodePortableDir}"`);
    fs.unlinkSync(nodeZipPath);
    // Cache lại cho các lần build sau
    fs.mkdirSync(path.join(rootDir, '.cache_bin'), { recursive: true });
    fs.copyFileSync(path.join(nodePortableDir, 'node.exe'), cachedNodeExe);
  } catch (e) {
    console.warn('   ⚠️ Không tải được node portable:', e.message);
    if (fs.existsSync(nodeZipPath)) fs.unlinkSync(nodeZipPath);
  }
}

if (fs.existsSync(winZipFilePath)) fs.unlinkSync(winZipFilePath);
try {
  execSync(`cd "${winStaging}" && zip -9 -q -r -y "${winZipFilePath}" . -x "*.DS_Store" -x "*__MACOSX*" -x "*.tmp" -x "Thumbs.db"`);
} catch (err) {
  if (!fs.existsSync(winZipFilePath) || fs.statSync(winZipFilePath).size < 1024 * 1024) {
    throw err;
  }
}
fs.rmSync(winStaging, { recursive: true, force: true });

// Tạo Command Launcher cho Mac
const macCommandLauncher = `#!/bin/bash
DIR="$( cd "$( dirname "\${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "================================================================="
echo "  🍏 ĐANG KHỞI ĐỘNG HỆ THỐNG AVALIVE LIVESTREAM VIP PRO (macOS)"
echo "================================================================="
echo ""

# 1. Nạp môi trường Shell profiles của người dùng
[ -f "$HOME/.zprofile" ] && source "$HOME/.zprofile" 2>/dev/null || true
[ -f "$HOME/.zshrc" ] && source "$HOME/.zshrc" 2>/dev/null || true
[ -f "$HOME/.bash_profile" ] && source "$HOME/.bash_profile" 2>/dev/null || true
[ -f "$HOME/.bashrc" ] && source "$HOME/.bashrc" 2>/dev/null || true

export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/local/sbin:$HOME/.nvm/versions/node/$(ls -t "$HOME/.nvm/versions/node" 2>/dev/null | head -n 1)/bin:$HOME/.volta/bin:$HOME/.fnm/current/bin:$HOME/.cargo/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

# 2. Tự động đóng tiến trình cũ đang chiếm cổng 3001 nếu có
if command -v lsof &>/dev/null; then
    OLD_PID=$(lsof -ti :3001 2>/dev/null)
    if [ -n "$OLD_PID" ]; then
        echo "🔄 Đang giải phóng cổng 3001 (PID: $OLD_PID)..."
        kill -9 $OLD_PID 2>/dev/null || true
        sleep 0.5
    fi
fi

# 3. Ẩn thư mục system để không gây rối mắt
chflags hidden "$DIR/system" 2>/dev/null || true

cd "$DIR/system"
chmod +x "$DIR/system/cloudflared" 2>/dev/null || true

# 4. Tìm Node.js trên tất cả các vị trí của macOS
NODE_CMD=""
for p in \\
    "$(command -v node 2>/dev/null)" \\
    "/opt/homebrew/bin/node" \\
    "/usr/local/bin/node" \\
    "/usr/bin/node" \\
    "$HOME/.nvm/versions/node/$(ls -t "$HOME/.nvm/versions/node" 2>/dev/null | head -n 1)/bin/node" \\
    "$HOME/.volta/bin/node" \\
    "$HOME/.fnm/current/bin/node"
do
    if [ -n "$p" ] && [ -x "$p" ]; then
        NODE_CMD="$p"
        export PATH="$(dirname "$p"):$PATH"
        break
    fi
done

# 5. Theo dõi máy chủ sẵn sàng và tự động mở trình duyệt
(
    APP_URL="http://127.0.0.1:3001/desktop"
    for i in {1..40}; do
        if curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:3001" 2>/dev/null | grep -qE "200|304|302|301"; then
            echo "✨ Máy chủ đã sẵn sàng! Đang mở giao diện điều khiển..."
            if [ -d "/Applications/Google Chrome.app" ]; then
                open -na "Google Chrome" --args --app="$APP_URL" 2>/dev/null || open "$APP_URL"
            elif [ -d "/Applications/Microsoft Edge.app" ]; then
                open -na "Microsoft Edge" --args --app="$APP_URL" 2>/dev/null || open "$APP_URL"
            else
                open "$APP_URL"
            fi
            exit 0
        fi
        sleep 0.5
    done
    open "$APP_URL" 2>/dev/null || open "http://localhost:3001" 2>/dev/null || open "https://avalivepro.vercel.app" 2>/dev/null
) &

# 6. Khởi động Server Node.js Core
if [ -n "$NODE_CMD" ] && [ -f "core.cjs" ]; then
    echo "✅ Đang chạy máy chủ với Node.js: $($NODE_CMD -v)"
    echo "🌐 Giao diện ứng dụng đang mở tại: http://127.0.0.1:3001"
    echo "💡 Mẹo: Bấm phím Control + C trong cửa sổ này để tắt máy chủ khi dùng xong."
    echo ""
    "$NODE_CMD" core.cjs
elif command -v python3 &>/dev/null && [ -d "app" ]; then
    echo "⚡ Đang chạy Web Server với Python3..."
    echo "🌐 Giao diện ứng dụng đang mở tại: http://127.0.0.1:3001"
    echo ""
    python3 -m http.server 3001 --directory app
else
    echo "⚠️ Không tìm thấy Node.js trên máy Mac của bạn."
    echo "👉 Đang mở phiên bản trực tuyến tại: https://avalivepro.vercel.app"
    open "https://avalivepro.vercel.app" 2>/dev/null || true
fi
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

// Copy compiled frontend dist into system/app and system/dist
execSync(`cp -R "${path.join(rootDir, 'dist')}" "${path.join(macSystemDir, 'app')}"`);
execSync(`cp -R "${path.join(rootDir, 'dist')}" "${path.join(macSystemDir, 'dist')}"`);

// Copy certs if exist
if (fs.existsSync(path.join(rootDir, 'certs'))) {
  execSync(`cp -R "${path.join(rootDir, 'certs')}" "${path.join(macSystemDir, 'certs')}"`);
}

// Create empty uploads directory
fs.mkdirSync(path.join(macSystemDir, 'uploads'), { recursive: true });

// Copy cloudflared binary cho Mac Tunnel (Hỗ trợ TikTok Live Studio trên Mac)
const macCloudflaredCandidates = [
  path.join(rootDir, 'scripts', 'bin', 'cloudflared'),
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
try {
  execSync(`cd "${macStaging}" && zip -9 -q -r -y "${macZipFilePath}" . -x "*.DS_Store" -x "*__MACOSX*" -x "*.tmp" -x "Thumbs.db"`);
} catch (err) {
  if (!fs.existsSync(macZipFilePath) || fs.statSync(macZipFilePath).size < 1024 * 1024) {
    throw err;
  }
}
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
