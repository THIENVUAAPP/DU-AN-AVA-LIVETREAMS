import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, CheckCircle2, ArrowRight, Zap, ShieldCheck, 
  Tv, Users, CreditCard, ChevronRight, Crown, Star, 
  BarChart2, Share2, Globe, HeartHandshake, Building2,
  Play, MousePointerClick, MessageSquare, Smartphone
} from 'lucide-react';
import SePayModal from './SePayModal';

// Intersection Observer Hook for Scroll Animations
function useOnScreen(options) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, options);
    
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, options]);

  return [ref, isVisible];
}

const RevealOnScroll = ({ children, className = '' }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  return (
    <div ref={ref} className={`reveal ${isVisible ? 'visible' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default function SalesLandingPage({ setGoogleLoginModalOpen, currentUser, setActiveTab }) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [sepayModalOpen, setSepayModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  const handlePurchase = (plan) => {
    if (!currentUser) {
      alert("Bạn cần Đăng nhập bằng Google trước khi mua gói!");
      setGoogleLoginModalOpen(true);
      return;
    }
    
    if (plan.name === 'Gói FREE') {
       alert("Gói FREE đã được tự động áp dụng cho tài khoản của bạn.");
       setActiveTab('broadcast');
       return;
    }

    setSelectedPlan(plan);
    setSepayModalOpen(true);
  };

  const plans = [
    {
      name: "Gói STARTER",
      desc: "Phù hợp cho cá nhân bán hàng nhỏ lẻ, cần tự động hóa.",
      monthly: 799000,
      yearly: 799000 * 10,
      features: [
        "Phát Live 5 luồng đồng thời",
        "Tự động chốt 200 đơn/tháng",
        "Quản lý trang thanh toán đơn",
        "Bỏ Logo AvaLive Watermark",
        "Bypass Captcha (Cơ bản)"
      ],
      color: "from-[#3B82F6] to-[#2563EB]",
      textColor: "text-blue-400",
      btnText: "MUA GÓI STARTER",
      icon: <Zap className="w-5 h-5 text-blue-400" />
    },
    {
      name: "Gói PRO",
      desc: "Bùng nổ doanh số với công cụ Livestream Đa Kênh đỉnh cao.",
      monthly: 1599000,
      yearly: 1599000 * 10,
      features: [
        "Phát Live 15 luồng đồng thời",
        "Tự động chốt 1000 đơn/tháng",
        "Quản lý trang thanh toán đơn",
        "Restream TikTok, FB, Shopee",
        "Bypass Captcha Cao Cấp (100%)"
      ],
      isPopular: true,
      color: "from-[#8B5CF6] to-[#EF4444]",
      textColor: "text-purple-400",
      btnText: "NÂNG CẤP LÊN PRO",
      icon: <Crown className="w-5 h-5 text-amber-400" />
    },
    {
      name: "Gói ENTERPRISE",
      desc: "Giải pháp toàn diện cho Studio & Agency quy mô lớn.",
      monthly: 3490000,
      yearly: 3490000 * 10,
      features: [
        "Phát Live KHÔNG GIỚI HẠN luồng",
        "Tự động chốt đơn KHÔNG GIỚI HẠN",
        "Quản lý trang thanh toán ưu tiên",
        "Tạo & Quản lý nhiều phiên độc lập",
        "Hỗ trợ kỹ thuật 24/7 (1 kèm 1)"
      ],
      color: "from-[#059669] to-[#047857]",
      textColor: "text-emerald-400",
      btnText: "LIÊN HỆ ENTERPRISE",
      icon: <Building2 className="w-5 h-5 text-emerald-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans overflow-x-hidden selection:bg-[#EF4444] selection:text-white pb-20 scroll-smooth">
      
      {/* STANDALONE WEBSITE HEADER */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 transition-all shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0, 0)}>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-purple-600 to-cyan-500 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-[#EF4444] via-[#8B5CF6] to-[#06B6D4] p-0.5 shadow-2xl group-hover:scale-105 transition-all">
                <img src="/official_logo.jpg" alt="AvaLive PRO" className="w-full h-full object-cover rounded-[10px] border border-white/40" />
              </div>
            </div>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-1 group-hover:text-red-400 transition-colors">
              AvaLive <span className="text-[#EF4444] drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">PRO</span>
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => window.scrollTo(0, 0)} className="text-sm font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] hover:text-[#EF4444] transition-all">Trang Chủ</button>
            <a href="#features-section" className="text-sm font-bold text-gray-400 hover:text-white transition-all">Tính Năng</a>
            <a href="#pricing-section" className="text-sm font-bold text-gray-400 hover:text-white transition-all">Bảng Giá</a>
            <button onClick={() => setActiveTab('affiliate-landing')} className="text-sm font-bold text-gray-400 hover:text-[#8B5CF6] transition-all flex items-center gap-1 hover:scale-105">
              <HeartHandshake className="w-4 h-4" /> Tiếp Thị 30%
            </button>
          </nav>

          {!currentUser ? (
            <button 
              onClick={() => setGoogleLoginModalOpen(true)}
              className="px-6 py-2.5 bg-white hover:bg-gray-200 text-black font-black rounded-xl text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:scale-105 flex items-center gap-2 group"
            >
              ĐĂNG NHẬP <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button 
              onClick={() => setActiveTab('broadcast')}
              className="px-6 py-2.5 bg-gradient-to-r from-[#EF4444] to-[#8B5CF6] text-white font-black rounded-xl text-sm shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all hover:scale-105 flex items-center gap-2 group"
            >
              VÀO STUDIO <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </header>

      {/* 1. HERO SECTION (Premium Redesign) */}
      <section className="relative pt-40 pb-20 overflow-hidden flex flex-col items-center text-center px-4 bg-grid-lines">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#EF4444]/20 via-[#8B5CF6]/20 to-[#3B82F6]/20 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
        
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md animate-fade-in-up hover:scale-105 transition-transform cursor-pointer">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
          <span className="text-xs font-bold text-gray-200 uppercase tracking-widest animate-shimmer">Nền Tảng Livestream Bán Hàng #1 Việt Nam</span>
        </div>
        
        <h1 className="text-6xl md:text-[5.5rem] font-black text-white tracking-tight mb-8 leading-[1.05] max-w-5xl animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          Đột Phá Doanh Thu <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EF4444] via-[#8B5CF6] to-[#06B6D4] animate-gradient">
            Với Hệ Sinh Thái AvaLive
          </span>
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl max-w-3xl mb-12 animate-fade-in-up leading-relaxed" style={{ animationDelay: '200ms' }}>
          Tự động hóa 100% quy trình bán hàng trên Livestream. Tích hợp <strong className="text-white">AI Chốt Đơn</strong>, <strong className="text-white">Bypass Captcha Siêu Tốc</strong>, và <strong className="text-white">Restream Đa Kênh</strong> (TikTok, Facebook, Shopee, YouTube) chỉ với 1 Click.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-5 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          {!currentUser ? (
            <button 
              onClick={() => setGoogleLoginModalOpen(true)}
              className="px-8 py-5 bg-white text-black font-black rounded-2xl hover:bg-gray-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 flex items-center gap-2 text-lg group"
            >
              KẾT NỐI GOOGLE BẮT ĐẦU NGAY <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button 
              onClick={() => setActiveTab('broadcast')}
              className="px-8 py-5 bg-gradient-to-r from-[#EF4444] to-[#8B5CF6] text-white font-black rounded-2xl transition-all shadow-[0_0_40px_rgba(239,68,68,0.4)] hover:scale-105 flex items-center gap-2 text-lg group animate-cta-pulse"
            >
              VÀO BẢNG ĐIỀU KHIỂN STUDIO <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
          
          <a href="#demo-section" className="px-8 py-5 glass-panel text-white font-bold rounded-2xl hover:bg-white/10 transition-all border border-white/20 flex items-center gap-2 text-lg hover:scale-105">
            <Play className="w-6 h-6 text-[#06B6D4]" /> XEM VIDEO DEMO
          </a>
        </div>
      </section>

      {/* 2. VIDEO DEMO SECTION (High-End Mockup) */}
      <section id="demo-section" className="py-20 px-4 max-w-6xl mx-auto relative z-10">
        <RevealOnScroll>
          <div className="relative rounded-[2.5rem] overflow-hidden glass-panel border border-white/10 shadow-neon-purple group bg-black">
            {/* macOS window top bar */}
            <div className="h-8 bg-[#1a1a24] border-b border-white/5 flex items-center px-4 gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
               <div className="w-3 h-3 rounded-full bg-green-500"></div>
               <div className="flex-1 text-center text-[10px] text-gray-500 font-mono tracking-widest">AVALIVE_STUDIO_DEMO.MP4</div>
            </div>
            
            {/* Video Placeholder */}
            <div className="relative aspect-video bg-gradient-to-tr from-black via-[#111] to-[#1a1a24] flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => setIsVideoPlaying(true)}>
              {/* Animated abstract shapes behind video */}
              <div className="absolute inset-0 opacity-30">
                 <div className="absolute top-10 left-10 w-64 h-64 bg-red-500/20 rounded-full blur-3xl animate-float"></div>
                 <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-float-slow"></div>
              </div>
              
              {!isVideoPlaying ? (
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 hover:scale-110 transition-transform group-hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] animate-orb">
                    <Play className="w-10 h-10 text-white ml-2" />
                  </div>
                  <p className="mt-6 text-xl font-bold text-white tracking-widest uppercase">Click để xem cách tạo ra hàng nghìn đơn</p>
                </div>
              ) : (
                <div className="absolute inset-0 bg-black flex items-center justify-center z-20">
                   <p className="text-gray-400 font-mono animate-pulse">Loading Premium Video Demo...</p>
                   {/* In a real scenario, this would be an iframe to YouTube/Vimeo */}
                </div>
              )}
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* 3. VALUE PROPOSITION / RICH FEATURES */}
      <section id="features-section" className="py-24 px-4 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <RevealOnScroll>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Tại Sao Chọn <span className="text-[#EF4444]">AvaLive?</span></h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Không chỉ là công cụ Livestream, đây là Cỗ Máy In Tiền Tự Động. Chúng tôi cung cấp mọi tính năng tối tân nhất để bạn thống trị thị trường TMĐT.
            </p>
          </RevealOnScroll>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <RevealOnScroll className="zoom-card glass-panel p-10 rounded-[32px] border border-white/5 bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8 border border-blue-500/20 group-hover:rotate-12 transition-transform">
              <Globe className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Restream Đa Kênh Cùng Lúc</h3>
            <p className="text-gray-400 leading-relaxed text-sm mb-6">
              Phát luồng trực tiếp đồng thời lên <strong className="text-white">TikTok Shop, Facebook, Shopee Live, YouTube</strong> chỉ với 1 cú click. Tối đa hóa lượt tiếp cận và bùng nổ doanh số bán hàng.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 p-1.5"><img src="https://www.tiktok.com/favicon.ico" alt="TikTok" className="w-full h-full rounded-full" /></div>
              <div className="w-8 h-8 rounded-full bg-white/10 p-1.5"><img src="https://www.facebook.com/favicon.ico" alt="Facebook" className="w-full h-full rounded-full" /></div>
              <div className="w-8 h-8 rounded-full bg-white/10 p-1.5"><img src="https://www.youtube.com/favicon.ico" alt="YouTube" className="w-full h-full rounded-full" /></div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="zoom-card glass-panel p-10 rounded-[32px] border border-white/5 bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden group delay-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all"></div>
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-8 border border-red-500/20 group-hover:-rotate-12 transition-transform">
              <ShieldCheck className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">AI Bypass Captcha Siêu Tốc</h3>
            <p className="text-gray-400 leading-relaxed text-sm mb-6">
              Tích hợp sẵn <strong className="text-white">Stealth AI</strong> thông minh. Tự động vượt qua mọi lớp bảo mật và WAF (Tường lửa) của TikTok và Shopee. Luồng Live của bạn sẽ cực kỳ ổn định, không bao giờ bị gián đoạn hay mất kết nối.
            </p>
          </RevealOnScroll>

          <RevealOnScroll className="zoom-card glass-panel p-10 rounded-[32px] border border-white/5 bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden group delay-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-8 border border-purple-500/20 group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Chốt Đơn Tự Động 24/7</h3>
            <p className="text-gray-400 leading-relaxed text-sm mb-6">
              Chatbot AI tự động phân tích hàng nghìn bình luận mỗi giây, lọc số điện thoại và <strong className="text-white">tạo đơn hàng thực tế</strong> gửi thẳng về hệ thống vận chuyển (GHTK, GHN, Viettel Post) hoàn toàn tự động.
            </p>
          </RevealOnScroll>

          <RevealOnScroll className="zoom-card glass-panel p-10 rounded-[32px] border border-white/5 bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8 border border-emerald-500/20 group-hover:rotate-12 transition-transform">
              <CreditCard className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Quản Lý Trang Thanh Toán</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Cung cấp trang thanh toán đơn hàng thông minh cho khách hàng. Hệ thống tự động xác nhận khi có chuyển khoản qua mã QR và cập nhật trạng thái đơn hàng (đã thu tiền).
            </p>
          </RevealOnScroll>

          <RevealOnScroll className="zoom-card glass-panel p-10 rounded-[32px] border border-white/5 bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden group delay-100 lg:col-span-2">
            <div className="flex flex-col md:flex-row items-center gap-8 h-full">
              <div className="flex-1">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-8 border border-amber-500/20 group-hover:scale-110 transition-transform">
                  <MousePointerClick className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Giao Diện Studio Đỉnh Cao</h3>
                <p className="text-gray-400 leading-relaxed text-base mb-6">
                  Chúng tôi thiết kế một không gian làm việc chuẩn điện ảnh. Thao tác kéo thả mượt mà, giám sát nhiều tài khoản mạng xã hội cùng lúc, và thống kê doanh thu theo thời gian thực (Real-time Analytics).
                </p>
              </div>
              <div className="w-full md:w-1/2 rounded-2xl bg-black border border-white/10 shadow-2xl p-4 overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-purple-500/5 pointer-events-none"></div>
                 <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                   <div className="flex items-center gap-2"><Smartphone className="w-4 h-4 text-gray-500"/> <span className="text-xs text-gray-400 font-bold">Live Preview</span></div>
                   <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                 </div>
                 <div className="space-y-3">
                   <div className="h-2 w-3/4 bg-white/5 rounded-full"></div>
                   <div className="h-2 w-1/2 bg-white/5 rounded-full"></div>
                   <div className="h-20 w-full bg-blue-500/10 rounded-xl border border-blue-500/20 mt-4 flex items-center justify-center">
                     <BarChart2 className="w-6 h-6 text-blue-500/50" />
                   </div>
                 </div>
              </div>
            </div>
          </RevealOnScroll>

        </div>
      </section>

      {/* 4. PRICING PACKAGES */}
      <section id="pricing-section" className="py-24 px-4 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <RevealOnScroll>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Đầu Tư Sinh Lời Ngay Hôm Nay</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
              Chọn gói cước phù hợp nhất với quy mô kinh doanh của bạn. Nâng cấp bất kỳ lúc nào, thanh toán siêu tốc hoàn toàn tự động qua <strong className="text-white">SePay VietQR</strong>.
            </p>
            
            <div className="inline-flex items-center gap-2 p-1 bg-[#121216] border border-white/10 rounded-full mx-auto shadow-xl">
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-gradient-to-r from-[#3B82F6] to-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:text-white'}`}
              >
                Trả Từng Tháng
              </button>
              <button 
                onClick={() => setBillingCycle('yearly')}
                className={`px-8 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-gradient-to-r from-[#8B5CF6] to-purple-600 text-white shadow-lg shadow-purple-500/30' : 'text-gray-400 hover:text-white'}`}
              >
                Trả Theo Năm <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-black text-[10px] uppercase font-black animate-pulse">Tặng 2 Tháng</span>
              </button>
            </div>
          </RevealOnScroll>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <RevealOnScroll key={i} className={`relative glass-panel rounded-3xl p-8 border flex flex-col transition-all duration-300 hover:scale-105 ${plan.isPopular ? 'border-[#8B5CF6]/50 shadow-[0_0_40px_rgba(139,92,246,0.2)] md:-translate-y-6 bg-[#1a1a24]' : 'border-white/10 hover:border-white/30'}`}>
              
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-gradient-to-r from-[#EF4444] to-[#8B5CF6] text-white text-[11px] font-black uppercase rounded-full tracking-widest shadow-neon-red">
                  KHUYÊN DÙNG NHẤT
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">{plan.icon}</div>
                  <h3 className={`text-2xl font-black ${plan.textColor}`}>{plan.name}</h3>
                </div>
                <p className="text-gray-400 text-sm min-h-[50px] leading-relaxed">{plan.desc}</p>
              </div>
              
              <div className="mb-8 p-4 rounded-2xl bg-black/50 border border-white/5">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black text-white">
                    {billingCycle === 'yearly' 
                      ? plan.yearly === 0 ? 'Miễn phí' : `${(plan.yearly).toLocaleString()}₫` 
                      : plan.monthly === 0 ? 'Miễn phí' : `${(plan.monthly).toLocaleString()}₫`}
                  </span>
                  {plan.monthly > 0 && <span className="text-gray-500 text-sm mb-1 font-medium">/ {billingCycle === 'yearly' ? 'Năm' : 'Tháng'}</span>}
                </div>
                {billingCycle === 'yearly' && plan.monthly > 0 && (
                  <div className="inline-block mt-3 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                    Tiết kiệm {(plan.monthly * 12 - plan.yearly).toLocaleString()}₫
                  </div>
                )}
              </div>

              <div className="space-y-4 flex-1 mb-8">
                {plan.features.map((feat, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-sm text-gray-200 font-medium">{feat}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handlePurchase(plan)}
                className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-lg text-white bg-gradient-to-r ${plan.color} hover:opacity-90 hover:shadow-xl hover:-translate-y-1`}
              >
                {plan.btnText}
              </button>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* 5. AFFILIATE 30% PROMO */}
      <section className="py-24 px-4 max-w-7xl mx-auto relative z-10">
        <RevealOnScroll>
          <div className="bg-gradient-to-tr from-[#121216] via-[#1A1A24] to-[#121216] border border-white/10 rounded-[40px] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative shadow-2xl group">
            
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#8B5CF6]/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#EF4444]/20 transition-colors duration-1000"></div>

            <div className="flex-1 space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black uppercase tracking-widest">
                <HeartHandshake className="w-4 h-4" /> CHƯƠNG TRÌNH ĐỐI TÁC
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Tiếp Thị Liên Kết <br/>
                Nhận Hoa Hồng <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">30% Trọn Đời</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                Giới thiệu bạn bè sử dụng AvaLive PRO. Nhận ngay 30% giá trị gói cước cho lần thanh toán đầu tiên. Rút tiền siêu tốc qua SePay về mọi ngân hàng trong 3s.
              </p>
              <button 
                onClick={() => setActiveTab('affiliate-landing')}
                className="px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all text-white bg-white/10 hover:bg-white/20 border border-white/20 flex items-center gap-2 w-max hover:scale-105"
              >
                TÌM HIỂU THÊM VỀ AFFILIATE <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="relative z-10 shrink-0">
              <div className="w-64 h-64 md:w-80 md:h-80 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative w-full h-full glass-panel rounded-full border border-white/20 flex items-center justify-center flex-col shadow-neon-green">
                  <span className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mb-2">30%</span>
                  <span className="text-emerald-400 font-bold uppercase tracking-widest text-sm">HOA HỒNG CHIẾT KHẤU</span>
                </div>
              </div>
            </div>

          </div>
        </RevealOnScroll>
      </section>

      {/* Payment Modal */}
      {selectedPlan && (
        <SePayModal 
          isOpen={sepayModalOpen} 
          onClose={() => setSepayModalOpen(false)} 
          plan={selectedPlan} 
          billingCycle={billingCycle}
          currentUser={currentUser}
          onSuccess={() => {
            setSepayModalOpen(false);
            alert("Thanh toán thành công! Gói đã được kích hoạt.");
            setActiveTab('broadcast');
          }}
        />
      )}
      
    </div>
  );
}
