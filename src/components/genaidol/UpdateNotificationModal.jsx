import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle, X, ChevronRight, Zap, Star, Download, Laptop, Apple } from 'lucide-react';
import { downloadWindows, downloadMac } from '../../utils/downloadOS';

export const APP_VERSION = '5.4.36';
export const RELEASE_DATE = '01/10/2026';

export const UPDATE_NOTES = [
  {
    title: '⚡ Bản Cập Nhật v5.4.35 - Khóa Chặn Triệt Để Lỗi Tự Động Bật Sân Khấu Chính Khi Đã Ngắt Kết Nối',
    description: '1. Khóa Chặn Hệ Thống Đồng Bộ Ở Cấp Độ Lõi: Sau khi người dùng nhấn Ngắt Kết Nối hoặc Tắt Tất Cả, Sân Khấu Chính sẽ bị khóa chặt 100%. Các luồng dữ liệu tự động từ Sân Khấu Phụ (Idol Studio) sẽ bị tường lửa chặn lại hoàn toàn, không thể tự động bắn tín hiệu đè lên Sân Khấu Chính. Màn hình Sân Khấu Chính sẽ duy trì trạng thái đóng băng đen hoàn toàn đúng như chỉ đạo của người dùng. 2. Loại Bỏ Triệt Để Lỗi Tự Phát Video: Bất kỳ lệnh điều khiển video nào cũng không thể vượt quyền khi Đồng Bộ đang ở trạng thái Tắt.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.34 - Sửa Lỗi Không Lưu Tùy Chỉnh Voice, Sửa Chớp Nháy Sân Khấu & Tối Ưu Text Chat',
    description: '1. Lưu Tùy Chỉnh Tốc Độ & Âm Lượng Voice Vĩnh Viễn: Người dùng thiết lập âm lượng và tốc độ ở sự kiện Chào Người Mới sẽ được hệ thống lưu thẳng vào bộ nhớ gốc, thoát app vào lại vẫn giữ nguyên 100%. 2. Sửa Dứt Điểm Lỗi Chớp Nháy Video (Flicker) Trên Sân Khấu Chính: Cấu trúc lại luồng DOM video, loại bỏ hiện tượng nháy đen khi nhận đường link mới hoặc thay đổi nhân vật. 3. Sửa Lỗi Cắt Khung Hình (Cắt đầu đít): Cập nhật cơ chế hiển thị 9:16 (Contain) chuẩn 100% không cắt góc trên TikTok Live Studio. 4. Tách Biệt Text Chat & Voice: Phần chữ đẩy lên màn hình chat TikTok Live chỉ hiển thị đúng câu trả lời từ khóa, gọn gàng và không dính liền với câu chào mở đầu.'
  },

  {
    title: '⚡ Bản Cập Nhật v5.4.25 - Sửa Triệt Để Âm Lượng Voice AI Cho Từng Sự Kiện, Kích Hoạt Bộ Quy Tắc Từ Khóa Phản Hồi Cả Text & Voice Tức Thì',
    description: '1. Sửa Triệt Để Âm Lượng Voice AI: Người dùng cài đặt âm lượng bao nhiêu % cho từng sự kiện/voice thì khi AI phát trên live sẽ phát ĐÚNG mức âm lượng đó, không bị nhân chồng hay reset về 100%. Chuẩn hóa tự động giá trị 0-100% → 0.0-1.0 xuyên suốt toàn bộ pipeline. 2. Kích Hoạt Bộ Quy Tắc Từ Khóa Đầy Đủ: Khắc phục lỗi bình luận chào hỏi ("chào", "hi", "chào shop") và mã sản phẩm ("1", "2") bị bộ lọc trivial chặn mất TRƯỚC KHI đến được bộ khớp từ khóa. Giờ đây AI phản hồi đúng câu trả lời đã chuẩn bị sẵn cho từng từ khóa, hiện cả Text lẫn Voice ngay lập tức. 3. Giữ Nguyên 100% Kết Nối TikTok ID & Auto Ghim Sản Phẩm TikTok Shop.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.24 - Nâng Cấp Gói Tải Về Windows & Mac Mới Nhất v5.4.24, Đồng Bộ Hóa 100% Endpoint Tải Trực Tiếp & Tối Ưu Thông Báo Cập Nhật',
    description: '1. Nâng Cấp Gói Tải Về Windows & macOS v5.4.24: Tự động đóng gói và phục vụ trực tiếp file ZIP cài đặt mới nhất v5.4.24 qua tất cả các cổng tải (/api/download-windows, /api/download-mac, nút Tải Về trên giao diện và modal). Khắc phục dứt điểm tình trạng tải nhầm phiên bản cũ. 2. Đồng Bộ Hóa Toàn Diện Hệ Thống Tải Về Siêu Tốc: Kết nối trực tiếp với CDN Edge Accelerator tải 50MB/s - 100MB/s không qua trung gian, không bị chặn link. 3. Tinh Gọn Bảng Thông Báo Cập Nhật: Hiển thị nổi bật phiên bản đang sử dụng và các nâng cấp mới nhất, tự động lược bỏ các thông báo cũ để streamer dễ dàng nắm bắt tính năng mới. 4. Khóa Chặt 100% Toàn Bộ Các Tab Chức Năng Khác.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.23 - Khắc Phục Triệt Để Âm Lượng Voice AI (Bộ Não & 14 Sự Kiện), Kết Nối TikTok/Shopee Tức Thì 0ms, Chuẩn Hóa 7 Bước Trả Lời Bình Luận & Auto Ghim Sản Phẩm',
    description: '1. Bảo Toàn & Lưu Trữ 100% Mức Âm Lượng Voice AI: Người dùng chỉnh bao nhiêu % âm lượng (0% - 100%) trong Bộ Não AI và 14 sự kiện thì khi phát ra live sẽ phát chính xác bấy nhiêu âm lượng, không bị reset về 100%. 2. Tăng Tốc Kết Nối TikTok Live Studio & Shopee 0ms: Chuyển đổi sang kiến trúc kết nối song song (Parallel) giảm thời gian kết nối từ 15s xuống tức thì 0ms, phản hồi sự kiện phòng live ngay lập tức. 3. Chuẩn Hóa 7 Bước Trả Lời Bình Luận: Đọc lại câu hỏi -> Ưu tiên từ khóa cài đặt sẵn (không ghép câu chăm sóc) -> Bộ Não AI Gemini -> Fallback khéo léo -> Ghép câu gợi mở inbox -> Gửi Text trước -> Phát Voice sau. 4. Tự Động Kích Hoạt Ghim Sản Phẩm: Khởi chạy auto rotation loop và ghim ngay sản phẩm đầu tiên khi bắt đầu live hoặc kết nối TikTok.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.22 - Khử Trùng Lặp Chào Người Xem, Bộ Lọc Bình Luận Vô Nghĩa & Xóa Banner TikTok Shop Khỏi Tab Chốt Đơn',
    description: '1. Khử Trùng Lặp Chào Khách Tuyệt Đối: Mỗi khán giả mới vào xem live chỉ được chào đúng 1 lần duy nhất theo chuỗi tuần tự Round-Robin. 2. Bộ Lọc Bình Luận Thông Minh: Tự động bỏ qua các bình luận chào hỏi đơn giản hoặc emoji để tập trung trả lời tư vấn sản phẩm. 3. Xóa Bỏ Banner Đồng Bộ Khỏi Tab Chốt Đơn: Giao diện trực quan, sạch sẽ, chỉ tập trung vào danh mục mã hàng livestream.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.21 - Xóa Bỏ Hoàn Toàn Sản Phẩm Demo/Bịa Đặt, Chỉ Ghim 100% Sản Phẩm Thật Từ shop.tiktok.com & Hiển Thị Độc Quyền Trên Phiên Live',
    description: '1. Xóa Sạch Hoàn Toàn Sản Phẩm Mẫu/Demo Bịa Đặt: Loại bỏ triệt để các dữ liệu giả lập (FitAbCore, Con Lăn, Havata, EiraFit...). Hệ thống chỉ đồng bộ và sử dụng 100% sản phẩm thật được lấy trực tiếp từ đường link trang quản trị TikTok Shop (shop.tiktok.com / seller-vn.tiktok.com) của chính người dùng. 2. Hiển Thị Độc Quyền Trực Tiếp Trên Phiên Live (OBS / TikTok Live Studio / Stream Output): Loại bỏ thẻ ghim đè trên giao diện phần mềm quản trị, thẻ sản phẩm chỉ xuất hiện chuyên nghiệp trực tiếp trên luồng phát sóng của khán giả. 3. Tự Động Đồng Bộ & Ghim Chuẩn Xác Theo Cấu Hình: Khi phát live, hệ thống tự động nhận diện và ghim chính xác các sản phẩm thật theo chu kỳ hẹn giờ, từ khóa comment của khách hoặc giọng nói AI.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.20 - Chuẩn Hóa Voice AI Cho Từng Sự Kiện/Nhân Vật, Ngăn Màn Hình Đen Khi Chuyển Tab Cài Đặt & Ghim Sản Phẩm shop.tiktok.com',
    description: '1. Chuẩn Hóa Chuẩn Xác Voice AI Setup Cho Từng Sự Kiện / Nhân Vật: Giọng đọc phát ra luôn đúng 100% theo cấu hình giọng mà người dùng đã thiết lập trong Voice AI. Cài đặt voice cho sự kiện nào thì đọc đúng voice đó, kèm âm lượng, tốc độ, cao độ riêng biệt. 2. Ngăn Chặn Tuyệt Đối Màn Hình Live Bị Đen Khi Chuyển Tab: Video sân khấu chính luôn phát liên tục 100% không bị ngắt quãng. 3. Hiển Thị Thẻ Ghim Sản Phẩm TikTok Shop Trực Tiếp Trên Live & OBS: Thẻ sản phẩm được render nổi bật ngay trên sân khấu chính và luồng OBS / TikTok Live Studio.'
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

        {/* Nút Tải Cài Đặt Mac & Windows Tăng Tốc Siêu Nhanh */}
        <div className="px-5 py-3.5 bg-black/40 border-b border-white/10 flex flex-col sm:flex-row gap-2.5 items-center justify-between shrink-0">
          <div className="text-left">
            <p className="text-[11px] font-bold text-gray-300 flex items-center gap-1.5">
              <span>Tải bộ cài đặt độc lập v{APP_VERSION}:</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-black animate-pulse">⚡ 50MB/s</span>
            </p>
            <p className="text-[10px] text-gray-400">Tăng tốc Cloudflare CDN, tải trực tiếp 0% lỗi</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={downloadMac}
              className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all hover:scale-105 flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md"
              title="Tải trực tiếp bản cài đặt Mac (.zip) với tốc độ siêu nhanh"
            >
              <Apple size={13} />
              <span>Bản Mac (.zip)</span>
            </button>
            <button
              onClick={downloadWindows}
              className="px-3 py-1.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all hover:scale-105 flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-lg shadow-cyan-500/30"
              title="Tải trực tiếp bản cài đặt Windows (.zip) với tốc độ siêu nhanh"
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
