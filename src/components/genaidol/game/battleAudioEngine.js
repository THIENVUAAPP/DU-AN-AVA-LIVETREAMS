// Melodic & Studio-Grade Web Audio Engine for TikTok LIVE Battle Game
// Zero-noise, Zero-buzzing, Pure Harmonic Musical Tones + Dedicated BGM & MP3 Engine

let audioCtx = null;
let bgmAudioElement = null;
let isBgmPlaying = false;
let bgmLoopTimer = null;
let isDucked = false;
let currentBgmVolume = 0.5;
let currentSfxVolume = 0.85;
let currentVoiceVolume = 1.0;
let isSfxMuted = false;
let isVoiceMuted = false;
let currentBgmTrack = 'epic_synth'; // 'epic_synth' | 'war_horns' | 'edm_live' | 'custom_upload'
let customBgmUrl = null;

// Khôi phục cài đặt lưu trữ từ trước nếu có
if (typeof window !== 'undefined') {
  try {
    const savedBgmVol = localStorage.getItem('battle_bgm_volume');
    if (savedBgmVol !== null) currentBgmVolume = parseFloat(savedBgmVol) || 0.5;
    const savedSfxVol = localStorage.getItem('battle_sfx_volume');
    if (savedSfxVol !== null) currentSfxVolume = parseFloat(savedSfxVol) || 0.85;
    const savedVoiceVol = localStorage.getItem('battle_voice_volume');
    if (savedVoiceVol !== null) currentVoiceVolume = parseFloat(savedVoiceVol) || 1.0;
    isSfxMuted = false;
    isVoiceMuted = false;
  } catch (e) {}
}

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Helper to create a warm, smooth musical tone (sine + harmonic overtone)
function playHarmonicTone(ctx, freq, startTime, duration, gainValue = 0.3, master) {
  if (!ctx || isSfxMuted) return;
  // Fundamental
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(freq, startTime);
  gain1.gain.setValueAtTime(0, startTime);
  gain1.gain.linearRampToValueAtTime(gainValue, startTime + 0.02);
  gain1.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  // 2nd Harmonic (sweetness)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(freq * 2, startTime);
  gain2.gain.setValueAtTime(0, startTime);
  gain2.gain.linearRampToValueAtTime(gainValue * 0.25, startTime + 0.02);
  gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.7);

  osc1.connect(gain1);
  osc2.connect(gain2);
  gain1.connect(master);
  gain2.connect(master);

  osc1.start(startTime);
  osc1.stop(startTime + duration + 0.05);
  osc2.start(startTime);
  osc2.stop(startTime + duration + 0.05);
}

// Synthesized Epic War BGM Loop Generator (100% offline, crystal clear harmonic chords)
function playSynthBgmPattern(type, volume) {
  if (!isBgmPlaying) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const master = ctx.createGain();
  const effVol = (isDucked ? volume * 0.3 : volume) * 0.22;
  master.gain.setValueAtTime(effVol, now);
  master.connect(ctx.destination);

  if (type === 'war_horns') {
    // Battle Horns & War Chords: D minor epic progression (D -> F -> C -> G)
    const chords = [
      [146.83, 220.00, 293.66, 349.23], // Dm
      [174.61, 220.00, 261.63, 349.23], // F
      [130.81, 196.00, 261.63, 329.63], // C
      [98.00, 146.83, 196.00, 246.94]   // G
    ];
    chords.forEach((chord, i) => {
      chord.forEach(freq => {
        if (!isBgmPlaying) return;
        playHarmonicTone(ctx, freq, now + i * 1.5, 1.4, 0.28, master);
      });
    });
  } else if (type === 'edm_live') {
    // Upbeat EDM Live Pulse Bass: A Minor energetic rhythm
    const bassNotes = [110, 110, 130.81, 146.83, 110, 110, 164.81, 146.83];
    bassNotes.forEach((freq, idx) => {
      if (!isBgmPlaying) return;
      playHarmonicTone(ctx, freq, now + idx * 0.4, 0.35, 0.35, master);
      if (idx % 2 === 0) {
        playHarmonicTone(ctx, freq * 4, now + idx * 0.4, 0.15, 0.15, master);
      }
    });
  } else {
    // Epic Synth Battle (Default): Harmonic Asian Cinematic Pentatonic
    const notes = [
      [220, 329.63, 440], 
      [261.63, 392.00, 523.25], 
      [293.66, 440, 587.33], 
      [349.23, 523.25, 698.46]
    ];
    notes.forEach((chord, i) => {
      chord.forEach(freq => {
        if (!isBgmPlaying) return;
        playHarmonicTone(ctx, freq, now + i * 1.25, 1.2, 0.3, master);
      });
    });
  }
}

