# CLAUDE.md — BỘ QUY TẮC CODE NGHIÊM NGẶT v3.0 (THIỆN VUA APP)

> Luật tối cao cho MỌI dự án code. Vi phạm bất kỳ điều nào = sản phẩm KHÔNG được tính là hoàn thành.
> File này là BẢN ĐẦY ĐỦ DUY NHẤT — gồm Luật hành vi + Ngữ cảnh dự án + Quy trình. Không còn file phụ lục rời.

---

## ⚠️ ĐỌC TRƯỚC TIÊN — KHÔNG ĐƯỢC BỎ QUA

**Claude BẮT BUỘC đọc toàn bộ file CLAUDE.md này từ đầu đến cuối TRƯỚC KHI viết dòng code đầu tiên của BẤT KỲ task nào trong dự án.**
Không đọc đủ = không được code. Đọc lướt rồi code mù = vi phạm Mục 0 và Mục 1 ngay từ gốc.
Nếu task hiện tại không liên quan tới phần nào (vd dự án chưa có payment) → vẫn phải đọc qua để biết phần đó tồn tại và áp dụng khi cần, không bỏ qua vì "chắc không cần".

---

## MỤC LỤC

- **0.** Nguyên tắc tối thượng
- **0.5** Onboarding Gate — Cổng đọc hiểu bắt buộc trước khi code
- **1.** Spec Lock — chống sai lệch yêu cầu
- **2.** An toàn dữ liệu
- **3.** Kỷ luật phạm vi
- **4.** Quy trình bắt buộc + Self-Audit Gate
- **5.** Chuẩn code sạch
- **6.** Kiến trúc & stack mặc định
- **7.** Bảo mật nâng cao
- **8.** Xử lý lỗi runtime & sai logic
- **9.** Idempotency & Concurrency
- **10.** Testing & xác minh
- **11.** Git & version control
- **12.** Tách môi trường (Dev/Staging/Production)
- **13.** UI/UX
- **14.** Hiệu suất
- **15.** Documentation
- **16.** Incident Response & Rollback
- **17.** Mục tiêu dự án (Project North Star)
- **18.** Cấu trúc thư mục chính
- **19.** Quy tắc viết code & đặt tên (Naming Conventions)
- **20.** Lệnh Install / Dev / Build / Test
- **21.** Quy trình Research → Plan → Execute → Review
- **22.** Chia task lớn thành module nhỏ (Task Decomposition)
- **23.** Definition of Done — cổng chặn cuối (ALL-OR-NOTHING)
- **24.** Anti-patterns — tuyệt đối cấm
- **25.** Tự báo cáo lệch (bắt buộc)

---

## 0. NGUYÊN TẮC TỐI THƯỢNG

1. CHỈ làm đúng cái được yêu cầu — không thêm, không bớt, không "tiện thì làm luôn".
2. KHÔNG xoá file/code/dữ liệu tài liệu nếu không được yêu cầu rõ ràng bằng từ "xoá".
3. KHÔNG tạo dữ liệu giả/rác/không liên quan vào code hoặc DB thật.
4. KHÔNG sửa logic/code không liên quan đến yêu cầu hiện tại.
5. KHÔNG ghi đè file/config đang chạy ổn định mà không backup.
6. MỌI thay đổi phải có đường lùi (rollback).
7. Không chắc → hỏi 1 câu duy nhất, không đoán bừa rồi làm sai hướng.

---

## 0.5 ONBOARDING GATE — CỔNG ĐỌC HIỂU BẮT BUỘC TRƯỚC KHI CODE

> Đây là cổng chặn đầu tiên, đứng trước mọi mục khác. Không qua cổng này thì không được phép mở editor.

**Trước khi viết dòng code đầu tiên của bất kỳ task nào, Claude phải tự xác nhận ĐÃ ĐỌC và hiểu:**

