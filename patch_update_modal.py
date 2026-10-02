import re
with open('src/components/genaidol/UpdateNotificationModal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update APP_VERSION
content = re.sub(r"export const APP_VERSION = '.*?';", "export const APP_VERSION = '5.4.35';", content)

# Prepend the new updates to UPDATE_NOTES
new_updates = """  {
    title: '⚡ Bản Cập Nhật v5.4.35 - Khóa Chặn Triệt Để Lỗi Tự Động Bật Sân Khấu Chính Khi Đã Ngắt Kết Nối',
    description: '1. Khóa Chặn Hệ Thống Đồng Bộ Ở Cấp Độ Lõi: Sau khi người dùng nhấn Ngắt Kết Nối hoặc Tắt Tất Cả, Sân Khấu Chính sẽ bị khóa chặt 100%. Các luồng dữ liệu tự động từ Sân Khấu Phụ (Idol Studio) sẽ bị tường lửa chặn lại hoàn toàn, không thể tự động bắn tín hiệu đè lên Sân Khấu Chính. Màn hình Sân Khấu Chính sẽ duy trì trạng thái đóng băng đen hoàn toàn đúng như chỉ đạo của người dùng. 2. Loại Bỏ Triệt Để Lỗi Tự Phát Video: Bất kỳ lệnh điều khiển video nào cũng không thể vượt quyền khi Đồng Bộ đang ở trạng thái Tắt.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.34 - Sửa Lỗi Không Lưu Tùy Chỉnh Voice, Sửa Chớp Nháy Sân Khấu & Tối Ưu Text Chat',
    description: '1. Lưu Tùy Chỉnh Tốc Độ & Âm Lượng Voice Vĩnh Viễn: Người dùng thiết lập âm lượng và tốc độ ở sự kiện Chào Người Mới sẽ được hệ thống lưu thẳng vào bộ nhớ gốc, thoát app vào lại vẫn giữ nguyên 100%. 2. Sửa Dứt Điểm Lỗi Chớp Nháy Video (Flicker) Trên Sân Khấu Chính: Cấu trúc lại luồng DOM video, loại bỏ hiện tượng nháy đen khi nhận đường link mới hoặc thay đổi nhân vật. 3. Sửa Lỗi Cắt Khung Hình (Cắt đầu đít): Cập nhật cơ chế hiển thị 9:16 (Contain) chuẩn 100% không cắt góc trên TikTok Live Studio. 4. Tách Biệt Text Chat & Voice: Phần chữ đẩy lên màn hình chat TikTok Live chỉ hiển thị đúng câu trả lời từ khóa, gọn gàng và không dính liền với câu chào mở đầu.'
  },
"""

content = content.replace("export const UPDATE_NOTES = [", "export const UPDATE_NOTES = [\n" + new_updates)

with open('src/components/genaidol/UpdateNotificationModal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
