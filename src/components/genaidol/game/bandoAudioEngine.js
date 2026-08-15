// Audio Engine cho Game Đất Nước Bản Đồ Hình Chữ S (Việt Nam Ghép Cờ LIVE)
// SFX tổng hợp chất lượng cao bằng Web Audio API (Zero external mp3 dependencies) + BGM & Ducking

class BanDoAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.sfxGain = null;
    this.bgmGain = null;
    this.voiceGain = null;
    this.bgmNodes = [];
    this.bgmPlaying = false;
    this.bgmVolume = 0.35;
    this.sfxVolume = 0.8;
    this.voiceVolume = 1.0;
    this.ducked = false;
    this.duckTimeout = null;
    this.isMuted = false;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      this.ctx = new AudioContextClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.85;
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxVolume;
      this.sfxGain.connect(this.masterGain);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = this.bgmVolume;
      this.bgmGain.connect(this.masterGain);

      this.voiceGain = this.ctx.createGain();
      this.voiceGain.gain.value = this.voiceVolume;
      this.voiceGain.connect(this.masterGain);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  unlock() {
    this.ensureContext();
    this.playCellPop();
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
  }

  setSfxVolume(val) {
    this.sfxVolume = Math.max(0, Math.min(1, val));
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.sfxVolume;
    }
  }

  duckBgm(durationMs = 2500) {
    if (!this.bgmGain || !this.ctx || !this.bgmPlaying) return;
    const t = this.ctx.currentTime;
    this.ducked = true;
    this.bgmGain.gain.cancelScheduledValues(t);
    this.bgmGain.gain.linearRampToValueAtTime(this.bgmVolume * 0.2, t + 0.15);

    if (this.duckTimeout) clearTimeout(this.duckTimeout);
    this.duckTimeout = setTimeout(() => {
      if (!this.bgmGain || !this.ctx) return;
      const now = this.ctx.currentTime;
      this.bgmGain.gain.cancelScheduledValues(now);
      this.bgmGain.gain.linearRampToValueAtTime(this.bgmVolume, now + 0.5);
      this.ducked = false;
    }, durationMs);
  }

  // Play synthetic tone
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
      const g = (opts.gain !== undefined ? opts.gain : 0.4) * this.sfxVolume;

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(g, start + attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      osc.connect(gain);
      gain.connect(this.sfxGain || this.masterGain);

      osc.start(start);
      osc.stop(start + duration + 0.05);
    } catch (e) {}
  }

  // 1. Cắm ô cờ (Pop-in)
  playCellPop(frequency = 520) {
    this.tone(frequency, 0.08, { type: 'sine', gain: 0.35 });
    this.tone(frequency * 1.5, 0.06, { type: 'triangle', gain: 0.2, delay: 0.02 });
  }

  // 2. Tặng quà lớn (Fanfare)
  playGiftFanfare(tier = 'large') {
    const notes = tier === 'huge' ? [523.25, 659.25, 783.99, 1046.5, 1318.51] : [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      this.tone(freq, 0.28, { type: 'triangle', gain: 0.4, delay: idx * 0.08 });
    });
  }

  // 3. Combo Streak
  playCombo(level = 2) {
    const baseFreq = 440 + level * 70;
    this.tone(baseFreq, 0.15, { type: 'sawtooth', gain: 0.3 });
    this.tone(baseFreq * 1.25, 0.18, { type: 'triangle', gain: 0.35, delay: 0.06 });
    this.tone(baseFreq * 1.5, 0.25, { type: 'sine', gain: 0.4, delay: 0.12 });
  }

  // 4. Hoàn thành 1 tỉnh thành
  playProvinceComplete(provinceName = '') {
    const melody = [523.25, 659.25, 783.99, 1046.5];
    melody.forEach((f, i) => {
      this.tone(f, 0.3, { type: 'sine', gain: 0.5, delay: i * 0.1 });
    });
  }

  // 5. Boss / Nhiệm vụ khẩn cấp xuất hiện
  playBossAlert() {
    this.tone(220, 0.3, { type: 'sawtooth', gain: 0.5 });
    this.tone(196, 0.3, { type: 'sawtooth', gain: 0.5, delay: 0.15 });
    this.tone(246.94, 0.45, { type: 'square', gain: 0.4, delay: 0.3 });
  }

  // 6. Hoàn thành bản đồ (Chiến thắng - Quốc Ca / Fanfare hào hùng)
  playVictory() {
    const victoryMelody = [
      { f: 523.25, d: 0.3, t: 0 },
      { f: 659.25, d: 0.3, t: 0.25 },
      { f: 783.99, d: 0.4, t: 0.5 },
      { f: 1046.5, d: 0.7, t: 0.8 },
      { f: 880, d: 0.4, t: 1.4 },
      { f: 1046.5, d: 0.9, t: 1.8 }
    ];
    victoryMelody.forEach(note => {
      this.tone(note.f, note.d, { type: 'triangle', gain: 0.6, delay: note.t });
      this.tone(note.f * 0.5, note.d, { type: 'sine', gain: 0.4, delay: note.t });
    });
  }

  // 7. Nhạc nền tổng hợp (Heroic Vietnam Anthem synth loop)
  startSyntheticBgm() {
    if (this.bgmPlaying) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    this.bgmPlaying = true;
    this.stopSyntheticBgm();

    const bpm = 110;
    const beatSec = 60 / bpm;
    const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C D E G A C Pentatonic
    let step = 0;

    this.bgmInterval = setInterval(() => {
      if (!this.bgmPlaying || this.isMuted) return;
      const freq = scale[step % scale.length];
      const bassFreq = freq / 2;

      // Bass pad
      this.tone(bassFreq, beatSec * 1.8, { type: 'sine', gain: 0.15 * this.bgmVolume });
      // Melody chime
      if (step % 2 === 0) {
        this.tone(freq, beatSec * 0.8, { type: 'triangle', gain: 0.18 * this.bgmVolume });
      }
      step = (step + 1) % 16;
    }, beatSec * 1000);
  }

  stopSyntheticBgm() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.bgmPlaying = false;
  }
}

export const bandoAudio = new BanDoAudioEngine();
export default bandoAudio;
