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
    fighters: { blue: [], red: [] }, // { userId, nickname, score, rank, x, y, targetX, targetY, bobPhase, pulseUntil, tier, currentHp, maxHp, isKnockedOut, knockoutTime, knockbackVx, revivedAt }
    dancers: { blue: [], red: [] },   // { userId, nickname, factionId, danceStyleId, startedAt, durationMs, x, y, scale, targetX, targetY, targetScale }
    bosses: [],                      // { id, factionId, x, y, targetX, spawnedAt }
    particles: [],                   // { x, y, vx, vy, size, color, isFlash, lifespanMs, spawnedAt }
    flyingSwords: [],                // { id, factionId, x, y, targetX, targetY, color, progress, speed, spawnedAt }
    dragonBeasts: [],                // { id, factionId, x, y, targetX, progress, spawnedAt }
    taiChiShields: [],               // { id, factionId, x, y, radius, maxRadius, lifespanMs, spawnedAt }
    floatingTexts: [],               // { id, text, x, y, vy, color, font, spawnedAt, lifespanMs }
    w: 1280,
    h: 720,
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

  // Recalculate formation slots with 2-Tier Center Arena Architecture (Zero Overlap):
  // 1) Upper VIP Champions Stage: Tier 3, 4, 5 stand prominently with x3.0-3.4 scale and wide clearance.
  // 2) Lower Army Battlefield: Tier 1, 2 troops gather with ample row/column spacing and dedicated reserve lane for fallen fighters.
  const updateFormation = useCallback((canvasWidth, canvasHeight) => {
    const centerX = canvasWidth / 2;
    const vipStageY = canvasHeight * 0.38;
    const armyStageY = canvasHeight * 0.68;

    ['blue', 'red'].forEach(factionId => {
      const dir = factionId === 'blue' ? -1 : 1;
      const list = engineRef.current.fighters[factionId];
      if (!list || list.length === 0) return;

      // Classify VIPs vs Regular Troops
      const vips = [];
      const activeRegulars = [];
      const fallenRegulars = [];

      list.forEach((f, idx) => {
        f.rank = idx;
        const tier = f.score >= 5000 ? 5 : f.score >= 2000 ? 4 : f.score >= 500 ? 3 : f.score >= 100 ? 2 : 1;
        if (tier >= 3 || idx === 0) {
          vips.push(f);
        } else if (f.isKnockedOut) {
          fallenRegulars.push(f);
        } else {
          activeRegulars.push(f);
        }
      });

      // Position VIPs in Upper Center Champions Arena (Tập trung ở giữa màn hình)
      const vipStepX = 85;
      const vipStepY = 55;
      const vipFrontGap = 80;

      vips.forEach((f, vIdx) => {
        const vRow = vIdx % 2;
        const vCol = Math.floor(vIdx / 2);
        f.isVipStage = true;
        f.targetX = centerX + dir * (vipFrontGap + vCol * vipStepX);
        f.targetY = vipStageY + (vRow === 0 ? -18 : 22);
      });

      // Position Active Regular Army in Lower Center Battlefield
      const regStepX = 58;
      const regStepY = 50;
      const frontGap = 70;
      const maxCols = 3;

      activeRegulars.forEach((f, rIdx) => {
        const row = rIdx % 2;
        const col = Math.floor(rIdx / 2);
        const rowStagger = (row % 2 === 1) ? 22 : 0;
        f.isVipStage = false;
        f.targetX = centerX + dir * (frontGap + col * regStepX + rowStagger);
        f.targetY = armyStageY + (row === 0 ? -22 : 22);
      });

      // Position Fallen Regulars neatly in the back reserve rank (Không đè lên quân đang chiến đấu)
      fallenRegulars.forEach((f, fIdx) => {
        const col = fIdx % 4;
        const row = Math.floor(fIdx / 4);
        f.isVipStage = false;
        f.targetX = centerX + dir * (150 + col * 38);
        f.targetY = armyStageY + 65 + row * 26;
      });
    });
  }, []);

  // Recalculate dance stage slots (Tập trung tuyệt đối ở sân khấu trung tâm)
  const updateDanceSlots = useCallback((canvasWidth, canvasHeight) => {
    const DANCE_SLOT_GAP_X = 52;
    const DANCE_STAGE_Y_RATIO = 0.44;
    const DANCE_STAGE_CENTER_GAP = 55;
    const centerX = canvasWidth / 2;
    const y = canvasHeight * DANCE_STAGE_Y_RATIO;

    ['blue', 'red'].forEach(factionId => {
      const dir = factionId === 'blue' ? -1 : 1;
      const list = engineRef.current.dancers[factionId];
      list.forEach((d, index) => {
        d.targetX = centerX + dir * (DANCE_STAGE_CENTER_GAP + index * DANCE_SLOT_GAP_X);
        d.targetY = y;
        d.targetScale = 2.0;
      });
    });
  }, []);

  // Action Dispatchers: Add / Update / Revive Fighters
  const addOrUpdateFighter = useCallback((factionId, nickname, pointsToAdd = 10, preferredGender = null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const userId = `user_${nickname.toLowerCase().replace(/\s+/g, '_')}`;
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
      fighter.pulseUntil = performance.now() + 600;
      fighter.maxHp = calcMaxHp(fighter.score);
      if (preferredGender) fighter.gender = preferredGender;

      // Respawn Mechanic (Hồi Sinh ngay khi Bình Luận hoặc Tặng Quà)
      if (wasKnockedOut) {
        fighter.isKnockedOut = false;
        fighter.currentHp = fighter.maxHp;
        fighter.revivedAt = performance.now();
        fighter.knockbackVx = 0;

        // Holy Divine Light Beam Particles
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
        // Normal HP boost
        fighter.currentHp = Math.min(fighter.maxHp, (fighter.currentHp || fighter.maxHp) + Math.floor(pointsToAdd * 0.4));
      }
    } else {
      const centerX = (engineRef.current.w || canvas.width) / 2;
      const startX = factionId === 'blue' ? (centerX - 60) : (centerX + 60);
      const startY = (engineRef.current.h || canvas.height) * 0.68;
      
      // Auto balance male & female warriors across Blue & Red teams
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
        bobPhase: Math.random() * Math.PI * 2,
        pulseUntil: performance.now() + 600,
        maxHp: initialHp,
        currentHp: initialHp,
        isKnockedOut: false,
        knockoutTime: 0,
        knockbackVx: 0,
        revivedAt: 0
      };
      list.push(fighter);
    }

    // Sort descending by score
    list.sort((a, b) => b.score - a.score);
    updateFormation(engineRef.current.w || canvas.width, engineRef.current.h || canvas.height);

    // Apply Damage / Healing to Team Total HP
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

    const centerX = (engineRef.current.w || canvas.width) / 2;
    const dir = factionId === 'blue' ? -1 : 1;
    const slotIdx = list.length;
    const startX = centerX + dir * (55 + slotIdx * 52);
    const startY = (engineRef.current.h || canvas.height) * 0.44;

    list.push({
      userId,
      nickname,
      factionId,
      danceStyleId: styleId,
      startedAt: performance.now(),
      durationMs,
      x: startX,
      y: startY,
      scale: 2.0,
      targetX: startX,
      targetY: startY,
      targetScale: 2.0
    });

    updateDanceSlots(engineRef.current.w || canvas.width, engineRef.current.h || canvas.height);
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
        factionId,
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
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = containerRef.current.clientWidth || window.innerWidth || 1280;
        const h = containerRef.current.clientHeight || window.innerHeight || 720;
        engineRef.current.w = w;
        engineRef.current.h = h;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        updateFormation(w, h);
        updateDanceSlots(w, h);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const renderLoop = (time) => {
      const dt = Math.min(0.05, (time - engineRef.current.lastTime) / 1000);
      engineRef.current.lastTime = time;

      const w = engineRef.current.w || (canvas.width / (window.devicePixelRatio || 1));
      const h = engineRef.current.h || (canvas.height / (window.devicePixelRatio || 1));

      ctx.clearRect(0, 0, w, h);

      // 1. Draw Battlefield Background Grid & Central Rift
      const centerX = w / 2;
      const centerY = h / 2;

      // Ground plane glow
      const groundGrad = ctx.createLinearGradient(0, h * 0.4, 0, h);
      groundGrad.addColorStop(0, 'rgba(15, 18, 30, 0)');
      groundGrad.addColorStop(1, 'rgba(8, 10, 18, 0.85)');
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

      // Upper VIP Champions Duel Dais (Bệ đài Thư Hùng Đỉnh Cao cho Tướng VIP ngay trung tâm)
      ctx.save();
      // Blue VIP Dais
      ctx.beginPath();
      ctx.ellipse(centerX - 95, h * 0.38, 85, 20, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Red VIP Dais
      ctx.beginPath();
      ctx.ellipse(centerX + 95, h * 0.38, 85, 20, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(244, 63, 94, 0.15)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // 2. Update & Draw Fighters (Chiến binh Kiếm Hiệp 3D: Tướng VIP to gấp 3 lần ở tầng trên + Đội hình thoáng đãng)
      const lerpFactor = Math.min(1, dt * 5);
      
      // Real-time Active Sword Clash Simulation between Blue and Red frontlines
      const activeBlue = engineRef.current.fighters.blue.filter(f => !f.isKnockedOut);
      const activeRed = engineRef.current.fighters.red.filter(f => !f.isKnockedOut);
      const hasDuel = activeBlue.length > 0 && activeRed.length > 0;
      const duelCycle = (time * 0.001) % 2.5; // 2.5s combat rhythm
      const isClashing = hasDuel && duelCycle < 1.0;

      // Spawn Sword Clash Sparks at the center collision point
      if (isClashing && Math.random() < 0.4) {
        const clashY = h * 0.65;
        for (let sp = 0; sp < 3; sp++) {
          engineRef.current.particles.push({
            x: centerX + (Math.random() - 0.5) * 14,
            y: clashY + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 90,
            vy: (Math.random() - 0.5) * 90 - 20,
            size: 2.5 + Math.random() * 2.5,
            color: Math.random() < 0.5 ? '#fde047' : '#ffffff',
            isFlash: true,
            lifespanMs: 380,
            spawnedAt: performance.now()
          });
        }

        if (time - (engineRef.current.lastClashSoundTime || 0) > 1300) {
          engineRef.current.lastClashSoundTime = time;
          playSfx('hit');
        }
      }

      // Collect and sort all fighters for back-to-front rendering
      const allFighters = [
        ...engineRef.current.fighters.blue.map(f => ({ ...f, factionId: 'blue' })),
        ...engineRef.current.fighters.red.map(f => ({ ...f, factionId: 'red' }))
      ].sort((a, b) => {
        // Render lower stage before VIPs, and sort by y
        if (a.isVipStage !== b.isVipStage) return a.isVipStage ? 1 : -1;
        return a.y - b.y;
      });

      allFighters.forEach(f => {
        const factionId = f.factionId;
        const color = factionId === 'blue' ? config.blueColor : config.redColor;
        const dir = factionId === 'blue' ? -1 : 1;

        // Dynamic combat lunge if this is the front duelist
        const isFrontDuelist = (factionId === 'blue' && activeBlue[0] && f.userId === activeBlue[0].userId) ||
                               (factionId === 'red' && activeRed[0] && f.userId === activeRed[0].userId);
        
        let targetX = f.targetX;
        if (isClashing && isFrontDuelist) {
          targetX = centerX + dir * 28;
        }

        f.x += (targetX - f.x) * lerpFactor;
        f.y += (f.targetY - f.y) * lerpFactor;
        f.bobPhase += dt * 4.5;

        // Calculate Character Tier based on score
        const tier = f.score >= 5000 ? 5 : f.score >= 2000 ? 4 : f.score >= 500 ? 3 : f.score >= 100 ? 2 : 1;
        const isPulsing = performance.now() < f.pulseUntil;
        const isTopRank = f.rank === 0;

        // VIP Scale: 3.0x - 3.4x (To gấp 3 lần nhân vật thường theo yêu cầu!)
        // Regular Scale: 1.65x - 1.85x (To rõ như người thật, không phải dấu chấm!)
        let baseScale = 1.65;
        if (tier >= 5) baseScale = 3.4;
        else if (tier === 4) baseScale = 3.1;
        else if (tier === 3 || isTopRank) baseScale = 2.6;
        else if (tier === 2) baseScale = 1.85;

        const scale = baseScale * (isPulsing ? 1.15 : 1.0);

        // Physics for Knockout
        if (f.isKnockedOut) {
          f.knockbackVx = (f.knockbackVx || 0) * 0.94;
          f.x += (f.knockbackVx || 0) * dt;
        }

        // Ground shadow (sleek & natural)
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(f.x, f.y + 20 * scale, (12 + tier * 2) * scale, (4 + tier) * scale, 0, 0, Math.PI * 2);
        ctx.fillStyle = f.isKnockedOut ? 'rgba(0, 0, 0, 0.22)' : (isPulsing ? 'rgba(250, 204, 21, 0.45)' : 'rgba(0, 0, 0, 0.35)');
        ctx.fill();
        ctx.restore();

        // Name tag, Title & Health Bar (Tạo khoảng cách thông thoáng, không che khuất nhân vật)
        ctx.save();
        const tagDist = (28 + (tier >= 3 ? 6 : 0)) * scale;
        const isVip = tier >= 3 || isTopRank;

        ctx.font = `${isVip ? 'bold 12px' : 'bold 10px'} 'Be Vietnam Pro', sans-serif`;
        ctx.textAlign = 'center';
        ctx.lineWidth = 2.8;
        ctx.strokeStyle = 'rgba(0,0,0,0.95)';
        
        let tierBadge = '';
        if (f.isKnockedOut) {
          tierBadge = '✝️ ';
          ctx.fillStyle = '#f87171';
        } else if (tier === 5) {
          tierBadge = '👑 [CHÍ TÔN] ';
          ctx.fillStyle = '#fef08a';
        } else if (tier === 4) {
          tierBadge = '⚡ [CHIẾN THẦN] ';
          ctx.fillStyle = '#38bdf8';
        } else if (tier === 3) {
          tierBadge = '✨ [THẦN TƯỚNG] ';
          ctx.fillStyle = '#fde047';
        } else if (tier === 2) {
          tierBadge = '🛡️ ';
          ctx.fillStyle = '#cbd5e1';
        } else {
          tierBadge = isTopRank ? '👑 ' : '';
          ctx.fillStyle = '#ffffff';
        }

        const nameText = f.nickname.length > 9 ? f.nickname.slice(0, 8) + '…' : f.nickname;
        ctx.strokeText(tierBadge + nameText, f.x, f.y - tagDist);
        ctx.fillText(tierBadge + nameText, f.x, f.y - tagDist);

        // Individual Health Bar (Máu riêng của từng chiến sĩ)
        const barW = (isVip ? 36 : 24) * scale;
        const barH = 3.5 * scale;
        const barX = f.x - barW / 2;
        const barY = f.y - (tagDist - 5 * scale);

        ctx.fillStyle = 'rgba(0,0,0,0.75)';
        ctx.fillRect(barX, barY, barW, barH);
        
        if (!f.isKnockedOut) {
          const currentHp = f.currentHp !== undefined ? f.currentHp : (f.maxHp || 280);
          const maxHp = f.maxHp || 280;
          const hpRatio = Math.max(0, Math.min(1, currentHp / maxHp));
          ctx.fillStyle = hpRatio > 0.5 ? (tier >= 4 ? '#eab308' : color) : '#ef4444';
          ctx.fillRect(barX, barY, barW * hpRatio, barH);
        }
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

        // Draw 3D Articulated Warrior Body & Skeletal Limbs
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.scale(scale, scale);

        if (f.isKnockedOut) {
          ctx.globalAlpha = 0.55;
        }

        // Persistent Lingering Aura for Tier 4 & 5
        if ((isPulsing || tier >= 4) && !f.isKnockedOut) {
          const auraScale = 1 + Math.sin(time * 0.004) * 0.15;
          ctx.save();
          ctx.shadowColor = tier === 5 ? '#facc15' : (tier === 4 ? '#38bdf8' : '#fbbf24');
          ctx.shadowBlur = 24;

          ctx.strokeStyle = tier === 5 ? 'rgba(250, 204, 21, 0.7)' : 'rgba(56, 189, 248, 0.7)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(0, 0, 26 * auraScale, 30 * auraScale, 0, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = tier === 5 ? 'rgba(250, 204, 21, 0.22)' : 'rgba(56, 189, 248, 0.18)';
          ctx.fill();
          ctx.restore();
        }

        // Wings of Light for Tier 3, 4, 5
        if (tier >= 3 && !f.isKnockedOut) {
          const wingFlap = Math.sin(time * 0.005) * 6;
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

        // 3D Articulated Skeletal Kinematics
        const fighterGender = f.gender || (f.rank % 2 === 0 ? 'male' : 'female');
        
        let animState = SKELETON_STATES.WALK;
        if (f.isKnockedOut) {
          animState = SKELETON_STATES.DEFEATED;
        } else if (f.revivedAt && (performance.now() - f.revivedAt < 1800)) {
          animState = SKELETON_STATES.REVIVE;
        } else if (isPulsing) {
          animState = (tier >= 4 || isTopRank) ? SKELETON_STATES.ATTACK_SPIN : SKELETON_STATES.ATTACK_SLASH;
        } else if (isClashing && isFrontDuelist) {
          animState = SKELETON_STATES.ATTACK_SLASH;
        }

        // Compute 3D facing angle
        const baseFacing = factionId === 'blue' ? (Math.PI * 0.45) : (-Math.PI * 0.45);
        const yawAngle = baseFacing + Math.sin(time * 0.002 + (f.bobPhase || 0)) * 0.18;

        const skeletonData = computeSkeletalJoints({
          gender: fighterGender,
          animState: animState,
          yawAngle: yawAngle,
          time: time,
          phase: f.bobPhase || 0,
          tier: tier,
          animSpeed: config.animSpeed || 0.55
        });

        render3DWarriorSkeleton(ctx, skeletonData, {
          factionId,
          scale: 1.0,
          isPulsing,
          warriorImages: warriorImagesRef.current
        });

        // Orbiting Qi Swords for Tier 4 & 5
        if (tier >= 4 && !f.isKnockedOut) {
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
            yawAngle: (elapsedSec * 0.7 + d.danceStyleId) % (Math.PI * 2), // 360-degree rotating dance stage
            time: elapsedSec * 1000,
            phase: d.danceStyleId,
            tier: 3,
            animSpeed: config.animSpeed || 0.55
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
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Blue Side */}
            <div className="flex-1 h-4 sm:h-5 bg-black/60 rounded-l-full overflow-hidden p-0.5 border border-blue-500/40">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 rounded-l-full transition-all duration-300 ml-auto shadow-inner"
                style={{ width: `${blueHpPct}%` }}
              />
            </div>

            {/* VS Badge */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-black font-black text-[10px] sm:text-[11px] flex items-center justify-center shadow-lg shadow-orange-500/40 shrink-0 border border-white/40">
              VS
            </div>

            {/* Red Side */}
            <div className="flex-1 h-4 sm:h-5 bg-black/60 rounded-r-full overflow-hidden p-0.5 border border-red-500/40">
              <div 
                className="h-full bg-gradient-to-r from-rose-400 via-red-500 to-red-600 rounded-r-full transition-all duration-300 shadow-inner"
                style={{ width: `${redHpPct}%` }}
              />
            </div>
          </div>

          {/* HP Numbers */}
          <div className="flex justify-between items-center px-2 sm:px-3 mt-1 text-[10px] sm:text-[11px] font-mono font-bold text-gray-300">
            <span className="text-blue-300">{gameState.hp.blue} / {gameState.maxHp} HP ({Math.round(blueHpPct)}%)</span>
            <span className="text-red-300">{gameState.hp.red} / {gameState.maxHp} HP ({Math.round(redHpPct)}%)</span>
          </div>
        </div>
      </div>

      {/* TOP SUPPORTERS LEADERBOARD (Top Left - Responsive) */}
      <div className="absolute top-20 sm:top-28 left-2 sm:left-4 w-36 sm:w-48 bg-black/75 backdrop-blur-md border border-white/15 rounded-xl p-2 sm:p-2.5 z-20 pointer-events-none shadow-xl">
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-amber-300 mb-1.5 border-b border-white/10 pb-1">
          <Trophy size={13} className="text-amber-400 shrink-0" />
          <span>Bảng Xếp Hạng</span>
        </div>
        <div className="space-y-1">
          {gameState.leaderboard.length === 0 ? (
            <p className="text-[9px] sm:text-[10px] text-gray-400 text-center py-1.5 italic">Chưa có người ủng hộ</p>
          ) : (
            gameState.leaderboard.map((player, idx) => (
              <div key={player.userId + idx} className="flex items-center justify-between text-[9px] sm:text-[10px] bg-white/5 px-1.5 py-0.5 sm:py-1 rounded">
                <span className="flex items-center gap-1 font-medium truncate max-w-[80px] sm:max-w-[100px]">
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

      {/* PINNED GIFT & EQUIPMENT SHOWCASE HUD (Top Right - Responsive) */}
      {config.showGiftHud !== false && (
        <div className={`absolute top-20 sm:top-28 right-2 sm:right-4 z-20 transition-all duration-300 pointer-events-auto ${
          isGiftHudMinimized ? 'w-9 sm:w-10 overflow-hidden' : 'w-48 sm:w-60'
        }`}>
          <div className="bg-black/85 backdrop-blur-xl border border-purple-500/40 rounded-2xl shadow-2xl overflow-hidden text-white">
            {/* HUD Header */}
            <div className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border-b border-purple-500/30 flex items-center justify-between">
              {!isGiftHudMinimized ? (
                <div className="flex items-center gap-1.5">
                  <Sparkles size={13} className="text-yellow-400 animate-spin" />
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-purple-200">
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
              <div className="p-1.5 sm:p-2 space-y-1 sm:space-y-1.5 max-h-52 sm:max-h-60 overflow-y-auto">
                {(config.gifts || [
                  { id: 1, name: 'Hoa Hồng / Tim', icon: '🌸', coins: 1, tier: 'Tân Binh', buff: '+10 HP Xung Trận' },
                  { id: 2, name: 'Nước Hoa / Mũ', icon: '🛡️', coins: 50, tier: 'Thiết Giáp Hiệp', buff: '+150 HP + Giáp Bạc' },
                  { id: 3, name: 'Vương Miện / Cánh', icon: '👑', coins: 200, tier: 'Kim Khải Thần Tướng', buff: '+600 HP + Cánh Vàng' },
                  { id: 4, name: 'Xe Thể Thao / Sét', icon: '⚡', coins: 500, tier: 'Chiến Thần Vạn Kiếm', buff: '+1500 HP + Thần Binh' },
                  { id: 5, name: 'Thần Long / Vũ Trụ', icon: '🐉', coins: 1000, tier: 'Chí Tôn Thiên Tôn', buff: '+3500 HP + Rồng Thần' }
                ]).map((g, i) => (
                  <div 
                    key={g.id || i}
                    className="flex items-center justify-between p-1 sm:p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-xs"
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="text-sm sm:text-base">{g.icon}</span>
                      <div>
                        <div className="text-[10px] sm:text-[11px] font-bold text-gray-200">{g.tier || g.name}</div>
                        <div className="text-[8px] sm:text-[9px] text-purple-300">{g.buff}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[9px] sm:text-[10px] font-mono font-black text-amber-400 bg-amber-500/10 px-1 sm:px-1.5 py-0.5 rounded border border-amber-500/20">
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
        <div className="absolute top-20 sm:top-28 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-600/95 via-orange-600/95 to-amber-700/95 text-white px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-2xl shadow-2xl border border-amber-300/50 z-30 animate-in fade-in zoom-in-95 duration-200 max-w-[90vw]">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <Sparkles size={16} className="text-yellow-200 animate-spin shrink-0" />
            <div>
              <p className="text-[9px] sm:text-[10px] text-yellow-200 font-bold uppercase tracking-wider">Cảm ơn Nhà Tài Trợ Trợ Lực!</p>
              <p className="text-[11px] sm:text-xs font-black truncate">{gameState.recentSpotlight.name} đã tặng {gameState.recentSpotlight.gift}</p>
            </div>
          </div>
        </div>
      )}

      {/* LIVE COMMENT & GIFT STREAM (Bottom Left - Responsive) */}
      <div className="absolute bottom-12 sm:bottom-14 left-2 sm:left-4 max-w-[190px] sm:max-w-xs space-y-1 sm:space-y-1.5 z-20 pointer-events-none">
        {liveFeed.map(item => (
          <div key={item.id} className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-white/10 text-[10px] sm:text-[11px] text-white shadow-xl animate-in slide-in-from-left-4 fade-in duration-200">
            <span className="font-bold text-yellow-300 truncate max-w-[75px] sm:max-w-[90px]">{item.name}</span>:
            <span className={item.faction === 'blue' ? 'text-blue-300 font-semibold' : item.faction === 'red' ? 'text-red-300 font-semibold' : 'text-gray-200'}>
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {/* BOTTOM HINT BANNER (Responsive) */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/20 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium text-gray-200 z-20 pointer-events-none shadow-lg flex items-center gap-1.5 sm:gap-2 max-w-[92vw] truncate">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
        <span className="truncate">BL <strong className="text-blue-400 font-bold">"xanh"</strong> / <strong className="text-red-400 font-bold">"đỏ"</strong> Vào Trận & Hồi Sinh | Tặng Quà Nâng Cấp!</span>
      </div>

      {/* QUICK LIVE SPEED & AUDIO CONTROLS (Bottom Right - Responsive) */}
      <div className="absolute bottom-3 sm:bottom-4 right-2 sm:right-4 z-20 flex items-center gap-1.5 sm:gap-2.5 bg-black/85 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-2xl border border-white/15 shadow-2xl text-white pointer-events-auto">
        <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] text-amber-300 font-bold">
          <span>⚡</span>
          <input
            type="range"
            min="0.2"
            max="1.5"
            step="0.05"
            value={config.animSpeed || 0.55}
            onChange={(e) => setConfig(prev => ({ ...prev, animSpeed: parseFloat(e.target.value) }))}
            className="w-12 sm:w-16 h-1.5 accent-amber-400 cursor-pointer"
            title={`Tốc độ cử động: ${(config.animSpeed || 0.55).toFixed(2)}x`}
          />
          <span className="font-mono text-[9px] sm:text-[10px] text-gray-300 w-6 sm:w-7">{((config.animSpeed || 0.55)).toFixed(1)}x</span>
        </div>

        <div className="w-[1px] h-3.5 bg-white/20" />

        <button
          onClick={() => setSoundMuted(!soundMuted)}
          className="p-1 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
          title={soundMuted ? "Bật âm thanh" : "Tắt âm thanh"}
        >
          {soundMuted ? <VolumeX size={14} className="text-red-400" /> : <Volume2 size={14} className="text-emerald-400" />}
        </button>

        <button
          onClick={resetMatch}
          className="p-1 rounded-lg hover:bg-white/10 text-gray-300 hover:text-amber-400 transition-colors"
          title="Làm mới trận đấu"
        >
          <RotateCcw size={14} />
        </button>
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
