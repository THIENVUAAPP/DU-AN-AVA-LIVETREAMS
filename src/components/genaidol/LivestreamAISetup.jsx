import React, { useState } from 'react';
import { Download, MonitorPlay, ArrowRight, UserSquare2, BrainCircuit, MessageSquareText, PackagePlus, Plus } from 'lucide-react';

export default function LivestreamAISetup() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      
      {/* Hero Banner */}
      <div className="bg-[#111827] rounded-2xl p-8 flex flex-col md:flex-row gap-8 justify-between relative overflow-hidden border border-slate-800 shadow-xl">
         {/* Abstract background shapes */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
         
         <div className="flex-1 relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">LIVE PRODUCTION HUB</span>
            </div>
            <div className="inline-block px-3 py-1 bg-white/10 text-white rounded-full text-[10px] font-bold mb-3 border border-white/20">
              Live Setup
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
              Setup phiên <span className="text-cyan-400">Live</span>
            </h1>
            <p className="text-sm text-slate-300 font-medium max-w-lg leading-relaxed mb-8">
              Chuẩn bị nhân vật, bộ não và kịch bản trên web. Khi đã sẵn sàng, tải file import để đưa vào phần mềm điều khiển — không cần API token ở bước này.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-white">
                <span className="text-blue-400">01</span> Chuẩn bị trên web
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-white">
                <span className="text-blue-400">02</span> Đồng bộ về app
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-white">
                <span className="text-blue-400">03</span> Phát phiên live
              </div>
            </div>
         </div>

         <div className="w-full md:w-[380px] relative z-10 flex flex-col gap-3">
            <div className="flex justify-between items-center mb-1">
               <span className="text-xs font-bold text-white">Ứng dụng desktop</span>
               <span className="text-[10px] text-slate-400">Windows • tải từ trang chính thức</span>
            </div>
            
            <button className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-all group text-left">
               <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                 <MonitorPlay className="w-5 h-5 text-white" />
               </div>
               <div className="flex-1">
                 <div className="text-sm font-bold text-white mb-0.5 group-hover:text-blue-400 transition-colors">Tải AIDOL Live</div>
                 <div className="text-[10px] text-slate-400">Phát nhân vật và nội dung đã đồng bộ</div>
               </div>
               <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-slate-300 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                 <Download className="w-3 h-3" />
               </div>
            </button>

            <button className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-all group text-left">
               <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                 <PackagePlus className="w-5 h-5 text-white" />
               </div>
               <div className="flex-1">
                 <div className="text-sm font-bold text-white mb-0.5 group-hover:text-emerald-400 transition-colors">Tải AIDOL AutoPin</div>
                 <div className="text-[10px] text-slate-400">Tự động ghim sản phẩm khi đang live</div>
               </div>
               <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-slate-300 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                 <Download className="w-3 h-3" />
               </div>
            </button>
            
            <div className="text-right mt-2">
              <a href="#" className="text-[10px] font-bold text-blue-400 hover:text-blue-300">Hoặc quản lý thư viện AIDOL →</a>
            </div>
         </div>
      </div>

      {/* Stepper Console */}
      <div>
         <div className="flex justify-between items-center mb-3 px-2">
           <div>
             <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">LIVE SETUP CONSOLE</div>
             <h2 className="text-lg font-bold text-slate-800">Thiết lập phiên theo từng lớp</h2>
           </div>
           <span className="text-[10px] font-bold text-slate-400">Lưu tự động theo AIDOL đang chọn</span>
         </div>

         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2 flex flex-col md:flex-row gap-2 mb-6">
            <button onClick={() => setActiveStep(1)} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeStep === 1 ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${activeStep === 1 ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}>01</div>
              Nhân vật
            </button>
            <button onClick={() => setActiveStep(2)} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeStep === 2 ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${activeStep === 2 ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}>02</div>
              Bộ não AI
            </button>
            <button onClick={() => setActiveStep(3)} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeStep === 3 ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${activeStep === 3 ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}>03</div>
              Nội dung tự động
            </button>
            <button onClick={() => setActiveStep(4)} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeStep === 4 ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${activeStep === 4 ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}>04</div>
              Chốt đơn & ghim sản phẩm
            </button>
         </div>

         {/* Step Content */}
         <div className="bg-slate-50/50 rounded-2xl border border-blue-100 p-8 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
            {activeStep === 1 && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                  <div>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold mb-3 border border-blue-200">Bước 1 • Nhân vật của phiên</span>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">Chọn AIDOL trước khi setup phiên Live</h3>
                    <p className="text-sm text-slate-600 font-medium max-w-xl">AIDOL là hồ sơ gốc của phiên. Bộ não là một prompt duy nhất, lưu đi kèm nhân vật và dùng lại cho mọi kịch bản.</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm max-w-xs">
                     <h4 className="font-bold text-blue-700 text-sm mb-1">5 AIDOL / tài khoản</h4>
                     <p className="text-[10px] text-slate-500">Khi chưa có nhân vật, chỉ cần thêm một ảnh để tạo AIDOL mới.</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-800 text-sm">AIDOL đã lưu</h4>
                    <span className="text-[10px] text-slate-400">Chưa có AIDOL nào. Tạo nhanh từ một ảnh, sau đó quay lại chọn nhân vật vừa tạo.</span>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-700 rounded-lg text-sm font-bold shadow-sm transition-colors">
                    <Plus className="w-4 h-4" /> Tạo AIDOL từ ảnh
                  </button>
                </div>

                <div className="py-16 text-center">
                  <h3 className="text-xl font-black text-slate-700 mb-2">Chưa có AIDOL để chọn</h3>
                  <p className="text-sm text-slate-500 font-medium">Thêm ảnh nhân vật để xem AIDOL hoặc tạo nhanh một phiên bản ảo từ ảnh nguồn của bạn.</p>
                </div>
              </div>
            )}
            
            {activeStep !== 1 && (
              <div className="py-24 text-center">
                 <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4 border border-blue-100">
                    <UserSquare2 className="w-8 h-8 text-blue-500" />
                 </div>
                 <h3 className="text-xl font-black text-slate-700 mb-2">Vui lòng chọn nhân vật trước</h3>
                 <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto">Bạn cần tạo và chọn một AIDOL ở Bước 1 trước khi cấu hình Bộ não AI và Nội dung.</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
