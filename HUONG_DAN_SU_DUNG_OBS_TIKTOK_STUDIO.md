# 🌟 HƯỚNG DẪN SỬ DỤNG HỆ THỐNG AVALIVE LIVESTREAM VIP PRO
### Tương thích 100% macOS, Windows, OBS Studio, TikTok LIVE Studio, Facebook & YouTube Live

---

## 🚀 1. Khởi Chạy 1-Click (Không cần cài đặt phức tạp)

Sau khi giải nén file `.zip`, bạn chỉ cần:

### 🍎 Trên Máy MacBook / iMac (macOS):
- **Cách mở lần đầu (Tránh bị macOS Gatekeeper chặn)**:
  1. Nhấp **chuột phải** (hoặc giữ phím `Control` + bấm chuột trái) vào file: **`Chay_App_Mac_Linux.command`**.
  2. Chọn **Mở (Open)** trong danh sách menu hiện ra.
  3. Bấm **"Mở" (Open)** khi hộp thoại bảo mật xuất hiện.
  *(Từ các lần sau, bạn chỉ cần nhấp đúp chuột là phần mềm tự động chạy ngay tức thì!)*
- Trình duyệt web sẽ tự động mở trang điều khiển tại địa chỉ: `http://localhost:3001`

### 🪟 Trên Máy Tính Windows:
- Nhấp đúp chuột vào file: **`Chay_App_Windows.bat`**
- Trình duyệt web sẽ tự động mở trang điều khiển tại địa chỉ: `http://localhost:3001`

---

## 📺 2. Kết Nối Trực Tiếp Vào OBS Studio & TikTok LIVE Studio

Hệ thống cung cấp các đường link **Overlay Trong Suốt Chuyên Dụng**, tự động loại bỏ nền thừa để ghép vào khung cảnh livestream của bạn một cách mượt mà và chuyên nghiệp nhất:

| Mục Đích | Đường Link Browser Source | Độ Phân Giải Đề Xuất |
| :--- | :--- | :--- |
| **🗺️ Game Bản Đồ Việt Nam (3D/2D)** | `http://localhost:3001/?overlay=bando` | 1080 x 1920 (Dọc 9:16) hoặc 1920 x 1080 (Ngang) |
| **⚔️ Game Chiến Đấu Bang Phái (3D/2D)** | `http://localhost:3001/?overlay=battle` | 1080 x 1920 (Dọc 9:16) hoặc 1920 x 1080 (Ngang) |
| **🎛️ Bảng Điều Khiển Admin & Giọng Nói AI** | `http://localhost:3001` | Mở trên trình duyệt máy tính hoặc điện thoại |

### 🛠️ Các Bước Thêm Vào OBS Studio (Nguồn Trình Duyệt - KHUYÊN DÙNG):
1. Mở **OBS Studio** -> Trong bảng **Sources (Nguồn)** -> Bấm dấu **`+`** -> Chọn **Browser (Trình duyệt)**.
2. Dán link: `http://localhost:3001/?overlay=bando` (cho Game Bản Đồ) hoặc `http://localhost:3001/?overlay=battle` (cho Game Chiến Đấu) hoặc `http://localhost:3001/?overlay=live` (Live Studio Toàn Năng).
3. Đặt kích thước: **Width: 1080**, **Height: 1920** (nếu live TikTok/Facebook Reels) hoặc **Width: 1920**, **Height: 1080** (nếu live YouTube/Facebook Ngang).
4. Tích chọn **"Shutdown source when not visible"** và **"Refresh browser when scene becomes active"**.

### 🛠️ Các Bước Quay Cửa Sổ Chrome/Cốc Cốc Bằng OBS Studio (Window Capture):
1. Mở **OBS Studio** -> Bấm **`+`** -> Chọn **Window Capture (Quay Cửa Sổ)** -> Chọn **Google Chrome** hoặc **Cốc Cốc**.
2. **LƯU Ý QUAN TRỌNG:** Tại mục **Capture Method (Phương thức bắt hình)**, chọn **`Windows 10 (1903 trở lên)`** hoặc **`Windows Graphics Capture`** (KHÔNG để BitBlt). Điều này giúp video và game chuyển động 60FPS mượt mà kể cả khi bật Tăng Tốc Phần Cứng trên Chrome!
3. Trong OBS Studio -> Bấm nút **"Start Virtual Camera" (Bật Cam Ảo)**.
4. Trong **TikTok LIVE Studio** -> Bấm **Thêm Nguồn** -> Chọn **Camera** -> Chọn **OBS Virtual Camera**. Mọi video, game, chuyển động sẽ truyền thẳng sang TikTok Live Studio 100%!

