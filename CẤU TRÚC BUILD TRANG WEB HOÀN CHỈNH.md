# 🌐 WEB BLUEPRINT — THIỆN VUA APP
## Kiến Trúc Hoàn Chỉnh Cho Mọi Trang Web Tỷ Đô — v1.0 FINAL

```
╔══════════════════════════════════════════════════════════════════════════╗
║       🔴 THIỆN VUA APP — WEB BLUEPRINT v1.0 FINAL 🔴                    ║
║   Cấu trúc chuẩn tỷ đô — Tuỳ biến theo từng sản phẩm                   ║
║   UI/UX đỉnh nhất — Thanh toán — Admin — Bán hàng — Tất cả             ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

## 📋 MỤC LỤC

```
PHẦN 1  — HỆ THỐNG DESIGN TOKEN              (Màu sắc, Font, Spacing)
PHẦN 2  — KIẾN TRÚC TRANG TỔNG THỂ          (Sơ đồ tất cả trang)
PHẦN 3  — LAYOUT & NAVIGATION               (Header, Footer, Sidebar)
PHẦN 4  — LANDING PAGE / TRANG CHỦ          (Hero → CTA → Ship)
PHẦN 5  — TRANG BÁN HÀNG / SALES PAGE       (Chuyển đổi cao nhất)
PHẦN 6  — TRANG SẢN PHẨM / KHOÁ HỌC        (Product Detail)
PHẦN 7  — TRANG GIỎ HÀNG                    (Cart)
PHẦN 8  — TRANG THANH TOÁN                  (Checkout + SePay)
PHẦN 9  — TRANG CẢM ƠN / SUCCESS            (Thank You)
PHẦN 10 — TRANG AUTH                        (Login / Register)
PHẦN 11 — TRANG HỒ SƠ / PROFILE            (User Account)
PHẦN 12 — TRANG DASHBOARD NGƯỜI DÙNG       (My Orders, Progress)
PHẦN 13 — ADMIN PANEL                       (Quản trị toàn bộ)
PHẦN 14 — TRANG BLOG / NỘI DUNG            (SEO + Authority)
PHẦN 15 — TRANG VỀ CHÚNG TÔI               (About + Trust)
PHẦN 16 — TRANG LIÊN HỆ / HỖ TRỢ          (Contact + FAQ)
PHẦN 17 — TRANG LỖI                         (404, 500, Maintenance)
PHẦN 18 — COMPONENT LIBRARY                 (UI Kit hoàn chỉnh)
PHẦN 19 — HÌNH ẢNH & VIDEO MINH HOẠ        (Media Strategy)
PHẦN 20 — SEO & PERFORMANCE                 (Tốc độ + Ranking)
PHẦN 21 — TUỲ BIẾN THEO SẢN PHẨM          (Màu + Layout theo loại)
PHẦN 22 — CHECKLIST TRƯỚC KHI LAUNCH       (Go-live Checklist)
```

---

## 🎨 PHẦN 1 — HỆ THỐNG DESIGN TOKEN

> **Nguyên tắc**: Định nghĩa token 1 lần, dùng xuyên suốt. Không hardcode màu hay font.

### 1.1 — Hệ Thống Màu Sắc (Tuỳ Biến Theo Sản Phẩm)

```css
/* ═══ THIỆN VUA APP — DESIGN TOKENS ═══ */
:root {
  /* ── PRIMARY BRAND (Tuỳ biến theo sản phẩm — xem Phần 21) ── */
  --color-primary-50:  #fef2f2;   /* Lightest tint */
  --color-primary-100: #fee2e2;
  --color-primary-400: #f87171;
  --color-primary-500: #ef4444;   /* Main brand color */
  --color-primary-600: #dc2626;   /* Hover state */
  --color-primary-700: #b91c1c;   /* Active/pressed */
  --color-primary-900: #7f1d1d;   /* Darkest */

  /* ── NEUTRAL (Dùng chung mọi sản phẩm) ── */
  --color-white:       #ffffff;
  --color-black:       #000000;
  --color-gray-50:     #f9fafb;
  --color-gray-100:    #f3f4f6;
  --color-gray-200:    #e5e7eb;
  --color-gray-300:    #d1d5db;
  --color-gray-400:    #9ca3af;
  --color-gray-500:    #6b7280;
  --color-gray-600:    #4b5563;
  --color-gray-700:    #374151;
  --color-gray-800:    #1f2937;
  --color-gray-900:    #111827;
  --color-gray-950:    #030712;

  /* ── SEMANTIC COLORS ── */
  --color-success:     #10b981;
  --color-warning:     #f59e0b;
  --color-error:       #ef4444;
  --color-info:        #3b82f6;

  /* ── SURFACE (Background layers) ── */
  --surface-base:      var(--color-white);      /* Page background */
  --surface-raised:    var(--color-gray-50);    /* Cards */
  --surface-overlay:   var(--color-gray-100);   /* Modals, dropdowns */
  --surface-invert:    var(--color-gray-900);   /* Dark sections */

  /* ── DARK MODE SURFACES ── */
  --surface-dark-base:    #0a0a0a;
  --surface-dark-raised:  #111111;
  --surface-dark-card:    #1a1a1a;
  --surface-dark-border:  #2a2a2a;

  /* ── TEXT ── */
  --text-primary:   var(--color-gray-900);
  --text-secondary: var(--color-gray-600);
  --text-tertiary:  var(--color-gray-400);
  --text-invert:    var(--color-white);
  --text-brand:     var(--color-primary-500);

  /* ── BORDER ── */
  --border-light:  var(--color-gray-200);
  --border-medium: var(--color-gray-300);
  --border-strong: var(--color-gray-400);

  /* ── GRADIENT ── */
  --gradient-brand:    linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700));
  --gradient-dark:     linear-gradient(135deg, #0a0a0a, #1a1a1a);
  --gradient-glass:    linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
  --gradient-hero:     linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%);

  /* ── SHADOW ── */
  --shadow-xs:  0 1px 2px rgba(0,0,0,0.05);
  --shadow-sm:  0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
  --shadow-md:  0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06);
  --shadow-lg:  0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05);
  --shadow-xl:  0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04);
  --shadow-2xl: 0 25px 50px rgba(0,0,0,0.25);
  --shadow-brand: 0 8px 30px rgba(239,68,68,0.3); /* brand color glow */

  /* ── BORDER RADIUS ── */
  --radius-xs:   4px;
  --radius-sm:   6px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-xl:   16px;
  --radius-2xl:  24px;
  --radius-full: 9999px;

  /* ── SPACING SCALE ── */
  --space-1:  4px;   --space-2:  8px;   --space-3:  12px;
  --space-4:  16px;  --space-5:  20px;  --space-6:  24px;
  --space-8:  32px;  --space-10: 40px;  --space-12: 48px;
  --space-16: 64px;  --space-20: 80px;  --space-24: 96px;
  --space-32: 128px;

  /* ── TYPOGRAPHY ── */
  --font-display: 'Clash Display', 'Plus Jakarta Sans', sans-serif;
  --font-body:    'Inter', 'DM Sans', sans-serif;
  --font-mono:    'JetBrains Mono', 'Fira Code', monospace;

  --text-xs:   0.75rem;   /* 12px */
  --text-sm:   0.875rem;  /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg:   1.125rem;  /* 18px */
  --text-xl:   1.25rem;   /* 20px */
  --text-2xl:  1.5rem;    /* 24px */
  --text-3xl:  1.875rem;  /* 30px */
  --text-4xl:  2.25rem;   /* 36px */
  --text-5xl:  3rem;      /* 48px */
  --text-6xl:  3.75rem;   /* 60px */
  --text-7xl:  4.5rem;    /* 72px */

  /* ── ANIMATION ── */
  --ease-in:      cubic-bezier(0.4, 0, 1, 1);
  --ease-out:     cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out:  cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring:  cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --duration-fast:   150ms;
  --duration-base:   250ms;
  --duration-slow:   400ms;
  --duration-slower: 600ms;

  /* ── Z-INDEX ── */
  --z-base:    0;
  --z-raised:  10;
  --z-dropdown: 100;
  --z-sticky:  200;
  --z-overlay: 300;
  --z-modal:   400;
  --z-toast:   500;
  --z-tooltip: 600;

  /* ── CONTAINER ── */
  --container-sm:  640px;
  --container-md:  768px;
  --container-lg:  1024px;
  --container-xl:  1280px;
  --container-2xl: 1440px;
}
```

### 1.2 — Typography Scale

```css
/* DISPLAY — Headlines lớn, hero sections */
.text-display-2xl { font: 700 var(--text-7xl)/1.1 var(--font-display); letter-spacing: -0.04em; }
.text-display-xl  { font: 700 var(--text-6xl)/1.1 var(--font-display); letter-spacing: -0.03em; }
.text-display-lg  { font: 700 var(--text-5xl)/1.2 var(--font-display); letter-spacing: -0.02em; }
.text-display-md  { font: 600 var(--text-4xl)/1.2 var(--font-display); letter-spacing: -0.02em; }
.text-display-sm  { font: 600 var(--text-3xl)/1.3 var(--font-display); letter-spacing: -0.01em; }

/* HEADING — Section titles */
.text-heading-xl  { font: 600 var(--text-2xl)/1.4 var(--font-display); }
.text-heading-lg  { font: 600 var(--text-xl)/1.4  var(--font-display); }
.text-heading-md  { font: 600 var(--text-lg)/1.5  var(--font-body); }
.text-heading-sm  { font: 600 var(--text-base)/1.5 var(--font-body); }

/* BODY — Content text */
.text-body-xl  { font: 400 var(--text-xl)/1.7  var(--font-body); }
.text-body-lg  { font: 400 var(--text-lg)/1.7  var(--font-body); }
.text-body-md  { font: 400 var(--text-base)/1.6 var(--font-body); }
.text-body-sm  { font: 400 var(--text-sm)/1.6  var(--font-body); }

/* LABEL / CAPTION */
.text-label    { font: 500 var(--text-sm)/1.4  var(--font-body); letter-spacing: 0.01em; }
.text-caption  { font: 400 var(--text-xs)/1.4  var(--font-body); }
.text-overline { font: 600 var(--text-xs)/1.4  var(--font-body); letter-spacing: 0.1em; text-transform: uppercase; }
```

---

## 🗺️ PHẦN 2 — KIẾN TRÚC TRANG TỔNG THỂ

```
SITEMAP — TRANG WEB TỶ ĐÔ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PUBLIC PAGES (Ai cũng xem được)
├── / ................................ Landing Page / Home
├── /san-pham ........................ Trang sản phẩm / danh mục
├── /san-pham/[slug] ................. Chi tiết sản phẩm
├── /khoa-hoc ........................ Danh sách khoá học
├── /khoa-hoc/[slug] ................. Chi tiết khoá học
├── /mua-ngay ........................ Sales Page (chuyển đổi cao)
├── /blog ............................ Blog / Kiến thức
├── /blog/[slug] ..................... Bài viết chi tiết
├── /ve-chung-toi .................... About Us
├── /lien-he ......................... Contact
├── /faq ............................. FAQ
└── /chinh-sach ...................... Chính sách (Privacy, Terms)

AUTH PAGES
├── /dang-nhap ....................... Login
├── /dang-ky ......................... Register
├── /quen-mat-khau ................... Forgot Password
└── /dat-lai-mat-khau ................ Reset Password

CHECKOUT FLOW (Funnel mua hàng)
├── /gio-hang ........................ Cart
├── /thanh-toan ...................... Checkout
├── /thanh-toan/xac-nhan ............. Order Review
├── /cam-on/[order-id] ............... Thank You / Success
└── /thanh-toan/that-bai ............. Payment Failed

USER PORTAL (Đã đăng nhập)
├── /ho-so ........................... Profile settings
├── /ho-so/don-hang .................. My Orders
├── /ho-so/khoa-hoc-cua-toi .......... My Courses
├── /ho-so/lich-su-thanh-toan ........ Payment History
├── /ho-so/yeu-thich ................. Wishlist
└── /ho-so/bao-mat ................... Security settings

