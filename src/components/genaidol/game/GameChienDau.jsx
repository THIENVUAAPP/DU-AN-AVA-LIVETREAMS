import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Trophy, Volume2, VolumeX, Shield, Swords, Sparkles, 
  Crown, Play, Pause, RotateCcw, Settings, Flame, Zap, CheckCircle2 
} from 'lucide-react';

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
      soundEnabled: true
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
  const [demoComment, setDemoComment] = useState('');
  const [flashSide, setFlashSide] = useState(null);

  // Refs for Game Engine Loop
  const engineRef = useRef({
    fighters: { blue: [], red: [] }, // { userId, nickname, score, rank, x, y, targetX, targetY, bobPhase, pulseUntil }
    dancers: { blue: [], red: [] },   // { userId, nickname, factionId, danceStyleId, startedAt, durationMs, x, y, scale, targetX, targetY, targetScale }
    bosses: [],                      // { id, factionId, x, y, targetX, spawnedAt }
    particles: [],                   // { x, y, vx, vy, size, color, isFlash, lifespanMs, spawnedAt }
    rAfId: null,
    lastTime: performance.now(),
    audio: {
      bgm: null,
      sfxJoin: null,
      sfxAoe: null,
      sfxBoss: null,
      sfxVictory: null
    }
  });

  // Initialize Audio
  useEffect(() => {
    const bgm = new Audio('/game-battle/audio/background-music.wav');
    bgm.loop = true;
    bgm.volume = config.soundEnabled && !soundMuted ? config.musicVolume : 0;

    const sfxJoin = new Audio('/game-battle/audio/sfx-join.wav');
    const sfxAoe = new Audio('/game-battle/audio/sfx-aoe.wav');
    const sfxBoss = new Audio('/game-battle/audio/sfx-boss.wav');
    const sfxVictory = new Audio('/game-battle/audio/victory-fanfare.wav');

    engineRef.current.audio = { bgm, sfxJoin, sfxAoe, sfxBoss, sfxVictory };

    // Try autoplay BGM if permitted
    const playPromise = bgm.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked until user interaction
      });
    }

    return () => {
      bgm.pause();
    };
  }, []);

  // Update Audio Volume when config or mute changes
  useEffect(() => {
    const { bgm } = engineRef.current.audio;
    if (bgm) {
      bgm.volume = config.soundEnabled && !soundMuted ? config.musicVolume : 0;
      if (config.soundEnabled && !soundMuted && bgm.paused) {
        bgm.play().catch(() => {});
      } else if ((!config.soundEnabled || soundMuted) && !bgm.paused) {
        bgm.pause();
      }
    }
  }, [config.soundEnabled, config.musicVolume, soundMuted]);

  const playSfx = useCallback((type) => {
    if (!config.soundEnabled || soundMuted) return;
    const audios = engineRef.current.audio;
    let sfx = null;
    if (type === 'join') sfx = audios.sfxJoin;
    else if (type === 'aoe') sfx = audios.sfxAoe;
    else if (type === 'boss') sfx = audios.sfxBoss;
    else if (type === 'victory') sfx = audios.sfxVictory;

    if (sfx) {
      try {
        sfx.currentTime = 0;
        sfx.volume = config.sfxVolume || 0.7;
        sfx.play().catch(() => {});
      } catch (e) {}
    }
  }, [config.soundEnabled, config.sfxVolume, soundMuted]);

  // Recalculate formation slots for fighters
  const updateFormation = useCallback((canvasWidth, canvasHeight) => {
    const FORMATION_ROWS = 4;
    const FORMATION_STEP_X = 24;
    const FORMATION_ROW_GAP = 22;
    const FORMATION_FRONT_GAP = 46;
    const centerX = canvasWidth / 2;
    const baseY = canvasHeight * 0.62;

    ['blue', 'red'].forEach(factionId => {
      const dir = factionId === 'blue' ? -1 : 1;
      const list = engineRef.current.fighters[factionId];
      list.forEach((f, rank) => {
        const row = rank % FORMATION_ROWS;
        const col = Math.floor(rank / FORMATION_ROWS);
        f.targetX = centerX + dir * (FORMATION_FRONT_GAP + col * FORMATION_STEP_X);
        f.targetY = baseY + (row - (FORMATION_ROWS - 1) / 2) * FORMATION_ROW_GAP;
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
  const addOrUpdateFighter = useCallback((factionId, nickname, pointsToAdd = 10) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const userId = `user_${nickname.toLowerCase().replace(/\s+/g, '_')}`;
    const list = engineRef.current.fighters[factionId];
    let fighter = list.find(f => f.userId === userId);

    if (fighter) {
      fighter.score += pointsToAdd;
      fighter.pulseUntil = performance.now() + 600;
    } else {
      const startX = factionId === 'blue' ? 0 : canvas.width;
      const startY = canvas.height * 0.62;
      fighter = {
        userId,
        nickname,
        score: pointsToAdd,
        rank: list.length,
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
  }, [updateDanceSlots]);

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

  const resetMatch = useCallback(() => {
    engineRef.current.fighters = { blue: [], red: [] };
    engineRef.current.dancers = { blue: [], red: [] };
    engineRef.current.bosses = [];
    engineRef.current.particles = [];
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

    if (type === 'COMMENT') {
      const commentText = (data.comment || '').toLowerCase().trim();
      const nickname = data.nickname || data.name || 'Khán giả';
      const score = data.score || 15;
      if (commentText.includes('xanh') || commentText.includes('blue') || commentText.includes('1')) {
        addOrUpdateFighter('blue', nickname, score);
      } else if (commentText.includes('đỏ') || commentText.includes('do') || commentText.includes('red') || commentText.includes('2')) {
        addOrUpdateFighter('red', nickname, score);
      }
    } else if (type === 'GIFT') {
      const nickname = data.nickname || data.name || 'VIP Supporter';
      const diamondCount = data.diamondCount || data.coins || 1;
      const assignedFaction = data.faction || (Math.random() < 0.5 ? 'blue' : 'red');

      if (diamondCount >= 1000) {
        triggerBossSummon(assignedFaction, nickname);
      } else if (diamondCount >= 100) {
        triggerAoeSkill(assignedFaction, nickname, diamondCount);
      } else {
        addOrUpdateFighter(assignedFaction, nickname, Math.max(20, diamondCount * 2));
        triggerDance(assignedFaction, nickname);
      }
    }
  }, [externalLiveEvent, addOrUpdateFighter, triggerDance, triggerAoeSkill, triggerBossSummon, resetMatch]);

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

      // 2. Update & Draw Fighters (Chiến binh dũng sĩ có chân bước đi & giáp trụ sắc nét)
      const lerpFactor = Math.min(1, dt * 5);
      ['blue', 'red'].forEach(factionId => {
        const color = factionId === 'blue' ? config.blueColor : config.redColor;
        const fighters = engineRef.current.fighters[factionId];

        fighters.forEach(f => {
          f.x += (f.targetX - f.x) * lerpFactor;
          f.y += (f.targetY - f.y) * lerpFactor;
          f.bobPhase += dt * 4.5;

          const isPulsing = performance.now() < f.pulseUntil;
          const bob = Math.sin(f.bobPhase) * 2.5;
          const stride = Math.sin(f.bobPhase); // Bước chân di chuyển nhịp nhàng
          const scale = (config.charScale || 1.0) * (isPulsing ? 1.35 : 1.0);
          const isTopRank = f.rank === 0;
          const weaponDir = factionId === 'blue' ? 1 : -1;

          // Shadow / Ground aura
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(f.x, f.y + 18 * scale, 14 * scale, 5 * scale, 0, 0, Math.PI * 2);
          ctx.fillStyle = isPulsing ? 'rgba(255, 215, 0, 0.5)' : `${color}40`;
          ctx.fill();

          // Name tag & Rank badge
          ctx.font = `${isTopRank ? 'bold ' : ''}10px 'Be Vietnam Pro', sans-serif`;
          ctx.textAlign = 'center';
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = 'rgba(0,0,0,0.9)';
          ctx.fillStyle = isTopRank ? '#ffcc00' : '#ffffff';
          const nameText = f.nickname.length > 10 ? f.nickname.slice(0, 9) + '…' : f.nickname;
          ctx.strokeText((isTopRank ? '👑 ' : '') + nameText, f.x, f.y - 22 * scale);
          ctx.fillText((isTopRank ? '👑 ' : '') + nameText, f.x, f.y - 22 * scale);

          // Health / Contribution Mini Bar
          ctx.fillStyle = 'rgba(0,0,0,0.6)';
          ctx.fillRect(f.x - 12 * scale, f.y - 18 * scale, 24 * scale, 3 * scale);
          ctx.fillStyle = isTopRank ? '#eab308' : color;
          ctx.fillRect(f.x - 12 * scale, f.y - 18 * scale, Math.min(24 * scale, Math.max(4 * scale, (f.score / 200) * 24 * scale)), 3 * scale);

          // Draw Character Body & Armor
          ctx.translate(f.x, f.y + bob);
          ctx.scale(scale, scale);

          // 2.1. LEGS & BOOTS (Đôi chân chiến binh bước đi chiến đấu nhịp nhàng)
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          
          // Left Leg (Chân trái)
          ctx.strokeStyle = factionId === 'blue' ? '#1e3a8a' : '#7f1d1d';
          ctx.beginPath();
          ctx.moveTo(-3, 6);
          ctx.lineTo(-4 + stride * 3.5, 14);
          ctx.stroke();
          // Left Boot (Giày giáp trái)
          ctx.fillStyle = isTopRank ? '#f59e0b' : '#334155';
          ctx.fillRect(-6 + stride * 3.5, 13, 5, 3.5);

          // Right Leg (Chân phải)
          ctx.strokeStyle = factionId === 'blue' ? '#1d4ed8' : '#991b1b';
          ctx.beginPath();
          ctx.moveTo(3, 6);
          ctx.lineTo(4 - stride * 3.5, 14);
          ctx.stroke();
          // Right Boot (Giày giáp phải)
          ctx.fillStyle = isTopRank ? '#fbbf24' : '#475569';
          ctx.fillRect(2 - stride * 3.5, 13, 5, 3.5);

          // 2.2. TORSO & CHEST ARMOR (Áo giáp chiến binh)
          ctx.shadowColor = isPulsing ? '#ffcc00' : color;
          ctx.shadowBlur = isPulsing ? 18 : 8;

          // Armor Plate Gradient
          const armorGrad = ctx.createLinearGradient(-6, -4, 6, 8);
          armorGrad.addColorStop(0, factionId === 'blue' ? '#3b82f6' : '#ef4444');
          armorGrad.addColorStop(1, factionId === 'blue' ? '#1d4ed8' : '#b91c1c');
          ctx.fillStyle = armorGrad;
          ctx.strokeStyle = isTopRank ? '#ffd700' : '#ffffff';
          ctx.lineWidth = 1.2;

          ctx.beginPath();
          ctx.moveTo(-5.5, 6);
          ctx.lineTo(5.5, 6);
          ctx.lineTo(4.5, -4);
          ctx.lineTo(-4.5, -4);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Golden Belt / Energy Core
          ctx.fillStyle = isTopRank ? '#facc15' : '#e2e8f0';
          ctx.fillRect(-4, 4, 8, 2);

          // Shoulder Pauldrons (Giáp vai chiến đấu)
          ctx.fillStyle = isTopRank ? '#eab308' : (factionId === 'blue' ? '#60a5fa' : '#f87171');
          ctx.beginPath();
          ctx.arc(-5.5, -3, 2.5, 0, Math.PI * 2);
          ctx.arc(5.5, -3, 2.5, 0, Math.PI * 2);
          ctx.fill();

          // 2.3. HELMET & VISOR (Mũ giáp & Kính phát quang)
          ctx.fillStyle = isTopRank ? '#ca8a04' : (factionId === 'blue' ? '#1e40af' : '#991b1b');
          ctx.beginPath();
          ctx.arc(0, -9, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Glowing Visor / Eyes
          ctx.fillStyle = isPulsing ? '#ffffff' : (factionId === 'blue' ? '#67e8f9' : '#fef08a');
          ctx.fillRect(-2.5, -9.5, 5, 1.8);

          // Helmet Plume / Crest (Lông vũ trên mũ giáp)
          ctx.fillStyle = isTopRank ? '#ef4444' : (factionId === 'blue' ? '#38bdf8' : '#fb7185');
          ctx.beginPath();
          ctx.moveTo(0, -14);
          ctx.lineTo(2.5, -10);
          ctx.lineTo(-2.5, -10);
          ctx.closePath();
          ctx.fill();

          // 2.4. WEAPONS & SHIELDS (Vũ khí kiếm khiên phát sáng)
          ctx.shadowBlur = 0;
          if (factionId === 'blue') {
            // Blue: Radiant Sword & Crest Shield
            // Shield on back/left hand
            ctx.fillStyle = '#1e3a8a';
            ctx.strokeStyle = '#60a5fa';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.ellipse(-7, 1, 3.5, 5.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Glowing Azure Sword in main hand
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(4, 2);
            ctx.lineTo(11, -7 - stride * 2);
            ctx.stroke();
            // Sword Guard
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(2, 4);
            ctx.lineTo(6, 0);
            ctx.stroke();
          } else {
            // Red: Flaming Battle Axe & Combat Shield
            // Combat Shield on right hand
            ctx.fillStyle = '#7f1d1d';
            ctx.strokeStyle = '#f87171';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.ellipse(7, 1, 3.5, 5.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Glowing Crimson Spear / Axe in main hand
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-4, 2);
            ctx.lineTo(-11, -7 + stride * 2);
            ctx.stroke();
            // Axe Blade Head
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(-11, -7 + stride * 2, 3.5, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        });
      });

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

          // Dancer Legs (2 chân nhún nhảy, đá chân thể dục aerobic)
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          
          // Left Leg
          ctx.strokeStyle = factionId === 'blue' ? '#2563eb' : '#dc2626';
          ctx.beginPath();
          ctx.moveTo(-3, 6);
          ctx.lineTo(-4 - legKick * 0.3, 16 - Math.max(0, legKick * 0.3));
          ctx.stroke();
          // Left Dance Shoe
          ctx.fillStyle = '#ffd700';
          ctx.fillRect(-6 - legKick * 0.3, 15 - Math.max(0, legKick * 0.3), 5, 3);

          // Right Leg
          ctx.strokeStyle = factionId === 'blue' ? '#3b82f6' : '#ef4444';
          ctx.beginPath();
          ctx.moveTo(3, 6);
          ctx.lineTo(4 + legKick * 0.3, 16 - Math.max(0, -legKick * 0.3));
          ctx.stroke();
          // Right Dance Shoe
          ctx.fillStyle = '#ffd700';
          ctx.fillRect(2 + legKick * 0.3, 15 - Math.max(0, -legKick * 0.3), 5, 3);

          // Dancer Body (Áo biểu diễn lấp lánh hào quang)
          ctx.shadowColor = '#ffcc00';
          ctx.shadowBlur = 18;
          ctx.fillStyle = color;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.2;

          ctx.beginPath();
          ctx.moveTo(-4.5, 6);
          ctx.lineTo(4.5, 6);
          ctx.lineTo(3.5, -4);
          ctx.lineTo(-3.5, -4);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Golden Belt
          ctx.fillStyle = '#ffcc00';
          ctx.fillRect(-4, 4, 8, 2);

          // Head & Hair
          ctx.beginPath();
          ctx.arc(0, -9, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Dancing Arms (Vung tay, vẫy chào theo điệu nhạc)
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(-3.5, -2);
          ctx.lineTo(-8 - armSwing * 0.25, 2 - armSwing * 0.35);
          ctx.moveTo(3.5, -2);
          ctx.lineTo(8 + armSwing * 0.25, 2 + armSwing * 0.35);
          ctx.stroke();

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

      {/* DONOR SPOTLIGHT (Popup Banner) */}
      {gameState.recentSpotlight && (
        <div className="absolute top-28 right-4 bg-gradient-to-r from-amber-600/90 to-orange-600/90 text-white px-4 py-2 rounded-xl shadow-2xl border border-amber-300/40 z-30 animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-yellow-200 animate-spin" />
            <div>
              <p className="text-[10px] text-yellow-200 font-bold uppercase">Cảm ơn Nhà Tài Trợ!</p>
              <p className="text-xs font-black">{gameState.recentSpotlight.name} đã tặng {gameState.recentSpotlight.gift}</p>
            </div>
          </div>
        </div>
      )}

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
