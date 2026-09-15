import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle, X, ChevronRight, Zap, Star, Download, Laptop, Apple } from 'lucide-react';
import { downloadWindows, downloadMac } from '../../utils/downloadOS';

export const APP_VERSION = '3.0.3';
export const RELEASE_DATE = '15/09/2026';

export const UPDATE_NOTES = [
  {
    title: '⚡ Bản Cập Nhật Hotfix v3.0.3 - Khắc Phục Triệt Để Lỗi Khởi Động Giao Diện & Tối Ưu Tốc Độ 0ms',
    description: 'Chuyển đổi toàn bộ thư viện phân tích tài liệu (PDF & Word Parser) sang cơ chế Lazy-Loading trên nền ES2022 Native, loại bỏ hoàn toàn lỗi ReferenceError khi giải nén mở phần mềm, đảm bảo giao diện chính khởi động tức thì 100% mượt mà.'
  },
  {
    title: '🛍️ Bản Cập Nhật v3.0.2 - Tự Động Ghim Sản Phẩm TikTok Shop (shop.tiktok.com) & Vượt Captcha 24/7',
    description: 'Nâng cấp toàn diện bộ máy Ghim Sản Phẩm Thông Minh: Tự động ghim từ shop.tiktok.com và TikTok Live Studio theo chu kỳ xoay vòng, câu thoại AI hoặc bình luận khách hàng; tích hợp thanh đồng bộ giỏ hàng 1-chạm và hệ thống AI giải Captcha ngầm 24/7 tức thì 0ms.'
  },
  {
    title: '🔥 Bản Cập Nhật Hotfix v3.0.1 - Tối Ưu Live Video AI Voice & Bộ Não Tương Tác Sự Kiện',
    description: 'Nâng cấp toàn diện bộ điều phối Live Coordinator: đảm bảo 100% khi phát video live các sự kiện Chào Người Mới, Trả Lời Bình Luận, Follow, Tặng Quà, Chốt Đơn đều tự động kích hoạt Voice AI và Bộ Não AI siêu mượt; bổ sung nút bật/tắt Fallback câu hỏi chưa hiểu và tối ưu hệ thống Test Simulator.'
  },
  {
    title: '🌟 Bản Phát Hành Lớn AvaLive Studio VIP PRO v3.0.0 (Đầy Đủ 100% Mọi Chức Năng)',
    description: 'Bản phát hành chính thức thế hệ mới đồng bộ toàn diện tất cả các công nghệ: Auto Pin Sản Phẩm Đa Nguồn, Vượt Captcha 24/7, Multi-Avatar Studio, Kho 40+ Giọng AI Độc Bản DSP, LipSync Khớp Khẩu Hình, Shopee Live & Game Livestream PK tương tác.'
  },
  {
    title: '🎙️ Tối Ưu Hệ Thống Test Voice AI & Chạy Demo Sự Kiện 100% Phát Âm Thanh',
    description: 'Toàn bộ các nút Chạy Test Kịch Bản, Chạy Thử Sự Kiện (Chào Người Mới, Quà Tặng, Chốt Đơn, Shopee Live, Game PK) được nâng cấp hệ thống âm thanh siêu bền vững 3-Tier Fallback, đảm bảo 100% phát ra Voice AI chuẩn xác và sinh động ngay khi bấm kiểm tra.'
  },
  {
    title: '🍎 1-Click Launcher macOS Chạy Mượt Mà Tuyệt Đối (Chay_App_Mac_Linux.command)',
    description: 'Khắc phục triệt để lỗi mở ứng dụng trên Mac. Launcher tự động phát hiện Node/NPM trên mọi dòng chip Apple Silicon (M1/M2/M3/M4) & Intel Mac, tự động giải phóng port 3001 và mở trình duyệt điều khiển ngay lập tức.'
  },
  {
    title: '👄 Video LipSync Đồng Bộ Khẩu Hình Miệng 100% Tuyệt Đối',
    description: 'Đồng bộ chuyển động nhép miệng của video AI theo thời gian thực: khi AI cất giọng đọc thì video nhép miệng mượt mà, khi dứt câu thoại thì video dừng chuyển động miệng chính xác từng frame cho cả TikTok Live, Shopee Live và OBS Studio.'
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
