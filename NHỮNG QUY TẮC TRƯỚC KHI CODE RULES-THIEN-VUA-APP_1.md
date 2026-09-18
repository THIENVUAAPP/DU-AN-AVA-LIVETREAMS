# ⚡ CODING RULES — THIỆN VUA APP
## Bộ Quy Tắc Tuyệt Đối Cho Mọi Dự Án — v3.0 FINAL EDITION

```
╔══════════════════════════════════════════════════════════════════════════╗
║         🔴 THIỆN VUA APP — CODING RULEBOOK v3.0 FINAL 🔴                ║
║   Áp dụng 100% mọi lúc — Không ngoại lệ — Không thương lượng           ║
║   Verified: Claude ✓ | ChatGPT ✓ | Gemini ✓                            ║
║   Mục tiêu: $100M Ecosystem — mọi dòng code phải xứng tầm đó           ║
╚══════════════════════════════════════════════════════════════════════════╝
```

> **Mục đích**: Bộ luật tối cao điều phối mọi phiên code với bất kỳ AI nào.
> **Bắt buộc**: AI phải đọc, xác nhận, và tuân thủ 100% trước khi viết bất kỳ dòng code nào.
> **Không có ngoại lệ**: Không được "linh hoạt", bỏ qua, hay tắt bất kỳ điều nào.

---

## 📋 MỤC LỤC

```
PHẦN 0  — AI ACTIVATION PROTOCOL         (Xác nhận + Cam kết)
PHẦN 1  — AI THINKING PROTOCOL           (Quy trình tư duy bắt buộc)
PHẦN 2  — 15 ĐIỀU LUẬT BẤT BIẾN         (Luật cốt lõi)
PHẦN 3  — ISOLATION PROTOCOL            (Môi trường độc lập)
PHẦN 4  — PROJECT MEMORY SYSTEM         (Bộ nhớ dự án)
PHẦN 5  — ANTI-BUG PROTOCOL             (Chống lỗi)
PHẦN 6  — MULTI-FILE CONSISTENCY        (Nhất quán đa file)
PHẦN 7  — DATABASE INTEGRITY            (Bảo vệ dữ liệu)
PHẦN 8  — ROLLBACK PROTOCOL             (Kế hoạch hoàn tác)
PHẦN 9  — GIT DISCIPLINE                (Kỷ luật git)
PHẦN 10 — SECURITY PROTOCOL             (Bảo mật)
PHẦN 11 — CODING STANDARDS              (Chuẩn viết code)
PHẦN 12 — FORBIDDEN PATTERNS            (Anti-patterns theo stack)
PHẦN 13 — PERFORMANCE BUDGET            (Ngân sách hiệu năng)
PHẦN 14 — WORKFLOW & OUTPUT FORMAT      (Quy trình làm việc)
PHẦN 15 — RED LINES                     (Tuyệt đối không làm)
PHẦN 16 — PRODUCTION READINESS          (Checklist trước khi ship)
PHẦN 17 — QUICK REFERENCE               (Tra cứu nhanh)
```

---

## 🔐 PHẦN 0 — AI ACTIVATION PROTOCOL

> **BẮT BUỘC**: Khi anh Thiện paste rulebook này vào chat, AI phải reply CHÍNH XÁC format dưới đây.
> **Nếu AI không reply đúng → yêu cầu lại, không cho code.**

```
╔══════════════════════════════════════════════════════════════╗
║       ✅ CODING RULES v3.0 FINAL — ĐÃ XÁC NHẬN              ║
╚══════════════════════════════════════════════════════════════╝

Tôi đã đọc toàn bộ rulebook và cam kết tuyệt đối:

SCOPE        □ Chỉ động đúng file/function được chỉ định
ISOLATION    □ FE / BE / DB độc lập — không chéo nhau
MEMORY       □ Không assume — đọc code thật trước khi viết
DATA         □ Không xóa / overwrite dữ liệu khi không được yêu cầu
CONFLICT     □ Phát hiện xung đột → dừng báo cáo ngay
COMPLETION   □ Code hoàn chỉnh 100% — không để dở dang
REVIEW       □ Tự review trước khi output
ROLLBACK     □ Mọi thay đổi nguy hiểm đều có kế hoạch hoàn tác

Vui lòng cung cấp PROJECT CONTEXT BLOCK để bắt đầu.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🧠 PHẦN 1 — AI THINKING PROTOCOL

> **Mọi AI phải đi qua 5 bước tư duy này theo thứ tự trước khi viết bất kỳ dòng code nào.**
> **Bỏ qua bất kỳ bước nào = vi phạm rulebook.**

```
╔══════════════════════════════════════════════════════════════╗
║  BƯỚC 1 — UNDERSTAND (Hiểu yêu cầu)                         ║
╚══════════════════════════════════════════════════════════════╝
  → Yêu cầu này muốn đạt được KẾT QUẢ gì?
  → Input là gì? Output là gì? Edge case là gì?
  → Có gì mơ hồ không? → Nếu có, hỏi 1 câu cụ thể.
  → KHÔNG bắt đầu code cho đến khi hiểu 100%.

╔══════════════════════════════════════════════════════════════╗
║  BƯỚC 2 — LOCATE (Định vị trong codebase)                    ║
╚══════════════════════════════════════════════════════════════╝
  → Feature/logic này hiện đang nằm ở file nào?
  → Có code tương tự đã tồn tại chưa? (tránh duplicate)
  → Những file nào sẽ bị ảnh hưởng khi thay đổi?
  → Dependency chain: A phụ thuộc B phụ thuộc C?

╔══════════════════════════════════════════════════════════════╗
║  BƯỚC 3 — PLAN (Lên kế hoạch)                               ║
╚══════════════════════════════════════════════════════════════╝
  → Sẽ sửa file nào? Tạo file mới nào? Xóa file nào?
  → Thứ tự thực hiện đúng (ví dụ: types trước → backend → frontend)
  → Có cần migration DB không? Có cần update API contract không?
  → Có rủi ro gì? Kế hoạch rollback nếu lỗi?
  → Khai báo IMPACT ZONE (xem Phần 2 — Điều 2)

╔══════════════════════════════════════════════════════════════╗
║  BƯỚC 4 — EXECUTE (Thực thi)                                 ║
╚══════════════════════════════════════════════════════════════╝
  → Code đúng scope đã plan — KHÔNG mở rộng
  → Tuân thủ coding standards (Phần 11)
  → Không vi phạm forbidden patterns (Phần 12)
  → Không động vào file ngoài Impact Zone đã khai báo

╔══════════════════════════════════════════════════════════════╗
║  BƯỚC 5 — VERIFY (Tự kiểm tra)                              ║
╚══════════════════════════════════════════════════════════════╝
  → Đọc lại toàn bộ code vừa viết
  → Chạy mental test: logic đúng? import đủ? type đúng?
  → Có phá code cũ không? Có vi phạm 15 điều luật không?
  → Output theo format chuẩn (Phần 14)
  → Tự chấm: chỉ output khi đạt ≥ 9/10
```

---

## 📌 PHẦN 2 — 15 ĐIỀU LUẬT BẤT BIẾN

```
╔══════════════════════════════════════════════════════════════╗
║  ĐIỀU 1 — KHÔNG ĐỘNG VÀO CODE NGOÀI SCOPE                   ║
╚══════════════════════════════════════════════════════════════╝
  → Chỉ sửa đúng file/function/component được chỉ định tường minh
  → KHÔNG "cải thiện nhân tiện" bất cứ thứ gì khác
  → KHÔNG refactor code đang hoạt động khi không được yêu cầu
  → KHÔNG thêm feature mới trong khi đang fix bug
  → Phát hiện vấn đề ngoài scope → ghi vào mục PHÁT HIỆN NGOÀI SCOPE
     trong output report, không tự sửa

╔══════════════════════════════════════════════════════════════╗
║  ĐIỀU 2 — KHAI BÁO IMPACT ZONE TRƯỚC KHI CODE               ║
╚══════════════════════════════════════════════════════════════╝
  → Trước khi viết bất kỳ dòng code nào, AI PHẢI khai báo:

  IMPACT ZONE:
  ├── File SỬA   : [list đầy đủ]
  ├── File TẠO   : [list đầy đủ]
  ├── File XÓA   : [list — CẦN APPROVE trước]
  ├── DB thay đổi: [có/không — nếu có: table/column gì]
  ├── API thay đổi: [có/không — nếu có: endpoint nào]
  └── Shared code bị ảnh hưởng: [có/không — nếu có: dùng ở đâu]

  → Nếu Impact Zone lớn hơn dự kiến → DỪNG và báo cáo trước
  → Nếu anh không approve → KHÔNG tiến hành

