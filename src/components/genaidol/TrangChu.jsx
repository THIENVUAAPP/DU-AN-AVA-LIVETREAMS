import React from 'react';
import { Play, UserSquare2, Video, MonitorPlay, Sparkles, Send, Activity, Brain, Image as ImageIcon, Mic } from 'lucide-react';

export default function TrangChu() {
  return (
    <div className="w-full flex flex-col gap-12 pb-24">
      
      {/* 1. HERO SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-blue-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-8 lg:p-12">
        {/* Network Pattern */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#93C5FD 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
           <div className="flex-1">
             <div className="inline-block px-3 py-1 bg-white text-blue-700 rounded-full text-[10px] font-bold mb-6 border border-blue-200 uppercase tracking-widest shadow-sm">
               KOL LIVE Studio
             </div>
             <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-slate-800 mb-6 tracking-tight leading-tight">
               Nền tảng xây dựng <br/><span className="text-blue-600">nhân vật AI</span> cho thương hiệu
             </h1>
             <p className="text-slate-600 font-medium mb-8 max-w-lg leading-relaxed">
               Tạo AIDOL một lần, lưu ngoại hình, nhiều chuyển động, giọng nói và trợ lý tư vấn video để bán hàng, review và chăm sóc khách hàng.
             </p>
             <div className="flex flex-wrap gap-3">
               <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-600/20">
                 Đăng nhập Studio
               </button>
               <button className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold transition-all shadow-sm">
                 Đăng ký
               </button>
               <button className="px-6 py-3 bg-transparent hover:bg-blue-50 text-blue-600 rounded-xl font-bold transition-all">
                 Xem demo
               </button>
             </div>
           </div>

           <div className="flex-1 w-full max-w-2xl flex flex-col sm:flex-row gap-4">
              {/* Image Preview Card */}
              <div className="flex-1 bg-emerald-500 rounded-2xl p-2 relative overflow-hidden shadow-xl shadow-emerald-500/20 aspect-[3/4] sm:aspect-auto">
                 <img src="https://images.unsplash.com/photo-1616091093714-c64882e9ab55?auto=format&fit=crop&w=500&q=80" alt="AIDOL Model" className="w-full h-full object-cover rounded-xl" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <div className="flex items-center justify-between w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3">
                       <div>
                         <div className="flex items-center gap-1.5 mb-0.5">
                           <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                           <div className="text-[10px] font-bold text-white uppercase tracking-widest">KOL LIVE Model</div>
                         </div>
                       </div>
                       <div className="text-[10px] bg-white text-slate-800 px-2 py-1 rounded-md font-bold">
                         Chủ đề: greeting
                       </div>
                    </div>
                 </div>
              </div>

              {/* Chat Interface Card */}
              <div className="flex-[1.2] bg-white rounded-2xl border border-slate-200 shadow-xl flex flex-col overflow-hidden">
                 <div className="p-4 bg-slate-50 border-b border-slate-100 flex-1">
                    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm inline-block max-w-[85%] mb-4">
                      <p className="text-xs font-bold text-slate-700">Phần mềm tạo video AI giá bao nhiêu?</p>
                    </div>
                    <div className="bg-blue-600 rounded-xl p-3 shadow-sm inline-block max-w-[85%] float-right text-white">
                      <p className="text-xs font-bold">Em mở đúng model tư vấn giá ngay đây.</p>
                    </div>
                 </div>
                 <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
                    <input type="text" placeholder="Hỏi về giá, demo, tạo video, nhép miệng..." className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
                    <button className="bg-slate-800 hover:bg-slate-900 text-white rounded-lg px-4 py-2 flex items-center justify-center font-bold text-xs transition-colors">
                      Gửi
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* 2. REALTIME AI CORE SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 lg:p-12 relative overflow-hidden">
         {/* Background connecting lines */}
         <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <path d="M 100 200 L 500 200" stroke="#2563EB" strokeWidth="4" fill="none" />
              <path d="M 900 200 L 500 200" stroke="#2563EB" strokeWidth="4" fill="none" />
            </svg>
         </div>

         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 relative z-10">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">KOL LIVE Realtime AI Core</h2>
              <p className="text-sm text-slate-500 font-medium">AI Core trung tâm điều phối tiến trình, tín hiệu truyền liên tục qua từng nhánh xử lý.</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
               <span className="text-xs font-bold text-slate-600">Tải hệ thống</span>
               <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                 <div className="h-full bg-gradient-to-r from-blue-400 to-emerald-400 w-[75%]"></div>
               </div>
               <span className="text-xs font-black text-slate-800">75%</span>
            </div>
         </div>

         <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left nodes */}
            <div className="flex flex-col gap-6 w-full lg:w-64">
               <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-4">
                 <div className="font-bold text-slate-800 text-sm mb-1">Tạo ảnh AIDOL</div>
                 <div className="text-[10px] text-slate-500 mb-3">Đang tạo ảnh AIDOL #708</div>
                 <div className="h-1 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[40%]"></div></div>
               </div>
               <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 ml-8">
                 <div className="font-bold text-slate-800 text-sm mb-1">Hồ sơ AIDOL</div>
                 <div className="text-[10px] text-slate-500 mb-3">Đang kiểm tra chất lượng #750</div>
                 <div className="h-1 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-amber-500 w-[80%]"></div></div>
               </div>
               <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-4">
                 <div className="font-bold text-slate-800 text-sm mb-1">Giọng nói AIDOL</div>
                 <div className="text-[10px] text-slate-500 mb-3">Đang xử lý chuyển động #715</div>
                 <div className="h-1 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-purple-500 w-[60%]"></div></div>
               </div>
            </div>

            {/* Center Core */}
            <div className="flex flex-col items-center">
               <div className="flex gap-4 mb-8">
                 <div className="text-center"><div className="text-2xl font-black text-blue-600">39</div><div className="text-[10px] font-bold text-slate-400 uppercase">Job chạy</div></div>
                 <div className="text-center"><div className="text-2xl font-black text-blue-600">697</div><div className="text-[10px] font-bold text-slate-400 uppercase">Hoàn tất</div></div>
                 <div className="text-center"><div className="text-2xl font-black text-blue-600">13</div><div className="text-[10px] font-bold text-slate-400 uppercase">Đang chờ</div></div>
               </div>
               <div className="relative">
                 <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse"></div>
                 <div className="bg-white border-2 border-blue-100 p-8 rounded-2xl shadow-xl shadow-blue-900/5 relative z-10 text-center w-56">
                    <Activity className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                    <h3 className="text-lg font-black text-blue-600">KOL LIVE</h3>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Realtime Core</div>
                 </div>
               </div>
            </div>

            {/* Right nodes */}
            <div className="flex flex-col gap-6 w-full lg:w-64">
               <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-4">
                 <div className="font-bold text-slate-800 text-sm mb-1">Video chuyển động</div>
                 <div className="text-[10px] text-slate-500 mb-3">Đang đồng bộ lipsync #729</div>
                 <div className="h-1 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-[30%]"></div></div>
               </div>
               <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 mr-8">
                 <div className="font-bold text-slate-800 text-sm mb-1">Render bán hàng</div>
                 <div className="text-[10px] text-slate-500 mb-3">Đang bàn giao kết quả #757</div>
                 <div className="h-1 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[90%]"></div></div>
               </div>
               <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-4">
                 <div className="font-bold text-slate-800 text-sm mb-1">AIDOL Lipsync</div>
                 <div className="text-[10px] text-slate-500 mb-3">Đang lưu hồ sơ #736</div>
                 <div className="h-1 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-cyan-500 w-[100%]"></div></div>
               </div>
            </div>
         </div>
      </div>

      {/* 3. MULTI-CONTENT SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 lg:p-16 text-center">
         <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold mb-4 border border-blue-100 uppercase tracking-widest">
            HÀNH TRÌNH PHÁT TRIỂN AIDOL
         </span>
         <h2 className="text-3xl lg:text-4xl font-black text-slate-800 mb-4 tracking-tight">
            Từ một hình ảnh <span className="text-blue-500">•</span> Vạn nội dung AI
         </h2>
         <p className="text-sm text-slate-500 font-medium max-w-2xl mx-auto mb-16">
            Chỉ cần một hình ảnh AIDOL, bạn có thể tạo ra nhiều loại nội dung khác nhau. Một nhân vật — nhiều định dạng — sử dụng lâu dài.
         </p>

         <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 relative">
            
            {/* Origin Card */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xl relative z-10 w-64 flex-shrink-0">
               <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
                 Gốc
               </div>
               <div className="aspect-[3/4] rounded-2xl bg-emerald-100 overflow-hidden mb-4 border border-slate-100">
                  <img src="https://images.unsplash.com/photo-1616091093714-c64882e9ab55?auto=format&fit=crop&w=400&q=80" alt="Gốc" className="w-full h-full object-cover" />
               </div>
               <h3 className="font-black text-slate-800 text-lg mb-1">ẢNH AIDOL</h3>
               <p className="text-[10px] text-slate-500 mb-4">Tạo hoặc tải lên hình ảnh nhân vật gốc.</p>
               <button className="w-full py-2 bg-blue-50 text-blue-600 font-bold text-xs rounded-xl hover:bg-blue-100 transition-colors">Bắt đầu</button>
            </div>

            {/* Tree lines (CSS generated for simplicity) */}
            <div className="hidden lg:block absolute left-64 right-[400px] top-1/2 -translate-y-1/2 h-full pointer-events-none z-0">
               {/* Just a visual representation of connections */}
            </div>

            {/* Destination Cards */}
            <div className="flex flex-col gap-6 relative z-10 w-full max-w-md text-left">
               {[
                 { id: '01', title: 'Video TVC', desc: 'Tạo video quảng cáo thương hiệu và sản phẩm chuyên nghiệp.', color: 'bg-blue-500', icon: Video },
                 { id: '02', title: 'Video Idol', desc: 'Xây dựng hình tượng nhân vật đại diện thương hiệu với phong cách riêng.', color: 'bg-purple-500', icon: UserSquare2 },
                 { id: '03', title: 'Video bán hàng', desc: 'Giới thiệu sản phẩm, nêu lợi ích và hỗ trợ khách hàng chốt đơn.', color: 'bg-emerald-500', icon: Play },
                 { id: '04', title: 'Video nhép miệng', desc: 'Nhập kịch bản, chọn giọng và để AIDOL nói theo nội dung mới.', color: 'bg-amber-500', icon: Mic },
                 { id: '05', title: 'Livestream AI', desc: 'Đưa AIDOL vào livestream để giới thiệu, tư vấn và tương tác trực tiếp.', color: 'bg-rose-500', icon: MonitorPlay },
               ].map((item, i) => (
                 <div key={item.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex gap-4 items-center shadow-sm hover:shadow-md transition-shadow group relative">
                    {/* Connecting dot */}
                    <div className={`absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-4 border-white ${item.color} shadow-sm z-20`}></div>
                    
                    <div className="flex-1 pl-4">
                      <div className={`text-xl font-black ${item.color.replace('bg-', 'text-')} mb-1`}>{item.id} <span className="text-slate-800 ml-1">{item.title}</span></div>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="w-24 h-16 bg-slate-100 rounded-xl overflow-hidden relative flex-shrink-0">
                      <img src={`https://images.unsplash.com/photo-1616091093714-c64882e9ab55?auto=format&fit=crop&w=100&q=80&sig=${i}`} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
                          <Play className={`w-3 h-3 ${item.color.replace('bg-', 'text-')}`} fill="currentColor" />
                        </div>
                      </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
         
         {/* Footer Action */}
         <div className="mt-16 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between text-left gap-6">
            <div className="flex gap-8">
               <div>
                 <div className="font-bold text-slate-800 text-sm mb-1">Tạo một lần</div>
                 <div className="text-[10px] text-slate-500">Tạo AIDOL của bạn chỉ một lần và lưu trữ an toàn.</div>
               </div>
               <div>
                 <div className="font-bold text-slate-800 text-sm mb-1">Lưu trong tài khoản</div>
                 <div className="text-[10px] text-slate-500">Quản lý AIDOL và toàn bộ tài nguyên trong một tài khoản.</div>
               </div>
               <div>
                 <div className="font-bold text-slate-800 text-sm mb-1">Dùng lại không giới hạn</div>
                 <div className="text-[10px] text-slate-500">Sử dụng AIDOL cho nhiều nội dung và nhiều chiến dịch khác nhau.</div>
               </div>
            </div>
            <div className="flex flex-col items-center md:items-end">
               <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-md mb-2">
                 Bắt đầu tạo AIDOL của bạn
               </button>
               <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Dùng tài khoản KOL LIVE • Chi phí theo KOL Coin</div>
            </div>
         </div>
      </div>

    </div>
  );
}
