# 🛡️ CLOUDFLARE SPECIFICATION & QUY TẮC KHÓA CHẶT TOÀN DIỆN HỆ THỐNG (BẮT BUỘC DUY TRÌ VĨNH VIỄN)

> **DỰ ÁN:** AVA LIVESTREAM VIP PRO  
> **PHIÊN BẢN DUY TRÌ:** v4.2.7+  
> **QUY TẮC BẤT DI BẤT DỊCH:** Tuyệt đối tuân thủ trong tất cả các lần phát triển và cập nhật phần mềm.

---

## 1. 🔒 NGUYÊN TẮC KHÓA CHẶT TOÀN BỘ CÁC TAB CODE & SUBVIEW KHÔNG ĐƯỢC YÊU CẦU

1. **Khóa Chặt Cố Định Mọi Tab Chức Năng, Subview & Module Khi Chưa Có Yêu Cầu:**
   - 🔒 **Window Capture OBS (`/window-capture` / `WindowCapturePlayer.jsx`):** Khóa chặt 100%, bảo toàn cơ chế bắt hình độc lập.
   - 🧠 **Bộ Não Voice AI (`WorkspaceTacVu.jsx` / `AIAvatarStudio.jsx`):** Khóa chặt 100% cơ chế ưu tiên giọng đọc từ Bộ Não AI, Token Single-Generation Lock chống phát chồng chéo âm thanh.
   - ⚔️ **Game Đại Chiến Bang Hội (`/battle` / `GameChienDau.jsx` / `GameBattleOverlay.jsx`):** Khóa chặt logic game.
   - 🚩 **Game Bản Đồ Việt Nam (`/bando` / `VietnamMapCanvas.jsx` / `GameBanDoOverlay.jsx`):** Khóa chặt logic cắm cờ 3D.
   - 🛒 **AI Live Commerce & Bán Hàng (`LiveCommerceStudio.jsx`):** Khóa chặt logic chốt đơn & giỏ hàng.
   - 👥 **Đa Tài Khoản & Phân Quyền (`MultiAccountManager.jsx` / `TeamPermissionsManager.jsx`):** Khóa chặt logic quản trị.
   - 📺 **Mọi Subview & Cửa Sổ Phụ (`CleanLiveOverlay.jsx`, `UniversalMasterOverlayModal.jsx`, `TemplateLibraryModal.jsx`...):** Khóa chặt, cách ly hoàn toàn state độc lập.

2. **Chỉ Xử Lý & Nâng Cấp Đúng Nội Dung Được Yêu Cầu:**
   - Khi nhận yêu cầu từ người dùng hoặc từ đường link đúng mục tiêu, CHỈ gửi và thực thi đúng câu lệnh vào tab/subview đó.
   - Tuyệt đối không thay đổi, can thiệp hoặc ghi đè bất kỳ logic nào ở các tab code khác để ngăn chặn 100% nguy cơ mất dữ liệu hoặc xung đột logic.

---

## 2. 🌐 QUY CHUẨN ĐƯỜNG LINK ONLINE TIKTOK LIVE STUDIO (CLOUDFLARE TUNNEL 60 FPS)

1. **Đường Link Online HTTPS Chuẩn 100% Cho TikTok Live Studio:**
   - Mọi đường link kết nối với TikTok Live Studio BẮT BUỘC là đường link **Online HTTPS** (`https://...trycloudflare.com/live-stream`).
   - Tuyệt đối KHÔNG dùng link `localhost` hay `127.0.0.1` vì TikTok Live Studio chặn sandbox hoàn toàn.

2. **Mã Hóa Chuẩn RFC 3986 URI (Triệt Tiêu 100% Lỗi URL):**
   - Mọi tham số truyền trong URL kết nối (ví dụ: `v=${encodeURIComponent(finalMedia)}`) bắt buộc phải được mã hóa URI.
   - Không để sót khoảng trắng, dấu tiếng Việt hoặc ký tự đặc biệt làm hỏng bộ phân giải URL trong trình duyệt nhúng CEF của TikTok Live Studio.

3. **HTTP 206 Byte-Range Streaming 4MB Chunked (Dành Cho Video 1GB - 50GB Dài Nhiều Tiếng):**
   - Khi phát video dung lượng lớn qua Cloudflare Tunnel, server phục vụ theo từng khối dữ liệu **4MB tối ưu**, loại bỏ 100% lỗi Timeout 524 Cloudflare (100s proxy limit).
   - Đảm bảo video dài hàng chục tiếng đồng hồ chạy liên tục 60 FPS không bao giờ đứng hình hay ngắt quãng.

4. **Tự Động Phát & Chống Đứng Hình (CEF AutoPlay & Anti-Stall Engine):**
   - Video khởi chạy ngay lập tức 0ms khi dán link vào TikTok Live Studio.
   - Cơ chế Watchdog 1 giây tự động kích hoạt lại bộ giải mã nếu phát hiện trạng thái buffer/lag.
   - Đồng bộ thời gian thực 0ms qua Socket.io: Khi đổi video trên phần mềm, luồng phát trên TikTok Live Studio đổi theo tức thì.
