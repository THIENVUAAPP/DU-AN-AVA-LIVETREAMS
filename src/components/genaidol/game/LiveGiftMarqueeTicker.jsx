import React, { useState, useEffect, useRef } from 'react';
import { 
  Gift, Sparkles, Settings, Eye, EyeOff, Play, Pause, 
  Move, Plus, Minus, X, ChevronRight, Flame, Shield, Trophy, Flag
} from 'lucide-react';
import { 
  getGiftConfig, 
  saveGiftConfig, 
  DEFAULT_GIFT_MARQUEE_SETTINGS 
} from '../../../utils/giftSyncService';
import bandoAudio from './bandoAudioEngine';

/**
 * BẢNG ĐIỆN QUÀ TẶNG TÙY BIẾN (GIFT HUD WIDGET)
 * - Khung Box gọn gàng tương tự Bảng Xếp Hạng Top
 * - Kéo thả di chuyển tự do (Draggable)
 * - Phóng to / Thu nhỏ (Resizable / Scale 0.7x -> 1.6x)
 * - Tự động cuộn danh sách quà tặng mượt mà (Auto-scroll Marquee)
 * - Nút Thu nhỏ / Đóng mở linh hoạt
 * - Lưu vị trí & kích thước vào localStorage
 */
export default function LiveGiftMarqueeTicker({
  mode = 'map', // 'map' | 'battle' | 'live_idol' | 'live_commerce'
  onOpenSettings,
  onGiftClick,
  customPositionStyle = null
}) {
  const [config, setConfig] = useState(() => getGiftConfig(mode));
  const [isPaused, setIsPaused] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  // Kích thước tỷ lệ phóng to thu nhỏ (cho phép từ 0.5x đến 2.0x, mặc định 1.0x)
  const [scale, setScale] = useState(() => {
    try {
      const saved = localStorage.getItem(`avalive_gift_box_scale_${mode}`);
      if (saved) return Math.max(0.5, Math.min(2.0, parseFloat(saved)));
    } catch (e) {}
    return 1.0;
  });

  // Tọa độ vị trí kéo thả
  const [floatingPos, setFloatingPos] = useState(() => {
    try {
      const saved = localStorage.getItem(`avalive_gift_box_pos_${mode}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Mặc định góc trên bên phải hoặc vị trí thuận tiện
    return mode === 'battle' ? { x: 14, y: 195 } : { x: 14, y: 165 };
  });

  const latestPosRef = useRef(floatingPos);
  latestPosRef.current = floatingPos;
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const isResizingRef = useRef(false);
  const resizeStartRef = useRef({ startX: 0, startScale: 1.0 });
  const scrollContainerRef = useRef(null);

  // Lắng nghe cập nhật cấu hình quà & vị trí kéo thả từ các cửa sổ khác
  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail?.config) {
        setConfig(e.detail.config);
      } else {
        setConfig(getGiftConfig(mode));
      }
    };
    window.addEventListener('avalive_gift_config_updated', handleUpdate);
    
    // Cross-window storage sync cho vị trí kéo thả, tỉ lệ zoom và cấu hình
    const handleStorage = (e) => {
      if (e.key === `avalive_gift_config_${mode}`) {
        setConfig(getGiftConfig(mode));
      } else if (e.key === `avalive_gift_box_pos_${mode}` && e.newValue) {
        try {
          const parsedPos = JSON.parse(e.newValue);
          if (parsedPos) {
            setFloatingPos(parsedPos);
            latestPosRef.current = parsedPos;
          }
        } catch (err) {}
      } else if (e.key === `avalive_gift_box_scale_${mode}` && e.newValue) {
        try {
          const parsedScale = parseFloat(e.newValue);
          if (!isNaN(parsedScale)) setScale(parsedScale);
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('avalive_gift_config_updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [mode]);

  // VÒNG LẶP CUỘN BẢNG ĐIỆN TỰ ĐỘNG (AUTO-SCROLL MARQUEE TICKER)
  useEffect(() => {
    if (isPaused || isMinimized || isClosed) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    let animId;
    let accumulated = container.scrollTop;

    // Tốc độ cuộn chậm rãi, êm ái, người xem đọc rõ ràng 100%
    const currentSpeed = (config?.marquee?.speed) || 'slow';
    const stepSpeed = currentSpeed === 'slow' ? 0.10 : currentSpeed === 'normal' ? 0.18 : 0.28;

    const scrollStep = () => {
      if (!isPaused && container) {
        accumulated += stepSpeed; // Cuộn chầm chậm, êm dịu, không bị giật hay lướt nhanh
        if (accumulated >= container.scrollHeight - container.clientHeight) {
          accumulated = 0; // Tự động tua lại đầu bảng lặp lại vô tận
        }
        container.scrollTop = accumulated;
      }
      animId = requestAnimationFrame(scrollStep);
    };

    animId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, isMinimized, isClosed, config?.marquee?.speed]);

  // Lưu scale khi thay đổi (+/- nút bấm)
  const handleScaleChange = (delta) => {
    setScale(prev => {
      const next = Math.round(Math.max(0.5, Math.min(2.0, prev + delta)) * 10) / 10;
      try {
        localStorage.setItem(`avalive_gift_box_scale_${mode}`, next.toString());
      } catch (e) {}
      return next;
    });
  };

  // Kéo thả góc để Phóng to / Thu nhỏ trực tiếp (Corner Drag Resize)
  const handleCornerResizeStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    isResizingRef.current = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    resizeStartRef.current = {
      startX: clientX,
      startScale: scale
    };

    const handleResizeMove = (moveEvt) => {
      if (!isResizingRef.current) return;
      const currentX = moveEvt.touches ? moveEvt.touches[0].clientX : moveEvt.clientX;
      const diffX = currentX - resizeStartRef.current.startX;
      const newScale = Math.max(0.5, Math.min(2.0, resizeStartRef.current.startScale + diffX * 0.005));
      const rounded = Math.round(newScale * 100) / 100;
      setScale(rounded);
    };

    const handleResizeEnd = () => {
      if (!isResizingRef.current) return;
      isResizingRef.current = false;
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', handleResizeEnd);
      window.removeEventListener('touchmove', handleResizeMove);
      window.removeEventListener('touchend', handleResizeEnd);
      try {
        localStorage.setItem(`avalive_gift_box_scale_${mode}`, scale.toString());
      } catch (e) {}
    };

    window.addEventListener('mousemove', handleResizeMove);
    window.addEventListener('mouseup', handleResizeEnd);
    window.addEventListener('touchmove', handleResizeMove, { passive: false });
    window.addEventListener('touchend', handleResizeEnd);
  };

  // Kéo thả vị trí (Drag to Move)
  const handleDragStart = (e) => {
    isDraggingRef.current = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = {
      x: clientX - latestPosRef.current.x,
      y: clientY - latestPosRef.current.y
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
      x: Math.max(0, Math.min(window.innerWidth - 80, clientX - dragStartRef.current.x)),
      y: Math.max(0, Math.min(window.innerHeight - 60, clientY - dragStartRef.current.y))
    };
    latestPosRef.current = newPos;
    setFloatingPos(newPos);
  };

  const handleDragEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    window.removeEventListener('mousemove', handleDragMove);
    window.removeEventListener('mouseup', handleDragEnd);
    window.removeEventListener('touchmove', handleDragMove);
    window.removeEventListener('touchend', handleDragEnd);
    try {
      localStorage.setItem(`avalive_gift_box_pos_${mode}`, JSON.stringify(latestPosRef.current));
    } catch (e) {}
  };

  const marquee = config.marquee || DEFAULT_GIFT_MARQUEE_SETTINGS;
  if (marquee.enabled === false || isClosed) return null;

  // Lấy danh sách quà đang bật
  const regionalGifts = (config.regionalGifts || []).filter(g => g.enabled !== false);
  const standardGifts = (config.gifts || []).filter(g => g.enabled !== false);
  const allActiveGifts = [...regionalGifts, ...standardGifts];

  if (allActiveGifts.length === 0) return null;

  const getBattleBuffBadge = (gift) => {
    if (gift.buffName) return gift.buffName;
    const gId = String(gift.id || '').toLowerCase();
    const gName = String(gift.name || '').toLowerCase();

    if (gId.includes('donut') || gName.includes('donut') || gId === 'gift_region_central') return '🛡️ Giáp';
    if (gId.includes('bear') || gId.includes('gấu') || gName.includes('gấu') || gId === 'gift_region_south') return '🦄 Thú';
    if (gId.includes('tim') || gId.includes('finger') || gId === 'gift_region_north') return '💥 x3';
    if (gId.includes('rose') || gName.includes('hồng')) return '⚔️ Kiếm';
    if (gId.includes('heart') || gName.includes('tim')) return '🩸 Công';
    if (gId.includes('helmet') || gName.includes('cối')) return '🛡️ Giáp+';
    if (gId.includes('tea') || gName.includes('trà')) return '⚔️ Kiếm+';
    if (gId.includes('perfume') || gName.includes('hoa')) return '🦄 Thú+';
    if (gId.includes('crown') || gName.includes('miện')) return '👑 x3 To';
    if (gId.includes('dragon') || gName.includes('long')) return '🐉 Thần';
    if (gId.includes('spaceship') || gName.includes('chiến hạm')) return '🛸 Hạm';
    return `⚔️ +${gift.hpBuff || gift.cells || 10}`;
  };

  // Render từng thẻ quà tặng bên trong danh sách: Siêu tinh gọn [Icon Emoji lớn] [Buff / Số Ô]
  const renderGiftRow = (gift, key) => {
    let rowBg = 'bg-black/40 hover:bg-black/60 border-white/15';
    let countColor = 'text-amber-300 border-amber-500/30 bg-black/50';

    if (gift.regionTarget === 'north') {
      rowBg = 'bg-red-950/50 hover:bg-red-900/70 border-red-500/40';
      countColor = 'text-yellow-300 border-red-400/40 bg-red-950/70';
    } else if (gift.regionTarget === 'central') {
      rowBg = 'bg-amber-950/50 hover:bg-amber-900/70 border-amber-500/40';
      countColor = 'text-yellow-300 border-amber-400/40 bg-amber-950/70';
    } else if (gift.regionTarget === 'south') {
      rowBg = 'bg-emerald-950/50 hover:bg-emerald-900/70 border-emerald-500/40';
      countColor = 'text-yellow-300 border-emerald-400/40 bg-emerald-950/70';
    } else if (gift.priceToken >= 1000) {
      rowBg = 'bg-gradient-to-r from-amber-950/70 to-yellow-950/70 hover:from-amber-900/90 hover:to-yellow-900/90 border-yellow-400/50 shadow-md shadow-yellow-500/10';
      countColor = 'text-yellow-200 font-black border-yellow-300/50 bg-black/60';
    }

    const isBattle = mode === 'battle';
    const badgeText = isBattle ? getBattleBuffBadge(gift) : `+${gift.cells || 1} ô`;

    return (
      <div
        key={key}
        onClick={(e) => {
          e.stopPropagation();
          bandoAudio.unlock();
          if (onGiftClick) {
            onGiftClick(gift);
          } else {
            const randIdx = Math.floor(Math.random() * 900 + 100);
            window.dispatchEvent(new CustomEvent('avalive_tiktok_gift', { detail: {
              giftId: gift.id,
              giftName: gift.name,
              diamondCount: gift.priceToken || gift.coins || gift.cells || 1,
              count: 1,
              userId: `user_${randIdx}`,
              username: `Khán Giả #${randIdx}`,
              avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=user_${randIdx}`,
              regionTarget: gift.regionTarget || null
            }}));
          }
        }}
        className={`flex items-center justify-between px-2 py-1 rounded-lg border ${rowBg} select-none shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-all`}
        title={`Bấm để cắm cờ ${gift.name} (${badgeText})`}
      >
        <span className="text-[16px] leading-none shrink-0 drop-shadow">{gift.icon}</span>

        <span className={`font-mono font-black text-[10px] px-1.5 py-0.5 rounded-md border ${countColor} shadow-inner tracking-tight whitespace-nowrap ml-1`}>
          {badgeText}
        </span>
      </div>
    );
  };

  return (
    <div 
      className="fixed z-40 pointer-events-auto select-none transition-all duration-75"
      style={{
        top: `${floatingPos.y}px`,
        left: `${floatingPos.x}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'top left'
      }}
    >
      {/* 1. TRẠNG THÁI THU NHỎ (ICON BADGE NHỎ GỌN) */}
      {isMinimized ? (
        <div 
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/40 hover:bg-black/60 backdrop-blur-md border border-amber-500/30 hover:border-amber-400 text-yellow-300 shadow-2xl cursor-move transition-all hover:scale-105"
          title="Kéo thả vị trí hoặc bấm để mở rộng Bảng Quà Tặng"
        >
          <Sparkles size={11} className="text-yellow-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="text-[9px] font-black uppercase">Quà</span>
          <button
            onClick={(e) => { e.stopPropagation(); setIsMinimized(false); }}
            className="ml-1 p-0.5 rounded text-gray-300 hover:text-white hover:bg-white/20"
            title="Mở rộng bảng quà"
          >
            <Plus size={10} />
          </button>
        </div>
      ) : (
        /* 2. KHUNG BOX WIDGET ĐẦY ĐỦ (TINH GỌN, KHÔNG CHE KHUẤT MÀN HÌNH) */
        <div className="w-24 sm:w-26 bg-black/50 backdrop-blur-[4px] hover:bg-black/70 border border-amber-500/40 hover:border-amber-400/80 rounded-xl p-1 shadow-2xl text-white transition-all flex flex-col">
          
          {/* HEADER: KÉO THẢ + ZOOM +/- + THU NHỎ + ĐÓNG */}
          <div 
            className="flex items-center justify-between px-1 py-0.5 mb-1 border-b border-white/10 cursor-move select-none bg-white/5 rounded-t-lg"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            title="Kéo thả để di chuyển Bảng Quà"
          >
            <div className="flex items-center gap-0.5">
              <Gift size={9} className="text-yellow-400" />
              <span className="text-[7.5px] font-black uppercase tracking-wider text-amber-300">Quà Tặng</span>
            </div>
            <div className="flex items-center gap-0.5">
              <button
                onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}
                className="p-0.5 rounded text-gray-300 hover:text-white hover:bg-white/20 text-[7px]"
                title="Thu nhỏ bảng quà"
              >
                −
              </button>
            </div>
          </div>

          {/* KHỐI 1: CẮM CỜ 3 MIỀN BẮC - TRUNG - NAM HOẶC BUFF 3 MIỀN (Thẻ Vùng Miền Sắc Nét) */}
          <div className="grid grid-cols-3 gap-1 mb-1 select-none">
            <div 
              className="py-1 px-0.5 rounded-lg bg-gradient-to-b from-red-950/90 to-red-900/60 border border-red-500/70 text-center shadow-sm hover:scale-105 transition-transform"
              title={mode === 'battle' ? 'Tăng kích thước x3 (Miền Bắc)' : 'Cắm cờ Miền Bắc (+5 ô)'}
            >
              <div className="text-[7px] font-black text-red-300 uppercase tracking-tighter mb-0.5">M. Bắc</div>
              <div className="text-[13px] leading-none mb-0.5 drop-shadow">🫰</div>
              <div className="text-[7.5px] text-yellow-300 font-mono font-black">{mode === 'battle' ? 'x3' : '+5'}</div>
            </div>

            <div 
              className="py-1 px-0.5 rounded-lg bg-gradient-to-b from-amber-950/90 to-amber-900/60 border border-amber-500/70 text-center shadow-sm hover:scale-105 transition-transform"
              title={mode === 'battle' ? 'Nâng cấp Giáp (Miền Trung)' : 'Cắm cờ Miền Trung (+5 ô)'}
            >
              <div className="text-[7px] font-black text-amber-300 uppercase tracking-tighter mb-0.5">M. Trung</div>
              <div className="text-[13px] leading-none mb-0.5 drop-shadow">🍩</div>
              <div className="text-[7.5px] text-yellow-300 font-mono font-black">{mode === 'battle' ? 'Giáp' : '+5'}</div>
            </div>

            <div 
              className="py-1 px-0.5 rounded-lg bg-gradient-to-b from-emerald-950/90 to-emerald-900/60 border border-emerald-500/70 text-center shadow-sm hover:scale-105 transition-transform"
              title={mode === 'battle' ? 'Nâng cấp Thú Cưỡi (Miền Nam)' : 'Cắm cờ Miền Nam (+5 ô)'}
            >
              <div className="text-[7px] font-black text-emerald-300 uppercase tracking-tighter mb-0.5">M. Nam</div>
              <div className="text-[13px] leading-none mb-0.5 drop-shadow">🧸</div>
              <div className="text-[7.5px] text-yellow-300 font-mono font-black">{mode === 'battle' ? 'Thú' : '+5'}</div>
            </div>
          </div>

          {/* KHỐI 2: DANH SÁCH QUÀ TẶNG & TÍCH ĐIỂM (CUỘN GỌN GÀNG) */}
          <div 
            ref={scrollContainerRef}
            className="space-y-0.5 max-h-36 overflow-y-auto custom-scrollbar relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {allActiveGifts.map((g, i) => renderGiftRow(g, `gift_row_${g.id}_${i}`))}
          </div>

          {/* TAY CẦM KÉO CO GIÃN KÍCH THƯỚC (CORNER RESIZE HANDLE) - INVISIBLE */}
          <div 
            onMouseDown={handleCornerResizeStart}
            onTouchStart={handleCornerResizeStart}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50"
            title="Kéo góc này để phóng to / thu nhỏ bảng quà"
          />
        </div>
      )}
    </div>
  );
}
