# Kế hoạch Hoàn thiện 4 Sự kiện Đặc biệt (Quà tặng, Kêu gọi, Chào người mới)

Dựa trên 4 ảnh mới và Audio anh gửi, em sẽ tiếp tục "độ" lại giao diện của 4 sự kiện này sao cho chuẩn xác từng milimet với phần mềm gốc:

## 1. Sự kiện "Quà tặng (Thường)"
- **Cấu hình Logic Chung**: Thêm Độ ưu tiên, Kích hoạt, Chờ giữa các quà tặng (giây).
- **Cấu hình Phản ứng**: Các tuỳ chọn Dùng AI trả lời, Dùng giọng nói, Tắt âm gốc video, Kịch bản AI và Câu trả lời mẫu.

## 2. Sự kiện "Quà tặng Đặc biệt" (Siêu cấp)
- Tạo ra danh sách các **Slot (Slot 1, Slot 2...)** để cấu hình riêng cho từng món quà VIP (Sư tử, Du thuyền...).
- Mỗi Slot sẽ có:
  - Tên Quà tặng (Dropdown chọn loại quà: Finger Heart, Corgi, Crystal Rose...).
  - Thư mục Video Chính (có nút Chọn... giả lập lưu đường dẫn).
  - Checkbox Dùng TTS, Tắt âm gốc video.
  - Checkbox Bật cấu hình Trợ lý riêng (Kèm Câu mẫu và Video của Trợ lý).

## 3. Sự kiện "Kêu gọi tương tác" & "Chào người mới"
- Cấu hình chuẩn form với các ô đặc thù như: `Số phút để chào`, `Độ ưu tiên`, các câu trả lời mẫu chứa biến `{user}`, `{count}`.

## 4. Tính tương thích Hệ điều hành & Giải nén Zip
- Theo audio anh dặn về việc chạy trên Mac/Win và xử lý File Zip: Em sẽ thiết kế cơ chế lưu trữ đường dẫn thư mục một cách linh hoạt, hiển thị đường dẫn chuẩn định dạng để sau này (khi đóng gói thành app thực) AI có thể tự động tìm đến thư mục đã giải nén để lấy dữ liệu.
- Mọi thiết lập trong 4 sự kiện mới này cũng sẽ tự động được bảo lưu vào LocalStorage khi ấn "Lưu thay đổi".
