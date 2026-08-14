// 3D Skeletal Rigging & Articulated Kinematics Engine for Game Chien Dau
// Provides full 14-bone forward kinematics with segmented limb texture mapping,
// independent joint articulation (head, shoulders, elbows, wrists, hips, knees, boots),
// smooth speed-adjusted animation pacing, 360-degree combat rotation, and martial arts VFX.

export const SKELETON_STATES = {
  IDLE: 'idle',
  WALK: 'walk',
  ATTACK_SLASH: 'attack_slash',
  ATTACK_SPIN: 'attack_spin',
  DANCE: 'dance',
  VICTORY: 'victory'
};

/**
 * Computes 3D joint transformations and bone angles
 */
export function computeSkeletalJoints({
  gender = 'male',
  animState = SKELETON_STATES.WALK,
  yawAngle = 0,
  time = 0,
  phase = 0,
  tier = 1,
  animSpeed = 0.55
}) {
  // Paced, natural time scale
  const speed = Math.max(0.1, Math.min(2.0, animSpeed || 0.55));
  const t = time * 0.0028 * speed + phase;
  const isFemale = gender === 'female';

  // Base Anatomical Dimensions (in canvas units)
  const headRadius = isFemale ? 6.5 : 7.2;
  const neckLen = 3.0;
  const chestHeight = isFemale ? 14 : 15;
  const shoulderWidth = isFemale ? 13 : 16;
  const upperArmLen = isFemale ? 9.5 : 10.5;
  const forearmLen = isFemale ? 8.5 : 9.5;
  const hipWidth = isFemale ? 11 : 12;
  const thighLen = isFemale ? 12.0 : 13.0;
  const shinLen = isFemale ? 11.5 : 12.5;

  // Joint Angles (in radians)
  let rootY = 0;
  let rootTiltZ = 0;
  let chestTwist = 0;
  let headTilt = 0;

  // Left Arm (Shoulder, Elbow)
  let lShoulderAngle = 0.2;
  let lElbowAngle = 0.4;
  // Right Arm (Shoulder, Elbow)
  let rShoulderAngle = -0.2;
  let rElbowAngle = 0.4;

  // Left Leg (Hip, Knee)
  let lHipAngle = 0;
  let lKneeAngle = 0.15;
  // Right Leg (Hip, Knee)
  let rHipAngle = 0;
  let rKneeAngle = 0.15;

  let eyeGlow = 1.0;
  let slashProgress = 0;
  let currentYaw = yawAngle;

  if (animState === SKELETON_STATES.IDLE) {
    // Calm breathing and relaxed martial arts ready stance
    const breath = Math.sin(t * 2.0);
    rootY = breath * 1.2;
    chestTwist = Math.sin(t * 1.2) * 0.04;
    headTilt = -chestTwist * 0.5;
    lShoulderAngle = 0.25 + breath * 0.04;
    rShoulderAngle = -0.25 - breath * 0.04;
    lElbowAngle = 0.45 + breath * 0.05;
    rElbowAngle = 0.45 + breath * 0.05;
    lHipAngle = -0.1;
    rHipAngle = 0.1;
    lKneeAngle = 0.2;
    rKneeAngle = 0.2;
    eyeGlow = 0.9 + breath * 0.2;
  } else if (animState === SKELETON_STATES.WALK) {
    // Dignified, steady martial arts march (co duỗi khớp chân tay nhịp nhàng)
    const walkFreq = 3.2;
    const stride = Math.sin(t * walkFreq);
    const counterStride = Math.cos(t * walkFreq);

    // Root natural vertical bobbing and gentle sway
    rootY = Math.abs(stride) * 2.8;
    rootTiltZ = stride * 0.05;
    chestTwist = -stride * 0.12;
    headTilt = stride * 0.06;

    // Legs: Thighs swing, knees bend naturally during lift phase
    lHipAngle = stride * 0.55;
    lKneeAngle = Math.max(0.1, -stride * 0.85); // Knee bends when leg swings back/up
    rHipAngle = -stride * 0.55;
    rKneeAngle = Math.max(0.1, stride * 0.85);

    // Arms: Counter-swing in harmony with legs
    lShoulderAngle = -stride * 0.5;
    lElbowAngle = 0.4 + Math.max(0, stride * 0.35);
    rShoulderAngle = stride * 0.5;
    rElbowAngle = 0.4 + Math.max(0, -stride * 0.35);

    eyeGlow = 1.0;
  } else if (animState === SKELETON_STATES.ATTACK_SLASH) {
    // Deliberate martial arts sword slash (lunge, blade sweep, impact recovery)
    const attackPhase = (t * 4.5) % (Math.PI * 2);
    slashProgress = (Math.sin(attackPhase) + 1) * 0.5;

    // Deep dynamic stance
    rootY = 3.5 + Math.sin(attackPhase) * 2.5;
    rootTiltZ = Math.cos(attackPhase) * 0.12;
    chestTwist = Math.sin(attackPhase) * 0.4;
    headTilt = -chestTwist * 0.7;

    // Right arm swings blade in wide arc
    rShoulderAngle = -1.2 + slashProgress * 2.4;
    rElbowAngle = 0.2 + slashProgress * 0.6;

    // Left arm guards and balances
    lShoulderAngle = 0.6 - slashProgress * 0.4;
    lElbowAngle = 1.1;

    // Wide anchored leg stance
    lHipAngle = 0.45;
    lKneeAngle = 0.65;
    rHipAngle = -0.55;
    rKneeAngle = 0.45;

    eyeGlow = 1.5;
  } else if (animState === SKELETON_STATES.ATTACK_SPIN) {
    // 360-Degree Continuous Whirlwind Spin
    currentYaw = t * 5.0;
    rootY = Math.sin(t * 6.0) * 2.0;
    chestTwist = 0;
    headTilt = 0;

    // Both arms extended in centrifugal slash
    lShoulderAngle = 1.4;
    lElbowAngle = 0.2;
    rShoulderAngle = -1.4;
    rElbowAngle = 0.2;

    lHipAngle = Math.sin(t * 5.0) * 0.25;
    lKneeAngle = 0.3;
    rHipAngle = -Math.sin(t * 5.0) * 0.25;
    rKneeAngle = 0.3;

    eyeGlow = 1.6;
  } else if (animState === SKELETON_STATES.DANCE) {
    // Graceful, smooth aerobic dance groove (nhảy từ từ, nhún nhảy uyển chuyển)
    const danceFreq = 2.8;
    const dancePhase = t * danceFreq;
    const bounce = Math.abs(Math.sin(dancePhase));
    const hipSway = Math.sin(dancePhase * 0.5);

    rootY = bounce * 4.0;
    rootTiltZ = hipSway * 0.12;
    chestTwist = hipSway * 0.18;
    headTilt = -hipSway * 0.15;

    // Graceful arm wave gestures
    lShoulderAngle = 0.8 + Math.sin(dancePhase) * 0.6;
    lElbowAngle = 0.5 + Math.cos(dancePhase * 1.5) * 0.4;
    rShoulderAngle = -0.8 - Math.cos(dancePhase) * 0.6;
    rElbowAngle = 0.5 - Math.sin(dancePhase * 1.5) * 0.4;

    // Aerobic leg taps & knee bends
    lHipAngle = hipSway * 0.4;
    lKneeAngle = Math.max(0.1, bounce * 0.6);
    rHipAngle = -hipSway * 0.4;
    rKneeAngle = Math.max(0.1, (1 - bounce) * 0.6);

    eyeGlow = 1.3;
  } else if (animState === SKELETON_STATES.VICTORY) {
    const vPhase = t * 2.5;
    rootY = Math.abs(Math.sin(vPhase)) * 3.0;
    headTilt = -0.2; // Triumphant upward gaze

    lShoulderAngle = 2.2 + Math.sin(vPhase) * 0.15;
    lElbowAngle = 0.3;
    rShoulderAngle = -2.2 - Math.sin(vPhase) * 0.15;
    rElbowAngle = 0.3;

    lHipAngle = 0.15;
    lKneeAngle = 0.2;
    rHipAngle = -0.15;
    rKneeAngle = 0.2;

    eyeGlow = 1.6;
  }

  return {
    gender,
    isFemale,
    tier,
    currentYaw,
    rootY,
    rootTiltZ,
    chestTwist,
    headTilt,
    lShoulderAngle,
    lElbowAngle,
    rShoulderAngle,
    rElbowAngle,
    lHipAngle,
    lKneeAngle,
    rHipAngle,
    rKneeAngle,
    eyeGlow,
    slashProgress,
    // Bone lengths
    headRadius,
    neckLen,
    chestHeight,
    shoulderWidth,
    upperArmLen,
    forearmLen,
    hipWidth,
    thighLen,
    shinLen,
    time
  };
}