- [ ] Mục 17 (Mục tiêu dự án) — task này phục vụ North Star nào, có rơi vào "không phải mục tiêu" không.
- [ ] Mục 6 + Mục 18 (Tech stack & cấu trúc thư mục) — biết code đặt ở đâu, dùng công nghệ gì, không tự sáng tạo cấu trúc lệch.
- [ ] `docs/architecture.md` và `docs/db-schema.md` (nếu task đụng luồng dữ liệu/schema) — không suy luận schema từ trí nhớ.
- [ ] Code hiện tại của module liên quan trực tiếp — đọc thật, không lướt, đặc biệt các hàm/service sẽ bị gọi hoặc bị ảnh hưởng.
- [ ] Các quyết định kiến trúc cũ trong `docs/decisions/` liên quan vùng code sắp sửa — tránh đi ngược quyết định đã chốt mà không biết.
- [ ] Nếu tích hợp dịch vụ ngoài (Supabase, SePay, Claude API, github, paypal, visa, thanh toán quốc tế, Google AI Studio...) — đã tra docs chính thức bản mới nhất, không dùng kiến thức cũ có thể đã lỗi thời.

**Nếu CHƯA đọc đủ:** Claude phải nói rõ "chưa đủ context, cần xem [X] trước khi code" — KHÔNG code trước rồi vừa làm vừa dò.

**Sau khi đọc xong:** Claude phải tóm tắt ngắn (3–5 dòng) những gì đã hiểu về task, trước khi vào bước PLAN (Mục 21) — để được xác nhận hiểu đúng trước khi tốn thời gian code sai hướng.

---

## 1. SPEC LOCK — CHỐNG SAI LỆCH YÊU CẦU (QUAN TRỌNG NHẤT)

- Yêu cầu gốc của người dùng là **bất biến** trong suốt task. Không tự diễn giải lại, không tự "hiểu theo ý mình" rồi đổi hướng.
- Trước khi code: viết lại yêu cầu thành **danh sách tiêu chí chấp nhận (acceptance criteria)** ngắn — đây là "thước đo" để tự đối chiếu sau khi xong.
- Sau khi code xong: **đối chiếu từng tiêu chí một** với kết quả thực tế. Tiêu chí nào KHÔNG đạt → phải nêu rõ, không giấu, không tự ý bỏ qua.
- Nếu trong lúc code phát hiện yêu cầu gốc có vấn đề (không khả thi, mâu thuẫn, thiếu thông tin) → **dừng lại, báo cáo, đề xuất hướng**, không tự ý đổi yêu cầu rồi code theo hướng khác mà không nói.
- Cấm tuyệt đối: âm thầm đổi phạm vi (scope creep hoặc scope cắt) mà không thông báo.

---

## 2. AN TOÀN DỮ LIỆU

- Không migration nào được DROP TABLE / DROP COLUMN / TRUNCATE / DELETE hàng loạt trừ khi được yêu cầu đúng từ đó. Mặc định soft-delete (`deleted_at`, `is_active`).
- Trước khi đổi schema: liệt kê bảng nào ảnh hưởng, dữ liệu nào có rủi ro mất, có cần backup không.
- Mọi thao tác ghi nhiều bảng → dùng transaction (`BEGIN...COMMIT`), lỗi 1 chỗ rollback toàn bộ.
- Validate input ở CẢ client và server, không tin dữ liệu từ client.
- Bật Row Level Security (RLS) cho mọi bảng có dữ liệu người dùng trên Supabase — không có ngoại lệ "tắt tạm để test".
- Backup trước khi: migration lớn, đổi cấu trúc bảng chính, deploy liên quan thanh toán.
- Log đầy đủ (audit log) mọi thao tác xoá/sửa dữ liệu quan trọng: ai, khi nào, sửa gì, từ giá trị gì sang giá trị gì.

---

## 3. KỶ LUẬT PHẠM VI

- Không tự thêm: thư viện, bảng DB, biến môi trường, endpoint, tính năng — nếu yêu cầu không cần.
- Không "refactor luôn cho gọn" trừ khi được yêu cầu.
- Phát hiện vấn đề ngoài phạm vi (bug khác, rủi ro khác) → báo cáo, KHÔNG tự sửa.

---

## 4. QUY TRÌNH BẮT BUỘC + SELF-AUDIT GATE

**Trước khi code:**

1. Đọc hiểu toàn bộ codebase liên quan — không sửa mù (xem Mục 0.5 Onboarding Gate).
2. Viết acceptance criteria từ yêu cầu (theo Mục 1).
3. Xác định input/output, edge case, dữ liệu bị ảnh hưởng.

**Trong khi code:** 4. Xong 1 phần → tự kiểm tra logic trước khi sang phần tiếp. 5. Viết production-ready ngay từ đầu, không viết tạm. 6. Mọi hàm xử lý dữ liệu quan trọng phải có try/catch, không để lỗi nuốt im lặng.

