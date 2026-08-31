import React from 'react';
import RevealOnScroll from './RevealOnScroll';
import { Clock, BatteryWarning, Combine, DollarSign, MessageSquareOff, TrendingDown } from 'lucide-react';

export default function PainPointsSection() {
  const painPoints = [
    {
      icon: <Clock />,
      title: "Chủ shop quá bận",
      desc: "Muốn lên hình để tăng niềm tin nhưng phải liên tục chuẩn bị, nói chuyện, giới thiệu sản phẩm và xử lý bình luận.",
      color: "text-rose-400"
    },
    {
      icon: <BatteryWarning />,
      title: "Kiệt sức vì Live",
      desc: "Livestream liên tục khiến người vận hành dễ mệt mỏi, khó duy trì lịch phát sóng ổn định.",
      color: "text-orange-400"
    },
    {
      icon: <Combine />,
      title: "Nội dung thiếu nhất quán",
      desc: "Giọng nói, phong cách, kịch bản và hình ảnh dễ thay đổi giữa các phiên Live.",
      color: "text-amber-400"
    },
    {
      icon: <DollarSign />,
      title: "Chi phí nhân sự cao",
      desc: "Một phiên Live có thể cần người dẫn, người kiểm duyệt, người quản lý sản phẩm, người xử lý đơn và kỹ thuật.",
      color: "text-red-400"
    },
    {
      icon: <MessageSquareOff />,
      title: "Bỏ lỡ tương tác",
      desc: "Bình luận, câu hỏi và tín hiệu mua hàng có thể xuất hiện liên tục trong thời gian thực.",
      color: "text-pink-400"
    },
    {
      icon: <TrendingDown />,
      title: "Khó mở rộng",
      desc: "Một đội ngũ nhỏ khó vận hành đồng thời nhiều phiên Live và nhiều kênh.",
      color: "text-purple-400"
    }
  ];

  return (
    <section className="py-24 px-4 bg-[#05070B] relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <RevealOnScroll>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest border border-white/10 px-4 py-1.5 rounded-full inline-block mb-4">
              NỖI ĐAU CỦA LIVESTREAM TRUYỀN THỐNG
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider mb-6">
              LIVESTREAM ĐANG TIÊU TỐN BAO NHIÊU THỜI GIAN,<br className="hidden md:block" /> NHÂN SỰ VÀ CHI PHÍ CỦA BẠN?
            </h2>
          </RevealOnScroll>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {painPoints.map((point, index) => (
            <RevealOnScroll key={index} className="h-full">
              <div className="bg-[#111827] hover:bg-[#172033] border border-white/5 hover:border-white/10 rounded-[24px] p-8 transition-all duration-300 hover:-translate-y-2 h-full flex flex-col group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className={`w-12 h-12 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center mb-6 shadow-lg ${point.color}`}>
                  {React.cloneElement(point.icon, { className: 'w-6 h-6' })}
                </div>
                <h3 className="text-lg font-black text-white mb-3 tracking-wide">{point.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{point.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
