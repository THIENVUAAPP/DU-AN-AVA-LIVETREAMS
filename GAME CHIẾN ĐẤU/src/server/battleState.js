/**
 * Trạng thái trận đấu server-authoritative: HP 2 phe, gán phe theo comment,
 * auto-balance, cộng sát thương/hồi máu từ quà, comeback buff nhẹ khi thua,
 * phát hiện kết thúc trận và tổng hợp top người ủng hộ.
 *
 * Mỗi người xem (comment hoặc tặng quà) là 1 "fighter" có tên riêng, tồn tại
 * xuyên suốt trận đấu — điểm đóng góp (score) quyết định vị trí đứng gần/xa
 * hàng đầu khi hiển thị (client tự tính vị trí dựa trên rank trong danh sách
 * fighters do server trả về, sắp theo score giảm dần).
 */

const DEFAULT_MAX_VISIBLE_FIGHTERS = 24;
const DEFAULT_MAX_CEREMONY_NAMES = 16;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function normalizeVietnamese(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd');
}

export class BattleState {
  constructor(themeConfig) {
    this.factionIds = Object.keys(themeConfig.factions);
    if (this.factionIds.length !== 2) {
      throw new Error('BattleState chỉ hỗ trợ đúng 2 phe — theme.json cấu hình sai số lượng phe.');
    }

    this.themeConfig = themeConfig;
    this.maxHp = themeConfig.battle.maxHpPerFaction;
    this.comebackThresholdPercent = themeConfig.battle.comebackHpPercentThreshold;
    this.comebackDamageMultiplier = themeConfig.battle.comebackDamageMultiplier;
    this.comebackHealMultiplier = themeConfig.battle.comebackHealMultiplier;
    this.leaderboardTopCount = themeConfig.battle.leaderboardTopCount;
    this.resultsTopSupportersCount = themeConfig.battle.resultsTopSupportersCount;
    this.maxVisibleFightersPerFaction = themeConfig.battle.maxVisibleFightersPerFaction ?? DEFAULT_MAX_VISIBLE_FIGHTERS;
    this.maxCeremonyNames = themeConfig.battle.maxCeremonyNames ?? DEFAULT_MAX_CEREMONY_NAMES;

    this.keywordToFaction = new Map();
    for (const [factionId, faction] of Object.entries(themeConfig.factions)) {
      for (const keyword of faction.commentKeywords || []) {
        this.keywordToFaction.set(normalizeVietnamese(keyword), factionId);
      }
    }

    this._resetInternal();
  }

  resetMatch() {
    this._resetInternal();
  }

  _resetInternal() {
    this.hp = Object.fromEntries(this.factionIds.map((id) => [id, this.maxHp]));
    this.fighters = new Map(); // userId -> { userId, nickname, factionId, score }
    this.matchEnded = false;
    this.winnerFactionId = null;
  }

  _opponentOf(factionId) {
    return this.factionIds.find((id) => id !== factionId);
  }

  _hpPercent(factionId) {
    return (this.hp[factionId] / this.maxHp) * 100;
  }

  _factionCounts() {
    const counts = Object.fromEntries(this.factionIds.map((id) => [id, 0]));
    for (const fighter of this.fighters.values()) {
      if (counts[fighter.factionId] !== undefined) counts[fighter.factionId] += 1;
    }
    return counts;
  }

  _commentMatchesFaction(commentText) {
    const normalized = normalizeVietnamese(commentText);
    const words = normalized.split(/[^a-z0-9]+/).filter(Boolean);
    for (const word of words) {
      if (this.keywordToFaction.has(word)) return this.keywordToFaction.get(word);
    }
    return null;
  }

  _upsertFighter(userId, nickname, factionId, scoreDelta = 0, avatarUrl = null) {
    const existing = this.fighters.get(userId);
    if (existing) {
      existing.score += scoreDelta;
      existing.factionId = factionId;
      if (nickname) existing.nickname = nickname;
      if (avatarUrl) existing.avatarUrl = avatarUrl;
      return existing;
    }
    const fighter = { userId, nickname: nickname || userId, factionId, score: scoreDelta, avatarUrl: avatarUrl || null };
    this.fighters.set(userId, fighter);
    return fighter;
  }

  assignFactionByComment(userId, commentText, nickname, avatarUrl) {
    if (this.matchEnded || !userId) return null;
    const factionId = this._commentMatchesFaction(commentText);
    if (!factionId) return null;
    this._upsertFighter(userId, nickname, factionId, 0, avatarUrl);
    return factionId;
  }

  getOrAutoAssignFaction(userId, nickname, avatarUrl) {
    const existing = this.fighters.get(userId);
    if (existing) {
      if (nickname) existing.nickname = nickname;
      if (avatarUrl) existing.avatarUrl = avatarUrl;
      return existing.factionId;
    }

    const counts = this._factionCounts();
    let chosen = this.factionIds[0];
    let minCount = Infinity;
    for (const id of this.factionIds) {
      if (counts[id] < minCount) {
        minCount = counts[id];
        chosen = id;
      }
    }
    this._upsertFighter(userId, nickname, chosen, 0, avatarUrl);
    return chosen;
  }

