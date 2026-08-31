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
    <section className="py-24 px-4 bg-[#05070B] relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <RevealOnScroll>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider mb-4">
              10 SIÊU NĂNG LỰC CỦA AVA LIVE
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-violet-500 mx-auto rounded-full"></div>
          </RevealOnScroll>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {powers.map((power, index) => (
            <RevealOnScroll key={index} className="h-full">
              <div className="bg-[#101725] border border-white/5 hover:border-cyan-500/30 rounded-2xl p-5 hover:bg-[#172033] transition-colors h-full group flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {React.cloneElement(power.icon, { className: 'w-4 h-4' })}
                  </div>
                  <span className="text-2xl font-black text-white/5 group-hover:text-cyan-500/20 transition-colors font-mono">{power.num}</span>
                </div>
                <h3 className="text-sm font-black text-white mb-2">{power.title}</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed flex-1">{power.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
