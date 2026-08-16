import bandoAudio from './bandoAudioEngine';

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

// Định nghĩa Cấu Hình Toàn Diện Cho Các Quốc Gia
export const COUNTRY_PRESETS = {
  vietnam: {
    id: 'vietnam',
    name: 'Việt Nam 🇻🇳',
    flag: '🇻🇳',
    code: 'VN',
    title: '🇻🇳 VIỆT NAM GHÉP CỜ LIVE — BẢN ĐỒ HÌNH CHỮ S 🇻🇳',
    claimedCellColor: '#DA251D',
    starColor: '#FFD700',
    emptyCellColor: '#475569',
    totalCells: 15125,
    labels: [
      { id: 't_hanoi', text: '🏛️ THỦ ĐÔ HÀ NỘI', wx: -20, wy: 3.5, wz: -90, color: '#facc15', glow: true },
      { id: 't_saigon', text: '🏙️ TP. HỒ CHÍ MINH', wx: -15, wy: 3.5, wz: 105, color: '#38bdf8', glow: true },
      { id: 't_hs', text: '🇻🇳 QUẦN ĐẢO HOÀNG SA', wx: 55, wy: 3.5, wz: -10, color: '#ef4444', glow: true },
      { id: 't_ts', text: '🇻🇳 QUẦN ĐẢO TRƯỜNG SA', wx: 75, wy: 3.5, wz: 65, color: '#ef4444', glow: true },
      { id: 't_biendong', text: '🌊 BIỂN ĐÔNG VIỆT NAM', wx: 65, wy: 3.5, wz: 25, color: '#60a5fa', glow: false },
      { id: 't_phuquoc', text: '🏝️ ĐẢO PHÚ QUỐC', wx: -42, wy: 3.5, wz: 140, color: '#34d399', glow: false },
      { id: 't_condao', text: '🏝️ CÔN ĐẢO', wx: -10, wy: 3.5, wz: 160, color: '#34d399', glow: false },
      { id: 't_danang', text: '🏖️ ĐÀ NẴNG', wx: 15, wy: 3.5, wz: 10, color: '#fbbf24', glow: false },
      { id: 't_slogan', text: '⭐ NON SÔNG LIỀN MỘT DẢI ⭐', wx: 0, wy: 3.5, wz: 190, color: '#fbbf24', glow: true },
    ],
    provinces: [
      { id: 'ha-noi', name: 'Thủ Đô Hà Nội', totalCells: 650 },
      { id: 'ho-chi-minh', name: 'TP. Hồ Chí Minh', totalCells: 850 },
      { id: 'da-nang', name: 'Đà Nẵng', totalCells: 450 },
      { id: 'hue', name: 'Thừa Thiên Huế', totalCells: 400 },
      { id: 'hai-phong', name: 'Hải Phòng', totalCells: 380 },
      { id: 'can-tho', name: 'Cần Thơ', totalCells: 350 },
      { id: 'khanh-hoa', name: 'Khánh Hòa (Hoàng Sa - Trường Sa)', totalCells: 750 },
      { id: 'quang-ninh', name: 'Quảng Ninh', totalCells: 420 },
      { id: 'cao-bang', name: 'Cao Bằng', totalCells: 300 },
      { id: 'kien-giang', name: 'Kiên Giang (Đảo Phú Quốc)', totalCells: 420 },
      { id: 'ca-mau', name: 'Cà Mau (Đất Mũi)', totalCells: 360 },
      { id: 'ba-ria', name: 'Bà Rịa - Vũng Tàu (Côn Đảo)', totalCells: 340 },
    ]
  },
  japan: {
    id: 'japan',
    name: 'Nhật Bản 🇯🇵',
    flag: '🇯🇵',
    code: 'JP',
    title: '🇯🇵 JAPAN FLAG LIVE — 日本地図 🇯🇵',
    claimedCellColor: '#BC002D',
    starColor: '#FFFFFF',
    emptyCellColor: '#475569',
    totalCells: 15125,
    labels: [
      { id: 't_tokyo', text: '🏛️ THỦ ĐÔ TOKYO (東京)', wx: 0, wy: 3.5, wz: 10, color: '#ef4444', glow: true },
      { id: 't_hokkaido', text: '❄️ ĐẢO HOKKAIDO (北海道)', wx: 40, wy: 3.5, wz: -110, color: '#38bdf8', glow: true },
      { id: 't_osaka', text: '🏙️ OSAKA & KYOTO (大阪)', wx: -30, wy: 3.5, wz: 40, color: '#facc15', glow: false },
      { id: 't_okinawa', text: '🏝️ QUẦN ĐẢO OKINAWA (沖縄)', wx: -90, wy: 3.5, wz: 150, color: '#34d399', glow: true },
      { id: 't_kyushu', text: '🌊 ĐẢO KYUSHU (九州)', wx: -60, wy: 3.5, wz: 90, color: '#a78bfa', glow: false },
    ],
    provinces: [
      { id: 'tokyo', name: 'Tokyo (Kanto)', totalCells: 800 },
      { id: 'osaka', name: 'Osaka (Kansai)', totalCells: 650 },
      { id: 'hokkaido', name: 'Hokkaido', totalCells: 900 },
      { id: 'kyoto', name: 'Kyoto', totalCells: 450 },
      { id: 'fukuoka', name: 'Fukuoka (Kyushu)', totalCells: 500 },
      { id: 'okinawa', name: 'Okinawa', totalCells: 400 },
      { id: 'nagoya', name: 'Nagoya (Aichi)', totalCells: 550 },
      { id: 'hiroshima', name: 'Hiroshima', totalCells: 420 },
    ]
  },
  korea: {
    id: 'korea',
    name: 'Hàn Quốc 🇰🇷',
    flag: '🇰🇷',
    code: 'KR',
    title: '🇰🇷 KOREA FLAG LIVE — 대한민국 🇰🇷',
    claimedCellColor: '#0047A0',
    starColor: '#CD2E3A',
    emptyCellColor: '#475569',
    totalCells: 15125,
    labels: [
      { id: 't_seoul', text: '🏛️ THỦ ĐÔ SEOUL (서울)', wx: -10, wy: 3.5, wz: -60, color: '#ef4444', glow: true },
      { id: 't_busan', text: '🏙️ THÀNH PHỐ BUSAN (부산)', wx: 30, wy: 3.5, wz: 60, color: '#38bdf8', glow: true },
      { id: 't_jeju', text: '🏝️ ĐẢO JEJU (제주도)', wx: -40, wy: 3.5, wz: 140, color: '#34d399', glow: true },
      { id: 't_incheon', text: '✈️ INCHEON (인천)', wx: -25, wy: 3.5, wz: -50, color: '#facc15', glow: false },
    ],
    provinces: [
      { id: 'seoul', name: 'Seoul', totalCells: 950 },
      { id: 'busan', name: 'Busan', totalCells: 700 },
      { id: 'incheon', name: 'Incheon', totalCells: 500 },
      { id: 'daegu', name: 'Daegu', totalCells: 450 },
      { id: 'jeju', name: 'Đảo Jeju', totalCells: 400 },
      { id: 'gyeonggi', name: 'Gyeonggi-do', totalCells: 800 },
      { id: 'gangwon', name: 'Gangwon-do', totalCells: 500 },
    ]
  },
  usa: {
    id: 'usa',
    name: 'Hoa Kỳ 🇺🇸',
    flag: '🇺🇸',
    code: 'US',
    title: '🇺🇸 UNITED STATES FLAG LIVE — USA 🇺🇸',
    claimedCellColor: '#B22234',
    starColor: '#3C3B6E',
    emptyCellColor: '#475569',
    totalCells: 15125,
    labels: [
      { id: 't_dc', text: '🏛️ WASHINGTON D.C', wx: 60, wy: 3.5, wz: -20, color: '#38bdf8', glow: true },
      { id: 't_nyc', text: '🏙️ NEW YORK CITY', wx: 70, wy: 3.5, wz: -40, color: '#facc15', glow: true },
      { id: 't_cali', text: '🏖️ CALIFORNIA', wx: -80, wy: 3.5, wz: 10, color: '#fbbf24', glow: true },
      { id: 't_hawaii', text: '🏝️ QUẦN ĐẢO HAWAII', wx: -110, wy: 3.5, wz: 120, color: '#34d399', glow: true },
      { id: 't_texas', text: '⭐ TEXAS', wx: -10, wy: 3.5, wz: 70, color: '#ef4444', glow: false },
    ],
    provinces: [
      { id: 'california', name: 'California', totalCells: 900 },
      { id: 'texas', name: 'Texas', totalCells: 850 },
      { id: 'new-york', name: 'New York', totalCells: 750 },
      { id: 'florida', name: 'Florida', totalCells: 650 },
      { id: 'washington', name: 'Washington D.C', totalCells: 550 },
      { id: 'hawaii', name: 'Hawaii', totalCells: 400 },
    ]
  },
  france: {
    id: 'france',
    name: 'Pháp 🇫🇷',
    flag: '🇫🇷',
    code: 'FR',
    title: '🇫🇷 FRANCE FLAG LIVE — LA FRANCE 🇫🇷',
    claimedCellColor: '#0055A4',
    starColor: '#EF4135',
    emptyCellColor: '#475569',
    totalCells: 15125,
    labels: [
      { id: 't_paris', text: '🏛️ THỦ ĐÔ PARIS', wx: 0, wy: 3.5, wz: -40, color: '#38bdf8', glow: true },
      { id: 't_marseille', text: '🏖️ MARSEILLE & NICE', wx: 20, wy: 3.5, wz: 80, color: '#ef4444', glow: true },
      { id: 't_corse', text: '🏝️ ĐẢO CORSE', wx: 60, wy: 3.5, wz: 110, color: '#34d399', glow: true },
      { id: 't_lyon', text: '🏙️ LYON', wx: 25, wy: 3.5, wz: 30, color: '#facc15', glow: false },
    ],
    provinces: [
      { id: 'paris', name: 'Paris (Île-de-France)', totalCells: 950 },
      { id: 'marseille', name: 'Marseille (PACA)', totalCells: 650 },
      { id: 'lyon', name: 'Lyon (Auvergne)', totalCells: 550 },
      { id: 'corse', name: 'Đảo Corse', totalCells: 400 },
      { id: 'bordeaux', name: 'Bordeaux', totalCells: 450 },
    ]
  },
  germany: {
    id: 'germany',
    name: 'Đức 🇩🇪',
    flag: '🇩🇪',
    code: 'DE',
    title: '🇩🇪 GERMANY FLAG LIVE — DEUTSCHLAND 🇩🇪',
    claimedCellColor: '#FFCC00',
    starColor: '#DD0000',
    emptyCellColor: '#475569',
    totalCells: 15125,
    labels: [
      { id: 't_berlin', text: '🏛️ THỦ ĐÔ BERLIN', wx: 30, wy: 3.5, wz: -60, color: '#facc15', glow: true },
      { id: 't_munich', text: '🏙️ MUNICH (BAYERN)', wx: 10, wy: 3.5, wz: 70, color: '#ef4444', glow: true },
      { id: 't_frankfurt', text: '💼 FRANKFURT', wx: -20, wy: 3.5, wz: 10, color: '#38bdf8', glow: false },
      { id: 't_hamburg', text: '⚓ HAMBURG', wx: -5, wy: 3.5, wz: -90, color: '#60a5fa', glow: false },
    ],
    provinces: [
      { id: 'berlin', name: 'Berlin', totalCells: 850 },
      { id: 'bayern', name: 'Bayern (Munich)', totalCells: 800 },
      { id: 'hamburg', name: 'Hamburg', totalCells: 500 },
      { id: 'hessen', name: 'Hessen (Frankfurt)', totalCells: 550 },
      { id: 'nrw', name: 'Nordrhein-Westfalen', totalCells: 750 },
    ]
  }
};

