import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle, X, ChevronRight, Zap, Star, Download, Laptop, Apple } from 'lucide-react';
import { downloadWindows, downloadMac } from '../../utils/downloadOS';

export const APP_VERSION = '5.2.6';
export const RELEASE_DATE = '30/09/2026';

export const UPDATE_NOTES = [
  {
    title: '⚡ Bản Cập Nhật v5.2.6 - Khôi Phục Toàn Diện Bảng Điều Khiển Vượt Captcha AI 24/7 & Tích Hợp Hệ Thống AUTO GHIM PRO',
    description: '1. Khôi phục hoàn chỉnh Dashboard Vượt Captcha AI 24/7 bao gồm: Radar bẻ khóa AI đa nền tảng, Anti-detect Proxy, Cloudflare Turnstile bypass, Logs Terminal realtime và Lịch sử giải mã đa luồng. 2. Tích hợp trực tiếp tiện ích AUTO GHIM PRO chuẩn shop.tiktok.com với 3 chế độ Ghim Random, Ghim Chỉ Định, Ghim 1 Mã Cố Định và chu kỳ luân phiên tự động.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.2.5 - Nâng Cấp Tiện Ích AUTO GHIM PRO Chuẩn shop.tiktok.com & Tối Ưu Hóa Giao Diện Tự Động Ghim',
    description: '1. Tái cấu trúc giao diện tiện ích AUTO GHIM PRO chuyên dụng cho TikTok Shop (shop.tiktok.com). 2. Loại bỏ hoàn toàn hiển thị sản phẩm giả lập.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.2.4 - Chuyển Hướng Trực Tiếp 100% Đến Trang Bán Hàng TikTok Shop Seller Thật Của Đơn Vị Bán',
    description: '1. Đồng bộ sản phẩm từ shop.tiktok.com và tiếp thị liên kết: Khi khách hàng/người xem bấm vào bất kỳ sản phẩm nào hiển thị hoặc ghim trên phiên live, hệ thống lập tức mở trực tiếp trang sản phẩm & thanh toán thật trên TikTok Shop của đơn vị Seller bán hàng.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.2.3 - Tự Động Hóa Ghim Sản Phẩm 24/7 Thay Thế Hoàn Toàn Thao Tác Thủ Công Trên TikTok Shop & TikTok Live Studio',
    description: '1. Chế độ Tự Động Ghim Sản Phẩm (Auto Pin 24/7) chạy ngầm xuyên suốt: Khi Streamer liên kết sản phẩm từ shop.tiktok.com, hệ thống tự động ghim sản phẩm vào đúng vị trí ghim của TikTok Live Studio mà streamer không cần phải thao tác bấm thủ công. 2. Tự động luân phiên và thông minh nhận diện ghim sản phẩm khi AI nói, video clip sản phẩm phát hoặc khán giả hỏi trong bình luận.'
  },
  {
    title: '🛍️ Bản Cập Nhật v5.2.1 - Khắc Phục Triệt Để Lỗi 404 & Chuyển Hướng Trực Tiếp Đến Đúng Trang Mua Hàng TikTok Shop / Shopee Của Seller',
    description: '1. Khắc phục triệt để lỗi "Không thể tìm thấy tài khoản này" (404) khi bấm vào sản phẩm ghim trên livestream: Hệ thống tự động chuyển hướng chuẩn xác 100% đến trang tìm kiếm và đặt mua trực tiếp của sản phẩm trên TikTok Shop / Shopee.'
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
