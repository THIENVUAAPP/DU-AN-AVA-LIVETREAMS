// 3D Human Warrior & Skeletal Combat Engine for Game Chien Dau
// Renders ultra high-end Tripo 3D Warrior Models (Male Golden Dragon Warrior & Female Platinum Goddess)
// with realistic physics, dynamic sword slashes, martial arts poses, team aura, and particle trails.

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
 * Computes 3D motion kinematics for characters
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

  let rootY = 0;
  let rootTiltZ = 0;
  let rootScaleX = 1.0;
  let rootScaleY = 1.0;
  let swordSlashAngle = 0;
  let swordSlashAlpha = 0;
  let eyeGlow = 1.0;
  let auraIntensity = 1.0;

  if (animState === SKELETON_STATES.IDLE) {
    // Natural martial arts breathing & floating stance
    const breath = Math.sin(t * 2.2);
    rootY = breath * 2.5;
    rootTiltZ = Math.sin(t * 1.1) * 0.03;
    rootScaleY = 1.0 + breath * 0.02;
    rootScaleX = 1.0 - breath * 0.015;
    eyeGlow = 0.8 + breath * 0.3;
    auraIntensity = 0.8;
  } else if (animState === SKELETON_STATES.WALK) {
    // Dynamic martial arts advance stride
    const walkFreq = 3.6;
    const stride = Math.sin(t * walkFreq);
    rootY = Math.abs(stride) * 3.5;
    rootTiltZ = stride * 0.05;
    rootScaleY = 1.0 + Math.abs(stride) * 0.04;
    eyeGlow = 1.0;
    auraIntensity = 1.0;
  } else if (animState === SKELETON_STATES.ATTACK_SLASH) {
    // Fierce forward sword lunge & heavy horizontal slash
    const attackPhase = (t * 5.5) % (Math.PI * 2);
    const slash = Math.sin(attackPhase);
    rootY = 2.0 + slash * 3.0;
    rootTiltZ = slash * 0.15;
    rootScaleX = 1.08;
    rootScaleY = 0.96;
    swordSlashAngle = -0.6 + (slash + 1) * 0.8;
    swordSlashAlpha = Math.max(0, slash);
    eyeGlow = 1.8;
    auraIntensity = 1.8;
  } else if (animState === SKELETON_STATES.ATTACK_SPIN) {
    // 360-degree Whirlwind Blade Hurricane
    const spinPhase = t * 7.5;
    rootY = Math.sin(spinPhase) * 3.0;
    rootTiltZ = Math.cos(spinPhase) * 0.1;
    swordSlashAngle = spinPhase;
    swordSlashAlpha = 1.0;
    eyeGlow = 2.2;
    auraIntensity = 2.2;
  } else if (animState === SKELETON_STATES.DANCE) {
    // Graceful martial arts dance
    const dancePhase = t * 3.2;
    const bounce = Math.abs(Math.sin(dancePhase));
    const sway = Math.sin(dancePhase * 0.5);
    rootY = bounce * 5.0;
    rootTiltZ = sway * 0.08;
    rootScaleY = 1.0 + bounce * 0.05;
    rootScaleX = 1.0 - bounce * 0.03;
    eyeGlow = 1.3;
    auraIntensity = 1.3;
  } else if (animState === SKELETON_STATES.VICTORY) {
    // Victory celebration stance
    const vPhase = t * 3.0;
    rootY = Math.abs(Math.sin(vPhase)) * 4.0;
    rootTiltZ = Math.sin(vPhase * 0.5) * 0.05;
    eyeGlow = 1.8;
    auraIntensity = 2.0;
  } else if (animState === SKELETON_STATES.DEFEATED) {
    // Fallen defeated posture
    rootY = 14.0;
    rootTiltZ = 0.35;
    rootScaleY = 0.75;
    rootScaleX = 1.1;
    eyeGlow = 0.0;
    auraIntensity = 0.1;
  } else if (animState === SKELETON_STATES.REVIVE) {
    // Golden holy ascension
    const rPhase = t * 6.5;
    rootY = -6.0 + Math.sin(rPhase) * 2.5;
    rootTiltZ = 0;
    eyeGlow = 2.5;
    auraIntensity = 2.5;
  }

  return {
    gender,
    isFemale,
    tier,
    animState,
    rootY,
    rootTiltZ,
    rootScaleX,
    rootScaleY,
    swordSlashAngle,
    swordSlashAlpha,
    eyeGlow,
    auraIntensity,
    time
  };
}

/**
 * Master 3D Human Warrior Renderer
 * Renders the full 3D Tripo models with dynamic lighting, glowing energy, sword slash trails, and aura
 */
