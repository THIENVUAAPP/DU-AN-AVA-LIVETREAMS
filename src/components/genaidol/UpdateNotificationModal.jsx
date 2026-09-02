import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle, X, ChevronRight, Zap, Star } from 'lucide-react';

export const APP_VERSION = '1.0.9';
export const UPDATE_NOTES = [
  "⭐ Khởi chạy 1-Click độc quyền: Đóng gói duy nhất 1 file AvaLive_Studio siêu mượt, tối ưu hoá tối đa hiệu năng.",
  "🌐 Tự động tương thích toàn cầu: Mọi người dùng trên Web Cloud hay Local đều dán link vào TikTok Live Studio chạy 100%.",
  "🎬 Xóa bỏ hoàn toàn template mẫu cứng: Kho video mẫu chỉ hiển thị tài nguyên do Admin/User tải lên trực tiếp.",
  "🚀 Khởi chạy Mac/Windows siêu tốc: Hỗ trợ mở trực tiếp http://127.0.0.1:3001 và http://127.0.0.1:5173 mượt mà."
];

export default function UpdateNotificationModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const lastSeenVersion = localStorage.getItem('avalive_last_version') || '1.0.0';
      if (lastSeenVersion !== APP_VERSION) {
        setIsOpen(true);
      }
    } catch (e) {}
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    try {
      localStorage.setItem('avalive_last_version', APP_VERSION);
    } catch (e) {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 to-[#0f0f13] text-white w-[500px] rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
          
          <div className="bg-white/20 p-3 rounded-full mb-3 shadow-inner backdrop-blur-md">
            <Sparkles size={32} className="text-yellow-300 animate-pulse" />
          </div>
          
          <h2 className="text-2xl font-black text-center tracking-tight text-white drop-shadow-md">Cập Nhật Thành Công!</h2>
          <div className="flex items-center mt-2 gap-2">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              Phiên bản {APP_VERSION}
            </span>
          </div>
          
          <button 
            onClick={handleClose}
            className="absolute top-3 right-3 p-1.5 bg-black/20 hover:bg-black/40 text-white/80 hover:text-white rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 bg-gradient-to-b from-gray-800/50 to-transparent">
          <p className="text-sm text-gray-300 font-medium">
            Phiên bản <strong className="text-white">{APP_VERSION}</strong> mang đến các cải tiến mới giúp tối ưu hoá trải nghiệm Livestream và hiệu năng hệ thống:
          </p>
          
          <ul className="space-y-3 mt-4">
            {UPDATE_NOTES.map((note, idx) => (
              <li key={idx} className="flex gap-3 items-start bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="mt-0.5 shrink-0 bg-blue-500/20 text-blue-400 rounded-full p-1">
                  <CheckCircle size={16} />
                </div>
                <span className="text-sm text-gray-200 leading-relaxed font-medium">{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-800 flex justify-center bg-black/20">
          <button 
            onClick={handleClose}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-2.5 rounded-full font-bold shadow-lg shadow-blue-900/50 transition-all hover:scale-105 active:scale-95"
          >
            Trải nghiệm ngay
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
