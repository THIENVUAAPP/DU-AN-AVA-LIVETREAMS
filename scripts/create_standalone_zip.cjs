const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('===========================================================');
console.log('📦 BẮT ĐẦU ĐÓNG GÓI BỘ CÀI STANDALONE ZIP CHO MAC & WINDOWS');
console.log('===========================================================');

const rootDir = path.join(__dirname, '..');
const zipFileName = 'AvaLive_VIP_PRO_Full_Package_Mac_Win.zip';
const zipFilePath = path.join(rootDir, zipFileName);

// 1. Cấp quyền thực thi cho file launcher Mac
try {
  const macLauncher = path.join(rootDir, 'Chay_App_Mac_Linux.command');
  if (fs.existsSync(macLauncher)) {
    fs.chmodSync(macLauncher, 0o755);
  }
} catch (e) {
  // Bỏ qua lỗi permission nếu trên Windows
}

// 2. Build frontend dist mới nhất
console.log('\n[1/3] Đang biên dịch Frontend sang bản phát hành dist/ mới nhất...');
try {
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
} catch (err) {
  console.error('❌ Lỗi khi build frontend:', err);
  process.exit(1);
}

// 3. Xóa các file zip cũ trong dist & public để tránh phình dung lượng
console.log('\n[2/3] Đang nén các thành phần cốt lõi vào file zip...');
const publicZip = path.join(rootDir, 'public', 'Livestream_AI_Software.zip');
const distZip = path.join(rootDir, 'dist', 'Livestream_AI_Software.zip');

if (fs.existsSync(zipFilePath)) fs.unlinkSync(zipFilePath);
if (fs.existsSync(publicZip)) fs.unlinkSync(publicZip);
if (fs.existsSync(distZip)) fs.unlinkSync(distZip);

// 4. Tạo thư mục staging sạch sẽ để đóng gói
const stagingDir = path.join(rootDir, '.temp_package_staging');
if (fs.existsSync(stagingDir)) fs.rmSync(stagingDir, { recursive: true, force: true });
fs.mkdirSync(stagingDir, { recursive: true });

const appDataDir = path.join(stagingDir, 'app_data');
fs.mkdirSync(appDataDir, { recursive: true });

// Copy launchers và docs ra thư mục gốc
fs.copyFileSync(path.join(rootDir, 'Chay_App_Mac_Linux.command'), path.join(stagingDir, 'Chay_App_Mac_Linux.command'));
fs.copyFileSync(path.join(rootDir, 'Chay_App_Mac_Linux.command'), path.join(stagingDir, 'Chay_Mac.command'));
fs.chmodSync(path.join(stagingDir, 'Chay_App_Mac_Linux.command'), 0o755);
fs.chmodSync(path.join(stagingDir, 'Chay_Mac.command'), 0o755);

fs.copyFileSync(path.join(rootDir, 'Chay_App_Windows.bat'), path.join(stagingDir, 'Chay_App_Windows.bat'));
fs.copyFileSync(path.join(rootDir, 'Chay_App_Windows.bat'), path.join(stagingDir, 'Chay_Windows.bat'));

if (fs.existsSync(path.join(rootDir, 'Mo_Ung_Dung_Web.html'))) {
  fs.copyFileSync(path.join(rootDir, 'Mo_Ung_Dung_Web.html'), path.join(stagingDir, 'Mo_Ung_Dung_Web.html'));
  fs.copyFileSync(path.join(rootDir, 'Mo_Ung_Dung_Web.html'), path.join(stagingDir, 'index.html'));
}
if (fs.existsSync(path.join(rootDir, 'HUONG_DAN_SU_DUNG.txt'))) {
  fs.copyFileSync(path.join(rootDir, 'HUONG_DAN_SU_DUNG.txt'), path.join(stagingDir, 'HUONG_DAN_SU_DUNG.txt'));
}

// Copy toàn bộ dữ liệu cốt lõi vào app_data
execSync(`cp -R dist backend patches package.json package-lock.json .env.example "${appDataDir}"`, { cwd: rootDir });

try {
  const zipCmd = `cd "${stagingDir}" && zip -r "${zipFilePath}" . -x "*.DS_Store"`;
  execSync(zipCmd, { stdio: 'inherit' });
  
  // Dọn dẹp staging
  fs.rmSync(stagingDir, { recursive: true, force: true });

  const stats = fs.statSync(zipFilePath);
  const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);

  // Đồng bộ file zip sang public và dist để nút tải trên Web App luôn tải bản mới nhất
  fs.copyFileSync(zipFilePath, publicZip);
  if (fs.existsSync(path.join(rootDir, 'dist'))) {
    fs.copyFileSync(zipFilePath, distZip);
  }
  
  console.log('\n===========================================================');
  console.log(`✅ ĐÓNG GÓI HOÀN TẤT THÀNH CÔNG!`);
  console.log(`📁 File Zip Hoàn Chỉnh: ${zipFileName}`);
  console.log(`📊 Dung lượng siêu nhẹ & đầy đủ: ${sizeMb} MB`);
  console.log(`📍 Đường dẫn file zip chính: ${zipFilePath}`);
  console.log(`🌐 Đã đồng bộ sang Web Download: public/Livestream_AI_Software.zip & dist/Livestream_AI_Software.zip`);
  console.log('===========================================================\n');
} catch (err) {
  console.error('❌ Lỗi khi tạo file zip:', err);
  process.exit(1);
}
