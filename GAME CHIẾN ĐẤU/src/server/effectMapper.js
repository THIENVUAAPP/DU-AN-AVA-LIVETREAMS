/**
 * Chuyển kết quả applyGiftImpact() của battleState thành payload gửi cho
 * client qua Socket.IO. Payload chỉ chứa đúng danh sách field cho phép —
 * không có chỗ cho field kiểu cảnh báo/khẩn cấp/thúc giục chi tiền.
 */

export const ALLOWED_EFFECT_FIELDS = Object.freeze([
  'type',
  'userId',
  'factionId',
  'opponentFactionId',
  'effect',
  'opponentDamage',
  'ownFactionHeal',
  'summonCount',
  'isComeback',
  'spotlightDurationMs',
  'donorNickname',
  'donorAvatarUrl',
  'tierId',
  'danceStyleId',
  'danceDurationMs',
  'timestamp',
]);

export function buildGiftEffectPayload({
  giftApplyResult,
  donorNickname,
  donorAvatarUrl,
  tierId,
  danceStyleId,
  danceDurationMs,
}) {
  if (!giftApplyResult || !giftApplyResult.applied) return null;

  return {
    type: 'gift-effect',
    userId: giftApplyResult.userId || null,
    factionId: giftApplyResult.factionId,
    opponentFactionId: giftApplyResult.opponentFactionId,
    effect: giftApplyResult.effect,
    opponentDamage: giftApplyResult.opponentDamage,
    ownFactionHeal: giftApplyResult.ownFactionHeal,
    summonCount: giftApplyResult.summonCount,
    isComeback: giftApplyResult.isComeback,
    spotlightDurationMs: giftApplyResult.spotlightDurationMs,
    donorNickname: donorNickname || null,
    donorAvatarUrl: donorAvatarUrl || null,
    tierId,
    danceStyleId: danceStyleId || null,
    danceDurationMs: danceDurationMs || null,
    timestamp: Date.now(),
  };
}
