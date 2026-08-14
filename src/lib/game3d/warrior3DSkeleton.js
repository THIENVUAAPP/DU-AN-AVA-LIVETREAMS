// 3D Skeletal Rigging & Articulated Kinematics Engine for Game Chien Dau
// Provides full anatomical forward kinematics (head, neck, spine, shoulders, elbows, wrists, hips, knees, ankles),
// layered volumetric shaded armor (breastplate, pauldrons, gauntlets, greaves, boots, flowing hair & mantle),
// fluid human walking, martial arts slashing, and graceful dancing without 2D paper flipping.

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
 * Computes 3D forward kinematics joint angles for human anatomy
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
  const speed = Math.max(0.1, Math.min(2.0, animSpeed || 0.55));
  const t = time * 0.003 * speed + phase;
  const isFemale = gender === 'female';

  // Base Human Anatomical Proportions
  const headRadius = isFemale ? 6.2 : 7.0;
  const neckLen = 3.0;
  const chestHeight = isFemale ? 13.5 : 15.0;
  const shoulderWidth = isFemale ? 13.0 : 16.0;
  const upperArmLen = isFemale ? 9.0 : 10.5;
  const forearmLen = isFemale ? 8.5 : 9.5;
  const hipWidth = isFemale ? 10.5 : 11.5;
  const thighLen = isFemale ? 12.0 : 13.5;
  const shinLen = isFemale ? 11.5 : 12.5;

  // Joint Angles (in radians)
  let rootY = 0;
  let rootTiltZ = 0;
  let chestTwist = 0;
  let headTilt = 0;

  // Left Arm (Shoulder, Elbow)
  let lShoulderAngle = 0.2;
  let lElbowAngle = 0.35;
  // Right Arm (Shoulder, Elbow)
  let rShoulderAngle = -0.2;
  let rElbowAngle = 0.35;

  // Left Leg (Hip, Knee, Ankle)
  let lHipAngle = 0;
  let lKneeAngle = 0.15;
  // Right Leg (Hip, Knee, Ankle)
  let rHipAngle = 0;
  let rKneeAngle = 0.15;

  let eyeGlow = 1.0;
  let slashProgress = 0;
  let hairWave = Math.sin(t * 3.5);

  if (animState === SKELETON_STATES.IDLE) {
    // Calm breathing and balanced ready posture
    const breath = Math.sin(t * 2.0);
    rootY = breath * 1.0;
    chestTwist = Math.sin(t * 1.0) * 0.03;
    headTilt = -chestTwist * 0.5;
    lShoulderAngle = 0.25 + breath * 0.04;
    rShoulderAngle = -0.25 - breath * 0.04;
    lElbowAngle = 0.4 + breath * 0.05;
    rElbowAngle = 0.4 + breath * 0.05;
    lHipAngle = -0.08;
    rHipAngle = 0.08;
    lKneeAngle = 0.18;
    rKneeAngle = 0.18;
    eyeGlow = 0.9 + breath * 0.2;
  } else if (animState === SKELETON_STATES.WALK) {
    // Dignified martial arts advance (bước đi dứt khoát, co duỗi khớp tự nhiên)
    const walkFreq = 3.4;
    const stride = Math.sin(t * walkFreq);

    rootY = Math.abs(stride) * 2.5;
    rootTiltZ = stride * 0.04;
    chestTwist = -stride * 0.1;
    headTilt = stride * 0.05;

    // Legs: Thighs swing, knees bend naturally during lift
    lHipAngle = stride * 0.55;
    lKneeAngle = Math.max(0.1, -stride * 0.8);
    rHipAngle = -stride * 0.55;
    rKneeAngle = Math.max(0.1, stride * 0.8);

    // Arms: Counter-swing in harmony with strides
    lShoulderAngle = -stride * 0.45;
    lElbowAngle = 0.35 + Math.max(0, stride * 0.3);
    rShoulderAngle = stride * 0.45;
    rElbowAngle = 0.35 + Math.max(0, -stride * 0.3);

    eyeGlow = 1.0;
  } else if (animState === SKELETON_STATES.ATTACK_SLASH) {
    // Deliberate martial arts sword slash (lunge, blade sweep, impact recovery)
    const attackPhase = (t * 4.5) % (Math.PI * 2);
    slashProgress = (Math.sin(attackPhase) + 1) * 0.5;

    rootY = 3.0 + Math.sin(attackPhase) * 2.5;
    rootTiltZ = Math.cos(attackPhase) * 0.1;
    chestTwist = Math.sin(attackPhase) * 0.35;
    headTilt = -chestTwist * 0.6;

    // Right arm delivers sweeping slash
    rShoulderAngle = -1.2 + slashProgress * 2.4;
    rElbowAngle = 0.2 + slashProgress * 0.5;

    // Left arm guards chest
    lShoulderAngle = 0.5 - slashProgress * 0.3;
    lElbowAngle = 0.9;

    // Wide anchored combat stance
    lHipAngle = 0.4;
    lKneeAngle = 0.6;
    rHipAngle = -0.5;
    rKneeAngle = 0.4;

    eyeGlow = 1.6;
  } else if (animState === SKELETON_STATES.ATTACK_SPIN) {
    // 360-Degree Centrifugal Sword Tempest
    const spinPhase = t * 6.0;
    rootY = Math.sin(spinPhase) * 2.0;
    rootTiltZ = Math.cos(spinPhase) * 0.08;
    chestTwist = Math.sin(spinPhase) * 0.2;

    lShoulderAngle = 1.2;
    lElbowAngle = 0.25;
    rShoulderAngle = -1.2;
    rElbowAngle = 0.25;

    lHipAngle = Math.sin(spinPhase) * 0.3;
    lKneeAngle = 0.3;
    rHipAngle = -Math.sin(spinPhase) * 0.3;
    rKneeAngle = 0.3;

    eyeGlow = 1.8;
  } else if (animState === SKELETON_STATES.DANCE) {
    // Graceful, smooth rhythmic dance groove (nhún nhảy uyển chuyển, đá chân, vẫy tay)
    const danceFreq = 3.0;
    const dancePhase = t * danceFreq;
    const bounce = Math.abs(Math.sin(dancePhase));
    const hipSway = Math.sin(dancePhase * 0.5);

    rootY = bounce * 3.8;
    rootTiltZ = hipSway * 0.1;
    chestTwist = hipSway * 0.15;
    headTilt = -hipSway * 0.12;

    // Graceful arm wave gestures
    lShoulderAngle = 0.7 + Math.sin(dancePhase) * 0.5;
    lElbowAngle = 0.5 + Math.cos(dancePhase * 1.3) * 0.35;
    rShoulderAngle = -0.7 - Math.cos(dancePhase) * 0.5;
    rElbowAngle = 0.5 - Math.sin(dancePhase * 1.3) * 0.35;

    // Rhythmic leg taps & knee bends
    lHipAngle = hipSway * 0.35;
    lKneeAngle = Math.max(0.1, bounce * 0.55);
    rHipAngle = -hipSway * 0.35;
    rKneeAngle = Math.max(0.1, (1 - bounce) * 0.55);

    eyeGlow = 1.3;
  } else if (animState === SKELETON_STATES.VICTORY) {
    const vPhase = t * 2.8;
    rootY = Math.abs(Math.sin(vPhase)) * 2.5;
    headTilt = -0.2;

    lShoulderAngle = 2.0 + Math.sin(vPhase) * 0.15;
    lElbowAngle = 0.25;
    rShoulderAngle = -2.0 - Math.sin(vPhase) * 0.15;
    rElbowAngle = 0.25;

    lHipAngle = 0.12;
    lKneeAngle = 0.2;
    rHipAngle = -0.12;
    rKneeAngle = 0.2;

    eyeGlow = 1.6;
  } else if (animState === SKELETON_STATES.DEFEATED) {
    // Slumped defeated pose: kneeling on ground, head bowed
    rootY = 11.0;
    rootTiltZ = 0.2;
    chestTwist = 0.08;
    headTilt = 0.45;
    lShoulderAngle = 0.35;
    lElbowAngle = 0.75;
    rShoulderAngle = 0.25;
    rElbowAngle = 0.75;
    lHipAngle = 0.75;
    lKneeAngle = 1.25;
    rHipAngle = 0.55;
    rKneeAngle = 1.15;
    eyeGlow = 0.0;
  } else if (animState === SKELETON_STATES.REVIVE) {
    // Holy ascension revive pose
    const rPhase = t * 6.0;
    rootY = -5.0 + Math.sin(rPhase) * 1.8;
    headTilt = -0.3;
    lShoulderAngle = -1.2;
    lElbowAngle = 0.25;
    rShoulderAngle = -1.2;
    rElbowAngle = 0.25;
    lHipAngle = 0.08;
    lKneeAngle = 0.12;
    rHipAngle = -0.08;
    rKneeAngle = 0.12;
    eyeGlow = 2.4;
  }

  return {
    gender,
    isFemale,
    tier,
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
    hairWave,
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
 * Draws an anatomical limb segment with 3D gradient shading and golden/steel trims
 */
function drawArticulatedBone(
  ctx,
  length,
  widthTop,
  widthBottom,
  jointAngle,
  primaryColor,
  highlightColor,
  darkColor
) {
  ctx.save();
  ctx.rotate(jointAngle);

  // Armored Segment Body
  ctx.beginPath();
  ctx.moveTo(-widthTop / 2, 0);
  ctx.lineTo(widthTop / 2, 0);
  ctx.lineTo(widthBottom / 2, length);
  ctx.lineTo(-widthBottom / 2, length);
  ctx.closePath();

  const grad = ctx.createLinearGradient(-widthTop / 2, 0, widthTop / 2, 0);
  grad.addColorStop(0, highlightColor);
  grad.addColorStop(0.4, primaryColor);
  grad.addColorStop(1, darkColor);
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.strokeStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.lineWidth = 1.0;
  ctx.stroke();

  // Highlight ridge down the center
  ctx.beginPath();
  ctx.moveTo(0, 2);
  ctx.lineTo(0, length - 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Spherical joint cap at top pivot
  ctx.beginPath();
  ctx.arc(0, 0, widthTop * 0.46, 0, Math.PI * 2);
  ctx.fillStyle = highlightColor;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  ctx.restore();
}

/**
 * Master Human Warrior 3D Renderer
 */
export function render3DWarriorSkeleton(ctx, skeletonData, options = {}) {
  const {
    factionId = 'blue',
    scale = 1.0,
    isPulsing = false
  } = options;

  const {
    gender,
    isFemale,
    tier,
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
    hairWave,
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
  const isVipTier = tier >= 4;

  // Skin tones & Armor Palettes
  const skinBase = isFemale ? '#ffe4d6' : '#fcd3b2';
  const skinShadow = isFemale ? '#fca5a5' : '#e28f68';

  const teamAccent = factionId === 'blue' ? '#38bdf8' : '#fb7185';
  const primaryColor = isGoldTier ? '#eab308' : (factionId === 'blue' ? '#2563eb' : '#dc2626');
  const highlightColor = isGoldTier ? '#fef08a' : (factionId === 'blue' ? '#93c5fd' : '#fca5a5');
  const darkColor = isGoldTier ? '#713f12' : '#0f172a';
  const glowColor = isGoldTier ? '#facc15' : teamAccent;

  ctx.save();

  // Root translation & tilt
  ctx.translate(0, rootY);
  ctx.rotate(rootTiltZ);

  // Directional facing: Blue looks Right, Red looks Left (Stable, no 2D card flipping)
  const dir = factionId === 'blue' ? 1 : -1;
  ctx.scale(dir, 1.0);

  // 1. Soft Dynamic Ground Shadow
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(0, (thighLen + shinLen) * 0.95 + 4, 18, 5, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fill();
  ctx.restore();

  // 2. Flowing Battle Mantle / Cloak behind character
  ctx.save();
  const capeWave = Math.sin(skeletonData.time * 0.005 + (rootY || 0)) * 6;
  ctx.beginPath();
  ctx.moveTo(-shoulderWidth * 0.4, -chestHeight);
  ctx.lineTo(-shoulderWidth * 0.8 + capeWave, thighLen * 1.1);
  ctx.quadraticCurveTo(capeWave, thighLen * 1.1 + 6, shoulderWidth * 0.8 + capeWave, thighLen * 1.1);
  ctx.lineTo(shoulderWidth * 0.4, -chestHeight);
  ctx.closePath();

  const capeGrad = ctx.createLinearGradient(0, -chestHeight, 0, thighLen);
  capeGrad.addColorStop(0, isGoldTier ? '#78350f' : (factionId === 'blue' ? '#1e3a8a' : '#881337'));
  capeGrad.addColorStop(1, isGoldTier ? '#ca8a04' : (factionId === 'blue' ? '#2563eb' : '#e11d48'));
  ctx.fillStyle = capeGrad;
  ctx.fill();
  ctx.strokeStyle = isGoldTier ? '#facc15' : '#ffffff';
  ctx.lineWidth = 1.0;
  ctx.stroke();
  ctx.restore();

  // 3. LEFT LEG (Hip -> Thigh -> Knee -> Shin -> Sabaton/Boot)
  ctx.save();
  ctx.translate(-hipWidth / 2, 0); // Left hip pivot
  ctx.rotate(lHipAngle);

  // Left Thigh
  drawArticulatedBone(ctx, thighLen, 7.5, 6.0, 0, primaryColor, highlightColor, darkColor);

  // Left Knee & Shin
  ctx.translate(0, thighLen); // Left knee pivot
  ctx.rotate(lKneeAngle);
  drawArticulatedBone(ctx, shinLen, 6.0, 5.0, 0, primaryColor, highlightColor, darkColor);

  // Left Armored Boot Base
  ctx.beginPath();
  ctx.ellipse(2, shinLen, 6.8, 3.5, 0, 0, Math.PI * 2);
  ctx.fillStyle = isGoldTier ? '#ca8a04' : '#1e293b';
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.0;
  ctx.stroke();
  ctx.restore();

  // 4. RIGHT LEG (Hip -> Thigh -> Knee -> Shin -> Sabaton/Boot)
  ctx.save();
  ctx.translate(hipWidth / 2, 0); // Right hip pivot
  ctx.rotate(rHipAngle);

  // Right Thigh
  drawArticulatedBone(ctx, thighLen, 7.5, 6.0, 0, primaryColor, highlightColor, darkColor);

  // Right Knee & Shin
  ctx.translate(0, thighLen); // Right knee pivot
  ctx.rotate(rKneeAngle);
  drawArticulatedBone(ctx, shinLen, 6.0, 5.0, 0, primaryColor, highlightColor, darkColor);

  // Right Armored Boot Base
  ctx.beginPath();
  ctx.ellipse(2, shinLen, 6.8, 3.5, 0, 0, Math.PI * 2);
  ctx.fillStyle = isGoldTier ? '#ca8a04' : '#1e293b';
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.0;
  ctx.stroke();
  ctx.restore();

  // 5. TORSO & CUIRASS (Pelvis -> Waist -> Chest / Breastplate)
  ctx.save();
  ctx.rotate(chestTwist);

  // Waist / Sash
  ctx.beginPath();
  ctx.rect(-hipWidth / 2 - 1, -4, hipWidth + 2, 5);
  ctx.fillStyle = isGoldTier ? '#854d0e' : '#334155';
  ctx.fill();

  // Breastplate / Cuirass
  ctx.beginPath();
  ctx.moveTo(-shoulderWidth / 2, -chestHeight);
  ctx.lineTo(shoulderWidth / 2, -chestHeight);
  ctx.lineTo(hipWidth / 2, 0);
  ctx.lineTo(-hipWidth / 2, 0);
  ctx.closePath();

  const chestGrad = ctx.createLinearGradient(-shoulderWidth / 2, -chestHeight, shoulderWidth / 2, 0);
  chestGrad.addColorStop(0, highlightColor);
  chestGrad.addColorStop(0.4, primaryColor);
  chestGrad.addColorStop(1, darkColor);
  ctx.fillStyle = chestGrad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Pectoral / Rib Armor Contours
  ctx.beginPath();
  ctx.moveTo(-shoulderWidth * 0.35, -chestHeight * 0.6);
  ctx.lineTo(0, -chestHeight * 0.45);
  ctx.lineTo(shoulderWidth * 0.35, -chestHeight * 0.6);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 1.0;
  ctx.stroke();

  // Core Energy Gem / Dragon Emblem on Breastplate
  ctx.beginPath();
  ctx.arc(0, -chestHeight * 0.52, 3.4, 0, Math.PI * 2);
  ctx.fillStyle = glowColor;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 10;
  ctx.fill();

  // Pauldrons (Shoulder Plates)
  // Left Pauldron
  ctx.beginPath();
  ctx.ellipse(-shoulderWidth / 2 - 2, -chestHeight * 0.92, 5.0, 3.8, -0.2, 0, Math.PI * 2);
  ctx.fillStyle = highlightColor;
  ctx.fill();
  ctx.stroke();

  // Right Pauldron
  ctx.beginPath();
  ctx.ellipse(shoulderWidth / 2 + 2, -chestHeight * 0.92, 5.0, 3.8, 0.2, 0, Math.PI * 2);
  ctx.fillStyle = highlightColor;
  ctx.fill();
  ctx.stroke();

  ctx.restore();

  // 6. LEFT ARM (Clavicle -> Shoulder -> Upper Arm -> Elbow -> Forearm -> Gauntlet)
  ctx.save();
  ctx.translate(-shoulderWidth / 2, -chestHeight * 0.9);
  ctx.rotate(lShoulderAngle);

  // Left Upper Arm
  drawArticulatedBone(ctx, upperArmLen, 5.8, 4.8, 0, primaryColor, highlightColor, darkColor);

  // Left Elbow & Forearm
  ctx.translate(0, upperArmLen);
  ctx.rotate(lElbowAngle);
  drawArticulatedBone(ctx, forearmLen, 4.8, 4.0, 0, primaryColor, highlightColor, darkColor);

  // Left Fist / Gauntlet
  ctx.beginPath();
  ctx.arc(0, forearmLen, 3.6, 0, Math.PI * 2);
  ctx.fillStyle = isGoldTier ? '#ca8a04' : '#64748b';
  ctx.fill();
  ctx.restore();

  // 7. RIGHT ARM (Clavicle -> Shoulder -> Upper Arm -> Elbow -> Forearm -> Weapon)
  ctx.save();
  ctx.translate(shoulderWidth / 2, -chestHeight * 0.9);
  ctx.rotate(rShoulderAngle);

  // Right Upper Arm
  drawArticulatedBone(ctx, upperArmLen, 5.8, 4.8, 0, primaryColor, highlightColor, darkColor);

  // Right Elbow & Forearm
  ctx.translate(0, upperArmLen);
  ctx.rotate(rElbowAngle);
  drawArticulatedBone(ctx, forearmLen, 4.8, 4.0, 0, primaryColor, highlightColor, darkColor);

  // Main Weapon Blade (Kiếm Hiệp Long Kiếm / Thần Kiếm)
  ctx.save();
  ctx.translate(0, forearmLen);
  ctx.rotate(-0.3 + slashProgress * 0.4);

  // Blade
  ctx.beginPath();
  ctx.moveTo(0, -2);
  ctx.lineTo(4.5, -28);
  ctx.lineTo(0, -35);
  ctx.lineTo(-4.5, -28);
  ctx.closePath();

  const swordGrad = ctx.createLinearGradient(0, -35, 0, 0);
  swordGrad.addColorStop(0, '#ffffff');
  swordGrad.addColorStop(0.3, isGoldTier ? '#fde047' : '#93c5fd');
  swordGrad.addColorStop(1, isGoldTier ? '#ca8a04' : '#1e3a8a');
  ctx.fillStyle = swordGrad;
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Glowing Blade Qi Aura
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 16;
  ctx.stroke();

  // Guard & Pommel
  ctx.beginPath();
  ctx.roundRect(-5.5, -3, 11, 4, 2);
  ctx.fillStyle = '#ca8a04';
  ctx.fill();
  ctx.restore();

  ctx.restore();

  // 8. HEAD & FACE & HAIR & HELMET (Neck -> Head)
  ctx.save();
  ctx.translate(0, -chestHeight - neckLen);
  ctx.rotate(headTilt);

  // Neck
  ctx.beginPath();
  ctx.rect(-2.5, 0, 5, neckLen + 1);
  ctx.fillStyle = skinBase;
  ctx.fill();

  // Face Oval
  ctx.beginPath();
  ctx.ellipse(0, -headRadius * 0.7, headRadius * 0.9, headRadius * 1.1, 0, 0, Math.PI * 2);
  const faceGrad = ctx.createRadialGradient(-1, -headRadius * 0.7, 1, 0, -headRadius * 0.7, headRadius);
  faceGrad.addColorStop(0, skinBase);
  faceGrad.addColorStop(1, skinShadow);
  ctx.fillStyle = faceGrad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.7)';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Anime / Martial Arts Hair with Physics Wave
  ctx.save();
  ctx.fillStyle = isFemale ? (isGoldTier ? '#fbbf24' : '#f1f5f9') : '#1e293b';
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.lineWidth = 0.8;

  // Front Bangs
  ctx.beginPath();
  ctx.moveTo(-headRadius * 0.9, -headRadius * 0.9);
  ctx.quadraticCurveTo(0, -headRadius * 1.4, headRadius * 0.9, -headRadius * 0.9);
  ctx.lineTo(headRadius * 0.6, -headRadius * 0.4);
  ctx.lineTo(0, -headRadius * 0.7);
  ctx.lineTo(-headRadius * 0.6, -headRadius * 0.4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Flowing Ponytail / Mane in wind
  ctx.beginPath();
  ctx.moveTo(-headRadius * 0.5, -headRadius * 1.2);
  ctx.quadraticCurveTo(-headRadius * 1.6 + hairWave * 3, -headRadius * 0.4, -headRadius * 1.8 + hairWave * 4, headRadius * 0.8);
  ctx.quadraticCurveTo(-headRadius * 1.2 + hairWave * 2, headRadius * 0.2, -headRadius * 0.2, -headRadius * 0.8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Helmet / Tiara / Headband
  ctx.beginPath();
  ctx.roundRect(-headRadius * 0.9, -headRadius * 1.2, headRadius * 1.8, 3.5, 1.5);
  ctx.fillStyle = isGoldTier ? '#ca8a04' : '#475569';
  ctx.fill();
  ctx.strokeStyle = isGoldTier ? '#fde047' : '#ffffff';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Glowing Visor / Eyes
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(2.5, -headRadius * 0.65, 3.0, 1.5, 0.1, 0, Math.PI * 2);
  ctx.fillStyle = isGoldTier ? '#fffbeb' : glowColor;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 14 * eyeGlow;
  ctx.fill();
  ctx.restore();

  ctx.restore();

  ctx.restore();
}
