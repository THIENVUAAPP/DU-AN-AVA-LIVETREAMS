/**
 * 20 kiểu nhảy (id 1-20), sinh chuyển động bằng công thức tham số (sóng
 * sin/cos) trên silhouette nhân vật có sẵn — không cần asset ngoài.
 *
 * QUAN TRỌNG: không có kiểu nào xoay/lộn toàn thân (không dùng ctx.rotate) —
 * chỉ vung tay, đá chân, nhún người, nghiêng người như đang tập thể dục/
 * aerobic. Cấp độ cao hơn (id lớn hơn) có biên độ/tốc độ/số chuyển động kết
 * hợp nhiều hơn (tay + chân + nhảy bật cùng lúc) + hiệu ứng lấp lánh, để
 * "quà càng cao nhảy càng đẹp". ID phải khớp với
 * src/server/danceResolver.js (server chỉ chọn ID, phần hoạt ảnh thật nằm
 * ở đây).
 */

export const DANCE_STYLES = [
  { id: 1, name: 'Vươn Vai', bounceFreq: 1, bounceAmp: 2, swayFreq: 0.5, swayAmp: 3, armFreq: 1, armAmp: 10, legFreq: 0, legAmp: 0, jumpFreq: 0, jumpHeight: 0, sparkle: false, colorPulse: false },
  { id: 2, name: 'Gật Đầu Theo Nhịp', bounceFreq: 2, bounceAmp: 3, swayFreq: 0, swayAmp: 0, armFreq: 0.5, armAmp: 8, legFreq: 0, legAmp: 0, jumpFreq: 0, jumpHeight: 0, sparkle: false, colorPulse: false },
  { id: 3, name: 'Đung Đưa Hông', bounceFreq: 1, bounceAmp: 2, swayFreq: 1.5, swayAmp: 6, armFreq: 1.5, armAmp: 12, legFreq: 0, legAmp: 0, jumpFreq: 0, jumpHeight: 0, sparkle: false, colorPulse: false },
  { id: 4, name: 'Bước Đều Tại Chỗ', bounceFreq: 2, bounceAmp: 4, swayFreq: 0, swayAmp: 0, armFreq: 2, armAmp: 10, legFreq: 2, legAmp: 10, jumpFreq: 0, jumpHeight: 0, sparkle: false, colorPulse: false },
  { id: 5, name: 'Vẫy Tay Chào', bounceFreq: 1, bounceAmp: 2, swayFreq: 0.5, swayAmp: 4, armFreq: 3, armAmp: 20, legFreq: 0, legAmp: 0, jumpFreq: 0, jumpHeight: 0, sparkle: false, colorPulse: false },
  { id: 6, name: 'Nhún Nhảy Nhẹ', bounceFreq: 2.5, bounceAmp: 6, swayFreq: 1, swayAmp: 5, armFreq: 2, armAmp: 15, legFreq: 0, legAmp: 0, jumpFreq: 0, jumpHeight: 0, sparkle: false, colorPulse: false },
  { id: 7, name: 'Vặn Người Nhẹ', bounceFreq: 1, bounceAmp: 3, swayFreq: 1.2, swayAmp: 9, armFreq: 1.2, armAmp: 12, legFreq: 0, legAmp: 0, jumpFreq: 0, jumpHeight: 0, sparkle: false, colorPulse: false },
  { id: 8, name: 'Lắc Hông Thể Dục', bounceFreq: 1.5, bounceAmp: 3, swayFreq: 2.5, swayAmp: 10, armFreq: 1, armAmp: 10, legFreq: 0, legAmp: 0, jumpFreq: 0, jumpHeight: 0, sparkle: false, colorPulse: false },
  { id: 9, name: 'Nhảy Cóc', bounceFreq: 0, bounceAmp: 0, swayFreq: 1, swayAmp: 5, armFreq: 1, armAmp: 10, legFreq: 0, legAmp: 0, jumpFreq: 1.5, jumpHeight: 14, sparkle: false, colorPulse: false },
  { id: 10, name: 'Vung Tay Mạnh', bounceFreq: 2, bounceAmp: 4, swayFreq: 1, swayAmp: 6, armFreq: 2.5, armAmp: 26, legFreq: 0, legAmp: 0, jumpFreq: 0, jumpHeight: 0, sparkle: false, colorPulse: false },
  { id: 11, name: 'Đấm Bốc Nhẹ', bounceFreq: 1, bounceAmp: 3, swayFreq: 0.8, swayAmp: 5, armFreq: 3, armAmp: 22, legFreq: 1, legAmp: 6, jumpFreq: 0, jumpHeight: 0, sparkle: false, colorPulse: false },
  { id: 12, name: 'Jumping Jack', bounceFreq: 0, bounceAmp: 0, swayFreq: 0, swayAmp: 0, armFreq: 2, armAmp: 30, legFreq: 2, legAmp: 16, jumpFreq: 2, jumpHeight: 10, sparkle: true, colorPulse: false },
  { id: 13, name: 'Sóng Cơ Thể', bounceFreq: 3, bounceAmp: 5, swayFreq: 2, swayAmp: 9, armFreq: 2, armAmp: 16, legFreq: 0, legAmp: 0, jumpFreq: 0, jumpHeight: 0, sparkle: true, colorPulse: false },
  { id: 14, name: 'Đá Chân Luân Phiên', bounceFreq: 1, bounceAmp: 2, swayFreq: 0, swayAmp: 0, armFreq: 1.5, armAmp: 14, legFreq: 2.2, legAmp: 20, jumpFreq: 0, jumpHeight: 0, sparkle: true, colorPulse: false },
  { id: 15, name: 'Nhảy Bật Cao', bounceFreq: 0, bounceAmp: 0, swayFreq: 1, swayAmp: 4, armFreq: 2, armAmp: 20, legFreq: 0, legAmp: 0, jumpFreq: 1.2, jumpHeight: 26, sparkle: true, colorPulse: false },
  { id: 16, name: 'Squat Nhịp Điệu', bounceFreq: 1.4, bounceAmp: 10, swayFreq: 0, swayAmp: 0, armFreq: 1.4, armAmp: 16, legFreq: 1.4, legAmp: 8, jumpFreq: 0, jumpHeight: 0, sparkle: true, colorPulse: false },
  { id: 17, name: 'Robot Dance', bounceFreq: 4, bounceAmp: 3, swayFreq: 0, swayAmp: 0, armFreq: 4, armAmp: 22, legFreq: 4, legAmp: 6, jumpFreq: 0, jumpHeight: 0, sparkle: true, colorPulse: false },
  { id: 18, name: 'Gập Bụng Nhịp Điệu', bounceFreq: 2, bounceAmp: 6, swayFreq: 0, swayAmp: 0, armFreq: 2, armAmp: 18, legFreq: 1, legAmp: 10, jumpFreq: 0.9, jumpHeight: 16, sparkle: true, colorPulse: true },
  { id: 19, name: 'Cardio Rực Lửa', bounceFreq: 3, bounceAmp: 7, swayFreq: 1.5, swayAmp: 8, armFreq: 3, armAmp: 24, legFreq: 2.5, legAmp: 18, jumpFreq: 1.5, jumpHeight: 18, sparkle: true, colorPulse: true },
  { id: 20, name: 'Vũ Điệu Vô Địch', bounceFreq: 3, bounceAmp: 8, swayFreq: 1.2, swayAmp: 10, armFreq: 3, armAmp: 30, legFreq: 2.5, legAmp: 20, jumpFreq: 1.3, jumpHeight: 24, sparkle: true, colorPulse: true },
];

