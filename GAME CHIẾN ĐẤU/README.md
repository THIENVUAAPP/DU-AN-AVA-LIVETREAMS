# Kingdom Clash: Ultimate War — TikTok LIVE Battle Overlay

Game tương tác trực tiếp trên TikTok LIVE: 2 phe (Rồng Xanh vs Hổ Đỏ) chiến đấu real-time. Người xem comment "xanh"/"đỏ" để có nhân vật riêng mang tên mình tham chiến, tặng quà để nhân vật của họ tiến gần hàng đầu và gây sát thương/hồi máu. Kết thúc trận có màn vinh danh đội thắng kiểu bục nhận cúp (MVP + tên cả đội), nhạc/SFX kịch tính, và trang Admin riêng để điều khiển thủ công + lịch tự động. Chạy vòng lặp 24/7 làm overlay cho OBS Browser Source.

## Yêu cầu hệ thống

- **Node.js >= 20.0.0** (bắt buộc — thư viện `tiktok-live-connector` chỉ hỗ trợ ESM và cần Node 20+). Kiểm tra: `node --version`.
- OBS Studio (hoặc phần mềm live hỗ trợ Browser Source tương tự) để phát overlay.

## 1. Cài đặt

```bash
npm install
```

## 2. Cấu hình `.env`

Copy file mẫu rồi điền thông tin thật:

```bash
cp .env.example .env
```

Mở `.env` và điền:

| Biến | Mô tả |
|---|---|
| `TIKTOK_USERNAME` | Username TikTok của kênh đang live (không có dấu `@`). Bắt buộc trừ khi `DEMO_MODE=true`. |
| `PORT` | Cổng chạy server nội bộ (mặc định `8080`). |
| `LANG_DEFAULT` | Ngôn ngữ mặc định overlay: `vi` hoặc `en`. |
| `DEMO_MODE` | `true` để chạy thử với sự kiện giả lập (không cần phòng live thật). `false` khi live thật. |
| `ADMIN_PASSWORD` | Mật khẩu đăng nhập trang Admin (`/admin`). Để trống thì server tự sinh mật khẩu ngẫu nhiên và in ra console mỗi lần khởi động — nên đặt cố định. |

## 3. Chạy server

**Chạy thật (kết nối TikTok LIVE thật):**

```bash
npm start
```

**Chạy thử (demo mode, không cần phòng live thật đang mở):**

```bash
npm run dev
```

Server chạy tại `http://localhost:PORT` (mặc định `http://localhost:8080`).

## 4. Thêm overlay vào OBS hoặc TikTok LIVE Studio

**OBS Studio:**

1. Thêm nguồn mới → **Browser Source**.
2. URL: `http://localhost:8080` (đổi theo `PORT` đã cấu hình).
3. Width: `1920`, Height: `1080`.
4. Tick **Shutdown source when not visible**: để **KHÔNG tick** (giữ game chạy nền 24/7 kể cả khi chuyển scene).
5. Nền overlay trong suốt sẵn — không cần thêm chroma key.

**TikTok LIVE Studio** (phần mềm live chính chủ của TikTok, tải trong app TikTok hoặc trang Creator Center):

1. Trong scene đang dùng, bấm **+** dưới mục Sources (Nguồn) → chọn **Link** (Web layer).
2. Dán URL: `http://localhost:8080` (đổi theo `PORT` đã cấu hình).
3. Đặt độ phân giải custom: `1920x1080`.
4. Kéo layer này xuống dưới layer camera/game nếu muốn overlay nằm phía trên hình quay, hoặc lên trên nếu muốn che toàn màn hình — tùy bố cục anh muốn.
5. Khóa layer (Lock) sau khi chỉnh xong vị trí để không bấm nhầm khi đang live.

Cả 2 phần mềm đều dùng chung 1 URL — không cần chạy 2 server riêng, không cần chỉnh gì thêm khi đổi phần mềm live.

Muốn hiển thị tiếng Anh: dùng URL `http://localhost:8080/?lang=en`.

## 5. Trang Admin — điều khiển & cài đặt

Mở `http://localhost:8080/admin` (đổi `PORT` nếu cần) trên trình duyệt của máy chạy server — **không** thêm URL này vào OBS, khán giả xem live sẽ không bao giờ thấy trang này.

Đăng nhập bằng `ADMIN_PASSWORD` trong `.env` (hoặc mật khẩu tự sinh in trong console log khi khởi động). Trang Admin cho phép:

