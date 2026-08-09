# Kế hoạch triển khai: Mô-đun Sàn Nhảy Tương Tác Thời Gian Thực cho Live Studio

## 1. Tóm tắt yêu cầu

Xây dựng một mô-đun bổ sung cho nền tảng **Live Studio** hiện có của anh, cho phép:

- Lắng nghe bình luận trực tiếp từ TikTok Live / YouTube Live / Facebook Live.
- Phát hiện từ khóa kích hoạt (`hey`, `hay`, và các từ khóa mở rộng khác) để **sinh nhân vật hoạt hình đại diện cho người bình luận**, đưa lên sàn nhảy ảo.
- Nhân vật nhảy múa với hiệu ứng hình ảnh, âm nhạc, ánh sáng, đổi bối cảnh.
- **Gắn hệ thống quà tặng theo cấp bậc (gift-tier)**: quà giá trị càng cao → nhân vật càng "xịn" (trang phục cao cấp, điệu nhảy độc quyền, thời gian xuất hiện lâu hơn, nhạc nền riêng, quyền chọn màu trang phục/phong cách).
- Kiến trúc mở rộng được để sau này cắm thêm AI (giọng nói AI, sinh ảnh AI, gợi ý cá nhân hóa...).

Dưới đây là phân tích kiến trúc, luồng dữ liệu, mô hình dữ liệu, và lộ trình code theo từng giai đoạn (sprint).

---

## 2. Kiến trúc tổng thể

```
┌─────────────────────────────────────────────────────────────────────┐
│                         NGUỒN NỀN TẢNG LIVE                          │
│   TikTok Live (Unofficial/Signal API)  │  YouTube Live Chat API      │
│   Facebook Live Comments (Graph API)   │                             │
└───────────────┬───────────────────────────────────┬──────────────────┘
                │ webhook / websocket / polling      │
                ▼                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  1. INGESTION LAYER  (Comment Listener Service)                      │
│     - Adapter riêng cho từng nền tảng (Strategy Pattern)             │
│     - Chuẩn hoá event: {platform, userId, username, avatarUrl,       │
│       comment, giftInfo?, timestamp}                                  │
│     - Đẩy vào Message Queue (Kafka/Redis Streams/RabbitMQ)           │
└───────────────┬───────────────────────────────────────────────────────┘
                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  2. PARSING & INTENT ENGINE                                          │
│     - NLP nhẹ: chuẩn hoá unicode có dấu/không dấu (hay/hây/hey...)   │
│     - Fuzzy match + regex + danh sách từ khoá cấu hình được          │
│     - Trích thông tin quà tặng gắn kèm (nếu comment đi cùng gift)    │
│     - Sinh ra "DanceFloorEvent" chuẩn hoá                            │
└───────────────┬───────────────────────────────────────────────────────┘
                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  3. GIFT-TIER RESOLVER (Business Rule Engine)                        │
│     - Tra bảng cấu hình Level (Level 1→N) theo giá trị quà            │
│     - Trả về: gói nhân vật (skin), điệu nhảy, nhạc, thời lượng,      │
│       hiệu ứng, và danh sách "quyền tuỳ chỉnh" người xem được chọn    │
└───────────────┬───────────────────────────────────────────────────────┘
                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  4. STATE MANAGER (Dance Floor Session State)                        │
│     - Quản lý danh sách nhân vật đang trên sàn (queue + slot)        │
│     - Circular buffer: nhân vật hết giờ tự rời sàn, ưu tiên VIP      │
│     - Đồng bộ trạng thái real-time qua WebSocket tới renderer         │
└───────────────┬───────────────────────────────────────────────────────┘
                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  5. RENDER ENGINE (Overlay hiển thị trong OBS/Live Studio)            │
│     - Web-based overlay (HTML5 Canvas/WebGL hoặc Unity WebGL)         │
│     - Nhận sự kiện qua WebSocket, render nhân vật + animation         │
│     - Quản lý: sàn nhảy, ánh sáng, particle FX, âm thanh, camera      │
└─────────────────────────────────────────────────────────────────────┘
```

**Nguyên tắc thiết kế cốt lõi:** tách rời hoàn toàn 3 lớp — *nghe sự kiện* (Ingestion), *ra quyết định* (Business Rules), *hiển thị* (Render) — để anh có thể đổi nền tảng live, đổi luật gift-tier, hoặc đổi engine đồ họa mà không phải đập lại toàn bộ hệ thống.

---

## 3. Chi tiết từng lớp

### 3.1. Ingestion Layer — Lắng nghe bình luận

Mỗi nền tảng có cách truy cập khác nhau, cần adapter riêng:

| Nền tảng | Cách lấy comment/gift real-time | Ghi chú quan trọng |
|---|---|---|
| **YouTube Live** | YouTube Data API v3 – `liveChatMessages.list` (polling) hoặc thư viện community dùng WebSocket ngầm | Có API chính thức, ổn định nhất, có quota cần quản lý (polling interval hợp lý ~2-5s) |
| **Facebook Live** | Graph API – `live_comments` edge, cần Page Access Token + quyền `pages_read_engagement` | Facebook giới hạn nghiêm việc lấy comment cho tài khoản cá nhân; cần Page chính thức |
| **TikTok Live** | Không có API bình luận công khai chính thức cho nhà phát triển bên thứ ba. Cộng đồng dùng thư viện dựa trên WebSocket nội bộ của TikTok (ví dụ EulerStream/TikTokLive) | **Cần lưu ý**: đây là kênh không chính thức, có rủi ro thay đổi/giới hạn bất ngờ từ TikTok. Nên thiết kế adapter theo interface chung để dễ thay thế khi TikTok mở API chính thức hoặc đổi nhà cung cấp |

→ Thiết kế `ILiveCommentAdapter` interface, mỗi nền tảng implement riêng, output cùng 1 format sự kiện chuẩn. Đây là điểm mở rộng quan trọng nhất khi anh muốn thêm nền tảng mới (Shopee Live, Douyin...) sau này.

### 3.2. Parsing & Intent Engine

- Chuẩn hoá tiếng Việt: bỏ dấu, lowercase, trim (để `"Hây"`, `"hay"`, `"Hey"`, `"heyyy"` đều match).
- Dùng bảng **từ khóa cấu hình** (không hard-code) lưu trong DB/Admin panel, để anh tự thêm từ khóa mới mà không cần deploy lại code — ví dụ thêm `"lên sàn"`, `"nhảy đi"`, emoji 🕺.
- Có thể nâng cấp dùng mô hình phân loại ý định (intent classification) nhẹ nếu muốn nhận diện linh hoạt hơn regex thuần.

### 3.3. Gift-Tier Resolver — phần anh nhấn mạnh nhất

Đây là "bộ não" quy đổi giá trị quà tặng → đặc quyền hiển thị. Thiết kế dạng **bảng cấu hình (config-driven)**, không hard-code, để anh chỉnh giá/đặc quyền qua admin panel mà không cần sửa code:

```json
{
  "tiers": [
    {
      "level": 1,
      "name": "Cơ bản",
      "minGiftValue": 0,
      "characterSkins": ["basic_male", "basic_female"],
      "danceStyles": ["basic_bounce"],
      "musicTrack": "default_loop_1",
      "durationSeconds": 15,
      "customization": { "outfitColor": false, "danceStyleChoice": false }
    },
    {
      "level": 2,
      "name": "Bạc",
      "minGiftValue": 100,
      "characterSkins": ["silver_streetwear", "silver_dress"],
      "danceStyles": ["basic_bounce", "hiphop_groove"],
      "musicTrack": "silver_track_1",
      "durationSeconds": 30,
      "customization": { "outfitColor": true, "danceStyleChoice": false }
    },
    {
      "level": 3,
      "name": "Vàng",
      "minGiftValue": 500,
      "characterSkins": ["gold_suit", "gold_gown", "gold_streetwear"],
      "danceStyles": ["hiphop_groove", "kpop_dance", "breakdance"],
      "musicTrack": "gold_track_exclusive",
      "durationSeconds": 60,
      "customization": { "outfitColor": true, "danceStyleChoice": true, "vfxChoice": ["confetti", "spotlight"] }
    },
    {
      "level": 4,
      "name": "Kim Cương / VIP",
      "minGiftValue": 2000,
      "characterSkins": ["diamond_exclusive_set"],
      "danceStyles": ["all"],
      "musicTrack": "vip_signature_track",
      "durationSeconds": 120,
      "customization": {
        "outfitColor": true,
        "danceStyleChoice": true,
        "vfxChoice": ["confetti", "fireworks", "sceneChange", "spotlight"],
        "sceneChoice": true,
        "priorityStageSlot": true
      }
    }
  ]
}
```

**Logic áp dụng:**
1. Nhận `giftValue` từ sự kiện quà tặng của nền tảng (TikTok Coin, YouTube Super Sticker, FB Star...).
2. Quy đổi về đơn vị chung nội bộ (ví dụ "điểm quy đổi" — vì mỗi nền tảng có tỉ giá quà khác nhau).
3. Tìm tier phù hợp cao nhất mà `giftValue >= minGiftValue`.
4. Trả gói đặc quyền tương ứng cho State Manager.
5. Nếu người xem tặng nhiều quà tích luỹ trong phiên → có thể cộng dồn để lên tier (tuỳ luật anh muốn, cấu hình được).

**Gợi ý nâng cao (đỉnh hơn theo yêu cầu của anh):**
- **Combo effect**: tặng nhiều quà liên tiếp trong X giây → kích hoạt hiệu ứng đặc biệt toàn màn hình (mưa pháo hoa, đổi cả bối cảnh sàn nhảy).
- **Leaderboard người tặng nhiều nhất trong phiên** hiển thị trên overlay, người top 1 được giữ "spotlight" trung tâm sàn.
- **Nhân vật lưu trạng thái theo user** (không chỉ theo phiên): nếu cùng 1 người xem quay lại nhiều buổi live, hệ thống nhớ tier cao nhất họ từng đạt, hiển thị "danh hiệu" (VIP thường trực).