const DANCE_STYLE_BY_ID = new Map(DANCE_STYLES.map((style) => [style.id, style]));

export function getDanceStyle(id) {
  return DANCE_STYLE_BY_ID.get(id) || DANCE_STYLES[0];
}

/** Tính tư thế (bounce/sway/tay/chân/nhảy) tại thời điểm elapsedSeconds.
 * Không có góc xoay toàn thân — chỉ tịnh tiến (nhún/nghiêng/nhảy) và vung
 * tay/chân, đúng kiểu vận động thể dục, không lộn vòng. */
export function computeDancePose(style, elapsedSeconds) {
  const bounce = style.bounceFreq ? Math.sin(elapsedSeconds * style.bounceFreq * Math.PI * 2) * style.bounceAmp : 0;
  const sway = style.swayFreq ? Math.sin(elapsedSeconds * style.swayFreq * Math.PI * 2) * style.swayAmp : 0;
  const armSwing = style.armFreq ? Math.sin(elapsedSeconds * style.armFreq * Math.PI * 2) * style.armAmp : 0;
  const legSwing = style.legFreq ? Math.sin(elapsedSeconds * style.legFreq * Math.PI * 2) * style.legAmp : 0;
  const jump = style.jumpFreq
    ? Math.max(0, Math.sin(elapsedSeconds * style.jumpFreq * Math.PI * 2)) * style.jumpHeight
    : 0;
  return { bounce, sway, armSwing, legSwing, jump };
}
