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

  // Recalculate formation slots with Collision-Free Distributed 1v1 Full-Screen Arena Architecture:
  // 1) Upper Dais Stage (Thư Hùng Đỉnh Cao): Blue Top 1 Champion vs Red Top 1 Champion stationed on the dual glowing dais rings (daisY = h * 0.32).
  // 2) Distributed 1v1 Pair-Duels across the entire arena: Blue #k vs Red #k stationed on dedicated spacious duel spots with guaranteed clearance.
  // 3) Strict Viewport Clamping: All positions clamped inside device screen boundaries so characters NEVER drift off-screen.
  // 4) Dynamic Proportional Scaling: Automatically shrinks both Tướng and Regular soldiers as battlefield player count increases.
  const updateFormation = useCallback((canvasWidth, canvasHeight) => {
    const centerX = canvasWidth / 2;
    const daisY = canvasHeight * 0.32; // Grand dais stage height with clear margin below top HUD

    const listBlue = engineRef.current.fighters.blue || [];
    const listRed = engineRef.current.fighters.red || [];

    const activeBlue = listBlue.filter(f => !f.isKnockedOut);
    const activeRed = listRed.filter(f => !f.isKnockedOut);

    // Sort by combat power / score descending so highest rank/VIP champions lead from the top
    activeBlue.sort((a, b) => (b.score || 0) - (a.score || 0));
    activeRed.sort((a, b) => (b.score || 0) - (a.score || 0));

    const totalActive = activeBlue.length + activeRed.length;
    const crowdScaleFactor = totalActive <= 2 ? 1.0 
      : totalActive <= 4 ? 0.88 
      : totalActive <= 6 ? 0.76 
      : totalActive <= 10 ? 0.64 
      : Math.max(0.46, 1.0 - (totalActive - 2) * 0.038);

    const pairCount = Math.min(activeBlue.length, activeRed.length);

    // Distributed 1v1 Battle Arena Spots spread across the entire viewport (strictly clamped)
    const duelSpots = [
      { x: canvasWidth * 0.28, y: canvasHeight * 0.48 }, // 1: Upper-Mid Left
      { x: canvasWidth * 0.72, y: canvasHeight * 0.48 }, // 2: Upper-Mid Right
      { x: canvasWidth * 0.50, y: canvasHeight * 0.60 }, // 3: Center Stage Core Duel
      { x: canvasWidth * 0.24, y: canvasHeight * 0.72 }, // 4: Lower-Mid Left
      { x: canvasWidth * 0.76, y: canvasHeight * 0.72 }, // 5: Lower-Mid Right
      { x: canvasWidth * 0.50, y: canvasHeight * 0.82 }, // 6: Center Bottom Arena
      { x: canvasWidth * 0.34, y: canvasHeight * 0.88 }, // 7: Lower Left Flank
      { x: canvasWidth * 0.66, y: canvasHeight * 0.88 }, // 8: Lower Right Flank
      { x: canvasWidth * 0.16, y: canvasHeight * 0.58 }, // 9: Far Left Mid
      { x: canvasWidth * 0.84, y: canvasHeight * 0.58 }, // 10: Far Right Mid
      { x: canvasWidth * 0.38, y: canvasHeight * 0.44 }, // 11: Mid-Top Left
      { x: canvasWidth * 0.62, y: canvasHeight * 0.44 }, // 12: Mid-Top Right
    ];

    // Helper: Safely clamp coordinates within device viewport
    const clampX = (x) => Math.max(50 * crowdScaleFactor, Math.min(canvasWidth - 50 * crowdScaleFactor, x));
    const clampY = (y) => Math.max(canvasHeight * 0.28, Math.min(canvasHeight * 0.88, y));

    // Pair up 1v1 Duels for all active fighters
    for (let p = 0; p < pairCount; p++) {
      const bFighter = activeBlue[p];
      const rFighter = activeRed[p];

      if (p === 0) {
        // PAIR #0: The Grand Peak Dais Duel (Thư Hùng Đỉnh Cao Tướng #1)
        const daisOffset = 75 * crowdScaleFactor;
        
        bFighter.isVipStage = true;
        bFighter.isDuelFront = true;
        bFighter.duelPairIdx = 0;
        bFighter.duelSpotX = centerX;
        bFighter.duelSpotY = daisY;
        bFighter.targetX = clampX(centerX - daisOffset);
        bFighter.targetY = daisY;

        rFighter.isVipStage = true;
        rFighter.isDuelFront = true;
        rFighter.duelPairIdx = 0;
        rFighter.duelSpotX = centerX;
        rFighter.duelSpotY = daisY;
        rFighter.targetX = clampX(centerX + daisOffset);
        rFighter.targetY = daisY;
      } else {
        // PAIRS #1...N: Distributed 1v1 Duels across the battlefield
        const spot = duelSpots[(p - 1) % duelSpots.length];
        const fighterSpacing = 30 * crowdScaleFactor;

        bFighter.isVipStage = false;
        bFighter.isDuelFront = true;
        bFighter.duelPairIdx = p;
        bFighter.duelSpotX = spot.x;
        bFighter.duelSpotY = spot.y;
        bFighter.targetX = clampX(spot.x - fighterSpacing);
        bFighter.targetY = clampY(spot.y);

        rFighter.isVipStage = false;
        rFighter.isDuelFront = true;
        rFighter.duelPairIdx = p;
        rFighter.duelSpotX = spot.x;
        rFighter.duelSpotY = spot.y;
        rFighter.targetX = clampX(spot.x + fighterSpacing);
        rFighter.targetY = clampY(spot.y);
      }
    }

    // Surplus Blue fighters stationed in Strategic Reserve Rally Zone (Left Area)
    for (let u = pairCount; u < activeBlue.length; u++) {
      const uFighter = activeBlue[u];
      const uIdx = u - pairCount;
      uFighter.isVipStage = false;
      uFighter.isDuelFront = false;
      uFighter.duelPairIdx = -1;
      uFighter.targetX = clampX(canvasWidth * 0.14);
      uFighter.targetY = clampY(canvasHeight * (0.50 + (uIdx % 4) * 0.11));
    }

    // Surplus Red fighters stationed in Strategic Reserve Rally Zone (Right Area)
    for (let u = pairCount; u < activeRed.length; u++) {
      const uFighter = activeRed[u];
      const uIdx = u - pairCount;
      uFighter.isVipStage = false;
      uFighter.isDuelFront = false;
      uFighter.duelPairIdx = -1;
      uFighter.targetX = clampX(canvasWidth * 0.86);
      uFighter.targetY = clampY(canvasHeight * (0.50 + (uIdx % 4) * 0.11));
    }
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
      const startX = factionId === 'blue' ? 45 : (w - 45);
      const startY = h * 0.60;
      
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

    list.sort((a, b) => b.score - a.score);
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
        : Math.max(0.46, 1.0 - (totalActive - 2) * 0.038);

      // Upper VIP Champions Circular Dais Rings (Ô Vòng Tròn Thư Hùng Đỉnh Cao cho Tướng VIP #1)
      ctx.save();
      const daisY = h * 0.32;
      const daisRadiusX = 75 * crowdScaleFactor;
      const daisRadiusY = 22 * crowdScaleFactor;
      const daisOffsetX = 75 * crowdScaleFactor;
      
      // Blue VIP Circular Dais
      ctx.beginPath();
      ctx.ellipse(centerX - daisOffsetX, daisY, daisRadiusX, daisRadiusY, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 18;
      ctx.stroke();

      // Inner Blue Dais Runic Ring
      ctx.beginPath();
      ctx.ellipse(centerX - daisOffsetX, daisY, daisRadiusX * 0.7, daisRadiusY * 0.7, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.55)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Red VIP Circular Dais
      ctx.beginPath();
      ctx.ellipse(centerX + daisOffsetX, daisY, daisRadiusX, daisRadiusY, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(244, 63, 94, 0.22)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 18;
      ctx.stroke();

      // Inner Red Dais Runic Ring
      ctx.beginPath();
      ctx.ellipse(centerX + daisOffsetX, daisY, daisRadiusX * 0.7, daisRadiusY * 0.7, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(254, 205, 211, 0.55)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();

      // 2. Update & Draw Fighters (Chiến binh Kiếm Hiệp 3D: Tướng VIP trên vòng tròn + Song đấu 1v1 phân bố toàn màn hình)
      const lerpFactor = Math.min(1, dt * 5.5);

      // Spawn sparks for active dueling pairs across the screen
      if (pairCount > 0 && Math.random() < 0.65) {
        const randPair = Math.floor(Math.random() * pairCount);
        const fPair = activeBlue[randPair];
        const clashX = fPair?.duelSpotX || (fPair?.x + 30);
        const clashY = fPair?.duelSpotY || fPair?.y || h * 0.5;

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

        if (time - (engineRef.current.lastClashSoundTime || 0) > 950) {
          engineRef.current.lastClashSoundTime = time;
          playSfx('hit');
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
        const targetX = f.targetX !== undefined ? f.targetX : (factionId === 'blue' ? centerX - 90 : centerX + 90);
        const targetY = f.targetY !== undefined ? f.targetY : (f.isVipStage ? daisY : h * 0.65);

        f.x += (targetX - f.x) * lerpFactor;
        f.y += (targetY - f.y) * lerpFactor;
        f.bobPhase += dt * 3.5;

        // Calculate Character Tier based on score
        const tier = f.score >= 5000 ? 5 : f.score >= 2000 ? 4 : f.score >= 500 ? 3 : f.score >= 100 ? 2 : 1;
        const isPulsing = performance.now() < f.pulseUntil;
        const isTopRank = f.rank === 0;

        // Scale: VIP Champions & Regular troops both scale proportionally with crowdScaleFactor
        let baseScale = 1.05 * crowdScaleFactor;
        if (f.isVipStage || tier >= 3 || isTopRank) {
          if (tier >= 5) baseScale = 2.2 * crowdScaleFactor;
          else if (tier === 4) baseScale = 1.9 * crowdScaleFactor;
          else baseScale = 1.6 * crowdScaleFactor;
        } else if (tier === 2) {
          baseScale = 1.25 * crowdScaleFactor;
        }

        const scale = baseScale * (isPulsing ? 1.12 : 1.0);

        // Ground shadow (sleek & natural)
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(f.x, f.y + 20 * scale, (12 + tier * 2) * scale, (4 + tier) * scale, 0, 0, Math.PI * 2);
        ctx.fillStyle = isPulsing ? 'rgba(250, 204, 21, 0.45)' : 'rgba(0, 0, 0, 0.35)';
        ctx.fill();
        ctx.restore();

        // Sacred Beast Mount / Celestial Dragon Energy Ring under VIP Champions (Thú cưỡi / Thần long cho Tướng VIP)
        if (f.isVipStage && tier >= 3) {
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
        const tagDist = (28 + (tier >= 3 ? 8 : 0)) * scale;
        const isVip = tier >= 3 || isTopRank || f.isVipStage;

        ctx.font = `${isVip ? 'bold 12px' : 'bold 10px'} 'Be Vietnam Pro', sans-serif`;
        ctx.textAlign = 'center';
        ctx.lineWidth = 2.8;
        ctx.strokeStyle = 'rgba(0,0,0,0.95)';
        
        let tierBadge = '';
        if (tier === 5) {
          tierBadge = '👑 [CHÍ TÔN] ';
          ctx.fillStyle = '#fef08a';
        } else if (tier === 4) {
          tierBadge = '⚡ [CHIẾN THẦN] ';
          ctx.fillStyle = '#38bdf8';
        } else if (tier === 3 || f.isVipStage) {
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

        // Individual Health Bar
        const barW = (isVip ? 38 : 24) * scale;
        const barH = 3.5 * scale;
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

        // Protective Barrier Aura (Hào Quang Bảo Vệ) for VIP Heroes / High Gifts
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.scale(scale, scale);

        if ((tier >= 3 || isPulsing || f.isVipStage) && !f.isKnockedOut) {
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

        // Wings of Light for Tier 3, 4, 5
        if (tier >= 3 && !f.isKnockedOut) {
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

        // 3D Articulated Skeletal Kinematics with Asymmetric Martial Arts Stances
        const fighterGender = f.gender || (f.rank % 2 === 0 ? 'male' : 'female');
        
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
          animState = factionId === 'blue' ? SKELETON_STATES.ATTACK_BLUE_CROSS : SKELETON_STATES.ATTACK_RED_CLEAVE;
        } else if (f.isVipStage) {
          if (hasVipDuel) {
            // Slower, grand martial arts duel on top dais
            const vipCycle = (time * 0.0016 + (f.rank || 0) * 1.5) % 4.0;
            if (factionId === 'blue') {
              animState = vipCycle < 1.6 ? SKELETON_STATES.ATTACK_BLUE_THRUST : (vipCycle < 2.8 ? SKELETON_STATES.DEFEND_PARRY : SKELETON_STATES.IDLE);
            } else {
              animState = vipCycle < 1.6 ? SKELETON_STATES.DEFEND_PARRY : (vipCycle < 2.8 ? SKELETON_STATES.ATTACK_RED_CLEAVE : SKELETON_STATES.IDLE);
            }
          } else {
            // VIP stands majestically on dais in commanding martial stance
            animState = isArrived ? SKELETON_STATES.IDLE : SKELETON_STATES.WALK;
          }
        } else if (f.isDuelFront && f.duelPairIdx !== undefined && f.duelPairIdx >= 0) {
          if (isArrived) {
            // Asymmetric combat rhythm: Blue and Red take turns attacking and parrying
            const pairOffset = (f.duelPairIdx || 0) * 1.4;
            const combatCycle = ((time * 0.0018) + pairOffset) % 4.0;

            if (factionId === 'blue') {
              if (combatCycle < 1.4) {
                animState = (f.duelPairIdx % 2 === 0) ? SKELETON_STATES.ATTACK_BLUE_THRUST : SKELETON_STATES.ATTACK_BLUE_CROSS;
              } else if (combatCycle < 2.0) {
                animState = SKELETON_STATES.IDLE;
              } else if (combatCycle < 3.4) {
                animState = SKELETON_STATES.DEFEND_PARRY;
              } else {
                animState = SKELETON_STATES.IDLE;
              }
            } else {
              // Red counters when Blue pauses
              if (combatCycle < 1.4) {
                animState = SKELETON_STATES.DEFEND_PARRY;
              } else if (combatCycle < 2.0) {
                animState = SKELETON_STATES.IDLE;
              } else if (combatCycle < 3.4) {
                animState = (f.duelPairIdx % 2 === 0) ? SKELETON_STATES.ATTACK_RED_CLEAVE : SKELETON_STATES.ATTACK_RED_SWEEP;
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

      engineRef.current.rAfId = requestAnimationFrame(renderLoop);
    };

    engineRef.current.rAfId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (engineRef.current.rAfId) cancelAnimationFrame(engineRef.current.rAfId);
    };
  }, [config, updateFormation]);

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

      {/* TOP HP BAR HUD - SLEEK & COMPACT (Ảnh 1) */}
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
