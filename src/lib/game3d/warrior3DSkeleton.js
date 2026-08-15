// 3D Articulated Skeletal Humanoid Warrior Engine for Game Chien Dau
// Provides full anatomical forward kinematics for all joints (head, hair, neck, shoulders, elbows, wrists, hips, knees, ankles, feet, cloak, sword),
// with high-definition volumetric shaded 3D dragon/valkyrie armor, martial arts slashing, and fluid combat movements.

export const SKELETON_STATES = {
  IDLE: 'idle',
  WALK: 'walk',
  ATTACK_SLASH: 'attack_slash',
  ATTACK_SPIN: 'attack_spin',
  // 10+ Dynamic Martial Arts Styles:
  ATTACK_BLUE_THRUST: 'attack_blue_thrust',            // 1: Tật Phong Kiếm - Đâm thẳng
  ATTACK_BLUE_CROSS: 'attack_blue_cross',              // 2: Lưỡng Nghi Kiếm - Chém chéo kép
  ATTACK_BLUE_HEAVEN_SWORD: 'attack_blue_heaven_sword',// 3: Thiên Ngoại Phi Tiên - Kiếm chỉ trời phóng khí
  ATTACK_BLUE_UPPERCUT: 'attack_blue_uppercut',        // 4: Bá Vương Hất Kiếm - Hất chém bốc từ dưới lên
  ATTACK_BLUE_DOUBLE: 'attack_blue_double',            // 5: Song Tuyệt Liên Hoàn Kiếm - Đâm chém dồn dập
  ATTACK_RED_CLEAVE: 'attack_red_cleave',              // 6: Phách Sơn Đao - Bổ đao giáng trời
  ATTACK_RED_SWEEP: 'attack_red_sweep',                // 7: Hoành Tảo Thiên Quân - Quét đao bán nguyệt
  ATTACK_RED_WHIRLWIND: 'attack_red_whirlwind',        // 8: Cuồng Phong Trảm - Xoay thân trảm 360 độ
  ATTACK_RED_HEAVY_SLAM: 'attack_red_heavy_slam',      // 9: Cự Lực Đập Đất - Giậm chân đập cán đao chấn động
  ATTACK_RED_DOUBLE_CHOP: 'attack_red_double_chop',    // 10: Liên Hoàn Song Trảm - Chém dọc đôi
  MARTIAL_KICK_COMBO: 'martial_kick_combo',            // 11: Long Quyền Hổ Cước - Tung cước võ thuật
  TAI_CHI_PALM: 'tai_chi_palm',                        // 12: Chưởng Pháp Thái Cực - Vận khí đẩy chưởng quang
  DEFEND_PARRY: 'defend_parry',                        // 13: Thái Cực Bạt Kiếm / Đao Khí Hộ Thân
  DEFEND_BLOCK: 'defend_block',                        // 14: Bất Động Như Sơn - Thủ thế vững vàng
  DANCE: 'dance',
  VICTORY: 'victory',
  DEFEATED: 'defeated',
  REVIVE: 'revive'
};

/**
 * Computes 3D Forward Kinematics for every human joint and limb with asymmetric faction combat styles
 */
