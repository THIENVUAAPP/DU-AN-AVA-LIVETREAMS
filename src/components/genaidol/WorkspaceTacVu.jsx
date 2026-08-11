import React, { useState } from 'react';
import { Settings, Clock, Mic, UserSquare2, Image as ImageIcon, Play, Upload, Check, Zap, Lock } from 'lucide-react';

export default function WorkspaceTacVu({ defaultTab = 'voice' }) {
  const [activeTab, setActiveTab] = useState(defaultTab); // 'voice', 'lipsync', 'image-video'
  const [speed, setSpeed] = useState(1.0);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 pb-24">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
         <div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-800 mb-3 tracking-tight">Workspace Tác vụ</h1>
            <p className="text-sm text-slate-500 font-medium max-w-2xl">
              Tạo ảnh và video trên một Flow canvas trực quan; tạo giọng nói và nhép miệng vẫn ở công cụ riêng khi bạn cần.
            </p>
         </div>
         <button className="px-5 py-2.5 bg-white border border-slate-200 hover:border-blue-500 text-blue-600 rounded-xl font-bold shadow-sm transition-colors text-sm whitespace-nowrap">
            Quản lý AIDOL
         </button>
      </div>

      {/* Main Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-4 mb-2">
         <button 
           onClick={() => setActiveTab('voice')}
           className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'voice' ? 'bg-blue-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
         >
           Tạo giọng nói
         </button>
         <button 
           onClick={() => setActiveTab('lipsync')}
           className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'lipsync' ? 'bg-blue-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
         >
           Tạo video nhép miệng
         </button>
         <button 
           onClick={() => setActiveTab('image-video')}
           className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'image-video' ? 'bg-blue-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
         >
           Tạo ảnh & video
         </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
         {/* LEFT PANEL - CONTENT */}
         <div className="flex-[1.5] bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col min-h-[600px]">
            
            {activeTab === 'voice' && (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-black text-slate-800 mb-1">Soạn nội dung</h2>
                  <p className="text-xs text-slate-500 font-medium">Hỗ trợ tiếng Việt có dấu và không dấu, văn bản dài hơn 2000 ký tự.</p>
                </div>
                
                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-800 mb-2">Tên job</label>
                  <input type="text" defaultValue="KOL LIVE giọng nói" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:border-blue-500 outline-none shadow-sm" />
                </div>

                <div className="flex-1 flex flex-col mb-6">
                  <label className="block text-xs font-bold text-slate-800 mb-2">Nội dung cần tạo giọng</label>
                  <textarea 
                    placeholder="Dán nội dung tiếng Việt có dấu hoặc không dấu, viết dài bao nhiêu cũng được, rồi chọn giọng ở bên phải." 
                    className="w-full flex-1 min-h-[250px] p-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-blue-500 outline-none shadow-sm resize-none"
                  ></textarea>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between mt-auto">
                   <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Chi phí dự kiến</div>
                      <div className="text-xl font-black text-blue-600">0 KOL Coin</div>
                      <div className="text-[10px] text-slate-500 mt-1">Giá giọng đang chọn: 80 Coin/ký tự. Nhập lời thoại để xem phí.</div>
                   </div>
                   <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-colors shadow-md">
                     Tạo giọng nói
                   </button>
                </div>
              </>
            )}

            {activeTab === 'lipsync' && (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-black text-slate-800 mb-1">Nhép miệng</h2>
                  <p className="text-xs text-slate-500 font-medium">Chọn video DONE hoặc upload video đầu vào rồi ghép với giọng đã chọn.</p>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[10px] font-black text-blue-500 uppercase tracking-widest">MODEL NHÉP MIỆNG</label>
                    <span className="text-[10px] text-slate-400 font-bold">Đăng nhập để kiểm tra quyền truy cập.</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mb-3">Chọn chất lượng xử lý</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-4 relative cursor-pointer">
                        <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white"><Check className="w-3 h-3" /></div>
                        <h4 className="font-bold text-slate-800 text-sm mb-1">Tiêu chuẩn</h4>
                        <p className="text-[11px] text-slate-500 font-medium">Xử lý ổn định cho video nhép miệng thông thường.</p>
                     </div>
                     <div className="bg-white border border-slate-200 rounded-xl p-4 relative cursor-not-allowed opacity-70">
                        <div className="absolute top-4 right-4 px-2 py-1 bg-amber-100 text-amber-700 text-[9px] font-bold rounded flex items-center gap-1"><Lock className="w-3 h-3"/> Fast</div>
                        <h4 className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500"/> KOLLipsync Fast</h4>
                        <p className="text-[11px] text-slate-500 font-medium">Đăng nhập để kiểm tra quyền truy cập.</p>
                     </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-800 mb-2">Tên job</label>
                  <input type="text" defaultValue="KOL LIVE lipsync" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:border-blue-500 outline-none shadow-sm" />
                </div>

                <div className="flex-1 flex flex-col mb-6">
                  <label className="block text-xs font-bold text-slate-800 mb-2">Lời thoại</label>
                  <textarea 
                    placeholder="Nhập lời thoại để nhép môi hoặc dùng kịch bản đã tạo sẵn." 
                    className="w-full flex-1 min-h-[150px] p-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-blue-500 outline-none shadow-sm resize-none"
                  ></textarea>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-auto">
                   <h4 className="text-xs font-bold text-slate-800 mb-1">Quyền riêng tư</h4>
                   <p className="text-[10px] text-slate-500">Mặc định: Video nhép môi của bạn là riêng tư và chỉ hiện trong thư viện của bạn.</p>
                   <div className="text-right mt-4">
                     <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-colors shadow-md">
                       Tạo video nhép miệng
                     </button>
                   </div>
                </div>
              </>
            )}

            {activeTab === 'image-video' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-4 shadow-sm border border-blue-100">
                   <ImageIcon className="w-8 h-8" />
                 </div>
                 <h2 className="text-xl font-black text-slate-800 mb-2">Công cụ Tạo Ảnh & Video</h2>
                 <p className="text-sm text-slate-500 max-w-md">Khu vực Flow canvas đang được nâng cấp để tích hợp các model tạo hình mới nhất. Vui lòng sử dụng Tạo Giọng Nói và Nhép Miệng trước.</p>
              </div>
            )}
         </div>

         {/* RIGHT PANEL - SETTINGS */}
         <div className="w-full lg:w-[400px]">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm min-h-[600px] flex flex-col">
               
               {/* Right Panel Tabs */}
               <div className="flex bg-slate-50 rounded-lg border border-slate-200 p-1 mb-6">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded bg-white text-blue-600 font-bold text-xs shadow-sm">
                    <Settings className="w-4 h-4"/> Cài đặt
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded text-slate-500 font-bold text-xs hover:bg-slate-100 transition-colors">
                    <Clock className="w-4 h-4"/> Lịch sử <span className="bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full text-[9px]">0</span>
                  </button>
               </div>

               {activeTab === 'voice' && (
                 <>
                   <div className="mb-6">
                     <h3 className="font-black text-slate-800 text-lg mb-1">Cấu hình giọng</h3>
                     <p className="text-[11px] text-slate-500 font-medium leading-relaxed">ElevenLabs, MiniMax, VBee và giọng nhân bản được chọn trong thư viện giọng KOL Coin.</p>
                   </div>

                   <div className="space-y-6">
                     <div>
                       <label className="block text-[11px] font-bold text-slate-800 mb-2">Video dùng để tạo giọng/nhép môi</label>
                       <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none shadow-sm appearance-none">
                         <option>Không gắn video</option>
                       </select>
                     </div>

                     <div>
                       <label className="block text-[11px] font-bold text-slate-800 mb-2">Giọng</label>
                       <div className="flex gap-2">
                         <div className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col justify-center cursor-pointer hover:border-blue-400 transition-colors">
                            <div className="text-sm font-black text-slate-800">HN - Ngọc Huyền</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">Vbee • 80 Coin/ký tự • v3</div>
                         </div>
                         <button className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg font-bold text-xs shadow-sm hover:bg-blue-100 transition-colors">
                            Nghe thử
                         </button>
                       </div>
                     </div>

                     <div>
                       <label className="block text-[11px] font-bold text-slate-800 mb-2">Tốc độ: {speed.toFixed(2)}</label>
                       <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                          <input 
                            type="range" min="0.5" max="2.0" step="0.1" value={speed} 
                            onChange={(e) => setSpeed(parseFloat(e.target.value))}
                            className="w-full accent-slate-800 mb-2 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                          />
                          <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                            <span>Chậm hơn</span>
                            <span>Nhanh hơn</span>
                          </div>
                       </div>
                     </div>

                     <div>
                       <label className="block text-[11px] font-bold text-slate-800 mb-2">Kiểu giọng</label>
                       <div className="px-4 py-3 bg-white border border-slate-200 rounded-lg shadow-sm text-xs font-bold text-slate-700 cursor-pointer hover:border-blue-400 transition-colors">
                          Tạo file giọng riêng, sau đó có thể dùng để nhép môi
                       </div>
                     </div>
                   </div>
                 </>
               )}

               {activeTab === 'lipsync' && (
                 <>
                   <div className="mb-6">
                     <h3 className="font-black text-slate-800 text-lg mb-1">Cấu hình đầu vào</h3>
                     <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Chọn video đã DONE, hoặc upload video mới, rồi chọn giọng KOL Coin.</p>
                   </div>

                   <div className="space-y-6">
                     <div>
                       <label className="block text-[11px] font-bold text-slate-800 mb-2">Video đã DONE</label>
                       <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none shadow-sm appearance-none">
                         <option>Upload video mới hoặc chọn video DONE</option>
                       </select>
                     </div>

                     <div>
                       <label className="block text-[11px] font-bold text-slate-800 mb-2">Hoặc upload video đầu vào</label>
                       <div className="flex border border-slate-200 rounded-lg overflow-hidden shadow-sm bg-white">
                         <button className="px-4 py-2.5 bg-slate-100 border-r border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-200">Chọn tệp</button>
                         <div className="px-4 py-2.5 text-xs text-slate-500 font-medium flex-1 flex items-center">Không có tệp nào được chọn</div>
                       </div>
                     </div>

                     <div>
                       <label className="block text-[11px] font-bold text-slate-800 mb-2">Giọng đã DONE</label>
                       <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none shadow-sm appearance-none">
                         <option>Tạo giọng mới từ lời thoại</option>
                       </select>
                     </div>

                     <div>
                       <label className="block text-[11px] font-bold text-slate-800 mb-2">Giọng</label>
                       <div className="flex gap-2">
                         <div className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col justify-center cursor-pointer hover:border-blue-400 transition-colors">
                            <div className="text-sm font-black text-slate-800">HN - Ngọc Huyền</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">Vbee • 80 Coin/ký tự • v3</div>
                         </div>
                         <button className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg font-bold text-xs shadow-sm hover:bg-blue-100 transition-colors">
                            Nghe thử
                         </button>
                       </div>
                     </div>
                   </div>
                 </>
               )}
               
               {activeTab === 'image-video' && (
                 <div className="flex-1 flex items-center justify-center">
                   <p className="text-sm text-slate-400 text-center">Cài đặt Flow canvas</p>
                 </div>
               )}
            </div>
         </div>
      </div>

      {activeTab === 'voice' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-start gap-4">
           <div className="font-bold text-slate-800 text-sm w-20">Ghi chú</div>
           <p className="text-sm text-slate-500 flex-1">
             Thư viện giọng KOL Coin đã nối ElevenLabs, MiniMax, VBee và nhóm giọng nhân bản vào chung một bảng chọn.
           </p>
        </div>
      )}
    </div>
  );
}
