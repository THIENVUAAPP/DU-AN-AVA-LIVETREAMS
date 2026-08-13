# Kế hoạch Bổ sung 3 Sự kiện cuối, Chọn Nhân vật & Thanh Toán

Dựa trên yêu cầu và Audio anh vừa gửi, em sẽ hoàn thành nốt tất cả các mảnh ghép cuối cùng của hệ thống này:

## 1. Hoàn thiện 3 Sự kiện cuối cùng trong Quản lý Sự kiện
- **Sự kiện "Chốt đơn"**: Tương tự như "Quà tặng Đặc biệt", sự kiện này sẽ có danh sách các **Sản phẩm (Sản phẩm 1, Sản phẩm 2...)** để anh cài đặt. Mỗi Sản phẩm sẽ gồm: Tên sản phẩm, Từ khóa, Thư mục Video, Kịch bản AI và các tùy chọn tắt âm/dùng TTS... Mọi thứ lưu trữ mượt mà vào máy.
- **Sự kiện "Chia sẻ"**: Cấu hình các thông số cơ bản và kịch bản AI (y hệt mẫu).
- **Sự kiện "Cảm ơn Tim"**: Có thêm ô "Ngưỡng tim để cảm ơn" (ví dụ: 10), và các thông số chuẩn khác.

## 2. Tính năng Chọn Nhân vật Trực tiếp trên Phiên Live
- Ở giao diện chính (`DesktopAppUI`), ngay bên cạnh ô **"Bật Chế độ Giao tiếp"**, em sẽ bổ sung khu vực **"Chọn Nhân vật"**.
- Khu vực này cho phép anh chọn nhanh các nhân vật (VD: aidol_lan_huong) với giao diện danh sách hoặc dropdown có hình ảnh thumbnail nhỏ, giúp anh thay đổi trang phục nhân vật linh hoạt ngay trên luồng trực tiếp!

## 3. Tích hợp Module Thanh toán an toàn
- Em sẽ "nhúng" nguyên phần **Thanh toán của trang web** (`ThanhToanCoin.jsx`) vào trong ứng dụng này.
- Khi anh bấm nút **"Thanh toán"** ở thanh công cụ bên dưới, một bảng Thanh toán chuẩn chỉnh sẽ hiện lên để người dùng có thể Gia hạn tài khoản hoặc Nạp KOL Coin mà không cần phải thoát phần mềm.
- Đảm bảo tính bảo mật và mã nguồn đóng gói an toàn.

> [!IMPORTANT]
> Em đã lên xong toàn bộ kiến trúc cho bản cập nhật này. Anh vui lòng bấm **Proceed (Tiếp tục)** để em tiến hành triển khai ngay lập tức!