/**
 * Draws an articulated textured or shaded limb bone with smooth rounded joints
 */
function drawArticulatedLimb(
  ctx,
  img,
  cropRect,
  length,
  widthTop,
  widthBottom,
  jointAngle,
  primaryColor,
  highlightColor
) {
  ctx.save();
  ctx.rotate(jointAngle);

  if (img && img.complete && img.naturalWidth > 0 && cropRect) {
    // Draw real textured slice from the 3D Tripo render
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(-widthTop / 2, 0, Math.max(widthTop, widthBottom), length, [widthTop / 2, widthTop / 2, widthBottom / 2, widthBottom / 2]);
    ctx.clip();
    ctx.drawImage(
      img,
      cropRect.sx, cropRect.sy, cropRect.sw, cropRect.sh,
      -widthTop / 2, 0, Math.max(widthTop, widthBottom), length
    );
    ctx.restore();

    // Subtle edge highlight and joint socket
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  } else {
    // Crisp volumetric 3D shaded bone fallback
    ctx.beginPath();
    ctx.moveTo(-widthTop / 2, 0);
    ctx.lineTo(widthTop / 2, 0);
    ctx.lineTo(widthBottom / 2, length);
    ctx.lineTo(-widthBottom / 2, length);
    ctx.closePath();

    const grad = ctx.createLinearGradient(-widthTop / 2, 0, widthTop / 2, 0);
    grad.addColorStop(0, highlightColor);
    grad.addColorStop(0.5, primaryColor);
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.0;
    ctx.stroke();
  }

  // Joint socket circle at top pivot
  ctx.beginPath();
  ctx.arc(0, 0, widthTop * 0.45, 0, Math.PI * 2);
  ctx.fillStyle = highlightColor;
  ctx.fill();

  ctx.restore();
}

