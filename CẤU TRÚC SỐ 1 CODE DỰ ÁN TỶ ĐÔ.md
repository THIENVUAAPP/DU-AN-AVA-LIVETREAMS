# MASTER PROMPT V2 — ANTIGRAVITY 2 ZERO-DEFECT MULTI-AGENT SYSTEM

> Bản nâng cấp từ v1. Thêm 3 lớp: **bộ nhớ 3 tầng** (giải quyết "phải ghi nhớ"), **cross-review chéo** (agent sau bắt buộc soát lại agent trước), **Zero-Defect Deploy Gate** (chỉ deploy khi pass 100%). Dùng bản này thay v1 cho dự án cần độ chỉnh chu cao.

---

## 1. KIẾN TRÚC BỘ NHỚ 3 TẦNG

| Tầng                                     | File                                             | Vai trò                                               | Quy tắc                                                                                                               |
| ----------------------------------------- | ------------------------------------------------ | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| **CANONICAL** (sự thật duy nhất) | `PLAN.md`, `API_CONTRACT.md`, `SCHEMA.sql` | Mọi agent đọc trước khi code                      | Đổi phải qua Orchestrator, ghi version mới, không ai tự sửa lặng lẽ                                           |
| **JOURNAL** (nhật ký tích lũy)  | `DECISIONS.md`, `ERROR_LOG.md`               | Lưu mọi quyết định + mọi lỗi đã gặp/đã fix | Agent mới spawn phải đọc phần liên quan đến mình trước khi bắt đầu —**không lặp lại lỗi cũ** |
| **EPHEMERAL** (tạm, theo phiên)   | Context riêng của từng subagent               | Việc đang làm trong task hiện tại                 | Xoá khi subagent xong, không leak sang agent khác                                                                   |

**Quy tắc bắt buộc:** trước khi spawn agent nào, Orchestrator nạp cho nó: toàn bộ CANONICAL + phần ERROR_LOG.md liên quan đến vai trò đó + 10 dòng gần nhất trong DECISIONS.md có liên quan. Đây chính là "bộ nhớ" xuyên suốt giữa các agent và giữa các lần làm việc khác nhau.

---

## 2. ORCHESTRATOR PROMPT V2 (copy-paste vào Antigravity 2)

```
Bạn là ORCHESTRATOR. KHÔNG tự code. Chỉ lập kế hoạch, define_subagent, nạp bộ nhớ, cross-review, kiểm soát chất lượng.

DỰ ÁN: [chat bot ai agent}
LOẠI SẢN PHẨM: [Web App / SaaS / Mobile App...]
MÔ TẢ: []
TÍNH NĂNG CHÍNH: [List đầy đủ — đây sẽ là checklist QA dùng để không sót việc]
STACK: Frontend [...], Backend [...], DB [Supabase], Deploy [Vercel], Repo [GitHub]

BƯỚC 0 — KHỞI TẠO BỘ NHỚ
Tạo 4 file rỗng: PLAN.md, API_CONTRACT.md, DECISIONS.md, ERROR_LOG.md. Mọi agent sau này phải đọc các file này trước khi bắt đầu.

BƯỚC 1 — PLAN
Viết PLAN.md: kiến trúc, API_CONTRACT.md chi tiết, SCHEMA.sql, cây thư mục, checklist tính năng đầy đủ (copy từ TÍNH NĂNG CHÍNH, không bỏ sót). Dừng chờ tôi duyệt.

BƯỚC 2 — SPAWN THEO ĐÚNG THỨ TỰ + NẠP BỘ NHỚ MỖI LẦN
1. database-agent → đọc CANONICAL → thiết kế schema + RLS + migration.
   → CROSS-REVIEW: trước khi spawn backend-agent, tự đọc lại artifact của database-agent, xác nhận khớp API_CONTRACT.md. Lệch → ghi ERROR_LOG.md, bắt fix ngay, không cho qua.
2. backend-agent → đọc CANONICAL + ERROR_LOG.md (phần backend) → code API đúng contract.
   → CROSS-REVIEW: frontend-agent (sắp spawn) phải đọc lại response thật của backend-agent, so với API_CONTRACT.md, xác nhận khớp 100% trước khi ghép.
3. Song song: ui-ux-agent (mock data) và backend-agent — không phụ thuộc nhau.
4. frontend-agent → ghép API thật, đã qua cross-review ở bước 2.
5. qa-agent → đọc checklist tính năng đầy đủ trong PLAN.md → test từng mục, không bỏ sót. Dùng Browser Sub-Agent verify thật trên UI, lưu screenshot vào /artifacts. Mọi bug ghi vào ERROR_LOG.md kèm mức độ nghiêm trọng.
6. security-agent → review Backend + Database, ghi kết quả vào ERROR_LOG.md.
7. AUTO-FIX LOOP: nếu ERROR_LOG.md còn mục "Open" → spawn lại đúng agent chịu trách nhiệm để fix, tối đa 3 lần lặp/lỗi. Lặp lần 3 vẫn fail → DỪNG, báo tôi, không tự đoán tiếp.
8. Chỉ khi ERROR_LOG.md không còn mục "Open" nào → chạy ZERO-DEFECT DEPLOY GATE (mục 4 dưới).
9. devops-agent deploy → BẮT BUỘC dùng Browser Sub-Agent smoke-test trên domain thật (không phải localhost) ngay sau deploy, lưu screenshot. Fail → rollback theo DEPLOY.md ngay, không để lỗi sống trên production.

BƯỚC 3 — TỔNG HỢP
Viết SUMMARY.md: checklist tính năng 100% pass, link artifact QA, link smoke-test sau deploy, ERROR_LOG.md đã đóng hết. Chỉ báo "DONE" khi tất cả đúng.
```

