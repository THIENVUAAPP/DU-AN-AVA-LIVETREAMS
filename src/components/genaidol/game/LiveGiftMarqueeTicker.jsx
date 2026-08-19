import React, { useState, useEffect, useRef } from 'react';
import { 
  Gift, Sparkles, Settings, Eye, EyeOff, Play, Pause, 
  ChevronRight, Flame, Shield, Trophy, Flag, Move
} from 'lucide-react';
import { 
  getGiftConfig, 
  saveGiftConfig, 
  DEFAULT_GIFT_MARQUEE_SETTINGS 
} from '../../../utils/giftSyncService';

export default function LiveGiftMarqueeTicker({
  mode = 'map', // 'map' | 'battle' | 'live_idol' | 'live_commerce'
  onOpenSettings,
  onGiftClick,
  customPositionStyle = null
}) {
  const [config, setConfig] = useState(() => getGiftConfig(mode));
  const [isPaused, setIsPaused] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [floatingPos, setFloatingPos] = useState(() => {
    try {
      const saved = localStorage.getItem(`avalive_gift_marquee_pos_${mode}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { x: 12, y: 70 };
  });

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Lắng nghe cập nhật cấu hình quà
  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail?.config) {
        setConfig(e.detail.config);
      } else {
        setConfig(getGiftConfig(mode));
      }
    };
    window.addEventListener('avalive_gift_config_updated', handleUpdate);
    return () => window.removeEventListener('avalive_gift_config_updated', handleUpdate);
  }, [mode]);

  const marquee = config.marquee || DEFAULT_GIFT_MARQUEE_SETTINGS;
  if (marquee.enabled === false) return null;

  // Lấy danh sách quà đang bật
  const regionalGifts = (config.regionalGifts || []).filter(g => g.enabled !== false);
  const standardGifts = (config.gifts || []).filter(g => g.enabled !== false);
  const allActiveGifts = [...regionalGifts, ...standardGifts];

  if (allActiveGifts.length === 0) return null;

  // Tính toán thời gian animation cuộn
  const getDurationSec = () => {
    const baseCount = Math.max(allActiveGifts.length, 6);
    if (marquee.speed === 'slow') return baseCount * 5;
    if (marquee.speed === 'fast') return baseCount * 2;
    return baseCount * 3.2; // normal
  };

  const durationSec = getDurationSec();

  // Kéo thả vị trí nếu ở mode floating
  const handleDragStart = (e) => {
    if (marquee.position !== 'floating') return;
    isDraggingRef.current = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = {
      x: clientX - floatingPos.x,
      y: clientY - floatingPos.y
    };
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchmove', handleDragMove, { passive: false });
    window.addEventListener('touchend', handleDragEnd);
  };

  const handleDragMove = (e) => {
    if (!isDraggingRef.current) return;
    if (e.cancelable) e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const newPos = {
      x: Math.max(0, Math.min(window.innerWidth - 200, clientX - dragStartRef.current.x)),
      y: Math.max(0, Math.min(window.innerHeight - 60, clientY - dragStartRef.current.y))
    };
    setFloatingPos(newPos);
  };

  const handleDragEnd = () => {
    isDraggingRef.current = false;
    window.removeEventListener('mousemove', handleDragMove);
    window.removeEventListener('mouseup', handleDragEnd);
    window.removeEventListener('touchmove', handleDragMove);
    window.removeEventListener('touchend', handleDragEnd);
    try {
      localStorage.setItem(`avalive_gift_marquee_pos_${mode}`, JSON.stringify(floatingPos));
    } catch (e) {}
  };

  // Kiểu dáng độ trong suốt
  const getOpacityClass = () => {
    if (marquee.opacityMode === 'solid' || marquee.opacityMode === 'semi_dark') {
      return 'bg-black/85 backdrop-blur-md border-amber-500/30 text-white shadow-2xl';
    }
    if (marquee.opacityMode === 'glassmorphism') {
      return 'bg-black/40 backdrop-blur-md border-white/20 text-white shadow-xl hover:bg-black/60';
    }
    // ultra_transparent (mặc định)
    return 'bg-black/15 backdrop-blur-[2px] border-white/10 hover:bg-black/45 text-white/95 transition-colors shadow-lg';
  };

  // Vị trí container
  const getPositionClass = () => {
    if (customPositionStyle) return '';
    if (marquee.position === 'top') {
      return 'fixed top-12 left-0 right-0 z-25 px-2 sm:px-4';
    }
    if (marquee.position === 'floating') {
      return 'fixed z-30 select-none';
    }
    // Mặc định: bottom (trên hint banner khoảng 38px)
    return 'fixed bottom-9 sm:bottom-11 left-0 right-0 z-25 px-1.5 sm:px-3';
  };

  // Render từng thẻ quà tặng trên bảng điện
  const renderGiftItem = (gift, key) => {
    const isRegional = Boolean(gift.regionTarget || gift.id?.startsWith('gift_region_'));
    let badgeBorder = 'border-white/10 hover:border-yellow-400/40 bg-black/30';
    let badgeText = 'text-gray-200';
    let subBadge = null;

    if (gift.regionTarget === 'north') {
      badgeBorder = 'border-red-500/40 bg-red-950/30 hover:border-red-400';
      badgeText = 'text-red-200';
      subBadge = <span className="text-[7.5px] px-1 py-0.2 rounded bg-red-500/30 text-red-300 font-bold">MB</span>;
    } else if (gift.regionTarget === 'central') {
      badgeBorder = 'border-amber-500/40 bg-amber-950/30 hover:border-amber-400';
      badgeText = 'text-amber-200';
      subBadge = <span className="text-[7.5px] px-1 py-0.2 rounded bg-amber-500/30 text-amber-300 font-bold">MT</span>;
    } else if (gift.regionTarget === 'south') {
      badgeBorder = 'border-emerald-500/40 bg-emerald-950/30 hover:border-emerald-400';
      badgeText = 'text-emerald-200';
      subBadge = <span className="text-[7.5px] px-1 py-0.2 rounded bg-emerald-500/30 text-emerald-300 font-bold">MN</span>;
    } else if (gift.priceToken >= 1000) {
      badgeBorder = 'border-yellow-400/50 bg-gradient-to-r from-amber-950/40 to-yellow-950/40 hover:border-yellow-300';
      badgeText = 'text-yellow-200 font-black';
      subBadge = <span className="text-[7.5px] px-1 py-0.2 rounded bg-yellow-500/30 text-yellow-300 font-bold animate-pulse">VIP</span>;
    }

    return (
      <div
        key={key}
        onClick={() => onGiftClick && onGiftClick(gift)}
        className={`inline-flex items-center gap-1.5 px-2 py-0.8 mx-1 rounded-full border ${badgeBorder} backdrop-blur-sm shrink-0 cursor-pointer transition-all hover:scale-105 select-none`}
        title={`Tặng "${gift.name}" (${gift.priceToken || 1} xu) -> +${gift.cells || gift.hpBuff || 1} ${mode === 'map' ? 'Ô Cờ' : 'HP'}`}
      >
        <span className="text-xs sm:text-sm drop-shadow-sm">{gift.icon}</span>
        <span className={`text-[9.5px] sm:text-[10.5px] font-bold ${badgeText} whitespace-nowrap`}>
          {gift.shortName || gift.name}
        </span>
        
        {subBadge}

        {marquee.showPrices !== false && (
          <span className="text-[8.5px] sm:text-[9px] font-mono font-bold text-yellow-300/90 bg-black/40 px-1.5 py-0.2 rounded-full border border-yellow-500/20 whitespace-nowrap">
            {gift.priceToken || 1} xu
          </span>
        )}

        {marquee.showCellsOrBuff !== false && (
          <span className="text-[8px] sm:text-[8.5px] font-mono font-black text-emerald-300/90 whitespace-nowrap">
            +{gift.cells || (mode === 'battle' ? `${gift.hpBuff}HP` : 1)} {mode === 'map' ? 'ô' : ''}
          </span>
        )}
      </div>
    );
  };

  return (
    <div 
      className={`${getPositionClass()} pointer-events-auto group`}
      style={
        marquee.position === 'floating'
          ? { top: `${floatingPos.y}px`, left: `${floatingPos.x}px` }
          : (customPositionStyle || {})
      }
    >
      {/* Vỏ bao bọc bảng điện viền phát sáng */}
      <div className={`relative flex items-center rounded-xl border ${getOpacityClass()} overflow-hidden transition-all duration-200`}>
        
        {/* Nút Kéo Thả (khi ở chế độ floating) */}
        {marquee.position === 'floating' && (
          <div 
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            className="px-1.5 py-1 bg-white/10 hover:bg-white/20 cursor-move text-gray-300"
            title="Kéo thả vị trí bảng điện"
          >
            <Move size={11} />
          </div>
        )}

        {/* Tiêu đề bảng điện LED cố định góc trái */}
        <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-red-600/60 via-amber-600/50 to-transparent border-r border-white/10 shrink-0 z-10 select-none">
          <Sparkles size={11} className="text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-yellow-200 drop-shadow">
            {marquee.tickerTitle || 'QUÀ TẶNG & CẮM CỜ:'}
          </span>
        </div>

        {/* VÙNG CUỘN MARQUEE LIÊN TỤC */}
        {!isCollapsed ? (
          <div 
            className="flex-1 overflow-hidden relative flex items-center py-0.5"
            onMouseEnter={() => marquee.pauseOnHover && setIsPaused(true)}
            onMouseLeave={() => marquee.pauseOnHover && setIsPaused(false)}
            onTouchStart={() => marquee.pauseOnHover && setIsPaused(true)}
            onTouchEnd={() => marquee.pauseOnHover && setIsPaused(false)}
          >
            <style>{`
              @keyframes avaliveMarqueeScroll {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
              .avalive-marquee-track {
                display: flex;
                width: max-content;
                animation: avaliveMarqueeScroll ${durationSec}s linear infinite;
              }
              .avalive-marquee-track.is-paused {
                animation-play-state: paused !important;
              }
            `}</style>

            <div className={`avalive-marquee-track ${isPaused ? 'is-paused' : ''}`}>
              {/* Lặp 2 lần danh sách quà để tạo hiệu ứng vô tận (infinite loop) */}
              <div className="flex items-center">
                {allActiveGifts.map((g, i) => renderGiftItem(g, `orig_${g.id}_${i}`))}
              </div>
              <div className="flex items-center" aria-hidden="true">
                {allActiveGifts.map((g, i) => renderGiftItem(g, `dup_${g.id}_${i}`))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 px-2 text-[9px] text-gray-400 italic">
            (Bảng điện quà tặng đã thu nhỏ)
          </div>
        )}

        {/* NÚT THAO TÁC NHANH GÓC PHẢI */}
        <div className="flex items-center gap-0.5 px-1 py-0.5 bg-black/40 border-l border-white/10 shrink-0 z-10">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title={isPaused ? "Tiếp tục cuộn bảng điện" : "Tạm dừng cuộn bảng điện"}
          >
            {isPaused ? <Play size={10} className="fill-current" /> : <Pause size={10} className="fill-current" />}
          </button>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title={isCollapsed ? "Mở rộng bảng quà" : "Thu gọn bảng quà"}
          >
            {isCollapsed ? <Eye size={10} /> : <EyeOff size={10} />}
          </button>

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-1 rounded text-amber-300 hover:text-amber-200 hover:bg-amber-500/20 transition-colors"
              title="Cài đặt Bảng Quà & Tùy chỉnh"
            >
              <Settings size={10} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
