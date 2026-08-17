import bandoAudio from './bandoAudioEngine';
import { WORLD_COUNTRIES, COUNTRIES_BY_ID, CONTINENTS } from './worldCountriesData';
import { BannerFlagCellsEngine } from './bannerFlagCellsEngine';
import defaultVietnamMask from '../../../../public/data/vietnamMask.json';
import defaultProvincesData from '../../../../public/data/provinces.json';

// Danh mục quà TikTok chuẩn quy đổi số ô cờ
export const DEFAULT_MAP_GIFTS = [
  { id: 'rose', name: 'Hoa Hồng', icon: '🌹', cells: 1, color: '#f43f5e', tier: 'common', priceToken: 1 },
  { id: 'ice_cream', name: 'Kem Ốc Quế', icon: '🍦', cells: 5, color: '#ec4899', tier: 'common', priceToken: 5 },
  { id: 'heart', name: 'Tim Rực Rỡ', icon: '💖', cells: 10, color: '#ef4444', tier: 'rare', priceToken: 10 },
  { id: 'tea', name: 'Trà Đào', icon: '☕', cells: 20, color: '#f59e0b', tier: 'rare', priceToken: 20 },
  { id: 'perfume', name: 'Nước Hoa', icon: '🌸', cells: 50, color: '#d946ef', tier: 'epic', priceToken: 50 },
  { id: 'corgi', name: 'Corgi Đáng Yêu', icon: '🐶', cells: 100, color: '#eab308', tier: 'epic', priceToken: 100 },
  { id: 'crown', name: 'Vương Miện', icon: '👑', cells: 200, color: '#f59e0b', tier: 'legendary', priceToken: 200 },
  { id: 'lion', name: 'Sư Tử Vàng', icon: '🦁', cells: 500, color: '#eab308', tier: 'legendary', priceToken: 500 },
  { id: 'rocket', name: 'Tên Lửa Vũ Trụ', icon: '🚀', cells: 1000, color: '#3b82f6', tier: 'mythic', priceToken: 1000 },
  { id: 'universe', name: 'Vũ Trụ TikTok', icon: '🪐', cells: 2000, color: '#8b5cf6', tier: 'mythic', priceToken: 2000 },
  { id: 'flag_legend', name: 'Đại Kỳ Quốc Gia', icon: '🚩', cells: 5000, color: '#dc2626', tier: 'divine', priceToken: 5000 },
];