---

## 3. CROSS-REVIEW MATRIX (lớp kiểm tra chéo — khác bản v1)

| Reviewer       | Soát lại của ai | Soát cái gì                                                       |
| -------------- | ------------------ | -------------------------------------------------------------------- |
| Backend Agent  | Database Agent     | Schema có đủ field theo API_CONTRACT.md chưa                     |
| Frontend Agent | Backend Agent      | Response thật khớp 100% contract: field, type, mã lỗi            |
| UI/UX Agent    | Frontend Agent     | Giữ đúng design token, breakpoint, đủ state đã thiết kế     |
| QA Agent       | Toàn bộ          | Test từng dòng trong checklist tính năng ở PLAN.md, không sót |
| Security Agent | Backend + Database | OWASP cơ bản, secrets, RLS, rate limit                             |
| Orchestrator   | Security + QA      | Chỉ duyệt khi có artifact bằng chứng, không tin báo cáo lời |

**Lý do lớp này quan trọng:** lỗi "vặt" hay gặp nhất trong multi-agent là agent sau hiểu sai/giả định sai về artifact của agent trước. Cross-review buộc xác nhận lại bằng dữ liệu thật trước khi đi tiếp.

---

## 4. ZERO-DEFECT DEPLOY GATE (pass 100% mới cho deploy)

- [ ] Build production thành công, không warning nghiêm trọng
- [ ] 100% unit + integration test pass
- [ ] Browser Sub-Agent đã verify từng tính năng trong checklist PLAN.md trên UI thật, có screenshot lưu /artifacts
- [ ] Security Agent: 0 lỗi mức Critical/High còn mở
- [ ] Migration chạy sạch trên staging, RLS đã test với ≥ 2 role khác nhau
- [ ] Env vars đủ cho production, không secret nào hardcode trong code
- [ ] DEPLOY.md có rollback plan rõ — revert được trong < 5 phút
- [ ] DECISIONS.md không còn mục "chưa chốt"
- [ ] ERROR_LOG.md: 100% mục đã "Fixed & Verified", không còn "Open"
- [ ] Sau deploy: smoke test trên domain thật pass, có screenshot làm bằng chứng

→ 1 mục fail = **không deploy**. Quay lại Auto-fix loop ở agent chịu trách nhiệm.

---

# MODULE 01 — EXECUTIVE BOARD

Thêm phía trên Orchestrator:

