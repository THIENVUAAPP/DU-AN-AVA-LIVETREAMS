// 3D Skeletal & Sprite Rendering Engine for Game Chien Dau
// Combines authentic Tripo3D high-fidelity model renders with dynamic 3D forward kinematics,
// full 360-degree combat rotation, articulated limb bobbing/strides, glowing eye visors, and battle aura effects.

export const SKELETON_STATES = {
  IDLE: 'idle',
  WALK: 'walk',
  ATTACK_SLASH: 'attack_slash',
  ATTACK_SPIN: 'attack_spin',
  DANCE: 'dance',
  VICTORY: 'victory'
};

/**
 * Computes 3D joint and kinematic transformation data
 */
export function computeSkeletalJoints({
  gender = 'male',
  animState = SKELETON_STATES.WALK,
  yawAngle = 0, // 0 to 2*PI (360 degrees rotation)
  time = 0,
  phase = 0,
  tier = 1,
  actionProgress = 0
}) {
  const t = time * 0.005 + phase;
  const isFemale = gender === 'female';

  // Kinematic parameters
  let rootY = 0;
  let rootTiltZ = 0;
  let rootScaleX = 1.0;
  let rootScaleY = 1.0;
  let slashAngle = 0;
  let attackLungeX = 0;
  let armSwing = 0;
  let legStride = 0;
  let eyeGlow = 1.0;
  let currentYaw = yawAngle;

  if (animState === SKELETON_STATES.IDLE) {
    rootY = Math.sin(t * 1.5) * 1.2;
    rootScaleY = 1.0 + Math.sin(t * 1.5) * 0.02;
    eyeGlow = 0.8 + Math.sin(t * 2) * 0.2;
  } else if (animState === SKELETON_STATES.WALK) {
    const stepFreq = 5.0;
    const stride = Math.sin(t * stepFreq);
    rootY = Math.abs(Math.sin(t * stepFreq)) * 3.0;
    rootTiltZ = stride * 0.07;
    legStride = stride;
    armSwing = -stride * 0.12;
    eyeGlow = 1.0;
  } else if (animState === SKELETON_STATES.ATTACK_SLASH) {
    const p = (Math.sin(t * 8) + 1) * 0.5;
    slashAngle = (p - 0.5) * 0.35;
    attackLungeX = Math.sin(t * 8) * 8;
    rootY = -Math.abs(Math.sin(t * 8)) * 4.5;
    rootScaleX = 1.15;
    eyeGlow = 1.4;
  } else if (animState === SKELETON_STATES.ATTACK_SPIN) {
    currentYaw = t * 9; // Continuous 360 whirlwind spin
    rootY = Math.sin(t * 9) * 3.0 - 2.0;
    rootScaleX = Math.cos(currentYaw); // 3D projection compression
    eyeGlow = 1.5;
  } else if (animState === SKELETON_STATES.DANCE) {
    const danceT = t * 4.5;
    rootY = Math.abs(Math.sin(danceT)) * 4.0;
    rootTiltZ = Math.sin(danceT * 0.5) * 0.15;
    rootScaleX = 1.0 + Math.sin(danceT) * 0.05;
    armSwing = Math.sin(danceT * 1.5) * 0.2;
    eyeGlow = 1.2;
  } else if (animState === SKELETON_STATES.VICTORY) {
    rootY = Math.abs(Math.sin(t * 3.5)) * 3.5;
    rootTiltZ = Math.sin(t * 2) * 0.1;
    eyeGlow = 1.5;
  }

  return {
    gender,
    isFemale,
    tier,
    currentYaw,
    rootY,
    rootTiltZ,
    rootScaleX,
    rootScaleY,
    slashAngle,
    attackLungeX,
    armSwing,
    legStride,
    eyeGlow,
    time
  };
}