╔══════════════════════════════════════════════════════════════╗
║  ĐIỀU 3 — KHÔNG XÓA CODE / DATA KHI KHÔNG ĐƯỢC CHỈ ĐỊNH     ║
╚══════════════════════════════════════════════════════════════╝
  → Xóa logic = mất tính năng, có thể không khôi phục
  → Khi thay thế code cũ: để lại comment // [REPLACED YYYY-MM-DD: lý do]
  → KHÔNG xóa migration đã chạy
  → KHÔNG xóa seed data
  → KHÔNG DROP TABLE, DROP COLUMN khi không được yêu cầu tường minh

╔══════════════════════════════════════════════════════════════╗
║  ĐIỀU 4 — MÔI TRƯỜNG ĐỘC LẬP TUYỆT ĐỐI                     ║
╚══════════════════════════════════════════════════════════════╝
  → FE / BE / DB là 3 môi trường TÁCH BIỆT HOÀN TOÀN
  → Task thuộc môi trường nào → chỉ chạm đúng môi trường đó
  → Task cần cross môi trường → tách thành subtask riêng, làm tuần tự
  → API contract = interface giữa FE↔BE: thay đổi phải notify cả 2 bên
  → Shared component sửa → phải test ở MỌI NƠI dùng nó
  → Chi tiết: xem Phần 3 — Isolation Protocol

╔══════════════════════════════════════════════════════════════╗
║  ĐIỀU 5 — LUÔN ĐỌC CODE HIỆN TẠI TRƯỚC KHI VIẾT MỚI         ║
╚══════════════════════════════════════════════════════════════╝
  → KHÔNG assume — đọc thật sự code đang có
  → KHÔNG tạo duplicate function/component đã tồn tại
  → Kiểm tra types/interfaces hiện tại trước khi tạo mới
  → Nếu không có context → hỏi 1 câu cụ thể, không tự đoán

╔══════════════════════════════════════════════════════════════╗
║  ĐIỀU 6 — DATABASE INTEGRITY — BẢO VỆ DATA TUYỆT ĐỐI        ║
╚══════════════════════════════════════════════════════════════╝
  → Schema thay đổi = PHẢI có migration script versioned (UP + DOWN)
  → KHÔNG ALTER TABLE trực tiếp — luôn qua migration
  → Thêm column mới = phải có DEFAULT VALUE hoặc nullable
  → KHÔNG chạy SQL destructive trên production không có rollback
  → Chi tiết: xem Phần 7 — Database Integrity

╔══════════════════════════════════════════════════════════════╗
║  ĐIỀU 7 — KHÔNG HARDCODE GIÁ TRỊ NHẠY CẢM                   ║
╚══════════════════════════════════════════════════════════════╝
  → API keys, passwords, tokens, secrets → LUÔN vào .env
  → URLs, endpoints, base paths → LUÔN vào constants file
  → User IDs, role names, permission strings → LUÔN vào enum/constants
  → Phát hiện hardcode trong code cũ → ghi note, không tự sửa

╔══════════════════════════════════════════════════════════════╗
║  ĐIỀU 8 — PHÁT HIỆN XUNG ĐỘT → DỪNG VÀ BÁO CÁO             ║
╚══════════════════════════════════════════════════════════════╝
  → Yêu cầu mới mâu thuẫn code cũ → KHÔNG tự quyết → báo cáo
  → Yêu cầu không rõ ràng → KHÔNG tự diễn giải → hỏi 1 câu
  → 2 yêu cầu trong 1 phiên conflict nhau → dừng báo cáo trước

  Format báo cáo:
  ⚠️ CONFLICT DETECTED
  ├── Yêu cầu hiện tại : [X]
  ├── Code/logic có sẵn: [Y]
  ├── Mâu thuẫn tại   : [Z — file, line]
  ├── Option A         : [mô tả] — trade-off: [...]
  └── Option B         : [mô tả] — trade-off: [...]
  → Cần anh quyết định trước khi tiếp tục.

╔══════════════════════════════════════════════════════════════╗
║  ĐIỀU 9 — KHÔNG ĐỂ CODE CHƯA HOÀN CHỈNH                    ║
╚══════════════════════════════════════════════════════════════╝
  → KHÔNG có // TODO / // FIXME / // implement later
  → KHÔNG có placeholder logic (throw new Error('not implemented'))
  → KHÔNG có console.log debug trong code output
  → KHÔNG có unused import, unused variable
  → Ship = hoàn chỉnh 100%, không có mảnh vỡ

╔══════════════════════════════════════════════════════════════╗
║  ĐIỀU 10 — NAMING NHẤT QUÁN TUYỆT ĐỐI                      ║
╚══════════════════════════════════════════════════════════════╝
  → Đã đặt tên gì → dùng tên đó mãi mãi trong project
  → KHÔNG rename giữa chừng nếu không update hết nơi dùng
  → KHÔNG tạo 2 tên cho 1 khái niệm (user vs account vs profile → chọn 1)
  → Follow naming convention đã thiết lập từ đầu (xem Phần 11)

╔══════════════════════════════════════════════════════════════╗
║  ĐIỀU 11 — LUÔN XỬ LÝ LỖI — KHÔNG ĐỂ APP CRASH             ║
╚══════════════════════════════════════════════════════════════╝
  → Mọi async/await → try/catch
  → Mọi API response → kiểm tra status trước khi dùng data
  → Mọi UI component → loading + error + empty state
  → Error message user = thân thiện, không lộ stack trace
  → Error log internal = đầy đủ context để debug

╔══════════════════════════════════════════════════════════════╗
║  ĐIỀU 12 — VERSION LOCK — KHÔNG TỰ UPGRADE DEPENDENCIES     ║
╚══════════════════════════════════════════════════════════════╝
  → KHÔNG upgrade package.json version khi đang code feature
  → KHÔNG upgrade major version (v1→v2) trừ khi được yêu cầu rõ ràng
  → KHÔNG dùng "latest" trong package.json — pin exact version
  → Khi cần package mới: khai báo tên + version + lý do trước khi install
  → Sau install: cập nhật vào .env.example nếu cần config

╔══════════════════════════════════════════════════════════════╗
║  ĐIỀU 13 — PARTIAL COMPLETION PROTOCOL                       ║
╚══════════════════════════════════════════════════════════════╝
  → Nếu task bị gián đoạn giữa chừng (context quá dài, token limit):
    1. DỪNG tại điểm an toàn (không để broken state)
    2. Ghi rõ: đã làm được gì, đang dở ở đâu
    3. Liệt kê chính xác bước tiếp theo
    4. KHÔNG để code ở trạng thái lỗi / incomplete
  → KHÔNG bao giờ để file import thứ chưa tồn tại
  → KHÔNG bao giờ để function được gọi nhưng chưa được định nghĩa

╔══════════════════════════════════════════════════════════════╗
║  ĐIỀU 14 — MULTI-FILE CONSISTENCY                            ║
╚══════════════════════════════════════════════════════════════╝
  → Thêm / đổi field mới phải update ĐẦY ĐỦ:
    DB: migration → BE: model + schema → FE: type + validation + UI
  → Không để type mismatch giữa FE và BE
  → Không để API trả về field mà FE type không có
  → Chi tiết: xem Phần 6 — Multi-File Consistency

╔══════════════════════════════════════════════════════════════╗
║  ĐIỀU 15 — TỰ REVIEW TRƯỚC KHI OUTPUT                       ║
╚══════════════════════════════════════════════════════════════╝
  → Đọc lại 100% code vừa viết trước khi giao
  → Kiểm tra: logic đúng? import đầy đủ? type chính xác?
  → Kiểm tra: vi phạm điều nào trong 15 điều không?
  → Kiểm tra: forbidden patterns (Phần 12)?
  → Output theo format chuẩn Phần 14
  → Chỉ output khi tự chấm ≥ 9/10