**SELF-AUDIT GATE (bắt buộc, không được bỏ qua bước nào):** 7. Đối chiếu code với từng acceptance criteria — pass/fail rõ từng dòng. 8. Chạy thử thực tế (nếu chạy được) — không giao code chưa từng chạy qua. 9. Kiểm tra: không file rác, không code debug sót, không secret lộ, không logic thừa. 10. Kiểm tra ảnh hưởng chéo: thay đổi này có làm hỏng phần khác trong hệ thống không. 11. Nếu có ÍT NHẤT 1 tiêu chí fail hoặc 1 rủi ro chưa xử lý → KHÔNG được báo "xong", phải nêu rõ trong báo cáo giao việc.

---

## 5. CHUẨN CODE SẠCH (CHỐNG CODE RÁC)

- Naming rõ nghĩa, nhất quán. Cấm `temp`, `data2`, `test123`, `foo`, `asdf`.
- Mỗi hàm làm 1 việc. Hàm >50 dòng hoặc độ phức tạp cao (nhiều nhánh if/else lồng) → bắt buộc tách nhỏ.
- DRY — logic dùng ≥2 lần phải tách hàm/module chung, không copy-paste.
- Không để: import không dùng, biến không dùng, code comment-out còn sót, hàm chết (không ai gọi).
- Không duplicate logic giữa nhiều file (2 nơi cùng xử lý 1 việc theo 2 cách khác nhau = lỗi nghiêm trọng).
- Bắt buộc format chuẩn (Prettier/Black/ESLint nếu có) trước khi giao.
- Comment giải thích "tại sao", không giải thích lại "cái gì" code đã tự nói.
- Không magic number/string — đưa vào constant/config có tên rõ.
- Cấm `// TODO: fix later` trong bản giao cuối cùng. Chưa xong = chưa tính hoàn thành.

---

## 6. KIẾN TRÚC & STACK MẶC ĐỊNH

- Backend/DB: Supabase (Postgres + RLS + Auth + Storage).
- Deploy: Vercel, GitHub, Hostinger (khi cần VPS).
- AI: Google AI Studio (Gemini) / Claude API — ghi rõ model dùng cho từng dự án, không hardcode model string rải rác nhiều nơi.
- Thanh toán: SePay — thanh toán quốc tế, visa, mastercart, paypal, **KHÔNG hỗ trợ recurring billing tự động**. Thiết kế subscription phải có cơ chế nhắc/gia hạn thủ công hoặc webhook tự xây, không giả định auto-charge.
- Ngôn ngữ: Python, JavaScript/Node.js.
- Cấu trúc: 1 file gọn cho dự án nhỏ; tách module rõ theo chức năng khi dự án lớn. Không file nào >500 dòng.
- Secrets nằm trong `.env`, không hardcode. Có `.env.example` không chứa giá trị thật.
- Package manager: chỉ dùng 1 loại nhất quán trong cả dự án (npm hoặc pnpm hoặc yarn hoặc pip) — không trộn lockfile.

---

## 7. BẢO MẬT NÂNG CAO

- Validate & sanitize toàn bộ input — chống SQL injection, XSS, CSRF.
- Không commit `.env`/secret lên GitHub — `.gitignore` chuẩn ngay từ đầu.
- Auth dùng Supabase Auth chuẩn, không tự chế hệ thống mật khẩu/token trừ khi bắt buộc.
- Rate limiting cho mọi API public.
- Phân quyền role-based rõ ràng — user A không bao giờ động được dữ liệu user B.
- API response không trả dư dữ liệu hơn cần (tránh rò rỉ thông tin nội bộ).
- HTTPS bắt buộc mọi domain production.
- **Payment security:** không lưu thông tin thẻ thô trên server của mình (PCI-DSS), chỉ lưu token/reference từ SePay và nhiều nền tảng thanh toán khác.
- **Webhook security:** verify signature/chữ ký của webhook trước khi xử lý, không tin payload không xác thực.
- Dependency: không thêm thư viện lạ chưa kiểm tra nguồn gốc/độ phổ biến; định kỳ kiểm tra lỗ hổng (`npm audit` / `pip-audit`).
- Không log thông tin nhạy cảm (password, token, số thẻ) ra console hoặc file log.

---

## 8. XỬ LÝ LỖI RUNTIME & SAI LOGIC (KHI CHẠY RA KẾT QUẢ SAI)

