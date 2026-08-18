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

// 3. Xóa file zip cũ nếu có
console.log('\n[2/3] Đang nén các thành phần cốt lõi vào file zip...');
if (fs.existsSync(zipFilePath)) {
  fs.unlinkSync(zipFilePath);
}

// 4. Chạy lệnh zip nén dist, backend, launchers, docs, config
try {
  const zipCmd = `zip -r "${zipFileName}" dist backend Chay_App_Mac_Linux.command Chay_App_Windows.bat HUONG_DAN_SU_DUNG_OBS_TIKTOK_STUDIO.md package.json package-lock.json .env.example`;
  execSync(zipCmd, { cwd: rootDir, stdio: 'inherit' });
  
  const stats = fs.statSync(zipFilePath);
  const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);

  // Đồng bộ file zip sang public và dist để nút tải trên Web App luôn tải bản mới nhất
  const publicZip = path.join(rootDir, 'public', 'Livestream_AI_Software.zip');
  const distZip = path.join(rootDir, 'dist', 'Livestream_AI_Software.zip');
  fs.copyFileSync(zipFilePath, publicZip);
  if (fs.existsSync(path.join(rootDir, 'dist'))) {
    fs.copyFileSync(zipFilePath, distZip);
  }
  
  console.log('\n===========================================================');
  console.log(`✅ ĐÓNG GÓI HOÀN TẤT THÀNH CÔNG!`);
  console.log(`📁 File Zip Hoàn Chỉnh: ${zipFileName}`);
  console.log(`📊 Dung lượng: ${sizeMb} MB`);
  console.log(`📍 Đường dẫn file zip chính: ${zipFilePath}`);
  console.log(`🌐 Đã đồng bộ sang Web Download: public/Livestream_AI_Software.zip`);
  console.log('===========================================================\n');
} catch (err) {
  console.error('❌ Lỗi khi tạo file zip:', err);
  process.exit(1);
}
