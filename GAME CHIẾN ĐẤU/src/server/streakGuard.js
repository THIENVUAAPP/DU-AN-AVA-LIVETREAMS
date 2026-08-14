/**
 * Xử lý gift-streak của TikTok LIVE: quà "streakable" (giftType === 1) bắn
 * event liên tục trong lúc người xem giữ combo, chỉ event cuối có
 * repeatEnd:true mới là điểm áp dụng sát thương/hồi máu đúng 1 lần.
 * Quà không streakable (giftType !== 1) áp dụng ngay lần đầu.
 */

export function isStreakableGift(giftEventData) {
  return giftEventData?.giftDetails?.giftType === 1;
}

export function shouldApplyGiftEvent(giftEventData) {
  if (!giftEventData) return false;
  if (isStreakableGift(giftEventData)) {
    return giftEventData.repeatEnd === true;
  }
  return true;
}

export function getRepeatCount(giftEventData) {
  const count = giftEventData?.repeatCount;
  return Number.isInteger(count) && count > 0 ? count : 1;
}
