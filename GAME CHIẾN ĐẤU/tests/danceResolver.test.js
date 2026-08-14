import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveDanceForGift, DANCE_STYLE_COUNT, MIN_DANCE_DURATION_MS, MAX_DANCE_DURATION_MS } from '../src/server/danceResolver.js';

test('quà thấp nhất (1 xu) -> kiểu nhảy 1, thời lượng tối thiểu 3s', () => {
  const { danceStyleId, durationMs } = resolveDanceForGift(1);
  assert.equal(danceStyleId, 1);
  assert.equal(durationMs, MIN_DANCE_DURATION_MS);
});

test('quà cực lớn (>=35000 xu) -> kiểu nhảy 20, thời lượng tối đa 10s', () => {
  const { danceStyleId, durationMs } = resolveDanceForGift(35000);
  assert.equal(danceStyleId, DANCE_STYLE_COUNT);
  assert.equal(durationMs, MAX_DANCE_DURATION_MS);

  const huge = resolveDanceForGift(999999);
  assert.equal(huge.danceStyleId, DANCE_STYLE_COUNT);
  assert.equal(huge.durationMs, MAX_DANCE_DURATION_MS);
});

test('danceStyleId luôn nằm trong khoảng 1-20, durationMs luôn trong 3000-10000', () => {
  const sampleCoins = [1, 5, 10, 50, 99, 100, 500, 1000, 5000, 5001, 10000, 20000, 34999, 100000];
  for (const coins of sampleCoins) {
    const { danceStyleId, durationMs } = resolveDanceForGift(coins);
    assert.ok(danceStyleId >= 1 && danceStyleId <= 20, `danceStyleId ${danceStyleId} phải trong 1-20 (coins=${coins})`);
    assert.ok(durationMs >= MIN_DANCE_DURATION_MS && durationMs <= MAX_DANCE_DURATION_MS, `durationMs ${durationMs} phải trong 3000-10000 (coins=${coins})`);
  }
});

test('quà giá trị cao hơn luôn có kiểu nhảy/thời lượng >= quà giá trị thấp hơn (đơn điệu tăng)', () => {
  const sampleCoins = [1, 10, 50, 100, 500, 1000, 5000, 10000, 20000, 35000];
  let prevStyle = 0;
  let prevDuration = 0;
  for (const coins of sampleCoins) {
    const { danceStyleId, durationMs } = resolveDanceForGift(coins);
    assert.ok(danceStyleId >= prevStyle, `kiểu nhảy phải không giảm khi coins tăng (${coins})`);
    assert.ok(durationMs >= prevDuration, `thời lượng phải không giảm khi coins tăng (${coins})`);
    prevStyle = danceStyleId;
    prevDuration = durationMs;
  }
});

test('giá trị không hợp lệ (0, âm, NaN, undefined) fallback an toàn về kiểu nhảy 1, không throw', () => {
  for (const invalid of [0, -5, NaN, undefined, null]) {
    const { danceStyleId, durationMs } = resolveDanceForGift(invalid);
    assert.equal(danceStyleId, 1);
    assert.equal(durationMs, MIN_DANCE_DURATION_MS);
  }
});
