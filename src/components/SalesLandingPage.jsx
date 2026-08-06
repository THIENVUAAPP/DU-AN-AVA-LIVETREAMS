import React, { useState, useEffect } from 'react';
import { 
  Sparkles, CheckCircle2, ArrowRight, Zap, ShieldCheck, 
  Tv, Users, CreditCard, ChevronRight, Crown, Star, 
  BarChart2, Share2, Globe, HeartHandshake 
} from 'lucide-react';
import SePayModal from './SePayModal';

export default function SalesLandingPage({ setGoogleLoginModalOpen, currentUser, setActiveTab }) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [sepayModalOpen, setSepayModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
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
      name: "Gói FREE",
      desc: "Trải nghiệm sức mạnh của AI Livestream hoàn toàn miễn phí.",
      monthly: 0,
      yearly: 0,
      features: [
        "Phát Live 1 luồng/tháng",
        "Giới hạn 30 phút/phiên Live",
        "Có Watermark (Logo AvaLive)",
        "Chatbot AI cơ bản",
        "Không hỗ trợ Auto Captcha"
      ],
      color: "from-gray-500 to-gray-600",
      textColor: "text-gray-300",
      btnText: "BẮT ĐẦU MIỄN PHÍ",
      icon: <Star className="w-5 h-5 text-gray-300" />
    },
    {
      name: "Gói STARTER",
      desc: "Dành cho cá nhân bán hàng nhỏ lẻ, cần tăng tương tác.",
      monthly: 299000,
      yearly: 299000 * 10,
      features: [
        "Phát Live 3 luồng đồng thời",
        "Không giới hạn thời gian Live",
        "Bỏ Logo AvaLive Watermark",
        "Tự động chốt đơn (50 đơn/tháng)",
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
      monthly: 799000,
      yearly: 799000 * 10, // Tặng 2 tháng
      features: [
        "Phát Live 10 luồng đồng thời",
        "Restream TikTok, FB, Shopee",
        "Tự động chốt đơn không giới hạn",
        "Bypass Captcha Cao Cấp (100%)",
        "MC AI Ảo Lồng Tiếng Đa Ngôn Ngữ"
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
      monthly: 2490000,
      yearly: 2490000 * 10,
      features: [
        "Phát Live KHÔNG GIỚI HẠN luồng",
        "Tạo & Quản lý nhiều phiên độc lập",
        "Phân quyền nhân viên (Sub-accounts)",
        "API tích hợp riêng biệt",
        "Hỗ trợ kỹ thuật 24/7 (1 kèm 1)"
      ],
      color: "from-[#059669] to-[#047857]",
      textColor: "text-emerald-400",
      btnText: "LIÊN HỆ ENTERPRISE",
      icon: <Building2 className="w-5 h-5 text-emerald-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans overflow-x-hidden selection:bg-[#EF4444] selection:text-white pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-32 overflow-hidden flex flex-col items-center text-center px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#EF4444]/20 via-[#8B5CF6]/20 to-[#3B82F6]/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md animate-fade-in-up">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Nền Tảng Livestream Bán Hàng #1 Việt Nam</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8 leading-[1.1] max-w-4xl animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          Đột Phá Doanh Thu <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EF4444] via-[#8B5CF6] to-[#06B6D4]">
            Bằng Hệ Sinh Thái AvaLive
          </span>
        </h1>
        
        <p className="text-gray-400 text-lg max-w-2xl mb-10 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          Tự động hóa hoàn toàn quy trình bán hàng trên Livestream. Tích hợp AI Chốt Đơn, Bypass Captcha Siêu Tốc, và Restream Đa Kênh (TikTok, Facebook, Shopee) chỉ với 1 Click.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          {!currentUser ? (
            <button 
              onClick={() => setGoogleLoginModalOpen(true)}
              className="px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-gray-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 flex items-center gap-2"
            >
              KẾT NỐI GOOGLE ĐỂ BẮT ĐẦU NGAY <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={() => setActiveTab('broadcast')}
              className="px-8 py-4 bg-gradient-to-r from-[#EF4444] to-[#8B5CF6] text-white font-black rounded-2xl transition-all shadow-[0_0_40px_rgba(239,68,68,0.4)] hover:scale-105 flex items-center gap-2"
            >
              VÀO STUDIO CỦA BẠN <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </section>

      {/* 2. VALUE PROPOSITION / FEATURES */}
      <section className="py-20 px-4 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
              <Globe className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Restream Đa Nền Tảng</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Phát luồng trực tiếp đồng thời lên TikTok Shop, Facebook Fanpage, Shopee Live và YouTube chỉ với 1 cú click. Tối đa hóa tệp khách hàng.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
              <ShieldCheck className="w-7 h-7 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI Bypass Captcha Siêu Tốc</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Tích hợp sẵn Stealth AI để tự động vượt mọi WAF (Tường lửa) của TikTok và Shopee. Luồng Live của bạn sẽ không bao giờ bị gián đoạn.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Chốt Đơn Tự Động 24/7</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Chatbot AI tự động phân tích bình luận, xin SĐT và tạo đơn hàng gửi về hệ thống vận chuyển (GHTK, GHN, Viettel Post) một cách thần tốc.
            </p>
          </div>

        </div>
      </section>

      {/* 3. PRICING PACKAGES */}
      <section className="py-20 px-4 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Bảng Giá Dịch Vụ</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Chọn gói cước phù hợp nhất với quy mô kinh doanh của bạn. Nâng cấp bất kỳ lúc nào, thanh toán siêu tốc hoàn toàn tự động qua SePay VietQR.
          </p>
          
          <div className="inline-flex items-center gap-2 p-1 bg-[#121216] border border-white/10 rounded-full mx-auto">
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-[#3B82F6] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Trả Từng Tháng
            </button>
            <button 
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-[#8B5CF6] text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]' : 'text-gray-400 hover:text-white'}`}
            >
              Trả Theo Năm <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-black animate-pulse">Tặng 2 Tháng</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <div key={i} className={`relative glass-panel rounded-3xl p-8 border flex flex-col ${plan.isPopular ? 'border-[#8B5CF6]/50 shadow-[0_0_30px_rgba(139,92,246,0.15)] -translate-y-4' : 'border-white/10 hover:border-white/20 transition-colors'}`}>
              
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#EF4444] to-[#8B5CF6] text-white text-[10px] font-black uppercase rounded-full tracking-widest shadow-lg">
                  KHUYÊN DÙNG NHẤT
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  {plan.icon}
                  <h3 className={`text-xl font-black ${plan.textColor}`}>{plan.name}</h3>
                </div>
                <p className="text-gray-400 text-xs min-h-[40px] leading-relaxed">{plan.desc}</p>
              </div>
              
              <div className="mb-8">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black text-white">
                    {billingCycle === 'yearly' 
                      ? plan.yearly === 0 ? 'Miễn phí' : `${(plan.yearly).toLocaleString()}₫` 
                      : plan.monthly === 0 ? 'Miễn phí' : `${(plan.monthly).toLocaleString()}₫`}
                  </span>
                  {plan.monthly > 0 && <span className="text-gray-400 text-sm mb-1">/ {billingCycle === 'yearly' ? 'Năm' : 'Tháng'}</span>}
                </div>
                {billingCycle === 'yearly' && plan.monthly > 0 && (
                  <div className="text-emerald-400 text-xs font-bold mt-2">
                    Tiết kiệm {(plan.monthly * 12 - plan.yearly).toLocaleString()}₫
                  </div>
                )}
              </div>

              <div className="space-y-4 flex-1 mb-8">
                {plan.features.map((feat, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-300">{feat}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handlePurchase(plan)}
                className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-lg text-white bg-gradient-to-r ${plan.color} hover:opacity-90 hover:scale-[1.02]`}
              >
                {plan.btnText}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. AFFILIATE 30% PROMO */}
      <section className="py-20 px-4 max-w-7xl mx-auto relative z-10">
        <div className="bg-gradient-to-tr from-[#121216] via-[#1A1A24] to-[#121216] border border-white/10 rounded-[40px] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative">
          
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#8B5CF6]/20 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="flex-1 space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black uppercase">
              <HeartHandshake className="w-4 h-4" /> CHƯƠNG TRÌNH ĐỐI TÁC
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Tiếp Thị Liên Kết <br/>
              <span className="text-[#8B5CF6]">Hoa Hồng 30% Trọn Đời</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
              Giới thiệu bạn bè hoặc khách hàng sử dụng các Gói cước của AvaLive PRO và nhận ngay 30% hoa hồng trên giá trị thanh toán. Rút tiền tự động về Ngân Hàng siêu tốc qua cổng SePay VietQR.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> Thanh toán minh bạch theo thời gian thực.</li>
              <li className="flex items-center gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> Bảng điều khiển quản lý doanh thu chi tiết.</li>
              <li className="flex items-center gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> Rút tiền mọi lúc, mọi nơi, không giữ vốn.</li>
            </ul>
            <div className="pt-4">
              <button onClick={() => {
                if(!currentUser) setGoogleLoginModalOpen(true);
                else setActiveTab('affiliate-dashboard');
              }} className="px-8 py-4 bg-white hover:bg-gray-200 text-black font-black rounded-2xl shadow-xl transition-all hover:scale-105 flex items-center gap-2">
                THAM GIA KIẾM TIỀN NGAY <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="w-full md:w-[400px] shrink-0 relative z-10">
            <div className="glass-panel p-6 rounded-3xl border border-white/20 shadow-2xl space-y-6 bg-[#050505]/50">
               <div className="text-center">
                 <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">MÔ PHỎNG DOANH THU CỦA BẠN</h4>
                 <div className="text-5xl font-black text-emerald-400 mb-1">119.700.000₫</div>
                 <p className="text-xs text-gray-500 font-mono">Nếu giới thiệu 50 khách mua Gói PRO (Năm)</p>
               </div>
               <div className="h-px w-full bg-white/10"></div>
               <div className="space-y-3">
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-400">Giá Gói PRO (Năm)</span>
                   <span className="text-white font-bold">7.990.000₫</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-400">Tỷ lệ Hoa Hồng</span>
                   <span className="text-[#8B5CF6] font-bold">30%</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-400">Thu nhập / Khách</span>
                   <span className="text-emerald-400 font-bold">2.397.000₫</span>
                 </div>
               </div>
               <button className="w-full py-3 rounded-xl bg-[#121216] border border-white/10 text-gray-300 font-bold text-xs hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                  <CreditCard className="w-4 h-4" /> RÚT TIỀN TỰ ĐỘNG NGAY
               </button>
            </div>
          </div>

        </div>
      </section>
      
      {sepayModalOpen && selectedPlan && (
        <SePayModal 
          isOpen={sepayModalOpen}
          onClose={() => setSepayModalOpen(false)}
          plan={selectedPlan}
          billingCycle={billingCycle}
          currentUser={currentUser}
          onSuccess={() => {
            setSepayModalOpen(false);
            alert(`Thanh toán thành công! Chào mừng bạn đến với ${selectedPlan.name}.`);
            setActiveTab('broadcast');
            // Cập nhật lại UI sau này
          }}
        />
      )}
    </div>
  );
}