### 🛠️ Các Bước Thêm Trực Tiếp Vào TikTok LIVE Studio:
1. Mở **TikTok LIVE Studio** -> Bấm **Thêm Nguồn** -> Chọn **Liên kết web / Link Web / Browser**.
2. Dán đường link `http://localhost:3001/?overlay=live` (hoặc `?overlay=bando`, `?overlay=battle`) và điều chỉnh kích thước vừa vặn với khung livestream.

---

## 💎 3. Chế Độ Màn Hình Live (Sạch 100%) vs Chế Độ Quản Trị Admin

- **🔴 Chế Độ Màn Hình Live (Sạch 100%)**:
  - Tự động ẩn toàn bộ các nút bấm demo, thanh test quà, các bảng debug quản trị.
  - Màn hình chỉ hiển thị các thành phần tinh hoa của game: Bản đồ 3D/2D, điểm số, cờ Quốc Kỳ, chiến binh cử động võ thuật, bảng vàng vinh danh TOP 30 + TOP 1.
  - Không bao giờ có bất kỳ panel nào che khuất khung hình chơi.

- **⚙️ Chế Độ Quản Trị Admin**:
  - Dành riêng cho Streamer / Quản trị viên để:
    - Bật/Tắt Auto Loop 24/24 (`⚡ AUTO 24/7`).
    - Bật/Tắt Nhạc Nền Lặp Vô Tận 24/7 (`Nhạc: Lặp 24/7`).
    - Test quà tặng TikTok (Hoa hồng, Mũ, Cánh vàng, Sét thần binh, Rồng thần...).
    - Ghim và lưu lại các vị trí góc nhìn Camera 3D yêu thích.

---

## 📱 4. Hiển Thị Đẹp Mắt Trên Tất Cả Thiết Bị
- **Điện thoại di động (iPhone / Android)**: Tự động co giãn giao diện siêu nhỏ gọn, các bảng phụ thu thành icon tiện dụng, không che khuất màn hình game.
- **Máy tính bảng (iPad / Tablet)**: Bố cục cân đối, cảm ứng đa điểm mượt mà.
- **Máy tính để bàn / Laptop (Mac / Windows)**: Đồ họa 3D 60FPS sắc nét, hiệu ứng ánh sáng rực rỡ.

---

## 🔇 5. Tính Năng Tắt Tiếng Loa Máy Tính (Live Vẫn Có Đầy Đủ Video & Âm Thanh 100%)

- **Tại sao cần tính năng này?**
  - Khi livestream 24/7 hoặc live nhiều giờ liên tục, tiếng nhạc nền BGM, tiếng Voice AI đọc bình luận và hiệu ứng quà tặng phát liên tục qua loa máy tính có thể gây ồn ào cho bạn khi làm việc, nghỉ ngơi hoặc đi ngủ.

- **Cách sử dụng siêu đơn giản 1-chạm:**
  1. Trên thanh công cụ trên cùng của phần mềm, bấm vào nút: **`🔇 Tắt Loa Máy (Live Có Tiếng)`**.
  2. **Kết quả:**
     - Loa trên máy tính của bạn sẽ **hoàn toàn im lặng 100%** (không còn bị ồn).
     - **Phiên Live trên TikTok LIVE Studio & OBS Studio VẪN CÓ ĐẦY ĐỦ 100% ÂM THANH** (tiếng nhạc nền BGM, giọng nói AI Idol, bình luận viên, hiệu ứng quà tặng khán giả đều nghe to rõ bình thường).
  3. Khi muốn nghe lại trên máy, bạn chỉ cần bấm lại nút: **`🔊 Loa Máy: BẬT`**.

---
*Chúc bạn có những buổi Livestream bùng nổ tương tác và vạn người xem cùng AvaLive VIP PRO!*