export function render3DWarriorSkeleton(ctx, skeletonData, options = {}) {
  const {
    factionId = 'blue',
    scale = 1.0,
    isPulsing = false,
    warriorImages = null
  } = options;

  const {
    gender,
    isFemale,
    tier,
    animState,
    rootY,
    rootTiltZ,
    rootScaleX,
    rootScaleY,
    swordSlashAngle,
    swordSlashAlpha,
    eyeGlow,
    auraIntensity,
    time
  } = skeletonData;

  const isGoldTier = tier >= 3;
  const isDefeated = animState === SKELETON_STATES.DEFEATED;
  const teamAccent = factionId === 'blue' ? '#38bdf8' : '#fb7185';
  const glowColor = isGoldTier ? '#facc15' : teamAccent;

  ctx.save();

  // Root translation & bobbing
  ctx.translate(0, rootY);
  ctx.rotate(rootTiltZ);
  ctx.scale(rootScaleX, rootScaleY);

  // Directional facing: Blue looks Right, Red looks Left
  const dir = factionId === 'blue' ? 1 : -1;
  ctx.scale(dir, 1.0);

  // 1. Soft Dynamic Ground Shadow
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(0, 24, 22 * (isDefeated ? 1.3 : 1.0), 6, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fill();
  ctx.restore();

  // 2. Divine Battle Aura Glow (for active combatants & VIPs)
  if (!isDefeated) {
    ctx.save();
    const auraPulse = (Math.sin(time * 0.006) + 1) * 0.5;
    const auraRad = (isGoldTier ? 38 : 28) + auraPulse * 6;

    const auraGrad = ctx.createRadialGradient(0, -6, 5, 0, -6, auraRad);
    if (isGoldTier) {
      auraGrad.addColorStop(0, 'rgba(250, 204, 21, 0.45)');
      auraGrad.addColorStop(0.6, 'rgba(234, 179, 8, 0.2)');
      auraGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
    } else if (factionId === 'blue') {
      auraGrad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
      auraGrad.addColorStop(0.6, 'rgba(37, 99, 235, 0.18)');
      auraGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    } else {
      auraGrad.addColorStop(0, 'rgba(251, 113, 133, 0.4)');
      auraGrad.addColorStop(0.6, 'rgba(225, 29, 72, 0.18)');
      auraGrad.addColorStop(1, 'rgba(251, 113, 133, 0)');
    }

    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, -6, auraRad, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 3. Render 3D High-End Warrior Image (Tripo 3D Model Asset)
  const warriorImg = isFemale ? warriorImages?.female : warriorImages?.male;

  if (warriorImg && warriorImg.complete && warriorImg.naturalWidth > 0) {
    ctx.save();
    
    if (isDefeated) {
      ctx.filter = 'grayscale(100%) opacity(45%)';
    } else if (isPulsing) {
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 24;
    } else if (isGoldTier) {
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 18;
    } else {
      ctx.shadowColor = teamAccent;
      ctx.shadowBlur = 10;
    }

    // High-Resolution Proportions
    // Target height ~ 60px in base scale
    const targetHeight = isFemale ? 56 : 60;
    const aspect = warriorImg.naturalWidth / warriorImg.naturalHeight;
    const targetWidth = targetHeight * aspect;

    // Draw centered on warrior origin
    ctx.drawImage(
      warriorImg,
      -targetWidth / 2,
      -targetHeight + 22,
      targetWidth,
      targetHeight
    );
    ctx.restore();
  } else {
    // Fallback if image is still loading: Render stylized heroic silhouette
    ctx.save();
    const heroGrad = ctx.createLinearGradient(0, -35, 0, 15);
    heroGrad.addColorStop(0, isGoldTier ? '#fde047' : (factionId === 'blue' ? '#93c5fd' : '#fca5a5'));
    heroGrad.addColorStop(1, isGoldTier ? '#ca8a04' : (factionId === 'blue' ? '#1d4ed8' : '#be123c'));
    
    ctx.fillStyle = heroGrad;
    ctx.beginPath();
    ctx.roundRect(-10, -32, 20, 48, 6);
    ctx.fill();
    ctx.restore();
  }

  // 4. Dynamic Sword Slash VFX & Glowing Blade Arc
  if (!isDefeated && (animState === SKELETON_STATES.ATTACK_SLASH || animState === SKELETON_STATES.ATTACK_SPIN || isPulsing)) {
    ctx.save();
    ctx.translate(14, -8);
    ctx.rotate(swordSlashAngle);

    // Glowing Slash Crescent Wave
    ctx.beginPath();
    ctx.arc(0, 0, 24, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.strokeStyle = isGoldTier ? 'rgba(254, 240, 138, 0.95)' : (factionId === 'blue' ? 'rgba(186, 230, 253, 0.95)' : 'rgba(254, 205, 211, 0.95)');
    ctx.lineWidth = 3.5;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 18;
    ctx.stroke();

    // Spark Particles along slash trail
    for (let sp = 0; sp < 3; sp++) {
      const spAngle = -Math.PI * 0.3 + sp * 0.3;
      const spX = Math.cos(spAngle) * 25;
      const spY = Math.sin(spAngle) * 25;
      ctx.beginPath();
      ctx.arc(spX, spY, 2.0, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }

    ctx.restore();
  }

  // 5. VIP Glowing Dragon / Valkyrie Head Crown & Rank Star
  if (isGoldTier && !isDefeated) {
    ctx.save();
    ctx.translate(0, -42);
    ctx.fillStyle = '#fde047';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 12;
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('👑', 0, 0);
    ctx.restore();
  }

  ctx.restore();
}