```

---

## 🏗️ PHẦN 3 — ISOLATION PROTOCOL

> **Nguyên tắc tối thượng: Làm đầu này KHÔNG được làm hỏng đầu kia.**

### 3.1 — Ba Môi Trường Tách Biệt Hoàn Toàn

```
┌──────────────────────────────────────────────────────────────┐
│                     ISOLATION MAP                             │
├─────────────────┬──────────────────┬────────────────────────┤
│   FRONTEND      │    BACKEND       │      DATABASE           │
│   (Next.js)     │   (FastAPI/Node) │     (Supabase/PG)       │
├─────────────────┼──────────────────┼────────────────────────┤
│ Pages/Routes    │ API Routes       │ Tables & Schema         │
│ Components      │ Services         │ Migrations              │
│ Hooks/State     │ Models           │ RLS Policies            │
│ Styles/UI       │ Middleware        │ Functions/Triggers      │
│ Client utils    │ Server utils     │ Indexes & Constraints   │
├─────────────────┴──────────────────┴────────────────────────┤
│                   CONTRACT LAYER                              │
│  API Endpoints + TypeScript Types + Request/Response Schema  │
│          Thay đổi contract → update CẢ HAI phía              │
└──────────────────────────────────────────────────────────────┘

LUẬT ISOLATION:
→ Task FE        → chỉ chạm /frontend (hoặc /app, /components, /hooks)
→ Task BE        → chỉ chạm /backend (hoặc /api, /services, /models)
→ Task DB        → chỉ chạm /database/migrations + update BE models
→ Task cross     → tách thành subtask riêng, thực hiện tuần tự FE→BE→DB
→ KHÔNG bao giờ → FE gọi thẳng DB, bypass BE
→ KHÔNG bao giờ → BE trả về raw DB error ra client
```

### 3.2 — Shared Code Rules

```
Khi sửa Shared Component / Hook / Utility:
  B1: Liệt kê TẤT CẢ nơi dùng component/hook/utility này
  B2: Đánh giá impact với từng nơi (có thể bị break không?)
  B3: Nếu change là backward-compatible → update tại chỗ + test hết nơi dùng
  B4: Nếu change là BREAKING → tạo version mới (v2), deprecated cái cũ
      Ví dụ: Button → ButtonV2, giữ Button cũ cho đến khi migrate xong
  B5: Update TẤT CẢ nơi dùng TRONG CÙNG task (không để broken import)
  B6: KHÔNG để tồn tại broken import dù chỉ 1 phút

Khi sửa API Contract (endpoint, request/response shape):
  B1: Cập nhật BE route + validation
  B2: Cập nhật FE types (trong /types/index.ts)
  B3: Cập nhật FE API calls
  B4: Versioning nếu là breaking change: /api/v1 → /api/v2
```

### 3.3 — Dependency Impact Map Template

> Tạo và maintain file này trong mọi dự án tại `docs/DEPENDENCY-MAP.md`

```
DEPENDENCY MAP — [Tên Dự Án]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KHI SỬA X → CÁC NƠI Y BỊ ẢNH HƯỞNG:

users table schema  → UserModel (BE) + User type (FE types/) + UserCard (component)
/api/auth/login     → AuthProvider + LoginPage + useAuth hook
Button component    → tất cả page dùng Button (liệt kê cụ thể)
constants.ts        → mọi file import từ constants.ts
types/index.ts      → mọi file dùng type đó

SHARED RESOURCES:
  /types/index.ts      → source of truth cho TypeScript types
  /lib/constants.ts    → source of truth cho constants
  /lib/utils.ts        → source of truth cho helper functions
  /lib/api.ts          → source of truth cho API client
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🧠 PHẦN 4 — PROJECT MEMORY SYSTEM

> **Vấn đề**: AI reset sau mỗi phiên → mất context → làm lại, làm sai, ghi đè
> **Giải pháp**: 4 file docs bắt buộc trong mọi dự án + protocol khi bắt đầu phiên mới

### 4.1 — PROJECT CONTEXT BLOCK (BẮT BUỘC paste khi mở phiên mới)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PROJECT CONTEXT — [Tên Dự Án] — v[x.x] — [Ngày]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Stack           : [Next.js 15 / FastAPI / Supabase / ...]
Versions        : [next@15.1.0 | react@19.0.0 | python@3.12]
Phase           : [MVP / Beta / Production]
Branch hiện tại : [main / feature/xxx]
Last deploy     : [YYYY-MM-DD HH:MM]

FEATURES ĐÃ HOÀN THÀNH — KHÔNG ĐỘNG VÀO:
  ✅ Auth system (login/register/logout/refresh token)
  ✅ User profile page
  ✅ [Feature khác...]

ĐANG LÀM:
  🔧 [Mô tả task hiện tại — cụ thể nhất có thể]

BACKLOG (chưa làm):
  📋 [Task 1]
  📋 [Task 2]

LỖI / BLOCKER:
  🐛 [Mô tả lỗi nếu có] hoặc Không có

FILE SẼ LIÊN QUAN ĐẾN TASK NÀY:
  📄 /path/to/file1.tsx — [vai trò]
  📄 /path/to/file2.py  — [vai trò]

VÙNG CẤM — KHÔNG ĐỘNG VÀO:
  🚫 /database/migrations/ — không tự ý sửa migration đã chạy
  🚫 /components/ui/       — không sửa shadcn trực tiếp
  🚫 /api/auth/            — đang stable, đừng chạm
  🚫 [Vùng nhạy cảm khác...]

DEPENDENCIES ĐÃ LOCK (không upgrade):
  📦 [package@version] — lý do lock
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4.2 — FILE REGISTRY (`docs/FILE-REGISTRY.md`)

```
FILE REGISTRY — [Tên Dự Án] — Cập nhật: [YYYY-MM-DD]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 FRONTEND
  /app/layout.tsx               → Root layout, global providers, fonts
  /app/page.tsx                 → Landing page
  /app/(auth)/login/page.tsx    → Login page
  /app/(auth)/register/page.tsx → Register page
  /app/dashboard/page.tsx       → Dashboard chính
  /components/ui/               → shadcn/ui — KHÔNG sửa trực tiếp
  /components/layout/           → Header, Footer, Sidebar
  /components/features/         → Components theo feature domain
  /hooks/                       → Custom hooks — 1 hook 1 file
  /lib/api.ts                   → API client wrapper — tất cả fetch calls
  /lib/constants.ts             → TẤT CẢ constants — thêm ở đây
  /lib/utils.ts                 → Helper functions
  /lib/validations.ts           → Zod schemas — validation
  /lib/supabase.ts              → Supabase browser client
  /types/index.ts               → TẤT CẢ TypeScript types — single source

📁 BACKEND (nếu có)
  /api/routes/                  → 1 file = 1 domain (auth.py, users.py)
  /api/middleware/              → Auth, logging, rate limit middleware
  /models/                      → SQLAlchemy / Pydantic models
  /services/                    → Business logic, tách khỏi routes
  /schemas/                     → Pydantic request/response schemas
  /database/schema.sql          → Schema snapshot — update sau migrate
  /database/migrations/         → Versioned migrations — KHÔNG xóa

📁 CONFIG
  .env.example                  → Template đầy đủ — committed to git
  next.config.ts                → Next.js config
  tailwind.config.ts            → Tailwind config + custom tokens
  tsconfig.json                 → TypeScript config — strict mode ON

📁 DOCUMENTATION
  docs/FILE-REGISTRY.md         → File này — cập nhật khi thêm file
  docs/CHANGELOG.md             → Lịch sử thay đổi
  docs/DEPENDENCY-MAP.md        → Impact map giữa các module
  docs/ARCHITECTURE.md          → Sơ đồ hệ thống tổng quan
  README.md                     → Hướng dẫn setup đầy đủ

📁 DATABASE
  Tables active  : [users, products, orders, ...]
  Migrations done: [001_init, 002_add_roles, 003_add_subscription]
  RLS enabled    : [✅ users | ✅ orders | ✅ products]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4.3 — CHANGELOG (`docs/CHANGELOG.md`)

```
CHANGELOG — [Tên Dự Án]
Legend: [+] Thêm | [~] Sửa | [-] Xóa | [!] Hotfix | [⚠] Breaking change
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[YYYY-MM-DD] v0.3.0
  [+] Payment integration SePay — /api/webhooks/sepay
  [+] Email notification đơn hàng — Resend
  [~] Fix: Login redirect sai route sau OAuth
  [~] Fix: Mobile layout dashboard bị vỡ ở 375px
  [⚠] API response format đổi: { data, error, meta } thay vì raw

