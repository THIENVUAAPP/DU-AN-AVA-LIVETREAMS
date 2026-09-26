import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle, X, ChevronRight, Zap, Star, Download, Laptop, Apple } from 'lucide-react';
import { downloadWindows, downloadMac } from '../../utils/downloadOS';

export const APP_VERSION = '4.9.50';
export const RELEASE_DATE = '26/09/2026';

export const UPDATE_NOTES = [
  {
    title: '🚀 Bản Cập Nhật v4.9.50 - Đồng Bộ Đa Lớp 0ms & Nút Bấm Siêu Nhạy',
    description: '1. Đồng Bộ 100% Các Lớp Video, Avatar, Banner: Sân Khấu Chính có video phụ PiP, Avatar AI hay banner chữ nào thì Window Capture và Link TikTok Live Studio đều lập tức hiển thị đầy đủ 0ms ngay khi mở link. 2. Nâng Cấp Nút Bấm Dock: Xử lý triệt để logic Tạm Dừng, Bật/Tắt Tiếng, Tràn Màn và Ẩn Dock bằng cơ chế direct pointer/click handler, bấm là ăn ngay không trễ nhịp nào.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.49 - Triệt Tiêu Lỗi Xóa Màn Hình & Đồng Bộ Toàn Bộ Video Sân Khấu',
    description: '1. Sửa Lỗi Tự Động Xóa Màn Hình (clearMedia): Khắc phục triệt để lỗi làm cho video/đường link bị tắt đen hoặc ngắt kết nối sau 400ms do trạng thái clearMedia đè; giúp đường link online (/stage) và Window Capture mở lên là PHÁT NGAY LẬP TỨC 100%. 2. Đồng Bộ Đa Tầng Video & Avatar: Đảm bảo tất cả các lớp video chính, video phụ PiP, Avatar nhân vật và banner chữ hiển thị đồng nhất trên mọi màn hình. 3. Sửa Nút Bấm Dock: Nút bấm trên mọi phiên bản dock đều nhận PointerDown cực nhạy.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.48 - Đồng Bộ 100% Window Capture & Sửa Nút Điều Khiển Dock Mới',
    description: '1. Đồng Bộ Hoàn Toàn Window Capture & Sân Khấu Chính: Cửa sổ Window Capture bây giờ được nhúng trực tiếp nhân (core) của Sân Khấu Chính, đảm bảo 100% mọi Video Phụ (PiP), Avatar AI Nhân Vật, Hình Ảnh Lớp Phủ, và Banner Chữ đều được xếp chồng hiển thị y hệt như những gì anh thấy trên Sân Khấu. 2. Xử Lý Triệt Để Nút Bấm Không Phản Hồi: Nâng cấp toàn bộ cơ chế nhấn nút sang onPointerDown cực nhạy cho TẤT CẢ các phiên bản thanh Dock. Từ nay bất kể anh dùng chuột hay cảm ứng, bấm là ăn ngay lập tức.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.47 - Sửa Lỗi Điều Khiển Video Dock, Mute Toàn Cục & Cập Nhật Tên Link Phát Live',
    description: '1. Sửa Lỗi Mất Tương Tác Thanh Dock: Thay thế cơ chế click bằng PointerDown để đảm bảo chạm/nhấn trên mọi nền tảng (Window Capture) đều ăn ngay lập tức, khắc phục triệt để lỗi bấm không tác dụng. 2. Tắt Tiếng Toàn Cục (Global Mute): Nút Bật/Tắt Tiếng hiện tại đã đồng bộ Mute cho TẤT CẢ các video trên sân khấu (Video chính, Video PiP phụ, Avatar AI...), giải quyết tình trạng âm thanh lọt từ các lớp video khác. 3. Đa Dạng Tên Miền Phát Sóng: Tối ưu các đường link phát trực tiếp để tương thích hoàn toàn trình duyệt Chromium của TikTok Live Studio, giúp nhận diện và phát video 100% không bị chặn (sử dụng /stage, /main, /tiktok-live, /live-stream đều đồng bộ mượt mà).'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.46 - Nâng Cấp Chất Lượng Video Siêu Sắc Nét (Window Capture & Live Stage)',
    description: 'Nâng cấp toàn bộ chất lượng hiển thị video trên các cửa sổ Window Capture và Live Stream Stage, bổ sung các cờ tối ưu hóa render phần cứng (image-rendering, font-smoothing) để loại bỏ hoàn toàn hiện tượng mờ (blur), mang lại hình ảnh sắc nét tuyệt đối 4K 60FPS cho TikTok Live Studio và OBS.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.45 - Đồng Bộ Toàn Bộ Sân Khấu TikTok Live, Làm Mới Bộ Nút Dock & Mute Ô Nhân Vật Đầu Trang',
    description: '1. Đồng Bộ Toàn Bộ Thành Phần Sân Khấu: Khắc phục triệt để lỗi TikTok Live Studio và Window Capture không hiển thị video nền; hệ thống đa tầng tự động hiển thị mượt mà cả Video/Ảnh nền chính, Video phụ PiP, Avatar AI, Banner quảng cáo và Câu tiêu đề chữ, đồng bộ 100% không bỏ sót bất kỳ thành phần nào. 2. Làm Mới Hoàn Toàn Bộ Nút Bấm Thanh Dock (Ảnh 2): Thiết kế Cyberpunk viên thuốc mới siêu nhạy (LIVE 60FPS, Tạm Dừng/Tiếp Tục, Bật/Tắt Tiếng, Tràn Màn/Vừa Khung, Ẩn Nút H và icon phục hồi 👁️), điều khiển đồng bộ tất cả các video trên trang 0ms, chống nuốt click tuyệt đối. 3. Tắt Tiếng Triệt Để Các Ô Nhân Vật Đầu Trang: Các ô video/nhân vật tải lên ở thanh trên đầu được mute hoàn toàn (volume = 0), chỉ duy nhất Sân Khấu Chính mới phát âm thanh. 4. Khóa Chặt 100% Toàn Bộ 14 Tab & Module Hệ Thống.'
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
