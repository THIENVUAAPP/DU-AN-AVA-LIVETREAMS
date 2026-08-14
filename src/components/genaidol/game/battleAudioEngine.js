// Melodic & Studio-Grade Web Audio Engine for TikTok LIVE Battle Game
// Zero-noise, Zero-buzzing ("è è" completely eliminated), Pure Harmonic Musical Tones

let audioCtx = null;
let bgmIntervalId = null;
let isBgmPlaying = false;

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

export const battleAudio = {
  // 1. Tham chiến (Âm sắc Kèn Chuông Xung Trận - Melodic Chime Fanfare)
  playJoin(volume = 0.7) {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.4, now);
    masterGain.connect(ctx.destination);

    // C5 -> E5 -> G5 -> C6 (Joyful Fanfare)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      playHarmonicTone(ctx, freq, now + i * 0.07, 0.4, 0.45, masterGain);
    });
  },

  // 2. Va chạm Gươm Đao / Đòn Đánh (Crisp Steel Clash - Sắc bén, không rè)
  playHit(volume = 0.7) {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.45, now);
    masterGain.connect(ctx.destination);

    // High metal strike
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

    // Secondary strike ring
    playHarmonicTone(ctx, 1200, now + 0.02, 0.18, 0.25, masterGain);
  },

  // 3. Bão Sét / Kỹ Năng AoE (Âm Thanh Ma Thuật Huyền Ảo - Magic Energy Sweep)
  playAoe(volume = 0.7) {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.5, now);
    masterGain.connect(ctx.destination);

    // Rapid harmonic arpeggio (C-Major pentatonic: C5, D5, E5, G5, A5, C6)
    const arpeggio = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
    arpeggio.forEach((freq, idx) => {
      playHarmonicTone(ctx, freq, now + idx * 0.05, 0.45, 0.4, masterGain);
    });

    // Warm deep sub-impact (zero buzz)
    const oscBass = ctx.createOscillator();
    const gainBass = ctx.createGain();
    oscBass.type = 'sine';
    oscBass.frequency.setValueAtTime(180, now);
    oscBass.frequency.exponentialRampToValueAtTime(50, now + 0.5);

    gainBass.gain.setValueAtTime(0.6, now);
    gainBass.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    oscBass.connect(gainBass);
    gainBass.connect(masterGain);
    oscBass.start(now);
    oscBass.stop(now + 0.56);
  },

  // 4. Thả Boss Thần Thú Rồng / Hổ (Âm Sắc Đại Hùng Trầm Uy - Mighty Brass Fanfare)
  playBoss(volume = 0.7) {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.6, now);
    masterGain.connect(ctx.destination);

    // Majestic brass chord fanfare: C4 + G4 + C5 -> E5 -> G5
    const chord1 = [261.63, 392.00, 523.25];
    chord1.forEach(freq => {
      playHarmonicTone(ctx, freq, now, 0.5, 0.4, masterGain);
    });

    const chord2 = [329.63, 493.88, 659.25];
    chord2.forEach(freq => {
      playHarmonicTone(ctx, freq, now + 0.25, 0.5, 0.45, masterGain);
    });

    const chord3 = [392.00, 587.33, 783.99, 1046.50];
    chord3.forEach(freq => {
      playHarmonicTone(ctx, freq, now + 0.5, 0.9, 0.5, masterGain);
    });
  },

  // 5. Khúc Khải Hoàn Chiến Thắng (Grand Victory Triumphal Symphony)
  playVictory(volume = 0.7) {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.65, now);
    masterGain.connect(ctx.destination);

    // Grand Melody: G4 -> C5 -> E5 -> G5 -> C6 (Held Chime)
    const melody = [
      { note: 392.00, time: 0.0,  dur: 0.2 },
      { note: 523.25, time: 0.18, dur: 0.2 },
      { note: 659.25, time: 0.36, dur: 0.2 },
      { note: 783.99, time: 0.54, dur: 0.35 },
      { note: 1046.50, time: 0.85, dur: 1.4 }
    ];

    melody.forEach(({ note, time, dur }) => {
      playHarmonicTone(ctx, note, now + time, dur, 0.5, masterGain);
    });

    // Sparkling bell overtone cascades
    for (let i = 0; i < 6; i++) {
      const bellFreq = 1500 + i * 200;
      playHarmonicTone(ctx, bellFreq, now + 0.9 + i * 0.09, 0.35, 0.25, masterGain);
    }
  },

  // 6. Nhịp Điệu Vũ Đạo Sân Khấu (Rhythmic Dance Melody)
  playDanceBeat(volume = 0.7) {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.45, now);
    masterGain.connect(ctx.destination);

    // Melodic synth pop motif: A4 -> C5 -> E5 -> G5 -> A5
    const steps = [440, 523.25, 659.25, 783.99, 880];
    steps.forEach((freq, idx) => {
      playHarmonicTone(ctx, freq, now + idx * 0.09, 0.22, 0.38, masterGain);
    });
  }
};