- Phân biệt rõ 2 loại lỗi: **lỗi chạy (crash/exception)** và **lỗi logic (chạy được nhưng kết quả sai yêu cầu)** — loại 2 nguy hiểm hơn vì dễ bị bỏ sót.
- Mọi tính năng xử lý dữ liệu/tính toán phải có ít nhất 1 test case lấy trực tiếp từ ví dụ trong yêu cầu gốc để so kết quả đầu ra.
- Nếu kết quả thực tế ≠ kết quả mong đợi → KHÔNG tự "sửa cho chạy được" theo hướng khác yêu cầu — phải báo rõ sai ở đâu, đề xuất cách sửa đúng hướng.
- Lỗi runtime (exception) → bắt buộc log đủ context (input gây lỗi, stack trace, thời điểm) để debug được, không để lỗi "biến mất" không dấu vết.
- Không bao giờ dùng fallback im lặng để che lỗi (ví dụ: lỗi thì trả về giá trị mặc định mà không báo) khi việc đó làm sai lệch dữ liệu/kết quả.

---

## 9. IDEMPOTENCY & CONCURRENCY (CHỐNG TRÙNG LẶP, CHỒNG CHÉO)

- Webhook (đặc biệt SePay) phải xử lý **idempotent** — gọi trùng 2 lần (do retry) không được tạo 2 giao dịch/2 lần cộng tiền và nhiều nền tảng thanh toán khác như visa, paypal, thanh toán quốc tế.
- Dùng unique constraint hoặc kiểm tra mã giao dịch đã xử lý trước khi ghi nhận thanh toán.
- Form submit/API quan trọng → chống double-submit (disable nút khi đang xử lý, hoặc idempotency key).
- 2 tiến trình cùng sửa 1 dữ liệu → dùng optimistic locking (version field) hoặc transaction lock, không để ai ghi sau thắng mà không kiểm tra.

---

## 10. TESTING & XÁC MINH

- Test happy path 100% thành công.
- Test edge case: input rỗng/null, sai định dạng, mất kết nối/API timeout, user không có quyền.
- Test case phải bám theo acceptance criteria (Mục 1), không test lan man.
- Thay đổi DB → test trên dữ liệu mẫu, không test trực tiếp trên dữ liệu/môi trường thật.
- Báo cáo rõ: đã test gì, chưa test được gì (do thiếu môi trường/data), rủi ro còn lại.

---

## 11. GIT & VERSION CONTROL

- Commit message rõ nghĩa, đúng nội dung thay đổi.
- Không commit code chưa chạy được lên main/production.
- Thay đổi lớn/rủi ro → làm trên branch riêng.
- Cấm `git push --force` lên main nếu không được yêu cầu rõ ràng.

---

## 12. TÁCH MÔI TRƯỜNG (DEV / STAGING / PRODUCTION)

- Không bao giờ test code mới trực tiếp trên database hoặc API key production.
- Mỗi môi trường có `.env` riêng, key riêng (đặc biệt key Supabase, SePay, paypal, visa, thanh toán quốc tế).
- Trước khi merge lên production: xác nhận đã test ổn ở staging/dev.
- Không bao giờ dùng dữ liệu khách hàng thật để test tính năng mới.

---

## 13. UI/UX

- Theme: Dark mode, glassmorphism, luxury tech/sci-fi premium.
- Màu chủ đạo: Đỏ - Vàng - Trắng - Đen - Xanh biển - Tím.
- Font: Be Vietnam Pro, Sora, Unbounded, Plus Jakarta Sans, Space Mono, JetBrains Mono. Cấm Inter, Arial, Roboto.
- Animation mượt, có chiều sâu, không giật/lag.
- Responsive đầy đủ, dễ dùng cho người dùng phổ thông, không chỉ đẹp cho dân kỹ thuật.
- Tiêu chuẩn hình ảnh/thiết kế: ngang tầm hoặc vượt Apple/Amazon — không chấp nhận UI mặc định/khuôn mẫu nhàm chán.

---

## 14. HIỆU SUẤT

- Không query thừa (N+1) — dùng join/batch.
- Lazy load hình ảnh/component nặng.
- Cache dữ liệu ít thay đổi.
- Tối ưu trước khi launch, không để "chạy được là xong" nếu ảnh hưởng UX rõ rệt.

---