ADMIN PANEL (Role: admin)
├── /admin ........................... Dashboard tổng quan
├── /admin/don-hang .................. Quản lý đơn hàng
├── /admin/san-pham .................. Quản lý sản phẩm
├── /admin/khach-hang ................ Quản lý khách hàng
├── /admin/noi-dung .................. Quản lý nội dung
├── /admin/thanh-toan ................ Quản lý thanh toán
├── /admin/ma-giam-gia ............... Quản lý coupon
├── /admin/tiep-thi .................. Marketing / Email
├── /admin/phan-tich ................. Analytics
└── /admin/cai-dat ................... Cài đặt hệ thống

ERROR PAGES
├── /404 ............................. Not Found
├── /500 ............................. Server Error
└── /bao-tri ......................... Maintenance Mode
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🧱 PHẦN 3 — LAYOUT & NAVIGATION

### 3.1 — Header (Sticky)

```
┌────────────────────────────────────────────────────────────────┐
│  HEADER — HEIGHT: 64px (desktop) / 56px (mobile) — STICKY      │
├──────────┬────────────────────────────────┬───────────────────┤
│  LOGO    │   NAV LINKS (ẩn mobile)        │  CTA + USER       │
│  [Logo]  │  Trang chủ | Sản phẩm | Blog   │  [Đăng nhập] [Mua]│
└──────────┴────────────────────────────────┴───────────────────┘

MOBILE HEADER:
┌──────────┬────────────────────────────────────────┬──────────┐
│  [☰]     │           LOGO (center)                 │  [🛒]    │
└──────────┴────────────────────────────────────────┴──────────┘

STATES:
  Default:   background transparent, blur on scroll
  Scrolled:  background white/dark + shadow + blur backdrop
  Dark page: white text + logo light variant

NAVIGATION ITEMS:
  Trang chủ | Sản phẩm (dropdown) | Khoá học | Blog | Về chúng tôi
  RIGHT: 🔍 Tìm kiếm | 🛒 Giỏ hàng (badge) | Avatar (dropdown menu)

MEGA MENU (Sản phẩm dropdown):
┌────────────────────────────────────────────────────────┐
│  DANH MỤC           │  NỔI BẬT              │  MỚI    │
│  • Khoá học AI      │  [Ảnh] Khoá học hot   │  ...    │
│  • Tools & App      │  [Ảnh] Sản phẩm hot   │  ...    │
│  • Consulting       │                        │         │
└────────────────────────────────────────────────────────┘
```

### 3.2 — Footer

```
┌────────────────────────────────────────────────────────────────┐
│                        FOOTER                                   │
├────────────────┬──────────────┬──────────────┬────────────────┤
│  BRAND         │  SẢN PHẨM   │  CÔNG TY     │  LIÊN HỆ       │
│  [Logo]        │  Khoá học   │  Về chúng tôi│  Email         │
│  Tagline ngắn  │  AI Tools   │  Blog        │  Hotline       │
│                │  Consulting │  Tuyển dụng  │  Địa chỉ       │
│  [FB][TT][YT]  │  Affiliate  │  Điều khoản  │  [Form nhanh]  │
├────────────────┴──────────────┴──────────────┴────────────────┤
│  NEWSLETTER: [Email input          ] [Đăng ký nhận ưu đãi]    │
├────────────────────────────────────────────────────────────────┤
│  © 2025 Thiện Vua App  |  Privacy  |  Terms  |  Sitemap        │
│  Thanh toán: [Visa][MC][Momo][VNPay][SePay][Banking]           │
└────────────────────────────────────────────────────────────────┘
```

### 3.3 — Sidebar (Admin & Dashboard)

```
┌────────────────────────────────────────────────────────────────┐
│  SIDEBAR — 240px collapsed → 64px (icon only)                  │
├────────────────────────────────────────────────────────────────┤
│  [Logo] [←Collapse]                                            │
├────────────────────────────────────────────────────────────────┤
│  🏠 Dashboard                                                   │
│  📦 Sản phẩm                                                    │
│  📋 Đơn hàng              ← badge count                        │
│  👥 Khách hàng                                                  │
│  💰 Thanh toán                                                  │
│  🎟️ Mã giảm giá                                                 │
│  📧 Email marketing                                             │
│  📊 Phân tích                                                   │
│  📝 Nội dung                                                    │
│  ─────────────────                                              │
│  ⚙️ Cài đặt                                                     │
│  ❓ Hỗ trợ                                                      │
│  [Avatar] Thiện          ← User info bottom                     │
└────────────────────────────────────────────────────────────────┘
```

---

## 🚀 PHẦN 4 — LANDING PAGE / TRANG CHỦ

```
LANDING PAGE STRUCTURE — FLOW TỪ TRÊN XUỐNG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[1] HEADER (sticky)

[2] HERO SECTION — Ấn tượng đầu tiên, quyết định ở lại
────────────────────────────────────────────────────────
  Layout: Full-screen (100vh)
  Left:   Eyebrow tag | H1 headline lớn (60-72px) | Subheadline
          USP bullet points (3 điểm) | 2 CTA buttons
          Trust signals: [⭐4.9] [12,000+ users] [Đảm bảo hoàn tiền]
  Right:  Hero image/video/3D element / Product mockup
  Background: Dark gradient / Brand gradient / Video loop
  Effect: Particle animation / Glassmorphism cards floating

[3] LOGO WALL — Social proof tức thì
────────────────────────────────────────────────────────
  "Được tin dùng bởi:"
  [Logo 1] [Logo 2] [Logo 3] [Logo 4] [Logo 5] (auto-scroll)

[4] PROBLEM SECTION — Khoét sâu nỗi đau
────────────────────────────────────────────────────────
  Headline: "Bạn có đang gặp những vấn đề này?"
  3-4 Pain Point cards với icon + mô tả cụ thể
  Transition text → dẫn vào solution

[5] SOLUTION / FEATURES SECTION
────────────────────────────────────────────────────────
  Headline: "Giải pháp của chúng tôi"
  Layout options:
  A) Feature grid: 3 cột x 2 hàng (6 features)
  B) Feature tabs: Left nav + Right content (animated)
  C) Alternating: Image left/right + Text
  Mỗi feature: Icon lớn + Headline + Mô tả + Link "Xem thêm"

[6] HOW IT WORKS — Process section
────────────────────────────────────────────────────────
  "3 bước đơn giản" (hoặc 4-5 bước)
  Timeline horizontal (desktop) / vertical (mobile)
  Mỗi bước: Step number + Icon + Title + Mô tả ngắn

[7] SOCIAL PROOF — Testimonials
────────────────────────────────────────────────────────
  Headline: "Hơn 12,000 khách hàng tin dùng"
  Stats bar: [12,000+ Users] [4.9★ Rating] [98% Hài lòng] [50M+ Doanh thu tạo ra]
  Testimonial carousel: Ảnh avatar + Tên + Chức danh + Quote + Kết quả cụ thể
  Video testimonials (nếu có): Embed với thumbnail đẹp

[8] PRODUCT SHOWCASE — Demo trực quan
────────────────────────────────────────────────────────
  Screenshots / Screen recording / Interactive demo
  Before/After comparison slider
  "Xem thử miễn phí" CTA

[9] PRICING SECTION — Định giá rõ ràng
────────────────────────────────────────────────────────
  Toggle: Tháng / Năm (với tiết kiệm %)
  3 gói: Starter | Pro | Enterprise
  Highlighted: Gói phổ biến nhất (Popular badge)
  Mỗi gói: Giá + Danh sách tính năng + CTA button
  Guarantee: "Hoàn tiền 30 ngày nếu không hài lòng"

[10] FAQ — Xử lý objection
────────────────────────────────────────────────────────
  Accordion với 8-10 câu hỏi phổ biến nhất
  Categories nếu nhiều câu hỏi

[11] FINAL CTA — Chốt hạ
────────────────────────────────────────────────────────
  Background: Brand gradient / Dark
  Headline lớn + Subheadline
  Urgency: "Ưu đãi kết thúc trong [TIMER]"
  Primary CTA + Secondary CTA
  No-risk statement: "Không cần credit card • Hoàn tiền 30 ngày"

[12] FOOTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 💰 PHẦN 5 — TRANG BÁN HÀNG / SALES PAGE

> Trang này có 1 mục tiêu duy nhất: CHUYỂN ĐỔI. Không có navigation ra ngoài.

```
SALES PAGE STRUCTURE — HIGH CONVERSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[HEADER MINIMAL] — Logo only + Phone support. Không có menu.

[1] HEADLINE HOOK — 3 giây đầu quyết định
  Pre-headline (eyebrow): "Dành cho [target audience]"
  Main headline: Kết quả cụ thể + Thời gian + Không rủi ro
  Sub-headline: Mô tả rõ hơn offer
  Hero image/video ngay cạnh

[2] VIDEO SALES LETTER (VSL) — Nếu có
  Video 5-15 phút, autoplay (muted), controls tắt
  Transcript bên dưới cho người không xem video

[3] PROBLEM AGITATION — Khoét nỗi đau
  "Bạn đang cảm thấy..."
  Bulleted list 5-7 pain points (đúng với target)
  "Nếu bạn gật đầu... thì đây là giải pháp"

[4] STORY / CREDIBILITY — Câu chuyện + Uy tín
  Câu chuyện cá nhân (ai, từ đâu, đã đạt gì)
  Credentials: Số liệu cụ thể, media mentions, awards

[5] SOLUTION REVEAL — Giới thiệu sản phẩm
  Product name + Big promise
  "Đây là những gì bạn sẽ nhận được..."
  Feature → Benefit (không chỉ liệt kê tính năng)

[6] WHAT'S INCLUDED — Giá trị rõ ràng
  Mỗi item: Tên + Mô tả + Giá trị quy ra tiền
  Stack value: "Tổng giá trị: X,XXX,000đ"
  "Hôm nay bạn chỉ trả: XXX,000đ"

[7] SOCIAL PROOF x3 — Testimonials mạnh nhất
  Video testimonials ưu tiên
  Screenshot kết quả thực (trước/sau)
  Tên thật + Ảnh thật + Kết quả cụ thể số liệu

[8] FIRST CTA — Sau khi đủ value
  ┌─────────────────────────────────────────┐
  │  🔥 GIÁ ĐẶC BIỆT: 997,000đ             │
  │  ~~Giá gốc: 2,997,000đ~~               │
  │  ⏳ Còn lại: [COUNTDOWN TIMER]          │
  │  [✅ TÔI MUỐN BẮT ĐẦU NGAY]            │
  │  🔒 Thanh toán bảo mật SSL 256-bit      │
  │  ✅ Hoàn tiền 30 ngày không cần lý do   │
  └─────────────────────────────────────────┘

[9] BONUS STACK — Tăng perceived value
  Bonus 1: [Tên] — Giá trị: X,000,000đ
  Bonus 2: [Tên] — Giá trị: X,000,000đ
  "MIỄN PHÍ khi đăng ký hôm nay"

[10] RISK REVERSAL — Đảo ngược rủi ro
  Guarantee badge lớn
  "Hoàn tiền 100% trong 30 ngày. Không câu hỏi."
  Giải thích chi tiết điều kiện đơn giản

[11] FAQ — Xử lý objections cuối
  8-10 câu hỏi phổ biến nhất của người DO DỰ

[12] URGENCY SECTION — Tạo khan hiếm thật
  Countdown timer
  "Chỉ còn [X] suất ở giá này"
  Lý do khan hiếm phải thật, không fake

[13] FINAL CTA — Chốt lần 2
  Repeat offer summary
  Price anchor
  [BIG CTA BUTTON]
  Payment methods icons

[FOOTER MINIMAL] — Chính sách, liên hệ. Không có links ra ngoài.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📦 PHẦN 6 — TRANG SẢN PHẨM / KHOÁ HỌC CHI TIẾT

