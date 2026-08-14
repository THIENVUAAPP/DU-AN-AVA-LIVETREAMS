/**
 * Roster nhân vật có tên, tồn tại xuyên suốt trận — đồng bộ từ danh sách
 * fighters do server gửi (đã sắp theo điểm đóng góp giảm dần). Điểm cao hơn
 * đứng gần hàng đầu (gần trung tâm) hơn, điểm thấp đứng lùi phía sau.
 *
 * Boss (quà lớn) là hiệu ứng lao vào trận riêng biệt, không thuộc roster.
 *
 * Sân khấu nhảy (dancersByFaction): khi 1 fighter được tặng quà, họ tạm rời
 * đội hình, phóng to 3x, ra giữa màn hình nhảy theo phe (2 phe đối mặt nhau
 * qua tâm màn hình) — nhiều người nhảy cùng lúc thành nhóm, mỗi người rời
 * sân khấu theo thời lượng nhảy riêng của họ.
 */

const MAX_BOSSES = 4;
const BOSS_SPEED_PX_PER_SEC = 140;
const BOSS_LIFESPAN_MS = 4500;
const POSITION_LERP_SPEED = 5; // tốc độ nhân vật "chạy" vào đúng vị trí xếp hạng mới
const FORMATION_ROWS = 4;
const FORMATION_STEP_X = 24;
const FORMATION_ROW_GAP = 24;
const FORMATION_FRONT_GAP = 42; // khoảng cách từ vạch trung tâm tới hàng đầu

const MAX_DANCERS_PER_TEAM = 6;
const DANCE_SLOT_GAP_X = 90;
const DANCE_STAGE_Y_RATIO = 0.48;
const DANCE_STAGE_CENTER_GAP = 70;
const DANCER_SCALE = 3;

let nextSpriteId = 1;

function computeFormationSlot(rank, factionId, canvasWidth, canvasHeight) {
  const row = rank % FORMATION_ROWS;
  const col = Math.floor(rank / FORMATION_ROWS);
  const dir = factionId === 'blue' ? -1 : 1;
  const centerX = canvasWidth / 2;
  const baseY = canvasHeight * 0.62;

  return {
    x: centerX + dir * (FORMATION_FRONT_GAP + col * FORMATION_STEP_X),
    y: baseY + (row - (FORMATION_ROWS - 1) / 2) * FORMATION_ROW_GAP,
  };
}

function computeDanceSlot(index, factionId, canvasWidth, canvasHeight) {
  const dir = factionId === 'blue' ? -1 : 1;
  const centerX = canvasWidth / 2;
  const y = canvasHeight * DANCE_STAGE_Y_RATIO;
  return { x: centerX + dir * (DANCE_STAGE_CENTER_GAP + index * DANCE_SLOT_GAP_X), y };
}

export class SpritePool {
  constructor() {
    this.fighterSprites = new Map(); // userId -> sprite
    this.bosses = [];
    this.dancersByFaction = { blue: [], red: [] };
  }

  /** Đồng bộ roster 1 phe theo danh sách fighters mới nhất từ server. */
  syncFighters(factionId, fighterList, canvasWidth, canvasHeight) {
    const incomingIds = new Set(fighterList.map((f) => f.userId));

    // xoá sprite của người không còn trong danh sách hiển thị (bị vượt hạng, rớt khỏi cap)
    for (const [userId, sprite] of this.fighterSprites) {
      if (sprite.factionId === factionId && !incomingIds.has(userId)) {
        this.fighterSprites.delete(userId);
      }
    }

    fighterList.forEach((fighter, rank) => {
      const slot = computeFormationSlot(rank, factionId, canvasWidth, canvasHeight);
      const existing = this.fighterSprites.get(fighter.userId);

      if (existing) {
        existing.nickname = fighter.nickname;
        existing.score = fighter.score;
        existing.rank = rank;
        existing.targetX = slot.x;
        existing.targetY = slot.y;
      } else {
        this.fighterSprites.set(fighter.userId, {
          id: nextSpriteId++,
          userId: fighter.userId,
          nickname: fighter.nickname,
          factionId,
          score: fighter.score,
          rank,
          x: slot.x,
          y: slot.y,
          targetX: slot.x,
          targetY: slot.y,
          bobPhase: Math.random() * Math.PI * 2,
          pulseUntil: 0,
        });
      }
    });
  }

  /** Hiệu ứng nhấn nổi bật nhân vật khi họ vừa tặng quà (không đổi vị trí). */
  pulseFighter(userId, durationMs = 500) {
    const sprite = this.fighterSprites.get(userId);
    if (sprite) sprite.pulseUntil = performance.now() + durationMs;
  }

