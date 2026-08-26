const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('===========================================================');
console.log('📦 BẮT ĐẦU ĐÓNG GÓI BỘ CÀI STANDALONE ZIP CHO MAC & WINDOWS');
console.log('===========================================================');

const rootDir = path.join(__dirname, '..');
const macZipFileName = 'AvaLive_VIP_PRO_Mac.zip';
const winZipFileName = 'AvaLive_VIP_PRO_Windows.zip';
const macZipFilePath = path.join(rootDir, 'public', macZipFileName);
const winZipFilePath = path.join(rootDir, 'public', winZipFileName);

// Xóa các file zip cũ để tránh Vite copy vào dist (gây lặp vô tận / Zip Bomb)
if (fs.existsSync(macZipFilePath)) fs.unlinkSync(macZipFilePath);
if (fs.existsSync(winZipFilePath)) fs.unlinkSync(winZipFilePath);

// 1. Build frontend dist mới nhất
console.log('\n[1/3] Đang biên dịch Frontend sang bản phát hành dist/ mới nhất...');
try {
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
} catch (err) {
  console.error('❌ Lỗi khi build frontend:', err);
  process.exit(1);
}

// 2. Tạo thư mục staging
console.log('\n[2/3] Đang chuẩn bị dữ liệu phần mềm...');
const stagingDir = path.join(rootDir, '.temp_package_staging');
if (fs.existsSync(stagingDir)) fs.rmSync(stagingDir, { recursive: true, force: true });
fs.mkdirSync(stagingDir, { recursive: true });

const appDataDir = path.join(stagingDir, 'app_data');
fs.mkdirSync(appDataDir, { recursive: true });

// Copy toàn bộ dữ liệu cốt lõi vào app_data
execSync(`cp -R dist backend patches package.json package-lock.json .env.example "${appDataDir}"`, { cwd: rootDir });

// 3. Đóng gói cho Windows
console.log('\n[3/3] Đang đóng gói cho Windows...');
const winStaging = path.join(rootDir, '.temp_win');
if (fs.existsSync(winStaging)) fs.rmSync(winStaging, { recursive: true, force: true });
fs.mkdirSync(winStaging, { recursive: true });
execSync(`cp -R "${appDataDir}" "${winStaging}/"`);
fs.copyFileSync(path.join(rootDir, 'Chay_App_Windows.bat'), path.join(winStaging, 'Khoi_Dong_AvaLive.bat'));
if (fs.existsSync(path.join(rootDir, 'HUONG_DAN_SU_DUNG.txt'))) {
  fs.copyFileSync(path.join(rootDir, 'HUONG_DAN_SU_DUNG.txt'), path.join(winStaging, 'HUONG_DAN_SU_DUNG.txt'));
}
execSync(`cd "${winStaging}" && zip -r "${winZipFilePath}" . -x "*.DS_Store"`);
fs.rmSync(winStaging, { recursive: true, force: true });

// 4. Đóng gói cho Mac (Tạo .pkg Installer để vượt Gatekeeper)
console.log('\n[3/3] Đang đóng gói cho Mac (.pkg Installer)...');
const macStaging = path.join(rootDir, '.temp_mac');
if (fs.existsSync(macStaging)) fs.rmSync(macStaging, { recursive: true, force: true });
fs.mkdirSync(macStaging, { recursive: true });

try {
  // Tạo cấu trúc .app
  const appName = 'AvaLive_VIP';
  const payloadDir = path.join(macStaging, 'payload');
  const applicationsDir = path.join(payloadDir, 'Applications');
  const appDir = path.join(applicationsDir, `${appName}.app`);
  const contentsDir = path.join(appDir, 'Contents');
  const macOsDir = path.join(contentsDir, 'MacOS');
  const resourcesDir = path.join(contentsDir, 'Resources');

  fs.mkdirSync(macOsDir, { recursive: true });
  fs.mkdirSync(resourcesDir, { recursive: true });

  // Copy data
  execSync(`cp -R "${appDataDir}" "${resourcesDir}/"`);

  // Info.plist
  const plistContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>${appName}</string>
    <key>CFBundleIdentifier</key>
    <string>com.avalive.pro</string>
    <key>CFBundleName</key>
    <string>AvaLive VIP</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.10</string>
</dict>
</plist>`;
  fs.writeFileSync(path.join(contentsDir, 'Info.plist'), plistContent);

  // Launcher script
  const executablePath = path.join(macOsDir, appName);
  const launcherContent = `#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"
if [ -d "../Resources/app_data" ]; then
    cd "../Resources/app_data"
fi
(sleep 1 && (open "http://localhost:3001" 2>/dev/null || open "https://avalivepro.vercel.app")) &
if [ -x "$(which node 2>/dev/null)" ]; then
    node backend/server.cjs
elif [ -x "/opt/homebrew/bin/node" ]; then
    /opt/homebrew/bin/node backend/server.cjs
elif [ -x "/usr/local/bin/node" ]; then
    /usr/local/bin/node backend/server.cjs
else
    python3 -m http.server 3001 --directory dist
fi
`;
  fs.writeFileSync(executablePath, launcherContent);
  fs.chmodSync(executablePath, 0o755);

  // Tạo postinstall script để gỡ Gatekeeper
  const scriptsDir = path.join(macStaging, 'scripts');
  fs.mkdirSync(scriptsDir, { recursive: true });
  const postinstallPath = path.join(scriptsDir, 'postinstall');
  const postinstallContent = `#!/bin/bash
echo "Removing quarantine attribute to bypass Gatekeeper..."
xattr -cr "/Applications/${appName}.app" 2>/dev/null || true
echo "Opening the app..."
open "/Applications/${appName}.app" 2>/dev/null || true
exit 0
`;
  fs.writeFileSync(postinstallPath, postinstallContent);
  fs.chmodSync(postinstallPath, 0o755);

  // Build .pkg
  const macPkgFileName = 'AvaLive_VIP_PRO_Mac.pkg';
  const macPkgFilePath = path.join(rootDir, 'public', macPkgFileName);
  if (fs.existsSync(macPkgFilePath)) fs.unlinkSync(macPkgFilePath);
  
  execSync(`pkgbuild --root "${payloadDir}" --scripts "${scriptsDir}" --identifier "com.avalive.pro" --version "1.0" --install-location "/" "${macPkgFilePath}"`);
  
  console.log(`✅ Đã tạo file cài đặt cho Mac: public/${macPkgFileName}`);
} catch (error) {
  console.log('⚠️ Không thể tạo file .pkg (Có thể bạn không chạy trên Mac). Sẽ tạo ZIP dự phòng.');
  // Fallback to zip...
  execSync(`cd "${macStaging}" && zip -r "${macZipFilePath}" . -x "*.DS_Store"`);
}

fs.rmSync(macStaging, { recursive: true, force: true });
fs.rmSync(stagingDir, { recursive: true, force: true });

console.log('\n===========================================================');
console.log(`✅ ĐÓNG GÓI HOÀN TẤT THÀNH CÔNG CHO CẢ MAC & WINDOWS!`);
console.log(`📁 Mac: public/${macZipFileName}`);
console.log(`📁 Win: public/${winZipFileName}`);
console.log('===========================================================\n');
