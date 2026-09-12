import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle, X, ChevronRight, Zap, Star, Download, Laptop, Apple } from 'lucide-react';
import { downloadWindows, downloadMac } from '../../utils/downloadOS';

export const APP_VERSION = '1.0.6';
export const RELEASE_DATE = '12/09/2026';

export const UPDATE_NOTES = [
  {
    title: '🛍️ Sửa Dứt Điểm Lỗi Tab "Giọng Bán Hàng & Dịch Vụ" (Mở Mượt Mà 100%)',
    description: 'Khắc phục hoàn toàn sự cố crash khi bấm vào tab Giọng Bán Hàng; giao diện mở tức thì, hiển thị đầy đủ 30 chất giọng bán hàng chuyên sâu, bộ lọc đa chiều Vùng Miền (Nam/Bắc/Trung/Tây), Độ Tuổi và thanh trượt tốc độ realtime.'
  },
  {
    title: '🎙️ Độc Bản Hóa Toàn Bộ Kho Giọng Đọc (100% Khác Biệt, Không Trùng Lặp Âm Sắc)',
    description: 'Giải quyết triệt để vấn đề các giọng phát ra giống nhau; tái hiệu chuẩn dải tần Pitch (-35% đến +32%) và Rate (-20% đến +26%) kết hợp công nghệ Web Audio Detune Cents, đảm bảo mỗi nhân vật sở hữu một màu giọng hoàn toàn riêng biệt.'
  },
  {
    title: '👵 Phân Tầng Rõ Nét 3 Độ Tuổi: Trẻ Trung, Trưởng Thành & Lão Niên Chân Thật',
    description: 'Phân loại rõ nét theo từng tầng độ tuổi: Giọng Trẻ (20-28t) cao vút trong trẻo; Giọng Trưởng Thành (28-40t) đĩnh đạc bản lĩnh; Giọng Lão Niên (40-70t) trầm ấm dầy dặn kết hợp hiệu ứng rung giọng tự nhiên (Tremolo LFO 4.8Hz) chuẩn bậc cao niên.'
  },
  {
    title: '🗺️ Phân Rõ 4 Vùng Miền: Chuẩn Phương Ngữ Nam, Bắc, Trung, Tây',
    description: 'Nam Bộ rộn ràng phóng khoáng ("nha cả nhà mình ơi"), Miền Tây sông nước ngọt lịm ("nghen bà con cô bác"), Miền Trung sâu lắng tha thiết ("nì cả nhà ơi"), Miền Bắc sang trọng chuẩn mực ("nhé các bác và anh chị").'
  }
];

export const CHANGELOG = UPDATE_NOTES;

export default function UpdateNotificationModal({ isOpen: controlledIsOpen, onClose: controlledOnClose }) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  useEffect(() => {
    try {
      const lastSeenVersion = localStorage.getItem('avalive_last_version') || '1.0.0';
      if (lastSeenVersion !== APP_VERSION) {
        setInternalIsOpen(true);
      }
    } catch (e) {}
  }, []);

  const handleClose = () => {
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
    }
    try {
      localStorage.setItem('avalive_last_version', APP_VERSION);
    } catch (e) {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-gradient-to-br from-slate-900 via-[#10121a] to-[#0c0d14] text-white max-w-lg w-full rounded-3xl shadow-2xl border border-cyan-500/30 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 flex flex-col items-center justify-center shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
          
          <div className="bg-white/20 p-3 rounded-full mb-2.5 shadow-inner backdrop-blur-md">
            <Sparkles size={28} className="text-yellow-300 animate-pulse" />
          </div>
          
          <h2 className="text-2xl font-black text-center tracking-tight text-white drop-shadow-md">
            Bản Cập Nhật Mới Nhất
          </h2>
          <div className="flex items-center mt-1.5 gap-2">
            <span className="bg-white/25 text-white text-xs font-black px-3.5 py-1 rounded-full shadow-md border border-white/20">
              Phiên Bản v{APP_VERSION} (Official)
            </span>
          </div>
          
          <button 
            onClick={handleClose}
            className="absolute top-3.5 right-3.5 p-2 bg-black/20 hover:bg-black/40 text-white/80 hover:text-white rounded-full transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nút Tải Cài Đặt Mac & Windows */}
        <div className="px-5 py-3.5 bg-black/40 border-b border-white/10 flex flex-col sm:flex-row gap-2.5 items-center justify-between shrink-0">
          <div className="text-left">
            <p className="text-[11px] font-bold text-gray-300">Tải bộ cài đặt độc lập v{APP_VERSION}:</p>
            <p className="text-[10px] text-gray-400">Bảo mật cao, giải nén là chạy ngay</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={downloadMac}
              className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all hover:scale-105 flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="Tải trực tiếp bản cài đặt Mac (.zip)"
            >
              <Apple size={13} />
              <span>Bản Mac (.zip)</span>
            </button>
            <button
              onClick={downloadWindows}
              className="px-3 py-1.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all hover:scale-105 flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-lg shadow-cyan-500/20"
              title="Tải trực tiếp bản cài đặt Windows (.zip) về máy ngay lập tức"
            >
              <Laptop size={13} />
              <span>Bản Win (.zip)</span>
            </button>
          </div>
        </div>

        {/* Nội Dung Nâng Cấp */}
        <div className="p-5 space-y-3.5 overflow-y-auto flex-1 custom-scrollbar">
          <p className="text-xs text-gray-300 font-medium">
            Phiên bản <strong className="text-cyan-300 font-bold">v{APP_VERSION}</strong> đã được kiểm tra mượt mà và tối ưu hóa toàn diện:
          </p>
          
          <ul className="space-y-2.5">
            {(UPDATE_NOTES || []).map((note, idx) => (
              <li key={idx} className="flex gap-2.5 items-start bg-white/5 p-3 rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all">
                <div className="mt-0.5 shrink-0 bg-blue-500/20 text-blue-400 rounded-full p-1">
                  <CheckCircle size={15} />
                </div>
                <div className="flex flex-col text-left">
                  {typeof note === 'object' && note.title && (
                    <span className="text-xs font-bold text-cyan-300 mb-0.5">{note.title}</span>
                  )}
                  <span className="text-xs text-gray-200 leading-relaxed font-medium">
                    {typeof note === 'object' ? note.description : note}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 flex justify-center bg-black/40 shrink-0">
          <button 
            onClick={handleClose}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-2.5 rounded-2xl font-black text-xs shadow-lg shadow-blue-900/50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Bắt Đầu Sử Dụng Ngay</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
