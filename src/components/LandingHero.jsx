import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Tv, ShoppingBag, Bot, Building2, Zap, ShieldCheck, CheckCircle2,
  ArrowRight, Radio, Share2, UserCheck, Award, CreditCard, QrCode, Globe, Play,
  Volume2, Lock, Layers, Flame, Activity, Maximize2, TrendingUp, Cpu, Clock,
  DollarSign, HeartHandshake, Check, Star, Wifi, BarChart2, MessageSquare,
  Camera, Film, Mic, LayoutGrid, Sliders, Target, Rocket, Users, Shield,
  Zap as Lightning, ChevronRight, Package, Truck, PhoneCall, Eye, ToggleLeft, RefreshCw
} from 'lucide-react';

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ─── Section Wrapper with scroll reveal ──────────────────────────────────────
function RevealSection({ children, className = '', delay = 0 }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, desc, color = 'red', delay = 0 }) {
  const colorMap = {
    red:    { border: 'hover:border-[#EF4444]', icon: 'bg-[#EF4444]/15 text-[#EF4444]', glow: 'hover:shadow-neon-red' },
    blue:   { border: 'hover:border-[#3B82F6]', icon: 'bg-[#3B82F6]/15 text-[#3B82F6]', glow: 'hover:shadow-neon-blue' },
    purple: { border: 'hover:border-[#8B5CF6]', icon: 'bg-[#8B5CF6]/15 text-[#8B5CF6]', glow: 'hover:shadow-neon-purple' },
    green:  { border: 'hover:border-emerald-400', icon: 'bg-emerald-400/15 text-emerald-400', glow: 'hover:shadow-neon-green' },
  };
  const c = colorMap[color];
  return (
    <RevealSection delay={delay}>
      <div className={`zoom-card glass-panel p-6 rounded-2xl border border-white/10 space-y-4 ${c.border} ${c.glow} transition-all duration-300`}>
        <div className={`w-12 h-12 rounded-2xl ${c.icon} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-base font-black text-white">{title}</h3>
        <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
      </div>
    </RevealSection>
  );
}

// ─── Stat Counter ─────────────────────────────────────────────────────────────
function StatBadge({ value, label, sub, color = 'red' }) {
  const colorMap = { red:'text-[#EF4444] border-[#EF4444]/30', blue:'text-[#3B82F6] border-[#3B82F6]/30', purple:'text-[#8B5CF6] border-[#8B5CF6]/30', green:'text-emerald-400 border-emerald-400/30' };
  return (
    <div className={`p-4 rounded-2xl bg-[#0A0A0A]/90 border ${colorMap[color].split(' ')[1]} space-y-1 zoom-card`}>
      <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">{label}</span>
      <span className={`text-3xl font-black ${colorMap[color].split(' ')[0]} animate-count-up`}>{value}</span>
      <span className="text-[10px] text-gray-500 font-mono block">{sub}</span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function LandingHero({ setActiveTab, setGoogleLoginModalOpen, aiAvatarFeatureEnabled = false }) {
  const [heroBillingCycle, setHeroBillingCycle] = useState('annual');
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);

  // Pricing plans
  const officialPlans = [
    {
      id: 'free', name: 'Bản Dùng Thử Free', price: '0₫', period: 'Vĩnh viễn',
      badge: 'MIỄN PHÍ TRẢI NGHIỆM', badgeBg: 'bg-gray-500/20 text-gray-300 border-gray-500/40',
      liveTime: '20 Giờ Live / tháng', channels: '2 Kênh Multistream', quality: 'HD 720p',
      features: [
        '⚡ 20 Giờ Live Stream Free / tháng',
        'Multistream 2 Luồng song song (TikTok, FB)',
        '📌 Chèn Logo thương hiệu ép buộc',
        '🎬 Phòng dựng Studio Multicam 4K',
        '🤖 Tự động bắt comment chốt đơn',
      ],
      buttonText: 'TRẢI NGHIỆM FREE NGAY', buttonBg: 'bg-white/10 hover:bg-white/20 text-white',
    },
    {
      id: 'starter',
      name: 'Starter Pro',
      price: heroBillingCycle === 'annual' ? '4.900.000₫' : '490.000₫',
      period: heroBillingCycle === 'annual' ? '/ năm (Tặng 2 tháng)' : '/ tháng',
      badge: 'KHỞI NGHIỆP BÁN HÀNG', badgeBg: 'bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/40',
      liveTime: '200 Giờ Live / tháng', channels: '3 Kênh Multistream', quality: 'Full HD 1080p',
      features: [
        '⚡ 200 Giờ Live Stream / tháng (~6.6h/ngày)',
        'Multistream 3 Luồng song song (TikTok, FB, YT)',
        '💄 Trọn bộ 30 Hiệu ứng Làm đẹp & Background AI 4K',
        '🚫 Gỡ bỏ 100% Logo thương hiệu ép buộc',
        '🎬 Restream Link Live & Nạp File Video Quay Sẵn 24/7',
        '🚀 Bán hàng tự động 24/7 - Tiết kiệm 100% chi phí MC/Studio',
        '⚡ Tự động bắt comment SĐT & nhắn tin chốt đơn khách hàng',
      ],
      buttonText: heroBillingCycle === "annual" ? "💳 SEPAY THANH TOÁN GÓI NĂM STARTER (4.9M)" : "💳 SEPAY THANH TOÁN GÓI STARTER (490K)",
      buttonBg: 'bg-[#3B82F6] hover:bg-blue-600 shadow-neon-blue',
    },
    {
      id: 'business',
      name: 'Business Growth',
      price: heroBillingCycle === 'annual' ? '14.900.000₫' : '1.490.000₫',
      period: heroBillingCycle === 'annual' ? '/ năm (Tặng 2 tháng)' : '/ tháng',
      badge: 'BÁN CHẠY NHẤT (PHỔ BIẾN)', badgeBg: 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40',
      popular: true,
      liveTime: '700 Giờ Live / tháng', channels: '10 Kênh Multistream', quality: '4K 60fps Ultra HD',
      features: [
        '⚡ 700 Giờ Live / tháng (~100h live/ngày)',
        'Multistream 10 Luồng phát song song đa nền tảng',
        '🛍️ Auto Chốt Đơn AI + Kết nối GHTK / GHN / Viettel Post',
        '💄 Trọn bộ 30 Hiệu ứng Làm đẹp & Background AI 4K',
        '🎬 Nạp File Video Khủng Hàng Chục GB & Báo cáo doanh số',
        '📈 Bán hàng đa kênh X3 doanh số - Phá đảo TikTok, FB, YT, Shopee',
        '📊 Báo cáo phân tích doanh số từng phiên live & sản phẩm',
      ],
      buttonText: heroBillingCycle === "annual" ? "💳 SEPAY THANH TOÁN GÓI NĂM BUSINESS (14.9M)" : "💳 SEPAY THANH TOÁN GÓI BUSINESS (1.49M)",
      buttonBg: 'bg-[#EF4444] hover:bg-red-600 shadow-neon-red',
    },
    {
      id: 'enterprise',
      name: 'Enterprise VIP',
      price: heroBillingCycle === 'annual' ? '49.000.000₫' : '4.900.000₫',
      period: heroBillingCycle === 'annual' ? '/ năm (Tặng 2 tháng)' : '/ tháng',
      badge: 'VIP TOÀN DIỆN 24/7', badgeBg: 'bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/40',
      liveTime: 'UNLIMITED 4.000 GIỜ / tháng', channels: '30+ Luồng Stream', quality: '4K Dedicated 10Gbps',
      features: [
        '🚀 UNLIMITED 4.000 GIỜ LIVE/tháng (Bật phát 24/7)',
        'Multistream 30+ luồng phát song song không giới hạn',
        '⚡ Dedicated RTMP Proxy Server 10Gbps siêu tốc',
        '🛍️ Auto Chốt Đơn + Kết nối GHTK / GHN / Viettel Post',
        '👥 Phân quyền nhân viên theo Gmail + White-Label Branding',
        '👑 Bật phát 24/7 Vô hạn không lo nghẽn mạng hay khóa luồng',
        '🔒 Cam kết Uptime 99.99% & Hỗ trợ kỹ thuật 1:1 24/7',
      ],
      buttonText: heroBillingCycle === "annual" ? "💳 SEPAY THANH TOÁN GÓI ENTERPRISE NĂM (49M)" : "💳 SEPAY THANH TOÁN GÓI ENTERPRISE VIP (4.9M)",
      buttonBg: 'bg-[#8B5CF6] hover:bg-purple-600 shadow-neon-purple',
    },
  ];

  // Core feature pillars
  const featurePillars = [
    {
      tab: '🎬 LIVE STUDIO', icon: Film, color: 'red',
      title: 'Phòng Dựng Live Studio 4K Chuyên Nghiệp',
      desc: 'Studio phát live đẳng cấp quốc tế ngay trên trình duyệt. Không cần phần mềm cồng kềnh, không cần kỹ thuật viên.',
      points: [
        'Multi-Camera 4 góc quay (Mặt Host, Cận cảnh SP, Studio toàn cảnh, Cầm tay)',
        'Bộ chọn độ phân giải 4K/2K/1080p/720p theo ý muốn',
        '30 Hiệu ứng làm đẹp AI (Baby Skin, Glass Skin, V-Line, Makeup Studio...)',
        '30 Phông nền background AI 4K (Studio, Hà Nội, Paris, Space, Nature...)',
        'Lower-Third Graphics - Dải banner thông tin sản phẩm cuộn tự động',
        'Tách nền phông ảo 3D siêu sắc nét real-time',
      ]
    },
    {
      tab: '📡 MULTISTREAM', icon: Radio, color: 'blue',
      title: 'Phát Đồng Thời 30+ Kênh Chỉ 1 Cú Nhấp',
      desc: 'Tự động phát live lên tất cả nền tảng thương mại điện tử hàng đầu cùng một lúc. Tiếp cận hàng triệu khách mua hàng tiềm năng.',
      points: [
        'TikTok Live / TikTok Shop — Phát trực tiếp cùng Shop',
        'Facebook Fanpage / Facebook Live — Tương tác thẳng với fans',
        'YouTube Live — Thu hút tệp khách hàng global',
        'Shopee Live — Kết nối trực tiếp với buyer trên Shopee',
        'Instagram Reels Live — Tiếp cận giới trẻ Gen Z',
        'Twitch / Kick / Discord — Mở rộng đa kênh không giới hạn',
      ]
    },
    {
      tab: '🤖 AUTO CHỐT ĐƠN', icon: ShoppingBag, color: 'green',
      title: 'AI Auto Chốt Đơn & Vận Chuyển 0 Giây',
      desc: 'Hệ thống AI tự động nhận diện comment, bắt SĐT khách, tạo đơn hàng và kết nối nhà vận chuyển mà không cần thao tác thủ công.',
      points: [
        'Tự động bắt comment "chốt", "mua", "+1" từ khách hàng real-time',
        'AI phân tích SĐT và địa chỉ giao hàng từ comment chat',
        'Tạo đơn hàng tự động và kết nối GHTK / GHN / Viettel Post',
        'Gửi tin nhắn xác nhận đơn và mã vận đơn tự động',
        'Dashboard quản lý đơn hàng real-time theo từng kênh live',
        'Báo cáo doanh số, tỉ lệ chốt đơn và hành vi khách hàng',
      ]
    },
    {
      tab: '📊 ANALYTICS', icon: BarChart2, color: 'purple',
      title: 'Báo Cáo & Phân Tích Doanh Số Chi Tiết',
      desc: 'Dashboard phân tích chuyên sâu giúp bạn nắm rõ hiệu quả từng phiên live, từng sản phẩm và từng kênh bán hàng.',
      points: [
        'Biểu đồ doanh số real-time theo từng phiên livestream',
        'Thống kê người xem, lượt tương tác và tỉ lệ chốt đơn',
        'Phân tích sản phẩm bán chạy nhất và giờ vàng live',
        'Báo cáo ROI so sánh hiệu quả trước và sau dùng AvaLive PRO',
        'Xuất báo cáo Excel / PDF tự động hàng tuần / tháng',
        'Cảnh báo thông minh khi doanh số sụt giảm bất thường',
      ]
    },
  ];

  // 100+ feature list  
  const allFeatures = [
    { icon: Film,        label: "Studio Live 60fps Ultra Fast" },
    { icon: Radio,       label: "Multistream 30+ kênh song song" },
    { icon: Zap,         label: "3 Nguồn Stream (Video/Link/Camera)" },
    { icon: Eye,         label: "Quy trình Live 3 Bước Preview/On-Air" },
    { icon: ShieldCheck, label: "Kiểm tra trạng thái & Báo lỗi Kênh" },
    { icon: Lock,        label: "Security Guard AES-256 & DRM 4K" },
    { icon: MessageSquare,label: "Chat Hub & AI Telesale (Public & DM)" },
    { icon: ShoppingBag, label: "Live Commerce & Giỏ Hàng Đa Kênh" },
    { icon: Bot,         label: "MC AI Người Thật Tiếng Việt" },
    { icon: Users,       label: "Phân quyền Đội Ngũ 5 Vai Trò" },
    { icon: BarChart2,   label: "Sales Analytics Real-Time" },
    { icon: HeartHandshake,label: "Affiliate 30% - 50% Hoa Hồng" },
    { icon: QrCode,      label: "Thanh Toán Momo/Banking/Visa 1-Click" },
    { icon: Sliders,     label: "50+ Phông Nền Studio 3D Phim Trường" },
    { icon: Camera,      label: "Làm Đẹp Skin Beauty Ultra VIP" },
    { icon: Truck,       label: "Tự Động Tạo Đơn & Vận Chuyển GHTK" },
  ];

  return (
    <article className="space-y-0 font-sans selection:bg-[#EF4444] selection:text-white">

      {/* ─── MARQUEE TICKER ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden glass-panel py-3 px-4 border-y border-[#EF4444]/30 bg-[#0A0A0A]">
        <div className="flex items-center gap-6 whitespace-nowrap animate-marquee">
          {[
            { icon: '🔥', color: 'text-[#EF4444]', text: 'HƠN 10.000 CHỦ SHOP ĐÃ TỰ ĐỘNG HÓA LIVESTREAM BÁN HÀNG 24/7' },
            { icon: '⚡', color: 'text-emerald-400', text: 'RÚT TIỀN HOA HỒNG AFFILIATE 30% QUA SEPAY VIETQR TỰ ĐỘNG 3 GIÂY' },
            { icon: '📡', color: 'text-[#3B82F6]', text: 'PHÁT LIVE 1-CHẠM ĐỒNG THỜI TIKTOK · FACEBOOK · YOUTUBE · SHOPEE' },
            { icon: '🚀', color: 'text-[#8B5CF6]', text: 'KHÔNG CẦN THUÊ MC · KHÔNG CẦN STUDIO · BÁN HÀNG TỰ ĐỘNG 24/7' },
            { icon: '🔥', color: 'text-[#EF4444]', text: 'HƠN 10.000 CHỦ SHOP ĐÃ TỰ ĐỘNG HÓA LIVESTREAM BÁN HÀNG 24/7' },
            { icon: '⚡', color: 'text-emerald-400', text: 'RÚT TIỀN HOA HỒNG AFFILIATE 30% QUA SEPAY VIETQR TỰ ĐỘNG 3 GIÂY' },
            { icon: '📡', color: 'text-[#3B82F6]', text: 'PHÁT LIVE 1-CHẠM ĐỒNG THỜI TIKTOK · FACEBOOK · YOUTUBE · SHOPEE' },
            { icon: '🚀', color: 'text-[#8B5CF6]', text: 'KHÔNG CẦN THUÊ MC · KHÔNG CẦN STUDIO · BÁN HÀNG TỰ ĐỘNG 24/7' },
          ].map((item, i) => (
            <span key={i} className={`flex items-center gap-1.5 text-xs font-black ${item.color}`}>
              {item.icon} {item.text}
              <span className="mx-3 text-white/20">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* ─── HERO SECTION ───────────────────────────────────────────────── */}
      <header className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden bg-grid-lines text-center px-6 py-20 space-y-8">
        {/* Ambient orbs */}
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#EF4444]/20 rounded-full blur-[120px] animate-orb pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#8B5CF6]/20 rounded-full blur-[100px] animate-orb-slow pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#3B82F6]/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Floating pill badge */}
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#EF4444]/50 bg-[#EF4444]/10 text-[#EF4444] text-xs font-black animate-pulse backdrop-blur-sm">
            <Radio className="w-4 h-4" />
            NỀN TẢNG AI LIVESTREAM BÁN HÀNG SỐ 1 VIỆT NAM
            <span className="w-2 h-2 bg-[#EF4444] rounded-full animate-ping" />
          </div>
        </div>

        {/* Hero headline */}
        <div className="animate-fade-in-up delay-100 space-y-4 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.08] tracking-tight">
            Giải Pháp Livestream<br />
            <span className="animate-shimmer">Bán Hàng Tự Động 24/7</span>
          </h1>
          <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-sans">
            AvaLive PRO — Nền tảng chuyển đổi số livestream thương mại điện tử hàng đầu Việt Nam.
            Multistream đồng thời 30+ kênh, phòng dựng Studio 4K, 30 hiệu ứng làm đẹp AI và chốt đơn tự động 0 giây độ trễ.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up delay-200 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => { if (setGoogleLoginModalOpen) setGoogleLoginModalOpen(true); }}
            className="px-8 py-4 bg-gradient-to-r from-[#EF4444] to-[#8B5CF6] text-white font-black text-sm rounded-2xl animate-cta-pulse hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
          >
            🚀 BẮT ĐẦU MIỄN PHÍ NGAY <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveTab && setActiveTab('enterprise')}
            className="px-8 py-4 border border-white/20 text-white font-black text-sm rounded-2xl hover:border-white/50 hover:bg-white/5 transition-all flex items-center gap-2 cursor-pointer"
          >
            👑 XEM BẢNG GIÁ <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Trust badges */}
        <div className="animate-fade-in-up delay-300 flex flex-wrap items-center justify-center gap-6">
          {[
            { icon: ShieldCheck, text: 'Uptime 99.99%', color: 'text-emerald-400' },
            { icon: Users, text: '10.000+ Khách Hàng', color: 'text-[#3B82F6]' },
            { icon: Star, text: '4.9/5 Đánh Giá', color: 'text-yellow-400' },
            { icon: Award, text: '#1 Việt Nam', color: 'text-[#EF4444]' },
          ].map((b, i) => (
            <div key={i} className={`flex items-center gap-1.5 text-xs font-bold ${b.color}`}>
              <b.icon className="w-4 h-4" /> {b.text}
            </div>
          ))}
        </div>

        {/* Live stats metrics */}
        <div className="animate-fade-in-up delay-400 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto w-full">
          <StatBadge value="+350%" label="Doanh số tăng" sub="Chốt sale 24/7 tự động" color="red" />
          <StatBadge value="80%" label="Tiết kiệm chi phí" sub="Không tốn tiền thuê MC" color="blue" />
          <StatBadge value="30+" label="Kênh Multistream" sub="TikTok, FB, YT, Shopee..." color="purple" />
          <StatBadge value="3s" label="SePay VietQR" sub="Duyệt tự động 24/7" color="green" />
        </div>

        {/* Floating scroll indicator */}
        <div className="animate-float absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-600 text-xs">
          <span className="font-mono">CUỘN XUỐNG ĐỂ KHÁM PHÁ</span>
          <div className="w-5 h-8 rounded-full border border-gray-700 flex items-start justify-center pt-1.5">
            <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full animate-bounce" />
          </div>
        </div>
      </header>

      {/* ─── VALUE PROPOSITION (BENTO GRID) ───────────────────────────────── */}
      <section id="features" className="py-24 px-6 bg-[#05050A] relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#EF4444]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-[#3B82F6]/10 rounded-full blur-[120px] pointer-events-none" />
        
        <RevealSection className="text-center max-w-4xl mx-auto space-y-5 mb-16 relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#EF4444]/20 to-[#8B5CF6]/20 border border-[#EF4444]/40 text-[#EF4444] text-xs font-black tracking-wider uppercase shadow-neon-red">
            <Sparkles className="w-4 h-4" /> BƯỚC VÀO KỶ NGUYÊN CÔNG NGHỆ 4.0
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
            X30 Doanh Số Với Cỗ Máy<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EF4444] via-[#8B5CF6] to-[#3B82F6] animate-shimmer">
              Bán Hàng Tự Động Trí Tuệ Nhân Tạo
            </span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Hệ thống thay thế hoàn toàn một ekip livestream hàng chục người. Mang lại cho bạn giải pháp bán hàng thông minh, tối ưu chi phí và bùng nổ doanh thu chưa từng có.
          </p>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto relative z-10">
          {/* Card 1: Livestream 24/7 (Spans 2 columns) */}
          <RevealSection delay={0} className="md:col-span-2">
            <div className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-[#EF4444]/50 transition-all duration-500 h-full flex flex-col justify-center relative overflow-hidden group bg-gradient-to-br from-[#1A0A0A] to-[#0A0505]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#EF4444]/10 rounded-full blur-[80px] group-hover:bg-[#EF4444]/20 transition-all duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-[#EF4444]/20 text-[#EF4444] flex items-center justify-center mb-6 ring-1 ring-[#EF4444]/50 shadow-neon-red">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-4">
                Sử Dụng Công Nghệ Livestream 24/7
              </h3>
              <p className="text-gray-400 text-base leading-relaxed">
                Đón đầu thời đại công nghệ AI, hệ thống tự động phát Livestream xuyên suốt ngày đêm. Bán hàng liên tục không gián đoạn, không cần MC ngồi trực, không cần ekip hậu cần. Khách hàng thức giờ nào, bạn bán hàng giờ đó!
              </p>
            </div>
          </RevealSection>

          {/* Card 2: Bán Hàng Đa Nền Tảng */}
          <RevealSection delay={150}>
            <div className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-[#3B82F6]/50 transition-all duration-500 h-full relative overflow-hidden group bg-gradient-to-br from-[#0A0F1A] to-[#050A0F]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#3B82F6]/10 rounded-full blur-[80px] group-hover:bg-[#3B82F6]/20 transition-all duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-[#3B82F6]/20 text-[#3B82F6] flex items-center justify-center mb-6 ring-1 ring-[#3B82F6]/50 shadow-neon-blue">
                <Radio className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-white mb-3">Livestream Đa Luồng Đa Nền Tảng</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Phát liên tục cùng lúc lên vô số kênh khác nhau (TikTok, Facebook, Shopee, YouTube) bằng công nghệ Multi-stream. Phủ sóng thương hiệu mọi mặt trận chỉ với 1 cú click chuột.
              </p>
            </div>
          </RevealSection>

          {/* Card 3: Bán Mọi Sản Phẩm */}
          <RevealSection delay={200}>
            <div className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-emerald-400/50 transition-all duration-500 h-full relative overflow-hidden group bg-gradient-to-br from-[#0A1A0F] to-[#050F0A]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-[80px] group-hover:bg-emerald-400/20 transition-all duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-emerald-400/20 text-emerald-400 flex items-center justify-center mb-6 ring-1 ring-emerald-400/50 shadow-neon-green">
                <Package className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-white mb-3">Bán Bất Kỳ Sản Phẩm Gì</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Dù bạn kinh doanh thời trang, mỹ phẩm, điện tử, gia dụng hay bất kỳ ngách nào. AI sẽ tự động điều chỉnh kịch bản hiển thị để chốt đơn hoàn hảo cho từng mặt hàng cụ thể.
              </p>
            </div>
          </RevealSection>

          {/* Card 4: Thu Nhập Thụ Động (Spans 2 columns) */}
          <RevealSection delay={300} className="md:col-span-2">
            <div className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-[#8B5CF6]/50 transition-all duration-500 h-full flex flex-col justify-center relative overflow-hidden group bg-gradient-to-br from-[#120A1A] to-[#0A0512]">
              <div className="absolute top-0 left-0 w-64 h-64 bg-[#8B5CF6]/10 rounded-full blur-[80px] group-hover:bg-[#8B5CF6]/20 transition-all duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6]/20 text-[#8B5CF6] flex items-center justify-center mb-6 ring-1 ring-[#8B5CF6]/50 shadow-neon-purple z-10 relative">
                <DollarSign className="w-7 h-7" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-4 z-10 relative">
                Tạo Nguồn Thu Nhập Thụ Động Đột Phá
              </h3>
              <p className="text-gray-400 text-base leading-relaxed z-10 relative">
                Bạn đi ngủ, đi chơi, đi du lịch? Không sao cả! Máy chủ AI vẫn miệt mài tương tác, tự động bắt bình luận chốt đơn, đóng gói dữ liệu và chuyển thẳng cho đơn vị vận chuyển. Tiền tự động chảy về túi bạn một cách hoàn toàn thụ động!
              </p>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ─── CORE FEATURES INTERACTIVE TABS ────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0D0D12]">
        <RevealSection className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <span className="px-4 py-1.5 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#8B5CF6] text-xs font-black tracking-wider uppercase">
            🚀 TÍNH NĂNG CỐT LÕI
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white">Công Nghệ Đỉnh Cao Trong 1 Nền Tảng</h2>
          <p className="text-gray-400 text-sm">Mọi thứ bạn cần để livestream bán hàng chuyên nghiệp đều có sẵn — không cần cài thêm bất kỳ phần mềm nào khác.</p>
        </RevealSection>

        {/* Tab navigation */}
        <RevealSection className="flex flex-wrap justify-center gap-2 mb-10">
          {featurePillars.map((f, i) => (
            <button
              key={i}
              onClick={() => setActiveFeatureTab(i)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeFeatureTab === i
                  ? 'bg-gradient-to-r from-[#EF4444] to-[#8B5CF6] text-white shadow-neon-red'
                  : 'glass-panel border border-white/10 text-gray-400 hover:text-white hover:border-white/30'
              }`}
            >
              {f.tab}
            </button>
          ))}
        </RevealSection>

        {/* Tab content */}
        <div className="max-w-5xl mx-auto">
          {featurePillars.map((f, i) => (
            i === activeFeatureTab && (
              <RevealSection key={i} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EF4444]/30 to-[#8B5CF6]/30 border border-white/10 flex items-center justify-center animate-ring">
                      <f.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-white leading-tight">{f.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                  <ul className="space-y-3">
                    {f.points.map((pt, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-gray-300">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => { if (setGoogleLoginModalOpen) setGoogleLoginModalOpen(true); }}
                    className="px-6 py-3 bg-gradient-to-r from-[#EF4444] to-[#8B5CF6] text-white font-black text-xs rounded-xl hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    DÙNG THỬ MIỄN PHÍ NGAY <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="relative rounded-3xl overflow-hidden aspect-video glass-panel border border-white/10 bg-black shadow-neon-purple">
                  <img
                    src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=800&q=80"
                    alt="Feature Preview"
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-[#EF4444] text-white text-[10px] font-black animate-pulse flex items-center gap-1">
                          <Radio className="w-3 h-3" /> LIVE NOW
                        </span>
                        <span className="text-xs text-gray-300 font-mono">4K 60fps • Ultra HD</span>
                      </div>
                      <p className="text-white font-black text-sm">{f.title}</p>
                    </div>
                  </div>
                </div>
              </RevealSection>
            )
          ))}
        </div>
      </section>

      {/* ─── ALL FEATURES GRID (100+ chức năng) ────────────────────────── */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#0D0D12] to-[#0A0A0A]">
        <RevealSection className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black tracking-wider uppercase">
            ⚡ TẤT CẢ TÍNH NĂNG
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white">
            30+ Tính Năng Chuyên Nghiệp<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#3B82F6]">Trong 1 Nền Tảng Duy Nhất</span>
          </h2>
          <p className="text-gray-400 text-sm">Toàn bộ những gì bạn cần để chiến thắng trên sàn thương mại điện tử — từ studio live đến chốt đơn, vận chuyển và phân tích doanh số.</p>
        </RevealSection>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-6xl mx-auto stagger">
          {allFeatures.map((f, i) => (
            <RevealSection key={i} delay={i * 30}>
              <div className="zoom-card glass-panel p-4 rounded-2xl border border-white/8 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all group cursor-default text-center space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto group-hover:bg-emerald-500/20 transition-all">
                  <f.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-[11px] font-bold text-gray-300 group-hover:text-white transition-all leading-snug">{f.label}</p>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ─── VIDEO DEMO ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0A0A0A]">
        <RevealSection className="text-center max-w-2xl mx-auto space-y-4 mb-10">
          <span className="px-4 py-1.5 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#8B5CF6] text-xs font-black tracking-wider uppercase">
            🎥 XEM DEMO THỰC TẾ
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white">Trải Nghiệm Live Studio AvaLive PRO</h2>
          <p className="text-gray-400 text-sm">Chất lượng 4K 60fps, tách nền phông ảo 3D & hiệu ứng làm đẹp da siêu tự nhiên real-time.</p>
        </RevealSection>

        <RevealSection className="relative aspect-video rounded-3xl overflow-hidden max-w-4xl mx-auto shadow-neon-purple border border-[#8B5CF6]/30 bg-black">
          <img
            src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=1200&q=80"
            alt="Demo Stream Preview"
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/40 flex flex-col items-center justify-center gap-5 p-6">
            <button
              onClick={() => alert('Đang phát Video Demo Trải Nghiệm Livestream AvaLive PRO 4K 60fps!')}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-[#EF4444] to-[#8B5CF6] text-white flex items-center justify-center shadow-neon-red hover:scale-110 transition-all cursor-pointer animate-float"
            >
              <Play className="w-10 h-10 fill-white ml-1.5" />
            </button>
            <div className="text-center">
              <h3 className="text-xl font-black text-white">BẤM ĐỂ XEM VIDEO DEMO TRỰC TIẾP</h3>
              <p className="text-xs text-gray-400 mt-1 font-mono">Render 60fps Real-time • Tách Nền AI • 4K Ultra HD</p>
            </div>
          </div>
          {/* Live HUD overlay badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[#EF4444] text-white text-[10px] font-black animate-pulse flex items-center gap-1">
              <Radio className="w-3 h-3" /> LIVE
            </span>
            <span className="px-2.5 py-1 rounded-full bg-black/70 text-gray-200 text-[10px] font-mono border border-white/10">4K 60fps</span>
          </div>
        </RevealSection>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0D0D12]">
        <RevealSection className="text-center max-w-2xl mx-auto space-y-4 mb-14">
          <span className="px-4 py-1.5 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#3B82F6] text-xs font-black tracking-wider uppercase">
            📋 QUY TRÌNH 3 BƯỚC
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white">Bắt Đầu Bán Hàng Tự Động Chỉ Trong 5 Phút</h2>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto stagger">
          {[
            { step: '01', icon: UserCheck, color: 'red',   title: 'Đăng Ký & Chọn Gói',   desc: 'Đăng ký miễn phí bằng Google Account. Chọn gói phù hợp và thanh toán tự động qua SePay VietQR trong 3 giây.' },
            { step: '02', icon: Sliders,   color: 'blue',  title: 'Cài Đặt Studio',        desc: 'Kết nối tài khoản TikTok, Facebook, YouTube. Chọn hiệu ứng làm đẹp, phông nền và cấu hình sản phẩm bán hàng.' },
            { step: '03', icon: Rocket,    color: 'green', title: 'Phát Live & Chốt Đơn', desc: 'Nhấn nút LIVE — hệ thống AI tự động bán hàng, bắt comment, chốt đơn và kết nối vận chuyển. Bạn chỉ việc ngồi đếm tiền!' },
          ].map((s, i) => (
            <RevealSection key={i} delay={i * 150}>
              <div className="zoom-card glass-panel p-8 rounded-2xl border border-white/10 space-y-4 text-center group hover:border-[#EF4444]/40 transition-all">
                <div className="text-6xl font-black text-white/5 group-hover:text-white/10 transition-all">{s.step}</div>
                <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center ${
                  s.color === 'red' ? 'bg-[#EF4444]/15 text-[#EF4444]' : s.color === 'blue' ? 'bg-[#3B82F6]/15 text-[#3B82F6]' : 'bg-emerald-400/15 text-emerald-400'
                }`}>
                  <s.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-white">{s.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ─── SOCIAL PROOF / TESTIMONIALS ────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0A0A0A]">
        <RevealSection className="text-center max-w-2xl mx-auto space-y-4 mb-14">
          <span className="px-4 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-xs font-black tracking-wider uppercase">
            ⭐ KHÁCH HÀNG NÓI GÌ
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white">10.000+ Chủ Shop Đã Thay Đổi Cuộc Chơi</h2>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto stagger">
          {[
            { name: 'Chị Ngọc Linh', role: 'Shop Thời Trang TP.HCM', stars: 5, quote: 'Từ khi dùng AvaLive PRO, doanh số tăng 400%. Không cần thuê MC, không lo hết giờ live — hệ thống chạy 24/7 tự động chốt đơn cho tôi!', revenue: '+400% doanh số' },
            { name: 'Anh Minh Khoa', role: 'Shop Điện Tử Hà Nội',  stars: 5, quote: 'Multistream 10 kênh cùng lúc mà siêu mượt không lag. Tôi chỉ cần ngồi theo dõi dashboard, đơn hàng tự đổ về liên tục. Tuyệt vời!', revenue: '+280% đơn hàng' },
            { name: 'Chị Phương Mai', role: 'Shop Mỹ Phẩm Đà Nẵng', stars: 5, quote: '30 hiệu ứng làm đẹp cho mặt và phông nền 4K siêu đẹp. Khách hàng cứ hỏi tôi dùng studio nào mà đẹp thế — bí quyết là AvaLive PRO!', revenue: '+320% tương tác' },
          ].map((t, i) => (
            <RevealSection key={i} delay={i * 120}>
              <div className="zoom-card glass-panel p-6 rounded-2xl border border-white/10 space-y-4 hover:border-yellow-400/30 transition-all">
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-300 leading-relaxed italic">"{t.quote}"</p>
                <div className="flex items-center justify-between border-t border-white/8 pt-3">
                  <div>
                    <p className="text-sm font-black text-white">{t.name}</p>
                    <p className="text-[10px] text-gray-500">{t.role}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-black border border-emerald-500/30">{t.revenue}</span>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ─── EXECUTIVE PRICING ──────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0D0D12]">
        <RevealSection className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-red-500/20 via-purple-500/20 to-blue-500/20 border border-red-500/40 text-red-400 text-xs font-black tracking-wider uppercase shadow-neon-red">
            👑 BẢNG GIÁ DỊCH VỤ EXECUTIVE CHÍNH THỨC
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Bảng Giá Các Gói Cước AvaLive PRO
          </h2>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed">
            Giải pháp livestream tự động 24/7 siêu mượt hàng đầu Việt Nam. Nâng cấp qua SePay VietQR duyệt 3s tự động.
          </p>

          {/* Billing switcher */}
          <div className="flex flex-col items-center gap-2 pt-4">
            <div className="bg-[#121218] p-1.5 rounded-2xl border border-emerald-500/40 flex items-center gap-2">
              <button onClick={() => setHeroBillingCycle('monthly')} className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${heroBillingCycle === 'monthly' ? 'bg-[#EF4444] text-white shadow-neon-red' : 'text-gray-400 hover:text-white'}`}>
                🗓️ THANH TOÁN HÀNG THÁNG
              </button>
              <button onClick={() => setHeroBillingCycle('annual')} className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${heroBillingCycle === 'annual' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                <span>⚡ MUA GÓI NĂM (TẶNG 2 THÁNG MIỄN PHÍ)</span>
                <span className="px-2.5 py-0.5 rounded-full bg-yellow-400 text-black text-[10px] font-black animate-pulse">TIẾT KIỆM 20%</span>
              </button>
            </div>
            <p className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Mua 1 năm chỉ tính 10 tháng — Tặng ngay 2 tháng sử dụng miễn phí! Hoa hồng Affiliate 30% rút qua SePay!
            </p>
          </div>
        </RevealSection>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto pt-2 stagger">
          {officialPlans.map((plan, i) => (
            <RevealSection key={plan.id} delay={i * 100}>
              <div className={`zoom-card relative rounded-3xl p-6 glass-panel border flex flex-col justify-between space-y-6 ${
                plan.popular
                  ? 'border-red-500/80 bg-gradient-to-b from-red-950/40 via-[#12121A] to-[#0A0A0E] shadow-neon-red scale-105 z-10'
                  : 'border-white/10 bg-[#12121A]/90 hover:border-white/20'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#EF4444] text-white text-[10px] font-black shadow-neon-red tracking-wider uppercase whitespace-nowrap">
                    🔥 BÁN CHẠY NHẤT
                  </div>
                )}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black border tracking-wider uppercase ${plan.badgeBg}`}>{plan.badge}</span>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> SePay 3s
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white tracking-tight">{plan.name}</h3>
                    <div className="flex items-baseline gap-1.5 mt-2">
                      <span className="text-3xl font-black text-white tracking-tight">{plan.price}</span>
                      <span className="text-xs text-gray-400">{plan.period}</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#08080C] border border-white/10 space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                      <span className="text-gray-400 font-bold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#EF4444]" />Thời gian Live:</span>
                      <span className="font-mono text-white font-extrabold text-right text-[10px]">{plan.liveTime}</span>
                    </div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                      <span className="text-gray-400 font-bold flex items-center gap-1.5"><Share2 className="w-3.5 h-3.5 text-[#3B82F6]" />Kênh Stream:</span>
                      <span className="font-mono text-white font-extrabold text-right text-[10px]">{plan.channels}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 font-bold flex items-center gap-1.5"><Tv className="w-3.5 h-3.5 text-[#8B5CF6]" />Độ phân giải:</span>
                      <span className="font-mono text-emerald-400 font-extrabold text-right text-[10px]">{plan.quality}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">QUYỀN LỢI GÓI:</span>
                    <ul className="space-y-2 text-xs text-gray-300">
                      {plan.features.map((feat, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button
                  onClick={() => { if (plan.id === 'free') { if (setGoogleLoginModalOpen) setGoogleLoginModalOpen(true); } else { setActiveTab && setActiveTab('enterprise'); } }}
                  className={`w-full py-3.5 text-white font-black text-xs rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 ${plan.buttonBg}`}
                >
                  <span>{plan.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ─── AFFILIATE PROGRAM ──────────────────────────────────────────── */}
      <section id="affiliate-intro" className="py-24 px-6 bg-gradient-to-b from-[#0A0A0A] via-[#0D0D12] to-[#0A0A0A]">
        <RevealSection className="max-w-4xl mx-auto glass-panel rounded-3xl border border-[#EF4444]/30 p-10 md:p-14 text-center space-y-6 bg-gradient-to-br from-[#EF4444]/5 to-[#8B5CF6]/5 shadow-neon-red">
          <span className="px-4 py-1.5 rounded-full bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#EF4444] text-xs font-black tracking-wider uppercase">
            💸 TIẾP THỊ LIÊN KẾT AFFILIATE
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white">
            Kiếm 30% Hoa Hồng Trọn Đời<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EF4444] to-[#8B5CF6]">Rút Tiền Tự Động Qua SePay</span>
          </h2>
          <p className="text-gray-300 text-sm max-w-2xl mx-auto leading-relaxed">
            Giới thiệu 1 khách mua gói Business (1.49M/tháng) — bạn nhận ngay <strong className="text-[#EF4444]">447.000₫/tháng</strong> hoa hồng trọn đời. Giới thiệu 10 khách = <strong className="text-emerald-400">4.470.000₫/tháng</strong> thụ động mãi mãi!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: HeartHandshake, label: 'Hoa hồng trọn đời', value: '30%', sub: 'Mỗi đơn thanh toán của KH bạn giới thiệu' },
              { icon: QrCode,         label: 'Rút tiền qua SePay', value: '3s',   sub: 'Tự động về tài khoản ngân hàng tức thì' },
              { icon: TrendingUp,     label: 'Thu nhập thụ động', value: '∞',    sub: 'Không giới hạn số lượng & thời gian' },
            ].map((a, i) => (
              <div key={i} className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-center zoom-card">
                <a.icon className="w-8 h-8 text-[#EF4444] mx-auto" />
                <p className="text-3xl font-black text-white">{a.value}</p>
                <p className="text-xs font-black text-gray-200">{a.label}</p>
                <p className="text-[10px] text-gray-500">{a.sub}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setActiveTab && setActiveTab('affiliate')}
            className="px-8 py-4 bg-gradient-to-r from-[#EF4444] to-[#8B5CF6] text-white font-black text-sm rounded-2xl animate-cta-pulse hover:opacity-90 transition-all flex items-center gap-2 mx-auto cursor-pointer"
          >
            💸 ĐĂNG KÝ AFFILIATE NGAY <ArrowRight className="w-5 h-5" />
          </button>
        </RevealSection>
      </section>

      {/* ─── FAQ ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0A0A0A]">
        <RevealSection className="text-center max-w-2xl mx-auto space-y-4 mb-14">
          <span className="px-4 py-1.5 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#3B82F6] text-xs font-black uppercase tracking-wider">
            ❓ CÂU HỎI THƯỜNG GẶP
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white">Giải Đáp Thắc Mắc</h2>
        </RevealSection>
        <div className="max-w-3xl mx-auto space-y-4 stagger">
          {[
            { q: 'Tôi không giỏi công nghệ có dùng được không?', a: 'Hoàn toàn có thể! AvaLive PRO được thiết kế cực kỳ đơn giản — chỉ cần đăng nhập bằng Gmail, kết nối tài khoản mạng xã hội và nhấn LIVE. Giao diện kéo thả trực quan, không cần kiến thức kỹ thuật.' },
            { q: 'Tôi có thể phát live bằng video quay sẵn không?', a: 'Có! Bạn có thể nạp file video (kể cả file hàng chục GB, dài vài tiếng) và lên lịch phát live tự động 24/7 liên tục. Hệ thống phát siêu mượt không lag, không giật.' },
            { q: 'Multistream 30 kênh có bị lag không?', a: 'Không. AvaLive PRO sử dụng hạ tầng Dedicated RTMP Server 10Gbps riêng biệt, đảm bảo phát đồng thời 30+ kênh với chất lượng 4K 60fps cực kỳ ổn định, không lag.' },
            { q: 'Hủy gói có hoàn tiền không?', a: 'Chúng tôi cung cấp chính sách hoàn tiền 7 ngày không điều kiện nếu bạn chưa hài lòng. Ngoài ra, bạn có thể bắt đầu miễn phí trước và nâng cấp bất kỳ lúc nào.' },
            { q: 'Tiếp thị liên kết Affiliate hoạt động như thế nào?', a: 'Bạn nhận link affiliate riêng. Mỗi khi có khách mua gói qua link của bạn, hệ thống SePay tự động chuyển 30% hoa hồng về tài khoản ngân hàng của bạn trong 3 giây — trọn đời, không giới hạn.' },
          ].map((faq, i) => (
            <RevealSection key={i} delay={i * 80}>
              <details className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-[#3B82F6]/40 transition-all group cursor-pointer">
                <summary className="text-sm font-black text-white list-none flex items-center justify-between gap-3">
                  {faq.q}
                  <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="text-xs text-gray-400 leading-relaxed mt-3 pt-3 border-t border-white/8">{faq.a}</p>
              </details>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ─── FINAL CTA ──────────────────────────────────────────────────── */}
      <section className="py-28 px-6 bg-gradient-to-b from-[#0A0A0A] to-[#0D0D12] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-[#EF4444]/15 rounded-full blur-[100px] animate-orb" />
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-[#8B5CF6]/15 rounded-full blur-[100px] animate-orb-slow" />
        </div>
        <RevealSection className="relative max-w-4xl mx-auto text-center space-y-8">
          <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#EF4444]/20 to-[#8B5CF6]/20 border border-[#EF4444]/40 text-[#EF4444] text-xs font-black tracking-wider uppercase">
            🚀 BẮT ĐẦU HÀNH TRÌNH THÀNH CÔNG
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
            Sẵn Sàng Bứt Phá<br />
            <span className="animate-shimmer">Doanh Số Livestream?</span>
          </h2>
          <p className="text-gray-300 text-base max-w-2xl mx-auto leading-relaxed">
            Tham gia cùng hơn 10.000 chủ shop đã thay đổi cuộc chơi bán hàng online. Đăng ký miễn phí ngay hôm nay — không cần thẻ tín dụng.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => { if (setGoogleLoginModalOpen) setGoogleLoginModalOpen(true); }}
              className="px-10 py-5 bg-gradient-to-r from-[#EF4444] via-[#8B5CF6] to-[#3B82F6] text-white font-black text-base rounded-2xl animate-cta-pulse hover:opacity-90 transition-all flex items-center gap-3 cursor-pointer shadow-neon-red"
            >
              🔑 ĐĂNG NHẬP GOOGLE VÀO WORKSPACE MIỄN PHÍ
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
            {['✓ Miễn phí 20 giờ Live/tháng', '✓ Không cần thẻ tín dụng', '✓ Hoàn tiền 7 ngày', '✓ Hủy bất kỳ lúc nào'].map((t, i) => (
              <span key={i} className="text-gray-400 font-medium">{t}</span>
            ))}
          </div>
        </RevealSection>
      </section>

    </article>
  );
}