```
PRODUCT DETAIL PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BREADCRUMB: Trang chủ > Khoá học > [Tên khoá học]

LAYOUT 2 CỘT:
┌─────────────────────────────┬─────────────────────┐
│  LEFT (60%)                 │  RIGHT (40%) STICKY  │
│                             │                      │
│  Media gallery:             │  PURCHASE CARD:      │
│  [Video preview / Ảnh]      │  Giá hiện tại        │
│  Thumbnail strip            │  Giá gốc (gạch)      │
│                             │  % tiết kiệm         │
│  Product title H1           │  ⏳ Countdown         │
│  Rating: ⭐4.9 (1,234 đánh) │                      │
│  Enrolled: 12,345 học viên  │  [MUA NGAY]          │
│  Updated: 01/2025           │  [THÊM GIỎ HÀNG]     │
│                             │                      │
│  TABS:                      │  Bao gồm:            │
│  [Tổng quan][Nội dung]      │  ✅ X giờ video       │
│  [Instructor][Đánh giá]     │  ✅ X bài tập         │
│                             │  ✅ Truy cập vĩnh viễn│
│  WHAT YOU'LL LEARN:         │  ✅ Certificate       │
│  Grid 2 cột checkmarks      │  ✅ Hỗ trợ 1:1        │
│                             │                      │
│  COURSE CONTENT:            │  GUARANTEE:          │
│  Accordion sections         │  [30-day badge]      │
│  + lesson list              │  Hoàn tiền 30 ngày   │
│                             │                      │
│  INSTRUCTOR section         │  SHARE: [FB][TT][CP] │
│  REVIEWS section            │                      │
└─────────────────────────────┴─────────────────────┘

RELATED PRODUCTS (Bottom):
Carousel "Bạn cũng có thể thích" — 4 products/row
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🛒 PHẦN 7 — TRANG GIỎ HÀNG

```
CART PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌──────────────────────────────────┬─────────────────┐
│  GIỎ HÀNG (3 sản phẩm)          │  TÓM TẮT ĐƠN    │
│                                  │                  │
│  [Ảnh] Khoá học A         [X]   │  Tạm tính:      │
│         Khoá học AI cơ bản       │  997,000đ       │
│         [-][1][+]  997,000đ      │                  │
│  ─────────────────────────────  │  Giảm giá:      │
│  [Ảnh] Tool B             [X]   │  -100,000đ      │
│         AI Writing Tool          │  ─────────────  │
│         [-][1][+]  299,000đ      │  Tổng:          │
│  ─────────────────────────────  │  1,196,000đ     │
│                                  │                  │
│  MÃ GIẢM GIÁ:                   │  [THANH TOÁN]   │
│  [____________] [ÁP DỤNG]       │                  │
│                                  │  Thanh toán      │
│  Bạn tiết kiệm được:             │  bảo mật:       │
│  💚 200,000đ so với mua lẻ       │  [Visa][MB][...] │
│                                  │                  │
│  [← Tiếp tục mua sắm]           │  🔒 SSL 256-bit  │
└──────────────────────────────────┴─────────────────┘

UPSELL: "Khách hàng mua khoá này cũng mua thêm..."
Cross-sell: 3 sản phẩm gợi ý
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 💳 PHẦN 8 — TRANG THANH TOÁN (CHECKOUT)

```
CHECKOUT PAGE — KHÔNG CÓ DISTRACTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HEADER: Logo + "Thanh toán bảo mật" + 🔒 icon. Không menu.

PROGRESS STEPS:
  [✅ Giỏ hàng] → [🔵 Thông tin] → [Thanh toán] → [Hoàn tất]

┌───────────────────────────────┬──────────────────┐
│  LEFT — FORM THÔNG TIN        │  RIGHT — TÓM TẮT │
│                               │                  │
│  THÔNG TIN LIÊN HỆ:           │  [Ảnh] Khoá học  │
│  [Họ và tên          ]        │  Tên sản phẩm    │
│  [Email              ]        │  997,000đ        │
│  [Số điện thoại      ]        │  ─────────────   │
│                               │  Tạm tính:       │
│  ĐỊA CHỈ XUẤT HOÁ ĐƠN:       │  997,000đ        │
│  [Địa chỉ            ]        │  Giảm giá:       │
│  [Tỉnh/TP ▼] [Quận ▼]        │  -100,000đ       │
│                               │  ─────────────   │
│  PHƯƠNG THỨC THANH TOÁN:      │  TỔNG:           │
│  ○ 🏦 Chuyển khoản ngân hàng  │  897,000đ        │
│  ○ 📱 Momo                    │                  │
│  ○ 💳 Thẻ Visa/MasterCard     │  [Mã giảm giá]   │
│  ○ 🔵 VNPay QR                │  [___________]   │
│  ○ 🟣 SePay                   │  [ÁP DỤNG]       │
│                               │                  │
│  [Thông tin QR / Bank]        │  🔒 Bảo mật SSL  │
│                               │  Hoàn tiền 30 ng │
│  ☑ Tôi đồng ý điều khoản     │                  │
│                               │                  │
│  [✅ XÁC NHẬN ĐẶT HÀNG]      │                  │
└───────────────────────────────┴──────────────────┘

TRUST SIGNALS dưới form:
[🔒 SSL] [✅ Bảo mật] [💚 Hoàn tiền] [⭐ 4.9/5]

PAYMENT METHOD DETAILS:
─── Chuyển khoản ngân hàng ───
  Ngân hàng: MB Bank / Techcombank / Vietcombank
  Số tài khoản: [XXXX XXXX XXXX]
  Tên: CONG TY / CA NHAN
  Nội dung CK: [Order ID tự điền]
  [Copy số TK] [Copy nội dung]
  QR Code lớn để quét nhanh

─── SePay Integration ───
  Hiển thị QR động
  Auto-detect sau khi chuyển khoản (webhook)
  Countdown 15 phút để hoàn tất
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎉 PHẦN 9 — TRANG CẢM ƠN / SUCCESS

```
THANK YOU PAGE — /cam-on/[order-id]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[CONFETTI ANIMATION khi load]

┌──────────────────────────────────────────────────┐
│                                                   │
│          🎉                                       │
│   CẢM ƠN BẠN ĐÃ ĐẶT HÀNG!                       │
│                                                   │
│   Đơn hàng #TVA-2025-001234                       │
│   đã được xác nhận thành công                     │
│                                                   │
│   📧 Thông tin đăng nhập đã gửi đến               │
│      [email@example.com]                          │
│                                                   │
└──────────────────────────────────────────────────┘

ĐƠN HÀNG CỦA BẠN:
┌──────────────────────────────────────────────────┐
│  Mã đơn:    #TVA-2025-001234                     │
│  Ngày:      15/01/2025 - 14:32                   │
│  Sản phẩm:  Khoá học AI Marketing                │
│  Tổng tiền: 897,000đ                             │
│  TT:        Chuyển khoản ✅ Đã xác nhận           │
└──────────────────────────────────────────────────┘

BƯỚC TIẾP THEO:
  [1] 📧 Kiểm tra email để nhận thông tin truy cập
  [2] 🔑 Đăng nhập vào tài khoản học viên
  [3] 🚀 Bắt đầu học ngay hôm nay

[🎯 VÀO HỌC NGAY]   [← Về trang chủ]

──────────────────────────────────────────────────
UPSELL / OTO (One-Time Offer):
  "Đặc biệt dành cho học viên MỚI — chỉ hiển thị 1 lần"
  Sản phẩm bổ sung với giá ưu đãi 50%
  [THÊM VÀO ĐƠN NGAY] [Không, cảm ơn]
──────────────────────────────────────────────────

SHARE CTA:
  "Chia sẻ để nhận thêm ưu đãi"
  [Chia sẻ Facebook] [Copy link] [Zalo]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🔐 PHẦN 10 — TRANG AUTH (LOGIN / REGISTER)

```
AUTH PAGES — LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SPLIT SCREEN LAYOUT:
┌────────────────────┬───────────────────────────┐
│  LEFT (40%)        │  RIGHT (60%)              │
│  Brand side        │  Form side                │
│                    │                           │
│  [Logo lớn]        │  ĐĂNG NHẬP                │
│                    │                           │
│  "Chào mừng        │  [Google] [Facebook]      │
│   trở lại          │  ─── hoặc ───             │
│   Thiện Vua App"   │                           │
│                    │  Email                    │
│  Testimonial ngắn  │  [________________]       │
│  [⭐⭐⭐⭐⭐]       │                           │
│  "Học viên A đã    │  Mật khẩu          [👁]   │
│   tăng doanh thu   │  [________________]       │
│   3x sau 30 ngày"  │                           │
│                    │  ☐ Ghi nhớ đăng nhập      │
│  [Ảnh background]  │  [Quên mật khẩu?]         │
│                    │                           │
│                    │  [ĐĂNG NHẬP]              │
│                    │                           │
│                    │  Chưa có tài khoản?       │
│                    │  [Đăng ký miễn phí]       │
└────────────────────┴───────────────────────────┘

REGISTER PAGE thêm:
  Họ tên | Email | SĐT | Mật khẩu | Xác nhận MK
  Điều khoản checkbox
  CAPTCHA (nếu cần)

VALIDATION realtime:
  ✅ Email hợp lệ
  ✅ Mật khẩu đủ mạnh (8+ ký tự, số, ký tự đặc biệt)
  ❌ Email đã tồn tại → "Đăng nhập hoặc đặt lại MK"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 👤 PHẦN 11 — TRANG HỒ SƠ / PROFILE

```
PROFILE PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT: Sidebar nav trái + Content phải

SIDEBAR PROFILE:
  [Avatar lớn] [Đổi ảnh]
  Họ tên + Email
  ─────────────
  • Thông tin cá nhân
  • Đơn hàng của tôi
  • Khoá học của tôi
  • Lịch sử thanh toán
  • Yêu thích
  • Bảo mật
  • Thông báo
  ─────────────
  [Đăng xuất]

MAIN CONTENT — Thông tin cá nhân:
  [Avatar + Upload]
  Họ tên *
  Email * (verified badge)
  Số điện thoại
  Ngày sinh
  Tỉnh/TP
  Bio ngắn
  [LƯU THAY ĐỔI]

MY COURSES card:
  Progress bar (X/Y bài đã học)
  [Tiếp tục học] button
  Certificate download nếu hoàn thành 100%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📊 PHẦN 12 — DASHBOARD NGƯỜI DÙNG

```
USER DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WELCOME BANNER:
  "Xin chào Thiện! 👋 Tiếp tục học nhé."
  [Khoá học đang học] → [Tiếp tục]

STATS OVERVIEW (4 cards):
  ┌──────────┬──────────┬──────────┬──────────┐
  │ 3 Khoá   │ 68%      │ 2 Cert   │ 4.9 ⭐   │
  │ đã mua   │ Tiến độ  │ Hoàn thành│ Đánh giá │
  └──────────┴──────────┴──────────┴──────────┘

MY COURSES:
  [Ảnh] Khoá học A — 45% ████░░░░ — [Tiếp tục]
  [Ảnh] Khoá học B — 100% ████████ — [Xem lại] [📜 Cert]
  [Ảnh] Khoá học C — 0%  ░░░░░░░░ — [Bắt đầu]

RECENT ORDERS:
  Table: Mã ĐH | Sản phẩm | Ngày | Tổng | Trạng thái | Action
  Filter: Tất cả | Chờ TT | Đã TT | Đã hoàn thành

ACHIEVEMENTS (Gamification):
  🏆 Badges đạt được
  🔥 Streak học liên tiếp X ngày
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## ⚙️ PHẦN 13 — ADMIN PANEL

```
ADMIN DASHBOARD — /admin
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[13.1] DASHBOARD TỔNG QUAN
  TOP ROW — KPIs:
  ┌───────────┬───────────┬───────────┬───────────┐
  │ Revenue   │ Orders    │ Users     │ Conv Rate │
  │ 97.3M đ  │ 1,234     │ 12,456    │ 3.8%      │
  │ ↑18% MoM │ ↑12% MoM  │ ↑9% MoM   │ ↑0.5%     │
  └───────────┴───────────┴───────────┴───────────┘

  CHARTS ROW:
  [Revenue chart 30 ngày] [Orders by status pie]
  [Top products table]    [New users chart]

  RECENT ORDERS TABLE:
  ID | Khách | Sản phẩm | Tổng | TT | Thời gian | Action
  Filter: Hôm nay | 7 ngày | 30 ngày | Custom

