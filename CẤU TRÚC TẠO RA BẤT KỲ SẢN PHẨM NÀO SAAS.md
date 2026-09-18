# 🏆 EXECUTIVE SAAS MASTER ARCHITECTURE BLUEPRINT V3.0
## THE DEFINITIVE BILLION-DOLLAR PRODUCTION SYSTEM
### One Prompt → Full Deployable SaaS Product

> **Version**: 3.0 — Rewritten from ground up. Zero placeholders. Zero TODOs. Zero excuses.
> **Stack**: Next.js 15 · Supabase · Tailwind v4 · Shadcn/UI · Vercel AI SDK v4 · TypeScript Strict
> **Guarantee**: Follow every step → deploy-ready product. Skip a step → on you.
> **Rule #1**: AI MUST NOT write `// TODO`, mock data, or placeholder logic. Ever.
> **Rule #2**: Every code block must be complete, runnable, and production-hardened.
> **Rule #3**: Think like a $1B company. Implement like one.

---

## 📋 MASTER CHECKLIST — Đọc trước khi bắt đầu

Trước khi generate bất kỳ dòng code nào, AI phải hoàn thành checklist này:

- [ ] Đã đọc kỹ Phần 0 (Product Input) và suy luận ra domain logic
- [ ] Đã xác định product type: SaaS / Marketplace / B2B / Social / Hybrid
- [ ] Đã liệt kê tất cả bảng DB domain-specific (ngoài scaffold)
- [ ] Đã xác định pricing strategy với số tiền thực tế
- [ ] Đã viết xong toàn bộ SQL trước khi bắt đầu code Next.js
- [ ] Đã verify tất cả env variables được sử dụng đều có trong .env.example
- [ ] `npm run build` pass không lỗi trước khi coi là done

---

## 📌 PHẦN 0: PRODUCT INPUT — ĐIỀN VÀO ĐÂY

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TÊN SẢN PHẨM     : [Tên sản phẩm — ngắn gọn, nhớ mãi]
  MÔ TẢ CỐT LÕI    : [Giải quyết bài toán gì, cho ai, tại sao họ trả tiền]
  LĨNH VỰC         : [AI Marketing / FinTech / EdTech / Healthcare / Real Estate / ...]
  LOẠI SẢN PHẨM    : [B2C SaaS / B2B SaaS / Marketplace / Social Platform / Hybrid]
  KHÁCH HÀNG       : [Cá nhân / Doanh nghiệp SME / Enterprise / Freelancer / ...]
  USP               : [Tại sao người dùng chọn sản phẩm này thay vì 10 đối thủ kia?]
  THỊ TRƯỜNG        : [Việt Nam / SEA / Global / ...]
  MÔ HÌNH DOANH THU: [Subscription / Credit-based / Freemium / Pay-per-use / Hybrid]
  TÍNH NĂNG LÕI    : [Liệt kê 3–5 tính năng core tạo ra giá trị chính]
  ĐỐI THỦ CẠNH TRANH: [3 đối thủ chính + điểm yếu của họ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

> **Luật AI**: Sau khi đọc Phần 0, AI phải tự xuất ra một "Product Analysis Block" gồm:
> 1. User persona chi tiết (3 loại user)
> 2. Core user journey map (Guest → Free → Paid → Power User)
> 3. Danh sách bảng DB domain-specific cần tạo thêm
> 4. Pricing tiers với số tiền VND/USD thực tế
> 5. Tech risk assessment (top 3 rủi ro kỹ thuật + cách xử lý)

---

## 🛑 PHẦN I: BẢO MẬT 12 LỚP — SECURITY HARDENING COMPLETE

### Layer 1 · Database Security (Supabase RLS)

**Quy tắc bất di bất dịch:**
- 100% bảng public phải có `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
- KHÔNG BAO GIỜ dùng `service_role` key ở client-side
- Admin policy dùng JWT claim, KHÔNG query lại bảng đang apply RLS (anti-recursion)
- Chạy script kiểm tra sau khi deploy:

```sql
-- Kiểm tra bảng nào chưa bật RLS (phải trả về 0 rows)
SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename NOT IN (
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
    AND rowsecurity = TRUE
  );

-- Kiểm tra bảng nào có RLS nhưng không có policy (= locked out hoàn toàn)
SELECT schemaname, tablename
FROM pg_tables pt
WHERE schemaname = 'public'
  AND rowsecurity = TRUE
  AND NOT EXISTS (
    SELECT 1 FROM pg_policies pp
    WHERE pp.schemaname = pt.schemaname
      AND pp.tablename = pt.tablename
  );
```

**Anti-Recursion Admin Pattern:**
```sql
-- ✅ ĐÚNG — dùng JWT app_metadata claim, zero DB query
CREATE POLICY "admin_full_access" ON public.any_table
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN'
  );

-- ❌ SAI — gây recursive loop, crash DB
CREATE POLICY "admin_full_access" ON public.profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );
```

**Fields người dùng KHÔNG được tự update (enforce tại RLS WITH CHECK):**
```sql
-- Bảo vệ các field nhạy cảm
CREATE POLICY "user_update_safe_fields_only" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    -- Các field nhạy cảm không được thay đổi từ client
    AND role IS NOT DISTINCT FROM (SELECT role FROM public.profiles WHERE id = auth.uid())
    AND plan IS NOT DISTINCT FROM (SELECT plan FROM public.profiles WHERE id = auth.uid())
    AND credits IS NOT DISTINCT FROM (SELECT credits FROM public.profiles WHERE id = auth.uid())
    AND affiliate_balance IS NOT DISTINCT FROM (SELECT affiliate_balance FROM public.profiles WHERE id = auth.uid())
    AND is_suspended IS NOT DISTINCT FROM (SELECT is_suspended FROM public.profiles WHERE id = auth.uid())
  );
```

### Layer 2 · Auth & Session Security

**PKCE Flow bắt buộc:**
```typescript
// lib/supabase/actions.ts
'use server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signInWithGoogle(affiliateId?: string) {
  const supabase = await createClient();
  const cookieStore = await cookies();
  const aff = cookieStore.get('aff_id')?.value;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      flowType: 'pkce',                    // BẮT BUỘC — chống auth code interception
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      queryParams: { access_type: 'offline', prompt: 'consent' },
      data: {
        referred_by: aff || null,          // Pass affiliate ID vào user metadata
      },
    },
  });

  if (error) throw new Error(error.message);
  redirect(data.url);
}
```

**Auth Callback với PKCE:**
```typescript
// app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
```

**Supabase SSR Client — Server:**
```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, {
                ...options,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
              });
            });
          } catch {
            // Server Component — cookies() is read-only, ignore silently
          }
        },
      },
    }
  );
}
```

**Supabase SSR Client — Browser:**
```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (client) return client; // Singleton pattern
  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return client;
}
```

**Service Role Client (server-only):**
```typescript
// lib/supabase/service.ts — NEVER import in client components
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

export function createServiceClient() {
  if (typeof window !== 'undefined') {
    throw new Error('Service client cannot be used in browser');
  }
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
```

### Layer 3 · Middleware — Route Protection + Affiliate Tracking

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/billing', '/settings', '/affiliate'];
const ADMIN_ROUTES = ['/admin'];
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  let response = NextResponse.next({ request });

  // ── Step 1: Affiliate Cookie Tracking ──────────────────────────────────────
  const affParam = searchParams.get('aff');
  if (affParam && UUID_REGEX.test(affParam)) {
    response.cookies.set('aff_id', affParam, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  }

  // ── Step 2: Supabase Session Refresh ───────────────────────────────────────
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // ── Step 3: Route Protection ───────────────────────────────────────────────
  const isProtected = PROTECTED_ROUTES.some(r => pathname.startsWith(r));
  const isAdmin = ADMIN_ROUTES.some(r => pathname.startsWith(r));

  if ((isProtected || isAdmin) && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Step 4: Admin Route Extra Check ───────────────────────────────────────
  if (isAdmin && user) {
    const appRole = (user.app_metadata as Record<string, string>)?.role;
    if (appRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // ── Step 5: Suspend Check ─────────────────────────────────────────────────
  if (isProtected && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_suspended')
      .eq('id', user.id)
      .single();

    if (profile?.is_suspended) {
      return NextResponse.redirect(new URL('/suspended', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/webhook|api/health|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

### Layer 4 · Webhook Security (Payment)

```typescript
// lib/payments/verify.ts
import crypto from 'crypto';

/** Verify Stripe webhook signature */
export function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const parts = signature.split(',').reduce<Record<string, string>>((acc, part) => {
      const [k, v] = part.split('=');
      acc[k] = v;
      return acc;
    }, {});

    const timestamp = parts['t'];
    const expectedSig = parts['v1'];

    if (!timestamp || !expectedSig) return false;

    // Replay attack protection: reject webhooks older than 5 minutes
    const webhookAge = Math.floor(Date.now() / 1000) - parseInt(timestamp, 10);
    if (webhookAge > 300) return false;

    const signedPayload = `${timestamp}.${payload}`;
    const computedSig = crypto
      .createHmac('sha256', secret)
      .update(signedPayload, 'utf8')
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(computedSig, 'hex'),
      Buffer.from(expectedSig, 'hex')
    );
  } catch {
    return false;
  }
}

/** Verify PayOS webhook checksum */
export function verifyPayOSChecksum(
  data: Record<string, unknown>,
  checksumKey: string
): boolean {
  try {
    const { signature, ...rest } = data as Record<string, string>;
    const sortedKeys = Object.keys(rest).sort();
    const signData = sortedKeys.map(k => `${k}=${rest[k]}`).join('&');

    const computedHash = crypto
      .createHmac('sha256', checksumKey)
      .update(signData)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(computedHash),
      Buffer.from(signature || '')
    );
  } catch {
    return false;
  }
}
```

### Layer 5 · Rate Limiting (Upstash Redis)

```typescript
// lib/utils/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const rateLimiters = {
  free: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '60 s'),
    analytics: true,
    prefix: 'rl:free',
  }),
  pro: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, '60 s'),
    analytics: true,
    prefix: 'rl:pro',
  }),
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '60 s'),
    analytics: true,
    prefix: 'rl:auth',
  }),
  webhook: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '60 s'),
    analytics: true,
    prefix: 'rl:webhook',
  }),
};

export async function getRateLimiter(plan: string) {
  return plan === 'PRO' || plan === 'ENTERPRISE'
    ? rateLimiters.pro
    : rateLimiters.free;
}

export async function getClientIP(): Promise<string> {
  const headersList = await headers();
  return (
    headersList.get('x-real-ip') ||
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '127.0.0.1'
  );
}

export function rateLimitResponse() {
  return new Response(
    JSON.stringify({
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.',
      code: 429,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': '60',
      },
    }
  );
}
```

### Layer 6 · Input Validation (Zod Schemas)

```typescript
// lib/utils/validators.ts
import { z } from 'zod';

export const UUID = z.string().uuid();
export const VietnamPhone = z.string().regex(/^(0|\+84)[3-9]\d{8}$/, 'Số điện thoại không hợp lệ');
export const BankAccount = z.string().regex(/^\d{6,20}$/, 'Số tài khoản không hợp lệ');
export const VNDAmount = z.number().int().min(1000).max(500_000_000);