export function computeSkeletalJoints({
  gender = 'male',
  animState = SKELETON_STATES.WALK,
  factionId = 'blue',
  time = 0,
  phase = 0,
  tier = 1,
  animSpeed = 0.55
}) {
  // Slower, deliberate, and impactful martial arts cadence as requested by user
  const speed = Math.max(0.1, Math.min(2.0, animSpeed || 0.55)) * 0.72;
  const t = time * 0.0022 * speed + phase;
  const isFemale = gender === 'female';
  const isBlue = factionId === 'blue';

  // Body proportions
  const headSize = isFemale ? 6.5 : 7.5;
  const chestW = isFemale ? 12 : 15;
  const chestH = isFemale ? 14 : 16;
  const armLen = isFemale ? 10 : 12;
  const forearmLen = isFemale ? 9 : 11;
  const thighLen = isFemale ? 13 : 15;
  const shinLen = isFemale ? 12 : 14;

  // Root offsets
  let rootY = 0;
  let rootTiltZ = 0;
  let chestTwist = 0;
  let headTilt = 0;

  // Arm joint angles (radians)
  let lShoulderAngle = 0.3;
  let lElbowAngle = 0.5;
  let rShoulderAngle = -0.3;
  let rElbowAngle = 0.5;
  let rWristAngle = 0;

  // Leg joint angles (radians)
  let lHipAngle = 0;
  let lKneeAngle = 0.15;
  let rHipAngle = 0;
  let rKneeAngle = 0.15;

  // Cloak and hair physics
  const hairWave = Math.sin(t * 3.2) * 0.35;
  const capeWave = Math.sin(t * 2.8) * 9;
  let eyeGlow = 1.0;
  let slashArc = 0;
  let weaponStyle = isBlue ? 'sword_thrust' : 'heavy_cleave';

  if (animState === SKELETON_STATES.IDLE) {
    // Combat Ready Martial Stance (Thế thủ võ thuật riêng biệt: Xanh thanh thoát, Đỏ hùng tráng)
    const breath = Math.sin(t * 1.8);
    rootY = breath * 1.8;

    if (isBlue) {
      // Blue: Thanh tao, kiếm hướng lên 45 độ, tay trái thủ kết ấn kiếm quyết
      chestTwist = Math.sin(t * 0.9) * 0.05 - 0.08;
      headTilt = -chestTwist * 0.5;

      lShoulderAngle = 0.6 + breath * 0.03;
      lElbowAngle = 1.4 + breath * 0.04; // Tay trái kết ấn
      rShoulderAngle = -0.5 - breath * 0.04;
      rElbowAngle = 0.9 + breath * 0.04;
      rWristAngle = -0.4;

      lHipAngle = -0.15;
      lKneeAngle = 0.28;
      rHipAngle = 0.2;
      rKneeAngle = 0.25;
    } else {
      // Red: Dũng mãnh, hạ trọng tâm, đao cầm ngang hông uy mãnh
      chestTwist = Math.sin(t * 0.9) * 0.06 + 0.1;
      headTilt = -chestTwist * 0.4;

      lShoulderAngle = 0.4 + breath * 0.04;
      lElbowAngle = 0.7 + breath * 0.03;
      rShoulderAngle = -0.8 - breath * 0.05;
      rElbowAngle = 1.3 + breath * 0.05;
      rWristAngle = 0.2;

      lHipAngle = -0.25;
      lKneeAngle = 0.45;
      rHipAngle = 0.28;
      rKneeAngle = 0.4;
    }
    eyeGlow = 1.0 + breath * 0.3;
  } else if (animState === SKELETON_STATES.WALK) {
    // Fluid Human Walk Cycle (Bước tiến linh hoạt)
    const walkFreq = 2.8;
    const stride = Math.sin(t * walkFreq);
    const cosStride = Math.cos(t * walkFreq);

    rootY = Math.abs(stride) * 2.8;
    rootTiltZ = stride * 0.04;
    chestTwist = -stride * 0.1;
    headTilt = stride * 0.05;

    lHipAngle = stride * 0.55;
    lKneeAngle = Math.max(0.1, -cosStride * 0.75);
    rHipAngle = -stride * 0.55;
    rKneeAngle = Math.max(0.1, cosStride * 0.75);

    lShoulderAngle = -stride * 0.45;
    lElbowAngle = 0.4 + Math.max(0, stride * 0.35);
    rShoulderAngle = stride * 0.45;
    rElbowAngle = 0.5 + Math.max(0, -stride * 0.35);
    rWristAngle = 0.15;
    eyeGlow = 1.0;
  } else if (animState === SKELETON_STATES.ATTACK_BLUE_THRUST || (isBlue && animState === SKELETON_STATES.ATTACK_SLASH)) {
    // 1: BLUE ATTACK 1 - Tật Phong Kiếm (Phi thân đâm thẳng chớp nhoáng)
    const attackPhase = (t * 3.2) % (Math.PI * 2);
    const strike = Math.sin(attackPhase);
    const lunge = Math.max(0, strike);

    rootY = 1.5 + strike * 2.5;
    rootTiltZ = strike * 0.14;
    chestTwist = strike * 0.35;
    headTilt = -chestTwist * 0.4;

    rShoulderAngle = -1.7 + strike * 0.8;
    rElbowAngle = 0.1 + (1 - lunge) * 0.6;
    rWristAngle = 0.4 * strike;
    slashArc = strike;
    weaponStyle = 'sword_thrust';

    lShoulderAngle = 0.9 - strike * 0.2;
    lElbowAngle = 1.4;

    lHipAngle = 0.6 * lunge + 0.1;
    lKneeAngle = 0.8 * lunge + 0.2;
    rHipAngle = -0.6 * lunge - 0.1;
    rKneeAngle = 0.25;
    eyeGlow = 2.2;
  } else if (animState === SKELETON_STATES.ATTACK_BLUE_CROSS) {
    // 2: BLUE ATTACK 2 - Lưỡng Nghi Kiếm Khí (Chém chéo kép thanh thoát)
    const attackPhase = (t * 3.0) % (Math.PI * 2);
    const slash = Math.sin(attackPhase);

    rootY = Math.abs(slash) * 3.0;
    rootTiltZ = slash * 0.2;
    chestTwist = slash * 0.5;

    rShoulderAngle = -1.2 + slash * 1.5;
    rElbowAngle = 0.4 + (1 - Math.abs(slash)) * 0.5;
    rWristAngle = slash * 0.5;
    slashArc = slash;
    weaponStyle = 'sword_slash';

    lShoulderAngle = 1.2 - slash * 0.8;
    lElbowAngle = 0.8;

    lHipAngle = slash * 0.3;
    lKneeAngle = 0.35;
    rHipAngle = -slash * 0.3;
    rKneeAngle = 0.35;
    eyeGlow = 2.4;
  } else if (animState === SKELETON_STATES.ATTACK_BLUE_HEAVEN_SWORD) {
    // 3: BLUE ATTACK 3 - Thiên Ngoại Phi Tiên (Giương kiếm chỉ thiên tỏa kiếm khí)
    const phaseHeaven = (t * 2.8) % (Math.PI * 2);
    const wave = Math.sin(phaseHeaven);
    rootY = -2.0 + Math.abs(wave) * 3.5;
    chestTwist = -0.25 + wave * 0.1;
    headTilt = -0.3;

    rShoulderAngle = -2.6 + wave * 0.3;
    rElbowAngle = 0.15;
    rWristAngle = -0.2;
    lShoulderAngle = 1.4 + wave * 0.2;
    lElbowAngle = 1.3;
    slashArc = 0.8;
    weaponStyle = 'sword_thrust';

    lHipAngle = 0.15;
    lKneeAngle = 0.2;
    rHipAngle = -0.15;
    rKneeAngle = 0.2;
    eyeGlow = 3.0;
  } else if (animState === SKELETON_STATES.ATTACK_BLUE_UPPERCUT) {
    // 4: BLUE ATTACK 4 - Bá Vương Hất Kiếm (Chém bốc hất ngược từ dưới lên)
    const pUpper = (t * 3.4) % (Math.PI * 2);
    const upper = Math.sin(pUpper);
    rootY = 2.0 - upper * 4.0;
    chestTwist = upper * 0.4;
    headTilt = -upper * 0.2;

    rShoulderAngle = -0.4 - upper * 1.8;
    rElbowAngle = 0.2 + (1 - Math.abs(upper)) * 0.5;
    rWristAngle = upper * 0.6;
    lShoulderAngle = 0.8 - upper * 0.4;
    lElbowAngle = 0.9;
    slashArc = upper;
    weaponStyle = 'sword_slash';

    lHipAngle = upper * 0.4;
    lKneeAngle = 0.3;
    rHipAngle = -upper * 0.4;
    rKneeAngle = 0.3;
    eyeGlow = 2.6;
  } else if (animState === SKELETON_STATES.ATTACK_BLUE_DOUBLE) {
    // 5: BLUE ATTACK 5 - Song Tuyệt Liên Hoàn Kiếm (Đâm nhịp 1 + Chém xoay nhịp 2)
    const pDbl = (t * 4.2) % (Math.PI * 2);
    const dbl = Math.sin(pDbl);
    rootY = 1.0 + Math.abs(dbl) * 2.5;
    chestTwist = dbl * 0.45;

    rShoulderAngle = -1.5 + dbl * 1.2;
    rElbowAngle = 0.2 + (1 - Math.abs(dbl)) * 0.4;
    rWristAngle = dbl * 0.4;
    lShoulderAngle = 1.0 - dbl * 0.6;
    lElbowAngle = 1.1;
    slashArc = dbl;
    weaponStyle = 'sword_thrust';

    lHipAngle = dbl * 0.3;
    lKneeAngle = 0.4;
    rHipAngle = -dbl * 0.3;
    rKneeAngle = 0.4;
    eyeGlow = 2.5;
  } else if (animState === SKELETON_STATES.ATTACK_RED_CLEAVE || (!isBlue && animState === SKELETON_STATES.ATTACK_SLASH)) {
    // 6: RED ATTACK 1 - Phách Sơn Đao (Nhảy bổ chém uy lực giáng trời)
    const attackPhase = (t * 2.8) % (Math.PI * 2);
    const chop = Math.sin(attackPhase);
    const powerDown = Math.max(0, -chop);

    rootY = 3.0 + powerDown * 4.0;
    rootTiltZ = -chop * 0.22;
    chestTwist = -chop * 0.4;
    headTilt = powerDown * 0.3;

    rShoulderAngle = -2.2 + powerDown * 2.0;
    rElbowAngle = 0.2 + (1 - powerDown) * 0.8;
    rWristAngle = powerDown * 0.7;
    slashArc = powerDown;
    weaponStyle = 'heavy_cleave';

    lShoulderAngle = -1.8 + powerDown * 1.6;
    lElbowAngle = 0.5;

    lHipAngle = -0.2 + powerDown * 0.7;
    lKneeAngle = 0.3 + powerDown * 0.6;
    rHipAngle = 0.3 + powerDown * 0.5;
    rKneeAngle = 0.3 + powerDown * 0.5;
    eyeGlow = 2.6;
  } else if (animState === SKELETON_STATES.ATTACK_RED_SWEEP) {
    // 7: RED ATTACK 2 - Hoành Tảo Thiên Quân (Quét đao bán nguyệt)
    const sweepPhase = (t * 2.6) % (Math.PI * 2);
    const sweep = Math.sin(sweepPhase);

    rootY = 2.0;
    rootTiltZ = sweep * 0.15;
    chestTwist = sweep * 0.6;

    rShoulderAngle = -0.4 + sweep * 1.8;
    rElbowAngle = 0.3;
    rWristAngle = sweep * 0.6;
    slashArc = sweep;
    weaponStyle = 'heavy_sweep';

    lShoulderAngle = 0.6;
    lElbowAngle = 1.1;

    lHipAngle = 0.4;
    lKneeAngle = 0.5;
    rHipAngle = -0.3;
    rKneeAngle = 0.4;
    eyeGlow = 2.5;
  } else if (animState === SKELETON_STATES.ATTACK_RED_WHIRLWIND || animState === SKELETON_STATES.ATTACK_SPIN) {
    // 8: RED ATTACK 3 - Cuồng Phong Trảm (Xoay tròn 360 độ đao quang rực lửa)
    const spinPhase = t * 4.2;
    rootY = Math.sin(spinPhase) * 2.5;
    rootTiltZ = Math.cos(spinPhase) * 0.14;
    chestTwist = Math.sin(spinPhase) * 0.6;

    rShoulderAngle = -1.4 + Math.sin(spinPhase) * 0.5;
    rElbowAngle = 0.25;
    lShoulderAngle = 1.4 - Math.sin(spinPhase) * 0.5;
    lElbowAngle = 0.25;
    slashArc = 1.0;
    weaponStyle = 'heavy_sweep';

    lHipAngle = Math.sin(spinPhase) * 0.4;
    lKneeAngle = 0.4;
    rHipAngle = -Math.sin(spinPhase) * 0.4;
    rKneeAngle = 0.4;
    eyeGlow = 2.8;
  } else if (animState === SKELETON_STATES.ATTACK_RED_HEAVY_SLAM) {
    // 9: RED ATTACK 4 - Cự Lực Đập Đất (Giậm chân đập cán đao chấn động)
    const pSlam = (t * 2.4) % (Math.PI * 2);
    const slam = Math.sin(pSlam);
    const impact = Math.max(0, -slam);
    rootY = 4.0 + impact * 3.5;
    chestTwist = 0.15;
    headTilt = 0.35;

    rShoulderAngle = -2.4 + impact * 2.2;
    rElbowAngle = 0.1;
    rWristAngle = impact * 0.8;
    lShoulderAngle = 0.7;
    lElbowAngle = 0.8;
    slashArc = impact;
    weaponStyle = 'heavy_cleave';

    lHipAngle = 0.6 * impact + 0.2;
    lKneeAngle = 0.8 * impact + 0.3;
    rHipAngle = -0.3;
    rKneeAngle = 0.5;
    eyeGlow = 2.8;
  } else if (animState === SKELETON_STATES.ATTACK_RED_DOUBLE_CHOP) {
    // 10: RED ATTACK 5 - Liên Hoàn Song Trảm (Chém dọc liên tiếp)
    const pChop = (t * 3.8) % (Math.PI * 2);
    const cVal = Math.sin(pChop);
    rootY = 2.0 + Math.abs(cVal) * 3.0;
    chestTwist = -cVal * 0.35;

    rShoulderAngle = -1.8 + cVal * 1.4;
    rElbowAngle = 0.25;
    rWristAngle = cVal * 0.5;
    lShoulderAngle = 0.8 + cVal * 0.4;
    lElbowAngle = 0.6;
    slashArc = cVal;
    weaponStyle = 'heavy_cleave';

    lHipAngle = cVal * 0.3;
    lKneeAngle = 0.35;
    rHipAngle = -cVal * 0.3;
    rKneeAngle = 0.35;
    eyeGlow = 2.6;
  } else if (animState === SKELETON_STATES.MARTIAL_KICK_COMBO) {
    // 11: MARTIAL KICK - Long Quyền Hổ Cước (Xoay người tung cước võ thuật)
    const pKick = (t * 3.6) % (Math.PI * 2);
    const kick = Math.sin(pKick);
    const kExt = Math.max(0, kick);
    rootY = 1.0 - kExt * 4.0;
    rootTiltZ = kExt * 0.3;
    chestTwist = -kExt * 0.4;

    rShoulderAngle = -1.2;
    rElbowAngle = 0.8;
    lShoulderAngle = 1.2;
    lElbowAngle = 0.8;

    lHipAngle = -0.2;
    lKneeAngle = 0.4;
    rHipAngle = 1.4 * kExt;
    rKneeAngle = 0.1;
    eyeGlow = 2.5;
  } else if (animState === SKELETON_STATES.TAI_CHI_PALM) {
    // 12: TAI CHI PALM - Chưởng Pháp Thái Cực (Vận khí đẩy chưởng quang)
    const pPalm = (t * 2.2) % (Math.PI * 2);
    const palm = Math.sin(pPalm);
    const pExtend = Math.max(0, palm);
    rootY = 2.0;
    chestTwist = palm * 0.3;

    rShoulderAngle = -0.8 - pExtend * 1.0;
    rElbowAngle = 0.2 + (1 - pExtend) * 0.7;
    rWristAngle = -0.4;
    lShoulderAngle = 0.8 - pExtend * 0.6;
    lElbowAngle = 0.9;
    slashArc = pExtend;

    lHipAngle = 0.3;
    lKneeAngle = 0.5;
    rHipAngle = -0.3;
    rKneeAngle = 0.5;
    eyeGlow = 2.8;
  } else if (animState === SKELETON_STATES.DEFEND_PARRY) {
    // 13: DEFEND PARRY - Thái Cực Bạt Kiếm / Đao Khí Hộ Thân (Đỡ đòn)
    rootY = 2.5;
    chestTwist = isBlue ? -0.15 : 0.15;
    rShoulderAngle = -1.2;
    rElbowAngle = 1.3;
    rWristAngle = -0.3;
    lShoulderAngle = 0.8;
    lElbowAngle = 1.2;

    lHipAngle = 0.35;
    lKneeAngle = 0.55;
    rHipAngle = -0.35;
    rKneeAngle = 0.5;
    eyeGlow = 1.5;
  } else if (animState === SKELETON_STATES.DEFEND_BLOCK) {
    // 14: DEFEND BLOCK - Bất Động Như Sơn (Thủ thế vững chắc)
    rootY = 3.2;
    chestTwist = 0;
    rShoulderAngle = -1.0;
    rElbowAngle = 1.5;
    rWristAngle = 0.3;
    lShoulderAngle = 1.0;
    lElbowAngle = 1.5;

    lHipAngle = 0.45;
    lKneeAngle = 0.7;
    rHipAngle = -0.45;
    rKneeAngle = 0.7;
    eyeGlow = 1.8;
  } else if (animState === SKELETON_STATES.ATTACK_SPIN) {
    // Whirlwind Blade
    const spinPhase = t * 4.5;
    rootY = Math.sin(spinPhase) * 2.5;
    rootTiltZ = Math.cos(spinPhase) * 0.12;
    chestTwist = Math.sin(spinPhase) * 0.45;

    rShoulderAngle = -1.5;
    rElbowAngle = 0.25;
    lShoulderAngle = 1.5;
    lElbowAngle = 0.25;
    slashArc = 1.0;

    lHipAngle = Math.sin(spinPhase) * 0.35;
    lKneeAngle = 0.35;
    rHipAngle = -Math.sin(spinPhase) * 0.35;
    rKneeAngle = 0.35;
    eyeGlow = 2.5;
  } else if (animState === SKELETON_STATES.DANCE) {
    // Graceful martial arts dance
    const danceFreq = 2.4;
    const dancePhase = t * danceFreq;
    const bounce = Math.abs(Math.sin(dancePhase));
    const hipSway = Math.sin(dancePhase * 0.5);

    rootY = bounce * 4.0;
    rootTiltZ = hipSway * 0.1;
    chestTwist = hipSway * 0.2;
    headTilt = -hipSway * 0.15;

    lShoulderAngle = 0.8 + Math.sin(dancePhase) * 0.6;
    lElbowAngle = 0.6 + Math.cos(dancePhase * 1.2) * 0.4;
    rShoulderAngle = -0.8 - Math.cos(dancePhase) * 0.6;
    rElbowAngle = 0.6 - Math.sin(dancePhase * 1.2) * 0.4;

    lHipAngle = hipSway * 0.4;
    lKneeAngle = Math.max(0.15, bounce * 0.6);
    rHipAngle = -hipSway * 0.4;
    rKneeAngle = Math.max(0.15, (1 - bounce) * 0.6);
    eyeGlow = 1.4;
  } else if (animState === SKELETON_STATES.VICTORY) {
    // Triumphant double-sword raise
    const vPhase = t * 2.2;
    rootY = Math.abs(Math.sin(vPhase)) * 3.0;
    headTilt = -0.25;

    lShoulderAngle = 1.9 + Math.sin(vPhase) * 0.15;
    lElbowAngle = 0.3;
    rShoulderAngle = -1.9 - Math.sin(vPhase) * 0.15;
    rElbowAngle = 0.3;

    lHipAngle = 0.15;
    lKneeAngle = 0.25;
    rHipAngle = -0.15;
    rKneeAngle = 0.25;
    eyeGlow = 1.8;
  } else if (animState === SKELETON_STATES.DEFEATED) {
    // Kneeling on one knee, sword planted
    rootY = 12.0;
    rootTiltZ = 0.25;
    headTilt = 0.4;
    chestTwist = 0.1;

    lShoulderAngle = 0.4;
    lElbowAngle = 0.9;
    rShoulderAngle = -0.3;
    rElbowAngle = 0.8;
    rWristAngle = 0.5;

    lHipAngle = 0.9;
    lKneeAngle = 1.4;
    rHipAngle = 0.4;
    rKneeAngle = 1.2;
    eyeGlow = 0.0;
  } else if (animState === SKELETON_STATES.REVIVE) {
    // Holy ascension
    const rPhase = t * 4.5;
    rootY = -6.0 + Math.sin(rPhase) * 2.0;
    headTilt = -0.35;
    lShoulderAngle = -1.3;
    lElbowAngle = 0.2;
    rShoulderAngle = -1.3;
    rElbowAngle = 0.2;
    lHipAngle = 0.08;
    lKneeAngle = 0.12;
    rHipAngle = -0.08;
    rKneeAngle = 0.12;
    eyeGlow = 2.8;
  }

  return {
    gender,
    isFemale,
    factionId,
    tier,
    animState,
    weaponStyle,
    headSize,
    chestW,
    chestH,
    armLen,
    forearmLen,
    thighLen,
    shinLen,
    rootY,
    rootTiltZ,
    chestTwist,
    headTilt,
    lShoulderAngle,
    lElbowAngle,
    rShoulderAngle,
    rElbowAngle,
    rWristAngle,
    lHipAngle,
    lKneeAngle,
    rHipAngle,
    rKneeAngle,
    hairWave,
    capeWave,
    eyeGlow,
    slashArc,
    time
  };
}