[13.2] QUẢN LÝ ĐƠN HÀNG — /admin/don-hang
  Search + Filter: Trạng thái | Phương thức TT | Ngày | Sản phẩm
  Table: ID | Khách | SP | Tổng | TT | Ngày | Hành động
  Detail modal: Thông tin đầy đủ + Update status + Ghi chú

[13.3] QUẢN LÝ SẢN PHẨM — /admin/san-pham
  [+ Thêm sản phẩm]
  Table: Ảnh | Tên | Danh mục | Giá | Kho | Trạng thái | Action
  FORM Thêm/Sửa sản phẩm:
    Tên sản phẩm | Slug | Mô tả (rich text editor)
    Ảnh chính + Gallery (drag & drop upload)
    Video preview URL
    Giá gốc | Giá bán | % giảm | Thời gian khuyến mãi
    Danh mục | Tags
    SEO: Meta title | Meta description | OG image
    Trạng thái: Draft | Published | Archived

[13.4] QUẢN LÝ KHÁCH HÀNG — /admin/khach-hang
  Search theo tên/email/SĐT
  Table: Avatar | Tên | Email | Đơn hàng | Tổng chi | Ngày đăng ký | Status
  Detail: Lịch sử đơn hàng + Ghi chú admin

[13.5] QUẢN LÝ THANH TOÁN — /admin/thanh-toan
  Dashboard: Doanh thu theo ngày/tuần/tháng/năm
  Biểu đồ revenue stacked (sản phẩm theo màu)
  Transactions table: ID | Khách | Amount | Method | Status | Thời gian
  Export CSV/Excel
  SePay webhook logs

[13.6] MÃ GIẢM GIÁ — /admin/ma-giam-gia
  [+ Tạo mã mới]
  Form: Mã code | Loại (% / cố định) | Giá trị | Hạn dùng | Số lần dùng
  Table: Mã | Loại | Giá trị | Đã dùng/Giới hạn | Hết hạn | Status

[13.7] EMAIL MARKETING — /admin/tiep-thi
  Danh sách email subscribers
  Template builder (kéo thả)
  Lên lịch gửi | A/B test
  Stats: Sent | Open rate | Click rate | Unsubscribe

[13.8] ANALYTICS — /admin/phan-tich
  Traffic: Pageviews | Sessions | Bounce rate | Time on site
  Conversion funnel: Visit → Cart → Checkout → Purchase
  UTM tracking
  Top pages | Traffic sources

[13.9] CÀI ĐẶT — /admin/cai-dat
  Thông tin công ty
  Payment settings (SePay / VNPay keys)
  Email settings (SMTP)
  Notification settings
  Backup & Security
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📝 PHẦN 14 — TRANG BLOG / NỘI DUNG

```
BLOG PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BLOG LIST /blog:
  Header: Eyebrow + Title + Search bar
  Featured post: Full width, ảnh lớn + excerpt
  Grid bài viết: 3 cột (desktop) / 2 cột (tablet) / 1 cột (mobile)
  Mỗi card: Ảnh thumbnail | Category tag | Title | Excerpt | Author + Date | Read time
  Pagination hoặc Load more

SIDEBAR (optional):
  Search | Categories | Popular posts | Tags | Newsletter CTA

BLOG DETAIL /blog/[slug]:
  Breadcrumb
  Category tag | Title H1 | Author + Date + Read time
  [Ảnh cover full-width]
  Table of contents (sticky, auto-generated từ H2/H3)
  Body content (rich, đẹp typography)
  Code blocks với syntax highlight
  Inline CTAs
  Author bio card
  Social share: [FB] [TT] [LinkedIn] [Copy]
  Related articles
  Comments (optional: Disqus hoặc custom)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🏢 PHẦN 15 — TRANG VỀ CHÚNG TÔI

```
ABOUT PAGE /ve-chung-toi
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[1] HERO: Ảnh team / founder + Tagline lớn

[2] MISSION: "Chúng tôi tin rằng..." — 1 đoạn ngắn mạnh

[3] STORY: Timeline công ty từ khi thành lập
  2022 | 2023 | 2024 | 2025 — Milestones

[4] NUMBERS: Stats đáng tự hào
  [12,000+] Học viên | [98%] Hài lòng | [50+] Khoá học | [3] Năm KN

[5] TEAM: Grid ảnh + tên + chức danh + bio ngắn + Social links

[6] VALUES: 3-4 core values với icon + mô tả

[7] MEDIA / AS SEEN IN: Logo báo chí, kênh media

[8] CTA: "Tham gia cùng chúng tôi" → [Xem khoá học]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📞 PHẦN 16 — TRANG LIÊN HỆ / HỖ TRỢ

```
CONTACT PAGE /lien-he
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT 2 CỘT:
┌────────────────────────┬───────────────────────┐
│  LEFT — THÔNG TIN      │  RIGHT — FORM          │
│                        │                        │
│  📧 email@domain.com   │  Họ và tên *           │
│  📱 0901 234 567       │  [________________]    │
│  📍 TP.HCM, VN         │  Email *               │
│  ⏰ T2-T7: 8h-22h      │  [________________]    │
│                        │  Chủ đề                │
│  MẠNG XÃ HỘI:         │  [▼ Chọn chủ đề]       │
│  [FB] [TT] [YT] [Zalo] │  Tin nhắn *            │
│                        │  [                ]    │
│  LIVE CHAT:            │  [              ]      │
│  [Chat ngay]           │  [GỬI TIN NHẮN]        │
└────────────────────────┴───────────────────────┘

FAQ ACCORDION (bên dưới):
  8-10 câu hỏi thường gặp
  Category tabs: Thanh toán | Khoá học | Tài khoản | Kỹ thuật
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🚫 PHẦN 17 — TRANG LỖI

```
404 PAGE:
  Illustration đẹp / animation
  "Trang này không tồn tại"
  Subtext: "Có thể đường dẫn đã thay đổi hoặc trang bị xóa"
  [← Về trang chủ] [Tìm kiếm]
  Gợi ý: "Bạn có thể muốn xem..."

500 PAGE:
  "Lỗi hệ thống tạm thời"
  "Đội ngũ đang xử lý, vui lòng thử lại sau"
  [Thử lại] [Liên hệ hỗ trợ]

MAINTENANCE PAGE:
  Logo + "Đang bảo trì hệ thống"
  Thời gian dự kiến: [Countdown]
  Form để nhận thông báo khi hệ thống hoạt động lại
```

---

## 🧩 PHẦN 18 — COMPONENT LIBRARY (UI KIT)

### 18.1 — Buttons

```css
/* BUTTON VARIANTS */
.btn-primary {
  background: var(--color-primary-500);
  color: white;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font: 600 var(--text-base) var(--font-body);
  transition: all var(--duration-base) var(--ease-out);
  box-shadow: var(--shadow-brand);
}
.btn-primary:hover {
  background: var(--color-primary-600);
  transform: translateY(-1px);
  box-shadow: 0 12px 40px rgba(239,68,68,0.4);
}

.btn-secondary { /* Border style */ }
.btn-ghost     { /* Text only    */ }
.btn-danger    { /* Destructive  */ }

/* SIZES */
.btn-xs  { padding: 6px 12px;  font-size: var(--text-xs); }
.btn-sm  { padding: 8px 16px;  font-size: var(--text-sm); }
.btn-md  { padding: 12px 24px; font-size: var(--text-base); }
.btn-lg  { padding: 16px 32px; font-size: var(--text-lg); }
.btn-xl  { padding: 20px 40px; font-size: var(--text-xl); }

/* STATES */
.btn[disabled]  { opacity: 0.5; cursor: not-allowed; }
.btn.loading    { pointer-events: none; /* spinner inside */ }
.btn-full-width { width: 100%; }
```

### 18.2 — Cards

```
CARD TYPES:
  Product Card:  Ảnh | Badge sale | Title | Price | Rating | [Mua ngay]
  Course Card:   Ảnh | Progress | Title | Instructor | [Tiếp tục]
  Blog Card:     Ảnh | Category | Title | Excerpt | Date
  Stats Card:    Icon | Number lớn | Label | Trend arrow
  Testimonial:   Avatar | Stars | Quote | Name | Title
  Pricing Card:  Plan name | Price | Features list | CTA
  Feature Card:  Icon lớn | Title | Description
  Notification:  Icon | Message | Time | [Dismiss]
```

### 18.3 — Form Elements

```
INPUT STATES:
  Default:   Border gray, placeholder text
  Focus:     Border brand color + ring shadow
  Filled:    Dark text
  Error:     Border red + error message below
  Success:   Border green + checkmark icon
  Disabled:  Background gray, cursor not-allowed

FORM COMPONENTS:
  Text input     | Textarea | Select dropdown
  Radio group    | Checkbox | Toggle switch
  File upload    | Date picker | Color picker
  Search input   | Phone input (với flag)
  Password input (với show/hide toggle)
  OTP input      | Rich text editor
  Tag input      | Autocomplete
```

### 18.4 — Feedback & Overlay

```
TOAST NOTIFICATIONS (top-right, auto-dismiss 4s):
  ✅ Success:  Green left border
  ❌ Error:    Red left border
  ⚠️ Warning: Yellow left border
  ℹ️ Info:     Blue left border

MODAL:
  Backdrop blur + dark overlay
  Centered card: max-w 560px
  Header + Body + Footer (actions)
  Close button + ESC key
  Animation: scale-in + fade

DRAWER:
  Slide từ right (default) hoặc bottom (mobile)
  Overlay backdrop
  Close button + swipe down (mobile)

TOOLTIP: Hover triggered, arrow pointer
POPOVER: Click triggered, richer content
SKELETON: Loading state cho cards và content
EMPTY STATE: Icon + Title + Description + Action
```

### 18.5 — Data Display

```
TABLE:
  Header: sticky, sortable columns
  Row: hover highlight, click to select
  Pagination: [← Prev] [1][2][3]...[10] [Next →]
  Row per page selector
  Search + Filter bar above
  Bulk actions khi select nhiều rows
  Export button

BADGE / PILL:
  Status: Đang xử lý (yellow) | Hoàn thành (green) | Huỷ (red)
  Role: Admin (purple) | User (blue) | Guest (gray)
  Count: notification badge
  New: gradient badge

PROGRESS BAR:
  Horizontal linear
  Circular (for profile completion, course progress)
  Animated fill on mount

TIMELINE:
  Vertical (order history, activity log)
  Horizontal (How it works, roadmap)

AVATAR:
  Sizes: xs(24) sm(32) md(40) lg(48) xl(64) 2xl(80)
  Fallback: initials với background color từ tên
  Group: overlapping avatars

DATA CHARTS (recharts / chart.js):
  Line chart: revenue trends
  Bar chart: comparisons
  Pie/Donut: distributions
  Area chart: cumulative data
  Heatmap: activity calendar
```

---

## 🎬 PHẦN 19 — HÌNH ẢNH & VIDEO MINH HOẠ

### 19.1 — Media Strategy

```
HERO SECTION:
  Option A: Video background loop (muted, autoplay)
            → Chất lượng: 1080p, ≤ 5MB, WebM format
            → Fallback: Ảnh poster khi video chưa load
  Option B: Ảnh hero chất lượng cao
            → Format: WebP, ≤ 200KB
            → Responsive: 3 kích thước (mobile/tablet/desktop)
  Option C: Lottie animation hoặc SVG animation
  Option D: Interactive 3D element (Three.js)

PRODUCT/COURSE IMAGES:
  Thumbnail: 400x300px hoặc 16:9 ratio
  Detail: 800x600px + gallery 4-8 ảnh
  Format: WebP với JPEG fallback
  Style nhất quán: cùng màu filter, cùng style

TEAM/PEOPLE PHOTOS:
  Professional headshots
  Consistent background (white hoặc brand color)
  Square: 400x400px minimum

ILLUSTRATIONS:
  Style: Flat design hoặc 3D isometric — chọn 1
  Source: unDraw.co, Storyset, Humaaans (free)
  Custom: Figma với brand colors