export const WithdrawalSchema = z.object({
  amount: z.number().min(500_000, 'Tối thiểu 500,000 VND').max(50_000_000, 'Tối đa 50,000,000 VND/lần'),
  bank_name: z.string().min(2).max(100).trim(),
  account_number: BankAccount,
  account_holder: z.string().min(2).max(100).trim(),
  note: z.string().max(500).optional(),
});

export const ProfileUpdateSchema = z.object({
  full_name: z.string().min(2).max(100).trim(),
  avatar_url: z.string().url().optional().nullable(),
});

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(['asc', 'desc']).default('desc'),
  order_by: z.string().max(50).default('created_at'),
});
```

### Layer 7–12 · Additional Security Layers

```typescript
// next.config.ts — Security Headers
import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' blob: data: https://*.supabase.co https://lh3.googleusercontent.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.anthropic.com",
      "frame-src https://accounts.google.com https://checkout.stripe.com",
      "font-src 'self'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  experimental: {
    serverActions: { bodySizeLimit: '2mb' },
  },
};

export default nextConfig;
```

---

## 🗄️ PHẦN II: DATABASE SCHEMA V3 — COMPLETE & PRODUCTION-READY

> Chạy toàn bộ script này trong **Supabase SQL Editor → New Query → Run All**.
> Thứ tự chạy: Extensions → Helpers → Core Tables → Domain Tables → RLS → Functions → Seeds.

```sql
-- ╔══════════════════════════════════════════════════════════════╗
-- ║    SAAS MASTER DATABASE SCHEMA V3.0 — PRODUCTION READY      ║
-- ║    Chạy toàn bộ 1 lần trong Supabase SQL Editor             ║
-- ╚══════════════════════════════════════════════════════════════╝

BEGIN; -- Wrap trong transaction, nếu lỗi thì rollback toàn bộ

-- ════════════════════════════════════════════════════════════════
-- 0. EXTENSIONS
-- ════════════════════════════════════════════════════════════════
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ════════════════════════════════════════════════════════════════
-- 1. HELPER FUNCTIONS
-- ════════════════════════════════════════════════════════════════

-- Auto-update updated_at on any table
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Check if current JWT belongs to ADMIN (no DB query = no recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN',
    FALSE
  );
$$;

-- Attach updated_at trigger to any table
CREATE OR REPLACE FUNCTION public.attach_updated_at_trigger(table_name TEXT)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  EXECUTE format(
    'CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I
     FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()',
    table_name
  );
END;
$$;

-- ════════════════════════════════════════════════════════════════
-- 2. CORE TABLE: PROFILES
-- ════════════════════════════════════════════════════════════════
CREATE TABLE public.profiles (
  -- Identity
  id                  UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email               TEXT UNIQUE NOT NULL,
  full_name           TEXT,
  avatar_url          TEXT,

  -- Access Control
  role                TEXT DEFAULT 'USER' NOT NULL
                        CHECK (role IN ('USER', 'PARTNER', 'ADMIN')),
  plan                TEXT DEFAULT 'FREE' NOT NULL
                        CHECK (plan IN ('FREE', 'PRO', 'ENTERPRISE')),
  is_suspended        BOOLEAN DEFAULT FALSE NOT NULL,
  is_email_verified   BOOLEAN DEFAULT FALSE NOT NULL,
  suspend_reason      TEXT,

  -- Economy
  credits             INTEGER DEFAULT 10 NOT NULL CHECK (credits >= 0),
  affiliate_balance   NUMERIC(14,2) DEFAULT 0 NOT NULL CHECK (affiliate_balance >= 0),
  total_earned        NUMERIC(14,2) DEFAULT 0 NOT NULL,  -- Tổng hoa hồng từ trước đến nay

  -- Affiliate
  referred_by         UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  affiliate_code      TEXT UNIQUE,  -- Custom referral slug (optional)

  -- Billing
  stripe_customer_id  TEXT UNIQUE,
  plan_expires_at     TIMESTAMP WITH TIME ZONE,  -- NULL = không expire (lifetime)

  -- Metadata
  metadata            JSONB DEFAULT '{}'::jsonb NOT NULL,
  last_seen_at        TIMESTAMP WITH TIME ZONE,
  onboarding_step     INTEGER DEFAULT 0,  -- Track onboarding progress

  -- Timestamps
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
SELECT public.attach_updated_at_trigger('profiles');

-- Indexes
CREATE INDEX idx_profiles_role       ON public.profiles(role);
CREATE INDEX idx_profiles_plan       ON public.profiles(plan);
CREATE INDEX idx_profiles_referred   ON public.profiles(referred_by);
CREATE INDEX idx_profiles_email      ON public.profiles(email);
CREATE INDEX idx_profiles_stripe     ON public.profiles(stripe_customer_id);

-- RLS Policies (NO RECURSION — dùng JWT)
CREATE POLICY "profiles_select_own"   ON public.profiles FOR SELECT
  USING (auth.uid() = id);
CREATE POLICY "profiles_update_safe"  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role IS NOT DISTINCT FROM (SELECT role FROM public.profiles WHERE id = auth.uid())
    AND plan IS NOT DISTINCT FROM (SELECT plan FROM public.profiles WHERE id = auth.uid())
    AND credits IS NOT DISTINCT FROM (SELECT credits FROM public.profiles WHERE id = auth.uid())
    AND affiliate_balance IS NOT DISTINCT FROM (SELECT affiliate_balance FROM public.profiles WHERE id = auth.uid())
    AND is_suspended IS NOT DISTINCT FROM (SELECT is_suspended FROM public.profiles WHERE id = auth.uid())
  );
CREATE POLICY "profiles_admin_all"    ON public.profiles FOR ALL
  USING (public.is_admin());

-- ════════════════════════════════════════════════════════════════
-- 3. TRIGGER: AUTH → PROFILES SYNC
-- ════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_referred_by UUID;
  v_ref_raw     TEXT;
  v_aff_code    TEXT;
