import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Trophy, Volume2, VolumeX, Shield, Swords, Sparkles, 
  Crown, Play, Pause, RotateCcw, Settings, Flame, Zap, CheckCircle2, Mic, MicOff, Music, Music2,
  Smartphone, MonitorPlay, Gift
} from 'lucide-react';
import { battleAudio } from './battleAudioEngine';
import { battleCommentary } from './battleCommentaryEngine';
import { battleVoiceEngine } from './gameVoiceEngine';
import { computeSkeletalJoints, render3DWarriorSkeleton, SKELETON_STATES } from '../../../lib/game3d/warrior3DSkeleton';
import LiveGiftMarqueeTicker from './LiveGiftMarqueeTicker';
import LiveGiftConfigModal from './LiveGiftConfigModal';


// 20 Dance styles
export const DANCE_STYLES = [
  { id: 1, name: 'Vươn Vai', bounceFreq: 1, bounceAmp: 2, swayFreq: 0.5, swayAmp: 3, armFreq: 1, armAmp: 10, legFreq: 0, legAmp: 0, jumpFreq: 0, jumpHeight: 0, sparkle: false },
  { id: 2, name: 'Gật Đầu Nhịp', bounceFreq: 2, bounceAmp: 3, swayFreq: 0, swayAmp: 0, armFreq: 0.5, armAmp: 8, legFreq: 0, legAmp: 0, jumpFreq: 0, jumpHeight: 0, sparkle: false },
  { id: 3, name: 'Đung Đưa Hông', bounceFreq: 1, bounceAmp: 2, swayFreq: 1.5, swayAmp: 6, armFreq: 1.5, armAmp: 12, legFreq: 0, legAmp: 0, jumpFreq: 0, jumpHeight: 0, sparkle: false },
  { id: 4, name: 'Bước Đều', bounceFreq: 2, bounceAmp: 4, swayFreq: 0, swayAmp: 0, armFreq: 2, armAmp: 10, legFreq: 2, legAmp: 10, jumpFreq: 0, jumpHeight: 0, sparkle: false },
  { id: 5, name: 'Vẫy Tay Chào', bounceFreq: 1, bounceAmp: 2, swayFreq: 0.5, swayAmp: 4, armFreq: 3, armAmp: 20, legFreq: 0, legAmp: 0, jumpFreq: 0, jumpHeight: 0, sparkle: false },
  { id: 6, name: 'Nhún Nhảy Nhẹ', bounceFreq: 2.5, bounceAmp: 6, swayFreq: 1, swayAmp: 5, armFreq: 2, armAmp: 15, legFreq: 0, legAmp: 0, jumpFreq: 0, jumpHeight: 0, sparkle: false },
  { id: 7, name: 'Vặn Người Nhẹ', bounceFreq: 1, bounceAmp: 3, swayFreq: 1.2, swayAmp: 9, armFreq: 1.2, armAmp: 12, legFreq: 0, legAmp: 0, jumpFreq: 0, jumpHeight: 0, sparkle: false },
  { id: 8, name: 'Lắc Hông Thể Dục', bounceFreq: 1.5, bounceAmp: 3, swayFreq: 2.5, swayAmp: 10, armFreq: 1, armAmp: 10, legFreq: 0, legAmp: 0, jumpFreq: 0, jumpHeight: 0, sparkle: false },
  { id: 9, name: 'Nhảy Cóc', bounceFreq: 0, bounceAmp: 0, swayFreq: 1, swayAmp: 5, armFreq: 1, armAmp: 10, legFreq: 0, legAmp: 0, jumpFreq: 1.5, jumpHeight: 14, sparkle: false },
  { id: 10, name: 'Vung Tay Mạnh', bounceFreq: 2, bounceAmp: 4, swayFreq: 1, swayAmp: 6, armFreq: 2.5, armAmp: 26, legFreq: 0, legAmp: 0, jumpFreq: 0, jumpHeight: 0, sparkle: false },
  { id: 11, name: 'Đấm Bốc Nhẹ', bounceFreq: 1, bounceAmp: 3, swayFreq: 0.8, swayAmp: 5, armFreq: 3, armAmp: 22, legFreq: 1, legAmp: 6, jumpFreq: 0, jumpHeight: 0, sparkle: false },
  { id: 12, name: 'Jumping Jack', bounceFreq: 0, bounceAmp: 0, swayFreq: 0, swayAmp: 0, armFreq: 2, armAmp: 30, legFreq: 2, legAmp: 16, jumpFreq: 2, jumpHeight: 10, sparkle: true },
  { id: 13, name: 'Sóng Cơ Thể', bounceFreq: 3, bounceAmp: 5, swayFreq: 2, swayAmp: 9, armFreq: 2, armAmp: 16, legFreq: 0, legAmp: 0, jumpFreq: 0, jumpHeight: 0, sparkle: true },
  { id: 14, name: 'Đá Chân Nhanh', bounceFreq: 1, bounceAmp: 2, swayFreq: 0, swayAmp: 0, armFreq: 1.5, armAmp: 14, legFreq: 2.2, legAmp: 20, jumpFreq: 0, jumpHeight: 0, sparkle: true },
  { id: 15, name: 'Nhảy Bật Cao', bounceFreq: 0, bounceAmp: 0, swayFreq: 1, swayAmp: 4, armFreq: 2, armAmp: 20, legFreq: 0, legAmp: 0, jumpFreq: 1.2, jumpHeight: 26, sparkle: true },
  { id: 16, name: 'Squat Nhịp Điệu', bounceFreq: 1.4, bounceAmp: 10, swayFreq: 0, swayAmp: 0, armFreq: 1.4, armAmp: 16, legFreq: 1.4, legAmp: 8, jumpFreq: 0, jumpHeight: 0, sparkle: true },
  { id: 17, name: 'Robot Dance', bounceFreq: 4, bounceAmp: 3, swayFreq: 0, swayAmp: 0, armFreq: 4, armAmp: 22, legFreq: 4, legAmp: 6, jumpFreq: 0, jumpHeight: 0, sparkle: true },
  { id: 18, name: 'Gập Bụng Nhịp', bounceFreq: 2, bounceAmp: 6, swayFreq: 0, swayAmp: 0, armFreq: 2, armAmp: 18, legFreq: 1, legAmp: 10, jumpFreq: 0.9, jumpHeight: 16, sparkle: true },
  { id: 19, name: 'Cardio Rực Lửa', bounceFreq: 3, bounceAmp: 7, swayFreq: 1.5, swayAmp: 8, armFreq: 3, armAmp: 24, legFreq: 2.5, legAmp: 18, jumpFreq: 1.5, jumpHeight: 18, sparkle: true },
  { id: 20, name: 'Vũ Điệu Vô Địch', bounceFreq: 3, bounceAmp: 8, swayFreq: 1.2, swayAmp: 10, armFreq: 3, armAmp: 30, legFreq: 2.5, legAmp: 20, jumpFreq: 1.3, jumpHeight: 24, sparkle: true }
];