[YYYY-MM-DD] v0.2.0
  [+] Auth system: register, login, logout, refresh token
  [+] User profile page với avatar upload
  [-] Xóa trang /coming-soon
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4.4 — SESSION HANDOVER (Tạo cuối mỗi phiên quan trọng)

```
SESSION HANDOVER — [Tên Dự Án] — [YYYY-MM-DD HH:MM]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHIÊN NÀY ĐÃ HOÀN THÀNH:
  ✅ [task 1 — mô tả kết quả]
  ✅ [task 2 — mô tả kết quả]

ĐANG DỞ (chưa xong — dừng tại đây):
  🔧 [task — đang ở bước nào, còn thiếu gì]

FILE ĐÃ THAY ĐỔI:
  [~] /path/file.tsx — [thay đổi gì]
  [+] /path/newfile.ts — [mục đích]

VẤN ĐỀ PHÁT HIỆN CHƯA XỬ LÝ:
  ⚠️ [mô tả — nằm ở đâu — mức độ ưu tiên]

BƯỚC TIẾP THEO (thứ tự):
  1. [việc phải làm tiếp]
  2. [...]

CẢNH BÁO CHO PHIÊN SAU:
  🚨 [thứ đặc biệt cần chú ý để không làm sai]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🛡️ PHẦN 5 — ANTI-BUG PROTOCOL

### 5.1 — PRE-CODE CHECKLIST (AI tự check — bắt buộc)

```
PRE-CODE CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Đã đi qua 5 bước AI Thinking Protocol (Phần 1)?
□ Đã đọc code hiện tại — không assume?
□ Đã khai báo Impact Zone (Điều 2)?
□ Task thuộc môi trường nào? (FE / BE / DB / cross)
□ Có sửa shared component/hook/utility?
  → Nếu có: đã liệt kê tất cả nơi dùng?
□ Có thay đổi database schema?
  → Nếu có: đã chuẩn bị migration (UP + DOWN)?
□ Có thay đổi API contract?
  → Nếu có: đã plan update cả FE types và BE schema?
□ Có xung đột với code hiện tại?
  → Nếu có: báo cáo format Điều 8
□ ENV vars mới → đã thêm vào .env.example chưa?
□ Có cần rollback plan không? (Phần 8)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5.2 — POST-CODE CHECKLIST (AI tự check trước khi output)

```
POST-CODE CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Logic chạy đúng không? (mental run-through)
□ Có break code cũ không? (imports, exports, types)
□ TypeScript errors? (strict mode — 0 errors)
□ console.log / debug rác? (xóa hết)
□ TODO / FIXME / placeholder? (không có)
□ Unhandled promise / missing await?
□ Missing error handling?
□ Hardcoded value nào không?
□ Loading / Error / Empty state đủ chưa? (UI)
□ Mobile responsive? (nếu là UI task)
□ Forbidden patterns (Phần 12) — có vi phạm không?
□ Đã viết output report (Phần 14.2)?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5.3 — BẢNG LỖI PHỔ BIẾN

| # | Lỗi | Nguyên nhân gốc | Cách phòng |
|---|-----|-----------------|------------|
| 1 | Data mất sau deploy | Schema đổi không có migration | Luôn UP+DOWN migration |
| 2 | Feature cũ hỏng | Sửa shared component chưa test hết nơi dùng | Liệt kê nơi dùng trước khi sửa |
| 3 | API 401/403 | Thiếu auth middleware | Verify auth sau mỗi route mới |
| 4 | UI vỡ mobile | Chỉ test desktop | Test responsive ngay khi code |
| 5 | ENV không load | Sai tên, thiếu prefix | .env.example là source of truth |
| 6 | Infinite loop | useEffect dependency sai | Audit dependency array kỹ |
| 7 | State không update | Mutate trực tiếp | Spread/copy rồi mới set |
| 8 | Memory leak | Không cleanup subscription | Return cleanup trong useEffect |
| 9 | N+1 query | Fetch trong vòng lặp | Batch query hoặc JOIN |
| 10 | Type mismatch FE↔BE | Tạo types riêng lẻ | Sync từ 1 source duy nhất |
| 11 | Stale data | Cache không invalidate | Define invalidation rõ |
| 12 | Race condition | 2 async chạy song song | AbortController hoặc flag |
| 13 | CORS error | Config origin sai | Whitelist explicit, không * |
| 14 | RLS bypass | Dùng service_role sai chỗ | service_role chỉ ở BE trusted |
| 15 | Circular import | A→B→A | Tách ra file shared thứ 3 |
| 16 | Hydration mismatch | Server/client render khác | Dùng useEffect cho client-only |
| 17 | Build fail ở production | Dùng window/document trong SSR | Check typeof window trước |
| 18 | Type any leak | Lazy typing | Strict mode, no any policy |
| 19 | Zombie process | setInterval không clear | clearInterval trong cleanup |
| 20 | SQL injection | String concat query | Luôn parameterized query |

---

## 🔗 PHẦN 6 — MULTI-FILE CONSISTENCY

> **Khi thêm/đổi 1 field → phải update ĐẦY ĐỦ theo chain. Thiếu 1 mắt xích = runtime error.**

### 6.1 — Field Propagation Chain

```
THÊM FIELD MỚI (ví dụ: thêm "phone" vào user):

BƯỚC 1 — DATABASE
  migration: ALTER TABLE users ADD COLUMN phone VARCHAR(20)
  schema.sql: cập nhật snapshot

BƯỚC 2 — BACKEND
  model/user.py: thêm field phone
  schema/user.py: thêm phone vào UserCreate, UserResponse, UserUpdate
  validation: thêm regex validation số điện thoại

BƯỚC 3 — FRONTEND
  types/index.ts: thêm phone?: string vào User type
  lib/validations.ts: thêm phone vào Zod schema
  components/features/profile/ProfileForm.tsx: thêm input field
  hooks/useUser.ts: verify type vẫn đúng

BƯỚC 4 — KIỂM TRA
  API response có trả về phone không?
  FE type có nhận đúng không?
  Form submit có gửi phone không?
  Validation FE và BE khớp nhau không?

→ Thiếu bất kỳ bước nào = bug tiềm ẩn hoặc runtime error
```

### 6.2 — Consistency Checklist cho Cross-Layer Task

```
□ DB migration đã viết (UP + DOWN)?
□ BE model đã update?
□ BE schema (request/response) đã update?
□ BE validation đã update?
□ FE types/index.ts đã update?
□ FE Zod validation schema đã update?
□ FE UI component đã hiển thị/nhận field mới?
□ FE API call đã gửi/nhận field mới?
□ Không có type mismatch giữa FE type và BE response?
□ Không có field nào BE trả về mà FE type không có?
```

---

## 🗄️ PHẦN 7 — DATABASE INTEGRITY

### 7.1 — Migration Rules

```
MIGRATION PROTOCOL (bắt buộc 100%):

KHÔNG BAO GIỜ:
  ✗ ALTER TABLE trực tiếp trên production
  ✗ Sửa migration file đã được chạy
  ✗ DROP TABLE / TRUNCATE không có rollback plan
  ✗ DELETE FROM không có WHERE clause
  ✗ Đổi tên column đang được dùng (rename → tạo mới + migrate data + xóa cũ)

LUÔN LUÔN:
  ✓ Tạo migration file mới với version tăng dần
  ✓ Mỗi migration có UP (forward) và DOWN (rollback)
  ✓ Test migration trên dev/staging trước production
  ✓ Update schema.sql snapshot sau khi migrate
  ✓ Thêm column mới → có DEFAULT VALUE hoặc nullable
  ✓ Backup data trước khi chạy migration destructive
```

### 7.2 — Migration File Template

```sql
-- File: /database/migrations/[NNN]_[description].sql
-- Version: NNN (tăng dần từ 001)
-- Date: YYYY-MM-DD
-- Author: Thiện Vua App
-- Description: [Mô tả rõ ràng migration này làm gì]
-- Risk Level: [LOW / MEDIUM / HIGH]
-- Rollback: Xem phần DOWN bên dưới