- **Điều khiển trận đấu**: Bắt đầu trận mới / Tạm dừng / Tiếp tục / Kết thúc trận ngay (thủ công, không cần chờ HP về 0).
- **Cỡ nhân vật**: kéo thanh trượt để phóng to/thu nhỏ toàn bộ nhân vật trên overlay, áp dụng ngay lập tức.
- **Thông số trận đấu**: máu tối đa mỗi phe, ngưỡng % HP kích hoạt comeback buff, thời gian nghỉ giữa các trận.
- **Âm thanh**: âm lượng nhạc nền, âm lượng hiệu ứng, tắt tiếng toàn bộ.
- **Tên & màu phe**: đổi tên hiển thị và màu của phe Xanh/Đỏ, áp dụng ngay trên overlay (HP bar, nhân vật, leaderboard đều đổi theo).
- **Hiệu ứng thêm**: bật/tắt riêng từng hiệu ứng hình ảnh (Boss quà lớn, hiệu ứng diện rộng quà trung, pháo giấy khi thắng) mà không ảnh hưởng tới sát thương/hồi máu thật, và bật/tắt giọng đọc AI xướng tên người tặng (xem mục 7, cần cấu hình ElevenLabs).
- **Lịch tự động**: bật/tắt game tự động theo khung giờ trong ngày (vd 8h sáng → 11h đêm). Ngoài giờ, game tạm dừng (không ngắt kết nối TikTok LIVE), overlay hiện trạng thái "Ngoài giờ hoạt động". Lưu là áp dụng ngay, không cần khởi động lại server.

Mỗi thay đổi từ trang Admin phát ngay ra overlay qua Socket.IO (không cần tải lại trang OBS). Cài đặt trận đấu/cỡ nhân vật/âm thanh chỉ tồn tại trong bộ nhớ (mất khi restart server, quay về giá trị trong `config/theme.json`/`config/audio.json`) — riêng **lịch tự động** được ghi vào `config/schedule.json` (có backup `.bak`) nên vẫn giữ sau khi khởi động lại.

## 6. Sân khấu nhảy khi tặng quà (20 kiểu)

Khi 1 người tặng quà, nhân vật mang tên họ tạm rời đội hình, **phóng to 3 lần**, ra giữa màn hình nhảy theo phe — 2 phe nhảy đối mặt nhau qua tâm màn hình. Nhiều người tặng quà cùng lúc thì nhóm nhảy càng đông (tối đa 6 người/phe cùng lúc, người mới tặng quà tự xếp hàng thêm vào nhóm).

- **Quà càng lớn → nhảy càng lâu và càng đẹp**: thấp nhất 3 giây (quà nhỏ), cao nhất 10 giây (quà lớn nhất), tính theo giá trị xu thực tế của quà (không phụ thuộc tier sát thương).
- **20 kiểu nhảy khác nhau** — quà giá trị càng cao thì rơi vào kiểu nhảy càng phức tạp (nhiều chuyển động kết hợp: vung tay, đá chân, nhún người, nhảy bật), các kiểu cao cấp nhất có thêm hiệu ứng lấp lánh + hào quang vàng. Tất cả đều là động tác kiểu tập thể dục/aerobic — **không có kiểu nào xoay/lộn toàn thân**.
- Đây là hiệu ứng hình ảnh thuần túy — **không ảnh hưởng** tới sát thương/hồi máu thật (tier quà tặng trong `config/gifts.json` vẫn quyết định thắng/thua như trước).
- Tắt được ở trang Admin (mục "Hiệu ứng thêm cho hấp dẫn" → "Nhân vật nhảy khi được tặng quà") nếu anh muốn overlay đơn giản hơn.

## 7. Nhạc nền & hiệu ứng âm thanh

Overlay đã có sẵn nhạc nền + 4 SFX (quà nhỏ/trung/lớn/chiến thắng) **tự tổng hợp bằng sóng sin trong Node.js** (`scripts/generate-placeholder-audio.js`) — 0% bản quyền, an toàn tuyệt đối khi live TikTok, không cần tải file từ đâu cả, phát ngay từ lần chạy đầu tiên. Muốn thay bằng nhạc hay hơn (không bắt buộc): xem hướng dẫn chi tiết + gợi ý nguồn nhạc không bản quyền trong `public/audio/README.md`.

Âm lượng nhạc nền/SFX và tắt tiếng toàn bộ chỉnh trực tiếp trong trang Admin (mục 5, phần "Âm thanh") — áp dụng ngay lập tức, không cần khởi động lại server.

