# MEGA-PROMPT: TikTok Live Interactive Battle Game

Copy toàn bộ nội dung dưới đây, gửi cho AI lập trình (Claude, Gemini, v.v.)

---

Bạn là Senior Full-stack Game Developer chuyên về Gamification cho livestream. Hãy viết toàn bộ mã nguồn hoàn chỉnh (HTML, CSS, JavaScript, Node.js backend dùng thư viện `tiktok-live-connector`) cho một game tương tác trực tiếp trên TikTok Live, chạy được ngay khi kết nối Room ID thật.

## 1. TÊN GAME & CHỦ ĐỀ

- Tên: "Kingdom Clash: Ultimate War" (có thể đổi tên/theme dễ dàng qua config).
- Bối cảnh: Trận chiến giữa 2 phe (mặc định: Phe Rồng Xanh vs Phe Hổ Đỏ). Màn hình hiển thị thanh HP tổng của 2 phe ở trung tâm trên cùng, phía dưới là các nhân vật nhỏ 2 bên giao tranh real-time.
- Đa ngôn ngữ: tách toàn bộ text UI ra file `i18n/vi.json`, `i18n/en.json` để đổi ngôn ngữ theo thị trường mà không sửa code.

## 2. LUỒNG HỆ THỐNG (BACKEND)

- **Luồng 1 — Lắng nghe sự kiện:** Kết nối TikTok Live qua Room ID (username), bắt real-time: Like, Share, Follow, Comment, Gift.
- **Luồng 2 — Xử lý logic:** Khi nhận Gift, xác định người gửi thuộc phe nào (dựa vào comment chọn phe trước đó, ví dụ gõ "xanh"/"đỏ"; nếu chưa chọn thì tự động cân bằng theo phe đang ít người hơn). Cộng sát thương/hồi máu tương ứng theo giá trị quà.
- **Luồng 3 — Hiệu ứng thị giác/âm thanh theo giá trị quà** (xem bảng mục 3).
- **Luồng 4 — Leaderboard:** Bảng xếp hạng "Top người ủng hộ" theo thời gian thực, cập nhật liên tục, hiển thị góc màn hình. Đây là ghi nhận đóng góp thuần túy — không kèm cảnh báo khẩn cấp hay lời kêu gọi nạp thêm.

## 3. GIFT MAPPING CONFIG (linh hoạt, chỉnh trong file JSON riêng)

Thiết kế 3 tier theo giá trị quà, gắn hiệu ứng tương ứng — mục tiêu là **ăn mừng đóng góp**, không phải tạo áp lực chi tiêu:

| Tier | Ví dụ quà | Hiệu ứng |
|---|---|---|
| Nhỏ (1–99 xu) | Rose, Finger Heart | Triệu hồi 1 lính, hồi nhẹ máu trụ |
| Trung (100–5.000 xu) | Confetti, GG | Hiệu ứng skill diện rộng (mưa hiệu ứng, sát thương lan) |
| Lớn (>5.000 xu) | Lion, Universe | Triệu hồi "Boss" đặc biệt lao vào trận, avatar người tặng hiện to 5 giây kèm hiệu ứng vinh danh, **không dừng game, không rung màn hình dọa nạt** |

Toàn bộ ngưỡng số xu và tên quà đọc từ file config, dễ sửa theo thị trường.

## 4. CƠ CHẾ GAMEPLAY (giữ vui, bỏ thao túng)

- **Comeback mechanic:** Phe đang thua (dưới 30% HP) nhận buff nhẹ tạm thời để trận đấu không một chiều — thuần túy cân bằng game, không kèm thông báo hoảng loạn hay con số "cần bao nhiêu xu để cứu".
- **Kết thúc trận:** Khi 1 phe về 0 HP, hiển thị màn hình kết quả, top 3 người ủng hộ mỗi phe, sau đó tự động reset trận mới sau 10–15 giây (chạy vòng lặp 24/7 không cần can thiệp tay).
- Không thiết kế bất kỳ pop-up, banner, hay hiệu ứng nào tạo cảm giác khẩn cấp/sợ hãi để thúc giục người xem chi tiền.

## 5. YÊU CẦU KỸ THUẬT

Cấu trúc thư mục:
```
/server.js          → Backend Node.js, kết nối tiktok-live-connector, emit socket event
/public/index.html  → Giao diện game (overlay dùng cho OBS)
/public/game.js      → Logic render trận đấu (HTML5 Canvas hoặc Phaser.js)
/config/gifts.json   → Bảng ánh xạ quà tặng
/i18n/vi.json, en.json → Text đa ngôn ngữ
```

- Dùng WebSocket (Socket.IO) để đẩy sự kiện từ server sang overlay real-time.
- Tối ưu chạy liên tục 24/7: xử lý reconnect tự động khi mất kết nối TikTok Live, dọn dẹp object/animation cũ để tránh memory leak.
- Overlay responsive, chạy mượt trong OBS Browser Source (1920x1080, nền trong suốt).
- Kèm file `README.md` hướng dẫn cài đặt từng bước: cài Node.js, `npm install`, cấu hình Room ID trong `.env`, chạy `node server.js`, thêm overlay vào OBS.

Viết code sạch, chia file rõ ràng, có comment giải thích, chạy được ngay sau khi làm theo README.