BEGIN
  -- Validate + resolve referred_by UUID
  v_ref_raw := NEW.raw_user_meta_data ->> 'referred_by';
  IF v_ref_raw IS NOT NULL
    AND v_ref_raw ~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  THEN
    SELECT id INTO v_referred_by
    FROM public.profiles
    WHERE id = v_ref_raw::UUID
      AND is_suspended = FALSE
    LIMIT 1;
  END IF;

  -- Generate unique affiliate code
  v_aff_code := UPPER(SUBSTRING(MD5(NEW.id::TEXT) FROM 1 FOR 8));

  INSERT INTO public.profiles (
    id, email, full_name, avatar_url, referred_by, affiliate_code
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NULLIF(TRIM(NEW.raw_user_meta_data ->> 'full_name'), ''),
      SPLIT_PART(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data ->> 'avatar_url',
    v_referred_by,
    v_aff_code
  )
  ON CONFLICT (id) DO UPDATE SET
    email      = EXCLUDED.email,
    full_name  = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    updated_at = NOW();

  -- Sync app_metadata.role into JWT for is_admin() function
  IF NOT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = NEW.id
      AND (raw_app_meta_data ->> 'role') IS NOT NULL
  ) THEN
    UPDATE auth.users
    SET raw_app_meta_data = raw_app_meta_data || '{"role":"USER"}'::jsonb
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE OF email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ════════════════════════════════════════════════════════════════
-- 4. TRANSACTIONS TABLE
-- ════════════════════════════════════════════════════════════════
CREATE TABLE public.transactions (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  amount          NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  currency        TEXT DEFAULT 'VND' NOT NULL CHECK (currency IN ('VND','USD','SGD','EUR')),
  credits_added   INTEGER DEFAULT 0 NOT NULL CHECK (credits_added >= 0),
  plan_activated  TEXT CHECK (plan_activated IN ('FREE','PRO','ENTERPRISE')),
  status          TEXT DEFAULT 'PENDING' NOT NULL
                    CHECK (status IN ('PENDING','SUCCESS','FAILED','REFUNDED','DISPUTED')),
  provider        TEXT NOT NULL
                    CHECK (provider IN ('STRIPE','PAYPAL','PAYOS','CASSO','MOMO','MANUAL')),
  provider_ref    TEXT UNIQUE NOT NULL,          -- Idempotency key — UNIQUE constraint
  webhook_payload JSONB,                          -- Raw webhook for debugging
  ip_address      INET,
  refunded_at     TIMESTAMP WITH TIME ZONE,
  metadata        JSONB DEFAULT '{}'::jsonb,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_txn_user_id    ON public.transactions(user_id);
CREATE INDEX idx_txn_status     ON public.transactions(status);
CREATE INDEX idx_txn_provider   ON public.transactions(provider);
CREATE INDEX idx_txn_created    ON public.transactions(created_at DESC);

CREATE POLICY "txn_user_read_own" ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "txn_admin_all"     ON public.transactions FOR ALL
  USING (public.is_admin());

-- ════════════════════════════════════════════════════════════════
-- 5. AFFILIATE LOGS
-- ════════════════════════════════════════════════════════════════
CREATE TABLE public.affiliate_logs (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  referred_user_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  transaction_id    UUID NOT NULL REFERENCES public.transactions(id) ON DELETE RESTRICT,
  commission_amount NUMERIC(14,2) NOT NULL CHECK (commission_amount > 0),
  commission_rate   NUMERIC(5,4) DEFAULT 0.3000 NOT NULL, -- Rate tại thời điểm giao dịch
  status            TEXT DEFAULT 'PENDING' NOT NULL
                      CHECK (status IN ('PENDING','APPROVED','REJECTED','PAID')),
  paid_via_payout   UUID,    -- FK sẽ thêm sau khi tạo bảng payout_requests
  paid_at           TIMESTAMP WITH TIME ZONE,
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE public.affiliate_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_aff_partner    ON public.affiliate_logs(partner_id);
CREATE INDEX idx_aff_status     ON public.affiliate_logs(status);
CREATE INDEX idx_aff_txn        ON public.affiliate_logs(transaction_id);

CREATE POLICY "aff_partner_read" ON public.affiliate_logs FOR SELECT
  USING (auth.uid() = partner_id);
CREATE POLICY "aff_admin_all"    ON public.affiliate_logs FOR ALL
  USING (public.is_admin());

-- ════════════════════════════════════════════════════════════════
-- 6. PAYOUT REQUESTS
-- ════════════════════════════════════════════════════════════════
CREATE TABLE public.payout_requests (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  amount           NUMERIC(14,2) NOT NULL CHECK (amount >= 500000),
  bank_name        TEXT NOT NULL CHECK (LENGTH(TRIM(bank_name)) >= 2),
  account_number   TEXT NOT NULL CHECK (account_number ~ '^\d{6,20}$'),
  account_holder   TEXT NOT NULL CHECK (LENGTH(TRIM(account_holder)) >= 2),
  note             TEXT,
  status           TEXT DEFAULT 'PENDING' NOT NULL
                     CHECK (status IN ('PENDING','PROCESSING','APPROVED','REJECTED')),
  reviewed_by      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at      TIMESTAMP WITH TIME ZONE,
  reject_reason    TEXT,
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;
SELECT public.attach_updated_at_trigger('payout_requests');

CREATE INDEX idx_payout_partner ON public.payout_requests(partner_id);
CREATE INDEX idx_payout_status  ON public.payout_requests(status);

-- FK từ affiliate_logs về payout_requests
ALTER TABLE public.affiliate_logs
  ADD CONSTRAINT fk_aff_payout
  FOREIGN KEY (paid_via_payout) REFERENCES public.payout_requests(id);

CREATE POLICY "payout_partner_read"   ON public.payout_requests FOR SELECT
  USING (auth.uid() = partner_id);
CREATE POLICY "payout_partner_insert" ON public.payout_requests FOR INSERT
  WITH CHECK (
    auth.uid() = partner_id
    AND amount <= (SELECT affiliate_balance FROM public.profiles WHERE id = auth.uid())
  );
CREATE POLICY "payout_admin_all"      ON public.payout_requests FOR ALL
  USING (public.is_admin());

-- ════════════════════════════════════════════════════════════════
-- 7. NOTIFICATIONS
-- ════════════════════════════════════════════════════════════════
CREATE TABLE public.notifications (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN (
                'payment_success','payment_failed','credit_low','credit_added',
                'plan_upgraded','plan_expired',
                'affiliate_earned','payout_approved','payout_rejected',
                'feature_unlock','system_announcement','admin_message'
              )),
  title       TEXT NOT NULL CHECK (LENGTH(title) BETWEEN 1 AND 200),
  message     TEXT NOT NULL CHECK (LENGTH(message) BETWEEN 1 AND 1000),
  action_url  TEXT,
  is_read     BOOLEAN DEFAULT FALSE NOT NULL,
  metadata    JSONB DEFAULT '{}'::jsonb,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_notif_user_unread ON public.notifications(user_id, is_read)
  WHERE is_read = FALSE;
CREATE INDEX idx_notif_user_time   ON public.notifications(user_id, created_at DESC);

CREATE POLICY "notif_user_all" ON public.notifications FOR ALL
  USING (auth.uid() = user_id);
CREATE POLICY "notif_admin_insert" ON public.notifications FOR INSERT
  WITH CHECK (public.is_admin());

-- ════════════════════════════════════════════════════════════════
-- 8. ADMIN AUDIT LOGS
-- ════════════════════════════════════════════════════════════════
CREATE TABLE public.admin_audit_logs (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action       TEXT NOT NULL,   -- 'APPROVE_PAYOUT','SUSPEND_USER','ADD_CREDITS', etc.
  target_type  TEXT NOT NULL,   -- 'profile','transaction','payout','notification'
  target_id    UUID,
  old_value    JSONB,
  new_value    JSONB,
  ip_address   INET,
  user_agent   TEXT,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_audit_admin    ON public.admin_audit_logs(admin_id);
CREATE INDEX idx_audit_action   ON public.admin_audit_logs(action);
CREATE INDEX idx_audit_target   ON public.admin_audit_logs(target_type, target_id);
CREATE INDEX idx_audit_created  ON public.admin_audit_logs(created_at DESC);

CREATE POLICY "audit_admin_only" ON public.admin_audit_logs FOR ALL
  USING (public.is_admin());

-- ════════════════════════════════════════════════════════════════
-- 9. FEATURE FLAGS
-- ════════════════════════════════════════════════════════════════
CREATE TABLE public.feature_flags (
  key           TEXT PRIMARY KEY CHECK (key ~ '^[a-z_]+$'),
  is_enabled    BOOLEAN DEFAULT FALSE NOT NULL,
  rollout_pct   SMALLINT DEFAULT 100 NOT NULL CHECK (rollout_pct BETWEEN 0 AND 100),
  allowed_plans TEXT[] DEFAULT '{}'::TEXT[],  -- empty = all plans
  description   TEXT,
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
SELECT public.attach_updated_at_trigger('feature_flags');

CREATE POLICY "flags_read_authenticated" ON public.feature_flags FOR SELECT
  USING (auth.role() = 'authenticated');
CREATE POLICY "flags_admin_write"        ON public.feature_flags FOR ALL
  USING (public.is_admin());

-- Default flags
INSERT INTO public.feature_flags (key, is_enabled, description) VALUES
  ('affiliate_program',  TRUE,  'Affiliate partner program'),
  ('ai_agent_v2',        FALSE, 'Next-gen AI agent engine'),
  ('bulk_export',        FALSE, 'Bulk data export'),
  ('dark_mode',          TRUE,  'Dark mode UI')
ON CONFLICT (key) DO NOTHING;

-- ════════════════════════════════════════════════════════════════
-- 10. CRITICAL DATABASE FUNCTIONS (RPC)
-- ════════════════════════════════════════════════════════════════

-- A. ATOMIC CREDIT DEDUCTION — Chống race condition hoàn toàn
CREATE OR REPLACE FUNCTION public.use_credit(p_user_id UUID)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_updated INT;
BEGIN
  UPDATE public.profiles
  SET credits = credits - 1,
      updated_at = NOW()
  WHERE id = p_user_id
    AND credits > 0
    AND is_suspended = FALSE
    AND (plan_expires_at IS NULL OR plan_expires_at > NOW());

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated > 0;
END;
$$;

-- B. ACTIVATE PLAN AFTER PAYMENT
CREATE OR REPLACE FUNCTION public.activate_plan(
  p_user_id       UUID,
  p_plan          TEXT,
  p_credits_add   INTEGER DEFAULT 0,
  p_expires_days  INTEGER DEFAULT NULL  -- NULL = không expire
)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.profiles SET
    plan           = p_plan,
    credits        = credits + p_credits_add,
    plan_expires_at = CASE
                        WHEN p_expires_days IS NOT NULL
                        THEN NOW() + (p_expires_days || ' days')::INTERVAL
                        ELSE plan_expires_at
                      END,
    updated_at     = NOW()
  WHERE id = p_user_id;
END;
$$;

-- C. PROCESS AFFILIATE COMMISSION
CREATE OR REPLACE FUNCTION public.process_affiliate_commission(
  p_referred_user_id UUID,
  p_transaction_id   UUID,
  p_amount           NUMERIC,
  p_rate             NUMERIC DEFAULT 0.30
)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_partner_id       UUID;
  v_commission       NUMERIC;
BEGIN
  -- Find partner
  SELECT referred_by INTO v_partner_id
  FROM public.profiles
  WHERE id = p_referred_user_id;

  IF v_partner_id IS NULL THEN RETURN; END IF;

  v_commission := ROUND(p_amount * p_rate, 0);

  -- Record commission
  INSERT INTO public.affiliate_logs
    (partner_id, referred_user_id, transaction_id, commission_amount, commission_rate)
  VALUES
    (v_partner_id, p_referred_user_id, p_transaction_id, v_commission, p_rate);

  -- Credit partner balance
  UPDATE public.profiles SET
    affiliate_balance = affiliate_balance + v_commission,
    total_earned      = total_earned + v_commission,
    updated_at        = NOW()
  WHERE id = v_partner_id;

  -- Notify partner
  INSERT INTO public.notifications
    (user_id, type, title, message, action_url, metadata)
  VALUES (
    v_partner_id,
    'affiliate_earned',
    'Bạn vừa nhận được hoa hồng!',
    format('Hoa hồng %s VND đã được cộng vào ví của bạn.', TO_CHAR(v_commission, 'FM999,999,999')),
    '/affiliate/dashboard',
    jsonb_build_object('amount', v_commission, 'transaction_id', p_transaction_id)
  );
END;
$$;

-- D. APPROVE PAYOUT — 1-Click Admin Action
CREATE OR REPLACE FUNCTION public.approve_payout(
  p_payout_id UUID,
  p_admin_id  UUID,
  p_ip        TEXT DEFAULT NULL
)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_payout   public.payout_requests;
  v_balance  NUMERIC;
BEGIN
  -- Lock và kiểm tra payout
  SELECT * INTO v_payout
  FROM public.payout_requests
  WHERE id = p_payout_id AND status = 'PENDING'
  FOR UPDATE NOWAIT;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'Lệnh rút không tồn tại hoặc đã xử lý');
  END IF;

  -- Kiểm tra balance đủ
  SELECT affiliate_balance INTO v_balance
  FROM public.profiles
  WHERE id = v_payout.partner_id
  FOR UPDATE NOWAIT;

  IF v_balance < v_payout.amount THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'Số dư không đủ');
  END IF;

  -- Trừ balance
  UPDATE public.profiles SET
    affiliate_balance = affiliate_balance - v_payout.amount,
    updated_at = NOW()
  WHERE id = v_payout.partner_id;

  -- Update payout status
  UPDATE public.payout_requests SET
    status      = 'APPROVED',
    reviewed_by = p_admin_id,
    reviewed_at = NOW(),
    updated_at  = NOW()
  WHERE id = p_payout_id;

  -- Mark affiliate logs as PAID
  UPDATE public.affiliate_logs SET
    status         = 'PAID',
    paid_via_payout = p_payout_id,
    paid_at        = NOW()
  WHERE partner_id = v_payout.partner_id
    AND status = 'APPROVED';

  -- Notify partner
  INSERT INTO public.notifications
    (user_id, type, title, message, action_url)
  VALUES (
    v_payout.partner_id,
    'payout_approved',
    '✅ Lệnh rút tiền đã được duyệt!',
    format('Số tiền %s VND sẽ về tài khoản của bạn trong 24 giờ làm việc.',
           TO_CHAR(v_payout.amount, 'FM999,999,999')),
    '/affiliate/payouts'
  );

  -- Audit log
  INSERT INTO public.admin_audit_logs
    (admin_id, action, target_type, target_id, new_value, ip_address)
  VALUES (
    p_admin_id, 'APPROVE_PAYOUT', 'payout', p_payout_id,
    jsonb_build_object('amount', v_payout.amount, 'partner_id', v_payout.partner_id),
    p_ip::INET
  );

  RETURN jsonb_build_object('success', TRUE, 'amount', v_payout.amount);
EXCEPTION
  WHEN lock_not_available THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'Lệnh rút đang được xử lý, thử lại sau');
END;
$$;

-- E. ADD CREDITS (Admin manual action)
CREATE OR REPLACE FUNCTION public.admin_add_credits(
  p_user_id   UUID,
  p_credits   INTEGER,
  p_admin_id  UUID,
  p_reason    TEXT DEFAULT 'Manual credit adjustment'
)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_old_credits INTEGER;
BEGIN
  SELECT credits INTO v_old_credits FROM public.profiles WHERE id = p_user_id;

  UPDATE public.profiles SET
    credits = credits + p_credits,
    updated_at = NOW()
  WHERE id = p_user_id;

  INSERT INTO public.notifications (user_id, type, title, message)
  VALUES (
    p_user_id, 'credit_added',
    format('Bạn vừa nhận %s credits!', p_credits),
    format('Admin đã thêm %s credits vào tài khoản của bạn. Lý do: %s', p_credits, p_reason)
  );

  INSERT INTO public.admin_audit_logs
    (admin_id, action, target_type, target_id, old_value, new_value)
  VALUES (
    p_admin_id, 'ADD_CREDITS', 'profile', p_user_id,
    jsonb_build_object('credits', v_old_credits),
    jsonb_build_object('credits', v_old_credits + p_credits, 'added', p_credits, 'reason', p_reason)
  );
END;
$$;

-- F. SUSPEND USER
CREATE OR REPLACE FUNCTION public.admin_suspend_user(
  p_user_id  UUID,
  p_admin_id UUID,
  p_reason   TEXT,
  p_suspend  BOOLEAN DEFAULT TRUE
)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.profiles SET
    is_suspended   = p_suspend,
    suspend_reason = CASE WHEN p_suspend THEN p_reason ELSE NULL END,
    updated_at     = NOW()
  WHERE id = p_user_id;

  -- Update JWT metadata to block access immediately
  UPDATE auth.users SET
    raw_app_meta_data = raw_app_meta_data ||
      jsonb_build_object('suspended', p_suspend)
  WHERE id = p_user_id;

  INSERT INTO public.admin_audit_logs
    (admin_id, action, target_type, target_id, new_value)
  VALUES (
    p_admin_id,
    CASE WHEN p_suspend THEN 'SUSPEND_USER' ELSE 'UNSUSPEND_USER' END,
    'profile', p_user_id,
    jsonb_build_object('reason', p_reason)
  );
END;
$$;

-- G. GET ADMIN DASHBOARD STATS
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'mrr', COALESCE(SUM(CASE WHEN currency = 'VND' THEN amount ELSE amount * 25000 END) FILTER (
      WHERE status = 'SUCCESS'
        AND created_at >= DATE_TRUNC('month', NOW())
    ), 0),
    'total_users',         (SELECT COUNT(*) FROM public.profiles WHERE role != 'ADMIN'),
    'pro_users',           (SELECT COUNT(*) FROM public.profiles WHERE plan IN ('PRO','ENTERPRISE')),
    'pending_payouts',     (SELECT COUNT(*) FROM public.payout_requests WHERE status = 'PENDING'),
    'pending_payout_total',(SELECT COALESCE(SUM(amount), 0) FROM public.payout_requests WHERE status = 'PENDING'),
    'today_revenue',       COALESCE(SUM(amount) FILTER (
      WHERE status = 'SUCCESS'
        AND created_at >= CURRENT_DATE
        AND currency = 'VND'
    ), 0)
  ) INTO v_result
  FROM public.transactions;

  RETURN v_result;
END;
$$;

COMMIT; -- Nếu đến đây không lỗi = toàn bộ schema đã được apply thành công
```

---

## 🗂️ PHẦN III: CẤU TRÚC THƯ MỤC NEXT.JS 15 — CHUẨN PRODUCTION

```
my-saas-app/
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx                  # Marketing layout (header, footer)
│   │   ├── page.tsx                    # Landing page
│   │   ├── pricing/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── about/page.tsx
│   ├── (auth)/
│   │   ├── layout.tsx                  # Auth layout (centered card)
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── auth/
│   │   ├── callback/route.ts           # OAuth PKCE callback
│   │   └── confirm/route.ts            # Email confirm
│   ├── (dashboard)/
│   │   ├── layout.tsx                  # Sidebar + topbar layout
│   │   ├── dashboard/
│   │   │   ├── page.tsx               # Main workspace
│   │   │   └── loading.tsx
│   │   ├── [CORE_FEATURE]/             # Domain-specific pages
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── billing/
│   │   │   ├── page.tsx
│   │   │   └── success/page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── notifications/
│   │       └── page.tsx
│   ├── (affiliate)/
│   │   ├── layout.tsx
│   │   └── affiliate/
│   │       ├── dashboard/page.tsx
│   │       └── payouts/page.tsx
│   ├── admin/
│   │   ├── layout.tsx                  # Admin auth guard layout
│   │   ├── page.tsx                    # Admin overview
│   │   ├── users/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── transactions/page.tsx
│   │   ├── payouts/page.tsx
│   │   ├── flags/page.tsx
│   │   └── audit/page.tsx
│   ├── api/
│   │   ├── webhook/
│   │   │   ├── stripe/route.ts
│   │   │   └── payos/route.ts
│   │   ├── ai/
│   │   │   └── [feature]/route.ts
│   │   └── health/route.ts
│   ├── suspended/page.tsx
│   ├── error.tsx                       # Global error boundary
│   ├── not-found.tsx
│   ├── loading.tsx
│   └── layout.tsx                      # Root layout
├── components/
│   ├── ui/                             # Shadcn components
│   ├── marketing/
│   │   ├── hero.tsx
│   │   ├── features-bento.tsx
│   │   ├── pricing-table.tsx
│   │   ├── testimonials.tsx
│   │   ├── faq-accordion.tsx
│   │   └── cta-banner.tsx
│   ├── dashboard/
│   │   ├── sidebar.tsx
│   │   ├── topbar.tsx
│   │   ├── command-palette.tsx
│   │   ├── credit-badge.tsx
│   │   └── notification-bell.tsx
│   ├── affiliate/
│   │   ├── metric-cards.tsx
│   │   ├── commission-chart.tsx
│   │   └── withdrawal-form.tsx
│   ├── admin/
│   │   ├── stats-overview.tsx
│   │   ├── users-table.tsx
│   │   ├── payouts-table.tsx
│   │   └── payout-approve-btn.tsx
│   └── shared/
│       ├── loading-spinner.tsx
│       ├── empty-state.tsx
│       └── data-table.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   ├── service.ts
│   │   └── actions.ts
│   ├── payments/
│   │   ├── stripe.ts
│   │   ├── payos.ts
│   │   └── verify.ts
│   ├── ai/
│   │   ├── credit-gate.ts
│   │   └── [feature].ts
│   ├── email/
│   │   ├── resend.ts
│   │   └── templates/
│   │       ├── payment-confirm.tsx
│   │       └── welcome.tsx
│   ├── notifications/
│   │   └── telegram.ts
│   └── utils/
│       ├── ratelimit.ts
│       ├── validators.ts
│       └── format.ts
├── types/
│   ├── supabase.ts                     # Generated from Supabase CLI
│   └── index.ts
├── hooks/
│   ├── use-user.ts
│   ├── use-credits.ts
│   ├── use-notifications.ts
│   └── use-feature-flag.ts
├── middleware.ts
├── next.config.ts
├── .env.local                          # NEVER commit
├── .env.example                        # Commit this
└── package.json
```

---

## 🌐 PHẦN IV: 7 MODULE CHỨC NĂNG — CODE HOÀN CHỈNH

### Module 1 · LANDING PAGE

```typescript
// app/(marketing)/page.tsx
import { Metadata } from 'next';
import { HeroSection } from '@/components/marketing/hero';
import { FeaturesBento } from '@/components/marketing/features-bento';
import { PricingTable } from '@/components/marketing/pricing-table';
import { Testimonials } from '@/components/marketing/testimonials';
import { FaqAccordion } from '@/components/marketing/faq-accordion';
import { CtaBanner } from '@/components/marketing/cta-banner';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: '[TÊN SẢN PHẨM] — [TAGLINE NGẮN GỌN]',
  description: '[MÔ TẢ SEO 150 KÝ TỰ — chứa keyword chính]',
  openGraph: {
    title: '[TÊN SẢN PHẨM]',
    description: '[MÔ TẢ OG]',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
};

// JSON-LD Schema
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: '[TÊN SẢN PHẨM]',
  applicationCategory: 'BusinessApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'VND',
    description: 'Bắt đầu miễn phí',
  },
};

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <HeroSection isLoggedIn={!!user} />
        <FeaturesBento />
        <PricingTable />
        <Testimonials />
        <FaqAccordion />
        <CtaBanner isLoggedIn={!!user} />
      </main>
    </>
  );
}
```

```typescript
// components/marketing/hero.tsx
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps { isLoggedIn: boolean; }