## 15. DOCUMENTATION

- Mỗi dự án có `README.md`: mục đích, cách chạy local, biến môi trường cần thiết, lệnh deploy.
- API/endpoint quan trọng có comment/doc ngắn mô tả input/output.
- Không viết doc dài dòng vô nghĩa.

---

## 16. INCIDENT RESPONSE & ROLLBACK (KHI ĐÃ DEPLOY MÀ HỎNG)

- Mọi thay đổi liên quan DB/payment/auth khi deploy phải có sẵn **kế hoạch rollback cụ thể** (lệnh/cách quay lại bản trước) trước khi deploy, không phải nghĩ sau khi hỏng.
- Phát hiện lỗi production nghiêm trọng (mất dữ liệu, sai tiền, lộ thông tin) → ưu tiên **rollback/khoá tính năng ngay**, sau đó mới tìm nguyên nhân.
- Sau sự cố: ghi lại nguyên nhân gốc (root cause) + cách đã khắc phục, để không lặp lại.

---

## 17. MỤC TIÊU DỰ ÁN (PROJECT NORTH STAR)

> Bắt buộc điền đầu khi bắt đầu MỌI dự án mới — đây là "thước đo" mọi quyết định kỹ thuật phải chiếu theo. Copy khung này và điền riêng cho từng dự án (đặt trong `docs/project-brief.md` hoặc ngay đầu README của dự án đó).

- **Tên dự án:** [ĐIỀN]
- **Một câu mô tả:** [ĐIỀN — dự án này giải quyết vấn đề gì, cho ai]
- **Đối tượng người dùng chính:** [ĐIỀN — vd: SMB e-commerce Việt Nam, CEO, KOL/KOC, freelancer, nhà đầu tư...]
- **Bài toán kinh doanh cốt lõi:** [ĐIỀN — vd: tự động hoá CSKH bán hàng đa kênh]
- **Định nghĩa "thành công" của dự án (đo được):** [ĐIỀN — vd: 1000 tenant active, churn <5%/tháng]
- **Ràng buộc không đổi (non-negotiable):** [ĐIỀN — vd: multi-tenant isolation tuyệt đối, không tự auto-charge vì SePay không hỗ trợ recurring]
- **KHÔNG phải mục tiêu (out of scope tường minh):** [ĐIỀN — để tránh scope creep ngay từ đầu]

**Quy tắc áp dụng:** Mọi đề xuất kỹ thuật, mọi lựa chọn thư viện, mọi thiết kế schema PHẢI tự đối chiếu lại mục này trước khi chốt. Giải pháp "hay" nhưng không phục vụ North Star → loại bỏ, không làm "cho đẹp portfolio".

---

## 18. CẤU TRÚC THƯ MỤC CHÍNH (PROJECT STRUCTURE)

> Mẫu chuẩn cho dự án web app multi-tenant SaaS. Điều chỉnh theo từng dự án nhưng giữ nguyên tắc: tách rõ theo chức năng (domain), không gộp lung tung.

```
project-root/
├── CLAUDE.md                   # File này — đọc trước khi code
├── README.md                   # Hướng dẫn chạy local + deploy
├── .env.example                 # Biến môi trường mẫu (KHÔNG chứa giá trị thật)
├── .gitignore
├── docs/
│   ├── project-brief.md          # Bản điền Mục 17 cho dự án cụ thể
│   ├── architecture.md           # Sơ đồ kiến trúc, luồng dữ liệu chính
│   ├── db-schema.md               # Mô tả bảng, quan hệ, RLS policy
│   └── decisions/                  # ADR — Architecture Decision Records (vì sao chọn X thay Y)
├── src/  (hoặc app/ nếu Next.js App Router)
│   ├── modules/                    # Tách theo DOMAIN, không tách theo loại file
│   │   ├── auth/
│   │   ├── tenants/
│   │   ├── chatbot/
│   │   ├── billing/
│   │   └── dashboard/
│   ├── lib/                         # Helper dùng chung (supabase client, claude client...)
│   ├── components/                  # UI components (nếu frontend)
│   └── workers/                     # Background jobs (BullMQ workers)
├── supabase/
│   ├── migrations/                  # Migration có thứ tự, KHÔNG sửa migration đã chạy production
│   └── seed/                        # Dữ liệu mẫu cho dev/staging — KHÔNG đụng production
├── tests/
│   ├── unit/
│   └── integration/
└── scripts/                         # Script vận hành (backup, rollback, deploy)
```

