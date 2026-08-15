import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Play, Pause, RotateCcw, Shield, Sparkles, Trophy, Flame, 
  MapPin, Flag, Eye, Volume2, VolumeX, Maximize2, Zap, Star,
  Compass, Award, ChevronRight, Layers, CheckCircle2, AlertTriangle, MonitorPlay
} from 'lucide-react';
import bandoEngine, { DEFAULT_MAP_GIFTS, getHonorTier } from './bandoGameEngine';
import bandoAudio from './bandoAudioEngine';

// Ease helpers
function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export default function GameBanDoVietNam({
  isPopout = false,
  onOpenAdmin = null,
  externalLiveEvent = null,
}) {
  const [gameState, setGameState] = useState(() => bandoEngine.state);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [viewMode3D, setViewMode3D] = useState(true); // true = 3D WebGL, false = 2D Canvas
  const [selectedGiftId, setSelectedGiftId] = useState('rose');
  const [giftMultiplier, setGiftMultiplier] = useState(1);
  const [isAutoTesting, setIsAutoTesting] = useState(false);
  const [autoTestStep, setAutoTestStep] = useState(0);

  const containerRef = useRef(null);
  const canvas2dRef = useRef(null);
  const threeStateRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    instancedMesh: null,
    dummy: new THREE.Object3D(),
    colorObj: new THREE.Color(),
    disposed: false,
    animFrameId: null,
    tween: null,
  });

  // Subscribe engine state
  useEffect(() => {
    const unsub = bandoEngine.subscribe((newState, lastEvt) => {
      setGameState({ ...newState });
      setIsAutoTesting(bandoEngine.isAutoTesting);
    });
    return () => unsub();
  }, []);

  // Handle external TikTok events if passed from parent
  useEffect(() => {
    if (!externalLiveEvent) return;
    const { type, data } = externalLiveEvent;
    if (type === 'GIFT') {
      bandoEngine.processGift(data.giftId || 'rose', data.count || 1, {
        id: data.userId || 'tiktok_user',
        username: data.username || 'Người xem TikTok',
        avatar: data.avatar || ''
      });
    } else if (type === 'RESET') {
      bandoEngine.resetRound();
    } else if (type === 'BOSS') {
      bandoEngine.triggerBossEvent();
    } else if (type === 'MISSION') {
      bandoEngine.triggerMission();
    }
  }, [externalLiveEvent]);

  // Unlock Web Audio on first user interaction
  const handleUserGesture = useCallback(() => {
    bandoAudio.unlock();
  }, []);

  // ============================================================
  // THREE.JS 3D MAP INITIALIZATION & RENDER LOOP
  // ============================================================
  useEffect(() => {
    if (!viewMode3D || !containerRef.current) return;
    const container = containerRef.current;
    const state = threeStateRef.current;
    state.disposed = false;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // Scene
    const scene = new THREE.Scene();
    state.scene = scene;
    if (isPopout) {
      scene.background = null;
    } else {
      scene.background = new THREE.Color(0x0a0c14);
      scene.fog = new THREE.FogExp2(0x0a0c14, 0.0022);
    }

    // Camera (Isometric angle over S-shape)
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 4000);
    camera.position.set(0, 240, 260);
    camera.lookAt(0, 0, 10);
    state.camera = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    state.renderer = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.minDistance = 40;
    controls.maxDistance = 600;
    controls.target.set(0, 0, 10);
    controls.autoRotate = !isPopout && gameState.settings.autoRotate;
    controls.autoRotateSpeed = gameState.settings.autoRotateSpeed || 0.6;
    state.controls = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff0dd, 1.2);
    dirLight.position.set(120, 300, 150);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const goldPointLight = new THREE.PointLight(0xffd700, 1.5, 300);
    goldPointLight.position.set(0, 80, 0);
    scene.add(goldPointLight);

    // Stars in background
    if (!isPopout) {
      const starGeo = new THREE.BufferGeometry();
      const starCount = 600;
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount * 3; i += 3) {
        starPos[i] = (Math.random() - 0.5) * 1200;
        starPos[i + 1] = Math.random() * 500 + 40;
        starPos[i + 2] = (Math.random() - 0.5) * 1200;
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({ color: 0x93c5fd, size: 1.2, transparent: true, opacity: 0.6 });
      scene.add(new THREE.Points(starGeo, starMat));
    }

    // Instanced Mesh for 15,125 cells
    const maskData = bandoEngine.maskData;
    const cells = maskData?.cells || [];
    const count = cells.length > 0 ? cells.length : 15125;
    const boxGeo = new THREE.BoxGeometry(0.85, 1, 0.85);
    const boxMat = new THREE.MeshStandardMaterial({
      roughness: 0.35,
      metalness: 0.25,
      vertexColors: true
    });
    const instancedMesh = new THREE.InstancedMesh(boxGeo, boxMat, count);
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(instancedMesh);
    state.instancedMesh = instancedMesh;

    // Initial positioning
    const cols = maskData?.gridCols || 300;
    const rows = maskData?.gridRows || 389;
    const dummy = state.dummy;
    const colorObj = state.colorObj;
    const emptyColor = new THREE.Color(0x1e293b);
    const goldStarColor = new THREE.Color(0xffcd00);
    const redFlagColor = new THREE.Color(0xda251d);

    for (let i = 0; i < count; i++) {
      const cell = cells[i] || { x: (i % 100), y: Math.floor(i / 100) };
      const wx = (cell.x - cols / 2) * 1.0;
      const wz = (cell.y - rows / 2) * 1.0;
      const isClaimed = !!bandoEngine.state.cellsById[cell.id];

      const scaleY = isClaimed ? 1.6 : 0.25;
      const posY = scaleY / 2;

      dummy.position.set(wx, posY, wz);
      dummy.scale.set(1, scaleY, 1);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);

      if (isClaimed) {
        // Yellow star at Hanoi center or Red Flag
        if (cell.provinceId === 'ha-noi' && (cell.x + cell.y) % 7 === 0) {
          instancedMesh.setColorAt(i, goldStarColor);
        } else {
          instancedMesh.setColorAt(i, redFlagColor);
        }
      } else {
        instancedMesh.setColorAt(i, emptyColor);
      }
    }
    instancedMesh.instanceMatrix.needsUpdate = true;
    if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;

    // Resize handler
    const handleResize = () => {
      if (!container || state.disposed) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let lastTime = performance.now();
    const animate = (time) => {
      if (state.disposed) return;
      state.animFrameId = requestAnimationFrame(animate);

      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Handle focal camera zoom tween
      if (state.tween) {
        const tw = state.tween;
        const progress = Math.min(1, (time - tw.start) / tw.duration);
        if (tw.phase === 'in') {
          const t = easeOutBack(progress);
          camera.position.lerpVectors(tw.from, tw.to, t);
          controls.target.lerpVectors(tw.fromTarget, tw.toTarget, t);
          if (progress >= 1) {
            tw.phase = 'hold';
            tw.holdUntil = time + 2500;
          }
        } else if (tw.phase === 'hold') {
          if (time >= tw.holdUntil) {
            tw.phase = 'out';
            tw.start = time;
            tw.duration = 1800;
            tw.from.copy(camera.position);
            tw.fromTarget.copy(controls.target);
            tw.to.set(0, 240, 260);
            tw.toTarget.set(0, 0, 10);
          }
        } else if (tw.phase === 'out') {
          const t = Math.min(1, (time - tw.start) / tw.duration);
          camera.position.lerpVectors(tw.from, tw.to, t);
          controls.target.lerpVectors(tw.fromTarget, tw.toTarget, t);
          if (t >= 1) state.tween = null;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    state.animFrameId = requestAnimationFrame(animate);

    return () => {
      state.disposed = true;
      if (state.animFrameId) cancelAnimationFrame(state.animFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      boxGeo.dispose();
      boxMat.dispose();
    };
  }, [viewMode3D, isPopout]);

  // Update 3D mesh instances when cells are claimed or reset
  useEffect(() => {
    if (!viewMode3D) return;
    const state = threeStateRef.current;
    const instancedMesh = state.instancedMesh;
    const maskData = bandoEngine.maskData;
    if (!instancedMesh || !maskData) return;

    const cells = maskData.cells || [];
    const count = cells.length;
    const cols = maskData.gridCols || 300;
    const rows = maskData.gridRows || 389;
    const dummy = state.dummy;
    const emptyColor = new THREE.Color(0x1e293b);
    const goldStarColor = new THREE.Color(0xffcd00);
    const redFlagColor = new THREE.Color(0xda251d);

    for (let i = 0; i < count; i++) {
      const cell = cells[i];
      if (!cell) continue;
      const isClaimed = !!gameState.cellsById[cell.id];
      const scaleY = isClaimed ? 1.6 : 0.25;
      const posY = scaleY / 2;
      const wx = (cell.x - cols / 2) * 1.0;
      const wz = (cell.y - rows / 2) * 1.0;

      dummy.position.set(wx, posY, wz);
      dummy.scale.set(1, scaleY, 1);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);

      if (isClaimed) {
        if (cell.provinceId === 'ha-noi' && (cell.x + cell.y) % 7 === 0) {
          instancedMesh.setColorAt(i, goldStarColor);
        } else {
          instancedMesh.setColorAt(i, redFlagColor);
        }
      } else {
        instancedMesh.setColorAt(i, emptyColor);
      }
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;

    // Trigger Camera zoom to focal target
    if (gameState.lastFocalTarget && state.camera && state.controls) {
      const ft = gameState.lastFocalTarget;
      state.tween = {
        from: state.camera.position.clone(),
        to: new THREE.Vector3(ft.wx, 80, ft.wz + 65),
        fromTarget: state.controls.target.clone(),
        toTarget: new THREE.Vector3(ft.wx, 0, ft.wz),
        start: performance.now(),
        duration: 800,
        phase: 'in',
        holdUntil: 0
      };
    }
  }, [gameState.claimedCount, gameState.status, viewMode3D]);

  // ============================================================
  // 2D CANVAS FALLBACK RENDERER
  // ============================================================
  useEffect(() => {
    if (viewMode3D || !canvas2dRef.current) return;
    const canvas = canvas2dRef.current;
    const ctx = canvas.getContext('2d');
    const maskData = bandoEngine.maskData;
    if (!ctx || !maskData) return;

    canvas.width = canvas.parentElement.clientWidth || 800;
    canvas.height = canvas.parentElement.clientHeight || 600;

    const cols = maskData.gridCols || 300;
    const rows = maskData.gridRows || 389;
    const scale = Math.min(canvas.width / cols, canvas.height / rows) * 0.92;
    const offsetX = (canvas.width - cols * scale) / 2;
    const offsetY = (canvas.height - rows * scale) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    (maskData.cells || []).forEach(cell => {
      const isClaimed = !!gameState.cellsById[cell.id];
      ctx.fillStyle = isClaimed ? '#DA251D' : '#1e293b';
      ctx.fillRect(offsetX + cell.x * scale, offsetY + cell.y * scale, scale * 0.88, scale * 0.88);
    });
  }, [viewMode3D, gameState.claimedCount]);

  // Test gift trigger handler
  const handleTestGift = (giftId) => {
    handleUserGesture();
    const gift = DEFAULT_MAP_GIFTS.find(g => g.id === giftId) || DEFAULT_MAP_GIFTS[0];
    bandoEngine.processGift(gift.id, giftMultiplier, {
      id: `user_test_${Math.floor(Math.random() * 5)}`,
      username: `Đại Gia ${gift.name} 💎`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
    });
  };

  // Toggle Auto Test Loop
  const handleToggleAutoTest = () => {
    handleUserGesture();
    if (isAutoTesting) {
      bandoEngine.stopAutoTestLoop();
      setIsAutoTesting(false);
    } else {
      setIsAutoTesting(true);
      bandoEngine.startAutoTestLoop((step, name) => {
        setAutoTestStep(step);
      });
    }
  };

  return (
    <div 
      className={`relative w-full h-full flex flex-col overflow-hidden select-none font-sans ${isPopout ? 'bg-transparent' : 'bg-[#090b10] text-gray-100'}`}
      onClick={handleUserGesture}
    >
      {/* 1. TOP HUD: Header & Tiến Độ Hoàn Thành Bản Đồ Tổ Quốc */}
      <div className="relative z-20 flex items-center justify-between px-4 py-2.5 bg-black/60 backdrop-blur-md border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 shadow-lg shadow-red-500/30 ring-2 ring-yellow-400/50">
            <span className="text-xl">🇻🇳</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm md:text-base font-black bg-gradient-to-r from-yellow-300 via-red-400 to-amber-300 bg-clip-text text-transparent uppercase tracking-wider">
                Việt Nam Ghép Cờ LIVE — Bản Đồ Chữ S
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white shadow-sm animate-pulse">
                {gameState.roundId}
              </span>
            </div>
            <div className="text-[11px] text-gray-400 font-medium flex items-center gap-2">
              <span>Đã cắm: <strong className="text-yellow-400 font-bold">{gameState.claimedCount.toLocaleString()}</strong> / {gameState.totalCells.toLocaleString()} ô cờ</span>
              <span>•</span>
              <span>Còn lại: <strong className="text-emerald-400 font-bold">{gameState.remainingCells.toLocaleString()}</strong> ô</span>
            </div>
          </div>
        </div>

        {/* Progress Bar & Combo Streak */}
        <div className="flex items-center gap-4">
          {gameState.combo.active && gameState.combo.count >= 2 && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-600 to-red-600 rounded-full text-white text-xs font-black shadow-lg animate-bounce">
              <Flame size={14} className="text-yellow-300 animate-spin" />
              <span>COMBO x{gameState.combo.multiplier} ({gameState.combo.count} Quà)</span>
            </div>
          )}

          <div className="hidden sm:flex flex-col items-end w-48 md:w-64">
            <div className="flex justify-between w-full text-[11px] font-bold text-gray-300 mb-1">
              <span>TIẾN ĐỘ TỔ QUỐC</span>
              <span className="text-yellow-400">{gameState.percent}%</span>
            </div>
            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/20">
              <div 
                className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(234,179,8,0.8)]"
                style={{ width: `${gameState.percent}%` }}
              />
            </div>
          </div>

          {/* Controls button */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewMode3D(!viewMode3D)}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-gray-200 border border-white/10 transition-colors flex items-center gap-1"
              title={viewMode3D ? "Chuyển sang chế độ 2D mượt nhẹ" : "Chuyển sang chế độ 3D Three.js"}
            >
              <Layers size={13} />
              <span>{viewMode3D ? '3D' : '2D'}</span>
            </button>

            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="px-3 py-1 rounded-lg text-xs font-black bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/20 border border-purple-400/40 transition-all flex items-center gap-1.5"
                title="Mở Bảng Quản Trị Admin Bản Đồ"
              >
                <Shield size={13} className="text-yellow-300" />
                <span>Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN 3D / 2D MAP STAGE */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {viewMode3D ? (
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        ) : (
          <canvas ref={canvas2dRef} className="w-full h-full" />
        )}

        {/* LEFT HUD: Boss Event & Urgent Mission & Live Feed */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2.5 max-w-[280px] pointer-events-none">
          {/* Boss Banner */}
          {gameState.boss.active && (
            <div className="pointer-events-auto bg-gradient-to-r from-red-950/90 via-purple-950/90 to-black/90 border-2 border-red-500/80 rounded-xl p-3 shadow-2xl backdrop-blur-md animate-pulse">
              <div className="flex items-center justify-between text-xs font-black text-red-400 mb-1">
                <span>{gameState.boss.name}</span>
                <span className="font-mono text-yellow-300">{gameState.boss.remainingSec}s</span>
              </div>
              <p className="text-[10px] text-gray-300 mb-2">Thưởng: {gameState.boss.reward}</p>
              <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-red-500/40">
                <div 
                  className="h-full bg-red-600 transition-all duration-300"
                  style={{ width: `${Math.min(100, (gameState.boss.currentCells / gameState.boss.targetCells) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Active Mission Banner */}
          {gameState.activeMission && (
            <div className="pointer-events-auto bg-blue-950/80 border border-blue-400/60 rounded-xl p-2.5 shadow-xl backdrop-blur-md">
              <div className="text-[11px] font-black text-blue-300 flex items-center gap-1.5 mb-1">
                <Zap size={12} className="text-yellow-400 animate-spin" />
                <span>{gameState.activeMission.title}</span>
              </div>
              <div className="text-[10px] text-gray-400">Thưởng: <span className="text-emerald-400 font-bold">{gameState.activeMission.reward}</span></div>
            </div>
          )}

          {/* Real-time Live Activity Feed */}
          <div className="pointer-events-auto bg-black/50 border border-white/10 rounded-xl p-2.5 shadow-xl backdrop-blur-md max-h-48 overflow-y-auto custom-scrollbar">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Sparkles size={11} className="text-yellow-400" /> Hoạt động cắm cờ
            </div>
            <div className="space-y-1.5">
              {gameState.feed.slice(0, 8).map(item => (
                <div key={item.id} className="text-[11px] text-gray-200 leading-tight bg-white/5 p-1.5 rounded border border-white/5 animate-in fade-in">
                  <span className="text-[9px] text-gray-400 font-mono mr-1">[{item.time}]</span>
                  {item.text}
                </div>
              ))}
              {gameState.feed.length === 0 && (
                <div className="text-[11px] text-gray-500 italic">Chưa có lượt tặng quà nào...</div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT HUD: Leaderboard Top Đại Gia */}
        <div className="absolute top-4 right-4 z-10 w-64 pointer-events-none">
          <div className="pointer-events-auto bg-black/60 border border-white/10 rounded-2xl p-3 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-yellow-400">
                <Trophy size={14} className="text-yellow-400" />
                <span>BẢNG VÀNG CẮM CỜ</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-400/20 text-yellow-300 font-mono font-bold">
                TOP {gameState.leaderboard.length}
              </span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar">
              {gameState.leaderboard.slice(0, 8).map((user, idx) => (
                <div 
                  key={user.userId} 
                  className={`flex items-center justify-between p-1.5 rounded-lg border text-xs ${
                    idx === 0 
                      ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-200' 
                      : idx === 1 
                      ? 'bg-slate-400/20 border-slate-400/40 text-gray-200' 
                      : idx === 2 
                      ? 'bg-amber-700/20 border-amber-700/40 text-amber-300' 
                      : 'bg-white/5 border-white/5 text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="w-5 text-center font-black font-mono text-[11px]">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </span>
                    <span className="font-bold truncate text-[11px]">{user.username}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-black font-mono text-yellow-400 text-[11px]">+{user.totalCells.toLocaleString()} ô</div>
                  </div>
                </div>
              ))}
              {gameState.leaderboard.length === 0 && (
                <div className="text-center py-4 text-xs text-gray-500 italic">Chưa có ai trong bảng xếp hạng</div>
              )}
            </div>
          </div>
        </div>

        {/* Victory Celebration Overlay Screen */}
        {gameState.status === 'victory' && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-lg animate-in fade-in zoom-in duration-300 p-4">
            <div className="max-w-md w-full bg-gradient-to-b from-red-950/90 via-slate-900 to-black border-2 border-yellow-400 rounded-3xl p-6 shadow-2xl text-center">
              <div className="text-5xl mb-2 animate-bounce">🇻🇳 🏆 🇻🇳</div>
              <h1 className="text-2xl font-black text-yellow-300 uppercase tracking-wider mb-2">
                HOÀN THÀNH GHÉP CỜ TỔ QUỐC!
              </h1>
              <p className="text-sm text-gray-200 mb-4">
                Toàn bộ non sông gấm vóc <strong>Bản Đồ Việt Nam Hình Chữ S</strong> đã rực rỡ sắc cờ đỏ sao vàng!
              </p>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-5 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Đại tướng quân MVP:</span>
                  <span className="font-black text-yellow-400">{gameState.victory?.mvpUser?.username || 'Chiến Binh Tổ Quốc'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tổng số ô cờ đã cắm:</span>
                  <span className="font-mono font-bold text-emerald-400">{gameState.totalCells.toLocaleString()} Ô CỜ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Thời gian hoàn thành:</span>
                  <span className="font-mono text-gray-300">{gameState.victory?.completedAt}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => bandoEngine.resetRound()}
                  className="flex-1 py-3 bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-500 hover:to-yellow-400 text-white font-black rounded-xl shadow-lg shadow-red-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw size={16} /> Bắt Đầu Trận Mới
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. BOTTOM TEST CONTROL BAR — NÚT BẤM TEST TOÀN BỘ QUÀ TẶNG */}
      <div className="relative z-20 bg-[#0d1017] border-t border-white/10 p-3 shrink-0">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Mock Gift Quick Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 custom-scrollbar">
            <span className="text-[11px] font-black text-yellow-400 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
              <Sparkles size={12} /> Test Quà:
            </span>

            {DEFAULT_MAP_GIFTS.map(gift => (
              <button
                key={gift.id}
                onClick={() => handleTestGift(gift.id)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/15 border border-white/10 hover:border-yellow-400/50 text-gray-200 transition-all shrink-0 hover:scale-105 active:scale-95 shadow-sm"
                title={`Test gửi ${gift.name} quy đổi +${gift.cells} ô cờ`}
              >
                <span>{gift.icon}</span>
                <span>{gift.name}</span>
                <span className="text-[10px] text-yellow-400 font-mono">+{gift.cells}</span>
              </button>
            ))}
          </div>

          {/* Quick Actions: Auto Test Loop & Multiplier & Overlay Button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Auto Test Loop Button */}
            <button
              onClick={handleToggleAutoTest}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all border shadow-lg ${
                isAutoTesting
                  ? 'bg-red-600 text-white border-yellow-300 ring-2 ring-yellow-400 animate-pulse'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-emerald-400/50'
              }`}
              title="Chạy tự động kiểm thử toàn bộ hệ thống quà tặng, combo, boss và hoàn thành bản đồ"
            >
              {isAutoTesting ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
              <span>{isAutoTesting ? `Đang Test (#${autoTestStep})` : '⚡ Chạy Test Toàn Bộ'}</span>
            </button>

            {/* Mở Cửa Sổ Overlay Trong Suốt */}
            <button
              onClick={() => {
                window.open('?overlay=bando', 'AvaliveMapOverlay', 'width=900,height=750,menubar=no,toolbar=no,location=no');
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-400/40 transition-colors"
              title="Mở Cửa Sổ Overlay Trong Suốt để TikTok LIVE Studio hoặc OBS bắt hình"
            >
              <MonitorPlay size={14} />
              <span>Overlay Studio</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={() => bandoEngine.resetRound()}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              title="Làm mới trận đấu"
            >
              <RotateCcw size={15} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
