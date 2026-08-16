// Audio Engine cho Game Bản Đồ Cắm Cờ Quốc Gia (200 Nước) & Live Battle Game
// SFX tổng hợp Web Audio API chất lượng cao + Hỗ trợ tải lên Âm nhạc BGM & SFX tùy chỉnh từ máy tính

class BanDoAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.sfxGain = null;
    this.bgmGain = null;
    this.voiceGain = null;
    this.bgmNodes = [];
    this.bgmPlaying = false;
    this.bgmVolume = 0.45;
    this.sfxVolume = 0.85;
    this.voiceVolume = 1.0;
    this.ducked = false;
    this.duckTimeout = null;
    this.isMuted = false;

    // Custom Uploaded Audio Elements & Data
    this.customBgmAudio = null;
    this.customBgmName = '';
    this.customBgmUrl = '';
    this.customSfxAudio = null;
    this.customSfxName = '';
    this.customSfxUrl = '';

    // Load custom music preferences if stored
    this.loadSavedAudioSettings();
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
    } catch (e) {}
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      this.ctx = new AudioContextClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.9;
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
    if (!this.isMuted && this.bgmVolume > 0 && !this.bgmPlaying) {
      this.playBgmOnLive();
    }
  }

  playBgmOnLive() {
    this.ensureContext();
    if (this.customBgmUrl || this.customBgmAudio) {
      this.playCustomBgm();
    } else {
      this.startSyntheticBgm();
    }
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
      this.bgmGain.gain.linearRampToValueAtTime(this.bgmVolume * 0.2, t + 0.15);
    }
    if (this.customBgmAudio && !this.customBgmAudio.paused) {
      this.customBgmAudio.volume = this.bgmVolume * 0.2;
    }

    if (this.duckTimeout) clearTimeout(this.duckTimeout);
    this.duckTimeout = setTimeout(() => {
      if (this.bgmGain && this.ctx) {
        const now = this.ctx.currentTime;
        this.bgmGain.gain.cancelScheduledValues(now);
        this.bgmGain.gain.linearRampToValueAtTime(this.bgmVolume, now + 0.5);
      }
      if (this.customBgmAudio && !this.customBgmAudio.paused) {
        this.customBgmAudio.volume = this.bgmVolume;
      }
      this.ducked = false;
    }, durationMs);
  }

  // ==================== TẢI LÊN ÂM NHẠC BGM & SFX TÙY CHỈNH ====================
  async uploadCustomBgmFile(file) {
    if (!file) return null;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        this.customBgmUrl = dataUrl;
        this.customBgmName = file.name;
        
        if (this.customBgmAudio) {
          this.customBgmAudio.pause();
          this.customBgmAudio = null;
        }
        
        this.customBgmAudio = new Audio(dataUrl);
        this.customBgmAudio.loop = true;
        this.customBgmAudio.volume = this.bgmVolume;

        try {
          // Lưu metadata (giới hạn dung lượng dataUrl cho localStorage nếu < 4MB)
          if (dataUrl.length < 4 * 1024 * 1024) {
            localStorage.setItem('bando_custom_bgm_meta', JSON.stringify({ name: file.name, url: dataUrl }));
          } else {
            localStorage.setItem('bando_custom_bgm_meta', JSON.stringify({ name: file.name, url: '' }));
          }
        } catch (err) {}

        resolve({ name: file.name, url: dataUrl });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async uploadCustomSfxFile(file) {
    if (!file) return null;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        this.customSfxUrl = dataUrl;
        this.customSfxName = file.name;
        
        this.customSfxAudio = new Audio(dataUrl);
        this.customSfxAudio.volume = this.sfxVolume;

        try {
          if (dataUrl.length < 4 * 1024 * 1024) {
            localStorage.setItem('bando_custom_sfx_meta', JSON.stringify({ name: file.name, url: dataUrl }));
          } else {
            localStorage.setItem('bando_custom_sfx_meta', JSON.stringify({ name: file.name, url: '' }));
          }
        } catch (err) {}

        resolve({ name: file.name, url: dataUrl });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  playCustomBgm() {
    if (!this.customBgmAudio && this.customBgmUrl) {
      this.customBgmAudio = new Audio(this.customBgmUrl);
      this.customBgmAudio.loop = true;
    }
    if (this.customBgmAudio) {
      this.customBgmAudio.volume = this.bgmVolume;
      this.customBgmAudio.play().catch(() => {});
      this.bgmPlaying = true;
    }
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

  // ==================== KHO SFX TỔNG HỢP WEB AUDIO API (ĐA DẠNG & KỊCH TÍNH) ====================
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
  playCellPop(frequency = 587.33) {
    this.tone(frequency, 0.09, { type: 'sine', gain: 0.45 });
    this.tone(frequency * 1.5, 0.07, { type: 'triangle', gain: 0.35, delay: 0.015 });
    this.tone(frequency * 2.0, 0.05, { type: 'sine', gain: 0.25, delay: 0.03 });
  }

  // 2. Kèn Lệnh Xung Trận Hào Hùng Hùng Tráng (War Horn - Brass fanfare)
  playWarHorn() {
    const notes = [293.66, 369.99, 440.00, 587.33, 739.99, 880.00]; // D - F# - A - D - F# - A
    notes.forEach((f, i) => {
      this.tone(f, 0.55, { type: 'sawtooth', gain: 0.45, delay: i * 0.11 });
      this.tone(f * 0.5, 0.65, { type: 'triangle', gain: 0.35, delay: i * 0.11 });
      this.tone(f * 1.5, 0.45, { type: 'sine', gain: 0.25, delay: i * 0.11 + 0.02 });
    });
  }

  // 3. Tiếng Trống Trận Dồn Dập Hào Khí Rực Lửa (War Drums)
  playWarDrums(beats = 5) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    for (let i = 0; i < beats; i++) {
      const delay = i * 0.12;
      const isAccent = i === 0 || i === beats - 1;
      this.tone(isAccent ? 120 : 85 + (i % 2) * 25, 0.22, { type: 'sine', gain: isAccent ? 0.9 : 0.7, delay, attack: 0.003 });
      this.tone(55, 0.30, { type: 'triangle', gain: isAccent ? 0.8 : 0.6, delay, attack: 0.003 });
      this.tone(180, 0.08, { type: 'sawtooth', gain: 0.35, delay, attack: 0.002 });
    }
  }

  // 4. Pháo Hoa Nổ Vang Rực Sáng (Fireworks Explosion)
  playFireworks() {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted) return;
    try {
      // Noise burst for explosion
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

      // Chimes sparkle
      [880, 1174, 1567, 2093, 2637].forEach((f, i) => {
        this.tone(f, 0.45, { type: 'sine', gain: 0.4, delay: 0.08 + i * 0.05 });
      });
    } catch (e) {}
  }

  // 5. Tiếng Khán Giả Hò Reo Vang Dội (Crowd Cheer)
  playCrowdCheer() {
    [440, 554, 659, 880, 1108, 1318].forEach((f, i) => {
      this.tone(f + Math.random() * 25, 0.85, { type: 'triangle', gain: 0.3, delay: i * 0.04 });
    });
  }

  // 6. Tiếng Sét Đánh / Rồng Thần Giáng Lâm (Thunder Strike & Mythic Roar)
  playThunderStrike() {
    this.tone(90, 0.65, { type: 'sawtooth', gain: 0.85 });
    this.tone(40, 0.85, { type: 'square', gain: 0.75, delay: 0.03 });
    this.tone(150, 0.45, { type: 'sawtooth', gain: 0.6, delay: 0.08 });
    this.playFireworks();
    this.playWarHorn();
  }

  // 7. Mưa Tiền Vàng / Quà Lớn (Gold Coins Shower)
  playGoldCoins(count = 7) {
    const freqs = [1046.5, 1318.5, 1567.98, 2093.0, 2637.0];
    for (let i = 0; i < count; i++) {
      const f = freqs[i % freqs.length] + Math.random() * 90;
      this.tone(f, 0.14, { type: 'sine', gain: 0.45, delay: i * 0.06 });
      this.tone(f * 1.5, 0.09, { type: 'triangle', gain: 0.25, delay: i * 0.06 + 0.01 });
    }
  }

  // 8. Thăng Cấp Đột Phá (Level Up)
  playLevelUp() {
    const melody = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98];
    melody.forEach((f, i) => {
      this.tone(f, 0.3, { type: 'triangle', gain: 0.5, delay: i * 0.07 });
      this.tone(f * 0.5, 0.35, { type: 'sine', gain: 0.35, delay: i * 0.07 });
    });
  }

  // 9. Tặng quà lớn (Fanfare)
  playGiftFanfare(tier = 'large') {
    const notes = tier === 'huge' 
      ? [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98] 
      : [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, idx) => {
      this.tone(freq, 0.32, { type: 'sawtooth', gain: 0.35, delay: idx * 0.07 });
      this.tone(freq, 0.35, { type: 'triangle', gain: 0.45, delay: idx * 0.07 });
    });
  }

  // 10. Combo Streak
  playCombo(level = 2) {
    const baseFreq = 440 + Math.min(level, 20) * 45;
    this.tone(baseFreq, 0.15, { type: 'sawtooth', gain: 0.3 });
    this.tone(baseFreq * 1.25, 0.18, { type: 'triangle', gain: 0.35, delay: 0.06 });
    this.tone(baseFreq * 1.5, 0.25, { type: 'sine', gain: 0.4, delay: 0.12 });
  }

  // 11. Hoàn thành 1 tỉnh thành / Vùng miền
  playProvinceComplete(provinceName = '') {
    const melody = [523.25, 659.25, 783.99, 1046.5];
    melody.forEach((f, i) => {
      this.tone(f, 0.3, { type: 'sine', gain: 0.5, delay: i * 0.1 });
    });
  }

  // 12. Boss / Nhiệm vụ khẩn cấp xuất hiện
  playBossAlert() {
    this.tone(220, 0.3, { type: 'sawtooth', gain: 0.5 });
    this.tone(196, 0.3, { type: 'sawtooth', gain: 0.5, delay: 0.15 });
    this.tone(246.94, 0.45, { type: 'square', gain: 0.4, delay: 0.3 });
  }

  // 13. Hoàn thành bản đồ (Khải Hoàn Ca Chiến Thắng)
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
    this.playCrowdCheer();
  }

  // ==================== BGM TỔNG HỢP MẶC ĐỊNH ====================
  startSyntheticBgm() {
    if (this.customBgmUrl || this.customBgmAudio) {
      this.playCustomBgm();
      return;
    }
    if (this.bgmPlaying) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    this.bgmPlaying = true;
    this.stopSyntheticBgm();

    const bpm = 115;
    const beatSec = 60 / bpm;
    const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // Pentatonic Heroic
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
    if (this.customBgmAudio) {
      this.customBgmAudio.pause();
    }
    this.bgmPlaying = false;
  }
}

export const bandoAudio = new BanDoAudioEngine();
export default bandoAudio;