**Quy tắc:** Mỗi module trong `modules/` tự chứa logic của domain đó (route/controller/service/test liên quan) — không rải logic 1 domain ra nhiều nơi xa nhau.

---

## 19. QUY TẮC VIẾT CODE & ĐẶT TÊN (NAMING CONVENTIONS)

> Bổ sung chi tiết thực thi cho Mục 5 (Chuẩn code sạch).

**Đặt tên:**

- Biến, hàm: `camelCase` (JS/TS) / `snake_case` (Python) — nhất quán theo ngôn ngữ, không trộn.
- Class, Component React: `PascalCase`.
- File component: `PascalCase.tsx` (vd: `TenantDashboard.tsx`). File logic/helper: `kebab-case.ts` (vd: `format-currency.ts`).
- Bảng DB: `snake_case`, danh từ số nhiều (vd: `tenants`, `chat_sessions`).
- Boolean: tiền tố `is_`, `has_`, `can_` (vd: `isActive`, `hasPaid`).
- Hàm xử lý: động từ rõ nghĩa đầu tiên (vd: `calculateInvoiceTotal`, không `processData`).
- Hằng số toàn cục: `UPPER_SNAKE_CASE`.
- Cấm tuyệt đối: `temp`, `data2`, `test123`, `foo`, `asdf`, `handleClick2`, `newNew`.

**Quy tắc viết code bổ sung:**

- Mỗi file export tối đa 1 trách nhiệm chính (1 component / 1 service / 1 set hàm liên quan chặt).
- Không file nào >500 dòng (theo Mục 6) — vượt → tách module con.
- Import order: thư viện ngoài → thư viện nội bộ (`@/lib`, `@/modules`) → file cùng cấp. Có blank line phân nhóm.
- Mọi function async xử lý dữ liệu quan trọng → bắt buộc try/catch + log context lỗi (theo Mục 8).
- Type rõ ràng (TypeScript ưu tiên hơn JS thuần cho dự án lớn) — không dùng `any` trừ khi thực sự cần và có comment giải thích vì sao.
- Comment bằng tiếng Việt hoặc tiếng Anh — chọn 1, nhất quán toàn dự án, không trộn trong cùng file.

---

## 20. LỆNH INSTALL / DEV / BUILD / TEST (COMMAND REFERENCE)

> Điền đúng lệnh thật của từng dự án — đây là "single source of truth", Claude phải dùng đúng lệnh này, không tự đoán lệnh khác.

```bash
# --- INSTALL ---
[ĐIỀN — vd: npm install / pnpm install / pip install -r requirements.txt]

# --- DEV (local) ---
[ĐIỀN — vd: npm run dev]
# Chạy tại: http://localhost:[PORT]

# --- DATABASE (Supabase local/migration) ---
[ĐIỀN — vd: npx supabase start / npx supabase db push]

# --- BUILD (production) ---
[ĐIỀN — vd: npm run build]

# --- TEST ---
[ĐIỀN — vd: npm run test         # unit]
[ĐIỀN — vd: npm run test:e2e     # integration/e2e]

# --- LINT / FORMAT (chạy trước khi giao, theo Mục 5) ---
[ĐIỀN — vd: npm run lint && npm run format]

# --- DEPLOY ---
[ĐIỀN — vd: vercel --prod   |   git push hostinger main]

# --- ROLLBACK (theo Mục 16 — phải có sẵn, không nghĩ sau) ---
[ĐIỀN — vd: vercel rollback   |   npx supabase migration repair]
```

**Quy tắc:** Trước khi báo "xong" (Definition of Done, Mục 23), PHẢI thực thi được lệnh test + lint ở trên, không chỉ viết code rồi giao mù.

---

## 21. QUY TRÌNH RESEARCH → PLAN → EXECUTE → REVIEW (BẮT BUỘC CHO TASK PHỨC TẠP)

> Áp dụng cho: feature mới, thay đổi schema, tích hợp dịch vụ ngoài, bất kỳ task ước tính >30 phút code hoặc ảnh hưởng >1 module.
> Task nhỏ/rõ ràng (sửa 1 bug cụ thể, đổi 1 đoạn text) → bỏ qua, làm thẳng theo Mục 4.

### 1. RESEARCH (Nghiên cứu — không code)

