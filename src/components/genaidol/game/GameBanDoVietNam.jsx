import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Play, Pause, RotateCcw, Shield, Sparkles, Trophy, Flame, 
  MapPin, Flag, Eye, EyeOff, Volume2, VolumeX, Maximize2, Zap, Star,
  Compass, Award, ChevronRight, Layers, CheckCircle2, AlertTriangle, 
  MonitorPlay, Sun, ZoomIn, ZoomOut, Globe, Navigation, Compass as CompassIcon,
  Sliders, Settings, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RefreshCw
} from 'lucide-react';
import bandoEngine, { getHonorTier, COUNTRY_PRESETS } from './bandoGameEngine';
import bandoAudio from './bandoAudioEngine';
import { getGameTranslation } from './gameTranslations';

// Ease helpers
function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function GameBanDoVietNam({
  isPopout = false,
  onOpenAdmin = null,
  externalLiveEvent = null,
}) {
  const [gameState, setGameState] = useState(() => bandoEngine.state);
  const [viewMode3D, setViewMode3D] = useState(true);
  const [isAutoTesting, setIsAutoTesting] = useState(false);
  const [autoTestStep, setAutoTestStep] = useState(0);
  const [showSidePanels, setShowSidePanels] = useState(true);
  const [activeCameraPreset, setActiveCameraPreset] = useState('overview');
  const [autoRotate, setAutoRotate] = useState(() => bandoEngine.state.autoRotate || false);
  const [recentClaimBadges, setRecentClaimBadges] = useState([]);

  // 2D Canvas Pan & Zoom State
  const [zoom2D, setZoom2D] = useState(1.0);
  const [pan2D, setPan2D] = useState({ x: 0, y: 0 });
  const isDragging2DRef = useRef(false);
  const dragStart2DRef = useRef({ x: 0, y: 0 });

  const containerRef = useRef(null);
  const canvas2dRef = useRef(null);
  const labelsLayerRef = useRef(null);
  const labelRefs = useRef({});
  const badgeRefs = useRef({});

  const threeStateRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    instancedMesh: null,
    bannerMesh: null,
    dummy: new THREE.Object3D(),
    colorObj: new THREE.Color(),
    disposed: false,
    animFrameId: null,
    tween: null,
    tempVec: new THREE.Vector3(),
  });

  // Current Country Translation
  const currentCountry = COUNTRY_PRESETS[gameState.selectedCountry] || COUNTRY_PRESETS['vietnam'];
  const t = getGameTranslation(currentCountry?.lang || 'vi');

  // Subscribe engine state & gift placements
  useEffect(() => {
    const unsub = bandoEngine.subscribe((newState, lastEvt) => {
      setGameState({ ...newState });
      setIsAutoTesting(bandoEngine.isAutoTesting);
      if (newState.autoRotate !== undefined) {
        setAutoRotate(newState.autoRotate);
      }
      if (newState.cameraPreset) {
        setActiveCameraPreset(newState.cameraPreset);
      }

      // Xử lý sự kiện cắm ô cờ để tạo Huy Hiệu ID Người Dùng & Lá Cờ Quốc Kỳ Siêu Sắc Nét
      if (lastEvt && (lastEvt.type === 'GIFT_PLACED' || lastEvt.type === 'GIFT')) {
        const user = lastEvt.user;
        const count = lastEvt.claimed || lastEvt.count || 1;
        const flag = currentCountry?.flag || '🇻🇳';
        const maskData = bandoEngine.maskData;
        const cols = maskData?.gridCols || 300;
        const rows = maskData?.gridRows || 389;

        // Tính toạ độ 3D trung tâm của nhóm ô cờ vừa cắm
        let wx = 0, wz = 0;
        if (bandoEngine.state.lastFocalTarget) {
          wx = bandoEngine.state.lastFocalTarget.wx || 0;
          wz = bandoEngine.state.lastFocalTarget.wz || 0;
        } else {
          wx = (Math.random() - 0.5) * 80;
          wz = (Math.random() - 0.5) * 120;
        }

        const newBadge = {
          id: `badge_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          userId: user?.id || 'id_vip',
          username: user?.username || 'Chiến Binh Yêu Nước',
          flag,
          count,
          wx,
          wy: 5.5,
          wz,
          timestamp: Date.now(),
        };

        setRecentClaimBadges(prev => [newBadge, ...prev.slice(0, 11)]);
      }
    });
    return () => unsub();
  }, [currentCountry]);

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

  // Unlock Web Audio and Auto-Play BGM on first user interaction on Live
  const handleUserGesture = useCallback(() => {
    bandoAudio.unlock();
  }, []);

  useEffect(() => {
    const handleFirstGesture = () => {
      bandoAudio.unlock();
    };
    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  // Camera preset positions based on active country
  const getCameraPresetsForCountry = useCallback(() => {
    const isVN = gameState.selectedCountry === 'vietnam';
    return {
      overview: { name: 'Toàn Cảnh', icon: '🌐', pos: [0, 240, 260], target: [0, 0, 10] },
      north: { name: isVN ? 'Miền Bắc & Hà Nội' : 'Vùng Phía Bắc', icon: '🏛️', pos: [-20, 120, -50], target: [-20, 0, -85] },
      central: { name: isVN ? 'Miền Trung & Huế' : 'Khu Vực Trung Tâm', icon: '🏖️', pos: [25, 130, 20], target: [15, 0, 10] },
      south: { name: isVN ? 'Miền Nam & TP.HCM' : 'Vùng Phía Nam', icon: '🏙️', pos: [-15, 120, 140], target: [-15, 0, 105] },
      tip_camau: { name: isVN ? 'Mũi Cà Mau (Cực Nam)' : 'Cực Nam', icon: '⛵', pos: [-35, 75, 185], target: [-35, 0, 145] },
      islands: { name: isVN ? 'Hoàng Sa & Trường Sa' : 'Hải Đảo', icon: '🏝️', pos: [80, 110, 40], target: [65, 0, 15] },
      macro: { name: 'Cận Cảnh Từng Ô Cờ', icon: '🔍', pos: [0, 25, 25], target: [0, 0, 0] },
    };
  }, [gameState.selectedCountry]);

  // Camera preset switcher function
  const applyCameraPreset = useCallback((presetKey) => {
    setActiveCameraPreset(presetKey);
    const presets = getCameraPresetsForCountry();
    const preset = presets[presetKey];
    const state = threeStateRef.current;
    if (!preset || !state.camera || !state.controls) return;

    state.tween = {
      from: state.camera.position.clone(),
      to: new THREE.Vector3(...preset.pos),
      fromTarget: state.controls.target.clone(),
      toTarget: new THREE.Vector3(...preset.target),
      start: performance.now(),
      duration: 1100,
      phase: 'direct',
    };
  }, [getCameraPresetsForCountry]);

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
      scene.background = new THREE.Color(0x0a0f1d);
      scene.fog = new THREE.FogExp2(0x0a0f1d, 0.0015);
    }

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 4000);
    camera.position.set(0, 240, 260);
    camera.lookAt(0, 0, 10);
    state.camera = camera;

    // Renderer with balanced tone mapping
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = (gameState.settings.brightness || 1.2) * 0.9;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    state.renderer = renderer;

    // Controls with Ultra-close Zoom and Wide Pan
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2.02;
    controls.minDistance = 8;
    controls.maxDistance = 800;
    controls.target.set(0, 0, 10);
    controls.enablePan = true;
    controls.panSpeed = 1.5;
    controls.screenSpacePanning = true;
    controls.enableZoom = true;
    controls.zoomSpeed = 1.25;
    controls.autoRotate = !isPopout && autoRotate;
    controls.autoRotateSpeed = 0.8;
    state.controls = controls;

    // Balanced Lighting (Crisp Colors without Overexposure)
    const brightness = gameState.settings.brightness || 1.2;
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95 * brightness);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaee, 1.25 * brightness);
    dirLight.position.set(120, 320, 160);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.8 * brightness);
    rimLight.position.set(-150, 180, -120);
    scene.add(rimLight);

    const pLight1 = new THREE.PointLight(0xffd700, 1.2 * brightness, 350);
    pLight1.position.set(-20, 65, -85);
    scene.add(pLight1);

    const pLight2 = new THREE.PointLight(0x38bdf8, 1.0 * brightness, 300);
    pLight2.position.set(-15, 60, 105);
    scene.add(pLight2);

    const pLight3 = new THREE.PointLight(0xf43f5e, 1.2 * brightness, 350);
    pLight3.position.set(75, 65, 25);
    scene.add(pLight3);

    // Stars in background
    if (!isPopout) {
      const starGeo = new THREE.BufferGeometry();
      const starCount = 800;
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount * 3; i += 3) {
        starPos[i] = (Math.random() - 0.5) * 1400;
        starPos[i + 1] = Math.random() * 600 + 30;
        starPos[i + 2] = (Math.random() - 0.5) * 1400;
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({ color: 0x93c5fd, size: 1.4, transparent: true, opacity: 0.75 });
      scene.add(new THREE.Points(starGeo, starMat));

      const gridHelper = new THREE.GridHelper(500, 35, 0x1e293b, 0x0f172a);
      gridHelper.position.y = -2;
      scene.add(gridHelper);
    }

    // Instanced Mesh for cells with bright reflective material
    const maskData = bandoEngine.maskData;
    const cells = maskData?.cells || [];
    const count = cells.length > 0 ? cells.length : 15125;
    const boxGeo = new THREE.BoxGeometry(0.88, 1, 0.88);
    const boxMat = new THREE.MeshStandardMaterial({
      roughness: 0.48,
      metalness: 0.12,
      vertexColors: true,
    });
    const instancedMesh = new THREE.InstancedMesh(boxGeo, boxMat, count);
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    instancedMesh.castShadow = true;
    instancedMesh.receiveShadow = true;
    scene.add(instancedMesh);
    state.instancedMesh = instancedMesh;

    // Instanced Mesh for 3D Banner Title Flag Cells
    const bannerCells = bandoEngine.state.bannerCells || [];
    const bannerCount = bannerCells.length;
    let bannerMesh = null;
    let bannerBoxGeo = null;
    let bannerBoxMat = null;

    if (bannerCount > 0) {
      bannerBoxGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
      bannerBoxMat = new THREE.MeshStandardMaterial({
        roughness: 0.42,
        metalness: 0.18,
        vertexColors: true,
      });
      bannerMesh = new THREE.InstancedMesh(bannerBoxGeo, bannerBoxMat, bannerCount);
      bannerMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      bannerMesh.visible = gameState.showBannerCells !== false;
      scene.add(bannerMesh);
      state.bannerMesh = bannerMesh;

      const bannerDummy = state.dummy;
      for (let i = 0; i < bannerCount; i++) {
        const bc = bannerCells[i];
        bannerDummy.position.set(bc.wx, bc.wy, bc.wz);
        bannerDummy.scale.set(1, bc.isClaimed ? 1.4 : 0.8, 1);
        bannerDummy.updateMatrix();
        bannerMesh.setMatrixAt(i, bannerDummy.matrix);
        bannerMesh.setColorAt(i, new THREE.Color(bc.color || (bc.isClaimed ? (gameState.settings.claimedCellColor || '#DA251D') : '#334155')));
      }
      bannerMesh.instanceMatrix.needsUpdate = true;
      if (bannerMesh.instanceColor) bannerMesh.instanceColor.needsUpdate = true;
    }

    // Positioning
    const cols = maskData?.gridCols || 300;
    const rows = maskData?.gridRows || 389;
    const dummy = state.dummy;
    const emptyColor = new THREE.Color(gameState.settings.emptyCellColor || '#475569');
    const goldStarColor = new THREE.Color(gameState.settings.starColor || '#FFD700');
    const redFlagColor = new THREE.Color(gameState.settings.claimedCellColor || '#DA251D');

    for (let i = 0; i < count; i++) {
      const cell = cells[i] || { x: (i % 100), y: Math.floor(i / 100) };
      const wx = (cell.x - cols / 2) * 1.0;
      const wz = (cell.y - rows / 2) * 1.0;
      const isClaimed = !!bandoEngine.state.cellsById[cell.id];

      const scaleY = isClaimed ? 1.7 : 0.35;
      const posY = scaleY / 2;

      dummy.position.set(wx, posY, wz);
      dummy.scale.set(1, scaleY, 1);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);

      if (isClaimed) {
        if ((cell.provinceId === 'ha-noi' || cell.provinceId === 'tokyo' || cell.provinceId === 'seoul') && (cell.x + cell.y) % 7 === 0) {
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

    // Animation Loop with 3D-to-Screen Label Projection
    const tempVec = state.tempVec;
    let lastTime = performance.now();

    const animate = (time) => {
      if (state.disposed) return;
      state.animFrameId = requestAnimationFrame(animate);

      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Update Auto-Rotate dynamically
      if (controls) {
        controls.autoRotate = !isPopout && autoRotate;
      }

      // Handle focal camera zoom tween
      if (state.tween) {
        const tw = state.tween;
        const progress = Math.min(1, (time - tw.start) / tw.duration);
        
        if (tw.phase === 'direct') {
          const t = easeInOutCubic(progress);
          camera.position.lerpVectors(tw.from, tw.to, t);
          controls.target.lerpVectors(tw.fromTarget, tw.toTarget, t);
          if (progress >= 1) state.tween = null;
        } else if (tw.phase === 'in') {
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
            tw.duration = 1600;
            tw.from.copy(camera.position);
            tw.fromTarget.copy(controls.target);
            const presets = getCameraPresetsForCountry();
            const defaultPos = presets[activeCameraPreset]?.pos || [0, 240, 260];
            const defaultTarget = presets[activeCameraPreset]?.target || [0, 0, 10];
            tw.to.set(...defaultPos);
            tw.toTarget.set(...defaultTarget);
          }
        } else if (tw.phase === 'out') {
          const t = easeInOutCubic(Math.min(1, (time - tw.start) / tw.duration));
          camera.position.lerpVectors(tw.from, tw.to, t);
          controls.target.lerpVectors(tw.fromTarget, tw.toTarget, t);
          if (t >= 1) state.tween = null;
        }
      }

      controls.update();
      camera.updateMatrixWorld(true);
      renderer.render(scene, camera);

      // PROJECTION: Update all 3D Anchored Landmark Labels in real-time
      const texts = bandoEngine.state.mapTexts || [];
      const contW = container.clientWidth || 800;
      const contH = container.clientHeight || 600;

      for (let i = 0; i < texts.length; i++) {
        const item = texts[i];
        const el = labelRefs.current[item.id];
        if (!el) continue;

        tempVec.set(item.wx || 0, item.wy || 3.5, item.wz || 0);
        tempVec.project(camera);

        // Check if label is in front of camera (tempVec.z < 1.0)
        if (tempVec.z < 1.0) {
          const sx = (tempVec.x * 0.5 + 0.5) * contW;
          const sy = (-tempVec.y * 0.5 + 0.5) * contH;
          el.style.display = 'block';
          el.style.transform = `translate3d(${sx}px, ${sy}px, 0px) translate(-50%, -100%)`;
        } else {
          el.style.display = 'none';
        }
      }

      // PROJECTION: Update Recent Claim Badges (User ID & Ultra-Sharp Flag)
      for (let b = 0; b < recentClaimBadges.length; b++) {
        const badge = recentClaimBadges[b];
        const badgeEl = badgeRefs.current[badge.id];
        if (!badgeEl) continue;

        tempVec.set(badge.wx || 0, badge.wy || 5.5, badge.wz || 0);
        tempVec.project(camera);

        if (tempVec.z < 1.0) {
          const sx = (tempVec.x * 0.5 + 0.5) * contW;
          const sy = (-tempVec.y * 0.5 + 0.5) * contH;
          badgeEl.style.display = 'flex';
          badgeEl.style.transform = `translate3d(${sx}px, ${sy}px, 0px) translate(-50%, -120%)`;
        } else {
          badgeEl.style.display = 'none';
        }
      }
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
  }, [viewMode3D, isPopout, gameState.selectedCountry, getCameraPresetsForCountry, autoRotate, recentClaimBadges]);

  // Handle Multi-directional Pan & Smooth Zoom Controls
  const handlePan3D = (dirX, dirZ) => {
    const state = threeStateRef.current;
    if (!state.camera || !state.controls) return;
    const camera = state.camera;
    const controls = state.controls;

    const offset = new THREE.Vector3(dirX * 25, 0, dirZ * 25);
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), controls.getAzimuthalAngle());

    camera.position.add(offset);
    controls.target.add(offset);
  };

  const handleZoom3D = (factor) => {
    const state = threeStateRef.current;
    if (!state.camera || !state.controls) return;
    const camera = state.camera;
    const controls = state.controls;

    const dir = new THREE.Vector3().subVectors(camera.position, controls.target);
    const newLen = Math.max(8, Math.min(800, dir.length() * factor));
    dir.setLength(newLen);
    camera.position.copy(controls.target).add(dir);
  };

  const handleToggleAutoRotate = () => {
    const next = !autoRotate;
    setAutoRotate(next);
    bandoEngine.setAutoRotate(next);
  };

  const handleResetCamera = () => {
    applyCameraPreset('overview');
  };

  // 2D Canvas Handlers (Pan & Zoom)
  const handleMouseDown2D = (e) => {
    isDragging2DRef.current = true;
    dragStart2DRef.current = { x: e.clientX - pan2D.x, y: e.clientY - pan2D.y };
  };

  const handleMouseMove2D = (e) => {
    if (!isDragging2DRef.current) return;
    setPan2D({
      x: e.clientX - dragStart2DRef.current.x,
      y: e.clientY - dragStart2DRef.current.y
    });
  };

  const handleMouseUp2D = () => {
    isDragging2DRef.current = false;
  };

  const handleWheel2D = (e) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 1.15 : 0.88;
    setZoom2D(prev => Math.max(0.5, Math.min(4.0, prev * zoomDelta)));
  };

  // Update 3D mesh instances when cells are claimed, reset or settings changed
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
    const emptyColor = new THREE.Color(gameState.settings.emptyCellColor || '#475569');
    const goldStarColor = new THREE.Color(gameState.settings.starColor || '#FFD700');
    const redFlagColor = new THREE.Color(gameState.settings.claimedCellColor || '#DA251D');

    for (let i = 0; i < count; i++) {
      const cell = cells[i];
      if (!cell) continue;
      const isClaimed = !!gameState.cellsById[cell.id];
      const scaleY = isClaimed ? 1.7 : 0.35;
      const posY = scaleY / 2;
      const wx = (cell.x - cols / 2) * 1.0;
      const wz = (cell.y - rows / 2) * 1.0;

      dummy.position.set(wx, posY, wz);
      dummy.scale.set(1, scaleY, 1);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);

      if (isClaimed) {
        if ((cell.provinceId === 'ha-noi' || cell.provinceId === 'tokyo' || cell.provinceId === 'seoul') && (cell.x + cell.y) % 7 === 0) {
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

    // Cập nhật ma trận và màu sắc của Khối Chữ Ô Cờ 3D (Banner Flag Cells)
    if (state.bannerMesh && gameState.bannerCells) {
      const bCells = gameState.bannerCells;
      const bMesh = state.bannerMesh;
      bMesh.visible = gameState.showBannerCells !== false;
      const bannerDummy = state.dummy;
      const bannerRed = new THREE.Color(gameState.settings.claimedCellColor || '#DA251D');
      const bannerEmpty = new THREE.Color('#334155');

      for (let j = 0; j < bMesh.count; j++) {
        const bc = bCells[j];
        if (bc) {
          bannerDummy.position.set(bc.wx, bc.wy, bc.wz);
          bannerDummy.scale.set(1, bc.isClaimed ? 1.4 : 0.8, 1);
          bannerDummy.updateMatrix();
          bMesh.setMatrixAt(j, bannerDummy.matrix);
          bMesh.setColorAt(j, bc.isClaimed ? bannerRed : bannerEmpty);
        }
      }
      bMesh.instanceMatrix.needsUpdate = true;
      if (bMesh.instanceColor) bMesh.instanceColor.needsUpdate = true;
    }

    // Trigger Camera zoom to focal target
    if (gameState.lastFocalTarget && state.camera && state.controls) {
      const ft = gameState.lastFocalTarget;
      state.tween = {
        from: state.camera.position.clone(),
        to: new THREE.Vector3(ft.wx, 75, ft.wz + 60),
        fromTarget: state.controls.target.clone(),
        toTarget: new THREE.Vector3(ft.wx, 0, ft.wz),
        start: performance.now(),
        duration: 750,
        phase: 'in',
        holdUntil: 0
      };
    }
  }, [gameState.claimedCount, gameState.status, gameState.settings, gameState.selectedCountry, gameState.bannerCells, gameState.bannerClaimedCount, gameState.showBannerCells, gameState.bannerPos, viewMode3D]);

  // ============================================================
  // 2D CANVAS FALLBACK RENDERER WITH PAN & ZOOM
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
    const baseScale = Math.min(canvas.width / cols, canvas.height / rows) * 0.92;
    const scale = baseScale * zoom2D;
    const offsetX = (canvas.width - cols * scale) / 2 + pan2D.x;
    const offsetY = (canvas.height - rows * scale) / 2 + pan2D.y;

    ctx.fillStyle = '#0a0f1d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid Cells
    (maskData.cells || []).forEach(cell => {
      const isClaimed = !!gameState.cellsById[cell.id];
      ctx.fillStyle = isClaimed ? (gameState.settings.claimedCellColor || '#DA251D') : (gameState.settings.emptyCellColor || '#475569');
      ctx.fillRect(offsetX + cell.x * scale, offsetY + cell.y * scale, Math.max(1, scale * 0.88), Math.max(1, scale * 0.88));
    });

    // Draw 2D Claim Badges & User Names
    recentClaimBadges.forEach((badge) => {
      const bx = offsetX + (badge.wx + cols / 2) * scale;
      const by = offsetY + (badge.wz + rows / 2) * scale;
      if (bx >= 0 && bx <= canvas.width && by >= 0 && by <= canvas.height) {
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(bx - 60, by - 24, 120, 22, 6);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 10px sans-serif';
        ctx.fillStyle = '#facc15';
        ctx.fillText(`${badge.flag} ${badge.userId}`, bx - 52, by - 10);
      }
    });
  }, [viewMode3D, gameState.claimedCount, gameState.settings, zoom2D, pan2D, recentClaimBadges]);

  // Test gift trigger handler
  const handleTestGift = (giftId) => {
    handleUserGesture();
    const gifts = gameState.gifts || [];
    const gift = gifts.find(g => g.id === giftId) || gifts[0];
    bandoEngine.processGift(gift.id, 1, {
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

  const cameraPresets = getCameraPresetsForCountry();

  return (
    <div 
      className={`relative w-full h-full flex flex-col overflow-hidden select-none font-sans ${isPopout ? 'bg-transparent' : 'bg-[#090d16] text-gray-100'}`}
      onClick={handleUserGesture}
    >
      {/* 1. TOP HUD: Header & Tiến Độ Hoàn Thành Bản Đồ */}
      <div className="relative z-20 flex items-center justify-between px-4 py-2.5 bg-black/65 backdrop-blur-md border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-amber-500 to-yellow-400 shadow-lg shadow-red-500/40 ring-2 ring-yellow-400/60 animate-pulse">
            <span className="text-xl">{currentCountry?.flag || '🇻🇳'}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm md:text-base font-black bg-gradient-to-r from-yellow-300 via-red-400 to-amber-300 bg-clip-text text-transparent uppercase tracking-wider">
                {gameState.settings.customMapTitle || `${currentCountry?.name || 'Việt Nam'} ${t.title}`}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white shadow-sm">
                {gameState.roundId}
              </span>
            </div>
            <div className="text-[11px] text-gray-300 font-medium flex items-center gap-2">
              <span>{t.claimed}: <strong className="text-yellow-400 font-bold">{gameState.claimedCount.toLocaleString()}</strong> / {gameState.totalCells.toLocaleString()} {t.cells}</span>
              <span>•</span>
              <span>{t.remaining}: <strong className="text-emerald-400 font-bold">{gameState.remainingCells.toLocaleString()}</strong> {t.cells}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar & Controls */}
        <div className="flex items-center gap-3 md:gap-4">
          {gameState.combo.active && gameState.combo.count >= 2 && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-600 to-red-600 rounded-full text-white text-xs font-black shadow-lg animate-bounce">
              <Flame size={14} className="text-yellow-300 animate-spin" />
              <span>{t.combo} x{gameState.combo.multiplier} ({gameState.combo.count} {t.gifts})</span>
            </div>
          )}

          <div className="hidden sm:flex flex-col items-end w-44 md:w-56">
            <div className="flex justify-between w-full text-[11px] font-bold text-gray-300 mb-1">
              <span>{t.progress}</span>
              <span className="text-yellow-400 font-mono">{gameState.percent}%</span>
            </div>
            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/20">
              <div 
                className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(234,179,8,0.8)]"
                style={{ width: `${gameState.percent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Nút Bật/Tắt Xoay Tự Động Bản Đồ */}
            <button
              onClick={handleToggleAutoRotate}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ${
                autoRotate
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-md shadow-emerald-500/30'
                  : 'bg-white/10 hover:bg-white/20 text-gray-300 border-white/10'
              }`}
              title={autoRotate ? "Bản đồ đang tự động quay — Bấm để ĐỨNG YÊN" : "Bản đồ đang đứng yên — Bấm để TỰ ĐỘNG XOAY"}
            >
              <RefreshCw size={13} className={autoRotate ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">{autoRotate ? 'Đang Xoay' : 'Đứng Yên'}</span>
            </button>

            <button
              onClick={() => setShowSidePanels(!showSidePanels)}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all border ${
                showSidePanels 
                  ? 'bg-white/10 hover:bg-white/20 text-gray-200 border-white/10' 
                  : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40 shadow-md shadow-yellow-500/20'
              }`}
              title={showSidePanels ? "Thu gọn bảng bên hông (Tối đa hóa bản đồ)" : "Mở lại bảng bên hông"}
            >
              {showSidePanels ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>

            <button
              onClick={() => setViewMode3D(!viewMode3D)}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-gray-200 border border-white/10 transition-colors flex items-center gap-1"
              title={viewMode3D ? "Chuyển sang chế độ 2D" : "Chuyển sang chế độ 3D"}
            >
              <Layers size={13} />
              <span>{viewMode3D ? '3D' : '2D'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN 3D / 2D MAP STAGE */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {viewMode3D ? (
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        ) : (
          <canvas 
            ref={canvas2dRef} 
            className="w-full h-full cursor-move"
            onMouseDown={handleMouseDown2D}
            onMouseMove={handleMouseMove2D}
            onMouseUp={handleMouseUp2D}
            onWheel={handleWheel2D}
          />
        )}

        {/* TRUE 3D-ANCHORED LANDMARK LABELS LAYER */}
        {gameState.settings.showMapTexts && (
          <div ref={labelsLayerRef} className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            {gameState.mapTexts?.map((item) => (
              <div
                key={item.id}
                ref={(el) => { labelRefs.current[item.id] = el; }}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  display: 'none',
                  color: item.color || '#facc15',
                }}
                className={`font-black text-xs tracking-wide whitespace-nowrap select-none pointer-events-none transition-opacity duration-150 ${
                  item.glow 
                    ? 'drop-shadow-[0_0_12px_rgba(250,204,21,0.9)] px-2.5 py-1 rounded-full bg-black/60 border border-yellow-400/60 backdrop-blur-sm shadow-xl' 
                    : 'drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)] px-2 py-0.5 rounded-lg bg-black/45 backdrop-blur-xs border border-white/10'
                }`}
              >
                {item.text}
              </div>
            ))}

            {/* FLOATING USER ID & ULTRA-SHARP NATIONAL FLAG CLAIM BADGES */}
            {recentClaimBadges.map((badge) => (
              <div
                key={badge.id}
                ref={(el) => { badgeRefs.current[badge.id] = el; }}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  display: 'none',
                }}
                className="px-2.5 py-1 rounded-2xl bg-gradient-to-r from-red-950/95 via-slate-900/95 to-black/95 border-2 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.6)] backdrop-blur-md flex items-center gap-2 animate-bounce ring-2 ring-yellow-400/40 pointer-events-none select-none"
              >
                <span className="text-xl drop-shadow-md select-none">{badge.flag}</span>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-black text-yellow-300 font-mono tracking-wider">ID: {badge.userId}</span>
                  <span className="text-[10px] font-bold text-white max-w-[100px] truncate">{badge.username}</span>
                </div>
                <span className="text-[9px] font-black font-mono px-2 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-sm">
                  +{badge.count} Ô
                </span>
              </div>
            ))}
          </div>
        )}

        {/* FLOATING MULTI-DIRECTIONAL D-PAD & PAN/ZOOM NAVIGATION CONTROLLER */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 p-2 bg-black/75 backdrop-blur-md border border-white/15 rounded-2xl shadow-2xl">
          {/* Zoom Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => viewMode3D ? handleZoom3D(0.85) : setZoom2D(z => Math.min(4.0, z * 1.2))}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-yellow-300 hover:text-white border border-white/10 transition-all active:scale-95 shadow-sm"
              title="Phóng to (+)"
            >
              <ZoomIn size={15} />
            </button>
            <button
              onClick={() => viewMode3D ? handleZoom3D(1.18) : setZoom2D(z => Math.max(0.5, z * 0.82))}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-yellow-300 hover:text-white border border-white/10 transition-all active:scale-95 shadow-sm"
              title="Thu nhỏ (-)"
            >
              <ZoomOut size={15} />
            </button>
          </div>

          <div className="w-[1px] h-6 bg-white/20 mx-1" />

          {/* D-Pad Pan Directions */}
          <div className="grid grid-cols-3 gap-1">
            <div />
            <button
              onClick={() => viewMode3D ? handlePan3D(0, -1) : setPan2D(p => ({ ...p, y: p.y + 40 }))}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 border border-white/10 transition-all active:scale-90"
              title="Kéo Lên Trên"
            >
              <ArrowUp size={13} />
            </button>
            <div />

            <button
              onClick={() => viewMode3D ? handlePan3D(-1, 0) : setPan2D(p => ({ ...p, x: p.x + 40 }))}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 border border-white/10 transition-all active:scale-90"
              title="Kéo Sang Trái"
            >
              <ArrowLeft size={13} />
            </button>
            <button
              onClick={handleResetCamera}
              className="p-1.5 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/40 transition-all active:scale-90 text-[10px] font-black"
              title="Đặt Lại Góc Nhìn Mặc Định"
            >
              🎯
            </button>
            <button
              onClick={() => viewMode3D ? handlePan3D(1, 0) : setPan2D(p => ({ ...p, x: p.x - 40 }))}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 border border-white/10 transition-all active:scale-90"
              title="Kéo Sang Phải"
            >
              <ArrowRight size={13} />
            </button>

            <div />
            <button
              onClick={() => viewMode3D ? handlePan3D(0, 1) : setPan2D(p => ({ ...p, y: p.y - 40 }))}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 border border-white/10 transition-all active:scale-90"
              title="Kéo Xuống Dưới"
            >
              <ArrowDown size={13} />
            </button>
            <div />
          </div>
        </div>

        {/* FLOATING CAMERA PRESET ZOOM TOOLBAR */}
        <div className="absolute bottom-4 right-4 z-20 flex flex-wrap items-center gap-1.5 p-1.5 bg-black/70 backdrop-blur-md border border-white/15 rounded-2xl shadow-2xl">
          <span className="text-[10px] font-black text-gray-400 uppercase px-2 flex items-center gap-1">
            <CompassIcon size={12} className="text-yellow-400" /> {t.zoom}:
          </span>
          {Object.entries(getCameraPresetsForCountry()).map(([key, item]) => (
            <button
              key={key}
              onClick={() => applyCameraPreset(key)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
                activeCameraPreset === key
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg shadow-red-500/30 scale-105 border border-yellow-300/40'
                  : 'bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white'
              }`}
              title={`Góc nhìn camera: ${item.name}`}
            >
              <span>{item.icon}</span>
              <span className="hidden md:inline">{item.name}</span>
            </button>
          ))}
        </div>

        {/* LEFT HUD: Boss Event & Urgent Mission & Live Feed (Collapsible) */}
        {showSidePanels && (
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2.5 max-w-[280px] pointer-events-none animate-in fade-in slide-in-from-left duration-200">
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
            <div className="pointer-events-auto bg-black/60 border border-white/10 rounded-2xl p-2.5 shadow-xl backdrop-blur-md max-h-48 overflow-y-auto custom-scrollbar">
              <div className="text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Sparkles size={11} className="text-yellow-400" /> Hoạt động cắm cờ
              </div>
              <div className="space-y-1.5">
                {gameState.feed.slice(0, 8).map(item => (
                  <div key={item.id} className="text-[11px] text-gray-200 leading-tight bg-white/5 p-1.5 rounded-lg border border-white/5 animate-in fade-in">
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
        )}

        {/* RIGHT HUD: Leaderboard Top Đại Gia (Collapsible) */}
        {showSidePanels && (
          <div className="absolute top-4 right-4 z-10 w-64 pointer-events-none animate-in fade-in slide-in-from-right duration-200">
            <div className="pointer-events-auto bg-black/65 border border-white/10 rounded-2xl p-3 shadow-2xl backdrop-blur-md">
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
        )}

        {/* Victory Screen */}
        {gameState.status === 'victory' && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-lg animate-in fade-in zoom-in duration-300 p-4">
            <div className="max-w-md w-full bg-gradient-to-b from-red-950/90 via-slate-900 to-black border-2 border-yellow-400 rounded-3xl p-6 shadow-2xl text-center">
              <div className="text-5xl mb-2 animate-bounce">🏆 🎉 🏆</div>
              <h1 className="text-2xl font-black text-yellow-300 uppercase tracking-wider mb-2">
                HOÀN THÀNH GHÉP CỜ!
              </h1>
              <p className="text-sm text-gray-200 mb-4">
                Toàn bộ non sông và hải đảo của <strong>{gameState.settings.customMapTitle}</strong> đã rực rỡ sắc cờ!
              </p>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-5 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Đại tướng quân MVP:</span>
                  <span className="font-black text-yellow-400">{gameState.victory?.mvpUser?.username || 'Chiến Binh Xuất Sắc'}</span>
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

      {/* 3. BOTTOM TEST CONTROL BAR (Chỉ hiển thị khi Demo Mode Bật) */}
      {gameState.isDemoMode && !isPopout && (
        <div className="relative z-20 bg-[#0d1017] border-t border-white/10 p-3 shrink-0 animate-in slide-in-from-bottom duration-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            
            {/* Mock Gift Quick Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 custom-scrollbar">
              <span className="text-[11px] font-black text-yellow-400 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
                <Sparkles size={12} /> Test Quà:
              </span>

              {(gameState.gifts || []).map(gift => (
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

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
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
      )}
    </div>
  );
}
