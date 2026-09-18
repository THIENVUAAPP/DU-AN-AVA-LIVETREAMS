import React, { useState } from 'react';
import { BookOpen, CheckCircle, PlayCircle, ShieldCheck, AlertCircle } from 'lucide-react';

const MENU_ITEMS = [
  'Tổng quan dự án',
  'Bảng giá',
  'Công dụng của công cụ',
  'Công dụng AIDOL Live',
  'Công dụng AIDOL AutoPin',
  'Chức năng & giao diện AIDOL Live',
  'Tạo nhân vật để livestream',
  'Hướng dẫn TikTok Live',
  'Hướng dẫn Shopee Live',
  'Hướng dẫn Facebook Live',
  'Hướng dẫn YouTube Live',
  'Concert livestream thú vị',
  'Tạo phiên live nhận quà'
];

export default function HuongDanAcademy() {
  const [activeTab, setActiveTab] = useState(7); // Default to "Hướng dẫn TikTok Live" (index 7)

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-[#121216]/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 overflow-hidden text-white">
      
      {/* Left Sidebar */}
      <div className="w-72 bg-black/60 border-r border-white/10 flex flex-col h-full">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xs font-black text-[#00FF66] uppercase tracking-widest mb-1">KOL LIVE ACADEMY</h2>
          <h1 className="text-lg font-bold text-white">Mục lục hướng dẫn</h1>
          <p className="text-[10px] text-gray-400 mt-2">
            Chọn một chương để mở nội dung. Danh mục này có thể mở rộng thêm về sau.
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {MENU_ITEMS.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === index 
                  ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/30 shadow-glow-green' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] ${
                activeTab === index ? 'bg-[#00FF66] text-black' : 'bg-white/5 text-gray-500 border border-white/10'
              }`}>
                {(index + 1).toString().padStart(2, '0')}
              </div>
              <span className="text-left leading-tight">{item}</span>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-white/10 bg-[#00FF66]/5">
           <div className="flex items-start gap-2">
              <div className="mt-0.5 w-5 h-5 rounded-full bg-[#00FF66]/20 flex items-center justify-center text-[#00FF66] flex-shrink-0 border border-[#00FF66]/30 shadow-glow-green">
                <CheckCircle className="w-3 h-3" />
              </div>
              <p className="text-[10px] font-bold text-gray-300 leading-relaxed">
                Luôn chạy thử riêng tư trước khi phát công khai.
              </p>
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative bg-transparent">
        {/* Network dots background for content area */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        <div className="relative z-10 max-w-4xl">
          <div className="mb-8 bg-blue-900/20 p-8 rounded-2xl border border-blue-500/30">
             <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 flex justify-between items-center">
               <span>PLAYBOOK NỀN TẢNG • {MENU_ITEMS[activeTab].toUpperCase()}</span>
               <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shadow-glow-blue border border-blue-500/50 text-blue-400">
                  <PlayCircle className="w-4 h-4" />
               </div>
             </div>
             <h1 className="text-3xl font-black text-white mb-3 tracking-tight">Vận hành AI livestream an toàn</h1>
             <p className="text-sm text-gray-300 leading-relaxed font-medium">
               Hệ thống hoạt động dưới dạng Web. Bạn chỉ cần dùng ứng dụng Livestream (như TikTok Studio hoặc OBS) để Capture màn hình (Window Capture) cửa sổ AI, sau đó phát lên nền tảng mà không cần cung cấp tài khoản mật khẩu cho hệ thống.
             </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
             <div className="space-y-4">
               {/* Step 1 */}
               <div className="flex gap-4 p-5 rounded-2xl border border-white/10 bg-black/40 shadow-sm hover:border-white/20 transition-colors">
                 <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs flex-shrink-0 border border-blue-500/30">1</div>
                 <div>
                   <h3 className="font-bold text-gray-200 text-sm mb-1">Thiết lập AVA Live Console</h3>
                   <p className="text-[11px] text-gray-400 leading-relaxed">Vào bảng điều khiển Live, tải video/audio lên Kho Media, nhập Kịch bản, và bấm nút <b className="text-[#00FF66]">"Bắt đầu AI Live"</b> để hệ thống AI chạy.</p>
                 </div>
               </div>
               {/* Step 2 */}
               <div className="flex gap-4 p-5 rounded-2xl border border-white/10 bg-black/40 shadow-sm hover:border-white/20 transition-colors">
                 <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs flex-shrink-0 border border-blue-500/30">2</div>
                 <div>
                   <h3 className="font-bold text-gray-200 text-sm mb-1">Mở ứng dụng Live (Studio/OBS)</h3>
                   <p className="text-[11px] text-gray-400 leading-relaxed">
                     {activeTab === 7 ? "Mở TikTok Live Studio trên máy tính." : 
                      activeTab === 8 ? "Mở OBS Studio (Thiết lập Stream Key từ Shopee Seller Center)." :
                      activeTab === 9 ? "Mở OBS Studio (Thiết lập Stream Key từ Facebook Live Producer)." :
                      activeTab === 10 ? "Mở OBS Studio (Thiết lập Stream Key từ YouTube Studio)." :
                      "Mở OBS Studio hoặc ứng dụng Live tương ứng."}
                   </p>
                 </div>
               </div>
               {/* Step 3 */}
               <div className="flex gap-4 p-5 rounded-2xl border border-white/10 bg-black/40 shadow-sm hover:border-white/20 transition-colors">
                 <div className="w-8 h-8 rounded-full bg-[#00FF66]/20 text-[#00FF66] font-bold flex items-center justify-center text-xs flex-shrink-0 border border-[#00FF66]/50 shadow-glow-green">3</div>
                 <div>
                   <h3 className="font-bold text-gray-200 text-sm mb-1">Capture Cửa Sổ & Phát</h3>
                   <p className="text-[11px] text-gray-400 leading-relaxed">Trong Studio/OBS: <b>Thêm Nguồn → Window Capture (Quay Cửa sổ) → Chọn cửa sổ AVA Live</b>. Bấm Go Live / Start Streaming để bắt đầu phát lên nền tảng.</p>
                 </div>
               </div>
             </div>

             <div className="space-y-6">
                {/* Luồng hình và âm thanh */}
                <div className="p-6 rounded-2xl border border-white/10 bg-black/60">
                   <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Luồng hình và âm thanh</h4>
                   <div className="flex items-center gap-2 mb-4">
                     <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-center text-[10px] font-bold text-[#00FF66] shadow-sm shadow-glow-green/10">AVA Live Console</div>
                     <span className="text-gray-600 text-xs">→</span>
                     <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-center text-[10px] font-bold text-gray-300 shadow-sm">{activeTab === 7 ? 'TikTok Live Studio' : 'OBS Studio'}</div>
                     <span className="text-gray-600 text-xs">→</span>
                     <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-center text-[10px] font-bold text-gray-300 shadow-sm">Nền tảng LIVE</div>
                   </div>
                   <p className="text-[10px] text-gray-500 leading-relaxed font-medium">Bạn hoàn toàn nắm quyền kiểm soát phiên live. Hệ thống chỉ đóng vai trò cung cấp màn hình AI (Video + Voice) để bạn phát lên.</p>
                </div>

                {/* Warning Alert */}
                <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3 shadow-glow-yellow">
                   <div className="mt-0.5 w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0 border border-amber-500/50">
                     <AlertCircle className="w-4 h-4" />
                   </div>
                   <div>
                     <h4 className="font-bold text-amber-400 text-xs mb-1">Nguyên tắc nội dung AI</h4>
                     <p className="text-[10px] text-amber-500/80 leading-relaxed font-medium">Không giả mạo người thật, không dùng giọng/hình ảnh khi chưa được phép và luôn thực hiện yêu cầu công khai hoặc gắn nhãn nội dung AI của TikTok khi áp dụng.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
