// Điệu nhảy 3D thật — mỗi hàm tính góc xoay/độ dịch chuyển thật cho từng khớp (hips/tay/chân) theo
// thời gian, áp lên hình nhân procedural (xem humanoidBuilder.js). Nhìn được từ MỌI góc camera vì là
// chuyển động 3D thật, không phải CSS 2D. Dùng chung 14 danceId đã có ở danceFloorData.js.
export function applyDanceMotion(danceId, parts, elapsedSeconds, phase = 0) {
  const t = elapsedSeconds * 4 + phase;
  const { hips, headGroup, leftArm, rightArm, leftLeg, rightLeg } = parts;

  // Reset an toàn trước khi áp điệu mới (tránh cộng dồn góc xoay giữa các frame)
  hips.rotation.set(0, 0, 0);
  hips.position.y = 0.95;
  headGroup.rotation.set(0, 0, 0);
  [leftArm, rightArm, leftLeg, rightLeg].forEach(({ pivot }) => pivot.rotation.set(0, 0, 0));



  const BASE_DANCES = [
    "dance_bounce", "dance_groove", "dance_spin", "dance_jump", "dance_wave",
    "dance_victory", "dance_shuffle", "dance_floss", "dance_lock", "dance_salsa",
    "dance_breakdance", "dance_moonwalk", "dance_clap", "dance_wavearms"
  ];
  let actualDanceId = danceId;
  if (danceId && danceId.startsWith("dance_auto_")) {
    const num = parseInt(danceId.replace("dance_auto_", ""), 10) || 1;
    actualDanceId = BASE_DANCES[num % BASE_DANCES.length];
  }

  switch (actualDanceId) {
    case "dance_bounce":
      hips.position.y = 0.95 + Math.abs(Math.sin(t)) * 0.08;
      leftArm.pivot.rotation.z = Math.sin(t) * 0.5 + 0.3;
      rightArm.pivot.rotation.z = -Math.sin(t) * 0.5 - 0.3;
      leftLeg.pivot.rotation.x = Math.sin(t + Math.PI) * 0.25;
      rightLeg.pivot.rotation.x = Math.sin(t) * 0.25;
      break;

    case "dance_groove":
      hips.rotation.y = Math.sin(t * 0.6) * 0.5;
      leftArm.pivot.rotation.x = Math.sin(t) * 0.6 + 0.4;
      rightArm.pivot.rotation.x = Math.sin(t + Math.PI) * 0.6 + 0.4;
      hips.position.y = 0.95 + Math.sin(t * 2) * 0.03;
      break;

    case "dance_spin":
      hips.rotation.y = t * 1.6;
      leftArm.pivot.rotation.z = 0.9;
      rightArm.pivot.rotation.z = -0.9;
      break;

    case "dance_jump":
      hips.position.y = 0.95 + Math.max(0, Math.sin(t * 1.4)) * 0.3;
      leftLeg.pivot.rotation.x = -0.5;
      rightLeg.pivot.rotation.x = -0.5;
      leftArm.pivot.rotation.z = 1.1;
      rightArm.pivot.rotation.z = -1.1;
      break;

    case "dance_wave":
      leftArm.pivot.rotation.z = Math.sin(t) * 0.7 + 0.5;
      rightArm.pivot.rotation.z = Math.sin(t - 0.6) * 0.7 - 0.5;
      hips.rotation.z = Math.sin(t * 0.7) * 0.08;
      hips.position.y = 0.95 + Math.sin(t * 0.7) * 0.04;
      break;

    case "dance_victory":
      leftArm.pivot.rotation.z = 2.4 + Math.sin(t) * 0.15;
      rightArm.pivot.rotation.z = -2.4 - Math.sin(t) * 0.15;
      hips.rotation.y = Math.sin(t * 0.5) * 0.3;
      break;

    case "dance_shuffle":
      leftLeg.pivot.position.x = -0.12 + Math.sin(t) * 0.08;
      rightLeg.pivot.position.x = 0.12 - Math.sin(t) * 0.08;
      hips.rotation.z = Math.sin(t) * 0.1;
      leftArm.pivot.rotation.z = 0.4;
      rightArm.pivot.rotation.z = -0.4;
      break;

    case "dance_floss": {
      const swing = Math.sin(t * 1.5);
      leftArm.pivot.rotation.x = swing * 1.1;
      rightArm.pivot.rotation.x = -swing * 1.1;
      hips.rotation.z = -swing * 0.15;
      hips.rotation.y = swing * 0.2;
      break;
    }

    case "dance_lock": {
      const step = Math.floor(t * 1.3) % 2 === 0;
      leftArm.pivot.rotation.z = step ? 0.9 : 0.2;
      rightArm.pivot.rotation.z = step ? -0.2 : -0.9;
      headGroup.rotation.y = step ? 0.3 : -0.3;
      break;
    }

    case "dance_salsa":
      hips.rotation.z = Math.sin(t) * 0.2;
      hips.position.y = 0.95 + Math.abs(Math.sin(t * 2)) * 0.03;
      leftLeg.pivot.rotation.z = Math.sin(t) * 0.2;
      rightLeg.pivot.rotation.z = -Math.sin(t) * 0.2;
      leftArm.pivot.rotation.z = 0.5;
      rightArm.pivot.rotation.z = -0.5;
      break;

    case "dance_breakdance":
      hips.rotation.y = t * 3.2;
      hips.position.y = 0.7;
      leftLeg.pivot.rotation.x = 0.8;
      rightLeg.pivot.rotation.x = -0.6;
      break;

    case "dance_moonwalk":
      hips.position.y = 0.95 + Math.sin(t * 2) * 0.02;
      leftLeg.pivot.rotation.x = Math.sin(t) * 0.3;
      rightLeg.pivot.rotation.x = Math.sin(t + Math.PI) * 0.3;
      headGroup.rotation.y = Math.sin(t * 0.3) * 0.2;
      break;

    case "dance_clap": {
      const clap = Math.abs(Math.sin(t * 1.8));
      leftArm.pivot.rotation.x = 1.3;
      rightArm.pivot.rotation.x = 1.3;
      leftArm.pivot.rotation.z = 0.6 - clap * 0.6;
      rightArm.pivot.rotation.z = -0.6 + clap * 0.6;
      hips.position.y = 0.95 + clap * 0.05;
      break;
    }

    case "dance_wavearms":
      leftArm.pivot.rotation.z = Math.sin(t) * 0.9 + 0.6;
      rightArm.pivot.rotation.z = Math.sin(t - 1.2) * 0.9 - 0.6;
      hips.rotation.y = Math.sin(t * 0.4) * 0.15;
      break;

    default:
      hips.position.y = 0.95 + Math.sin(t) * 0.04;
  }
}