ICONS:
  Library: Lucide React, Phosphor Icons, Heroicons
  Không trộn nhiều style icon
  Size nhất quán: 16/20/24/32px

VIDEO CONTENT:
  Hero VSL: 720p minimum, MP4
  Course preview: 1080p, YouTube/Vimeo embed
  Testimonial videos: 720p, tỉ lệ 16:9 hoặc 9:16 (vertical)
  Screen recordings: Loom hoặc screen capture tool
```

### 19.2 — Optimization Rules

```
□ Mọi ảnh phải dùng next/image (lazy load + optimized)
□ WebP format với JPEG/PNG fallback
□ srcset cho responsive images
□ width + height attribute để tránh CLS
□ Alt text mọi ảnh (SEO + accessibility)
□ Video: poster attribute (ảnh preview)
□ Video: preload="metadata" không phải "auto"
□ Ảnh hero: priority={true} để load sớm
□ Ảnh fold dưới: lazy load
□ Max ảnh không nén: 200KB, max ảnh nén: 80KB
```

---

## 🔍 PHẦN 20 — SEO & PERFORMANCE

### 20.1 — SEO Technical

```tsx
// ── app/layout.tsx — Metadata mặc định ──
export const metadata: Metadata = {
  title: {
    default: '[Tên Website] | [Tagline ngắn]',
    template: '%s | [Tên Website]'
  },
  description: '[Mô tả 150-160 ký tự, có keyword chính]',
  keywords: ['keyword1', 'keyword2', ...],
  authors: [{ name: 'Thiện Vua App' }],
  creator: 'Thiện Vua App',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://yourdomain.com',
    siteName: '[Tên Website]',
    title: '[OG Title]',
    description: '[OG Description]',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }]
  },
  twitter: {
    card: 'summary_large_image',
    title: '[Twitter Title]',
    description: '[Twitter Description]',
    images: ['/og-image.jpg']
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true }
  },
  alternates: { canonical: 'https://yourdomain.com' }
}

// ── Per-page metadata ──
// app/san-pham/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.slug)
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: { images: [product.thumbnail] }
  }
}
```

### 20.2 — Structured Data (Schema.org)

```tsx
// Product Schema
const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.images,
  brand: { '@type': 'Brand', name: 'Thiện Vua App' },
  offers: {
    '@type': 'Offer',
    price: product.price,
    priceCurrency: 'VND',
    availability: 'https://schema.org/InStock',
    seller: { '@type': 'Organization', name: 'Thiện Vua App' }
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: product.rating,
    reviewCount: product.reviewCount
  }
}

// FAQ Schema
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer }
  }))
}

// Course Schema
const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: course.name,
  description: course.description,
  provider: { '@type': 'Organization', name: 'Thiện Vua App' },
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
    instructor: { '@type': 'Person', name: course.instructor }
  }
}
```

### 20.3 — Performance Checklist

```
CORE WEB VITALS TARGETS:
  LCP (Largest Contentful Paint): < 2.5s
  FID (First Input Delay):        < 100ms
  CLS (Cumulative Layout Shift):  < 0.1
  TTFB (Time to First Byte):      < 800ms
  FCP (First Contentful Paint):   < 1.8s

OPTIMIZATIONS:
  □ Font preload + font-display: swap
  □ Critical CSS inline (above-fold)
  □ Image lazy loading + WebP
  □ Code splitting per route
  □ Dynamic import heavy components
  □ Supabase queries optimized (select only needed fields)
  □ API responses paginated + cached
  □ Static pages (ISR) cho landing/blog
  □ CDN cho static assets (Vercel Edge)
  □ Brotli compression enabled
  □ Preconnect các domain external
```

---

## 🎨 PHẦN 21 — TUỲ BIẾN THEO TỪNG SẢN PHẨM

### 21.1 — Color Palette theo Loại Sản Phẩm

```
LOẠI 1 — KHOÁ HỌC AI / TECH (Thiện Vua App default)
  Primary:    #7C3AED (Violet — trí tuệ, công nghệ)
  Secondary:  #2563EB (Blue — tin cậy, chuyên nghiệp)
  Accent:     #06B6D4 (Cyan — sáng tạo, AI)
  Background: Dark #0F0F13 với grain texture
  Style:      Sci-fi premium, glassmorphism cards

LOẠI 2 — SẢN PHẨM TÀI CHÍNH / ĐẦU TƯ
  Primary:    #059669 (Emerald — tiền bạc, tăng trưởng)
  Secondary:  #0F172A (Navy — uy tín, an toàn)
  Accent:     #F59E0B (Gold — giàu có, premium)
  Background: Light cream #FAFAF8
  Style:      Professional, clean, trust-focused

LOẠI 3 — KHOÁ HỌC SỨC KHOẺ / WELLNESS
  Primary:    #10B981 (Green — sức khoẻ, tự nhiên)
  Secondary:  #6366F1 (Indigo — bình yên, meditation)
  Accent:     #F472B6 (Pink — warmth, care)
  Background: Light #F0FDF4
  Style:      Warm, approachable, organic

LOẠI 4 — MARKETING / CONTENT / CREATOR
  Primary:    #EF4444 (Red — năng lượng, hành động)
  Secondary:  #F97316 (Orange — sáng tạo, nhiệt huyết)
  Accent:     #FBBF24 (Yellow — vui vẻ, khác biệt)
  Background: White với colorful accents
  Style:      Bold, energetic, social-media-native

LOẠI 5 — LUXURY / PREMIUM / HIGH-END
  Primary:    #B45309 (Gold — luxury)
  Secondary:  #1C1917 (Near black — premium)
  Accent:     #D4AF37 (Pure gold — exclusive)
  Background: Black #0A0A0A
  Style:      Minimal luxury, editorial, Dior-level

LOẠI 6 — EDUCATION KIDS / FAMILY
  Primary:    #3B82F6 (Blue — học tập, tin cậy)
  Secondary:  #8B5CF6 (Purple — sáng tạo)
  Accent:     #F59E0B (Yellow — vui vẻ)
  Background: White sáng
  Style:      Friendly, rounded, approachable

LOẠI 7 — SAAS / TOOLS / PRODUCTIVITY
  Primary:    #4F46E5 (Indigo — logic, productivity)
  Secondary:  #0EA5E9 (Sky — clarity, cloud)
  Accent:     #10B981 (Green — success state)
  Background: White / Light gray
  Style:      Clean, functional, dashboard-heavy
```

### 21.2 — Layout Variations

```
LAYOUT A — FULL-WIDTH HERO (Phù hợp: Course, SaaS)
  Hero full viewport, center text, dark/gradient BG
  Content sections full-width với padding bên
  Emphasis vào visual impact

LAYOUT B — SPLIT HERO (Phù hợp: Product, App)
  Hero 50/50: Text trái, Visual phải
  Clean, balanced, professional

LAYOUT C — MINIMAL EDITORIAL (Phù hợp: Luxury, Agency)
  Large typography dominant
  Sparse layout với lots of white space
  Photography-forward

LAYOUT D — GRID-HEAVY DASHBOARD (Phù hợp: SaaS, Tools)
  Card-based layout
  Data visualization prominent
  Sidebar navigation
```

### 21.3 — Checklist Tuỳ Biến khi nhận dự án mới

```
Trước khi bắt đầu code, xác định:

□ Loại sản phẩm: [khoá học / SaaS / ecommerce / agency / ...]
□ Target audience: [tuổi, nghề nghiệp, pain point chính]
□ Tone thương hiệu: [trẻ trung / chuyên nghiệp / luxury / vui vẻ]
□ Color palette: [chọn từ 21.1 hoặc custom từ brief]
□ Font pairing:
    Display: [Clash Display / Syne / Cabinet Grotesk / ...]
    Body:    [DM Sans / Plus Jakarta / General Sans / ...]
□ Hero type: [Video / Image / 3D / Animation / Split]
□ Dark/Light mode: [Dark / Light / Both with toggle]
□ Key pages cần thiết: [list từ Phần 2]
□ Payment methods: [SePay / VNPay / Momo / Card / All]
□ Language: [Vietnamese only / Bilingual VI+EN]
□ Features đặc biệt: [Membership / Course / Subscription / One-time]
```

---

## ✅ PHẦN 22 — CHECKLIST TRƯỚC KHI LAUNCH

```
PRE-LAUNCH CHECKLIST — [Tên Website]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CONTENT & UX
  □ Tất cả text đã review — không có lỗi chính tả
  □ Tất cả hình ảnh đã upload đúng — không broken image
  □ Tất cả links hoạt động — không có 404
  □ Form contact/đăng ký gửi được — test email nhận
  □ Tất cả video play được — đúng thumbnail
  □ Mobile responsive — test trên 375/414/768/1024/1440px
  □ Cross-browser: Chrome, Safari, Firefox, Edge

CHECKOUT & PAYMENT
  □ Thêm vào giỏ hàng hoạt động
  □ Coupon code áp dụng đúng
  □ SePay / VNPay integration test với amount thật
  □ Webhook nhận đúng — order auto-confirm
  □ Email xác nhận đơn hàng gửi đến buyer
  □ Email notification đến admin
  □ Thank you page hiển thị đúng order details
  □ Test failed payment flow

USER ACCOUNT
  □ Đăng ký hoạt động — email xác nhận gửi
  □ Đăng nhập hoạt động
  □ Quên mật khẩu hoạt động
  □ Profile edit lưu đúng
  □ Order history hiển thị đúng
  □ Course/product access đúng sau mua

ADMIN
  □ Đăng nhập admin hoạt động
  □ Xem đơn hàng đúng
  □ Update order status hoạt động
  □ Tạo/sửa sản phẩm hoạt động
  □ Xem analytics hiển thị dữ liệu

SEO & ANALYTICS
  □ Meta title + description đúng tất cả trang
  □ OG image hiển thị đúng (test với fb.me/tools)
  □ Google Analytics / GA4 tracking
  □ Google Search Console verified
  □ Sitemap.xml generated + submitted
  □ robots.txt đúng
  □ Canonical URLs đúng

SECURITY & PERFORMANCE
  □ SSL certificate active (HTTPS green)
  □ Lighthouse score ≥ 85 (Performance, SEO, Accessibility)
  □ Không có console errors
  □ .env variables set đúng trên production
  □ Rate limiting active
  □ Spam protection cho forms

LEGAL
  □ Trang Điều khoản sử dụng
  □ Trang Chính sách bảo mật
  □ Trang Chính sách hoàn tiền
  □ Cookie consent (nếu cần)
  □ Thông tin công ty đầy đủ ở footer

BACKUP & MONITORING
  □ Database backup schedule
  □ Error monitoring (Sentry)
  □ Uptime monitoring
  □ Deploy thành công, không rollback cần thiết
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ PASS 100% → LAUNCH
❌ CÒN Ô TRỐNG → FIX TRƯỚC
```

---

## ⚡ PHẦN BONUS — KHI NHẬN YÊU CẦU BUILD WEBSITE

### Quy trình 5 bước bắt buộc

```
BƯỚC 1 — BRIEF (Trước khi code bất cứ thứ gì)
  Hỏi / xác nhận:
  • Tên sản phẩm và mô tả ngắn
  • Target audience (ai mua, bao nhiêu tuổi, ở đâu)
  • Mục tiêu chính của website (bán hàng / thu lead / SaaS)
  • Màu sắc brand (nếu có sẵn) hoặc cảm xúc muốn truyền tải
  • Stack kỹ thuật: Next.js 15 + Supabase + SePay (default Thiện Vua App)
  • Các trang cần thiết (dùng Phần 2 làm checklist)
  • Deadline

BƯỚC 2 — DESIGN SYSTEM
  Áp dụng token từ Phần 1
  Chọn color palette từ Phần 21 tuỳ theo sản phẩm
  Chọn font pairing phù hợp

BƯỚC 3 — WIREFRAME (ASCII hoặc Figma sơ bộ)
  Sketch nhanh layout các trang chính
  Confirm với anh Thiện trước khi code

