const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('===========================================================');
console.log('📦 BẮT ĐẦU ĐÓNG GÓI BỘ CÀI STANDALONE ZIP CHO MAC & WINDOWS');
console.log('===========================================================');

const rootDir = path.join(__dirname, '..');
const zipFileName = 'AvaLive_VIP_PRO_Full_Package_Mac_Win.zip';
const zipFilePath = path.join(rootDir, zipFileName);

// 1. Build frontend dist mới nhất
console.log('\n[1/3] Đang biên dịch Frontend sang bản phát hành dist/ mới nhất...');
try {
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
} catch (err) {
  console.error('❌ Lỗi khi build frontend:', err);
  process.exit(1);
}

// 2. Chuẩn bị danh sách file đóng gói
console.log('\n[2/3] Đang nén các thành phần cốt lõi vào file zip...');
if (fs.existsSync(zipFilePath)) {
  fs.unlinkSync(zipFilePath);
}

// Chạy lệnh zip nén dist, backend, launchers, docs
try {
  const zipCmd = `zip -r "${zipFileName}" dist backend Chay_App_Mac_Linux.command Chay_App_Windows.bat HUONG_DAN_SU_DUNG_OBS_TIKTOK_STUDIO.md package.json package-lock.json`;
  execSync(zipCmd, { cwd: rootDir, stdio: 'inherit' });
  
  const stats = fs.statSync(zipFilePath);
  const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
  
  console.log('\n===========================================================');
  console.log(`✅ ĐÓNG GÓI HOÀN TẤT THÀNH CÔNG!`);
  console.log(`📁 File Zip Hoàn Chỉnh: ${zipFileName}`);
  console.log(`📊 Dung lượng: ${sizeMb} MB`);
  console.log(`📍 Đường dẫn tuyệt đối: ${zipFilePath}`);
  console.log('===========================================================\n');
} catch (err) {
  console.error('❌ Lỗi khi tạo file zip:', err);
  process.exit(1);
}