// Phát lại điệu nhảy "sao chép" trích từ video mẫu (xem lib/dance3d/motionCapture.js) — nội suy mượt
// giữa 2 khung hình gần nhất rồi lặp vòng theo durationSeconds của clip đã ghi.
export function applyCapturedMotion(clip, parts, elapsedSeconds) {
  const { hips, headGroup, leftArm, rightArm, leftLeg, rightLeg } = parts;
  hips.rotation.set(0, 0, 0);
  hips.position.y = 0.95;
  headGroup.rotation.set(0, 0, 0);
  [leftArm, rightArm, leftLeg, rightLeg].forEach(({ pivot }) => pivot.rotation.set(0, 0, 0));


  const { frames, durationSeconds } = clip;
  if (!frames || frames.length === 0 || !durationSeconds) return;

  const loopTime = ((elapsedSeconds % durationSeconds) + durationSeconds) % durationSeconds;
  let nextIdx = frames.findIndex((f) => f.t >= loopTime);
  if (nextIdx <= 0) nextIdx = frames.length > 1 ? 1 : 0;
  const prev = frames[nextIdx - 1] || frames[0];
  const next = frames[nextIdx];
  const span = Math.max(0.0001, next.t - prev.t);
  const ratio = Math.min(1, Math.max(0, (loopTime - prev.t) / span));
  const lerp = (a, b) => a + (b - a) * ratio;

  leftArm.pivot.rotation.z = lerp(prev.leftArmZ, next.leftArmZ);
  rightArm.pivot.rotation.z = lerp(prev.rightArmZ, next.rightArmZ);
  leftLeg.pivot.rotation.x = lerp(prev.leftLegX, next.leftLegX);
  rightLeg.pivot.rotation.x = lerp(prev.rightLegX, next.rightLegX);
  hips.position.y = 0.95 + lerp(prev.hipsBounceY, next.hipsBounceY);
}
