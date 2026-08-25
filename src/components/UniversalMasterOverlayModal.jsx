import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink, 
  Radio, 
  Zap, 
  CheckCircle2,
  X,
  Video,
  Music,
  Flag,
  Layers,
  ShieldCheck
} from 'lucide-react';

/**
 * 👑 MODAL 1 ĐƯỜNG LINK DUY NHẤT TOÀN NĂNG CHO TIKTOK LIVE STUDIO & OBS STUDIO
 * - Tự động đồng bộ thời gian thực 100% (0.00001s)
 * - Tự động chuyển đổi giữa AI Idol, Sàn Nhảy 3D, Game Bản Đồ, Game Chiến Đấu, Camera Studio
 * - Hoạt động hoàn hảo trên macOS, Windows và Cloud Web Vercel
 */
export default function UniversalMasterOverlayModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Lấy chính xác Origin hiện tại (hoạt động hoàn hảo trên cả Localhost, App Desktop macOS/Windows và Web Vercel)
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://127.0.0.1.nip.io:5173';
  const masterLink = `${currentOrigin.replace(/(localhost|127\.0\.0\.1)(?!\.nip\.io)/, '127.0.0.1.nip.io')}/?overlay=live`;

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(masterLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 animate-fadeIn select-none font-sans">
      <div className="glass-panel p-6 sm:p-7 rounded-[32px] border border-cyan-500/40 max-w-2xl w-full text-left space-y-5 shadow-2xl bg-[#090A10]/98 max-h-[92vh] overflow-y-auto relative">
        
        {/* Nút Đóng Modal */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer transition-all hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-glow-cyan">
            <Radio className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>ĐƯỜNG LINK DUY NHẤT TÍCH HỢP TIKTOK LIVE STUDIO & OBS</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              1 Link Kết Nối Toàn Bộ AI Idol, Sàn Nhảy 3D, Game Bản Đồ & Game PK Chiến Đấu
            </p>
          </div>
        </div>

        {/* 🌟 1 LINK DUY NHẤT TOÀN NĂNG (HERO CARD DUY NHẤT - KHÔNG CẦN CHỌN NHIỀU LINK) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/60 via-[#0D1628] to-blue-950/60 border-2 border-cyan-400/70 shadow-xl shadow-cyan-950/50 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span className="text-xs font-black text-cyan-300 uppercase tracking-wider">
                ★ 1 ĐƯỜNG LINK DUY NHẤT TOÀN NĂNG (TỰ ĐỘNG CHUYỂN CẢNH REALTIME 100%)
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
              ● KẾT NỐI TỰ ĐỘNG
            </span>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed">
            Dán <strong>DUY NHẤT 1 ĐƯỜNG LINK NÀY</strong> vào phần mềm <strong>TikTok LIVE Studio</strong> hoặc <strong>OBS Studio</strong>. Khi bạn chọn AI Idol, Sàn Nhảy, Game Bản Đồ hay Game Chiến Đấu trên bảng điều khiển, màn hình Live sẽ <strong>tự động chuyển cảnh tức thì</strong> mà không cần đổi link!
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            <input
              type="text"
              readOnly
              value={masterLink}
              className="w-full sm:flex-1 px-3.5 py-3 rounded-xl bg-black/80 border border-cyan-500/50 text-xs sm:text-sm text-cyan-200 font-mono font-bold focus:outline-none select-all shadow-inner"
            />
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleCopy}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-glow-cyan active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>ĐÃ SAO CHÉP!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-white" />
                    <span>SAO CHÉP LINK</span>
                  </>
                )}
              </button>

              <a
                href={masterLink}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                title="Mở tab mới xem thử trực tiếp"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Xem Thử</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2 text-pink-300">
              <Video className="w-4 h-4 shrink-0 text-pink-400" />
              <span className="truncate font-bold">Live AI Idol</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2 text-purple-300">
              <Music className="w-4 h-4 shrink-0 text-purple-400" />
              <span className="truncate font-bold">Sàn Nhảy 3D</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2 text-amber-300">
              <Flag className="w-4 h-4 shrink-0 text-amber-400" />
              <span className="truncate font-bold">Game Bản Đồ 63 Tỉnh</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2 text-red-300">
              <Layers className="w-4 h-4 shrink-0 text-red-400" />
              <span className="truncate font-bold">Game PK Chiến Đấu</span>
            </div>
          </div>
        </div>

        {/* Hướng dẫn 3 bước */}
        <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2 text-xs">
          <div className="font-bold text-yellow-300 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
            <span>Hướng dẫn tích hợp vào TikTok LIVE Studio & OBS (Cực kỳ đơn giản):</span>
          </div>
          <div className="space-y-1.5 text-gray-300 text-[11.5px] pl-1 leading-relaxed">
            <div>👉 <strong>Bước 1:</strong> Mở TikTok LIVE Studio hoặc OBS Studio → Bấm <strong>Thêm nguồn (+ Add Source)</strong> → Chọn <strong>Trình duyệt (Browser)</strong>.</div>
            <div>👉 <strong>Bước 2:</strong> Dán đường link ở trên vào ô <strong>URL</strong> (đặt độ phân giải 1080x1920 hoặc 1920x1080).</div>
            <div>👉 <strong>Bước 3:</strong> Bấm <strong>Áp dụng (Apply)</strong>. Toàn bộ hình ảnh, âm thanh, game và hiệu ứng sẽ hoạt động ngay lập tức!</div>
          </div>
        </div>

        {/* Footer info & close */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Tự động tối ưu trên macOS, Windows và Web Cloud Vercel</span>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 font-bold text-xs cursor-pointer transition-all"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