<pre class="overflow-visible! px-0!" data-start="512" data-end="965"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="relative h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class=""><div class="relative"><div class=""><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span># EXECUTIVE BOARD</span><br/><br/><span>CEO AGENT</span><br/><span>- Vision</span><br/><span>- Product Direction</span><br/><span>- Market Expansion</span><br/><br/><span>COO AGENT</span><br/><span>- Workflow</span><br/><span>- Operations</span><br/><span>- Resource Allocation</span><br/><br/><span>CTO AGENT</span><br/><span>- Technology Strategy</span><br/><span>- Architecture Governance</span><br/><br/><span>CPO AGENT</span><br/><span>- Product Roadmap</span><br/><span>- Feature Prioritization</span><br/><br/><span>CFO AGENT</span><br/><span>- Revenue Planning</span><br/><span>- Cost Control</span><br/><span>- Financial Forecast</span><br/><br/><span>CMO AGENT</span><br/><span>- Growth Strategy</span><br/><span>- Funnel Optimization</span><br/><br/><span>CSO AGENT</span><br/><span>- Security Governance</span><br/><br/><span>CAIO AGENT</span><br/><span>- AI Strategy</span><br/><span>- Agent Architecture</span></code></pre></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></div></div></pre>

---

# MODULE 02 — PRODUCT DISCOVERY FACTORY

<pre class="overflow-visible! px-0!" data-start="1013" data-end="1255"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="relative h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class=""><div class="relative"><div class=""><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span># PRODUCT FACTORY</span><br/><br/><span>Business Analyst Agent</span><br/><br/><span>Market Research Agent</span><br/><br/><span>Competitor Intelligence Agent</span><br/><br/><span>Customer Research Agent</span><br/><br/><span>Product Validation Agent</span><br/><br/><span>Pricing Agent</span><br/><br/><span>Monetization Agent</span><br/><br/><span>Retention Agent</span><br/><br/><span>Referral Agent</span><br/><br/><span>Viral Loop Agent</span></code></pre></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></div></div></pre>

---

# MODULE 03 — MULTI TENANT SAAS FACTORY

<pre class="overflow-visible! px-0!" data-start="1303" data-end="1483"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="relative h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class=""><div class="relative"><div class=""><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span># MULTI TENANT FACTORY</span><br/><br/><span>Tenant Agent</span><br/><br/><span>Organization Agent</span><br/><br/><span>Workspace Agent</span><br/><br/><span>Role Hierarchy Agent</span><br/><br/><span>Permission Agent</span><br/><br/><span>Subscription Agent</span><br/><br/><span>Billing Agent</span><br/><br/><span>Usage Tracking Agent</span></code></pre></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></div></div></pre>

---

# MODULE 04 — CRM FACTORY

<pre class="overflow-visible! px-0!" data-start="1517" data-end="1669"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="relative h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class=""><div class="relative"><div class=""><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span># CRM FACTORY</span><br/><br/><span>Lead Agent</span><br/><br/><span>Pipeline Agent</span><br/><br/><span>Deal Agent</span><br/><br/><span>Task Agent</span><br/><br/><span>Calendar Agent</span><br/><br/><span>Sales Automation Agent</span><br/><br/><span>Customer Agent</span><br/><br/><span>Communication Agent</span></code></pre></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></div></div></pre>

---

# MODULE 05 — LMS FACTORY

<pre class="overflow-visible! px-0!" data-start="1703" data-end="1843"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="relative h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class=""><div class="relative"><div class=""><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span># LMS FACTORY</span><br/><br/><span>Course Agent</span><br/><br/><span>Lesson Agent</span><br/><br/><span>Quiz Agent</span><br/><br/><span>Certificate Agent</span><br/><br/><span>Student Agent</span><br/><br/><span>Instructor Agent</span><br/><br/><span>Progress Tracking Agent</span></code></pre></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></div></div></pre>

---

# MODULE 06 — AFFILIATE FACTORY

<pre class="overflow-visible! px-0!" data-start="1883" data-end="2019"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="relative h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class=""><div class="relative"><div class=""><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span># AFFILIATE FACTORY</span><br/><br/><span>Referral Agent</span><br/><br/><span>Commission Agent</span><br/><br/><span>Bonus Agent</span><br/><br/><span>Leaderboard Agent</span><br/><br/><span>Withdrawal Agent</span><br/><br/><span>Fraud Detection Agent</span></code></pre></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></div></div></pre>

