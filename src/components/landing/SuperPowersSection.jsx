import React from 'react';
import RevealOnScroll from './RevealOnScroll';
import { 
  Zap, MessagesSquare, Repeat, ShoppingBag, Mic2, 
  Wand2, BrainCircuit, Users2, Workflow, Speaker, Sparkles
} from 'lucide-react';

export default function SuperPowersSection() {
  const powers = [
    { num: '01', emoji: '💬', title: 'ĐA TƯƠNG TÁC', desc: 'Không chỉ phản hồi comment; hệ thống phản ứng với quà tặng, lượt thích, chia sẻ.', icon: <MessagesSquare />, color: 'from-[#00F0FF] to-[#3B82F6]', border: 'border-[#00F0FF]/40 hover:border-[#00F0FF]', glow: 'shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]' },
    { num: '02', emoji: '⚡', title: 'REAL-TIME 0.2S', desc: 'Xử lý sự kiện gần như tức thì để tạo trải nghiệm hội thoại mượt mà tự nhiên.', icon: <Zap />, color: 'from-[#F59E0B] to-[#EF4444]', border: 'border-[#F59E0B]/40 hover:border-[#F59E0B]', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]' },
    { num: '03', emoji: '🛍️', title: 'AUTO COMMERCE', desc: 'Phát hiện tín hiệu mua hàng và lập tức kích hoạt quy trình chốt sale tự động.', icon: <ShoppingBag />, color: 'from-[#EC4899] to-[#9333EA]', border: 'border-[#EC4899]/40 hover:border-[#EC4899]', glow: 'shadow-[0_0_20px_rgba(236,72,153,0.25)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)]' },
    { num: '04', emoji: '🎙️', title: 'VAD ĐÀM THOẠI', desc: 'Nhận diện giọng nói thông minh để tương tác hai chiều với khán giả phiên live.', icon: <Mic2 />, color: 'from-[#10B981] to-[#00F0FF]', border: 'border-[#10B981]/40 hover:border-[#10B981]', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]' },
    { num: '05', emoji: '🎁', title: 'EVENT RESPONSE', desc: 'Thiết lập phản ứng cảm xúc độc quyền cho từng loại quà tặng hoặc từ khóa.', icon: <Wand2 />, color: 'from-[#A855F7] to-[#EC4899]', border: 'border-[#A855F7]/40 hover:border-[#A855F7]', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.25)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]' },
    { num: '06', emoji: '🔊', title: 'AI VOICE PRO', desc: 'Hàng trăm giọng đọc tự nhiên đa vùng miền và phong cách giao tiếp lôi cuốn.', icon: <Speaker />, color: 'from-[#00F0FF] to-[#8B5CF6]', border: 'border-[#00F0FF]/40 hover:border-[#8B5CF6]', glow: 'shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]' },
    { num: '07', emoji: '🧠', title: 'AI BRAIN TỶ ĐÔ', desc: 'Quản lý ngữ cảnh, kho tri thức sản phẩm và logic chốt đơn không góc chết.', icon: <BrainCircuit />, color: 'from-[#EC4899] to-[#F59E0B]', border: 'border-[#EC4899]/40 hover:border-[#EC4899]', glow: 'shadow-[0_0_20px_rgba(236,72,153,0.25)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)]' },
    { num: '08', emoji: '👥', title: 'HỆ PROFILE IDOL', desc: 'Lưu trữ không giới hạn các AI Idol, giọng nói, kịch bản và kho media riêng.', icon: <Users2 />, color: 'from-[#8B5CF6] to-[#00F0FF]', border: 'border-[#8B5CF6]/40 hover:border-[#8B5CF6]', glow: 'shadow-[0_0_20px_rgba(139,92,246,0.25)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]' },
    { num: '09', emoji: '🌐', title: 'MULTI-CHANNEL', desc: 'Mở rộng livestream đồng thời trên tất cả các nền tảng video ngắn phổ biến.', icon: <Workflow />, color: 'from-[#3B82F6] to-[#00F0FF]', border: 'border-[#3B82F6]/40 hover:border-[#3B82F6]', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]' },
    { num: '10', emoji: '🔥', title: 'ANTI DEAD-AIR', desc: 'Tự động kích hoạt kịch bản khuấy động khi phòng live giảm tương tác.', icon: <Repeat />, color: 'from-[#EF4444] to-[#EC4899]', border: 'border-[#EF4444]/40 hover:border-[#EF4444]', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.25)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]' }
  ];

  return (
    <section className="py-28 px-4 bg-[#0A0618] relative z-10 border-t border-[#8B5CF6]/20 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00F0FF]/15 blur-[160px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#EC4899]/15 blur-[160px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <RevealOnScroll>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#A855F7]/50 bg-[#A855F7]/10 backdrop-blur-xl shadow-[0_0_20px_rgba(168,85,247,0.3)] mb-6">
              <Sparkles className="w-4 h-4 text-[#A855F7]" />
              <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] via-white to-[#00F0FF] uppercase tracking-[0.2em]">
                CÔNG NGHỆ VƯỢT TRỘI
              </span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6 leading-tight drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
              10 SIÊU NĂNG LỰC ĐỘC QUYỀN <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#EC4899] to-[#9333EA]">
                CỦA CỖ MÁY AVA LIVE
              </span>
            </h2>
            <div className="w-36 h-2 bg-gradient-to-r from-[#00F0FF] via-[#EC4899] to-[#9333EA] mx-auto rounded-full shadow-[0_0_20px_rgba(236,72,153,0.8)]"></div>
          </RevealOnScroll>
        </div>

        {/* 10 Grid Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {powers.map((power, index) => (
            <RevealOnScroll key={index} className="h-full">
              <div className={`bg-gradient-to-b from-[#191038]/95 via-[#110B27]/95 to-[#0A0619]/98 backdrop-blur-xl border-2 ${power.border} rounded-[26px] p-6 transition-all duration-500 h-full group flex flex-col ${power.glow} hover:-translate-y-2 relative overflow-hidden`}>
                
                <div className="flex items-center justify-between mb-5 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${power.color} flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-white/40`}>
                    <span>{power.emoji}</span>
                  </div>
                  <span className="text-3xl font-black text-white/20 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#00F0FF] group-hover:to-[#EC4899] transition-all font-mono">
                    {power.num}
                  </span>
                </div>
                
                <h3 className="text-[15px] font-black text-white mb-2 relative z-10 tracking-wide uppercase group-hover:text-[#00F0FF] transition-colors">
                  {power.title}
                </h3>
                <p className="text-[13px] text-gray-300/90 font-light leading-relaxed flex-1 relative z-10">
                  {power.desc}
                </p>

              </div>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
}