export function HeroSection({ isLoggedIn }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

      <div className="container mx-auto px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            [SOCIAL PROOF — Ví dụ: 2,000+ người dùng đang tin tưởng]
          </span>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            [ĐỘNG TỪ MẠNH]{' '}
            <span className="text-primary">[KẾT QUẢ CỤ THỂ]</span>
            <br />
            [TRONG X THỜI GIAN]
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            [MÔ TẢ 1–2 câu: sản phẩm làm gì, cho ai, lợi ích chính là gì]
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8">
              <Link href={isLoggedIn ? '/dashboard' : '/register'}>
                {isLoggedIn ? 'Vào Dashboard' : 'Bắt đầu miễn phí'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <Link href="#demo">Xem demo 2 phút</Link>
            </Button>
          </div>

          {/* Trust line */}
          <p className="mt-6 text-sm text-muted-foreground">
            Không cần thẻ tín dụng · Bắt đầu trong 30 giây · Hủy bất kỳ lúc nào
          </p>
        </motion.div>
      </div>
    </section>
  );
}
```

### Module 2 · AUTHENTICATION & DASHBOARD

```typescript
// app/(auth)/login/page.tsx
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LoginForm } from './login-form';

export const metadata: Metadata = { title: 'Đăng nhập' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const params = await searchParams;

  if (user) redirect(params.next || '/dashboard');

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Chào mừng trở lại</h1>
          <p className="text-muted-foreground mt-2">Đăng nhập để tiếp tục</p>
        </div>
        {params.error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
            {params.error === 'auth_failed' && 'Đăng nhập thất bại. Vui lòng thử lại.'}
            {params.error === 'missing_code' && 'Phiên đăng nhập hết hạn. Vui lòng thử lại.'}
          </div>
        )}
        <LoginForm nextUrl={params.next} />
      </div>
    </div>
  );
}
```

```typescript
// app/(auth)/login/login-form.tsx
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { signInWithGoogle } from '@/lib/supabase/actions';
import { Chrome, Loader2 } from 'lucide-react';

export function LoginForm({ nextUrl }: { nextUrl?: string }) {
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Button
        className="w-full h-12 text-base"
        onClick={handleGoogleLogin}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Chrome className="mr-2 h-5 w-5" />
        )}
        Đăng nhập với Google
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Bằng cách đăng nhập, bạn đồng ý với{' '}
        <a href="/terms" className="underline hover:text-foreground">Điều khoản</a>
        {' '}và{' '}
        <a href="/privacy" className="underline hover:text-foreground">Chính sách bảo mật</a>.
      </p>
    </div>
  );
}
```

```typescript
// app/(dashboard)/layout.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Topbar } from '@/components/dashboard/topbar';
import { CommandPalette } from '@/components/dashboard/command-palette';
import type { ReactNode } from 'react';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, role, plan, credits, is_suspended')
    .eq('id', user.id)
    .single();

  if (!profile) redirect('/login');
  if (profile.is_suspended) redirect('/suspended');

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar profile={profile} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar profile={profile} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
```

### Module 3 · BILLING & WEBHOOK

```typescript
// app/(dashboard)/billing/page.tsx
import { createClient } from '@/lib/supabase/server';
import { PricingTable } from '@/components/marketing/pricing-table';
import { TransactionHistory } from './transaction-history';

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: profile }, { data: transactions }] = await Promise.all([
    supabase.from('profiles').select('plan, credits, plan_expires_at').eq('id', user!.id).single(),
    supabase.from('transactions').select('*').eq('user_id', user!.id)
      .order('created_at', { ascending: false }).limit(20),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Billing & Gói dịch vụ</h1>
        <p className="text-muted-foreground">
          Gói hiện tại: <strong>{profile?.plan}</strong> ·{' '}
          Credits còn lại: <strong>{profile?.credits}</strong>
        </p>
      </div>
      <PricingTable currentPlan={profile?.plan} userId={user!.id} />
      <TransactionHistory transactions={transactions || []} />
    </div>
  );
}
```

```typescript
// app/api/webhook/payos/route.ts
import { createServiceClient } from '@/lib/supabase/service';
import { verifyPayOSChecksum } from '@/lib/payments/verify';
import { rateLimiters, getClientIP } from '@/lib/utils/ratelimit';
import { notifyAdminTelegram } from '@/lib/notifications/telegram';
import { sendPaymentEmail } from '@/lib/email/resend';