export const MOCK_WARRIORS_POOL = [
  { id: '@vietnam_vo_dich', username: 'Chiến Binh Áo Đỏ 🇻🇳', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
  { id: '@hanoi_pho_co', username: 'Thủ Đô Trái Tim 🏛️', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
  { id: '@danang_song_han', username: 'Rồng Vàng Miền Trung 🌊', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100' },
  { id: '@saigon_pho_hoa', username: 'Thành Phố Bác 🏙️', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100' },
  { id: '@cantho_song_nuoc', username: 'Chín Rồng Miền Tây 🌾', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
  { id: '@hoang_sa_truong_sa', username: 'Hải Quân Biển Đảo ⚓', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
  { id: '@dong_a_hao_khi', username: 'Hào Khí Đông A ⚔️', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100' },
  { id: '@lac_hong_bat_diet', username: 'Dòng Máu Lạc Hồng 🦅', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100' },
  { id: '@tay_nguyen_hung_vi', username: 'Đại Ngàn Tây Nguyên 🐘', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100' },
  { id: '@ha_long_ky_quan', username: 'Vịnh Rồng Hạ Long 🐉', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
  { id: '@fansipan_noc_nha', username: 'Đỉnh Fansipan 3143m 🏔️', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100' },
  { id: '@phu_quoc_ngoc_bien', username: 'Đảo Ngọc Phú Quốc 🏝️', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
  { id: '@nam_quoc_son_ha', username: 'Nam Quốc Sơn Hà 📜', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
  { id: '@bach_dang_giang', username: 'Sóng Bạch Đằng Giang 🚩', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
  { id: '@phu_dong_thien_vuong', username: 'Phù Đổng Thiên Vương ⚡', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
  { id: '@nguyen_hue_ao_vai', username: 'Chiến Tướng Tây Sơn 🐎', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100' },
  { id: '@hai_ba_trung', username: 'Nữ Tướng Trưng Vương 🌸', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
  { id: '@tran_hung_dao', username: 'Quốc Công Tiết Chế 🛡️', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100' },
  { id: '@dien_bien_phu', username: 'Lừng Lẫy Điện Biên 🌟', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100' },
  { id: '@co_do_hue', username: 'Cố Đô Sông Hương 🏮', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100' },
  { id: '@ca_mau_mui_dat', username: 'Đất Mũi Cà Mau 🧭', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
  { id: '@lung_cu_ha_giang', username: 'Cột Cờ Lũng Cú 🚩', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100' },
  { id: '@truong_son_dong', username: 'Huyền Thoại Trường Sơn 🌲', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
  { id: '@non_nuoc_cao_bang', username: 'Non Nước Cao Bằng 🌄', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
  { id: '@lang_sen_nghe_an', username: 'Làng Sen Quê Bác 🪷', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
  { id: '@bac_ninh_quan_ho', username: 'Quan Họ Kinh Bắc 🎭', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
  { id: '@hoi_an_hoai_pho', username: 'Phố Cổ Hội An 🪔', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
  { id: '@mui_ne_phan_thiet', username: 'Đồi Cát Bay 🏜️', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100' },
  { id: '@nha_trang_bien_xanh', username: 'Vịnh Nha Trang 🐬', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100' },
  { id: '@da_lat_ngan_hoa', username: 'Đà Lạt Ngàn Hoa 🌹', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100' },
  { id: '@an_giang_that_son', username: 'Thất Sơn Bảy Núi ⛰️', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100' },
  { id: '@kien_giang_ha_tien', username: 'Thập Cảnh Hà Tiên 🌴', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
  { id: '@quang_ninh_than_vang', username: 'Đất Mỏ Quảng Ninh 💎', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100' },
  { id: '@vinh_phuc_tam_dao', username: 'Sương Mờ Tam Đảo ☁️', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
  { id: '@son_la_tay_bac', username: 'Hoa Ban Tây Bắc 🌸', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
];

export const HONOR_TIERS = [
  { id: 'novice', name: 'Tân Thủ Cắm Cờ', minCells: 1, icon: '🌱', color: '#94a3b8' },
  { id: 'bronze', name: 'Chiến Binh Đồng', minCells: 50, icon: '🥉', color: '#cd7f32' },
  { id: 'silver', name: 'Hiệp Sĩ Bạc', minCells: 200, icon: '🥈', color: '#94a3b8' },
  { id: 'gold', name: 'Tướng Quân Vàng', minCells: 500, icon: '🥇', color: '#eab308' },
  { id: 'diamond', name: 'Chủ Soái Kim Cương', minCells: 1500, icon: '💎', color: '#38bdf8' },
  { id: 'supreme', name: 'Đại Thần Quốc Gia', minCells: 5000, icon: '👑', color: '#f43f5e' },
];

export function getHonorTier(cells) {
  let matched = HONOR_TIERS[0];
  for (const tier of HONOR_TIERS) {
    if (cells >= tier.minCells) matched = tier;
  }
  return matched;
}

export const COUNTRY_PRESETS = COUNTRIES_BY_ID;
export { WORLD_COUNTRIES, CONTINENTS };

const STORAGE_KEY_CONFIG = 'aidol_bando_custom_config_v4';
const STORAGE_KEY_COUNTRIES = 'aidol_bando_countries_custom_v4';

// Helper khử trùng lặp nhãn địa danh & hiệu chỉnh toạ độ chính xác
function sanitizeMapLabels(labels) {
  if (!Array.isArray(labels)) return [];
  const seenTexts = new Set();
  const result = [];
  for (const item of labels) {
    if (!item || !item.text) continue;
    const norm = item.text.trim().toLowerCase();
    if (!seenTexts.has(norm)) {
      seenTexts.add(norm);

      let targetWx = item.wx ?? 0;
      let targetWy = item.wy ?? 4.0;
      let targetWz = item.wz ?? 0;

      // Tự động định vị chuẩn xác Hà Nội ngay trung tâm tỉnh thành trên đất liền
      if (norm.includes('hà nội')) {
        targetWx = -49.2;
        targetWy = 4.0;
        targetWz = -123.0;
      }

      result.push({
        id: item.id || `lbl_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        text: item.text.trim(),
        wx: targetWx,
        wy: targetWy,
        wz: targetWz,
        color: item.color || '#facc15',
        glow: item.glow !== false
      });
    }
  }
  return result;
}

class BanDoGameEngine {
  constructor() {
    this.maskData = null;
    this.provincesData = [];
    this.isLoaded = false;
    this.listeners = new Set();
    this.broadcastChannel = null;

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.broadcastChannel = new BroadcastChannel('avalive_bando_stage');
      } catch (e) {}
    }

    // Load persisted configurations from local machine
    const savedCustomConfig = this.loadFromStorage(STORAGE_KEY_CONFIG, {});
    const savedCountries = this.loadFromStorage(STORAGE_KEY_COUNTRIES, {});
    this.countries = { ...COUNTRIES_BY_ID, ...savedCountries };

    const initialCountryKey = savedCustomConfig.selectedCountry || 'vietnam';
    const currentPreset = this.countries[initialCountryKey] || this.countries.vietnam || WORLD_COUNTRIES[0];

    // Khởi tạo Khối Lưới Ô Cờ Tiêu Đề 3D (Banner Flag Cells) - Tách biệt hoàn toàn khỏi đất liền phía Bắc
    const initialBannerText = savedCustomConfig.bannerText || (initialCountryKey === 'vietnam' ? 'VIỆT NAM MUÔN NĂM' : currentPreset.name.toUpperCase());
    const initialBannerPos = (savedCustomConfig.bannerPos && savedCustomConfig.bannerPos.z <= -200)
      ? savedCustomConfig.bannerPos
      : { x: 0, y: 4.0, z: -210 };

    this.bannerEngine = new BannerFlagCellsEngine({
      text: initialBannerText,
      posX: initialBannerPos.x,
      posY: initialBannerPos.y,
      posZ: initialBannerPos.z,
      claimedColor: currentPreset.claimedCellColor || '#DA251D',
      unclaimedColor: currentPreset.emptyCellColor || '#334155',
      starColor: currentPreset.starColor || '#FFD700'
    });

    const rawLabels = savedCustomConfig.mapTexts && savedCustomConfig.mapTexts.length > 0
      ? savedCustomConfig.mapTexts
      : (currentPreset.labels || []);
    const sanitizedLabels = sanitizeMapLabels(rawLabels);

    // Game state
    this.state = {
      roundId: 'ROUND-1',
      status: 'playing', // playing | victory | paused
      maskLoaded: true,
      totalCells: savedCustomConfig.totalCells || currentPreset.totalCells || 15125,
      claimedCount: 0,
      remainingCells: savedCustomConfig.totalCells || currentPreset.totalCells || 15125,
      percent: 0,
      cellsById: {}, // cellId -> { id, x, y, provinceId, user, color, placedAt }
      provincesStatus: {}, // provinceId -> { id, name, totalCells, claimedCount, isCompleted, leader }
      leaderboard: [], // Array<{ userId, username, avatar, totalCells, totalGifts, tier }>
      combo: {
        userId: null,
        username: null,
        count: 0,
        level: 1,
        multiplier: 1,
        active: false,
        expiresAt: 0,
      },
      boss: {
        active: false,
        name: 'Thử Thách Thần Long 🐉',
        targetCells: 1000,
        currentCells: 0,
        remainingSec: 0,
        reward: 'x2 Tốc Độ Cắm Cờ',
      },
      activeMission: null,
      victory: null,
      feed: [],
      lastFocalTarget: null, // { wx, wz, username, giftName, count }
      isDemoMode: savedCustomConfig.isDemoMode !== undefined ? savedCustomConfig.isDemoMode : true,
      cameraPreset: 'overview',
      selectedCountry: initialCountryKey,
      mapTexts: sanitizedLabels,
      gifts: savedCustomConfig.gifts || DEFAULT_MAP_GIFTS,
      
      // Banner Flag Cells Matrix State
      bannerText: initialBannerText,
      bannerPos: initialBannerPos,
      bannerCells: this.bannerEngine.cells,
      bannerClaimedCount: 0,
      showBannerCells: savedCustomConfig.showBannerCells !== undefined ? savedCustomConfig.showBannerCells : true,

      // Auto 24/7 Mode Configuration
      autoLoop247: savedCustomConfig.autoLoop247 !== undefined ? savedCustomConfig.autoLoop247 : true,
      autoNewRoundDelaySec: savedCustomConfig.autoNewRoundDelaySec !== undefined ? savedCustomConfig.autoNewRoundDelaySec : 4,
      victoryCountdown: 0,
      isAuto247Running: false,

      settings: {
        theme: savedCustomConfig.theme || 'dark',
        brightness: savedCustomConfig.brightness || 1.2,
        emptyCellColor: savedCustomConfig.emptyCellColor || currentPreset.emptyCellColor || '#475569',
        claimedCellColor: savedCustomConfig.claimedCellColor || currentPreset.claimedCellColor || '#DA251D',
        starColor: savedCustomConfig.starColor || currentPreset.starColor || '#FFD700',
        autoRotate: true,
        autoRotateSpeed: 0.6,
        showProvinceLabels: true,
        showMapTexts: true,
        voiceAnnouncer: true,
        bgmVolume: savedCustomConfig.bgmVolume !== undefined ? savedCustomConfig.bgmVolume : 0.45,
        sfxVolume: savedCustomConfig.sfxVolume !== undefined ? savedCustomConfig.sfxVolume : 0.85,
        customMapTitle: savedCustomConfig.customMapTitle || currentPreset.title,
        selectedCountry: initialCountryKey,
      }
    };

    this.comboTimer = null;
    this.missionTimer = null;
    this.bossTimer = null;
    this.autoTestTimer = null;
    this.auto247Timer = null;
    this.victoryCountdownTimer = null;
    this.isAutoTesting = false;
    this.isAuto247Running = false;

    // Load static data
    this.maskData = defaultVietnamMask;
    this.provincesData = defaultProvincesData.provinces || [];
    this.isLoaded = true;
    this.state.maskLoaded = true;
    this._originalVietnamCells = defaultVietnamMask.cells;
    this.buildGridForCurrentCountry();
    this.initData();
  }

  loadFromStorage(key, fallback) {
    if (typeof localStorage === 'undefined') return fallback;
    try {
      // Thử đọc từ key hiện tại, nếu chưa có thì tìm lại ở các key cũ để không bao giờ mất cài đặt của người dùng
      const keysToCheck = [key, 'aidol_bando_custom_config_v4', 'aidol_bando_custom_config_v3', 'aidol_bando_custom_config_v2', 'aidol_bando_custom_config'];
      for (const k of keysToCheck) {
        const item = localStorage.getItem(k);
        if (item) {
          const parsed = JSON.parse(item);
          if (parsed && typeof parsed === 'object') {
            return { ...fallback, ...parsed };
          }
        }
      }
      return fallback;
    } catch (e) {
      return fallback;
    }
  }

  saveToStorage() {
    if (typeof localStorage === 'undefined') return;
    try {
      const configToSave = {
        selectedCountry: this.state.selectedCountry,
        totalCells: this.state.totalCells,
        isDemoMode: this.state.isDemoMode,
        theme: this.state.settings.theme,
        brightness: this.state.settings.brightness,
        emptyCellColor: this.state.settings.emptyCellColor,
        claimedCellColor: this.state.settings.claimedCellColor,
        starColor: this.state.settings.starColor,
        customMapTitle: this.state.settings.customMapTitle,
        bgmVolume: this.state.settings.bgmVolume,
        sfxVolume: this.state.settings.sfxVolume,
        mapTexts: this.state.mapTexts,
        gifts: this.state.gifts,
        bannerText: this.state.bannerText,
        bannerPos: this.state.bannerPos,
        showBannerCells: this.state.showBannerCells,
      };
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(configToSave));
      localStorage.setItem(STORAGE_KEY_COUNTRIES, JSON.stringify(this.countries));
    } catch (e) {}
  }

  async initData() {
    try {
      if (!this.maskData || !this.maskData.cells || this.maskData.cells.length === 0) {
        this.maskData = defaultVietnamMask;
        this.provincesData = defaultProvincesData.provinces || [];
        this._originalVietnamCells = defaultVietnamMask.cells;
        this.buildGridForCurrentCountry();
      }
      this.isLoaded = true;
      this.state.maskLoaded = true;
      this.notify();
    } catch (e) {
      console.warn('Fallback loading built-in map grid for BanDoGameEngine', e);
      this.generateFallbackGrid();
      this.isLoaded = true;
      this.state.maskLoaded = true;
      this.notify();
    }
  }

  /**
   * Thuật toán lấp đầy 100% mọi lỗ thủng / khoảng trống bên trong lãnh thổ và hải đảo
   */
  fillMapHolesAndGaps(rawCells, cols = 300, rows = 389) {
    if (!rawCells || rawCells.length === 0) return [];
    
    // Tạo 2D Spatial Map
    const gridMap = new Map();
    const cellLookup = new Map();
    let maxId = 0;

    rawCells.forEach(c => {
      const k = `${c.x},${c.y}`;
      gridMap.set(k, true);
      cellLookup.set(k, c);
      if (c.id > maxId) maxId = c.id;
    });

    const filledCells = [...rawCells];

    // Quét từng hàng và từng cột để lấp các lỗ thủng 1-pixel và 2-pixel được bao quanh bởi đất liền
    for (let y = 5; y < rows - 5; y++) {
      let rowMinX = 9999, rowMaxX = -9999;
      for (let x = 5; x < cols - 5; x++) {
        if (gridMap.has(`${x},${y}`)) {
          if (x < rowMinX) rowMinX = x;
          if (x > rowMaxX) rowMaxX = x;
        }
      }

      if (rowMinX < rowMaxX) {
        for (let x = rowMinX + 1; x < rowMaxX; x++) {
          const key = `${x},${y}`;
          if (!gridMap.has(key)) {
            // Kiểm tra xem có phải lỗ thủng bên trong (có lân cận 4 hướng là đất liền)
            const leftLand = gridMap.has(`${x - 1},${y}`) || gridMap.has(`${x - 2},${y}`);
            const rightLand = gridMap.has(`${x + 1},${y}`) || gridMap.has(`${x + 2},${y}`);
            const topLand = gridMap.has(`${x},${y - 1}`) || gridMap.has(`${x},${y - 2}`);
            const bottomLand = gridMap.has(`${x},${y + 1}`) || gridMap.has(`${x},${y + 2}`);

            if ((leftLand && rightLand) || (topLand && bottomLand) || (leftLand && topLand && bottomLand)) {
              maxId++;
              const neighbor = cellLookup.get(`${x - 1},${y}`) || 
                               cellLookup.get(`${x + 1},${y}`) || 
                               cellLookup.get(`${x},${y - 1}`) || 
                               cellLookup.get(`${x},${y + 1}`) || 
                               rawCells[0];
              const newCell = {
                id: maxId,
                x: x,
                y: y,
                region: neighbor.region || 'mainland',
                provinceId: neighbor.provinceId || 'hanoi'
              };
              gridMap.set(key, true);
              cellLookup.set(key, newCell);
              filledCells.push(newCell);
            }
          }
        }
      }
    }

    return filledCells;
  }

  buildGridForCurrentCountry() {
    const preset = this.countries[this.state.selectedCountry] || this.countries.vietnam || WORLD_COUNTRIES[0];
    const targetCount = this.state.totalCells || 15125;

    // Cache original Vietnam cells và lấp đầy 100% lỗ trống
    if (!this._originalVietnamCells && defaultVietnamMask?.cells) {
      this._originalVietnamCells = this.fillMapHolesAndGaps(defaultVietnamMask.cells, 300, 389);
    }

    let baseCells = [];
    if (this.state.selectedCountry === 'vietnam') {
      baseCells = this._originalVietnamCells || this.fillMapHolesAndGaps(this.maskData?.cells || defaultVietnamMask?.cells || [], 300, 389);
    } else {
      baseCells = this.generateCountryGeometry(this.state.selectedCountry, targetCount);
    }

    // Tái phân bổ lưới 2D liền mạch theo targetCount: Tuyệt đối không để lỗ trống/lỗ thủng
    let finalCells = [];
    if (baseCells.length === targetCount) {
      finalCells = baseCells;
    } else if (baseCells.length > targetCount) {
      // Downsampling 2D bằng cách gom cụm ô (Grid Binning) thay vì bỏ bước nhảy 1D để tránh tạo lỗ hổng
      const scale = Math.sqrt(baseCells.length / targetCount);
      const binnedMap = new Map();

      baseCells.forEach(c => {
        const bx = Math.round(c.x / scale);
        const by = Math.round(c.y / scale);
        const bkey = `${bx},${by}`;
        if (!binnedMap.has(bkey)) {
          binnedMap.set(bkey, {
            id: binnedMap.size + 1,
            x: bx * scale,
            y: by * scale,
            region: c.region || 'mainland',
            provinceId: c.provinceId || 'vietnam_all',
          });
        }
      });

      const binnedArr = Array.from(binnedMap.values());
      if (binnedArr.length >= targetCount) {
        finalCells = binnedArr.slice(0, targetCount);
      } else {
        finalCells = binnedArr;
        // Bổ sung thêm các ô viền tiếp giáp nếu thiếu để đạt đúng targetCount mà vẫn phủ kín 100%
        let pIdx = 0;
        while (finalCells.length < targetCount && pIdx < baseCells.length) {
          const bc = baseCells[pIdx];
          finalCells.push({
            ...bc,
            id: finalCells.length + 1,
          });
          pIdx++;
        }
      }
    } else {
      // Phóng to / Chia nhỏ ô (Subdivide) với offset chuẩn xác, lấp đầy 100% không gian
      finalCells = [...baseCells];
      const subOffsets = [
        { dx: -0.28, dy: -0.28 },
        { dx: 0.28, dy: -0.28 },
        { dx: -0.28, dy: 0.28 },
        { dx: 0.28, dy: 0.28 },
        { dx: 0, dy: -0.38 },
        { dx: 0, dy: 0.38 },
        { dx: -0.38, dy: 0 },
        { dx: 0.38, dy: 0 }
      ];

      let idx = 0;
      let offsetIdx = 0;
      while (finalCells.length < targetCount) {
        const c = baseCells[idx % baseCells.length];
        const off = subOffsets[offsetIdx % subOffsets.length];
        finalCells.push({
          ...c,
          id: finalCells.length + 1,
          x: c.x + off.dx,
          y: c.y + off.dy,
        });
        idx++;
        if (idx % baseCells.length === 0) offsetIdx++;
      }
    }

    this.maskData = {
      gridCols: 300,
      gridRows: 389,
      playableCellCount: finalCells.length,
      cells: finalCells,
    };

    // Update Provinces Status
    const provs = preset.provinces || this.provincesData || [];
    const provStatus = {};
    const cellsPerProv = Math.floor(finalCells.length / Math.max(1, provs.length));

    provs.forEach((p) => {
      provStatus[p.id] = {
        id: p.id,
        name: p.name,
        totalCells: p.totalCells || cellsPerProv,
        claimedCount: 0,
        isCompleted: false,
        leader: null,
      };
    });

    this.state.provincesStatus = provStatus;
    this.state.totalCells = finalCells.length;
    this.state.remainingCells = finalCells.length;
    this.isLoaded = true;
    this.notify();
  }

  generateCountryGeometry(countryKey, count = 15000) {
    const cells = [];
    let cid = 1;

    for (let i = 0; i < count; i++) {
      let x = 150;
      let y = 190;

      if (countryKey === 'japan') {
        // Japanese Archipelago
        if (i % 8 === 0) {
          x = 80 + (Math.random() - 0.5) * 20;
          y = 320 + (Math.random() - 0.5) * 20;
        } else if (i % 6 === 0) {
          x = 210 + (Math.random() - 0.5) * 45;
          y = 70 + (Math.random() - 0.5) * 35;
        } else {
          const prog = (i % (count * 0.8)) / (count * 0.8);
          x = 100 + Math.pow(prog, 1.2) * 110 + (Math.random() - 0.5) * 28;
          y = 260 - prog * 160 + (Math.random() - 0.5) * 25;
        }
      } else if (countryKey === 'korea') {
        if (i % 12 === 0) {
          x = 120 + (Math.random() - 0.5) * 16;
          y = 310 + (Math.random() - 0.5) * 16;
        } else {
          x = 145 + (Math.random() - 0.5) * 40;
          y = 110 + (i / count) * 160 + (Math.random() - 0.5) * 15;
        }
      } else if (countryKey === 'usa') {
        if (i % 15 === 0) {
          x = 60 + (Math.random() - 0.5) * 18;
          y = 290 + (Math.random() - 0.5) * 18;
        } else {
          x = 70 + Math.random() * 160;
          y = 120 + Math.random() * 140;
        }
      } else if (countryKey === 'france') {
        if (i % 15 === 0) {
          x = 220 + (Math.random() - 0.5) * 15;
          y = 280 + (Math.random() - 0.5) * 25;
        } else {
          const angle = Math.random() * Math.PI * 2;
          const rad = Math.sqrt(Math.random()) * 65;
          x = 150 + Math.cos(angle) * rad;
          y = 190 + Math.sin(angle) * rad * 0.9;
        }
      } else {
        // Generic continental organic shape
        const angle = Math.random() * Math.PI * 2;
        const rad = Math.sqrt(Math.random()) * 75;
        x = 150 + Math.cos(angle) * rad * 1.1;
        y = 190 + Math.sin(angle) * rad * 1.25;
      }

      cells.push({
        id: cid++,
        x: Math.floor(Math.max(10, Math.min(290, x))),
        y: Math.floor(Math.max(10, Math.min(380, y))),
        provinceId: `prov_${(i % 8) + 1}`,
        region: 'mainland'
      });
    }
    return cells;
  }

  generateFallbackGrid() {
    this.buildGridForCurrentCountry();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  notify(lastEvent = null) {
    this.listeners.forEach(cb => {
      try { cb(this.state, lastEvent); } catch(e) {}
    });

    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({
          type: 'BANDO_STATE_UPDATE',
          state: this.state,
          lastEvent
        });
      } catch (e) {}
    }
  }

  // ==================== QUẢN TRỊ 200 QUỐC GIA ====================
  switchCountry(countryKey) {
    const preset = this.countries[countryKey] || this.countries.vietnam || WORLD_COUNTRIES[0];
    this.state.selectedCountry = countryKey;
    this.state.mapTexts = sanitizeMapLabels(preset.labels || []);
    this.state.settings.customMapTitle = preset.title;
    this.state.settings.claimedCellColor = preset.claimedCellColor;
    this.state.settings.starColor = preset.starColor;
    this.state.settings.emptyCellColor = preset.emptyCellColor;
    this.state.settings.selectedCountry = countryKey;

    // Cập nhật Banner Text tương ứng quốc gia nếu chưa đặt riêng
    const newBannerText = countryKey === 'vietnam' ? 'VIỆT NAM MUÔN NĂM' : (preset.name.split(' ')[0] + ' VÔ ĐỊCH').toUpperCase();
    this.setBannerText(newBannerText);

    this.resetRound();
    this.buildGridForCurrentCountry();
    this.saveToStorage();
    this.notify({ type: 'COUNTRY_CHANGED', countryKey });
  }

  // ==================== QUẢN LÝ CHỮ Ô CỜ TIÊU ĐỀ 3D (BANNER CELLS) ====================
  setBannerText(text) {
    const clean = (text || 'VIỆT NAM MUÔN NĂM').trim();
    this.bannerEngine.setText(clean);
    this.state.bannerText = clean;
    this.state.bannerCells = [...this.bannerEngine.cells];
    this.state.bannerClaimedCount = this.bannerEngine.claimedCount;
    this.saveToStorage();
    this.notify({ type: 'BANNER_TEXT_UPDATED', bannerText: clean });
  }

  setBannerPosition(x, y, z) {
    this.bannerEngine.setPosition(x, y, z);
    this.state.bannerPos = { x: this.bannerEngine.posX, y: this.bannerEngine.posY, z: this.bannerEngine.posZ };
    this.state.bannerCells = [...this.bannerEngine.cells];
    this.saveToStorage();
    this.notify({ type: 'BANNER_POS_UPDATED', bannerPos: this.state.bannerPos });
  }

  toggleShowBannerCells(show) {
    this.state.showBannerCells = !!show;
    this.saveToStorage();
    this.notify({ type: 'BANNER_VISIBILITY_UPDATED', showBannerCells: this.state.showBannerCells });
  }

  // Cài đặt tổng số ô cờ
  setTotalCells(newCount) {
    const val = Math.max(500, Math.min(100000, parseInt(newCount) || 15125));
    this.state.totalCells = val;
    this.state.remainingCells = val;
    this.resetRound();
    this.buildGridForCurrentCountry();
    this.saveToStorage();
    this.notify({ type: 'TOTAL_CELLS_CHANGED', totalCells: val });
  }

  // Tương thích cả cú pháp handleGift({ giftId, count, userId, username, avatar }) lẫn processGift
  handleGift(giftEvent) {
    if (!giftEvent) return;
    if (typeof giftEvent === 'string') {
      return this.processGift(giftEvent, 1);
    }
    const giftId = giftEvent.giftId || giftEvent.id || 'flag';
    const count = giftEvent.count || 1;
    const user = {
      id: giftEvent.userId || giftEvent.id || 'guest_1',
      username: giftEvent.username || giftEvent.nickname || 'Chiến Binh',
      avatar: giftEvent.avatar || giftEvent.profilePictureUrl || ''
    };
    return this.processGift(giftId, count, user);
  }

  // Xử lý sự kiện tặng quà và cắm cờ
  processGift(giftId, count = 1, user = { id: 'guest_1', username: 'Chiến Binh Áo Đỏ', avatar: '' }) {
    if (this.state.status === 'victory' || !this.maskData) return;

    const giftDef = (this.state.gifts || DEFAULT_MAP_GIFTS).find(g => g.id === giftId) || DEFAULT_MAP_GIFTS[0];
    const rawCells = (giftDef.cells || 1) * count;
    
    // Combo multiplier
    let effectiveCells = rawCells;
    const now = Date.now();
    if (this.state.combo.userId === user.id && this.state.combo.expiresAt > now) {
      this.state.combo.count += 1;
      this.state.combo.level = Math.min(10, Math.floor(this.state.combo.count / 3) + 1);
      this.state.combo.multiplier = this.state.combo.level >= 5 ? 3 : this.state.combo.level >= 2 ? 2 : 1;
      this.state.combo.expiresAt = now + 5000;
      effectiveCells = rawCells * this.state.combo.multiplier;
      bandoAudio.playCombo(this.state.combo.level);
    } else {
      this.state.combo = {
        userId: user.id,
        username: user.username,
        count: 1,
        level: 1,
        multiplier: 1,
        active: true,
        expiresAt: now + 5000,
      };
    }

    // Allocate unclaimed cells
    const allCells = this.maskData.cells || [];
    const unallocated = allCells.filter(c => !this.state.cellsById[c.id]);
    const toClaim = unallocated.slice(0, effectiveCells);

    if (toClaim.length === 0 && unallocated.length === 0) {
      this.triggerVictory(user);
      return;
    }

    const placedColor = this.state.settings.claimedCellColor || '#DA251D';
    let lastCell = null;
    const provinceUpdated = new Set();

    toClaim.forEach(cell => {
      this.state.cellsById[cell.id] = {
        id: cell.id,
        x: cell.x,
        y: cell.y,
        provinceId: cell.provinceId,
        user: { id: user.id, username: user.username },
        color: placedColor,
        placedAt: now,
      };
      lastCell = cell;

      if (this.state.provincesStatus[cell.provinceId]) {
        this.state.provincesStatus[cell.provinceId].claimedCount += 1;
        provinceUpdated.add(cell.provinceId);
      }
    });

    this.state.claimedCount = Object.keys(this.state.cellsById).length;
    this.state.remainingCells = Math.max(0, this.state.totalCells - this.state.claimedCount);
    this.state.percent = Math.min(100, Math.round((this.state.claimedCount / this.state.totalCells) * 1000) / 10);

    // Đồng bộ lấp đầy cờ vào khối chữ Ô CỜ Tiêu Đề (Banner Flag Cells)
    this.bannerEngine.syncWithMapPercent(this.state.percent);
    this.state.bannerCells = [...this.bannerEngine.cells];
    this.state.bannerClaimedCount = this.bannerEngine.claimedCount;

    // Audio SFX kịch tính
    if (giftDef.tier === 'mythic' || giftDef.tier === 'divine') {
      bandoAudio.playThunderStrike();
      bandoAudio.playGoldCoins(10);
    } else if (giftDef.tier === 'legendary') {
      bandoAudio.playWarHorn();
      bandoAudio.playGoldCoins(5);
    } else if (giftDef.tier === 'epic') {
      bandoAudio.playWarDrums(3);
    } else {
      bandoAudio.playCellPop();
    }

    // Check province completions
    provinceUpdated.forEach(pid => {
      const p = this.state.provincesStatus[pid];
      if (p && !p.isCompleted && p.claimedCount >= p.totalCells) {
        p.isCompleted = true;
        p.leader = user.username;
        bandoAudio.playProvinceComplete(p.name);
        this.addFeedItem('PROVINCE_COMPLETE', `⭐ Vùng/Tỉnh [${p.name}] đã hoàn thành 100% cắm cờ bởi ${user.username}!`);
      }
    });

    // Update Leaderboard
    let userEntry = this.state.leaderboard.find(l => l.userId === user.id);
    if (!userEntry) {
      userEntry = {
        userId: user.id,
        username: user.username,
        avatar: user.avatar || '',
        totalCells: 0,
        totalGifts: 0,
        tier: getHonorTier(0)
      };
      this.state.leaderboard.push(userEntry);
    }
    userEntry.totalCells += toClaim.length;
    userEntry.totalGifts += count;
    userEntry.tier = getHonorTier(userEntry.totalCells);
    this.state.leaderboard.sort((a, b) => b.totalCells - a.totalCells);

    // Add Live Feed Item
    this.addFeedItem('GIFT', `${user.username} đã gửi [${giftDef.icon} ${giftDef.name} x${count}] → Cắm +${toClaim.length} Ô Cờ!`);

    // Camera Focal Target
    if (lastCell) {
      this.state.lastFocalTarget = {
        x: lastCell.x,
        y: lastCell.y,
        wx: (lastCell.x - (this.maskData.gridCols || 300) / 2) * 1.0,
        wz: (lastCell.y - (this.maskData.gridRows || 389) / 2) * 1.0,
        username: user.username,
        giftName: giftDef.name,
        count: toClaim.length,
        seq: now,
      };
    }

    // Check victory condition
    if (this.state.remainingCells <= 0) {
      this.triggerVictory(user);
      return;
    }

    this.notify({ type: 'GIFT_PLACED', giftId, count, user, claimed: toClaim.length, focalTarget: this.state.lastFocalTarget });
  }

  addFeedItem(type, text) {
    const item = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      time: new Date().toLocaleTimeString(),
      type,
      text,
    };
    this.state.feed = [item, ...this.state.feed.slice(0, 49)];
  }

  triggerBossEvent() {
    this.state.boss = {
      active: true,
      name: '🐉 THỬ THÁCH THẦN LONG TRẤN QUỐC 🐉',
      targetCells: 1500,
      currentCells: 0,
      remainingSec: 90,
      reward: 'Tặng Thưởng Huân Chương VIP Toàn Server',
    };
    bandoAudio.playBossAlert();
    this.addFeedItem('BOSS', '🔥 CẢNH BÁO: Thử Thách Thần Long Xuất Hiện! Cùng chung tay cắm 1.500 ô cờ!');

    if (this.bossTimer) clearInterval(this.bossTimer);
    this.bossTimer = setInterval(() => {
      if (this.state.boss.remainingSec > 0 && this.state.boss.active) {
        this.state.boss.remainingSec -= 1;
        this.notify();
      } else {
        this.state.boss.active = false;
        clearInterval(this.bossTimer);
        this.notify();
      }
    }, 1000);
    this.notify();
  }

  triggerMission() {
    const provs = Object.values(this.state.provincesStatus).filter(p => !p.isCompleted);
    const targetProv = provs[Math.floor(Math.random() * provs.length)] || { name: 'Thủ Đô' };
    this.state.activeMission = {
      id: `m_${Date.now()}`,
      title: `⚡ NHIỆM VỤ ĐỘT KÍCH: Cắm 100 ô tại [${targetProv.name}]`,
      target: 100,
      current: 0,
      remainingSec: 60,
      reward: 'Nhận x2 Điểm Vinh Danh',
    };
    bandoAudio.playBossAlert();
    this.addFeedItem('MISSION', `🎯 Nhiệm vụ mới: Hoàn thành nhanh 100 ô tại [${targetProv.name}]!`);
    this.notify();
  }

  triggerVictory(winnerUser = { username: 'Đoàn Kết Dân Tộc' }) {
    if (this.state.status === 'victory') return;

    this.state.status = 'victory';
    this.state.percent = 100;
    this.state.remainingCells = 0;
    this.bannerEngine.syncWithMapPercent(100);
    this.state.bannerCells = [...this.bannerEngine.cells];
    this.state.bannerClaimedCount = this.bannerEngine.claimedCount;

    // Sắp xếp Bảng Xếp Hạng hoàn chỉnh
    this.state.leaderboard.sort((a, b) => b.totalCells - a.totalCells);

    // Xác định TOP 1 CHIẾN THẦN QUỐC GIA (MVP Champion)
    const top1Champion = this.state.leaderboard[0] || {
      userId: '@dai_tuong_quan',
      username: winnerUser.username || 'Chiến Binh Áo Đỏ 🇻🇳',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      totalCells: this.state.claimedCount || 1,
      totalGifts: 25,
      tier: 'supreme'
    };

    // Thu thập BẢNG VINH DANH TOP 30 CHIẾN BINH
    let top30 = [...this.state.leaderboard];
    if (top30.length === 0) {
      top30.push(top1Champion);
    }
    top30 = top30.slice(0, 30);

    this.state.victory = {
      roundId: this.state.roundId,
      winner: top1Champion.username,
      totalCells: this.state.totalCells,
      mvpUser: top1Champion,
      top1Champion: top1Champion,
      topContributors: top30.slice(0, 5),
      top30: top30,
      completedAt: new Date().toLocaleTimeString(),
    };

    // Kích hoạt Nhạc Khải Hoàn Ca Hào Hùng & Pháo Hoa
    bandoAudio.playVictoryEpic();
    this.addFeedItem('VICTORY', `🎉 CHÚC MỪNG CHIẾN THẮNG: Toàn bộ Bản Đồ đã rực rỡ sắc cờ quốc kỳ!`);
    this.notify({ type: 'VICTORY' });

    // HỆ THỐNG ĐẾM NGƯỢC 4 GIÂY CHO Ô CHÚC MỪNG / LỄ VINH DANH (AUTO LOOP HOẶC ĐÓNG VINH DANH)
    if (this.victoryCountdownTimer) {
      clearInterval(this.victoryCountdownTimer);
      this.victoryCountdownTimer = null;
    }

    this.state.victoryCountdown = 4;
    this.notify({ type: 'VICTORY' });
    this.notify({ type: 'VICTORY_COUNTDOWN', seconds: 4 });

    this.victoryCountdownTimer = setInterval(() => {
      if (this.state.status !== 'victory') {
        clearInterval(this.victoryCountdownTimer);
        this.victoryCountdownTimer = null;
        return;
      }

      this.state.victoryCountdown = Math.max(0, (this.state.victoryCountdown ?? 4) - 1);
      this.notify({ type: 'VICTORY_COUNTDOWN', seconds: this.state.victoryCountdown });

      if (this.state.victoryCountdown <= 0) {
        clearInterval(this.victoryCountdownTimer);
        this.victoryCountdownTimer = null;

        const wasAuto247 = this.isAuto247Running;
        const wasAutoTesting = this.isAutoTesting;
        const isAutoLoop = this.state.autoLoop247;

        this.resetRound();

        // Nếu đang bật chế độ Auto 24/7 hoặc Auto Test thì tiếp tục chạy vòng mới ngay lập tức
        if (wasAuto247 || isAutoLoop) {
          setTimeout(() => {
            if (this.state.status === 'playing') {
              this.startAuto247Loop();
            }
          }, 300);
        } else if (wasAutoTesting) {
          setTimeout(() => {
            if (this.state.status === 'playing') {
              this.startAutoTestLoop();
            }
          }, 300);
        }
      }
    }, 1000);
  }

  resetRound() {
    if (this.victoryCountdownTimer) {
      clearInterval(this.victoryCountdownTimer);
      this.victoryCountdownTimer = null;
    }

    this.state.status = 'playing';
    this.state.roundId = `ROUND-${Date.now().toString().slice(-4)}`;
    this.state.claimedCount = 0;
    this.state.remainingCells = this.state.totalCells;
    this.state.percent = 0;
    this.state.cellsById = {};
    this.state.victory = null;
    this.state.victoryCountdown = 0;
    this.state.leaderboard = [];
    this.state.combo = { userId: null, username: null, count: 0, level: 1, multiplier: 1, active: false, expiresAt: 0 };
    this.state.boss.active = false;
    this.state.activeMission = null;

    this.bannerEngine.reset();
    this.state.bannerCells = [...this.bannerEngine.cells];
    this.state.bannerClaimedCount = 0;

    Object.values(this.state.provincesStatus).forEach(p => {
      p.claimedCount = 0;
      p.isCompleted = false;
      p.leader = null;
    });

    this.addFeedItem('RESET', '🔄 Vòng chơi mới đã bắt đầu! Sẵn sàng ghép cờ Quốc Gia!');
    this.notify({ type: 'ROUND_RESET' });
  }

  // ==================== HỆ THỐNG AUTO 24/7 TOÀN DIỆN ====================
  setAutoLoop247(enabled) {
    this.state.autoLoop247 = !!enabled;
    this.saveToStorage();
    this.notify({ type: 'AUTO_LOOP_CHANGED', autoLoop247: this.state.autoLoop247 });
  }

  startAuto247Loop() {
    this.stopAuto247Loop();
    this.stopAutoTestLoop();
    this.isAuto247Running = true;
    this.state.isAuto247Running = true;

    // Đảm bảo BGM bật và tự động loop liên tục 24/24
    bandoAudio.startSyntheticBgm();

    let step = 0;
    this.auto247Timer = setInterval(() => {
      if (!this.isAuto247Running) {
        this.stopAuto247Loop();
        return;
      }
      if (this.state.status === 'victory') {
        // Đang trong màn chúc mừng chiến thắng, chờ đếm ngược reset tự động
        return;
      }

      const gifts = this.state.gifts || DEFAULT_MAP_GIFTS;
      const gift = gifts[step % gifts.length];
      const user = MOCK_WARRIORS_POOL[step % MOCK_WARRIORS_POOL.length];
      const count = (step % 5 === 0 && gift.cells <= 20) ? Math.floor(Math.random() * 6) + 2 : 1;

      this.processGift(gift.id, count, user);

      // Kích hoạt Thử Thách & Boss định kỳ để game kịch tính
      if (step % 14 === 0 && !this.state.activeMission) this.triggerMission();
      if (step % 28 === 0 && !this.state.boss.active) this.triggerBossEvent();

      step++;
    }, 650);

    this.notify({ type: 'AUTO_247_STATUS', running: true });
  }

  stopAuto247Loop() {
    this.isAuto247Running = false;
    this.state.isAuto247Running = false;
    if (this.auto247Timer) {
      clearInterval(this.auto247Timer);
      this.auto247Timer = null;
    }
    this.notify({ type: 'AUTO_247_STATUS', running: false });
  }

  toggleAuto247() {
    if (this.isAuto247Running) {
      this.stopAuto247Loop();
    } else {
      this.startAuto247Loop();
    }
  }

  // Chạy Test Tự Động Toàn Bộ Danh Mục Quà (Demo Test Loop)
  startAutoTestLoop(onProgress = null) {
    if (this.isAutoTesting) {
      this.stopAutoTestLoop();
      return;
    }
    this.isAutoTesting = true;

    let step = 0;
    this.autoTestTimer = setInterval(() => {
      if (!this.isAutoTesting) {
        this.stopAutoTestLoop();
        return;
      }
      if (this.state.status === 'victory') {
        return;
      }

      const gifts = this.state.gifts || DEFAULT_MAP_GIFTS;
      const gift = gifts[step % gifts.length];
      const user = MOCK_WARRIORS_POOL[step % MOCK_WARRIORS_POOL.length];
      const count = (step % 4 === 0 && gift.cells <= 10) ? 5 : 1;

      this.processGift(gift.id, count, user);

      if (step === 8) this.triggerMission();
      if (step === 15) this.triggerBossEvent();

      step++;
      if (onProgress) onProgress(step, gift.name);
    }, 950);
    this.notify({ type: 'AUTO_TEST_STATUS', running: true });
  }

  stopAutoTestLoop() {
    this.isAutoTesting = false;
    if (this.autoTestTimer) {
      clearInterval(this.autoTestTimer);
      this.autoTestTimer = null;
    }
    this.notify({ type: 'AUTO_TEST_STATUS', running: false });
  }

  setDemoMode(enabled) {
    this.state.isDemoMode = !!enabled;
    this.saveToStorage();
    this.notify({ type: 'DEMO_MODE_CHANGED', isDemoMode: this.state.isDemoMode });
  }

  setCameraPreset(preset) {
    this.state.cameraPreset = preset;
    this.notify({ type: 'CAMERA_PRESET_CHANGED', preset });
  }

  updateSettings(newSettings) {
    this.state.settings = { ...this.state.settings, ...newSettings };
    this.saveToStorage();
    this.notify({ type: 'SETTINGS_UPDATED', settings: this.state.settings });
  }

  setTheme(theme) {
    const validTheme = theme === 'light' ? 'light' : 'dark';
    this.updateSettings({ theme: validTheme });
  }

  updateMapTexts(newTexts) {
    this.state.mapTexts = newTexts;
    if (this.countries[this.state.selectedCountry]) {
      this.countries[this.state.selectedCountry].labels = newTexts;
    }
    this.saveToStorage();
    this.notify({ type: 'MAP_TEXTS_UPDATED', mapTexts: newTexts });
  }

  addMapText(textObj) {
    const item = {
      id: textObj.id || `text_${Date.now()}`,
      text: textObj.text || 'Nhãn Địa Danh',
      wx: textObj.wx ?? 0,
      wy: textObj.wy ?? 3.5,
      wz: textObj.wz ?? 0,
      color: textObj.color || '#facc15',
      glow: !!textObj.glow,
    };
    this.state.mapTexts = [...this.state.mapTexts, item];
    if (this.countries[this.state.selectedCountry]) {
      this.countries[this.state.selectedCountry].labels = this.state.mapTexts;
    }
    this.saveToStorage();
    this.notify({ type: 'MAP_TEXTS_UPDATED', mapTexts: this.state.mapTexts });
  }

  removeMapText(textId) {
    this.state.mapTexts = this.state.mapTexts.filter(t => t.id !== textId);
    if (this.countries[this.state.selectedCountry]) {
      this.countries[this.state.selectedCountry].labels = this.state.mapTexts;
    }
    this.saveToStorage();
    this.notify({ type: 'MAP_TEXTS_UPDATED', mapTexts: this.state.mapTexts });
  }

  updateGiftConfig(newGifts) {
    this.state.gifts = newGifts;
    this.saveToStorage();
    this.notify({ type: 'GIFTS_UPDATED', gifts: newGifts });
  }

  setAutoRotate(enabled) {
    this.state.autoRotate = !!enabled;
    this.saveToStorage();
    this.notify({ type: 'AUTO_ROTATE_CHANGED', autoRotate: this.state.autoRotate });
  }

  toggleAutoRotate() {
    this.setAutoRotate(!this.state.autoRotate);
    return this.state.autoRotate;
  }

  addCustomProvince(countryKey, prov) {
    const targetKey = countryKey || this.state.selectedCountry;
    const country = this.countries[targetKey] || COUNTRIES_BY_ID[targetKey];
    if (!country) return;

    if (!country.provinces) country.provinces = [];
    const newProv = {
      id: prov.id || `${targetKey}_custom_${Date.now()}`,
      name: prov.name || 'Vùng Miền Mới',
      totalCells: Number(prov.totalCells) || 500,
    };

    country.provinces.push(newProv);

    // If currently playing this country, update provincesStatus
    if (this.state.selectedCountry === targetKey) {
      if (!this.state.provincesStatus) this.state.provincesStatus = {};
      this.state.provincesStatus[newProv.id] = {
        id: newProv.id,
        name: newProv.name,
        totalCells: newProv.totalCells,
        claimedCount: 0,
        isCompleted: false,
        leader: null
      };
    }

    this.saveToStorage();
    this.notify({ type: 'PROVINCES_UPDATED', countryKey: targetKey, provinces: country.provinces });
  }

  removeCustomProvince(countryKey, provId) {
    const targetKey = countryKey || this.state.selectedCountry;
    const country = this.countries[targetKey] || COUNTRIES_BY_ID[targetKey];
    if (!country || !country.provinces) return;

    country.provinces = country.provinces.filter(p => p.id !== provId);
    if (this.state.selectedCountry === targetKey && this.state.provincesStatus) {
      delete this.state.provincesStatus[provId];
    }

    this.saveToStorage();
    this.notify({ type: 'PROVINCES_UPDATED', countryKey: targetKey, provinces: country.provinces });
  }

  restoreDefaultCountryConfig(countryKey) {
    const defaultPreset = COUNTRIES_BY_ID[countryKey] || WORLD_COUNTRIES[0];
    this.countries[countryKey] = JSON.parse(JSON.stringify(defaultPreset));
    if (this.state.selectedCountry === countryKey) {
      this.switchCountry(countryKey);
    }
    this.saveToStorage();
  }
}

export const bandoEngine = new BanDoGameEngine();
export default bandoEngine;