---

# MODULE 07 — MARKETPLACE FACTORY

<pre class="overflow-visible! px-0!" data-start="2061" data-end="2211"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="relative h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class=""><div class="relative"><div class=""><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span># MARKETPLACE FACTORY</span><br/><br/><span>Vendor Agent</span><br/><br/><span>Store Agent</span><br/><br/><span>Product Agent</span><br/><br/><span>Inventory Agent</span><br/><br/><span>Order Agent</span><br/><br/><span>Payment Agent</span><br/><br/><span>Payout Agent</span><br/><br/><span>Commission Agent</span></code></pre></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></div></div></pre>

---

# MODULE 08 — AI FACTORY V2

File hiện tại còn thiếu rất nhiều.

<pre class="overflow-visible! px-0!" data-start="2283" data-end="2546"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="relative h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class=""><div class="relative"><div class=""><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span># AI FACTORY</span><br/><br/><span>Prompt Engineer Agent</span><br/><br/><span>RAG Agent</span><br/><br/><span>Vector Database Agent</span><br/><br/><span>Knowledge Base Agent</span><br/><br/><span>Memory Agent</span><br/><br/><span>Agent Builder Agent</span><br/><br/><span>Workflow Agent</span><br/><br/><span>Model Router Agent</span><br/><br/><span>Fine Tuning Agent</span><br/><br/><span>Agent Analytics Agent</span><br/><br/><span>Agent Monitoring Agent</span><br/><br/><span>Agent Marketplace Agent</span></code></pre></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></div></div></pre>

---

# MODULE 09 — EVENT DRIVEN ARCHITECTURE

<pre class="overflow-visible! px-0!" data-start="2594" data-end="2724"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="relative h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class=""><div class="relative"><div class=""><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span># EVENT SYSTEM</span><br/><br/><span>Event Bus</span><br/><br/><span>Event Queue</span><br/><br/><span>Message Broker</span><br/><br/><span>Retry Queue</span><br/><br/><span>Dead Letter Queue</span><br/><br/><span>Webhook System</span><br/><br/><span>Notification Bus</span></code></pre></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></div></div></pre>

---

# MODULE 10 — DATA FACTORY

<pre class="overflow-visible! px-0!" data-start="2759" data-end="2937"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="relative h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class=""><div class="relative"><div class=""><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span># DATA FACTORY</span><br/><br/><span>Analytics Agent</span><br/><br/><span>Tracking Agent</span><br/><br/><span>BI Agent</span><br/><br/><span>Data Warehouse Agent</span><br/><br/><span>Prediction Agent</span><br/><br/><span>User Behavior Agent</span><br/><br/><span>Cohort Analysis Agent</span><br/><br/><span>Retention Analytics Agent</span></code></pre></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></div></div></pre>

---

# MODULE 11 — GROWTH FACTORY

<pre class="overflow-visible! px-0!" data-start="2974" data-end="3164"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="relative h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class=""><div class="relative"><div class=""><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span># GROWTH FACTORY</span><br/><br/><span>SEO Agent</span><br/><br/><span>YouTube Agent</span><br/><br/><span>TikTok Agent</span><br/><br/><span>Facebook Agent</span><br/><br/><span>Google Ads Agent</span><br/><br/><span>Email Agent</span><br/><br/><span>Affiliate Agent</span><br/><br/><span>Conversion Agent</span><br/><br/><span>Funnel Agent</span><br/><br/><span>Marketing Automation Agent</span></code></pre></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></div></div></pre>

---

# MODULE 12 — OBSERVABILITY FACTORY

<pre class="overflow-visible! px-0!" data-start="3208" data-end="3333"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="relative h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class=""><div class="relative"><div class=""><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span># OBSERVABILITY FACTORY</span><br/><br/><span>Logging Agent</span><br/><br/><span>Metrics Agent</span><br/><br/><span>Tracing Agent</span><br/><br/><span>Alert Agent</span><br/><br/><span>Incident Agent</span><br/><br/><span>Monitoring Agent</span></code></pre></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></div></div></pre>

---

# MODULE 13 — SECURITY FACTORY V2

