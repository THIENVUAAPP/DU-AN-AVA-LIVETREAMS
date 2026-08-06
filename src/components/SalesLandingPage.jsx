import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, CheckCircle2, ArrowRight, Zap, ShieldCheck, 
  Tv, Users, CreditCard, ChevronRight, Crown, Star, 
  BarChart2, Share2, Globe, HeartHandshake, Building2,
  Play, MousePointerClick, MessageSquare, Smartphone, Facebook,
  Bot, Clock, ShoppingCart, Lock, Headphones, Search, MonitorPlay
} from 'lucide-react';
import SePayModal from './SePayModal';
import TechEcosystemMap from './TechEcosystemMap';
import { plans } from '../lib/plansConfig';

const customStyles = `
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes marquee-reverse {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }
  .animate-marquee {
    animation: marquee 40s linear infinite;
  }
  .animate-marquee-reverse {
    animation: marquee-reverse 40s linear infinite;
  }
  .marquee-container:hover .animate-marquee,
  .marquee-container:hover .animate-marquee-reverse {
    animation-play-state: paused;
  }
`;

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
    <div ref={ref} className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}>
      {children}
    </div>
  );
};

export default function SalesLandingPage({ setGoogleLoginModalOpen, currentUser, setActiveTab }) {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [sepayModalOpen, setSepayModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  const handlePurchase = (plan) => {
    if (!currentUser) {
      alert("Bạn cần Đăng nhập bằng Google trước khi mua gói!");
      setGoogleLoginModalOpen(true);
      return;
    }
    
    if (plan.monthly === 0 || plan.name.includes('MIỄN PHÍ')) {
       alert(`Gói ${plan.name} đã được kích hoạt thành công cho tài khoản của bạn.`);
       setActiveTab('broadcast');
       return;
    }

    setSelectedPlan(plan);
    setSepayModalOpen(true);
  };



  return (
    <div className="min-h-screen bg-[#05050A] text-gray-100 font-sans overflow-x-hidden selection:bg-[#EF4444] selection:text-white">
      <style>{customStyles}</style>
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-[#05050A]/90 backdrop-blur-md border-b border-white/5 py-4 px-6 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0, 0)}>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-purple-600 to-cyan-500 rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative w-10 h-10 rounded-xl bg-[#111] p-0.5 shadow-2xl group-hover:scale-105 transition-all">
                <img src="/official_logo.jpg" alt="AvaLive" className="w-full h-full object-cover rounded-[10px] border border-white/20" />
              </div>
            </div>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-1.5 leading-none">
              <span className="text-[#FBBF24] drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">AVA</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-black drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">LIVESTREAM</span>
            </h1>
          </div>

          <nav className="hidden lg:flex items-center gap-6">
            <button onClick={() => window.scrollTo(0, 0)} className="text-sm font-semibold text-white hover:text-[#FBBF24] transition-all">Trang chủ</button>
            <a href="#features" className="text-sm font-semibold text-gray-300 hover:text-white transition-all">Tính năng</a>
            <a href="#pricing" className="text-sm font-semibold text-gray-300 hover:text-white transition-all">Bảng giá</a>
            <a href="#guide" className="text-sm font-semibold text-gray-300 hover:text-white transition-all">Hướng dẫn</a>
            <button onClick={() => setActiveTab('affiliate-landing')} className="text-sm font-semibold text-gray-300 hover:text-[#FBBF24] transition-all">Affiliate</button>
            <a href="#blog" className="text-sm font-semibold text-gray-300 hover:text-white transition-all">Blog</a>
            <a href="#contact" className="text-sm font-semibold text-gray-300 hover:text-white transition-all">Liên hệ</a>
          </nav>

          <div className="flex items-center gap-4">
            {!currentUser ? (
              <>
                <button 
                  onClick={() => setGoogleLoginModalOpen(true)}
                  className="px-5 py-2 rounded-full border border-white/20 text-white font-semibold text-sm hover:bg-white/10 transition-all"
                >
                  Đăng nhập
                </button>
                <button 
                  onClick={() => setGoogleLoginModalOpen(true)}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#F43F5E] text-white font-bold text-sm shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] transition-all hover:scale-105"
                >
                  Dùng thử miễn phí
                </button>
              </>
            ) : (
              <button 
                onClick={() => setActiveTab('broadcast')}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#F43F5E] text-white font-bold text-sm shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:scale-105 transition-all flex items-center gap-2"
              >
                VÀO STUDIO <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-16 overflow-hidden flex flex-col items-center px-4" style={{
        backgroundImage: 'radial-gradient(circle at 50% 0%, #1c103f 0%, #05050A 50%)'
      }}>
        {/* Background Grid Lines */}
        <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left Text Content */}
          <div className="flex flex-col items-start text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 backdrop-blur-sm">
              <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest">NỀN TẢNG LIVESTREAM & BÁN HÀNG AI #1 VIỆT NAM</span>
            </div>
            
            <h1 className="text-5xl md:text-[4rem] font-black text-white leading-[1.1] tracking-tight">
              LIVE STREAM ĐA NỀN TẢNG <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#D97706]">
                BÁN HÀNG TỰ ĐỘNG BẰNG AI 24/7
              </span>
            </h1>
            
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
              Công nghệ AI thông minh giúp bạn livestream đa nền tảng, chốt đơn tự động, chatbot AI chăm sóc khách hàng 24/7 và tối ưu doanh số vượt trội!
            </p>
            
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button 
                onClick={() => currentUser ? setActiveTab('broadcast') : setGoogleLoginModalOpen(true)}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] text-black font-black text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:scale-105 transition-all"
              >
                DÙNG THỬ MIỄN PHÍ 7 NGÀY
              </button>
              <a href="#demo-section" className="px-8 py-4 rounded-full border border-white/20 text-white font-bold text-sm uppercase flex items-center gap-2 hover:bg-white/10 transition-all">
                XEM VIDEO GIỚI THIỆU <Play className="w-4 h-4 text-[#FBBF24]" />
              </a>
            </div>

            <div className="flex items-center gap-4 pt-6 text-sm text-gray-500 font-medium">
              <span>Hỗ trợ:</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-blue-500"><Facebook className="w-4 h-4"/> Facebook</span>
                <span className="flex items-center gap-1 text-white"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg> TikTok</span>
                <span className="flex items-center gap-1 text-red-500"><Tv className="w-4 h-4"/> YouTube</span>
                <span className="flex items-center gap-1 text-orange-500"><ShoppingCart className="w-4 h-4"/> Shopee</span>
              </div>
            </div>
          </div>

          {/* Right AI Robot Illustration (CSS Based mockup) */}
          <div className="relative h-[600px] flex items-center justify-center">
             <TechEcosystemMap />
          {/* Bottom Podium Badge */}
            <div className="absolute -bottom-8 px-6 py-2 rounded-full border border-[#FBBF24]/40 bg-[#FBBF24]/10 backdrop-blur-md z-30 shadow-[0_0_20px_rgba(251,191,36,0.3)]">
              <span className="text-xs font-bold text-[#FBBF24] uppercase tracking-widest">HOẠT ĐỘNG LIÊN TỤC KHÔNG GIÁN ĐOẠN</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURES RIBBON (MARQUEE) */}
      <section className="border-y border-white/5 bg-[#0a0a10] py-8 relative z-20 overflow-hidden marquee-container">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a10] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0a10] to-transparent z-10 pointer-events-none"></div>
        
        <div className="flex w-max animate-marquee">
          <div className="flex w-max justify-around items-center px-4 gap-8">
            <RibbonItem icon={<Globe />} title="LIVESTREAM" subtitle="ĐA NỀN TẢNG" color="text-purple-400" borderCol="border-purple-500" />
            <RibbonItem icon={<MessageSquare />} title="CHATBOT AI" subtitle="THÔNG MINH" color="text-cyan-400" borderCol="border-cyan-500" />
            <RibbonItem icon={<ShoppingCart />} title="BÁN HÀNG" subtitle="TỰ ĐỘNG" color="text-amber-400" borderCol="border-amber-500" />
            <RibbonItem icon={<CreditCard />} title="THANH TOÁN" subtitle="TỰ ĐỘNG" color="text-orange-400" borderCol="border-orange-500" />
            <RibbonItem icon={<Users />} title="QUẢN LÝ" subtitle="TẬP TRUNG" color="text-emerald-400" borderCol="border-emerald-500" />
            <RibbonItem icon={<BarChart2 />} title="BÁO CÁO" subtitle="DOANH SỐ" color="text-blue-400" borderCol="border-blue-500" />
          </div>
          <div className="flex w-max justify-around items-center px-4 gap-8">
            <RibbonItem icon={<Globe />} title="LIVESTREAM" subtitle="ĐA NỀN TẢNG" color="text-purple-400" borderCol="border-purple-500" />
            <RibbonItem icon={<MessageSquare />} title="CHATBOT AI" subtitle="THÔNG MINH" color="text-cyan-400" borderCol="border-cyan-500" />
            <RibbonItem icon={<ShoppingCart />} title="BÁN HÀNG" subtitle="TỰ ĐỘNG" color="text-amber-400" borderCol="border-amber-500" />
            <RibbonItem icon={<CreditCard />} title="THANH TOÁN" subtitle="TỰ ĐỘNG" color="text-orange-400" borderCol="border-orange-500" />
            <RibbonItem icon={<Users />} title="QUẢN LÝ" subtitle="TẬP TRUNG" color="text-emerald-400" borderCol="border-emerald-500" />
            <RibbonItem icon={<BarChart2 />} title="BÁO CÁO" subtitle="DOANH SỐ" color="text-blue-400" borderCol="border-blue-500" />
          </div>
        </div>
      </section>

      {/* 3. VIDEO & WHY CHOOSE US */}
      <section id="demo-section" className="py-20 px-4 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Video Player */}
          <RevealOnScroll className="rounded-3xl border border-white/10 bg-[#0d0d16] p-6 shadow-2xl relative overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">XEM VIDEO GIỚI THIỆU AVA LIVE</h3>
            </div>
            
            <div className="relative flex-1 rounded-2xl bg-black border border-white/5 overflow-hidden group cursor-pointer aspect-video flex items-center justify-center" onClick={() => setIsVideoPlaying(true)}>
              {!isVideoPlaying ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#1a103c] via-[#05050A] to-[#121c33] opacity-80"></div>
                  {/* Faux Thumbnails */}
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-hidden opacity-50 blur-sm">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="h-16 flex-1 bg-white/10 rounded-lg border border-white/5"></div>
                    ))}
                  </div>
                  
                  {/* Central Play Button */}
                  <div className="relative z-10 w-20 h-20 rounded-full border border-purple-500/50 bg-purple-500/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(139,92,246,0.4)]">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                  
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                     <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 opacity-20 blur-[2px]">AVA</span>
                     <span className="text-2xl font-bold text-white opacity-40">LIVE</span>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 bg-black flex items-center justify-center">
                  <p className="text-gray-400 animate-pulse font-mono">Loading Demo Video...</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-[#FBBF24] font-bold text-sm uppercase tracking-widest">GIẢI PHÁP LIVESTREAM & BÁN HÀNG AI</p>
              <p className="text-gray-400 text-xs tracking-widest">THÔNG MINH - TỰ ĐỘNG - HIỆU QUẢ</p>
            </div>
          </RevealOnScroll>

          {/* Right: Why Choose Us */}
          <RevealOnScroll className="rounded-3xl border border-white/10 bg-[#0d0d16] p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-8">VÌ SAO NÊN CHỌN AVA LIVE?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureCard icon={<Clock />} title="TIẾT KIỆM THỜI GIAN" desc="Tự động hóa toàn bộ quy trình bán hàng" color="text-purple-400" bg="bg-purple-500/10" border="border-purple-500/20" />
              <FeatureCard icon={<BarChart2 />} title="TĂNG DOANH SỐ" desc="Chốt đơn nhanh hơn, tăng tỉ lệ chuyển đổi" color="text-blue-400" bg="bg-blue-500/10" border="border-blue-500/20" />
              <FeatureCard icon={<Zap />} title="HOẠT ĐỘNG 24/7" desc="Không gián đoạn, không bỏ lỡ khách hàng" color="text-cyan-400" bg="bg-cyan-500/10" border="border-cyan-500/20" />
              <FeatureCard icon={<MousePointerClick />} title="DỄ DÀNG SỬ DỤNG" desc="Giao diện thân thiện, dễ dùng cho mọi người" color="text-orange-400" bg="bg-orange-500/10" border="border-orange-500/20" />
              <FeatureCard icon={<ShieldCheck />} title="BẢO MẬT TUYỆT ĐỐI" desc="Dữ liệu được mã hóa và bảo vệ an toàn" color="text-red-400" bg="bg-red-500/10" border="border-red-500/20" />
              <FeatureCard icon={<Headphones />} title="HỖ TRỢ TẬN TÂM" desc="Đội ngũ hỗ trợ 24/7, đồng hành cùng bạn" color="text-emerald-400" bg="bg-emerald-500/10" border="border-emerald-500/20" />
            </div>
          </RevealOnScroll>

        </div>
      </section>


      {/* 4. PRICING SECTION */}
      <section id="pricing" className="py-20 px-4 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 flex flex-col items-center">
          <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-8">BẢNG GIÁ AVA LIVE</h2>
          
          <div className="flex items-center gap-2 bg-[#0d0d16] p-1.5 rounded-full border border-white/10 relative">
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Thanh toán hàng tháng
            </button>
            <button 
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all relative ${billingCycle === 'yearly' ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Thanh toán hàng năm
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse border border-white/20 whitespace-nowrap">
                TẶNG 2 THÁNG
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto w-full">
          {plans.map((plan, i) => (
            <RevealOnScroll key={i} className={`relative flex flex-col h-full rounded-[2rem] border bg-[#0B0B13]/80 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:-translate-y-3 cursor-pointer active:scale-90 group hover:border-blue-500/50 ${plan.borderColor} ${plan.isPopular ? 'shadow-[0_0_40px_rgba(59,130,246,0.25)] hover:shadow-[0_0_60px_rgba(59,130,246,0.4)] ring-1 ring-blue-500/50 md:-translate-y-4' : 'hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:border-white/20'}`} onClick={() => handlePurchase(plan)}>
              
              {/* Glassmorphism shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-5 rounded-bl-2xl shadow-[0_4px_15px_rgba(59,130,246,0.5)] z-10">
                  Phổ Biến
                </div>
              )}

              <div className="p-8 pb-6 text-center border-b border-white/5 relative z-10 flex flex-col items-center flex-shrink-0">
                <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br ${plan.color} bg-opacity-10 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                   {plan.icon}
                </div>
                <h3 className="text-lg font-black text-white mb-2 uppercase tracking-widest">{plan.name}</h3>
                <p className="text-gray-400 text-xs mb-6 min-h-[32px] font-medium leading-relaxed">{plan.desc}</p>
                
                <div className="flex flex-col items-center justify-center min-h-[85px] w-full">
                  {plan.monthly === 0 ? (
                     <>
                       <span className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${plan.color} drop-shadow-sm`}>
                         MIỄN PHÍ
                       </span>
                       <div className="flex items-center gap-2 mt-1 text-gray-500 text-xs font-semibold uppercase tracking-wider">Mãi mãi</div>
                     </>
                  ) : plan.name === 'TRỌN ĐỜI' ? (
                     <>
                       <span className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${plan.color} drop-shadow-sm`}>
                         {plan.monthly.toLocaleString()}đ
                       </span>
                       <div className="flex items-center gap-2 mt-1">
                         <span className="text-gray-600 text-[11px] line-through decoration-red-500/50">{plan.oldMonthly.toLocaleString()}đ/tháng</span>
                       </div>
                     </>
                  ) : billingCycle === 'monthly' ? (
                     <>
                       <span className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${plan.color} drop-shadow-sm`}>
                         {plan.monthly.toLocaleString()}đ
                       </span>
                       <div className="flex items-center gap-2 mt-1 text-gray-500 text-xs font-medium">/tháng</div>
                     </>
                  ) : (
                     <>
                       <span className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${plan.color} drop-shadow-sm`}>
                         {plan.monthly.toLocaleString()}đ
                       </span>
                       <div className="flex items-center gap-2 mt-1">
                         <span className="text-gray-600 text-[11px] line-through decoration-red-500/50">{plan.oldMonthly.toLocaleString()}đ</span>
                         <span className="text-gray-500 text-xs font-medium">/tháng</span>
                       </div>
                       <div className="text-emerald-400 text-[10px] font-bold mt-2 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30 whitespace-nowrap shadow-[0_0_10px_rgba(16,185,129,0.2)]">Thanh toán {plan.yearly.toLocaleString()}đ/năm</div>
                     </>
                  )}
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); handlePurchase(plan); }}
                  className={`w-full mt-6 py-3.5 rounded-xl font-black text-sm text-white bg-gradient-to-r ${plan.color} shadow-lg transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:scale-105 active:scale-95 uppercase tracking-wider`}
                >
                  {plan.btnText}
                </button>
              </div>

              <div className="p-8 space-y-4 bg-gradient-to-b from-transparent to-black/20 flex-1 relative z-10">
                {plan.features.map((feat, j) => (
                  <div className="flex items-start gap-3 group/feat" key={j}>
                    <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center bg-gradient-to-br ${plan.color} shadow-sm group-hover/feat:scale-110 transition-transform`}>
                       <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-300 group-hover/feat:text-white transition-colors">{feat}</span>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          ))}
        </div>


      </section>

      {/* 5. STATS & PARTNERS */}
      <section className="py-12 border-y border-white/5 bg-[#0a0a10] relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
            <StatItem icon={<Crown />} value="10.000+" label="Khách hàng tin dùng" color="text-amber-400" />
            <StatItem icon={<MonitorPlay />} value="50.000+" label="Livestream mỗi tháng" color="text-purple-400" />
            <StatItem icon={<ShoppingBagIcon />} value="1.000.000+" label="Đơn hàng đã xử lý" color="text-blue-400" />
            <StatItem icon={<ShieldCheck />} value="99.9%" label="Uptime hệ thống" color="text-emerald-400" />
            <StatItem icon={<Users />} value="24/7" label="Hỗ trợ khách hàng" color="text-cyan-400" />
          </div>
          <div className="text-center mt-8">
            <h4 className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-6">ĐỐI TÁC TIN CẬY</h4>
            <div className="relative z-20 overflow-hidden marquee-container py-4">
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a10] to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0a10] to-transparent z-10 pointer-events-none"></div>
              
              <div className="flex w-max animate-marquee-reverse">
                <div className="flex w-max justify-around items-center px-4 gap-8">
                   <PlatformLogo text="TikTok" icon={<svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg>} hoverColor="hover:text-cyan-400" />
                   <PlatformLogo text="facebook" icon={<Facebook className="w-8 h-8"/>} hoverColor="hover:text-[#1877F2]" />
                   <PlatformLogo text="YouTube" icon={<Tv className="w-8 h-8"/>} hoverColor="hover:text-[#FF0000]" />
                   <PlatformLogo text="Shopee" icon={<ShoppingCart className="w-8 h-8"/>} hoverColor="hover:text-[#EE4D2D]" />
                   <PlatformLogo text="Lazada" icon={<Globe className="w-8 h-8"/>} hoverColor="hover:text-[#0A2647]" />
                </div>
                <div className="flex w-max justify-around items-center px-4 gap-8">
                   <PlatformLogo text="TikTok" icon={<svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg>} hoverColor="hover:text-cyan-400" />
                   <PlatformLogo text="facebook" icon={<Facebook className="w-8 h-8"/>} hoverColor="hover:text-[#1877F2]" />
                   <PlatformLogo text="YouTube" icon={<Tv className="w-8 h-8"/>} hoverColor="hover:text-[#FF0000]" />
                   <PlatformLogo text="Shopee" icon={<ShoppingCart className="w-8 h-8"/>} hoverColor="hover:text-[#EE4D2D]" />
                   <PlatformLogo text="Lazada" icon={<Globe className="w-8 h-8"/>} hoverColor="hover:text-[#0A2647]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#05050A] pt-16 pb-8 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Top Footer Banner Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <div className="rounded-2xl border border-white/10 bg-[#0d0d16] p-8 flex items-center justify-between group cursor-pointer hover:border-purple-500/30 transition-colors">
              <div>
                <h4 className="text-xl font-bold text-white mb-2 uppercase">HƯỚNG DẪN SỬ DỤNG</h4>
                <p className="text-gray-400 text-sm mb-4">Xem video hướng dẫn chi tiết để bắt đầu sử dụng AVA LIVE một cách dễ dàng</p>
                <button className="px-5 py-2 rounded-lg border border-white/20 text-white text-xs font-bold hover:bg-white/10 transition-colors">XEM HƯỚNG DẪN <Play className="w-3 h-3 inline ml-1" /></button>
              </div>
              <div className="w-32 h-20 bg-black rounded-lg border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Play className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            
            <div className="rounded-2xl border border-white/10 bg-[#0d0d16] p-8 flex items-center justify-between group cursor-pointer hover:border-blue-500/30 transition-colors">
              <div>
                <h4 className="text-xl font-bold text-white mb-2 uppercase">HỖ TRỢ 24/7</h4>
                <p className="text-gray-400 text-sm mb-4">Đội ngũ hỗ trợ chuyên nghiệp luôn sẵn sàng giúp bạn thành công với AVA LIVE</p>
                <button className="px-5 py-2 rounded-lg border border-white/20 text-white text-xs font-bold hover:bg-white/10 transition-colors">LIÊN HỆ NGAY</button>
              </div>
              <div className="w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Headphones className="w-10 h-10 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#111] p-0.5 border border-white/20">
                  <img src="/official_logo.jpg" alt="AvaLive" className="w-full h-full object-cover rounded-[10px]" />
                </div>
                <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-1.5 leading-none">
                  <span className="text-[#FBBF24] drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">AVA</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-black drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">LIVESTREAM</span>
                </h1>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                Nền tảng livestream & bán hàng AI thông minh hàng đầu Việt Nam
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-sm">SẢN PHẨM</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Tính năng</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bảng giá</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hướng dẫn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cập nhật</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-sm">CÔNG TY</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Về chúng tôi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tin tức</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tuyển dụng</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Liên hệ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-sm">HỖ TRỢ</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Trung tâm hỗ trợ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Điều khoản</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hướng dẫn thanh toán</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} AVA LIVE. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500">KẾT NỐI VỚI CHÚNG TÔI</span>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-[#1877F2] flex items-center justify-center text-white"><Facebook className="w-3 h-3" /></div>
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white"><svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg></div>
                <div className="w-6 h-6 rounded-full bg-[#FF0000] flex items-center justify-center text-white"><Play className="w-3 h-3" /></div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Chat Button */}
      <button className="fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-sm shadow-xl flex items-center gap-2 hover:scale-105 transition-transform">
         <MessageSquare className="w-5 h-5" /> Chat với AI
      </button>

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

// Subcomponents for cleaner code
function RibbonItem({ icon, title, subtitle, color, borderCol }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group min-w-max mx-8 border border-transparent hover:border-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] shrink-0 min-w-max">
      <div className={`p-3 rounded-xl bg-[#111] border border-white/10 ${color} group-hover:scale-110 group-hover:border-[${borderCol.replace('border-', '')}] transition-transform shadow-lg`}>
        {React.cloneElement(icon, { className: "w-6 h-6" })}
      </div>
      <div>
        <h4 className="text-white text-sm font-black leading-tight uppercase tracking-wide">{title} <br/><span className="text-gray-400 font-bold">{subtitle}</span></h4>
      </div>
    </div>
  );
}

function PlatformLogo({ icon, text, hoverColor }) {
  const colorClass = hoverColor ? hoverColor.replace('hover:', '') : 'text-white';
  return (
    <div className={`flex items-center gap-3 transition-all duration-500 cursor-pointer min-w-max mx-12 group drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-110 active:scale-95 ${colorClass}`}>
      {React.cloneElement(icon, { className: "w-9 h-9 group-hover:scale-110 transition-transform" })}
      <span className="text-3xl font-black tracking-wider uppercase">{text}</span>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color, bg, border }) {
  return (
    <div className={`p-5 rounded-2xl border ${border} ${bg} flex gap-4 hover:scale-[1.02] transition-transform`}>
      <div className={`p-3 rounded-xl bg-black/50 backdrop-blur-md h-max border ${border} ${color}`}>
        {React.cloneElement(icon, { className: "w-6 h-6" })}
      </div>
      <div>
        <h4 className="text-white font-bold text-sm mb-1">{title}</h4>
        <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function StatItem({ icon, value, label, color }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-white/5 bg-[#0d0d16] text-center hover:border-white/10 transition-colors">
      <div className={`p-2 rounded-full bg-black border border-white/10 ${color} mb-3 shadow-[0_0_15px_currentColor]`}>
        {React.cloneElement(icon, { className: "w-5 h-5 opacity-80" })}
      </div>
      <h4 className="text-xl font-black text-white mb-1">{value}</h4>
      <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">{label}</p>
    </div>
  );
}

// Shopping Bag Icon component since lucide-react ShoppingBag is not imported, let's use ShoppingCart or custom svg
function ShoppingBagIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
      <path d="M3 6h18"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}