⚠️ **Không dùng nhạc có bản quyền thương mại** khi live trên TikTok — dễ bị tắt tiếng/cảnh cáo kênh. Nếu muốn thay nhạc, dùng TikTok Commercial Music Library, YouTube Audio Library, Pixabay Music, hoặc Freesound (license CC0).

## 8. Xướng tên người tặng bằng giọng AI (ElevenLabs, tùy chọn)

Khi có quà lớn (tier có donor spotlight), server có thể tự tạo giọng đọc "Cảm ơn [tên] đã tặng quà!" bằng ElevenLabs và phát trên overlay. Tính năng này **tùy chọn** — không cấu hình thì game vẫn chạy bình thường như cũ, chỉ đơn giản không có giọng đọc.

**Cài đặt:**

1. Tạo tài khoản tại [elevenlabs.io](https://elevenlabs.io) (dịch vụ **trả phí theo số ký tự**, có gói miễn phí giới hạn hàng tháng).
2. Lấy API key: Profile → API Keys.
3. (Tùy chọn) Chọn giọng đọc tại mục Voices → copy Voice ID. Không chọn thì dùng giọng mặc định "Rachel".
4. Điền vào `.env`:
   ```
   ELEVENLABS_API_KEY=xi-...
   ELEVENLABS_VOICE_ID=...
   ```
5. Khởi động lại server. Vào trang Admin → mục "Hiệu ứng thêm cho hấp dẫn" sẽ thấy dòng xác nhận "Đã cấu hình ElevenLabs", bật checkbox "Xướng tên người tặng bằng giọng AI".

**Lưu ý kỹ thuật quan trọng:** Model dùng là `eleven_flash_v2_5` — đây là model **duy nhất** của ElevenLabs hỗ trợ tiếng Việt tại thời điểm viết (model `eleven_multilingual_v2` dù tên có vẻ đa ngôn ngữ nhưng **không** hỗ trợ tiếng Việt). Không cần chỉnh gì thêm, đã cấu hình sẵn đúng model trong code.

Chi phí do ElevenLabs tính theo số ký tự chuyển thành giọng nói — mỗi lần xướng tên chỉ tốn vài chục ký tự (rất rẻ), nhưng nếu live liên tục nhiều giờ với nhiều quà lớn, tổng chi phí cộng dồn theo tài khoản ElevenLabs của anh, không phải chi phí của dự án này.

## 9. Chạy test

```bash
npm test
```

Chạy toàn bộ unit test cho logic quan trọng: xử lý gift-streak, tier quà tặng, trạng thái trận đấu, payload hiệu ứng, reconnect TikTok LIVE.

## 10. Chỉnh cấu hình gameplay (không cần sửa code)

- **`config/gifts.json`** — chỉnh tier quà tặng (ngưỡng xu, tên quà, sát thương/hồi máu, hiệu ứng).
- **`config/theme.json`** — đổi tên game, tên/màu 2 phe, từ khóa comment chọn phe, HP tối đa, ngưỡng comeback, thời gian reset trận, số nhân vật tối đa hiển thị mỗi phe.
- **`config/audio.json`** — âm lượng mặc định, đường dẫn file nhạc/SFX.
- **`config/schedule.json`** — lịch tự động (cũng chỉnh được qua trang Admin, không cần sửa tay).
- **`i18n/vi.json`, `i18n/en.json`** — chỉnh text UI theo ngôn ngữ.

## 11. Thể lệ thi đấu

- Người xem comment **"xanh"** hoặc **"đỏ"** để nhân vật mang tên mình gia nhập phe đó (không comment mà tặng quà thì tự động vào phe đang ít người hơn).
- Tặng quà giúp phe mình gây sát thương/hồi máu theo tier quà (`config/gifts.json`). Riêng **điểm xếp hạng** (leaderboard, MVP, thứ tự đứng gần hàng đầu trận tuyến) tính theo **đúng số xu TikTok thật đã tặng** (quà càng nhiều xu → điểm càng cao), không phải theo sát thương/hồi máu quy đổi — khớp với giá trị quà thật trên TikTok LIVE.
- Phe đưa đối thủ về 0 HP trước sẽ thắng. Phe dưới 30% HP (chỉnh được) nhận buff nhẹ để trận không một chiều.
- **Đội thắng**: cả đội được vinh danh giữa màn hình kiểu bục nhận cúp — hiện tên + avatar từng thành viên, người tặng nhiều nhất (MVP) nổi bật với cúp vàng + avatar to, kèm âm thanh chúc mừng. Bảng "Top Ủng Hộ" (góc trái dưới) cũng hiện avatar top 3 người tặng nhiều nhất trận hiện tại. Chưa có avatar thật (demo mode, hoặc TikTok không trả về ảnh) thì tự hiện vòng tròn màu phe + chữ cái đầu tên, không bao giờ để trống/vỡ ảnh. Đây là hình thức **ghi nhận/vinh danh trên màn hình**, không kèm phần thưởng vật chất hay trừ điểm — dự án hiện chưa có hệ thống tài khoản/kho thưởng để phát thưởng thật.
- **Đội thua**: không bị hiển thị phạt gì — chỉ đơn giản không có trong bảng vinh danh, xem như động lực cho trận tiếp theo.
- Trận tự động reset sau 10-15 giây (chỉnh được), lặp vô hạn 24/7.

## 12. Cấu trúc dự án

```
server.js                    # Composition root — ráp nối toàn bộ backend
config/gifts.json            # Tier quà tặng
config/theme.json            # Tên game, phe, màu, thông số trận đấu
config/audio.json            # Cấu hình nhạc/SFX
config/schedule.json         # Lịch tự động (ghi bởi trang Admin)
i18n/vi.json, en.json        # Text UI đa ngôn ngữ

src/server/
  env.js                     # Validate biến môi trường
  logger.js                  # Log có context
  giftResolver.js            # Quà → tier
  streakGuard.js             # Xử lý gift-streak (chống cộng dồn sai)
  battleState.js             # HP/phe/fighters/leaderboard — server-authoritative
  effectMapper.js            # Payload hiệu ứng gửi client (allowlist field)
  tiktokConnector.js         # Kết nối TikTok LIVE thật, auto-reconnect
  demoSimulator.js           # Giả lập sự kiện — CHỈ dùng khi DEMO_MODE=true
  socketGateway.js           # Ráp nối nguồn sự kiện ↔ Socket.IO, điều khiển thủ công
  adminAuth.js                # Xác thực nhẹ cho trang Admin
  adminApi.js                 # REST API cho trang Admin
  scheduler.js                 # Lịch tự động bật/tắt theo giờ
  ttsService.js                 # Gọi ElevenLabs TTS xướng tên (tùy chọn)
  danceResolver.js               # Quà → kiểu nhảy (1-20) + thời lượng nhảy

admin/
  index.html, admin.css, admin.js   # Trang điều khiển — KHÔNG thêm vào OBS

public/
  index.html, game.js        # Overlay OBS (entry point)
  css/theme.css               # Dark glassmorphism theme
  audio/                       # File nhạc/SFX (tự thêm, xem audio/README.md)
  js/audio.js                  # Phát nhạc nền + SFX
  js/renderer/                 # Canvas: roster nhân vật có tên, sân khấu nhảy, particle effects
    danceStyles.js               # 20 kiểu nhảy (tham số chuyển động)
  js/hud/                       # HP bar, leaderboard, màn vinh danh, spotlight
    avatar.js                    # Avatar dùng chung (ảnh thật hoặc fallback chữ cái)

tests/                        # Unit test (node:test)
```

## 13. Thiết kế chống thao túng (quan trọng)

Game này **cố tình không** dùng các chiêu trò gây áp lực chi tiêu:

- Không countdown kiểu "cần bao nhiêu xu để cứu phe".
- Không rung màn hình / SFX hù dọa khi HP thấp.
- Hiệu ứng quà lớn (Boss + spotlight) không dừng game, không giật gân — thuần ăn mừng.
- Không popup chặn màn hình yêu cầu hành động.
- Leaderboard là ghi nhận đóng góp thuần túy, không kèm lời kêu gọi nạp thêm.

## 14. Vận hành 24/7

- Server tự động reconnect khi mất kết nối TikTok LIVE (exponential backoff, có giới hạn tối đa 60s).
- Khi streamer dừng live/bị suspend, server tự chờ (`waitUntilLive`) thay vì liên tục thử kết nối gây rate-limit.
- Canvas overlay có giới hạn cứng số lượng nhân vật/boss/particle để tránh phình bộ nhớ khi chạy nhiều ngày liên tục.
- Trận đấu tự reset sau khi kết thúc (10-15 giây, chỉnh được), lặp vô hạn không cần can thiệp tay.
- Lịch tự động (mục 5) giúp game chỉ hoạt động đúng khung giờ live, không cần thức canh tắt/mở thủ công.

### Chạy 24/7 với pm2 (tự khởi động lại nếu crash/mất điện)

Dự án đã kèm sẵn `ecosystem.config.cjs`, chỉ cần:

```bash
npm install -g pm2        # cài 1 lần duy nhất trên máy
pm2 start ecosystem.config.cjs   # khởi động server, tự restart nếu crash
pm2 save                          # lưu lại danh sách tiến trình
pm2 startup                       # (làm theo hướng dẫn hiện ra) để pm2 tự chạy lại khi khởi động máy
```

Lệnh vận hành thường dùng:

```bash
pm2 status                # xem trạng thái
pm2 logs kingdom-clash    # xem log real-time
pm2 restart kingdom-clash # khởi động lại thủ công
pm2 stop kingdom-clash    # dừng
```

## 15. Deploy lên VPS + dùng tên miền mua qua Vercel (chạy độc lập máy cá nhân)

> ⚠️ **Vercel (hosting serverless) không tự chạy được game này** — game cần giữ kết nối TikTok LIVE + Socket.IO + trạng thái trận đấu sống liên tục trong 1 tiến trình 24/7, còn Vercel chỉ chạy function trong vài giây rồi tắt. Cách đúng: chạy code này trên 1 **VPS** (máy chủ riêng, ví dụ Hostinger VPS), domain vẫn mua/quản lý ở Vercel như bình thường — chỉ trỏ DNS 1 subdomain sang VPS.

### Bước 1 — Chuẩn bị VPS (làm 1 lần)

```bash
# SSH vào VPS lần đầu, cài Node.js 20+, git, pm2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs git
sudo npm install -g pm2

# Lấy code về VPS
git clone <URL_repo_GitHub_của_anh> kingdom-clash
cd kingdom-clash
npm install
cp .env.example .env   # rồi điền TIKTOK_USERNAME, ADMIN_PASSWORD, DEMO_MODE=false...

pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # làm theo hướng dẫn hiện ra để pm2 tự chạy lại khi VPS khởi động
```

### Bước 2 — Trỏ subdomain từ Vercel sang VPS

Trong Vercel → chọn domain đang quản lý → **DNS Records** → thêm:

| Type | Name | Value |
|---|---|---|
| A | `game` (hoặc tên anh muốn) | Địa chỉ IP của VPS |

Sau vài phút, `https://game.tenmien.com` sẽ trỏ thẳng vào VPS — domain chính vẫn dùng cho các trang khác trên Vercel như bình thường, không xung đột.

> Muốn có HTTPS (khuyên dùng, bắt buộc theo Mục 7 CLAUDE.md): cài thêm Nginx + Certbot (Let's Encrypt, miễn phí) trên VPS làm reverse proxy trỏ vào cổng `8080` — bước này cần làm trực tiếp trên VPS, hỏi em nếu anh muốn hướng dẫn chi tiết riêng.

### Bước 3 — Tự động cập nhật khi push code (đúng ý "sửa ở đây, bên kia tự cập nhật")

Dự án đã có sẵn `.github/workflows/deploy.yml` — mỗi lần push code lên nhánh `main` trên GitHub, VPS sẽ **tự động** `git pull` + cài lại package + `pm2 restart`, không cần vào tay VPS.

Chỉ cần khai báo 4 secret trong GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Tên secret | Giá trị |
|---|---|
| `VPS_HOST` | Địa chỉ IP hoặc domain của VPS |
| `VPS_USER` | Username SSH (thường là `root` hoặc user anh tạo) |
| `VPS_SSH_KEY` | Private key SSH dùng để đăng nhập VPS (dạng PEM, không phải mật khẩu) |
| `VPS_PROJECT_PATH` | Đường dẫn thư mục code trên VPS, ví dụ `/root/kingdom-clash` |

Từ lúc này: sửa code ở máy anh → `git push` → vài chục giây sau VPS tự cập nhật và restart, overlay đang chạy trong OBS/TikTok LIVE Studio tự nhận bản mới ở lần load lại tiếp theo.

## 16. Ghi chú (theo yêu cầu tự báo cáo minh bạch)

- Dự án **không có database và không có thanh toán** — các mục idempotency/rollback DB trong quy trình chuẩn không áp dụng cho phần lớn dự án; trạng thái trận đấu là in-memory, mất khi restart server (đúng thiết kế — mỗi trận vốn tự reset sau vài phút). Ngoại lệ duy nhất là `config/schedule.json`, được ghi ra đĩa có backup `.bak` vì lịch cần giữ qua các lần khởi động lại.
- Trang Admin dùng xác thực nhẹ (mật khẩu + token phiên trong bộ nhớ), không phải hệ thống tài khoản đầy đủ — đủ dùng cho 1 người vận hành trên máy cá nhân. Không nên expose cổng server ra Internet công khai mà không có thêm lớp bảo vệ (vd reverse proxy/VPN).