export const battleAudio = {
  // SFX 1. Tham chiến (Kèn Chuông Xung Trận)
  playJoin(volume = null) {
    if (isSfxMuted) return;
    const vol = volume !== null ? volume : currentSfxVolume;
    if (vol <= 0.001) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(vol * 0.4, now);
    masterGain.connect(ctx.destination);

    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      playHarmonicTone(ctx, freq, now + i * 0.07, 0.4, 0.45, masterGain);
    });
  },

  // SFX 2. Va chạm Gươm Đao / Đòn Đánh
  playHit(volume = null) {
    if (isSfxMuted) return;
    const vol = volume !== null ? volume : currentSfxVolume;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(vol * 0.45, now);
    masterGain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1600, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.12);

    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.14);

    playHarmonicTone(ctx, 1200, now + 0.02, 0.18, 0.25, masterGain);
  },

  // SFX 3. Bão Sét / Kỹ Năng AoE
  playAoe(volume = null) {
    if (isSfxMuted) return;
    const vol = volume !== null ? volume : currentSfxVolume;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(vol * 0.5, now);
    masterGain.connect(ctx.destination);

    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, i) => {
      playHarmonicTone(ctx, freq, now + i * 0.05, 0.5, 0.35, masterGain);
    });
  },

  // SFX 4. Trùm / Xuất hiện Chiến Tướng
  playBoss(volume = null) {
    if (isSfxMuted) return;
    const vol = volume !== null ? volume : currentSfxVolume;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(vol * 0.6, now);
    masterGain.connect(ctx.destination);

    const notes = [130.81, 164.81, 196.00, 261.63];
    notes.forEach((freq) => {
      playHarmonicTone(ctx, freq, now, 0.8, 0.5, masterGain);
    });
  },

  // SFX 5. Chiến thắng Khải Hoàn
  playVictory(volume = null) {
    if (isSfxMuted) return;
    const vol = volume !== null ? volume : currentSfxVolume;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(vol * 0.5, now);
    masterGain.connect(ctx.destination);

    const victoryNotes = [
      { f: 523.25, t: 0.0, d: 0.3 },
      { f: 523.25, t: 0.2, d: 0.3 },
      { f: 523.25, t: 0.4, d: 0.3 },
      { f: 659.25, t: 0.6, d: 0.5 },
      { f: 783.99, t: 0.9, d: 0.4 },
      { f: 1046.50, t: 1.2, d: 0.9 }
    ];
    victoryNotes.forEach(n => {
      playHarmonicTone(ctx, n.f, now + n.t, n.d, 0.4, masterGain);
    });
  },

  // SFX 6. Vũ Điệu Âm Nhạc
  playDanceBeat(volume = null) {
    if (isSfxMuted) return;
    const vol = volume !== null ? volume : currentSfxVolume;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(vol * 0.4, now);
    masterGain.connect(ctx.destination);

    const danceNotes = [440, 523.25, 659.25, 523.25, 783.99];
    danceNotes.forEach((freq, idx) => {
      playHarmonicTone(ctx, freq, now + idx * 0.12, 0.25, 0.35, masterGain);
    });
  },

  // SFX 7. VẠN KIẾM QUY TÔNG
  playVanKiemQuyTong(volume = null) {
    if (isSfxMuted) return;
    const vol = volume !== null ? volume : currentSfxVolume;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(vol * 0.55, now);
    masterGain.connect(ctx.destination);

    const swordPitches = [880, 1108.73, 1318.51, 1567.98, 1760, 2093, 2349.32];
    swordPitches.forEach((freq, i) => {
      const startTime = now + i * 0.06;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 0.8, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.6, startTime + 0.18);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.4, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(startTime);
      osc.stop(startTime + 0.23);
    });

    setTimeout(() => {
      if (isSfxMuted) return;
      const strikeCtx = getAudioContext();
      if (!strikeCtx) return;
      const t = strikeCtx.currentTime;
      playHarmonicTone(strikeCtx, 1046.50, t, 0.6, 0.5, masterGain);
      playHarmonicTone(strikeCtx, 2093.00, t + 0.05, 0.4, 0.35, masterGain);
    }, 450);
  },

  // SFX 8. GIÁNG LONG THẬP BÁT CHƯỞNG
  playGiangLongChuong(volume = null) {
    if (isSfxMuted) return;
    const vol = volume !== null ? volume : currentSfxVolume;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(vol * 0.65, now);
    masterGain.connect(ctx.destination);

    const roarTones = [110, 164.81, 220, 329.63, 440];
    roarTones.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.linearRampToValueAtTime(freq * 1.4, now + 0.3);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.6, now + 0.8);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.45 / (idx + 1), now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.95);
    });

    playHarmonicTone(ctx, 523.25, now + 0.25, 0.6, 0.5, masterGain);
    playHarmonicTone(ctx, 783.99, now + 0.4, 0.5, 0.4, masterGain);
  },

  // SFX 9. THÁI CỰC KIẾM TRẬN
  playThaiCucKiemTran(volume = null) {
    if (isSfxMuted) return;
    const vol = volume !== null ? volume : currentSfxVolume;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(vol * 0.55, now);
    masterGain.connect(ctx.destination);

    const zenPitches = [659.25, 880, 1046.50, 1318.51];
    zenPitches.forEach((freq, i) => {
      playHarmonicTone(ctx, freq, now + i * 0.08, 0.8, 0.4, masterGain);
    });
  },

  // SFX 10. Nâng cấp Trang bị & Thăng Cấp Thần Binh
  playLevelUp(volume = null) {
    if (isSfxMuted) return;
    const vol = volume !== null ? volume : currentSfxVolume;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(vol * 0.6, now);
    masterGain.connect(ctx.destination);

    const arpeggio = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];
    arpeggio.forEach((freq, idx) => {
      playHarmonicTone(ctx, freq, now + idx * 0.06, 0.45, 0.45, masterGain);
    });
  },

  // SFX 11. LỤC MẠCH THẦN KIẾM (Laser Kiếm Khí Vô Hình Xuyên Phá)
  playLucMachThanKiem(volume = null) {
    if (isSfxMuted) return;
    const vol = volume !== null ? volume : currentSfxVolume;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(vol * 0.65, now);
    masterGain.connect(ctx.destination);

    const beamPitches = [880, 1174.66, 1318.51, 1567.98, 1760, 2093.00];
    beamPitches.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      const beamStart = now + idx * 0.05;
      osc.frequency.setValueAtTime(freq * 1.5, beamStart);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, beamStart + 0.18);

      gain.gain.setValueAtTime(0.35, beamStart);
      gain.gain.exponentialRampToValueAtTime(0.001, beamStart + 0.18);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(beamStart);
      osc.stop(beamStart + 0.2);
    });
  },

  // SFX 12. ĐỘC CÔ CỬU KIẾM (Kiếm Trận Bão Lốc Xoáy)
  playDocCoCuuKiem(volume = null) {
    if (isSfxMuted) return;
    const vol = volume !== null ? volume : currentSfxVolume;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(vol * 0.65, now);
    masterGain.connect(ctx.destination);

    const whirlTones = [329.63, 440, 523.25, 659.25, 880, 1046.50, 1318.51, 1760, 2093.00];
    whirlTones.forEach((freq, idx) => {
      playHarmonicTone(ctx, freq, now + idx * 0.04, 0.35, 0.4, masterGain);
    });
  },

  // SFX 13. NHƯ LAI THẦN CHƯỞNG (Phật Quang Thái Dương Hoàng Kim)
  playNhuLaiThanChuong(volume = null) {
    if (isSfxMuted) return;
    const vol = volume !== null ? volume : currentSfxVolume;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(vol * 0.8, now);
    masterGain.connect(ctx.destination);

    const bellFrequencies = [110, 220, 440, 880, 1320];
    bellFrequencies.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 1.7);
    });
  },

  // SFX 14. THIÊN NGOẠI PHI TIÊN (Băng Vũ Kiếm Thần Phi Tiên)
  playThienNgoaiPhiTien(volume = null) {
    if (isSfxMuted) return;
    const vol = volume !== null ? volume : currentSfxVolume;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(vol * 0.65, now);
    masterGain.connect(ctx.destination);

    const celestialNotes = [1046.50, 1318.51, 1567.98, 2093.00, 2637.02];
    celestialNotes.forEach((freq, idx) => {
      playHarmonicTone(ctx, freq, now + idx * 0.07, 0.5, 0.45, masterGain);
    });
  },

  // SFX 15. KIM CANG BẤT HOẠI (Thần Chuông Vàng Hoàng Kim Phản Đòn)
  playKimCangBatHoai(volume = null) {
    if (isSfxMuted) return;
    const vol = volume !== null ? volume : currentSfxVolume;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(vol * 0.7, now);
    masterGain.connect(ctx.destination);

    const bellNotes = [523.25, 659.25, 783.99, 1046.50];
    bellNotes.forEach((freq, idx) => {
      playHarmonicTone(ctx, freq, now + idx * 0.03, 0.9, 0.5, masterGain);
    });
  },

  startBgm(track = 'epic_synth', volume = 0.4, customUrl = null) {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    currentBgmTrack = track;
    currentBgmVolume = volume;
    if (customUrl) customBgmUrl = customUrl;

    this.stopBgm();
    isBgmPlaying = true;

    if (track === 'custom_upload' && customBgmUrl) {
      // Play custom uploaded MP3 via HTML5 Audio
      if (typeof window !== 'undefined' && typeof Audio !== 'undefined') {
        try {
          if (!bgmAudioElement) {
            bgmAudioElement = new Audio();
            bgmAudioElement.loop = true;
          }
          bgmAudioElement.src = customBgmUrl;
          bgmAudioElement.volume = Math.max(0, Math.min(1, isDucked ? currentBgmVolume * 0.3 : currentBgmVolume));
          bgmAudioElement.play().catch(err => {
            console.warn('BGM Audio play failed, falling back to synth:', err);
            playSynthBgmPattern('epic_synth', currentBgmVolume);
          });
        } catch (e) {
          console.warn('Custom BGM error:', e);
          playSynthBgmPattern('epic_synth', currentBgmVolume);
        }
      }
    } else {
      // Play synthesized epic loops
      const loopDuration = track === 'war_horns' ? 6000 : (track === 'edm_live' ? 3200 : 5000);
      playSynthBgmPattern(track, currentBgmVolume);
      bgmLoopTimer = setInterval(() => {
        if (isBgmPlaying) {
          playSynthBgmPattern(track, currentBgmVolume);
        }
      }, loopDuration);
    }
  },

  stopBgm() {
    isBgmPlaying = false;
    if (bgmLoopTimer) {
      clearInterval(bgmLoopTimer);
      bgmLoopTimer = null;
    }
    if (bgmAudioElement) {
      try {
        bgmAudioElement.pause();
        bgmAudioElement.currentTime = 0;
      } catch (e) {}
    }
  },

  stopAll() {
    this.stopBgm();
    if (bgmAudioElement) {
      try {
        bgmAudioElement.pause();
        bgmAudioElement.currentTime = 0;
      } catch (e) {}
    }
    if (duckTimer) {
      clearTimeout(duckTimer);
      duckTimer = null;
    }
    isDucked = false;
    this.emitStatus();
  },

  setBgmVolume(volume) {
    currentBgmVolume = Math.max(0, Math.min(1, volume));
    try {
      localStorage.setItem('battle_bgm_volume', String(currentBgmVolume));
    } catch (e) {}
    if (bgmAudioElement) {
      bgmAudioElement.volume = isDucked ? currentBgmVolume * 0.3 : currentBgmVolume;
    }
    this.emitStatus();
  },

  setSfxVolume(volume) {
    currentSfxVolume = Math.max(0, Math.min(1, volume));
    try {
      localStorage.setItem('battle_sfx_volume', String(currentSfxVolume));
    } catch (e) {}
    this.emitStatus();
  },

  setVoiceVolume(volume) {
    currentVoiceVolume = Math.max(0, Math.min(1, volume));
    try {
      localStorage.setItem('battle_voice_volume', String(currentVoiceVolume));
    } catch (e) {}
    this.emitStatus();
  },

  setSfxMuted(muted) {
    isSfxMuted = !!muted;
    try {
      localStorage.setItem('battle_is_sfx_muted', isSfxMuted ? 'true' : 'false');
    } catch (e) {}
    this.emitStatus();
  },

  toggleSfx() {
    this.setSfxMuted(!isSfxMuted);
    return !isSfxMuted;
  },

  setVoiceMuted(muted) {
    isVoiceMuted = !!muted;
    try {
      localStorage.setItem('battle_is_voice_muted', isVoiceMuted ? 'true' : 'false');
    } catch (e) {}
    this.emitStatus();
  },

  toggleVoice() {
    this.setVoiceMuted(!isVoiceMuted);
    return !isVoiceMuted;
  },

  toggleBgm() {
    if (isBgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm(currentBgmTrack, currentBgmVolume, customBgmUrl);
      return true;
    }
  },

  duckBgm(shouldDuck = true) {
    isDucked = shouldDuck;
    if (bgmAudioElement) {
      bgmAudioElement.volume = isDucked ? currentBgmVolume * 0.3 : currentBgmVolume;
    }
  },

  unlock() {
    getAudioContext();
  },

  isBgmActive() {
    return isBgmPlaying;
  },

  isSfxMutedState() {
    return isSfxMuted;
  },

  isVoiceMutedState() {
    return isVoiceMuted;
  },

  getBgmVolume() {
    return currentBgmVolume;
  },

  getSfxVolume() {
    return currentSfxVolume;
  },

  getVoiceVolume() {
    return currentVoiceVolume;
  },

  emitStatus() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('battle-audio-status', {
        detail: {
          isBgmPlaying,
          isSfxMuted,
          isVoiceMuted,
          bgmVolume: currentBgmVolume,
          sfxVolume: currentSfxVolume,
          voiceVolume: currentVoiceVolume,
          track: currentBgmTrack
        }
      }));
    }
  }
};