/**
 * Main 3D Warrior Renderer
 * Seamlessly renders high-res 3D Tripo models with dynamic 3D bone physics,
 * glowing eye visors, and battle aura effects.
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
    rootScaleX,
    rootScaleY,
    slashAngle,
    attackLungeX,
    armSwing,
    legStride,
    eyeGlow,
    time
  } = skeletonData;

  const isGoldTier = tier >= 3;
  const teamColor = factionId === 'blue' ? '#38bdf8' : '#ef4444';
  const glowColor = isGoldTier ? '#facc15' : teamColor;

  ctx.save();

  // Apply kinematic transformations (Lunging, Bobbing, Stride tilt, Slashing)
  ctx.translate(attackLungeX, rootY);
  ctx.rotate(rootTiltZ + slashAngle);

  // Directional facing: Blue looks Right, Red looks Left
  // Modulated by 360-degree rotation yaw
  const facingDir = factionId === 'blue' ? 1 : -1;
  const yawProj = Math.cos(currentYaw);
  const flipSign = Math.sign(yawProj) || 1;
  const projScaleX = Math.max(0.25, Math.abs(yawProj)) * facingDir * flipSign;

  ctx.scale(projScaleX * rootScaleX, rootScaleY);

  const img = warriorImages ? warriorImages[gender] : null;

  if (img && img.complete && img.naturalWidth > 0) {
    // 1. Draw High-Resolution 3D Tripo Model
    const baseW = isFemale ? 54 : 58;
    const baseH = isFemale ? 64 : 68;

    ctx.save();
    // Soft shadow below feet
    ctx.beginPath();
    ctx.ellipse(0, baseH * 0.46, baseW * 0.35, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fill();

    // Draw the 3D model sprite centered on canvas
    ctx.drawImage(img, -baseW / 2, -baseH * 0.55, baseW, baseH);

    // 2. Dynamic 3D Glowing Eyes / Dragon Visor Overlay
    const eyeX = isFemale ? 3 : 2;
    const eyeY = isFemale ? -baseH * 0.40 : -baseH * 0.39;

    ctx.save();
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 14 * eyeGlow;
    ctx.fillStyle = isGoldTier ? '#fffbeb' : glowColor;

    // Glowing Eye Visor
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, 3.5, 2.0, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Additional eye flash during combat pulse
    if (isPulsing || tier >= 4) {
      ctx.beginPath();
      ctx.ellipse(eyeX + (isFemale ? -4 : -5), eyeY - 0.5, 2.8, 1.8, -0.1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 3. Dynamic Tier 4 & 5 Golden Shoulder Armor Flares & Divine Corona
    if (tier >= 4) {
      ctx.save();
      ctx.strokeStyle = tier === 5 ? '#facc15' : '#38bdf8';
      ctx.lineWidth = 2;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 12;

      // Golden dragon shoulder aura flare
      ctx.beginPath();
      ctx.arc(-baseW * 0.22, -baseH * 0.28, 8, 0, Math.PI * 2);
      ctx.arc(baseW * 0.24, -baseH * 0.28, 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 4. Martial Arts Slash Qi Trail
    if (Math.abs(slashAngle) > 0.05 || isPulsing) {
      ctx.save();
      const slashGrad = ctx.createLinearGradient(-baseW * 0.4, -baseH * 0.3, baseW * 0.6, baseH * 0.2);
      slashGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      slashGrad.addColorStop(0.4, glowColor);
      slashGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.strokeStyle = slashGrad;
      ctx.lineWidth = 3.5;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(baseW * 0.1, -baseH * 0.1, baseW * 0.45, -Math.PI * 0.4, Math.PI * 0.3);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  } else {
    // Fallback Vector Rendering if sprite is loading
    const primaryColor = isGoldTier ? '#eab308' : (factionId === 'blue' ? '#2563eb' : '#dc2626');
    const armorHighlight = isGoldTier ? '#fef08a' : '#93c5fd';

    // Head
    ctx.beginPath();
    ctx.arc(0, -22, 9, 0, Math.PI * 2);
    ctx.fillStyle = armorHighlight;
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Glowing Visor
    ctx.beginPath();
    ctx.ellipse(2, -22, 4, 2, 0, 0, Math.PI * 2);
    ctx.fillStyle = glowColor;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 10;
    ctx.fill();

    // Torso Plate
    ctx.beginPath();
    ctx.moveTo(-10, -12);
    ctx.lineTo(10, -12);
    ctx.lineTo(8, 8);
    ctx.lineTo(-8, 8);
    ctx.closePath();
    ctx.fillStyle = primaryColor;
    ctx.fill();
    ctx.stroke();

    // Legs
    ctx.beginPath();
    ctx.moveTo(-6, 8);
    ctx.lineTo(-7 + legStride * 4, 26);
    ctx.moveTo(6, 8);
    ctx.lineTo(7 - legStride * 4, 26);
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 5;
    ctx.stroke();

    // Arms
    ctx.beginPath();
    ctx.moveTo(-10, -8);
    ctx.lineTo(-15 + armSwing * 20, 4);
    ctx.moveTo(10, -8);
    ctx.lineTo(16 - armSwing * 20, 4);
    ctx.lineWidth = 4.5;
    ctx.stroke();
  }

  ctx.restore();
}