-- ═══════════════════════ UP ═══════════════════════════
BEGIN;

-- [SQL thực thi]
ALTER TABLE users
  ADD COLUMN phone VARCHAR(20) DEFAULT NULL,
  ADD COLUMN phone_verified BOOLEAN DEFAULT FALSE;

CREATE INDEX CONCURRENTLY idx_users_phone ON users(phone)
  WHERE phone IS NOT NULL;

COMMIT;

-- ═══════════════════════ DOWN (Rollback) ══════════════
-- Uncomment và chạy nếu cần rollback
-- BEGIN;
-- DROP INDEX IF EXISTS idx_users_phone;
-- ALTER TABLE users DROP COLUMN IF EXISTS phone_verified;
-- ALTER TABLE users DROP COLUMN IF EXISTS phone;
-- COMMIT;
```

### 7.3 — Supabase RLS Template

```sql
-- BẬT RLS ngay khi tạo table
ALTER TABLE [table_name] ENABLE ROW LEVEL SECURITY;

-- Policy: User chỉ xem data của mình
CREATE POLICY "users_select_own" ON [table_name]
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: User chỉ insert data của mình
CREATE POLICY "users_insert_own" ON [table_name]
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: User chỉ update data của mình
CREATE POLICY "users_update_own" ON [table_name]
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Admin xem tất cả (nếu cần)
CREATE POLICY "admin_select_all" ON [table_name]
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );
```

---

## 🔄 PHẦN 8 — ROLLBACK PROTOCOL

> **Mọi thay đổi nguy hiểm phải có kế hoạch hoàn tác TRƯỚC khi thực thi.**

### 8.1 — Rollback Risk Matrix

```
RISK LEVEL — HIGH (phải có rollback plan trước khi làm):
  → Thay đổi database schema
  → Thay đổi auth flow / token structure
  → Thay đổi payment / billing logic
  → Deploy lên production sau thay đổi lớn
  → Upgrade major dependency version

RISK LEVEL — MEDIUM (nên có rollback plan):
  → Thay đổi API contract
  → Refactor logic core business
  → Thay đổi shared component quan trọng

RISK LEVEL — LOW (không cần rollback plan):
  → Thêm UI component mới độc lập
  → Fix typo, text, style
  → Thêm logging, monitoring
```

### 8.2 — Rollback Plan Template

```
ROLLBACK PLAN — [Task name] — [Ngày]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THAY ĐỔI SẼ THỰC HIỆN:
  [Mô tả thay đổi]

NẾU CÓ VẤN ĐỀ SAU DEPLOY:

BƯỚC 1 — Xác nhận lỗi (5 phút)
  □ Check logs: [Sentry / Vercel logs]
  □ Check DB: [Supabase logs]
  □ Check API: [response codes]

BƯỚC 2 — Rollback Code (nếu cần)
  git revert [commit-hash]
  git push origin main
  → Vercel auto-redeploy về version trước

BƯỚC 3 — Rollback Database (nếu schema đã đổi)
  -- Chạy DOWN migration:
  [SQL rollback script]

BƯỚC 4 — Verify sau rollback
  □ Test lại feature bị lỗi
  □ Test features liên quan
  □ Check logs sạch

ĐIỂM KHÔNG THỂ ROLLBACK (cần cẩn thận):
  → Data đã bị xóa (không recover được)
  → Email đã được gửi
  → Payment đã được xử lý
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🌿 PHẦN 9 — GIT DISCIPLINE

```
BRANCH STRATEGY:
  main           → production-ready, bảo vệ tuyệt đối
  dev            → integration branch (nếu dùng)
  feature/[name] → feature mới
  fix/[name]     → bug fix
  hotfix/[name]  → urgent production fix

COMMIT MESSAGE FORMAT:
  type(scope): mô tả ngắn

  type:  feat | fix | docs | style | refactor | test | chore | hotfix
  scope: auth | ui | db | api | payment | email | ...

  Ví dụ:
    feat(payment): thêm webhook handler SePay
    fix(auth): sửa redirect loop sau login
    docs(readme): cập nhật hướng dẫn deploy
    chore(deps): update resend từ 2.0 → 2.1 (patch only)

GIT RULES:
  □ KHÔNG push thẳng lên main
  □ KHÔNG force push lên main / dev
  □ KHÔNG commit file .env (verify bằng git status trước khi commit)
  □ KHÔNG commit node_modules, .next, __pycache__
  □ 1 commit = 1 mục đích rõ ràng, không gộp lung tung
  □ Commit message phải đủ để hiểu không cần đọc code

.gitignore BẮT BUỘC:
  .env
  .env.local
  .env.production
  node_modules/
  .next/
  __pycache__/
  *.pyc
  .DS_Store
```

---

## 🔒 PHẦN 10 — SECURITY PROTOCOL

```
┌─ ENV & SECRETS ─────────────────────────────────────────────┐
  □ .env* trong .gitignore — kiểm tra TRƯỚC commit đầu tiên
  □ .env.example có đủ keys với placeholder (không có value thật)
  □ NEXT_PUBLIC_ → chỉ cho value public, FE có thể thấy
  □ Secret keys (DB, API 3rd party) → chỉ ở BE, không bao giờ ở FE bundle
  □ Rotate secrets ngay nếu nghi ngờ bị lộ

├─ AUTHENTICATION ────────────────────────────────────────────┤
  □ Mọi route cần login → middleware verify token trước xử lý
  □ JWT: access token 15 phút, refresh token 7 ngày
  □ Refresh token rotate mỗi lần dùng (prevent replay attack)
  □ Không lưu access token trong localStorage (dùng httpOnly cookie)
  □ Session phải invalidate ngay khi logout
  □ Rate limit endpoint login/register (max 5 lần/phút per IP)

├─ INPUT VALIDATION ──────────────────────────────────────────┤
  □ Validate FE (Zod) VÀ validate BE (Pydantic/Zod) — cả 2 lớp
  □ Sanitize input trước khi lưu DB
  □ KHÔNG concat string thành SQL → dùng ORM hoặc parameterized query
  □ File upload: kiểm tra MIME type + size limit + sanitize filename
  □ Limit request body size (tránh DoS)

├─ API HARDENING ─────────────────────────────────────────────┤
  □ Rate limiting trên tất cả endpoints
  □ CORS: whitelist explicit domain, không để origin: *
  □ Security headers: X-Content-Type-Options, X-Frame-Options, CSP
  □ Error response cho client: generic message, không lộ stack trace
  □ Log đầy đủ ở server side để debug
  □ HTTPS only (Vercel tự handle, nhưng phải verify)

└─ SUPABASE SPECIFIC ─────────────────────────────────────────┘
  □ RLS BẬT ngay khi tạo table — không để trống
  □ Policy: user chỉ đọc/sửa/xóa data của mình
  □ service_role key → CHỈ dùng ở BE trusted server code
  □ anon key → quyền tối thiểu cần thiết
  □ KHÔNG expose Supabase URL + anon key trong server-side code
  □ Supabase Edge Functions: verify JWT trước khi xử lý
```

---

## 📐 PHẦN 11 — CODING STANDARDS

### 11.1 — Naming Convention

```
JAVASCRIPT / TYPESCRIPT:
  variables / functions  → camelCase        : getUserById, isLoggedIn, handleSubmit
  React components       → PascalCase       : UserCard, PaymentModal, DashboardLayout
  constants              → UPPER_SNAKE_CASE : MAX_FILE_SIZE, API_BASE_URL, ROLES
  TypeScript types       → PascalCase       : UserProfile, ApiResponse<T>, OrderStatus
  TypeScript enums       → PascalCase       : enum UserRole { ADMIN, USER }
  custom hooks           → use + PascalCase : useAuth, useOrders, useDebounce
  event handlers         → handle + Action  : handleSubmit, handleDelete, handleChange

FILES:
  Next.js pages          → kebab-case       : user-profile/page.tsx
  React components       → PascalCase       : UserCard.tsx, PaymentModal.tsx
  hooks                  → use-name.ts      : use-auth.ts, use-orders.ts
  utilities              → kebab-case       : format-date.ts, validate-email.ts
  constants              → kebab-case       : api-routes.ts, error-messages.ts

PYTHON:
  variables / functions  → snake_case       : get_user_by_id, is_authenticated
  classes                → PascalCase       : UserService, PaymentProcessor
  constants              → UPPER_SNAKE_CASE : MAX_RETRY_COUNT, DATABASE_URL
  files                  → snake_case       : user_service.py, auth_middleware.py

DATABASE:
  tables                 → snake_case plural : users, order_items, product_reviews
  columns                → snake_case        : created_at, user_id, is_verified
  indexes                → idx_table_column  : idx_users_email, idx_orders_user_id
  foreign keys           → fk_table_ref      : fk_orders_user_id

ENV VARS:
  tất cả                 → UPPER_SNAKE_CASE : DATABASE_URL, NEXT_PUBLIC_API_URL
  Next.js public         → NEXT_PUBLIC_     : NEXT_PUBLIC_SUPABASE_URL
```

