import React, { useState } from 'react';
import { Sparkles, Plus, Search, UserSquare2, PlayCircle, Mic, ChevronDown, ChevronRight, Music, Play, Image as ImageIcon, Check } from 'lucide-react';

export default function ThuVienAIDOL() {
  const [viewMode, setViewMode] = useState('library'); // 'library' | 'create'
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for Create Mode
  const [activeStep, setActiveStep] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [speed, setSpeed] = useState(1.0);

  const STYLES = [
    { id: 1, title: 'MC đứng toàn thân', desc: 'Dáng tự tin, nhìn thẳng camera, phù hợp livestream và giới thiệu.', image: 'https://images.unsplash.com/photo-1616091093714-c64882e9ab55?w=100' },
    { id: 2, title: 'Tư vấn viên đứng', desc: 'Tư thế thân thiện, rõ tay và khuôn mặt để dễ tạo chuyển động.', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100' },
    { id: 3, title: 'Ngồi bàn livestream', desc: 'Khung nửa người tại bàn, sẵn sàng cho đối thoại và chốt đơn.', image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=100' },
    { id: 4, title: 'Ngồi sau bàn có điện thoại', desc: 'Tư thế ngồi sau bàn, điện thoại hiện rõ trên mặt bàn, phù hợp tư vấn và bán hàng.', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 text-white pb-24">
      
      {/* Top Banner & Mode Switcher */}
      <div className="bg-[#121216]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-black/40 border border-[#00FF66]/30 shadow-glow-green flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-8 h-8 text-[#00FF66]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse"></span>
              <span className="text-[10px] font-black text-[#00FF66] uppercase tracking-widest">AIDOL HUB</span>
            </div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">AIDOL của tôi</h1>
            <p className="text-sm text-gray-400 font-medium max-w-xl">
              Quản lý nhân vật, giọng mặc định và tạo mới AIDOL ảo cho các phiên Live và Video.
            </p>
          </div>
        </div>

        <div className="flex bg-black/40 p-1.5 rounded-xl border border-white/10">
           <button 
             onClick={() => setViewMode('library')}
             className={`px-6 py-3 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'library' ? 'bg-[#00FF66]/20 text-[#00FF66] shadow-glow-green border border-[#00FF66]/40' : 'text-gray-400 hover:text-white border border-transparent'}`}
           >
             <UserSquare2 className="w-4 h-4" /> Thư viện
           </button>
           <button 
             onClick={() => setViewMode('create')}
             className={`px-6 py-3 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'create' ? 'bg-[#00FF66]/20 text-[#00FF66] shadow-glow-green border border-[#00FF66]/40' : 'text-gray-400 hover:text-white border border-transparent'}`}
           >
             <Plus className="w-4 h-4" /> Tạo mới
           </button>
        </div>
      </div>

      {/* --- LIBRARY MODE --- */}
      {viewMode === 'library' && (
        <div className="flex flex-col gap-6">
          {/* Stats Banner */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#00FF66]/5 rounded-full blur-[80px] pointer-events-none"></div>
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">THỐNG KÊ NETWORK</span>
                </div>
                <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Dung lượng thư viện: <span className="text-[#00FF66]">0</span> / 5</h2>
                <p className="text-sm text-gray-400 font-medium">
                  Nhân vật, chuyển động và Live luôn liên kết cùng một hệ thống. Tối đa lưu 5 nhân vật đồng thời.
                </p>
             </div>

             <div className="flex gap-4 relative z-10">
                <div className="bg-[#121216] border border-white/10 rounded-xl p-5 shadow-sm min-w-[120px]">
                   <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nhân vật</div>
                   <div className="text-3xl font-black text-[#00FF66] mb-1">0</div>
                   <div className="text-[10px] font-bold text-gray-500">đang lưu</div>
                </div>
                <div className="bg-[#121216] border border-white/10 rounded-xl p-5 shadow-sm min-w-[120px]">
                   <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Sẵn sàng Live</div>
                   <div className="text-3xl font-black text-[#00FF66] mb-1">0</div>
                   <div className="text-[10px] font-bold text-gray-500">có video DONE</div>
                </div>
             </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-300 mb-1.5">Tìm kiếm</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Tìm theo tên..." 
                  className="w-full pl-9 pr-4 py-2 bg-black/60 border border-white/10 rounded-lg text-sm text-white focus:border-[#00FF66] outline-none transition-all shadow-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-300 mb-1.5">Trạng thái</label>
              <div className="relative">
                <select className="w-full appearance-none pl-3 pr-8 py-2 bg-black/60 border border-white/10 rounded-lg text-sm text-white focus:border-[#00FF66] outline-none transition-all shadow-sm font-bold">
                  <option>Tất cả</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-300 mb-1.5">Ngành hàng</label>
              <div className="relative">
                <select className="w-full appearance-none pl-3 pr-8 py-2 bg-black/60 border border-white/10 rounded-lg text-sm text-white focus:border-[#00FF66] outline-none transition-all shadow-sm font-bold">
                  <option>Tất cả ngành hàng</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-300 mb-1.5">Sắp xếp</label>
              <div className="relative">
                <select className="w-full appearance-none pl-3 pr-8 py-2 bg-black/60 border border-white/10 rounded-lg text-sm text-white focus:border-[#00FF66] outline-none transition-all shadow-sm font-bold">
                  <option>Mới nhất</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Empty State */}
          <div className="py-24 flex flex-col items-center justify-center text-center bg-[#121216]/60 rounded-2xl border border-white/10">
            <h3 className="text-xl font-black text-white mb-3">Chưa có AIDOL nào</h3>
            <p className="text-sm text-gray-400 font-medium max-w-sm mb-6">
              Tạo một hồ sơ AIDOL (từ Ảnh tĩnh hoặc Video mẫu) trước, rồi lưu để dùng lại cho mọi chức năng Lipsync và Livestream.
            </p>
            <button 
              onClick={() => setViewMode('create')}
              className="px-6 py-3 bg-[#00FF66] hover:bg-[#00CC52] text-black font-bold rounded-xl transition-colors flex items-center gap-2 shadow-glow-green"
            >
              <Plus className="w-5 h-5" /> Tạo AIDOL Mới Ngay
            </button>
          </div>
        </div>
      )}

      {/* --- CREATE MODE --- */}
      {viewMode === 'create' && (
        <div className="flex flex-col gap-6">
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

          <div className="flex flex-col lg:flex-row gap-6">
             <div className="flex-1 flex flex-col gap-6">
                
                {/* Settings Card */}
                <div className="bg-[#121216]/80 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg">
                   <span className="text-[10px] font-black text-[#00FF66] uppercase tracking-widest mb-2 block">BƯỚC 1 • AVATAR & GIỌNG</span>
                   <h2 className="text-2xl font-black text-white mb-2">Tải lên Ảnh tĩnh hoặc Video mẫu của AIDOL</h2>
                   <p className="text-[11px] text-gray-400 mb-6 font-medium max-w-md">
                      Bạn có thể dùng <strong>Ảnh tĩnh</strong> (Hệ thống tự tạo chuyển động mượt mà) hoặc <strong>Video mẫu</strong> (Có sẵn cử chỉ tay chân y như người thật). Chỉ khi bạn lưu, hồ sơ này mới được nạp vào Cache Live.
                   </p>
                   
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
                                 <div className="text-[9px] text-gray-500">Vbee • 80 Coin</div>
                              </div>
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
                      </div>
                   </div>
                </div>

                {/* Avatar Library Card */}
                <div className="bg-[#121216]/80 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg flex flex-col min-h-[400px]">
                   <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-[10px] font-black text-[#00FF66] uppercase tracking-widest block mb-1">THƯ VIỆN ẢNH / VIDEO</span>
                        <h3 className="font-bold text-white text-sm">Media đã thêm và lịch sử tạo</h3>
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/5 rounded-lg shadow-sm hover:border-[#00FF66] hover:text-[#00FF66] transition-colors">
                         <div className="w-6 h-6 rounded bg-[#00FF66]/20 text-[#00FF66] flex items-center justify-center border border-[#00FF66]/50"><Plus className="w-4 h-4"/></div>
                         <div className="text-left">
                           <div className="text-[10px] font-bold">Thêm File (Media)</div>
                         </div>
                      </button>
                   </div>

                   <div className="flex-1 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center bg-black/40 mb-6 relative hover:border-[#00FF66]/30 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-[#00FF66]/10 flex items-center justify-center text-[#00FF66] mb-3 shadow-glow-green border border-[#00FF66]/30">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-white text-sm mb-1">Chưa có File (Ảnh/Video) nào</h4>
                      <p className="text-[11px] text-gray-500 max-w-xs text-center font-medium">
                        Kéo thả ảnh hoặc video vào đây, hoặc dùng AI để gen ra ảnh.
                      </p>
                   </div>

                   <div className="bg-[#0B0E14] rounded-full p-2 pl-6 flex items-center justify-between shadow-2xl shadow-[#00FF66]/10 border border-white/10">
                      <input type="text" placeholder="Mô tả ảnh avatar bạn muốn tạo..." className="bg-transparent border-none outline-none text-sm text-white flex-1 placeholder:text-gray-500" />
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-[#00FF66]"><ImageIcon className="w-5 h-5"/></button>
                        <button className="w-10 h-10 rounded-full bg-[#00FF66] hover:bg-[#00CC52] flex items-center justify-center text-black shadow-glow-green transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                   </div>
                </div>
             </div>

             <div className="w-full lg:w-[350px]">
                <div className="bg-[#121216]/80 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg h-full">
                   <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">PHONG CÁCH MẪU</span>
                   <h3 className="font-black text-white text-lg mb-1">Chọn một hướng tạo</h3>
                   <p className="text-[11px] text-gray-400 font-medium mb-6">Mỗi mẫu chỉ thêm chỉ dẫn nội bộ để bảo vệ prompt.</p>

                   <div className="space-y-4">
                     {STYLES.map((style) => (
                        <div key={style.id} className="bg-black/40 border border-white/10 rounded-xl p-3 flex gap-4 hover:border-[#00FF66]/50 hover:bg-white/5 transition-all cursor-pointer group">
                           <div className="w-16 h-20 rounded-lg overflow-hidden relative flex-shrink-0 border border-white/5">
                              <img src={style.image} alt={style.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                           </div>
                           <div className="flex flex-col justify-center">
                              <h4 className="font-bold text-gray-200 text-sm mb-1 group-hover:text-[#00FF66] transition-colors">{style.title}</h4>
                              <p className="text-[10px] text-gray-500 leading-relaxed mb-1 line-clamp-2">{style.desc}</p>
                           </div>
                        </div>
                     ))}
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}
