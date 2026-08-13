# Kế hoạch Xây dựng Bảng Trình quản lý Sự kiện & Video

Theo yêu cầu từ audio và 5 hình ảnh anh cung cấp, em sẽ đập bỏ giao diện `WorkspaceTacVu.jsx` hiện tại và xây lại hoàn toàn giống 100% giao diện phần mềm Desktop của anh.

## 1. Cấu trúc Giao diện mới
- **Thanh bên trái (Sidebar)**: Danh sách 12 sự kiện (Xin lỗi, Bình luận, Theo dõi, Quà tặng, Im lặng, Kêu gọi tương tác, Chào người mới, Chốt đơn, Chia sẻ, Quà tặng Đặc biệt, Nói chuyện (AI), Cảm ơn Tim). Có icon đầy đủ.
- **Khu vực Nội dung chính (Bên phải)**: 
  - Tiêu đề và mô tả sự kiện (ví dụ: "Bình luận: Aldol sẽ tự động trả lời bình luận...").
  - Khung **Cấu hình Chung**: Chứa các trường nhập liệu tương ứng với từng loại sự kiện (theo đúng ảnh anh gửi).
  - Khung **Cấu hình Video Chung (Dự phòng)**: Chọn danh mục video và nút "Chọn thư mục...".
  - Khung **Cài đặt Trợ lý**: Cấu hình câu mẫu của trợ lý.

## 2. Chi tiết các Form Cấu hình (Theo ảnh)
- **Sự kiện Bình luận**: Đầy đủ 15 trường như ảnh (Dùng AI trả lời, Kịch bản AI, Từ khoá cấm, Lọc spam...).
- **Sự kiện Xin lỗi**: Độ ưu tiên, Số phút để chào, Câu trả lời mẫu...
- **Sự kiện Theo dõi**: Độ ưu tiên, Chờ giữa các follow, Kịch bản AI...
- **Sự kiện Im lặng**: Tự nói sau (giây) im lặng...
- **Sự kiện Nói chuyện**: Dùng AI, Kịch bản AI...
- *Các sự kiện còn lại*: Sẽ dùng bộ form tiêu chuẩn (Kích hoạt, AI, Kịch bản, Câu trả lời mẫu).

## 3. Hoạt động & Bảo lưu dữ liệu
- **Nút "Chọn thư mục..."**: Hoạt động y hệt bên Cấu hình Chung. Khi chọn sẽ lưu lại đường dẫn thư mục cho từng sự kiện.
- Tất cả Checkbox, Input, Textarea sẽ tự động đồng bộ và lưu trữ vào `localStorage` khi nhấn **Lưu thay đổi cho sự kiện này** màu xanh lá dưới cùng.

Em sẽ bắt tay vào làm ngay sau khi anh duyệt kế hoạch này!