/**
 * Draws a 3D Armored Segment with realistic metallic shading, highlights, and gold trim
 */
function drawArmoredSegment(ctx, length, widthTop, widthBottom, colorPrimary, colorHighlight, colorDark, goldTrim = true) {
  ctx.save();

  // Anatomical curved plate polygon
  const halfTop = widthTop / 2;
  const halfBottom = widthBottom / 2;

  // Base metallic gradient
  const grad = ctx.createLinearGradient(-halfTop, 0, halfTop, 0);
  grad.addColorStop(0, colorHighlight);
  grad.addColorStop(0.3, colorPrimary);
  grad.addColorStop(0.85, colorDark);
  grad.addColorStop(1.0, colorHighlight);

  ctx.beginPath();
  ctx.moveTo(-halfTop, 0);
  ctx.lineTo(halfTop, 0);
  ctx.quadraticCurveTo(halfBottom * 1.1, length * 0.5, halfBottom, length);
  ctx.lineTo(-halfBottom, length);
  ctx.quadraticCurveTo(-halfBottom * 1.1, length * 0.5, -halfTop, 0);
  ctx.closePath();

  ctx.fillStyle = grad;
  ctx.fill();

  ctx.strokeStyle = goldTrim ? '#facc15' : 'rgba(15, 23, 42, 0.7)';
  ctx.lineWidth = goldTrim ? 0.9 : 0.6;
  ctx.stroke();

  // Central metallic specular sheen
  ctx.beginPath();
  ctx.moveTo(0, 1);
  ctx.lineTo(0, length - 1);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Soft muscle/bevel edge shadow
  ctx.beginPath();
  ctx.moveTo(-halfTop * 0.7, 2);
  ctx.lineTo(-halfBottom * 0.7, length - 2);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.lineWidth = 0.6;
  ctx.stroke();

  ctx.restore();
}