BƯỚC 4 — BUILD (Theo thứ tự ưu tiên)
  1. Design tokens + Global CSS
  2. Layout: Header + Footer
  3. Landing Page (trang quan trọng nhất)
  4. Auth pages
  5. Checkout flow (giỏ hàng → thanh toán → cảm ơn)
  6. User dashboard
  7. Admin panel
  8. Các trang còn lại

BƯỚC 5 — LAUNCH
  Chạy qua Phần 22 Pre-launch checklist
  Deploy → Test trên production → Go live
```

---

```
╔══════════════════════════════════════════════════════════════════════════╗
║  THIỆN VUA APP — WEB BLUEPRINT v1.0 FINAL                               ║
║  22 Phần | Đầy đủ từ Design Token → Launch Checklist                   ║
║  Tuỳ biến theo 7 loại sản phẩm | Tối ưu chuyển đổi                     ║
║                                                                          ║
║  "Đẹp nhất. Chuyển đổi cao nhất. Launch nhanh nhất."                   ║
║  Mục tiêu: $100M Ecosystem — mọi trang web phải xứng tầm đó.           ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

## 🎭 PHẦN 23 — ANIMATION & MICRO-INTERACTION SYSTEM

> **Nguyên tắc**: Animation phải có MỤC ĐÍCH — hướng dẫn người dùng, phản hồi hành động, tạo cảm xúc. Không animate vô nghĩa.

### 23.1 — Animation Principles

```
QUY TẮC VÀNG:
  → Animate PROPERTY, không animate layout (tránh CLS)
  → Chỉ dùng: opacity, transform (translate/scale/rotate)
  → KHÔNG animate: width, height, top, left, margin, padding
  → Tôn trọng prefers-reduced-motion (accessibility)
  → Mobile: giảm hoặc tắt animation nặng

TIMING HIERARCHY:
  Instant   : 0ms      → Checkbox tick, toggle on/off
  Micro     : 150ms    → Button hover, icon swap
  Fast      : 250ms    → Dropdown open, tooltip show
  Normal    : 350ms    → Modal open, menu slide
  Slow      : 500ms    → Page transition, hero reveal
  Cinematic : 800ms+   → Intro animation, loading screen
```

### 23.2 — Scroll Animations (Intersection Observer)

```tsx
// Hook dùng lại cho mọi component
const useScrollReveal = (options = {}) => {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.unobserve(entry.target) // chỉ animate 1 lần
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px', ...options })

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}

// Usage trong component
const FeatureCard = ({ title, description, icon }) => {
  const { ref, isVisible } = useScrollReveal()

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease'
      }}
    >
      {icon}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

// Stagger children (dùng cho grid cards)
const FeatureGrid = ({ features }) => {
  const { ref, isVisible } = useScrollReveal()

  return (
    <div ref={ref} className="grid grid-cols-3 gap-6">
      {features.map((feature, i) => (
        <div
          key={i}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: `opacity 0.5s ease ${i * 0.1}s,
                         transform 0.5s ease ${i * 0.1}s`
          }}
        >
          <FeatureCard {...feature} />
        </div>
      ))}
    </div>
  )
}
```

### 23.3 — Micro-interactions Library

```css
/* ── BUTTON INTERACTIONS ── */
.btn-primary {
  position: relative;
  overflow: hidden;
  transition: transform 150ms ease, box-shadow 150ms ease;
}
/* Ripple effect */
.btn-primary::after {
  content: '';
  position: absolute;
  inset: 0;
  background: white;
  opacity: 0;
  border-radius: inherit;
  transition: opacity 300ms ease;
}
.btn-primary:hover::after  { opacity: 0.1; }
.btn-primary:active        { transform: scale(0.97); }
.btn-primary:active::after { opacity: 0.2; }

/* ── CARD HOVER ── */
.product-card {
  transition: transform 250ms ease, box-shadow 250ms ease;
  cursor: pointer;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}
.product-card:hover .card-image {
  transform: scale(1.03);
  transition: transform 400ms ease;
}

/* ── LINK UNDERLINE ANIMATE ── */
.nav-link {
  position: relative;
  text-decoration: none;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-primary-500);
  transition: width 250ms var(--ease-out);
}
.nav-link:hover::after { width: 100%; }

/* ── INPUT FOCUS RING ── */
.input-field {
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.input-field:focus {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
  outline: none;
}

/* ── CHECKBOX ANIMATE ── */
.checkbox-custom {
  transition: background 150ms ease, border-color 150ms ease;
}
.checkbox-custom:checked {
  animation: checkPop 200ms var(--ease-spring) forwards;
}
@keyframes checkPop {
  0%   { transform: scale(0.8); }
  60%  { transform: scale(1.15); }
  100% { transform: scale(1); }
}

/* ── NUMBER COUNT UP ── */
/* Dùng JS Intersection Observer + setTimeout */

/* ── SKELETON LOADING ── */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-gray-100) 25%,
    var(--color-gray-200) 50%,
    var(--color-gray-100) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-wave 1.5s ease infinite;
  border-radius: var(--radius-md);
}
@keyframes skeleton-wave {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── TOAST SLIDE IN ── */
@keyframes toast-in {
  from { transform: translateX(calc(100% + 24px)); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}
@keyframes toast-out {
  from { transform: translateX(0); opacity: 1; }
  to   { transform: translateX(calc(100% + 24px)); opacity: 0; }
}
.toast { animation: toast-in 300ms var(--ease-spring); }
.toast.dismissing { animation: toast-out 200ms ease forwards; }

/* ── MODAL ── */
@keyframes modal-backdrop-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes modal-scale-in {
  from { transform: scale(0.95) translateY(8px); opacity: 0; }
  to   { transform: scale(1) translateY(0); opacity: 1; }
}
.modal-backdrop { animation: modal-backdrop-in 200ms ease; }
.modal-content  { animation: modal-scale-in 250ms var(--ease-spring); }

/* ── COUNTER BADGE ── */
@keyframes badge-pop {
  0%   { transform: scale(0); }
  70%  { transform: scale(1.3); }
  100% { transform: scale(1); }
}
.badge-count { animation: badge-pop 300ms var(--ease-spring); }

/* ── PAGE TRANSITION ── */
@keyframes page-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.page-wrapper { animation: page-in 400ms var(--ease-out); }

/* ── HERO TEXT REVEAL ── */
@keyframes text-reveal {
  from { opacity: 0; transform: translateY(20px) skewY(2deg); }
  to   { opacity: 1; transform: translateY(0) skewY(0); }
}
.hero-title span {
  display: inline-block;
  animation: text-reveal 0.6s var(--ease-out) both;
}
.hero-title span:nth-child(1) { animation-delay: 0ms; }
.hero-title span:nth-child(2) { animation-delay: 100ms; }
.hero-title span:nth-child(3) { animation-delay: 200ms; }

/* ── REDUCED MOTION OVERRIDE ── */
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 23.4 — Countdown Timer Component

```tsx
// Dùng cho Sales page, Checkout, Flash sale
const CountdownTimer = ({ targetDate, onExpire }: {
  targetDate: Date
  onExpire?: () => void
}) => {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 })
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now()
      if (diff <= 0) {
        setExpired(true)
        onExpire?.()
        return
      }
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000)
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  if (expired) return <span className="text-red-500">Ưu đãi đã kết thúc</span>

  const Unit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="
        min-w-[56px] h-[56px]
        bg-gray-900 text-white
        rounded-lg flex items-center justify-center
        text-2xl font-bold font-mono
        tabular-nums
      ">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
        {label}
      </span>
    </div>
  )

  return (
    <div className="flex items-end gap-2">
      {time.d > 0 && <><Unit value={time.d} label="ngày" /><Colon /></>}
      <Unit value={time.h} label="giờ" />
      <Colon />
      <Unit value={time.m} label="phút" />
      <Colon />
      <Unit value={time.s} label="giây" />
    </div>
  )
}

const Colon = () => (
  <span className="text-2xl font-bold text-gray-400 mb-6 select-none">:</span>
)
```

---

## ♿ PHẦN 24 — ACCESSIBILITY (A11Y) — KHÔNG TUỲ CHỌN

> **Accessibility không phải optional — nó là standard. Bỏ qua = mất 20% user, vi phạm WCAG.**

### 24.1 — Colour Contrast Rules

```
WCAG AA MINIMUM (bắt buộc):
  Text thường trên nền:     contrast ratio ≥ 4.5:1
  Text lớn (18px+/bold):   contrast ratio ≥ 3:1
  UI components & icons:    contrast ratio ≥ 3:1

KIỂM TRA NHANH:
  Tool: contrast.tools hoặc WebAIM Contrast Checker
  Chrome DevTools: Inspect element → Colour picker → contrast ratio

VÍ DỤ PASS/FAIL:
  ✅ White (#fff) trên Primary-600 (#dc2626) → 5.1:1 PASS
  ✅ Gray-900 (#111827) trên White (#fff)    → 16.5:1 PASS
  ❌ Gray-400 (#9ca3af) trên White (#fff)    → 2.9:1 FAIL
  ❌ Primary-300 trên White                   → Thường FAIL
```

### 24.2 — Keyboard Navigation

```tsx
// TẤT CẢ interactive elements phải accessible bằng keyboard

// ✅ Focus visible — KHÔNG xóa outline mà không thay thế
*:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
  border-radius: 2px;
}
/* Ẩn outline cho mouse, giữ cho keyboard */
*:focus:not(:focus-visible) { outline: none; }

// ✅ Skip navigation link (đầu tiên trong body)
<a
  href="#main-content"
  className="
    sr-only focus:not-sr-only
    focus:fixed focus:top-4 focus:left-4
    focus:z-[9999] focus:px-4 focus:py-2
    focus:bg-primary-500 focus:text-white
    focus:rounded-md focus:font-medium
  "
>
  Bỏ qua điều hướng
</a>

// ✅ Modal — focus trap
const FocusTrap = ({ children, active }) => {
  const ref = useRef(null)
  useEffect(() => {
    if (!active) return
    const focusable = ref.current?.querySelectorAll(
      'a,button,[tabindex]:not([tabindex="-1"]),input,select,textarea'
    )
    const first = focusable?.[0]
    const last = focusable?.[focusable.length - 1]
    first?.focus()
    const handleTab = (e) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }
    document.addEventListener('keydown', handleTab)
    return () => document.removeEventListener('keydown', handleTab)
  }, [active])
  return <div ref={ref}>{children}</div>
}
```

### 24.3 — ARIA Labels & Semantic HTML

```tsx
// ✅ Semantic HTML đúng vai trò
<header role="banner">          // Header trang
<nav aria-label="Điều hướng chính">
<main id="main-content">        // Nội dung chính
<aside aria-label="Sidebar">
<footer role="contentinfo">

// ✅ Buttons vs Links
// Button: actions (submit, toggle, delete)
// Link: navigation (đến URL khác)
<button onClick={handleDelete} aria-label="Xóa đơn hàng #123">
  <TrashIcon aria-hidden="true" />
</button>
<a href="/san-pham/abc">Xem sản phẩm</a>

// ✅ Images
<img src="..." alt="Khoá học AI Marketing cho người mới bắt đầu" />
<img src="decorative-bg.webp" alt="" role="presentation" /> // Ảnh trang trí

// ✅ Form labels
<label htmlFor="email">Email của bạn *</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-describedby="email-error"
  aria-invalid={!!errors.email}
/>
{errors.email && (
  <span id="email-error" role="alert" className="text-red-500 text-sm">
    {errors.email.message}
  </span>
)}

// ✅ Icon-only buttons
<button aria-label="Đóng modal">
  <XIcon aria-hidden="true" size={20} />
</button>

// ✅ Loading states
<button aria-busy={isLoading} disabled={isLoading}>
  {isLoading ? 'Đang xử lý...' : 'Thanh toán'}
</button>

// ✅ Live regions (toast, form errors)
<div aria-live="polite" aria-atomic="true">
  {toastMessage}
</div>

// ✅ Navigation current page
<nav>
  <a href="/" aria-current={pathname === '/' ? 'page' : undefined}>
    Trang chủ
  </a>
</nav>

// ✅ Accordion / Disclosure
<button
  aria-expanded={isOpen}
  aria-controls="faq-1-content"
  id="faq-1-trigger"
>
  Câu hỏi 1
</button>
<div
  id="faq-1-content"
  role="region"
  aria-labelledby="faq-1-trigger"
  hidden={!isOpen}
>
  Nội dung câu trả lời...
</div>
```

---

## 📱 PHẦN 25 — MOBILE-FIRST DESIGN SYSTEM

### 25.1 — Breakpoints & Responsive Rules

```css
/* BREAKPOINTS */
/* xs:  < 480px  — Điện thoại nhỏ    */
/* sm:  ≥ 480px  — Điện thoại lớn    */
/* md:  ≥ 768px  — Tablet            */
/* lg:  ≥ 1024px — Laptop            */
/* xl:  ≥ 1280px — Desktop           */
/* 2xl: ≥ 1536px — Wide screen       */

/* TYPOGRAPHY MOBILE vs DESKTOP */
.hero-title {
  font-size: clamp(2rem, 5vw + 1rem, 4.5rem);
  /* 32px mobile → 72px desktop, fluid scaling */
}
.section-title {
  font-size: clamp(1.5rem, 3vw + 0.5rem, 2.25rem);
}

/* CONTAINER */
.container {
  width: 100%;
  max-width: var(--container-xl);
  margin-inline: auto;
  padding-inline: clamp(16px, 4vw, 64px);
  /* 16px mobile → 64px desktop */
}

/* GRID RESPONSIVE */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(16px, 2vw, 32px);
}

