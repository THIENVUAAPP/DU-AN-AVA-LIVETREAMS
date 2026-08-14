// 3D Skeletal Humanoid Engine for Game Chien Dau
// Supports full 360-degree 3D rotation, real skeletal joints (spine, neck, head, shoulders, elbows, wrists, hips, knees, ankles),
// dynamic hair/cape physics, 3D perspective projection, and volumetric PBR shaded armor.

export const SKELETON_STATES = {
  IDLE: 'idle',
  WALK: 'walk',
  ATTACK_SLASH: 'attack_slash',
  ATTACK_SPIN: 'attack_spin',
  DANCE: 'dance',
  VICTORY: 'victory'
};

/**
 * 3D Vector helpers
 */
function vec3(x = 0, y = 0, z = 0) {
  return { x, y, z };
}

function rotateY(p, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: p.x * cos + p.z * sin,
    y: p.y,
    z: -p.x * sin + p.z * cos
  };
}

function rotateX(p, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: p.x,
    y: p.y * cos - p.z * sin,
    z: p.y * sin + p.z * cos
  };
}

function rotateZ(p, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: p.x * cos - p.y * sin,
    y: p.x * sin + p.y * cos,
    z: p.z
  };
}

function add(a, b) {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

/**
 * Computes 3D joint positions based on skeletal animation state and time
 */
export function computeSkeletalJoints({
  gender = 'male',
  animState = SKELETON_STATES.WALK,
  yawAngle = 0, // 0 to 2*PI (360 degrees rotation)
  time = 0,
  phase = 0,
  tier = 1,
  actionProgress = 0 // 0 to 1 for attack swings
}) {
  const t = time * 0.005 + phase;
  const isFemale = gender === 'female';

  // Base proportions
  const hipWidth = isFemale ? 6.5 : 5.8;
  const shoulderWidth = isFemale ? 7.2 : 9.5;
  const upperArmLen = 7.5;
  const forearmLen = 7.0;
  const thighLen = 9.0;
  const shinLen = 8.5;
  const torsoHeight = isFemale ? 11.5 : 12.5;
  const headRadius = isFemale ? 5.2 : 5.8;

  // Root translation / bounce
  let rootY = 0;
  let rootTiltZ = 0;
  let rootTiltX = 0;
  let chestTwistY = 0;

  // Joint Angles (Euler)
  let lShoulder = { x: 0, y: 0, z: 0.2 };
  let lElbow = { x: -0.3, y: 0, z: 0 };
  let rShoulder = { x: 0, y: 0, z: -0.2 };
  let rElbow = { x: -0.3, y: 0, z: 0 };

  let lHip = { x: 0, y: 0, z: 0 };
  let lKnee = { x: 0, y: 0, z: 0 };
  let rHip = { x: 0, y: 0, z: 0 };
  let rKnee = { x: 0, y: 0, z: 0 };

  let headTilt = { x: 0, y: 0, z: 0 };
  let hairSway = Math.sin(t * 2) * 0.25;

  let currentYaw = yawAngle;

  if (animState === SKELETON_STATES.IDLE) {
    const breath = Math.sin(t * 1.5) * 0.05;
    rootY = Math.sin(t * 1.5) * 0.8;
    chestTwistY = Math.sin(t * 0.8) * 0.06;
    lShoulder.z = 0.25 + breath;
    rShoulder.z = -0.25 - breath;
    lShoulder.x = Math.sin(t * 1.2) * 0.1;
    rShoulder.x = -Math.sin(t * 1.2) * 0.1;
    lElbow.x = -0.4 + breath;
    rElbow.x = -0.4 + breath;
    lKnee.x = 0.15;
    rKnee.x = 0.15;
  } else if (animState === SKELETON_STATES.WALK) {
    const stepFreq = 4.5;
    const stride = Math.sin(t * stepFreq);
    const counterStride = Math.cos(t * stepFreq);

    rootY = Math.abs(Math.sin(t * stepFreq)) * 1.8;
    rootTiltZ = stride * 0.06;
    chestTwistY = -stride * 0.18;

    // Legs walk cycle
    lHip.x = stride * 0.7;
    lKnee.x = Math.max(0, -stride * 0.9);
    rHip.x = -stride * 0.7;
    rKnee.x = Math.max(0, stride * 0.9);

    // Arms counter-swing
    lShoulder.x = -stride * 0.65;
    lElbow.x = -0.5 - Math.max(0, stride * 0.4);
    rShoulder.x = stride * 0.65;
    rElbow.x = -0.5 - Math.max(0, -stride * 0.4);

    headTilt.y = -chestTwistY * 0.5;
    hairSway = -stride * 0.35;
  } else if (animState === SKELETON_STATES.ATTACK_SLASH) {
    const p = (Math.sin(t * 6) + 1) * 0.5; // continuous slash rhythm
    currentYaw += (p - 0.5) * 0.4;
    chestTwistY = Math.sin(p * Math.PI) * 0.8;

    // Right arm swings heavy blade
    rShoulder.x = -1.2 + p * 2.2;
    rShoulder.y = -0.5 + p * 1.2;
    rShoulder.z = -0.6 + p * 0.8;
    rElbow.x = -0.8 + p * 0.6;

    // Left arm balances
    lShoulder.x = 0.5 - p * 0.8;
    lShoulder.z = 0.8;
    lElbow.x = -1.2;

    // Deep combat stance
    lHip.x = 0.4;
    lKnee.x = 0.6;
    rHip.x = -0.3;
    rKnee.x = 0.4;
    rootY = -2.5;
  } else if (animState === SKELETON_STATES.ATTACK_SPIN) {
    // Continuous 360 Whirlwind Spin
    currentYaw = t * 7;
    chestTwistY = 0;
    rootY = Math.sin(t * 8) * 1.5 - 1.0;

    // Both arms extended in spin attack
    lShoulder.z = 1.4;
    lShoulder.x = 0.2;
    lElbow.x = -0.2;
    rShoulder.z = -1.4;
    rShoulder.x = 0.2;
    rElbow.x = -0.2;

    lHip.x = Math.sin(t * 7) * 0.3;
    rHip.x = -Math.sin(t * 7) * 0.3;
    hairSway = 1.2;
  } else if (animState === SKELETON_STATES.DANCE) {
    const danceT = t * 4;
    rootY = Math.abs(Math.sin(danceT)) * 3.2;
    rootTiltZ = Math.sin(danceT * 0.5) * 0.18;
    currentYaw += Math.sin(danceT * 0.25) * 0.5;

    // Dynamic arm dance waves & elbow bends
    lShoulder.z = 1.1 + Math.sin(danceT) * 0.6;
    lShoulder.x = Math.cos(danceT) * 0.5;
    lElbow.x = -0.9 + Math.sin(danceT * 1.5) * 0.5;

    rShoulder.z = -1.1 - Math.cos(danceT) * 0.6;
    rShoulder.x = Math.sin(danceT) * 0.5;
    rElbow.x = -0.9 - Math.cos(danceT * 1.5) * 0.5;

    // Aerobic leg kicks
    lHip.x = Math.sin(danceT) * 0.5;
    lKnee.x = Math.max(0, Math.sin(danceT) * 0.8);
    rHip.x = -Math.sin(danceT) * 0.5;
    rKnee.x = Math.max(0, -Math.sin(danceT) * 0.8);

    headTilt.z = Math.sin(danceT * 0.5) * 0.2;
    hairSway = Math.sin(danceT * 0.5) * 0.6;
  } else if (animState === SKELETON_STATES.VICTORY) {
    rootY = Math.abs(Math.sin(t * 3)) * 2.5;
    currentYaw += t * 1.2; // 360 celebratory showcase turn

    // Arms raised high in victory
    lShoulder.z = 2.4 + Math.sin(t * 4) * 0.2;
    rShoulder.z = -2.4 - Math.sin(t * 4) * 0.2;
    lElbow.x = -0.4;
    rElbow.x = -0.4;

    lHip.x = 0.15;
    rHip.x = -0.15;
    headTilt.x = -0.3; // Looking up triumphantly
  }

  // --- Forward Kinematics Chain in 3D Space ---
  // Pelvis / Root
  const pelvis = vec3(0, -rootY, 0);

  // Spine & Chest
  const chest = add(pelvis, vec3(0, -torsoHeight, 0));
  const neck = add(chest, vec3(0, -2.5, 0));
  const head = add(neck, vec3(0, -headRadius, 0));
  const hairTip = add(head, vec3(hairSway * 3.5, 9.0, 3.5));

  // Left Arm (Shoulder -> Elbow -> Hand -> Weapon)
  const lShoulderPos = add(chest, vec3(-shoulderWidth / 2, 0, 0));
  const lArmDir = rotateZ(rotateX(vec3(0, upperArmLen, 0), lShoulder.x), lShoulder.z);
  const lElbowPos = add(lShoulderPos, lArmDir);
  const lForearmDir = rotateX(rotateZ(vec3(0, forearmLen, 0), lShoulder.z), lShoulder.x + lElbow.x);
  const lHandPos = add(lElbowPos, lForearmDir);
  const lWeaponTip = add(lHandPos, vec3(0, 10, 3));

  // Right Arm (Shoulder -> Elbow -> Hand -> Main Weapon)
  const rShoulderPos = add(chest, vec3(shoulderWidth / 2, 0, 0));
  const rArmDir = rotateZ(rotateX(vec3(0, upperArmLen, 0), rShoulder.x), rShoulder.z);
  const rElbowPos = add(rShoulderPos, rArmDir);
  const rForearmDir = rotateX(rotateZ(vec3(0, forearmLen, 0), rShoulder.z), rShoulder.x + rElbow.x);
  const rHandPos = add(rElbowPos, rForearmDir);
  const rWeaponTip = add(rHandPos, vec3(0, 12, isFemale ? 6 : 8));

  // Left Leg (Hip -> Knee -> Ankle / Boot)
  const lHipPos = add(pelvis, vec3(-hipWidth / 2, 0, 0));
  const lThighDir = rotateX(vec3(0, thighLen, 0), lHip.x);
  const lKneePos = add(lHipPos, lThighDir);
  const lShinDir = rotateX(vec3(0, shinLen, 0), lHip.x + lKnee.x);
  const lFootPos = add(lKneePos, lShinDir);

  // Right Leg (Hip -> Knee -> Ankle / Boot)
  const rHipPos = add(pelvis, vec3(hipWidth / 2, 0, 0));
  const rThighDir = rotateX(vec3(0, thighLen, 0), rHip.x);
  const rKneePos = add(rHipPos, rThighDir);
  const rShinDir = rotateX(vec3(0, shinLen, 0), rHip.x + rKnee.x);
  const rFootPos = add(rKneePos, rShinDir);

  // Apply Global 3D Yaw Rotation (360 degrees) and Pitch/Tilt
  const rawNodes = {
    pelvis, chest, neck, head, hairTip,
    lShoulder: lShoulderPos, lElbow: lElbowPos, lHand: lHandPos, lWeaponTip,
    rShoulder: rShoulderPos, rElbow: rElbowPos, rHand: rHandPos, rWeaponTip,
    lHip: lHipPos, lKnee: lKneePos, lFoot: lFootPos,
    rHip: rHipPos, rKnee: rKneePos, rFoot: rFootPos
  };

  const transformed = {};
  for (const [key, pt] of Object.entries(rawNodes)) {
    // 1. Root Z-tilt & X-tilt
    let p = rotateZ(pt, rootTiltZ);
    p = rotateX(p, rootTiltX);
    // 2. Global 360 Yaw rotation
    p = rotateY(p, currentYaw);
    transformed[key] = p;
  }

  return {
    transformed,
    gender,
    tier,
    currentYaw,
    isFemale,
    headRadius
  };
}

/**
 * Projects 3D point to 2D Canvas coordinate with depth scaling
 */
function project3D(p, cameraDist = 180) {
  const fov = 1.0;
  const zScale = cameraDist / (cameraDist + p.z);
  return {
    x: p.x * zScale,
    y: p.y * zScale,
    z: p.z,
    scale: zScale
  };
}

/**
 * Renders 3D Skinned Volumetric Bone / Limb
 */
function draw3DLimb(ctx, p1, p2, radiusTop, radiusBottom, colorGrad, strokeColor = '#000000') {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;

  const r1 = radiusTop * p1.scale;
  const r2 = radiusBottom * p2.scale;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(p1.x + nx * r1, p1.y + ny * r1);
  ctx.lineTo(p2.x + nx * r2, p2.y + ny * r2);
  ctx.lineTo(p2.x - nx * r2, p2.y - ny * r2);
  ctx.lineTo(p1.x - nx * r1, p1.y - ny * r1);
  ctx.closePath();

  ctx.fillStyle = colorGrad;
  ctx.fill();
  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.0;
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Main 3D Warrior Skeletal Renderer
 * Draws volumetric, metallic shaded 3D character with full joint articulation and 360° visibility
 */
export function render3DWarriorSkeleton(ctx, skeletonData, { factionId = 'blue', scale = 1.0, isPulsing = false }) {
  const { transformed, isFemale, tier, currentYaw, headRadius } = skeletonData;

  // Project all 3D joints to 2D screen space
  const P = {};
  for (const [k, v] of Object.entries(transformed)) {
    P[k] = project3D(v);
  }

  // 3D Lighting & Palette Setup
  const isGoldTier = tier >= 3;
  const primaryColor = isGoldTier ? '#eab308' : (factionId === 'blue' ? '#2563eb' : '#dc2626');
  const armorHighlight = isGoldTier ? '#fef08a' : '#93c5fd';
  const jointColor = isGoldTier ? '#a16207' : '#1e293b';
  const skinColor = isFemale ? '#fed7aa' : '#fde68a';
  const hairColor = isFemale ? '#fef08a' : '#451a03'; // Platinum blonde for female goddess, dark gold for male

  // Dynamic Depth Sorting of Limbs (Z-Buffer Painter's Algorithm)
  // Ensures back limbs render behind torso, front limbs render in front when rotating 360°
  const parts = [
    // Back Hair / Cape
    {
      depth: (P.head.z + (P.hairTip ? P.hairTip.z : P.head.z)) / 2 + 5,
      draw: () => {
        if (isFemale) {
          // Flowing Long Platinum Blonde Hair
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(P.head.x - 3 * P.head.scale, P.head.y - 2 * P.head.scale);
          ctx.quadraticCurveTo(P.head.x - 6 * P.head.scale, P.chest.y, P.hairTip.x - 3, P.hairTip.y);
          ctx.lineTo(P.hairTip.x + 3, P.hairTip.y);
          ctx.quadraticCurveTo(P.head.x + 6 * P.head.scale, P.chest.y, P.head.x + 3 * P.head.scale, P.head.y - 2 * P.head.scale);
          ctx.closePath();
          const hairGrad = ctx.createLinearGradient(P.head.x, P.head.y, P.hairTip.x, P.hairTip.y);
          hairGrad.addColorStop(0, '#fef08a');
          hairGrad.addColorStop(0.5, '#fde047');
          hairGrad.addColorStop(1, '#ca8a04');
          ctx.fillStyle = hairGrad;
          ctx.fill();
          ctx.strokeStyle = '#a16207';
          ctx.lineWidth = 0.8;
          ctx.stroke();
          ctx.restore();
        }
      }
    },
    // Left Leg
    {
      depth: (P.lHip.z + P.lFoot.z) / 2,
      draw: () => {
        // Thigh
        draw3DLimb(ctx, P.lHip, P.lKnee, isFemale ? 3.4 : 4.0, isFemale ? 2.8 : 3.2, primaryColor, '#0f172a');
        // Knee Joint
        ctx.beginPath();
        ctx.arc(P.lKnee.x, P.lKnee.y, (isFemale ? 3.0 : 3.5) * P.lKnee.scale, 0, Math.PI * 2);
        ctx.fillStyle = armorHighlight;
        ctx.fill();
        // Shin
        draw3DLimb(ctx, P.lKnee, P.lFoot, isFemale ? 2.8 : 3.2, isFemale ? 2.4 : 2.8, primaryColor, '#0f172a');
        // Armored Boot
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(P.lFoot.x, P.lFoot.y, 4.5 * P.lFoot.scale, 3.0 * P.lFoot.scale, 0, 0, Math.PI * 2);
        ctx.fillStyle = isGoldTier ? '#ca8a04' : '#1e293b';
        ctx.fill();
        ctx.restore();
      }
    },
    // Right Leg
    {
      depth: (P.rHip.z + P.rFoot.z) / 2,
      draw: () => {
        // Thigh
        draw3DLimb(ctx, P.rHip, P.rKnee, isFemale ? 3.4 : 4.0, isFemale ? 2.8 : 3.2, primaryColor, '#0f172a');
        // Knee Joint
        ctx.beginPath();
        ctx.arc(P.rKnee.x, P.rKnee.y, (isFemale ? 3.0 : 3.5) * P.rKnee.scale, 0, Math.PI * 2);
        ctx.fillStyle = armorHighlight;
        ctx.fill();
        // Shin
        draw3DLimb(ctx, P.rKnee, P.rFoot, isFemale ? 2.8 : 3.2, isFemale ? 2.4 : 2.8, primaryColor, '#0f172a');
        // Armored Boot
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(P.rFoot.x, P.rFoot.y, 4.5 * P.rFoot.scale, 3.0 * P.rFoot.scale, 0, 0, Math.PI * 2);
        ctx.fillStyle = isGoldTier ? '#ca8a04' : '#1e293b';
        ctx.fill();
        ctx.restore();
      }
    },
    // Torso / Breastplate & Pelvis
    {
      depth: (P.pelvis.z + P.chest.z) / 2,
      draw: () => {
        ctx.save();
        // Armored Breastplate
        ctx.beginPath();
        ctx.moveTo(P.lShoulder.x, P.lShoulder.y);
        ctx.lineTo(P.rShoulder.x, P.rShoulder.y);
        ctx.lineTo(P.rHip.x + 1, P.rHip.y);
        ctx.lineTo(P.lHip.x - 1, P.lHip.y);
        ctx.closePath();

        const chestGrad = ctx.createLinearGradient(P.lShoulder.x, P.lShoulder.y, P.rHip.x, P.rHip.y);
        if (isGoldTier) {
          chestGrad.addColorStop(0, '#fef08a');
          chestGrad.addColorStop(0.5, '#eab308');
          chestGrad.addColorStop(1, '#a16207');
        } else {
          chestGrad.addColorStop(0, armorHighlight);
          chestGrad.addColorStop(0.5, primaryColor);
          chestGrad.addColorStop(1, '#0f172a');
        }
        ctx.fillStyle = chestGrad;
        ctx.fill();
        ctx.strokeStyle = isGoldTier ? '#ffffff' : '#cbd5e1';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // 3D Core Power Gem on Chest
        ctx.beginPath();
        ctx.arc((P.chest.x + P.pelvis.x) / 2, (P.chest.y + P.pelvis.y) / 2, 2.5 * P.chest.scale, 0, Math.PI * 2);
        ctx.fillStyle = factionId === 'blue' ? '#38bdf8' : (isFemale ? '#fb7185' : '#facc15');
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }
    },
    // Left Arm & Weapon
    {
      depth: (P.lShoulder.z + P.lHand.z) / 2,
      draw: () => {
        // Shoulder Pauldron
        ctx.beginPath();
        ctx.arc(P.lShoulder.x, P.lShoulder.y, (isFemale ? 3.5 : 4.5) * P.lShoulder.scale, 0, Math.PI * 2);
        ctx.fillStyle = armorHighlight;
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.stroke();

        // Upper Arm
        draw3DLimb(ctx, P.lShoulder, P.lElbow, isFemale ? 2.5 : 3.0, isFemale ? 2.0 : 2.5, skinColor, '#0f172a');
        // Elbow Joint
        ctx.beginPath();
        ctx.arc(P.lElbow.x, P.lElbow.y, 2.2 * P.lElbow.scale, 0, Math.PI * 2);
        ctx.fillStyle = jointColor;
        ctx.fill();
        // Forearm / Gauntlet
        draw3DLimb(ctx, P.lElbow, P.lHand, isFemale ? 2.4 : 2.8, isFemale ? 2.0 : 2.4, primaryColor, '#0f172a');
      }
    },
    // Right Arm & Main Weapon Blade
    {
      depth: (P.rShoulder.z + P.rHand.z) / 2,
      draw: () => {
        // Shoulder Pauldron
        ctx.beginPath();
        ctx.arc(P.rShoulder.x, P.rShoulder.y, (isFemale ? 3.5 : 4.5) * P.rShoulder.scale, 0, Math.PI * 2);
        ctx.fillStyle = armorHighlight;
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.stroke();

        // Upper Arm
        draw3DLimb(ctx, P.rShoulder, P.rElbow, isFemale ? 2.5 : 3.0, isFemale ? 2.0 : 2.5, skinColor, '#0f172a');
        // Elbow Joint
        ctx.beginPath();
        ctx.arc(P.rElbow.x, P.rElbow.y, 2.2 * P.rElbow.scale, 0, Math.PI * 2);
        ctx.fillStyle = jointColor;
        ctx.fill();
        // Forearm / Gauntlet
        draw3DLimb(ctx, P.rElbow, P.rHand, isFemale ? 2.4 : 2.8, isFemale ? 2.0 : 2.4, primaryColor, '#0f172a');

        // 3D Battle Blade / Sword
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(P.rHand.x, P.rHand.y);
        ctx.lineTo(P.rWeaponTip.x, P.rWeaponTip.y);
        ctx.strokeStyle = isGoldTier ? '#facc15' : '#e2e8f0';
        ctx.lineWidth = isFemale ? 2.8 : 3.8;
        ctx.lineCap = 'round';
        ctx.shadowColor = isGoldTier ? '#facc15' : '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.stroke();

        // Sword Hilt & Core
        ctx.beginPath();
        ctx.arc(P.rHand.x, P.rHand.y, 2.8 * P.rHand.scale, 0, Math.PI * 2);
        ctx.fillStyle = isGoldTier ? '#eab308' : '#64748b';
        ctx.fill();
        ctx.restore();
      }
    },
    // Head / Face / Crown / Glowing Eyes
    {
      depth: P.head.z,
      draw: () => {
        ctx.save();
        const hr = headRadius * P.head.scale;

        // Head Base
        ctx.beginPath();
        ctx.arc(P.head.x, P.head.y, hr, 0, Math.PI * 2);
        ctx.fillStyle = isFemale ? skinColor : (isGoldTier ? '#eab308' : primaryColor);
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.0;
        ctx.stroke();

        // Tiara / Helmet Crest
        ctx.beginPath();
        ctx.moveTo(P.head.x - hr, P.head.y - hr * 0.3);
        ctx.lineTo(P.head.x, P.head.y - hr * 1.3);
        ctx.lineTo(P.head.x + hr, P.head.y - hr * 0.3);
        ctx.closePath();
        ctx.fillStyle = isGoldTier ? '#fde047' : '#94a3b8';
        ctx.fill();
        ctx.stroke();

        // 3D Glowing Eyes / Visor (Turns with 360 degree yaw angle)
        const eyeOffset = Math.sin(currentYaw) * (hr * 0.5);
        const eyeDepth = Math.cos(currentYaw);

        if (eyeDepth > -0.2) {
          // Front-facing or side angle -> eyes visible
          ctx.beginPath();
          ctx.ellipse(P.head.x + eyeOffset, P.head.y, 3.2 * P.head.scale, 1.6 * P.head.scale, 0, 0, Math.PI * 2);
          ctx.fillStyle = factionId === 'blue' ? '#38bdf8' : (isFemale ? '#fb7185' : '#facc15');
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 12;
          ctx.fill();
        }

        ctx.restore();
      }
    }
  ];

  // Sort from back to front (largest Z = furthest back)
  parts.sort((a, b) => b.depth - a.depth);

  // Render all sorted 3D skeletal parts
  for (const part of parts) {
    part.draw();
  }
}
