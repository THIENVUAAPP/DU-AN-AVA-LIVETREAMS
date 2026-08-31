# Nhạc/SFX trong thư mục này

## Đã có sẵn — âm thanh tự tổng hợp (0% bản quyền)

5 file `.wav` trong thư mục này (`background-music.wav`, `victory-fanfare.wav`, `sfx-aoe.wav`, `sfx-boss.wav`, `sfx-join.wav`) là **âm thanh tổng hợp bằng sóng sin thuần túy** (script `scripts/generate-placeholder-audio.js`), **không lấy từ bất kỳ bài hát/nghệ sĩ nào** — an toàn tuyệt đối khi bật TikTok LIVE, không bao giờ bị hệ thống quét bản quyền của TikTok tắt tiếng/cảnh cáo. Overlay đã tự phát các file này ngay từ bây giờ, không cần làm gì thêm.

Muốn tạo lại (ví dụ sau khi chỉnh sửa script để đổi giai điệu):

```bash
node scripts/generate-placeholder-audio.js
```

## Muốn thay bằng nhạc hay hơn (tùy chọn)

Overlay tự động phát file khớp tên trong `config/audio.json`, không phân biệt file đó tự tạo hay tải về — chỉ cần đúng tên file (hoặc đổi tên trong `config/audio.json` sang file mới):

| File | Dùng khi nào |
|---|---|
| `background-music` | Nhạc nền, lặp lại suốt trận đấu |
| `victory-fanfare` | Phát khi có đội chiến thắng (màn vinh danh) |
| `sfx-aoe` | Phát khi có quà tier trung (hiệu ứng AoE) |
| `sfx-boss` | Phát khi có quà tier lớn (Boss xuất hiện) |
| `sfx-join` | Phát khi có quà tier nhỏ |

### ⚠️ Quan trọng — bản quyền nhạc trên TikTok LIVE

**Không dùng nhạc có bản quyền thương mại** (nhạc từ ca sĩ/nhãn đĩa nổi tiếng) — TikTok LIVE quét bản quyền tự động, dễ bị tắt tiếng hoặc cảnh cáo kênh. Nên lấy nhạc từ các nguồn **royalty-free/không bản quyền** dưới đây (tải về, đổi tên đúng như bảng trên, bỏ vào thư mục này):

- **TikTok Commercial Music Library** (trong chính app TikTok/TikTok Studio) — nhạc được TikTok cấp phép sẵn cho creator, an toàn nhất khi live trên chính nền tảng này.
- **YouTube Audio Library** (studio.youtube.com → Audio Library) — miễn phí, lọc theo thể loại "Cinematic", "Dramatic", "Epic".
- **Pixabay Music** (pixabay.com/music) — miễn phí, không cần ghi công.
- **Incompetech (Kevin MacLeod)** — miễn phí có ghi công theo Creative Commons.

**Gợi ý thể loại/không khí nhạc** (thay vì tên bài cụ thể, vì tên bài thương mại thường dính bản quyền):
- Nhạc nền: "Epic Orchestral Battle", "Cinematic Tension Loop", "Fantasy War Drums" — tìm các từ khóa này trong nguồn trên.
- Victory fanfare: "Triumphant Brass Fanfare", "Victory Orchestral Hit".
- SFX quà nhỏ/AoE/Boss: tìm "game UI sound effects" / "impact whoosh" / "magic spell sfx" trên Pixabay hoặc Freesound (freesound.org, chọn license CC0).

Định dạng khuyên dùng: `.mp3` hoặc `.wav`, dung lượng nhỏ (nhạc nền dưới 5MB, SFX dưới 200KB) để không làm chậm tải overlay.
