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
  { id: 'flag_legend', name: 'Đại Kỳ Tổ Quốc', icon: '🇻🇳', cells: 5000, color: '#dc2626', tier: 'divine', priceToken: 5000 },
];

export const HONOR_TIERS = [
  { id: 'novice', name: 'Tân Thủ Cắm Cờ', minCells: 1, icon: '🌱', color: '#94a3b8' },
  { id: 'bronze', name: 'Chiến Binh Đồng', minCells: 50, icon: '🥉', color: '#cd7f32' },
  { id: 'silver', name: 'Hiệp Sĩ Bạc', minCells: 200, icon: '🥈', color: '#94a3b8' },
  { id: 'gold', name: 'Tướng Quân Vàng', minCells: 500, icon: '🥇', color: '#eab308' },
  { id: 'diamond', name: 'Chủ Soái Kim Cương', minCells: 1500, icon: '💎', color: '#38bdf8' },
  { id: 'supreme', name: 'Đại Thần Tổ Quốc', minCells: 5000, icon: '👑', color: '#f43f5e' },
];

export function getHonorTier(cells) {
  let matched = HONOR_TIERS[0];
  for (const tier of HONOR_TIERS) {
    if (cells >= tier.minCells) matched = tier;
  }
  return matched;
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

    // Game state
    this.state = {
      roundId: 'ROUND-1',
      status: 'playing', // playing | victory | paused
      totalCells: 15125,
      claimedCount: 0,
      remainingCells: 15125,
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
      settings: {
        theme: 'dark',
        autoRotate: true,
        autoRotateSpeed: 0.6,
        showProvinceLabels: true,
        voiceAnnouncer: true,
        bgmVolume: 0.35,
        sfxVolume: 0.8,
        customMapTitle: '🇻🇳 VIỆT NAM GHÉP CỜ LIVE — BẢN ĐỒ HÌNH CHỮ S 🇻🇳',
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
        this.state.totalCells = this.maskData.playableCellCount || 15125;
        this.state.remainingCells = this.state.totalCells;

        // Init provinces status
        const provStatus = {};
        this.provincesData.forEach(p => {
          provStatus[p.id] = {
            id: p.id,
            name: p.name,
            totalCells: p.totalCells || 250,
            claimedCount: 0,
            isCompleted: false,
            leader: null,
          };
        });
        this.state.provincesStatus = provStatus;
        this.isLoaded = true;
        this.notify();
      }
    } catch (e) {
      console.warn('Fallback loading built-in map grid for BanDoGameEngine', e);
      this.generateFallbackGrid();
    }
  }

  generateFallbackGrid() {
    const cells = [];
    const provs = [
      { id: 'ha-noi', name: 'Hà Nội', total: 600 },
      { id: 'da-nang', name: 'Đà Nẵng', total: 500 },
      { id: 'hue', name: 'Huế', total: 450 },
      { id: 'ho-chi-minh', name: 'TP. Hồ Chí Minh', total: 800 },
      { id: 'can-tho', name: 'Cần Thơ', total: 400 },
      { id: 'hai-phong', name: 'Hải Phòng', total: 350 },
      { id: 'cao-bang', name: 'Cao Bằng', total: 300 },
      { id: 'quang-ninh', name: 'Quảng Ninh', total: 400 },
      { id: 'nha-trang', name: 'Khánh Hòa (Hoàng Sa - Trường Sa)', total: 700 },
      { id: 'ca-mau', name: 'Cà Mau (Đất Mũi)', total: 350 },
    ];
    let cid = 1;
    provs.forEach((p, pIdx) => {
      for (let i = 0; i < p.total; i++) {
        cells.push({
          id: cid++,
          x: Math.floor(100 + Math.sin(pIdx * 0.5) * 40 + (i % 20)),
          y: Math.floor(30 + pIdx * 30 + Math.floor(i / 20)),
          provinceId: p.id,
          region: 'mainland'
        });
      }
    });
    this.maskData = {
      gridCols: 300,
      gridRows: 389,
      playableCellCount: cells.length,
      cells
    };
    this.state.totalCells = cells.length;
    this.state.remainingCells = cells.length;
    this.isLoaded = true;
    this.notify();
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

  // Xử lý sự kiện tặng quà và cắm cờ
  processGift(giftId, count = 1, user = { id: 'guest_1', username: 'Chiến Binh Áo Đỏ', avatar: '' }) {
    if (this.state.status === 'victory' || !this.maskData) return;

    const giftDef = DEFAULT_MAP_GIFTS.find(g => g.id === giftId) || DEFAULT_MAP_GIFTS[0];
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

    const placedColor = '#DA251D'; // Đỏ cờ Tổ Quốc
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
        this.addFeedItem('PROVINCE_COMPLETE', `⭐ Tỉnh/Thành [${p.name}] đã hoàn thành 100% cắm cờ bởi ${user.username}!`);
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
      name: '🐉 THỬ THÁCH ĐẠI LONG TRẤN QUỐC 🐉',
      targetCells: 1500,
      currentCells: 0,
      remainingSec: 90,
      reward: 'Tặng Thưởng Huân Chương VIP Toàn Server',
    };
    bandoAudio.playBossAlert();
    this.addFeedItem('BOSS', '🔥 CẢNH BÁO: Thử Thách Đại Long Trấn Quốc Xuất Hiện! Cùng chung tay cắm 1.500 ô cờ!');

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
    const targetProv = provs[Math.floor(Math.random() * provs.length)] || { name: 'Thủ Đô Hà Nội' };
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
    this.addFeedItem('VICTORY', `🎉 CHÚC MỪNG CHIẾN THẮNG: Toàn bộ Bản Đồ Việt Nam Hình Chữ S đã rực rỡ cờ đỏ sao vàng!`);
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

    this.addFeedItem('RESET', '🔄 Vòng chơi mới đã bắt đầu! Sẵn sàng ghép cờ Tổ Quốc!');
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
      { id: 'user_hanoi', username: 'Hà Nội Trái Tim 🏛️', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
      { id: 'user_saigon', username: 'Sài Gòn Rực Rỡ 🏙️', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100' },
      { id: 'user_danang', username: 'Đà Nẵng Biển Đảo 🌊', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100' },
    ];

    let step = 0;
    this.autoTestTimer = setInterval(() => {
      if (!this.isAutoTesting || this.state.status === 'victory') {
        this.stopAutoTestLoop();
        return;
      }

      const gift = DEFAULT_MAP_GIFTS[step % DEFAULT_MAP_GIFTS.length];
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
}

export const bandoEngine = new BanDoGameEngine();
export default bandoEngine;