export default function GameChienDau({ 
  isPopout = false, 
  onOpenAdmin = null,
  externalLiveEvent = null,
  aspectRatio: propAspectRatio = null,
  onToggleAspectRatio = null,
  isDarkMode = true,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Game Configuration State (stored in localStorage for persistence)
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('GAME_BATTLE_CONFIG');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      title: 'Kingdom Clash: Ultimate War',
      blueName: 'Rồng Xanh',
      blueColor: '#2f6bff',
      redName: 'Hổ Đỏ',
      redColor: '#ff3b4e',
      maxHp: 1000,
      comebackThreshold: 30,
      charScale: 1.15,
      animSpeed: 0.55,
      musicVolume: 0.4,
      sfxVolume: 0.7,
      soundEnabled: true,
      showGiftHud: true,
      gifts: [
        { id: 1, name: 'Hoa Hồng / Tim', icon: '🌸', coins: 1, tier: 'Tân Binh', buff: '+10 HP Xung Trận', skill: 'Vào Trận' },
        { id: 2, name: 'Nước Hoa / Mũ', icon: '🛡️', coins: 50, tier: 'Thiết Giáp Hiệp', buff: '+150 HP + Giáp Bạc', skill: 'Kiếm Thép' },
        { id: 3, name: 'Vương Miện / Cánh', icon: '👑', coins: 200, tier: 'Kim Khải Thần Tướng', buff: '+600 HP + Cánh Vàng', skill: 'Thái Cực Trận' },
        { id: 4, name: 'Xe Thể Thao / Sét', icon: '⚡', coins: 500, tier: 'Chiến Thần Vạn Kiếm', buff: '+1500 HP + Thần Binh', skill: 'Vạn Kiếm Quy Tông' },
        { id: 5, name: 'Thần Long / Vũ Trụ', icon: '🐉', coins: 1000, tier: 'Chí Tôn Thiên Tôn', buff: '+3500 HP + Rồng Thần', skill: 'Giáng Long Chưởng' }
      ]
    };
  });

  // Dynamic Game State
  const [gameState, setGameState] = useState({
    hp: { blue: 1000, red: 1000 },
    maxHp: 1000,
    isPaused: false,
    winner: null,
    countdown: null,
    leaderboard: [],
    recentSpotlight: null
  });

  const [soundMuted, setSoundMuted] = useState(false);
  const [flashSide, setFlashSide] = useState(null);
  const [liveFeed, setLiveFeed] = useState([]); // Array of recent live comments & gifts
  const [isGiftHudMinimized, setIsGiftHudMinimized] = useState(false);
  const [isGiftHudClosed, setIsGiftHudClosed] = useState(false);
  const [showGiftConfigModal, setShowGiftConfigModal] = useState(false);

  const handleUserGesture = useCallback(() => {
    battleAudio.unlock();
  }, []);
  const [isLeaderboardMinimized, setIsLeaderboardMinimized] = useState(false);
  const [isLeaderboardClosed, setIsLeaderboardClosed] = useState(false);
  const [isLiveCleanMode, setIsLiveCleanMode] = useState(isPopout);

  // Draggable HUD Positions State
  const [leaderboardPos, setLeaderboardPos] = useState(() => {
    try {
      const saved = localStorage.getItem('battle_hud_leaderboard_pos');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { x: 10, y: 70 };
  });
  const [giftHudPos, setGiftHudPos] = useState(() => {
    try {
      const saved = localStorage.getItem('battle_hud_gift_pos');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { x: null, y: 70, right: 10 };
  });

  const draggingBattleHudRef = useRef(null);
  const dragBattleOffsetRef = useRef({ x: 0, y: 0 });

  const handleBattleHudDragStart = (e, hudType) => {
    e.stopPropagation();
    draggingBattleHudRef.current = hudType;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const parentEl = e.currentTarget.parentElement;
    if (parentEl) {
      const rect = parentEl.getBoundingClientRect();
      dragBattleOffsetRef.current = {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!draggingBattleHudRef.current || !containerRef.current) return;
      const stageRect = containerRef.current.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      let newX = clientX - stageRect.left - dragBattleOffsetRef.current.x;
      let newY = clientY - stageRect.top - dragBattleOffsetRef.current.y;

      newX = Math.max(5, Math.min(newX, stageRect.width - 70));
      newY = Math.max(5, Math.min(newY, stageRect.height - 70));

      if (draggingBattleHudRef.current === 'leaderboard') {
        const newPos = { x: Math.round(newX), y: Math.round(newY) };
        setLeaderboardPos(newPos);
        try { localStorage.setItem('battle_hud_leaderboard_pos', JSON.stringify(newPos)); } catch (err) {}
      } else if (draggingBattleHudRef.current === 'gift') {
        const newPos = { x: Math.round(newX), y: Math.round(newY), right: null };
        setGiftHudPos(newPos);
        try { localStorage.setItem('battle_hud_gift_pos', JSON.stringify(newPos)); } catch (err) {}
      }
    };

    const handlePointerUp = () => {
      draggingBattleHudRef.current = null;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove);
    window.addEventListener('touchend', handlePointerUp);
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, []);

  const [internalAspectRatio, setInternalAspectRatio] = useState(() => {
    try {
      return localStorage.getItem('avalive_battle_aspect_ratio') || '16:9';
    } catch (e) {
      return '16:9';
    }
  });
  const aspectRatio = propAspectRatio || internalAspectRatio;

  const handleToggleAspectRatio = () => {
    if (onToggleAspectRatio) {
      onToggleAspectRatio();
    } else {
      const nextAspect = aspectRatio === '9:16' ? '16:9' : '9:16';
      setInternalAspectRatio(nextAspect);
      try {
        localStorage.setItem('avalive_battle_aspect_ratio', nextAspect);
      } catch (e) {}
    }
  };

  const [isAutoTesting, setIsAutoTesting] = useState(false);
  const autoTestTimerRef = useRef(null);

  useEffect(() => {
    if (isPopout) setIsLiveCleanMode(true);
  }, [isPopout]);

  // Sync config from local storage or custom event instantly
  useEffect(() => {
    const handleConfigUpdate = (e) => {
      if (e.detail) {
        setConfig(prev => ({ ...prev, ...e.detail }));
        setGameState(prev => ({
          ...prev,
          maxHp: e.detail.maxHp || prev.maxHp,
          hp: {
            blue: Math.min(e.detail.maxHp || prev.maxHp, prev.hp.blue),
            red: Math.min(e.detail.maxHp || prev.maxHp, prev.hp.red)
          }
        }));
      }
    };
    window.addEventListener('GAME_BATTLE_CONFIG_UPDATE', handleConfigUpdate);
    return () => window.removeEventListener('GAME_BATTLE_CONFIG_UPDATE', handleConfigUpdate);
  }, []);

  const addLiveFeedItem = useCallback((name, text, faction = 'neutral') => {
    const newItem = { id: Date.now() + Math.random(), name, text, faction };
    setLiveFeed(prev => [...prev.slice(-4), newItem]);
  }, []);

  // Commentary & BGM Lifecycle Hook
  const [isVoiceAiActive, setIsVoiceAiActive] = useState(true);
  const [isBgmActive, setIsBgmActive] = useState(false);
  const broadcastChannelRef = useRef(null);
  const prevLowHpWarnedRef = useRef({ blue: false, red: false });

  useEffect(() => {
    // Init BroadcastChannel for Live Studio / OBS Overlay synchronization
    if (typeof BroadcastChannel !== 'undefined') {
      broadcastChannelRef.current = new BroadcastChannel('avalive_gamebattle_stage');
    }

    // Audio Ducking hook
    battleCommentary.onDuckAudio = (shouldDuck) => {
      battleAudio.duckBgm(shouldDuck);
    };

    // Start periodic AI commentary
    battleCommentary.isEnabled = config.commentaryEnabled !== false;
    battleCommentary.intervalSeconds = config.commentaryInterval || 15;
    battleCommentary.volume = config.commentaryVolume !== undefined ? config.commentaryVolume : 0.9;
    battleCommentary.startPeriodicCommentary(!gameState.isPaused && !gameState.winner);

    return () => {
      battleCommentary.stopAll();
      battleAudio.stopBgm();
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
    };
  }, []);

  // Sync HP warning to commentary
  useEffect(() => {
    const bluePct = (gameState.hp.blue / gameState.maxHp) * 100;
    const redPct = (gameState.hp.red / gameState.maxHp) * 100;

    if (bluePct <= 30 && !prevLowHpWarnedRef.current.blue && !gameState.winner) {
      prevLowHpWarnedRef.current.blue = true;
      battleCommentary.triggerLowHpWarning('blue', config.blueName);
    } else if (bluePct > 35) {
      prevLowHpWarnedRef.current.blue = false;
    }

    if (redPct <= 30 && !prevLowHpWarnedRef.current.red && !gameState.winner) {
      prevLowHpWarnedRef.current.red = true;
      battleCommentary.triggerLowHpWarning('red', config.redName);
    } else if (redPct > 35) {
      prevLowHpWarnedRef.current.red = false;
    }

    // Broadcast update to overlay
    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({
          type: 'GAME_STATE_UPDATE',
          gameState,
          config
        });
      } catch (e) {}
    }
  }, [gameState.hp.blue, gameState.hp.red, gameState.maxHp, gameState.winner, config]);

  // Preload 3D Male & Female Warrior Assets (Tripo 3D Models)
  const warriorImagesRef = useRef({
    male: null,
    female: null
  });

  useEffect(() => {
    // 1. Nam Chiến Binh 3D (Rồng Hoàng Kim)
    const maleImg = new Image();
    maleImg.src = '/game-battle/models/male_warrior_transparent.png';
    maleImg.onload = () => { warriorImagesRef.current.male = maleImg; };
    maleImg.onerror = () => {
      const fb = new Image();
      fb.src = '/game-battle/models/dragon_warrior.webp';
      fb.onload = () => { warriorImagesRef.current.male = fb; };
    };

    // 2. Nữ Chiến Binh 3D (Bạch Kim Nữ Thần)
    const femaleImg = new Image();
    femaleImg.src = '/game-battle/models/female_warrior_transparent.png';
    femaleImg.onload = () => { warriorImagesRef.current.female = femaleImg; };
    femaleImg.onerror = () => {
      const fb = new Image();
      fb.src = '/game-battle/models/female_warrior.webp';
      fb.onload = () => { warriorImagesRef.current.female = fb; };
    };
  }, []);

  // Refs for Game Engine Loop
  const engineRef = useRef({
    fighters: {
      blue: [{
        userId: 'lead_blue_01',
        nickname: config.blueName || 'Đại Tướng Xanh',
        score: 150,
        rank: 0,
        gender: 'male',
        factionId: 'blue',
        x: 548,
        y: 240,
        targetX: 548,
        targetY: 240,
        isVipStage: true,
        isDuelFront: true,
        duelPairIdx: 0,
        assignedSlotIdx: 0,
        bobPhase: 0,
        pulseUntil: 0,
        maxHp: 600,
        currentHp: 600,
        isKnockedOut: false,
        knockoutTime: 0,
        knockbackVx: 0,
        revivedAt: 0,
        hasGift: false,
        isSuperVip: false
      }],
      red: [{
        userId: 'lead_red_01',
        nickname: config.redName || 'Đại Tướng Đỏ',
        score: 150,
        rank: 0,
        gender: 'female',
        factionId: 'red',
        x: 652,
        y: 240,
        targetX: 652,
        targetY: 240,
        isVipStage: true,
        isDuelFront: true,
        duelPairIdx: 0,
        assignedSlotIdx: 0,
        bobPhase: Math.PI,
        pulseUntil: 0,
        maxHp: 600,
        currentHp: 600,
        isKnockedOut: false,
        knockoutTime: 0,
        knockbackVx: 0,
        revivedAt: 0,
        hasGift: false,
        isSuperVip: false
      }]
    },
    dancers: { blue: [], red: [] },   // { userId, nickname, factionId, danceStyleId, startedAt, durationMs, x, y, scale, targetX, targetY, targetScale }
    bosses: [],                      // { id, factionId, x, y, targetX, spawnedAt }
    particles: [],                   // { x, y, vx, vy, size, color, isFlash, lifespanMs, spawnedAt }
    flyingSwords: [],                // { id, factionId, x, y, targetX, targetY, color, progress, speed, spawnedAt }
    dragonBeasts: [],                // { id, factionId, x, y, targetX, progress, spawnedAt }
    taiChiShields: [],               // { id, factionId, x, y, radius, maxRadius, lifespanMs, spawnedAt }
    lucMachBeams: [],                // { id, factionId, beams, spawnedAt }
    docCoStorms: [],                 // { id, factionId, x, y, radius, lifespanMs, spawnedAt }
    nhuLaiPalms: [],                 // { id, factionId, x, y, size, progress, spawnedAt }
    thienNgoaiFlashes: [],           // { id, factionId, points, progress, color, spawnedAt }
    kimCangBells: [],                // { id, factionId, x, y, radius, lifespanMs, spawnedAt }
    floatingTexts: [],               // { id, text, x, y, vy, color, font, spawnedAt, lifespanMs }
    w: 1280,
    h: 720,
    rAfId: null,
    lastTime: performance.now(),
    lastClashSoundTime: 0
  });

  const playSfx = useCallback((type) => {
    if (!config.soundEnabled || soundMuted || battleAudio.isSfxMutedState()) return;
    const vol = config.sfxVolume !== undefined ? config.sfxVolume : battleAudio.getSfxVolume();
    if (vol <= 0.001) return;
    if (type === 'join') battleAudio.playJoin(vol);
    else if (type === 'hit') battleAudio.playHit(vol);
    else if (type === 'aoe') battleAudio.playAoe(vol);
    else if (type === 'boss') battleAudio.playBoss(vol);
    else if (type === 'victory') battleAudio.playVictory(vol);
    else if (type === 'dance') battleAudio.playDanceBeat(vol);
    else if (type === 'van_kiem') battleAudio.playVanKiemQuyTong(vol);
    else if (type === 'giang_long') battleAudio.playGiangLongChuong(vol);
    else if (type === 'thai_cuc') battleAudio.playThaiCucKiemTran(vol);
    else if (type === 'luc_mach') battleAudio.playLucMachThanKiem(vol);
    else if (type === 'doc_co') battleAudio.playDocCoCuuKiem(vol);
    else if (type === 'nhu_lai') battleAudio.playNhuLaiThanChuong(vol);
    else if (type === 'thien_ngoai') battleAudio.playThienNgoaiPhiTien(vol);
    else if (type === 'kim_cang') battleAudio.playKimCangBatHoai(vol);
    else if (type === 'level_up') battleAudio.playLevelUp(vol);
  }, [config.soundEnabled, config.sfxVolume, soundMuted]);

  // Recalculate formation slots with Concentric Inside-to-Outside Full-Screen Arena Architecture:
  // 1) Top VIP Stage (Thư Hùng Đỉnh Cao): Blue Top 1 Champion vs Red Top 1 Champion stationed high up in top center (y = h * 0.35) so they never block fighters below.
  // 2) Inside-to-Outside Concentric Duels: Duels expand from center outwards and downwards as player count grows.
  // 3) Multi-Target / Group Match-up (1 Tướng vs Nhóm 2-3 Lính): Surplus fighters dynamically flank and assist active duels so NO FIGHTER WAITS IDLE!
  // 4) Strict Safe Area Clamping: All positions strictly clamped inside [w * 0.18, w * 0.82] and [h * 0.33, h * 0.82] so characters NEVER drift or jump near screen edges on Mobile/Tablet/PC.
  // 5) Dynamic Proportional Scaling: Automatically shrinks both Tướng and Regular soldiers as battlefield player count increases.
  // Recalculate formation slots with DIAMOND (HÌNH VIÊN KIM CƯƠNG) Arena Architecture:
  // 1) Top Apex (Đỉnh Trên Kim Cương): Cặp Tướng VIP #1 (Blue vs Red) đứng trên cao (y = h * 0.33)
  // 2) Left & Right Apex (Cánh Trái & Phải Kim Cương): Tách xa 2 bên với khoảng cách thoáng rộng
  // 3) Center Core (Tâm Kim Cương): Cặp Trung Tâm (y = h * 0.55)
  // 4) Bottom Apex (Đỉnh Dưới Kim Cương): Cặp Tuyến Dưới (y = h * 0.77)
  // -------------------------------------------------------------
  // ĐỘI HÌNH KIM CƯƠNG CỐ ĐỊNH KHÔNG NHẢY LUNG TUNG (Persistent 1v1 Diamond Arena)
  // 1) 2 Kiếm Chạm Nhau (Sword-to-Sword Melee): Khoảng cách 68px (gap = 34px), mũi kiếm giao nhau tóe lửa
  // 2) Giữ Vị Trí Tuyệt Đối (Persistent Slot Reservation): Mỗi nhân vật giữ chặt slot của mình, không bao giờ bị đổi/nhảy khi điểm số thay đổi
  // 3) Chỉ thay thế khi chết: Khi một tướng chết thì slot đó mới mở cho người khác vào thay thế
  // 4) Đa Tầng Kim Cương Đối Xứng: 13 Điểm Kim Cương so le cao độ, tuyệt đối không bị dồn hàng ngang hay dính chùm
  // -------------------------------------------------------------
  const updateFormation = useCallback((canvasWidth, canvasHeight) => {
    const w = canvasWidth || engineRef.current.w || 1280;
    const h = canvasHeight || engineRef.current.h || 720;
    const centerX = w / 2;

    const listBlue = engineRef.current.fighters.blue || [];
    const listRed = engineRef.current.fighters.red || [];

    const activeBlue = listBlue.filter(f => !f.isKnockedOut);
    const activeRed = listRed.filter(f => !f.isKnockedOut);

    const totalActive = activeBlue.length + activeRed.length;
    const crowdScaleFactor = totalActive <= 2 ? 1.0 
      : totalActive <= 4 ? 0.92 
      : totalActive <= 6 ? 0.85 
      : totalActive <= 10 ? 0.76 
      : Math.max(0.60, 1.0 - (totalActive - 2) * 0.028);

    // Helper: Clamp coordinates safely within centered viewing area
    const clampX = (x) => Math.max(w * 0.12, Math.min(w * 0.88, x));
    const clampY = (y) => Math.max(h * 0.26, Math.min(h * 0.86, y));

    // Dynamic Multi-Tier Diamond Grid Slots (13 Điểm Kim Cương Đa Tầng Cố Định Tuyệt Đối)
    // Tọa độ mỗi điểm hoàn toàn khác nhau về cả X và Y, tạo thành hình quả trám / kim cương tuyệt đẹp
    const diamondSlots = [
      // 0: Đài VIP Đỉnh Trên Cùng (Cặp VIP / Tướng Quân 1)
      { id: 0, x: centerX, y: h * 0.28, isTopVip: true },
      
      // 1 & 2: Tầng 2 (Thượng Cánh Trái & Phải)
      { id: 1, x: centerX - 200 * crowdScaleFactor, y: h * 0.40, isTopVip: false },
      { id: 2, x: centerX + 200 * crowdScaleFactor, y: h * 0.40, isTopVip: false },
      
      // 3: Tầng 3 (Tâm Sân Khấu)
      { id: 3, x: centerX, y: h * 0.52, isTopVip: false },
      
      // 4 & 5: Tầng 3 (Cánh Xa Trái & Phải)
      { id: 4, x: centerX - 300 * crowdScaleFactor, y: h * 0.55, isTopVip: false },
      { id: 5, x: centerX + 300 * crowdScaleFactor, y: h * 0.55, isTopVip: false },
      
      // 6 & 7: Tầng 4 (Hạ Cánh Trái & Phải)
      { id: 6, x: centerX - 190 * crowdScaleFactor, y: h * 0.68, isTopVip: false },
      { id: 7, x: centerX + 190 * crowdScaleFactor, y: h * 0.68, isTopVip: false },
      
      // 8: Tầng 5 (Đỉnh Dưới Cùng Kim Cương)
      { id: 8, x: centerX, y: h * 0.80, isTopVip: false },
      
      // 9, 10: Tầng Phụ Giữa Thượng
      { id: 9, x: centerX - 100 * crowdScaleFactor, y: h * 0.46, isTopVip: false },
      { id: 10, x: centerX + 100 * crowdScaleFactor, y: h * 0.46, isTopVip: false },
      
      // 11, 12: Tầng Phụ Giữa Hạ
      { id: 11, x: centerX - 100 * crowdScaleFactor, y: h * 0.62, isTopVip: false },
      { id: 12, x: centerX + 100 * crowdScaleFactor, y: h * 0.62, isTopVip: false },
    ];

    // Khoảng cách 1v1 cận chiến: 2 kiếm CHẠM NHAU (Sword-to-Sword Melee Clash)
    // 34px mỗi bên -> Tổng khoảng cách giữa 2 đấu thủ là 68px. Kiếm dài 35px sẽ va chạm tóe lửa ngay tâm slot!
    const gap = 34 * crowdScaleFactor;

    // Slot reservation tracker: ensure stable persistent slot IDs
    const usedBlueSlots = new Set();
    const usedRedSlots = new Set();

    // 1. Giữ nguyên slot đã gán cho những nhân vật đang còn sống
    activeBlue.forEach(f => {
      if (f.assignedSlotIdx !== undefined && f.assignedSlotIdx >= 0 && !usedBlueSlots.has(f.assignedSlotIdx)) {
        usedBlueSlots.add(f.assignedSlotIdx);
      } else {
        f.assignedSlotIdx = undefined;
      }
    });

    activeRed.forEach(f => {
      if (f.assignedSlotIdx !== undefined && f.assignedSlotIdx >= 0 && !usedRedSlots.has(f.assignedSlotIdx)) {
        usedRedSlots.add(f.assignedSlotIdx);
      } else {
        f.assignedSlotIdx = undefined;
      }
    });

    // 2. Gán slot còn trống thấp nhất cho các nhân vật mới vào hoặc vừa hồi sinh
    let nextBlueSlot = 0;
    activeBlue.forEach(f => {
      if (f.assignedSlotIdx === undefined) {
        while (usedBlueSlots.has(nextBlueSlot)) {
          nextBlueSlot++;
        }
        f.assignedSlotIdx = nextBlueSlot % diamondSlots.length;
        usedBlueSlots.add(nextBlueSlot);
      }
    });

    let nextRedSlot = 0;
    activeRed.forEach(f => {
      if (f.assignedSlotIdx === undefined) {
        while (usedRedSlots.has(nextRedSlot)) {
          nextRedSlot++;
        }
        f.assignedSlotIdx = nextRedSlot % diamondSlots.length;
        usedRedSlots.add(nextRedSlot);
      }
    });

    // 3. Cập nhật vị trí targetX, targetY cho toàn bộ nhân vật (CỐ ĐỊNH, KHÔNG BAO GIỜ BỊ NHẢY)
    activeBlue.forEach(f => {
      const slotIdx = f.assignedSlotIdx % diamondSlots.length;
      const slot = diamondSlots[slotIdx];
      const isTop = (slotIdx === 0);
      const hasOpponent = activeRed.some(r => r.assignedSlotIdx === f.assignedSlotIdx);

      f.isVipStage = isTop;
      f.isDuelFront = hasOpponent;
      f.duelPairIdx = slotIdx;
      f.duelSpotX = slot.x;
      f.duelSpotY = slot.y;
      f.targetX = clampX(slot.x - gap);
      f.targetY = clampY(slot.y);
    });

    activeRed.forEach(f => {
      const slotIdx = f.assignedSlotIdx % diamondSlots.length;
      const slot = diamondSlots[slotIdx];
      const isTop = (slotIdx === 0);
      const hasOpponent = activeBlue.some(b => b.assignedSlotIdx === f.assignedSlotIdx);

      f.isVipStage = isTop;
      f.isDuelFront = hasOpponent;
      f.duelPairIdx = slotIdx;
      f.duelSpotX = slot.x;
      f.duelSpotY = slot.y;
      f.targetX = clampX(slot.x + gap);
      f.targetY = clampY(slot.y);
    });
  }, []);

  // Action Dispatchers: Add / Update / Revive Fighters with Dynamic Auto-Balancing
  const addOrUpdateFighter = useCallback((requestedFactionId, nickname, pointsToAdd = 10, preferredGender = null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Dynamic Team Auto-Balancing: If one side has more active fighters, automatically balance new joins
    const listRequested = engineRef.current.fighters[requestedFactionId] || [];
    const oppFactionId = requestedFactionId === 'blue' ? 'red' : 'blue';
    const listOpp = engineRef.current.fighters[oppFactionId] || [];

    const activeRequested = listRequested.filter(f => !f.isKnockedOut);
    const activeOpp = listOpp.filter(f => !f.isKnockedOut);

    const userId = `user_${nickname.toLowerCase().replace(/\s+/g, '_')}`;
    let existingFighter = listRequested.find(f => f.userId === userId) || listOpp.find(f => f.userId === userId);

    let factionId = requestedFactionId;
    if (existingFighter) {
      factionId = existingFighter.factionId || (listRequested.includes(existingFighter) ? requestedFactionId : oppFactionId);
    } else {
      // New fighter: Auto-balance team if requested side is already crowded (+1 or more surplus)
      if (activeRequested.length > activeOpp.length) {
        factionId = oppFactionId;
      }
    }

    const list = engineRef.current.fighters[factionId];
    let fighter = list.find(f => f.userId === userId);

    const calcMaxHp = (score) => {
      if (score >= 5000) return 3500;
      if (score >= 2000) return 2200;
      if (score >= 500) return 1200;
      if (score >= 100) return 600;
      return 280;
    };

    if (fighter) {
      const wasKnockedOut = fighter.isKnockedOut;
      fighter.score += pointsToAdd;
      fighter.pulseUntil = performance.now() + (pointsToAdd >= 50 ? 3500 : 800);
      fighter.maxHp = calcMaxHp(fighter.score);
      if (preferredGender) fighter.gender = preferredGender;
      if (pointsToAdd >= 50 || fighter.score >= 300) fighter.hasGift = true;
      if (pointsToAdd >= 150 || fighter.score >= 400) fighter.isSuperVip = true;

      // Respawn Mechanic
      if (wasKnockedOut) {
        fighter.isKnockedOut = false;
        fighter.currentHp = fighter.maxHp;
        fighter.revivedAt = performance.now();
        fighter.knockbackVx = 0;

        for (let p = 0; p < 22; p++) {
          engineRef.current.particles.push({
            x: fighter.x + (Math.random() - 0.5) * 30,
            y: fighter.y + 20,
            vx: (Math.random() - 0.5) * 25,
            vy: -120 - Math.random() * 80,
            size: 4,
            color: '#facc15',
            isFlash: true,
            lifespanMs: 1600,
            spawnedAt: performance.now()
          });
        }

        const isSuperGift = pointsToAdd >= 50;
        engineRef.current.floatingTexts.push({
          text: isSuperGift ? '🔥 HỒI SINH THẦN TỐC & TĂNG CẤP!' : '✨ HỒI SINH!',
          x: fighter.x,
          y: fighter.y - 45,
          vy: -30,
          color: isSuperGift ? '#facc15' : '#38bdf8',
          font: 'bold 14px sans-serif',
          spawnedAt: performance.now(),
          lifespanMs: 2200
        });

        playSfx(isSuperGift ? 'level_up' : 'join');

        setLiveFeed(prev => [
          {
            id: `revive_${Date.now()}_${Math.random()}`,
            name: nickname,
            text: isSuperGift ? '🔥 HỒI SINH THẦN TỐC & TĂNG CẤP VÀO TRẬN!' : '✨ Đã HỒI SINH trở lại chiến trường!',
            faction: factionId
          },
          ...prev.slice(0, 7)
        ]);
      } else {
        fighter.currentHp = Math.min(fighter.maxHp, (fighter.currentHp || fighter.maxHp) + Math.floor(pointsToAdd * 0.4));
      }
    } else {
      const w = engineRef.current.w || canvas.width;
      const h = engineRef.current.h || canvas.height;
      const centerX = w / 2;
      const centerY = h * 0.55;
      const spawnSlotIdx = list.length % 13;
      const champOffset = Math.max(76, Math.min(w * 0.13, 88));
      const fighterOffset = Math.max(65, Math.min(w * 0.10, 78));
      const gap = spawnSlotIdx === 0 ? champOffset : fighterOffset;
      const startX = factionId === 'blue' ? (centerX - 160) : (centerX + 160);
      const startY = centerY;
      
      let gender = preferredGender;
      if (!gender) {
        const maleCount = list.filter(f => f.gender === 'male').length;
        const femaleCount = list.filter(f => f.gender === 'female').length;
        gender = maleCount <= femaleCount ? 'male' : 'female';
      }

      const initialHp = calcMaxHp(pointsToAdd);
      fighter = {
        userId,
        nickname,
        score: pointsToAdd,
        rank: list.length,
        gender,
        factionId,
        x: startX,
        y: startY,
        targetX: startX,
        targetY: startY,
        isVipStage: false,
        bobPhase: Math.random() * Math.PI * 2,
        pulseUntil: performance.now() + (pointsToAdd >= 50 ? 3500 : 800),
        maxHp: initialHp,
        currentHp: initialHp,
        isKnockedOut: false,
        knockoutTime: 0,
        knockbackVx: 0,
        revivedAt: 0,
        hasGift: pointsToAdd >= 50,
        isSuperVip: pointsToAdd >= 150
      };
      list.push(fighter);
    }

    // Deal direct duel damage to paired opponent so gifts directly defeat opponents
    const oppFaction = factionId === 'blue' ? 'red' : 'blue';
    const oppList = engineRef.current.fighters[oppFaction] || [];
    const pairedOpponent = oppList.find(op => !op.isKnockedOut && (
      (fighter.isVipStage && op.isVipStage) || 
      (fighter.duelPairIdx !== undefined && fighter.duelPairIdx >= 0 && op.duelPairIdx === fighter.duelPairIdx)
    )) || oppList.find(op => !op.isKnockedOut);

    if (pairedOpponent) {
      pairedOpponent.currentHp = Math.max(0, (pairedOpponent.currentHp || pairedOpponent.maxHp) - pointsToAdd);
      if (pairedOpponent.currentHp <= 0) {
        pairedOpponent.isKnockedOut = true;
        pairedOpponent.knockoutTime = performance.now();
        engineRef.current.floatingTexts.push({
          text: '⚔️ HẠ GỤC ĐỐI THỦ!',
          x: fighter.x,
          y: fighter.y - 45,
          vy: -35,
          color: '#facc15',
          font: 'bold 13px sans-serif',
          spawnedAt: performance.now(),
          lifespanMs: 1800
        });
      }
    }

    updateFormation(engineRef.current.w || canvas.width, engineRef.current.h || canvas.height);

    setGameState(prev => {
      if (prev.winner) return prev;
      const newOppHp = Math.max(0, prev.hp[oppFaction] - pointsToAdd);
      const newOwnHp = Math.min(prev.maxHp, prev.hp[factionId] + Math.floor(pointsToAdd * 0.2));
      
      const newHp = { ...prev.hp, [oppFaction]: newOppHp, [factionId]: newOwnHp };
      let winner = null;
      if (newOppHp <= 0) {
        winner = factionId;
        playSfx('victory');
      }

      const allFighters = [
        ...engineRef.current.fighters.blue.map(f => ({ ...f, factionId: 'blue' })),
        ...engineRef.current.fighters.red.map(f => ({ ...f, factionId: 'red' }))
      ].sort((a, b) => b.score - a.score).slice(0, 5);

      return {
        ...prev,
        hp: newHp,
        winner,
        leaderboard: allFighters
      };
    });

    playSfx('join');
  }, [updateFormation, playSfx]);

  const triggerDance = useCallback((factionId, nickname, danceStyleId = null, durationMs = 6000) => {
    addOrUpdateFighter(factionId, nickname, 60);
    const userId = `user_${nickname.toLowerCase().replace(/\s+/g, '_')}`;
    const fighter = engineRef.current.fighters[factionId].find(f => f.userId === userId);
    if (fighter) {
      fighter.pulseUntil = performance.now() + durationMs;
      fighter.isDancing = true;
      fighter.danceUntil = performance.now() + durationMs;
    }
    playSfx('level_up');
  }, [addOrUpdateFighter, playSfx]);

  const triggerAoeSkill = useCallback((factionId, donorName = 'VIP Player', power = 80) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const oppFaction = factionId === 'blue' ? 'red' : 'blue';
    const oppColor = oppFaction === 'blue' ? config.blueColor : config.redColor;
    const oppFighters = engineRef.current.fighters[oppFaction] || [];
    
    // Target the specific paired opponent directly
    const ownFighter = engineRef.current.fighters[factionId]?.find(f => f.nickname === donorName);
    const targetFighter = oppFighters.find(op => !op.isKnockedOut && ownFighter && op.duelPairIdx === ownFighter.duelPairIdx) 
      || oppFighters.find(op => !op.isKnockedOut)
      || { x: oppFaction === 'blue' ? canvas.width * 0.3 : canvas.width * 0.7, y: canvas.height * 0.5 };

    const targetX = targetFighter.x || (oppFaction === 'blue' ? canvas.width * 0.3 : canvas.width * 0.7);
    const targetY = targetFighter.y || (canvas.height * 0.5);

    for (let i = 0; i < 28; i++) {
      engineRef.current.particles.push({
        x: targetX + (Math.random() - 0.5) * 50,
        y: targetY - 45 + (Math.random() - 0.5) * 30,
        vx: (Math.random() - 0.5) * 50,
        vy: 80 + Math.random() * 80,
        size: 3 + Math.random() * 4,
        color: oppColor,
        isFlash: false,
        lifespanMs: 1400,
        spawnedAt: performance.now()
      });
    }

    addOrUpdateFighter(factionId, donorName, power);
    triggerDance(factionId, donorName, 12, 7000);
    playSfx('aoe');
    setFlashSide(oppFaction);
    setTimeout(() => setFlashSide(null), 400);

    setGameState(prev => ({
      ...prev,
      recentSpotlight: { name: donorName, gift: 'Kỹ năng Bão Lửa (AoE)', faction: factionId }
    }));
    setTimeout(() => setGameState(prev => ({ ...prev, recentSpotlight: null })), 4000);
  }, [config.blueColor, config.redColor, addOrUpdateFighter, triggerDance, playSfx]);

  const triggerBossSummon = useCallback((factionId, donorName = 'Super Supporter') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const isBlue = factionId === 'blue';
    const oppFaction = isBlue ? 'red' : 'blue';
    const oppFighters = engineRef.current.fighters[oppFaction] || [];
    const leadOpponent = oppFighters.find(op => !op.isKnockedOut);

    const targetX = leadOpponent ? leadOpponent.x : (isBlue ? canvas.width * 0.82 : canvas.width * 0.18);
    const targetY = leadOpponent ? leadOpponent.y : canvas.height * 0.58;

    engineRef.current.bosses.push({
      id: Date.now(),
      factionId,
      x: isBlue ? canvas.width * 0.05 : canvas.width * 0.95,
      y: targetY,
      targetX: targetX,
      spawnedAt: performance.now()
    });

    addOrUpdateFighter(factionId, donorName, 250);
    triggerDance(factionId, donorName, 20, 9000);
    playSfx('boss');

    setGameState(prev => ({
      ...prev,
      recentSpotlight: { name: donorName, gift: 'Triệu Hồi Thần Thú (Boss)', faction: factionId }
    }));
    setTimeout(() => setGameState(prev => ({ ...prev, recentSpotlight: null })), 5000);
  }, [addOrUpdateFighter, triggerDance, playSfx]);

  const triggerVanKiem = useCallback((factionId, donorName = 'VIP Kiếm Khách') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const isBlue = factionId === 'blue';
    const oppFaction = isBlue ? 'red' : 'blue';
    const oppFighters = engineRef.current.fighters[oppFaction] || [];
    
    // Target the specific paired enemy fighter directly
    const ownFighter = engineRef.current.fighters[factionId]?.find(f => f.nickname === donorName);
    const targetFighter = oppFighters.find(op => !op.isKnockedOut && ownFighter && op.duelPairIdx === ownFighter.duelPairIdx) 
      || oppFighters.find(op => !op.isKnockedOut)
      || { x: isBlue ? canvas.width * 0.75 : canvas.width * 0.25, y: canvas.height * 0.55 };

    const targetX = targetFighter.x;
    const targetY = targetFighter.y;

    for (let i = 0; i < 18; i++) {
      engineRef.current.flyingSwords.push({
        id: Date.now() + Math.random(),
        factionId,
        x: (isBlue ? canvas.width * 0.2 : canvas.width * 0.8) + (Math.random() - 0.5) * 100,
        y: canvas.height * 0.12 + (Math.random() - 0.5) * 40,
        targetX: targetX + (Math.random() - 0.5) * 30,
        targetY: targetY + (Math.random() - 0.5) * 30,
        color: isBlue ? '#38bdf8' : '#f87171',
        progress: -i * 0.04,
        speed: 2.2 + Math.random() * 0.8,
        spawnedAt: performance.now()
      });
    }

    addOrUpdateFighter(factionId, donorName, 600);
    const donorFighter = engineRef.current.fighters[factionId].find(f => f.nickname === donorName);
    if (donorFighter) {
      donorFighter.isSuperVip = true;
      donorFighter.hasGift = true;
    }
    updateFormation(canvas.width, canvas.height);
    playSfx('van_kiem');
  }, [addOrUpdateFighter, updateFormation, playSfx]);

  const triggerGiangLong = useCallback((factionId, donorName = 'VIP Thần Long') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const isBlue = factionId === 'blue';
    const oppFaction = isBlue ? 'red' : 'blue';
    const oppFighters = engineRef.current.fighters[oppFaction] || [];
    
    const ownFighter = engineRef.current.fighters[factionId]?.find(f => f.nickname === donorName);
    const targetFighter = oppFighters.find(op => !op.isKnockedOut && ownFighter && op.duelPairIdx === ownFighter.duelPairIdx) 
      || oppFighters.find(op => !op.isKnockedOut);

    const targetX = targetFighter ? targetFighter.x : (isBlue ? canvas.width * 0.80 : canvas.width * 0.20);
    const targetY = targetFighter ? targetFighter.y : canvas.height * 0.55;

    engineRef.current.dragonBeasts.push({
      id: Date.now(),
      factionId,
      x: isBlue ? 0 : canvas.width,
      y: canvas.height * 0.45,
      targetX: targetX,
      targetY: targetY,
      progress: 0,
      spawnedAt: performance.now()
    });

    addOrUpdateFighter(factionId, donorName, 1200);
    const donorFighter = engineRef.current.fighters[factionId].find(f => f.nickname === donorName);
    if (donorFighter) {
      donorFighter.isSuperVip = true;
      donorFighter.hasGift = true;
    }
    triggerDance(factionId, donorName, 20, 9000);
    updateFormation(canvas.width, canvas.height);
    playSfx('giang_long');
  }, [addOrUpdateFighter, triggerDance, updateFormation, playSfx]);

  const triggerThaiCuc = useCallback((factionId, donorName = 'VIP Hộ Pháp') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const isBlue = factionId === 'blue';
    const ownFighters = engineRef.current.fighters[factionId];
    const leadFighter = ownFighters.length > 0 ? ownFighters[0] : null;

    engineRef.current.taiChiShields.push({
      id: Date.now(),
      factionId,
      x: leadFighter ? leadFighter.x : (isBlue ? canvas.width * 0.25 : canvas.width * 0.75),
      y: leadFighter ? leadFighter.y : canvas.height * 0.62,
      radius: 20,
      maxRadius: 160,
      lifespanMs: 3500,
      spawnedAt: performance.now()
    });

    addOrUpdateFighter(factionId, donorName, 600);
    const donorFighter = engineRef.current.fighters[factionId].find(f => f.nickname === donorName);
    if (donorFighter) {
      donorFighter.isSuperVip = true;
      donorFighter.hasGift = true;
    }
    updateFormation(canvas.width, canvas.height);
    playSfx('thai_cuc');
  }, [addOrUpdateFighter, updateFormation, playSfx]);

  // 1. LỤC MẠCH THẦN KIẾM (Laser Kiếm Khí 6 Màu)
  const triggerLucMach = useCallback((factionId, donorName = 'Lục Mạch Kiếm Khách') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const isBlue = factionId === 'blue';
    const startX = isBlue ? canvas.width * 0.22 : canvas.width * 0.78;
    const targetX = isBlue ? canvas.width * 0.88 : canvas.width * 0.12;
    const baseY = canvas.height * 0.55;

    const colors = ['#ef4444', '#f97316', '#eab308', '#10b981', '#06b6d4', '#a855f7'];
    const beams = colors.map((col, idx) => ({
      color: col,
      yOffset: (idx - 2.5) * 18,
      progress: -idx * 0.08,
      speed: 2.8,
      width: 4
    }));

    engineRef.current.lucMachBeams.push({
      id: Date.now() + Math.random(),
      factionId,
      startX,
      targetX,
      baseY,
      beams,
      spawnedAt: performance.now(),
      lifespanMs: 2500
    });

    addOrUpdateFighter(factionId, donorName, 450);
    updateFormation(canvas.width, canvas.height);
    playSfx('luc_mach');

    setGameState(prev => ({
      ...prev,
      recentSpotlight: { name: donorName, gift: '🌈 LỤC MẠCH THẦN KIẾM 3D', faction: factionId }
    }));
    setTimeout(() => setGameState(prev => ({ ...prev, recentSpotlight: null })), 4500);
  }, [addOrUpdateFighter, updateFormation, playSfx]);

  // 2. ĐỘC CÔ CỬU KIẾM (Bão Kiếm Lốc Xoáy)
  const triggerDocCo = useCallback((factionId, donorName = 'Độc Cô Tiền Bối') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const isBlue = factionId === 'blue';
    const centerX = isBlue ? canvas.width * 0.65 : canvas.width * 0.35;
    const centerY = canvas.height * 0.56;

    engineRef.current.docCoStorms.push({
      id: Date.now() + Math.random(),
      factionId,
      x: centerX,
      y: centerY,
      radius: 30,
      maxRadius: 180,
      swordCount: 9,
      spawnedAt: performance.now(),
      lifespanMs: 3800
    });

    addOrUpdateFighter(factionId, donorName, 550);
    updateFormation(canvas.width, canvas.height);
    playSfx('doc_co');

    setGameState(prev => ({
      ...prev,
      recentSpotlight: { name: donorName, gift: '🌪️ ĐỘC CÔ CỬU KIẾM 3D', faction: factionId }
    }));
    setTimeout(() => setGameState(prev => ({ ...prev, recentSpotlight: null })), 4500);
  }, [addOrUpdateFighter, updateFormation, playSfx]);

  // 3. NHƯ LAI THẦN CHƯỞNG (Phật Quang Thái Dương)
  const triggerNhuLai = useCallback((factionId, donorName = 'Phật Quang Chí Tôn') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const isBlue = factionId === 'blue';
    const targetX = isBlue ? canvas.width * 0.68 : canvas.width * 0.32;
    const targetY = canvas.height * 0.58;

    engineRef.current.nhuLaiPalms.push({
      id: Date.now() + Math.random(),
      factionId,
      x: targetX,
      y: targetY,
      size: 40,
      maxSize: 220,
      progress: 0,
      spawnedAt: performance.now(),
      lifespanMs: 3200
    });

    addOrUpdateFighter(factionId, donorName, 1200);
    updateFormation(canvas.width, canvas.height);
    playSfx('nhu_lai');

    setGameState(prev => ({
      ...prev,
      recentSpotlight: { name: donorName, gift: '✋ NHƯ LAI THẦN CHƯỞNG 3D', faction: factionId }
    }));
    setTimeout(() => setGameState(prev => ({ ...prev, recentSpotlight: null })), 4500);
  }, [addOrUpdateFighter, updateFormation, playSfx]);

  // 4. THIÊN NGOẠI PHI TIÊN (Băng Vũ Kiếm Thần)
  const triggerThienNgoai = useCallback((factionId, donorName = 'Bạch Y Kiếm Thần') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const isBlue = factionId === 'blue';
    const oppX = isBlue ? canvas.width * 0.65 : canvas.width * 0.35;
    const baseY = canvas.height * 0.54;

    const points = [
      { x: oppX - 120, y: baseY - 80 },
      { x: oppX + 100, y: baseY - 40 },
      { x: oppX - 90, y: baseY + 50 },
      { x: oppX + 110, y: baseY + 80 }
    ];

    engineRef.current.thienNgoaiFlashes.push({
      id: Date.now() + Math.random(),
      factionId,
      points,
      progress: 0,
      color: isBlue ? '#38bdf8' : '#fb7185',
      spawnedAt: performance.now(),
      lifespanMs: 2200
    });

    addOrUpdateFighter(factionId, donorName, 650);
    updateFormation(canvas.width, canvas.height);
    playSfx('thien_ngoai');

    setGameState(prev => ({
      ...prev,
      recentSpotlight: { name: donorName, gift: '❄️ THIÊN NGOẠI PHI TIÊN 3D', faction: factionId }
    }));
    setTimeout(() => setGameState(prev => ({ ...prev, recentSpotlight: null })), 4500);
  }, [addOrUpdateFighter, updateFormation, playSfx]);

  // 5. KIM CANG BẤT HOẠI (Chuông Vàng Phản Đòn)
  const triggerKimCang = useCallback((factionId, donorName = 'Kim Cang Thần Tăng') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const isBlue = factionId === 'blue';
    const ownX = isBlue ? canvas.width * 0.32 : canvas.width * 0.68;
    const ownY = canvas.height * 0.58;

    engineRef.current.kimCangBells.push({
      id: Date.now() + Math.random(),
      factionId,
      x: ownX,
      y: ownY,
      radius: 30,
      maxRadius: 170,
      spawnedAt: performance.now(),
      lifespanMs: 4000
    });

    // Heal all allies by 300 HP
    engineRef.current.fighters[factionId].forEach(f => {
      f.currentHp = Math.min(f.maxHp || 600, (f.currentHp || 280) + 300);
      f.isKnockedOut = false;
      f.pulseUntil = performance.now() + 3000;
    });

    addOrUpdateFighter(factionId, donorName, 700);
    updateFormation(canvas.width, canvas.height);
    playSfx('kim_cang');

    setGameState(prev => ({
      ...prev,
      recentSpotlight: { name: donorName, gift: '🔔 KIM CANG BẤT HOẠI 3D', faction: factionId }
    }));
    setTimeout(() => setGameState(prev => ({ ...prev, recentSpotlight: null })), 4500);
  }, [addOrUpdateFighter, updateFormation, playSfx]);

  // TIẾP VIỆN QUÂN LỰC
  const triggerReinforcements = useCallback((factionId, count = 20, rankTier = 0) => {
    const names = ['Chiến Binh', 'Thiết Kỵ', 'Vệ Binh', 'Hiệp Khách', 'Hộ Pháp', 'Tiên Phong', 'Kỵ Binh', 'Dũng Tướng'];
    for (let i = 0; i < count; i++) {
      const rName = `${names[i % names.length]} #${Math.floor(100 + Math.random() * 900)}`;
      addOrUpdateFighter(factionId, rName, 20 + rankTier * 15);
    }
    const canvas = canvasRef.current;
    if (canvas) updateFormation(canvas.width, canvas.height);
    playSfx('join');
  }, [addOrUpdateFighter, updateFormation, playSfx]);

  const triggerHeroUpgrade = useCallback((factionId, donorName = 'VIP Chiến Binh 3D', tierLevel = 3) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set score to guarantee exact tier
    const tierScores = { 1: 50, 2: 250, 3: 1000, 4: 3000, 5: 7500 };
    const targetScore = tierScores[tierLevel] || 1000;
    
    const userId = `user_${donorName.toLowerCase().replace(/\s+/g, '_')}`;
    const list = engineRef.current.fighters[factionId];
    let fighter = list.find(f => f.userId === userId);

    if (fighter) {
      fighter.score = Math.max(fighter.score, targetScore);
      fighter.pulseUntil = performance.now() + 3500;
      fighter.hasGift = true;
      fighter.isSuperVip = tierLevel >= 3;
    } else {
      const startX = factionId === 'blue' ? canvas.width * 0.35 : canvas.width * 0.65;
      const startY = canvas.height * 0.62;
      fighter = {
        userId,
        nickname: donorName,
        score: targetScore,
        rank: 0,
        x: startX,
        y: startY,
        targetX: startX,
        targetY: startY,
        bobPhase: 0,
        pulseUntil: performance.now() + 3500,
        hasGift: true,
        isSuperVip: tierLevel >= 3
      };
      list.push(fighter);
    }

    updateFormation(canvas.width, canvas.height);
    playSfx('level_up');

    // Spawn golden upward rays
    for (let p = 0; p < 24; p++) {
      engineRef.current.particles.push({
        x: fighter.x + (Math.random() - 0.5) * 40,
        y: fighter.y + 20,
        vx: (Math.random() - 0.5) * 30,
        vy: -120 - Math.random() * 80,
        size: 3.5,
        color: '#facc15',
        isFlash: true,
        lifespanMs: 1800,
        spawnedAt: performance.now()
      });
    }

    const tierTitles = {
      1: 'TÂN BINH HIỆP KHÁCH 3D ⚔️',
      2: 'THIẾT GIÁP KIẾM HIỆP 3D 🛡️',
      3: 'KIM KHẢI THẦN TƯỚNG 3D (CÁNH VÀNG) 👑',
      4: 'CHIẾN THẦN VẠN KIẾM 3D (KIẾM KHÍ) ⚡',
      5: 'CHÍ TÔN THIÊN TÔN 3D (THẦN LONG) 🐉'
    };

    setGameState(prev => ({
      ...prev,
      recentSpotlight: { name: donorName, gift: `Trang Bị: ${tierTitles[tierLevel] || 'HOÀNG KIM 3D'}`, faction: factionId }
    }));
    setTimeout(() => setGameState(prev => ({ ...prev, recentSpotlight: null })), 4500);
  }, [updateFormation, playSfx]);

  const initDefaultChampions = useCallback((customW, customH) => {
    const w = customW || engineRef.current.w || 1280;
    const h = customH || engineRef.current.h || 720;
    const centerX = w / 2;
    const daisY = h * 0.28;

    if (engineRef.current.fighters.blue.length === 0 && engineRef.current.fighters.red.length === 0) {
      const blueLeader = {
        userId: 'lead_blue_01',
        nickname: config.blueName || 'Đại Tướng Xanh',
        score: 120,
        rank: 0,
        gender: 'male',
        factionId: 'blue',
        x: centerX - 34,
        y: daisY,
        targetX: centerX - 34,
        targetY: daisY,
        isVipStage: true,
        isDuelFront: true,
        duelPairIdx: 0,
        assignedSlotIdx: 0,
        bobPhase: 0,
        pulseUntil: 0,
        maxHp: 600,
        currentHp: 600,
        isKnockedOut: false,
        knockoutTime: 0,
        knockbackVx: 0,
        revivedAt: 0,
        hasGift: false,
        isSuperVip: false
      };

      const redLeader = {
        userId: 'lead_red_01',
        nickname: config.redName || 'Đại Tướng Đỏ',
        score: 120,
        rank: 0,
        gender: 'female',
        factionId: 'red',
        x: centerX + 34,
        y: daisY,
        targetX: centerX + 34,
        targetY: daisY,
        isVipStage: true,
        isDuelFront: true,
        duelPairIdx: 0,
        assignedSlotIdx: 0,
        bobPhase: Math.PI,
        pulseUntil: 0,
        maxHp: 600,
        currentHp: 600,
        isKnockedOut: false,
        knockoutTime: 0,
        knockbackVx: 0,
        revivedAt: 0,
        hasGift: false,
        isSuperVip: false
      };

      engineRef.current.fighters.blue = [blueLeader];
      engineRef.current.fighters.red = [redLeader];
      updateFormation(w, h);
    }
  }, [config.blueName, config.redName, updateFormation]);

  const resetMatch = useCallback(() => {
    engineRef.current.fighters = { blue: [], red: [] };
    engineRef.current.dancers = { blue: [], red: [] };
    engineRef.current.bosses = [];
    engineRef.current.particles = [];
    engineRef.current.flyingSwords = [];
    engineRef.current.dragonBeasts = [];
    engineRef.current.taiChiShields = [];
    engineRef.current.lucMachBeams = [];
    engineRef.current.docCoStorms = [];
    engineRef.current.nhuLaiPalms = [];
    engineRef.current.thienNgoaiFlashes = [];
    engineRef.current.kimCangBells = [];
    initDefaultChampions();
    setGameState({
      hp: { blue: config.maxHp, red: config.maxHp },
      maxHp: config.maxHp,
      isPaused: false,
      winner: null,
      countdown: null,
      leaderboard: [],
      recentSpotlight: null
    });
  }, [config.maxHp, initDefaultChampions]);

  // Handle external TikTok live events
  useEffect(() => {
    if (!externalLiveEvent) return;
    const { type, data } = externalLiveEvent;
    
    if (type === 'ADMIN_RESET') {
      resetMatch();
      return;
    }

    if (type === 'PAUSE_TOGGLE') {
      setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
      return;
    }

    if (type === 'FORCE_WIN') {
      const winner = data.faction || 'blue';
      const loser = winner === 'blue' ? 'red' : 'blue';
      setGameState(prev => ({
        ...prev,
        winner,
        hp: { ...prev.hp, [loser]: 0 }
      }));
      playSfx('victory');
      return;
    }

    if (type === 'DANCE') {
      const fac = data.faction || 'blue';
      const name = data.nickname || 'Idol Sân Khấu';
      triggerDance(fac, name);
      addLiveFeedItem(name, 'đang biểu diễn vũ điệu sân khấu! 💃', fac);
      return;
    }

    if (type === 'TRIGGER_LUC_MACH') {
      const fac = data.faction || 'blue';
      const name = data.nickname || 'Lục Mạch Kiếm Khách';
      triggerLucMach(fac, name);
      addLiveFeedItem(name, 'thi triển LỤC MẠCH THẦN KIẾM! 🌈⚔️', fac);
      return;
    }

    if (type === 'TRIGGER_DOC_CO') {
      const fac = data.faction || 'blue';
      const name = data.nickname || 'Độc Cô Cầu Bại';
      triggerDocCo(fac, name);
      addLiveFeedItem(name, 'thi triển ĐỘC CÔ CỬU KIẾM bão xoáy! 🌪️⚔️', fac);
      return;
    }

    if (type === 'TRIGGER_NHU_LAI') {
      const fac = data.faction || 'blue';
      const name = data.nickname || 'Phật Quang Chí Tôn';
      triggerNhuLai(fac, name);
      addLiveFeedItem(name, 'giáng thế NHƯ LAI THẦN CHƯỞNG! ✋✨', fac);
      return;
    }

    if (type === 'TRIGGER_THIEN_NGOAI') {
      const fac = data.faction || 'blue';
      const name = data.nickname || 'Bạch Y Kiếm Thần';
      triggerThienNgoai(fac, name);
      addLiveFeedItem(name, 'lướt kiếm THIÊN NGOẠI PHI TIÊN! ❄️⚔️', fac);
      return;
    }

    if (type === 'TRIGGER_KIM_CANG') {
      const fac = data.faction || 'blue';
      const name = data.nickname || 'Kim Cang Thần Tăng';
      triggerKimCang(fac, name);
      addLiveFeedItem(name, 'kích hoạt KIM CANG BẤT HOẠI! 🔔🛡️', fac);
      return;
    }

    if (type === 'TRIGGER_VAN_KIEM') {
      const fac = data.faction || 'blue';
      const name = data.nickname || 'Kiếm Khách';
      triggerVanKiem(fac, name);
      addLiveFeedItem(name, 'thi triển tuyệt kỹ VẠN KIẾM QUY TÔNG! ⚔️', fac);
      return;
    }

    if (type === 'TRIGGER_GIANG_LONG') {
      const fac = data.faction || 'blue';
      const name = data.nickname || 'Thần Long';
      triggerGiangLong(fac, name);
      addLiveFeedItem(name, 'thi triển tuyệt kỹ GIÁNG LONG CHƯỞNG! 🐉', fac);
      return;
    }

    if (type === 'TRIGGER_THAI_CUC') {
      const fac = data.faction || 'blue';
      const name = data.nickname || 'Hộ Pháp';
      triggerThaiCuc(fac, name);
      addLiveFeedItem(name, 'kích hoạt THÁI CỰC KIẾM TRẬN HỘ THÂN! ☯️', fac);
      return;
    }

    if (type === 'ADD_TROOPS') {
      const fac = data.faction || 'blue';
      const count = data.count || 20;
      triggerReinforcements(fac, count, data.rankTier || 0);
      addLiveFeedItem('Tiếp Viện', `+${count} chiến binh gia nhập phe ${fac === 'blue' ? config.blueName : config.redName}! 🛡️`, fac);
      return;
    }

    if (type === 'UPGRADE_HERO') {
      const fac = data.faction || 'blue';
      const name = data.nickname || 'Chiến Binh';
      const tier = data.tier || 3;
      triggerHeroUpgrade(fac, name, tier);
      addLiveFeedItem(name, `nâng cấp trang bị cấp ${tier}! 🛡️✨`, fac);
      return;
    }

    if (type === 'COMMENT') {
      const commentText = (data.comment || data.text || '').toLowerCase().trim();
      const nickname = data.nickname || data.name || 'Khán giả';
      const score = data.score || 15;
      if (commentText.includes('xanh') || commentText.includes('blue') || commentText.includes('1')) {
        addOrUpdateFighter('blue', nickname, score);
        addLiveFeedItem(nickname, `chọn ${config.blueName} (Xanh 🔵)`, 'blue');
      } else if (commentText.includes('đỏ') || commentText.includes('do') || commentText.includes('red') || commentText.includes('2')) {
        addOrUpdateFighter('red', nickname, score);
        addLiveFeedItem(nickname, `chọn ${config.redName} (Đỏ 🔴)`, 'red');
      } else {
        // Generic comment
        addLiveFeedItem(nickname, commentText || 'cổ vũ trận đấu 🔥', 'neutral');
      }
    } else if (type === 'GIFT') {
      const nickname = data.nickname || data.name || 'VIP Supporter';
      const diamondCount = data.diamondCount || data.coins || 1;
      const assignedFaction = data.faction || (Math.random() < 0.5 ? 'blue' : 'red');

      if (diamondCount >= 10000) {
        triggerNhuLai(assignedFaction, nickname);
        triggerGiangLong(assignedFaction, nickname);
        battleCommentary.triggerGiftCommentary(nickname, 'Vũ Trụ Thần Thoại', 'Chí Tôn Thần Giới', assignedFaction);
        addLiveFeedItem(nickname, `tặng quà thần thoại kích hoạt NHƯ LAI THẦN CHƯỞNG (${diamondCount} xu)! ✋🪐`, assignedFaction);
      } else if (diamondCount >= 3000) {
        triggerDocCo(assignedFaction, nickname);
        triggerLucMach(assignedFaction, nickname);
        battleCommentary.triggerGiftCommentary(nickname, 'Thần Thú Huyền Thoại', 'Độc Cô Kiếm Tôn', assignedFaction);
        addLiveFeedItem(nickname, `tặng quà huyền thoại kích hoạt ĐỘC CÔ CỬU KIẾM (${diamondCount} xu)! 🌪️⚔️`, assignedFaction);
      } else if (diamondCount >= 1000) {
        triggerGiangLong(assignedFaction, nickname);
        battleCommentary.triggerGiftCommentary(nickname, 'Thần Long Vũ Trụ', 'Chí Tôn Thiên Tôn', assignedFaction);
        addLiveFeedItem(nickname, `tặng quà lớn triệu hồi GIÁNG LONG CHƯỞNG (${diamondCount} xu)! 🐉`, assignedFaction);
      } else if (diamondCount >= 500) {
        triggerVanKiem(assignedFaction, nickname);
        battleCommentary.triggerGiftCommentary(nickname, 'Chiến Xa / Sét', 'Chiến Thần Vạn Kiếm', assignedFaction);
        addLiveFeedItem(nickname, `tặng quà kích hoạt VẠN KIẾM QUY TÔNG (${diamondCount} xu)! ⚔️`, assignedFaction);
      } else if (diamondCount >= 200) {
        triggerHeroUpgrade(assignedFaction, nickname, 3);
        triggerThaiCuc(assignedFaction, nickname);
        battleCommentary.triggerGiftCommentary(nickname, 'Vương Miện Hoàng Kim', 'Kim Khải Thần Tướng', assignedFaction);
        addLiveFeedItem(nickname, `thăng cấp KIM KHẢI THẦN TƯỚNG + THÁI CỰC TRẬN (${diamondCount} xu)! 👑`, assignedFaction);
      } else if (diamondCount >= 50) {
        triggerHeroUpgrade(assignedFaction, nickname, 2);
        battleCommentary.triggerGiftCommentary(nickname, 'Nước Hoa Thiết Giáp', 'Thiết Giáp Kiếm Hiệp', assignedFaction);
        addLiveFeedItem(nickname, `thăng cấp THIẾT GIÁP KIẾM HIỆP (${diamondCount} xu)! 🛡️`, assignedFaction);
      } else {
        addOrUpdateFighter(assignedFaction, nickname, Math.max(20, diamondCount * 2));
        triggerDance(assignedFaction, nickname);
        addLiveFeedItem(nickname, `tặng quà tiếp sức & mở vũ điệu! 🎁`, assignedFaction);
      }
    }
  }, [externalLiveEvent, config.blueName, config.redName, addOrUpdateFighter, triggerDance, triggerAoeSkill, triggerBossSummon, triggerVanKiem, triggerGiangLong, triggerThaiCuc, triggerLucMach, triggerDocCo, triggerNhuLai, triggerThienNgoai, triggerKimCang, triggerReinforcements, triggerHeroUpgrade, resetMatch, playSfx, addLiveFeedItem]);

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      if (containerRef.current && canvas) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = containerRef.current.getBoundingClientRect();
        const w = rect.width > 0 ? rect.width : (containerRef.current.clientWidth || 1280);
        const h = rect.height > 0 ? rect.height : (containerRef.current.clientHeight || 720);
        if (w > 0 && h > 0) {
          engineRef.current.w = w;
          engineRef.current.h = h;
          canvas.width = w * dpr;
          canvas.height = h * dpr;
          canvas.style.width = `${w}px`;
          canvas.style.height = `${h}px`;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          updateFormation(w, h);
        }
      }
    };

    handleResize();
    const animFrameId = requestAnimationFrame(handleResize);
    const initialTimer = setTimeout(handleResize, 100);
    window.addEventListener('resize', handleResize);

    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver((entries) => {
        if (!entries[0]) return;
        const rect = entries[0].contentRect;
        if (rect.width > 0 && rect.height > 0) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const w = rect.width;
          const h = rect.height;
          engineRef.current.w = w;
          engineRef.current.h = h;
          canvas.width = w * dpr;
          canvas.height = h * dpr;
          canvas.style.width = `${w}px`;
          canvas.style.height = `${h}px`;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          updateFormation(w, h);
        }
      });
      resizeObserver.observe(containerRef.current);
    }

    const renderLoop = (time) => {
      try {
        const dt = Math.min(0.05, (time - engineRef.current.lastTime) / 1000);
        engineRef.current.lastTime = time;

        const w = engineRef.current.w || (canvas.width / (window.devicePixelRatio || 1));
        const h = engineRef.current.h || (canvas.height / (window.devicePixelRatio || 1));

        ctx.clearRect(0, 0, w, h);

        // 1. Draw Battlefield Background Grid & Central Rift
        const centerX = w / 2;
        const centerY = h / 2;
        const daisY = h * 0.36;

      // Ground plane glow
      const groundGrad = ctx.createLinearGradient(0, h * 0.4, 0, h);
      if (!isDarkMode) {
        groundGrad.addColorStop(0, 'rgba(241, 245, 249, 0)');
        groundGrad.addColorStop(1, 'rgba(226, 232, 240, 0.9)');
      } else {
        groundGrad.addColorStop(0, 'rgba(15, 18, 30, 0)');
        groundGrad.addColorStop(1, 'rgba(8, 10, 18, 0.85)');
      }
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, h * 0.4, w, h * 0.6);

      // Central divider energy line
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(centerX, h * 0.2);
      ctx.lineTo(centerX, h * 0.85);
      ctx.stroke();
      ctx.restore();

      // Faction Base Auras & VIP Dais Platforms
      const blueBaseGrad = ctx.createRadialGradient(centerX - 180, h * 0.65, 10, centerX - 180, h * 0.65, 240);
      blueBaseGrad.addColorStop(0, 'rgba(47, 107, 255, 0.22)');
      blueBaseGrad.addColorStop(1, 'rgba(47, 107, 255, 0)');
      ctx.fillStyle = blueBaseGrad;
      ctx.fillRect(0, h * 0.35, centerX, h * 0.65);

      const redBaseGrad = ctx.createRadialGradient(centerX + 180, h * 0.65, 10, centerX + 180, h * 0.65, 240);
      redBaseGrad.addColorStop(0, 'rgba(255, 59, 78, 0.22)');
      redBaseGrad.addColorStop(1, 'rgba(255, 59, 78, 0)');
      ctx.fillStyle = redBaseGrad;
      ctx.fillRect(centerX, h * 0.35, centerX, h * 0.65);

      // If no fighters are present yet, auto initialize starter champions
      if (engineRef.current.fighters.blue.length === 0 && engineRef.current.fighters.red.length === 0) {
        initDefaultChampions(w, h);
      }

      // Ensure persistent faction assignment on original fighter objects
      engineRef.current.fighters.blue.forEach(f => { f.factionId = 'blue'; });
      engineRef.current.fighters.red.forEach(f => { f.factionId = 'red'; });

      const activeBlue = engineRef.current.fighters.blue.filter(f => !f.isKnockedOut);
      const activeRed = engineRef.current.fighters.red.filter(f => !f.isKnockedOut);
      const pairCount = Math.min(activeBlue.length, activeRed.length);
      const totalActive = activeBlue.length + activeRed.length;

      // Dynamic Auto-Scale for crowded battlefields: Proportional crowd scaling for ALL fighters & UI elements
      const crowdScaleFactor = totalActive <= 2 ? 1.0 
        : totalActive <= 4 ? 0.88 
        : totalActive <= 6 ? 0.76 
        : totalActive <= 10 ? 0.64 
        : Math.max(0.44, 1.0 - (totalActive - 2) * 0.038);

      // 2. Update & Draw Fighters (Chiến binh Kiếm Hiệp 3D: Đội hình Viên Kim Cương Đối Xứng)
      const lerpFactor = Math.min(1, dt * 3.8);

      // Spawn sparks for active dueling pairs across the screen
      if (pairCount > 0 && Math.random() < 0.65) {
        const randPair = Math.floor(Math.random() * pairCount);
        const fPair = activeBlue[randPair];
        const clashX = fPair?.duelSpotX || (fPair?.x + 40);
        const clashY = fPair?.duelSpotY || fPair?.y || centerY;

        for (let sp = 0; sp < 3; sp++) {
          engineRef.current.particles.push({
            x: clashX + (Math.random() - 0.5) * 16,
            y: clashY + (Math.random() - 0.5) * 18,
            vx: (Math.random() - 0.5) * 110,
            vy: (Math.random() - 0.5) * 90 - 20,
            size: 2.5 + Math.random() * 3,
            color: Math.random() < 0.6 ? '#fde047' : '#ffffff',
            isFlash: true,
            lifespanMs: 380,
            spawnedAt: performance.now()
          });
        }

        if (performance.now() - engineRef.current.lastClashSoundTime > 300) {
          playSfx('hit');
          engineRef.current.lastClashSoundTime = performance.now();
        }
      }

      // Also VIP clash sparks between top rings
      const hasVipDuel = activeBlue.some(f => f.isVipStage) && activeRed.some(f => f.isVipStage);
      if (hasVipDuel && Math.random() < 0.35) {
        engineRef.current.particles.push({
          x: centerX + (Math.random() - 0.5) * 40,
          y: daisY + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 130,
          vy: (Math.random() - 0.5) * 100 - 30,
          size: 3.5 + Math.random() * 3.5,
          color: Math.random() < 0.5 ? '#fde047' : '#38bdf8',
          isFlash: true,
          lifespanMs: 450,
          spawnedAt: performance.now()
        });
      }

      // Collect real fighter references and sort for back-to-front rendering
      const allFighters = [
        ...engineRef.current.fighters.blue,
        ...engineRef.current.fighters.red
      ].sort((a, b) => {
        // VIP Dais fighters are rendered slightly earlier in layer or sorted by y
        if (a.isVipStage !== b.isVipStage) return a.isVipStage ? -1 : 1;
        return a.y - b.y;
      });

      allFighters.forEach(f => {
        if (f.isKnockedOut) return; // Disappear immediately upon death as requested by user

        const factionId = f.factionId || 'blue';
        const color = factionId === 'blue' ? config.blueColor : config.redColor;
        const dir = factionId === 'blue' ? 1 : -1;

        // Smooth physics lerp on the actual persistent fighter object
        const targetX = f.targetX !== undefined ? f.targetX : (factionId === 'blue' ? centerX - 44 : centerX + 44);
        const targetY = f.targetY !== undefined ? f.targetY : (f.isVipStage ? daisY : centerY);

        f.x += (targetX - f.x) * lerpFactor;
        f.y += (targetY - f.y) * lerpFactor;

        // Strict Safe Area Clamping: Guaranteed zero off-screen drift or overshoot across Mobile/Tablet/PC
        const minX = w * 0.16;
        const maxX = w * 0.84;
        const minY = h * 0.30;
        const maxY = h * 0.82;
        f.x = Math.max(minX, Math.min(maxX, f.x));
        f.y = Math.max(minY, Math.min(maxY, f.y));

        f.bobPhase += dt * 3.5;

        // Calculate Character Tier based on score
        const tier = f.score >= 5000 ? 5 : f.score >= 2000 ? 4 : f.score >= 500 ? 3 : f.score >= 100 ? 2 : 1;
        const isPulsing = performance.now() < f.pulseUntil;
        const isTopRank = f.rank === 0;

        // User Audio Rule: Chỉ nhân vật TẶNG QUÀ mới có HÀO QUANG & CÁNH SÁNG
        // Nhân vật bình thường tham chiến KHÔNG CÓ HÀO QUANG
        const hasGiftAura = Boolean((f.hasGift || f.isSuperVip || (f.giftScore && f.giftScore > 0)) && !f.isKnockedOut);

        // User Audio Rule: Tặng quà giá trị cao thì x3 nhân vật TO LÊN đi đấu
        let baseScale = 0.88 * crowdScaleFactor; // Kích thước chuẩn cho nhân vật bình thường
        if (hasGiftAura) {
          if (tier >= 5 || f.score >= 5000) {
            baseScale = 2.65 * crowdScaleFactor; // x3 Siêu Tướng VIP Chí Tôn
          } else if (tier === 4 || f.score >= 2000) {
            baseScale = 2.25 * crowdScaleFactor; // x2.5 Chiến Thần Vạn Kiếm
          } else if (tier === 3 || f.score >= 500) {
            baseScale = 1.60 * crowdScaleFactor; // x1.8 Thần Tướng
          } else if (tier === 2 || f.score >= 100) {
            baseScale = 1.15 * crowdScaleFactor; // x1.3 Hiệp Khách
          }
        } else if (f.isVipStage && isTopRank) {
          baseScale = 1.05 * crowdScaleFactor; // Đội trưởng khởi đầu gọn gàng
        }

        const scale = baseScale * (isPulsing ? 1.08 : 1.0);

        // Ground shadow (sleek & natural)
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(f.x, f.y + 20 * scale, (12 + tier * 2) * scale, (4 + tier) * scale, 0, 0, Math.PI * 2);
        ctx.fillStyle = isPulsing ? 'rgba(250, 204, 21, 0.45)' : 'rgba(0, 0, 0, 0.35)';
        ctx.fill();
        ctx.restore();

        // Sacred Beast Mount / Celestial Dragon Energy Ring ONLY for VIP Heroes with Gifts
        if (hasGiftAura && (tier >= 3 || f.isSuperVip)) {
          ctx.save();
          ctx.translate(f.x, f.y + 14 * scale);
          const dragonAngle = time * 0.0025;
          ctx.rotate(dragonAngle);

          // Dragon / Sacred Beast Energy Arc
          ctx.beginPath();
          ctx.arc(0, 0, 38 * scale, 0, Math.PI * 1.6);
          ctx.strokeStyle = factionId === 'blue' ? 'rgba(56, 189, 248, 0.85)' : 'rgba(244, 63, 94, 0.85)';
          ctx.lineWidth = 3.5 * scale;
          ctx.shadowColor = factionId === 'blue' ? '#38bdf8' : '#f43f5e';
          ctx.shadowBlur = 18;
          ctx.stroke();

          // Dragon Head Crest / Flaming Beast Eye
          const headAngle = Math.PI * 1.6;
          const hx = Math.cos(headAngle) * 38 * scale;
          const hy = Math.sin(headAngle) * 38 * scale;
          ctx.beginPath();
          ctx.arc(hx, hy, 5 * scale, 0, Math.PI * 2);
          ctx.fillStyle = '#fef08a';
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 14;
          ctx.fill();
          ctx.restore();
        }

        // Name tag, Title & Health Bar (Tạo khoảng cách thông thoáng, không che khuất nhân vật)
        ctx.save();
        const tagDist = (36 + (hasGiftAura && tier >= 3 ? 12 : 0)) * scale;
        const isVip = (hasGiftAura && tier >= 3) || f.isSuperVip;

        ctx.font = `${isVip ? 'bold 11px' : 'bold 9.5px'} 'Be Vietnam Pro', sans-serif`;
        ctx.textAlign = 'center';
        ctx.lineWidth = 2.8;
        ctx.strokeStyle = 'rgba(0,0,0,0.95)';
        
        let tierBadge = '';
        if (hasGiftAura && tier >= 5) {
          tierBadge = '👑 [CHÍ TÔN] ';
          ctx.fillStyle = '#fef08a';
        } else if (hasGiftAura && tier === 4) {
          tierBadge = '⚡ [CHIẾN THẦN] ';
          ctx.fillStyle = '#38bdf8';
        } else if (hasGiftAura && (tier === 3 || f.isSuperVip)) {
          tierBadge = '✨ [THẦN TƯỚNG] ';
          ctx.fillStyle = '#fde047';
        } else if (hasGiftAura && tier === 2) {
          tierBadge = '🛡️ ';
          ctx.fillStyle = '#cbd5e1';
        } else {
          tierBadge = isTopRank ? (factionId === 'blue' ? '🔵 ' : '🔴 ') : '';
          ctx.fillStyle = '#ffffff';
        }

        // Clean raw name to prevent duplicate brackets like [[THẦN TƯỚNG] Gia Bảo]
        const rawName = (f.nickname || '').replace(/\[.*?\]/g, '').trim() || f.nickname || 'Hiệp Khách';
        const displayName = rawName.length > 9 ? rawName.slice(0, 8) + '…' : rawName;
        const fullTag = tierBadge + displayName;

        ctx.strokeText(fullTag, f.x, f.y - tagDist);
        ctx.fillText(fullTag, f.x, f.y - tagDist);

        // Individual Health Bar
        const barW = (isVip ? 36 : 22) * scale;
        const barH = 3.2 * scale;
        const barX = f.x - barW / 2;
        const barY = f.y - (tagDist - 5 * scale);

        ctx.fillStyle = 'rgba(0,0,0,0.75)';
        ctx.fillRect(barX, barY, barW, barH);
        
        const currentHp = f.currentHp !== undefined ? f.currentHp : (f.maxHp || 280);
        const maxHp = f.maxHp || 280;
        const hpRatio = Math.max(0, Math.min(1, currentHp / maxHp));
        ctx.fillStyle = hpRatio > 0.5 ? (tier >= 4 ? '#eab308' : color) : '#ef4444';
        ctx.fillRect(barX, barY, barW * hpRatio, barH);
        ctx.restore();

        // Holy Revive Light Pillar
        if (f.revivedAt && (performance.now() - f.revivedAt < 1800)) {
          const reviveAlpha = 1 - (performance.now() - f.revivedAt) / 1800;
          ctx.save();
          ctx.fillStyle = `rgba(250, 204, 21, ${reviveAlpha * 0.4})`;
          ctx.fillRect(f.x - 14 * scale, 0, 28 * scale, f.y + 20 * scale);
          ctx.strokeStyle = `rgba(255, 255, 255, ${reviveAlpha * 0.8})`;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(f.x - 14 * scale, 0, 28 * scale, f.y + 20 * scale);
          ctx.restore();
        }

        // Protective Barrier Aura (Hào Quang Bảo Vệ) ONLY for Gift Givers / VIP Heroes
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.scale(scale, scale);

        if (hasGiftAura && (tier >= 3 || isPulsing)) {
          const auraPulse = Math.sin(time * 0.003) * 0.08 + 1.0;
          const auraScale = (1.2 + (tier >= 4 ? 0.25 : 0)) * auraPulse;

          ctx.save();
          ctx.shadowColor = tier === 5 ? '#facc15' : (factionId === 'blue' ? '#38bdf8' : '#f43f5e');
          ctx.shadowBlur = 22;

          // Outer shimmering protective sphere
          ctx.strokeStyle = tier === 5 ? 'rgba(250, 204, 21, 0.85)' : (factionId === 'blue' ? 'rgba(56, 189, 248, 0.85)' : 'rgba(244, 63, 94, 0.85)');
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.ellipse(0, 0, 28 * auraScale, 32 * auraScale, 0, 0, Math.PI * 2);
          ctx.stroke();

          // Inner soft ambient light fill
          ctx.fillStyle = tier === 5 ? 'rgba(250, 204, 21, 0.20)' : (factionId === 'blue' ? 'rgba(56, 189, 248, 0.18)' : 'rgba(244, 63, 94, 0.18)');
          ctx.fill();

          // Rotating celestial protective runes
          const runeAngle = time * 0.002;
          ctx.save();
          ctx.rotate(runeAngle);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 1;
          for (let r = 0; r < 4; r++) {
            ctx.strokeRect(-18 + r * 9, -2, 4, 4);
          }
          ctx.restore();
          ctx.restore();
        }

        // Wings of Light ONLY for High Tier Gift Givers (Tier 3+)
        if (hasGiftAura && tier >= 3) {
          const wingFlap = Math.sin(time * 0.004) * 6;
          const isBlueTeam = factionId === 'blue';
          const wingColor = tier === 5 ? '#facc15' : (isBlueTeam ? '#38bdf8' : '#f43f5e');
          const wingGlow = isBlueTeam ? '#0284c7' : '#e11d48';

          ctx.save();
          ctx.shadowColor = tier === 5 ? '#fbbf24' : wingGlow;
          ctx.shadowBlur = 18;

          // Left Wing
          const leftWingGrad = ctx.createLinearGradient(-4, 0, -28, -14);
          leftWingGrad.addColorStop(0, wingColor);
          leftWingGrad.addColorStop(1, 'rgba(255, 255, 255, 0.25)');
          ctx.fillStyle = leftWingGrad;
          ctx.strokeStyle = tier === 5 ? '#fef08a' : '#ffffff';
          ctx.lineWidth = 1.5;

          ctx.beginPath();
          ctx.moveTo(-4, -2);
          ctx.quadraticCurveTo(-18, -18 + wingFlap, -28, -10 + wingFlap);
          ctx.quadraticCurveTo(-16, 2 + wingFlap, -4, 5);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Right Wing
          const rightWingGrad = ctx.createLinearGradient(4, 0, 28, -14);
          rightWingGrad.addColorStop(0, wingColor);
          rightWingGrad.addColorStop(1, 'rgba(255, 255, 255, 0.25)');
          ctx.fillStyle = rightWingGrad;

          ctx.beginPath();
          ctx.moveTo(4, -2);
          ctx.quadraticCurveTo(18, -18 - wingFlap, 28, -10 - wingFlap);
          ctx.quadraticCurveTo(16, 2 - wingFlap, 4, 5);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

        // 3D Articulated Skeletal Kinematics with Dynamic 10+ Martial Arts Stances
        const fighterGender = f.gender || (f.rank % 2 === 0 ? 'male' : 'female');
        
        const blueAttackMoves = [
          SKELETON_STATES.ATTACK_BLUE_THRUST,
          SKELETON_STATES.ATTACK_BLUE_CROSS,
          SKELETON_STATES.ATTACK_BLUE_HEAVEN_SWORD,
          SKELETON_STATES.ATTACK_BLUE_UPPERCUT,
          SKELETON_STATES.ATTACK_BLUE_DOUBLE,
          SKELETON_STATES.MARTIAL_KICK_COMBO,
          SKELETON_STATES.TAI_CHI_PALM
        ];
        const redAttackMoves = [
          SKELETON_STATES.ATTACK_RED_CLEAVE,
          SKELETON_STATES.ATTACK_RED_SWEEP,
          SKELETON_STATES.ATTACK_RED_WHIRLWIND,
          SKELETON_STATES.ATTACK_RED_HEAVY_SLAM,
          SKELETON_STATES.ATTACK_RED_DOUBLE_CHOP,
          SKELETON_STATES.MARTIAL_KICK_COMBO,
          SKELETON_STATES.TAI_CHI_PALM
        ];

        let animState = SKELETON_STATES.WALK;
        const distToTarget = Math.hypot(targetX - f.x, targetY - f.y);
        const isArrived = distToTarget < 24;

        if (f.isKnockedOut) {
          animState = SKELETON_STATES.DEFEATED;
        } else if (f.revivedAt && (performance.now() - f.revivedAt < 1800)) {
          animState = SKELETON_STATES.REVIVE;
        } else if (f.isDancing && performance.now() < f.danceUntil) {
          animState = SKELETON_STATES.DANCE;
        } else if (isPulsing) {
          animState = factionId === 'blue' ? SKELETON_STATES.ATTACK_BLUE_HEAVEN_SWORD : SKELETON_STATES.ATTACK_RED_HEAVY_SLAM;
        } else if (f.isVipStage) {
          if (hasVipDuel) {
            // Slower, grand martial arts duel on top VIP tier with dynamic 10+ combo cycling
            const moveIdx = Math.floor(time * 0.00045 + (f.rank || 0)) % 7;
            const vipCycle = (time * 0.0016 + (f.rank || 0) * 1.5) % 4.0;
            if (factionId === 'blue') {
              animState = vipCycle < 1.6 ? blueAttackMoves[moveIdx] : (vipCycle < 2.8 ? (moveIdx % 2 === 0 ? SKELETON_STATES.DEFEND_PARRY : SKELETON_STATES.DEFEND_BLOCK) : SKELETON_STATES.IDLE);
            } else {
              animState = vipCycle < 1.6 ? (moveIdx % 2 === 0 ? SKELETON_STATES.DEFEND_PARRY : SKELETON_STATES.DEFEND_BLOCK) : (vipCycle < 2.8 ? redAttackMoves[moveIdx] : SKELETON_STATES.IDLE);
            }
          } else {
            // VIP stands majestically in commanding martial stance
            animState = isArrived ? SKELETON_STATES.IDLE : SKELETON_STATES.WALK;
          }
        } else if (f.isDuelFront && f.duelPairIdx !== undefined && f.duelPairIdx >= 0) {
          if (isArrived) {
            // Dynamic martial arts combat rotation: 10+ varied moves cycled across pairs
            const pairOffset = (f.duelPairIdx || 0) * 1.4;
            const combatTime = time * 0.0018 + pairOffset;
            const moveIdx = Math.floor(combatTime * 0.45 + (f.duelPairIdx || 0)) % 7;
            const combatCycle = combatTime % 4.0;

            if (factionId === 'blue') {
              if (combatCycle < 1.4) {
                animState = blueAttackMoves[moveIdx];
              } else if (combatCycle < 2.0) {
                animState = SKELETON_STATES.IDLE;
              } else if (combatCycle < 3.4) {
                animState = (moveIdx % 2 === 0) ? SKELETON_STATES.DEFEND_PARRY : SKELETON_STATES.DEFEND_BLOCK;
              } else {
                animState = SKELETON_STATES.IDLE;
              }
            } else {
              // Red counters when Blue pauses
              if (combatCycle < 1.4) {
                animState = (moveIdx % 2 === 0) ? SKELETON_STATES.DEFEND_PARRY : SKELETON_STATES.DEFEND_BLOCK;
              } else if (combatCycle < 2.0) {
                animState = SKELETON_STATES.IDLE;
              } else if (combatCycle < 3.4) {
                animState = redAttackMoves[moveIdx];
              } else {
                animState = SKELETON_STATES.IDLE;
              }
            }
          } else {
            animState = SKELETON_STATES.WALK;
          }
        } else {
          // Unpaired fighters waiting in ready stance
          animState = isArrived ? SKELETON_STATES.IDLE : SKELETON_STATES.WALK;
        }

        const skeletonData = computeSkeletalJoints({
          gender: fighterGender,
          animState: animState,
          factionId: factionId,
          time: time,
          phase: f.bobPhase || 0,
          tier: tier,
          animSpeed: config.animSpeed || 0.55
        });

        render3DWarriorSkeleton(ctx, skeletonData, {
          factionId,
          scale: 1.0,
          isPulsing
        });

        // Orbiting Qi Swords for Tier 4 & 5
        if (tier >= 4 && !f.isKnockedOut) {
          const orbitSwords = tier === 5 ? 4 : 3;
          for (let s = 0; s < orbitSwords; s++) {
            const angle = time * 0.003 + (s * (Math.PI * 2 / orbitSwords));
            const ox = Math.cos(angle) * 18;
            const oy = Math.sin(angle) * 11;
            ctx.save();
            ctx.translate(ox, oy);
            ctx.rotate(angle + Math.PI / 2);
            ctx.strokeStyle = tier === 5 ? '#facc15' : '#38bdf8';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, -7);
            ctx.lineTo(0, 7);
            ctx.stroke();
            ctx.restore();
          }
        }

        ctx.restore();
      });

      // 3. Update & Draw Flying Swords (Tuyệt Kỹ VẠN KIẾM QUY TÔNG - Sát Thương Đám Đông & Hạ Gục)
      for (let i = engineRef.current.flyingSwords.length - 1; i >= 0; i--) {
        const sw = engineRef.current.flyingSwords[i];
        sw.progress += dt * sw.speed;

        if (sw.progress > 0) {
          const curX = sw.x + (sw.targetX - sw.x) * Math.min(1, sw.progress);
          const curY = sw.y + (sw.targetY - sw.y) * Math.min(1, sw.progress);
          const angle = Math.atan2(sw.targetY - sw.y, sw.targetX - sw.x);

          ctx.save();
          ctx.translate(curX, curY);
          ctx.rotate(angle);
          ctx.shadowColor = sw.color;
          ctx.shadowBlur = 16;

          // Glowing Sword Laser Body
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(-20, 0);
          ctx.lineTo(16, 0);
          ctx.stroke();

          // Sword Hilt
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(-14, -4.5);
          ctx.lineTo(-14, 4.5);
          ctx.stroke();

          ctx.restore();

          // On Hit: AoE Explosion & Enemy Knockout Calculation
          if (sw.progress >= 1) {
            const oppFaction = (sw.factionId || (sw.color === '#38bdf8' ? 'blue' : 'red')) === 'blue' ? 'red' : 'blue';
            const oppList = engineRef.current.fighters[oppFaction];

            oppList.forEach(f => {
              if (f.isKnockedOut) return;
              const dist = Math.hypot(f.x - sw.targetX, f.y - sw.targetY);
              if (dist < 80) {
                const dmg = Math.floor(160 + Math.random() * 100);
                f.currentHp = Math.max(0, (f.currentHp || f.maxHp || 280) - dmg);
                engineRef.current.floatingTexts.push({
                  text: `-${dmg}`,
                  x: f.x + (Math.random() - 0.5) * 16,
                  y: f.y - 30,
                  vy: -40,
                  color: '#ef4444',
                  font: 'bold 12px sans-serif',
                  spawnedAt: performance.now(),
                  lifespanMs: 900
                });

                if (f.currentHp <= 0) {
                  f.isKnockedOut = true;
                  f.knockoutTime = performance.now();
                  f.knockbackVx = (oppFaction === 'red' ? 1 : -1) * 75;
                  engineRef.current.floatingTexts.push({
                    text: '💥 HẠ GỤC!',
                    x: f.x,
                    y: f.y - 42,
                    vy: -30,
                    color: '#f87171',
                    font: 'bold 14px sans-serif',
                    spawnedAt: performance.now(),
                    lifespanMs: 1800
                  });
                  setLiveFeed(prev => [
                    {
                      id: `ko_sw_${Date.now()}_${Math.random()}`,
                      name: f.nickname,
                      text: `💥 Bị Vạn Kiếm hạ gục! (BL "${oppFaction === 'blue' ? 'xanh' : 'đỏ'}" để hồi sinh)`,
                      faction: oppFaction
                    },
                    ...prev.slice(0, 7)
                  ]);
                }
              }
            });

            for (let p = 0; p < 8; p++) {
              engineRef.current.particles.push({
                x: sw.targetX + (Math.random() - 0.5) * 20,
                y: sw.targetY + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 140,
                vy: (Math.random() - 0.5) * 140,
                size: 3.5,
                color: sw.color,
                isFlash: true,
                lifespanMs: 1200,
                spawnedAt: performance.now()
              });
            }
            engineRef.current.flyingSwords.splice(i, 1);
          }
        }
      }

      // 4. Update & Draw Dragon Beasts (Tuyệt Kỹ GIÁNG LONG THẬP BÁT CHƯỞNG - Quét Sạch Đám Đông)
      for (let i = engineRef.current.dragonBeasts.length - 1; i >= 0; i--) {
        const dBeast = engineRef.current.dragonBeasts[i];
        const isBlue = dBeast.factionId === 'blue';
        dBeast.x += (isBlue ? 1 : -1) * 340 * dt;
        const waveY = Math.sin((dBeast.x / w) * Math.PI * 4) * 28;

        ctx.save();
        ctx.translate(dBeast.x, dBeast.y + waveY);
        ctx.scale(isBlue ? 3.0 : -3.0, 3.0);
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 32;

        // Golden Dragon Head & Body
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.font = 'bold 8px sans-serif';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText('🐉 THẦN LONG', 0, 3);
        ctx.restore();

        // AoE Sweep Damage to Enemy Line
        const oppFaction = isBlue ? 'red' : 'blue';
        const oppList = engineRef.current.fighters[oppFaction];
        oppList.forEach(f => {
          if (f.isKnockedOut) return;
          const dist = Math.hypot(f.x - dBeast.x, f.y - (dBeast.y + waveY));
          if (dist < 90 && (!f.lastDragonHit || performance.now() - f.lastDragonHit > 500)) {
            f.lastDragonHit = performance.now();
            const dmg = Math.floor(400 + Math.random() * 250);
            f.currentHp = Math.max(0, (f.currentHp || f.maxHp || 280) - dmg);
            engineRef.current.floatingTexts.push({
              text: `⚡ RỒNG QUÉT -${dmg}`,
              x: f.x,
              y: f.y - 30,
              vy: -50,
              color: '#facc15',
              font: 'bold 13px sans-serif',
              spawnedAt: performance.now(),
              lifespanMs: 1100
            });

            if (f.currentHp <= 0) {
              f.isKnockedOut = true;
              f.knockoutTime = performance.now();
              f.knockbackVx = (isBlue ? 1 : -1) * 105;
              engineRef.current.floatingTexts.push({
                text: '🐉 QUÉT SẠCH!',
                x: f.x,
                y: f.y - 45,
                vy: -35,
                color: '#f59e0b',
                font: 'bold 15px sans-serif',
                spawnedAt: performance.now(),
                lifespanMs: 1900
              });
              setLiveFeed(prev => [
                {
                  id: `ko_dr_${Date.now()}_${Math.random()}`,
                  name: f.nickname,
                  text: `🐉 Bị Thần Long quét sạch! (BL "${oppFaction === 'blue' ? 'xanh' : 'đỏ'}" để hồi sinh)`,
                  faction: oppFaction
                },
                ...prev.slice(0, 7)
              ]);
            }
          }
        });

        if (performance.now() - dBeast.spawnedAt > 4000) {
          engineRef.current.dragonBeasts.splice(i, 1);
        }
      }

      // 5. Update & Draw Tai Chi Shields (Tuyệt Kỹ THÁI CỰC KIẾM TRẬN)
      for (let i = engineRef.current.taiChiShields.length - 1; i >= 0; i--) {
        const tc = engineRef.current.taiChiShields[i];
        const elapsed = performance.now() - tc.spawnedAt;
        const progress = elapsed / tc.lifespanMs;

        if (progress < 1) {
          tc.radius += (tc.maxRadius - tc.radius) * dt * 3;
          ctx.save();
          ctx.translate(tc.x, tc.y);
          ctx.rotate(time * 0.003);
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 20;

          // Yin Yang Outer Ring
          ctx.strokeStyle = `rgba(56, 189, 248, ${1 - progress})`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, tc.radius, 0, Math.PI * 2);
          ctx.stroke();

          // Yin Yang symbols
          ctx.fillStyle = `rgba(255, 255, 255, ${(1 - progress) * 0.35})`;
          ctx.beginPath();
          ctx.arc(0, 0, tc.radius, 0, Math.PI);
          ctx.fill();

          ctx.restore();
        } else {
          engineRef.current.taiChiShields.splice(i, 1);
        }
      }

      // 5.1 Update & Draw Lục Mạch Thần Kiếm (Laser Kiếm Khí 6 Màu)
      for (let i = (engineRef.current.lucMachBeams?.length || 0) - 1; i >= 0; i--) {
        const lm = engineRef.current.lucMachBeams[i];
        const elapsed = performance.now() - lm.spawnedAt;
        if (elapsed < lm.lifespanMs) {
          lm.beams.forEach(b => {
            b.progress += dt * b.speed;
            if (b.progress > 0 && b.progress < 1.4) {
              const currentX = lm.startX + (lm.targetX - lm.startX) * Math.min(1, b.progress);
              const curY = lm.baseY + b.yOffset;

              ctx.save();
              ctx.shadowColor = b.color;
              ctx.shadowBlur = 24;
              ctx.strokeStyle = b.color;
              ctx.lineWidth = b.width * 2;
              ctx.beginPath();
              ctx.moveTo(lm.startX, curY);
              ctx.lineTo(currentX, curY);
              ctx.stroke();

              // Laser head flare
              ctx.fillStyle = '#ffffff';
              ctx.beginPath();
              ctx.arc(currentX, curY, 6, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();

              // Damage enemy line
              if (b.progress >= 1 && !b.hitTriggered) {
                b.hitTriggered = true;
                const oppFaction = lm.factionId === 'blue' ? 'red' : 'blue';
                const oppList = engineRef.current.fighters[oppFaction];
                oppList.forEach(f => {
                  if (f.isKnockedOut) return;
                  if (Math.abs(f.y - curY) < 45) {
                    const dmg = Math.floor(220 + Math.random() * 150);
                    f.currentHp = Math.max(0, (f.currentHp || f.maxHp || 280) - dmg);
                    engineRef.current.floatingTexts.push({
                      text: `🌈 -${dmg}`,
                      x: f.x,
                      y: f.y - 35,
                      vy: -45,
                      color: b.color,
                      font: 'bold 13px sans-serif',
                      spawnedAt: performance.now(),
                      lifespanMs: 1100
                    });
                    if (f.currentHp <= 0) {
                      f.isKnockedOut = true;
                      f.knockoutTime = performance.now();
                      f.knockbackVx = (oppFaction === 'red' ? 1 : -1) * 85;
                    }
                  }
                });
              }
            }
          });
        } else {
          engineRef.current.lucMachBeams.splice(i, 1);
        }
      }

      // 5.2 Update & Draw Độc Cô Cửu Kiếm (Bão Lốc Xoáy Kiếm Trận)
      for (let i = (engineRef.current.docCoStorms?.length || 0) - 1; i >= 0; i--) {
        const storm = engineRef.current.docCoStorms[i];
        const elapsed = performance.now() - storm.spawnedAt;
        const progress = elapsed / storm.lifespanMs;
        if (progress < 1) {
          storm.radius += (storm.maxRadius - storm.radius) * dt * 2.5;
          ctx.save();
          ctx.translate(storm.x, storm.y);
          ctx.rotate(time * 0.008);
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 28;

          // Swirling vortex rings
          ctx.strokeStyle = `rgba(6, 182, 212, ${1 - progress})`;
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.arc(0, 0, storm.radius, 0, Math.PI * 2);
          ctx.stroke();

          // 9 revolving mystical swords
          for (let s = 0; s < 9; s++) {
            const angle = (s / 9) * Math.PI * 2 + time * 0.005;
            const sx = Math.cos(angle) * storm.radius * 0.85;
            const sy = Math.sin(angle) * storm.radius * 0.85;

            ctx.save();
            ctx.translate(sx, sy);
            ctx.rotate(angle + Math.PI / 2);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-2, -18, 4, 36);
            ctx.restore();
          }
          ctx.restore();

          // Vortex suction and hit ticks
          if (!storm.lastHitTick || performance.now() - storm.lastHitTick > 400) {
            storm.lastHitTick = performance.now();
            const oppFaction = storm.factionId === 'blue' ? 'red' : 'blue';
            engineRef.current.fighters[oppFaction].forEach(f => {
              if (f.isKnockedOut) return;
              const dist = Math.hypot(f.x - storm.x, f.y - storm.y);
              if (dist < storm.radius + 30) {
                const dmg = Math.floor(180 + Math.random() * 120);
                f.currentHp = Math.max(0, (f.currentHp || f.maxHp || 280) - dmg);
                engineRef.current.floatingTexts.push({
                  text: `🌪️ -${dmg}`,
                  x: f.x,
                  y: f.y - 30,
                  vy: -40,
                  color: '#06b6d4',
                  font: 'bold 12px sans-serif',
                  spawnedAt: performance.now(),
                  lifespanMs: 900
                });
                if (f.currentHp <= 0) {
                  f.isKnockedOut = true;
                  f.knockoutTime = performance.now();
                  f.knockbackVx = (oppFaction === 'red' ? 1 : -1) * 90;
                }
              }
            });
          }
        } else {
          engineRef.current.docCoStorms.splice(i, 1);
        }
      }

      // 5.3 Update & Draw Như Lai Thần Chưởng (Phật Quang Thái Dương Hoàng Kim)
      for (let i = (engineRef.current.nhuLaiPalms?.length || 0) - 1; i >= 0; i--) {
        const palm = engineRef.current.nhuLaiPalms[i];
        palm.progress += dt * 0.7;
        if (palm.progress < 1.2) {
          const currentSize = palm.size + (palm.maxSize - palm.size) * Math.min(1, palm.progress);
          const alpha = palm.progress <= 1 ? 0.9 : Math.max(0, 1 - (palm.progress - 1) * 5);

          ctx.save();
          ctx.translate(palm.x, palm.y);
          ctx.shadowColor = '#eab308';
          ctx.shadowBlur = 40;

          // Radiant Sun Halo Rings
          ctx.strokeStyle = `rgba(234, 179, 8, ${alpha * 0.8})`;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(0, 0, currentSize * 0.9, 0, Math.PI * 2);
          ctx.stroke();

          // Golden Sanskrit Mandala Circle
          ctx.fillStyle = `rgba(234, 179, 8, ${alpha * 0.25})`;
          ctx.beginPath();
          ctx.arc(0, 0, currentSize * 0.8, 0, Math.PI * 2);
          ctx.fill();

          // Giant Buddha Palm Icon
          ctx.font = `bold ${Math.floor(currentSize * 0.8)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('✋', 0, 0);

          ctx.restore();

          // Impact shockwave on reaching full size
          if (palm.progress >= 0.85 && !palm.hitTriggered) {
            palm.hitTriggered = true;
            const oppFaction = palm.factionId === 'blue' ? 'red' : 'blue';
            engineRef.current.fighters[oppFaction].forEach(f => {
              if (f.isKnockedOut) return;
              const dist = Math.hypot(f.x - palm.x, f.y - palm.y);
              if (dist < palm.maxSize) {
                const dmg = Math.floor(450 + Math.random() * 250);
                f.currentHp = Math.max(0, (f.currentHp || f.maxHp || 280) - dmg);
                engineRef.current.floatingTexts.push({
                  text: `✋ PHẬT QUANG -${dmg}`,
                  x: f.x,
                  y: f.y - 45,
                  vy: -55,
                  color: '#eab308',
                  font: 'bold 15px sans-serif',
                  spawnedAt: performance.now(),
                  lifespanMs: 1400
                });
                if (f.currentHp <= 0) {
                  f.isKnockedOut = true;
                  f.knockoutTime = performance.now();
                  f.knockbackVx = (oppFaction === 'red' ? 1 : -1) * 120;
                }
              }
            });
          }
        } else {
          engineRef.current.nhuLaiPalms.splice(i, 1);
        }
      }

      // 5.4 Update & Draw Thiên Ngoại Phi Tiên (Băng Vũ Kiếm Thần)
      for (let i = (engineRef.current.thienNgoaiFlashes?.length || 0) - 1; i >= 0; i--) {
        const tf = engineRef.current.thienNgoaiFlashes[i];
        tf.progress += dt * 1.8;
        if (tf.progress < 1.3) {
          ctx.save();
          ctx.shadowColor = tf.color;
          ctx.shadowBlur = 30;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;

          ctx.beginPath();
          tf.points.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          });
          ctx.stroke();

          // Draw fairy sword slash avatar along path
          const currentPtIdx = Math.min(tf.points.length - 1, Math.floor(tf.progress * tf.points.length));
          const curPt = tf.points[currentPtIdx] || tf.points[0];

          ctx.font = 'bold 24px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('❄️⚔️', curPt.x, curPt.y);
          ctx.restore();

          if (tf.progress >= 0.7 && !tf.hitTriggered) {
            tf.hitTriggered = true;
            const oppFaction = tf.factionId === 'blue' ? 'red' : 'blue';
            engineRef.current.fighters[oppFaction].forEach(f => {
              if (f.isKnockedOut) return;
              const dmg = Math.floor(320 + Math.random() * 180);
              f.currentHp = Math.max(0, (f.currentHp || f.maxHp || 280) - dmg);
              engineRef.current.floatingTexts.push({
                text: `❄️ PHI TIÊN -${dmg}`,
                x: f.x,
                y: f.y - 35,
                vy: -45,
                color: '#38bdf8',
                font: 'bold 13px sans-serif',
                spawnedAt: performance.now(),
                lifespanMs: 1100
              });
              if (f.currentHp <= 0) {
                f.isKnockedOut = true;
                f.knockoutTime = performance.now();
                f.knockbackVx = (oppFaction === 'red' ? 1 : -1) * 95;
              }
            });
          }
        } else {
          engineRef.current.thienNgoaiFlashes.splice(i, 1);
        }
      }

      // 5.5 Update & Draw Kim Cang Bất Hoại (Chuông Vàng Hoàng Kim)
      for (let i = (engineRef.current.kimCangBells?.length || 0) - 1; i >= 0; i--) {
        const bell = engineRef.current.kimCangBells[i];
        const elapsed = performance.now() - bell.spawnedAt;
        const progress = elapsed / bell.lifespanMs;
        if (progress < 1) {
          bell.radius += (bell.maxRadius - bell.radius) * dt * 3;

          ctx.save();
          ctx.translate(bell.x, bell.y);
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 35;

          // Golden Bell Dome
          ctx.strokeStyle = `rgba(250, 204, 21, ${1 - progress * 0.8})`;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(0, 0, bell.radius, Math.PI, 0, false);
          ctx.stroke();

          ctx.fillStyle = `rgba(250, 204, 21, ${(1 - progress) * 0.25})`;
          ctx.beginPath();
          ctx.arc(0, 0, bell.radius, Math.PI, 0, false);
          ctx.fill();

          ctx.font = 'bold 22px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🔔 KIM CANG', 0, -bell.radius * 0.4);
          ctx.restore();
        } else {
          engineRef.current.kimCangBells.splice(i, 1);
        }
      }

      // 6. Update & Draw Bosses (Thần Thú Càn Quét)
      for (let i = engineRef.current.bosses.length - 1; i >= 0; i--) {
        const boss = engineRef.current.bosses[i];
        const dir = boss.factionId === 'blue' ? 1 : -1;
        boss.x += dir * 160 * dt;

        ctx.save();
        ctx.translate(boss.x, boss.y);
        ctx.scale(boss.factionId === 'blue' ? 2.5 : -2.5, 2.5);

        const bossColor = boss.factionId === 'blue' ? '#38bdf8' : '#fb7185';
        ctx.shadowColor = bossColor;
        ctx.shadowBlur = 24;
        ctx.fillStyle = bossColor;

        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = 'bold 8px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(boss.factionId === 'blue' ? 'RỒNG' : 'HỔ', 0, 3);

        ctx.restore();

        // Boss Crush Damage
        const oppFaction = boss.factionId === 'blue' ? 'red' : 'blue';
        const oppList = engineRef.current.fighters[oppFaction];
        oppList.forEach(f => {
          if (f.isKnockedOut) return;
          const dist = Math.hypot(f.x - boss.x, f.y - boss.y);
          if (dist < 80 && (!f.lastBossHit || performance.now() - f.lastBossHit > 700)) {
            f.lastBossHit = performance.now();
            const dmg = Math.floor(260 + Math.random() * 160);
            f.currentHp = Math.max(0, (f.currentHp || f.maxHp || 280) - dmg);
            engineRef.current.floatingTexts.push({
              text: `💥 -${dmg}`,
              x: f.x,
              y: f.y - 28,
              vy: -40,
              color: '#f87171',
              font: 'bold 12px sans-serif',
              spawnedAt: performance.now(),
              lifespanMs: 1000
            });
            if (f.currentHp <= 0) {
              f.isKnockedOut = true;
              f.knockoutTime = performance.now();
              f.knockbackVx = (boss.factionId === 'blue' ? 1 : -1) * 80;
              engineRef.current.floatingTexts.push({
                text: '💥 HẠ GỤC!',
                x: f.x,
                y: f.y - 42,
                vy: -30,
                color: '#ef4444',
                font: 'bold 14px sans-serif',
                spawnedAt: performance.now(),
                lifespanMs: 1800
              });
            }
          }
        });

        if (performance.now() - boss.spawnedAt > 4500) {
          engineRef.current.bosses.splice(i, 1);
        }
      }

      // 7. Update & Draw Floating Combat Damage & Status Numbers
      for (let i = engineRef.current.floatingTexts.length - 1; i >= 0; i--) {
        const ft = engineRef.current.floatingTexts[i];
        ft.y += (ft.vy || -35) * dt;
        const elapsed = performance.now() - ft.spawnedAt;
        const alpha = Math.max(0, 1 - elapsed / ft.lifespanMs);
        if (alpha <= 0) {
          engineRef.current.floatingTexts.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = ft.font || 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(0,0,0,0.9)';
        ctx.fillStyle = ft.color || '#facc15';
        ctx.strokeText(ft.text, ft.x, ft.y);
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }



      // 5. Update & Draw Particles
      const particles = engineRef.current.particles;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

          if (performance.now() - p.spawnedAt > p.lifespanMs) {
            particles.splice(i, 1);
          }
        }
      } catch (err) {
        console.error('Battlefield renderLoop error:', err);
      } finally {
        engineRef.current.rAfId = requestAnimationFrame(renderLoop);
      }
    };

    engineRef.current.rAfId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameId);
      clearTimeout(initialTimer);
      if (resizeObserver) resizeObserver.disconnect();
      if (engineRef.current.rAfId) cancelAnimationFrame(engineRef.current.rAfId);
    };
  }, [config, updateFormation, initDefaultChampions, isDarkMode]);

  // Calculate HP Percentages
  const blueHpPct = Math.max(0, Math.min(100, (gameState.hp.blue / gameState.maxHp) * 100));
  const redHpPct = Math.max(0, Math.min(100, (gameState.hp.red / gameState.maxHp) * 100));

  // Test Gift Trigger
  const handleTestGift = (coins, faction = 'blue') => {
    const supporterName = faction === 'blue' ? 'Chiến Binh Xanh' : 'Chiến Tướng Đỏ';
    if (coins >= 1000) {
      triggerGiangLong(faction, supporterName);
      battleCommentary.triggerGiftCommentary(supporterName, 'Thần Long Vũ Trụ', 'Chí Tôn Thiên Tôn', faction);
      addLiveFeedItem(supporterName, `tặng quà lớn triệu hồi GIÁNG LONG CHƯỞNG (1000 xu)! 🐉`, faction);
    } else if (coins >= 500) {
      triggerVanKiem(faction, supporterName);
      battleCommentary.triggerGiftCommentary(supporterName, 'Chiến Xa / Sét', 'Chiến Thần Vạn Kiếm', faction);
      addLiveFeedItem(supporterName, `tặng quà kích hoạt VẠN KIẾM QUY TÔNG (500 xu)! ⚔️`, faction);
    } else if (coins >= 200) {
      triggerHeroUpgrade(faction, supporterName, 3);
      triggerThaiCuc(faction, supporterName);
      battleCommentary.triggerGiftCommentary(supporterName, 'Vương Miện Hoàng Kim', 'Kim Khải Thần Tướng', faction);
      addLiveFeedItem(supporterName, `thăng cấp KIM KHẢI THẦN TƯỚNG + THÁI CỰC TRẬN (200 xu)! 👑`, faction);
    } else if (coins >= 50) {
      triggerHeroUpgrade(faction, supporterName, 2);
      battleCommentary.triggerGiftCommentary(supporterName, 'Nước Hoa Thiết Giáp', 'Thiết Giáp Kiếm Hiệp', faction);
      addLiveFeedItem(supporterName, `thăng cấp THIẾT GIÁP KIẾM HIỆP (50 xu)! 🛡️`, faction);
    } else {
      addOrUpdateFighter(faction, supporterName, 20);
      triggerDance(faction, supporterName);
      addLiveFeedItem(supporterName, `tặng Hoa Hồng tiếp sức! 🌸`, faction);
    }
  };

  const handleToggleAutoTest = () => {
    if (isAutoTesting) {
      if (autoTestTimerRef.current) clearInterval(autoTestTimerRef.current);
      setIsAutoTesting(false);
    } else {
      setIsAutoTesting(true);
      const gifts = [1, 50, 200, 500, 1000];
      autoTestTimerRef.current = setInterval(() => {
        const fac = Math.random() < 0.5 ? 'blue' : 'red';
        const randomCoin = gifts[Math.floor(Math.random() * gifts.length)];
        handleTestGift(randomCoin, fac);
      }, 2500);
    }
  };

  useEffect(() => {
    const handleTriggerDemo = (e) => {
      const gifts = [1, 50, 200, 500, 1000];
      const fac = Math.random() < 0.5 ? 'blue' : 'red';
      const randomCoin = gifts[Math.floor(Math.random() * gifts.length)];
      handleTestGift(randomCoin, fac);
    };

    window.addEventListener('battle-trigger-demo', handleTriggerDemo);

    const handleEmergencyStop = () => {
      battleCommentary.stopAll();
      battleVoiceEngine.stopAll();
      battleAudio.stopAll();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
    window.addEventListener('avalive_emergency_stop_all', handleEmergencyStop);

    return () => {
      window.removeEventListener('battle-trigger-demo', handleTriggerDemo);
      window.removeEventListener('avalive_emergency_stop_all', handleEmergencyStop);
      if (autoTestTimerRef.current) clearInterval(autoTestTimerRef.current);
    };
  }, []);

  // HÀM RENDER SÂN KHẤU LIVE SẠCH 100% (Khung Hình Không Chứa Bất Kỳ Nút Quản Trị Nào)
  const renderCleanStage = () => (
    <div 
      ref={containerRef}
      className={`relative w-full h-full min-h-[360px] overflow-hidden select-none font-sans ${
        !isDarkMode ? 'bg-slate-100 text-slate-900' : 'bg-[#0a0c14] text-white'
      }`}
    >
      {/* 2D Battlefield Interactive Canvas */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full absolute inset-0 z-0 block pointer-events-auto"
      />

      {/* Screen Hit Flash Effect */}
      {flashSide && (
        <div 
          className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-300 ${
            flashSide === 'blue' ? 'bg-blue-500/20' : 'bg-red-500/20'
          }`} 
        />
      )}

      {/* TOP HP BAR HUD - SLEEK & COMPACT (Không có nút bấm) */}
      <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 w-[95%] max-w-[560px] z-20 pointer-events-none">
        <div className="bg-black/80 backdrop-blur-md border border-white/15 rounded-xl px-2.5 py-1.5 sm:px-3.5 sm:py-2 shadow-2xl">
          {/* Game Title & VS Indicator */}
          <div className="flex items-center justify-between px-1 mb-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50 animate-pulse shrink-0" />
              <span className="text-[11px] sm:text-xs font-black tracking-wider text-blue-400 uppercase truncate">
                {config.blueName}
              </span>
            </div>
            <div className="text-[9px] sm:text-[10px] font-black tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30 uppercase shrink-0">
              ⚔️ {config.title}
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[11px] sm:text-xs font-black tracking-wider text-red-400 uppercase truncate">
                {config.redName}
              </span>
              <span className="w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-500/50 animate-pulse shrink-0" />
            </div>
          </div>

          {/* Symmetrical Dual HP Bar (Slim & Streamlined) */}
          <div className="flex items-center gap-1.5">
            {/* Blue Side */}
            <div className="flex-1 h-2.5 sm:h-3 bg-black/60 rounded-l-full overflow-hidden p-0.5 border border-blue-500/40">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 rounded-l-full transition-all duration-300 ml-auto shadow-inner"
                style={{ width: `${blueHpPct}%` }}
              />
            </div>

            {/* VS Badge */}
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-black font-black text-[8px] sm:text-[9px] flex items-center justify-center shadow-md shadow-orange-500/40 shrink-0 border border-white/40">
              VS
            </div>

            {/* Red Side */}
            <div className="flex-1 h-2.5 sm:h-3 bg-black/60 rounded-r-full overflow-hidden p-0.5 border border-red-500/40">
              <div 
                className="h-full bg-gradient-to-r from-rose-400 via-red-500 to-red-600 rounded-r-full transition-all duration-300 shadow-inner"
                style={{ width: `${redHpPct}%` }}
              />
            </div>
          </div>

          {/* HP Numbers */}
          <div className="flex justify-between items-center px-1 mt-0.5 text-[9px] sm:text-[10px] font-mono font-bold text-gray-300">
            <span className="text-blue-300">{gameState.hp.blue} / {gameState.maxHp} HP ({Math.round(blueHpPct)}%)</span>
            <span className="text-red-300">{gameState.hp.red} / {gameState.maxHp} HP ({Math.round(redHpPct)}%)</span>
          </div>
        </div>
      </div>

      {/* 1. TOP PLAYERS LEADERBOARD HUD (Ultra Transparent Glassmorphism - Nhìn xuyên thấu nền game 100%) */}
      {!isLeaderboardClosed && (
        <div 
          className={`absolute z-30 transition-all duration-100 pointer-events-auto select-none ${
            isLeaderboardMinimized ? 'w-8 overflow-hidden' : 'w-32 sm:w-36'
          }`}
          style={{
            top: `${leaderboardPos.y}px`,
            left: `${leaderboardPos.x}px`
          }}
        >
          <div className="bg-black/20 backdrop-blur-[2px] hover:bg-black/40 border border-white/10 hover:border-white/20 rounded-lg p-1 sm:p-1.5 shadow-xl text-white transition-all">
            <div 
              className="flex items-center justify-between text-[9px] sm:text-[10px] font-bold text-amber-300 mb-0.5 border-b border-white/10 pb-0.5 cursor-move"
              onMouseDown={(e) => handleBattleHudDragStart(e, 'leaderboard')}
              onTouchStart={(e) => handleBattleHudDragStart(e, 'leaderboard')}
              title="Kéo thả để di chuyển Bảng Xếp Hạng"
            >
              {!isLeaderboardMinimized && (
                <div className="flex items-center gap-1">
                  <Trophy size={10} className="text-amber-400 shrink-0" />
                  <span className="truncate drop-shadow">BXH Top</span>
                </div>
              )}
              <div className="flex items-center gap-0.5 ml-auto">
                <button
                  onClick={() => setIsLeaderboardMinimized(!isLeaderboardMinimized)}
                  className="p-0.5 rounded text-gray-300 hover:text-white hover:bg-white/20 transition-colors"
                  title={isLeaderboardMinimized ? "Mở rộng BXH" : "Thu nhỏ BXH"}
                >
                  <span className="text-[9px] font-bold">{isLeaderboardMinimized ? '🏆' : '−'}</span>
                </button>
                <button
                  onClick={() => setIsLeaderboardClosed(true)}
                  className="p-0.5 rounded text-gray-400 hover:text-red-400 hover:bg-white/20 transition-colors"
                  title="Ẩn BXH (Có thể bật lại trong cài đặt)"
                >
                  <span className="text-[8px] font-bold">✕</span>
                </button>
              </div>
            </div>

            {!isLeaderboardMinimized && (
              <div className="space-y-0.5 max-h-24 overflow-y-auto custom-scrollbar">
                {gameState.leaderboard.length === 0 ? (
                  <p className="text-[8px] text-gray-300 text-center py-1 italic">Chưa có</p>
                ) : (
                  gameState.leaderboard.slice(0, 3).map((player, idx) => (
                    <div key={player.userId + idx} className="flex items-center justify-between text-[8px] sm:text-[9px] bg-black/30 px-1 py-0.5 rounded border border-white/5">
                      <span className="flex items-center gap-0.5 font-medium truncate max-w-[55px] sm:max-w-[65px]">
                        <span className={idx === 0 ? 'text-amber-400 font-bold' : idx === 1 ? 'text-gray-300' : 'text-amber-600'}>
                          #{idx + 1}
                        </span>
                        <span className={player.faction === 'blue' ? 'text-blue-300 truncate font-semibold' : 'text-red-300 truncate font-semibold'}>
                          {player.nickname}
                        </span>
                      </span>
                      <span className="font-mono font-bold text-amber-400 shrink-0">{player.score}đ</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* BẢNG ĐIỆN QUÀ TẶNG & BUFF CHIẾN ĐẤU (Draggable / Resizable / Auto-scroll Glassmorphism Widget) */}
      <LiveGiftMarqueeTicker 
        mode="battle" 
        onOpenSettings={() => setShowGiftConfigModal(true)} 
      />

      {/* BOTTOM HINT BANNER (Responsive) */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/20 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium text-gray-200 z-20 pointer-events-none shadow-lg flex items-center gap-1.5 sm:gap-2 max-w-[92vw] truncate">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
        <span className="truncate">BL <strong className="text-blue-400 font-bold">"xanh"</strong> / <strong className="text-red-400 font-bold">"đỏ"</strong> Vào Trận & Hồi Sinh | Tặng Quà Nâng Cấp!</span>
      </div>

      {/* VICTORY CEREMONY / RESULTS PODIUM */}
      {gameState.winner && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-lg flex items-center justify-center z-40 animate-in zoom-in-95 duration-300 pointer-events-auto">
          <div className="text-center max-w-md w-full p-6 bg-[#161922] border border-amber-500/50 rounded-3xl shadow-2xl shadow-amber-500/20">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-black shadow-lg shadow-amber-500/50">
              <Trophy size={32} />
            </div>

            <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-1">
              🏆 CHIẾN THẮNG VẺ VANG!
            </h2>
            <p className={`text-lg font-bold mb-4 ${gameState.winner === 'blue' ? 'text-blue-400' : 'text-red-400'}`}>
              ĐỘI {gameState.winner === 'blue' ? config.blueName.toUpperCase() : config.redName.toUpperCase()} ĐÃ GIÀNH CHIẾN THẮNG!
            </p>

            {gameState.leaderboard.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-5 text-left">
                <p className="text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Crown size={12} /> MVP Trận Đấu
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">
                    {gameState.leaderboard[0].nickname}
                  </span>
                  <span className="font-mono font-black text-amber-400 text-sm">
                    {gameState.leaderboard[0].score} Điểm Sát Thương
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={resetMatch}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-sm rounded-xl shadow-lg shadow-amber-500/30 transition-all uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} /> Bắt đầu Trận Mới
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // NẾU LÀ POPOUT / OVERLAY CHO TIKTOK STUDIO / OBS -> CHỈ RENDER DUY NHẤT SÂN KHẤU SẠCH 100%
  if (isPopout) {
    return (
      <div 
        className="w-full h-full relative overflow-hidden bg-[#0a0c14] select-none font-sans flex items-center justify-center"
        onPointerDown={handleUserGesture}
      >
        <div 
          className={`relative flex flex-col overflow-hidden transition-all duration-300 ${
            aspectRatio === '9:16'
              ? 'h-full max-h-full aspect-[9/16] w-auto max-w-full mx-auto'
              : 'w-full max-w-[1200px] h-auto max-h-full aspect-[16/9] mx-auto'
          }`}
          style={aspectRatio === '9:16' ? { aspectRatio: '9 / 16', height: '100%', maxWidth: 'calc(100vh * 9 / 16)' } : { aspectRatio: '16 / 9', width: '100%' }}
        >
          {renderCleanStage()}
        </div>
      </div>
    );
  }

  // GIAO DIỆN PHẦN MỀM CHÍNH (STREAMER VIEW): SÂN KHẤU SẠCH 100%
  return (
    <div 
      className={`relative w-full h-full flex items-center justify-center p-2 sm:p-3 overflow-hidden font-sans select-none ${
        !isDarkMode ? 'bg-slate-200 text-slate-900' : 'bg-[#05070c] text-white'
      }`}
      onPointerDown={handleUserGesture}
    >
      <div 
        className={`relative flex flex-col overflow-hidden transition-all duration-300 ${
          aspectRatio === '9:16'
            ? 'h-full max-h-full aspect-[9/16] w-auto max-w-full mx-auto rounded-2xl md:rounded-3xl border border-purple-500/30 shadow-[0_0_50px_rgba(0,0,0,0.85)]'
            : 'w-full max-w-[1200px] h-auto max-h-full aspect-[16/9] rounded-2xl border border-purple-500/30 shadow-[0_0_50px_rgba(0,0,0,0.85)]'
        } ${!isDarkMode ? 'bg-white' : 'bg-[#0a0c14]'}`}
        style={aspectRatio === '9:16' ? { aspectRatio: '9 / 16', maxHeight: '100%', maxWidth: 'calc(100vh * 9 / 16)' } : {}}
      >
        {renderCleanStage()}
      </div>

      {/* MODAL CÀI ĐẶT BẢNG ĐIỆN & QUÀ TẶNG CHIẾN ĐẤU */}
      <LiveGiftConfigModal
        isOpen={showGiftConfigModal}
        onClose={() => setShowGiftConfigModal(false)}
        mode="battle"
      />
    </div>
  );
}