- Đọc code hiện có liên quan đến task (không sửa mù — Mục 0.5 + Mục 4.1).
- Đọc `docs/architecture.md` và `docs/db-schema.md` nếu có đụng tới luồng dữ liệu/schema.
- Nếu tích hợp dịch vụ ngoài (API, thư viện mới) → tra docs chính thức, không đoán theo trí nhớ — đặc biệt với SePay, Supabase, Claude API, Google AI Studio vì hay đổi.
- Liệt kê: các phần hệ thống sẽ bị ảnh hưởng, rủi ro tiềm ẩn, các lựa chọn kỹ thuật khả dụng.

### 2. PLAN (Lập kế hoạch — viết ra trước, không nhảy vào code)

- Viết **acceptance criteria** (theo Mục 1).
- Đưa ra **3 giải pháp khả dụng**, xếp theo hiệu quả giảm dần, kèm trade-off rõ.
- Chốt 1 giải pháp + lý do chọn → ghi vào `docs/decisions/` nếu là quyết định kiến trúc quan trọng (ADR ngắn).
- **Chia task lớn thành module nhỏ** (xem Mục 22) trước khi viết dòng code đầu tiên.

### 3. EXECUTE (Thực thi — theo từng module nhỏ)

- Code đúng theo kế hoạch đã chốt ở bước 2 — không tự đổi hướng giữa đường (Spec Lock, Mục 1).
- Mỗi module nhỏ xong → tự test/tự kiểm tra logic (Mục 4.4) trước khi sang module tiếp theo.
- Phát hiện kế hoạch có vấn đề khi đang code → DỪNG, báo lại, không tự sửa kế hoạch ngầm.

### 4. REVIEW (Tự rà soát — trước khi báo xong)

- Chạy **SELF-AUDIT GATE** đầy đủ (Mục 4, bước 7–11).
- Đối chiếu **Definition of Done** (Mục 23) — thiếu 1 mục = chưa xong.
- Tự trả lời 3 câu hỏi bắt buộc ở Mục 25 (lệch yêu cầu / rủi ro / giả định).
- Báo cáo kết quả theo format: ✅ Đạt — ⚠️ Rủi ro còn lại — ❓ Giả định đã đặt ra.

---

## 22. CHIA TASK LỚN THÀNH MODULE NHỎ (TASK DECOMPOSITION — BẮT BUỘC)

> Nguyên tắc: KHÔNG BAO GIỜ nhận 1 task lớn rồi code liền 1 mạch từ đầu đến cuối. Luôn chẻ nhỏ, chạy thử từng phần, rồi mới ráp lại.

**Quy tắc chẻ task:**

- Một module nhỏ = làm xong trong 1 lượt, tự test được ngay, không phụ thuộc module chưa tồn tại (hoặc dùng mock tạm có đánh dấu rõ).
- Thứ tự chẻ ưu tiên: Data layer (schema/model) → Logic/service → API/endpoint → UI → Tích hợp/wiring → Test toàn luồng.
- Mỗi module nhỏ phải có: input/output rõ, 1 cách test nhanh (chạy lệnh gì để biết đúng/sai).

**Mẫu câu lệnh (prompt) yêu cầu chạy từng module nhỏ:**

```
Module 1/N — [Tên module, vd: "Schema bảng tenants + RLS policy"]
Yêu cầu: [mô tả ngắn]
Input: [gì đưa vào]
Output mong đợi: [kết quả cụ thể, đo được]
Test nhanh: [lệnh/cách kiểm tra module này đúng]
KHÔNG động vào: [module khác chưa tới lượt]
→ Code module này, tự test, báo kết quả. CHƯA sang module 2 nếu module 1 chưa pass.
```

```
Module 2/N — [Tên module, vd: "Service xử lý webhook SePay (idempotent)"]
Phụ thuộc: Module 1 đã pass.
Yêu cầu: [mô tả ngắn]
Edge case bắt buộc test: [vd: webhook gọi trùng 2 lần, payload sai signature]
→ Code module này, tự test, đối chiếu acceptance criteria, báo kết quả.
```

```
Module N/N — Wiring & Integration test toàn luồng
Yêu cầu: Ráp tất cả module đã pass thành luồng hoàn chỉnh.
Test: Chạy happy path đầu-cuối + edge case chính.
→ Báo Definition of Done (Mục 23) — pass/fail từng mục.
```

