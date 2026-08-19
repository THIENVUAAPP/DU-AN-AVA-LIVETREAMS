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

  // Kích thước tỷ lệ phóng to thu nhỏ (mặc định 1.0x, cho phép từ 0.7x đến 1.6x)
  const [scale, setScale] = useState(() => {
    try {
      const saved = localStorage.getItem(`avalive_gift_box_scale_${mode}`);
      if (saved) return Math.max(0.7, Math.min(1.6, parseFloat(saved)));
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
    return () => window.removeEventListener('avalive_gift_config_updated', handleUpdate);
  }, [mode]);

  // Lưu scale khi thay đổi
  const handleScaleChange = (delta) => {
    setScale(prev => {
      const next = Math.round(Math.max(0.7, Math.min(1.6, prev + delta)) * 10) / 10;
      try {
        localStorage.setItem(`avalive_gift_box_scale_${mode}`, next.toString());
      } catch (e) {}
      return next;
    });
  };

  // Kéo thả vị trí
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
      x: Math.max(0, Math.min(window.innerWidth - 120, clientX - dragStartRef.current.x)),
      y: Math.max(0, Math.min(window.innerHeight - 80, clientY - dragStartRef.current.y))
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

  // Render từng thẻ quà tặng bên trong danh sách cuộn: Siêu tinh gọn [Icon] [Tên] [+X ô]
  const renderGiftRow = (gift, key) => {
    let rowBg = 'bg-black/35 hover:bg-black/55 border-white/10';
    let nameColor = 'text-gray-100';

    if (gift.regionTarget === 'north') {
      rowBg = 'bg-red-950/40 hover:bg-red-900/60 border-red-500/30';
      nameColor = 'text-red-200';
    } else if (gift.regionTarget === 'central') {
      rowBg = 'bg-amber-950/40 hover:bg-amber-900/60 border-amber-500/30';
      nameColor = 'text-amber-200';
    } else if (gift.regionTarget === 'south') {
      rowBg = 'bg-emerald-950/40 hover:bg-emerald-900/60 border-emerald-500/30';
      nameColor = 'text-emerald-200';
    } else if (gift.priceToken >= 1000) {
      rowBg = 'bg-yellow-950/40 hover:bg-yellow-900/60 border-yellow-500/30';
      nameColor = 'text-yellow-200 font-black';
    }

    const cellCount = gift.cells || (mode === 'battle' ? `${gift.hpBuff || 50}HP` : 1);

    return (
      <div
        key={key}
        onClick={() => onGiftClick && onGiftClick(gift)}
        className={`flex items-center justify-between px-2 py-1 rounded-lg border ${rowBg} text-[9px] cursor-pointer transition-all hover:scale-[1.02] select-none`}
        title={`Tặng "${gift.name}" -> +${cellCount} ${mode === 'map' ? 'ô cờ' : 'HP'}`}
      >
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-[12px] shrink-0 drop-shadow-xs">{gift.icon}</span>
          <span className={`font-bold truncate ${nameColor}`}>
            {gift.shortName || gift.name}
          </span>
        </div>

        <div className="shrink-0 ml-1">
          <span className="font-mono font-black text-amber-300 text-[8.5px] bg-black/40 px-1.5 py-0.5 rounded border border-amber-500/20 whitespace-nowrap">
            +{cellCount} {mode === 'map' ? 'ô' : ''}
          </span>
        </div>
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
          <span className="text-[9px] font-black uppercase">Quà Tặng</span>
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
        <div className="w-36 sm:w-40 bg-black/30 backdrop-blur-[3px] hover:bg-black/50 border border-amber-500/30 hover:border-amber-400/60 rounded-xl p-1.5 shadow-2xl text-white transition-all">
          
          {/* HEADER: KÉO THẢ + ZOOM +/- + THU NHỎ + ĐÓNG */}
          <div 
            className="flex items-center justify-between text-[9px] font-black text-amber-300 pb-1 mb-1 border-b border-white/10 cursor-move"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            title="Kéo thả để di chuyển Bảng Quà Tặng"
          >
            <div className="flex items-center gap-1">
              <Move size={9} className="text-gray-400 shrink-0" />
              <Sparkles size={10} className="text-yellow-400 animate-spin shrink-0" style={{ animationDuration: '4s' }} />
              <span className="truncate drop-shadow uppercase tracking-wider text-[8.5px]">
                {mode === 'battle' ? 'Quà & Buff' : 'Quà Tặng'}
              </span>
            </div>

            {/* CỤM NÚT ĐIỀU KHIỂN GÓC PHẢI */}
            <div className="flex items-center gap-0.5 ml-auto">
              <button
                onClick={(e) => { e.stopPropagation(); handleScaleChange(-0.1); }}
                className="w-3.5 h-3.5 flex items-center justify-center rounded text-gray-300 hover:text-white hover:bg-white/20 transition-colors text-[8px]"
                title="Thu nhỏ kích thước bảng (-10%)"
              >
                −
              </button>
              
              <span className="text-[7px] text-gray-400 font-mono">
                {Math.round(scale * 100)}%
              </span>

              <button
                onClick={(e) => { e.stopPropagation(); handleScaleChange(0.1); }}
                className="w-3.5 h-3.5 flex items-center justify-center rounded text-gray-300 hover:text-white hover:bg-white/20 transition-colors text-[8px]"
                title="Phóng to kích thước bảng (+10%)"
              >
                +
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}
                className="p-0.5 rounded text-gray-300 hover:text-white hover:bg-white/20 transition-colors"
                title="Thu nhỏ bảng quà"
              >
                <Minus size={9} />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); setIsClosed(true); }}
                className="p-0.5 rounded text-gray-400 hover:text-red-400 hover:bg-white/20 transition-colors"
                title="Ẩn bảng quà"
              >
                <X size={9} />
              </button>
            </div>
          </div>

          {/* KHỐI 1: CẮM CỜ 3 MIỀN BẮC - TRUNG - NAM (TINH GỌN, KHÔNG SỐ XU) */}
          {mode === 'map' && (
            <div className="grid grid-cols-3 gap-1 mb-1">
              <div 
                onClick={() => onGiftClick && onGiftClick({ id: 'gift_region_north', name: 'Ngón Tay Tim (Miền Bắc)', icon: '🫰', priceToken: 5, cells: 5, regionTarget: 'north' })}
                className="py-1 px-0.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-center cursor-pointer transition-transform hover:scale-105"
                title="Cắm cờ Miền Bắc (+5 ô)"
              >
                <div className="text-[12px]">🫰</div>
                <div className="text-[7.5px] font-bold text-red-200 truncate">Bắc</div>
                <div className="text-[7px] text-amber-300 font-mono font-black">+5 ô</div>
              </div>

              <div 
                onClick={() => onGiftClick && onGiftClick({ id: 'gift_region_central', name: 'Bánh Donut (Miền Trung)', icon: '🍩', priceToken: 5, cells: 5, regionTarget: 'central' })}
                className="py-1 px-0.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/40 text-center cursor-pointer transition-transform hover:scale-105"
                title="Cắm cờ Miền Trung (+5 ô)"
              >
                <div className="text-[12px]">🍩</div>
                <div className="text-[7.5px] font-bold text-amber-200 truncate">Trung</div>
                <div className="text-[7px] text-amber-300 font-mono font-black">+5 ô</div>
              </div>

              <div 
                onClick={() => onGiftClick && onGiftClick({ id: 'gift_region_south', name: 'Gấu Con (Miền Nam)', icon: '🧸', priceToken: 5, cells: 5, regionTarget: 'south' })}
                className="py-1 px-0.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-center cursor-pointer transition-transform hover:scale-105"
                title="Cắm cờ Miền Nam (+5 ô)"
              >
                <div className="text-[12px]">🧸</div>
                <div className="text-[7.5px] font-bold text-emerald-200 truncate">Nam</div>
                <div className="text-[7px] text-amber-300 font-mono font-black">+5 ô</div>
              </div>
            </div>
          )}

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

        </div>
      )}
    </div>
  );
}
