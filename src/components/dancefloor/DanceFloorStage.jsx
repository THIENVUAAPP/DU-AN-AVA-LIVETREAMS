import React, { useRef, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { DANCE_STYLES, SCENE_BACKGROUNDS, OUTFITS } from '../../lib/danceFloorData';
import { startChromaKeyLoop } from '../../lib/mediaSegmentation';

function getById(list, id) {
  return list.find((x) => x.id === id) || null;
}

function createParticle(effect, x, y) {
  const angle = Math.random() * Math.PI * 2;
  const speed = 2 + Math.random() * 4;
  return {
    x,
    y,
    vx: effect.particle === 'burst' ? Math.cos(angle) * speed : (Math.random() - 0.5) * 1.5,
    vy:
      effect.particle === 'burst'
        ? Math.sin(angle) * speed
        : effect.particle === 'fall'
        ? 1 + Math.random() * 2
        : -(1 + Math.random() * 2),
    life: 60 + Math.random() * 40,
    maxLife: 100,
    emoji: effect.emoji,
    size: 14 + Math.random() * 10,
    gravity: effect.particle === 'burst' ? 0.12 : 0,
  };
}

// Khung hiển thị nhân vật: emoji minh hoạ (mặc định) hoặc ảnh/video người thật do admin tải lên.
// Ảnh đã tách nền sẵn (PNG trong suốt) nên chỉ cần <img>; video chạy chroma-key theo thời gian thực
// bằng canvas riêng — chỉ xử lý khi thực sự đang hiển thị trên sàn (giới hạn bởi maxSlots).
function CharacterAvatar({ character, danceClass }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (character.mediaType !== 'video') return undefined;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return undefined;
    video.play().catch(() => {});
    const stop = startChromaKeyLoop(video, canvas, character.chromaKeyColor || '#00FF00');
    return () => stop();
  }, [character.mediaType, character.mediaUrl, character.chromaKeyColor]);

  if (character.mediaType === 'image' && character.mediaUrl) {
    return (
      <div className={`w-16 h-16 rounded-2xl overflow-hidden shadow-xl border-2 border-white/30 ${danceClass}`}>
        <img src={character.mediaUrl} alt={character.name} className="w-full h-full object-cover" />
      </div>
    );
  }

  if (character.mediaType === 'video' && character.mediaUrl) {
    return (
      <div className={`w-16 h-16 rounded-2xl overflow-hidden shadow-xl border-2 border-white/30 ${danceClass}`}>
        <video ref={videoRef} src={character.mediaUrl} muted loop playsInline className="hidden" />
        <canvas ref={canvasRef} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${character.gradient} flex items-center justify-center text-3xl shadow-xl border-2 border-white/30 ${danceClass}`}>
      {character.emoji}
    </div>
  );
}

// Sàn diễn Render Engine — Canvas 2D particle system tự viết (nhẹ, không phụ thuộc PixiJS/Three.js
// vì dự án hiện chưa cài các thư viện này). Nhân vật hiển thị bằng CSS animation (index.css).
export default function DanceFloorStage({ instances, maxSlots, effectTriggers, sceneId, connectionLabel, isConnected, characters, effects, customBackgroundImage, transparent }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);
  const processedTriggerIdsRef = useRef(new Set());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    function resize() {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;

    effectTriggers.forEach((trigger) => {
      if (processedTriggerIdsRef.current.has(trigger.id)) return;
      processedTriggerIdsRef.current.add(trigger.id);
      const effect = getById(effects, trigger.effectId);
      if (!effect) return;
      const count = effect.particle === 'burst' ? 34 : 20;
      const originX = trigger.x != null ? trigger.x * w : w / 2 + (Math.random() - 0.5) * w * 0.4;
      const originY = trigger.particle === 'fall' ? -20 : h / 2;
      for (let i = 0; i < count; i++) {
        particlesRef.current.push(createParticle(effect, originX, originY));
      }
    });

    if (processedTriggerIdsRef.current.size > 300) {
      processedTriggerIdsRef.current = new Set(effectTriggers.slice(-80).map((t) => t.id));
    }
  }, [effectTriggers, effects]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function frame() {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0 && p.y < h + 60 && p.y > -60);
      particlesRef.current.forEach((p) => {
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
        ctx.font = `${p.size}px sans-serif`;
        ctx.fillText(p.emoji, p.x, p.y);
        ctx.globalAlpha = 1;
      });
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const scene = getById(SCENE_BACKGROUNDS, sceneId) || SCENE_BACKGROUNDS[0];
  const slots = Array.from({ length: maxSlots });
  const now = Date.now();

  const containerClass = transparent
    ? 'relative w-full h-full min-h-screen overflow-hidden'
    : `relative rounded-3xl border border-white/10 overflow-hidden min-h-[440px] ${customBackgroundImage ? '' : `bg-gradient-to-br ${scene.gradient}`}`;
  const containerStyle = !transparent && customBackgroundImage
    ? { backgroundImage: `url(${customBackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : undefined;

  return (
    <div className={containerClass} style={containerStyle}>
      {!transparent && <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent animate-tile-glow" />}

      {!transparent && (
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div
            className={`px-3 py-1 rounded-full border text-[10px] font-black flex items-center gap-1.5 ${
              isConnected
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : 'bg-gray-500/20 border-gray-500/40 text-gray-400'
            }`}
          >
            {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {connectionLabel}
          </div>
        </div>
      )}

      {!transparent && (
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/50 border border-white/20 text-[10px] font-black text-white">
          🕺 {instances.length}/{maxSlots} SLOT
        </div>
      )}

      <div className="relative z-10 h-full min-h-[440px] grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 p-5 content-end">
        {slots.map((_, idx) => {
          const inst = instances[idx];
          if (!inst) return <div key={idx} className="h-28" />;
          const character = getById(characters, inst.characterId);
          const dance = getById(DANCE_STYLES, inst.danceId);
          const outfit = getById(OUTFITS, inst.outfitId);
          if (!character) return <div key={idx} className="h-28" />;
          const remainingPct = Math.max(0, 1 - (now - inst.startTime) / inst.durationMs);
          return (
            <div key={inst.instanceId} className="relative flex flex-col items-center justify-end h-28 animate-character-spawn">
              {inst.reactionLine && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 px-2 py-1 rounded-xl bg-black/80 border border-white/20 text-[9px] text-white text-center leading-tight z-30">
                  {inst.reactionLine}
                </div>
              )}
              <div className={outfit ? `rounded-2xl ring-2 ${outfit.ringClass}` : ''}>
                <CharacterAvatar character={character} danceClass={dance ? dance.animationClass : ''} />
              </div>
              <span className="mt-1 text-[10px] font-black text-white bg-black/60 px-2 py-0.5 rounded-full truncate max-w-[92px]">
                {inst.username}
              </span>
              <div className="w-14 h-1 rounded-full bg-white/20 mt-1 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#EF4444] to-[#8B5CF6] transition-all duration-500"
                  style={{ width: `${remainingPct * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-20" />
    </div>
  );
}