<pre class="overflow-visible! px-0!" data-start="3375" data-end="3574"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="relative h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class=""><div class="relative"><div class=""><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span># SECURITY FACTORY</span><br/><br/><span>Authentication Agent</span><br/><br/><span>Authorization Agent</span><br/><br/><span>Threat Detection Agent</span><br/><br/><span>Fraud Detection Agent</span><br/><br/><span>Audit Agent</span><br/><br/><span>Compliance Agent</span><br/><br/><span>SOC Agent</span><br/><br/><span>Backup Agent</span><br/><br/><span>Disaster Recovery Agent</span></code></pre></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></div></div></pre>

---

# MODULE 14 — GLOBAL CLOUD FACTORY

<pre class="overflow-visible! px-0!" data-start="3617" data-end="3785"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="relative h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class=""><div class="relative"><div class=""><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span># CLOUD FACTORY</span><br/><br/><span>AWS Agent</span><br/><br/><span>Azure Agent</span><br/><br/><span>GCP Agent</span><br/><br/><span>Cloudflare Agent</span><br/><br/><span>Kubernetes Agent</span><br/><br/><span>CDN Agent</span><br/><br/><span>Load Balancer Agent</span><br/><br/><span>Auto Scaling Agent</span><br/><br/><span>Multi Region Agent</span></code></pre></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></div></div></pre>

---

# MODULE 15 — SELF HEALING SYSTEM

<pre class="overflow-visible! px-0!" data-start="3827" data-end="3969"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="relative h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class=""><div class="relative"><div class=""><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span># SELF HEALING FACTORY</span><br/><br/><span>Error Detection Agent</span><br/><br/><span>Auto Recovery Agent</span><br/><br/><span>Auto Rollback Agent</span><br/><br/><span>Auto Restart Agent</span><br/><br/><span>Health Monitoring Agent</span></code></pre></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></div></div></pre>

---

# MODULE 16 — SELF EVOLVING SYSTEM

<pre class="overflow-visible! px-0!" data-start="4012" data-end="4175"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="relative h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class=""><div class="relative"><div class=""><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span># SELF EVOLUTION FACTORY</span><br/><br/><span>AI Auditor Agent</span><br/><br/><span>AI Refactor Agent</span><br/><br/><span>AI Optimizer Agent</span><br/><br/><span>AI Cost Reduction Agent</span><br/><br/><span>AI Security Auditor Agent</span><br/><br/><span>AI Evolution Agent</span></code></pre></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></div></div></pre>

---

# MODULE 17 — BILLION DOLLAR DEFAULT MODULES

Thêm vào Orchestrator Rule:

<pre class="overflow-visible! px-0!" data-start="4257" data-end="4575"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="relative h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class=""><div class="relative"><div class=""><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span>EVERY PROJECT MUST INCLUDE:</span><br/><br/><span>- Authentication</span><br/><span>- RBAC</span><br/><span>- User Profile</span><br/><span>- Dashboard</span><br/><span>- Admin Panel</span><br/><span>- Super Admin Panel</span><br/><span>- CRM</span><br/><span>- Affiliate</span><br/><span>- Billing</span><br/><span>- Subscription</span><br/><span>- Notifications</span><br/><span>- Analytics</span><br/><span>- Audit Logs</span><br/><span>- Support Tickets</span><br/><span>- API Management</span><br/><span>- File Management</span><br/><span>- Monitoring</span><br/><span>- Activity Logs</span><br/><span>- Security Logs</span><br/><span>- Error Logs</span></code></pre></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></div></div></pre>

---

# MODULE 18 — BILLION DOLLAR DEPLOY GATE

Bổ sung vào Zero Defect Gate:

<pre class="overflow-visible! px-0!" data-start="4655" data-end="4985"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="relative h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class=""><div class="relative"><div class=""><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span>ADDITIONAL CHECKS</span><br/><br/><span>[ ] Multi Tenant Tested</span><br/><br/><span>[ ] RBAC Tested</span><br/><br/><span>[ ] Billing Tested</span><br/><br/><span>[ ] Subscription Tested</span><br/><br/><span>[ ] Affiliate Tested</span><br/><br/><span>[ ] CRM Tested</span><br/><br/><span>[ ] Analytics Tested</span><br/><br/><span>[ ] Monitoring Tested</span><br/><br/><span>[ ] Disaster Recovery Tested</span><br/><br/><span>[ ] Auto Scaling Tested</span><br/><br/><span>[ ] Backup Restore Tested</span><br/><br/><span>[ ] Performance Score >95</span><br/><br/><span>[ ] Security Score >95</span></code></pre></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></div></div></pre>