### 3.4. State Manager

- Sàn nhảy có giới hạn "slot" hiển thị đồng thời (ví dụ tối đa 8-12 nhân vật cùng lúc) để không rối mắt và giữ hiệu năng render.
- Hàng đợi ưu tiên: VIP/level cao chen vào slot trước, nhân vật cơ bản hết giờ bị đẩy ra trước.
- Đồng bộ real-time bằng WebSocket (Socket.IO hoặc raw WS) giữa backend và overlay render — đảm bảo độ trễ thấp (<500ms từ lúc nhận comment đến khi nhân vật xuất hiện).

### 3.5. Render Engine (Overlay)

- Chạy dưới dạng **Browser Source** trong OBS/Live Studio (HTML5 + WebGL), hoặc nếu Live Studio của anh có SDK riêng thì tích hợp trực tiếp qua plugin/overlay layer.
- Công nghệ đề xuất:
  - **PixiJS hoặc Three.js** cho render 2D/3D nhân vật + hiệu ứng particle (pháo hoa, confetti, ánh sáng).
  - **Spine2D hoặc rive.app** cho animation nhân vật mượt, dễ đổi skin/trang phục theo layer (giống thay đồ nhân vật game).
  - **Howler.js** để quản lý lớp nhạc/âm thanh đồng thời không giật.
- Bối cảnh (background scene) và ánh sáng nên thiết kế dạng **theme pack** (giống skin) để dễ thêm mới mà không sửa code render.

---

## 4. Mô hình dữ liệu chính

```
Event (bình luận thô)
  → id, platform, userId, username, avatarUrl, text, giftInfo, timestamp

DanceFloorEvent (đã parse)
  → eventId, triggerKeyword, userId, tierResolved, timestamp

CharacterInstance (nhân vật đang trên sàn)
  → instanceId, userId, username, skinId, danceStyleId, outfitColor,
    musicTrackId, startTime, durationSeconds, slotIndex, vfxQueue[]

TierConfig (bảng cấu hình cấp bậc — admin chỉnh được)
  → level, minGiftValue, skins[], danceStyles[], musicTrack,
    durationSeconds, customizationRights{}

GiftMapping (quy đổi quà từng nền tảng → điểm chung)
  → platform, giftId, giftName, pointValue
```

---

## 5. Lộ trình triển khai theo giai đoạn (đề xuất)

**Giai đoạn 1 — Nền tảng lõi (2-3 tuần)**
- Xây `ILiveCommentAdapter` cho 1 nền tảng trước (khuyên bắt đầu YouTube vì có API chính thức, ổn định để test).
- Parsing engine nhận diện `hey`/`hay` cơ bản.
- Render overlay đơn giản: 1 loại nhân vật, 1 điệu nhảy, xuất hiện khi có từ khóa.
- WebSocket kết nối backend ↔ overlay.

**Giai đoạn 2 — Hệ thống Gift-Tier (2 tuần)**
- Thêm adapter nhận sự kiện quà tặng.
- Xây bảng cấu hình tier + admin panel chỉnh sửa (không cần code lại).
- Nhân vật thay đổi skin/thời lượng theo tier.

**Giai đoạn 3 — Hiệu ứng & cá nhân hoá (2-3 tuần)**
- Thêm chọn màu trang phục, chọn điệu nhảy cho tier cao.
- Hiệu ứng đặc biệt (pháo hoa, đổi bối cảnh, ánh sáng theo nhịp nhạc).
- Leaderboard người tặng quà.

**Giai đoạn 4 — Mở rộng đa nền tảng + AI (liên tục)**
- Thêm adapter TikTok, Facebook.
- Gắn AI giọng nói (TTS đọc tên người tặng quà), sinh avatar AI theo mô tả, gợi ý điệu nhảy theo nhạc trend.
- Tối ưu hiệu năng khi nhiều phiên live chạy song song.

---

## 6. Rủi ro cần lưu ý

- **TikTok không có API bình luận chính thức công khai** — các thư viện cộng đồng có thể ngừng hoạt động bất ngờ nếu TikTok thay đổi hệ thống nội bộ. Nên có cơ chế fallback/cảnh báo khi mất kết nối, và tách adapter TikTok riêng để dễ thay thế.
- **Độ trễ mạng**: nếu polling thay vì WebSocket, cần cân bằng giữa tần suất polling và quota API (đặc biệt YouTube Data API có giới hạn quota/ngày).
- **Hiệu năng render**: nhiều nhân vật + hiệu ứng cùng lúc có thể giật lag trên máy cấu hình yếu — nên giới hạn số lượng slot đồng thời và tối ưu asset animation (sprite atlas, nén texture).

---

Đây là bản kế hoạch kiến trúc tổng thể. Nếu anh muốn, em có thể bắt đầu code luôn phần **Giai đoạn 1** (adapter YouTube + parsing engine + overlay demo cơ bản) để anh có sản phẩm chạy thử ngay, rồi mình build tiếp các giai đoạn sau.
