import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Wifi, WifiOff, Video, Move3d } from 'lucide-react';
import { buildHumanoidFigure, disposeHumanoidFigure } from '../../lib/dance3d/humanoidBuilder';
import { applyDanceMotion, applyCapturedMotion } from '../../lib/dance3d/danceMotions3D';
import { spiralPosition, groupClusterPosition } from '../../lib/dance3d/layout3D';
import { ParticleBurst3D } from '../../lib/dance3d/particles3D';
import { LightTrail } from '../../lib/dance3d/lightTrail';
import { STAGE_PRESETS_3D } from '../../lib/dance3d/stagePresets3D';
import { buildStageEnvironment, animateStageLights } from '../../lib/dance3d/stageEnvironment3D';
import { CHARACTER_SIZE_SCALE } from '../../lib/danceFloorData';

const CAMERA_MODES = [
  { id: 'wide', label: 'Toàn Cảnh', position: [0, 7, 14] },
  { id: 'close', label: 'Cận Cảnh', position: [0, 2, 4.2] },
  { id: 'top', label: 'Trên Cao', position: [0.01, 13, 3.2] },
  { id: 'side', label: 'Bên Hông', position: [12.5, 4, 0] },
];

const LABEL_STYLE = `position:absolute;left:0;top:0;pointer-events:none;text-align:center;white-space:nowrap;
  transition:transform 0.15s ease-out; z-index:20; font-family:inherit;`;

// Sàn Nhảy 3D thật (WebGL/Three.js) — nhân vật procedural thấp-poly (không phải mô hình anime rig sẵn
// thương mại như AUMIX3D, vì đó là asset mỹ thuật 3D không thể tự sinh bằng code) nhưng chuyển động,
// ánh sáng, camera, sương mù, trail ánh sáng tay/chân đều là 3D thật, xem được từ mọi góc.
const backgroundTextureLoader = new THREE.TextureLoader();

