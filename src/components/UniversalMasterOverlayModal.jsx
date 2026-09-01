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
  Swords,
  Layers,
  Tv,
  Globe,
  Monitor,
  ShieldCheck
} from 'lucide-react';

/**
 * 👑 MODAL LIÊN KẾT TIKTOK LIVE STUDIO & OBS STUDIO ĐẲNG CẤP CHUYÊN NGHIỆP
 * - 1 ĐƯỜNG LINK DUY NHẤT TOÀN NĂNG: Tự động chuyển cảnh giữa Idol, Game Bản Đồ, Game PK theo phần mềm
 * - Đầy đủ các link dự án độc lập (/idol, /bando, /battle, /studio)
 * - Đa kênh kết nối: IP 127.0.0.1 (không lỗi DNS), Cloud Vercel, Domain nip.io, Localhost
 */
export default function UniversalMasterOverlayModal({ isOpen, onClose }) {
  const [copiedId, setCopiedId] = useState(null);
  const [selectedLinkType, setSelectedLinkType] = useState('ip'); // 'ip' | 'cloud' | 'domain' | 'localhost'

  if (!isOpen) return null;

  const currentPort = typeof window !== 'undefined' && window.location.port ? window.location.port : '3001';
  const currentProtocol = typeof window !== 'undefined' && window.location.protocol ? window.location.protocol : 'http:';

  // 4 Định dạng link tương thích 100% mọi phiên bản TikTok LIVE Studio & OBS
  const baseMap = {
    ip: `${currentProtocol}//127.0.0.1:${currentPort}`,
    cloud: 'https://avalivepro.vercel.app',
    domain: `http://127.0.0.1.nip.io:${currentPort}`,
    localhost: `${currentProtocol}//localhost:${currentPort}`
  };

  const activeBase = baseMap[selectedLinkType] || baseMap.ip;
  const masterLink = `${activeBase}/live`;

  // Danh sách các dự án với đường link riêng biệt 100%
  const projects = [
    {
      id: 'idol',
      name: 'DỰ ÁN 1: LIVE AI IDOL & VIDEO NỀN',
      tag: 'HOT NHẤT',
      tagColor: 'from-pink-500 to-rose-600',
      icon: Video,
      iconColor: 'text-pink-400',
      bgColor: 'border-pink-500/30 bg-pink-950/20 hover:border-pink-400/60',
      description: 'Phát video người Live / AI Idol chuẩn kích thước 9:16 (1080x1920) 60FPS sạch 100% không lệch khung hình.',
      path: '/idol',
      directUrl: `${activeBase}/idol`
    },
    {
      id: 'bando',
      name: 'DỰ ÁN 2: GAME BẢN ĐỒ VIỆT NAM (63 TỈNH THÀNH)',
      tag: 'CẮM CỜ 3D',
      tagColor: 'from-amber-500 to-yellow-600',
      icon: Flag,
      iconColor: 'text-amber-400',
      bgColor: 'border-amber-500/30 bg-amber-950/20 hover:border-amber-400/60',
      description: 'Game cắm cờ 63 tỉnh thành Việt Nam 3D chuẩn kích thước 9:16 (1080x1920) khi khán giả tặng quà.',
      path: '/bando',
      directUrl: `${activeBase}/bando`
    },
    {
      id: 'battle',
      name: 'DỰ ÁN 3: GAME CHIẾN ĐẤU PK (TIKTOK LIVE BATTLE)',
      tag: 'HÚT QUÀ TẶNG',
      tagColor: 'from-red-500 to-purple-600',
      icon: Swords,
      iconColor: 'text-red-400',
      bgColor: 'border-red-500/30 bg-red-950/20 hover:border-red-400/60',
      description: 'Võ đài chiến đấu chia 2 phe PK kịch tính chuẩn kích thước 9:16 (1080x1920) khi có quà & bình luận.',
      path: '/battle',
      directUrl: `${activeBase}/battle`
    },
    {
      id: 'studio',
      name: 'DỰ ÁN 4: PHÒNG DỰNG LIVE STUDIO 4K',
      tag: 'CHUYÊN NGHIỆP',
      tagColor: 'from-blue-500 to-indigo-600',
      icon: Tv,
      iconColor: 'text-blue-400',
      bgColor: 'border-blue-500/30 bg-blue-950/20 hover:border-blue-400/60',
      description: 'Studio phát sóng 4K chuyên nghiệp tích hợp Webcam thực, phông nền ảo và hiệu ứng làm đẹp.',
      path: '/studio',
      directUrl: `${activeBase}/studio`
    }
  ];

  const handleCopy = (url, id) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 animate-fadeIn select-none font-sans">
      <div className="glass-panel p-5 sm:p-7 rounded-[32px] border border-cyan-500/40 max-w-3xl w-full text-left space-y-4 shadow-2xl bg-[#090A10]/98 max-h-[92vh] flex flex-col relative">
        
        {/* Nút Đóng Modal */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer transition-all hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-3.5 shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-glow-cyan">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>DANH SÁCH ĐƯỜNG LINK CHO TIKTOK LIVE STUDIO & OBS STUDIO</span>
            </h2>
            <p className="text-[11.5px] text-gray-400 mt-0.5">
              Tự động kết nối 100% thời gian thực — Mở Game hay Video là TikTok Studio tự chuyển cảnh ngay
            </p>
          </div>
        </div>

        {/* 🌟 1 ĐƯỜNG LINK DUY NHẤT TOÀN NĂNG (HERO CARD DUY NHẤT - KHUYÊN DÙNG NHẤT) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-cyan-950/70 via-[#0D1628] to-blue-950/70 border-2 border-cyan-400/80 shadow-xl shadow-cyan-950/50 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span className="text-xs font-black text-cyan-300 uppercase tracking-wider">
                👑 1 LINK DUY NHẤT TOÀN NĂNG (TỰ ĐỔI CẢNH THEO PHẦN MỀM)
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
              ● TỰ ĐỘNG 100%
            </span>
          </div>

          <p className="text-[11.5px] text-gray-200 leading-relaxed">
            Dán <strong>DUY NHẤT 1 ĐƯỜNG LINK NÀY</strong> vào TikTok LIVE Studio hoặc OBS Studio: Khi bấm chọn <strong>Video Live Idol, Game Bản Đồ hay Game Chiến Đấu</strong> trên phần mềm, màn hình Live sẽ <strong>tự động chuyển cảnh tức thì</strong> mà không cần đổi link!
          </p>

          {/* 4 Tab Chọn Kiểu Kết Nối */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-black/70 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setSelectedLinkType('ip')}
              className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer ${
                selectedLinkType === 'ip'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-950/60 font-black'
                  : 'text-gray-400 hover:text-white bg-transparent'
              }`}
            >
              <Monitor className="w-3 h-3" />
              <span>1. Link IP (Khuyên dùng)</span>
            </button>

            <button
              onClick={() => setSelectedLinkType('cloud')}
              className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer ${
                selectedLinkType === 'cloud'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950/60 font-black'
                  : 'text-gray-400 hover:text-white bg-transparent'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>2. Link Cloud Online</span>
            </button>

            <button
              onClick={() => setSelectedLinkType('domain')}
              className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer ${
                selectedLinkType === 'domain'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-950/60 font-black'
                  : 'text-gray-400 hover:text-white bg-transparent'
              }`}
            >
              <Monitor className="w-3 h-3" />
              <span>3. Link Domain nip.io</span>
            </button>

            <button
              onClick={() => setSelectedLinkType('localhost')}
              className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer ${
                selectedLinkType === 'localhost'
                  ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-md font-black'
                  : 'text-gray-400 hover:text-white bg-transparent'
              }`}
            >
              <Monitor className="w-3 h-3" />
              <span>4. Link Localhost</span>
            </button>
          </div>

          {/* Ô Hiển Thị Link Toàn Năng & Nút Bấm */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-0.5">
            <input
              type="text"
              readOnly
              value={masterLink}
              className="w-full sm:flex-1 px-3.5 py-2.5 rounded-xl bg-black/80 border border-cyan-400/60 text-xs sm:text-sm text-cyan-200 font-mono font-bold focus:outline-none select-all shadow-inner"
            />

            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <button
                onClick={() => handleCopy(masterLink, 'master')}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg active:scale-95 ${
                  copiedId === 'master'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold shadow-cyan-950/60'
                }`}
              >
                {copiedId === 'master' ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>ĐÃ SAO CHÉP!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-white" />
                    <span>SAO CHÉP LINK TOÀN NĂNG</span>
                  </>
                )}
              </button>

              <a
                href={masterLink}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1"
                title="Mở tab mới xem thử ngay"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Xem Thử</span>
              </a>
            </div>
          </div>
        </div>

        {/* Danh sách các Dự án Độc Lập (Nếu ai cần link tĩnh cố định) */}
        <div className="space-y-2.5 overflow-y-auto flex-1 pr-1 custom-scrollbar">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 px-1">
            <Layers className="w-3.5 h-3.5 text-gray-500" />
            <span>HOẶC CHỌN LINK RIÊNG TỪNG DỰ ÁN (NẾU CẦN CỐ ĐỊNH 1 MÀN HÌNH):</span>
          </div>

          {projects.map((proj) => {
            const Icon = proj.icon;
            const isCopied = copiedId === proj.id;

            return (
              <div 
                key={proj.id}
                className={`p-3 rounded-2xl border transition-all ${proj.bgColor} space-y-2 relative`}
              >
                {/* Header Dự Án */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-black/40 border border-white/10">
                      <Icon className={`w-3.5 h-3.5 ${proj.iconColor}`} />
                    </div>
                    <span className="text-xs font-black text-white tracking-wide">
                      {proj.name}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase text-white bg-gradient-to-r ${proj.tagColor} shadow-xs`}>
                    {proj.tag}
                  </span>
                </div>

                {/* Input Link & Nút Bấm */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-0.5">
                  <input
                    type="text"
                    readOnly
                    value={proj.directUrl}
                    className="w-full sm:flex-1 px-3 py-1.5 rounded-xl bg-black/70 border border-white/15 text-xs text-cyan-200 font-mono font-bold focus:outline-none select-all"
                  />

                  <div className="flex items-center gap-1.5 w-full sm:w-auto">
                    <button
                      onClick={() => handleCopy(proj.directUrl, proj.id)}
                      className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95 ${
                        isCopied 
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white/15 hover:bg-white/25 text-white'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>ĐÃ SAO CHÉP</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>

                    <a
                      href={proj.directUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1"
                      title="Mở tab mới xem thử"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Xem</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hướng dẫn chi tiết cho OBS Studio & TikTok Live Studio */}
        <div className="p-3 rounded-2xl bg-black/70 border border-white/15 text-xs shrink-0 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-yellow-300 font-bold text-[11.5px]">
              <Zap className="w-4 h-4 text-yellow-400 shrink-0 animate-pulse" />
              <span>HƯỚNG DẪN KẾT NỐI TIKTOK LIVE STUDIO (CHỐNG LỖI 100%):</span>
            </div>
            <button
              onClick={onClose}
              className="px-3.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 font-bold text-xs cursor-pointer transition-all"
            >
              Đóng
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-300">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="font-bold text-cyan-300 flex items-center gap-1">🌐 Cách dán vào TikTok Studio:</span>
              <p className="text-gray-400 leading-relaxed">Thêm nguồn <b>Trình duyệt (Browser)</b> → Dán link đã sao chép → Đặt kích thước: <b>Chiều Rộng = 1080, Chiều Cao = 1920</b> (Chuẩn 9:16 dọc không bao giờ bị méo hình).</p>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="font-bold text-pink-300 flex items-center gap-1">💡 Mẹo xử lý khi báo lỗi đỏ:</span>
              <p className="text-gray-400 leading-relaxed">Nếu TikTok Studio báo đỏ <i>"Hãy nhập URL chính xác"</i>, hãy chọn tab <b>2. Link Cloud Online</b> hoặc <b>3. Link Domain nip.io</b> để nhận diện tên miền 100%!</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
