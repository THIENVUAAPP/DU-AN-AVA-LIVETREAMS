# Kế hoạch Hoàn thiện 3 Tabs còn lại trong Cấu hình Chung

Dựa trên 3 hình ảnh và Audio của anh, em sẽ xây dựng hoàn chỉnh giao diện và chức năng cho 3 tab còn lại của phần "Cấu hình Chung":

## 1. Tab "Nhân vật Chính" (Hình 1)
- **Thiết lập AI (LLM - 'Bộ Não')**: Thêm 2 tuỳ chọn Radio (Dùng Aidol Models / Dùng API Key Cá nhân) và Dropdown chọn Model.
- **Chọn Giọng Nói Cho Nhân vật Chính**: 
  - Thêm bộ lọc (Tất cả / Giọng Nam / Giọng Nữ).
  - Bảng danh sách các giọng nói với các cột: Tên Giọng nói, Loại, Giới Tính, Chi phí.
  - Cho phép click chọn một dòng (ví dụ: `148 Aidol Lan Hương HD (Cao cấp)`).

## 2. Tab "Trợ lý" (Hình 2)
- **Cài đặt chung cho Trợ lý**: 
  - Checkbox Bật/Tắt Trợ lý.
  - Nút **"Chọn thư mục..."** để cấu hình Thư mục Video Trợ lý. Tính năng này sẽ được giả lập lưu lại đường dẫn thư mục vào LocalStorage y như một phần mềm thực thụ trên máy.
- **Chọn Giọng Nói cho Trợ lý**: 
  - Bảng danh sách tương tự tab Nhân vật chính.
  - Cho phép chọn dòng (ví dụ: `1 Giọng Google (Miễn phí)`).

## 3. Tab "Cấu hình Nhanh" (Hình 3)
- **Chọn cấu hình có sẵn**: 
  - Radio chọn "AI Phản ứng Nhanh", "Trợ lý Thông báo", hoặc các Preset tự tạo (ví dụ: Lan Hương).
  - Nút xanh lá "✨ Áp dụng Cấu hình đã chọn".
- **Lưu Cài đặt thành Preset mới**: Khung nhập tên và nút "Lưu Preset". Tính năng này sẽ lưu toàn bộ thông số hiện tại thành một Preset mới.

*Lưu ý*: Mọi lựa chọn trong các Tab này đều được liên kết state và tự động lưu giữ (bảo lưu) an toàn khi bấm Save, đúng như yêu cầu "đảm bảo tất cả chức năng hoạt động hết".
