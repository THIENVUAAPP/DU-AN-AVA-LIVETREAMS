/**
 * Vòng lặp render canvas chính: vẽ nhân vật có TÊN (roster persistent theo
 * fighters từ server) + boss (quà lớn, hiệu ứng lao vào trận riêng) +
 * particle AoE + sân khấu nhảy giữa màn hình. Chạy bằng requestAnimationFrame
 * với 1 rAF id duy nhất.
 *
 * Mỗi nhân vật: vòng sáng dưới chân theo màu phe (nhận diện màu rõ), viền
 * trắng tương phản, tên hiển thị phía trên đầu, hiệu ứng "pulse" sáng lên
 * khi vừa tặng quà. Khi được tặng quà đủ điều kiện, nhân vật rời đội hình,
 * phóng to 3x ra giữa màn hình nhảy theo 1 trong 20 kiểu (xem danceStyles.js)
 * — 2 phe nhảy đối mặt nhau qua tâm màn hình, càng đông người tặng quà cùng
 * lúc thì nhóm nhảy càng đông. Các kiểu nhảy chỉ vung tay/đá chân/nhún người
 * kiểu tập thể dục — KHÔNG xoay/lộn toàn thân.
 */

import { SpritePool } from './spritePool.js';
import { ParticleSystem } from './particleEffects.js';
import { getDanceStyle, computeDancePose } from './danceStyles.js';

const DEFAULT_FACTION_COLORS = { blue: '#2f6bff', red: '#ff3b4e' };
const MAX_DELTA_SECONDS = 0.05;
const MAX_NAME_LENGTH = 12;
const SPARKLE_SPAWN_CHANCE_PER_FRAME = 0.12;