// Plan config — AI điền số credits và ngày expire phù hợp với sản phẩm
const PLAN_CONFIG: Record<string, { credits: number; expireDays: number | null }> = {
  PRO:        { credits: 100, expireDays: 30 },
  ENTERPRISE: { credits: 500, expireDays: 30 },
};

export async function POST(req: Request) {
  // 1. Rate limit theo IP
  const ip = await getClientIP();
  const { success } = await rateLimiters.webhook.limit(ip);
  if (!success) return new Response('Rate limited', { status: 429 });

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  // 2. Verify checksum
  if (!verifyPayOSChecksum(payload, process.env.PAYOS_CHECKSUM_KEY!)) {
    console.error('PayOS webhook: invalid checksum', { ip });
    return new Response('Invalid signature', { status: 400 });
  }

  // 3. Chỉ xử lý khi PAID
  if (payload['code'] !== '00') {
    return new Response('Payment not successful', { status: 200 });
  }

  const orderCode = String(payload['orderCode'] || '');
  const amount = Number(payload['amount'] || 0);

  // Parse orderCode: format SUB_USERID_PLAN
  const parts = orderCode.split('_');
  if (parts.length < 3 || parts[0] !== 'SUB') {
    return new Response('Invalid order format', { status: 400 });
  }
  const userIdShort = parts[1];
  const plan = parts[2] as keyof typeof PLAN_CONFIG;

  if (!PLAN_CONFIG[plan]) {
    return new Response('Invalid plan', { status: 400 });
  }

  const supabase = createServiceClient();

  // 4. Resolve full user_id từ short ID
  const { data: profileMatch } = await supabase
    .from('profiles')
    .select('id, email, full_name, referred_by')
    .ilike('id', `${userIdShort}%`)
    .single();

  if (!profileMatch) return new Response('User not found', { status: 200 });

  // 5. Idempotency — INSERT với UNIQUE constraint trên provider_ref
  const { error: txError } = await supabase.from('transactions').insert({
    user_id:         profileMatch.id,
    amount,
    currency:        'VND',
    credits_added:   PLAN_CONFIG[plan].credits,
    plan_activated:  plan,
    status:          'SUCCESS',
    provider:        'PAYOS',
    provider_ref:    orderCode,
    webhook_payload: payload,
    ip_address:      ip,
  });

  if (txError) {
    if (txError.code === '23505') {
      return new Response('Duplicate webhook — ignored', { status: 200 });
    }
    console.error('Transaction insert error:', txError);
    return new Response('DB error', { status: 500 });
  }

  // 6. Activate plan (atomic)
  const cfg = PLAN_CONFIG[plan];
  await supabase.rpc('activate_plan', {
    p_user_id:      profileMatch.id,
    p_plan:         plan,
    p_credits_add:  cfg.credits,
    p_expires_days: cfg.expireDays,
  });

  // 7. Affiliate commission
  const { data: txRecord } = await supabase
    .from('transactions')
    .select('id')
    .eq('provider_ref', orderCode)
    .single();

  if (txRecord) {
    await supabase.rpc('process_affiliate_commission', {
      p_referred_user_id: profileMatch.id,
      p_transaction_id:   txRecord.id,
      p_amount:           amount,
      p_rate:             0.30,
    });
  }

  // 8. Payment success notification
  await supabase.from('notifications').insert({
    user_id: profileMatch.id,
    type:    'payment_success',
    title:   `🎉 Nâng cấp ${plan} thành công!`,
    message: `Bạn đã được cộng ${cfg.credits} credits. Bắt đầu sử dụng ngay!`,
    action_url: '/dashboard',
  });

  // 9. Email + Telegram (fire & forget — không block response)
  Promise.all([
    sendPaymentEmail({
      to:       profileMatch.email,
      name:     profileMatch.full_name || 'Bạn',
      plan,
      amount,
      credits:  cfg.credits,
    }),
    notifyAdminTelegram({
      event:   '💰 Thanh toán mới',
      user:    profileMatch.email,
      plan,
      amount:  `${amount.toLocaleString('vi-VN')} VND`,
    }),
  ]).catch(err => console.error('Notification error (non-critical):', err));

  return new Response('OK', { status: 200 });
}
```

```typescript
// lib/notifications/telegram.ts
export async function notifyAdminTelegram(data: Record<string, string>) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!token || !chatId) return;

  const text = Object.entries(data)
    .map(([k, v]) => `*${k}*: ${v}`)
    .join('\n');

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id:    chatId,
      text,
      parse_mode: 'Markdown',
    }),
  });
}

export async function alertCritical(event: string, detail: string) {
  await notifyAdminTelegram({
    '🚨 CRITICAL': event,
    'Chi tiết': detail,
    'Thời gian': new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
  });
}
```

### Module 4 · AFFILIATE DASHBOARD

```typescript
// app/(affiliate)/affiliate/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { MetricCards } from '@/components/affiliate/metric-cards';
import { CommissionChart } from '@/components/affiliate/commission-chart';
import { WithdrawalForm } from '@/components/affiliate/withdrawal-form';
import { ReferralLinkCard } from '@/components/affiliate/referral-link-card';

export default async function AffiliateDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [
    { data: profile },
    { data: commissions },
    { data: payouts },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, affiliate_balance, total_earned, affiliate_code')
      .eq('id', user.id)
      .single(),
    supabase
      .from('affiliate_logs')
      .select('commission_amount, status, created_at')
      .eq('partner_id', user.id)
      .order('created_at', { ascending: false })
      .limit(90),
    supabase
      .from('payout_requests')
      .select('*')
      .eq('partner_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  const totalSignups = commissions?.length || 0;
  const pendingAmount = commissions
    ?.filter(c => c.status === 'PENDING')
    .reduce((s, c) => s + Number(c.commission_amount), 0) || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Affiliate Dashboard</h1>
        <p className="text-muted-foreground">Hoa hồng 30% cho mỗi người bạn giới thiệu</p>
      </div>

      <MetricCards
        balance={profile?.affiliate_balance || 0}
        totalEarned={profile?.total_earned || 0}
        totalSignups={totalSignups}
        pendingAmount={pendingAmount}
      />

      <ReferralLinkCard
        affiliateCode={profile?.affiliate_code || ''}
        userId={user.id}
      />

      <CommissionChart commissions={commissions || []} />

      <WithdrawalForm
        currentBalance={profile?.affiliate_balance || 0}
        payouts={payouts || []}
      />
    </div>
  );
}
```

```typescript
// components/affiliate/withdrawal-form.tsx
'use client';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { WithdrawalSchema } from '@/lib/utils/validators';
import { requestWithdrawal } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { z } from 'zod';

type FormData = z.infer<typeof WithdrawalSchema>;

export function WithdrawalForm({
  currentBalance,
  payouts,
}: {
  currentBalance: number;
  payouts: Array<{ id: string; amount: number; status: string; created_at: string }>;
}) {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(WithdrawalSchema),
  });

  function onSubmit(data: FormData) {
    if (data.amount > currentBalance) {
      toast.error('Số tiền vượt quá số dư khả dụng');
      return;
    }
    startTransition(async () => {
      const result = await requestWithdrawal(data);
      if (result.success) {
        toast.success('Đã gửi yêu cầu rút tiền!', {
          description: 'Admin sẽ xử lý trong vòng 24 giờ làm việc.',
        });
        reset();
      } else {
        toast.error(result.error || 'Có lỗi xảy ra');
      }
    });
  }

  return (
    <div className="rounded-xl border bg-card p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Rút tiền hoa hồng</h2>
        <p className="text-sm text-muted-foreground">
          Số dư khả dụng: <strong>{currentBalance.toLocaleString('vi-VN')} VND</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Số tiền muốn rút (VND)</Label>
            <Input type="number" {...register('amount', { valueAsNumber: true })} placeholder="500000" />
            {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
          </div>
          <div className="space-y-1">
            <Label>Tên ngân hàng</Label>
            <Input {...register('bank_name')} placeholder="VCB / TCB / MB / ..." />
            {errors.bank_name && <p className="text-xs text-destructive">{errors.bank_name.message}</p>}
          </div>
          <div className="space-y-1">
            <Label>Số tài khoản</Label>
            <Input {...register('account_number')} placeholder="0123456789" />
            {errors.account_number && <p className="text-xs text-destructive">{errors.account_number.message}</p>}
          </div>
          <div className="space-y-1">
            <Label>Chủ tài khoản</Label>
            <Input {...register('account_holder')} placeholder="NGUYEN VAN A" className="uppercase" />
            {errors.account_holder && <p className="text-xs text-destructive">{errors.account_holder.message}</p>}
          </div>
        </div>
        <Button type="submit" disabled={isPending || currentBalance < 500000}>
          {isPending ? 'Đang gửi...' : 'Gửi yêu cầu rút tiền'}
        </Button>
        {currentBalance < 500000 && (
          <p className="text-xs text-muted-foreground">Số dư tối thiểu 500,000 VND để rút tiền</p>
        )}
      </form>
    </div>
  );
}
```

```typescript
// components/affiliate/actions.ts
'use server';
import { createClient } from '@/lib/supabase/server';
import { WithdrawalSchema } from '@/lib/utils/validators';
import { revalidatePath } from 'next/cache';
import type { z } from 'zod';

export async function requestWithdrawal(
  raw: z.infer<typeof WithdrawalSchema>
): Promise<{ success: boolean; error?: string }> {
  // 1. Validate input
  const parsed = WithdrawalSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: 'Dữ liệu không hợp lệ' };
  }
  const data = parsed.data;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Chưa đăng nhập' };

  // 2. Server-side balance check (không tin client)
  const { data: profile } = await supabase
    .from('profiles')
    .select('affiliate_balance, is_suspended')
    .eq('id', user.id)
    .single();

  if (!profile || profile.is_suspended) {
    return { success: false, error: 'Tài khoản không hợp lệ' };
  }
  if (data.amount > Number(profile.affiliate_balance)) {
    return { success: false, error: 'Số dư không đủ' };
  }

  // 3. Check không có payout PENDING đang chờ
  const { count } = await supabase
    .from('payout_requests')
    .select('*', { count: 'exact', head: true })
    .eq('partner_id', user.id)
    .eq('status', 'PENDING');

  if ((count || 0) > 0) {
    return { success: false, error: 'Bạn đã có lệnh rút đang chờ xử lý' };
  }

  // 4. Insert payout request
  const { error } = await supabase.from('payout_requests').insert({
    partner_id:     user.id,
    amount:         data.amount,
    bank_name:      data.bank_name,
    account_number: data.account_number,
    account_holder: data.account_holder.toUpperCase(),
    note:           data.note,
  });

  if (error) return { success: false, error: 'Không thể tạo yêu cầu rút tiền' };

  revalidatePath('/affiliate/dashboard');
  return { success: true };
}
```

### Module 5 · ADMIN DASHBOARD

```typescript
// app/admin/layout.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import type { ReactNode } from 'react';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Double-check role từ DB (không chỉ JWT)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'ADMIN') redirect('/dashboard');

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar adminName={profile.full_name} />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
```

```typescript
// app/admin/page.tsx
import { createClient } from '@/lib/supabase/server';
import { StatsOverview } from '@/components/admin/stats-overview';
import { RecentTransactions } from '@/components/admin/recent-transactions';
import { PendingPayouts } from '@/components/admin/pending-payouts';

