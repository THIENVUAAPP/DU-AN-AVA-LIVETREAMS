/**
 * Xác định tier (nhỏ/trung/lớn) của 1 quà tặng dựa trên giá trị xu, và tính
 * hiệu ứng thực tế cần áp dụng (đã nhân theo repeatCount của combo streak).
 */

export function resolveGiftTier(giftsConfig, diamondCount) {
  const coins = Number.isFinite(diamondCount) && diamondCount > 0 ? diamondCount : 0;
  const tiers = giftsConfig?.tiers || [];

  const matched = tiers.find((tier) => {
    const min = tier.minCoins ?? 0;
    const max = tier.maxCoins;
    return coins >= min && (max === null || max === undefined || coins <= max);
  });

  if (matched) {
    return { tier: matched, matchedByRange: true };
  }

  const fallbackTier = tiers.find((t) => t.id === giftsConfig?.fallbackTierId) || tiers[0] || null;
  return { tier: fallbackTier, matchedByRange: false };
}

export function computeGiftImpact(tier, repeatCount = 1) {
  if (!tier) return null;
  const count = Number.isInteger(repeatCount) && repeatCount > 0 ? repeatCount : 1;

  return {
    tierId: tier.id,
    effect: tier.effect,
    opponentDamage: (tier.opponentDamage || 0) * count,
    ownFactionHeal: (tier.ownFactionHeal || 0) * count,
    summonCount: (tier.summonCount || 0) * count,
    spotlightDurationMs: tier.spotlightDurationMs || 0,
    repeatCount: count,
  };
}
