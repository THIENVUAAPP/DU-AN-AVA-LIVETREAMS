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

// 4. Đóng gói cho Mac
console.log('\n[3/3] Đang đóng gói cho Mac...');
const macStaging = path.join(rootDir, '.temp_mac');
if (fs.existsSync(macStaging)) fs.rmSync(macStaging, { recursive: true, force: true });
fs.mkdirSync(macStaging, { recursive: true });

// Create Mac Launcher
const macLauncherPath = path.join(macStaging, 'Khoi_Dong_AvaLive_Mac.command');
fs.copyFileSync(path.join(rootDir, 'Chay_App_Mac_Linux.command'), macLauncherPath);
fs.chmodSync(macLauncherPath, 0o755);

execSync(`cp -R "${appDataDir}" "${macStaging}/"`);

// Create Mac Instructions
const macInstructionHtml = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Hướng Dẫn Khởi Động Trên Mac</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; background: #111; color: #fff; line-height: 1.6; }
        .box { background: #222; border: 1px solid #444; border-radius: 12px; padding: 30px; max-width: 600px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        h1 { color: #38bdf8; margin-top: 0; }
        p { color: #ccc; }
        .code { background: #000; padding: 10px 15px; border-radius: 6px; font-family: monospace; color: #a3e635; margin: 15px 0; border: 1px solid #333; }
        .alert { background: rgba(239,68,68,0.1); border-left: 4px solid #ef4444; padding: 15px; color: #fca5a5; border-radius: 4px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="box">
        <h1>🍏 Hướng Dẫn Khởi Động AvaLive Trên Mac</h1>
        <p>Để khởi động phần mềm, hãy <strong>Nhấp Đúp</strong> vào file lệnh <code>Khoi_Dong_AvaLive_Mac.command</code>.</p>
        
        <div class="alert">
            <strong>⚠️ LƯU Ý QUAN TRỌNG KHI GẶP LỖI BẢO MẬT:</strong><br><br>
            Nếu macOS hiện thông báo: <em>"Apple không thể xác minh nhà phát triển..."</em>, hãy làm theo cách sau để mở:
            <br><br>
            <strong>Cách Mở Cấp Quyền (Chỉ cần làm 1 lần đầu tiên):</strong><br>
            1. <strong>Click Chuột Phải</strong> (hoặc nhấn giữ phím Control + Click) vào file <code>Khoi_Dong_AvaLive_Mac.command</code>.<br>
            2. Chọn <strong>Open (Mở)</strong>.<br>
            3. Nhấn <strong>Open (Mở)</strong> một lần nữa ở bảng cảnh báo. Phần mềm sẽ tự khởi chạy!
        </div>
    </div>
</body>
</html>
`;
fs.writeFileSync(path.join(macStaging, '1_XEM_HUONG_DAN_CHO_MAC.html'), macInstructionHtml);

execSync(`cd "${macStaging}" && zip -r "${macZipFilePath}" . -x "*.DS_Store"`);
fs.rmSync(macStaging, { recursive: true, force: true });
fs.rmSync(stagingDir, { recursive: true, force: true });

console.log('\n===========================================================');
console.log(`✅ ĐÓNG GÓI HOÀN TẤT THÀNH CÔNG CHO CẢ MAC & WINDOWS!`);
console.log(`📁 Mac: public/${macZipFileName}`);
console.log(`📁 Win: public/${winZipFileName}`);
console.log('===========================================================\n');
