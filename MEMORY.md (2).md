# 🧠 MEMORY.md — NÃO BỘ CÁ NHÂN THIỆN VUA APP
> **Phiên bản:** 1.0 | **Cập nhật:** 2026-07-04
> Nguồn sự thật duy nhất — AI đọc file này TRƯỚC KHI viết bất kỳ dòng code nào.
> Khi tạo dự án mới: chỉ thay đổi các phần có nhãn `[ĐỔI THEO DỰ ÁN]`. Phần còn lại giữ nguyên.

---

## MỤC LỤC NHANH

| # | Phần | Thay đổi khi dự án mới? |
|---|------|------------------------|
| [00](#00-project-identity) | Project Identity | ✏️ ĐỔI TOÀN BỘ |
| [01](#01-owner-profile) | Owner Profile | ✅ GIỮ NGUYÊN |
| [02](#02-tech-stack) | Tech Stack | ✏️ Điền version thực tế |
| [03](#03-architecture) | Architecture | ✏️ Vẽ lại theo dự án |
| [04](#04-db-schema) | DB Schema | ✏️ Viết schema thực tế |
| [05](#05-api-contracts) | API Contracts | ✏️ Điền endpoint thực tế |
| [06](#06-features-map) | Features Map | ✏️ Điền feature mới |
| [07](#07-decisions-log) | Decisions Log | ✏️ Xoá ADR cũ, giữ template |
| [08](#08-bugs-tracker) | Bugs Tracker | ✅ GIỮ patterns, xoá bugs cũ |
| [09](#09-progress-journal) | Progress Journal | ✏️ Xoá entries cũ |
| [10](#10-integrations) | Integrations | ✅ GIỮ NGUYÊN (thêm nếu cần) |
| [11](#11-ui-design-system) | UI Design System | ✅ GIỮ NGUYÊN |
| [12](#12-deployment) | Deployment | ✏️ Điền URL + env vars mới |
| [13](#13-lessons-learned) | Lessons Learned | ✅ GIỮ NGUYÊN (thêm dần) |

---

---

# 00. PROJECT IDENTITY
> ✏️ **[ĐỔI TOÀN BỘ KHI TẠO DỰ ÁN MỚI]**

## Thông tin cốt lõi

| Trường | Giá trị |
|--------|---------|
| **Tên sản phẩm** | `[TÊN DỰ ÁN]` |
| **Tagline** | `[1 câu — giải quyết gì, cho ai]` |
| **Giai đoạn** | `[ ] Alpha  [ ] Beta  [ ] Production` |
| **Ngày khởi động** | `[YYYY-MM-DD]` |
| **Target launch** | `[YYYY-MM-DD]` |
| **Domain** | `[domain.com]` |
| **Repo GitHub** | `[github.com/...]` |

## North Star — Mục tiêu cốt lõi

```
Dự án này tồn tại để: [1 câu mô tả mục đích tối thượng]

KPI thành công (đo được):
- [KPI 1 — vd: 1000 tenant active]
- [KPI 2 — vd: churn < 5%/tháng]
- [KPI 3 — vd: doanh thu $X/tháng]
Deadline đạt KPI: [YYYY-MM-DD]
```

## Đối tượng người dùng chính

```
Persona: [vd: CEO SMB, 30-45 tuổi, không giỏi tech]
Pain point: [mô tả vấn đề cụ thể họ gặp]
Giải pháp: [mô tả ngắn cách dự án giải quyết]
Lý do trả tiền: [vì sao họ chịu chi]
```

## Mô hình kinh doanh

| Thông tin | Giá trị |
|-----------|---------|
| **Revenue model** | `[ ] Subscription  [ ] One-time  [ ] Usage-based  [ ] Freemium` |
| **Giá gói chính** | `[X VNĐ/tháng]` |
| **Thanh toán** | SePay (VN) + Visa/Mastercard/PayPal (quốc tế) |

> ⚠️ **KHÔNG QUÊN**: SePay KHÔNG hỗ trợ recurring billing tự động. Phải thiết kế nhắc gia hạn thủ công.

## Không phải mục tiêu (Out of scope)

```
❌ [Thứ 1 KHÔNG làm]
❌ [Thứ 2 KHÔNG làm]
❌ [Thứ 3 KHÔNG làm]
```

## Ràng buộc bất di bất dịch

```
- Multi-tenant: dữ liệu tenant A tuyệt đối không lộ sang tenant B
- RLS Supabase: bật cho MỌI bảng có dữ liệu người dùng
- Webhook thanh toán: phải idempotent — gọi trùng không cộng 2 lần tiền
- Không hardcode secret/API key trong code
- Rollback plan: phải có sẵn TRƯỚC khi deploy bất kỳ thay đổi DB/payment/auth
```

## Trạng thái hiện tại

```
Sprint/Phase: [Sprint X — tên phase]
Làm việc cuối: [YYYY-MM-DD]
Blocked bởi: [liệt kê nếu có]
Ưu tiên tiếp theo: [task tiếp theo quan trọng nhất]
```

---

---

# 01. OWNER PROFILE
> ✅ **[GIỮ NGUYÊN — không đổi khi tạo dự án mới]**

## Thông tin cá nhân

| Trường | Giá trị |
|--------|---------|
| **Tên gọi** | Anh Thiện |
| **AI xưng hô** | Xưng "em", gọi "anh" — lịch sự, thân thiện, không sáo rỗng |
| **Vai trò** | Solo founder · builder · entrepreneur |
| **Timezone** | UTC+7 (Việt Nam) |
| **Lĩnh vực** | SaaS / App / Web · Khóa học AI · Tự động hóa · Tài chính & Đầu tư |

## Mục tiêu cá nhân

```
12 tháng : 1 triệu người dùng · doanh thu $10M
3 năm    : Hệ sinh thái sản phẩm toàn cầu · doanh thu $100M

Slogan:
  GIÚP CHO 10,000 CHỦ DOANH NGHIỆP X10 DOANH SỐ TỪ AI
  VIBE CODING • BUILD 1000 APP SYSTEM • GO GLOBAL
```

## Phong cách giao tiếp với AI

**✅ LÀM:**
- Ngắn gọn, súc tích, thẳng thắn, chuyên nghiệp
- Tự suy luận theo hướng tốt nhất đã kiểm chứng → làm luôn, không hỏi thừa
- Đưa ra 3 giải pháp đã kiểm chứng, xếp theo hiệu quả giảm dần
- Hoàn thành yêu cầu trước → sau đó mới đề xuất thêm nếu có giá trị
- Phản biện thẳng thắn nếu phát hiện rủi ro — nhưng vẫn thực thi
- Tự kiểm tra chéo kết quả trước khi output

**❌ KHÔNG LÀM:**
- Dài dòng, giải thích thừa
- Trộn tiếng Anh lẫn tiếng Việt trong cùng câu
- Lặp lại nội dung đã nói
- Hỏi nhiều câu cùng lúc (tối đa 1 câu khi thực sự cần)
- Mở đầu/kết thúc sáo rỗng: "Tất nhiên!", "Rất vui được giúp!"
- Tự ý diễn giải lại yêu cầu gốc

## Preferences về thiết kế

```
Style  : Luxury AI · Cyber Premium · Future Technology · Automation Empire · Global Business
Theme  : Dark mode · glassmorphism · luxury tech/sci-fi premium
Chuẩn  : Ngang tầm hoặc vượt Apple/Amazon — không chấp nhận UI mặc định nhàm chán
Motion : Mượt, có chiều sâu, không giật/lag
```

**Bảng màu thương hiệu (BẤT BIẾN):**

| Tên | HEX | Tỷ lệ | Vai trò |
|-----|-----|--------|---------|
| Deep Black | `#0A0A0A` | 50% | Nền chính |
| AI Royal Blue | `#0057FF` | 20% | Nhận diện · Logo · CTA |
| Victory Gold | `#FFD700` | 20% | Đẳng cấp · Premium · điểm nhấn |
| Royal Purple | `#7B2DFF` | 5% | AI · Innovation · glow |
| Pure White | `#FFFFFF` | 3% | Text · tiêu đề |
| Neon Cyan | `#00F0FF` | 2% | Automation · Hologram |

**Font chữ (CẤM Inter · Arial · Roboto):**
```
Be Vietnam Pro  → body tiếng Việt, UI general
Sora            → heading hiện đại
Unbounded       → brand/logo display, super bold
Plus Jakarta Sans → UI components, buttons
Space Mono / JetBrains Mono → code blocks, data
```

## Preferences về code

```
✅ Production-ready ngay từ đầu — không viết tạm
✅ Chẻ task lớn thành module nhỏ, test từng phần
✅ Không file nào > 500 dòng
✅ DRY — logic dùng ≥2 lần phải tách hàm chung
✅ Naming rõ nghĩa: camelCase (JS) / snake_case (Python)
✅ Comment bằng tiếng Việt HOẶC tiếng Anh — chọn 1, không trộn

❌ CẤM: temp, data2, test123, foo, asdf, handleClick2
❌ CẤM: TODO/placeholder trong bản giao cuối
❌ CẤM: Magic number/string không có constant
❌ CẤM: catch(e) {} — catch lỗi rồi bỏ qua im lặng
```

## AI tuyệt đối không được tự ý làm

```
❌ Thêm feature/file/bảng DB không được yêu cầu
❌ Refactor "tiện thì làm luôn" khi không được yêu cầu
❌ Xoá code/file nếu không có từ "xoá" trong yêu cầu
❌ Hardcode API key, secret
❌ Ghi đè file đang chạy ổn mà không backup
❌ Tự đổi hướng yêu cầu gốc mà không báo
❌ Code liền 1 mạch không chia module khi task lớn
❌ Báo "xong" khi chưa test
```

## Checklist AI tự trả lời trước khi báo "xong"

```
1. Có điểm nào tôi làm khác yêu cầu gốc không? → Nêu rõ và lý do
2. Có rủi ro nào (bảo mật, dữ liệu, hiệu suất) chưa xử lý hết?
3. Có giả định nào tôi tự đặt ra để code được không? → Nêu rõ
```

---

---

# 02. TECH STACK
> ✏️ **[ĐIỀN VERSION THỰC TẾ KHI BẮT ĐẦU DỰ ÁN]**

## Stack mặc định Thiện Vua App

| Layer | Technology | Ghi chú |
|-------|-----------|---------|
| **Backend/DB** | Supabase (Postgres + RLS + Auth + Storage + Realtime) | Bật RLS mọi bảng user data |
| **AI** | Google AI Studio (Gemini) / Claude API | Ghi rõ model cho từng feature |
| **Deploy** | Vercel (frontend) · GitHub · Hostinger (VPS khi cần) | |
| **Thanh toán VN** | SePay | ⚠️ Không auto-recurring |
| **Thanh toán QT** | Visa / Mastercard / PayPal | Không lưu thẻ thô — PCI-DSS |
| **Ngôn ngữ** | TypeScript/JavaScript · Python / Node.js | |
| **Package manager** | npm HOẶC pnpm — chọn 1, không trộn | |
| **Secrets** | `.env` (không commit) · `.env.example` (không có giá trị thật) | |

## Phiên bản dự án hiện tại

```yaml
# FRONTEND
framework:       "[Next.js 14 App Router / Vite / Other]"
ui_library:      "[Shadcn/UI / None]"
css:             "[Tailwind CSS / Vanilla CSS]"
node_version:    "[20.x LTS]"

# BACKEND (nếu tách riêng)
runtime:         "[Node.js 20 / Python 3.11]"
api_framework:   "[FastAPI / Express / Next.js API Routes]"

# DATABASE
supabase_url:    "[https://xxx.supabase.co]"

# AI MODELS (ghi rõ model cho từng feature)
feature_A:       "[claude-sonnet-4-5]"
feature_B:       "[gemini-2.0-flash]"

# PACKAGE VERSIONS QUAN TRỌNG
packages:
  - "[package-name]: [x.y.z]"
  - "[package-name]: [x.y.z]"
```

## Biến môi trường cần có

```bash
# SUPABASE
NEXT_PUBLIC_SUPABASE_URL=           # URL project
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # Anon key
SUPABASE_SERVICE_ROLE_KEY=          # Service role — server-side ONLY

# AI APIs
ANTHROPIC_API_KEY=                  # Claude
GOOGLE_AI_API_KEY=                  # Gemini

# THANH TOÁN
SEPAY_API_KEY=
SEPAY_WEBHOOK_SECRET=

# APP
NEXT_PUBLIC_APP_URL=                # https://[domain.com]

# [Thêm theo dự án]
```

## Lệnh chạy dự án

```bash
# INSTALL
[npm install | pnpm install]

# DEV
[npm run dev]  # → http://localhost:[PORT]

# DATABASE
[npx supabase db push]

# BUILD
[npm run build]

# TEST
[npm run test]
[npm run test:e2e]

# LINT / FORMAT (chạy trước khi giao)
[npm run lint && npm run format]

# DEPLOY
[vercel --prod | git push origin main]

# ROLLBACK
[vercel rollback | npx supabase migration repair]
```

## Cấu trúc thư mục chuẩn

```
project-root/
├── MEMORY.md                       # ← File này
├── CLAUDE.md                       # Quy tắc code
├── README.md
├── .env.example
├── .gitignore
├── docs/
│   ├── architecture.md
│   ├── db-schema.md
│   └── decisions/
├── src/  (hoặc app/ nếu Next.js)
│   ├── modules/                    # Tách theo DOMAIN
│   │   ├── auth/
│   │   ├── tenants/
│   │   ├── billing/
│   │   ├── chatbot/
│   │   └── dashboard/
│   ├── lib/                        # Helper dùng chung
│   ├── components/                 # UI components
│   └── workers/                    # Background jobs
├── supabase/
│   ├── migrations/
│   └── seed/
├── tests/
│   ├── unit/
│   └── integration/
└── scripts/
```

---

---

# 03. ARCHITECTURE
> ✏️ **[VẼ LẠI THEO DỰ ÁN — template dưới là chuẩn Multi-tenant SaaS]**

## Sơ đồ kiến trúc tổng thể

```
[THAY BẰNG SƠ ĐỒ THẬT]

┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│            Browser / Mobile / Third-party                   │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────────────┐
│                    FRONTEND (Vercel)                        │
│         Next.js App Router · React · Tailwind               │
│  ├── /app/(auth)/     ├── /app/dashboard/                   │
│  ├── /app/[module]/   └── /app/api/  (API Routes)           │
└──────────────────────┬──────────────────────────────────────┘
                       │
          ┌────────────┼──────────────┐
          │            │              │
┌─────────▼──┐  ┌──────▼──────┐  ┌───▼────────────┐
│  Supabase  │  │  AI APIs    │  │  SePay /        │
│ ─────────  │  │ ─────────── │  │  Payment GW     │
│ Postgres   │  │ Claude API  │  │ ──────────────  │
│ Auth       │  │ Gemini API  │  │ Webhook (idm.)  │
│ Storage    │  └─────────────┘  └────────────────┘
│ Realtime   │
└────────────┘
```

## Luồng xác thực (Auth Flow)

```
Chuẩn Supabase Auth:
1. User → /login hoặc Google OAuth
2. Supabase Auth xác thực → JWT token
3. PostgreSQL Trigger tự động sync → public.profiles
   (tránh bug tài khoản trống credit khi Google OAuth lần đầu)
4. Client nhận JWT → cookie/localStorage
5. Mọi request → JWT trong Authorization header
6. Supabase RLS kiểm tra auth.uid() trước khi cho đọc/ghi
```

## Luồng thanh toán (Payment Flow — Idempotent)

```
1. User chọn gói → frontend tạo order
2. Backend tạo payment link qua SePay API
3. User thanh toán trên SePay
4. SePay → webhook → /api/webhooks/sepay
5. Backend:
   a. ✅ Verify chữ ký SePay (BẮT BUỘC — không bỏ)
   b. ✅ Kiểm tra transaction_id đã xử lý chưa (idempotency)
   c. Nếu chưa → BEGIN TRANSACTION:
      - Cộng credits / kích hoạt gói
      - Ghi audit log
      COMMIT
   d. Nếu đã xử lý → return 200 OK, không làm gì thêm
6. Frontend: Supabase Realtime nhận tín hiệu → cập nhật UI
```

## Luồng AI / Credit Gate

```
1. User gửi request
2. Frontend → /api/[feature]
3. Backend:
   a. ✅ Xác thực JWT
   b. ✅ Rate limiting check (chống spam)
   c. ✅ Credit Gate: SELECT credits WHERE id = user_id FOR UPDATE
      → credits <= 0 → return INSUFFICIENT_CREDITS (402)
   d. UPDATE credits = credits - 1 WHERE credits > 0 (atomic)
   e. Gọi AI API (Claude/Gemini) + stream response
4. Lưu conversation history vào Supabase
```

## Ranh giới module

```
Module       │ Trách nhiệm              │ KHÔNG làm
─────────────┼──────────────────────────┼────────────────────────
auth/        │ Login, logout, register  │ Không xử lý billing
tenants/     │ Tenant CRUD, settings    │ Không xử lý AI calls
billing/     │ Payment, credits, plans  │ Không gọi AI trực tiếp
chatbot/     │ AI conversation, history │ Không xử lý thanh toán
dashboard/   │ UI tổng hợp, analytics   │ Không chứa business logic
```

---

---

# 04. DB SCHEMA
> ✏️ **[VIẾT SCHEMA THỰC TẾ CỦA DỰ ÁN — template dưới là bảng chuẩn]**

## Nguyên tắc DB bất biến

```
✅ RLS: BẬT cho MỌI bảng user data — auth.uid() = user_id
✅ Soft-delete: dùng deleted_at TIMESTAMP — không DROP/DELETE hàng loạt
✅ Transaction: ghi nhiều bảng → BEGIN...COMMIT
✅ Idempotency: bảng giao dịch PHẢI có UNIQUE trên (provider, provider_ref)
✅ Migration: KHÔNG sửa migration đã chạy production — chỉ thêm mới
✅ Rollback: mọi migration phải có UP và DOWN
```

## Danh sách bảng

```
[ĐIỀN DANH SÁCH BẢNG THỰC TẾ]

┌──────────────────┬──────────────────────────────┬──────────┐
│ Tên bảng         │ Mô tả ngắn                   │ RLS      │
├──────────────────┼──────────────────────────────┼──────────┤
│ profiles         │ User info mở rộng             │ ✅ Bật   │
│ tenants          │ Workspace/tổ chức             │ ✅ Bật   │
│ plans            │ Gói dịch vụ                   │ ❌ Public│
│ subscriptions    │ Gói đang dùng của tenant      │ ✅ Bật   │
│ transactions     │ Lịch sử thanh toán            │ ✅ Bật   │
│ [Thêm theo dự án]│                               │          │
└──────────────────┴──────────────────────────────┴──────────┘
```

## Schema bảng chuẩn (pre-built)

```sql
-- ===========================
-- BẢNG: profiles
-- Auto-sync từ auth.users qua trigger
-- ===========================
CREATE TABLE public.profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT NOT NULL,
  full_name    TEXT,
  avatar_url   TEXT,
  credits      INTEGER NOT NULL DEFAULT 0,
  plan         TEXT NOT NULL DEFAULT 'free', -- 'free' | 'pro' | 'enterprise'
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile"   ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger: auto-create profile khi user đăng ký (kể cả Google OAuth)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',   -- Google OAuth metadata
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ===========================
-- BẢNG: transactions (idempotent)
-- ===========================
CREATE TABLE public.transactions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES public.profiles(id),
  provider       TEXT NOT NULL,         -- 'sepay' | 'stripe' | 'paypal'
  provider_ref   TEXT NOT NULL,         -- Idempotency key
  amount         BIGINT NOT NULL,       -- VNĐ hoặc cent USD
  currency       TEXT NOT NULL DEFAULT 'VND',
  status         TEXT NOT NULL,         -- 'pending' | 'success' | 'failed' | 'refunded'
  credits_added  INTEGER,
  plan_activated TEXT,
  metadata       JSONB,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at   TIMESTAMPTZ
);
-- UNIQUE constraint — chống duplicate transaction (idempotency)
CREATE UNIQUE INDEX transactions_provider_ref_idx ON public.transactions(provider, provider_ref);
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
-- INSERT/UPDATE chỉ qua service_role (backend) — không cho client trực tiếp
```

## Migration history

| Migration | Mô tả | Trạng thái | Ngày |
|-----------|-------|-----------|------|
| `001_initial_schema` | Schema ban đầu | 📋 Planned | |
| `[Thêm dần]` | | | |

---

---

# 05. API CONTRACTS
> ✏️ **[ĐIỀN ENDPOINT THỰC TẾ — format response và error codes giữ nguyên]**

## Format response chuẩn (bất biến)

```typescript
// ✅ SUCCESS
{ "success": true, "data": { ... }, "message": "..." }

// ❌ ERROR
{ "success": false, "error": { "code": "ERROR_CODE", "message": "...", "details": { ... } } }
```

## Error codes chuẩn

| Code | HTTP | Mô tả |
|------|------|-------|
| `UNAUTHORIZED` | 401 | Chưa đăng nhập / JWT hết hạn |
| `FORBIDDEN` | 403 | Không có quyền |
| `NOT_FOUND` | 404 | Resource không tồn tại |
| `VALIDATION_ERROR` | 400 | Input không hợp lệ |
| `INSUFFICIENT_CREDITS` | 402 | Hết credits |
| `RATE_LIMIT_EXCEEDED` | 429 | Vượt giới hạn tần suất |
| `DUPLICATE_TRANSACTION` | 409 | Transaction đã xử lý (idempotency) |
| `WEBHOOK_SIGNATURE_INVALID` | 400 | Chữ ký webhook không hợp lệ |
| `INTERNAL_ERROR` | 500 | Lỗi server nội bộ |

## Danh sách endpoints

```
[ĐIỀN ENDPOINT THỰC TẾ CỦA DỰ ÁN]

### AUTH
POST  /api/auth/callback          ❌ Public   Callback Supabase Auth
GET   /api/auth/me                ✅ JWT      Lấy thông tin user hiện tại
POST  /api/auth/logout            ✅ JWT      Đăng xuất

### BILLING
GET   /api/plans                  ❌ Public   Danh sách gói
POST  /api/billing/create-payment ✅ JWT      Tạo payment link
POST  /api/webhooks/sepay         ❌ Sig      Webhook nhận thanh toán
GET   /api/billing/transactions   ✅ JWT      Lịch sử giao dịch

### CORE FEATURES
POST  /api/[feature]              ✅ JWT      [Điền]
GET   /api/[feature]/history      ✅ JWT      [Điền]
```

## Logic webhook SePay (bắt buộc đúng thứ tự)

```typescript
// POST /api/webhooks/sepay
// 1. Verify signature (KHÔNG BỎ QUA)
const secret = req.headers['authorization']?.replace('Bearer ', '')
if (secret !== process.env.SEPAY_WEBHOOK_SECRET) return res.status(400).json({ error: 'WEBHOOK_SIGNATURE_INVALID' })

// 2. Idempotency check
const exists = await db.query('SELECT id FROM transactions WHERE provider = $1 AND provider_ref = $2', ['sepay', body.referenceCode])
if (exists.rows.length > 0) return res.status(200).json({ success: true }) // Đã xử lý rồi → trả 200, không làm gì

// 3. BEGIN TRANSACTION
await db.query('BEGIN')
  await db.query('UPDATE profiles SET credits = credits + $1 WHERE id = $2', [creditsToAdd, userId])
  await db.query('INSERT INTO transactions (...) VALUES (...)', [...])
await db.query('COMMIT')

return res.status(200).json({ success: true })
```

## Logic AI endpoint + Credit Gate

```typescript
// POST /api/[feature]
// 1. Verify JWT
const { data: { user } } = await supabase.auth.getUser(token)
if (!user) return res.status(401).json({ error: 'UNAUTHORIZED' })

// 2. Rate limit
// ...

// 3. Credit Gate (atomic — chống race condition)
const { data } = await supabaseAdmin
  .from('profiles')
  .update({ credits: supabase.raw('credits - 1') })
  .eq('id', user.id)
  .gt('credits', 0)   // Chỉ update nếu credits > 0
  .select('credits')
  .single()
if (!data) return res.status(402).json({ error: 'INSUFFICIENT_CREDITS' })

// 4. Gọi AI
const response = await anthropic.messages.create({ ... })
return res.json({ success: true, data: { result: response, credits_remaining: data.credits } })
```

---

---

# 06. FEATURES MAP
> ✏️ **[CẬP NHẬT SAU MỖI TASK]**

| Ký hiệu | Nghĩa |
|---------|-------|
| ✅ | Done — production |
| 🚧 | WIP — đang làm |
| 📋 | Planned |
| 🔬 | Testing / Staging |
| ⏸️ | On hold |
| ❌ | Cancelled |

**Cập nhật lần cuối:** `[YYYY-MM-DD]`

## Module: Auth & User

| # | Tính năng | Status | Ghi chú |
|---|-----------|--------|---------|
| A1 | Đăng ký / Đăng nhập Email + Password | 📋 | |
| A2 | Đăng nhập Google OAuth | 📋 | Cần trigger sync profiles |
| A3 | Forgot / Reset password | 📋 | |
| A4 | Profile management | 📋 | |
| A5 | Avatar upload | 📋 | Supabase Storage |

## Module: Billing & Credits

| # | Tính năng | Status | Ghi chú |
|---|-----------|--------|---------|
| B1 | Hiển thị bảng giá | 📋 | |
| B2 | Tạo payment link SePay | 📋 | |
| B3 | Webhook nhận thanh toán (idempotent) | 📋 | ⚠️ Quan trọng |
| B4 | Lịch sử giao dịch | 📋 | |
| B5 | Credits balance real-time | 📋 | Supabase Realtime |

## Module: Core AI Features

| # | Tính năng | Status | Ghi chú |
|---|-----------|--------|---------|
| C1 | [Tính năng chính 1] | 📋 | |
| C2 | [Tính năng chính 2] | 📋 | |
| C3 | [Tính năng chính 3] | 📋 | |

## Module: Dashboard & Analytics

| # | Tính năng | Status | Ghi chú |
|---|-----------|--------|---------|
| D1 | Dashboard overview | 📋 | |
| D2 | Usage analytics | 📋 | |
| D3 | Activity history | 📋 | |

## Module: Settings & Admin

| # | Tính năng | Status | Ghi chú |
|---|-----------|--------|---------|
| E1 | User settings | 📋 | |
| E2 | Admin panel | 📋 | Service role only |

## Module: Landing & Marketing

| # | Tính năng | Status | Ghi chú |
|---|-----------|--------|---------|
| F1 | Landing page | 📋 | |
| F2 | Pricing page | 📋 | |

---

---

# 07. DECISIONS LOG (ADR)
> ✏️ **[XOÁ ADR CŨ KHI TẠO DỰ ÁN MỚI — GIỮ 3 ADR MẶC ĐỊNH BÊN DƯỚI]**

**Format:**
```
### ADR-XXX: [Tên quyết định]
- Ngày · Trạng thái · Context · Quyết định · Lý do · Trade-off · Hệ quả
```

---

### ADR-001: Dùng Supabase làm BaaS chính
- **Ngày:** [Ngày bắt đầu dự án] | **Trạng thái:** Accepted
- **Quyết định:** Supabase (Postgres + Auth + Storage + Realtime + Edge Functions)
- **Lý do:** Setup nhanh · RLS tích hợp · Realtime built-in · Auth đa provider · Postgres đầy đủ
- **Trade-off:** Phụ thuộc vendor; migration sang DB khác tốn công
- **Hệ quả:** Mọi schema phải bật RLS; auth flow qua Supabase Auth

### ADR-002: SePay + webhook tự xây — không dùng auto-recurring
- **Ngày:** [Ngày bắt đầu] | **Trạng thái:** Accepted
- **Quyết định:** SePay làm payment gateway chính; webhook idempotent tự xây; KHÔNG auto-recurring
- **Lý do:** SePay phổ biến ở VN; SePay KHÔNG hỗ trợ recurring → thiết kế thủ công
- **Trade-off:** Phải tự build cơ chế nhắc gia hạn subscription
- **Hệ quả:** Bảng `transactions` phải có UNIQUE trên `provider_ref`; webhook phải verify signature

### ADR-003: Credit System kiểm soát AI usage
- **Ngày:** [Ngày] | **Trạng thái:** [Accepted / TBD]
- **Quyết định:** [Credit-based / Plan-based — điền theo dự án]
- **Lý do:** Tránh overspend AI API khi user spam
- **Trade-off:** [Điền]
- **Hệ quả:** Credit Gate bắt buộc trước mọi AI call

### ADR-004: [Thêm quyết định tiếp theo]
- **Ngày:** | **Trạng thái:**
- **Context:**
- **Quyết định:**
- **Lý do:**
- **Trade-off:**
- **Hệ quả:**

---

---

# 08. BUGS TRACKER
> ✏️ **[CẬP NHẬT KHI GẶP BUG — GIỮ PHẦN "BUG PATTERNS" BÊN DƯỚI]**

**Tổng quan:** 🔴 Critical: 0 | 🟠 High: 0 | 🟡 Medium: 0 | 🔵 Low: 0

**Format bug:**
```
### BUG-XXX: [Tiêu đề]
Severity · Trạng thái · Ngày · Module · Mô tả · Cách tái hiện · Root cause · Fix · Files
```

## Bug đang mở

*Chưa có*

## Bug đã fix

*Chưa có*

## Bug patterns hay gặp (đọc trước khi code để phòng tránh)

```
1. ❌ Quên bật RLS bảng mới → data leak
   ✅ ALTER TABLE ... ENABLE ROW LEVEL SECURITY ngay sau CREATE TABLE

2. ❌ Webhook không idempotent → cộng tiền 2 lần
   ✅ UNIQUE constraint (provider, provider_ref) + check trước khi xử lý

3. ❌ Google OAuth không tạo profile → app crash
   ✅ Trigger dùng raw_user_meta_data->>'full_name' (không phải NEW.full_name)

4. ❌ Không có Credit Gate → AI API spam, hóa đơn vọt
   ✅ Credit Gate bắt buộc TRƯỚC khi gọi AI

5. ❌ .env bị commit → API keys lộ
   ✅ .gitignore có .env* trong commit đầu tiên

6. ❌ Không verify webhook signature → giả mạo thanh toán
   ✅ Verify Authorization header ngay bước đầu tiên

7. ❌ Credits race condition: 2 request đồng thời cùng pass credit check
   ✅ UPDATE ... WHERE credits > 0 (atomic) thay vì SELECT rồi UPDATE riêng

8. ❌ Migration không có DOWN script → downtime khi rollback
   ✅ Mọi migration phải có cả UP và DOWN

9. ❌ N+1 query trong vòng lặp → chậm khi scale
   ✅ Supabase select với join hoặc batch fetch

10. ❌ Hardcode model name AI nhiều nơi → sửa nhiều chỗ khi update
    ✅ Tạo constant MODEL_CLAUDE = process.env.CLAUDE_MODEL || 'claude-sonnet-4-5'
```

---

---

# 09. PROGRESS JOURNAL
> ✏️ **[CẬP NHẬT SAU MỖI TASK LỚN — entry mới nhất ở trên đầu]**

**Format:**
```
### [YYYY-MM-DD] — [Tên Sprint/Phase]
Đã làm · Kết quả · WIP · Blocked · Next Up · Ghi chú cho AI
```

## Nhật ký

---

### [YYYY-MM-DD] — Khởi động dự án

**Đã làm:**
- ✅ Khởi tạo repository
- ✅ Setup MEMORY.md

**Next Up:**
- [ ] Setup Supabase project + schema ban đầu
- [ ] Cấu hình auth (Email + Google OAuth)
- [ ] Build landing page

**Ghi chú cho AI:**
> Dự án mới bắt đầu. Đọc phần [00 PROJECT IDENTITY] để biết mục tiêu.

---

## Sprint Overview

| Sprint | Mục tiêu | Từ | Đến | Status |
|--------|---------|-----|-----|--------|
| Sprint 1 | [Mục tiêu] | [MM-DD] | [MM-DD] | 📋 |
| Sprint 2 | [Mục tiêu] | | | 📋 |

## Milestone

| Milestone | Target | Status |
|-----------|--------|--------|
| MVP Alpha | [YYYY-MM-DD] | 📋 |
| Beta Launch | [YYYY-MM-DD] | 📋 |
| Public Launch | [YYYY-MM-DD] | 📋 |
| $10K MRR | [YYYY-MM-DD] | 📋 |

---

---

# 10. INTEGRATIONS
> ✅ **[GIỮ NGUYÊN — thêm service mới khi cần]**

## Nguyên tắc tích hợp (bất biến)

```
✅ Luôn tra docs chính thức phiên bản mới nhất — API hay thay đổi
✅ Không dùng kiến thức AI về API cũ nếu không xác nhận từ docs mới
✅ Webhook phải verify signature trước khi xử lý
✅ API key trong .env — không hardcode, không commit
✅ Có fallback/error handling khi service ngoài bị down
```

---

### Supabase — Backend as a Service
| | |
|--|--|
| **Mục đích** | Database · Auth · Storage · Realtime · Edge Functions |
| **Docs** | https://supabase.com/docs |
| **Dashboard** | https://app.supabase.com |
| **Env vars** | `NEXT_PUBLIC_SUPABASE_URL` · `NEXT_PUBLIC_SUPABASE_ANON_KEY` · `SUPABASE_SERVICE_ROLE_KEY` |

**Gotchas:**
```
⚠️ RLS mặc định TẮT khi tạo bảng mới → PHẢI enable thủ công
⚠️ Service Role Key bypass toàn bộ RLS → chỉ dùng server-side, KHÔNG expose client
⚠️ Google OAuth: user metadata ở raw_user_meta_data (JSONB) — cần trigger sync profiles
⚠️ Supabase Edge Functions cold start ~1-2s — không dùng cho latency-sensitive
```

---

### Anthropic Claude API
| | |
|--|--|
| **Models** | `claude-sonnet-4-5` / `claude-3-5-haiku` (fast, cheap) |
| **Docs** | https://docs.anthropic.com |
| **Env var** | `ANTHROPIC_API_KEY` |

**Gotchas:**
```
⚠️ Model names thay đổi thường xuyên → KHÔNG hardcode rải rác nhiều file
   → Tạo constant: MODEL_CLAUDE = process.env.CLAUDE_MODEL || 'claude-sonnet-4-5'
⚠️ Streaming response cần xử lý đặc biệt — khác với non-streaming
```

---

### Google AI Studio / Gemini
| | |
|--|--|
| **Models** | `gemini-2.0-flash` / `gemini-2.0-pro` |
| **Docs** | https://ai.google.dev/docs |
| **Env var** | `GOOGLE_AI_API_KEY` |

**Gotchas:**
```
⚠️ Free tier có quota giới hạn — check trước khi production
⚠️ API key từ Google AI Studio khác với Google Cloud Vertex AI — không nhầm
⚠️ gemini-2.0-flash nhanh + rẻ hơn pro — dùng cho tasks không cần reasoning sâu
```

---

### SePay — Thanh toán Việt Nam
| | |
|--|--|
| **Mục đích** | Chuyển khoản ngân hàng VN · QR Code · Ví điện tử |
| **Docs** | https://docs.sepay.vn |
| **Env vars** | `SEPAY_API_KEY` · `SEPAY_WEBHOOK_SECRET` |
| **Webhook** | `/api/webhooks/sepay` |

**Gotchas QUAN TRỌNG:**
```
🚨 SePay KHÔNG hỗ trợ recurring billing tự động
⚠️ Verify webhook: Authorization: Bearer [secret]
⚠️ Idempotency BẮT BUỘC — SePay retry nhiều lần khi timeout
⚠️ Số tiền là VNĐ (không phải cent)
```

---

### Vercel — Hosting & Deploy
| | |
|--|--|
| **Docs** | https://vercel.com/docs |
| **Deploy** | `vercel --prod` |
| **Rollback** | `vercel rollback` |

**Gotchas:**
```
⚠️ Function timeout: 10s (free) / 60s (pro) — AI calls cần streaming
⚠️ Env vars phải set trên Vercel dashboard — không tự đọc .env.local khi production
```

---

### GitHub — Source Control
| | |
|--|--|
| **Repo** | `[github.com/thienvua/...]` |
| **Main branch** | `main` |
| **Rules** | Không commit .env · Không push --force main · Branch riêng cho thay đổi lớn |

---

---

# 11. UI DESIGN SYSTEM
> ✅ **[GIỮ NGUYÊN HOÀN TOÀN — brand Thiện Vua App bất biến]**

## Brand Palette (Bất biến)

```css
:root {
  /* PRIMARY */
  --color-black:  #0A0A0A;   /* 50% — nền chính */
  --color-blue:   #0057FF;   /* 20% — nhận diện, CTA */
  --color-gold:   #FFD700;   /* 20% — premium, điểm nhấn */

  /* SECONDARY */
  --color-purple: #7B2DFF;   /*  5% — AI, innovation, glow */
  --color-white:  #FFFFFF;   /*  3% — text, tiêu đề */
  --color-cyan:   #00F0FF;   /*  2% — automation, hologram */

  /* DERIVED */
  --color-black-card:   #161616;
  --color-black-border: #222222;
  --color-blue-glow:    rgba(0, 87, 255, 0.3);
  --color-gold-glow:    rgba(255, 215, 0, 0.3);
  --color-purple-glow:  rgba(123, 45, 255, 0.3);
  --color-cyan-glow:    rgba(0, 240, 255, 0.3);

  /* TEXT */
  --text-primary:   #FFFFFF;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --text-muted:     rgba(255, 255, 255, 0.4);

  /* STATUS */
  --color-success: #00C851;
  --color-error:   #FF4444;
  --color-warning: #FFD700;
}
```

## Typography

**Fonts được phép:**
```
Be Vietnam Pro    → body tiếng Việt, UI general
Sora              → heading hiện đại
Unbounded         → brand/logo display
Plus Jakarta Sans → UI components, buttons
Space Mono        → data, numbers, monospace
JetBrains Mono    → code blocks
```

**CẤM tuyệt đối:** `Inter · Arial · Roboto · system fonts mặc định`

**Font scale:**
```css
--font-xs:   0.75rem;   /* 12px */
--font-sm:   0.875rem;  /* 14px */
--font-base: 1rem;      /* 16px */
--font-lg:   1.125rem;  /* 18px */
--font-xl:   1.25rem;   /* 20px */
--font-2xl:  1.5rem;    /* 24px */
--font-3xl:  1.875rem;  /* 30px */
--font-4xl:  2.25rem;   /* 36px */
--font-5xl:  3rem;      /* 48px */
--font-hero: clamp(3rem, 8vw, 6rem);
```

## Style Principles (Bất biến)

```
1. DARK MODE FIRST   — Nền luôn Deep Black hoặc gần đen
2. GLASSMORPHISM     — Cards: backdrop-filter: blur() + border mờ
3. GLOW EFFECTS      — CTA và elements quan trọng: box-shadow glow
4. SMOOTH ANIMATION  — Transition 200–400ms, không giật lag
5. PREMIUM FEEL      — Ngang tầm Apple/Amazon — không chấp nhận UI nhàm chán
```

## CSS Patterns chuẩn

```css
/* Glassmorphism Card */
.card-glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}

/* CTA Button Primary */
.btn-primary {
  background: linear-gradient(135deg, #0057FF, #7B2DFF);
  border-radius: 12px;
  padding: 14px 28px;
  color: white;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 0 20px rgba(0, 87, 255, 0.3);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(0, 87, 255, 0.5);
}

/* Gold Accent Text */
.accent-gold {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Neon Glow Text */
.text-neon { color: #00F0FF; text-shadow: 0 0 20px rgba(0, 240, 255, 0.8); }

/* Gradient Hero Text */
.text-gradient-hero {
  background: linear-gradient(135deg, #FFFFFF 0%, #0057FF 50%, #FFD700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

## Spacing & Breakpoints

```css
--space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px;
--space-6:24px; --space-8:32px; --space-12:48px; --space-16:64px;

--radius-sm:8px; --radius-md:12px; --radius-lg:16px; --radius-full:9999px;

--bp-sm:640px; --bp-md:768px; --bp-lg:1024px; --bp-xl:1280px;
```

## Animation Standards

```css
--duration-fast: 150ms; --duration-normal: 250ms; --duration-slow: 400ms;
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Rules */
✅ Hover: translateY(-2px to -4px) + glow enhancement
✅ Page transitions: opacity fade 300ms
✅ Loading: shimmer hoặc skeleton
✅ Card hover: scale(1.02)
❌ KHÔNG dùng animation phức tạp làm chậm UX
❌ KHÔNG dùng flash/blink gây khó chịu
```

---

---

# 12. DEPLOYMENT
> ✏️ **[ĐIỀN URL + ENV VARS + PIPELINE THỰC TẾ KHI TẠO DỰ ÁN MỚI]**

## Nguyên tắc deploy bất biến

```
✅ KHÔNG test code mới trực tiếp trên DB / API key production
✅ Mỗi môi trường có .env riêng, key riêng
✅ Trước khi merge production: test ổn ở staging trước
✅ KHÔNG dùng dữ liệu khách hàng thật để test tính năng mới
✅ Thay đổi DB/payment/auth PHẢI có rollback plan TRƯỚC KHI deploy
✅ Lỗi production nghiêm trọng → rollback/khoá tính năng NGAY, debug sau
```

## Environments

| Môi trường | URL | Branch | Supabase | Mục đích |
|-----------|-----|--------|---------|---------|
| **Dev** | `localhost:3000` | feature/* | dev project | Code local |
| **Staging** | `[staging.domain.com]` | `staging` | staging project | Test |
| **Production** | `[app.domain.com]` | `main` | production project | Live |

## Deploy Pipeline (Vercel Auto)

```bash
# Mọi push lên main → Vercel auto build + deploy production
# Mọi push lên staging → Vercel auto deploy staging

# Build config:
Build command:    [npm run build]
Output directory: [.next]
Node.js version:  [20.x]
```

## Env vars trên Vercel Production

```bash
NEXT_PUBLIC_SUPABASE_URL      = [production URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY = [production anon key]
SUPABASE_SERVICE_ROLE_KEY     = [production service role — SENSITIVE]
ANTHROPIC_API_KEY             = [Claude key]
GOOGLE_AI_API_KEY             = [Gemini key]
SEPAY_API_KEY                 = [SePay key]
SEPAY_WEBHOOK_SECRET          = [SePay webhook secret]
NEXT_PUBLIC_APP_URL           = https://[app.domain.com]
```

## Database Migration Deploy

```bash
# Quy trình BẮT BUỘC:
# 1. Backup database trước
# 2. Test migration trên staging trước
# 3. Có rollback script sẵn (DOWN migration)

# Deploy:
npx supabase db push --db-url [PRODUCTION_DB_URL]

# Check status:
npx supabase migration list
```

## Rollback Procedures

```bash
# Code rollback (Vercel):
vercel rollback [deployment-url]
# Hoặc: Vercel Dashboard → Deployments → Promote deployment cũ

# Database rollback:
npx supabase migration repair [version] --status reverted
# Hoặc: Supabase Dashboard → Database → Backups → Restore
```

## Rollback theo incident

```
🔴 Lỗi thanh toán (double-charge):
   1. Tắt ngay webhook endpoint (return 200 không xử lý)
   2. Liên hệ SePay dừng gửi webhook mới
   3. Debug → fix → re-process webhook thủ công

🔴 Lỗi auth (user không login được):
   1. Check Supabase Auth logs
   2. Nếu do code → vercel rollback
   3. Nếu do Supabase → check status.supabase.com

🔴 Data leak (RLS bị bypass):
   1. Force enable RLS trên bảng bị lỗi
   2. Revoke + generate anon key mới → update Vercel → redeploy
   3. Audit log: ai đã đọc gì
```

## Deployment History

| Date | Version | Nội dung | Status |
|------|---------|---------|--------|
| [YYYY-MM-DD] | v0.1.0 | Initial deploy | ✅ |

---

---

# 13. LESSONS LEARNED
> ✅ **[GIỮ NGUYÊN + THÊM DẦN SAU MỖI INCIDENT]**

**Format:**
```
### LESSON-XXX: [Tiêu đề]
Ngày · Severity · Điều xảy ra · Root cause · Hậu quả · Cách fix · Bài học · Rule mới
```

---

### LESSON-001: Quên bật RLS → Data leak
- **Severity:** 🔴 | **Ngày:** [điền khi xảy ra]
- **Root cause:** Supabase mặc định TẮT RLS khi tạo bảng mới
- **Hậu quả:** User A đọc được dữ liệu user B qua PostgREST
- **Rule mới:** ✅ `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` ngay sau `CREATE TABLE`

### LESSON-002: Webhook không idempotent → Cộng tiền 2 lần
- **Severity:** 🔴 | **Ngày:** [điền khi xảy ra]
- **Root cause:** Không có idempotency check; không có UNIQUE constraint
- **Hậu quả:** Credits được cộng miễn phí không thu tiền
- **Rule mới:** ✅ UNIQUE `(provider, provider_ref)` + check EXISTS trước khi xử lý webhook

### LESSON-003: Google OAuth không tạo profile → App crash
- **Severity:** 🟠 | **Ngày:** [điền khi xảy ra]
- **Root cause:** Trigger dùng `NEW.full_name` — Google OAuth metadata nằm ở `raw_user_meta_data`
- **Hậu quả:** User đăng nhập Google crash app ngay sau login
- **Rule mới:** ✅ Trigger dùng `NEW.raw_user_meta_data->>'full_name'` cho mọi auth provider

### LESSON-004: Không có Credit Gate → AI API spam, hóa đơn vọt
- **Severity:** 🔴 | **Ngày:** [điền khi xảy ra]
- **Root cause:** Không có Credit Gate, không có rate limiting
- **Hậu quả:** Chi phí API tăng đột biến
- **Rule mới:** ✅ Mọi AI endpoint: Auth → Rate limit → Credit Gate → Gọi AI (đúng thứ tự này)

### LESSON-005: .env commit lên GitHub → API keys lộ
- **Severity:** 🔴 | **Ngày:** [điền khi xảy ra]
- **Root cause:** Quên thêm `.env` vào `.gitignore` từ đầu
- **Hậu quả:** Phải rotate toàn bộ keys khẩn cấp
- **Rule mới:** ✅ Commit #1 của mọi dự án: `.gitignore` với `.env*` đã có sẵn

### LESSON-006: Không có rollback plan → Downtime kéo dài
- **Severity:** 🟠 | **Ngày:** [điền khi xảy ra]
- **Root cause:** Migration chỉ có UP, không có DOWN; không test staging trước
- **Hậu quả:** Service down, phải restore backup thủ công
- **Rule mới:** ✅ Checklist deploy: staging tested ✓ · backup done ✓ · rollback script ready ✓

---

## Top 10 mistakes tuyệt đối phải tránh

```
1. 🔴 Quên bật RLS bảng mới → data leak
2. 🔴 Webhook không idempotent → cộng tiền 2 lần
3. 🔴 Không verify webhook signature → giả mạo thanh toán
4. 🔴 Không có Credit Gate → AI API spam, hóa đơn vọt
5. 🔴 .env bị commit → API keys lộ
6. 🟠 Không test Google OAuth riêng → crash lúc login
7. 🟠 Không có DOWN migration → downtime kéo dài
8. 🟠 Race condition credits → âm credits
9. 🟠 N+1 query → performance thảm khi scale
10. 🟡 Hardcode model name AI → phải sửa nhiều chỗ khi update model
```

---

---

> **NGUYÊN TẮC VÀNG:** File này là nguồn sự thật duy nhất. Không có gì được ưu tiên hơn — kể cả trí nhớ của AI.
> AI đọc xong file này → tóm tắt 3–5 dòng những gì đã hiểu về dự án → sau đó mới bắt đầu code.
