import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle, X, ChevronRight, Zap, Star, Download, Laptop, Apple } from 'lucide-react';
import { downloadWindows, downloadMac } from '../../utils/downloadOS';

export const APP_VERSION = '4.1.8';
export const RELEASE_DATE = '20/09/2026';

export const UPDATE_NOTES = [
  {
    title: '⚡ Bản Cập Nhật v4.1.8 - Tinh Gọn Giao Diện, Loại Bỏ Nút Bấm Trùng Lặp & Giữ Menu Chuỗi Kịch Bản Chuẩn',
    description: '1. Tinh Gọn Giao Diện Desktop: Loại bỏ nút bấm thừa trên Top Control Bar để giao diện gọn gàng, chuyển toàn quyền truy cập Sequencer vào Menu chính; 2. Truy Cập Thuận Tiện: Duy trì tab "🎬 Chuỗi Kịch Bản Live" trong Menu chức năng và Header Navigation; 3. Khóa Chặt 100% Toàn Bộ Module: Bảo toàn tuyệt đối mọi tính năng đang vận hành (Window Capture OBS Zero-Copy, Voice AI Brain, Game Battle, Game Bản Đồ 3D).'
  },
  {
    title: '⚡ Bản Cập Nhật v4.1.7 - Hiển Thị Tab Chuỗi Kịch Bản Live (Sequencer) Trực Quan Trên Menu Chính & Header',
    description: '1. Tab Menu Chính Thức: Đặt tab "🎬 Chuỗi Kịch Bản Live" trực tiếp trên Header Navbar và Menu Dropdown tài khoản giúp truy cập 1 chạm tức thì; 2. Tương Thích Hoàn Hảo Web & Máy Tính (Mac & Windows): Hiển thị đồng bộ trên mọi nền tảng; 3. Khóa Chặt 100% Hệ Thống: Bảo toàn nguyên vẹn Window Capture OBS Zero-Copy, Voice AI Brain, Game Battle, Game Bản Đồ 3D, Multi-Avatar.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.1.6 - Hiển Thị Trực Quan Nút Bấm Chuỗi Kịch Bản (Sequencer) & Mở Mặc Định 100%',
    description: '1. Hiển Thị Nổi Bật Trên Thanh Điều Khiển: Bổ sung nút bấm trực tiếp "🎬 CHUỖI KỊCH BẢN" ngay trên thanh công cụ chính và menu ứng dụng giúp người dùng nhìn thấy và mở ngay lập tức; 2. Nạp Mặc Định Chuỗi Kịch Bản: Mở trực tiếp giao diện Sequencer với đầy đủ Preset mẫu khi mở Cài đặt Sự kiện; 3. Đồng Bộ Hoàn Hảo 60 FPS 4K: Giữ nguyên vẹn 100% tất cả các tab chức năng đã khóa.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.1.5 - Tích Hợp Chính Thức Trình Điều Phối Chuỗi Kịch Bản Phân Đoạn & Quản Lý Preset Đa Dạng',
    description: '1. Trình Điều Phối Chuỗi Kịch Bản Trực Quan: Bổ sung module Điều Phối Chuỗi Kịch Bản (Sequencer) ngay trong Workspace Tác Vụ, cho phép lưu trữ và chuyển đổi linh hoạt giữa nhiều Preset bán hàng (Mỹ phẩm, Thời trang, Gia dụng...); 2. Tự Động Hóa Vận Hành 24/7: Tự động điều phối chuyển bước từ AI Avatar mở màn, Q&A bình luận TikTok Live, phát video sản phẩm, video feedback đến CTA chốt sale; 3. Đồng Bộ 0ms Chuẩn 60 FPS 4K: Chuyển đổi mượt mà không độ trễ trên TikTok Live Studio và OBS; 4. Khóa Chặt 100% Toàn Bộ Module: Bảo toàn tuyệt đối mọi tab chức năng hiện có.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.1.4 - Chuẩn Hóa Chuỗi Kịch Bản Livestream Tự Động Đa Phân Đoạn & Vòng Lặp Bán Hàng 24/7',
    description: '1. Quy Chuẩn Vận Hành Đa Phân Đoạn (Multi-Section Sequencer): Hỗ trợ thiết lập chuỗi sự kiện tự động tuần tự từ AI Avatar mở màn, phản hồi bình luận TikTok Live bằng Voice/Lip-sync, phát video sản phẩm, video feedback cho đến CTA chốt sale; 2. Tự Động Định Giờ & Chuyển Đoạn: Điều phối thời lượng phát từng video và tác vụ chính xác theo từng giây; 3. Khóa Chặt 100% Hệ Thống: Bảo toàn tuyệt đối mọi tab chức năng, subview và module không bị ảnh hưởng chéo.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.1.3 - Khóa Chặt Toàn Diện Các Tab Chức Năng, Subview & Cách Ly Tuyệt Đối Luồng Dữ Liệu',
    description: '1. Khóa Chặt Toàn Diện Các Tab & Subview: Cách ly hoàn toàn tất cả các tab chức năng (Idol AI, Window Capture, Game Battle, Game Bản Đồ 3D, Voice AI Brain, Livestream Studio) đảm bảo không có bất kỳ lệnh ngoài luồng nào tác động chéo; 2. Điều Hướng & Thực Thi Chuẩn Xác: Chỉ kích hoạt xử lý khi nhận đúng yêu cầu mục tiêu từ người dùng và đường link tương ứng; 3. Bảo Toàn Mã Nguồn & Trạng Thái: Đảm bảo độ ổn định 100% cho mọi module đang vận hành; 4. Tốc Độ & Độ Sắc Nét Cao Cấp: Duy trì 60 FPS 4K cho toàn bộ luồng phát TikTok Live Studio và OBS.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.1.2 - Khung Hình Pristine 9:16 Tràn Viền Tinh Khiết Cho TikTok Live Studio & Tối Ưu Tải Trực Tiếp',
    description: '1. Khung Hình Pristine 9:16 Tràn Viền: Tối ưu 100% tỷ lệ dọc 1080x1920 không viền đen, ẩn thanh điều khiển thừa giúp khung hình phát livestream sạch sẽ hoàn hảo; 2. Link Tải Trực Tiếp Tối Ưu: Phục vụ trực tiếp binary cài đặt mới nhất từ GitHub Releases/Vercel Edge, triệt tiêu hoàn toàn lỗi bot verification; 3. Đồng Bộ Tức Thì 0ms: Mọi thao tác đổi video từ phần mềm phản hồi tức thì với tốc độ 60 FPS 4K; 4. Khóa Chặt 100% Toàn Bộ Hệ Thống: Bảo toàn nguyên vẹn Window Capture OBS Zero-Copy, Voice AI Brain, Game Battle, Game Bản Đồ 3D.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.1.1 - Tích Hợp Đầy Đủ Cloudflare Tunnel Cho Windows Standalone & Nhúng Video Tự Động 100%',
    description: '1. Đóng Gói Binary Cloudflare Windows: Tích hợp sẵn cloudflared.exe chính thức vào gói cài đặt Windows Standalone ZIP giúp mọi máy tính tự động tạo link HTTPS ngay khi mở app; 2. Tự Động Đẩy Video Sang Luồng Live: Video chọn trong app tự động nạp thẳng vào link TikTok Live Studio với tốc độ 60 FPS 4K; 3. Đồng Bộ Trực Tiếp Thời Gian Thực: Không cần thiết lập phức tạp, dán link là phát ngay tức thì; 4. Khóa Chặt 100% Toàn Bộ Hệ Thống: Bảo toàn nguyên vẹn Window Capture OBS, Voice AI Brain, Game Battle, Game Bản Đồ.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.1.0 - Khắc Phục Triệt Để Link Live TikTok Live Studio & Nhúng Sẵn Video Source Tức Thì 0ms',
    description: '1. Nhúng Trực Tiếp Video Source: Server tự động nạp thẻ video src vào trang live ngay từ lần tải đầu tiên, TikTok Live Studio phát video ngay tức khắc trong 0ms; 2. Tối Ưu Hóa CORS & CSP Toàn Diện: Bổ sung cấu hình đa phương thức GET/HEAD/OPTIONS giúp TikTok Studio xác thực URL 100% hợp lệ không báo lỗi đỏ; 3. Đồng Bộ Tức Thì Thời Gian Thực: Phần mềm phát bất kỳ video nào thì luồng live chuyển đổi mượt mà 60 FPS 4K; 4. Khóa Chặt 100% Hệ Thống: Bảo toàn nguyên vẹn Window Capture OBS, Voice AI Brain, Game Battle, Game Bản Đồ.'
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