/**
 * Master Humanoid 3D Skeletal Warrior Renderer
 * Renders all joints (Head, Helm, Hair, Eyes, Cloak, Shoulders, Arms, Gauntlets, Cuirass, Faulds, Legs, Sabatons, Glowing Sword)
 */
export function render3DWarriorSkeleton(ctx, skeletonData, options = {}) {
  const {
    factionId = 'blue',
    scale = 1.0,
    isPulsing = false
  } = options;

  const {
    isFemale,
    tier,
    animState,
    headSize,
    chestW,
    chestH,
    armLen,
    forearmLen,
    thighLen,
    shinLen,
    rootY,
    rootTiltZ,
    chestTwist,
    headTilt,
    lShoulderAngle,
    lElbowAngle,
    rShoulderAngle,
    rElbowAngle,
    rWristAngle,
    lHipAngle,
    lKneeAngle,
    rHipAngle,
    rKneeAngle,
    hairWave,
    capeWave,
    eyeGlow,
    slashArc,
    time
  } = skeletonData;

  const isGoldTier = tier >= 3;
  const isDefeated = animState === SKELETON_STATES.DEFEATED;

  // Dynamic Palettes
  const skinColor = isFemale ? '#ffe4d6' : '#fcd3b2';
  const skinShadow = isFemale ? '#fca5a5' : '#e28f68';

  // Dynamic Palettes with distinct faction identity even when VIP/Gold Tier
  const isBlue = factionId === 'blue';
  const teamColor = isBlue ? '#38bdf8' : '#fb7185';
  
  // VIP gets gold filigree + their distinct team crystal colors (Sapphire Blue vs Ruby Red)
  const primaryColor = isGoldTier 
    ? (isBlue ? '#1d4ed8' : '#b91c1c') 
    : (isBlue ? '#2563eb' : '#dc2626');
  const highlightColor = isGoldTier 
    ? '#fef08a' 
    : (isBlue ? '#93c5fd' : '#fca5a5');
  const darkColor = isGoldTier 
    ? (isBlue ? '#0f172a' : '#450a0a') 
    : '#0f172a';
  const glowColor = isBlue ? '#38bdf8' : '#f43f5e';

  ctx.save();

  // Root translation & tilt
  ctx.translate(0, rootY);
  ctx.rotate(rootTiltZ);

  // Directional facing: Blue looks Right (+1), Red looks Left (-1)
  const dir = factionId === 'blue' ? 1 : -1;
  ctx.scale(dir, 1.0);

  // 1. Dynamic Ground Shadow
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(0, (thighLen + shinLen) * 0.95 + 4, 18, 5, 0, 0, Math.PI * 2);
  ctx.fillStyle = isDefeated ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.45)';
  ctx.fill();
  ctx.restore();

  // 2. Billowing Dragon Mantle / Silk Sash Cape (Behind body)
  if (!isDefeated) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-chestW * 0.45, -chestH * 0.9);
    // Multi-layer sweeping silk cape
    const capeWarp = capeWave * (isGoldTier ? 1.3 : 1.0);
    ctx.quadraticCurveTo(-chestW * 0.9 + capeWarp * 0.5, thighLen * 0.6, -chestW * 1.0 + capeWarp, thighLen * 1.25);
    ctx.quadraticCurveTo(capeWarp * 0.7, thighLen * 1.35, chestW * 0.8 + capeWarp * 0.6, thighLen * 1.15);
    ctx.quadraticCurveTo(chestW * 0.5, -chestH * 0.3, chestW * 0.45, -chestH * 0.9);
    ctx.closePath();

    const capeGrad = ctx.createLinearGradient(0, -chestH, 0, thighLen * 1.3);
    if (isGoldTier) {
      capeGrad.addColorStop(0, isBlue ? '#1e3a8a' : '#7f1d1d');
      capeGrad.addColorStop(0.5, isBlue ? '#2563eb' : '#dc2626');
      capeGrad.addColorStop(1, '#facc15');
    } else {
      capeGrad.addColorStop(0, isBlue ? '#0f172a' : '#450a0a');
      capeGrad.addColorStop(1, isBlue ? '#1d4ed8' : '#be123c');
    }
    ctx.fillStyle = capeGrad;
    ctx.fill();
    ctx.strokeStyle = isGoldTier ? '#fde047' : (isBlue ? '#60a5fa' : '#f87171');
    ctx.lineWidth = isGoldTier ? 1.5 : 0.8;
    ctx.stroke();
    ctx.restore();
  }

  // 3. LEFT LEG (Back leg: Hip -> Thigh -> Knee -> Shin -> Sabaton/Boot)
  ctx.save();
  ctx.translate(-chestW * 0.28, 0);
  ctx.rotate(lHipAngle);
  drawArmoredSegment(ctx, thighLen, 6.5, 5.0, primaryColor, highlightColor, darkColor, isGoldTier);

  ctx.translate(0, thighLen);
  ctx.rotate(lKneeAngle);
  drawArmoredSegment(ctx, shinLen, 5.0, 4.0, primaryColor, highlightColor, darkColor, isGoldTier);

  // Left Sabaton / Armored Boot
  ctx.translate(0, shinLen);
  ctx.beginPath();
  ctx.moveTo(-3, 0);
  ctx.lineTo(6, 0);
  ctx.lineTo(8, 4);
  ctx.lineTo(-4, 4);
  ctx.closePath();
  ctx.fillStyle = isGoldTier ? '#ca8a04' : '#1e293b';
  ctx.fill();
  ctx.restore();

  // 4. RIGHT LEG (Front leg: Hip -> Thigh -> Knee -> Shin -> Sabaton/Boot)
  ctx.save();
  ctx.translate(chestW * 0.28, 0);
  ctx.rotate(rHipAngle);
  drawArmoredSegment(ctx, thighLen, 6.8, 5.2, primaryColor, highlightColor, darkColor, isGoldTier);

  ctx.translate(0, thighLen);
  ctx.rotate(rKneeAngle);
  drawArmoredSegment(ctx, shinLen, 5.2, 4.2, primaryColor, highlightColor, darkColor, isGoldTier);

  // Right Sabaton / Armored Boot
  ctx.translate(0, shinLen);
  ctx.beginPath();
  ctx.moveTo(-3, 0);
  ctx.lineTo(7, 0);
  ctx.lineTo(9, 4);
  ctx.lineTo(-4, 4);
  ctx.closePath();
  ctx.fillStyle = isGoldTier ? '#ca8a04' : '#1e293b';
  ctx.fill();
  ctx.restore();

  // 5. PELVIS & ARMORED FAULDS / TASSETS (Hông giáp & Đai lưng)
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(-chestW * 0.45, -4, chestW * 0.9, 7, 2);
  ctx.fillStyle = isGoldTier ? '#ca8a04' : '#334155';
  ctx.fill();
  ctx.strokeStyle = isGoldTier ? '#fde047' : '#ffffff';
  ctx.lineWidth = 1.0;
  ctx.stroke();

  // Tasset central badge / dragon buckle
  ctx.beginPath();
  ctx.arc(0, -0.5, 3.2, 0, Math.PI * 2);
  ctx.fillStyle = glowColor;
  ctx.fill();
  ctx.restore();

  // 6. TORSO / ARMORED CUIRASS & BREASTPLATE (Thân giáp & Lồng ngực)
  ctx.save();
  ctx.rotate(chestTwist);

  ctx.beginPath();
  ctx.moveTo(-chestW * 0.45, 0);
  ctx.lineTo(chestW * 0.45, 0);
  ctx.lineTo(chestW * 0.55, -chestH);
  ctx.lineTo(-chestW * 0.55, -chestH);
  ctx.closePath();

  const cuirassGrad = ctx.createLinearGradient(-chestW * 0.55, 0, chestW * 0.55, 0);
  cuirassGrad.addColorStop(0, highlightColor);
  cuirassGrad.addColorStop(0.35, primaryColor);
  cuirassGrad.addColorStop(1, darkColor);
  ctx.fillStyle = cuirassGrad;
  ctx.fill();
  ctx.strokeStyle = isGoldTier ? '#facc15' : 'rgba(15, 23, 42, 0.9)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Glowing Qi Energy Core in center of chest
  ctx.beginPath();
  ctx.arc(0, -chestH * 0.6, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = isGoldTier ? '#fef08a' : glowColor;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 12 * eyeGlow;
  ctx.fill();
  ctx.restore();

  // 7. LEFT ARM (Back Arm: Shoulder Pauldron -> Bicep -> Elbow -> Forearm -> Gauntlet)
  ctx.save();
  ctx.translate(-chestW * 0.48, -chestH * 0.9);
  ctx.rotate(lShoulderAngle);

  // Left 3D Shoulder Pauldron
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, 5.8, Math.PI, Math.PI * 2);
  ctx.fillStyle = isGoldTier ? '#fde047' : highlightColor;
  ctx.fill();
  ctx.strokeStyle = isGoldTier ? '#ca8a04' : '#0f172a';
  ctx.lineWidth = 1.0;
  ctx.stroke();
  ctx.restore();

  drawArmoredSegment(ctx, armLen, 5.0, 4.0, primaryColor, highlightColor, darkColor, isGoldTier);

  ctx.translate(0, armLen);
  ctx.rotate(lElbowAngle);
  drawArmoredSegment(ctx, forearmLen, 4.0, 3.2, primaryColor, highlightColor, darkColor, isGoldTier);

  // Left Gauntlet
  ctx.translate(0, forearmLen);
  ctx.beginPath();
  ctx.arc(0, 0, 3.2, 0, Math.PI * 2);
  ctx.fillStyle = isGoldTier ? '#ca8a04' : '#334155';
  ctx.fill();
  ctx.restore();

  // 8. RIGHT ARM & MASSIVE GLOWING SWORD (Front Arm: Shoulder -> Arm -> Forearm -> Gauntlet -> Sword)
  ctx.save();
  ctx.translate(chestW * 0.48, -chestH * 0.9);
  ctx.rotate(rShoulderAngle);

  // Right 3D Shoulder Pauldron
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, 6.2, Math.PI, Math.PI * 2);
  ctx.fillStyle = isGoldTier ? '#fde047' : highlightColor;
  ctx.fill();
  ctx.strokeStyle = isGoldTier ? '#ca8a04' : '#0f172a';
  ctx.lineWidth = 1.0;
  ctx.stroke();
  ctx.restore();

  drawArmoredSegment(ctx, armLen, 5.2, 4.2, primaryColor, highlightColor, darkColor, isGoldTier);

  ctx.translate(0, armLen);
  ctx.rotate(rElbowAngle);
  drawArmoredSegment(ctx, forearmLen, 4.2, 3.5, primaryColor, highlightColor, darkColor, isGoldTier);

  // Right Gauntlet holding the Great Sword
  ctx.translate(0, forearmLen);
  ctx.rotate(rWristAngle);
  ctx.beginPath();
  ctx.arc(0, 0, 3.6, 0, Math.PI * 2);
  ctx.fillStyle = isGoldTier ? '#ca8a04' : '#334155';
  ctx.fill();

  // 9. ASYMMETRIC WEAPONS: BLUE IMPERIAL QI SWORD vs RED DRAGON FLAME CLEAVER
  if (!isDefeated) {
    ctx.save();
    ctx.rotate(Math.PI * 0.75); // Natural grip angle

    if (isBlue) {
      // BLUE WEAPON: Thanh Kiếm Hiệp Đế Vương (Imperial Celestial Sword) - Thon gọn, sắc lẹm, ánh lam ngọc
      ctx.beginPath();
      ctx.moveTo(-2.8, 0);
      ctx.lineTo(2.8, 0);
      ctx.lineTo(2.2, -38);
      ctx.lineTo(0, -46); // Sharp Needle Tip
      ctx.lineTo(-2.2, -38);
      ctx.closePath();

      const blueBladeGrad = ctx.createLinearGradient(0, -46, 0, 0);
      blueBladeGrad.addColorStop(0, '#ffffff');
      blueBladeGrad.addColorStop(0.3, isGoldTier ? '#e0f2fe' : '#bae6fd');
      blueBladeGrad.addColorStop(1, isGoldTier ? '#0284c7' : '#1e40af');
      ctx.fillStyle = blueBladeGrad;
      ctx.fill();

      ctx.strokeStyle = isGoldTier ? '#fde047' : '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 16 * eyeGlow;
      ctx.stroke();

      // Blue Sword Fuller / Central Qi Ridge
      ctx.beginPath();
      ctx.moveTo(0, -2);
      ctx.lineTo(0, -38);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.9;
      ctx.stroke();

      // Blue Crossguard
      ctx.beginPath();
      ctx.roundRect(-6.0, -3, 12, 3.5, 1.2);
      ctx.fillStyle = isGoldTier ? '#facc15' : '#0369a1';
      ctx.fill();
      ctx.strokeStyle = '#bae6fd';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    } else {
      // RED WEAPON: Bá Vương Long Đao (Dragon Cleaver) - Rộng bản, răng cưa uy mãnh, rực lửa xích diễm
      ctx.beginPath();
      ctx.moveTo(-4.5, 0);
      ctx.lineTo(4.5, 0);
      ctx.lineTo(5.5, -24);
      ctx.lineTo(7.5, -34); // Curved Heavy Cleaver Tip
      ctx.lineTo(0, -44);
      ctx.lineTo(-4.0, -32);
      ctx.closePath();

      const redBladeGrad = ctx.createLinearGradient(0, -44, 0, 0);
      redBladeGrad.addColorStop(0, '#ffffff');
      redBladeGrad.addColorStop(0.3, isGoldTier ? '#fee2e2' : '#fca5a5');
      redBladeGrad.addColorStop(1, isGoldTier ? '#b91c1c' : '#881337');
      ctx.fillStyle = redBladeGrad;
      ctx.fill();

      ctx.strokeStyle = isGoldTier ? '#fde047' : '#ffffff';
      ctx.lineWidth = 1.4;
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 18 * eyeGlow;
      ctx.stroke();

      // Red Dragon Sawtooth Spine
      ctx.beginPath();
      ctx.moveTo(4.5, -10);
      ctx.lineTo(6.5, -14);
      ctx.lineTo(4.8, -18);
      ctx.lineTo(7.0, -22);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // Red Cleaver Guard
      ctx.beginPath();
      ctx.roundRect(-7.5, -3.5, 15, 4.5, 1.5);
      ctx.fillStyle = isGoldTier ? '#ca8a04' : '#991b1b';
      ctx.fill();
      ctx.strokeStyle = '#fca5a5';
      ctx.lineWidth = 0.9;
      ctx.stroke();
    }

    ctx.restore();
  }

  ctx.restore();

  // 10. Asymmetric Combat Slash Crescent Effects (Vệt kiếm khí xanh vs Vệt đao quang đỏ)
  if (!isDefeated && (animState.includes('attack') || isPulsing)) {
    ctx.save();
    ctx.translate(18, -10);
    ctx.rotate(slashArc * 1.2);

    if (isBlue) {
      // Blue: Swift crescent arc with crystalline light particles
      ctx.beginPath();
      ctx.arc(0, 0, 32, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.strokeStyle = isGoldTier ? 'rgba(254, 240, 138, 0.95)' : 'rgba(186, 230, 253, 0.95)';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 18;
      ctx.stroke();

      for (let sp = 0; sp < 4; sp++) {
        const spA = -Math.PI * 0.35 + sp * 0.25;
        ctx.beginPath();
        ctx.arc(Math.cos(spA) * 33, Math.sin(spA) * 33, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = '#bae6fd';
        ctx.fill();
      }
    } else {
      // Red: Heavy fiery cleave trail with ember bursts
      ctx.beginPath();
      ctx.arc(0, 0, 36, -Math.PI * 0.5, Math.PI * 0.4);
      ctx.strokeStyle = isGoldTier ? 'rgba(254, 205, 211, 0.95)' : 'rgba(254, 202, 202, 0.95)';
      ctx.lineWidth = 5.0;
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 22;
      ctx.stroke();

      for (let sp = 0; sp < 5; sp++) {
        const spA = -Math.PI * 0.4 + sp * 0.2;
        ctx.beginPath();
        ctx.arc(Math.cos(spA) * 37, Math.sin(spA) * 37, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = sp % 2 === 0 ? '#fde047' : '#f43f5e';
        ctx.fill();
      }
    }
    ctx.restore();
  }

  // 11. HEAD, FACE, HELMET / TIARA & FLOWING HAIR
  ctx.save();
  ctx.translate(0, -chestH - 3);
  ctx.rotate(headTilt);

  // Neck
  ctx.beginPath();
  ctx.rect(-2.2, 0, 4.4, 4);
  ctx.fillStyle = skinColor;
  ctx.fill();

  // Face Oval
  ctx.beginPath();
  ctx.ellipse(0, -headSize * 0.75, headSize * 0.85, headSize * 1.05, 0, 0, Math.PI * 2);
  const faceGrad = ctx.createRadialGradient(-1, -headSize * 0.75, 1, 0, -headSize * 0.75, headSize);
  faceGrad.addColorStop(0, skinColor);
  faceGrad.addColorStop(1, skinShadow);
  ctx.fillStyle = faceGrad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.7)';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Dynamic Flowing Hair in Wind (Tóc bay theo chuyển động võ thuật)
  ctx.save();
  ctx.fillStyle = isFemale ? (isGoldTier ? '#fbbf24' : '#1e1b4b') : '#0f172a';
  ctx.strokeStyle = 'rgba(0,0,0,0.4)';
  ctx.lineWidth = 0.8;

  // Front Bangs
  ctx.beginPath();
  ctx.moveTo(-headSize * 0.85, -headSize * 0.9);
  ctx.quadraticCurveTo(0, -headSize * 1.35, headSize * 0.85, -headSize * 0.9);
  ctx.lineTo(headSize * 0.55, -headSize * 0.4);
  ctx.lineTo(0, -headSize * 0.65);
  ctx.lineTo(-headSize * 0.55, -headSize * 0.4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Long Mane / Flowing Ponytail waving behind head
  ctx.beginPath();
  ctx.moveTo(-headSize * 0.5, -headSize * 1.2);
  ctx.quadraticCurveTo(-headSize * 1.6 + hairWave * 4, -headSize * 0.4, -headSize * 1.9 + hairWave * 6, headSize * 0.9);
  ctx.quadraticCurveTo(-headSize * 1.3 + hairWave * 3, headSize * 0.3, -headSize * 0.2, -headSize * 0.8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Helmet / Tiara Crown (Mũ giáp Thần Long hoặc Vương miện Valkyrie)
  ctx.beginPath();
  ctx.roundRect(-headSize * 0.9, -headSize * 1.25, headSize * 1.8, 3.8, 1.5);
  ctx.fillStyle = isGoldTier ? '#ca8a04' : '#475569';
  ctx.fill();
  ctx.strokeStyle = isGoldTier ? '#fde047' : '#ffffff';
  ctx.lineWidth = 0.9;
  ctx.stroke();

  // Glowing Visor / Warrior Eyes (Mắt kiếm thần rực sáng)
  if (!isDefeated) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(2.6, -headSize * 0.7, 3.2, 1.6, 0.1, 0, Math.PI * 2);
    ctx.fillStyle = isGoldTier ? '#fffbeb' : glowColor;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 14 * eyeGlow;
    ctx.fill();
    ctx.restore();
  }

  // VIP Crown on top
  if (isGoldTier && !isDefeated) {
    ctx.save();
    ctx.translate(0, -headSize * 1.6);
    ctx.fillStyle = '#fde047';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 12;
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('👑', 0, 0);
    ctx.restore();
  }

  ctx.restore();

  ctx.restore();
}
