import React from 'react';
import RevealOnScroll from './RevealOnScroll';
import { UserSquare2, Mic, Brain, Zap, FileText, ShoppingCart, Share2, BarChart2, ArrowRight } from 'lucide-react';

export default function SolutionFeaturesSection() {
  const modules = [
    { id: 1, title: 'AI IDOL', desc: 'Tạo nhân vật AI mang bản sắc riêng của thương hiệu. Ngoại hình, phong cách và biểu cảm đa dạng.', icon: <UserSquare2 />, color: 'text-purple-400' },
    { id: 2, title: 'AI VOICE', desc: 'Giọng nói có ngữ cảm và đúng tone thương hiệu. Tuỳ chỉnh cảm xúc, tốc độ và ngôn ngữ.', icon: <Mic />, color: 'text-cyan-400' },
    { id: 3, title: 'AI BRAIN', desc: 'Bộ não xử lý bình luận, tín hiệu mua hàng, kịch bản, và tự động phản hồi logic thời gian thực.', icon: <Brain />, color: 'text-emerald-400' },
    { id: 4, title: 'REAL-TIME EVENT ENGINE', desc: 'Biến mọi tương tác (Comment, Like, Gift, Follow) thành một sự kiện kích hoạt hành động.', icon: <Zap />, color: 'text-amber-400' },
    { id: 5, title: 'CONTENT & SCRIPT', desc: 'Hệ thống quản lý kịch bản động, template cho chiến dịch, và kịch bản bán hàng linh hoạt.', icon: <FileText />, color: 'text-rose-400' },
    { id: 6, title: 'COMMERCE', desc: 'Xây dựng workflow chốt đơn tự động, gửi mã giảm giá và chuyển hướng checkout mượt mà.', icon: <ShoppingCart />, color: 'text-blue-400' },
    { id: 7, title: 'MULTI-CHANNEL', desc: 'Quản lý nhiều kênh từ một trung tâm. Phát luồng livestream đa nền tảng tối ưu.', icon: <Share2 />, color: 'text-indigo-400' },
    { id: 8, title: 'ANALYTICS', desc: 'Dashboard đo lường tương tác, số đơn hàng, doanh thu và thời gian xem theo thời gian thực.', icon: <BarChart2 />, color: 'text-pink-400' },
  ];

  return (
    <section className="py-24 px-4 bg-[#0B1020] relative z-10 border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <RevealOnScroll>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 rounded-full inline-block mb-4 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
              MỘT NỀN TẢNG — MỘT HỆ THỐNG VẬN HÀNH
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider mb-6">
              AVA LIVE BIẾN LIVESTREAM THÀNH <br className="hidden md:block"/> MỘT CỖ MÁY CÓ THỂ LẬP TRÌNH
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Không chỉ tạo một AI Avatar. AVA LIVE kết nối toàn bộ chuỗi vận hành livestream: nhân vật → giọng nói → bộ não AI → sự kiện → nội dung → sản phẩm → tương tác → dữ liệu → tối ưu.
            </p>
          </RevealOnScroll>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((mod, index) => (
            <RevealOnScroll key={mod.id} className="h-full">
              <div className="bg-[#111827] hover:bg-[#172033] border border-white/5 hover:border-white/20 rounded-[20px] p-6 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full pointer-events-none"></div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform ${mod.color}`}>
                    {React.cloneElement(mod.icon, { className: 'w-5 h-5' })}
                  </div>
                  <h3 className="text-sm font-black text-white tracking-widest uppercase">{mod.title}</h3>
                </div>
                
                <p className="text-gray-400 text-xs leading-relaxed mb-4 flex-1">{mod.desc}</p>
                
                <div className="mt-auto pt-4 border-t border-white/5">
                  <button className="text-[10px] font-bold text-gray-500 group-hover:text-white uppercase flex items-center gap-1 transition-colors">
                    KHÁM PHÁ <ArrowRight className="w-3 h-3" />
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
