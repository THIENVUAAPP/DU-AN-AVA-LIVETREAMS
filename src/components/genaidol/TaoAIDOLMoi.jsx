import React, { useState } from 'react';
import { ChevronRight, Music, Play, Plus, UploadCloud, Sparkles, Image as ImageIcon, Check } from 'lucide-react';

export default function TaoAIDOLMoi() {
  const [activeStep, setActiveStep] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [speed, setSpeed] = useState(1.0);

  const STYLES = [
    { id: 1, title: 'MC đứng toàn thân', desc: 'Dáng tự tin, nhìn thẳng camera, phù hợp livestream và giới thiệu.', image: 'https://images.unsplash.com/photo-1616091093714-c64882e9ab55?w=100' },
    { id: 2, title: 'Tư vấn viên đứng', desc: 'Tư thế thân thiện, rõ tay và khuôn mặt để dễ tạo chuyển động.', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100' },
    { id: 3, title: 'Ngồi bàn livestream', desc: 'Khung nửa người tại bàn, sẵn sàng cho đối thoại và chốt đơn.', image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=100' },
    { id: 4, title: 'Ngồi sau bàn có điện thoại', desc: 'Tư thế ngồi sau bàn, điện thoại hiện rõ trên mặt bàn, phù hợp tư vấn và bán hàng.', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 pb-24 text-white">
      
      {/* Header & Stepper */}
      <div className="mb-4">
         <span className="inline-block px-3 py-1 bg-[#00FF66]/20 text-[#00FF66] rounded-full text-[10px] font-bold mb-4 border border-[#00FF66]/40 shadow-glow-green">
            TẠO AIDOL MỚI
         </span>
         <div className="flex justify-between items-end mb-6">
            <div>
               <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Tạo nhân vật, gọn trong 3 bước</h1>
               <p className="text-sm text-gray-400 font-medium">Chọn AVT và giọng mặc định, tạo các nhóm chuyển động, rồi đưa AIDOL vào thư viện của bạn.</p>
            </div>
            <button className="text-sm font-bold text-[#00FF66] hover:text-[#00CC52] shadow-glow-green/20">Thoát và quay lại sau</button>
         </div>

         <div className="flex bg-[#121216]/80 backdrop-blur-md rounded-xl border border-white/10 p-2 shadow-lg gap-2">
            <button className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-lg text-sm font-bold transition-all ${activeStep === 1 ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/30 shadow-glow-green' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${activeStep === 1 ? 'bg-[#00FF66] text-black' : 'bg-white/5 text-gray-500 border border-white/10'}`}>1</div>
              Nhân vật
            </button>
            <button className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-lg text-sm font-bold transition-all ${activeStep === 2 ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/30 shadow-glow-green' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${activeStep === 2 ? 'bg-[#00FF66] text-black' : 'bg-white/5 text-gray-500 border border-white/10'}`}>2</div>
              Nhóm chuyển động
            </button>
            <button className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-lg text-sm font-bold transition-all ${activeStep === 3 ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/30 shadow-glow-green' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${activeStep === 3 ? 'bg-[#00FF66] text-black' : 'bg-white/5 text-gray-500 border border-white/10'}`}>3</div>
              Hoàn tất
            </button>
         </div>
      </div>

      <p className="text-sm font-bold text-gray-300">Bước 1: Tải AVT và chọn giọng mặc định. Đây là thiết lập nhân vật, chưa tạo TTS.</p>

      {/* Login Warning */}
      {!isLoggedIn && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 flex items-center justify-between shadow-glow-red">
           <div>
              <h3 className="text-red-400 font-bold mb-1">Cần đăng nhập để tạo job</h3>
              <p className="text-[11px] text-red-500/80 font-medium">Đăng nhập tài khoản KOL LIVE để lưu AIDOL, tạo job và trừ KOL Coin.</p>
           </div>
           <button className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold shadow-glow-red transition-colors">
              Đăng nhập ngay
           </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
         {/* Left Column */}
         <div className="flex-1 flex flex-col gap-6">
            
            {/* Settings Card */}
            <div className="bg-[#121216]/80 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg">
               <span className="text-[10px] font-black text-[#00FF66] uppercase tracking-widest mb-2 block">BƯỚC 1 • AVATAR & GIỌNG</span>
               <h2 className="text-2xl font-black text-white mb-2">Chọn 1 ảnh làm avatar của AIDOL</h2>
               <p className="text-[11px] text-gray-400 mb-6 font-medium max-w-sm">Tải ảnh vào, hoặc tạo nhiều phương án bằng AI. Chỉ khi bạn chọn một ảnh, ảnh đó mới trở thành nhân vật AIDOL của bạn.</p>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-2">Tên AIDOL</label>
                    <input type="text" defaultValue="AIDOL của tôi" className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-sm font-bold text-white focus:border-[#00FF66] outline-none shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-2">Giọng mặc định</label>
                    <div className="flex gap-2">
                       <button className="flex-1 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center gap-3 group hover:border-purple-500 transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/40 transition-colors">
                            <Music className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
                          </div>
                          <div className="text-left flex-1">
                             <div className="text-[9px] font-bold text-purple-400 uppercase">Thư viện giọng</div>
                             <div className="text-xs font-black text-white truncate">HN - Ngọc Huyền</div>
                             <div className="text-[9px] text-gray-500">Vbee • 80 Coin...</div>
                          </div>
                       </button>
                       <button className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 shadow-sm flex-shrink-0 hover:bg-white/10 hover:border-purple-500/50 transition-all">
                          <Play className="w-5 h-5" />
                       </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-2">Tốc độ nói mặc định</label>
                    <div className="bg-black/40 border border-white/10 rounded-xl p-3 shadow-sm">
                       <div className="flex justify-between items-center mb-2">
                         <span className="text-xs font-bold text-white">Tốc độ: {speed.toFixed(2)}x</span>
                       </div>
                       <input 
                         type="range" min="0.5" max="2.0" step="0.1" value={speed} 
                         onChange={(e) => setSpeed(parseFloat(e.target.value))}
                         className="w-full accent-[#00FF66] mb-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer" 
                       />
                       <div className="flex justify-between text-[9px] text-gray-500 font-bold">
                         <span>Chậm hơn</span>
                         <span>Nhanh hơn</span>
                       </div>
                    </div>
                    <p className="text-[9px] text-gray-500 mt-2 font-medium">Áp dụng mặc định khi tạo giọng nói hoặc nhép môi cho nhân vật này; chỉ lưu cấu hình, chưa tạo job.</p>
                  </div>
               </div>
            </div>

            {/* Avatar Library Card */}
            <div className="bg-[#121216]/80 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg flex flex-col min-h-[500px]">
               <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-[10px] font-black text-[#00FF66] uppercase tracking-widest block mb-1">THƯ VIỆN ẢNH AVATAR</span>
                    <h3 className="font-bold text-white text-sm">Ảnh đã thêm và lịch sử tạo ảnh</h3>
                    <p className="text-[10px] text-gray-400">Chọn một ảnh DONE để dùng làm avatar. Job đang tạo sẽ tự cập nhật tại đây.</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/5 rounded-lg shadow-sm hover:border-[#00FF66] hover:text-[#00FF66] transition-colors">
                     <div className="w-6 h-6 rounded bg-[#00FF66]/20 text-[#00FF66] flex items-center justify-center border border-[#00FF66]/50"><Plus className="w-4 h-4"/></div>
                     <div className="text-left">
                       <div className="text-[10px] font-bold">Thêm ảnh</div>
                       <div className="text-[8px] text-gray-500">Kéo thả hoặc chọn từ máy</div>
                     </div>
                  </button>
               </div>

               <div className="flex-1 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center bg-black/40 mb-6 relative hover:border-[#00FF66]/30 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-[#00FF66]/10 flex items-center justify-center text-[#00FF66] mb-3 shadow-glow-green border border-[#00FF66]/30">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">Chưa có ảnh avatar nào</h4>
                  <p className="text-[11px] text-gray-500 max-w-xs text-center font-medium">
                    Kéo ảnh từ máy vào đây, hoặc nhập mô tả ở thanh nổi phía dưới để tạo nhiều phương án bằng AI.
                  </p>
               </div>

               {/* Bottom Selection Bar */}
               <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                  <div>
                    <span className="text-[10px] font-black text-[#00FF66] uppercase tracking-widest block mb-1">AVATAR ĐANG CHỌN</span>
                    <h4 className="font-bold text-gray-300 text-sm">Chưa chọn ảnh nào</h4>
                    <p className="text-[10px] text-gray-500">Tạo ảnh hoặc thêm ảnh rồi bấm chọn tại thư viện ở trên.</p>
                  </div>
                  <button className="px-6 py-2.5 bg-white/5 text-gray-500 font-bold border border-white/10 rounded-xl text-sm cursor-not-allowed">
                     Dùng ảnh này làm avatar
                  </button>
               </div>
            </div>

            {/* Floating Prompt Bar */}
            <div className="bg-[#0B0E14] rounded-full p-2 pl-6 flex items-center justify-between shadow-2xl shadow-[#00FF66]/10 border border-white/10 mt-2">
               <input type="text" placeholder="Mô tả ảnh avatar bạn muốn tạo..." className="bg-transparent border-none outline-none text-sm text-white flex-1 placeholder:text-gray-500" />
               <div className="flex items-center gap-2">
                 <button className="p-2 text-gray-400 hover:text-[#00FF66]"><Plus className="w-5 h-5"/></button>
                 <button className="p-2 text-gray-400 hover:text-[#00FF66]"><ImageIcon className="w-5 h-5"/></button>
                 <button className="w-10 h-10 rounded-full bg-[#00FF66] hover:bg-[#00CC52] flex items-center justify-center text-black shadow-glow-green transition-colors">
                   <ChevronRight className="w-5 h-5" />
                 </button>
               </div>
            </div>
         </div>

         {/* Right Column - Templates */}
         <div className="w-full lg:w-[350px]">
            <div className="bg-[#121216]/80 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg h-full">
               <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">PHONG CÁCH MẪU</span>
               <h3 className="font-black text-white text-lg mb-1">Chọn một hướng tạo</h3>
               <p className="text-[11px] text-gray-400 font-medium mb-6">Mỗi mẫu chỉ thêm chỉ dẫn nội bộ để bảo vệ prompt. Phần mô tả của bạn vẫn hiện rõ và có thể tự sửa.</p>

               <div className="space-y-4">
                 {STYLES.map((style) => (
                    <div key={style.id} className="bg-black/40 border border-white/10 rounded-xl p-3 flex gap-4 hover:border-[#00FF66]/50 hover:bg-white/5 transition-all cursor-pointer group">
                       <div className="w-20 h-28 rounded-lg overflow-hidden relative flex-shrink-0 border border-white/5">
                          <img src={style.image} alt={style.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute top-1 left-1 bg-black/80 text-white text-[8px] font-bold px-1.5 py-0.5 rounded border border-white/10">0{style.id}</div>
                          <div className="absolute bottom-0 inset-x-0 bg-[#00FF66]/80 text-black text-[8px] font-black text-center py-0.5 shadow-glow-green backdrop-blur-sm">NỀN XANH LÁ</div>
                       </div>
                       <div className="flex flex-col justify-center">
                          <h4 className="font-bold text-gray-200 text-sm mb-1 group-hover:text-[#00FF66] transition-colors">{style.title}</h4>
                          <p className="text-[10px] text-gray-500 leading-relaxed mb-2">{style.desc}</p>
                          <div className="text-[10px] font-bold text-[#00FF66] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_5px_rgba(0,255,102,0.5)]">
                             Dùng kiểu này <ChevronRight className="w-3 h-3" />
                          </div>
                       </div>
                    </div>
                 ))}
               </div>
               
               <p className="text-[9px] text-gray-600 mt-6 text-center font-medium">Ảnh mẫu đầu ra dùng phông xanh lá để bạn dễ ghép nền về sau.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
