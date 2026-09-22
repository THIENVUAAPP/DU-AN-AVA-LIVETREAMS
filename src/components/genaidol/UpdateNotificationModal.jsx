import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle, X, ChevronRight, Zap, Star, Download, Laptop, Apple } from 'lucide-react';
import { downloadWindows, downloadMac } from '../../utils/downloadOS';

export const APP_VERSION = '4.7.7';
export const RELEASE_DATE = '22/09/2026';

export const UPDATE_NOTES = [
  {
    title: '⚡ Bản Cập Nhật v4.7.7 - Tăng Tốc Xử Lý Voice 0ms Tức Thì, Đọc Kịch Bản Siêu Nhanh & Khóa Chặt Cập Nhật Windows Mới Nhất',
    description: '1. Tăng Tốc Xử Lý Đọc Voice 0ms Tức Thì: Tối ưu hóa song song pipeline Voice TTS, loại bỏ hoàn toàn độ trễ khi bấm Nghe Thử Voice trên kịch bản (Ảnh 1 & Ảnh 3) và Thử Giọng trong kho giọng 332 giọng (Ảnh 2). Âm thanh phát ngay lập tức không cần đợi. 2. Khóa Chặt File Tải Về Mới Nhất Trên Windows: Mọi link tải cài đặt tự động phân giải gói ZIP mới nhất (v4.7.7) trên Windows & macOS, đảm bảo trải nghiệm cài đặt mượt mà nhất.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.7.6 - Nâng Cấp Nút Đồng Bộ Sân Khấu Chính Chuẩn Màu Xanh/Đỏ & Đọc Thử Voice AI Toàn Diện',
    description: '1. Nút Đồng Bộ Sân Khấu Chính: Hiển thị trực quan màu Xanh Emerald khi BẬT (🟢 ĐANG PHÁT RA SÂN KHẤU CHÍNH) và màu Đỏ khi TẮT (🔴 📡 ĐỒNG BỘ RA SÂN KHẤU CHÍNH). Chỉ có người dùng bấm tắt/mở, không tự ý tắt, duy trì phát liên tục cho tới khi người dùng bấm dừng. 2. Đọc Thử Voice AI Toàn Diện: Nâng cấp động cơ phát âm thanh 4 lớp (Neural TTS + Broadcast DSP + Direct HTML5 Audio + Web Speech API) đảm bảo 100% mọi giọng đọc khi bấm Nghe Thử đều phát siêu mượt mà, truyền cảm, có hơi thở, nhấn nhá cảm xúc sống động.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.7.5 - Nâng Cấp Tách Sạch 100% Background & Khung Viền Ảnh, Khôi Phục Đồng Bộ Sân Khấu Chính, Sửa Lỗi Nghe Thử Voice & Tinh Gọn Giao Diện',
    description: '1. Tách Sạch 100% Background & Khung Viền Ảnh: Xóa sạch mọi loại phông nền phức tạp (tường, phòng, đồ vật, neon, sàn) và triệt tiêu 100% vạch viền khung của bức ảnh ở 4 cạnh. 2. Khôi Phục Đồng Bộ Sân Khấu Chính: Nút [Đồng Bộ Ra Sân Khấu Chính] truyền tải tức thì toàn bộ video, avatar, ảnh và lớp phủ từ Sân Khấu Phụ sang Master Live Stream mà không bị nghẽn trạng thái. 3. Sửa Lỗi Nghe Thử Voice: Bấm Nghe Thử Voice hoạt động tức thì, phát giọng mượt mà chuẩn xác từ Voice AI Brain. 4. Xóa Ô Dư Thừa: Loại bỏ ô Nghỉ Chuyển Bước dư ở chân thẻ kịch bản.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.7.4 - Khắc Phục Triệt Để Lỗi Ngắt Quãng Kịch Bản Idol & EventVoiceTester, Đọc Xuyên Suốt Liền Mạch 0ms',
    description: '1. Đọc Kịch Bản Idol Xuyên Suốt: Sửa triệt để lỗi callback onEnd trong previewVoiceAudio khi truyền options object, loại bỏ hoàn toàn hiện tượng khựng dừng / dừng 8 giây giữa các câu trong Kịch bản Idol. Đọc siêu mượt liên tục 0ms hoặc theo đúng khoảng nghỉ cài đặt của người dùng. 2. Tách Sạch 100% Nền & Khung Viền: Duy trì MediaPipe AI Neural Network xóa sạch mọi loại phông nền (tường, phòng, neon, người, đồ vật) và triệt tiêu 100% viền khung ảnh 4 cạnh.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.7.3 - Tách Sạch 100% Nền Mọi Hình Ảnh & Khung Viền, Khóa Chặt Đồng Bộ Sân Khấu Chính, Cài Đặt Nghỉ Nhịp Câu & Đọc Xuyên Suốt',
    description: '1. Xóa Sạch 100% Background & Khung Viền Ảnh. 2. Khóa Chặt Đồng Bộ Sân Khấu Chính. 3. Đọc Kịch Bản Xuyên Suốt & Đọc Có Cảm Xúc.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.7.0 - Xóa Triệt Để Khung Viền Khi Tách Nền, Nhân Bản Đối Tượng Trực Tiếp Trên Sân Khấu & Đọc Voice Kịch Bản Liên Tục Xuyên Suốt',
    description: '1. Xóa Triệt Để Khung Viền & Badge Khi Tách Nền: Loại bỏ 100% vạch khung ảnh gốc 4 cạnh; tự động xóa hoàn toàn viền hộp. 2. Nhân Bản Đối Tượng Trực Tiếp Trên Sân Khấu. 3. Đọc Voice Kịch Bản Liên Tục Mượt Mà.'
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
