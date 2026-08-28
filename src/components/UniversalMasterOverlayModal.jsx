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
 * 👑 MODAL TRUNG TÂM LIÊN KẾT TIKTOK LIVE STUDIO & OBS STUDIO (ĐẲNG CẤP CHUYÊN NGHIỆP)
 * - Mỗi 1 Dự Án là 1 Link Riêng Biệt, có nút Sao Chép & Xem Thử độc lập
 * - Hỗ trợ cả 2 chế độ: Link Local IP (127.0.0.1) & Link Cloud Vercel Online
 */
export default function UniversalMasterOverlayModal({ isOpen, onClose }) {
  const [copiedId, setCopiedId] = useState(null);
  const [linkEnv, setLinkEnv] = useState('local'); // 'local' | 'cloud'

  if (!isOpen) return null;

  const currentPort = typeof window !== 'undefined' && window.location.port ? window.location.port : '5173';
  const localBase = `http://127.0.0.1:${currentPort}`;
  const cloudBase = 'https://avalivepro.vercel.app';
  const activeBase = linkEnv === 'local' ? localBase : cloudBase;

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
      description: 'Phát video người Live / AI Idol 60FPS sạch 100% không dính rác, tự động lặp không bao giờ đen màn hình.',
      path: '/idol',
      directUrl: `${activeBase}/idol`
    },
    {
      id: 'bando',
      name: 'DỰ ÁN 2: GAME BẢN ĐỒ VIỆT NAM (63 TỈNH THÀNH)',
      tag: 'TƯƠNG TÁC CAO',
      tagColor: 'from-amber-500 to-yellow-600',
      icon: Flag,
      iconColor: 'text-amber-400',
      bgColor: 'border-amber-500/30 bg-amber-950/20 hover:border-amber-400/60',
      description: 'Game cắm cờ 63 tỉnh thành Việt Nam 3D ghép cờ thời gian thực khi khán giả tặng quà TikTok Live.',
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
      description: 'Võ đài chiến đấu chia 2 phe PK kịch tính, tự động tung skill và hiệu ứng khi có tương tác bình luận & quà.',
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
      description: 'Studio phát sóng 4K chuyên nghiệp tích hợp Webcam, phông nền ảo, hiệu ứng làm đẹp và video RTMP.',
      path: '/studio',
      directUrl: `${activeBase}/studio`
    },
    {
      id: 'dance',
      name: 'DỰ ÁN 5: SÀN NHẢY 3D DANCE FLOOR',
      tag: 'ÂM NHẠC SÔI ĐỘNG',
      tagColor: 'from-purple-500 to-fuchsia-600',
      icon: Music,
      iconColor: 'text-purple-400',
      bgColor: 'border-purple-500/30 bg-purple-950/20 hover:border-purple-400/60',
      description: 'Sàn nhảy vũ đạo 3D chuyển động theo điệu nhạc sôi động và hiệu ứng ánh sáng bắt mắt.',
      path: '/dance',
      directUrl: `${activeBase}/dance`
    },
    {
      id: 'master',
      name: 'DỰ ÁN TOÀN NĂNG: 1 LINK DUY NHẤT (TỰ ĐỔI CẢNH THEO PHẦN MỀM)',
      tag: 'TIỆN LỢI NHẤT',
      tagColor: 'from-cyan-500 to-emerald-500',
      icon: Radio,
      iconColor: 'text-cyan-300',
      bgColor: 'border-cyan-400/60 bg-gradient-to-br from-cyan-950/40 via-[#0E1B33] to-blue-950/40 shadow-lg shadow-cyan-950/50',
      description: '1 Link thông minh tự động chuyển đổi giữa cả 5 dự án khi anh bấm nút trên phần mềm (không cần đổi link trong TikTok Live Studio).',
      path: '/live',
      directUrl: `${activeBase}/live`
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
              <span>DANH SÁCH ĐƯỜNG LINK TỪNG DỰ ÁN CHO TIKTOK LIVE STUDIO</span>
            </h2>
            <p className="text-[11.5px] text-gray-400 mt-0.5">
              Mỗi dự án 1 đường link riêng biệt — Tự động kết nối 100% thời gian thực
            </p>
          </div>
        </div>

        {/* Bộ lọc Môi Trường Link: Localhost vs Cloud Vercel */}
        <div className="flex items-center justify-between gap-2 p-1.5 bg-black/70 rounded-2xl border border-white/10 shrink-0">
          <div className="flex items-center gap-1.5 flex-1">
            <button
              onClick={() => setLinkEnv('local')}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                linkEnv === 'local'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-950/50'
                  : 'text-gray-400 hover:text-white bg-transparent'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Link Chạy Máy Local (127.0.0.1)</span>
            </button>

            <button
              onClick={() => setLinkEnv('cloud')}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                linkEnv === 'cloud'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-950/50'
                  : 'text-gray-400 hover:text-white bg-transparent'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Link Cloud Vercel (Online)</span>
            </button>
          </div>
        </div>

        {/* Danh sách các Dự án (Mỗi Dự Án 1 Card Riêng Biệt Đẳng Cấp) */}
        <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
          {projects.map((proj) => {
            const Icon = proj.icon;
            const isCopied = copiedId === proj.id;

            return (
              <div 
                key={proj.id}
                className={`p-4 rounded-2xl border transition-all ${proj.bgColor} space-y-2.5 relative`}
              >
                {/* Header Dự Án */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-black/40 border border-white/10">
                      <Icon className={`w-4 h-4 ${proj.iconColor}`} />
                    </div>
                    <span className="text-xs sm:text-sm font-black text-white tracking-wide">
                      {proj.name}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase text-white bg-gradient-to-r ${proj.tagColor} shadow-xs`}>
                    {proj.tag}
                  </span>
                </div>

                <p className="text-[11.5px] text-gray-300 leading-relaxed">
                  {proj.description}
                </p>

                {/* Input Link & Nút Bấm */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-0.5">
                  <input
                    type="text"
                    readOnly
                    value={proj.directUrl}
                    className="w-full sm:flex-1 px-3 py-2 rounded-xl bg-black/70 border border-white/15 text-xs text-cyan-200 font-mono font-bold focus:outline-none select-all"
                  />

                  <div className="flex items-center gap-1.5 w-full sm:w-auto">
                    <button
                      onClick={() => handleCopy(proj.directUrl, proj.id)}
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95 ${
                        isCopied 
                          ? 'bg-emerald-600 text-white'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>ĐÃ SAO CHÉP!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>SAO CHÉP LINK</span>
                        </>
                      )}
                    </button>

                    <a
                      href={proj.directUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1"
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

        {/* Hướng dẫn 3 bước */}
        <div className="p-3 rounded-2xl bg-black/50 border border-white/10 text-xs shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-yellow-300 font-bold text-[11.5px]">
            <Zap className="w-4 h-4 text-yellow-400 shrink-0 animate-pulse" />
            <span>Cách dùng: Mở TikTok LIVE Studio → Thêm nguồn "Trình duyệt" → Dán link của dự án cần phát!</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 font-bold text-xs cursor-pointer transition-all"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
