/**
 * HỆ THỐNG ĐỒNG BỘ CẤU HÌNH QUÀ TẶNG & BẢNG ĐIỆN CUỘN MARQUEE
 * Quản lý lưu trữ vĩnh viễn (localStorage), phân loại 3 Miền (Bắc - Trung - Nam),
 * tùy chỉnh quà và phát sự kiện đồng bộ toàn hệ thống.
 */

export const REGIONAL_FLAG_GIFTS = [
  {
    id: 'gift_region_north',
    name: 'Ngón Tay Tim (Miền Bắc)',
    shortName: 'Miền Bắc',
    icon: '🫰',
    priceToken: 5,
    cells: 5,
    hpBuff: 50,
    regionTarget: 'north',
    color: '#ef4444',
    tier: 'regional',
    desc: 'Cắm cờ & tích điểm cho khu vực Miền Bắc',
    enabled: true
  },
  {
    id: 'gift_region_central',
    name: 'Bánh Donut (Miền Trung)',
    shortName: 'Miền Trung',
    icon: '🍩',
    priceToken: 5,
    cells: 5,
    hpBuff: 50,
    regionTarget: 'central',
    color: '#f59e0b',
    tier: 'regional',
    desc: 'Cắm cờ & tích điểm cho khu vực Miền Trung',
    enabled: true
  },
  {
    id: 'gift_region_south',
    name: 'Gấu Con (Miền Nam)',
    shortName: 'Miền Nam',
    icon: '🧸',
    priceToken: 5,
    cells: 5,
    hpBuff: 50,
    regionTarget: 'south',
    color: '#10b981',
    tier: 'regional',
    desc: 'Cắm cờ & tích điểm cho khu vực Miền Nam',
    enabled: true
  }
];

export const DEFAULT_STANDARD_GIFTS = [
  { id: 'flag_vn', name: 'Cờ Tổ Quốc', shortName: 'Cờ VN', icon: '🇻🇳', priceToken: 1, cells: 1, hpBuff: 10, tier: 'common', color: '#dc2626', enabled: true },
  { id: 'rose', name: 'Hoa Hồng', shortName: 'Hoa Hồng', icon: '🌹', priceToken: 1, cells: 1, hpBuff: 10, tier: 'common', color: '#f43f5e', enabled: true },
  { id: 'heart_tap', name: 'Thả Tim', shortName: 'Thả Tim', icon: '💖', priceToken: 1, cells: 1, hpBuff: 10, tier: 'common', color: '#ec4899', enabled: true },
  { id: 'helmet', name: 'Mũ Cối Yêu Nước', shortName: 'Mũ Cối', icon: '🪖', priceToken: 10, cells: 10, hpBuff: 50, tier: 'common', color: '#15803d', enabled: true },
  { id: 'tea', name: 'Trà Đào', shortName: 'Trà Đào', icon: '☕', priceToken: 20, cells: 20, hpBuff: 100, tier: 'rare', color: '#f59e0b', enabled: true },
  { id: 'perfume', name: 'Nước Hoa Tình Yêu', shortName: 'Nước Hoa', icon: '🌸', priceToken: 50, cells: 50, hpBuff: 250, tier: 'rare', color: '#d946ef', enabled: true },
  { id: 'crown', name: 'Vương Miện Hoàng Kim', shortName: 'Vương Miện', icon: '👑', priceToken: 99, cells: 99, hpBuff: 600, tier: 'rare', color: '#f59e0b', enabled: true },
  { id: 'firework_indep', name: 'Pháo Hoa Rực Rỡ', shortName: 'Pháo Hoa', icon: '🎆', priceToken: 299, cells: 299, hpBuff: 1200, tier: 'epic', color: '#f43f5e', enabled: true },
  { id: 'dong_son_drum', name: 'Trống Đồng Đông Sơn', shortName: 'Trống Đồng', icon: '🥁', priceToken: 999, cells: 999, hpBuff: 3500, tier: 'epic', color: '#eab308', enabled: true },
  { id: 'contest_fan', name: 'Cúp Vàng Vinh Quang', shortName: 'Cúp Vàng', icon: '🏆', priceToken: 1500, cells: 1500, hpBuff: 5500, tier: 'epic', color: '#e11d48', enabled: true },
  { id: 'racetrack_launch', name: 'Siêu Xe Đường Đua', shortName: 'Siêu Xe', icon: '🏎️', priceToken: 2000, cells: 2000, hpBuff: 8000, tier: 'legendary', color: '#ef4444', enabled: true },
  { id: 'dragon_gold', name: 'Thần Long Giáng Thế', shortName: 'Thần Long', icon: '🐉', priceToken: 3000, cells: 3000, hpBuff: 12000, tier: 'legendary', color: '#facc15', enabled: true },
  { id: 'hero_spaceship', name: 'Chiến Hạm Không Gian', shortName: 'Chiến Hạm', icon: '🛸', priceToken: 4999, cells: 4999, hpBuff: 20000, tier: 'legendary', color: '#06b6d4', enabled: true }
];