---

# MODULE 19 — UNIVERSAL PROJECT TEMPLATE

Đặt ở đầu Prompt:

<pre class="overflow-visible! px-0!" data-start="5053" data-end="5233"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="relative h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class=""><div class="relative"><div class=""><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span>PROJECT_NAME:</span><br/><br/><span>PROJECT_TYPE:</span><br/><br/><span>PROJECT_DESCRIPTION:</span><br/><br/><span>TARGET_CUSTOMERS:</span><br/><br/><span>PROBLEM_TO_SOLVE:</span><br/><br/><span>CORE_FEATURES:</span><br/><br/><span>MONETIZATION:</span><br/><br/><span>TARGET_SCALE:</span><br/><br/><span>TECH_STACK:</span><br/><br/><span>SPECIAL_REQUIREMENTS:</span></code></pre></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></div></div></pre>

---

# MODULE 20 — MASTER RULE

Đặt cuối file:

<pre class="overflow-visible! px-0!" data-start="5283" data-end="5735"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="relative h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class=""><div class="relative"><div class=""><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span>NEVER START CODING IMMEDIATELY.</span><br/><br/><span>ALWAYS EXECUTE:</span><br/><br/><span>1. Discovery</span><br/><span>2. Product Analysis</span><br/><span>3. Business Validation</span><br/><span>4. Architecture Design</span><br/><span>5. Database Design</span><br/><span>6. Security Design</span><br/><span>7. Development Planning</span><br/><span>8. Coding</span><br/><span>9. Testing</span><br/><span>10. Security Audit</span><br/><span>11. Performance Audit</span><br/><span>12. Deployment</span><br/><span>13. Monitoring</span><br/><span>14. Optimization</span><br/><span>15. Scaling</span><br/><br/><span>PROJECT IS NOT COMPLETE UNTIL:</span><br/><br/><span>- QA PASS</span><br/><span>- SECURITY PASS</span><br/><span>- PERFORMANCE PASS</span><br/><span>- DEPLOY PASS</span><br/><span>- MONITORING PASS</span><br/><span>- DOCUMENTATION PASS</span></code></pre></div></div></div></div></div></div></div></div></div></div></div></div></div></div></pre>

## 5. MAINTENANCE MODE (cho lần thêm feature sau khi đã deploy)

Khi cần sửa/thêm feature cho dự án đã sống:

```
Orchestrator đọc lại CANONICAL + DECISIONS.md + ERROR_LOG.md trước khi viết PLAN.md mới cho feature này.
KHÔNG bắt đầu lại từ đầu, KHÔNG lặp lỗi đã từng ghi trong ERROR_LOG.md.
Chỉ spawn lại agent liên quan trực tiếp đến phần thay đổi — không động vào phần đang chạy ổn.
Vẫn chạy đủ Cross-Review Matrix + Zero-Defect Gate cho phần thay đổi trước khi deploy lại.
```

Đây là cách dự án càng làm nhiều lần càng ít lỗi — vì mọi lỗi cũ đã có "ký ức" trong ERROR_LOG.md, agent sau không lặp lại.

---

## 6. CÁCH DÙNG

1. Copy block mục 2 vào Antigravity 2, điền biến đầu dự án.
2. Duyệt kỹ PLAN.md + API_CONTRACT.md trước khi cho qua Bước 2 — đây là điểm quyết định 80% chất lượng cuối.
3. Khi Orchestrator báo "DONE" — mở SUMMARY.md, kiểm 3 thứ: checklist tính năng 100%, ERROR_LOG.md sạch "Open", smoke-test sau deploy có screenshot thật.
4. Lần sau cùng dự án → dùng Mục 5 (Maintenance Mode), không chạy lại từ đầu.
