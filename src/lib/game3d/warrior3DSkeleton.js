// 3D Articulated Skeletal Humanoid Warrior Engine for Game Chien Dau
// Provides full anatomical forward kinematics for all joints (head, hair, neck, shoulders, elbows, wrists, hips, knees, ankles, feet, cloak, sword),
// with high-definition volumetric shaded 3D dragon/valkyrie armor, martial arts slashing, and fluid combat movements.

export const SKELETON_STATES = {
  IDLE: 'idle',
  WALK: 'walk',
  ATTACK_SLASH: 'attack_slash',
  ATTACK_SPIN: 'attack_spin',
  DANCE: 'dance',
  VICTORY: 'victory',
  DEFEATED: 'defeated',
  REVIVE: 'revive'
};

/**
 * Computes 3D Forward Kinematics for every human joint and limb
 */
export function computeSkeletalJoints({
  gender = 'male',
  animState = SKELETON_STATES.WALK,
  time = 0,
  phase = 0,
  tier = 1,
  animSpeed = 0.55
}) {
  const speed = Math.max(0.1, Math.min(2.0, animSpeed || 0.55));
  const t = time * 0.003 * speed + phase;
  const isFemale = gender === 'female';

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
  const hairWave = Math.sin(t * 4.0) * 0.3;
  const capeWave = Math.sin(t * 3.5) * 8;
  let eyeGlow = 1.0;
  let slashArc = 0;

  if (animState === SKELETON_STATES.IDLE) {
    // Combat Ready Martial Stance (Thế thủ võ thuật, thở sâu, tay giữ kiếm sẵn sàng)
    const breath = Math.sin(t * 2.2);
    rootY = breath * 2.0;
    chestTwist = Math.sin(t * 1.1) * 0.04;
    headTilt = -chestTwist * 0.6;

    // Guarding arm posture
    lShoulderAngle = 0.45 + breath * 0.03;
    lElbowAngle = 0.85 + breath * 0.04;
    rShoulderAngle = -0.6 - breath * 0.04;
    rElbowAngle = 1.1 + breath * 0.05;
    rWristAngle = -0.3;

    // Solid wide martial arts stance
    lHipAngle = -0.18;
    lKneeAngle = 0.35;
    rHipAngle = 0.22;
    rKneeAngle = 0.3;
    eyeGlow = 0.9 + breath * 0.3;
  } else if (animState === SKELETON_STATES.WALK) {
    // Fluid Human Walk Cycle (Bước tiến linh hoạt, co duỗi khớp tự nhiên)
    const walkFreq = 3.6;
    const stride = Math.sin(t * walkFreq);
    const cosStride = Math.cos(t * walkFreq);

    rootY = Math.abs(stride) * 3.2;
    rootTiltZ = stride * 0.05;
    chestTwist = -stride * 0.12;
    headTilt = stride * 0.06;

    // Leg stride with realistic knee lifting & extension
    lHipAngle = stride * 0.65;
    lKneeAngle = Math.max(0.1, -cosStride * 0.9);
    rHipAngle = -stride * 0.65;
    rKneeAngle = Math.max(0.1, cosStride * 0.9);

    // Arms counter-swinging in sync with strides
    lShoulderAngle = -stride * 0.55;
    lElbowAngle = 0.4 + Math.max(0, stride * 0.4);
    rShoulderAngle = stride * 0.55;
    rElbowAngle = 0.6 + Math.max(0, -stride * 0.4);
    rWristAngle = 0.2;
    eyeGlow = 1.0;
  } else if (animState === SKELETON_STATES.ATTACK_SLASH) {
    // Powerful Forward Sword Lunge & Heavy Slash (Lao người chém kiếm dứt khoát)
    const attackPhase = (t * 5.0) % (Math.PI * 2);
    const slash = Math.sin(attackPhase);
    const lunge = Math.max(0, slash);

    rootY = 2.0 + slash * 3.5;
    rootTiltZ = slash * 0.18;
    chestTwist = slash * 0.45;
    headTilt = -chestTwist * 0.5;

    // Sword arm swings full 140° arc
    rShoulderAngle = -1.4 + (slash + 1) * 1.3;
    rElbowAngle = 0.3 + (1 - slash) * 0.7;
    rWristAngle = slash * 0.6;
    slashArc = slash;

    // Left arm guards chest
    lShoulderAngle = 0.7 - slash * 0.3;
    lElbowAngle = 1.2;

    // Deep martial lunge stance: Front leg bends deep, back leg stretches
    lHipAngle = 0.55 * lunge + 0.1;
    lKneeAngle = 0.75 * lunge + 0.2;
    rHipAngle = -0.65 * lunge - 0.1;
    rKneeAngle = 0.3;
    eyeGlow = 2.2;
  } else if (animState === SKELETON_STATES.ATTACK_SPIN) {
    // 360-degree Whirlwind Blade Tempest (Xoay tròn trảm phong 360 độ)
    const spinPhase = t * 7.5;
    rootY = Math.sin(spinPhase) * 3.0;
    rootTiltZ = Math.cos(spinPhase) * 0.12;
    chestTwist = Math.sin(spinPhase) * 0.4;

    rShoulderAngle = -1.5;
    rElbowAngle = 0.25;
    lShoulderAngle = 1.5;
    lElbowAngle = 0.25;
    slashArc = 1.0;

    lHipAngle = Math.sin(spinPhase) * 0.4;
    lKneeAngle = 0.35;
    rHipAngle = -Math.sin(spinPhase) * 0.4;
    rKneeAngle = 0.35;
    eyeGlow = 2.5;
  } else if (animState === SKELETON_STATES.DANCE) {
    // Graceful martial arts dance
    const danceFreq = 3.2;
    const dancePhase = t * danceFreq;
    const bounce = Math.abs(Math.sin(dancePhase));
    const hipSway = Math.sin(dancePhase * 0.5);

    rootY = bounce * 4.5;
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
    const vPhase = t * 2.8;
    rootY = Math.abs(Math.sin(vPhase)) * 3.5;
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
    const rPhase = t * 6.0;
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

  // 2. Billowing Dragon Mantle / Cloak (Behind body)
  if (!isDefeated) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-chestW * 0.4, -chestH);
    ctx.lineTo(-chestW * 0.8 + capeWave, thighLen * 1.15);
    ctx.quadraticCurveTo(capeWave, thighLen * 1.15 + 7, chestW * 0.8 + capeWave, thighLen * 1.15);
    ctx.lineTo(chestW * 0.4, -chestH);
    ctx.closePath();

    const capeGrad = ctx.createLinearGradient(0, -chestH, 0, thighLen);
    capeGrad.addColorStop(0, isGoldTier ? '#78350f' : (factionId === 'blue' ? '#1e3a8a' : '#881337'));
    capeGrad.addColorStop(1, isGoldTier ? '#ca8a04' : (factionId === 'blue' ? '#2563eb' : '#e11d48'));
    ctx.fillStyle = capeGrad;
    ctx.fill();
    ctx.strokeStyle = isGoldTier ? '#facc15' : '#ffffff';
    ctx.lineWidth = 1.0;
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

  // 9. THE LEGENDARY ENCHANTED SWORD / DRAGON BLADE
  if (!isDefeated) {
    ctx.save();
    ctx.rotate(Math.PI * 0.75); // Natural grip angle pointing upward/forward

    // Sword Blade (Volumetric Glowing Steel)
    ctx.beginPath();
    ctx.moveTo(-3.5, 0);
    ctx.lineTo(3.5, 0);
    ctx.lineTo(2.5, -36);
    ctx.lineTo(0, -42); // Sharp Tip
    ctx.lineTo(-2.5, -36);
    ctx.closePath();

    const bladeGrad = ctx.createLinearGradient(0, -42, 0, 0);
    bladeGrad.addColorStop(0, '#ffffff');
    bladeGrad.addColorStop(0.3, isGoldTier ? '#fde047' : '#93c5fd');
    bladeGrad.addColorStop(1, isGoldTier ? '#ca8a04' : '#1e3a8a');
    ctx.fillStyle = bladeGrad;
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 16 * eyeGlow;
    ctx.stroke();

    // Dragon Crossguard & Pommel
    ctx.beginPath();
    ctx.roundRect(-6.5, -3, 13, 4, 1.5);
    ctx.fillStyle = '#ca8a04';
    ctx.fill();
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();

  // 10. Dynamic Sword Slash Crescent Energy Arc (When attacking/clashing)
  if (!isDefeated && (animState === SKELETON_STATES.ATTACK_SLASH || animState === SKELETON_STATES.ATTACK_SPIN || isPulsing)) {
    ctx.save();
    ctx.translate(16, -10);
    ctx.rotate(slashArc * 1.2);

    ctx.beginPath();
    ctx.arc(0, 0, 30, -Math.PI * 0.45, Math.PI * 0.45);
    ctx.strokeStyle = isGoldTier ? 'rgba(254, 240, 138, 0.95)' : 'rgba(186, 230, 253, 0.95)';
    ctx.lineWidth = 4.0;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 20;
    ctx.stroke();

    // Sparks along slash arc
    for (let sp = 0; sp < 4; sp++) {
      const spA = -Math.PI * 0.35 + sp * 0.25;
      ctx.beginPath();
      ctx.arc(Math.cos(spA) * 31, Math.sin(spA) * 31, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
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
