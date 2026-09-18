/**
 * Tự tổng hợp nhạc nền + SFX bằng sóng sin thuần túy (Node.js, không tải từ
 * đâu cả) — dùng làm âm thanh mặc định an toàn 100% bản quyền cho TikTok
 * LIVE (không phải nhạc thật của nghệ sĩ nào). Anh vẫn có thể thay bằng file
 * nhạc hay hơn theo public/audio/README.md bất cứ lúc nào — hệ thống audio
 * ưu tiên đọc đúng tên file, không phân biệt file này do đâu sinh ra.
 *
 * Chạy: node scripts/generate-placeholder-audio.js
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AUDIO_DIR = join(__dirname, '..', 'public', 'audio');
const SAMPLE_RATE = 44100;

function hannWindow(i, length) {
  return 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (length - 1));
}

/** Chirp (quét tần số tuyến tính) có bao hình Hann để không bị click đầu/cuối. */
function chirp(durationSec, freqStart, freqEnd, amp) {
  const length = Math.round(durationSec * SAMPLE_RATE);
  const samples = new Float64Array(length);
  for (let i = 0; i < length; i++) {
    const t = i / SAMPLE_RATE;
    const phase = 2 * Math.PI * (freqStart * t + ((freqEnd - freqStart) * t * t) / (2 * durationSec));
    samples[i] = Math.sin(phase) * amp * hannWindow(i, length);
  }
  return samples;
}

function addInto(buffer, chunk, offsetSamples) {
  for (let i = 0; i < chunk.length; i++) {
    const idx = offsetSamples + i;
    if (idx >= 0 && idx < buffer.length) buffer[idx] += chunk[i];
  }
}

function normalize(buffer, peak = 0.85) {
  let max = 0;
  for (let i = 0; i < buffer.length; i++) max = Math.max(max, Math.abs(buffer[i]));
  if (max === 0) return buffer;
  const scale = peak / max;
  for (let i = 0; i < buffer.length; i++) buffer[i] *= scale;
  return buffer;
}

function writeWav(filePath, floatSamples) {
  const dataSize = floatSamples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < floatSamples.length; i++) {
    const s = Math.max(-1, Math.min(1, floatSamples[i]));
    buffer.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }
  writeFileSync(filePath, buffer);
}

// --- 1) sfx-join.wav — quà nhỏ: tiếng "ting" ngắn, sáng ---
{
  const samples = chirp(0.18, 700, 1050, 0.6);
  writeWav(join(AUDIO_DIR, 'sfx-join.wav'), normalize(samples));
}

// --- 2) sfx-aoe.wav — quà trung: "whoosh" hạ dần + chạm nhẹ ---
{
  const length = Math.round(0.38 * SAMPLE_RATE);
  const buffer = new Float64Array(length);
  addInto(buffer, chirp(0.28, 520, 180, 0.55), 0);
  addInto(buffer, chirp(0.16, 110, 90, 0.5), Math.round(0.1 * SAMPLE_RATE));
  writeWav(join(AUDIO_DIR, 'sfx-aoe.wav'), normalize(buffer));
}

// --- 3) sfx-boss.wav — quà lớn: thump trầm + tiếng kèn ngắn (cộng hài âm) ---
{
  const length = Math.round(0.9 * SAMPLE_RATE);
  const buffer = new Float64Array(length);
  addInto(buffer, chirp(0.5, 70, 55, 0.7), 0); // thump trầm
  addInto(buffer, chirp(0.6, 220, 210, 0.35), 0); // kèn - cơ bản
  addInto(buffer, chirp(0.55, 660, 630, 0.14), 0); // kèn - hài bậc 3
  addInto(buffer, chirp(0.5, 1100, 1050, 0.08), 0); // kèn - hài bậc 5
  writeWav(join(AUDIO_DIR, 'sfx-boss.wav'), normalize(buffer));
}

// --- 4) victory-fanfare.wav — chuỗi nốt đi lên + hợp âm kết ---
{
  const noteFreqs = [261.63, 329.63, 392.0, 523.25]; // C4 E4 G4 C5
  const noteDur = 0.18;
  const gap = 0.02;
  const chordFreqs = [523.25, 659.25, 783.99]; // C5 E5 G5
  const chordDur = 0.7;
  const totalLength = Math.round((noteFreqs.length * (noteDur + gap) + chordDur) * SAMPLE_RATE);
  const buffer = new Float64Array(totalLength);

  let cursor = 0;
  for (const freq of noteFreqs) {
    addInto(buffer, chirp(noteDur, freq, freq, 0.5), cursor);
    cursor += Math.round((noteDur + gap) * SAMPLE_RATE);
  }
  for (const freq of chordFreqs) {
    addInto(buffer, chirp(chordDur, freq, freq, 0.28), cursor);
  }
  writeWav(join(AUDIO_DIR, 'victory-fanfare.wav'), normalize(buffer));
}

// --- 5) background-music.wav — pad nhẹ lặp vô hạn, khớp pha để không giật ---
{
  const loopSeconds = 6.4;
  const loopSamples = Math.round(loopSeconds * SAMPLE_RATE);
  const df = SAMPLE_RATE / loopSamples;

  function snapToLoop(freq) {
    const k = Math.round(freq / df);
    return k * df;
  }

  const partials = [
    { freq: snapToLoop(110), amp: 0.16 }, // gốc A2
    { freq: snapToLoop(164.81), amp: 0.11 }, // quãng 5 đúng (E3)
    { freq: snapToLoop(220), amp: 0.09 }, // quãng 8 (A3)
    { freq: snapToLoop(440), amp: 0.035 }, // lấp lánh cao (A4)
  ];

  const buffer = new Float64Array(loopSamples);
  for (let i = 0; i < loopSamples; i++) {
    const t = i / SAMPLE_RATE;
    // Swell biên độ chậm, đúng 1 chu kỳ trên toàn vòng lặp nên nối liền mượt.
    const swell = 0.7 + 0.3 * Math.sin((2 * Math.PI * t) / loopSeconds - Math.PI / 2);
    let sample = 0;
    for (const p of partials) {
      sample += Math.sin(2 * Math.PI * p.freq * t) * p.amp;
    }
    buffer[i] = sample * swell;
  }
  writeWav(join(AUDIO_DIR, 'background-music.wav'), normalize(buffer, 0.5));
}

console.log('Đã tạo xong 5 file âm thanh tổng hợp (sóng sin, không bản quyền) trong public/audio/');
