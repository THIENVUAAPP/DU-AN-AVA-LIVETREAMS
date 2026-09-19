import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle, X, ChevronRight, Zap, Star, Download, Laptop, Apple } from 'lucide-react';
import { downloadWindows, downloadMac } from '../../utils/downloadOS';

export const APP_VERSION = '3.8.9';
export const RELEASE_DATE = '19/09/2026';

export const UPDATE_NOTES = [
  {
    title: '⚡ Bản Cập Nhật v3.8.9 - Tối Ưu Gói Cài Đặt Winform ZIP & Tinh Gọn Bảng Cập Nhật Mới Nhất 100%',
    description: '1. Cập Nhật Gói Cài Đặt Winform & Windows ZIP Mới Nhất: Đảm bảo toàn bộ gói tải ZIP (AvaLive_VIP_PRO_Windows_v3.8.9.zip và AvaLive_VIP_PRO_Mac_v3.8.9.zip) luôn đồng bộ 100% mã nguồn mới nhất, mở lên chạy ngay 1-click không lỗi; 2. Tinh Gọn Bảng Thông Báo Cập Nhật: Loại bỏ toàn bộ dữ liệu cũ không còn phù hợp, chỉ giữ lại các cải tiến cốt lõi mới nhất giúp giao diện gọn gàng, trực quan và tải nhanh; 3. Duy Trì Khả Năng Đồng Bộ Video 0ms (Chuẩn OBS) & Tái Sử Dụng Video Gốc Không Tốn Dung Lượng Máy.'
  },
  {
    title: '⚡ Bản Cập Nhật v3.8.8 - Đồng Bộ Video Tức Thì 0ms (Chuẩn OBS) & Chống Lưu Chồng Chéo Dữ Liệu 100%',
    description: '1. Đồng Bộ Video Siêu Tốc Sang Window Capture & TikTok Live Studio (Chuẩn OBS): Mọi video dù dung lượng nặng nhiều GB (1GB - 50GB) đều đồng bộ và phát ngay lập tức 0ms, siêu mượt mà 60 FPS, không giật lag, không đứng hình; 2. Chống Lưu Chồng Chéo Dữ Liệu Video 100%: Mỗi video tải lên chỉ lưu trữ duy nhất 1 lần, khi người dùng tải lại cùng video thì tự động tái sử dụng dữ liệu gốc 100%, không nhân bản bộ nhớ, không làm nặng máy; 3. Tự Động Thu Dọn & Giải Phóng Hơn 9.29GB Dung Lượng: Quét và loại bỏ sạch sẽ các bản sao trùng lặp, tối ưu hóa bộ nhớ RAM và đĩa cứng.'
  },
  {
    title: '⚡ Bản Cập Nhật v3.8.7 - Sửa Triệt Để Lỗi Phát Voice AI & Khôi Phục Toàn Bộ Hệ Thống Âm Thanh Đọc Voice 100%',
    description: '1. Khắc Phục Triệt Để Lỗi Không Phát Tiếng (Voice): Sửa hoàn toàn lỗi khởi tạo DSP và tăng timeout phản hồi Microsoft Neural TTS, bấm vào bất kỳ voice hay nút nghe thử nào âm thanh đều phát to rõ ngay lập tức 100%; 2. Đảm Bảo Đọc Đúng Giọng Tuyệt Đối: Mọi kịch bản, idol, trợ lý và bình luận viên phát chuẩn xác duy nhất giọng đã chọn, không bị chặn hoặc ngắt tiếng; 3. Nâng Cấp Bộ Giải Mã Âm Thanh Web Audio API: Giữ nguyên vẹn âm sắc tự nhiên và độ mượt mà không độ trễ.'
  },
  {
    title: '⚡ Bản Cập Nhật v3.8.6 - Khôi Phục Nút Nghe Thử Giọng Trợ Lý & Tối Ưu Phân Giải Voice 100%',
    description: '1. Khôi Phục Hoàn Toàn Nút Nghe Thử Giọng Trợ Lý: Nút [▶️ Nghe Thử] của ô Giọng Quản Lý / Trợ Lý luôn luôn hiển thị trực quan và phát thử âm thanh 100% không độ trễ; 2. Phân Giải Voice Tự Động & Chống Mất Nút: Tự động gán fallback giọng Quản lý Quốc Cường chuẩn xác, loại bỏ hoàn toàn tình trạng mất nút nghe thử khi chuyển đổi; 3. Tối Ưu Bộ Thử Giọng Toàn Diện: Bấm vào bất kỳ voice nào phát ngay lập tức, không bị chặn hoặc tắt voice.'
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
          
          <div className="relative mb-2.5 group">
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-2xl blur-md opacity-90 group-hover:opacity-100 transition animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/50 shadow-[0_0_25px_rgba(255,255,255,0.6)] bg-black flex items-center justify-center p-0.5">
              <img src="/official_logo.jpg" alt="AvaLive" className="w-full h-full object-cover rounded-xl" />
            </div>
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