function hexToRgba(hex, alpha) {
  const clean = String(hex || '#ffffff').replace('#', '');
  const normalized = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const value = parseInt(normalized, 16) || 0xffffff;
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function truncateName(name) {
  const text = String(name || '');
  return text.length > MAX_NAME_LENGTH ? `${text.slice(0, MAX_NAME_LENGTH - 1)}…` : text;
}

function drawGroundGlow(ctx, x, y, color, radiusX) {
  ctx.save();
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radiusX);
  gradient.addColorStop(0, hexToRgba(color, 0.4));
  gradient.addColorStop(1, hexToRgba(color, 0));
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(x, y, radiusX, radiusX * 0.32, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawNameTag(ctx, x, y, name, isTopRank, fontSizePx = 10) {
  ctx.save();
  ctx.font = `${isTopRank ? 'bold ' : ''}${fontSizePx}px 'JetBrains Mono', monospace`;
  ctx.textAlign = 'center';
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(5,5,10,0.85)';
  ctx.fillStyle = isTopRank ? '#ffcc33' : '#f5f5f7';
  ctx.strokeText(name, x, y);
  ctx.fillText(name, x, y);
  ctx.restore();
}

function drawFighter(ctx, sprite, color, scale, isPulsing) {
  const bob = Math.sin(sprite.bobPhase) * 2;
  const pulseScale = isPulsing ? 1.25 : 1;
  const finalScale = scale * pulseScale;
  const isTopRank = sprite.rank === 0;

  drawGroundGlow(ctx, sprite.x, sprite.y + 18 * scale, color, 13 * scale);
  drawNameTag(ctx, sprite.x, sprite.y - 18 * scale, truncateName(sprite.nickname), isTopRank);

  ctx.save();
  ctx.translate(sprite.x, sprite.y + bob);
  ctx.scale(finalScale, finalScale);

  ctx.shadowColor = isPulsing ? '#ffcc33' : color;
  ctx.shadowBlur = isPulsing ? 18 : 9;
  ctx.fillStyle = color;
  ctx.strokeStyle = isTopRank ? 'rgba(255,204,51,0.9)' : 'rgba(255,255,255,0.6)';
  ctx.lineWidth = isTopRank ? 1.5 : 1;

  // thân
  ctx.beginPath();
  ctx.moveTo(-6, 14);
  ctx.lineTo(6, 14);
  ctx.lineTo(4, -3);
  ctx.lineTo(-4, -3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // chân
  ctx.shadowBlur = 0;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-3.5, 14);
  ctx.lineTo(-3.5, 19);
  ctx.moveTo(3.5, 14);
  ctx.lineTo(3.5, 19);
  ctx.stroke();

  // đầu
  ctx.shadowColor = isPulsing ? '#ffcc33' : color;
  ctx.shadowBlur = isPulsing ? 18 : 9;
  ctx.fillStyle = color;
  ctx.strokeStyle = isTopRank ? 'rgba(255,204,51,0.9)' : 'rgba(255,255,255,0.6)';
  ctx.lineWidth = isTopRank ? 1.5 : 1;
  ctx.beginPath();
  ctx.arc(0, -9, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

/** Vẽ 1 vũ công đang nhảy trên sân khấu — thân/tay/chân biến dạng theo tư
 * thế do computeDancePose() tính từ kiểu nhảy + thời gian đã trôi qua. */
function drawDancer(ctx, dancer, color, now) {
  const style = getDanceStyle(dancer.danceStyleId);
  const elapsedSeconds = (now - dancer.startedAt) / 1000;
  const pose = computeDancePose(style, elapsedSeconds);
  const isFading = dancer.durationMs - (now - dancer.startedAt) < 400;
  const fadeAlpha = isFading ? Math.max(0, (dancer.durationMs - (now - dancer.startedAt)) / 400) : 1;

  drawGroundGlow(ctx, dancer.x, dancer.y + 22 * dancer.scale, color, 20 * dancer.scale);
  drawNameTag(ctx, dancer.x, dancer.y - 34 * dancer.scale, truncateName(dancer.nickname), true, 13);

  ctx.save();
  ctx.globalAlpha = fadeAlpha;
  ctx.translate(dancer.x + pose.sway, dancer.y - pose.jump + pose.bounce * 0.3);
  ctx.scale(dancer.scale, dancer.scale);

  ctx.shadowColor = style.colorPulse ? '#ffcc33' : color;
  ctx.shadowBlur = style.colorPulse ? 22 : 12;
  ctx.fillStyle = color;
  ctx.strokeStyle = 'rgba(255,255,255,0.8)';
  ctx.lineWidth = 1.2;

  // tay trái/phải vung theo armSwing
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-4, -2);
  ctx.lineTo(-10, -2 - pose.armSwing * 0.6);
  ctx.moveTo(4, -2);
  ctx.lineTo(10, -2 + pose.armSwing * 0.6);
  ctx.stroke();
  ctx.restore();

  // thân
  ctx.beginPath();
  ctx.moveTo(-6, 14);
  ctx.lineTo(6, 14);
  ctx.lineTo(4, -3);
  ctx.lineTo(-4, -3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // chân đá luân phiên theo legSwing (1 chân đưa ra trước, chân kia ra sau)
  ctx.shadowBlur = 0;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-3.5, 14);
  ctx.lineTo(-3.5 + pose.legSwing * 0.5, 19);
  ctx.moveTo(3.5, 14);
  ctx.lineTo(3.5 - pose.legSwing * 0.5, 19);
  ctx.stroke();

  // đầu
  ctx.shadowColor = style.colorPulse ? '#ffcc33' : color;
  ctx.shadowBlur = style.colorPulse ? 22 : 12;
  ctx.fillStyle = color;
  ctx.strokeStyle = 'rgba(255,255,255,0.8)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(0, -9, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function drawBoss(ctx, x, y, color) {
  drawGroundGlow(ctx, x, y + 32, color, 30);

  ctx.save();
  ctx.translate(x, y);

  const aura = ctx.createRadialGradient(0, 0, 6, 0, 0, 38);
  aura.addColorStop(0, hexToRgba(color, 0.35));
  aura.addColorStop(0.6, 'rgba(139,92,246,0.35)');
  aura.addColorStop(1, 'rgba(139,92,246,0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(0, 0, 38, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowColor = color;
  ctx.shadowBlur = 20;
  ctx.fillStyle = color;
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(-16, 30);
  ctx.lineTo(16, 30);
  ctx.lineTo(12, -6);
  ctx.lineTo(-12, -6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, -18, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffcc33';
  for (const offsetX of [-7, 0, 7]) {
    ctx.beginPath();
    ctx.moveTo(offsetX - 3, -28);
    ctx.lineTo(offsetX, -38);
    ctx.lineTo(offsetX + 3, -28);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

function drawParticle(ctx, particle) {
  ctx.save();
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = particle.color;
  ctx.shadowColor = particle.color;
  ctx.shadowBlur = particle.isFlash ? 18 : 6;
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export class BattlefieldRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.spritePool = new SpritePool();
    this.particles = new ParticleSystem();
    this.factionColors = { ...DEFAULT_FACTION_COLORS };
    this.characterScale = 1;
    this.lastFrameTime = null;
    this.rafId = null;
  }

  setFactionColor(factionId, color) {
    if (color) this.factionColors[factionId] = color;
  }

  setCharacterScale(scale) {
    const parsed = Number(scale);
    if (Number.isFinite(parsed) && parsed > 0) this.characterScale = parsed;
  }

  syncFighters(factionId, fighterList) {
    this.spritePool.syncFighters(factionId, fighterList || [], this.canvas.width, this.canvas.height);
  }

  pulseFighter(userId) {
    this.spritePool.pulseFighter(userId);
  }

  /** Đưa 1 fighter ra sân khấu giữa màn hình nhảy theo kiểu/thời lượng cho trước. */
  startDance({ userId, nickname, factionId, danceStyleId, durationMs }) {
    if (!userId || !factionId || !danceStyleId || !durationMs) return;
    this.spritePool.spawnDancer(
      { userId, nickname, factionId, danceStyleId, durationMs },
      this.canvas.width,
      this.canvas.height
    );
  }

  spawnBoss(factionId) {
    this.spritePool.spawnBoss(factionId, this.canvas.width, this.canvas.height);
  }

  spawnAoe(targetFactionId, attackerFactionId) {
    const color = this.factionColors[attackerFactionId] || '#ffffff';
    this.particles.spawnAoeBurst(targetFactionId, color, this.canvas.width, this.canvas.height);
  }

  celebrateVictory(winnerFactionId) {
    const color = this.factionColors[winnerFactionId] || '#ffcc33';
    this.particles.spawnConfettiBurst(color, this.canvas.width, this.canvas.height);
  }

  resetBattlefield() {
    this.spritePool.clear();
    this.particles.clear();
  }

  start() {
    if (this.rafId) return; // đã chạy rồi, không tạo loop trùng
    const loop = (time) => {
      if (this.lastFrameTime == null) this.lastFrameTime = time;
      const dtSeconds = Math.min((time - this.lastFrameTime) / 1000, MAX_DELTA_SECONDS);
      this.lastFrameTime = time;

      this.spritePool.update(dtSeconds, this.canvas.width, this.canvas.height);
      this.particles.update(dtSeconds);
      this._draw();

      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.lastFrameTime = null;
  }

  _draw() {
    const { ctx, canvas } = this;
    const now = performance.now();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height * 0.3);
    ctx.lineTo(canvas.width / 2, canvas.height * 0.9);
    ctx.stroke();
    ctx.restore();

    for (const particle of this.particles.particles) drawParticle(ctx, particle);

    for (const sprite of this.spritePool.fighterSprites.values()) {
      if (this.spritePool.isDancing(sprite.userId)) continue; // đang nhảy ở sân khấu giữa, không vẽ ở đội hình
      const color = this.factionColors[sprite.factionId] || '#ffffff';
      const isPulsing = sprite.pulseUntil > now;
      drawFighter(ctx, sprite, color, this.characterScale, isPulsing);
    }

    for (const boss of this.spritePool.bosses) {
      drawBoss(ctx, boss.x, boss.y, this.factionColors[boss.factionId] || '#ffffff');
    }

    for (const factionId of Object.keys(this.spritePool.dancersByFaction)) {
      const color = this.factionColors[factionId] || '#ffffff';
      for (const dancer of this.spritePool.dancersByFaction[factionId]) {
        drawDancer(ctx, dancer, color, now);
        const style = getDanceStyle(dancer.danceStyleId);
        if (style.sparkle && Math.random() < SPARKLE_SPAWN_CHANCE_PER_FRAME) {
          this.particles.spawnHitFlash(
            dancer.x + (Math.random() - 0.5) * 30 * dancer.scale,
            dancer.y - Math.random() * 40 * dancer.scale,
            '#ffcc33'
          );
        }
      }
    }
  }
}
