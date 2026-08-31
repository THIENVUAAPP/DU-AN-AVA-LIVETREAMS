import React from 'react';
import RevealOnScroll from './RevealOnScroll';
import { UserSquare2, Mic, Brain, Zap, FileText, ShoppingCart, Share2, BarChart2, ArrowRight, Sparkles } from 'lucide-react';

export default function SolutionFeaturesSection() {
  const modules = [
    { 
      id: 1, 
      emoji: "👸",
      title: 'AI IDOL SIÊU THỰC', 
      desc: 'Tạo nhân vật AI đại diện thương hiệu với biểu cảm sống động, diện mạo đỉnh cao và phong cách thời thượng.', 
      icon: <UserSquare2 />, 
      gradient: 'from-[#A855F7]/30 via-[#EC4899]/10 to-transparent',
      badgeBg: 'bg-gradient-to-br from-[#A855F7] to-[#EC4899]',
      borderColor: 'border-[#A855F7]/50 hover:border-[#EC4899]',
      glowColor: 'shadow-[0_0_25px_rgba(168,85,247,0.25)] hover:shadow-[0_0_35px_rgba(236,72,153,0.5)]',
      accentColor: 'text-[#EC4899]'
    },
    { 
      id: 2, 
      emoji: "🎙️",
      title: 'AI VOICE CẢM XÚC', 
      desc: 'Giọng đọc chuẩn MC tự nhiên, biểu cảm chân thực, hỗ trợ đa ngôn ngữ, tự động ngắt nghỉ và xử lý ngữ điệu.', 
      icon: <Mic />, 
      gradient: 'from-[#00F0FF]/30 via-[#3B82F6]/10 to-transparent',
      badgeBg: 'bg-gradient-to-br from-[#00F0FF] to-[#3B82F6]',
      borderColor: 'border-[#00F0FF]/50 hover:border-[#00F0FF]',
      glowColor: 'shadow-[0_0_25px_rgba(0,240,255,0.25)] hover:shadow-[0_0_35px_rgba(0,240,255,0.5)]',
      accentColor: 'text-[#00F0FF]'
    },
    { 
      id: 3, 
      emoji: "🧠",
      title: 'BỘ NÃO AI THÔNG MINH', 
      desc: 'Hiểu ngữ cảnh khách hàng trong 0.2s, phân tích câu hỏi và tạo câu trả lời chốt sale siêu thông minh và tự nhiên.', 
      icon: <Brain />, 
      gradient: 'from-[#10B981]/30 via-[#00F0FF]/10 to-transparent',
      badgeBg: 'bg-gradient-to-br from-[#10B981] to-[#00F0FF]',
      borderColor: 'border-[#10B981]/50 hover:border-[#10B981]',
      glowColor: 'shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)]',
      accentColor: 'text-[#10B981]'
    },
    { 
      id: 4, 
      emoji: "⚡",
      title: 'EVENT ENGINE REALTIME', 
      desc: 'Tự động bắt sự kiện Comment, Tặng Quà, Thả Tim, Follow để ngay lập tức phản hồi và tung kịch bản tương ứng.', 
      icon: <Zap />, 
      gradient: 'from-[#F59E0B]/30 via-[#EC4899]/10 to-transparent',
      badgeBg: 'bg-gradient-to-br from-[#F59E0B] to-[#EC4899]',
      borderColor: 'border-[#F59E0B]/50 hover:border-[#F59E0B]',
      glowColor: 'shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)]',
      accentColor: 'text-[#F59E0B]'
    },
    { 
      id: 5, 
      emoji: "📜",
      title: 'KỊCH BẢN BÁN HÀNG ĐỘNG', 
      desc: 'Hàng trăm mẫu kịch bản bán hàng chốt đơn, kích thích mua sắm liên tục và chống khoảng lặng (Dead-air).', 
      icon: <FileText />, 
      gradient: 'from-[#EC4899]/30 via-[#8B5CF6]/10 to-transparent',
      badgeBg: 'bg-gradient-to-br from-[#EC4899] to-[#8B5CF6]',
      borderColor: 'border-[#EC4899]/50 hover:border-[#8B5CF6]',
      glowColor: 'shadow-[0_0_25px_rgba(236,72,153,0.25)] hover:shadow-[0_0_35px_rgba(139,92,246,0.5)]',
      accentColor: 'text-[#EC4899]'
    },
    { 
      id: 6, 
      emoji: "🛒",
      title: 'COMMERCE CHỐT ĐƠN', 
      desc: 'Tự động ghim sản phẩm, hiển thị mã giảm giá theo thời gian thực và dẫn link giỏ hàng thúc đẩy thanh toán.', 
      icon: <ShoppingCart />, 
      gradient: 'from-[#3B82F6]/30 via-[#00F0FF]/10 to-transparent',
      badgeBg: 'bg-gradient-to-br from-[#3B82F6] to-[#00F0FF]',
      borderColor: 'border-[#3B82F6]/50 hover:border-[#3B82F6]',
      glowColor: 'shadow-[0_0_25px_rgba(59,130,246,0.25)] hover:shadow-[0_0_35px_rgba(0,240,255,0.5)]',
      accentColor: 'text-[#3B82F6]'
    },
    { 
      id: 7, 
      emoji: "🌐",
      title: 'PHÁT LIVE ĐA NỀN TẢNG', 
      desc: 'Quản trị tập trung và phát sóng đồng thời lên TikTok Studio, Shopee Live, Facebook Live mượt mà không độ trễ.', 
      icon: <Share2 />, 
      gradient: 'from-[#8B5CF6]/30 via-[#EC4899]/10 to-transparent',
      badgeBg: 'bg-gradient-to-br from-[#8B5CF6] to-[#EC4899]',
      borderColor: 'border-[#8B5CF6]/50 hover:border-[#EC4899]',
      glowColor: 'shadow-[0_0_25px_rgba(139,92,246,0.25)] hover:shadow-[0_0_35px_rgba(236,72,153,0.5)]',
      accentColor: 'text-[#8B5CF6]'
    },
    { 
      id: 8, 
      emoji: "📊",
      title: 'ANALYTICS DOANH THU', 
      desc: 'Biểu đồ trực quan đo lường số lượt xem, tỷ lệ giữ chân, bình luận và doanh số theo thời gian thực.', 
      icon: <BarChart2 />, 
      gradient: 'from-[#EC4899]/30 via-[#00F0FF]/10 to-transparent',
      badgeBg: 'bg-gradient-to-br from-[#EC4899] to-[#00F0FF]',
      borderColor: 'border-[#EC4899]/50 hover:border-[#00F0FF]',
      glowColor: 'shadow-[0_0_25px_rgba(236,72,153,0.25)] hover:shadow-[0_0_35px_rgba(0,240,255,0.5)]',
      accentColor: 'text-[#EC4899]'
    },
  ];

  return (
    <section className="py-28 px-4 bg-[#080514] relative z-10 border-t border-[#8B5CF6]/20 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-r from-[#9333EA]/20 via-[#EC4899]/20 to-[#00F0FF]/20 blur-[170px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <RevealOnScroll>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#00F0FF]/50 bg-[#00F0FF]/10 backdrop-blur-xl shadow-[0_0_20px_rgba(0,240,255,0.3)] mb-6">
              <Sparkles className="w-4 h-4 text-[#00F0FF] animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-white to-[#EC4899] uppercase tracking-[0.2em]">
                HỆ SINH THÁI 8 MODULES TOÀN DIỆN
              </span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6 leading-tight drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
              AVA LIVE BIẾN LIVESTREAM THÀNH <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#EC4899] to-[#9333EA]">
                CỖ MÁY BÁN HÀNG TỰ ĐỘNG TỶ ĐÔ
              </span>
            </h2>
            <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed">
              Kết nối liền mạch toàn bộ chuỗi mắt xích vận hành từ AI Idol, giọng nói, kịch bản chốt đơn đến phân tích doanh thu.
            </p>
          </RevealOnScroll>
        </div>

        {/* 8 Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((mod) => (
            <RevealOnScroll key={mod.id} className="h-full">
              <div className={`bg-gradient-to-b from-[#191038]/90 via-[#100B25]/90 to-[#0A0618]/95 backdrop-blur-2xl border-2 ${mod.borderColor} rounded-[28px] p-7 transition-all duration-500 group ${mod.glowColor} h-full flex flex-col relative overflow-hidden hover:-translate-y-2`}>
                
                {/* Glowing Top Corner Background */}
                <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl ${mod.gradient} rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500`}></div>
                
                {/* Emoji + Icon badge */}
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className={`w-16 h-16 rounded-2xl ${mod.badgeBg} flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-white/40`}>
                    <span>{mod.emoji}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-white/10 text-gray-300 uppercase tracking-widest border border-white/10">MOD #{mod.id}</span>
                    <h3 className="text-sm font-black text-white tracking-wider uppercase mt-1 group-hover:text-[#00F0FF] transition-colors">{mod.title}</h3>
                  </div>
                </div>
                
                <p className="text-gray-300/90 text-[14px] leading-relaxed mb-6 flex-1 font-light relative z-10">{mod.desc}</p>
                
                <div className="mt-auto pt-4 border-t border-white/10 relative z-10 flex items-center justify-between">
                  <span className={`text-xs font-bold ${mod.accentColor} flex items-center gap-1.5`}>
                    Hoạt động 24/7
                  </span>
                  <button className="text-[11px] font-black text-white hover:text-[#00F0FF] uppercase tracking-wider flex items-center gap-1 transition-colors">
                    CHI TIẾT <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
}
