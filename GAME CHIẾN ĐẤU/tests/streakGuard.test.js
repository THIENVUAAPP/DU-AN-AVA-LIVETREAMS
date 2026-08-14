import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldApplyGiftEvent, getRepeatCount } from '../src/server/streakGuard.js';

test('quà không streakable (giftType !== 1) áp dụng ngay', () => {
  const event = { giftDetails: { giftType: 0 }, repeatCount: 1 };
  assert.equal(shouldApplyGiftEvent(event), true);
});

test('quà streakable đang combo (repeatEnd chưa true) KHÔNG áp dụng', () => {
  const tickEvents = [
    { giftDetails: { giftType: 1 }, repeatCount: 1, repeatEnd: false },
    { giftDetails: { giftType: 1 }, repeatCount: 2, repeatEnd: false },
    { giftDetails: { giftType: 1 }, repeatCount: 5, repeatEnd: false },
  ];
  for (const event of tickEvents) {
    assert.equal(shouldApplyGiftEvent(event), false, `tick repeatCount=${event.repeatCount} không được áp dụng`);
  }
});

test('quà streakable kết thúc combo (repeatEnd:true) áp dụng đúng 1 lần với repeatCount cuối', () => {
  const finalEvent = { giftDetails: { giftType: 1 }, repeatCount: 5, repeatEnd: true };
  assert.equal(shouldApplyGiftEvent(finalEvent), true);
  assert.equal(getRepeatCount(finalEvent), 5);
});

test('combo 5 lần chỉ tính đúng 1 lần khi xử lý tuần tự toàn bộ chuỗi event', () => {
  const sequence = [
    { giftDetails: { giftType: 1 }, repeatCount: 1, repeatEnd: false },
    { giftDetails: { giftType: 1 }, repeatCount: 2, repeatEnd: false },
    { giftDetails: { giftType: 1 }, repeatCount: 3, repeatEnd: false },
    { giftDetails: { giftType: 1 }, repeatCount: 4, repeatEnd: false },
    { giftDetails: { giftType: 1 }, repeatCount: 5, repeatEnd: true },
  ];
  let appliedCount = 0;
  let appliedRepeatCount = 0;
  for (const event of sequence) {
    if (shouldApplyGiftEvent(event)) {
      appliedCount += 1;
      appliedRepeatCount = getRepeatCount(event);
    }
  }
  assert.equal(appliedCount, 1);
  assert.equal(appliedRepeatCount, 5);
});

test('repeatCount không hợp lệ mặc định về 1', () => {
  assert.equal(getRepeatCount({ repeatCount: 0 }), 1);
  assert.equal(getRepeatCount({ repeatCount: -3 }), 1);
  assert.equal(getRepeatCount({}), 1);
  assert.equal(getRepeatCount(null), 1);
});

test('event null/undefined không áp dụng, không throw', () => {
  assert.equal(shouldApplyGiftEvent(null), false);
  assert.equal(shouldApplyGiftEvent(undefined), false);
});
