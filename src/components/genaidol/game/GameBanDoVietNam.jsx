import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Play, Pause, RotateCcw, Shield, Sparkles, Trophy, Flame, 
  MapPin, Flag, Eye, EyeOff, Volume2, VolumeX, Maximize2, Zap, Star,
  Compass, Award, ChevronRight, Layers, CheckCircle2, AlertTriangle, 
  MonitorPlay, Sun, Moon, Move, ZoomIn, ZoomOut, Search, Globe, Navigation, Compass as CompassIcon,
  Sliders, Settings, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RefreshCw,
  Bookmark, BookmarkPlus, BookmarkCheck, Edit2, Trash2, Plus, Save, Check, X, Crosshair
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

// Function tạo Texture Quốc Kỳ siêu sắc nét cho từng ô pixel/voxel 3D
function createCountryFlagTexture(countryCode = 'vietnam') {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (countryCode === 'japan') {
    // 🇯🇵 Nhật Bản: Nền trắng + Mặt trời đỏ
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#BC002D';
    ctx.beginPath();
    ctx.arc(128, 128, 76, 0, Math.PI * 2);
    ctx.fill();
  } else if (countryCode === 'korea') {
    // 🇰🇷 Hàn Quốc: Nền trắng + Âm Dương
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#CD2E3A';
    ctx.beginPath();
    ctx.arc(128, 128, 72, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#0047A0';
    ctx.beginPath();
    ctx.arc(128, 128, 72, 0, Math.PI);
    ctx.fill();
  } else {
    // 🇻🇳 VIỆT NAM (Mặc định): Nền cờ đỏ rực rỡ + Viền dạ quang phát sáng + Ngôi sao vàng kim phát quang siêu nét
    const grad = ctx.createLinearGradient(0, 0, 256, 256);
    grad.addColorStop(0, '#EF4444');
    grad.addColorStop(0.5, '#DC2626');
    grad.addColorStop(1, '#B91C1C');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    // Viền khối 3D phát quang (Fluorescent Neon Border)
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.85)';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, 250, 250);

    ctx.strokeStyle = 'rgba(239, 68, 68, 0.9)';
    ctx.lineWidth = 8;
    ctx.strokeRect(9, 9, 238, 238);

    // Ngôi sao vàng 5 cánh chuẩn tỷ lệ hình học, hiệu ứng phát quang rực rỡ (Fluorescent Glow Aura)
    const cx = 128, cy = 128, outerR = 84, innerR = 34;
    
    // Radial Glow Aura xung quanh ngôi sao
    const starGlow = ctx.createRadialGradient(cx, cy, innerR * 0.5, cx, cy, outerR * 1.25);
    starGlow.addColorStop(0, 'rgba(255, 255, 0, 0.6)');
    starGlow.addColorStop(0.7, 'rgba(245, 158, 11, 0.3)');
    starGlow.addColorStop(1, 'rgba(220, 38, 38, 0)');
    ctx.fillStyle = starGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR * 1.25, 0, Math.PI * 2);
    ctx.fill();

    // Thân Ngôi sao vàng kim siêu nét
    ctx.fillStyle = '#FFFF00';
    ctx.shadowColor = '#FBBF24';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const rotOuter = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const x1 = cx + Math.cos(rotOuter) * outerR;
      const y1 = cy + Math.sin(rotOuter) * outerR;
      if (i === 0) ctx.moveTo(x1, y1);
      else ctx.lineTo(x1, y1);

      const rotInner = rotOuter + (2 * Math.PI) / 10;
      const x2 = cx + Math.cos(rotInner) * innerR;
      const y2 = cy + Math.sin(rotInner) * innerR;
      ctx.lineTo(x2, y2);
    }
    ctx.closePath();
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

// 3 Vị Trí Ghim Camera Mặc Định Ban Đầu
const DEFAULT_CUSTOM_BOOKMARKS = [
  {
    id: 'bm_hanoi',
    name: 'Vị trí 1: Thủ Đô Hà Nội (Bắc Bộ)',
    shortName: '1. Hà Nội',
    icon: '🏛️',
    pos: [-49, 110, -85],
    target: [-49.2, 0, -123.0],
  },
  {
    id: 'bm_danang',
    name: 'Vị trí 2: Đà Nẵng (Miền Trung)',
    shortName: '2. Đà Nẵng',
    icon: '🏖️',
    pos: [15, 120, 30],
    target: [-4.7, 0, 4.5],
  },
  {
    id: 'bm_saigon',
    name: 'Vị trí 3: TP. Hồ Chí Minh (Nam Bộ)',
    shortName: '3. TP.HCM',
    icon: '🏙️',
    pos: [-27, 110, 155],
    target: [-27.6, 0, 126.4],
  },
];

