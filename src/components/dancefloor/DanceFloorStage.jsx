import React, { useRef, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { DANCE_STYLES, SCENE_BACKGROUNDS } from '../../lib/danceFloorData';
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
const SIZE_CLASS = { small: 'w-12 h-12', medium: 'w-16 h-16', large: 'w-24 h-24' };

function CharacterAvatar({ character, danceClass, sizeClass }) {
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
      <div className={`${sizeClass} rounded-2xl overflow-hidden shadow-xl border-2 border-white/30 ${danceClass}`}>
        <img src={character.mediaUrl} alt={character.name} className="w-full h-full object-cover" />
      </div>
    );
  }

  if (character.mediaType === 'video' && character.mediaUrl) {
    return (
      <div className={`${sizeClass} rounded-2xl overflow-hidden shadow-xl border-2 border-white/30 ${danceClass}`}>
        <video ref={videoRef} src={character.mediaUrl} muted loop playsInline className="hidden" />
        <canvas ref={canvasRef} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`${sizeClass} rounded-2xl bg-gradient-to-br ${character.gradient} flex items-center justify-center text-3xl shadow-xl border-2 border-white/30 ${danceClass}`}>
      {character.emoji}
    </div>
  );
}

// Sàn diễn Render Engine — Canvas 2D particle system tự viết (nhẹ, không phụ thuộc PixiJS/Three.js
// vì dự án hiện chưa cài các thư viện này). Nhân vật hiển thị bằng CSS animation (index.css).
export default function DanceFloorStage({ instances, maxSlots, effectTriggers, sceneId, connectionLabel, isConnected, characters, effects, customBackgroundImage, backgroundVideoUrl, transparent }) {
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
    // Bắt cả trường hợp đổi khung hình 9:16/16:9 — canvas hiệu ứng hạt phải luôn khớp đúng kích thước.
    const resizeObserver = new ResizeObserver(resize);
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);
    return () => {
      window.removeEventListener('resize', resize);
      resizeObserver.disconnect();
    };
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

  const hasCustomBackdrop = !transparent && (customBackgroundImage || backgroundVideoUrl);
  const containerClass = transparent
    ? 'relative w-full h-full min-h-screen overflow-hidden'
    : `relative rounded-3xl border border-white/10 overflow-hidden h-full min-h-[360px] ${hasCustomBackdrop ? '' : `bg-gradient-to-br ${scene.gradient}`}`;
  const containerStyle = !transparent && customBackgroundImage && !backgroundVideoUrl
    ? { backgroundImage: `url(${customBackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : undefined;

  return (
    <div className={containerClass} style={containerStyle}>
      {/* Video Nền Vũ Trường — phát lặp liên tục phía sau nhân vật, ưu tiên cao hơn ảnh nền tĩnh. */}
      {!transparent && backgroundVideoUrl && (
        <video
          key={backgroundVideoUrl}
          src={backgroundVideoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}
      {!transparent && <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent animate-tile-glow" />}

      {!transparent && <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent animate-tile-glow" />}

      <div className="relative z-10 h-full grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 p-5 content-end">
        {slots.map((_, idx) => {
          const inst = instances[idx];
          if (!inst) return <div key={idx} className="h-28" />;
          const character = getById(characters, inst.characterId);
          const dance = getById(DANCE_STYLES, inst.danceId);
          if (!character) return <div key={idx} className="h-28" />;
          const remainingPct = Math.max(0, 1 - (now - inst.startTime) / inst.durationMs);
          const featured = inst.priority >= 10;
          return (
            <div key={inst.instanceId} className="relative flex flex-col items-center justify-end h-28 animate-character-spawn">
              <div className="absolute -top-6 flex flex-row items-center gap-1.5 px-2 py-0.5 rounded-full z-30 pointer-events-none w-max max-w-[140px]"
                   style={{ background: featured ? 'linear-gradient(90deg,#facc15,#f59e0b)' : 'rgba(0,0,0,0.6)', boxShadow: featured ? '0 0 12px 3px rgba(250,204,21,0.6)' : 'none' }}>
                {inst.avatar && (
                  <img src={inst.avatar} alt="avatar" className="w-4 h-4 rounded-full border border-white/80 object-cover flex-shrink-0" />
                )}
                <span className={`text-[11px] font-black truncate ${featured ? 'text-black' : 'text-white'}`}>
                  {featured ? '👑 ' : ''}{inst.username}
                </span>
              </div>
              
              <CharacterAvatar character={character} danceClass={dance ? dance.animationClass : ''} sizeClass={SIZE_CLASS[inst.sizeScale] || SIZE_CLASS.medium} />
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
