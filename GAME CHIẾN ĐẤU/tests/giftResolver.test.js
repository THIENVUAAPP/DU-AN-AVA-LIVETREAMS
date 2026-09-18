import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { resolveGiftTier, computeGiftImpact } from '../src/server/giftResolver.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const giftsConfig = JSON.parse(readFileSync(join(__dirname, '../config/gifts.json'), 'utf8'));

test('quà giá trị nhỏ (1-99 xu) khớp tier small', () => {
  const { tier, matchedByRange } = resolveGiftTier(giftsConfig, 1);
  assert.equal(tier.id, 'small');
  assert.equal(matchedByRange, true);

  const { tier: tier99 } = resolveGiftTier(giftsConfig, 99);
  assert.equal(tier99.id, 'small');
});

test('quà giá trị trung (100-5000 xu) khớp tier medium', () => {
  const { tier } = resolveGiftTier(giftsConfig, 100);
  assert.equal(tier.id, 'medium');

  const { tier: tierMax } = resolveGiftTier(giftsConfig, 5000);
  assert.equal(tierMax.id, 'medium');
});

test('quà giá trị lớn (>5000 xu) khớp tier large, không giới hạn trên', () => {
  const { tier } = resolveGiftTier(giftsConfig, 5001);
  assert.equal(tier.id, 'large');

  const { tier: tierHuge } = resolveGiftTier(giftsConfig, 999999);
  assert.equal(tierHuge.id, 'large');
});

test('giftId/giá trị không xác định (0 hoặc âm) fallback an toàn về tier small, không throw', () => {
  const { tier, matchedByRange } = resolveGiftTier(giftsConfig, 0);
  assert.equal(tier.id, 'small');
  assert.equal(matchedByRange, false);

  const { tier: tierNeg } = resolveGiftTier(giftsConfig, -5);
  assert.equal(tierNeg.id, 'small');

  const { tier: tierNaN } = resolveGiftTier(giftsConfig, NaN);
  assert.equal(tierNaN.id, 'small');
});

test('computeGiftImpact nhân đúng theo repeatCount', () => {
  const { tier } = resolveGiftTier(giftsConfig, 50); // small: ownFactionHeal 20, summonCount 1
  const impact = computeGiftImpact(tier, 5);
  assert.equal(impact.ownFactionHeal, 100);
  assert.equal(impact.summonCount, 5);
  assert.equal(impact.repeatCount, 5);
});

test('computeGiftImpact mặc định repeatCount=1 khi không truyền', () => {
  const { tier } = resolveGiftTier(giftsConfig, 200); // medium: opponentDamage 80
  const impact = computeGiftImpact(tier);
  assert.equal(impact.opponentDamage, 80);
  assert.equal(impact.repeatCount, 1);
});

test('computeGiftImpact trả về null nếu tier null', () => {
  assert.equal(computeGiftImpact(null, 3), null);
});
