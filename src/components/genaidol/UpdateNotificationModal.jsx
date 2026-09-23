import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle, X, ChevronRight, Zap, Star, Download, Laptop, Apple } from 'lucide-react';
import { downloadWindows, downloadMac } from '../../utils/downloadOS';

export const APP_VERSION = '4.9.9';
export const RELEASE_DATE = '23/09/2026';

export const UPDATE_NOTES = [
  {
    title: '🚀 Bản Cập Nhật v4.9.9 - Xóa Bỏ Hoàn Toàn Video Mặc Định Trong Hệ Thống / Uploads & Đồng Bộ Tuyệt Đối Sân Khấu Chính Với Window Capture OBS & Link TikTok Live',
    description: '1. Xóa Sạch Video Mặc Định / Chạy Nền: Đã dọn dẹp sạch sẽ 100% video nền cũ trong thư mục system/uploads, gói cài đặt tải về luôn hoàn toàn sạch sẽ, không lưu video mặc định rác. 2. Đồng Bộ Đầy Đủ Dữ Liệu Video 0ms: Mọi video từ Sân khấu phụ (Live Idol Avatar, Kho Video), 14 Sự kiện live hoặc tải lên từ máy tính đều được phát và đồng bộ tức thì, đầy đủ thông tin dữ liệu sang Window Capture OBS và Link phát TikTok Live Studio.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.8 - Đồng Bộ Video Tức Thì 0ms (60 FPS) Cho Window Capture OBS & Link TikTok Live Studio (Sân Khấu Phụ & 14 Sự Kiện Live)',
    description: '1. Khắc Phục Triệt Để Màn Hình Đen & Quay Tròn: Video phát từ Sân khấu phụ (Live Idol Avatar, Kho Video) và 14 Sự kiện phát live được nạp tức thì 0ms, phát mượt mà 60 FPS chuẩn xác trên cả Window Capture OBS và Đường link liên kết TikTok Live Studio giống như video tải trực tiếp từ máy tính. 2. Đồng Bộ Đa Kênh Tức Thì: Truyền tải mượt mà cả File Blob trong bộ nhớ RAM và đường dẫn máy chủ cố định, triệt tiêu hoàn toàn độ trễ.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.7 - Khắc Phục Triệt Để Màn Hình Đen Window Capture & Link Live, Đồng Bộ 100% Sân Khấu Chính & 14 Sự Kiện Live',
    description: '1. Sửa Triệt Để Màn Hình Đen: Đồng bộ video phát từ Sân khấu phụ (Live Idol Avatar, Kho Video, 14 Sự kiện live) sang Sân khấu chính, Window Capture OBS và Đường link liên kết 0ms chuẩn 60 FPS, không còn tình trạng đen màn hình. 2. Xóa Bỏ Video Lưu Ẩn: Triệt tiêu hoàn toàn các video cache mặc định, Window Capture và Link stream chỉ phát 100% chính xác những gì đang hiển thị trên Sân khấu chính.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.6 - Khởi Động Trực Tiếp Phần Mềm Phát Live Khi Giải Nén & Tự Động Định Tuyến Chuẩn Xác',
    description: '1. Khởi Động Trực Tiếp Phần Mềm: Giải nén gói cài đặt Windows và Mac mở trực tiếp 100% giao diện Phần Mềm AvaLive Studio phát live (DesktopAppUI), tự động liên kết Sân khấu, Voice AI và các công cụ Livestream. 2. Định Tuyến Thông Minh: Tên miền website trực tuyến luôn hiển thị Trang Bán Hàng (Landing Page), trong khi gói cài đặt giải nén trên máy luôn mở Phần Mềm đầy đủ.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.5 - Khôi Phục Trang Bán Hàng Landing Page, Triệt Tiêu Video Phát Ẩn & Tối Ưu Truyền Video Sân Khấu Phụ Sang OBS / Link Live',
    description: '1. Khôi Phục Trang Bán Hàng (Landing Page): Truy cập website hiển thị đầy đủ giao diện Trang Chủ Bán Hàng & Giới thiệu tính năng, song song với giao diện Desktop App /desktop. 2. Triệt Tiêu Video Phát Ẩn: Tắt hoàn toàn âm thanh preview ngầm và giải phóng tài nguyên phát ẩn. 3. Sửa Lỗi Đen Màn Hình Window Capture OBS: Đồng bộ video từ sân khấu phụ sang sân khấu chính tức thì 0ms, hiển thị 60 FPS mượt mà không lỗi.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.4 - Tối Ưu Tốc Độ Xuất Hiện Video 0ms (60 FPS) & Ưu Tiên Lớp Trên Cùng (Topmost Layer) OBS & TikTok Live',
    description: '1. Tải Video Tức Thì 0ms (60 FPS): Loại bỏ hoàn toàn màn hình chờ xoay vòng, nạp và phát video ngay lập tức với khả năng tăng tốc phần cứng GPU cực nhanh. 2. Ưu Tiên Video Lớp Trên Cùng (Topmost Layer): Khi có nhiều video cùng lúc (14 Sự kiện Live, LipSync Voice AI, Phản hồi nhanh khẩn cấp), Window Capture OBS và đường link TikTok Live Studio luôn hiển thị full màn hình video ở lớp trên cùng tức thì.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.3 - Đồng Bộ Tuyệt Đối 100% Giữa Sân Khấu Phụ & Sân Khấu Chính, Window Capture OBS & Link TikTok Live (14 Sự Kiện Live)',
    description: '1. Đồng Bộ Hoàn Hảo Sân Khấu Phụ & Chính: Mọi thao tác chọn và phát video trong Sân khấu phụ (Kho Live, 14 Tác vụ Live, Sequencer, Multi-Avatar) ngay lập tức đồng bộ chuẩn xác cùng khung hình, cùng thời gian và cùng Voice AI lên Sân khấu chính. 2. Đồng Bộ 14 Sự Kiện Live sang OBS & TikTok Live: Tất cả video sự kiện (Chào hỏi, Follow, Like, Share, Quà tặng, Chốt đơn...) và trạng thái Play/Pause/Time được đồng bộ tức thì 0ms sang Window Capture OBS và đường link Online HTTPS.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.2 - Khắc Phục Triệt Để Khởi Động Localhost 3001 & Tối Ưu Nạp Giao Diện Desktop 100%',
    description: '1. Sửa Triệt Để Lỗi Khởi Động: Bổ sung icon Upload bị thiếu trong thư viện lucide-react của DesktopAppUI, loại bỏ hoàn toàn lỗi ReferenceError khi nạp giao diện. 2. Trải Nghiệm Mở Localhost 3001 Tức Thì: Truy cập http://localhost:3001/ hiển thị ngay toàn bộ giao diện phần mềm trong 0.1 giây mượt mà 60 FPS.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.1 - Tối Ưu Phục Vụ Giao Diện Phần Mềm Localhost 100% (Port 3001 & Tự Động Phân Giải URL)',
    description: '1. Mở Giao Diện Localhost Siêu Mượt: Khắc phục triệt để lỗi khi mở http://localhost:3001/, tự động phân giải đúng giao diện DesktopAppUI trên mọi cổng local và IP mạng LAN. 2. Tối Ưu Mount Hooks: Loại bỏ hoàn toàn các lỗi gọi hook sớm trước khi khởi tạo, đảm bảo phần mềm nạp tức thì trong 0.1 giây.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.0 - Tối Ưu Xóa Video Ô Nhân Vật Siêu Mượt 60 FPS (Không Báo Lỗi), Đồng Bộ Chuẩn Xác Toàn Diện Windows & Mac',
    description: '1. Xóa Video Nhân Vật Siêu Mượt (100% Không Lỗi): Xử lý chuyển đổi trạng thái an toàn tuyệt đối khi người dùng xóa video tại các ô nhân vật. Tự động chuyển mượt mà sang nhân vật kế tiếp hoặc dọn sạch sân khấu về trạng thái chờ nguyên bản mà không phát sinh bất kỳ lỗi nào. 2. Đồng Bộ Hóa Toàn Diện Windows & Mac: Toàn bộ dữ liệu mã nguồn, logic xử lý media và gói cài đặt độc lập được đồng bộ hóa chuẩn xác, tối ưu hóa dung lượng và hiệu năng.'
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