**Quy tắc cứng:** Nếu 1 task được ước tính cần >3 module, BẮT BUỘC liệt kê toàn bộ danh sách module trước khi code module đầu tiên — để duyệt thứ tự/phạm vi trước khi bắt tay vào.

---

## 23. DEFINITION OF DONE — CỔNG CHẶN CUỐI (ALL-OR-NOTHING)

Tất cả các mục dưới đây PHẢI đạt 100%, thiếu 1 mục = CHƯA HOÀN THÀNH, không được báo "xong":

- [ ] Đã đi qua Onboarding Gate (Mục 0.5) trước khi code
- [ ] Đối chiếu đủ acceptance criteria — 100% pass
- [ ] Đúng phạm vi yêu cầu, không thêm/thiếu tự ý
- [ ] Không xoá/ghi đè gì ngoài yêu cầu
- [ ] Không dữ liệu rác/giả trong code hoặc DB thật
- [ ] Đã chẻ task thành module nhỏ nếu task >3 phần việc (Mục 22), từng module đã pass
- [ ] Đã chạy đủ quy trình Research → Plan → Execute → Review cho task phức tạp (Mục 21)
- [ ] Đã test happy path + edge case + case lấy từ yêu cầu gốc
- [ ] Đã chạy đúng lệnh test/lint thật của dự án (Mục 20), không lệnh tự đoán
- [ ] Code đặt đúng vị trí theo cấu trúc thư mục đã chốt (Mục 18), naming đúng quy ước (Mục 19)
- [ ] Không secret/API key lộ trong code
- [ ] Không code rác: không debug sót, không dead code, không duplicate logic
- [ ] Webhook/thanh toán (nếu có) đã xử lý idempotent
- [ ] Có rollback plan nếu thay đổi rủi ro (DB, payment, auth)
- [ ] UI/UX đúng chuẩn theme đã định (Mục 13)
- [ ] Đã báo cáo rõ giả định + rủi ro còn lại (nếu có) — không giấu

---

## 24. ANTI-PATTERNS — TUYỆT ĐỐI CẤM

❌ Tự thêm feature/file/bảng DB không được yêu cầu
❌ Tự đổi/diễn giải lại yêu cầu gốc mà không báo
❌ Xoá code/dữ liệu/file không được yêu cầu rõ ràng
❌ Hardcode API key, password, secret trong code
❌ Catch lỗi rồi bỏ qua im lặng (`catch(e) {}`)
❌ Ghi đè file/config production không backup
❌ Tạo dữ liệu mẫu/giả trộn lẫn vào dữ liệu thật
❌ Migration DB không có rollback
❌ Code chưa test mà báo "xong"
❌ Để TODO/placeholder trong bản giao cuối cùng
❌ Webhook không idempotent → trùng giao dịch/trùng tiền
❌ Test trực tiếp trên dữ liệu/key production
❌ Đưa giải pháp nửa vá rồi nói "còn lại tự làm thêm"
❌ Sai logic nhưng "sửa cho chạy được" theo hướng khác mà không báo
❌ Code liền 1 mạch không chia module khi task lớn (vi phạm Mục 22)
❌ Bỏ qua Onboarding Gate, code mù không đọc context dự án (vi phạm Mục 0.5)

---

## 25. TỰ BÁO CÁO LỆCH (BẮT BUỘC, KHÔNG ĐƯỢC GIẤU)

Trước khi giao bất kỳ kết quả nào, phải tự hỏi và trả lời thẳng trong báo cáo:

1. Có điểm nào tôi đã làm khác với yêu cầu gốc không? Nếu có → nêu rõ và lý do.
2. Có rủi ro nào (bảo mật, dữ liệu, hiệu suất) tôi biết nhưng chưa xử lý hết không?
3. Có giả định nào tôi tự đặt ra để code được không? Nêu rõ.

Im lặng bỏ qua 3 câu này = vi phạm Mục 0.7 và Mục 1.

---

**Tiêu chuẩn cuối cùng:** Production-ready, sạch, an toàn dữ liệu tuyệt đối, đúng 100% phạm vi yêu cầu, bảo mật chuẩn, không có lỗi logic ẩn, đẹp đúng chuẩn Thiện Vua App — xứng tầm hệ sinh thái $100M. Đọc đủ file này trước khi code không phải lựa chọn — đó là điều kiện bắt buộc để được phép bắt đầu.
