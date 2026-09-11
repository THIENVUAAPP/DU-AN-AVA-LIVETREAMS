import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle, X, ChevronRight, Zap, Star, Download, Laptop, Apple } from 'lucide-react';
import { downloadWindows, downloadMac } from '../../utils/downloadOS';

export const APP_VERSION = '1.0.2';
export const RELEASE_DATE = '11/09/2026';

export const UPDATE_NOTES = [
  {
    title: '🖥️ Cửa Sổ Bắt Màn Hình (Window Capture) & Nguồn Trình Duyệt: Phát Video Tức Thì 0ms Siêu Mượt 60 FPS',
    description: 'Khắc phục triệt để lỗi không lên hình/màn hình đen khi mở Window Capture hoặc Browser Source OBS/TikTok Live Studio. Video tải lên, video thư viện hay đường link trực tuyến đều tự động đồng bộ hóa chuẩn xác, phát ngay tức thì 0ms, độ nét gốc 1080p 60 FPS, chạy liên tục 5-10 tiếng không giật lag đứng hình.'
  },
  {
    title: '🌐 Nguồn Trình Duyệt (Browser Source) TikTok Live Studio 1080p 60 FPS Trực Tuyến',
    description: 'Định tuyến chuẩn xác qua Cloudflare Tunnel HTTPS (/live-stream), nạp trực tiếp video gốc trên máy chủ, chạy liên tục 5-10 tiếng siêu nét, siêu mượt, không màn hình đen.'
  },
  {
    title: '⚡ Tối Ưu Hóa Tuyệt Đối Video Tải Lên: Phát Siêu Mượt 60 FPS Không Gián Đoạn',
    description: 'Tách biệt luồng phát nội bộ (In-Memory Blob URL) và luồng nạp nền (Chunked Fast-Stream), giúp video tải lên phát ngay tức thì 0ms, loại bỏ hoàn toàn tình trạng đứng hình, giật lag hay nghẽn đĩa.'
  },
  {
    title: '📦 Trọn Bộ Gói Cài Standalone ZIP v1.0.0 Tích Hợp Sẵn Binary Cloudflare',
    description: 'Tích hợp sẵn binary Cloudflare Tunnel cho cả Windows và macOS; khởi động 1-Click là dùng ngay không cần cài đặt môi trường.'
  },
  {
    title: '📜 Sửa Triệt Để Lỗi Tab Kịch Bản Studio & Áp Dụng 1-Chạm Mượt Mà',
    description: 'Khắc phục hoàn toàn lỗi mở kịch bản 2–4 nhân vật; nạp và áp dụng kịch bản đối thoại tức thì vào hệ thống phát Live không giật lag.'
  },
  {
    title: '🖼️ Tải Lên & Quản Lý Nhiều Hình Ảnh Cùng Lúc / Kéo Thả Sắp Xếp Tự Do',
    description: 'Cho phép tải lên cùng lúc hoặc nhiều lần không giới hạn hình ảnh, logo, banner; tùy chỉnh co giãn 8 góc cạnh, bo góc, độ mờ và tách nền phông xanh.'
  },
  {
    title: '👄 Nâng Cấp Công Nghệ Nhép Miệng (Lip-Sync) AI Tự Động Khớp Voice Siêu Mượt',
    description: 'Bộ thuật toán phân tích phổ âm thanh FFT & Formant F1/F2 thời gian thực (<20ms), mô phỏng khẩu hình, nhịp thở và chuyển động cơ thể chân thực chuẩn phong cách HeyGen/Remina không phụ thuộc API ngoài.'
  },
  {
    title: '📺 Kết Nối Phát Trực Tiếp TikTok Live Studio & OBS Studio Siêu Nét 1080p',
    description: 'Đồng bộ 100% hình ảnh, video, âm thanh và chuyển động ra Browser Source hoặc Window Capture, hiển thị trọn vẹn mọi lớp đồ họa trên sóng livestream.'
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