/**
 * Main 3D Warrior & Dancer Skeletal Renderer
 * Renders all 14 articulated bones with real joint bending, textured plate armor,
 * 360-degree rotation projection, and glowing eyes.
 */
export function render3DWarriorSkeleton(
  ctx,
  skeletonData,
  {
    factionId = 'blue',
    scale = 1.0,
    isPulsing = false,
    warriorImages = null
  }
) {
  const {
    gender,
    isFemale,
    tier,
    currentYaw,
    rootY,
    rootTiltZ,
    chestTwist,
    headTilt,
    lShoulderAngle,
    lElbowAngle,
    rShoulderAngle,
    rElbowAngle,
    lHipAngle,
    lKneeAngle,
    rHipAngle,
    rKneeAngle,
    eyeGlow,
    slashProgress,
    headRadius,
    neckLen,
    chestHeight,
    shoulderWidth,
    upperArmLen,
    forearmLen,
    hipWidth,
    thighLen,
    shinLen
  } = skeletonData;

  const isGoldTier = tier >= 3;
  const teamColor = factionId === 'blue' ? '#38bdf8' : '#ef4444';
  const primaryColor = isGoldTier ? '#eab308' : (factionId === 'blue' ? '#2563eb' : '#dc2626');
  const highlightColor = isGoldTier ? '#fef08a' : (factionId === 'blue' ? '#93c5fd' : '#fca5a5');
  const glowColor = isGoldTier ? '#facc15' : teamColor;

  const img = warriorImages ? warriorImages[gender] : null;

  // Source Texture Crop Coordinates for Segmented Limbs
  // Normalized to image size (Male 820x876, Female 731x819)
  const iw = img && img.naturalWidth ? img.naturalWidth : (isFemale ? 731 : 820);
  const ih = img && img.naturalHeight ? img.naturalHeight : (isFemale ? 819 : 876);

  const crops = isFemale ? {
    head: { sx: iw * 0.32, sy: 0, sw: iw * 0.48, sh: ih * 0.30 },
    torso: { sx: iw * 0.28, sy: ih * 0.22, sw: iw * 0.44, sh: ih * 0.42 },
    lUpperArm: { sx: iw * 0.16, sy: ih * 0.11, sw: iw * 0.24, sh: ih * 0.28 },
    lForearm: { sx: iw * 0.15, sy: ih * 0.11, sw: iw * 0.22, sh: ih * 0.18 },
    rUpperArm: { sx: iw * 0.60, sy: ih * 0.13, sw: iw * 0.28, sh: ih * 0.28 },
    rForearm: { sx: iw * 0.70, sy: ih * 0.13, sw: iw * 0.28, sh: ih * 0.20 },
    lThigh: { sx: iw * 0.18, sy: ih * 0.52, sw: iw * 0.32, sh: ih * 0.30 },
    lBoot: { sx: iw * 0.02, sy: ih * 0.75, sw: iw * 0.30, sh: ih * 0.24 },
    rThigh: { sx: iw * 0.52, sy: ih * 0.52, sw: iw * 0.32, sh: ih * 0.30 },
    rBoot: { sx: iw * 0.72, sy: ih * 0.75, sw: iw * 0.27, sh: ih * 0.24 }
  } : {
    head: { sx: iw * 0.28, sy: 0, sw: iw * 0.42, sh: ih * 0.30 },
    torso: { sx: iw * 0.26, sy: ih * 0.24, sw: iw * 0.48, sh: ih * 0.38 },
    lUpperArm: { sx: iw * 0.06, sy: ih * 0.14, sw: iw * 0.28, sh: ih * 0.38 },
    lForearm: { sx: iw * 0.14, sy: ih * 0.36, sw: iw * 0.20, sh: ih * 0.20 },
    rUpperArm: { sx: iw * 0.60, sy: ih * 0.17, sw: iw * 0.38, sh: ih * 0.36 },
    rForearm: { sx: iw * 0.74, sy: ih * 0.18, sw: iw * 0.24, sh: ih * 0.30 },
    lThigh: { sx: iw * 0.08, sy: ih * 0.54, sw: iw * 0.34, sh: ih * 0.30 },
    lBoot: { sx: iw * 0.0, sy: ih * 0.77, sw: iw * 0.30, sh: ih * 0.22 },
    rThigh: { sx: iw * 0.55, sy: ih * 0.54, sw: iw * 0.34, sh: ih * 0.30 },
    rBoot: { sx: iw * 0.72, sy: ih * 0.77, sw: iw * 0.27, sh: ih * 0.22 }
  };

  ctx.save();

  // Root translation & tilt
  ctx.translate(0, rootY);
  ctx.rotate(rootTiltZ);

  // Directional facing: Blue looks Right, Red looks Left
  // Modulated by 360-degree yaw angle
  const baseDir = factionId === 'blue' ? 1 : -1;
  const yawCosine = Math.cos(currentYaw);
  const flip = Math.sign(yawCosine) || 1;
  const projX = Math.max(0.35, Math.abs(yawCosine)) * baseDir * flip;

  ctx.scale(projX, 1.0);

  // 1. Soft Shadow on ground plane
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(0, (thighLen + shinLen) * 0.95 + 4, 18, 5, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fill();
  ctx.restore();

  // 2. Flowing Mantle / Cape behind torso
  ctx.save();
  const capeWave = Math.sin(skeletonData.time * 0.006 + (rootY || 0)) * 5;
  ctx.beginPath();
  ctx.moveTo(-shoulderWidth * 0.4, -chestHeight);
  ctx.lineTo(-shoulderWidth * 0.7 + capeWave, thighLen);
  ctx.quadraticCurveTo(capeWave, thighLen + 4, shoulderWidth * 0.7 + capeWave, thighLen);
  ctx.lineTo(shoulderWidth * 0.4, -chestHeight);
  ctx.closePath();
  ctx.fillStyle = isGoldTier ? '#991b1b' : (factionId === 'blue' ? '#1e3a8a' : '#7f1d1d');
  ctx.fill();
  ctx.strokeStyle = isGoldTier ? '#facc15' : '#ffffff';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();

  // 3. LEFT LEG HIERARCHY (Hip -> Thigh -> Knee -> Shin -> Boot)
  ctx.save();
  ctx.translate(-hipWidth / 2, 0); // Left hip pivot
  ctx.rotate(lHipAngle);

  // Left Thigh
  drawArticulatedLimb(
    ctx, img, crops.lThigh,
    thighLen, 7.5, 6.0, 0, primaryColor, highlightColor
  );

  // Left Knee & Shin & Boot
  ctx.translate(0, thighLen); // Left knee pivot
  ctx.rotate(lKneeAngle);

  drawArticulatedLimb(
    ctx, img, crops.lBoot,
    shinLen, 6.0, 5.0, 0, primaryColor, highlightColor
  );

  // Left Armored Boot Base
  ctx.beginPath();
  ctx.ellipse(2, shinLen, 7.0, 3.5, 0, 0, Math.PI * 2);
  ctx.fillStyle = isGoldTier ? '#ca8a04' : '#1e293b';
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.0;
  ctx.stroke();
  ctx.restore();

  // 4. RIGHT LEG HIERARCHY (Hip -> Thigh -> Knee -> Shin -> Boot)
  ctx.save();
  ctx.translate(hipWidth / 2, 0); // Right hip pivot
  ctx.rotate(rHipAngle);

  // Right Thigh
  drawArticulatedLimb(
    ctx, img, crops.rThigh,
    thighLen, 7.5, 6.0, 0, primaryColor, highlightColor
  );

  // Right Knee & Shin & Boot
  ctx.translate(0, thighLen); // Right knee pivot
  ctx.rotate(rKneeAngle);

  drawArticulatedLimb(
    ctx, img, crops.rBoot,
    shinLen, 6.0, 5.0, 0, primaryColor, highlightColor
  );

  // Right Armored Boot Base
  ctx.beginPath();
  ctx.ellipse(2, shinLen, 7.0, 3.5, 0, 0, Math.PI * 2);
  ctx.fillStyle = isGoldTier ? '#ca8a04' : '#1e293b';
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.0;
  ctx.stroke();
  ctx.restore();

  // 5. TORSO & BREASTPLATE HIERARCHY (Pelvis -> Spine -> Chest)
  ctx.save();
  ctx.rotate(chestTwist);

  if (img && img.complete && img.naturalWidth > 0 && crops.torso) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(-shoulderWidth * 0.65, -chestHeight, shoulderWidth * 1.3, chestHeight + 2, 4);
    ctx.clip();
    ctx.drawImage(
      img,
      crops.torso.sx, crops.torso.sy, crops.torso.sw, crops.torso.sh,
      -shoulderWidth * 0.65, -chestHeight, shoulderWidth * 1.3, chestHeight + 2
    );
    ctx.restore();
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  } else {
    // Volumetric breastplate
    ctx.beginPath();
    ctx.moveTo(-shoulderWidth / 2, -chestHeight);
    ctx.lineTo(shoulderWidth / 2, -chestHeight);
    ctx.lineTo(hipWidth / 2, 0);
    ctx.lineTo(-hipWidth / 2, 0);
    ctx.closePath();
    const chestGrad = ctx.createLinearGradient(-shoulderWidth / 2, -chestHeight, shoulderWidth / 2, 0);
    chestGrad.addColorStop(0, highlightColor);
    chestGrad.addColorStop(0.5, primaryColor);
    chestGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = chestGrad;
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();
  }

  // Core Energy Gem on Breastplate
  ctx.beginPath();
  ctx.arc(0, -chestHeight * 0.5, 3.2, 0, Math.PI * 2);
  ctx.fillStyle = glowColor;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.restore();

  // 6. LEFT ARM HIERARCHY (Clavicle -> Shoulder -> Upper Arm -> Elbow -> Forearm -> Hand)
  ctx.save();
  ctx.translate(-shoulderWidth / 2, -chestHeight * 0.9); // Left shoulder socket
  ctx.rotate(lShoulderAngle);

  // Left Upper Arm
  drawArticulatedLimb(
    ctx, img, crops.lUpperArm,
    upperArmLen, 6.0, 5.0, 0, primaryColor, highlightColor
  );

  // Left Elbow & Forearm & Gauntlet
  ctx.translate(0, upperArmLen); // Left elbow socket
  ctx.rotate(lElbowAngle);

  drawArticulatedLimb(
    ctx, img, crops.lForearm,
    forearmLen, 5.0, 4.0, 0, primaryColor, highlightColor
  );

  // Left Fist / Gauntlet
  ctx.beginPath();
  ctx.arc(0, forearmLen, 3.8, 0, Math.PI * 2);
  ctx.fillStyle = isGoldTier ? '#eab308' : '#64748b';
  ctx.fill();
  ctx.restore();

  // 7. RIGHT ARM HIERARCHY (Clavicle -> Shoulder -> Upper Arm -> Elbow -> Forearm -> Main Blade)
  ctx.save();
  ctx.translate(shoulderWidth / 2, -chestHeight * 0.9); // Right shoulder socket
  ctx.rotate(rShoulderAngle);

  // Right Upper Arm
  drawArticulatedLimb(
    ctx, img, crops.rUpperArm,
    upperArmLen, 6.0, 5.0, 0, primaryColor, highlightColor
  );

  // Right Elbow & Forearm & Gauntlet
  ctx.translate(0, upperArmLen); // Right elbow socket
  ctx.rotate(rElbowAngle);

  drawArticulatedLimb(
    ctx, img, crops.rForearm,
    forearmLen, 5.0, 4.0, 0, primaryColor, highlightColor
  );

  // Main Weapon Blade (Kiếm Rồng Hoàng Kim / Nữ Thần)
  ctx.save();
  ctx.translate(0, forearmLen);
  ctx.rotate(-0.3 + slashProgress * 0.4);

  ctx.beginPath();
  ctx.moveTo(0, -3);
  ctx.lineTo(4, -28);
  ctx.lineTo(0, -34);
  ctx.lineTo(-4, -28);
  ctx.closePath();

  const swordGrad = ctx.createLinearGradient(0, -34, 0, 0);
  swordGrad.addColorStop(0, '#ffffff');
  swordGrad.addColorStop(0.3, isGoldTier ? '#fde047' : '#93c5fd');
  swordGrad.addColorStop(1, isGoldTier ? '#ca8a04' : '#1e3a8a');
  ctx.fillStyle = swordGrad;
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Glowing Blade Aura
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 14;
  ctx.stroke();

  // Sword Guard / Hilt
  ctx.beginPath();
  ctx.roundRect(-5, -3, 10, 4, 2);
  ctx.fillStyle = '#ca8a04';
  ctx.fill();
  ctx.restore();

  ctx.restore();

  // 8. HEAD & HELMET / TIARA & GLOWING EYES HIERARCHY (Neck -> Head)
  ctx.save();
  ctx.translate(0, -chestHeight - neckLen); // Neck pivot
  ctx.rotate(headTilt);

  if (img && img.complete && img.naturalWidth > 0 && crops.head) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, -headRadius * 0.7, headRadius * 1.25, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(
      img,
      crops.head.sx, crops.head.sy, crops.head.sw, crops.head.sh,
      -headRadius * 1.3, -headRadius * 2.1, headRadius * 2.6, headRadius * 2.6
    );
    ctx.restore();
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  } else {
    // Head shape
    ctx.beginPath();
    ctx.arc(0, -headRadius * 0.8, headRadius, 0, Math.PI * 2);
    ctx.fillStyle = highlightColor;
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.0;
    ctx.stroke();
  }

  // 3D Glowing Dragon / Valkyrie Eyes (Visor)
  ctx.save();
  const eyeX = isFemale ? 2.5 : 2.0;
  const eyeY = isFemale ? -headRadius * 0.85 : -headRadius * 0.9;
  ctx.beginPath();
  ctx.ellipse(eyeX, eyeY, 3.2, 1.6, 0.1, 0, Math.PI * 2);
  ctx.fillStyle = isGoldTier ? '#fffbeb' : glowColor;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 14 * eyeGlow;
  ctx.fill();
  ctx.restore();

  ctx.restore();

  ctx.restore();
}
