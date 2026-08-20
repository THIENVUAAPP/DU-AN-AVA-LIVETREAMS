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

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const isResizingRef = useRef(false);
  const resizeStartRef = useRef({ startX: 0, startScale: 1.0 });
  const scrollContainerRef = useRef(null);

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
    
    // Cross-window storage sync
    const handleStorage = (e) => {
      if (e.key === `avalive_gift_config_${mode}`) {
        setConfig(getGiftConfig(mode));
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
      x: Math.max(0, Math.min(window.innerWidth - 80, clientX - dragStartRef.current.x)),
      y: Math.max(0, Math.min(window.innerHeight - 60, clientY - dragStartRef.current.y))
    };
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
      localStorage.setItem(`avalive_gift_box_pos_${mode}`, JSON.stringify(floatingPos));
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
        onClick={() => onGiftClick && onGiftClick(gift)}
        className={`flex items-center justify-between px-2 py-1 rounded-lg border ${rowBg} cursor-pointer transition-all hover:scale-[1.03] active:scale-95 select-none shadow-sm`}
        title={`Tặng quà -> ${badgeText}`}
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
      className="absolute z-30 pointer-events-auto select-none transition-all duration-100"
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
        <div className="w-24 sm:w-26 bg-black/35 backdrop-blur-[3px] hover:bg-black/55 border border-amber-500/30 hover:border-amber-400/60 rounded-xl p-1 shadow-2xl text-white transition-all">
          
          {/* HEADER: KÉO THẢ + ZOOM +/- + THU NHỎ + ĐÓNG */}
          <div 
            className="flex items-center justify-between text-[8px] font-black text-amber-300 pb-0.5 mb-1 border-b border-white/10 cursor-move select-none"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            title="Kéo thả để di chuyển Bảng Quà"
          >
            <div className="flex items-center gap-0.5 opacity-80 hover:opacity-100">
              <Move size={8} className="text-gray-400 shrink-0" />
              <Sparkles size={8} className="text-yellow-400 animate-spin shrink-0" style={{ animationDuration: '4s' }} />
            </div>

            {/* CỤM NÚT ĐIỀU KHIỂN GÓC PHẢI */}
            <div className="flex items-center gap-0.5 ml-auto">
              <button
                onClick={(e) => { e.stopPropagation(); handleScaleChange(-0.1); }}
                className="w-3 h-3 flex items-center justify-center rounded text-gray-300 hover:text-white hover:bg-white/20 transition-colors text-[7.5px]"
                title="Thu nhỏ (-10%)"
              >
                −
              </button>
              
              <span className="text-[6.5px] text-gray-400 font-mono">
                {Math.round(scale * 100)}%
              </span>

              <button
                onClick={(e) => { e.stopPropagation(); handleScaleChange(0.1); }}
                className="w-3 h-3 flex items-center justify-center rounded text-gray-300 hover:text-white hover:bg-white/20 transition-colors text-[7.5px]"
                title="Phóng to (+10%)"
              >
                +
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}
                className="p-0.5 rounded text-gray-300 hover:text-white hover:bg-white/20 transition-colors"
                title="Thu nhỏ"
              >
                <Minus size={8} />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); setIsClosed(true); }}
                className="p-0.5 rounded text-gray-400 hover:text-red-400 hover:bg-white/20 transition-colors"
                title="Ẩn"
              >
                <X size={8} />
              </button>
            </div>
          </div>

          {/* KHỐI 1: CẮM CỜ 3 MIỀN BẮC - TRUNG - NAM HOẶC BUFF 3 MIỀN */}
          <div className="grid grid-cols-3 gap-0.5 mb-1">
            <div 
              onClick={() => {
                bandoAudio.unlock();
                onGiftClick && onGiftClick({ id: 'gift_region_north', name: 'Ngón Tay Tim', icon: '🫰', priceToken: 5, cells: 5, regionTarget: 'north' });
              }}
              className="py-1 px-0.5 rounded-md bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
              title={mode === 'battle' ? 'Tăng kích thước x3' : 'Cắm cờ Miền Bắc (+5 ô)'}
            >
              <div className="text-[11px]">🫰</div>
              <div className="text-[6.5px] text-amber-300 font-mono font-black">{mode === 'battle' ? 'x3' : '+5'}</div>
            </div>

            <div 
              onClick={() => {
                bandoAudio.unlock();
                onGiftClick && onGiftClick({ id: 'gift_region_central', name: 'Bánh Donut', icon: '🍩', priceToken: 5, cells: 5, regionTarget: 'central' });
              }}
              className="py-1 px-0.5 rounded-md bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/40 text-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
              title={mode === 'battle' ? 'Nâng cấp Giáp' : 'Cắm cờ Miền Trung (+5 ô)'}
            >
              <div className="text-[11px]">🍩</div>
              <div className="text-[6.5px] text-amber-300 font-mono font-black">{mode === 'battle' ? 'Giáp' : '+5'}</div>
            </div>

            <div 
              onClick={() => {
                bandoAudio.unlock();
                onGiftClick && onGiftClick({ id: 'gift_region_south', name: 'Gấu Con', icon: '🧸', priceToken: 5, cells: 5, regionTarget: 'south' });
              }}
              className="py-1 px-0.5 rounded-md bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
              title={mode === 'battle' ? 'Nâng cấp Thú Cưỡi' : 'Cắm cờ Miền Nam (+5 ô)'}
            >
              <div className="text-[11px]">🧸</div>
              <div className="text-[6.5px] text-amber-300 font-mono font-black">{mode === 'battle' ? 'Thú' : '+5'}</div>
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

          {/* TAY CẦM KÉO CO GIÃN KÍCH THƯỚC (CORNER RESIZE HANDLE) */}
          <div 
            onMouseDown={handleCornerResizeStart}
            onTouchStart={handleCornerResizeStart}
            className="flex items-center justify-between pt-1 mt-1 border-t border-white/10 text-[7px] text-gray-400 select-none cursor-nwse-resize hover:text-yellow-300"
            title="Kéo góc này để phóng to / thu nhỏ bảng quà"
          >
            <span className="font-mono text-[7.5px] opacity-70">Tỉ lệ: {Math.round(scale * 100)}%</span>
            <div className="flex items-center gap-0.5 text-[8px] text-yellow-400/80 hover:text-yellow-300">
              <span>⤡ Kéo góc</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
