import React from 'react';
import RevealOnScroll from './RevealOnScroll';
import { 
  Zap, MessagesSquare, Repeat, ShoppingBag, Mic2, 
  Wand2, BrainCircuit, Users2, Workflow, Speaker 
} from 'lucide-react';

export default function SuperPowersSection() {
  const powers = [
    { num: '01', title: 'ĐA TƯƠNG TÁC', desc: 'Không chỉ phản hồi comment; hệ thống phản ứng với nhiều tín hiệu tương tác.', icon: <MessagesSquare /> },
    { num: '02', title: 'REAL-TIME', desc: 'Xử lý sự kiện gần thời gian thực để tạo trải nghiệm hội thoại tự nhiên.', icon: <Zap /> },
    { num: '03', title: 'AUTO COMMERCE', desc: 'Phát hiện tín hiệu mua hàng và kích hoạt workflow bán hàng.', icon: <ShoppingBag /> },
    { num: '04', title: 'VAD ĐÀM THOẠI', desc: 'Cho phép tương tác bằng giọng nói với hệ thống khi được cấu hình.', icon: <Mic2 /> },
    { num: '05', title: 'EVENT RESPONSE', desc: 'Thiết lập phản ứng riêng cho từng loại quà tặng, từ khóa hoặc hành động.', icon: <Wand2 /> },
    { num: '06', title: 'AI VOICE', desc: 'Nhiều lựa chọn giọng nói và phong cách giao tiếp.', icon: <Speaker /> },
    { num: '07', title: 'AI BRAIN', desc: 'Quản lý context, kiến thức, kịch bản và logic phản hồi.', icon: <BrainCircuit /> },
    { num: '08', title: 'PROFILE SYSTEM', desc: 'Lưu nhiều AI Idol, giọng nói, kịch bản và cấu hình.', icon: <Users2 /> },
    { num: '09', title: 'MULTI-CHANNEL', desc: 'Khả năng mở rộng cho nhiều kênh được nền tảng hỗ trợ.', icon: <Workflow /> },
    { num: '10', title: 'ANTI DEAD AIR', desc: 'Khi tương tác giảm, hệ thống kích hoạt nội dung kéo tương tác.', icon: <Repeat /> }
  ];

  return (
    <section className="py-32 px-4 bg-[#030305] relative z-10 border-t border-white/5 overflow-hidden">
      {/* Premium accent lights */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-900/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-900/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <RevealOnScroll>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-indigo-200 uppercase tracking-tight mb-6">
              10 SIÊU NĂNG LỰC CỦA AVA LIVE
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500 mx-auto rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
          </RevealOnScroll>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {powers.map((power, index) => (
            <RevealOnScroll key={index} className="h-full">
              <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] hover:border-cyan-500/30 rounded-3xl p-6 hover:bg-white/[0.04] transition-all duration-500 h-full group flex flex-col hover:shadow-[0_10px_30px_rgba(34,211,238,0.1)] hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-500 shadow-inner">
                    {React.cloneElement(power.icon, { className: 'w-5 h-5' })}
                  </div>
                  <span className="text-3xl font-black text-white/5 group-hover:text-cyan-500/20 transition-colors duration-500 font-mono tracking-tighter">{power.num}</span>
                </div>
                <h3 className="text-[14px] font-black text-white/90 mb-3 relative z-10 tracking-wide uppercase">{power.title}</h3>
                <p className="text-[13px] text-gray-400/80 font-light leading-relaxed flex-1 relative z-10">{power.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