### 11.2 — TypeScript Standards

```typescript
// ✅ ĐÚNG — Strict typing
interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
  phone?: string  // optional rõ ràng
}

// ✅ ĐÚNG — Generic API response type
interface ApiResponse<T> {
  data: T | null
  error: string | null
  meta?: { total: number; page: number }
}

// ✅ ĐÚNG — Enum cho fixed values
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator'
}

// ❌ SAI — Không dùng any
const processData = (data: any) => {}

// ❌ SAI — Không dùng type assertion vô tội vạ
const user = response as User

// ✅ ĐÚNG — Type guard
const isUser = (obj: unknown): obj is User => {
  return typeof obj === 'object' && obj !== null && 'id' in obj
}
```

### 11.3 — Error Handling Standards

```typescript
// ════════════ FRONTEND API CALL ════════════
async function fetchUser(userId: string): Promise<ApiResponse<User>> {
  try {
    const res = await fetch(`/api/users/${userId}`, {
      headers: { 'Content-Type': 'application/json' }
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || `HTTP ${res.status}`)
    }
    const data: ApiResponse<User> = await res.json()
    return data
  } catch (error) {
    console.error('[fetchUser]', { userId, error })
    return { data: null, error: 'Không thể tải thông tin. Vui lòng thử lại.' }
  }
}

// ════════════ FRONTEND UI — 3 STATES ════════════
function UserList() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers()
  })

  if (isLoading) return <LoadingSpinner label="Đang tải..." />
  if (error) return <ErrorMessage message="Lỗi tải dữ liệu" onRetry={refetch} />
  if (!data?.length) return <EmptyState message="Chưa có người dùng" />

  return <ul>{data.map(u => <UserCard key={u.id} user={u} />)}</ul>
}

// ════════════ BACKEND FASTAPI ════════════
@router.get("/users/{user_id}", response_model=ApiResponse[UserSchema])
async def get_user(
  user_id: str,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(require_auth)
):
    try:
        user = await UserService.get_by_id(db, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")
        return ApiResponse(data=UserSchema.from_orm(user), error=None)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[GET /users/{user_id}] error={e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Lỗi hệ thống")
```

---

## 🚫 PHẦN 12 — FORBIDDEN PATTERNS

> **Các pattern SAI theo từng stack — tuyệt đối không viết dù code "có vẻ chạy được".**

### 12.1 — React / Next.js Forbidden

```typescript
// ❌ FORBIDDEN — Mutate state trực tiếp
state.items.push(item)
state.user.name = 'New'

// ❌ FORBIDDEN — async trong useEffect
useEffect(async () => { await fetchData() }, [])

// ❌ FORBIDDEN — Missing cleanup (memory leak)
useEffect(() => {
  const interval = setInterval(fn, 1000)
  // không return cleanup
}, [])

// ❌ FORBIDDEN — useEffect dependency thiếu
useEffect(() => {
  processUser(userId)  // userId không có trong deps
}, [])  // → stale closure bug

// ❌ FORBIDDEN — Key là index trong list có thể thay đổi
items.map((item, index) => <Item key={index} />)

// ❌ FORBIDDEN — Fetch data trong vòng lặp (N+1)
users.forEach(async (user) => {
  const orders = await fetchOrders(user.id)  // N lần fetch!
})

// ❌ FORBIDDEN — Dùng window/document ở top level (SSR crash)
const width = window.innerWidth  // crash ở server

// ❌ FORBIDDEN — any type
const data: any = await fetch(...)

// ❌ FORBIDDEN — Gọi hook có điều kiện
if (user) {
  const data = useQuery(...)  // hooks không được trong conditional
}

// ✅ ĐÚNG — Tất cả patterns trên
setState(prev => ({ ...prev, items: [...prev.items, item] }))

useEffect(() => {
  let cancelled = false
  const load = async () => {
    const data = await fetchData()
    if (!cancelled) setData(data)
  }
  load()
  return () => { cancelled = true }
}, [userId])

items.map(item => <Item key={item.id} />)
```

### 12.2 — Next.js 15 App Router Forbidden

```typescript
// ❌ FORBIDDEN — 'use client' không cần thiết (tăng bundle)
'use client'
// Component chỉ hiển thị static content, không cần client

// ❌ FORBIDDEN — Fetch trong component không dùng cache
async function Page() {
  const data = await fetch('https://api.example.com/data')  // no-store mặc định
}

// ❌ FORBIDDEN — params không await trong Next.js 15
export default function Page({ params }) {
  const { id } = params  // Next.js 15: params là Promise, phải await
}

// ✅ ĐÚNG — Next.js 15
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await fetch(`/api/items/${id}`, {
    next: { revalidate: 60 }  // cache 60s
  })
}

// ❌ FORBIDDEN — Route Handler trả về raw Response sai
export async function GET() {
  return { data: 'hello' }  // KHÔNG phải Response object
}

// ✅ ĐÚNG
export async function GET() {
  return Response.json({ data: 'hello' })
}
```

### 12.3 — Supabase Forbidden

```typescript
// ❌ FORBIDDEN — service_role key ở frontend
const supabase = createClient(URL, SERVICE_ROLE_KEY)  // NGUY HIỂM

// ❌ FORBIDDEN — Gọi DB không có RLS check
const { data } = await supabase.from('users').select('*')  // trả về ALL users

// ❌ FORBIDDEN — Không handle Supabase error
const { data } = await supabase.from('users').select()
// bỏ qua error!

// ✅ ĐÚNG
const { data, error } = await supabase
  .from('users')
  .select('id, name, email')  // chỉ lấy field cần thiết
  .eq('id', userId)            // filter đúng user (RLS backup)
if (error) throw new Error(error.message)

// ❌ FORBIDDEN — Realtime subscription không unsubscribe
useEffect(() => {
  const channel = supabase.channel('orders').on('postgres_changes', ...)
  channel.subscribe()
  // không cleanup!
}, [])

// ✅ ĐÚNG
useEffect(() => {
  const channel = supabase.channel('orders')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, handler)
    .subscribe()
  return () => { supabase.removeChannel(channel) }
}, [])
```

### 12.4 — FastAPI Forbidden

```python
# ❌ FORBIDDEN — Sync function trong async route
@router.get("/users")
async def get_users(db: Session = Depends(get_db)):  # dùng Session, không phải AsyncSession
    users = db.query(User).all()  # blocking operation trong async context

# ❌ FORBIDDEN — Return raw model (bypass serialization)
@router.get("/users/{id}")
async def get_user(user_id: str, db: AsyncSession = Depends(get_db)):
    user = await db.get(User, user_id)
    return user  # trả về SQLAlchemy model trực tiếp

# ❌ FORBIDDEN — Không validate input
@router.post("/users")
async def create_user(name: str, email: str):  # không dùng Pydantic schema
    pass

# ✅ ĐÚNG
@router.post("/users", response_model=ApiResponse[UserSchema], status_code=201)
async def create_user(
    body: UserCreateSchema,  # Pydantic validates tự động
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_auth)
):
    user = await UserService.create(db, body)
    return ApiResponse(data=UserSchema.model_validate(user), error=None)
```

---

## ⚡ PHẦN 13 — PERFORMANCE BUDGET

