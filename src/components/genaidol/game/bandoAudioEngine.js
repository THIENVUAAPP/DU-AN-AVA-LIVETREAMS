// Audio Engine cho Game Bản Đồ Cắm Cờ Quốc Gia & Live Battle Game
// SFX tổng hợp Web Audio API chất lượng cao + BGM Nhạc Nền 24/7 + Hỗ trợ tải lên Âm nhạc tùy chỉnh vĩnh viễn
import { saveAudioFile, getAudioFile, deleteAudioFile } from '../../../utils/audioStorage.js';

class BanDoAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.sfxGain = null;
    this.bgmGain = null;
    this.voiceGain = null;
    this.bgmPlaying = false;
    this.bgmVolume = 0.50;
    this.sfxVolume = 0.85;
    this.voiceVolume = 1.0;
    this.ducked = false;
    this.duckTimeout = null;
    this.isMuted = false;
    this.isSfxMuted = false;
    this.isBgmLoop = true;
    this.bgmTimerMode = '24/7';
    this.bgmTimerRemainingSec = 0;
    this.bgmTimerInterval = null;

    this.customBgmAudio = null;
    this.customBgmName = '';
    this.customBgmUrl = '';
    this.customSfxAudio = null;
    this.customSfxName = '';
    this.customSfxUrl = '';
    this.bgmInterval = null;

    this.loadSavedAudioSettings();
    this.setupGlobalUnlockListener();
  }

  setupGlobalUnlockListener() {
    if (typeof window === 'undefined') return;
    const unlock = () => {
      this.unlock();
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
  }

  async loadSavedAudioSettings() {
    if (typeof window === 'undefined') return;
    try {
      // 1. Load from localStorage metadata
      const savedBgm = localStorage.getItem('bando_custom_bgm_meta');
      if (savedBgm) {
        const parsed = JSON.parse(savedBgm);
        this.customBgmName = parsed.name || '';
        this.customBgmUrl = parsed.url || '';
      }
      const savedSfx = localStorage.getItem('bando_custom_sfx_meta');
      if (savedSfx) {
        const parsed = JSON.parse(savedSfx);
        this.customSfxName = parsed.name || '';
        this.customSfxUrl = parsed.url || '';
      }

      // 2. Load permanent Base64 binary from IndexedDB
      const idbBgm = await getAudioFile('bando_custom_bgm');
      if (idbBgm && idbBgm.dataUrl) {
        this.customBgmName = idbBgm.name || this.customBgmName || 'Nhạc Nền Tùy Chỉnh';
        this.customBgmUrl = idbBgm.dataUrl;
      }

      const idbSfx = await getAudioFile('bando_custom_sfx');
      if (idbSfx && idbSfx.dataUrl) {
        this.customSfxName = idbSfx.name || this.customSfxName || 'SFX Tùy Chỉnh';
        this.customSfxUrl = idbSfx.dataUrl;
      }

      const savedTimer = localStorage.getItem('bando_bgm_timer_mode');
      if (savedTimer) this.bgmTimerMode = savedTimer;
      if (localStorage.getItem('bando_is_muted') === 'true') this.isMuted = true;
      if (localStorage.getItem('bando_is_sfx_muted') === 'true') this.isSfxMuted = true;
    } catch (e) {
      console.warn('loadSavedAudioSettings warning:', e);
    }
  }

  ensureContext() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      this.ctx = new AudioContextClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.9;
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.isSfxMuted ? 0 : this.sfxVolume;
      this.sfxGain.connect(this.masterGain);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = this.bgmVolume;
      this.bgmGain.connect(this.masterGain);

      this.voiceGain = this.ctx.createGain();
      this.voiceGain.gain.value = this.voiceVolume;
      this.voiceGain.connect(this.masterGain);
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  unlock() {
    const ctx = this.ensureContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    if (this.customBgmAudio && this.bgmPlaying && this.customBgmAudio.paused) {
      this.customBgmAudio.play().catch(() => {});
    }
  }

  setMuted(isMuted) {
    this.isMuted = isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(isMuted ? 0 : 0.9, this.ctx.currentTime);
    }
    if (isMuted) {
      this.stopBgmOnLive();
    }
    try {
      localStorage.setItem('bando_is_muted', isMuted ? 'true' : 'false');
    } catch (e) {}
  }

  setSfxMuted(isMuted) {
    this.isMuted = isMuted;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(isMuted ? 0 : this.sfxVolume, this.ctx.currentTime);
    }
    if (this.customSfxAudio) {
      this.customSfxAudio.muted = isMuted;
    }
    try {
      localStorage.setItem('bando_is_sfx_muted', isMuted ? 'true' : 'false');
    } catch (e) {}
  }

  toggleSfx() {
    this.setSfxMuted(!this.isSfxMuted);
    return !this.isSfxMuted;
  }

  toggleBgm() {
    this.unlock();
    if (this.bgmPlaying) {
      this.stopBgmOnLive();
      return false;
    } else {
      this.playBgmOnLive();
      return true;
    }
  }

  setBgmTimerMode(mode = '24/7') {
    this.bgmTimerMode = mode;
    try {
      localStorage.setItem('bando_bgm_timer_mode', mode);
    } catch (e) {}

    if (this.bgmTimerInterval) {
      clearInterval(this.bgmTimerInterval);
      this.bgmTimerInterval = null;
    }

    if (mode === '24/7') {
      this.bgmTimerRemainingSec = 0;
      this.isBgmLoop = true;
      if (this.customBgmAudio) this.customBgmAudio.loop = true;
      return;
    }

    const minutesMap = { '15m': 15, '30m': 30, '60m': 60, '120m': 120 };
    const minutes = minutesMap[mode] || 30;
    this.bgmTimerRemainingSec = minutes * 60;
    this.bgmTimerInterval = setInterval(() => {
      if (this.bgmTimerRemainingSec > 0 && this.bgmPlaying) {
        this.bgmTimerRemainingSec -= 1;
        if (this.bgmTimerRemainingSec <= 0) {
          this.stopBgmOnLive();
          clearInterval(this.bgmTimerInterval);
          this.bgmTimerInterval = null;
        }
      }
    }, 1000);
  }

  setBgmLoop(isLoop) {
    this.isBgmLoop = isLoop;
    if (this.customBgmAudio) {
      this.customBgmAudio.loop = isLoop;
    }
  }

  playBgmOnLive() {
    this.unlock();
    if (this.customBgmUrl && this.customBgmUrl.length > 10) {
      this.playCustomBgm();
      return;
    }
    this.startSyntheticBgm();
  }

  stopBgmOnLive() {
    this.stopCustomBgm();
    this.stopSyntheticBgm();
  }

  setMasterVolume(val) {
    this.ensureContext();
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, val));
    }
  }

  setBgmVolume(val) {
    this.bgmVolume = Math.max(0, Math.min(1, val));
    if (this.bgmGain && this.ctx && !this.ducked) {
      const t = this.ctx.currentTime;
      this.bgmGain.gain.cancelScheduledValues(t);
      this.bgmGain.gain.linearRampToValueAtTime(this.bgmVolume, t + 0.1);
    }
    if (this.customBgmAudio) {
      this.customBgmAudio.volume = this.ducked ? this.bgmVolume * 0.25 : this.bgmVolume;
    }
  }

  setSfxVolume(val) {
    this.sfxVolume = Math.max(0, Math.min(1, val));
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.sfxVolume;
    }
    if (this.customSfxAudio) {
      this.customSfxAudio.volume = this.sfxVolume;
    }
  }

  duckBgm(durationMs = 2500) {
    this.ducked = true;
    if (this.bgmGain && this.ctx && this.bgmPlaying) {
      const t = this.ctx.currentTime;
      this.bgmGain.gain.cancelScheduledValues(t);
      this.bgmGain.gain.linearRampToValueAtTime(this.bgmVolume * 0.2, t + 0.1);
    }
    if (this.customBgmAudio) {
      this.customBgmAudio.volume = this.bgmVolume * 0.2;
    }

    if (this.duckTimeout) clearTimeout(this.duckTimeout);
    this.duckTimeout = setTimeout(() => {
      this.ducked = false;
      if (this.bgmGain && this.ctx && this.bgmPlaying) {
        const t = this.ctx.currentTime;
        this.bgmGain.gain.cancelScheduledValues(t);
        this.bgmGain.gain.linearRampToValueAtTime(this.bgmVolume, t + 0.8);
      }
      if (this.customBgmAudio) {
        this.customBgmAudio.volume = this.bgmVolume;
      }
    }, durationMs);
  }

  /**
   * Tải lên File Nhạc Nền Tùy Chỉnh (MP3, WAV, AAC, OGG, FLAC)
   * Lưu vĩnh viễn vào IndexedDB & Tự động phát ngay lập tức
   */
  async uploadCustomBgmFile(file) {
    if (!file) return null;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target.result;
        const name = file.name || 'Nhạc Nền Tải Lên';
        this.customBgmUrl = dataUrl;
        this.customBgmName = name;

        if (this.customBgmAudio) {
          this.customBgmAudio.pause();
          this.customBgmAudio = null;
        }

        // Save permanent
        await saveAudioFile('bando_custom_bgm', name, dataUrl, file.type || 'audio/mp3');
        try {
          localStorage.setItem('bando_custom_bgm_meta', JSON.stringify({ name, hasCustom: true }));
        } catch (err) {}

        this.playCustomBgm();
        resolve({ name, dataUrl });
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  /**
   * Tải lên File SFX Tùy Chỉnh
   */
  async uploadCustomSfxFile(file) {
    if (!file) return null;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target.result;
        const name = file.name || 'SFX Tải Lên';
        this.customSfxUrl = dataUrl;
        this.customSfxName = name;

        if (this.customSfxAudio) {
          this.customSfxAudio.pause();
          this.customSfxAudio = null;
        }

        await saveAudioFile('bando_custom_sfx', name, dataUrl, file.type || 'audio/mp3');
        try {
          localStorage.setItem('bando_custom_sfx_meta', JSON.stringify({ name, hasCustom: true }));
        } catch (err) {}

        this.playCustomSfx();
        resolve({ name, dataUrl });
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  setCustomBgm(url, name = 'Nhạc Nền Tải Lên') {
    this.customBgmUrl = url;
    this.customBgmName = name;
    if (this.customBgmAudio) {
      this.customBgmAudio.pause();
      this.customBgmAudio = null;
    }
    try {
      localStorage.setItem('bando_custom_bgm_meta', JSON.stringify({ name, url }));
    } catch (e) {}

    if (this.bgmPlaying) {
      this.playCustomBgm();
    }
  }

  async clearCustomBgm() {
    this.customBgmUrl = '';
    this.customBgmName = '';
    if (this.customBgmAudio) {
      this.customBgmAudio.pause();
      this.customBgmAudio = null;
    }
    try {
      localStorage.removeItem('bando_custom_bgm_meta');
      await deleteAudioFile('bando_custom_bgm');
    } catch (e) {}
    if (this.bgmPlaying) {
      this.startSyntheticBgm();
    }
  }

  async clearCustomSfx() {
    this.customSfxUrl = '';
    this.customSfxName = '';
    if (this.customSfxAudio) {
      this.customSfxAudio.pause();
      this.customSfxAudio = null;
    }
    try {
      localStorage.removeItem('bando_custom_sfx_meta');
      await deleteAudioFile('bando_custom_sfx');
    } catch (e) {}
  }

  playCustomBgm() {
    this.unlock();
    if (!this.customBgmUrl) {
      this.startSyntheticBgm();
      return;
    }
    this.stopSyntheticBgm();

    if (!this.customBgmAudio || this.customBgmAudio.src !== this.customBgmUrl) {
      this.customBgmAudio = new Audio(this.customBgmUrl);
      this.customBgmAudio.loop = this.isBgmLoop;
    }
    this.customBgmAudio.volume = this.ducked ? this.bgmVolume * 0.25 : this.bgmVolume;
    this.customBgmAudio.play().then(() => {
      this.bgmPlaying = true;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('bando-bgm-status', { detail: { playing: true, name: this.customBgmName || 'Nhạc Nền Tải Lên' } }));
      }
    }).catch(e => {
      console.warn('Custom BGM audio play catch, falling back to synth BGM:', e);
      this.startSyntheticBgm();
    });
  }

  stopCustomBgm() {
    if (this.customBgmAudio) {
      this.customBgmAudio.pause();
      this.customBgmAudio.currentTime = 0;
    }
    this.bgmPlaying = false;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bando-bgm-status', { detail: { playing: false } }));
    }
  }

  playCustomSfx() {
    this.unlock();
    if (!this.customSfxAudio && this.customSfxUrl) {
      this.customSfxAudio = new Audio(this.customSfxUrl);
    }
    if (this.customSfxAudio) {
      this.customSfxAudio.currentTime = 0;
      this.customSfxAudio.volume = this.isSfxMuted ? 0 : this.sfxVolume;
      this.customSfxAudio.play().catch(() => {});
    }
  }

  // ==================== KHO SFX TỔNG HỢP WEB AUDIO API ====================
  tone(freq, duration, opts = {}) {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = opts.type || 'sine';
      osc.frequency.value = freq;

      const start = ctx.currentTime + (opts.delay || 0);
      const attack = opts.attack || 0.01;
      const isBgm = !!opts.isBgm;
      const g = (opts.gain !== undefined ? opts.gain : 0.4) * (isBgm ? this.bgmVolume : this.sfxVolume);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(g, start + attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      osc.connect(gain);
      gain.connect(isBgm ? (this.bgmGain || this.masterGain) : (this.sfxGain || this.masterGain));

      osc.start(start);
      osc.stop(start + duration + 0.05);
    } catch (e) {}
  }

  noise(duration, opts = {}) {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted || this.isSfxMuted) return;
    try {
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = opts.filterType || 'lowpass';
      filter.frequency.value = opts.cutoff || 800;

      const gain = ctx.createGain();
      const start = ctx.currentTime + (opts.delay || 0);
      const g = (opts.gain !== undefined ? opts.gain : 0.5) * this.sfxVolume;

      gain.gain.setValueAtTime(g, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain || this.masterGain);

      whiteNoise.start(start);
      whiteNoise.stop(start + duration + 0.05);
    } catch (e) {}
  }

  playFlagPlace(claimedCount = 1) {
    if (this.customSfxUrl) {
      this.playCustomSfx();
    }
    const pitchMultiplier = Math.min(2.0, 1 + (claimedCount % 50) * 0.015);
    this.tone(523.25 * pitchMultiplier, 0.12, { type: 'sine', gain: 0.45 });
    this.tone(659.25 * pitchMultiplier, 0.16, { type: 'triangle', gain: 0.35, delay: 0.04 });
    this.tone(783.99 * pitchMultiplier, 0.22, { type: 'sine', gain: 0.30, delay: 0.08 });
    this.noise(0.08, { cutoff: 1800, gain: 0.25 });
  }

  playBigGift(comboCount = 1) {
    const baseFreq = 440;
    const chords = [
      [baseFreq, baseFreq * 1.25, baseFreq * 1.5],
      [baseFreq * 1.125, baseFreq * 1.35, baseFreq * 1.68],
      [baseFreq * 1.33, baseFreq * 1.66, baseFreq * 2.0]
    ];
    const chord = chords[Math.min(chords.length - 1, Math.floor(comboCount / 3))];
    chord.forEach((f, idx) => {
      this.tone(f, 0.45, { type: 'triangle', gain: 0.45, delay: idx * 0.06 });
      this.tone(f * 2, 0.35, { type: 'sine', gain: 0.3, delay: idx * 0.06 + 0.02 });
    });
    this.noise(0.35, { cutoff: 2200, gain: 0.4, delay: 0.05 });
  }

  playComboFanfare(combo = 5) {
    const scale = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    scale.forEach((f, idx) => {
      this.tone(f, 0.25, { type: 'sine', gain: 0.4, delay: idx * 0.07 });
      this.tone(f * 0.5, 0.25, { type: 'triangle', gain: 0.35, delay: idx * 0.07 });
    });
  }

  playBossAlert() {
    this.duckBgm(4000);
    this.tone(130.81, 0.8, { type: 'sawtooth', gain: 0.7 });
    this.tone(123.47, 0.8, { type: 'sawtooth', gain: 0.7, delay: 0.4 });
    this.noise(0.6, { cutoff: 400, gain: 0.75, delay: 0.1 });
    setTimeout(() => {
      this.tone(110.00, 1.2, { type: 'sawtooth', gain: 0.8 });
      this.noise(1.0, { cutoff: 300, gain: 0.8 });
    }, 800);
  }

  playWarDrums(count = 5) {
    for (let i = 0; i < count; i++) {
      const delay = i * 0.18;
      const freq = 90 + (i % 2 === 0 ? 0 : 25);
      this.tone(freq, 0.22, { type: 'sine', gain: 0.7, delay });
      this.noise(0.18, { cutoff: 350, gain: 0.65, delay });
    }
  }

  playFireworks() {
    this.noise(0.15, { cutoff: 2800, gain: 0.5 });
    setTimeout(() => {
      this.noise(0.6, { cutoff: 1400, gain: 0.75 });
      this.tone(880, 0.35, { type: 'sine', gain: 0.3 });
      this.tone(1174.66, 0.4, { type: 'triangle', gain: 0.35, delay: 0.05 });
    }, 180);
  }

  playCrowdCheer() {
    this.noise(2.5, { cutoff: 1800, gain: 0.45 });
    this.noise(2.2, { cutoff: 1200, gain: 0.40, delay: 0.2 });
  }

  playGoldCoins(count = 6) {
    for (let i = 0; i < count; i++) {
      const delay = i * 0.06;
      const freq = 1800 + Math.random() * 600;
      this.tone(freq, 0.09, { type: 'sine', gain: 0.35, delay });
      this.tone(freq * 1.5, 0.08, { type: 'triangle', gain: 0.25, delay: delay + 0.02 });
    }
  }

  playVictoryTheme() {
    this.duckBgm(8000);
    const melody = [
      { f: 523.25, d: 0.3, t: 0 },
      { f: 659.25, d: 0.3, t: 0.25 },
      { f: 783.99, d: 0.3, t: 0.5 },
      { f: 1046.50, d: 0.7, t: 0.75 },
      { f: 880.00, d: 0.3, t: 1.5 },
      { f: 1046.50, d: 1.2, t: 1.8 }
    ];

    melody.forEach(note => {
      this.tone(note.f, note.d, { type: 'sine', gain: 0.55, delay: note.t });
      this.tone(note.f * 0.5, note.d, { type: 'sawtooth', gain: 0.3, delay: note.t });
      this.tone(note.f, note.d * 1.1, { type: 'triangle', gain: 0.45, delay: note.t });
    });

    this.playWarDrums(7);
    setTimeout(() => this.playFireworks(), 300);
    setTimeout(() => this.playFireworks(), 900);
    setTimeout(() => this.playFireworks(), 1700);
    this.playCrowdCheer();
    setTimeout(() => this.playGoldCoins(10), 1000);
  }

  // ==================== BGM TỔNG HỢP (TỰ ĐỘNG LẶP 24/7) ====================
  startSyntheticBgm() {
    this.unlock();
    this.stopSyntheticBgm();
    this.bgmPlaying = true;

    const bpm = 120;
    const beatSec = 60 / bpm;
    // Giai điệu Hào Khí Đông A - Ngũ Cung Hùng Tráng (C - D - E - G - A - C)
    const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 659.25, 523.25];
    const bassScale = [130.81, 146.83, 164.81, 196.00];
    let step = 0;

    const playStep = () => {
      if (!this.bgmPlaying || this.isMuted) return;
      
      const freq = scale[step % scale.length];
      const bassFreq = bassScale[Math.floor(step / 2) % bassScale.length];

      if (step % 2 === 0) {
        this.tone(bassFreq, beatSec * 1.9, { type: 'sine', gain: 0.35, isBgm: true });
        this.tone(bassFreq * 0.5, beatSec * 2.2, { type: 'triangle', gain: 0.28, isBgm: true });
      }

      this.tone(freq, beatSec * 0.85, { type: 'triangle', gain: 0.32, isBgm: true });
      if (step % 4 === 0) {
        this.tone(freq * 1.5, beatSec * 0.5, { type: 'sine', gain: 0.22, delay: 0.05, isBgm: true });
      }

      step = (step + 1) % 32;
    };

    playStep();
    this.bgmInterval = setInterval(playStep, beatSec * 1000);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bando-bgm-status', { detail: { playing: true, name: 'Hào Khí Đông A (Synth 24/7)' } }));
    }
  }

  stopSyntheticBgm() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    if (this.customBgmAudio) {
      this.customBgmAudio.pause();
    }
    this.bgmPlaying = false;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bando-bgm-status', { detail: { playing: false } }));
    }
  }
}

export const bandoAudio = new BanDoAudioEngine();
export default bandoAudio;