const STORAGE_KEY_CONFIG = 'aidol_bando_custom_config_v2';
const STORAGE_KEY_COUNTRIES = 'aidol_bando_countries_custom_v2';

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
    const savedCountries = this.loadFromStorage(STORAGE_KEY_COUNTRIES, COUNTRY_PRESETS);
    this.countries = { ...COUNTRY_PRESETS, ...savedCountries };

    const initialCountryKey = savedCustomConfig.selectedCountry || 'vietnam';
    const currentPreset = this.countries[initialCountryKey] || this.countries.vietnam;

    // Game state
    this.state = {
      roundId: 'ROUND-1',
      status: 'playing', // playing | victory | paused
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
      mapTexts: savedCustomConfig.mapTexts || currentPreset.labels,
      gifts: savedCustomConfig.gifts || DEFAULT_MAP_GIFTS,
      settings: {
        theme: 'dark',
        brightness: savedCustomConfig.brightness || 1.4,
        emptyCellColor: savedCustomConfig.emptyCellColor || currentPreset.emptyCellColor || '#475569',
        claimedCellColor: savedCustomConfig.claimedCellColor || currentPreset.claimedCellColor || '#DA251D',
        starColor: savedCustomConfig.starColor || currentPreset.starColor || '#FFD700',
        autoRotate: true,
        autoRotateSpeed: 0.6,
        showProvinceLabels: true,
        showMapTexts: true,
        voiceAnnouncer: true,
        bgmVolume: savedCustomConfig.bgmVolume !== undefined ? savedCustomConfig.bgmVolume : 0.35,
        sfxVolume: savedCustomConfig.sfxVolume !== undefined ? savedCustomConfig.sfxVolume : 0.8,
        customMapTitle: savedCustomConfig.customMapTitle || currentPreset.title,
        selectedCountry: initialCountryKey,
      }
    };

    this.comboTimer = null;
    this.missionTimer = null;
    this.bossTimer = null;
    this.autoTestTimer = null;
    this.isAutoTesting = false;

    // Load static data
    this.initData();
  }

  loadFromStorage(key, fallback) {
    if (typeof localStorage === 'undefined') return fallback;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
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
        brightness: this.state.settings.brightness,
        emptyCellColor: this.state.settings.emptyCellColor,
        claimedCellColor: this.state.settings.claimedCellColor,
        starColor: this.state.settings.starColor,
        customMapTitle: this.state.settings.customMapTitle,
        bgmVolume: this.state.settings.bgmVolume,
        sfxVolume: this.state.settings.sfxVolume,
        mapTexts: this.state.mapTexts,
        gifts: this.state.gifts,
      };
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(configToSave));
      localStorage.setItem(STORAGE_KEY_COUNTRIES, JSON.stringify(this.countries));
    } catch (e) {}
  }

  async initData() {
    try {
      const [maskRes, provRes] = await Promise.all([
        fetch('/data/vietnamMask.json'),
        fetch('/data/provinces.json')
      ]);

      if (maskRes.ok && provRes.ok) {
        this.maskData = await maskRes.json();
        const provJson = await provRes.json();
        this.provincesData = provJson.provinces || [];
        this.buildGridForCurrentCountry();
      }
    } catch (e) {
      console.warn('Fallback loading built-in map grid for BanDoGameEngine', e);
      this.generateFallbackGrid();
    }
  }

  buildGridForCurrentCountry() {
    const preset = this.countries[this.state.selectedCountry] || this.countries.vietnam;
    const targetCount = this.state.totalCells || 15125;

    // Build or scale cell grid
    let baseCells = [];
    if (this.maskData && this.maskData.cells && this.state.selectedCountry === 'vietnam') {
      baseCells = this.maskData.cells;
    } else {
      baseCells = this.generateCountryGeometry(this.state.selectedCountry, targetCount);
    }

    // Subsample or interpolate to match targetCount
    let finalCells = [];
    if (baseCells.length === targetCount) {
      finalCells = baseCells;
    } else if (baseCells.length > targetCount) {
      const step = baseCells.length / targetCount;
      for (let i = 0; i < targetCount; i++) {
        finalCells.push(baseCells[Math.floor(i * step)]);
      }
    } else {
      finalCells = [...baseCells];
      let idx = 0;
      while (finalCells.length < targetCount) {
        const c = baseCells[idx % baseCells.length];
        finalCells.push({
          ...c,
          id: finalCells.length + 1,
          x: c.x + (Math.random() - 0.5) * 1.5,
          y: c.y + (Math.random() - 0.5) * 1.5,
        });
        idx++;
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

    provs.forEach((p, idx) => {
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
    const cols = 300;
    const rows = 389;
    let cid = 1;

    for (let i = 0; i < count; i++) {
      let x = 150;
      let y = 190;

      if (countryKey === 'japan') {
        // Japanese Archipelago (Arch curve from SW to NE + Hokkaido + Okinawa)
        const t = (i / count);
        if (i % 8 === 0) {
          // Okinawa Islands
          x = 80 + (Math.random() - 0.5) * 20;
          y = 320 + (Math.random() - 0.5) * 20;
        } else if (i % 6 === 0) {
          // Hokkaido Island
          x = 210 + (Math.random() - 0.5) * 45;
          y = 70 + (Math.random() - 0.5) * 35;
        } else {
          // Honshu mainland curve
          const prog = (i % (count * 0.8)) / (count * 0.8);
          x = 100 + Math.pow(prog, 1.2) * 110 + (Math.random() - 0.5) * 28;
          y = 260 - prog * 160 + (Math.random() - 0.5) * 25;
        }
      } else if (countryKey === 'korea') {
        // Korean Peninsula + Jeju
        if (i % 12 === 0) {
          // Jeju Island
          x = 120 + (Math.random() - 0.5) * 16;
          y = 310 + (Math.random() - 0.5) * 16;
        } else {
          x = 145 + (Math.random() - 0.5) * 40;
          y = 110 + (i / count) * 160 + (Math.random() - 0.5) * 15;
        }
      } else if (countryKey === 'usa') {
        // US wide mainland + Hawaii
        if (i % 15 === 0) {
          // Hawaii
          x = 60 + (Math.random() - 0.5) * 18;
          y = 290 + (Math.random() - 0.5) * 18;
        } else {
          x = 70 + Math.random() * 160;
          y = 120 + Math.random() * 140;
        }
      } else if (countryKey === 'france') {
        // Hexagon France + Corsica
        if (i % 15 === 0) {
          // Corsica Island
          x = 220 + (Math.random() - 0.5) * 15;
          y = 280 + (Math.random() - 0.5) * 25;
        } else {
          const angle = Math.random() * Math.PI * 2;
          const rad = Math.sqrt(Math.random()) * 65;
          x = 150 + Math.cos(angle) * rad;
          y = 190 + Math.sin(angle) * rad * 0.9;
        }
      } else {
        // Germany / Default
        x = 150 + (Math.random() - 0.5) * 80;
        y = 190 + (Math.random() - 0.5) * 110;
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

  // Xử lý chuyển quốc gia
  switchCountry(countryKey) {
    const preset = this.countries[countryKey] || this.countries.vietnam;
    this.state.selectedCountry = countryKey;
    this.state.mapTexts = preset.labels || [];
    this.state.settings.customMapTitle = preset.title;
    this.state.settings.claimedCellColor = preset.claimedCellColor;
    this.state.settings.starColor = preset.starColor;
    this.state.settings.emptyCellColor = preset.emptyCellColor;
    this.state.settings.selectedCountry = countryKey;

    this.resetRound();
    this.buildGridForCurrentCountry();
    this.saveToStorage();
    this.notify({ type: 'COUNTRY_CHANGED', countryKey });
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

    // Audio SFX
    if (giftDef.tier === 'mythic' || giftDef.tier === 'divine' || giftDef.tier === 'legendary') {
      bandoAudio.playGiftFanfare(giftDef.tier);
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

    this.notify({ type: 'GIFT_PLACED', giftId, count, user, claimed: toClaim.length });
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
    this.state.status = 'victory';
    this.state.percent = 100;
    this.state.remainingCells = 0;
    this.state.victory = {
      roundId: this.state.roundId,
      winner: winnerUser.username,
      totalCells: this.state.totalCells,
      mvpUser: this.state.leaderboard[0] || winnerUser,
      topContributors: this.state.leaderboard.slice(0, 5),
      completedAt: new Date().toLocaleTimeString(),
    };
    bandoAudio.playVictory();
    this.addFeedItem('VICTORY', `🎉 CHÚC MỪNG CHIẾN THẮNG: Toàn bộ Bản Đồ đã rực rỡ sắc cờ quốc kỳ!`);
    this.notify({ type: 'VICTORY' });
  }

  resetRound() {
    this.state.status = 'playing';
    this.state.roundId = `ROUND-${Date.now().toString().slice(-4)}`;
    this.state.claimedCount = 0;
    this.state.remainingCells = this.state.totalCells;
    this.state.percent = 0;
    this.state.cellsById = {};
    this.state.victory = null;
    this.state.leaderboard = [];
    this.state.combo = { userId: null, username: null, count: 0, level: 1, multiplier: 1, active: false, expiresAt: 0 };
    this.state.boss.active = false;
    this.state.activeMission = null;

    Object.values(this.state.provincesStatus).forEach(p => {
      p.claimedCount = 0;
      p.isCompleted = false;
      p.leader = null;
    });

    this.addFeedItem('RESET', '🔄 Vòng chơi mới đã bắt đầu! Sẵn sàng ghép cờ Quốc Gia!');
    this.notify({ type: 'ROUND_RESET' });
  }

  // Chạy Test Tự Động Toàn Bộ Danh Mục Quà
  startAutoTestLoop(onProgress = null) {
    if (this.isAutoTesting) {
      this.stopAutoTestLoop();
      return;
    }
    this.isAutoTesting = true;
    const testUsers = [
      { id: 'user_viet', username: 'Quân Đội Nhân Dân 🇻🇳', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
      { id: 'user_dan', username: 'Đồng Bào Cả Nước ❤️', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
      { id: 'user_hanoi', username: 'Thủ Đô Trái Tim 🏛️', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
      { id: 'user_saigon', username: 'Thành Phố Rực Rỡ 🏙️', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100' },
      { id: 'user_danang', username: 'Biển Đảo Quê Hương 🌊', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100' },
    ];

    let step = 0;
    this.autoTestTimer = setInterval(() => {
      if (!this.isAutoTesting || this.state.status === 'victory') {
        this.stopAutoTestLoop();
        return;
      }

      const gifts = this.state.gifts || DEFAULT_MAP_GIFTS;
      const gift = gifts[step % gifts.length];
      const user = testUsers[step % testUsers.length];
      const count = (step % 4 === 0 && gift.cells <= 10) ? 5 : 1;

      this.processGift(gift.id, count, user);

      // Thỉnh thoảng kích hoạt Mission & Boss
      if (step === 8) this.triggerMission();
      if (step === 15) this.triggerBossEvent();

      step++;
      if (onProgress) onProgress(step, gift.name);
    }, 1200);
    this.notify();
  }

  stopAutoTestLoop() {
    this.isAutoTesting = false;
    if (this.autoTestTimer) {
      clearInterval(this.autoTestTimer);
      this.autoTestTimer = null;
    }
    this.notify();
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

  restoreDefaultCountryConfig(countryKey) {
    const defaultPreset = COUNTRY_PRESETS[countryKey] || COUNTRY_PRESETS.vietnam;
    this.countries[countryKey] = JSON.parse(JSON.stringify(defaultPreset));
    if (this.state.selectedCountry === countryKey) {
      this.switchCountry(countryKey);
    }
    this.saveToStorage();
  }
}

export const bandoEngine = new BanDoGameEngine();
export default bandoEngine;
