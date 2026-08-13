# Kế hoạch Xây dựng Cấu hình Chung & Menu Cài đặt
1. **Sửa nút Cài đặt thành Dropdown Menu**:
   - Nút "Cài đặt" trên `DesktopAppUI` sẽ xổ xuống 2 lựa chọn:
     - `Cấu hình Chung (AI, Giọng nói...)`
     - `Quản lý Sự kiện Video`
2. **Xây dựng Giao diện "Cấu hình Chung" (`GeneralSettings.jsx`)**:
   - Chứa các Tab: API Prompt, Nhân vật Chính, Trợ lý, Cấu hình Nhanh.
   - Giao diện nhập API Keys (OpenAI, Google, ElevenLabs, Minimax).
   - Nút tải giọng nói.
   - Cài đặt Hàng đợi.
   - Cấu hình Prompt (System Prompt, Background Context).
   - Tích hợp lưu trữ (LocalStorage/Zustand) để các dữ liệu này "hoạt động được".
3. **Hiển thị Modal**:
   - Khi chọn `Cấu hình Chung`, mở Modal `GeneralSettings`.
   - Khi chọn `Quản lý Sự kiện Video`, mở Modal `WorkspaceTacVu` hiện tại.