export default function Dance3DStage({ instances, characters, effects, effectTriggers, stagePresetId, isConnected, connectionLabel, danceStyles, customBackgroundImage, backgroundVideoUrl, autoCameraEnabled }) {
  const mountRef = useRef(null);
  const labelsContainerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const envRef = useRef(null);
  const instancesMapRef = useRef(new Map());
  const particlesRef = useRef([]);
  const processedEffectIdsRef = useRef(new Set());
  const danceStylesRef = useRef([]);
  const backgroundVideoRef = useRef(null); // { video, texture, url }
  const clockRef = useRef(new THREE.Clock());
  const cameraTargetRef = useRef(new THREE.Vector3(0, 1.2, 0));
  const cameraModeRef = useRef('wide');
  const focusUntilRef = useRef(0);
  const [cameraMode, setCameraModeState] = useState('wide');

  // "Tự động điều chỉnh góc máy" — xoay vòng các góc quay theo chu kỳ như quay đa camera thật, để luôn
  // thấy nhân vật từ nhiều hướng đẹp mắt thay vì đứng yên 1 góc suốt phiên live.
  useEffect(() => {
    if (!autoCameraEnabled) return undefined;
    const interval = setInterval(() => {
      const idx = CAMERA_MODES.findIndex((m) => m.id === cameraModeRef.current);
      const next = CAMERA_MODES[(idx + 1) % CAMERA_MODES.length];
      cameraModeRef.current = next.id;
      setCameraModeState(next.id);
    }, 7000);
    return () => clearInterval(interval);
  }, [autoCameraEnabled]);

  const setCameraMode = (mode) => {
    cameraModeRef.current = mode;
    setCameraModeState(mode);
  };

  // Danh sách điệu nhảy (gồm điệu "sao chép" mocap từ video mẫu) — giữ trong ref vì vòng lặp render
  // chỉ khởi tạo 1 lần, không đọc lại prop trực tiếp được.
  useEffect(() => {
    danceStylesRef.current = danceStyles || [];
  }, [danceStyles]);

  // Khởi tạo scene 1 lần — renderer, camera, vòng lặp render.
  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 5.2, 9.5);
    cameraRef.current = camera;

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clockRef.current.getDelta(), 0.1);
      const elapsed = clockRef.current.getElapsedTime();

      if (envRef.current) animateStageLights(envRef.current, elapsed);

      instancesMapRef.current.forEach((entry) => {
        const style = danceStylesRef.current.find((d) => d.id === entry.danceId);
        if (style?.type === 'mocap') {
          applyCapturedMotion(style, entry.parts, elapsed + entry.phase);
        } else {
          applyDanceMotion(entry.danceId, entry.parts, elapsed, entry.phase);
        }
      });
      scene.updateMatrixWorld(true);

      // Ảnh/video chân dung luôn quay mặt về camera (billboard) bất kể thân/đầu đang xoay theo điệu
      // nhảy — nếu không sẽ có lúc nhìn thấy mảng ảnh từ cạnh bên (gần như biến mất). Phải quy đổi
      // quaternion camera sang không gian LOCAL của headGroup (vì headGroup lồng trong hips đang xoay).
      instancesMapRef.current.forEach((entry) => {
        if (!entry.parts.portrait) return;
        const parentWorldQuat = new THREE.Quaternion();
        entry.parts.headGroup.getWorldQuaternion(parentWorldQuat);
        entry.parts.portrait.quaternion.copy(parentWorldQuat.invert().multiply(camera.quaternion));
      });

      const width2 = mount.clientWidth;
      const height2 = mount.clientHeight;
      instancesMapRef.current.forEach((entry) => {
        if (entry.videoTexture) entry.videoTexture.needsUpdate = true;
        if (entry.trail) {
          const tipWorld = new THREE.Vector3();
          entry.parts.rightArm.tip.getWorldPosition(tipWorld);
          entry.trail.update(tipWorld);
        }
        if (entry.labelEl) {
          const worldPos = new THREE.Vector3();
          entry.group.getWorldPosition(worldPos);
          // 2.1 (không phải 1.3 như trước) để tên luôn nằm HẲN phía trên mảng ảnh chân dung lớn mới —
          // giá trị cũ khiến tên đè lên giữa ảnh nhân vật, đúng cảm giác "không thấy rõ nhân vật".
          worldPos.y += 2.1 * entry.sizeScale;
          worldPos.project(camera);
          const x = (worldPos.x * 0.5 + 0.5) * width2;
          const y = (-worldPos.y * 0.5 + 0.5) * height2;
          const scale = entry.featured ? 1.7 : 1;
          entry.labelEl.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px) scale(${scale})`;
          entry.labelEl.style.display = worldPos.z > 1 ? 'none' : 'block';
        }
      });

      particlesRef.current = particlesRef.current.filter((p) => {
        const alive = p.update(delta);
        if (!alive) {
          scene.remove(p.points);
          p.dispose();
        }
        return alive;
      });

      const now = performance.now();
      const activeMode = now < focusUntilRef.current ? 'close' : cameraModeRef.current;
      const modeConf = CAMERA_MODES.find((m) => m.id === activeMode) || CAMERA_MODES[0];
      // Đông nhân vật hơn thì camera Toàn Cảnh tự lùi xa hơn — "tự động mở rộng màn hình sàn" để vẫn
      // nhìn thấy hết mọi người thay vì bị cắt khung khi sàn đông.
      const crowdZoomOut = activeMode === 'wide' ? 1 + Math.min(1.6, Math.max(0, (instancesMapRef.current.size - 10) / 40)) : 1;
      const desired = new THREE.Vector3(...modeConf.position).multiplyScalar(crowdZoomOut).add(cameraTargetRef.current.clone().multiplyScalar(activeMode === 'close' ? 1 : 0));
      camera.position.lerp(desired, 0.03);
      camera.lookAt(activeMode === 'close' ? cameraTargetRef.current : new THREE.Vector3(0, 1.2, 0));

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);
    // Bắt cả trường hợp đổi khung hình 9:16/16:9 hay đổi bố cục layout — không chỉ resize cửa sổ trình
    // duyệt — để camera/renderer luôn khớp đúng kích thước khung sàn diễn thật.
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      instancesMapRef.current.forEach((entry) => {
        entry.stopVideo?.();
        disposeHumanoidFigure(entry.group);
        entry.labelEl?.remove();
      });
      instancesMapRef.current.clear();
      if (backgroundVideoRef.current) {
        backgroundVideoRef.current.video.pause();
        backgroundVideoRef.current.texture.dispose();
        backgroundVideoRef.current = null;
      }
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  // Đổi preset sàn 3D (nền/đèn/sương). Thứ tự ưu tiên phông nền: Video Nền Vũ Trường đang chọn (phát
  // lặp liên tục, nhân vật nhảy đè lên trên) > ảnh nền tuỳ chỉnh (dùng chung setting với Sàn 2D) > màu
  // preset. Sương mù vẫn giữ theo preset để không che mất video/ảnh nền.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const prevEnv = scene.getObjectByName('stage_env');
    if (prevEnv) scene.remove(prevEnv);
    const preset = STAGE_PRESETS_3D.find((p) => p.id === stagePresetId) || STAGE_PRESETS_3D[0];

    if (backgroundVideoRef.current && backgroundVideoRef.current.url !== backgroundVideoUrl) {
      backgroundVideoRef.current.video.pause();
      backgroundVideoRef.current.texture.dispose();
      backgroundVideoRef.current = null;
    }

    if (backgroundVideoUrl) {
      if (!backgroundVideoRef.current) {
        const video = document.createElement('video');
        // BẮT BUỘC gán muted/playsInline TRƯỚC khi gọi play() — trình duyệt chặn autoplay có tiếng nếu
        // gọi play() trước khi muted=true, khiến video đứng yên ở khung hình đen mà không báo lỗi rõ.
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.src = backgroundVideoUrl;
        // AbortError xảy ra khi đổi video nền liên tục quá nhanh (play() bị pause() chen ngang) — vô
        // hại, không cần báo lỗi; chỉ log các lỗi thật (file hỏng, không đọc được...).
        video.play().catch((err) => {
          if (err?.name !== 'AbortError') console.error('Phát video nền lỗi:', err);
        });
        const texture = new THREE.VideoTexture(video);
        texture.colorSpace = THREE.SRGBColorSpace;
        backgroundVideoRef.current = { video, texture, url: backgroundVideoUrl };
      }
      scene.background = backgroundVideoRef.current.texture;
    } else if (customBackgroundImage) {
      backgroundTextureLoader.load(customBackgroundImage, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        if (sceneRef.current === scene) scene.background = texture;
      });
    } else {
      scene.background = new THREE.Color(preset.backdropColor);
    }
    scene.fog = new THREE.FogExp2(preset.fogColor, 0.045);
    const env = buildStageEnvironment(preset, !!backgroundVideoUrl);
    env.group.name = 'stage_env';
    scene.add(env.group);
    envRef.current = env;
  }, [stagePresetId, customBackgroundImage, backgroundVideoUrl]);

  // Đồng bộ nhân vật đang hiển thị (thêm/xoá) — dựng hình nhân 3D + nhãn tên/level HTML nổi trên canvas.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const currentIds = new Set(instances.map((i) => i.instanceId));

    instancesMapRef.current.forEach((entry, id) => {
      if (!currentIds.has(id)) {
        scene.remove(entry.group);
        entry.stopVideo?.();
        disposeHumanoidFigure(entry.group);
        if (entry.trail) scene.remove(entry.trail.line);
        entry.labelEl?.remove();
        instancesMapRef.current.delete(id);
      }
    });

    const groupCounts = {};
    instances.forEach((inst) => {
      if (inst.groupId) groupCounts[inst.groupId] = (groupCounts[inst.groupId] || 0) + 1;
    });
    const groupSeenIndex = {};

    instances.forEach((inst, idx) => {
      if (instancesMapRef.current.has(inst.instanceId)) return;
      const character = characters.find((c) => c.id === inst.characterId);
      if (!character) return;
      const { group, parts, videoTexture, stopVideo } = buildHumanoidFigure(character);

      const base = spiralPosition(idx, instances.length);
      let pos = base;
      if (inst.groupId && groupCounts[inst.groupId] > 1) {
        const memberIndex = groupSeenIndex[inst.groupId] || 0;
        groupSeenIndex[inst.groupId] = memberIndex + 1;
        pos = groupClusterPosition(base.x, base.z, memberIndex, groupCounts[inst.groupId]);
      }
      group.position.set(pos.x, 0, pos.z);
      group.scale.setScalar(CHARACTER_SIZE_SCALE[inst.sizeScale] || 1);
      scene.add(group);

      const featured = inst.priority >= 10;
      const labelEl = document.createElement('div');
      labelEl.style.cssText = LABEL_STYLE;
      // Chỉ hiện tên nhân vật trên đầu (đặt cao, chữ to hơn, có hào quang khi nổi bật) — KHÔNG hiện lại
      // dòng bình luận/phản hồi ở đây nữa (đã có sẵn ở "Bình Luận Trực Tiếp" + "Nhật Ký Phản Hồi Trực
      // Tiếp" bên dưới sàn, tránh che khuất sàn diễn).
      labelEl.innerHTML = `
        <div style="display:inline-block;padding:3px 10px;border-radius:9999px;background:${featured ? 'linear-gradient(90deg,#facc15,#f59e0b)' : 'rgba(0,0,0,0.7)'};color:${featured ? '#000' : '#fff'};font-size:12px;font-weight:900;letter-spacing:0.3px;${featured ? 'box-shadow:0 0 16px 4px rgba(250,204,21,0.7);' : ''}">${featured ? '👑 ' : ''}${inst.username}</div>
      `;
      labelsContainerRef.current?.appendChild(labelEl);

      let trail = null;
      if (featured) {
        trail = new LightTrail('#facc15');
        scene.add(trail.line);
        focusUntilRef.current = performance.now() + 3200;
        cameraTargetRef.current.set(pos.x, 1.2, pos.z);
      }

      instancesMapRef.current.set(inst.instanceId, {
        group, parts, labelEl, trail, featured, videoTexture, stopVideo,
        danceId: inst.danceId || 'dance_bounce',
        phase: inst.groupId ? 0 : Math.random() * 10,
        sizeScale: CHARACTER_SIZE_SCALE[inst.sizeScale] || 1,
      });
    });
  }, [instances, characters]);

  // Bắn hiệu ứng hạt 3D khi có effectTriggers mới
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    effectTriggers.forEach((trigger) => {
      if (processedEffectIdsRef.current.has(trigger.id)) return;
      processedEffectIdsRef.current.add(trigger.id);
      const effect = effects.find((f) => f.id === trigger.effectId);
      if (!effect) return;
      const origin = new THREE.Vector3((Math.random() - 0.5) * 4, 1.4, (Math.random() - 0.5) * 4);
      const burst = new ParticleBurst3D(effect, origin);
      scene.add(burst.points);
      particlesRef.current.push(burst);
    });
    if (processedEffectIdsRef.current.size > 200) {
      processedEffectIdsRef.current = new Set(effectTriggers.slice(-60).map((t) => t.id));
    }
  }, [effectTriggers, effects]);

  return (
    <div className="relative rounded-3xl border border-white/10 overflow-hidden h-full min-h-[360px] bg-black">
      <div ref={mountRef} className="absolute inset-0" />
      <div ref={labelsContainerRef} className="absolute inset-0 pointer-events-none overflow-hidden" />

      <div className="absolute top-3 left-3 flex items-center gap-2 z-30">
        <div className={`px-3 py-1 rounded-full border text-[10px] font-black flex items-center gap-1.5 ${isConnected ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-gray-500/20 border-gray-500/40 text-gray-400'}`}>
          {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          {connectionLabel}
        </div>
        <div className="px-3 py-1 rounded-full bg-black/60 border border-white/20 text-[10px] font-black text-white flex items-center gap-1">
          <Move3d className="w-3 h-3" /> SÀN 3D
        </div>
      </div>

      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-30">
        {autoCameraEnabled && (
          <span className="px-2 py-1 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
            🔄 TỰ ĐỘNG
          </span>
        )}
        {CAMERA_MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setCameraMode(m.id)}
            className={`px-2.5 py-1 rounded-full text-[9px] font-black cursor-pointer transition-all flex items-center gap-1 ${
              cameraMode === m.id ? 'bg-[#8B5CF6] text-white' : 'bg-black/50 text-gray-300 hover:bg-black/70'
            }`}
          >
            <Video className="w-3 h-3" /> {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
