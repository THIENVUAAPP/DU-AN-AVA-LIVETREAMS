// Audio Engine cho Game Bản Đồ Cắm Cờ Quốc Gia & Live Battle Game
// SFX tổng hợp Web Audio API chất lượng cao + BGM Nhạc Nền 24/7 + Hỗ trợ tải lên Âm nhạc tùy chỉnh

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

  loadSavedAudioSettings() {
    if (typeof window === 'undefined') return;
    try {
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
      const savedTimer = localStorage.getItem('bando_bgm_timer_mode');
      if (savedTimer) this.bgmTimerMode = savedTimer;
      if (localStorage.getItem('bando_is_muted') === 'true') this.isMuted = true;
      if (localStorage.getItem('bando_is_sfx_muted') === 'true') this.isSfxMuted = true;
    } catch (e) {}
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
    this.isSfxMuted = isMuted;
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
      return;
    }

    let minutes = 30;
    if (mode === '15m') minutes = 15;
    else if (mode === '30m') minutes = 30;
    else if (mode === '1h') minutes = 60;
    else if (mode === '2h') minutes = 120;
    else if (mode === '4h') minutes = 240;

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
    if (this.customBgmUrl && this.customBgmUrl.length > 5) {
      try {
        this.playCustomBgm();
        return;
      } catch (e) {
        console.warn('Custom BGM playback fallback to synth:', e);
      }
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

  setCustomBgm(url, name = 'Nhạc nền Tải lên') {
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

  clearCustomBgm() {
    this.customBgmUrl = '';
    this.customBgmName = '';
    if (this.customBgmAudio) {
      this.customBgmAudio.pause();
      this.customBgmAudio = null;
    }
    try {
      localStorage.removeItem('bando_custom_bgm_meta');
    } catch (e) {}
    if (this.bgmPlaying) {
      this.startSyntheticBgm();
    }
  }

  playCustomBgm() {
    if (!this.customBgmUrl) {
      this.startSyntheticBgm();
      return;
    }
    this.stopSyntheticBgm();
    if (!this.customBgmAudio) {
      this.customBgmAudio = new Audio(this.customBgmUrl);
      this.customBgmAudio.loop = this.isBgmLoop;
    }
    this.customBgmAudio.volume = this.ducked ? this.bgmVolume * 0.25 : this.bgmVolume;
    this.customBgmAudio.play().then(() => {
      this.bgmPlaying = true;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('bando-bgm-status', { detail: { playing: true, name: this.customBgmName } }));
      }
    }).catch(e => {
      console.warn('Custom BGM audio play error, falling back to synth BGM:', e);
      this.startSyntheticBgm();
    });
  }

  stopCustomBgm() {
    if (this.customBgmAudio) {
      this.customBgmAudio.pause();
      this.customBgmAudio.currentTime = 0;
    }
    this.bgmPlaying = false;
  }

  playCustomSfx() {
    if (!this.customSfxAudio && this.customSfxUrl) {
      this.customSfxAudio = new Audio(this.customSfxUrl);
    }
    if (this.customSfxAudio) {
      this.customSfxAudio.currentTime = 0;
      this.customSfxAudio.volume = this.sfxVolume;
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

  playCellPop(frequency = 587.33) {
    this.tone(frequency, 0.09, { type: 'sine', gain: 0.45 });
    this.tone(frequency * 1.5, 0.07, { type: 'triangle', gain: 0.35, delay: 0.015 });
  }

  playWarHorn() {
    const notes = [293.66, 369.99, 440.00, 587.33, 739.99, 880.00];
    notes.forEach((f, i) => {
      this.tone(f, 0.55, { type: 'sawtooth', gain: 0.45, delay: i * 0.11 });
      this.tone(f * 0.5, 0.65, { type: 'triangle', gain: 0.35, delay: i * 0.11 });
    });
  }

  playWarDrums(beats = 5) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    for (let i = 0; i < beats; i++) {
      const delay = i * 0.12;
      const isAccent = i === 0 || i === beats - 1;
      this.tone(isAccent ? 120 : 85 + (i % 2) * 25, 0.22, { type: 'sine', gain: isAccent ? 0.9 : 0.7, delay, attack: 0.003 });
      this.tone(55, 0.30, { type: 'triangle', gain: isAccent ? 0.8 : 0.6, delay, attack: 0.003 });
    }
  }

  playFireworks() {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted) return;
    try {
      const bufferSize = ctx.sampleRate * 0.55;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 950;

      const gain = ctx.createGain();
      const start = ctx.currentTime;
      gain.gain.setValueAtTime(0.85 * this.sfxVolume, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.50);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain || this.masterGain);

      whiteNoise.start(start);
      whiteNoise.stop(start + 0.55);

      [880, 1174, 1567, 2093, 2637].forEach((f, i) => {
        this.tone(f, 0.45, { type: 'sine', gain: 0.4, delay: 0.08 + i * 0.05 });
      });
    } catch (e) {}
  }

  playCrowdCheer() {
    [440, 554, 659, 880, 1108, 1318].forEach((f, i) => {
      this.tone(f + Math.random() * 25, 0.85, { type: 'triangle', gain: 0.3, delay: i * 0.04 });
    });
  }

  playThunderStrike() {
    this.tone(90, 0.65, { type: 'sawtooth', gain: 0.85 });
    this.tone(40, 0.85, { type: 'square', gain: 0.75, delay: 0.03 });
    this.playFireworks();
    this.playWarHorn();
  }

  playGoldCoins(count = 7) {
    const freqs = [1046.5, 1318.5, 1567.98, 2093.0, 2637.0];
    for (let i = 0; i < count; i++) {
      const f = freqs[i % freqs.length] + Math.random() * 90;
      this.tone(f, 0.14, { type: 'sine', gain: 0.45, delay: i * 0.06 });
    }
  }

  playLevelUp() {
    const melody = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98];
    melody.forEach((f, i) => {
      this.tone(f, 0.3, { type: 'triangle', gain: 0.5, delay: i * 0.07 });
    });
  }

  playGiftFanfare(tier = 'large') {
    const notes = tier === 'huge' 
      ? [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98] 
      : [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, idx) => {
      this.tone(freq, 0.32, { type: 'sawtooth', gain: 0.35, delay: idx * 0.07 });
      this.tone(freq, 0.35, { type: 'triangle', gain: 0.45, delay: idx * 0.07 });
    });
  }

  playCombo(level = 2) {
    const baseFreq = 440 + Math.min(level, 20) * 45;
    this.tone(baseFreq, 0.15, { type: 'sawtooth', gain: 0.3 });
    this.tone(baseFreq * 1.25, 0.18, { type: 'triangle', gain: 0.35, delay: 0.06 });
  }

  playProvinceComplete() {
    const melody = [523.25, 659.25, 783.99, 1046.5];
    melody.forEach((f, i) => {
      this.tone(f, 0.3, { type: 'sine', gain: 0.5, delay: i * 0.1 });
    });
  }

  playBossAlert() {
    this.tone(220, 0.3, { type: 'sawtooth', gain: 0.5 });
    this.tone(196, 0.3, { type: 'sawtooth', gain: 0.5, delay: 0.15 });
    this.tone(246.94, 0.45, { type: 'square', gain: 0.4, delay: 0.3 });
  }

  playVictoryEpic() {
    this.ensureContext();
    this.duckBgm(4000);

    const fanfareMelody = [
      { f: 523.25, d: 0.25, t: 0.00 },
      { f: 523.25, d: 0.25, t: 0.22 },
      { f: 523.25, d: 0.25, t: 0.44 },
      { f: 659.25, d: 0.60, t: 0.66 },
      { f: 783.99, d: 0.40, t: 1.15 },
      { f: 1046.50, d: 1.20, t: 1.50 },
      { f: 1318.51, d: 0.80, t: 1.85 },
      { f: 1567.98, d: 1.60, t: 2.20 }
    ];

    fanfareMelody.forEach(note => {
      this.tone(note.f, note.d, { type: 'sawtooth', gain: 0.55, delay: note.t });
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