export const DEFAULT_GIFT_MARQUEE_SETTINGS = {
  enabled: true,
  speed: 'normal', // 'slow' (45s) | 'normal' (25s) | 'fast' (15s)
  position: 'bottom', // 'bottom' | 'top' | 'floating'
  opacityMode: 'ultra_transparent', // 'ultra_transparent' | 'glassmorphism' | 'semi_dark'
  pauseOnHover: true,
  showPrices: true,
  showCellsOrBuff: true,
  tickerTitle: '🎁 QUÀ TẶNG & CẮM CỜ:',
  floatingPos: { x: 20, y: 80 }
};

export const INITIAL_GIFT_CONFIG = {
  marquee: { ...DEFAULT_GIFT_MARQUEE_SETTINGS },
  regionalGifts: [...REGIONAL_FLAG_GIFTS],
  gifts: [...DEFAULT_STANDARD_GIFTS]
};

const STORAGE_KEYS = {
  map: 'AVALIVE_GIFT_CONFIG_MAP',
  battle: 'AVALIVE_GIFT_CONFIG_BATTLE',
  shared: 'AVALIVE_GIFT_CONFIG_SHARED'
};

/**
 * Lấy cấu hình quà tặng theo mode ('map' | 'battle' | 'shared')
 */
export function getGiftConfig(mode = 'shared') {
  try {
    const key = STORAGE_KEYS[mode] || STORAGE_KEYS.shared;
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        marquee: { ...DEFAULT_GIFT_MARQUEE_SETTINGS, ...(parsed.marquee || {}) },
        regionalGifts: Array.isArray(parsed.regionalGifts) && parsed.regionalGifts.length > 0 
          ? parsed.regionalGifts 
          : [...REGIONAL_FLAG_GIFTS],
        gifts: Array.isArray(parsed.gifts) && parsed.gifts.length > 0 
          ? parsed.gifts 
          : [...DEFAULT_STANDARD_GIFTS]
      };
    }
  } catch (err) {
    console.warn('[giftSyncService] Failed to parse gift config:', err);
  }
  return JSON.parse(JSON.stringify(INITIAL_GIFT_CONFIG));
}

/**
 * Lưu cấu hình quà tặng vĩnh viễn và phát sự kiện đồng bộ
 */
export function saveGiftConfig(mode = 'shared', newConfig) {
  try {
    const key = STORAGE_KEYS[mode] || STORAGE_KEYS.shared;
    const configToSave = {
      marquee: { ...DEFAULT_GIFT_MARQUEE_SETTINGS, ...(newConfig.marquee || {}) },
      regionalGifts: newConfig.regionalGifts || [...REGIONAL_FLAG_GIFTS],
      gifts: newConfig.gifts || [...DEFAULT_STANDARD_GIFTS],
      updatedAt: Date.now()
    };
    
    localStorage.setItem(key, JSON.stringify(configToSave));
    localStorage.setItem(STORAGE_KEYS.shared, JSON.stringify(configToSave));

    // Phát sự kiện toàn hệ thống
    window.dispatchEvent(new CustomEvent('avalive_gift_config_updated', {
      detail: { mode, config: configToSave }
    }));

    return true;
  } catch (err) {
    console.error('[giftSyncService] Failed to save gift config:', err);
    return false;
  }
}

/**
 * Khôi phục danh mục quà tặng về mặc định ban đầu
 */
export function resetGiftConfigToDefault(mode = 'shared') {
  const freshConfig = JSON.parse(JSON.stringify(INITIAL_GIFT_CONFIG));
  saveGiftConfig(mode, freshConfig);
  return freshConfig;
}