  isDancing(userId) {
    return (
      this.dancersByFaction.blue.some((d) => d.userId === userId) ||
      this.dancersByFaction.red.some((d) => d.userId === userId)
    );
  }

  /** Đưa 1 fighter ra sân khấu giữa màn hình nhảy — trả về false nếu sân khấu phe đó đã đầy. */
  spawnDancer({ userId, nickname, factionId, danceStyleId, durationMs }, canvasWidth, canvasHeight) {
    const list = this.dancersByFaction[factionId];
    if (!list) return false;

    const existing = list.find((d) => d.userId === userId);
    if (existing) {
      existing.danceStyleId = danceStyleId;
      existing.durationMs = Math.max(existing.durationMs, durationMs);
      existing.startedAt = performance.now();
      return true;
    }

    if (list.length >= MAX_DANCERS_PER_TEAM) return false; // sân khấu đầy, bỏ qua an toàn (không lỗi)

    const formationSprite = this.fighterSprites.get(userId);
    const startX = formationSprite ? formationSprite.x : (factionId === 'blue' ? 0 : canvasWidth);
    const startY = formationSprite ? formationSprite.y : canvasHeight * 0.62;

    list.push({
      id: nextSpriteId++,
      userId,
      nickname,
      factionId,
      danceStyleId,
      startedAt: performance.now(),
      durationMs,
      x: startX,
      y: startY,
      scale: 1,
      targetX: startX,
      targetY: startY,
      targetScale: DANCER_SCALE,
    });

    this._recomputeDanceSlots(factionId, canvasWidth, canvasHeight);
    return true;
  }

  _recomputeDanceSlots(factionId, canvasWidth, canvasHeight) {
    const list = this.dancersByFaction[factionId];
    list.forEach((dancer, index) => {
      const slot = computeDanceSlot(index, factionId, canvasWidth, canvasHeight);
      dancer.targetX = slot.x;
      dancer.targetY = slot.y;
      dancer.targetScale = DANCER_SCALE;
    });
  }

  spawnBoss(factionId, canvasWidth, canvasHeight) {
    const isBlue = factionId === 'blue';
    this.bosses.push({
      id: nextSpriteId++,
      factionId,
      x: isBlue ? canvasWidth * 0.04 : canvasWidth * 0.96,
      y: canvasHeight * 0.6,
      targetX: isBlue ? canvasWidth * 0.92 : canvasWidth * 0.08,
      spawnedAt: performance.now(),
    });

    if (this.bosses.length > MAX_BOSSES) {
      this.bosses.splice(0, this.bosses.length - MAX_BOSSES);
    }
  }

  update(dtSeconds, canvasWidth, canvasHeight) {
    const lerpFactor = Math.min(1, dtSeconds * POSITION_LERP_SPEED);
    for (const sprite of this.fighterSprites.values()) {
      sprite.x += (sprite.targetX - sprite.x) * lerpFactor;
      sprite.y += (sprite.targetY - sprite.y) * lerpFactor;
      sprite.bobPhase += dtSeconds * 4;
    }

    for (const b of this.bosses) {
      const distance = b.targetX - b.x;
      if (Math.abs(distance) > 2) {
        b.x += Math.sign(distance) * BOSS_SPEED_PX_PER_SEC * dtSeconds;
      }
    }

    const now = performance.now();
    this.bosses = this.bosses.filter((b) => now - b.spawnedAt < BOSS_LIFESPAN_MS);

    for (const factionId of Object.keys(this.dancersByFaction)) {
      const list = this.dancersByFaction[factionId];
      let anyRemoved = false;

      for (let i = list.length - 1; i >= 0; i -= 1) {
        const dancer = list[i];
        dancer.x += (dancer.targetX - dancer.x) * lerpFactor;
        dancer.y += (dancer.targetY - dancer.y) * lerpFactor;
        dancer.scale += (dancer.targetScale - dancer.scale) * lerpFactor;

        if (now - dancer.startedAt >= dancer.durationMs) {
          list.splice(i, 1);
          anyRemoved = true;
        }
      }

      if (anyRemoved) this._recomputeDanceSlots(factionId, canvasWidth, canvasHeight);
    }
  }

  clear() {
    this.fighterSprites.clear();
    this.bosses.length = 0;
    this.dancersByFaction.blue.length = 0;
    this.dancersByFaction.red.length = 0;
  }
}