  setMaxHp(value) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) return false;
    this.maxHp = parsed;
    for (const factionId of this.factionIds) {
      this.hp[factionId] = Math.min(this.hp[factionId], this.maxHp);
    }
    return true;
  }

  setComebackThreshold(percent) {
    const parsed = Number(percent);
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) return false;
    this.comebackThresholdPercent = parsed;
    return true;
  }

  /** Kết thúc trận thủ công (nút Admin) — phe đang nhiều HP hơn thắng ngay. */
  forceEndMatch() {
    if (this.matchEnded) return false;
    const [factionA, factionB] = this.factionIds;
    const defeatedFactionId = this.hp[factionA] <= this.hp[factionB] ? factionA : factionB;
    this.hp[defeatedFactionId] = 0;
    return this._checkMatchEnd();
  }

  _checkMatchEnd() {
    if (this.matchEnded) return true;
    const defeatedFactionId = this.factionIds.find((id) => this.hp[id] <= 0);
    if (defeatedFactionId) {
      this.matchEnded = true;
      this.winnerFactionId = this._opponentOf(defeatedFactionId);
      return true;
    }
    return false;
  }

  applyGiftImpact({ userId, nickname, avatarUrl, impact, coinsSpent }) {
    if (this.matchEnded) return { applied: false, reason: 'match-ended' };
    if (!userId || !impact) return { applied: false, reason: 'invalid-input' };

    const factionId = this.getOrAutoAssignFaction(userId, nickname, avatarUrl);
    const opponentFactionId = this._opponentOf(factionId);
    const isComeback = this._hpPercent(factionId) < this.comebackThresholdPercent;
    const damageMultiplier = isComeback ? this.comebackDamageMultiplier : 1;
    const healMultiplier = isComeback ? this.comebackHealMultiplier : 1;

    const opponentDamage = Math.round((impact.opponentDamage || 0) * damageMultiplier);
    const ownFactionHeal = Math.round((impact.ownFactionHeal || 0) * healMultiplier);

    if (opponentDamage > 0) {
      this.hp[opponentFactionId] = clamp(this.hp[opponentFactionId] - opponentDamage, 0, this.maxHp);
    }
    if (ownFactionHeal > 0) {
      this.hp[factionId] = clamp(this.hp[factionId] + ownFactionHeal, 0, this.maxHp);
    }

    // Điểm leaderboard/MVP tính theo đúng số xu TikTok thật đã tặng (coinsSpent) —
    // không phải theo sát thương/hồi máu tự quy đổi. Fallback về damage+heal chỉ
    // khi không có coinsSpent hợp lệ (vd gọi nội bộ/test không truyền giá trị xu).
    const scoreDelta = Number.isFinite(coinsSpent) && coinsSpent > 0
      ? coinsSpent
      : opponentDamage + ownFactionHeal;

    this._upsertFighter(userId, nickname, factionId, scoreDelta, avatarUrl);
    const matchEndedNow = this._checkMatchEnd();

    return {
      applied: true,
      userId,
      factionId,
      opponentFactionId,
      isComeback,
      opponentDamage,
      ownFactionHeal,
      summonCount: impact.summonCount || 0,
      effect: impact.effect,
      spotlightDurationMs: impact.spotlightDurationMs || 0,
      matchEnded: matchEndedNow,
    };
  }

  getFactionFighters(factionId, limit = this.maxVisibleFightersPerFaction) {
    return [...this.fighters.values()]
      .filter((f) => f.factionId === factionId)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  getLeaderboard(limit = this.leaderboardTopCount) {
    return [...this.fighters.values()]
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  getMatchResults() {
    if (!this.matchEnded) return null;

    const winningTeamAll = [...this.fighters.values()]
      .filter((f) => f.factionId === this.winnerFactionId)
      .sort((a, b) => b.score - a.score);
    const losingFactionId = this._opponentOf(this.winnerFactionId);

    return {
      winnerFactionId: this.winnerFactionId,
      mvp: winningTeamAll[0] || null,
      winningTeam: winningTeamAll.slice(0, this.maxCeremonyNames),
      winningTeamTotalCount: winningTeamAll.length,
      losingTeamTop: this.getFactionFighters(losingFactionId, this.resultsTopSupportersCount),
    };
  }

  getSnapshot() {
    const fighters = {};
    const factionCounts = this._factionCounts();
    for (const factionId of this.factionIds) {
      fighters[factionId] = this.getFactionFighters(factionId);
    }

    return {
      hp: { ...this.hp },
      maxHp: this.maxHp,
      matchEnded: this.matchEnded,
      winnerFactionId: this.winnerFactionId,
      factionCounts,
      fighters,
      leaderboard: this.getLeaderboard(),
    };
  }
}