export default async function AdminPage() {
  const supabase = await createClient();

  const [{ data: stats }, { data: recentTx }, { data: pendingPayouts }] = await Promise.all([
    supabase.rpc('get_admin_stats'),
    supabase.from('transactions').select('*, profiles(email, full_name)')
      .eq('status', 'SUCCESS').order('created_at', { ascending: false }).limit(10),
    supabase.from('payout_requests').select('*, profiles(email, full_name, affiliate_balance)')
      .eq('status', 'PENDING').order('created_at', { ascending: true }),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <StatsOverview stats={stats} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <RecentTransactions transactions={recentTx || []} />
        <PendingPayouts payouts={pendingPayouts || []} />
      </div>
    </div>
  );
}
```

```typescript
// components/admin/payout-approve-btn.tsx
'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Check, X, Loader2 } from 'lucide-react';
import { approvePayout, rejectPayout } from './admin-actions';

export function PayoutApproveBtn({ payoutId }: { payoutId: string }) {
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null);

  async function handleApprove() {
    setLoading('approve');
    const result = await approvePayout(payoutId);
    setLoading(null);
    if (result.success) {
      toast.success('Đã duyệt lệnh rút tiền!');
    } else {
      toast.error(result.error || 'Không thể duyệt lệnh rút');
    }
  }

  async function handleReject() {
    const reason = prompt('Lý do từ chối:');
    if (!reason) return;
    setLoading('reject');
    const result = await rejectPayout(payoutId, reason);
    setLoading(null);
    if (result.success) {
      toast.success('Đã từ chối lệnh rút');
    } else {
      toast.error(result.error || 'Lỗi xảy ra');
    }
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" onClick={handleApprove} disabled={!!loading}>
        {loading === 'approve' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
        Duyệt
      </Button>
      <Button size="sm" variant="destructive" onClick={handleReject} disabled={!!loading}>
        {loading === 'reject' ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
        Từ chối
      </Button>
    </div>
  );
}
```

```typescript
// components/admin/admin-actions.ts
'use server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

async function getAdminUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'ADMIN') throw new Error('Forbidden');

  return { supabase, user };
}

export async function approvePayout(payoutId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase, user } = await getAdminUser();
    const { data } = await supabase.rpc('approve_payout', {
      p_payout_id: payoutId,
      p_admin_id:  user.id,
    });
    if (!data?.success) return { success: false, error: data?.error };
    revalidatePath('/admin');
    revalidatePath('/admin/payouts');
    return { success: true };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function rejectPayout(payoutId: string, reason: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase, user } = await getAdminUser();

    const { data: payout } = await supabase
      .from('payout_requests').select('partner_id').eq('id', payoutId).single();

    await supabase.from('payout_requests').update({
      status:        'REJECTED',
      reject_reason: reason,
      reviewed_by:   user.id,
      reviewed_at:   new Date().toISOString(),
    }).eq('id', payoutId).eq('status', 'PENDING');

    if (payout) {
      await supabase.from('notifications').insert({
        user_id:    payout.partner_id,
        type:       'payout_rejected',
        title:      '❌ Lệnh rút tiền bị từ chối',
        message:    `Lý do: ${reason}. Vui lòng liên hệ hỗ trợ nếu cần thêm thông tin.`,
        action_url: '/affiliate/payouts',
      });
    }

    revalidatePath('/admin');
    return { success: true };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
```

### Module 6 · AI AGENT WORKFLOW ENGINE

```typescript
// lib/ai/credit-gate.ts
import { createServiceClient } from '@/lib/supabase/service';
import { rateLimiters } from '@/lib/utils/ratelimit';
import { alertCritical } from '@/lib/notifications/telegram';

export interface CreditGateResult {
  allowed:   boolean;
  reason?:   'RATE_LIMIT' | 'NO_CREDITS' | 'SUSPENDED' | 'PLAN_EXPIRED';
  remaining?: number;
}

export async function checkAndConsumeCredit(
  userId: string,
  plan:   string,
  ip:     string
): Promise<CreditGateResult> {
  // 1. Rate limit by plan tier
  const limiter = await rateLimiters[plan === 'FREE' ? 'free' : 'pro'];
  const { success: ratePassed, remaining } = await limiter.limit(userId);
  if (!ratePassed) {
    return { allowed: false, reason: 'RATE_LIMIT', remaining: 0 };
  }

  // 2. Atomic credit deduction
  const supabase = createServiceClient();
  const { data: consumed } = await supabase.rpc('use_credit', { p_user_id: userId });

  if (!consumed) {
    return { allowed: false, reason: 'NO_CREDITS', remaining: 0 };
  }

  // 3. Check remaining credits — warn if low
  const { data: profile } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', userId)
    .single();

  if (profile && profile.credits <= 2) {
    await supabase.from('notifications').insert({
      user_id:    userId,
      type:       'credit_low',
      title:      '⚠️ Credits sắp hết!',
      message:    `Bạn còn ${profile.credits} credits. Nâng cấp để tiếp tục sử dụng không gián đoạn.`,
      action_url: '/billing',
    });
  }

  return { allowed: true, remaining };
}
```

```typescript
// app/api/ai/[feature]/route.ts
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { createClient } from '@/lib/supabase/server';
import { checkAndConsumeCredit } from '@/lib/ai/credit-gate';
import { getClientIP, rateLimitResponse } from '@/lib/utils/ratelimit';
import { createServiceClient } from '@/lib/supabase/service';

export const maxDuration = 60; // Vercel function timeout

export async function POST(
  req: Request,
  { params }: { params: Promise<{ feature: string }> }
) {
  // 1. Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  // 2. Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, credits, is_suspended')
    .eq('id', user.id)
    .single();

  if (!profile || profile.is_suspended) {
    return new Response('Account suspended', { status: 403 });
  }

  // 3. Credit gate + rate limit
  const ip = await getClientIP();
  const { feature } = await params;
  const gate = await checkAndConsumeCredit(user.id, profile.plan, ip);

  if (!gate.allowed) {
    const messages = {
      RATE_LIMIT:   { error: 'Quá nhiều yêu cầu. Vui lòng chờ 1 phút.', code: 429 },
      NO_CREDITS:   { error: 'Hết credits. Vui lòng nâng cấp gói dịch vụ.', code: 402 },
      SUSPENDED:    { error: 'Tài khoản bị tạm khóa.', code: 403 },
      PLAN_EXPIRED: { error: 'Gói dịch vụ hết hạn.', code: 402 },
    };
    const msg = messages[gate.reason!];
    return new Response(JSON.stringify({ error: msg.error, upgrade_url: '/billing' }), {
      status: msg.code,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 4. Parse request body
  let body: { messages: Array<{ role: string; content: string }>; context?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  // 5. Build system prompt từ domain (AI tự generate dựa trên product idea)
  const systemPrompt = getSystemPrompt(feature);

  // 6. Stream AI response
  const result = streamText({
    model: anthropic('claude-sonnet-4-5'),
    system: systemPrompt,
    messages: body.messages.map(m => ({
      role:    m.role as 'user' | 'assistant',
      content: m.content,
    })),
    maxTokens: 4000,
    onFinish: async ({ text, usage }) => {
      // Save result to Supabase Storage
      const serviceClient = createServiceClient();
      const fileName = `${user.id}/${feature}/${Date.now()}.txt`;

      await serviceClient.storage
        .from('ai-outputs')
        .upload(fileName, text, {
          contentType: 'text/plain',
          cacheControl: '3600',
        });

      // Log usage for analytics
      console.log(`AI usage — user: ${user.id}, feature: ${feature}, tokens: ${usage.totalTokens}`);
    },
  });

  return result.toDataStreamResponse();
}

function getSystemPrompt(feature: string): string {
  // AI tự điền system prompt phù hợp với từng feature của sản phẩm
  const prompts: Record<string, string> = {
    default: `Bạn là AI assistant chuyên nghiệp. Hãy trả lời chính xác, ngắn gọn và hữu ích.`,
    // Thêm prompts cụ thể cho từng feature domain tại đây
  };
  return prompts[feature] || prompts.default;
}
```

```typescript
// hooks/use-ai-stream.ts
'use client';
import { useChat } from 'ai/react';
import { toast } from 'sonner';

export function useAIStream(feature: string) {
  const { messages, input, setInput, handleSubmit, isLoading, error, stop } = useChat({
    api: `/api/ai/${feature}`,
    onError: (err) => {
      let msg = 'Có lỗi xảy ra';
      try {
        const body = JSON.parse(err.message);
        msg = body.error || msg;
        if (body.upgrade_url) {
          toast.error(msg, {
            action: { label: 'Nâng cấp', onClick: () => window.location.href = body.upgrade_url },
          });
          return;
        }
      } catch {}
      toast.error(msg);
    },
  });

  return { messages, input, setInput, handleSubmit, isLoading, error, stop };
}
```

### Module 7 · GLOBAL ERROR BOUNDARIES & MONITORING

```typescript
// app/error.tsx
'use client';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to monitoring service
    if (process.env.NODE_ENV === 'production') {
      console.error('[Global Error]', {
        message: error.message,
        digest:  error.digest,
        stack:   error.stack,
      });
      // Sentry.captureException(error); // Uncomment khi đã cài Sentry
    }
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-destructive/10">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">Oops! Có lỗi xảy ra</h2>
          <p className="text-muted-foreground text-sm">
            {process.env.NODE_ENV === 'development'
              ? error.message
              : 'Hệ thống gặp sự cố tạm thời. Chúng tôi đang xử lý.'}
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground mt-1">Mã lỗi: {error.digest}</p>
          )}
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>Thử lại</Button>
          <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
            Về Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
```

```typescript
// app/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center space-y-6">
        <h1 className="text-8xl font-black text-primary">404</h1>
        <div>
          <h2 className="text-2xl font-bold">Trang không tìm thấy</h2>
          <p className="text-muted-foreground mt-2">
            Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.
          </p>
        </div>
        <Button asChild>
          <Link href="/">Về trang chủ</Link>
        </Button>
      </div>
    </div>
  );
}
```

```typescript
// app/api/health/route.ts
import { createServiceClient } from '@/lib/supabase/service';

export const runtime = 'edge';

