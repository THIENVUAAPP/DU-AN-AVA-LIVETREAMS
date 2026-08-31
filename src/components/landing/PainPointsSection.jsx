import React from 'react';
import RevealOnScroll from './RevealOnScroll';
import { Clock, BatteryWarning, Combine, DollarSign, MessageSquareOff, TrendingDown } from 'lucide-react';

export default function PainPointsSection() {
  const painPoints = [
    {
      icon: <Clock />,
      title: "Chủ shop quá bận",
      desc: "Muốn lên hình để tăng niềm tin nhưng phải liên tục chuẩn bị, nói chuyện, giới thiệu sản phẩm và xử lý bình luận.",
      color: "text-amber-400 border-amber-400/20 bg-amber-400/10 shadow-[0_0_15px_rgba(251,191,36,0.15)]"
    },
    {
      icon: <BatteryWarning />,
      title: "Kiệt sức vì Live",
      desc: "Livestream liên tục khiến người vận hành dễ mệt mỏi, khó duy trì lịch phát sóng ổn định.",
      color: "text-rose-400 border-rose-400/20 bg-rose-400/10 shadow-[0_0_15px_rgba(251,113,133,0.15)]"
    },
    {
      icon: <Combine />,
      title: "Nội dung thiếu nhất quán",
      desc: "Giọng nói, phong cách, kịch bản và hình ảnh dễ thay đổi giữa các phiên Live.",
      color: "text-cyan-400 border-cyan-400/20 bg-cyan-400/10 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
    },
    {
      icon: <DollarSign />,
      title: "Chi phí nhân sự cao",
      desc: "Một phiên Live có thể cần người dẫn, người kiểm duyệt, người quản lý sản phẩm, người xử lý đơn và kỹ thuật.",
      color: "text-red-400 border-red-400/20 bg-red-400/10 shadow-[0_0_15px_rgba(248,113,113,0.15)]"
    },
    {
      icon: <MessageSquareOff />,
      title: "Bỏ lỡ tương tác",
      desc: "Bình luận, câu hỏi và tín hiệu mua hàng có thể xuất hiện liên tục trong thời gian thực.",
      color: "text-pink-400 border-pink-400/20 bg-pink-400/10 shadow-[0_0_15px_rgba(244,114,182,0.15)]"
    },
    {
      icon: <TrendingDown />,
      title: "Khó mở rộng",
      desc: "Một đội ngũ nhỏ khó vận hành đồng thời nhiều phiên Live và nhiều kênh.",
      color: "text-violet-400 border-violet-400/20 bg-violet-400/10 shadow-[0_0_15px_rgba(167,139,250,0.15)]"
    }
  ];

  return (
    <section className="py-32 px-4 bg-[#030305] relative z-10 border-t border-white/5 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#030305] to-[#030305] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <RevealOnScroll>
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] border border-white/10 bg-white/[0.02] backdrop-blur-md px-5 py-2 rounded-full inline-block mb-6">
              NỖI ĐAU CỦA LIVESTREAM TRUYỀN THỐNG
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 uppercase tracking-tight mb-6 leading-tight">
              LIVESTREAM ĐANG TIÊU TỐN BAO NHIÊU <br className="hidden md:block" /> THỜI GIAN, NHÂN SỰ VÀ CHI PHÍ CỦA BẠN?
            </h2>
          </RevealOnScroll>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {painPoints.map((point, index) => (
            <RevealOnScroll key={index} className="h-full">
              <div className="bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.04] border border-white/[0.05] hover:border-white/20 rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col group relative overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${point.color}`}>
                  {React.cloneElement(point.icon, { className: 'w-6 h-6' })}
                </div>
                <h3 className="text-xl font-black text-white/90 mb-4 tracking-wide">{point.title}</h3>
                <p className="text-gray-400/80 text-[15px] leading-relaxed font-light">{point.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
