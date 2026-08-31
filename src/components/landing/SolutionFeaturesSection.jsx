import React from 'react';
import RevealOnScroll from './RevealOnScroll';
import { UserSquare2, Mic, Brain, Zap, FileText, ShoppingCart, Share2, BarChart2, ArrowRight } from 'lucide-react';

export default function SolutionFeaturesSection() {
  const modules = [
    { id: 1, title: 'AI IDOL', desc: 'Tạo nhân vật AI mang bản sắc riêng của thương hiệu. Ngoại hình, phong cách và biểu cảm đa dạng.', icon: <UserSquare2 />, color: 'text-violet-400 border-violet-500/20 bg-violet-500/10' },
    { id: 2, title: 'AI VOICE', desc: 'Giọng nói có ngữ cảm và đúng tone thương hiệu. Tuỳ chỉnh cảm xúc, tốc độ và ngôn ngữ.', icon: <Mic />, color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10' },
    { id: 3, title: 'AI BRAIN', desc: 'Bộ não xử lý bình luận, tín hiệu mua hàng, kịch bản, và tự động phản hồi logic thời gian thực.', icon: <Brain />, color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' },
    { id: 4, title: 'EVENT ENGINE', desc: 'Biến mọi tương tác (Comment, Like, Gift, Follow) thành một sự kiện kích hoạt hành động.', icon: <Zap />, color: 'text-amber-400 border-amber-500/20 bg-amber-500/10' },
    { id: 5, title: 'SCRIPT & CONTENT', desc: 'Hệ thống quản lý kịch bản động, template cho chiến dịch, và kịch bản bán hàng linh hoạt.', icon: <FileText />, color: 'text-rose-400 border-rose-500/20 bg-rose-500/10' },
    { id: 6, title: 'COMMERCE', desc: 'Xây dựng workflow chốt đơn tự động, gửi mã giảm giá và chuyển hướng checkout mượt mà.', icon: <ShoppingCart />, color: 'text-blue-400 border-blue-500/20 bg-blue-500/10' },
    { id: 7, title: 'MULTI-CHANNEL', desc: 'Quản lý nhiều kênh từ một trung tâm. Phát luồng livestream đa nền tảng tối ưu.', icon: <Share2 />, color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10' },
    { id: 8, title: 'ANALYTICS', desc: 'Dashboard đo lường tương tác, số đơn hàng, doanh thu và thời gian xem theo thời gian thực.', icon: <BarChart2 />, color: 'text-pink-400 border-pink-500/20 bg-pink-500/10' },
  ];

  return (
    <section className="py-32 px-4 bg-[#05050A] relative z-10 border-t border-white/5 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 blur-[150px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <RevealOnScroll>
            <span className="text-[10px] font-extrabold text-indigo-300 uppercase tracking-[0.2em] border border-indigo-500/20 bg-indigo-500/10 backdrop-blur-md px-5 py-2 rounded-full inline-block mb-6 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              MỘT NỀN TẢNG — MỘT HỆ THỐNG VẬN HÀNH
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight mb-6 leading-tight drop-shadow-sm">
              AVA LIVE BIẾN LIVESTREAM THÀNH <br className="hidden md:block"/> MỘT CỖ MÁY LẬP TRÌNH ĐƯỢC
            </h2>
            <p className="text-gray-400/90 text-[15px] md:text-[17px] leading-relaxed font-light">
              Không chỉ tạo một AI Avatar. AVA LIVE kết nối toàn bộ chuỗi vận hành livestream: nhân vật → giọng nói → bộ não AI → sự kiện → nội dung → sản phẩm → tương tác → dữ liệu → tối ưu.
            </p>
          </RevealOnScroll>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((mod, index) => (
            <RevealOnScroll key={mod.id} className="h-full">
              <div className="bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.04] border border-white/[0.05] hover:border-white/20 rounded-[24px] p-8 transition-all duration-500 group hover:shadow-[0_10px_40px_rgba(0,0,0,0.2)] h-full flex flex-col relative overflow-hidden hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/[0.03] to-transparent rounded-bl-full pointer-events-none group-hover:from-white/[0.08] transition-colors duration-500"></div>
                
                <div className="flex items-center gap-5 mb-6">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ${mod.color}`}>
                    {React.cloneElement(mod.icon, { className: 'w-5 h-5' })}
                  </div>
                  <h3 className="text-[13px] font-black text-white/90 tracking-widest uppercase">{mod.title}</h3>
                </div>
                
                <p className="text-gray-400/80 text-[14px] leading-relaxed mb-6 flex-1 font-light">{mod.desc}</p>
                
                <div className="mt-auto pt-5 border-t border-white/5 relative">
                  <div className="absolute top-0 left-0 w-0 h-[1px] bg-gradient-to-r from-indigo-500 to-transparent group-hover:w-full transition-all duration-700"></div>
                  <button className="text-[10px] font-extrabold text-gray-500 group-hover:text-indigo-400 uppercase tracking-widest flex items-center gap-2 transition-colors duration-300">
                    KHÁM PHÁ <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
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