export async function GET() {
  const start = Date.now();

  try {
    const supabase = createServiceClient();
    await supabase.from('feature_flags').select('key').limit(1);

    return Response.json({
      status:   'healthy',
      latency:  `${Date.now() - start}ms`,
      ts:       new Date().toISOString(),
    });
  } catch (err) {
    return Response.json({
      status: 'unhealthy',
      error:  (err as Error).message,
      ts:     new Date().toISOString(),
    }, { status: 503 });
  }
}
```

```typescript
// hooks/use-notifications.ts
'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  action_url?: string;
  is_read: boolean;
  created_at: string;
}

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();

    // Initial fetch
    supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) {
          setNotifications(data);
          setUnreadCount(data.filter(n => !n.is_read).length);
        }
      });

    // Realtime subscription
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on('postgres_changes', {
        event:  'INSERT',
        schema: 'public',
        table:  'notifications',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        const newNotif = payload.new as Notification;
        setNotifications(prev => [newNotif, ...prev]);
        setUnreadCount(prev => prev + 1);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  async function markAllRead() {
    const supabase = createClient();
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }

  return { notifications, unreadCount, markAllRead };
}
```

```typescript
// hooks/use-feature-flag.ts
'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useFeatureFlag(flagKey: string, userPlan: string): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('feature_flags')
      .select('is_enabled, rollout_pct, allowed_plans')
      .eq('key', flagKey)
      .single()
      .then(({ data }) => {
        if (!data || !data.is_enabled) { setEnabled(false); return; }
        if (data.allowed_plans?.length > 0 && !data.allowed_plans.includes(userPlan)) {
          setEnabled(false); return;
        }
        // Rollout percentage check
        const hash = Array.from(flagKey).reduce((acc, c) => acc + c.charCodeAt(0), 0);
        setEnabled((hash % 100) < data.rollout_pct);
      });
  }, [flagKey, userPlan]);

  return enabled;
}
```

---

## 📊 PHẦN V: OBSERVABILITY & MONITORING STACK

### Sentry Error Tracking

```typescript
// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  environment: process.env.NODE_ENV,
  beforeSend(event) {
    // Strip PII từ error events
    if (event.user) {
      delete event.user.email;
      delete event.user.ip_address;
    }
    return event;
  },
});
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.05,
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 1.0,
  integrations: [Sentry.replayIntegration()],
});
```

### Custom Alert System

```typescript
// lib/monitoring/alerts.ts
import { alertCritical } from '@/lib/notifications/telegram';

export async function monitorPaymentAnomaly(amount: number, userId: string) {
  const THRESHOLD_VND = 50_000_000; // 50M VND
  if (amount > THRESHOLD_VND) {
    await alertCritical(
      'PAYMENT_ANOMALY',
      `Amount: ${amount.toLocaleString('vi-VN')} VND | User: ${userId}`
    );
  }
}

export async function monitorAuthAnomaly(event: string, userId: string, ip: string) {
  await alertCritical(`AUTH_ANOMALY: ${event}`, `User: ${userId} | IP: ${ip}`);
}
```

---

## 🚀 PHẦN VI: CI/CD PIPELINE — GITHUB ACTIONS

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'

jobs:
  # ── Job 1: Type Check + Lint ─────────────────────────────────
  quality:
    name: Quality Checks
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: TypeScript check
        run: npm run type-check

      - name: ESLint
        run: npm run lint

  # ── Job 2: Build Check ───────────────────────────────────────
  build:
    name: Build Verification
    runs-on: ubuntu-latest
    needs: quality
    env:
      NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
      NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
      NEXT_PUBLIC_SITE_URL: https://yourdomain.com
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '${{ env.NODE_VERSION }}', cache: 'npm' }
      - run: npm ci
      - run: npm run build

  # ── Job 3: Deploy Production ─────────────────────────────────
  deploy:
    name: Deploy to Vercel
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel Production
        uses: amondnet/vercel-action@v25
        with:
          vercel-token:      ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id:     ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args:       '--prod'
```

```yaml
# .github/workflows/db-migrate.yml
name: Database Migration

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Target environment'
        required: true
        type: choice
        options: [staging, production]

jobs:
  migrate:
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
    steps:
      - uses: actions/checkout@v4
      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        with: { version: latest }
      - name: Run migrations
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_DB_PASSWORD: ${{ secrets.SUPABASE_DB_PASSWORD }}
          SUPABASE_PROJECT_ID: ${{ secrets.SUPABASE_PROJECT_ID }}
        run: |
          supabase link --project-ref $SUPABASE_PROJECT_ID
          supabase db push
```

---

## 🔒 PHẦN VII: OWASP TOP 10 SECURITY CHECKLIST

> AI phải verify từng điểm này trước khi coi sản phẩm là production-ready.

| # | OWASP Risk | Biện pháp trong V3 | Verify |
|---|-----------|-------------------|--------|
| A01 | Broken Access Control | RLS trên 100% bảng, Middleware role check, JWT claims | ✅ |
| A02 | Cryptographic Failures | HttpOnly Secure cookies, HTTPS-only (HSTS header), bcrypt via Supabase Auth | ✅ |
| A03 | Injection | Supabase parameterized queries (no raw SQL từ user), Zod input validation | ✅ |
| A04 | Insecure Design | PKCE OAuth, Credit gate atomic, Idempotency key, Rate limiting | ✅ |
| A05 | Security Misconfiguration | CSP headers, X-Frame-Options, Permissions-Policy, env var separation | ✅ |
| A06 | Vulnerable Components | `npm audit` trong CI, dependabot alerts enabled | ✅ |
| A07 | Auth Failures | Session via HttpOnly cookie, PKCE, rate limit on auth routes | ✅ |
| A08 | Software Integrity | Webhook signature verify (HMAC-SHA256), replay attack protection (5min window) | ✅ |
| A09 | Logging Failures | Admin audit logs, Sentry error tracking, Telegram alerts for critical | ✅ |
| A10 | SSRF | Whitelist allowed domains trong next.config.ts, validate URLs trước khi fetch | ✅ |

**Bổ sung kiểm tra tay:**
```bash
# Chạy sau khi deploy staging
npm audit --audit-level=high
npx @next/codemod@latest next-async-request-api .
```

---

## 📦 PHẦN VIII: PACKAGE.JSON & DEPENDENCIES HOÀN CHỈNH

```json
{
  "name": "my-saas-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev":         "next dev --turbo",
    "build":       "next build",
    "start":       "next start",
    "lint":        "next lint",
    "type-check":  "tsc --noEmit",
    "db:generate": "supabase gen types typescript --local > types/supabase.ts",
    "db:push":     "supabase db push",
    "db:reset":    "supabase db reset"
  },
  "dependencies": {
    "next":                    "^15.0.0",
    "react":                   "^19.0.0",
    "react-dom":               "^19.0.0",
    "typescript":              "^5.6.0",
    "@supabase/supabase-js":   "^2.45.0",
    "@supabase/ssr":           "^0.5.0",
    "ai":                      "^4.0.0",
    "@ai-sdk/anthropic":       "^1.0.0",
    "stripe":                  "^17.0.0",
    "@upstash/ratelimit":      "^2.0.0",
    "@upstash/redis":          "^1.34.0",
    "resend":                  "^4.0.0",
    "zod":                     "^3.23.0",
    "react-hook-form":         "^7.53.0",
    "@hookform/resolvers":     "^3.9.0",
    "sonner":                  "^1.5.0",
    "framer-motion":           "^11.11.0",
    "recharts":                "^2.12.0",
    "cmdk":                    "^1.0.0",
    "lucide-react":            "^0.460.0",
    "class-variance-authority":"^0.7.0",
    "clsx":                    "^2.1.0",
    "tailwind-merge":          "^2.5.0",
    "@sentry/nextjs":          "^8.36.0"
  },
  "devDependencies": {
    "@types/node":    "^22.0.0",
    "@types/react":   "^19.0.0",
    "tailwindcss":    "^4.0.0",
    "eslint":         "^9.0.0",
    "eslint-config-next": "^15.0.0"
  }
}
```

---

## 🔑 PHẦN IX: ENVIRONMENT VARIABLES — COMPLETE REFERENCE

```bash
# ═══════════════════════════════════════════════════════
# .env.example — Commit file này. KHÔNG commit .env.local
# ═══════════════════════════════════════════════════════

# ── PUBLIC (safe for browser) ──────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx

# ── SERVER ONLY (NEVER expose to browser) ─────────────
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# PayOS
PAYOS_CLIENT_ID=...
PAYOS_API_KEY=...
PAYOS_CHECKSUM_KEY=...

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=https://....upstash.io
UPSTASH_REDIS_REST_TOKEN=...

# Email (Resend)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Telegram Alerts
TELEGRAM_BOT_TOKEN=...
TELEGRAM_ADMIN_CHAT_ID=...

# AI
ANTHROPIC_API_KEY=sk-ant-...

# Monitoring
SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_AUTH_TOKEN=sntrys_...

# ── VERCEL SPECIFIC ────────────────────────────────────
# Tự động được inject bởi Vercel — không cần set thủ công:
# VERCEL_URL, VERCEL_ENV, NEXT_PUBLIC_VERCEL_URL
```

---

## ✅ PHẦN X: PRODUCTION READINESS CHECKLIST — 30 ĐIỂM

> AI phải pass 100% checklist này trước khi giao code cho anh.

### Database (10 điểm)
- [ ] 1. Tất cả bảng `public.*` đã có `ENABLE ROW LEVEL SECURITY`
- [ ] 2. Không có policy nào query lại bảng đang apply (no recursion)
- [ ] 3. Tất cả foreign keys có `ON DELETE` action phù hợp
- [ ] 4. Tất cả bảng có `updated_at` trigger (nếu cần)
- [ ] 5. `provider_ref` là `UNIQUE` trong bảng transactions
- [ ] 6. `use_credit()` function dùng atomic UPDATE (không 2-step)
- [ ] 7. `approve_payout()` dùng `FOR UPDATE NOWAIT` để tránh double-approve
- [ ] 8. Tất cả RPC functions có `SECURITY DEFINER`
- [ ] 9. DB migration files trong `supabase/migrations/` (không chạy SQL Editor thủ công)
- [ ] 10. Đã chạy `supabase gen types typescript` để sync types

### Security (8 điểm)
- [ ] 11. PKCE flow cho OAuth
- [ ] 12. HttpOnly Secure cookies (không LocalStorage)
- [ ] 13. Webhook signature verification (HMAC-SHA256)
- [ ] 14. Replay attack protection (5-minute window)
- [ ] 15. Rate limiting active trên AI routes và auth routes
- [ ] 16. CSP + security headers trong next.config.ts
- [ ] 17. `SUPABASE_SERVICE_ROLE_KEY` chỉ dùng ở server, không expose client
- [ ] 18. UUID validation trước khi dùng affiliate cookie

### Code Quality (7 điểm)
- [ ] 19. `npm run type-check` pass 0 errors
- [ ] 20. `npm run lint` pass 0 errors
- [ ] 21. `npm run build` thành công
- [ ] 22. Tất cả forms có Zod validation tại Server Action
- [ ] 23. Tất cả async Server Actions có try/catch
- [ ] 24. Không có `any` type không cần thiết
- [ ] 25. Không có console.log còn sót trong production code

### Infrastructure (5 điểm)
- [ ] 26. `.env.example` có đầy đủ tất cả variables (không có value thật)
- [ ] 27. `.env.local` trong `.gitignore`
- [ ] 28. Vercel environments: Development / Preview / Production tách biệt
- [ ] 29. `/api/health` endpoint hoạt động và return 200
- [ ] 30. Uptime monitoring configured (Better Uptime / Checkly ping mỗi 60s)

---

## 🎯 PHẦN XI: QUY TRÌNH THỰC THI — 7 BƯỚC BẤT BIẾN

> **Luật sắt**: AI KHÔNG được bỏ qua bất kỳ bước nào. KHÔNG được viết tắt. KHÔNG được cắt xén code.

### Bước 0 · PRODUCT ANALYSIS (Bắt buộc — Trước khi code)

