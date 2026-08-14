// Studio-grade Web Audio Engine for TikTok LIVE Battle Game
// Zero-latency, zero droning noise, crystal-clear hype sound effects

let audioCtx = null;

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

export const battleAudio = {
  // 1. Tham chiến (Kèn xung trận + Keng dũng sĩ)
  playJoin(volume = 0.7) {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.4, now);
    masterGain.connect(ctx.destination);

    // Fanfare Notes: C5 -> E5 -> G5
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.6, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.36);
    });

    // Metallic Sword Shimmer
    const oscMetal = ctx.createOscillator();
    const gainMetal = ctx.createGain();
    oscMetal.type = 'sine';
    oscMetal.frequency.setValueAtTime(1200, now + 0.2);
    oscMetal.frequency.exponentialRampToValueAtTime(800, now + 0.4);
    gainMetal.gain.setValueAtTime(0.3, now + 0.2);
    gainMetal.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    oscMetal.connect(gainMetal);
    gainMetal.connect(masterGain);
    oscMetal.start(now + 0.2);
    oscMetal.stop(now + 0.51);
  },

  // 2. Va chạm Gươm Đao / Đánh đòn (Crisp Metallic Sword Clash)
  playHit(volume = 0.7) {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.5, now);
    masterGain.connect(ctx.destination);

    // High metallic strike
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.12);

    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.15);

    // Noise burst for clash friction
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 3500;
    noiseFilter.Q.value = 3;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noise.start(now);
  },

  // 3. Bão Sét / Lửa AoE (Thunderous Lightning Storm)
  playAoe(volume = 0.7) {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.6, now);
    masterGain.connect(ctx.destination);

    // Electrical Zap Sweeps
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      const startTime = now + i * 0.09;
      osc.frequency.setValueAtTime(1800 - i * 300, startTime);
      osc.frequency.exponentialRampToValueAtTime(120, startTime + 0.2);

      gain.gain.setValueAtTime(0.5, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.22);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2500;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(startTime);
      osc.stop(startTime + 0.23);
    }

    // Thunder Explosion Rumble (No continuous drone, decays quickly)
    const oscBoom = ctx.createOscillator();
    const gainBoom = ctx.createGain();
    oscBoom.type = 'triangle';
    oscBoom.frequency.setValueAtTime(140, now + 0.1);
    oscBoom.frequency.exponentialRampToValueAtTime(35, now + 0.6);
    gainBoom.gain.setValueAtTime(0.7, now + 0.1);
    gainBoom.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    oscBoom.connect(gainBoom);
    gainBoom.connect(masterGain);
    oscBoom.start(now + 0.1);
    oscBoom.stop(now + 0.66);
  },

  // 4. Thả Boss Thần Thú Rồng / Hổ (Epic Beast Roar & Grand Horn)
  playBoss(volume = 0.7) {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.7, now);
    masterGain.connect(ctx.destination);

    // Mighty Warhorn Chords (Low & Powerful brass)
    const hornNotes = [220, 277.18, 329.63, 440];
    hornNotes.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(2200, now + 0.4);
      filter.frequency.exponentialRampToValueAtTime(400, now + 1.2);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 1.25);
    });

    // Dragon / Tiger Whoosh Surge
    const oscWhoosh = ctx.createOscillator();
    const gainWhoosh = ctx.createGain();
    oscWhoosh.type = 'triangle';
    oscWhoosh.frequency.setValueAtTime(100, now + 0.2);
    oscWhoosh.frequency.linearRampToValueAtTime(380, now + 0.5);
    oscWhoosh.frequency.exponentialRampToValueAtTime(60, now + 1.0);
    gainWhoosh.gain.setValueAtTime(0.5, now + 0.2);
    gainWhoosh.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
    oscWhoosh.connect(gainWhoosh);
    gainWhoosh.connect(masterGain);
    oscWhoosh.start(now + 0.2);
    oscWhoosh.stop(now + 1.15);
  },

  // 5. Khúc Khải Hoàn Chiến Thắng (Victory Fanfare & Gold Coins Shower)
  playVictory(volume = 0.7) {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.7, now);
    masterGain.connect(ctx.destination);

    // Grand Triumphal Melody: G4 -> C5 -> E5 -> G5 -> C6 (Held)
    const melody = [
      { note: 392.00, time: 0.0,  dur: 0.18 },
      { note: 523.25, time: 0.18, dur: 0.18 },
      { note: 659.25, time: 0.36, dur: 0.18 },
      { note: 783.99, time: 0.54, dur: 0.30 },
      { note: 1046.50, time: 0.84, dur: 1.10 }
    ];

    melody.forEach(({ note, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note, now + time);

      gain.gain.setValueAtTime(0, now + time);
      gain.gain.linearRampToValueAtTime(0.7, now + time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now + time);
      osc.stop(now + time + dur + 0.05);
    });

    // Gold Coin Shimmer Sparkles
    for (let i = 0; i < 6; i++) {
      const oscCoin = ctx.createOscillator();
      const gainCoin = ctx.createGain();
      const coinTime = now + 0.9 + i * 0.08;
      oscCoin.type = 'sine';
      oscCoin.frequency.setValueAtTime(2000 + i * 250, coinTime);

      gainCoin.gain.setValueAtTime(0.3, coinTime);
      gainCoin.gain.exponentialRampToValueAtTime(0.001, coinTime + 0.25);

      oscCoin.connect(gainCoin);
      gainCoin.connect(masterGain);

      oscCoin.start(coinTime);
      oscCoin.stop(coinTime + 0.26);
    }
  },

  // 6. Nhạc Điệu Nhảy Sôi Động (Rhythmic Aerobic Dance Beat)
  playDanceBeat(volume = 0.7) {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.5, now);
    masterGain.connect(ctx.destination);

    // 4 Upbeat funky synth notes
    const chords = [440, 554.37, 659.25, 880];
    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      const t = now + idx * 0.1;
      osc.frequency.setValueAtTime(freq, t);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1800;

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.16);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(t);
      osc.stop(t + 0.18);
    });
  }
};
