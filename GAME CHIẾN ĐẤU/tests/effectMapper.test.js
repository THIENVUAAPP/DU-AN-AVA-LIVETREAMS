import test from 'node:test';
import assert from 'node:assert/strict';
import { buildGiftEffectPayload, ALLOWED_EFFECT_FIELDS } from '../src/server/effectMapper.js';

const BANNED_KEYWORD_PATTERN = /urgen|panic|hurry|scare|warning|deadline|khan.?hiem|canh.?bao|gap.?rut/i;

test('buildGiftEffectPayload trả về null nếu giftApplyResult không applied', () => {
  assert.equal(buildGiftEffectPayload({ giftApplyResult: { applied: false }, tierId: 'small' }), null);
  assert.equal(buildGiftEffectPayload({ giftApplyResult: null, tierId: 'small' }), null);
});

test('payload chỉ chứa field nằm trong ALLOWED_EFFECT_FIELDS, không có field lạ', () => {
  const payload = buildGiftEffectPayload({
    giftApplyResult: {
      applied: true,
      factionId: 'blue',
      opponentFactionId: 'red',
      effect: 'aoeSkill',
      opponentDamage: 80,
      ownFactionHeal: 0,
      summonCount: 0,
      isComeback: false,
      spotlightDurationMs: 0,
    },
    donorNickname: 'Nguoi Xem A',
    donorAvatarUrl: 'https://example.com/avatar.jpg',
    tierId: 'medium',
  });

  for (const key of Object.keys(payload)) {
    assert.ok(ALLOWED_EFFECT_FIELDS.includes(key), `field lạ không được phép: ${key}`);
  }
});

test('payload không chứa bất kỳ field nào mang tính hối thúc/hù dọa chi tiêu', () => {
  const payload = buildGiftEffectPayload({
    giftApplyResult: {
      applied: true,
      factionId: 'red',
      opponentFactionId: 'blue',
      effect: 'summonBoss',
      opponentDamage: 250,
      ownFactionHeal: 0,
      summonCount: 1,
      isComeback: true,
      spotlightDurationMs: 5000,
    },
    donorNickname: 'Nguoi Xem B',
    tierId: 'large',
  });

  for (const key of Object.keys(payload)) {
    assert.doesNotMatch(key, BANNED_KEYWORD_PATTERN, `field "${key}" nghi ngờ mang tính hối thúc`);
  }
});

test('donorNickname/donorAvatarUrl mặc định null khi không truyền', () => {
  const payload = buildGiftEffectPayload({
    giftApplyResult: { applied: true, factionId: 'blue', opponentFactionId: 'red', opponentDamage: 5 },
    tierId: 'small',
  });
  assert.equal(payload.donorNickname, null);
  assert.equal(payload.donorAvatarUrl, null);
});
