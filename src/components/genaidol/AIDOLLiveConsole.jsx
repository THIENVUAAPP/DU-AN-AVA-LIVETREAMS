import React, { useState } from 'react';
import { Settings, Eye, CreditCard, HelpCircle, Phone, Globe, DownloadCloud, FileBox, Play, CheckCircle, Video, MessageSquare, Plus, Save, RefreshCw } from 'lucide-react';

export default function AIDOLLiveConsole() {
  const [activeSource, setActiveSource] = useState('tiktok');
  const [activeTab, setActiveTab] = useState('cai-dat-chung');
  const [activeInnerTab, setActiveInnerTab] = useState('bat-dau');

  return (
    <div className="w-full min-h-[calc(100vh-8rem)] bg-[#1a1b26] text-slate-300 font-sans flex flex-col rounded-2xl overflow-hidden border border-slate-700 shadow-2xl relative">
      
      {/* Top Header */}
      <div className="h-14 bg-[#1f2335]/80 backdrop-blur-md border-b border-slate-700/50 flex items-center justify-between px-4 flex-shrink-0">
         <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-[#24283b] hover:bg-[#2f354d] border border-slate-700 rounded text-xs flex items-center gap-2 transition-colors"><Settings className="w-3.5 h-3.5"/> Cài đặt</button>
            <button className="px-3 py-1.5 bg-[#24283b] hover:bg-[#2f354d] border border-slate-700 rounded text-xs flex items-center gap-2 transition-colors"><Eye className="w-3.5 h-3.5"/> Theo dõi</button>
            <button className="px-3 py-1.5 bg-[#24283b] hover:bg-[#2f354d] border border-slate-700 rounded text-xs flex items-center gap-2 transition-colors"><CreditCard className="w-3.5 h-3.5"/> Thanh toán</button>
         </div>

         <div className="flex items-center gap-4">
            <button className="px-6 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold transition-colors shadow-[0_0_10px_rgba(37,99,235,0.3)]">
              KOL-LIVE.com
            </button>
            <div className="flex items-center gap-3">
               <button className="text-xs flex items-center gap-1.5 hover:text-white"><HelpCircle className="w-3.5 h-3.5"/> Hỗ trợ</button>
               <button className="text-xs flex items-center gap-1.5 hover:text-white"><Phone className="w-3.5 h-3.5"/> Điện thoại / QR</button>
            </div>
         </div>

         <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-[#24283b] hover:bg-[#2f354d] border border-slate-700 rounded text-xs flex items-center gap-2 transition-colors">Tiếng Việt v</button>
            <button className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-xs font-bold flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5"/> Mới nhất</button>
            <div className="px-3 py-1.5 border border-slate-700 rounded text-xs">Số dư KOL Coin: <span className="font-bold text-amber-400">1200</span></div>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="w-[280px] bg-[#1a1b26] border-r border-slate-700/50 flex flex-col p-4 overflow-y-auto custom-scrollbar">
           
           <div className="bg-[#24283b] rounded-lg border border-slate-700 p-6 mb-4 h-[200px] flex items-center justify-center text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-blue-500/5"></div>
             <div>
               <h3 className="text-sm font-bold text-white mb-1">Nhân vật mẫu</h3>
               <p className="text-xs text-slate-500">(danh tính đã ẩn)</p>
             </div>
           </div>

           <div className="flex gap-2 mb-2">
             <button className="flex-1 py-2 bg-[#24283b] hover:bg-[#2f354d] border border-slate-700 rounded text-xs flex items-center justify-center gap-2 transition-colors"><Video className="w-3.5 h-3.5"/> Camera ảo</button>
             <button className="flex-1 py-2 bg-[#24283b] hover:bg-[#2f354d] border border-slate-700 rounded text-xs flex items-center justify-center gap-2 transition-colors"><MessageSquare className="w-3.5 h-3.5"/> Giao tiếp</button>
           </div>
           <button className="w-full py-2 bg-[#24283b] hover:bg-[#2f354d] border border-slate-700 rounded text-xs flex items-center justify-center gap-2 transition-colors mb-4"><Globe className="w-3.5 h-3.5"/> Mở web ghim</button>

           <div className="bg-[#1f2335] rounded-lg border border-slate-700 p-3 mb-4">
              <div className="flex items-center justify-between mb-3 border-b border-slate-700 pb-2">
                <span className="text-xs font-bold text-blue-400">Nguồn live</span>
                <button className="text-[10px] text-slate-500 hover:text-white flex items-center gap-1">Popup • Link <Settings className="w-3 h-3"/></button>
              </div>
              <div className="flex gap-1 mb-3">
                <button onClick={() => setActiveSource('tiktok')} className={`flex-1 py-1.5 text-[10px] font-bold rounded ${activeSource === 'tiktok' ? 'bg-amber-600 text-white' : 'bg-[#24283b] text-slate-400 border border-slate-700'}`}>TikTok</button>
                <button onClick={() => setActiveSource('shopee')} className={`flex-1 py-1.5 text-[10px] font-bold rounded ${activeSource === 'shopee' ? 'bg-orange-500 text-white' : 'bg-[#24283b] text-slate-400 border border-slate-700'}`}>Shopee</button>
                <button onClick={() => setActiveSource('facebook')} className={`flex-1 py-1.5 text-[10px] font-bold rounded ${activeSource === 'facebook' ? 'bg-[#24283b] text-slate-400 border border-slate-700' : 'bg-[#24283b] text-slate-400 border border-slate-700'}`}>Facebook</button>
              </div>
              <div className="text-[10px] text-emerald-400 font-bold mb-3">Nguồn live mẫu (đã ẩn tài khoản)</div>
              
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(5,150,105,0.3)]"><Play className="w-3 h-3"/> Kiểm tra</button>
                <button className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.3)]"><Sparkles className="w-3 h-3"/> Bắt đầu AI</button>
              </div>
           </div>

           <div className="space-y-1">
             <div className="p-2 hover:bg-[#24283b] rounded text-xs text-slate-400 flex items-center justify-between cursor-pointer border-l-2 border-blue-500">Ảnh / link TikTok mẫu</div>
             <div className="p-2 hover:bg-[#24283b] rounded text-xs text-slate-400 flex items-center justify-between cursor-pointer">Trạng thái phiên mẫu</div>
           </div>
        </div>

        {/* MIDDLE PANEL */}
        <div className="flex-1 flex flex-col min-w-[300px] border-r border-slate-700/50 bg-[#1a1b26]">
           {/* Tabs */}
           <div className="flex border-b border-slate-700/50 pt-2 px-2 bg-[#1f2335]">
              <button onClick={() => setActiveTab('kiem-thu')} className={`px-4 py-2 text-xs font-bold rounded-t-lg ${activeTab === 'kiem-thu' ? 'bg-[#1a1b26] text-blue-400 border-t border-l border-r border-slate-700/50' : 'text-slate-500 hover:text-slate-300'}`}>Kiểm thử phản hồi</button>
              <button onClick={() => setActiveTab('cai-dat-chung')} className={`px-4 py-2 text-xs font-bold rounded-t-lg flex items-center gap-2 ${activeTab === 'cai-dat-chung' ? 'bg-[#1a1b26] text-white border-t border-l border-r border-slate-700/50' : 'text-slate-500 hover:text-slate-300'}`}><Settings className="w-3.5 h-3.5"/> Cài đặt chung</button>
              <button onClick={() => setActiveTab('quan-ly')} className={`px-4 py-2 text-xs font-bold rounded-t-lg ${activeTab === 'quan-ly' ? 'bg-[#1a1b26] text-white border-t border-l border-r border-slate-700/50' : 'text-slate-500 hover:text-slate-300'}`}>Quản lý Sự kiện</button>
              <button onClick={() => setActiveTab('video')} className={`px-4 py-2 text-xs font-bold rounded-t-lg ${activeTab === 'video' ? 'bg-[#1a1b26] text-white border-t border-l border-r border-slate-700/50' : 'text-slate-500 hover:text-slate-300'}`}>Video</button>
           </div>
           
           <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
             <p className="text-xs text-slate-400 mb-4 border-b border-slate-700 pb-3">Đây là bảng Cài đặt chung thật. Bạn có thể chỉnh trực tiếp các tab cấu hình bên dưới mà không cần mở thêm popup.</p>
             
             {/* Inner Tabs */}
             <div className="flex gap-1 mb-4 flex-wrap border-b border-slate-700 pb-2">
                <button onClick={() => setActiveInnerTab('bat-dau')} className={`px-3 py-1.5 text-[10px] font-bold rounded flex items-center gap-1.5 ${activeInnerTab === 'bat-dau' ? 'text-white' : 'text-slate-500'}`}><FileBox className="w-3.5 h-3.5"/> Bắt đầu</button>
                <button onClick={() => setActiveInnerTab('thong-tin')} className={`px-3 py-1.5 text-[10px] font-bold rounded flex items-center gap-1.5 ${activeInnerTab === 'thong-tin' ? 'text-purple-400' : 'text-slate-500'}`}><UserSquare2 className="w-3.5 h-3.5"/> Thông tin nhân vật</button>
                <button onClick={() => setActiveInnerTab('api')} className={`px-3 py-1.5 text-[10px] font-bold rounded flex items-center gap-1.5 ${activeInnerTab === 'api' ? 'text-amber-400' : 'text-slate-500'}`}><Settings className="w-3.5 h-3.5"/> API VAD</button>
                <button onClick={() => setActiveInnerTab('chinh')} className={`px-3 py-1.5 text-[10px] font-bold rounded flex items-center gap-1.5 ${activeInnerTab === 'chinh' ? 'text-blue-400' : 'text-slate-500'}`}><UserSquare2 className="w-3.5 h-3.5"/> Nhân vật Chính</button>
                <button onClick={() => setActiveInnerTab('tro-ly')} className={`px-3 py-1.5 text-[10px] font-bold rounded flex items-center gap-1.5 ${activeInnerTab === 'tro-ly' ? 'text-pink-400' : 'text-slate-500'}`}><Mic className="w-3.5 h-3.5"/> Trợ lý</button>
             </div>

             <h4 className="text-xs font-bold text-white mb-2">Trạng thái nhân vật mẫu</h4>
             <div className="bg-[#1f2335] border border-slate-700 rounded-lg p-4 mb-4">
                <div className="text-[10px] text-blue-400 font-bold mb-2 uppercase text-center">Thao tác</div>
                <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 mb-3 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-shadow">
                  <DownloadCloud className="w-4 h-4"/> Import nhân vật từ KOL-LIVE.com
                </button>
                <p className="text-[10px] text-slate-500 mb-3 text-center leading-relaxed">Tạo ảnh, chọn giọng và tạo chuyển động ở KOL-LIVE.com. AIDOL Live chỉ tải video DONE về hai thư mục phát live: Im lặng và Nói chuyện.</p>
                <button className="w-full py-2 bg-[#24283b] hover:bg-[#2f354d] border border-slate-600 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors">
                  <FileBox className="w-4 h-4 text-amber-500"/> Nhập pack .zip cũ
                </button>
             </div>

             <div className="bg-[#1f2335] border border-slate-700 rounded-lg overflow-hidden flex flex-col h-[250px]">
                <div className="flex-1 flex items-center justify-center">
                   <div className="text-slate-500 text-sm font-bold">Thư viện AIDOL mẫu</div>
                </div>
                <div className="p-2 border-t border-slate-700">
                  <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold flex items-center justify-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4"/> Chọn Dùng ngay
                  </button>
                  <div className="flex gap-2">
                    <button className="flex-1 py-1.5 bg-[#24283b] text-blue-400 border border-slate-600 rounded text-xs flex items-center justify-center gap-1.5 hover:bg-[#2f354d]">
                      <DownloadCloud className="w-3 h-3"/> Xuất (.zip)
                    </button>
                    <button className="flex-1 py-1.5 bg-[#24283b] text-red-400 border border-slate-600 rounded text-xs hover:bg-[#2f354d]">Xóa</button>
                  </div>
                </div>
             </div>
           </div>
        </div>

        {/* RIGHT PANEL - BỘ NÃO */}
        <div className="flex-1 flex flex-col bg-[#1a1b26] p-4 relative">
           <div className="flex items-center gap-3 mb-4">
             <div className="text-sm font-bold text-blue-400">Bộ não</div>
             <div className="text-sm font-bold text-blue-400">Ngữ cảnh tổng quát</div>
           </div>
           
           <div className="flex-1 bg-[#1f2335] rounded-xl border border-slate-700 p-4 relative overflow-hidden flex flex-col">
              <div className="absolute top-4 right-4 w-32 h-32 bg-slate-800 rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden">
                 <div className="text-[10px] text-slate-500">Avatar Image</div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-30">
                 <h2 className="text-3xl font-black text-white drop-shadow-lg text-center max-w-sm">Bộ não / ngữ cảnh phiên live<br/><span className="text-sm">(đã che dữ liệu riêng tư)</span></h2>
              </div>

              <div className="flex-1 pr-40 mt-16 text-slate-400 text-xs leading-relaxed opacity-50">
                 <p className="mb-2">Đây là khu vực nhập prompt cấu hình cho bộ não AI.</p>
                 <p className="mb-2">Hệ thống sẽ dựa vào nội dung ở đây để tự động trả lời bình luận, chốt đơn, và điều hướng phiên live theo đúng kịch bản của người dùng cài đặt.</p>
                 <p>... Nội dung đã bị ẩn ...</p>
              </div>
           </div>

           <div className="mt-4 text-[10px] text-slate-500 leading-relaxed mb-3">
             Dữ liệu này thuộc về nhân vật. Với nhân vật import từ KOL-LIVE.com, bấm Lưu nhân vật sẽ đồng bộ Bộ não và Ngữ cảnh tổng quát.<br/>
             Chỉnh xong bấm "Lưu nhân vật" để cập nhật.
           </div>
           
           <div className="flex items-center justify-between">
              <button className="px-4 py-2 bg-[#24283b] hover:bg-[#2f354d] border border-slate-600 text-blue-400 rounded text-xs font-bold flex items-center gap-2 transition-colors">
                <RefreshCw className="w-3.5 h-3.5"/> Cập nhật Bộ não / ngữ cảnh từ KOL-LIVE.com
              </button>
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold shadow-[0_0_10px_rgba(37,99,235,0.3)] transition-colors">
                Lưu nhân vật
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
