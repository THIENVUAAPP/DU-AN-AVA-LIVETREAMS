import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Trophy, Volume2, VolumeX, Shield, Swords, Sparkles, 
  Crown, Play, Pause, RotateCcw, Settings, Flame, Zap, CheckCircle2 
} from 'lucide-react';
import { battleAudio } from './battleAudioEngine';
import { computeSkeletalJoints, render3DWarriorSkeleton, SKELETON_STATES } from '../../../lib/game3d/warrior3DSkeleton';

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
  externalLiveEvent = null 
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
      charScale: 1.0,
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
    fighters: { blue: [], red: [] }, // { userId, nickname, score, rank, x, y, targetX, targetY, bobPhase, pulseUntil, tier }
    dancers: { blue: [], red: [] },   // { userId, nickname, factionId, danceStyleId, startedAt, durationMs, x, y, scale, targetX, targetY, targetScale }
    bosses: [],                      // { id, factionId, x, y, targetX, spawnedAt }
    particles: [],                   // { x, y, vx, vy, size, color, isFlash, lifespanMs, spawnedAt }
    flyingSwords: [],                // { id, x, y, targetX, targetY, color, progress, spawnedAt }
    dragonBeasts: [],                // { id, factionId, x, y, targetX, progress, spawnedAt }
    taiChiShields: [],               // { id, factionId, x, y, radius, lifespanMs, spawnedAt }
    rAfId: null,
    lastTime: performance.now(),
    lastClashSoundTime: 0
  });

  const playSfx = useCallback((type) => {
    if (!config.soundEnabled || soundMuted) return;
    const vol = config.sfxVolume !== undefined ? config.sfxVolume : 0.7;
    if (type === 'join') battleAudio.playJoin(vol);
    else if (type === 'hit') battleAudio.playHit(vol);
    else if (type === 'aoe') battleAudio.playAoe(vol);
    else if (type === 'boss') battleAudio.playBoss(vol);
    else if (type === 'victory') battleAudio.playVictory(vol);
    else if (type === 'dance') battleAudio.playDanceBeat(vol);
    else if (type === 'van_kiem') battleAudio.playVanKiemQuyTong(vol);
    else if (type === 'giang_long') battleAudio.playGiangLongChuong(vol);
    else if (type === 'thai_cuc') battleAudio.playThaiCucKiemTran(vol);
    else if (type === 'level_up') battleAudio.playLevelUp(vol);
  }, [config.soundEnabled, config.sfxVolume, soundMuted]);

  // Recalculate formation slots for UNLIMITED fighters (hỗ trợ hàng ngàn người tham gia)
  const updateFormation = useCallback((canvasWidth, canvasHeight) => {
    const centerX = canvasWidth / 2;
    const baseY = canvasHeight * 0.62;

    ['blue', 'red'].forEach(factionId => {
      const dir = factionId === 'blue' ? -1 : 1;
      const list = engineRef.current.fighters[factionId];
      const count = list.length;
      if (count === 0) return;

      // Dynamic grid sizing based on total count
      // Scales seamlessly from 1 to 2,000+ fighters
      const dynamicRows = Math.min(12, Math.max(4, Math.ceil(Math.sqrt(count * 0.8))));
      const dynamicRowGap = Math.max(12, 24 - dynamicRows * 0.8);
      const dynamicStepX = Math.max(14, 26 - Math.min(12, count / 50));
      const frontGap = Math.max(38, 48 - Math.min(10, count / 100));

      list.forEach((f, rank) => {
        const row = rank % dynamicRows;
        const col = Math.floor(rank / dynamicRows);
        const rowStagger = (row % 2 === 1) ? (dynamicStepX * 0.5) : 0;
        
        f.targetX = centerX + dir * (frontGap + col * dynamicStepX + rowStagger);
        f.targetY = baseY + (row - (dynamicRows - 1) / 2) * dynamicRowGap;
        f.rank = rank;
      });
    });
  }, []);

  // Recalculate dance stage slots
  const updateDanceSlots = useCallback((canvasWidth, canvasHeight) => {
    const DANCE_SLOT_GAP_X = 85;
    const DANCE_STAGE_Y_RATIO = 0.46;
    const DANCE_STAGE_CENTER_GAP = 70;
    const centerX = canvasWidth / 2;
    const y = canvasHeight * DANCE_STAGE_Y_RATIO;

    ['blue', 'red'].forEach(factionId => {
      const dir = factionId === 'blue' ? -1 : 1;
      const list = engineRef.current.dancers[factionId];
      list.forEach((d, index) => {
        d.targetX = centerX + dir * (DANCE_STAGE_CENTER_GAP + index * DANCE_SLOT_GAP_X);
        d.targetY = y;
        d.targetScale = 2.8;
      });
    });
  }, []);

  // Action Dispatchers
  const addOrUpdateFighter = useCallback((factionId, nickname, pointsToAdd = 10, preferredGender = null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const userId = `user_${nickname.toLowerCase().replace(/\s+/g, '_')}`;
    const list = engineRef.current.fighters[factionId];
    let fighter = list.find(f => f.userId === userId);

    if (fighter) {
      fighter.score += pointsToAdd;
      fighter.pulseUntil = performance.now() + 600;
      if (preferredGender) fighter.gender = preferredGender;
    } else {
      const startX = factionId === 'blue' ? 0 : canvas.width;
      const startY = canvas.height * 0.62;
      
      // Auto balance male & female warriors across Blue & Red teams
      let gender = preferredGender;
      if (!gender) {
        const maleCount = list.filter(f => f.gender === 'male').length;
        const femaleCount = list.filter(f => f.gender === 'female').length;
        gender = maleCount <= femaleCount ? 'male' : 'female';
      }

      fighter = {
        userId,
        nickname,
        score: pointsToAdd,
        rank: list.length,
        gender,
        x: startX,
        y: startY,
        targetX: startX,
        targetY: startY,
        bobPhase: Math.random() * Math.PI * 2,
        pulseUntil: performance.now() + 600
      };
      list.push(fighter);
    }

    // Sort descending by score
    list.sort((a, b) => b.score - a.score);
    updateFormation(canvas.width, canvas.height);

    // Apply Damage / Healing
    setGameState(prev => {
      if (prev.winner) return prev;
      const oppFaction = factionId === 'blue' ? 'red' : 'blue';
      const newOppHp = Math.max(0, prev.hp[oppFaction] - pointsToAdd);
      const newOwnHp = Math.min(prev.maxHp, prev.hp[factionId] + Math.floor(pointsToAdd * 0.2));
      
      const newHp = { ...prev.hp, [oppFaction]: newOppHp, [factionId]: newOwnHp };
      let winner = null;
      if (newOppHp <= 0) {
        winner = factionId;
        playSfx('victory');
      }

      // Leaderboard calculation
      const allFighters = [
        ...engineRef.current.fighters.blue.map(f => ({ ...f, faction: 'blue' })),
        ...engineRef.current.fighters.red.map(f => ({ ...f, faction: 'red' }))
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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const userId = `user_${nickname.toLowerCase().replace(/\s+/g, '_')}`;
    const list = engineRef.current.dancers[factionId];
    if (list.length >= 6) return;

    const styleId = danceStyleId || Math.floor(Math.random() * 20) + 1;
    const existing = list.find(d => d.userId === userId);
    if (existing) {
      existing.danceStyleId = styleId;
      existing.durationMs = Math.max(existing.durationMs, durationMs);
      existing.startedAt = performance.now();
      return;
    }

    const formationFighter = engineRef.current.fighters[factionId].find(f => f.userId === userId);
    const startX = formationFighter ? formationFighter.x : (factionId === 'blue' ? 0 : canvas.width);
    const startY = formationFighter ? formationFighter.y : canvas.height * 0.62;

    list.push({
      userId,
      nickname,
      factionId,
      danceStyleId: styleId,
      startedAt: performance.now(),
      durationMs,
      x: startX,
      y: startY,
      scale: 1,
      targetX: startX,
      targetY: startY,
      targetScale: 2.8
    });

    updateDanceSlots(canvas.width, canvas.height);
    playSfx('dance');
  }, [updateDanceSlots, playSfx]);

  const triggerAoeSkill = useCallback((factionId, donorName = 'VIP Player', power = 80) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const oppFaction = factionId === 'blue' ? 'red' : 'blue';
    const oppColor = oppFaction === 'blue' ? config.blueColor : config.redColor;
    
    // Spawn particles on opponent side
    const isBlueOpp = oppFaction === 'blue';
    const xStart = isBlueOpp ? 0 : canvas.width * 0.5;
    const xRange = canvas.width * 0.5;

    for (let i = 0; i < 28; i++) {
      engineRef.current.particles.push({
        x: xStart + Math.random() * xRange,
        y: canvas.height * 0.28 + Math.random() * (canvas.height * 0.1),
        vx: (Math.random() - 0.5) * 40,
        vy: 100 + Math.random() * 80,
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

    engineRef.current.bosses.push({
      id: Date.now(),
      factionId,
      x: isBlue ? canvas.width * 0.05 : canvas.width * 0.95,
      y: canvas.height * 0.58,
      targetX: isBlue ? canvas.width * 0.92 : canvas.width * 0.08,
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
    const oppFighters = engineRef.current.fighters[oppFaction];
    
    // Target the highest ranking or leading enemy fighter directly
    const targetFighter = oppFighters.length > 0 ? oppFighters[0] : null;
    const targetX = targetFighter ? targetFighter.x : (isBlue ? canvas.width * 0.75 : canvas.width * 0.25);
    const targetY = targetFighter ? targetFighter.y : canvas.height * 0.62;

    for (let i = 0; i < 18; i++) {
      engineRef.current.flyingSwords.push({
        id: Date.now() + Math.random(),
        x: (isBlue ? canvas.width * 0.2 : canvas.width * 0.8) + (Math.random() - 0.5) * 140,
        y: canvas.height * 0.08 + (Math.random() - 0.5) * 60,
        targetX: targetX + (Math.random() - 0.5) * 60,
        targetY: targetY + (Math.random() - 0.5) * 50,
        color: isBlue ? '#38bdf8' : '#f87171',
        progress: -i * 0.04,
        speed: 2.2 + Math.random() * 0.8,
        spawnedAt: performance.now()
      });
    }

    addOrUpdateFighter(factionId, donorName, 180);
    playSfx('van_kiem');
    setGameState(prev => ({
      ...prev,
      recentSpotlight: { name: donorName, gift: 'Tuyệt Kỹ VẠN KIẾM QUY TÔNG (Khóa Mục Tiêu) ⚔️', faction: factionId }
    }));
    setTimeout(() => setGameState(prev => ({ ...prev, recentSpotlight: null })), 4500);
  }, [addOrUpdateFighter, playSfx]);

  const triggerGiangLong = useCallback((factionId, donorName = 'VIP Thần Long') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const isBlue = factionId === 'blue';
    const oppFaction = isBlue ? 'red' : 'blue';
    const oppFighters = engineRef.current.fighters[oppFaction];
    const targetFighter = oppFighters.length > 0 ? oppFighters[0] : null;

    engineRef.current.dragonBeasts.push({
      id: Date.now(),
      factionId,
      x: isBlue ? 0 : canvas.width,
      y: canvas.height * 0.55,
      targetX: targetFighter ? targetFighter.x : (isBlue ? canvas.width * 0.85 : canvas.width * 0.15),
      targetY: targetFighter ? targetFighter.y : canvas.height * 0.62,
      progress: 0,
      spawnedAt: performance.now()
    });

    addOrUpdateFighter(factionId, donorName, 350);
    triggerDance(factionId, donorName, 20, 9000);
    playSfx('giang_long');

    setGameState(prev => ({
      ...prev,
      recentSpotlight: { name: donorName, gift: 'Tuyệt Kỹ GIÁNG LONG THẬP BÁT CHƯỞNG 🐉', faction: factionId }
    }));
    setTimeout(() => setGameState(prev => ({ ...prev, recentSpotlight: null })), 5000);
  }, [addOrUpdateFighter, triggerDance, playSfx]);

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

    addOrUpdateFighter(factionId, donorName, 100);
    playSfx('thai_cuc');

    setGameState(prev => ({
      ...prev,
      recentSpotlight: { name: donorName, gift: 'Tuyệt Kỹ THÁI CỰC KIẾM TRẬN HỘ THÂN ☯️', faction: factionId }
    }));
    setTimeout(() => setGameState(prev => ({ ...prev, recentSpotlight: null })), 4000);
  }, [addOrUpdateFighter, playSfx]);

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
      fighter.pulseUntil = performance.now() + 2500;
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
        pulseUntil: performance.now() + 2500
      };
      list.unshift(fighter);
    }

    list.sort((a, b) => b.score - a.score);
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

  const resetMatch = useCallback(() => {
    engineRef.current.fighters = { blue: [], red: [] };
    engineRef.current.dancers = { blue: [], red: [] };
    engineRef.current.bosses = [];
    engineRef.current.particles = [];
    engineRef.current.flyingSwords = [];
    engineRef.current.dragonBeasts = [];
    engineRef.current.taiChiShields = [];
    setGameState({
      hp: { blue: config.maxHp, red: config.maxHp },
      maxHp: config.maxHp,
      isPaused: false,
      winner: null,
      countdown: null,
      leaderboard: [],
      recentSpotlight: null
    });
  }, [config.maxHp]);

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

      if (diamondCount >= 1000) {
        triggerGiangLong(assignedFaction, nickname);
        addLiveFeedItem(nickname, `tặng quà lớn triệu hồi GIÁNG LONG CHƯỞNG (${diamondCount} xu)! 🐉`, assignedFaction);
      } else if (diamondCount >= 500) {
        triggerVanKiem(assignedFaction, nickname);
        addLiveFeedItem(nickname, `tặng quà kích hoạt VẠN KIẾM QUY TÔNG (${diamondCount} xu)! ⚔️`, assignedFaction);
      } else if (diamondCount >= 200) {
        triggerHeroUpgrade(assignedFaction, nickname, 3);
        triggerThaiCuc(assignedFaction, nickname);
        addLiveFeedItem(nickname, `thăng cấp KIM KHẢI THẦN TƯỚNG + THÁI CỰC TRẬN (${diamondCount} xu)! 👑`, assignedFaction);
      } else if (diamondCount >= 50) {
        triggerHeroUpgrade(assignedFaction, nickname, 2);
        addLiveFeedItem(nickname, `thăng cấp THIẾT GIÁP KIẾM HIỆP (${diamondCount} xu)! 🛡️`, assignedFaction);
      } else {
        addOrUpdateFighter(assignedFaction, nickname, Math.max(20, diamondCount * 2));
        triggerDance(assignedFaction, nickname);
        addLiveFeedItem(nickname, `tặng quà tiếp sức & mở vũ điệu! 🎁`, assignedFaction);
      }
    }
  }, [externalLiveEvent, config.blueName, config.redName, addOrUpdateFighter, triggerDance, triggerAoeSkill, triggerBossSummon, triggerVanKiem, triggerGiangLong, triggerThaiCuc, triggerHeroUpgrade, resetMatch, playSfx, addLiveFeedItem]);

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.clientWidth || 1280;
        canvas.height = containerRef.current.clientHeight || 720;
        updateFormation(canvas.width, canvas.height);
        updateDanceSlots(canvas.width, canvas.height);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const renderLoop = (time) => {
      const dt = Math.min(0.05, (time - engineRef.current.lastTime) / 1000);
      engineRef.current.lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Battlefield Background Grid & Central Rift
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Ground plane glow
      const groundGrad = ctx.createLinearGradient(0, canvas.height * 0.4, 0, canvas.height);
      groundGrad.addColorStop(0, 'rgba(15, 18, 30, 0)');
      groundGrad.addColorStop(1, 'rgba(8, 10, 18, 0.85)');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, canvas.height * 0.4, canvas.width, canvas.height * 0.6);

      // Central divider energy line
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(centerX, canvas.height * 0.2);
      ctx.lineTo(centerX, canvas.height * 0.85);
      ctx.stroke();
      ctx.restore();

      // Faction Base Auras
      const blueBaseGrad = ctx.createRadialGradient(centerX - 180, canvas.height * 0.65, 10, centerX - 180, canvas.height * 0.65, 240);
      blueBaseGrad.addColorStop(0, 'rgba(47, 107, 255, 0.25)');
      blueBaseGrad.addColorStop(1, 'rgba(47, 107, 255, 0)');
      ctx.fillStyle = blueBaseGrad;
      ctx.fillRect(0, canvas.height * 0.35, centerX, canvas.height * 0.65);

      const redBaseGrad = ctx.createRadialGradient(centerX + 180, canvas.height * 0.65, 10, centerX + 180, canvas.height * 0.65, 240);
      redBaseGrad.addColorStop(0, 'rgba(255, 59, 78, 0.25)');
      redBaseGrad.addColorStop(1, 'rgba(255, 59, 78, 0)');
      ctx.fillStyle = redBaseGrad;
      ctx.fillRect(centerX, canvas.height * 0.35, centerX, canvas.height * 0.65);

      // 2. Update & Draw Fighters (Chiến binh Kiếm Hiệp 3D 5 Cấp Bậc Trang Bị Siêu Thực)
      const lerpFactor = Math.min(1, dt * 5);
      ['blue', 'red'].forEach(factionId => {
        const color = factionId === 'blue' ? config.blueColor : config.redColor;
        const fighters = engineRef.current.fighters[factionId];

        fighters.forEach(f => {
          f.x += (f.targetX - f.x) * lerpFactor;
          f.y += (f.targetY - f.y) * lerpFactor;
          f.bobPhase += dt * 4.5;

          // Calculate Character Tier based on donated score/gift value
          // Tier 1: Tân Binh (<100) | Tier 2: Thiết Giáp Hiệp (100-499) | Tier 3: Kim Khải Thần Tướng (500-1999) | Tier 4: Chiến Thần (2000-4999) | Tier 5: Chí Tôn (>=5000)
          const tier = f.score >= 5000 ? 5 : f.score >= 2000 ? 4 : f.score >= 500 ? 3 : f.score >= 100 ? 2 : 1;
          const isPulsing = performance.now() < f.pulseUntil;
          const bob = Math.sin(f.bobPhase) * (tier >= 3 ? 3.5 : 2.5);
          const stride = Math.sin(f.bobPhase); // Bước chân di chuyển nhịp nhàng
          const scale = (config.charScale || 1.8) * (isPulsing ? 1.3 : 1.0) * (tier >= 4 ? 1.35 : tier === 3 ? 1.2 : 1.0);
          const isTopRank = f.rank === 0;

          // Ground Aura / Tai Chi Ring for Tier 4 & 5
          ctx.save();
          if (tier >= 4) {
            // Spinning Tai Chi / Divine Energy Circle
            ctx.translate(f.x, f.y + 18 * scale);
            ctx.rotate(time * 0.002);
            ctx.beginPath();
            ctx.ellipse(0, 0, 22 * scale, 8 * scale, 0, 0, Math.PI * 2);
            ctx.strokeStyle = tier === 5 ? '#facc15' : color;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.fillStyle = tier === 5 ? 'rgba(250, 204, 21, 0.35)' : `${color}35`;
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.ellipse(f.x, f.y + 18 * scale, (14 + tier * 2) * scale, (5 + tier) * scale, 0, 0, Math.PI * 2);
            ctx.fillStyle = isPulsing ? 'rgba(255, 215, 0, 0.5)' : (tier === 3 ? 'rgba(250, 204, 21, 0.4)' : `${color}40`);
            ctx.fill();
          }
          ctx.restore();

          // Name tag, Title & Rank Badge
          ctx.save();
          ctx.font = `${isTopRank || tier >= 3 ? 'bold ' : ''}${tier >= 4 ? '11px' : '10px'} 'Be Vietnam Pro', sans-serif`;
          ctx.textAlign = 'center';
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = 'rgba(0,0,0,0.95)';
          
          let tierBadge = '';
          if (tier === 5) { tierBadge = '👑 [CHÍ TÔN] '; ctx.fillStyle = '#fef08a'; }
          else if (tier === 4) { tierBadge = '⚡ [CHIẾN THẦN] '; ctx.fillStyle = '#38bdf8'; }
          else if (tier === 3) { tierBadge = '✨ [THẦN TƯỚNG] '; ctx.fillStyle = '#fde047'; }
          else if (tier === 2) { tierBadge = '🛡️ '; ctx.fillStyle = '#cbd5e1'; }
          else { tierBadge = isTopRank ? '👑 ' : ''; ctx.fillStyle = '#ffffff'; }

          const nameText = f.nickname.length > 9 ? f.nickname.slice(0, 8) + '…' : f.nickname;
          ctx.strokeText(tierBadge + nameText, f.x, f.y - (24 + (tier >= 3 ? 6 : 0)) * scale);
          ctx.fillText(tierBadge + nameText, f.x, f.y - (24 + (tier >= 3 ? 6 : 0)) * scale);

          // Health & Score Mini Bar
          ctx.fillStyle = 'rgba(0,0,0,0.7)';
          ctx.fillRect(f.x - 14 * scale, f.y - (20 + (tier >= 3 ? 4 : 0)) * scale, 28 * scale, 3.5 * scale);
          ctx.fillStyle = tier >= 4 ? '#eab308' : tier === 3 ? '#fbbf24' : color;
          ctx.fillRect(f.x - 14 * scale, f.y - (20 + (tier >= 3 ? 4 : 0)) * scale, Math.min(28 * scale, Math.max(5 * scale, (f.score / 300) * 28 * scale)), 3.5 * scale);
          ctx.restore();

          // Draw 3D Warrior Body & Layered Armor
          ctx.save();
          ctx.translate(f.x, f.y + bob);
          ctx.scale(scale, scale);

          // 1.0 PERSISTENT LINGERING AURA (Hào Quang 3D Tỏa Sáng Kéo Dài 1-2 Giây)
          if (isPulsing || tier >= 4) {
            const auraScale = 1 + Math.sin(time * 0.006) * 0.15;
            ctx.save();
            ctx.shadowColor = tier === 5 ? '#facc15' : (tier === 4 ? '#38bdf8' : '#fbbf24');
            ctx.shadowBlur = 24;

            // Outer Divine Halo
            ctx.strokeStyle = tier === 5 ? 'rgba(250, 204, 21, 0.7)' : 'rgba(56, 189, 248, 0.7)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(0, 0, 26 * auraScale, 30 * auraScale, 0, 0, Math.PI * 2);
            ctx.stroke();

            // Inner Radiant Flame Glow
            ctx.fillStyle = tier === 5 ? 'rgba(250, 204, 21, 0.22)' : 'rgba(56, 189, 248, 0.18)';
            ctx.fill();
            ctx.restore();
          }

          // 1.1 FLUTTERING 3D CAPE / MANTLE (Áo Choàng Chiến Binh 3D Bay Trong Gió)
          const capeSway = Math.sin(time * 0.005 + (f.bobPhase || 0)) * 4;
          ctx.save();
          ctx.fillStyle = tier >= 3 ? '#991b1b' : (factionId === 'blue' ? '#1e3a8a' : '#7f1d1d');
          ctx.strokeStyle = tier >= 3 ? '#fbbf24' : '#ffffff';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-5, -4);
          ctx.lineTo(-10 + capeSway, 16);
          ctx.quadraticCurveTo(0 + capeSway, 19, 10 + capeSway, 16);
          ctx.lineTo(5, -4);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.restore();

          // 2.0 WINGS OF LIGHT (Cánh Hào Quang Thần Thánh 3D for Tier 3, 4, 5)
          if (tier >= 3) {
            const wingFlap = Math.sin(time * 0.008) * 7;
            ctx.save();
            ctx.shadowColor = tier === 5 ? '#fbbf24' : (tier === 4 ? '#38bdf8' : '#fde047');
            ctx.shadowBlur = 18;

            // Left Wing
            const leftWingGrad = ctx.createLinearGradient(-4, 0, -28, -14);
            leftWingGrad.addColorStop(0, tier === 5 ? '#facc15' : '#38bdf8');
            leftWingGrad.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
            ctx.fillStyle = leftWingGrad;
            ctx.strokeStyle = '#ffffff';
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
            rightWingGrad.addColorStop(0, tier === 5 ? '#facc15' : '#38bdf8');
            rightWingGrad.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
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

          // 2.1 3D SKELETAL WARRIOR (Nam & Nữ Có Xương Cử Động 360°, Khớp Tay Chân, Khuỷu Tay, Đầu Tóc)
          const fighterGender = f.gender || (f.rank % 2 === 0 ? 'male' : 'female');
          
          // Determine 360 rotation & combat animation state
          let animState = SKELETON_STATES.WALK;
          if (isPulsing) {
            animState = (tier >= 4 || f.rank === 1) ? SKELETON_STATES.ATTACK_SPIN : SKELETON_STATES.ATTACK_SLASH;
          }

          // Compute 3D yaw angle: Red faces left, Blue faces right, plus subtle dynamic combat stance oscillation
          const baseFacing = factionId === 'blue' ? (Math.PI * 0.45) : (-Math.PI * 0.45);
          const yawAngle = baseFacing + Math.sin(time * 0.003 + (f.bobPhase || 0)) * 0.25;

          const skeletonData = computeSkeletalJoints({
            gender: fighterGender,
            animState: animState,
            yawAngle: yawAngle,
            time: time,
            phase: f.bobPhase || 0,
            tier: tier
          });

          render3DWarriorSkeleton(ctx, skeletonData, {
            factionId,
            scale: 1.0,
            isPulsing,
            warriorImages: warriorImagesRef.current
          });

          // Orbiting Qi Swords for Tier 4 & 5
          if (tier >= 4) {
            const orbitSwords = tier === 5 ? 4 : 3;
            for (let s = 0; s < orbitSwords; s++) {
              const angle = time * 0.004 + (s * (Math.PI * 2 / orbitSwords));
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
      });

      // 3. Update & Draw Flying Swords (Tuyệt Kỹ VẠN KIẾM QUY TÔNG - Khóa Mục Tiêu & Nổ Hào Quang)
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

          // On Hit: Massive 3D Explosion & Lingering Aura
          if (sw.progress >= 1) {
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

      // 4. Update & Draw Dragon Beasts (Tuyệt Kỹ GIÁNG LONG THẬP BÁT CHƯỞNG)
      for (let i = engineRef.current.dragonBeasts.length - 1; i >= 0; i--) {
        const dBeast = engineRef.current.dragonBeasts[i];
        const isBlue = dBeast.factionId === 'blue';
        dBeast.x += (isBlue ? 1 : -1) * 340 * dt;
        const waveY = Math.sin((dBeast.x / canvas.width) * Math.PI * 4) * 28;

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

      // 3. Update & Draw Bosses
      for (let i = engineRef.current.bosses.length - 1; i >= 0; i--) {
        const boss = engineRef.current.bosses[i];
        const dir = boss.factionId === 'blue' ? 1 : -1;
        boss.x += dir * 160 * dt;

        ctx.save();
        ctx.translate(boss.x, boss.y);
        ctx.scale(boss.factionId === 'blue' ? 2.5 : -2.5, 2.5);

        // Boss Aura
        const bossColor = boss.factionId === 'blue' ? '#38bdf8' : '#fb7185';
        ctx.shadowColor = bossColor;
        ctx.shadowBlur = 24;
        ctx.fillStyle = bossColor;

        // Dragon / Tiger Shape
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

        if (performance.now() - boss.spawnedAt > 4500) {
          engineRef.current.bosses.splice(i, 1);
        }
      }

      // 4. Update & Draw Dancers (Vũ công đối kháng aerobic/sân khấu sôi động, có 2 chân nhảy đẹp mắt, KHÔNG nhào lộn)
      ['blue', 'red'].forEach(factionId => {
        const dancers = engineRef.current.dancers[factionId];
        const color = factionId === 'blue' ? config.blueColor : config.redColor;

        for (let i = dancers.length - 1; i >= 0; i--) {
          const d = dancers[i];
          d.x += (d.targetX - d.x) * lerpFactor;
          d.y += (d.targetY - d.y) * lerpFactor;
          d.scale += (d.targetScale - d.scale) * lerpFactor;

          const elapsedSec = (performance.now() - d.startedAt) / 1000;
          const style = DANCE_STYLES.find(s => s.id === d.danceStyleId) || DANCE_STYLES[0];

          // Compute smooth dance motions (nhún nhảy, đá chân nhịp nhàng, lắc hông, KHÔNG nhào lộn)
          const bounce = Math.sin(elapsedSec * style.bounceFreq * Math.PI * 2) * style.bounceAmp;
          const sway = Math.sin(elapsedSec * style.swayFreq * Math.PI * 2) * style.swayAmp;
          const armSwing = Math.sin(elapsedSec * style.armFreq * Math.PI * 2) * style.armAmp;
          const legKick = Math.sin(elapsedSec * (style.legFreq || 2.5) * Math.PI * 2) * (style.legAmp || 12);
          const jump = style.jumpFreq ? Math.max(0, Math.sin(elapsedSec * style.jumpFreq * Math.PI * 2)) * Math.min(style.jumpHeight, 14) : 0;

          ctx.save();
          ctx.translate(d.x + sway, d.y + bounce - jump);
          ctx.scale(d.scale, d.scale);

          // Golden stage podium glow
          ctx.beginPath();
          ctx.ellipse(0, 18, 18, 6, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
          ctx.fill();

          // Crown & Name on top
          ctx.font = 'bold 9px sans-serif';
          ctx.fillStyle = '#ffcc00';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          ctx.textAlign = 'center';
          const dName = d.nickname.length > 8 ? d.nickname.slice(0, 7) + '…' : d.nickname;
          ctx.strokeText('👑 ' + dName, 0, -22);
          ctx.fillText('👑 ' + dName, 0, -22);

          // Dancer 3D Skeletal Model with 360° Continuous Rotation & Articulated Limbs
          const dancerGender = d.gender || (d.danceStyleId % 2 === 0 ? 'female' : 'male');
          const dancerSkeleton = computeSkeletalJoints({
            gender: dancerGender,
            animState: SKELETON_STATES.DANCE,
            yawAngle: (elapsedSec * 0.9 + d.danceStyleId) % (Math.PI * 2), // 360-degree rotating dance stage
            time: elapsedSec * 1000,
            phase: d.danceStyleId,
            tier: 3
          });

          render3DWarriorSkeleton(ctx, dancerSkeleton, {
            factionId,
            scale: 1.0,
            isPulsing: false,
            warriorImages: warriorImagesRef.current
          });

          ctx.restore();

          if (performance.now() - d.startedAt >= d.durationMs) {
            dancers.splice(i, 1);
            updateDanceSlots(canvas.width, canvas.height);
          }
        }
      });

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

      engineRef.current.rAfId = requestAnimationFrame(renderLoop);
    };

    engineRef.current.rAfId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (engineRef.current.rAfId) cancelAnimationFrame(engineRef.current.rAfId);
    };
  }, [config, updateFormation, updateDanceSlots]);

  // Calculate HP Percentages
  const blueHpPct = Math.max(0, Math.min(100, (gameState.hp.blue / gameState.maxHp) * 100));
  const redHpPct = Math.max(0, Math.min(100, (gameState.hp.red / gameState.maxHp) * 100));

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none font-sans ${isPopout ? 'bg-[#0a0c14]' : 'bg-[#090b10]'}`}
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

      {/* TOP HP BAR HUD */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-[850px] z-20 pointer-events-none">
        <div className="bg-black/75 backdrop-blur-md border border-white/15 rounded-2xl p-2.5 shadow-2xl">
          {/* Game Title & VS Indicator */}
          <div className="flex items-center justify-between px-2 mb-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-md shadow-blue-500/50 animate-pulse" />
              <span className="text-xs font-black tracking-wider text-blue-400 uppercase">
                {config.blueName}
              </span>
            </div>
            <div className="text-[11px] font-black tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30 uppercase">
              ⚔️ {config.title}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wider text-red-400 uppercase">
                {config.redName}
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-md shadow-red-500/50 animate-pulse" />
            </div>
          </div>

          {/* Symmetrical Dual HP Bar */}
          <div className="flex items-center gap-2">
            {/* Blue Side */}
            <div className="flex-1 h-5 bg-black/60 rounded-l-full overflow-hidden p-0.5 border border-blue-500/40">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 rounded-l-full transition-all duration-300 ml-auto shadow-inner"
                style={{ width: `${blueHpPct}%` }}
              />
            </div>

            {/* VS Badge */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-black font-black text-[11px] flex items-center justify-center shadow-lg shadow-orange-500/40 shrink-0 border border-white/40">
              VS
            </div>

            {/* Red Side */}
            <div className="flex-1 h-5 bg-black/60 rounded-r-full overflow-hidden p-0.5 border border-red-500/40">
              <div 
                className="h-full bg-gradient-to-r from-rose-400 via-red-500 to-red-600 rounded-r-full transition-all duration-300 shadow-inner"
                style={{ width: `${redHpPct}%` }}
              />
            </div>
          </div>

          {/* HP Numbers */}
          <div className="flex justify-between items-center px-3 mt-1 text-[11px] font-mono font-bold text-gray-300">
            <span className="text-blue-300">{gameState.hp.blue} / {gameState.maxHp} HP ({Math.round(blueHpPct)}%)</span>
            <span className="text-red-300">{gameState.hp.red} / {gameState.maxHp} HP ({Math.round(redHpPct)}%)</span>
          </div>
        </div>
      </div>

      {/* TOP SUPPORTERS LEADERBOARD (Top Left) */}
      <div className="absolute top-28 left-4 w-48 bg-black/65 backdrop-blur-md border border-white/10 rounded-xl p-2.5 z-20 pointer-events-none shadow-xl">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-2 border-b border-white/10 pb-1.5">
          <Trophy size={13} className="text-amber-400" />
          <span>Bảng Xếp Hạng</span>
        </div>
        <div className="space-y-1.5">
          {gameState.leaderboard.length === 0 ? (
            <p className="text-[10px] text-gray-400 text-center py-2 italic">Chưa có người ủng hộ</p>
          ) : (
            gameState.leaderboard.map((player, idx) => (
              <div key={player.userId + idx} className="flex items-center justify-between text-[10px] bg-white/5 px-2 py-1 rounded">
                <span className="flex items-center gap-1 font-medium truncate max-w-[100px]">
                  <span className={idx === 0 ? 'text-amber-400 font-bold' : idx === 1 ? 'text-gray-300' : 'text-amber-600'}>
                    #{idx + 1}
                  </span>
                  <span className={player.faction === 'blue' ? 'text-blue-300' : 'text-red-300'}>
                    {player.nickname}
                  </span>
                </span>
                <span className="font-mono font-bold text-amber-400">{player.score}đ</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* PINNED GIFT & EQUIPMENT SHOWCASE HUD (Ghim Cây Trang Bị & Quà Tặng Trên Màn Hình Live) */}
      {config.showGiftHud !== false && (
        <div className={`absolute top-28 right-4 z-20 transition-all duration-300 pointer-events-auto ${
          isGiftHudMinimized ? 'w-10 overflow-hidden' : 'w-60'
        }`}>
          <div className="bg-black/85 backdrop-blur-xl border border-purple-500/40 rounded-2xl shadow-2xl overflow-hidden text-white">
            {/* HUD Header */}
            <div className="px-3 py-2 bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border-b border-purple-500/30 flex items-center justify-between">
              {!isGiftHudMinimized ? (
                <div className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-yellow-400 animate-spin" />
                  <span className="text-[11px] font-black uppercase tracking-wider text-purple-200">
                    CÂY TRANG BỊ & QUÀ
                  </span>
                </div>
              ) : null}
              <button
                onClick={() => setIsGiftHudMinimized(!isGiftHudMinimized)}
                className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors ml-auto"
                title={isGiftHudMinimized ? "Mở rộng bảng quà" : "Thu nhỏ bảng quà"}
              >
                <span className="text-xs font-bold">{isGiftHudMinimized ? '🎁' : '−'}</span>
              </button>
            </div>

            {/* HUD Items List */}
            {!isGiftHudMinimized && (
              <div className="p-2 space-y-1.5 max-h-60 overflow-y-auto">
                {(config.gifts || [
                  { id: 1, name: 'Hoa Hồng / Tim', icon: '🌸', coins: 1, tier: 'Tân Binh', buff: '+10 HP Xung Trận' },
                  { id: 2, name: 'Nước Hoa / Mũ', icon: '🛡️', coins: 50, tier: 'Thiết Giáp Hiệp', buff: '+150 HP + Giáp Bạc' },
                  { id: 3, name: 'Vương Miện / Cánh', icon: '👑', coins: 200, tier: 'Kim Khải Thần Tướng', buff: '+600 HP + Cánh Vàng' },
                  { id: 4, name: 'Xe Thể Thao / Sét', icon: '⚡', coins: 500, tier: 'Chiến Thần Vạn Kiếm', buff: '+1500 HP + Thần Binh' },
                  { id: 5, name: 'Thần Long / Vũ Trụ', icon: '🐉', coins: 1000, tier: 'Chí Tôn Thiên Tôn', buff: '+3500 HP + Rồng Thần' }
                ]).map((g, i) => (
                  <div 
                    key={g.id || i}
                    className="flex items-center justify-between p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{g.icon}</span>
                      <div>
                        <div className="text-[11px] font-bold text-gray-200">{g.tier || g.name}</div>
                        <div className="text-[9px] text-purple-300">{g.buff}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono font-black text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                        {g.coins} xu
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* DONOR SPOTLIGHT (Popup Banner) */}
      {gameState.recentSpotlight && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-600/90 via-orange-600/90 to-amber-700/90 text-white px-5 py-2.5 rounded-2xl shadow-2xl border border-amber-300/50 z-30 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-2.5">
            <Sparkles size={18} className="text-yellow-200 animate-spin" />
            <div>
              <p className="text-[10px] text-yellow-200 font-bold uppercase tracking-wider">Cảm ơn Nhà Tài Trợ Trợ Lực!</p>
              <p className="text-xs font-black">{gameState.recentSpotlight.name} đã tặng {gameState.recentSpotlight.gift}</p>
            </div>
          </div>
        </div>
      )}

      {/* LIVE COMMENT & GIFT STREAM (Bottom Left) */}
      <div className="absolute bottom-14 left-4 max-w-xs space-y-1.5 z-20 pointer-events-none">
        {liveFeed.map(item => (
          <div key={item.id} className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[11px] text-white shadow-xl animate-in slide-in-from-left-4 fade-in duration-200">
            <span className="font-bold text-yellow-300 truncate max-w-[90px]">{item.name}</span>:
            <span className={item.faction === 'blue' ? 'text-blue-300 font-semibold' : item.faction === 'red' ? 'text-red-300 font-semibold' : 'text-gray-200'}>
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {/* BOTTOM HINT BANNER */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full text-xs font-medium text-gray-200 z-20 pointer-events-none shadow-lg flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        Bình luận <span className="text-blue-400 font-bold">"xanh"</span> hoặc <span className="text-red-400 font-bold">"đỏ"</span> để vào trận & tặng quà trợ chiến!
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
}