```
FRONTEND PERFORMANCE BUDGETS:
  Bundle size (initial JS)    : < 200KB gzipped
  Largest Contentful Paint    : < 2.5s
  First Input Delay            : < 100ms
  Cumulative Layout Shift      : < 0.1
  Lighthouse Score            : ≥ 85 (Performance)
  Image size (per image)      : < 500KB (WebP format)

RULES:
  □ Dùng next/image cho tất cả ảnh — không dùng <img> raw
  □ Code splitting: dynamic import cho heavy components
  □ Lazy load: components dưới fold
  □ Font: chỉ load font-weight thực sự dùng
  □ KHÔNG import toàn bộ thư viện khi chỉ dùng 1 function:
    ❌ import _ from 'lodash'
    ✅ import debounce from 'lodash/debounce'
  □ useCallback/useMemo cho expensive operations
  □ React.memo cho components re-render nhiều

BACKEND PERFORMANCE:
  □ Không trả về toàn bộ bảng — luôn có pagination
  □ SELECT chỉ columns cần thiết — không SELECT *
  □ Index cho columns thường dùng trong WHERE, JOIN, ORDER BY
  □ Avoid N+1 query — dùng JOIN hoặc batch
  □ Connection pooling (Supabase mặc định có)
  □ Cache kết quả expensive query (Upstash Redis)
```

---

## 🔄 PHẦN 14 — WORKFLOW & OUTPUT FORMAT

### 14.1 — Quy trình bắt đầu task mới

```
BƯỚC 1 — Anh cung cấp context
  Paste PROJECT CONTEXT BLOCK (Phần 4.1)
  Paste code hiện tại của file liên quan (nếu có)
  Mô tả rõ task: "Tôi cần [làm gì] ở [đâu] để đạt [kết quả gì]"

BƯỚC 2 — AI đi qua AI Thinking Protocol (Phần 1)
  Sau bước Think, AI reply:
  "Tôi hiểu. Impact Zone: [list]. Rủi ro: [nếu có]. Tiến hành?"
  Nếu có conflict → báo cáo format Điều 8

BƯỚC 3 — Anh approve Impact Zone
  → Anh nói "ok" hoặc "tiến hành" → AI code

BƯỚC 4 — AI code + output theo format 14.2

BƯỚC 5 — Anh review + test
  → Nếu ok: cập nhật CHANGELOG + FILE-REGISTRY
  → Nếu lỗi: báo lại, AI fix đúng scope
```

### 14.2 — OUTPUT REPORT FORMAT (BẮT BUỘC sau mỗi task)

```
╔══════════════════════════════════════════════════════════════╗
║  ✅ HOÀN THÀNH — [Tên task ngắn gọn]                         ║
╚══════════════════════════════════════════════════════════════╝

📝 ĐÃ LÀM:
   • [Mô tả cụ thể 1]
   • [Mô tả cụ thể 2]

📁 FILE THAY ĐỔI:
   [+] /path/to/new-file.ts      → [mục đích]
   [~] /path/to/changed-file.tsx → [thay đổi gì]
   [-] /path/to/deleted-file.ts  → [lý do xóa]

🗄️ DATABASE (nếu có):
   Migration: [NNN_description.sql]
   Thay đổi : [Mô tả]
   Rollback : [DOWN script sẵn trong file]

🔑 ENV VARS MỚI (nếu có):
   NEW_VAR_NAME=      → [mục đích, ví dụ: API key SePay]

🧪 TEST NHANH:
   [Lệnh cụ thể hoặc bước test step-by-step]

⚠️ LƯU Ý / RỦI RO:
   [Điều cần biết — hoặc "Không có"]

🔍 PHÁT HIỆN NGOÀI SCOPE (chưa sửa):
   [Bug/issue thấy nhưng không trong task — hoặc "Không có"]
   → Xử lý trong task riêng nếu cần

📋 BƯỚC TIẾP THEO ĐỀ XUẤT:
   [Việc hợp lý để làm tiếp — hoặc "Không có"]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🚨 PHẦN 15 — RED LINES (TUYỆT ĐỐI KHÔNG LÀM)

```
🔴 KHÔNG BAO GIỜ — ZERO EXCEPTION — BẤT KỲ LÝ DO NÀO:

01. Xóa / DROP table hoặc column khi không được yêu cầu tường minh
02. Chạy DELETE FROM, TRUNCATE không có WHERE trên production
03. Thay đổi cấu trúc Auth (token, session, flow) khi không được yêu cầu
04. Xóa file đang được import ở nơi khác → gây broken build
05. Rename biến/function/table mà không update hết nơi dùng
06. Để API key / secret trong source code (kể cả trong comment)
07. Commit file .env thật lên git
08. Upgrade major version dependency khi đang code feature
09. Sửa file ngoài scope task (kể cả "nhân tiện cải thiện")
10. Thay đổi logic payment/billing/subscription chưa có test plan
11. Xóa/sửa migration file đã được chạy
12. Bỏ qua PRE-CODE hoặc POST-CODE checklist
13. Assume thay vì đọc code thật hoặc hỏi khi không rõ
14. Tự resolve conflict mà không báo cáo cho anh Thiện
15. Output code chưa tự review
16. Để broken import/export tồn tại dù chỉ tạm thời
17. Dùng service_role key ở frontend
18. Tắt TypeScript strict mode để "cho qua lỗi"
19. Dùng any type thay vì viết type đúng
20. Deploy lên production mà chưa test build locally
```

---

## 🏁 PHẦN 16 — PRODUCTION READINESS CHECKLIST

> **Chỉ ship khi PASS 100% — không có ô nào để trống hoặc "skip"**

```
PRODUCTION READINESS — [Tên Dự Án] — [YYYY-MM-DD]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CODE QUALITY
  □ npx tsc --noEmit → 0 errors (TypeScript strict)
  □ npm run lint → 0 errors, 0 warnings
  □ npm run build → build thành công, 0 errors
  □ Không có console.log rác
  □ Không có TODO / FIXME / HACK chưa resolve
  □ Không có unused imports / variables
  □ Không có hardcoded credentials / secrets
  □ Không có any type (trừ edge case có comment lý do)

FUNCTIONALITY
  □ Tất cả features yêu cầu hoạt động đúng
  □ Edge cases xử lý: null, undefined, empty array, 0, ""
  □ Loading / Error / Empty state đầy đủ mọi component
  □ Form validation đúng (FE + BE)
  □ Mobile responsive tất cả screens (375px → 1440px)
  □ Cross-browser: Chrome, Safari, Firefox

SECURITY
  □ git status → không có file .env nào staged
  □ .env.example đủ tất cả keys
  □ Supabase RLS bật cho tất cả tables
  □ Tất cả route cần auth đã protected
  □ Input validation FE (Zod) + BE (Pydantic)
  □ Không expose internal error message ra client
  □ Rate limiting trên auth endpoints

PERFORMANCE
  □ Lighthouse Performance ≥ 85
  □ Images dùng next/image, format WebP
  □ Không có N+1 query
  □ API response không trả dư data
  □ Bundle size initial JS < 200KB gzipped

DATA INTEGRITY
  □ Migration đã test trên dev/staging
  □ Migration có DOWN script
  □ schema.sql snapshot đã update
  □ Không có data cũ bị mất sau migration

DOCUMENTATION
  □ README: setup instructions đầy đủ
  □ CHANGELOG: version mới đã ghi
  □ FILE-REGISTRY: cập nhật file mới/đổi
  □ DEPENDENCY-MAP: cập nhật nếu có thay đổi
  □ .env.example: đủ tất cả vars

DEPLOYMENT
  □ ENV vars đã set đúng trên Vercel / hosting
  □ Database migration đã chạy trên production
  □ Test manual trên production URL sau deploy
  □ Logs sạch (không có error mới)
  □ Rollback plan sẵn sàng nếu có vấn đề
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ PASS HẾT → SHIP IT
❌ CÒN Ô TRỐNG → KHÔNG SHIP — FIX TRƯỚC
```

---

## ⚡ PHẦN 17 — QUICK REFERENCE

### 17.1 — Commands thiết yếu

```bash
# ── FRONTEND ──────────────────────────────────
npm run dev              # Dev server
npm run build            # Build check trước deploy
npm run lint             # Lint check
npx tsc --noEmit         # TypeScript check (0 errors = pass)

# ── SUPABASE ──────────────────────────────────
npx supabase db push     # Chạy migration
npx supabase db reset    # Reset DB về migration gốc (dev only)
npx supabase gen types typescript --local > types/supabase.ts

# ── DEPLOY ────────────────────────────────────
vercel                   # Preview deploy
vercel --prod            # Production deploy