AI xuất ra document phân tích gồm:
```
1. PRODUCT TYPE: [SaaS / Marketplace / B2B / Social / ...]
2. USER PERSONAS:
   - Persona A: [Tên, nghề, pain point, willingness to pay]
   - Persona B: [...]
   - Persona C: [...]
3. USER JOURNEY: Guest → [Step 1] → [Step 2] → Free → Paid → Power User
4. DOMAIN TABLES (beyond scaffold):
   - [table_name]: [mô tả] — [columns chính]
5. PRICING TIERS:
   - FREE: [giới hạn cụ thể] — 0 VND
   - PRO: [N credits, X tính năng] — [Y VND/tháng]
   - ENTERPRISE: [unlimited + support] — [Z VND/tháng]
6. TECH RISKS:
   - Risk 1: [Mô tả] → Mitigation: [Giải pháp]
   - Risk 2: [...]
```

### Bước 1 · DATABASE

Xuất toàn bộ SQL trong 1 block:
- Extensions, Helper Functions
- Scaffold tables (profiles, transactions, affiliate_logs, payout_requests, notifications, admin_audit_logs, feature_flags)
- Domain-specific tables (tùy theo product idea)
- RLS policies tất cả bảng
- All Functions/RPCs
- Seed data
- Verify script (SELECT kiểm tra RLS)

### Bước 2 · AUTHENTICATION & ROUTING

- `lib/supabase/` (client, server, service, actions)
- `middleware.ts` (affiliate tracking + route protection + suspend check)
- `app/(auth)/` pages (login, register)
- `app/auth/callback/route.ts`
- `app/(dashboard)/layout.tsx`

### Bước 3 · PAYMENT & WEBHOOK

- `lib/payments/` (stripe.ts, payos.ts, verify.ts)
- `app/api/webhook/stripe/route.ts`
- `app/api/webhook/payos/route.ts`
- `app/(dashboard)/billing/page.tsx`
- `lib/email/resend.ts` + email templates
- `lib/notifications/telegram.ts`

### Bước 4 · AFFILIATE & ADMIN

- `app/(affiliate)/affiliate/dashboard/page.tsx`
- `components/affiliate/` (metric-cards, commission-chart, withdrawal-form)
- `components/affiliate/actions.ts` (Server Actions)
- `app/admin/layout.tsx` + tất cả admin pages
- `components/admin/` (stats, tables, approve button)
- `components/admin/admin-actions.ts`

### Bước 5 · AI AGENT WORKFLOW

- `lib/ai/credit-gate.ts`
- `app/api/ai/[feature]/route.ts`
- Domain-specific AI logic
- `hooks/use-ai-stream.ts`
- Progress UI components
- Storage integration

### Bước 6 · ERROR HANDLING & MONITORING

- `app/error.tsx`, `app/not-found.tsx`, `app/loading.tsx`
- Nested `error.tsx` cho từng route group
- `app/api/health/route.ts`
- `sentry.server.config.ts`, `sentry.client.config.ts`
- `lib/monitoring/alerts.ts`
- `hooks/use-notifications.ts`
- `hooks/use-feature-flag.ts`

### Bước 7 · PRODUCTION READINESS

- Chạy 30-point checklist
- `npm run build` phải pass
- `npm audit --audit-level=high` phải pass
- Review tất cả TODO (không được có)
- Document `README.md` với setup instructions
- Deploy to staging → smoke test → deploy production

---

> **📌 LỜI KẾT**: Đây là framework không thay đổi theo sản phẩm.
> Mọi thứ trong `[brackets]` là placeholder — AI phải điền giá trị thực tế dựa trên Phần 0.
> Một sản phẩm tỷ đô không có `// TODO`. Không có mock data. Không có shortcuts.
> **Anh đưa ý tưởng → AI chạy 7 bước → Ra sản phẩm deploy được ngay.**

---

## ⚡ HƯỚNG DẪN SỬ DỤNG — CHỈ 3 BƯỚC, RA SẢN PHẨM NGAY

> Anh chỉ cần làm đúng 3 bước này. Không cần biết code. Không cần setup gì thêm.

---

### BƯỚC 1 · MỞ CLAUDE MỚI — PASTE ĐOẠN NÀY VÀO Ô CHAT

```
Bạn là Senior Principal Software Engineer chuyên xây dựng SaaS production-ready.
Đọc kỹ toàn bộ Blueprint V3 bên dưới và ghi nhớ tất cả quy tắc, cấu trúc, và checklist.
Sau khi tôi cung cấp ý tưởng sản phẩm, bạn PHẢI thực thi đúng 7 bước theo thứ tự.
TUYỆT ĐỐI KHÔNG viết // TODO, mock data, placeholder, hoặc cắt xén code.
Mỗi bước phải hoàn chỉnh 100% trước khi chuyển bước tiếp theo.
Xác nhận bạn đã đọc xong bằng cách liệt kê 7 bước và nói "Sẵn sàng. Hãy cho tôi ý tưởng."

[PASTE TOÀN BỘ NỘI DUNG FILE SAAS_MASTER_ARCHITECTURE_V3_TOP1_WORLD.md VÀO ĐÂY]
```

---

### BƯỚC 2 · ĐIỀN Ý TƯỞNG THEO MẪU NÀY — PASTE VÀO CHAT

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TÊN SẢN PHẨM     : [Ví dụ: ContentAI Pro]
  MÔ TẢ CỐT LÕI    : [Ví dụ: Tool AI giúp marketer Việt Nam tạo 30 bài content/ngày chỉ trong 10 phút]
  LĨNH VỰC         : [Ví dụ: AI Marketing]
  LOẠI SẢN PHẨM    : [Ví dụ: B2C SaaS]
  KHÁCH HÀNG       : [Ví dụ: Freelancer content, SME marketing team]
  USP               : [Ví dụ: Duy nhất hiểu tiếng lóng và văn hóa Việt, không cần chỉnh sửa sau khi generate]
  THỊ TRƯỜNG        : [Ví dụ: Việt Nam, mở rộng SEA Q3/2025]
  MÔ HÌNH DOANH THU: [Ví dụ: Credit-based + Subscription]
  TÍNH NĂNG LÕI    : [Ví dụ: 1. Generate bài viết Facebook/TikTok/Zalo 2. Viết caption ảnh 3. Lên lịch content 30 ngày 4. A/B test headline]
  ĐỐI THỦ          : [Ví dụ: ChatGPT (không hiểu văn hóa VN), Writesonic (tiếng Anh), Jasper (quá đắt)]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bắt đầu Bước 0: Phân tích ý tưởng sản phẩm.
```

---

### BƯỚC 3 · ĐIỀU KHIỂN CLAUDE CHẠY TỪNG BƯỚC

Sau khi Claude xong Bước 0, anh chỉ cần gõ lần lượt:

```
Tiếp tục Bước 1: Viết toàn bộ SQL Database.
```
```
Tiếp tục Bước 2: Viết Authentication và Dashboard layout.
```
```
Tiếp tục Bước 3: Viết Payment và Webhook handler.
```
```
Tiếp tục Bước 4: Viết Affiliate Dashboard và Admin Dashboard.
```
```
Tiếp tục Bước 5: Viết AI Agent Workflow và Credit Gate.
```
```
Tiếp tục Bước 6: Viết Error Boundaries và Monitoring.
```
```
Tiếp tục Bước 7: Chạy Production Readiness Checklist 30 điểm.
```

> **Mẹo:** Nếu Claude bắt đầu viết tắt hoặc bỏ qua phần nào, gõ ngay:
> `"Viết đầy đủ, không được cắt xén, không được dùng // TODO"`

---

## 📋 MẪU Ý TƯỞNG — COPY & SỬA NHANH

Anh chỉ cần thay thông tin, không cần viết lại từ đầu:

### Mẫu 1 · AI SaaS Tool
```
TÊN SẢN PHẨM     : [Tên]AI
MÔ TẢ CỐT LÕI    : Giúp [đối tượng] làm [việc gì] nhanh hơn X lần bằng AI
LĨNH VỰC         : AI [Marketing / Legal / Finance / HR / Education]
LOẠI SẢN PHẨM    : B2C SaaS
KHÁCH HÀNG       : [Freelancer / SME / Agency / Cá nhân]
USP               : [Điểm khác biệt duy nhất so với đối thủ]
THỊ TRƯỜNG        : Việt Nam → SEA
MÔ HÌNH DOANH THU: Credit-based + Subscription (Free 10 credits/tháng, Pro 199k/tháng)
TÍNH NĂNG LÕI    : 1. [Feature 1] 2. [Feature 2] 3. [Feature 3] 4. [Feature 4]
ĐỐI THỦ          : [Đối thủ 1] (điểm yếu), [Đối thủ 2] (điểm yếu)
```

### Mẫu 2 · B2B Platform
```
TÊN SẢN PHẨM     : [Tên]Hub
MÔ TẢ CỐT LÕI    : Nền tảng giúp [doanh nghiệp loại nào] quản lý [quy trình gì] tự động hóa hoàn toàn
LĨNH VỰC         : [FinTech / PropTech / HRTech / LegalTech]
LOẠI SẢN PHẨM    : B2B SaaS
KHÁCH HÀNG       : Doanh nghiệp SME 10–200 nhân viên
USP               : Tích hợp với hệ thống Việt Nam (MISA, FAST, ViettelPay) — đối thủ nước ngoài không làm được
THỊ TRƯỜNG        : Việt Nam
MÔ HÌNH DOANH THU: Subscription theo số user (299k/user/tháng, tối thiểu 5 user)
TÍNH NĂNG LÕI    : 1. [Feature 1] 2. [Feature 2] 3. [Feature 3]
ĐỐI THỦ          : [Đối thủ 1] (quá phức tạp), [Đối thủ 2] (không có tiếng Việt)
```

### Mẫu 3 · Marketplace / Platform
```
TÊN SẢN PHẨM     : [Tên]Market
MÔ TẢ CỐT LÕI    : Kết nối [bên cung] với [bên cầu] trong lĩnh vực [ngành]
LĨNH VỰC         : [EdTech / Real Estate / Healthcare / Legal]
LOẠI SẢN PHẨM    : Marketplace 2 chiều
KHÁCH HÀNG       : Bên cung: [Ai] — Bên cầu: [Ai]
USP               : [Cơ chế match thông minh / đảm bảo chất lượng / thanh toán escrow]
THỊ TRƯỜNG        : Việt Nam
MÔ HÌNH DOANH THU: Commission 10–15% mỗi giao dịch + Subscription cho Pro seller
TÍNH NĂNG LÕI    : 1. [Listing] 2. [Matching] 3. [Thanh toán] 4. [Review]
ĐỐI THỦ          : [Đối thủ 1], [Đối thủ 2]
```

---

## ⚠️ LƯU Ý QUAN TRỌNG KHI SỬ DỤNG

**Về giới hạn output của Claude:**
Claude có giới hạn ký tự mỗi lần trả lời. Khi thấy code bị cắt giữa chừng, gõ ngay:
```
Tiếp tục từ chỗ vừa dừng, không lặp lại phần đã viết.
```

**Về chất lượng code:**
Code được generate cần một developer review lại trước khi deploy production thật. Đây là thực tế của mọi AI tool — không phải giới hạn của Blueprint này.

**Về thứ tự bước:**
Bắt buộc chạy đúng thứ tự Bước 0 → 7. Không được nhảy bước vì mỗi bước phụ thuộc vào bước trước.

**Về môi trường deploy:**
Cần có tài khoản: Supabase (free), Vercel (free), Upstash Redis (free), Resend (free 3k email/tháng). Tổng chi phí ban đầu: $0.