// Dữ liệu mẫu khởi tạo huy hiệu cắm cờ phân bổ đều 3 miền, tránh trùng tọa độ
const INITIAL_DEMO_BADGES = [
  {
    id: 'badge_hanoi_demo',
    userId: '@hanoi_pho_co',
    username: 'Chiến Binh Thủ Đô 🏛️',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    flag: '🇻🇳',
    count: 25,
    wx: -49.2,
    wy: 5.5,
    wz: -123.0,
    timestamp: Date.now(),
  },
  {
    id: 'badge_danang_demo',
    userId: '@danang_song_han',
    username: 'Rồng Vàng Miền Trung 🏖️',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    flag: '🇻🇳',
    count: 18,
    wx: -4.7,
    wy: 5.5,
    wz: 4.5,
    timestamp: Date.now() - 1000,
  },
  {
    id: 'badge_saigon_demo',
    userId: '@saigon_pho_hoa',
    username: 'Bác Ba Sài Gòn 🏙️',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100',
    flag: '🇻🇳',
    count: 32,
    wx: -27.6,
    wy: 5.5,
    wz: 126.4,
    timestamp: Date.now() - 2000,
  },
];

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
  const [isPanMode, setIsPanMode] = useState(false);
  const [recentClaimBadges, setRecentClaimBadges] = useState(INITIAL_DEMO_BADGES);
  const isLightTheme = gameState.settings?.theme === 'light';

  // Quản lý Danh Sách Vị Trí Ghim Camera Tùy Chỉnh (Custom Camera Bookmarks)
  const [customBookmarks, setCustomBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('bando_custom_camera_bookmarks_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading camera bookmarks:', e);
    }
    return DEFAULT_CUSTOM_BOOKMARKS;
  });

  const [activeBookmarkId, setActiveBookmarkId] = useState(null);
  const [showBookmarkManager, setShowBookmarkManager] = useState(false);
  const [bookmarkNotification, setBookmarkNotification] = useState(null);
  const [editingBookmarkId, setEditingBookmarkId] = useState(null);
  const [editingBookmarkName, setEditingBookmarkName] = useState('');

  // 2D Canvas Pan & Zoom State
  const [zoom2D, setZoom2D] = useState(1.0);
  const [pan2D, setPan2D] = useState({ x: 0, y: 0 });
  const isDragging2DRef = useRef(false);
  const dragStart2DRef = useRef({ x: 0, y: 0 });

  const containerRef = useRef(null);
  const canvas2dRef = useRef(null);
  const labelsLayerRef = useRef(null);
  const claimBadgesLayerRef = useRef(null);
  const labelRefs = useRef({});
  const badgeRefs = useRef({});
  const recentClaimBadgesRef = useRef(recentClaimBadges);

  useEffect(() => {
    recentClaimBadgesRef.current = recentClaimBadges;
  }, [recentClaimBadges]);

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

  // Dynamic Mouse Controls Mode (Orbit 3D vs Pan Drag)
  useEffect(() => {
    const state = threeStateRef.current;
    if (state.controls) {
      state.controls.mouseButtons = {
        LEFT: isPanMode ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: isPanMode ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN,
      };
    }
  }, [isPanMode]);

  // Update OrbitControls autoRotate dynamically without scene recreation
  useEffect(() => {
    const state = threeStateRef.current;
    if (state.controls) {
      state.controls.autoRotate = autoRotate;
      state.controls.autoRotateSpeed = 0.8;
    }
  }, [autoRotate]);

  // Current Country Translation
  const currentCountry = COUNTRY_PRESETS[gameState.selectedCountry] || COUNTRY_PRESETS['vietnam'];
  const t = getGameTranslation(currentCountry?.lang || 'vi');

  // Lưu danh sách Bookmarks vào localStorage
  const saveBookmarksToStorage = (bms) => {
    setCustomBookmarks(bms);
    try {
      localStorage.setItem('bando_custom_camera_bookmarks_v2', JSON.stringify(bms));
    } catch (e) {
      console.error('Failed to save camera bookmarks:', e);
    }
  };

  const notifyBookmark = (msg) => {
    setBookmarkNotification(msg);
    setTimeout(() => {
      setBookmarkNotification(null);
    }, 2800);
  };

  // Chuyển mượt mà Camera tới Bookmark đã lưu
  const handleApplyBookmark = (bm) => {
    const state = threeStateRef.current;
    if (!state.camera || !state.controls || !bm) return;
    setActiveBookmarkId(bm.id);
    setActiveCameraPreset(bm.id);
    state.tween = {
      from: state.camera.position.clone(),
      to: new THREE.Vector3(...bm.pos),
      fromTarget: state.controls.target.clone(),
      toTarget: new THREE.Vector3(...bm.target),
      start: performance.now(),
      duration: 1100,
      phase: 'direct',
    };
    notifyBookmark(`🎯 Đang chuyển đến: ${bm.name}`);
  };

  // Quay về góc nhìn Toàn Cảnh ban đầu
  const handleResetOverview = () => {
    const state = threeStateRef.current;
    if (!state.camera || !state.controls) return;
    setActiveBookmarkId('overview');
    setActiveCameraPreset('overview');
    state.tween = {
      from: state.camera.position.clone(),
      to: new THREE.Vector3(0, 240, 260),
      fromTarget: state.controls.target.clone(),
      toTarget: new THREE.Vector3(0, 0, 10),
      start: performance.now(),
      duration: 1000,
      phase: 'direct',
    };
    notifyBookmark(`🏠 Đã trở về góc nhìn Toàn Cảnh Bản Đồ`);
  };

  // Ghim Góc Nhìn Hiện Tại vào Slot được chọn
  const handleSaveCurrentViewToSlot = (slotId) => {
    const state = threeStateRef.current;
    if (!state.camera || !state.controls) return;
    const currentPos = [
      parseFloat(state.camera.position.x.toFixed(1)),
      parseFloat(state.camera.position.y.toFixed(1)),
      parseFloat(state.camera.position.z.toFixed(1)),
    ];
    const currentTarget = [
      parseFloat(state.controls.target.x.toFixed(1)),
      parseFloat(state.controls.target.y.toFixed(1)),
      parseFloat(state.controls.target.z.toFixed(1)),
    ];

    const updated = customBookmarks.map(b => {
      if (b.id === slotId) {
        return { ...b, pos: currentPos, target: currentTarget };
      }
      return b;
    });

    saveBookmarksToStorage(updated);
    const targetBm = updated.find(b => b.id === slotId);
    notifyBookmark(`💾 Đã ghim góc nhìn & zoom hiện tại vào [${targetBm?.name || slotId}]!`);
  };

  // Thêm Vị Trí Mới từ góc nhìn hiện tại
  const handleAddNewBookmarkFromCurrentView = () => {
    const state = threeStateRef.current;
    if (!state.camera || !state.controls) return;
    const currentPos = [
      parseFloat(state.camera.position.x.toFixed(1)),
      parseFloat(state.camera.position.y.toFixed(1)),
      parseFloat(state.camera.position.z.toFixed(1)),
    ];
    const currentTarget = [
      parseFloat(state.controls.target.x.toFixed(1)),
      parseFloat(state.controls.target.y.toFixed(1)),
      parseFloat(state.controls.target.z.toFixed(1)),
    ];
    const slotNum = customBookmarks.length + 1;
    const newBm = {
      id: `bm_${Date.now()}`,
      name: `Vị trí ${slotNum} (Tùy chỉnh)`,
      shortName: `${slotNum}. Tùy chỉnh`,
      icon: '📍',
      pos: currentPos,
      target: currentTarget,
    };
    const updated = [...customBookmarks, newBm];
    saveBookmarksToStorage(updated);
    notifyBookmark(`➕ Đã thêm [${newBm.name}] từ góc nhìn camera hiện tại!`);
  };

  // Xóa Vị Trí Ghim
  const handleDeleteBookmark = (slotId) => {
    if (customBookmarks.length <= 1) {
      notifyBookmark(`⚠️ Cần giữ lại ít nhất 1 vị trí ghim.`);
      return;
    }
    const updated = customBookmarks.filter(b => b.id !== slotId);
    saveBookmarksToStorage(updated);
    notifyBookmark(`🗑️ Đã xóa vị trí ghim.`);
  };

  // Đổi tên Vị Trí Ghim
  const handleRenameBookmark = (slotId, newName) => {
    if (!newName.trim()) return;
    const updated = customBookmarks.map(b => {
      if (b.id === slotId) {
        return { ...b, name: newName.trim(), shortName: newName.trim().slice(0, 14) };
      }
      return b;
    });
    saveBookmarksToStorage(updated);
    setEditingBookmarkId(null);
    notifyBookmark(`✏️ Đã đổi tên thành: ${newName.trim()}`);
  };

  // Khôi phục 3 vị trí mặc định
  const handleRestoreDefaultBookmarks = () => {
    saveBookmarksToStorage(DEFAULT_CUSTOM_BOOKMARKS);
    notifyBookmark(`🔄 Đã khôi phục 3 vị trí mặc định ban đầu!`);
  };

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

        // Tính toạ độ 3D trung tâm của nhóm ô cờ vừa cắm
        let wx = 0, wz = 0;
        if (lastEvt.focalTarget) {
          wx = lastEvt.focalTarget.wx || 0;
          wz = lastEvt.focalTarget.wz || 0;
        } else if (bandoEngine.state.lastFocalTarget) {
          wx = bandoEngine.state.lastFocalTarget.wx || 0;
          wz = bandoEngine.state.lastFocalTarget.wz || 0;
        } else {
          wx = (Math.random() - 0.5) * 80;
          wz = (Math.random() - 0.5) * 120;
        }

        const newBadge = {
          id: `badge_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          userId: user?.id ? (user.id.startsWith('@') ? user.id : `@${user.id}`) : '@tiktok_vip',
          username: user?.username || 'Chiến Binh Yêu Nước',
          avatar: user?.avatar || '',
          flag,
          count,
          wx,
          wy: 5.5,
          wz,
          timestamp: Date.now(),
        };

        setRecentClaimBadges(prev => [newBadge, ...prev.slice(0, 14)]);
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
        id: data.userId || 'guest',
        username: data.username || 'Khách Live',
        avatar: data.avatar || '',
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
      north: { name: isVN ? 'Miền Bắc & Hà Nội' : 'Vùng Phía Bắc', icon: '🏛️', pos: [-49, 110, -85], target: [-49.2, 0, -123.0] },
      central: { name: isVN ? 'Miền Trung & Huế' : 'Khu Vực Trung Tâm', icon: '🏖️', pos: [15, 120, 30], target: [-4.7, 0, 4.5] },
      south: { name: isVN ? 'Miền Nam & TP.HCM' : 'Vùng Phía Nam', icon: '🏙️', pos: [-27, 110, 155], target: [-27.6, 0, 126.4] },
      tip_camau: { name: isVN ? 'Mũi Cà Mau (Cực Nam)' : 'Cực Nam', icon: '⛵', pos: [-63, 75, 195], target: [-63.1, 0, 161.9] },
      islands: { name: isVN ? 'Hoàng Sa & Trường Sa' : 'Hải Đảo', icon: '🏝️', pos: [75, 110, 20], target: [65.6, 0, -34.4] },
      macro: { name: 'Cận Cảnh Từng Ô Cờ', icon: '🔍', pos: [0, 20, 20], target: [0, 0, 0] },
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
    const isLightTheme = gameState.settings?.theme === 'light';

    // Scene with theme-responsive background & fog
    const scene = new THREE.Scene();
    state.scene = scene;
    if (isPopout) {
      scene.background = null;
    } else {
      const bgColor = isLightTheme ? 0xf8fafc : 0x0a0f1d;
      scene.background = new THREE.Color(bgColor);
      scene.fog = new THREE.FogExp2(bgColor, isLightTheme ? 0.0012 : 0.0015);
    }

    // Camera với Near plane cực gần (0.05) cho phép Zoom Siêu Cận Cảnh từng ô voxel
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.05, 4000);
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
    renderer.toneMappingExposure = (gameState.settings.brightness || 1.2) * (isLightTheme ? 1.0 : 0.95);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    state.renderer = renderer;

    // Controls with Ultra-close Zoom (minDistance = 0.5) and Wide Pan
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2.02;
    controls.minDistance = 0.5;
    controls.maxDistance = 1200;
    controls.target.set(0, 0, 10);
    controls.enablePan = true;
    controls.panSpeed = 1.6;
    controls.screenSpacePanning = true;
    controls.enableZoom = true;
    controls.zoomSpeed = 1.25;
    controls.mouseButtons = {
      LEFT: isPanMode ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: isPanMode ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN,
    };
    controls.autoRotate = !isPopout && autoRotate;
    controls.autoRotateSpeed = 0.8;
    state.controls = controls;

    // Balanced Lighting: Đảm bảo toàn bộ bề mặt cờ 3D luôn sáng rực rỡ, không bị tối đen
    const brightness = gameState.settings.brightness || 1.2;
    const ambientLight = new THREE.AmbientLight(0xffffff, (isLightTheme ? 1.35 : 1.15) * brightness);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x555555, 0.7 * brightness);
    hemiLight.position.set(0, 300, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfffaee, (isLightTheme ? 1.4 : 1.3) * brightness);
    dirLight.position.set(120, 320, 160);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(isLightTheme ? 0x0284c7 : 0x38bdf8, (isLightTheme ? 0.9 : 0.8) * brightness);
    rimLight.position.set(-150, 180, -120);
    scene.add(rimLight);

    const pLight1 = new THREE.PointLight(0xffd700, 1.2 * brightness, 350);
    pLight1.position.set(-49.2, 65, -123.0);
    scene.add(pLight1);

    const pLight2 = new THREE.PointLight(0x38bdf8, 1.0 * brightness, 300);
    pLight2.position.set(-27.6, 60, 126.4);
    scene.add(pLight2);

    const pLight3 = new THREE.PointLight(0xf43f5e, 1.2 * brightness, 350);
    pLight3.position.set(65.6, 65, -34.4);
    scene.add(pLight3);

    // Stars / Background Grid
    if (!isPopout) {
      if (!isLightTheme) {
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
      }

      const gridHelper = new THREE.GridHelper(500, 35, isLightTheme ? 0x94a3b8 : 0x1e293b, isLightTheme ? 0xe2e8f0 : 0x0f172a);
      gridHelper.position.y = -3;
      if (gridHelper.material) {
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.25;
      }
      scene.add(gridHelper);
    }

    // Instanced Mesh for cells with National Flag Texture (Lá cờ quốc kỳ trên từng ô pixel)
    const maskData = bandoEngine.maskData;
    const cells = maskData?.cells || [];
    const count = cells.length > 0 ? cells.length : 15125;
    const flagTexture = createCountryFlagTexture(gameState.selectedCountry || 'vietnam');
    state.flagTexture = flagTexture;
    const boxGeo = new THREE.BoxGeometry(0.88, 1, 0.88);
    const boxMat = new THREE.MeshLambertMaterial({
      map: flagTexture,
      color: 0xffffff,
      reflectivity: 0.1,
    });
    state.boxMat = boxMat;
    state.currentCountry = gameState.selectedCountry || 'vietnam';
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

    for (let i = 0; i < count; i++) {
      const cell = cells[i] || { x: (i % 100), y: Math.floor(i / 100) };
      const wx = (cell.x - cols / 2) * 1.0;
      const wz = (cell.y - rows / 2) * 1.0;
      const isClaimed = !!bandoEngine.state.cellsById[cell.id];

      const scaleY = isClaimed ? 1.85 : 0.22;
      const posY = scaleY / 2;

      dummy.position.set(wx, posY, wz);
      dummy.scale.set(0.94, scaleY, 0.94);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);

      if (isClaimed) {
        // Ô đã cắm cờ (người xem tặng quà): Lắp lá cờ quốc kỳ 3D vươn cao + Dạ phát quang siêu rực rỡ (gấp 10 lần màu nền)
        instancedMesh.setColorAt(i, new THREE.Color(2.2, 1.9, 1.6));
      } else {
        // Ô nền lãnh thổ CHƯA cắm cờ: Tối mờ dịu, sẫm màu, chìm xuống dưới
        instancedMesh.setColorAt(i, isLightTheme ? new THREE.Color(0.22, 0.18, 0.20) : new THREE.Color(0.18, 0.14, 0.16));
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
            tw.holdUntil = time + 4000; // Giữ camera zoom cận cảnh đúng 4 giây
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

      // PROJECTION & ANTI-OVERLAP: Update Recent Claim Badges with Smart Stacking (Tuyệt đối không chồng chéo)
      const allBadges = recentClaimBadgesRef.current || [];
      const visibleBadges = [];
      const maxVisible = 5; // Tối đa 5 huy hiệu hiển thị đồng thời để bản đồ luôn thông thoáng

      for (let b = 0; b < Math.min(allBadges.length, maxVisible); b++) {
        const badge = allBadges[b];
        const badgeEl = badgeRefs.current[badge.id];
        if (!badgeEl) continue;

        tempVec.set(badge.wx || 0, badge.wy || 5.5, badge.wz || 0);
        tempVec.project(camera);

        if (tempVec.z < 1.0) {
          let sx = (tempVec.x * 0.5 + 0.5) * contW;
          let sy = (-tempVec.y * 0.5 + 0.5) * contH;

          // Thuật toán phân giải va chạm 2D (Anti-overlapping / Collision repulsion)
          for (let p = 0; p < visibleBadges.length; p++) {
            const prev = visibleBadges[p];
            const dx = sx - prev.sx;
            const dy = sy - prev.sy;
            const minDistX = 135;
            const minDistY = 42;

            if (Math.abs(dx) < minDistX && Math.abs(dy) < minDistY) {
              // Tự động đẩy dời độ cao sy lên trên hoặc so le sang bên để không đè che khuất nhau
              sy = prev.sy - minDistY;
              if (Math.abs(dx) < minDistX * 0.4) {
                sx = prev.sx + (dx >= 0 ? 35 : -35);
              }
            }
          }

          visibleBadges.push({ badge, badgeEl, sx, sy });
          badgeEl.style.display = 'flex';
          badgeEl.style.transform = `translate3d(${sx}px, ${sy}px, 0px) translate(-50%, -100%)`;
        } else {
          badgeEl.style.display = 'none';
        }
      }

      // Ẩn các badge vượt quá giới hạn
      for (let b = maxVisible; b < allBadges.length; b++) {
        const badge = allBadges[b];
        const badgeEl = badgeRefs.current[badge?.id];
        if (badgeEl) badgeEl.style.display = 'none';
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
      if (state.flagTexture) state.flagTexture.dispose();
    };
  }, [viewMode3D, isPopout, gameState.selectedCountry, isLightTheme]);

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
    const newLen = Math.max(0.8, Math.min(1200, dir.length() * factor));
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

  const handleTestGift = (giftId) => {
    handleUserGesture();
    const gifts = gameState.gifts || [];
    const gift = gifts.find(g => g.id === giftId) || gifts[0];
    if (!gift) return;
    bandoEngine.processGift(gift.id, 1, {
      id: `user_test_${Math.floor(Math.random() * 5)}`,
      username: `Đại Gia ${gift.name} 💎`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
    });
  };

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

    // Cập nhật Texture Quốc Kỳ khi chuyển đổi quốc gia
    if (state.boxMat && gameState.selectedCountry && state.currentCountry !== gameState.selectedCountry) {
      state.currentCountry = gameState.selectedCountry;
      const newTex = createCountryFlagTexture(gameState.selectedCountry);
      state.boxMat.map = newTex;
      state.boxMat.needsUpdate = true;
    }

    const cells = maskData.cells || [];
    const count = cells.length;
    const cols = maskData.gridCols || 300;
    const rows = maskData.gridRows || 389;
    const dummy = state.dummy;

    for (let i = 0; i < count; i++) {
      const cell = cells[i];
      if (!cell) continue;
      const isClaimed = !!gameState.cellsById[cell.id];
      const scaleY = isClaimed ? 1.85 : 0.22;
      const posY = scaleY / 2;
      const wx = (cell.x - cols / 2) * 1.0;
      const wz = (cell.y - rows / 2) * 1.0;

      dummy.position.set(wx, posY, wz);
      dummy.scale.set(0.94, scaleY, 0.94);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);

      if (isClaimed) {
        // Ô đã cắm cờ (người xem tặng quà): Lắp lá cờ quốc kỳ 3D vươn cao + Dạ phát quang siêu rực rỡ (gấp 10 lần màu nền)
        instancedMesh.setColorAt(i, new THREE.Color(2.2, 1.9, 1.6));
      } else {
        // Ô nền lãnh thổ CHƯA cắm cờ: Tối mờ dịu, sẫm màu, chìm xuống dưới
        instancedMesh.setColorAt(i, isLightTheme ? new THREE.Color(0.22, 0.18, 0.20) : new THREE.Color(0.18, 0.14, 0.16));
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

    ctx.fillStyle = isLightTheme ? '#f8fafc' : '#0a0f1d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid Cells in 2D Canvas with National Flag (Đỏ Sao Vàng trên từng ô pixel)
    (maskData.cells || []).forEach(cell => {
      const isClaimed = !!gameState.cellsById[cell.id];
      const cx = offsetX + cell.x * scale;
      const cy = offsetY + cell.y * scale;
      const cellSize = Math.max(1, scale * 0.9);

      if (isClaimed) {
        // Ô đã cắm cờ (Tặng quà): Cờ đỏ thắm tươi rực rỡ + Viền dạ quang phát sáng
        ctx.fillStyle = '#DC2626';
        ctx.fillRect(cx, cy, cellSize, cellSize);

        // Viền dạ quang neon phát sáng
        if (cellSize >= 4.0) {
          ctx.strokeStyle = 'rgba(254, 240, 138, 0.85)';
          ctx.lineWidth = 1;
          ctx.strokeRect(cx, cy, cellSize, cellSize);
        }

        // Ngôi sao vàng mini ở trung tâm ô pixel
        if (cellSize >= 3.0) {
          ctx.fillStyle = '#FFFF00';
          const r = cellSize * 0.34;
          const midX = cx + cellSize / 2;
          const midY = cy + cellSize / 2;
          ctx.beginPath();
          for (let s = 0; s < 5; s++) {
            const rotOuter = (s * 4 * Math.PI) / 5 - Math.PI / 2;
            const x1 = midX + Math.cos(rotOuter) * r;
            const y1 = midY + Math.sin(rotOuter) * r;
            if (s === 0) ctx.moveTo(x1, y1);
            else ctx.lineTo(x1, y1);

            const rotInner = rotOuter + (2 * Math.PI) / 10;
            const x2 = midX + Math.cos(rotInner) * (r * 0.4);
            const y2 = midY + Math.sin(rotInner) * (r * 0.4);
            ctx.lineTo(x2, y2);
          }
          ctx.closePath();
          ctx.fill();
        }
      } else {
        // Ô nền CHƯA cắm cờ: Tối mờ dịu, sẫm màu, chìm xuống dưới
        ctx.fillStyle = isLightTheme ? 'rgba(160, 40, 40, 0.16)' : 'rgba(70, 18, 22, 0.28)';
        ctx.fillRect(cx, cy, cellSize, cellSize);

        if (cellSize >= 4.5) {
          ctx.fillStyle = isLightTheme ? 'rgba(200, 140, 20, 0.20)' : 'rgba(180, 120, 20, 0.20)';
          const r = cellSize * 0.22;
          const midX = cx + cellSize / 2;
          const midY = cy + cellSize / 2;
          ctx.beginPath();
          for (let s = 0; s < 5; s++) {
            const rotOuter = (s * 4 * Math.PI) / 5 - Math.PI / 2;
            const x1 = midX + Math.cos(rotOuter) * r;
            const y1 = midY + Math.sin(rotOuter) * r;
            if (s === 0) ctx.moveTo(x1, y1);
            else ctx.lineTo(x1, y1);

            const rotInner = rotOuter + (2 * Math.PI) / 10;
            const x2 = midX + Math.cos(rotInner) * (r * 0.4);
            const y2 = midY + Math.sin(rotInner) * (r * 0.4);
            ctx.lineTo(x2, y2);
          }
          ctx.closePath();
          ctx.fill();
        }
      }
    });

    // Draw 2D Landmark Labels
    (gameState.mapTexts || []).forEach(item => {
      const lx = offsetX + (item.wx + cols / 2) * scale;
      const ly = offsetY + (item.wz + rows / 2) * scale;
      if (lx >= 0 && lx <= canvas.width && ly >= 0 && ly <= canvas.height) {
        ctx.fillStyle = 'rgba(0,0,0,0.75)';
        ctx.strokeStyle = item.color || '#facc15';
        ctx.lineWidth = 1;
        ctx.font = 'bold 11px sans-serif';
        const textMetrics = ctx.measureText(item.text);
        const pad = 6;
        ctx.beginPath();
        ctx.roundRect(lx - textMetrics.width / 2 - pad, ly - 16, textMetrics.width + pad * 2, 20, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = item.color || '#facc15';
        ctx.fillText(item.text, lx - textMetrics.width / 2, ly - 2);
      }
    });

    // Draw 2D Claim Badges & User Names
    recentClaimBadges.forEach((badge) => {
      const bx = offsetX + (badge.wx + cols / 2) * scale;
      const by = offsetY + (badge.wz + rows / 2) * scale;
      if (bx >= 0 && bx <= canvas.width && by >= 0 && by <= canvas.height) {
        ctx.fillStyle = 'rgba(0,0,0,0.9)';
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(bx - 70, by - 26, 140, 24, 8);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 10px sans-serif';
        ctx.fillStyle = '#facc15';
        ctx.fillText(`${badge.flag} ID: ${badge.userId}`, bx - 62, by - 12);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`+${badge.count} Ô Cờ`, bx + 15, by - 12);
      }
    });
  }, [viewMode3D, gameState.claimedCount, gameState.settings, gameState.mapTexts, zoom2D, pan2D, recentClaimBadges, isLightTheme]);

  return (
    <div 
      className={`relative w-full h-full flex flex-col overflow-hidden select-none font-sans transition-colors duration-300 ${
        isPopout 
          ? 'bg-transparent' 
          : isLightTheme 
          ? 'bg-slate-100 text-slate-900' 
          : 'bg-[#070b14] text-white'
      }`}
      onPointerDown={handleUserGesture}
    >
      {/* 1. TOP HUD: Header & Tiến Độ Hoàn Thành Bản Đồ */}
      <div className={`relative z-20 flex items-center justify-between px-4 py-2.5 backdrop-blur-md border-b shrink-0 transition-colors ${
        isLightTheme 
          ? 'bg-white/85 text-slate-900 border-slate-200 shadow-sm' 
          : 'bg-black/65 text-white border-white/10'
      }`}>
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-amber-500 to-yellow-400 shadow-lg shadow-red-500/40 ring-2 ring-yellow-400/60 animate-pulse">
            <span className="text-xl">{currentCountry?.flag || '🇻🇳'}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-sm md:text-base font-black uppercase tracking-wider ${
                isLightTheme 
                  ? 'bg-gradient-to-r from-red-700 via-amber-600 to-yellow-600 bg-clip-text text-transparent' 
                  : 'bg-gradient-to-r from-yellow-300 via-red-400 to-amber-300 bg-clip-text text-transparent'
              }`}>
                {gameState.settings.customMapTitle || `${currentCountry?.name || 'Việt Nam'} ${t.title}`}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white shadow-sm">
                {gameState.roundId}
              </span>
            </div>
            <div className={`text-[11px] font-medium flex items-center gap-2 ${isLightTheme ? 'text-slate-600' : 'text-gray-300'}`}>
              <span>{t.claimed}: <strong className={`${isLightTheme ? 'text-red-700' : 'text-yellow-400'} font-bold`}>{gameState.claimedCount.toLocaleString()}</strong> / {gameState.totalCells.toLocaleString()} {t.cells}</span>
              <span>•</span>
              <span>{t.remaining}: <strong className="text-emerald-500 font-bold">{gameState.remainingCells.toLocaleString()}</strong> {t.cells}</span>
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
            <div className={`flex justify-between w-full text-[11px] font-bold mb-1 ${isLightTheme ? 'text-slate-600' : 'text-gray-300'}`}>
              <span>{t.progress}</span>
              <span className={`${isLightTheme ? 'text-amber-700' : 'text-yellow-400'} font-mono`}>{gameState.percent}%</span>
            </div>
            <div className={`w-full h-2.5 rounded-full overflow-hidden p-0.5 border ${
              isLightTheme ? 'bg-slate-200 border-slate-300' : 'bg-white/10 border-white/20'
            }`}>
              <div 
                className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(234,179,8,0.8)]"
                style={{ width: `${gameState.percent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Nút Chuyển Đổi Nền Sáng / Tối (Light / Dark Mode Switcher) */}
            <button
              onClick={() => {
                const nextTheme = gameState.settings?.theme === 'light' ? 'dark' : 'light';
                bandoEngine.setTheme(nextTheme);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ${
                isLightTheme
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300 shadow-sm'
                  : 'bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-200 border-indigo-500/40 shadow-sm'
              }`}
              title={isLightTheme ? "Đang ở Nền Sáng — Bấm chuyển sang Nền Tối" : "Đang ở Nền Tối — Bấm chuyển sang Nền Sáng"}
            >
              {isLightTheme ? <Sun size={13} className="text-amber-600" /> : <Moon size={13} className="text-indigo-400" />}
              <span className="hidden sm:inline">{isLightTheme ? 'Nền Sáng' : 'Nền Tối'}</span>
            </button>

            {/* Nút Bật/Tắt Xoay Tự Động Bản Đồ */}
            <button
              onClick={handleToggleAutoRotate}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ${
                autoRotate
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-md shadow-emerald-500/30'
                  : isLightTheme
                  ? 'bg-slate-200 hover:bg-slate-300 text-slate-700 border-slate-300'
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
                  ? isLightTheme ? 'bg-slate-200 hover:bg-slate-300 text-slate-700 border-slate-300' : 'bg-white/10 hover:bg-white/20 text-gray-200 border-white/10' 
                  : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40 shadow-md shadow-yellow-500/20'
              }`}
              title={showSidePanels ? "Thu gọn bảng bên hông (Tối đa hóa bản đồ)" : "Mở lại bảng bên hông"}
            >
              {showSidePanels ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>

            <button
              onClick={() => setViewMode3D(!viewMode3D)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 ${
                isLightTheme 
                  ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300' 
                  : 'bg-white/10 hover:bg-white/20 text-gray-200 border-white/10'
              }`}
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
          </div>
        )}

        {/* INDEPENDENT 3D-ANCHORED NATIONAL FLAG & USER CLAIM BADGES LAYER (THU NHỎ 30% TINH TẾ) */}
        <div ref={claimBadgesLayerRef} className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
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
              className="flex flex-col items-center pointer-events-none select-none drop-shadow-xl animate-in zoom-in duration-200"
            >
              {/* 1. TOP FLOATING BADGE (Avatar + Flag + TikTok ID + Claim Count) - ULTRA COMPACT & ELEGANT */}
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-black/90 border border-yellow-400/80 shadow-[0_0_10px_rgba(250,204,21,0.55)] backdrop-blur-md">
                {/* National Flag & Mini Avatar */}
                <div className="relative flex-shrink-0">
                  {badge.avatar ? (
                    <img 
                      src={badge.avatar} 
                      alt="Avatar" 
                      className="w-4 h-4 rounded-full border border-yellow-300 object-cover shadow-sm" 
                    />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-red-600 border border-yellow-300 flex items-center justify-center text-[8px] shadow-sm">
                      {badge.flag || '🇻🇳'}
                    </div>
                  )}
                  <span className="absolute -bottom-0.5 -right-0.5 text-[7px] select-none">
                    {badge.flag || '🇻🇳'}
                  </span>
                </div>

                {/* User Info & TikTok ID - Nhỏ gọn, thanh thoát */}
                <div className="flex items-center gap-1 leading-none">
                  <span className="text-[8.5px] font-bold text-yellow-300 font-mono tracking-tight max-w-[75px] truncate">
                    {badge.userId.startsWith('@') ? badge.userId : `@${badge.userId}`}
                  </span>
                </div>

                {/* Claim Count Badge Mini */}
                <div className="px-1 py-0.5 rounded bg-red-600/90 text-white font-bold text-[7.5px] font-mono shadow-xs flex items-center gap-0.5">
                  <Flag size={6} className="fill-white" />
                  <span>+{badge.count}</span>
                </div>
              </div>

              {/* 2. 3D PIN POLE LINE CONNECTING BADGE TO 3D MAP CELL */}
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-2.5 bg-gradient-to-b from-yellow-400 via-yellow-500 to-transparent" />
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 border border-white shadow-[0_0_6px_#facc15]" />
              </div>
            </div>
          ))}
        </div>

        {/* FLOATING MULTI-DIRECTIONAL D-PAD & PAN/ZOOM NAVIGATION CONTROLLER */}
        <div className={`absolute bottom-4 left-4 z-20 flex items-center gap-2 p-2 backdrop-blur-md border rounded-2xl shadow-2xl transition-colors ${
          isLightTheme ? 'bg-white/90 border-slate-300 shadow-xl' : 'bg-black/75 border-white/15'
        }`}>
          {/* Zoom Buttons with Macro Ultra Close-up View */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => viewMode3D ? handleZoom3D(0.80) : setZoom2D(z => Math.min(4.0, z * 1.25))}
              className={`p-2 rounded-xl border transition-all active:scale-95 shadow-sm ${
                isLightTheme 
                  ? 'bg-slate-100 hover:bg-slate-200 text-amber-600 border-slate-300' 
                  : 'bg-white/10 hover:bg-white/20 text-yellow-300 hover:text-white border-white/10'
              }`}
              title="Phóng to (+)"
            >
              <ZoomIn size={15} />
            </button>
            <button
              onClick={() => viewMode3D ? handleZoom3D(1.25) : setZoom2D(z => Math.max(0.5, z * 0.80))}
              className={`p-2 rounded-xl border transition-all active:scale-95 shadow-sm ${
                isLightTheme 
                  ? 'bg-slate-100 hover:bg-slate-200 text-amber-600 border-slate-300' 
                  : 'bg-white/10 hover:bg-white/20 text-yellow-300 hover:text-white border-white/10'
              }`}
              title="Thu nhỏ (-)"
            >
              <ZoomOut size={15} />
            </button>
            <button
              onClick={() => {
                if (viewMode3D) {
                  applyCameraPreset('macro');
                } else {
                  setZoom2D(3.5);
                }
                notifyBookmark('🔍 Chế độ Zoom Siêu Cận Cảnh: Soi rõ nét từng ô cờ 3D');
              }}
              className="px-2 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-[11px] shadow-md border border-yellow-300 transition-all active:scale-95 flex items-center gap-1"
              title="Zoom Siêu Cận Cảnh Soi Từng Ô Lá Cờ"
            >
              <Search size={12} className="stroke-[2.5]" />
              <span>Cận Cảnh</span>
            </button>
          </div>

          <div className={`w-[1px] h-6 mx-1 ${isLightTheme ? 'bg-slate-300' : 'bg-white/20'}`} />

          {/* Mouse Mode Toggle: Pan vs Orbit */}
          <button
            onClick={() => setIsPanMode(!isPanMode)}
            className={`px-2 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 shadow-sm ${
              isPanMode
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-blue-400 shadow-md shadow-blue-500/30'
                : isLightTheme
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                : 'bg-white/10 hover:bg-white/20 text-gray-200 border-white/10'
            }`}
            title={isPanMode ? "Đang ở Chế độ Kéo Lướt Bản Đồ (Chuột trái kéo) — Bấm để đổi sang Xoay 3D" : "Đang ở Chế độ Xoay 3D — Bấm để đổi sang Kéo Lướt Bản Đồ"}
          >
            {isPanMode ? <Move size={13} /> : <Compass size={13} />}
            <span>{isPanMode ? '🖐️ Kéo' : '🔄 Xoay'}</span>
          </button>

          <div className={`w-[1px] h-6 mx-1 ${isLightTheme ? 'bg-slate-300' : 'bg-white/20'}`} />

          {/* D-Pad Pan Directions */}
          <div className="grid grid-cols-3 gap-1">
            <div />
            <button
              onClick={() => viewMode3D ? handlePan3D(0, -1) : setPan2D(p => ({ ...p, y: p.y + 40 }))}
              className={`p-1.5 rounded-lg border transition-all active:scale-90 ${
                isLightTheme ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-white/10 hover:bg-white/20 text-gray-200 border-white/10'
              }`}
              title="Kéo Lên Trên"
            >
              <ArrowUp size={13} />
            </button>
            <div />

            <button
              onClick={() => viewMode3D ? handlePan3D(-1, 0) : setPan2D(p => ({ ...p, x: p.x + 40 }))}
              className={`p-1.5 rounded-lg border transition-all active:scale-90 ${
                isLightTheme ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-white/10 hover:bg-white/20 text-gray-200 border-white/10'
              }`}
              title="Kéo Sang Trái"
            >
              <ArrowLeft size={13} />
            </button>
            <button
              onClick={handleResetCamera}
              className="p-1.5 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/40 transition-all active:scale-90 text-[10px] font-black"
              title="Đặt Lại Góc Nhìn Mặc Định"
            >
              🎯
            </button>
            <button
              onClick={() => viewMode3D ? handlePan3D(1, 0) : setPan2D(p => ({ ...p, x: p.x - 40 }))}
              className={`p-1.5 rounded-lg border transition-all active:scale-90 ${
                isLightTheme ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-white/10 hover:bg-white/20 text-gray-200 border-white/10'
              }`}
              title="Kéo Sang Phải"
            >
              <ArrowRight size={13} />
            </button>

            <div />
            <button
              onClick={() => viewMode3D ? handlePan3D(0, 1) : setPan2D(p => ({ ...p, y: p.y - 40 }))}
              className={`p-1.5 rounded-lg border transition-all active:scale-90 ${
                isLightTheme ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-white/10 hover:bg-white/20 text-gray-200 border-white/10'
              }`}
              title="Kéo Xuống Dưới"
            >
              <ArrowDown size={13} />
            </button>
            <div />
          </div>
        </div>

        {/* FLOATING CUSTOM CAMERA BOOKMARKS & PRESET SLOTS TOOLBAR */}
        <div className={`absolute bottom-4 right-4 z-30 flex flex-wrap items-center gap-1.5 p-1.5 backdrop-blur-md border rounded-2xl shadow-2xl transition-colors ${
          isLightTheme ? 'bg-white/90 border-slate-300' : 'bg-black/80 border-white/15'
        }`}>
          {/* 1. Toàn Cảnh Reset Button */}
          <button
            onClick={handleResetOverview}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all flex items-center gap-1.5 ${
              activeBookmarkId === 'overview'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105 border border-cyan-300'
                : isLightTheme
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                : 'bg-white/10 hover:bg-white/20 text-gray-200'
            }`}
            title="Quay về góc nhìn Toàn Cảnh Ban Đầu"
          >
            <span>🏠</span>
            <span>Toàn Cảnh</span>
          </button>

          <div className="w-[1px] h-5 bg-white/20 mx-0.5" />

          {/* 2. Custom Bookmark Slots (Slot 1, Slot 2, Slot 3...) */}
          {customBookmarks.map((bm) => (
            <button
              key={bm.id}
              onClick={() => handleApplyBookmark(bm)}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                activeBookmarkId === bm.id
                  ? 'bg-gradient-to-r from-red-600 via-amber-600 to-yellow-500 text-white shadow-lg shadow-red-500/40 scale-105 border border-yellow-300 font-black'
                  : isLightTheme
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  : 'bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white'
              }`}
              title={`Chuyển đến: ${bm.name} (Bấm để nhảy tới)`}
            >
              <span>{bm.icon || '📍'}</span>
              <span>{bm.shortName || bm.name}</span>
            </button>
          ))}

          <div className="w-[1px] h-5 bg-white/20 mx-0.5" />

          {/* 3. Nút Ghim & Cài Đặt Vị Trí Modal Trigger */}
          <button
            onClick={() => setShowBookmarkManager(prev => !prev)}
            className="px-3 py-1.5 rounded-xl text-[11px] font-black bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/30 flex items-center gap-1.5 transition-all active:scale-95 border border-yellow-200"
            title="Ghim góc nhìn hiện tại hoặc Tùy chỉnh danh sách vị trí camera"
          >
            <BookmarkPlus size={13} className="text-black" />
            <span>Ghim / Cài Đặt Vị Trí</span>
          </button>
        </div>

        {/* NOTIFICATION TOAST FOR CAMERA BOOKMARK ACTIONS */}
        {bookmarkNotification && (
          <div className="absolute bottom-16 right-4 z-40 px-4 py-2 rounded-xl bg-slate-900/95 border-2 border-yellow-400 text-yellow-300 text-xs font-black shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <Sparkles size={14} className="text-yellow-400 animate-spin" />
            <span>{bookmarkNotification}</span>
          </div>
        )}

        {/* INTERACTIVE CUSTOM CAMERA BOOKMARKS MANAGEMENT MODAL */}
        {showBookmarkManager && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-lg bg-gradient-to-b from-slate-900 via-neutral-900 to-black border-2 border-yellow-500/60 rounded-3xl p-5 shadow-2xl text-white relative">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-yellow-500/20 border border-yellow-400/40 text-yellow-400">
                    <Bookmark size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-yellow-300 uppercase tracking-wide">Cài Đặt & Ghim Vị Trí Camera</h3>
                    <p className="text-[11px] text-gray-400">Lưu góc nhìn 3D zoom mặc định để chuyển đổi nhanh 1 chạm</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBookmarkManager(false)}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tips & Instruction Banner */}
              <div className="p-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 mb-4 text-[11px] text-yellow-200/90 leading-relaxed flex items-start gap-2">
                <Sparkles size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <span>
                  💡 <strong>Cách sử dụng:</strong> Bạn tự do dùng chuột kéo, xoay, phóng to/thu nhỏ camera tới bất kỳ tỉnh thành hay vùng bản đồ nào. Sau đó bấm nút <strong>[💾 Ghim góc này]</strong> ở vị trí mong muốn hoặc bấm <strong>[➕ Thêm vị trí mới]</strong> để lưu lại vĩnh viễn!
                </span>
              </div>

              {/* Bookmark Slots List */}
              <div className="space-y-2.5 max-h-64 overflow-y-auto custom-scrollbar pr-1 mb-4">
                {customBookmarks.map((bm) => (
                  <div
                    key={bm.id}
                    className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-400/40 transition-all flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <span className="text-lg select-none">{bm.icon || '📍'}</span>
                      <div className="flex-1 min-w-0">
                        {editingBookmarkId === bm.id ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={editingBookmarkName}
                              onChange={(e) => setEditingBookmarkName(e.target.value)}
                              className="px-2 py-1 text-xs rounded-lg bg-black/60 border border-yellow-400 text-white w-full font-bold focus:outline-none"
                              placeholder="Nhập tên vị trí..."
                              autoFocus
                            />
                            <button
                              onClick={() => handleRenameBookmark(bm.id, editingBookmarkName)}
                              className="p-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                              title="Lưu tên"
                            >
                              <Check size={13} />
                            </button>
                            <button
                              onClick={() => setEditingBookmarkId(null)}
                              className="p-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
                              title="Hủy"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-100 truncate">{bm.name}</span>
                            <button
                              onClick={() => {
                                setEditingBookmarkId(bm.id);
                                setEditingBookmarkName(bm.name);
                              }}
                              className="text-gray-400 hover:text-yellow-300 transition-colors p-0.5"
                              title="Đổi tên vị trí"
                            >
                              <Edit2 size={11} />
                            </button>
                          </div>
                        )}
                        <span className="text-[10px] text-gray-400 font-mono block">
                          Tọa độ: [{bm.pos?.[0]}, {bm.pos?.[1]}, {bm.pos?.[2]}]
                        </span>
                      </div>
                    </div>

                    {/* Actions on this Slot */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {/* Fly To Button */}
                      <button
                        onClick={() => {
                          handleApplyBookmark(bm);
                          setShowBookmarkManager(false);
                        }}
                        className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1 shadow-sm transition-all"
                        title="Bay camera tới vị trí này"
                      >
                        <Crosshair size={11} />
                        <span>Xem</span>
                      </button>

                      {/* Ghim Góc Nhìn Hiện Tại Vào Đây */}
                      <button
                        onClick={() => handleSaveCurrentViewToSlot(bm.id)}
                        className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 shadow-sm transition-all"
                        title="Lấy góc camera & độ zoom bạn đang nhìn hiện tại ghim vào vị trí này"
                      >
                        <Save size={11} />
                        <span>Ghim góc này</span>
                      </button>

                      {/* Delete Slot (if > 1) */}
                      {customBookmarks.length > 1 && (
                        <button
                          onClick={() => handleDeleteBookmark(bm.id)}
                          className="p-1.5 rounded-xl hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                          title="Xóa vị trí này"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Global Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10 gap-2">
                <button
                  onClick={handleRestoreDefaultBookmarks}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw size={13} />
                  <span>Khôi phục 3 mặc định</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddNewBookmarkFromCurrentView}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 shadow-md flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <Plus size={14} />
                    <span>➕ Thêm vị trí mới</span>
                  </button>

                  <button
                    onClick={() => setShowBookmarkManager(false)}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
