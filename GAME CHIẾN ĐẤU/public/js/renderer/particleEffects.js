/**
 * Hạt hiệu ứng cho AoE skill (tier trung) và hit-flash. Có giới hạn cứng
 * số particle để tránh phình bộ nhớ khi gift dồn dập trong lúc live.
 */

const MAX_PARTICLES = 300;
const PARTICLE_LIFESPAN_MS = 1400;
const AOE_PARTICLE_COUNT = 26;
const CONFETTI_PARTICLE_COUNT = 70;
const CONFETTI_LIFESPAN_MS = 2600;

export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  spawnAoeBurst(targetFactionId, color, canvasWidth, canvasHeight) {
    const isBlueSide = targetFactionId === 'blue';
    const xStart = isBlueSide ? 0 : canvasWidth * 0.5;
    const xRange = canvasWidth * 0.5;

    for (let i = 0; i < AOE_PARTICLE_COUNT; i += 1) {
      this.particles.push({
        x: xStart + Math.random() * xRange,
        y: canvasHeight * 0.28 + Math.random() * canvasHeight * 0.1,
        vx: (Math.random() - 0.5) * 20,
        vy: 80 + Math.random() * 60,
        size: 3 + Math.random() * 3,
        color,
        isFlash: false,
        lifespanMs: PARTICLE_LIFESPAN_MS,
        spawnedAt: performance.now(),
      });
    }

    this._enforceCap();
  }

  /** Confetti ăn mừng chiến thắng — rơi từ trên xuống khắp màn hình. */
  spawnConfettiBurst(color, canvasWidth, canvasHeight) {
    for (let i = 0; i < CONFETTI_PARTICLE_COUNT; i += 1) {
      this.particles.push({
        x: Math.random() * canvasWidth,
        y: -10 - Math.random() * (canvasHeight * 0.2),
        vx: (Math.random() - 0.5) * 40,
        vy: 90 + Math.random() * 70,
        size: 3 + Math.random() * 3,
        color: Math.random() < 0.5 ? color : '#ffcc33',
        isFlash: false,
        lifespanMs: CONFETTI_LIFESPAN_MS,
        spawnedAt: performance.now(),
      });
    }
    this._enforceCap();
  }

  spawnHitFlash(x, y, color) {
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      size: 12,
      color,
      isFlash: true,
      lifespanMs: PARTICLE_LIFESPAN_MS,
      spawnedAt: performance.now(),
    });
    this._enforceCap();
  }

  _enforceCap() {
    const overflow = this.particles.length - MAX_PARTICLES;
    if (overflow > 0) this.particles.splice(0, overflow);
  }

  update(dtSeconds) {
    for (const p of this.particles) {
      p.x += p.vx * dtSeconds;
      p.y += p.vy * dtSeconds;
    }
    const now = performance.now();
    this.particles = this.particles.filter((p) => now - p.spawnedAt < (p.lifespanMs || PARTICLE_LIFESPAN_MS));
  }

  clear() {
    this.particles.length = 0;
  }
}