/* SPACING RESPONSIVE */
.section {
  padding-block: clamp(48px, 8vw, 96px);
  /* 48px mobile → 96px desktop */
}
```

### 25.2 — Mobile-specific Components

```
MOBILE NAVIGATION:
  ─────────────────────────────────────────
  Header: Logo (center) + Hamburger + Cart icon
  Drawer từ left: Full height, 80% width
  Nền tối overlay khi drawer mở
  Close bằng: X button, overlay tap, swipe left
  Bottom nav (optional cho app-like): 5 icons max

TOUCH TARGETS:
  Minimum: 44x44px (Apple) / 48x48px (Google)
  CTA buttons: height ≥ 52px trên mobile
  Menu items: height ≥ 48px
  Spacing giữa targets: ≥ 8px

GESTURES:
  Swipe: Carousel, Image gallery, Drawer
  Pull to refresh: Feed, Order list
  Long press: Context menu (nếu cần)
  Pinch to zoom: Product images

FORMS MOBILE:
  input type="tel"      → số điện thoại (hiện bàn phím số)
  input type="email"    → email (hiện @ và .com)
  input type="number"   → số (hiện bàn phím số)
  inputmode="numeric"   → chỉ số, không có dấu -
  autocomplete="on"     → trình duyệt tự fill
  Stacked layout (không dùng inline label trên mobile)
  Full-width inputs
  Font-size ≥ 16px (tránh iOS auto-zoom)

STICKY BOTTOM CTA (Mobile killer feature):
  Position: fixed bottom-0
  Height: 72px + safe-area-inset-bottom
  Background: white/dark với shadow-up
  Content: Price + [MUA NGAY] button
  Hiện khi: scroll qua hero CTA
  Ẩn khi: ở checkout page
```

### 25.3 — Mobile Checkout UX

```
MOBILE CHECKOUT — ĐẶC BIỆT QUAN TRỌNG:

  Step progress bar: top, compact (dots hoặc thin line)
  Form fields: Stacked, full-width
  Keyboard: Auto-advance giữa các field (Next button)
  Payment QR: Large, centered, easy to scan
  Order summary: Collapsed by default, tap to expand
  CTA button: Fixed bottom, above keyboard
  Success: Fullscreen confetti animation
  
  KEYBOARD MANAGEMENT:
    → Scroll form lên khi keyboard mở (không bị che)
    → input.scrollIntoView({ behavior: 'smooth' })
    → Dùng visualViewport API để detect keyboard height
```

---

## 🔧 PHẦN 26 — CODE TEMPLATES THỰC TẾ

### 26.1 — Global CSS & Tailwind Config

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6d28d9',
          900: '#4c1d95',
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body:    ['var(--font-body)', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'fade-in':      'fadeIn 0.4s ease both',
        'slide-up':     'slideUp 0.4s ease both',
        'scale-in':     'scaleIn 0.3s var(--ease-spring) both',
        'skeleton':     'skeleton 1.5s ease infinite',
        'spin-slow':    'spin 3s linear infinite',
        'bounce-soft':  'bounceSoft 0.6s var(--ease-spring)',
      },
      keyframes: {
        fadeIn:     { from: { opacity: '0' },               to: { opacity: '1' } },
        slideUp:    { from: { opacity: '0', transform: 'translateY(16px)' },
                      to:   { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:    { from: { opacity: '0', transform: 'scale(0.95)' },
                      to:   { opacity: '1', transform: 'scale(1)' } },
        skeleton:   { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.5' } },
        bounceSoft: { '0%':  { transform: 'scale(1)' },
                      '40%': { transform: 'scale(1.08)' },
                      '100%':{ transform: 'scale(1)' } },
      },
      boxShadow: {
        'brand':   '0 8px 30px rgba(168, 85, 247, 0.3)',
        'card':    '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
        'hover':   '0 8px 24px rgba(0,0,0,0.12)',
        'modal':   '0 24px 64px rgba(0,0,0,0.2)',
      },
    }
  },
  plugins: [
    require('@tailwindcss/typography'),    // prose class cho blog
    require('@tailwindcss/forms'),          // reset form styles
    require('@tailwindcss/aspect-ratio'),   // aspect-ratio utilities
  ]
}

export default config
```

### 26.2 — App Layout (Next.js 15)

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import localFont from 'next/font/local'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'
import './globals.css'

const fontDisplay = localFont({
  src: '../public/fonts/ClashDisplay-Variable.woff2',
  variable: '--font-display',
  display: 'swap',
})

const fontBody = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  title: { default: 'Thiện Vua App', template: '%s | Thiện Vua App' },
  description: 'Hệ sinh thái khoá học AI và công cụ số hàng đầu Việt Nam.',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Thiện Vua App',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="vi"
      className={`${fontDisplay.variable} ${fontBody.variable}`}
      suppressHydrationWarning
    >
      <body className="font-body bg-white text-gray-900 antialiased">
        <ThemeProvider attribute="class" defaultTheme="light">
          <QueryProvider>
            <AuthProvider>
              {/* Skip navigation */}
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4
                           focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary-600
                           focus:text-white focus:rounded-md focus:font-medium"
              >
                Bỏ qua điều hướng
              </a>

              <main id="main-content">
                {children}
              </main>

              <Toaster />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 26.3 — Header Component Hoàn Chỉnh

```tsx
// components/layout/Header.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Menu, X, User, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'

const NAV_LINKS = [
  { href: '/',             label: 'Trang chủ' },
  { href: '/khoa-hoc',     label: 'Khoá học' },
  { href: '/san-pham',     label: 'Sản phẩm' },
  { href: '/blog',         label: 'Blog' },
  { href: '/ve-chung-toi', label: 'Về chúng tôi' },
]

export const Header = () => {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const pathname = usePathname()
  const { user }  = useAuth()
  const { count } = useCart()

  // Scroll detection
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Đóng mobile menu khi đổi route
  useEffect(() => { setMenuOpen(false) }, [pathname])

  // Khoá scroll body khi menu mở
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[200] transition-all duration-300',
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="container h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" aria-label="Thiện Vua App - Trang chủ">
          <Image src="/logo.svg" alt="Thiện Vua App" width={140} height={36} priority />
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Điều hướng chính" className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? 'page' : undefined}
              className={cn(
                'text-sm font-medium relative py-1 transition-colors',
                'after:absolute after:bottom-0 after:left-0 after:h-0.5',
                'after:bg-primary-500 after:transition-all after:duration-250',
                pathname === href
                  ? 'text-primary-600 after:w-full'
                  : 'text-gray-600 hover:text-gray-900 after:w-0 hover:after:w-full'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <button
            aria-label="Tìm kiếm"
            className="hidden md:flex p-2 rounded-lg text-gray-500
                       hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <Search size={20} />
          </button>

          {/* Cart */}
          <Link
            href="/gio-hang"
            aria-label={`Giỏ hàng (${count} sản phẩm)`}
            className="relative p-2 rounded-lg text-gray-500
                       hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <ShoppingCart size={20} />
            {count > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px]
                           bg-primary-500 text-white text-xs font-bold
                           rounded-full flex items-center justify-center px-1
                           animate-[badge-pop_0.3s_ease]"
                aria-hidden="true"
              >
                {count > 99 ? '99+' : count}
              </span>
            )}
          </Link>

          {/* User */}
          {user ? (
            <Link href="/ho-so" aria-label="Hồ sơ của tôi">
              <Image
                src={user.avatar || '/default-avatar.png'}
                alt={user.name}
                width={36} height={36}
                className="rounded-full ring-2 ring-primary-100 hover:ring-primary-400
                           transition-all cursor-pointer"
              />
            </Link>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/dang-nhap"
                className="text-sm font-medium text-gray-600 hover:text-gray-900
                           px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                href="/dang-ky"
                className="text-sm font-semibold text-white px-4 py-2 rounded-lg
                           bg-primary-600 hover:bg-primary-700 transition-colors
                           shadow-[var(--shadow-brand)]"
              >
                Đăng ký
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-[-1] lg:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer */}
          <nav
            id="mobile-menu"
            aria-label="Điều hướng mobile"
            className="lg:hidden absolute top-full left-0 right-0
                       bg-white border-t border-gray-100 shadow-xl
                       animate-[slideUp_0.25s_ease]"
          >
            <div className="container py-4 flex flex-col gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={pathname === href ? 'page' : undefined}
                  className={cn(
                    'px-4 py-3 rounded-xl text-base font-medium transition-colors',
                    pathname === href
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {label}
                </Link>
              ))}
              {!user && (
                <div className="pt-3 mt-2 border-t border-gray-100 flex flex-col gap-2">
                  <Link
                    href="/dang-nhap"
                    className="w-full py-3 text-center text-base font-medium
                               text-gray-700 border border-gray-200 rounded-xl
                               hover:bg-gray-50 transition-colors"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/dang-ky"
                    className="w-full py-3 text-center text-base font-semibold
                               text-white bg-primary-600 rounded-xl
                               hover:bg-primary-700 transition-colors"
                  >
                    Đăng ký miễn phí
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </>
      )}
    </header>
  )
}
```

### 26.4 — SePay Payment Integration

```tsx
// lib/sepay.ts — Tích hợp SePay hoàn chỉnh
export const SEPAY_CONFIG = {
  bankAccount:  process.env.SEPAY_BANK_ACCOUNT!,
  bankName:     process.env.SEPAY_BANK_NAME!,      // 'MB' | 'TCB' | 'VCB'
  accountName:  process.env.SEPAY_ACCOUNT_NAME!,
  webhookSecret: process.env.SEPAY_WEBHOOK_SECRET!,
}

// Tạo nội dung chuyển khoản unique
export const generateTransferContent = (orderId: string): string => {
  return `TVA${orderId.slice(-8).toUpperCase()}`
}

// Tạo QR code URL (VietQR standard)
export const generateQRUrl = (amount: number, content: string): string => {
  const { bankAccount, bankName, accountName } = SEPAY_CONFIG
  return `https://img.vietqr.io/image/${bankName}-${bankAccount}-compact2.jpg` +
    `?amount=${amount}&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent(accountName)}`
}

// Verify webhook signature
export const verifyWebhookSignature = (
  payload: string,
  signature: string
): boolean => {
  const crypto = require('crypto')
  const expected = crypto
    .createHmac('sha256', SEPAY_CONFIG.webhookSecret)
    .update(payload)
    .digest('hex')
  return expected === signature
}

