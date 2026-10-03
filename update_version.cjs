const fs = require('fs');

const pkgPath = 'package.json';
let pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.version = '5.4.52';
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');

const updatePath = 'src/components/genaidol/UpdateNotificationModal.jsx';
let updateModal = fs.readFileSync(updatePath, 'utf8');

// Thay thế 5.4.51 thành 5.4.52
updateModal = updateModal.replace(/5\.4\.51/g, '5.4.52');

// Cập nhật nội dung mô tả (bỏ cái cũ thêm cái mới)
updateModal = updateModal.replace(
  /description: '1\. Sửa Dứt Điểm Màn Hình Đen.*?'/,
  `description: '1. Sửa Lỗi Tải Video Lên Sân Khấu Bị Mất: Ưu tiên phát video người dùng tải lên liên tục, không bị hệ thống tự đổi sang video nền chờ khi AI nói xong. 2. Bắt Buộc Đăng Nhập Tài Khoản Google (Gmail): Yêu cầu người dùng kết nối tài khoản để sử dụng, bảo vệ tài nguyên hệ thống. 3. Sửa Lỗi Không Trừ Token & Giờ Xem: Đồng bộ hoá hoàn toàn với Supabase, trừ đúng và đủ Token và thời gian sử dụng khi AI phát sinh sự kiện nhép môi & TTS voice. 4. Cải Thiện TikTok Live Status: Giữ vững trạng thái Kết Nối (màu xanh) trong lúc chờ đợi Sân Khấu TikTok phát sóng để đảm bảo luồng sự kiện không bị gián đoạn.'`
);

fs.writeFileSync(updatePath, updateModal, 'utf8');
console.log('Version updated to 5.4.52');
