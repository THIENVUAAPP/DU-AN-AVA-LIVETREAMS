/**
 * Map giá trị quà (diamondCount) sang 1 trong 20 kiểu nhảy + thời lượng nhảy.
 * Dùng thang log vì giá trị quà trải rất rộng (1 xu đến hơn 30.000 xu) — thang
 * tuyến tính sẽ khiến gần như mọi quà rơi vào kiểu nhảy thấp nhất.
 *
 * Quà thấp nhất (1 xu) → kiểu 1, nhảy 3s. Quà cao nhất (~35.000 xu trở lên)
 * → kiểu 20, nhảy 10s. Danh sách tên 20 kiểu nhảy (phần hiển thị/hoạt ảnh
 * thật nằm ở client, public/js/renderer/danceStyles.js) để 2 bên khớp ID.
 */

export const DANCE_STYLE_COUNT = 20;
export const MIN_DANCE_DURATION_MS = 3000;
export const MAX_DANCE_DURATION_MS = 10000;

const MIN_COINS_FOR_SCALE = 1;
const MAX_COINS_FOR_SCALE = 35000;

export function resolveDanceForGift(diamondCount) {
  const coins = Math.max(MIN_COINS_FOR_SCALE, Number(diamondCount) || MIN_COINS_FOR_SCALE);
  const logMin = Math.log(MIN_COINS_FOR_SCALE);
  const logMax = Math.log(MAX_COINS_FOR_SCALE);
  const progress = Math.min(1, Math.max(0, (Math.log(coins) - logMin) / (logMax - logMin)));

  const danceStyleId = 1 + Math.min(DANCE_STYLE_COUNT - 1, Math.floor(progress * DANCE_STYLE_COUNT));
  const durationMs = Math.round(MIN_DANCE_DURATION_MS + progress * (MAX_DANCE_DURATION_MS - MIN_DANCE_DURATION_MS));

  return { danceStyleId, durationMs };
}