// app/api/webhooks/sepay/route.ts — Webhook handler
import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/sepay'
import { createClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-sepay-signature') || ''

    // Verify signature
    if (!verifyWebhookSignature(body, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const data = JSON.parse(body)
    const { transferContent, transferAmount, transactionDate } = data

    // Extract order ID từ nội dung CK
    const orderIdSuffix = transferContent?.match(/TVA([A-Z0-9]{8})/)?.[1]
    if (!orderIdSuffix) {
      return NextResponse.json({ message: 'Not a TVA order' }, { status: 200 })
    }

    const supabase = createClient()

    // Tìm order
    const { data: order } = await supabase
      .from('orders')
      .select('id, total_amount, status')
      .ilike('id', `%${orderIdSuffix}`)
      .single()

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Kiểm tra amount khớp (±1000đ tolerance)
    if (Math.abs(transferAmount - order.total_amount) > 1000) {
      return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 })
    }

    // Cập nhật order status
    await supabase
      .from('orders')
      .update({
        status: 'paid',
        paid_at: transactionDate,
        payment_ref: transferContent
      })
      .eq('id', order.id)

    // Grant product access
    await grantProductAccess(order.id)

    // Gửi email xác nhận (async, không block response)
    sendConfirmationEmail(order.id).catch(console.error)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[SePay Webhook]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
```

### 26.5 — Supabase Database Schema đầy đủ

```sql
-- ═══════════════════════════════════════════════
-- FULL DATABASE SCHEMA — THIỆN VUA APP
-- ═══════════════════════════════════════════════

-- USERS (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  phone         VARCHAR(20),
  avatar_url    TEXT,
  role          VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user','admin','moderator')),
  bio           TEXT,
  date_of_birth DATE,
  province      VARCHAR(100),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- CATEGORIES
CREATE TABLE public.categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id   UUID REFERENCES public.categories(id),
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCTS / COURSES
CREATE TABLE public.products (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  description       TEXT,
  short_description TEXT,
  thumbnail_url     TEXT,
  gallery_urls      TEXT[],
  preview_video_url TEXT,
  price             BIGINT NOT NULL,           -- VND, không có decimal
  original_price    BIGINT,
  discount_percent  INT GENERATED ALWAYS AS (
    CASE WHEN original_price > 0
    THEN ((original_price - price) * 100 / original_price)
    ELSE 0 END
  ) STORED,
  category_id       UUID REFERENCES public.categories(id),
  type              VARCHAR(30) DEFAULT 'course'
                    CHECK (type IN ('course','digital','physical','subscription')),
  status            VARCHAR(20) DEFAULT 'draft'
                    CHECK (status IN ('draft','published','archived')),
  meta_title        TEXT,
  meta_description  TEXT,
  sort_order        INT DEFAULT 0,
  is_featured       BOOLEAN DEFAULT FALSE,
  total_enrolled    INT DEFAULT 0,
  average_rating    NUMERIC(3,2) DEFAULT 0,
  review_count      INT DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- COUPONS
CREATE TABLE public.coupons (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            VARCHAR(50) NOT NULL UNIQUE,
  type            VARCHAR(20) CHECK (type IN ('percent','fixed')),
  value           BIGINT NOT NULL,
  min_order_amount BIGINT DEFAULT 0,
  max_discount    BIGINT,
  usage_limit     INT,
  used_count      INT DEFAULT 0,
  expires_at      TIMESTAMPTZ,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ORDERS
CREATE TABLE public.orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES public.profiles(id),
  status          VARCHAR(30) DEFAULT 'pending'
                  CHECK (status IN ('pending','awaiting_payment','paid','processing',
                                    'completed','cancelled','refunded')),
  subtotal        BIGINT NOT NULL,
  discount_amount BIGINT DEFAULT 0,
  total_amount    BIGINT NOT NULL,
  coupon_id       UUID REFERENCES public.coupons(id),
  coupon_code     VARCHAR(50),
  payment_method  VARCHAR(30),
  payment_ref     VARCHAR(200),
  paid_at         TIMESTAMPTZ,
  customer_name   TEXT,
  customer_email  TEXT,
  customer_phone  VARCHAR(20),
  notes           TEXT,
  admin_notes     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ORDER ITEMS
CREATE TABLE public.order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES public.products(id),
  product_name TEXT NOT NULL,             -- snapshot tên lúc mua
  product_price BIGINT NOT NULL,          -- snapshot giá lúc mua
  quantity    INT NOT NULL DEFAULT 1,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- USER PURCHASES (access control)
CREATE TABLE public.user_purchases (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id),
  product_id  UUID NOT NULL REFERENCES public.products(id),
  order_id    UUID REFERENCES public.orders(id),
  expires_at  TIMESTAMPTZ,               -- NULL = lifetime access
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- REVIEWS
CREATE TABLE public.reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES public.products(id),
  user_id     UUID NOT NULL REFERENCES public.profiles(id),
  rating      INT CHECK (rating BETWEEN 1 AND 5),
  title       TEXT,
  content     TEXT,
  is_verified BOOLEAN DEFAULT FALSE,     -- đã mua sản phẩm
  is_featured BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- COURSE PROGRESS
CREATE TABLE public.course_progress (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id),
  product_id  UUID NOT NULL REFERENCES public.products(id),
  lesson_id   UUID,
  progress    INT DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  completed_at TIMESTAMPTZ,
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- WISHLIST
CREATE TABLE public.wishlists (
  user_id    UUID NOT NULL REFERENCES public.profiles(id),
  product_id UUID NOT NULL REFERENCES public.products(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, product_id)
);

-- ═══ INDEXES ═══
CREATE INDEX idx_products_status     ON public.products(status);
CREATE INDEX idx_products_category   ON public.products(category_id);
CREATE INDEX idx_products_featured   ON public.products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_orders_user         ON public.orders(user_id);
CREATE INDEX idx_orders_status       ON public.orders(status);
CREATE INDEX idx_orders_created      ON public.orders(created_at DESC);
CREATE INDEX idx_purchases_user      ON public.user_purchases(user_id);
CREATE INDEX idx_progress_user       ON public.course_progress(user_id);

-- ═══ RLS POLICIES ═══
ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_purchases  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews         ENABLE ROW LEVEL SECURITY;

-- Profiles: user chỉ đọc/sửa profile của mình
CREATE POLICY "profiles_own" ON public.profiles
  USING (auth.uid() = id);

-- Orders: user chỉ xem order của mình
CREATE POLICY "orders_own_select" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- Purchases: user chỉ xem purchase của mình
CREATE POLICY "purchases_own" ON public.user_purchases
  FOR SELECT USING (auth.uid() = user_id);

-- Products: public read, admin write
CREATE POLICY "products_public_read" ON public.products
  FOR SELECT USING (status = 'published');

-- Reviews: public read, own write
CREATE POLICY "reviews_public_read" ON public.reviews
  FOR SELECT USING (TRUE);
CREATE POLICY "reviews_own_write" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

## 🚀 PHẦN 27 — DEPLOYMENT & CI/CD

### 27.1 — Vercel Config

```json
// vercel.json
{
  "framework": "nextjs",
  "regions": ["sin1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options",     "value": "nosniff" },
        { "key": "X-Frame-Options",             "value": "DENY" },
        { "key": "X-XSS-Protection",            "value": "1; mode=block" },
        { "key": "Referrer-Policy",             "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy",          "value": "camera=(), microphone=(), geolocation=()" }
      ]
    },
    {
      "source": "/fonts/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/_next/static/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ],
  "redirects": [
    { "source": "/home", "destination": "/", "permanent": true }
  ]
}
```

### 27.2 — ENV Variables Template đầy đủ

```bash
# .env.example — THIỆN VUA APP — Cập nhật khi thêm var mới

# ── APP ──────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_APP_NAME=Thiện Vua App

# ── SUPABASE ─────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...         # Chỉ dùng ở server

# ── PAYMENT — SEPAY ──────────────────────────────
SEPAY_BANK_ACCOUNT=0123456789
SEPAY_BANK_NAME=MB
SEPAY_ACCOUNT_NAME=NGUYEN VAN THIEN
SEPAY_WEBHOOK_SECRET=your-webhook-secret

# ── PAYMENT — VNPAY (nếu dùng) ───────────────────
VNPAY_TMN_CODE=
VNPAY_HASH_SECRET=
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html

# ── EMAIL — RESEND ────────────────────────────────
RESEND_API_KEY=re_...
EMAIL_FROM=no-reply@yourdomain.com
EMAIL_FROM_NAME=Thiện Vua App

# ── STORAGE ──────────────────────────────────────
NEXT_PUBLIC_SUPABASE_STORAGE_URL=https://xxxx.supabase.co/storage/v1

# ── ANALYTICS ────────────────────────────────────
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=                # Facebook Pixel
NEXT_PUBLIC_TIKTOK_PIXEL_ID=            # TikTok Pixel

# ── MONITORING ───────────────────────────────────
SENTRY_DSN=https://...
NEXT_PUBLIC_SENTRY_DSN=https://...

# ── RATE LIMITING ────────────────────────────────
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# ── MISC ─────────────────────────────────────────
CRON_SECRET=                             # Bảo vệ cron endpoints
ADMIN_EMAILS=thien@yourdomain.com        # Comma-separated admin emails
```

---

## 📊 PHẦN 28 — ANALYTICS & CONVERSION TRACKING

### 28.1 — Events cần track

```typescript
// lib/analytics.ts — Centralized tracking
declare global {
  interface Window { gtag: (...args: any[]) => void; fbq: (...args: any[]) => void }
}

export const Analytics = {
  // ── PAGE VIEW ──
  pageView: (url: string) => {
    window.gtag?.('config', process.env.NEXT_PUBLIC_GA4_ID!, { page_path: url })
  },

  // ── ECOMMERCE EVENTS ──
  viewProduct: (product: Product) => {
    window.gtag?.('event', 'view_item', {
      currency: 'VND',
      value: product.price,
      items: [{ item_id: product.id, item_name: product.name, price: product.price }]
    })
    window.fbq?.('track', 'ViewContent', { content_ids: [product.id], value: product.price, currency: 'VND' })
  },

  addToCart: (product: Product) => {
    window.gtag?.('event', 'add_to_cart', {
      currency: 'VND', value: product.price,
      items: [{ item_id: product.id, item_name: product.name, price: product.price }]
    })
    window.fbq?.('track', 'AddToCart', { content_ids: [product.id], value: product.price, currency: 'VND' })
  },

  beginCheckout: (cart: CartItem[]) => {
    const value = cart.reduce((s, i) => s + i.price * i.qty, 0)
    window.gtag?.('event', 'begin_checkout', { currency: 'VND', value })
    window.fbq?.('track', 'InitiateCheckout', { value, currency: 'VND' })
  },

  purchase: (order: Order) => {
    window.gtag?.('event', 'purchase', {
      transaction_id: order.id,
      value: order.total_amount,
      currency: 'VND',
      items: order.items.map(i => ({
        item_id: i.product_id, item_name: i.product_name, price: i.price
      }))
    })
    window.fbq?.('track', 'Purchase', { value: order.total_amount, currency: 'VND' })
  },

  // ── LEAD EVENTS ──
  generateLead: (source: string) => {
    window.gtag?.('event', 'generate_lead', { lead_source: source })
    window.fbq?.('track', 'Lead', { source })
  },

  signUp: (method: string) => {
    window.gtag?.('event', 'sign_up', { method })
    window.fbq?.('track', 'CompleteRegistration')
  },

  // ── ENGAGEMENT ──
  watchVideo: (videoId: string, percent: number) => {
    window.gtag?.('event', 'video_progress', { video_id: videoId, percent })
  },
}
```

---

```
╔══════════════════════════════════════════════════════════════════════════╗
║  THIỆN VUA APP — WEB BLUEPRINT v1.0 FINAL — COMPLETE EDITION            ║
║                                                                          ║
║  28 Phần   | Design Tokens đầy đủ   | 7 Color Palettes                  ║
║  22 Pages  | Component Library      | Animation System                  ║
║  A11y      | Mobile-first           | DB Schema                         ║
║  SePay     | Analytics              | CI/CD                             ║
║                                                                          ║
║  "Mỗi trang web build từ blueprint này = chuẩn tỷ đô."                 ║
║  Mục tiêu: $100M Ecosystem — mọi pixel phải xứng tầm đó.               ║
╚══════════════════════════════════════════════════════════════════════════╝
```