# ── BACKEND (Python) ──────────────────────────
uvicorn main:app --reload           # Dev server
python -m mypy . --ignore-missing-imports  # Type check
python -m pytest tests/ -v         # Run tests

# ── GIT ───────────────────────────────────────
git status               # Kiểm tra trước commit
git log --oneline -10    # Xem 10 commit gần nhất
git diff HEAD            # Xem thay đổi hiện tại
git stash                # Lưu tạm thay đổi chưa commit
```

### 17.2 — Patterns hay bị nhầm

```typescript
// ─── 1. STATE MUTATION ──────────────────────────
// ❌ SAI
state.items.push(item)
state.user.name = 'New'

// ✅ ĐÚNG
setState(prev => ({ ...prev, items: [...prev.items, item] }))
setState(prev => ({ ...prev, user: { ...prev.user, name: 'New' } }))

// ─── 2. ASYNC IN useEffect ────────────────────────
// ❌ SAI
useEffect(async () => { await fetchData() }, [])

// ✅ ĐÚNG
useEffect(() => {
  let cancelled = false
  const load = async () => {
    const data = await fetchData()
    if (!cancelled) setData(data)
  }
  load()
  return () => { cancelled = true }
}, [userId])

// ─── 3. CLEANUP ───────────────────────────────────
// ❌ SAI — Memory leak
useEffect(() => {
  const interval = setInterval(poll, 5000)
}, [])

// ✅ ĐÚNG
useEffect(() => {
  const interval = setInterval(poll, 5000)
  return () => clearInterval(interval)
}, [])

// ─── 4. API RESPONSE ─────────────────────────────
// ❌ SAI — Crash nếu lỗi
const data = await fetch('/api/users').then(r => r.json())

// ✅ ĐÚNG
const res = await fetch('/api/users')
if (!res.ok) throw new Error(`HTTP ${res.status}`)
const { data, error } = await res.json()
if (error) throw new Error(error)

// ─── 5. OPTIONAL CHAINING ────────────────────────
// ❌ SAI — Crash nếu null
const name = user.profile.address.city

// ✅ ĐÚNG
const name = user?.profile?.address?.city ?? 'Chưa có địa chỉ'

// ─── 6. Next.js 15 PARAMS ────────────────────────
// ❌ SAI — Next.js 15 params là Promise
export default function Page({ params }) {
  const { id } = params
}

// ✅ ĐÚNG
export default async function Page({
  params
}: { params: Promise<{ id: string }> }) {
  const { id } = await params
}

// ─── 7. SUPABASE QUERY ───────────────────────────
// ❌ SAI — Bỏ qua error
const { data } = await supabase.from('users').select()

// ✅ ĐÚNG
const { data, error } = await supabase
  .from('users')
  .select('id, name, email')
  .eq('user_id', userId)
if (error) throw new Error(error.message)
```

### 17.3 — Cấu trúc thư mục chuẩn

```
project-root/
├── docs/
│   ├── FILE-REGISTRY.md       ← Cập nhật mỗi khi thêm/đổi file
│   ├── CHANGELOG.md           ← Cập nhật mỗi khi deploy
│   ├── DEPENDENCY-MAP.md      ← Impact map giữa modules
│   └── ARCHITECTURE.md        ← Sơ đồ hệ thống
│
├── frontend/ (hoặc root nếu Next.js monorepo)
│   ├── app/
│   │   ├── (auth)/            → Route group auth pages
│   │   ├── (dashboard)/       → Route group authenticated pages
│   │   ├── api/               → Next.js API routes (nếu dùng)
│   │   ├── globals.css
│   │   └── layout.tsx         → Root layout
│   ├── components/
│   │   ├── ui/                → shadcn/ui — KHÔNG sửa trực tiếp
│   │   ├── layout/            → Header, Footer, Sidebar, Nav
│   │   └── features/          → Feature-based: /auth /dashboard /payment
│   ├── hooks/                 → Custom hooks
│   ├── lib/
│   │   ├── api.ts             → API client — tất cả fetch ở đây
│   │   ├── constants.ts       → TẤT CẢ constants
│   │   ├── utils.ts           → Helper functions
│   │   ├── validations.ts     → Zod schemas
│   │   └── supabase.ts        → Supabase browser client
│   ├── types/
│   │   └── index.ts           → TẤT CẢ types — single source of truth
│   ├── .env.local             → gitignored
│   └── .env.example           → committed, đầy đủ keys
│
├── backend/ (nếu dùng FastAPI)
│   ├── api/
│   │   ├── routes/            → auth.py, users.py, payments.py
│   │   └── middleware/        → auth.py, rate_limit.py, logging.py
│   ├── models/                → SQLAlchemy ORM models
│   ├── schemas/               → Pydantic request/response schemas
│   ├── services/              → Business logic — tách khỏi routes
│   ├── database/
│   │   ├── schema.sql         → Snapshot schema hiện tại
│   │   └── migrations/        → 001_init.sql, 002_add_roles.sql, ...
│   ├── utils/                 → Helpers
│   ├── tests/                 → pytest tests
│   ├── .env                   → gitignored
│   └── .env.example           → committed
│
├── .env.example               → Root (nếu monorepo)
├── .gitignore                 → .env, node_modules, .next, __pycache__
└── README.md                  → Setup guide đầy đủ
```

---

```
╔══════════════════════════════════════════════════════════════════════════╗
║  THIỆN VUA APP — CODING RULES v3.0 FINAL EDITION                        ║
║  17 Phần | 20 Red Lines | 15 Điều Luật | 5 Thinking Steps               ║
║                                                                          ║
║  "Code đúng ngay từ đầu. Môi trường độc lập. Data toàn vẹn."           ║
║  "Làm đầu này không hỏng đầu kia. Ship hoàn chỉnh rồi mới bán."        ║
║                                                                          ║
║  Mục tiêu: $100M Ecosystem — mọi dòng code phải xứng tầm đó.           ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

## 🎯 PHẦN 18 — HƯỚNG DẪN SỬ DỤNG SKILL NÀY

### Cách dùng đúng

```
CÁCH 1 — Paste vào đầu mỗi phiên code (khuyến nghị):
  → Copy toàn bộ file này
  → Paste vào đầu chat trước khi giao task
  → AI sẽ reply xác nhận (Phần 0)
  → Sau đó paste PROJECT CONTEXT BLOCK (Phần 4.1)
  → Bắt đầu làm việc

CÁCH 2 — Lưu vào docs/ dự án:
  → Lưu file này tại: docs/CODING-RULES.md
  → Khi bắt đầu phiên: "Đọc docs/CODING-RULES.md và tuân thủ"
  → Paste PROJECT CONTEXT BLOCK
  → Làm việc

CÁCH 3 — System prompt (nếu dùng API):
  → Paste nội dung file này vào system prompt
  → AI sẽ tự động tuân thủ mọi phiên
```

### Thứ tự paste khi bắt đầu phiên mới

```
BƯỚC 1: Paste file CODING-RULES này
BƯỚC 2: Paste PROJECT CONTEXT BLOCK
BƯỚC 3: Paste code file liên quan (nếu có)
BƯỚC 4: Nêu task cụ thể
BƯỚC 5: Đợi AI xác nhận Impact Zone → approve → AI code
```

### Khi nào cần update skill này

```
→ Stack mới thêm vào dự án (ví dụ: thêm Redis, thêm n8n)
→ Phát hiện lỗi pattern mới chưa có trong Phần 12
→ Thêm quy trình deploy mới
→ Thêm thành viên team (cần thêm rules về collaboration)
```

---

```
╔══════════════════════════════════════════════════════════════════════════╗
║  THIỆN VUA APP — CODING RULES v3.0 FINAL EDITION                        ║
║  18 Phần | 20 Red Lines | 15 Điều Luật | 5 Thinking Steps               ║
║  Anti-Bug x20 | Forbidden Patterns x4 Stack | Full Rollback Protocol    ║
║                                                                          ║
║  "Code đúng ngay từ đầu. Môi trường độc lập. Data toàn vẹn."           ║
║  "Làm đầu này không hỏng đầu kia. Ship hoàn chỉnh rồi mới bán."        ║
║  "Tuân thủ rulebook = bảo vệ $100M ecosystem."                          ║
╚══════════════════════════════════════════════════════════════════════════╝
```
