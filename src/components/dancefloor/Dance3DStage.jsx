import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Wifi, WifiOff, Video, Move3d } from 'lucide-react';
import { buildHumanoidFigure, disposeHumanoidFigure } from '../../lib/dance3d/humanoidBuilder';
import { applyDanceMotion } from '../../lib/dance3d/danceMotions3D';
import { spiralPosition, groupClusterPosition } from '../../lib/dance3d/layout3D';
import { ParticleBurst3D } from '../../lib/dance3d/particles3D';
import { LightTrail } from '../../lib/dance3d/lightTrail';
import { STAGE_PRESETS_3D } from '../../lib/dance3d/stagePresets3D';
import { buildStageEnvironment, animateStageLights } from '../../lib/dance3d/stageEnvironment3D';

const CAMERA_MODES = [
  { id: 'wide', label: 'Toàn Cảnh', position: [0, 5.2, 9.5] },
  { id: 'close', label: 'Cận Cảnh', position: [0, 2, 4.2] },
  { id: 'top', label: 'Trên Cao', position: [0.01, 9.2, 2.4] },
  { id: 'side', label: 'Bên Hông', position: [8.5, 3, 0] },
];

const LABEL_STYLE = `position:absolute;left:0;top:0;pointer-events:none;text-align:center;white-space:nowrap;
  transition:transform 0.15s ease-out; z-index:20; font-family:inherit;`;

// Sàn Nhảy 3D thật (WebGL/Three.js) — nhân vật procedural thấp-poly (không phải mô hình anime rig sẵn
// thương mại như AUMIX3D, vì đó là asset mỹ thuật 3D không thể tự sinh bằng code) nhưng chuyển động,
// ánh sáng, camera, sương mù, trail ánh sáng tay/chân đều là 3D thật, xem được từ mọi góc.
export default function Dance3DStage({ instances, characters, effects, effectTriggers, stagePresetId, isConnected, connectionLabel }) {
  const mountRef = useRef(null);
  const labelsContainerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const envRef = useRef(null);
  const instancesMapRef = useRef(new Map());
  const particlesRef = useRef([]);
  const processedEffectIdsRef = useRef(new Set());
  const clockRef = useRef(new THREE.Clock());
  const cameraTargetRef = useRef(new THREE.Vector3(0, 1.2, 0));
  const cameraModeRef = useRef('wide');
  const focusUntilRef = useRef(0);
  const [cameraMode, setCameraModeState] = useState('wide');

  const setCameraMode = (mode) => {
    cameraModeRef.current = mode;
    setCameraModeState(mode);
  };

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
        applyDanceMotion(entry.danceId, entry.parts, elapsed, entry.phase);
      });
      scene.updateMatrixWorld(true);

      const width2 = mount.clientWidth;
      const height2 = mount.clientHeight;
      instancesMapRef.current.forEach((entry) => {
        if (entry.trail) {
          const tipWorld = new THREE.Vector3();
          entry.parts.rightArm.tip.getWorldPosition(tipWorld);
          entry.trail.update(tipWorld);
        }
        if (entry.labelEl) {
          const worldPos = new THREE.Vector3();
          entry.group.getWorldPosition(worldPos);
          worldPos.y += 1.3;
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
      const desired = new THREE.Vector3(...modeConf.position).add(cameraTargetRef.current.clone().multiplyScalar(activeMode === 'close' ? 1 : 0));
      camera.position.lerp(desired, 0.03);
      camera.lookAt(activeMode === 'close' ? cameraTargetRef.current : new THREE.Vector3(0, 1.2, 0));

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  // Đổi preset sàn 3D (nền/đèn/sương)
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const prevEnv = scene.getObjectByName('stage_env');
    if (prevEnv) scene.remove(prevEnv);
    const preset = STAGE_PRESETS_3D.find((p) => p.id === stagePresetId) || STAGE_PRESETS_3D[0];
    scene.background = new THREE.Color(preset.backdropColor);
    scene.fog = new THREE.FogExp2(preset.fogColor, 0.045);
    const env = buildStageEnvironment(preset);
    env.group.name = 'stage_env';
    scene.add(env.group);
    envRef.current = env;
  }, [stagePresetId]);

  // Đồng bộ nhân vật đang hiển thị (thêm/xoá) — dựng hình nhân 3D + nhãn tên/level HTML nổi trên canvas.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const currentIds = new Set(instances.map((i) => i.instanceId));

    instancesMapRef.current.forEach((entry, id) => {
      if (!currentIds.has(id)) {
        scene.remove(entry.group);
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
      const { group, parts } = buildHumanoidFigure(character);

      const base = spiralPosition(idx, instances.length);
      let pos = base;
      if (inst.groupId && groupCounts[inst.groupId] > 1) {
        const memberIndex = groupSeenIndex[inst.groupId] || 0;
        groupSeenIndex[inst.groupId] = memberIndex + 1;
        pos = groupClusterPosition(base.x, base.z, memberIndex, groupCounts[inst.groupId]);
      }
      group.position.set(pos.x, 0, pos.z);
      scene.add(group);

      const featured = inst.priority >= 10;
      const labelEl = document.createElement('div');
      labelEl.style.cssText = LABEL_STYLE;
      labelEl.innerHTML = `
        <div style="display:inline-block;padding:2px 8px;border-radius:9999px;background:${featured ? 'linear-gradient(90deg,#facc15,#f59e0b)' : 'rgba(0,0,0,0.7)'};color:${featured ? '#000' : '#fff'};font-size:10px;font-weight:900;">${inst.username}</div>
        ${inst.reactionLine ? `<div style="margin-top:2px;max-width:150px;font-size:9px;color:#fff;background:rgba(0,0,0,0.75);border-radius:8px;padding:2px 6px;">${inst.reactionLine}</div>` : ''}
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
        group, parts, labelEl, trail, featured,
        danceId: inst.danceId || 'dance_bounce',
        phase: inst.groupId ? 0 : Math.random() * 10,
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
    <div className="relative rounded-3xl border border-white/10 overflow-hidden min-h-[520px] bg-black">
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
