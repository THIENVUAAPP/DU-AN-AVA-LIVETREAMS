import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { io } from 'socket.io-client';
import { 
  Play, Pause, RotateCcw, Shield, Sparkles, Trophy, Flame, 
  MapPin, Flag, Eye, EyeOff, Volume2, VolumeX, Maximize2, Zap, Star,
  Compass, Award, ChevronRight, Layers, CheckCircle2, AlertTriangle, 
  MonitorPlay, Sun, Moon, Move, ZoomIn, ZoomOut, Search, Globe, Navigation, Compass as CompassIcon,
  Sliders, Settings, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RefreshCw,
  Bookmark, BookmarkPlus, BookmarkCheck, Edit2, Trash2, Plus, Save, Check, X, Crosshair,
  Crown, Medal, Music, Mic, Clock, Smartphone, Gift as GiftIcon
} from 'lucide-react';
import bandoEngine, { getHonorTier, COUNTRY_PRESETS } from './bandoGameEngine';
import bandoAudio from './bandoAudioEngine';
import { mapVoiceEngine } from './gameVoiceEngine';
import { getGameTranslation } from './gameTranslations';
import GameBanDoAdminModal from './GameBanDoAdminModal';
import LiveGiftMarqueeTicker from './LiveGiftMarqueeTicker';
import LiveGiftConfigModal from './LiveGiftConfigModal';


// Ease helpers
function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Function tạo Texture Quốc Kỳ siêu sắc nét, rực rỡ, đẳng cấp cho từng ô pixel/voxel 3D
function createCountryFlagTexture(countryCode = 'vietnam') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (countryCode === 'japan') {
    // 🇯🇵 Nhật Bản: Nền trắng ngà siêu nét + Viền khối + Mặt trời đỏ rực rỡ
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 10;
    ctx.strokeRect(6, 6, 500, 500);
    ctx.fillStyle = '#BC002D';
    ctx.beginPath();
    ctx.arc(256, 256, 150, 0, Math.PI * 2);
    ctx.fill();
  } else if (countryCode === 'korea') {
    // 🇰🇷 Hàn Quốc: Nền trắng + Âm Dương Thái Cực
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 10;
    ctx.strokeRect(6, 6, 500, 500);
    ctx.fillStyle = '#CD2E3A';
    ctx.beginPath();
    ctx.arc(256, 256, 144, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#0047A0';
    ctx.beginPath();
    ctx.arc(256, 256, 144, 0, Math.PI);
    ctx.fill();
  } else if (countryCode === 'usa') {
    // 🇺🇸 Mỹ: Sọc đỏ trắng + Góc xanh sao
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = '#B22234';
    for (let s = 0; s < 7; s++) {
      ctx.fillRect(0, s * 73, 512, 36.5);
    }
    ctx.fillStyle = '#3C3B6E';
    ctx.fillRect(0, 0, 220, 220);
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(110, 110, 50, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // 🇻🇳 VIỆT NAM (Mặc định): Nền đỏ tươi cờ Tổ Quốc chuẩn sắc nét, KHÔNG phát sáng chói lóa
    ctx.fillStyle = '#DA251D'; // Đỏ tươi quốc kỳ Việt Nam chuẩn
    ctx.fillRect(0, 0, 512, 512);

    // Viền khối trang nhã, sắc nét
    ctx.strokeStyle = '#B91C1C';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, 506, 506);

    // Ngôi sao vàng 5 cánh chuẩn sắc nét, tỷ lệ vàng cân đối (KHÔNG phát sáng chói lóa, KHÔNG hào quang làm mờ)
    const cx = 256, cy = 256, outerR = 175, innerR = 70;
    
    ctx.fillStyle = '#FFFF00'; // Vàng tươi chuẩn sắc nét
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const rotOuter = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const x1 = cx + Math.cos(rotOuter) * outerR;
      const y1 = cy + Math.sin(rotOuter) * outerR;
      if (i === 0) ctx.moveTo(x1, y1);
      else ctx.lineTo(x1, y1);

      const rotInner = rotOuter + Math.PI / 5;
      const x2 = cx + Math.cos(rotInner) * innerR;
      const y2 = cy + Math.sin(rotInner) * innerR;
      ctx.lineTo(x2, y2);
    }
    ctx.closePath();
    ctx.fill();

    // Viền cánh sao vàng kim sắc nét giúp hiển thị rõ ràng từ mọi khoảng cách
    ctx.strokeStyle = '#EAB308';
    ctx.lineWidth = 4;
    ctx.stroke();
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

// Function tạo Texture Mặt Bên của Khối Cờ (Đỏ thắm quốc kỳ sang trọng, KHÔNG méo ngôi sao)
function createFlagSideTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 128, 0);
  grad.addColorStop(0, '#A81812');
  grad.addColorStop(0.15, '#DA251D');
  grad.addColorStop(0.85, '#DA251D');
  grad.addColorStop(1, '#8B120C');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 512);

  // Viền vàng kim ở đỉnh và đáy cột
  ctx.fillStyle = '#EAB308';
  ctx.fillRect(0, 0, 128, 6);
  ctx.fillRect(0, 506, 128, 6);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

// Function tạo Texture Vùng Đất / Khối Nền Lãnh Thổ CHƯA CẮM CỜ (Tối hoặc sáng dịu, ZERO cờ đỏ/ngôi sao, chuẩn địa hình 3D cao cấp)
function createTerrainTexture(isLightTheme = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Bạch kim / Trắng ngọc trai Platinum Marble sang trọng, siêu sắc nét, rõ ràng trên nền tối
  const bgGrad = ctx.createRadialGradient(256, 256, 20, 256, 256, 360);
  bgGrad.addColorStop(0, '#FFFFFF');    // Trắng tinh khiết tâm ô
  bgGrad.addColorStop(0.5, '#F8FAFC');  // Trắng ngọc sáng
  bgGrad.addColorStop(0.85, '#E2E8F0'); // Bạch kim viền ngoài
  bgGrad.addColorStop(1, '#CBD5E1');    // Shadow viền 3D mềm mại
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 512);

  // Viền khối 3D ánh bạc tinh tế
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 12;
  ctx.strokeRect(6, 6, 500, 500);

  // Viền ánh hào quang bạch kim nổi khối
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.lineWidth = 6;
  ctx.strokeRect(16, 16, 480, 480);

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

// Khởi tạo danh sách huy hiệu cắm cờ rỗng sạch cho chiến dịch chạy thật
const INITIAL_DEMO_BADGES = [];

export default function GameBanDoVietNam({
  isPopout = false,
  onOpenAdmin = null,
  externalLiveEvent = null,
  aspectRatio: propAspectRatio = null,
  onToggleAspectRatio = null,
  isDarkMode = true,
}) {
  const [gameState, setGameState] = useState(() => bandoEngine.state);
  const [forceRenderSeq, setForceRenderSeq] = useState(0);
  const [viewMode3D, setViewMode3D] = useState(true);
  const [isAutoTesting, setIsAutoTesting] = useState(false);
  const [autoTestStep, setAutoTestStep] = useState(0);
  const [showSidePanels, setShowSidePanels] = useState(true);
  const [activeCameraPreset, setActiveCameraPreset] = useState('overview');
  const [autoRotate, setAutoRotate] = useState(() => bandoEngine.state.autoRotate || false);
  const autoRotateRef = useRef(autoRotate);
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);
  const [isPanMode, setIsPanMode] = useState(false);
  const [recentClaimBadges, setRecentClaimBadges] = useState([]);
  const [victoryTab, setVictoryTab] = useState('champion'); // 'champion' | 'top30'
  const [isAuto247, setIsAuto247] = useState(() => bandoEngine.isAuto247Running);
  const [isBgmLoop, setIsBgmLoop] = useState(() => bandoAudio.isBgmLoop);
  const [isBgmPlaying, setIsBgmPlaying] = useState(() => bandoAudio.bgmPlaying);
  const [isSfxMuted, setIsSfxMuted] = useState(() => bandoAudio.isSfxMuted);
  const [isVoiceMuted, setIsVoiceMuted] = useState(() => bandoAudio.isVoiceMuted);
  const [tiktokStatus, setTiktokStatus] = useState({ connected: false, username: '', simulationMode: false });
  const [bgmTimerMode, setBgmTimerMode] = useState(() => bandoAudio.bgmTimerMode || '24/7');
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [bgmVolume, setBgmVolumeState] = useState(() => bandoAudio.bgmVolume);
  const [sfxVolume, setSfxVolumeState] = useState(() => bandoAudio.sfxVolume);
  const [voiceVolume, setVoiceVolumeState] = useState(() => bandoAudio.voiceVolume ?? 1.0);
  const [isLiveCleanMode, setIsLiveCleanMode] = useState(isPopout);
  const [isUltraCleanCornerMode, setIsUltraCleanCornerMode] = useState(() => {
    try {
      return localStorage.getItem('avalive_bando_ultra_clean') === 'true';
    } catch {
      return false;
    }
  });

  const toggleUltraCleanCornerMode = () => {
    setIsUltraCleanCornerMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem('avalive_bando_ultra_clean', String(next));
      } catch {}
      return next;
    });
  };
  const [internalAspectRatio, setInternalAspectRatio] = useState(() => {
    try {
      return localStorage.getItem('avalive_map_aspect_ratio') || '16:9';
    } catch (e) {
      return '16:9';
    }
  });

  const aspectRatio = propAspectRatio || internalAspectRatio;

  const handleToggleAspectRatio = () => {
    if (onToggleAspectRatio) {
      onToggleAspectRatio();
    } else {
      const nextAspect = aspectRatio === '9:16' ? '16:9' : '9:16';
      setInternalAspectRatio(nextAspect);
      try {
        localStorage.setItem('avalive_map_aspect_ratio', nextAspect);
      } catch (e) {}
    }
  };
  const isLightTheme = isDarkMode !== undefined ? !isDarkMode : (gameState.settings?.theme === 'light');

  // Đồng bộ isLiveCleanMode khi isPopout thay đổi
  useEffect(() => {
    if (isPopout) setIsLiveCleanMode(true);
  }, [isPopout]);

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
  const [showGiftConfigModal, setShowGiftConfigModal] = useState(false);

  // Xử lý khi bấm vào thẻ quà trên Bảng điện cuộn (Test nhanh cắm cờ)
  const handleTestGiftMarquee = useCallback((gift) => {
    bandoEngine.processGift({
      userId: 'host_streamer_test',
      nickname: 'Streamer Host',
      giftId: gift.id,
      giftName: gift.name,
      diamondCount: gift.priceToken || 1,
      repeatCount: 1,
      regionTarget: gift.regionTarget
    });
  }, []);

  // Draggable & Resizable HUDs State (Có thể thu nhỏ / phóng to và di chuyển tùy ý trên màn hình)
  const [isLeaderboardMinimized, setIsLeaderboardMinimized] = useState(false);
  const [isLeaderboardClosed, setIsLeaderboardClosed] = useState(false);
  const [leaderboardScale, setLeaderboardScale] = useState(() => {
    try {
      const saved = localStorage.getItem('bando_hud_leaderboard_scale');
      if (saved) return Math.max(0.5, Math.min(2.0, parseFloat(saved)));
    } catch (e) {}
    return 1.0;
  });
  const [leaderboardPos, setLeaderboardPos] = useState(() => {
    try {
      const saved = localStorage.getItem('bando_hud_leaderboard_pos');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { x: 10, y: 70 };
  });

  const handleLeaderboardScaleChange = (delta) => {
    setLeaderboardScale(prev => {
      const next = Math.round(Math.max(0.5, Math.min(2.0, prev + delta)) * 10) / 10;
      try { localStorage.setItem('bando_hud_leaderboard_scale', next.toString()); } catch (err) {}
      return next;
    });
  };

  const isLbResizingRef = useRef(false);
  const lbResizeStartRef = useRef({ startX: 0, startScale: 1.0 });

  const handleLbCornerResizeStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    isLbResizingRef.current = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    lbResizeStartRef.current = {
      startX: clientX,
      startScale: leaderboardScale
    };

    const handleResizeMove = (moveEvt) => {
      if (!isLbResizingRef.current) return;
      const currentX = moveEvt.touches ? moveEvt.touches[0].clientX : moveEvt.clientX;
      const diffX = currentX - lbResizeStartRef.current.startX;
      const newScale = Math.max(0.5, Math.min(2.0, lbResizeStartRef.current.startScale + diffX * 0.005));
      const rounded = Math.round(newScale * 100) / 100;
      setLeaderboardScale(rounded);
    };

    const handleResizeEnd = () => {
      if (!isLbResizingRef.current) return;
      isLbResizingRef.current = false;
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', handleResizeEnd);
      window.removeEventListener('touchmove', handleResizeMove);
      window.removeEventListener('touchend', handleResizeEnd);
      try {
        localStorage.setItem('bando_hud_leaderboard_scale', leaderboardScale.toString());
      } catch (e) {}
    };

    window.addEventListener('mousemove', handleResizeMove);
    window.addEventListener('mouseup', handleResizeEnd);
    window.addEventListener('touchmove', handleResizeMove, { passive: false });
    window.addEventListener('touchend', handleResizeEnd);
  };

  const draggingHudRef = useRef(null); // 'leaderboard' | 'gift' | null
  const dragOffsetRef = useRef({ x: 0, y: 0 });


  // Camera Zoom In / Zoom Out / Pan helpers
  const handleZoomIn = useCallback(() => {
    if (viewMode3D) {
      const state = threeStateRef.current;
      if (state.camera && state.controls) {
        state.camera.position.lerp(state.controls.target, 0.25);
        state.controls.update();
      }
    } else {
      setZoom2D(prev => Math.min(prev * 1.25, 6.0));
    }
  }, [viewMode3D]);

  const handleZoomOut = useCallback(() => {
    if (viewMode3D) {
      const state = threeStateRef.current;
      if (state.camera && state.controls) {
        const offset = state.camera.position.clone().sub(state.controls.target);
        offset.multiplyScalar(1.3);
        state.camera.position.copy(state.controls.target).add(offset);
        state.controls.update();
      }
    } else {
      setZoom2D(prev => Math.max(prev / 1.25, 0.3));
    }
  }, [viewMode3D]);

  const handlePanStep = useCallback((dx, dz) => {
    if (viewMode3D) {
      const state = threeStateRef.current;
      if (state.camera && state.controls) {
        state.camera.position.x += dx;
        state.camera.position.z += dz;
        state.controls.target.x += dx;
        state.controls.target.z += dz;
        state.controls.update();
      }
    } else {
      setPan2D(prev => ({ x: prev.x - dx * 2, y: prev.y - dz * 2 }));
    }
  }, [viewMode3D]);

  const handleHudDragStart = (e, hudType) => {
    e.stopPropagation();
    draggingHudRef.current = hudType;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const parentEl = e.currentTarget.parentElement;
    if (parentEl) {
      const rect = parentEl.getBoundingClientRect();
      dragOffsetRef.current = {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!draggingHudRef.current || !containerRef.current) return;
      const stageRect = containerRef.current.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      let newX = clientX - stageRect.left - dragOffsetRef.current.x;
      let newY = clientY - stageRect.top - dragOffsetRef.current.y;

      newX = Math.max(5, Math.min(newX, stageRect.width - 70));
      newY = Math.max(5, Math.min(newY, stageRect.height - 70));

      if (draggingHudRef.current === 'leaderboard') {
        const newPos = { x: Math.round(newX), y: Math.round(newY) };
        setLeaderboardPos(newPos);
        try { localStorage.setItem('bando_hud_leaderboard_pos', JSON.stringify(newPos)); } catch (err) {}
      } else if (draggingHudRef.current === 'gift') {
        const newPos = { x: Math.round(newX), y: Math.round(newY), right: null };
        setGiftHudPos(newPos);
        try { localStorage.setItem('bando_hud_gift_pos', JSON.stringify(newPos)); } catch (err) {}
      }
    };

    const handlePointerUp = () => {
      draggingHudRef.current = null;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove);
    window.addEventListener('touchend', handlePointerUp);
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, []);

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
    terrainMesh: null,
    flagMesh: null,
    terrainMat: null,
    flagMat: null,
    bannerMesh: null,
    dummy: new THREE.Object3D(),
    colorObj: new THREE.Color(),
    disposed: false,
    animFrameId: null,
    tween: null,
    tempVec: new THREE.Vector3(),
  });
  const lastFocalKeyRef = useRef(null);

  // Dynamic Mouse & Touch Controls Mode (Orbit 3D vs Pan Drag)
  useEffect(() => {
    const state = threeStateRef.current;
    if (state.controls) {
      state.controls.mouseButtons = {
        LEFT: isPanMode ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: isPanMode ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN,
      };
      state.controls.touches = {
        ONE: isPanMode ? THREE.TOUCH.PAN : THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN,
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
    const presets = getCameraPresetsForCountry();
    const overviewPos = presets.overview?.pos || (aspectRatio === '9:16' ? [0, 480, 250] : [0, 220, 240]);
    const overviewTarget = presets.overview?.target || (aspectRatio === '9:16' ? [0, -10, 10] : [0, 0, 10]);
    state.tween = {
      from: state.camera.position.clone(),
      to: new THREE.Vector3(...overviewPos),
      fromTarget: state.controls.target.clone(),
      toTarget: new THREE.Vector3(...overviewTarget),
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

  const handleSaveCurrentCameraAsNewBookmark = handleAddNewBookmarkFromCurrentView;

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

  // Subscribe engine state & gift placements (with RequestAnimationFrame Throttle to fix lag)
  useEffect(() => {
    let pendingState = null;
    let pendingBadges = [];
    let rAF_ID = null;

    const unsub = bandoEngine.subscribe((newState, lastEvt) => {
      pendingState = newState;
      setIsAutoTesting(bandoEngine.isAutoTesting);
      setIsAuto247(bandoEngine.isAuto247Running);

      // Khi reset vòng chơi mới, dọn sạch toàn bộ huy hiệu cũ trên bản đồ
      if (lastEvt && (lastEvt.type === 'ROUND_RESET' || lastEvt.type === 'RESET')) {
        pendingBadges = [];
        setRecentClaimBadges([]);
      }

      // Xử lý sự kiện cắm ô cờ
      if (lastEvt && (lastEvt.type === 'GIFT_PLACED' || lastEvt.type === 'GIFT')) {
        const user = lastEvt.user;
        const count = lastEvt.totalCells || lastEvt.claimed || lastEvt.count || 1;
        const flag = currentCountry?.flag || '🇻🇳';
        const giftName = lastEvt.giftName || 'Ô Quốc Kỳ';

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

        const defaultAvatar = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(user?.username || user?.id || 'viewer')}`;
        const newBadge = {
          id: `badge_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          userId: user?.id ? (user.id.startsWith('@') ? user.id : `@${user.id}`) : '@tiktok_vip',
          username: user?.username || 'Chiến Binh Yêu Nước',
          avatar: user?.avatar || defaultAvatar,
          flag,
          count,
          giftName,
          wx,
          wy: 5.5,
          wz,
          timestamp: Date.now(),
        };

        pendingBadges.push(newBadge);
      }

      if (!rAF_ID) {
        rAF_ID = setTimeout(() => {
          if (pendingState) {
            setGameState({ ...pendingState });
            if (pendingState.autoRotate !== undefined) setAutoRotate(pendingState.autoRotate);
            if (pendingState.cameraPreset) setActiveCameraPreset(pendingState.cameraPreset);
            pendingState = null;
          }
          if (pendingBadges.length > 0) {
            const newB = [...pendingBadges];
            setRecentClaimBadges(prev => [...newB, ...prev].slice(0, 14));
            pendingBadges = [];
          }
          rAF_ID = null;
        }, 150); // Batch update every 150ms -> Giảm tần suất render từ 60fps xuống 6fps để ko làm lag 3D
      }
    });

    return () => {
      unsub();
      if (rAF_ID) clearTimeout(rAF_ID);
    };
  }, [currentCountry]);

  // Tự động đóng màn hình vinh danh & Bắt đầu trận mới sau đúng 4 giây khi chiến thắng
  useEffect(() => {
    if (gameState.status !== 'victory') return;
    const timer = setTimeout(() => {
      if (bandoEngine.state.status === 'victory') {
        bandoEngine.resetRound();
        if (bandoEngine.isAuto247Running || bandoEngine.state.autoLoop247) {
          setTimeout(() => {
            if (bandoEngine.state.status === 'playing') {
              bandoEngine.startAuto247Loop();
            }
          }, 300);
        }
      }
    }, 4200);
    return () => clearTimeout(timer);
  }, [gameState.status]);

  // Handle external TikTok events if passed from parent
  useEffect(() => {
    if (!externalLiveEvent) return;
    const { type, data } = externalLiveEvent;
    if (type === 'GIFT' && data) {
      bandoEngine.processGift({
        giftId: data.giftId || 'rose',
        giftName: data.giftName || data.name || '',
        diamondCount: data.diamondCount || 1,
        count: data.count || data.repeatCount || 1,
        userId: data.userId || 'tiktok_guest',
        username: data.username || data.nickname || 'Khách Live',
        avatar: data.avatar || data.profilePictureUrl || '',
        regionTarget: data.regionTarget || null
      });
    } else if (type === 'COMMENT' && data) {
      bandoAudio.unlock();
      const text = data.comment || data.text || '';
      const author = data.username || data.nickname || 'Khán Giả';
      bandoEngine.processComment(text, {
        id: data.userId || 'chat_user',
        username: author,
        avatar: data.avatar || data.profilePictureUrl || ''
      });
      try {
        mapVoiceEngine.handleUserComment(text, author);
      } catch (e) {}
    } else if (type === 'RESET') {
      bandoEngine.resetRound();
    } else if (type === 'BOSS') {
      bandoEngine.triggerBossEvent();
    } else if (type === 'MISSION') {
      bandoEngine.triggerMission();
    }
  }, [externalLiveEvent]);

  // Direct Realtime Socket.io listener for TikTok gifts across all windows / overlays / popouts
  useEffect(() => {
    let socket = null;
    const getSocketTargetUrl = () => {
      if (typeof window === 'undefined') return 'http://localhost:3001';
      const customUrl = localStorage.getItem('aidol_backend_url');
      if (customUrl && customUrl.startsWith('http')) return customUrl;
      if (window.location.port === '5173') {
        return window.location.protocol + '//' + window.location.hostname + ':3001';
      }
      return window.location.origin;
    };

    const targetUrl = getSocketTargetUrl();

    try {
      socket = io(targetUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        timeout: 10000
      });

      socket.on('connect', () => {
        console.log('[GameBanDo] ✅ Socket connected:', socket.id);
      });

      socket.on('tiktok_connected', (data) => {
        setTiktokStatus({ connected: true, username: data?.username || '', simulationMode: false });
        console.log('[GameBanDo] ✅ TikTok connected:', data?.username);
      });

      socket.on('tiktok_status', (data) => {
        setTiktokStatus(prev => ({ ...prev, ...data }));
      });

      // Khi backend yêu cầu reconnect TikTok (stream bị rớt)
      socket.on('REQUEST_RECONNECT_TIKTOK', (data) => {
        const savedTiktokId = localStorage.getItem('aidol_tiktok_id') || data?.username;
        if (savedTiktokId) {
          console.log('[GameBanDo] 🔄 Auto-reconnecting TikTok:', savedTiktokId);
          socket.emit('connect_tiktok', savedTiktokId);
        }
      });

      const processedGiftKeys = new Set();
      const handleIncomingGift = (data) => {
        if (!data) return;
        bandoAudio.unlock();
        const eventKey = `${data.userId || data.uniqueId}_${data.giftId || data.giftName}_${data.count || data.repeatCount}_${data.timestamp || ''}`;
        if (data.timestamp && processedGiftKeys.has(eventKey)) return;
        if (data.timestamp) {
          processedGiftKeys.add(eventKey);
          if (processedGiftKeys.size > 200) processedGiftKeys.clear();
        }

        bandoEngine.processGift({
          giftId: data.giftId,
          giftName: data.giftName,
          count: data.repeatCount || data.count || 1,
          diamondCount: data.diamondCount || 1,
          userId: data.userId || data.uniqueId || 'tiktok_viewer',
          username: data.nickname || data.uniqueId || data.username || 'Khách Live',
          avatar: data.profilePictureUrl || data.avatar || '',
          regionTarget: data.regionTarget || null
        });
      };

      // Không đăng ký lại listener trùng lặp

      socket.on('bando_event', (evt) => {
        if (evt && evt.type === 'GIFT' && evt.data) {
          handleIncomingGift(evt.data);
        } else if (evt && evt.type === 'COMMENT' && evt.data) {
          bandoAudio.unlock();
          const text = evt.data.comment || evt.data.text || '';
          const author = evt.data.nickname || evt.data.username || 'Khán Giả';
          bandoEngine.processComment(text, {
            id: evt.data.userId || 'chat_user',
            username: author,
            avatar: evt.data.avatar || ''
          });
        }
      });
      // Bỏ qua các sự kiện tiktok_gift, bando_event, LIVE_EVENT trùng lặp ở đây vì DesktopAppUI.jsx và GameBanDoOverlay.jsx đã lắng nghe và truyền xuống thông qua externalLiveEvent hoặc bandoEngine.processGift trực tiếp. Việc lắng nghe trực tiếp ở đây dẫn đến xử lý quà tặng 2-3 lần cho 1 phần quà.

      socket.on('tiktok_chat', (data) => {
        if (!data) return;
        bandoAudio.unlock();
        const text = data.comment || data.text || '';
        const author = data.nickname || data.uniqueId || data.username || 'Khán Giả';
        bandoEngine.processComment(text, {
          id: data.userId || data.uniqueId || 'chat_user',
          username: author,
          avatar: data.profilePictureUrl || ''
        });
      });
    } catch (e) {
      console.warn('Socket connection error:', e);
    }

    // Lắng nghe thêm CustomEvent từ window / iframe / Electron
    const handleWindowGift = (e) => {
      if (e.detail) {
        bandoEngine.processGift(e.detail);
      }
    };
    window.addEventListener('avalive_tiktok_gift', handleWindowGift);

    return () => {
      if (socket) socket.disconnect();
      window.removeEventListener('avalive_tiktok_gift', handleWindowGift);
      window.removeEventListener('tiktok_gift', handleWindowGift);
    };
  }, []);

  // Unlock Web Audio and Auto-Play BGM on first user interaction on Live
  const handleUserGesture = useCallback(() => {
    bandoAudio.unlock();
  }, []);

  useEffect(() => {
    const handleFirstGesture = () => {
      bandoAudio.unlock();
    };
    const handleBgmStatus = (e) => {
      if (e.detail) {
        if (e.detail.playing !== undefined) setIsBgmPlaying(e.detail.playing);
        if (e.detail.isSfxMuted !== undefined) setIsSfxMuted(e.detail.isSfxMuted);
        if (e.detail.isVoiceMuted !== undefined) setIsVoiceMuted(e.detail.isVoiceMuted);
        if (e.detail.bgmVolume !== undefined) setBgmVolumeState(e.detail.bgmVolume);
        if (e.detail.sfxVolume !== undefined) setSfxVolumeState(e.detail.sfxVolume);
        if (e.detail.voiceVolume !== undefined) setVoiceVolumeState(e.detail.voiceVolume);
      }
    };

    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    window.addEventListener('bando-bgm-status', handleBgmStatus);

    const handleTriggerDemo = () => {
      const gifts = bandoEngine.state.gifts || DEFAULT_MAP_GIFTS;
      const randGift = gifts[Math.floor(Math.random() * gifts.length)] || DEFAULT_MAP_GIFTS[0];
      const randUser = MOCK_WARRIORS_POOL[Math.floor(Math.random() * MOCK_WARRIORS_POOL.length)];
      
      bandoAudio.unlock();
      bandoEngine.processGift(randGift.id, 1, randUser);
    };

    window.addEventListener('bando-trigger-demo', handleTriggerDemo);

    const handleResumeAll = () => {
      bandoAudio.unlock();
      bandoAudio.playBgmOnLive();
      mapVoiceEngine.startPeriodicCommentary(true);
    };
    window.addEventListener('avalive_resume_all', handleResumeAll);

    const handleResetLeaderboard = () => {
      bandoEngine.resetLeaderboard();
    };
    window.addEventListener('avalive_reset_leaderboard', handleResetLeaderboard);

    const handleEmergencyStop = () => {
      bandoAudio.stopAll();
      mapVoiceEngine.stopAll();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (socket) {
        socket.emit('toggle_simulation', false);
      }
    };
    window.addEventListener('avalive_emergency_stop_all', handleEmergencyStop);

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('bando-bgm-status', handleBgmStatus);
      window.removeEventListener('bando-trigger-demo', handleTriggerDemo);
      window.removeEventListener('avalive_resume_all', handleResumeAll);
      window.removeEventListener('avalive_reset_leaderboard', handleResetLeaderboard);
      window.removeEventListener('avalive_emergency_stop_all', handleEmergencyStop);
    };
  }, []);

  // Camera preset positions based on active country & aspect ratio
  const getCameraPresetsForCountry = useCallback(() => {
    const isVN = gameState.selectedCountry === 'vietnam';
    const isVertical = aspectRatio === '9:16';
    const overviewPos = isVertical ? [0, 480, 250] : [0, 220, 240];
    const overviewTarget = isVertical ? [0, -10, 10] : [0, 0, 10];
    return {
      overview: { name: 'Toàn Cảnh', icon: '🌐', pos: overviewPos, target: overviewTarget },
      north: { name: isVN ? 'Miền Bắc & Hà Nội' : 'Vùng Phía Bắc', icon: '🏛️', pos: isVertical ? [-49, 150, -60] : [-49, 110, -85], target: [-49.2, 0, -123.0] },
      central: { name: isVN ? 'Miền Trung & Huế' : 'Khu Vực Trung Tâm', icon: '🏖️', pos: isVertical ? [15, 160, 40] : [15, 120, 30], target: [-4.7, 0, 4.5] },
      south: { name: isVN ? 'Miền Nam & TP.HCM' : 'Vùng Phía Nam', icon: '🏙️', pos: isVertical ? [-27, 150, 170] : [-27, 110, 155], target: [-27.6, 0, 126.4] },
      tip_camau: { name: isVN ? 'Mũi Cà Mau (Cực Nam)' : 'Cực Nam', icon: '⛵', pos: isVertical ? [-63, 110, 210] : [-63, 75, 195], target: [-63.1, 0, 161.9] },
      islands: { name: isVN ? 'Hoàng Sa & Trường Sa' : 'Hải Đảo', icon: '🏝️', pos: isVertical ? [75, 150, 30] : [75, 110, 20], target: [65.6, 0, -34.4] },
      macro: { name: 'Cận Cảnh Từng Ô Cờ', icon: '🔍', pos: [0, 20, 20], target: [0, 0, 0] },
    };
  }, [gameState.selectedCountry, aspectRatio]);

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
    const isLightTheme = isDarkMode !== undefined ? !isDarkMode : (gameState.settings?.theme === 'light');

    // Scene with theme-responsive background - KHÔNG DÙNG FOG ĐẬM LÀM ĐEN BẢN ĐỒ
    const scene = new THREE.Scene();
    state.scene = scene;
    if (isPopout) {
      scene.background = null;
    } else {
      const bgColor = isLightTheme ? 0xf8fafc : 0x070b14;
      scene.background = new THREE.Color(bgColor);
      // Dùng Fog rất nhẹ ở khoảng cách xa (1200 -> 4000) để không làm tối các ô voxel bản đồ
      scene.fog = new THREE.Fog(bgColor, 1200, 4500);
    }

    // Camera căn chỉnh chuẩn xác cho tỷ lệ 9:16 và 16:9 bao quát trọn vẹn dải đất hình chữ S
    const isVerticalAspect = aspectRatio === '9:16' || width < height;
    const fov = isVerticalAspect ? 50 : 48;
    const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 5000);
    if (isVerticalAspect) {
      camera.position.set(0, 480, 250);
      camera.lookAt(0, -10, 10);
    } else {
      camera.position.set(0, 220, 240);
      camera.lookAt(0, 0, 10);
    }
    state.camera = camera;

    // Renderer with balanced tone mapping & optimized 60fps performance for live streaming
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
      powerPreference: 'high-performance',
      precision: 'mediump'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.shadowMap.enabled = false; // Tắt tính toán bóng đổ cho 15,000+ voxel để giữ 60fps siêu mượt khi phát Live
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = (gameState.settings.brightness || 1.25) * (isLightTheme ? 1.05 : 1.0);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    state.renderer = renderer;

    // Controls with Ultra-close Zoom (minDistance = 0.5) and Wide Pan
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2.02;
    controls.minDistance = 0.5;
    controls.maxDistance = 1500;
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
    controls.touches = {
      ONE: isPanMode ? THREE.TOUCH.PAN : THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };
    controls.autoRotate = !isPopout && autoRotate;
    controls.autoRotateSpeed = 0.8;
    
    // Tự do tương tác: Khi admin/streamer chủ động rê/xoay/zoom chuột, nhường quyền tức thì, không giằng co camera
    controls.addEventListener('start', () => {
      state.tween = null;
    });
    state.controls = controls;

    // Balanced Lighting: Ánh sáng mạnh mẽ, chiếu sáng rực rỡ toàn bộ lãnh thổ quốc gia
    const brightness = gameState.settings.brightness || 1.25;
    const ambientLight = new THREE.AmbientLight(0xffffff, (isLightTheme ? 1.5 : 1.4) * brightness);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x334155, 0.9 * brightness);
    hemiLight.position.set(0, 350, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfffaee, (isLightTheme ? 1.5 : 1.45) * brightness);
    dirLight.position.set(120, 340, 160);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(isLightTheme ? 0x0284c7 : 0x38bdf8, (isLightTheme ? 1.1 : 1.0) * brightness);
    rimLight.position.set(-150, 200, -120);
    scene.add(rimLight);

    const pLight1 = new THREE.PointLight(0xffd700, 1.4 * brightness, 400);
    pLight1.position.set(-49.2, 75, -123.0);
    scene.add(pLight1);

    const pLight2 = new THREE.PointLight(0x38bdf8, 1.2 * brightness, 350);
    pLight2.position.set(-27.6, 70, 126.4);
    scene.add(pLight2);

    const pLight3 = new THREE.PointLight(0xf43f5e, 1.4 * brightness, 400);
    pLight3.position.set(65.6, 75, -34.4);
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

    // Instanced Meshes: Phân tách rõ ràng giữa Vùng Đất Nền Lãnh Thổ (Terrain Base) & Ô Cờ Quốc Kỳ Đã Cắm (Claimed Flags)
    const maskData = bandoEngine.maskData;
    const cells = maskData?.cells || [];
    const count = cells.length > 0 ? cells.length : 15125;
    const flagTexture = createCountryFlagTexture(gameState.selectedCountry || 'vietnam');
    const terrainTexture = createTerrainTexture(isLightTheme);
    state.flagTexture = flagTexture;
    state.terrainTexture = terrainTexture;

    // Tự động điều chỉnh kích thước ô voxel để liền mạch 100%, tuyệt đối không để khe hở hay lỗ thủng
    const cellDim = Math.min(2.5, Math.max(0.98, 1.05 * Math.sqrt(15125 / count)));
    state.cellDim = cellDim;
    const boxGeo = new THREE.BoxGeometry(cellDim, 1, cellDim);

    // 1. Mesh Vùng Đất Nền Chưa Cắm (Tối/Sáng dịu, ZERO cờ đỏ/ngôi sao)
    const terrainMat = new THREE.MeshLambertMaterial({
      map: terrainTexture,
      color: 0xffffff,
      reflectivity: 0.10,
    });
    state.terrainMat = terrainMat;
    const terrainMesh = new THREE.InstancedMesh(boxGeo, terrainMat, count);
    terrainMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    terrainMesh.castShadow = true;
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);
    state.terrainMesh = terrainMesh;

    // 2. Mesh Ô Cờ Quốc Kỳ Đã Cắm (Mặt đỉnh có Ngôi Sao Vàng chuẩn 1:1 KHÔNG méo, các mặt bên là trụ đỏ thắm sang trọng)
    const flagTopMat = new THREE.MeshStandardMaterial({
      map: flagTexture,
      roughness: 0.20,
      metalness: 0.02,
      emissive: new THREE.Color(0x280606),
      emissiveIntensity: 0.35,
    });

    const flagSideTexture = createFlagSideTexture();
    state.flagSideTexture = flagSideTexture;
    const flagSideMat = new THREE.MeshStandardMaterial({
      map: flagSideTexture,
      roughness: 0.24,
      metalness: 0.02,
      emissive: new THREE.Color(0x280606),
      emissiveIntensity: 0.30,
    });

    // BoxGeometry groups: 0:+X, 1:-X, 2:+Y(Top), 3:-Y(Bottom), 4:+Z, 5:-Z
    const flagMaterials = [
      flagSideMat, // 0: +X Right
      flagSideMat, // 1: -X Left
      flagTopMat,  // 2: +Y Top (Ngôi sao vàng 5 cánh tỷ lệ 1:1 chuẩn xác, hoàn hảo từ mọi góc nhìn)
      flagSideMat, // 3: -Y Bottom
      flagSideMat, // 4: +Z Front
      flagSideMat  // 5: -Z Back
    ];

    state.flagMat = flagTopMat;
    state.flagSideMat = flagSideMat;
    state.flagMaterials = flagMaterials;
    state.currentCountry = gameState.selectedCountry || 'vietnam';
    const flagMesh = new THREE.InstancedMesh(boxGeo, flagMaterials, count);
    flagMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    flagMesh.castShadow = true;
    flagMesh.receiveShadow = true;
    scene.add(flagMesh);
    state.flagMesh = flagMesh;
    state.instancedMesh = terrainMesh; // Giữ để tương thích ngược

    // Instanced Mesh for 3D Banner Title Flag Cells
    const bannerCells = bandoEngine.state.bannerCells || [];
    const bannerCount = bannerCells.length;
    let bannerMesh = null;
    let bannerBoxGeo = null;
    let bannerBoxMat = null;

    if (bannerCount > 0) {
      const bScale = gameState.bannerVoxelScale || 1.5;
      bannerBoxGeo = new THREE.BoxGeometry(bScale, bScale, bScale);
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
      const bClaimedCol = gameState.bannerClaimedColor || gameState.settings?.claimedCellColor || '#DA251D';
      const bUnclaimedCol = gameState.bannerUnclaimedColor || '#334155';
      for (let i = 0; i < bannerCount; i++) {
        const bc = bannerCells[i];
        bannerDummy.position.set(bc.wx, bc.wy, bc.wz);
        bannerDummy.scale.set(1, bc.isClaimed ? 1.4 : 0.8, 1);
        bannerDummy.updateMatrix();
        bannerMesh.setMatrixAt(i, bannerDummy.matrix);
        bannerMesh.setColorAt(i, new THREE.Color(bc.color || (bc.isClaimed ? bClaimedCol : bUnclaimedCol)));
      }
      bannerMesh.instanceMatrix.needsUpdate = true;
      if (bannerMesh.instanceColor) bannerMesh.instanceColor.needsUpdate = true;
    }

    // 3. Multi-Flag 3D System (Hiển thị TẤT CẢ các Cột cờ 3D mạ vàng + Lá cờ quốc kỳ tung bay + Bảng tên người xem cắm cờ)
    const multiFlagGroup = new THREE.Group();
    scene.add(multiFlagGroup);
    state.multiFlagGroup = multiFlagGroup;
    state.poleMeshMap = new Map();

    const poleGeo = new THREE.CylinderGeometry(0.12, 0.12, 7.2, 14);
    const poleMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.90,
      roughness: 0.15
    });
    const sphereGeo = new THREE.SphereGeometry(0.28, 14, 14);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0xffea00,
      metalness: 0.8,
      roughness: 0.1
    });
    const flagGeo = new THREE.PlaneGeometry(4.2, 2.7, 20, 14);
    const flagPlaneMat = new THREE.MeshStandardMaterial({
      map: flagTexture,
      side: THREE.DoubleSide,
      roughness: 0.25,
      metalness: 0.05,
      emissive: new THREE.Color(0x350505),
      emissiveIntensity: 0.35,
    });
    state.sharedPoleAssets = { poleGeo, poleMat, sphereGeo, sphereMat, flagGeo, flagPlaneMat };

    // 4. 3D Focal Flag Marker Group (Cột cờ tiêu điểm zoom cận cảnh tức thì cho người tặng mới nhất)
    const focalGroup = new THREE.Group();
    focalGroup.visible = false;
    scene.add(focalGroup);
    state.focalGroup = focalGroup;

    const focalPoleMesh = new THREE.Mesh(poleGeo, poleMat);
    focalPoleMesh.position.set(0, 3.6, 0);
    focalGroup.add(focalPoleMesh);

    const focalSphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    focalSphereMesh.position.set(0, 7.2, 0);
    focalGroup.add(focalSphereMesh);

    const focalFlagPlaneMesh = new THREE.Mesh(flagGeo, flagPlaneMat);
    focalFlagPlaneMesh.position.set(2.1, 5.4, 0);
    focalGroup.add(focalFlagPlaneMesh);
    state.flagPlaneMesh = focalFlagPlaneMesh;

    // Positioning
    const cols = maskData?.gridCols || 300;
    const rows = maskData?.gridRows || 389;
    const dummy = state.dummy;
    const zeroMatrix = new THREE.Matrix4().makeScale(0, 0, 0);

    for (let i = 0; i < count; i++) {
      const cell = cells[i] || { x: (i % 100), y: Math.floor(i / 100) };
      const wx = (cell.x - cols / 2) * 1.0;
      const wz = (cell.y - rows / 2) * 1.0;
      const isClaimed = !!(gameState.cellsById?.[cell.id] ?? gameState.cellsById?.[String(cell.id)] ?? gameState.cellsById?.[Number(cell.id)] ?? bandoEngine.state.cellsById?.[cell.id] ?? bandoEngine.state.cellsById?.[String(cell.id)]);
      const curDim = state.cellDim || 0.98;

      if (isClaimed) {
        // Ô đã cắm cờ: Giữ đúng dạng ô vuông 3D phẳng đẹp mắt (scaleY = 0.55), KHÔNG dựng thành cột dài
        terrainMesh.setMatrixAt(i, zeroMatrix);

        const scaleY = 0.55;
        dummy.position.set(wx, scaleY / 2, wz);
        dummy.scale.set(curDim, scaleY, curDim);
        dummy.updateMatrix();
        flagMesh.setMatrixAt(i, dummy.matrix);
      } else {
        // Ô nền lãnh thổ CHƯA cắm cờ: Hiện trên terrainMesh (tối/sáng dịu, ZERO cờ đỏ/ngôi sao), ẩn trên flagMesh
        const scaleY = 0.35;
        dummy.position.set(wx, scaleY / 2, wz);
        dummy.scale.set(curDim, scaleY, curDim);
        dummy.updateMatrix();
        terrainMesh.setMatrixAt(i, dummy.matrix);
        terrainMesh.setColorAt(i, isLightTheme ? new THREE.Color(0.92, 0.94, 0.97) : new THREE.Color(0.96, 0.97, 0.99));

        flagMesh.setMatrixAt(i, zeroMatrix);
      }
    }
    terrainMesh.instanceMatrix.needsUpdate = true;
    if (terrainMesh.instanceColor) terrainMesh.instanceColor.needsUpdate = true;
    flagMesh.instanceMatrix.needsUpdate = true;

    // Resize handler với ResizeObserver đảm bảo scene Three.js luôn vẽ đúng kích thước ngay lập tức
    const handleResize = () => {
      if (!container || state.disposed) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 600;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        const isVert = aspectRatio === '9:16' || w < h;
        camera.fov = isVert ? 50 : 48;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };
    handleResize();
    const animFrameResizeId = requestAnimationFrame(handleResize);
    const initialResizeTimer = setTimeout(handleResize, 100);
    window.addEventListener('resize', handleResize);

    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver((entries) => {
        if (state.disposed || !entries[0]) return;
        const rect = entries[0].contentRect;
        if (rect.width > 0 && rect.height > 0) {
          camera.aspect = rect.width / rect.height;
          const isVert = aspectRatio === '9:16' || rect.width < rect.height;
          camera.fov = isVert ? 50 : 48;
          camera.updateProjectionMatrix();
          renderer.setSize(rect.width, rect.height);
        }
      });
      resizeObserver.observe(container);
    }

    // Animation Loop with 3D-to-Screen Label Projection
    const tempVec = state.tempVec;
    let lastTime = performance.now();

    const animate = (time) => {
      if (state.disposed) return;
      state.animFrameId = requestAnimationFrame(animate);

      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Update Auto-Rotate dynamically từ ref đảm bảo dừng/quay ngay lập tức không bị lag
      if (controls) {
        controls.autoRotate = !isPopout && !!autoRotateRef.current;
      }

      // Handle 3-Stage Smart Camera Zoom:
      // Giai đoạn 1: Zoom Cận Cảnh 4s (Thấy rõ tên ID và lá cờ sắc nét chuẩn màu không phát sáng chói lóa)
      // Giai đoạn 2: Zoom Khu Vực (Tỉnh/vùng lân cận) khoảng 6s (Tổng 10s)
      // Giai đoạn 3: Zoom Toàn Cảnh (Tổng thể bản đồ đất nước)
      if (state.tween) {
        const tw = state.tween;
        const elapsed = time - tw.start;
        const progress = Math.min(1, Math.max(0, elapsed / tw.duration));
        
        if (tw.phase === 'direct') {
          const t = easeInOutCubic(progress);
          camera.position.lerpVectors(tw.from, tw.to, t);
          controls.target.lerpVectors(tw.fromTarget, tw.toTarget, t);
          if (progress >= 1) state.tween = null;
        } else if (tw.phase === 'in') {
          // 1. Tiến vào góc Zoom Cận Cảnh
          const t = easeOutBack(progress);
          camera.position.lerpVectors(tw.from, tw.to, t);
          controls.target.lerpVectors(tw.fromTarget, tw.toTarget, t);
          if (progress >= 1) {
            tw.phase = 'hold_closeup';
            tw.holdUntil = time + (tw.holdDuration || 4000); // 4 giây cận cảnh theo yêu cầu
          }
        } else if (tw.phase === 'hold_closeup') {
          // Giữ góc cận cảnh đúng 4 giây
          if (time >= tw.holdUntil) {
            if (tw.regionalTo && tw.regionalTarget) {
              // Chuyển tiếp sang Giai đoạn 2: Zoom Khu Vực (Tỉnh/Vùng)
              tw.phase = 'to_regional';
              tw.start = time;
              tw.duration = 1100;
              tw.from.copy(camera.position);
              tw.fromTarget.copy(controls.target);
              tw.to.copy(tw.regionalTo);
              tw.toTarget.copy(tw.regionalTarget);
            } else {
              // Nếu không có góc khu vực, chuyển thẳng về Toàn Cảnh
              tw.phase = 'to_overview';
              tw.start = time;
              tw.duration = 1300;
              tw.from.copy(camera.position);
              tw.fromTarget.copy(controls.target);
              const presets = getCameraPresetsForCountry();
              const defaultPos = presets[activeCameraPreset]?.pos || [0, 240, 260];
              const defaultTarget = presets[activeCameraPreset]?.target || [0, 0, 10];
              tw.to.set(...defaultPos);
              tw.toTarget.set(...defaultTarget);
              if (state.focalGroup) state.focalGroup.visible = false;
            }
          }
        } else if (tw.phase === 'to_regional') {
          // Lướt sang góc khu vực
          const t = easeInOutCubic(progress);
          camera.position.lerpVectors(tw.from, tw.to, t);
          controls.target.lerpVectors(tw.fromTarget, tw.toTarget, t);
          if (progress >= 1) {
            tw.phase = 'hold_regional';
            tw.holdUntil = time + 6000; // Giữ góc khu vực 6 giây (Tổng cộng 10s)
          }
        } else if (tw.phase === 'hold_regional') {
          if (time >= tw.holdUntil) {
            // Chuyển tiếp sang Giai đoạn 3: Zoom Toàn Cảnh
            tw.phase = 'to_overview';
            tw.start = time;
            tw.duration = 1400;
            tw.from.copy(camera.position);
            tw.fromTarget.copy(controls.target);
            const presets = getCameraPresetsForCountry();
            const defaultPos = presets[activeCameraPreset]?.pos || [0, 240, 260];
            const defaultTarget = presets[activeCameraPreset]?.target || [0, 0, 10];
            tw.to.set(...defaultPos);
            tw.toTarget.set(...defaultTarget);
            if (state.focalGroup) state.focalGroup.visible = false;
          }
        } else if (tw.phase === 'to_overview' || tw.phase === 'out') {
          // Thu về toàn cảnh tổng thể bản đồ
          const t = easeInOutCubic(progress);
          camera.position.lerpVectors(tw.from, tw.to, t);
          controls.target.lerpVectors(tw.fromTarget, tw.toTarget, t);
          if (progress >= 1) {
            state.tween = null;
            if (state.focalGroup) state.focalGroup.visible = false;
          }
        }
      }

      // Tính toán khoảng cách Camera để tự động phóng to lá cờ & huy hiệu khi nhìn từ xa (Distance Adaptive Scale)
      const camDist = camera.position.distanceTo(controls.target || new THREE.Vector3(0, 0, 0));
      const distScale = Math.min(3.8, Math.max(1.0, camDist / 110));
      const badgeScale = Math.min(1.4, Math.max(0.85, camDist / 200));

      // Hoạt họa & Tự động phóng to Lá cờ Quốc kỳ 3D theo khoảng cách zoom cho TẤT CẢ các cột cờ người xem
      if (state.multiFlagGroup && state.multiFlagGroup.children.length > 0) {
        const pChildren = state.multiFlagGroup.children;
        for (let c = 0; c < pChildren.length; c++) {
          const pGroup = pChildren[c];
          pGroup.scale.set(distScale, distScale, distScale);
          if (pGroup.flagPlane) {
            pGroup.flagPlane.rotation.y = Math.sin(time * 0.006 + (pGroup.animPhase || 0)) * 0.25;
          }
        }
      }

      if (state.focalGroup && state.focalGroup.visible) {
        state.focalGroup.scale.set(distScale, distScale, distScale);
        if (state.flagPlaneMesh) {
          state.flagPlaneMesh.rotation.y = Math.sin(time * 0.006) * 0.25;
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

      // PROJECTION & ANTI-OVERLAP: Update Recent Claim Badges with Dynamic Distance Scale
      const allBadges = recentClaimBadgesRef.current || [];
      const visibleBadges = [];
      const maxVisible = 20; // Hiển thị đầy đủ tất cả huy hiệu cắm cờ của người xem đồng thời

      for (let b = 0; b < Math.min(allBadges.length, maxVisible); b++) {
        const badge = allBadges[b];
        const badgeEl = badgeRefs.current[badge.id];
        if (!badgeEl) continue;

        const badgeY = (badge.wy || 5.5) * distScale;
        tempVec.set(badge.wx || 0, badgeY, badge.wz || 0);
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
          badgeEl.style.transform = `translate3d(${sx}px, ${sy}px, 0px) translate(-50%, -100%) scale(${badgeScale})`;
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
    // Raycaster cho phép click trực tiếp vào từng vị trí bản đồ 3D để cắm cờ
    const raycaster = new THREE.Raycaster();
    const mousePos = new THREE.Vector2();
    let pointerDownInfo = { x: 0, y: 0, time: 0 };

    const handleDomPointerDown = (e) => {
      pointerDownInfo = { x: e.clientX, y: e.clientY, time: performance.now() };
    };

    const handleDomPointerUp = (e) => {
      const dist = Math.hypot(e.clientX - pointerDownInfo.x, e.clientY - pointerDownInfo.y);
      const duration = performance.now() - pointerDownInfo.time;
      if (dist < 8 && duration < 400 && state.instancedMesh) {
        const rect = renderer.domElement.getBoundingClientRect();
        mousePos.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mousePos.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mousePos, camera);
        const targetMeshes = [state.terrainMesh, state.flagMesh].filter(Boolean);
        const intersects = raycaster.intersectObjects(targetMeshes);
        if (intersects.length > 0) {
          const hit = intersects[0];
          const instanceId = hit.instanceId;
          bandoAudio.unlock();
          bandoAudio.playCellPop();

          const activeUserChannel = (typeof localStorage !== 'undefined' && localStorage.getItem('aidol_tiktok_id'))
            ? localStorage.getItem('aidol_tiktok_id').replace(/^@/, '')
            : 'chienbinh_vn';
          const activeUserId = `@${activeUserChannel}`;
          const activeUsername = activeUserChannel;
          const activeAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100';

          bandoEngine.handleGift({
            userId: activeUserId,
            username: activeUsername,
            avatar: activeAvatar,
            giftId: 'flag',
            giftName: 'Lá Cờ Tổ Quốc',
            count: 1,
            diamondCount: 1,
            focusCellId: instanceId
          });
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handleDomPointerDown);
    renderer.domElement.addEventListener('pointerup', handleDomPointerUp);

    // Kích hoạt Render Loop của Three.js
    state.animFrameId = requestAnimationFrame(animate);

    return () => {
      state.disposed = true;
      if (state.animFrameId) cancelAnimationFrame(state.animFrameId);
      cancelAnimationFrame(animFrameResizeId);
      clearTimeout(initialResizeTimer);
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', handleDomPointerDown);
      renderer.domElement.removeEventListener('pointerup', handleDomPointerUp);
      renderer.dispose();
      boxGeo.dispose();
      if (state.terrainMat) state.terrainMat.dispose();
      if (state.flagMat) state.flagMat.dispose();
      if (state.flagSideMat) state.flagSideMat.dispose();
      if (state.terrainTexture) state.terrainTexture.dispose();
      if (state.flagTexture) state.flagTexture.dispose();
      if (state.flagSideTexture) state.flagSideTexture.dispose();
    };
  }, [viewMode3D, isPopout, gameState.selectedCountry, isLightTheme, gameState.maskLoaded, gameState.isLoaded, aspectRatio]);

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

  const handleToggleAutoRotate = (forcedVal = null) => {
    const next = forcedVal !== null ? forcedVal : !autoRotateRef.current;
    setAutoRotate(next);
    autoRotateRef.current = next;
    bandoEngine.setAutoRotate(next);
    const state = threeStateRef.current;
    if (state?.controls) {
      state.controls.autoRotate = next;
      if (!next) {
        state.controls.autoRotateSpeed = 0;
        state.controls.update();
      } else {
        state.controls.autoRotateSpeed = 0.8;
      }
    }
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

  // 2D Canvas Handlers (Pan, Zoom & Direct Click)
  const handleMouseDown2D = (e) => {
    isDragging2DRef.current = true;
    dragStart2DRef.current = { 
      x: e.clientX - pan2D.x, 
      y: e.clientY - pan2D.y,
      rawX: e.clientX,
      rawY: e.clientY,
      time: performance.now()
    };
  };

  const handleMouseMove2D = (e) => {
    if (!isDragging2DRef.current) return;
    setPan2D({
      x: e.clientX - dragStart2DRef.current.x,
      y: e.clientY - dragStart2DRef.current.y
    });
  };

  const handleMouseUp2D = (e) => {
    if (dragStart2DRef.current) {
      const dist = Math.hypot(e.clientX - dragStart2DRef.current.rawX, e.clientY - dragStart2DRef.current.rawY);
      const duration = performance.now() - dragStart2DRef.current.time;
      if (dist < 8 && duration < 350) {
        bandoAudio.unlock();
        bandoAudio.playCellPop();
        const activeUserChannel = (typeof localStorage !== 'undefined' && localStorage.getItem('aidol_tiktok_id'))
          ? localStorage.getItem('aidol_tiktok_id').replace(/^@/, '')
          : 'chienbinh_vn';
        const activeUserId = `@${activeUserChannel}`;
        const activeUsername = activeUserChannel;
        const activeAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100';

        bandoEngine.handleGift({
          userId: activeUserId,
          username: activeUsername,
          avatar: activeAvatar,
          giftId: 'flag',
          giftName: 'Lá Cờ Tổ Quốc',
          count: 1,
          diamondCount: 1,
        });
      }
    }
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
    const terrainMesh = state.terrainMesh;
    const flagMesh = state.flagMesh;
    const maskData = bandoEngine.maskData;
    if (!terrainMesh || !flagMesh || !maskData) return;

    // Cập nhật Texture Quốc Kỳ khi chuyển đổi quốc gia
    if (state.flagMat && gameState.selectedCountry && state.currentCountry !== gameState.selectedCountry) {
      state.currentCountry = gameState.selectedCountry;
      const newTex = createCountryFlagTexture(gameState.selectedCountry);
      state.flagMat.map = newTex;
      state.flagMat.emissiveMap = newTex;
      state.flagMat.needsUpdate = true;
      if (state.sharedPoleAssets && state.sharedPoleAssets.flagPlaneMat) {
        state.sharedPoleAssets.flagPlaneMat.map = newTex;
        state.sharedPoleAssets.flagPlaneMat.needsUpdate = true;
      }
      if (state.flagPlaneMesh && state.flagPlaneMesh.material) {
        state.flagPlaneMesh.material.map = newTex;
        state.flagPlaneMesh.material.emissiveMap = newTex;
        state.flagPlaneMesh.material.needsUpdate = true;
      }
    }

    // Cập nhật và Đồng Bộ Toàn Bộ Cột Cờ 3D của TẤT CẢ Người Xem Đã Cắm Trên Bản Đồ
    if (state.multiFlagGroup && state.sharedPoleAssets) {
      const activePoles = gameState.activeFlagPoles || [];
      const currentPoleIds = new Set(activePoles.map(p => p.id));
      const poleMap = state.poleMeshMap || new Map();
      state.poleMeshMap = poleMap;

      // Xóa các cột cờ đã bị loại bỏ khi reset vòng
      for (const [id, poleObj] of poleMap.entries()) {
        if (!currentPoleIds.has(id)) {
          state.multiFlagGroup.remove(poleObj);
          poleMap.delete(id);
        }
      }

      // Thêm mới các cột cờ 3D cho tất cả người tặng quà (Cán vàng + Cờ vẫy sóng + Bảng tên ID)
      const { poleGeo, poleMat, sphereGeo, sphereMat, flagGeo, flagPlaneMat } = state.sharedPoleAssets;
      for (let pIdx = 0; pIdx < activePoles.length; pIdx++) {
        const p = activePoles[pIdx];
        if (!poleMap.has(p.id)) {
          const poleGroup = new THREE.Group();
          const pMesh = new THREE.Mesh(poleGeo, poleMat);
          pMesh.position.set(0, 3.6, 0);

          const sMesh = new THREE.Mesh(sphereGeo, sphereMat);
          sMesh.position.set(0, 7.2, 0);

          const fPlane = new THREE.Mesh(flagGeo, flagPlaneMat);
          fPlane.position.set(2.1, 5.4, 0);

          poleGroup.add(pMesh);
          poleGroup.add(sMesh);
          poleGroup.add(fPlane);

          poleGroup.position.set(p.wx, 0, p.wz);
          poleGroup.flagPlane = fPlane;
          poleGroup.animPhase = Math.random() * Math.PI * 2;

          state.multiFlagGroup.add(poleGroup);
          poleMap.set(p.id, poleGroup);
        }
      }
    }

    const cells = maskData.cells || [];
    const count = cells.length;
    const cols = maskData.gridCols || 300;
    const rows = maskData.gridRows || 389;
    const dummy = state.dummy;
    const zeroMatrix = new THREE.Matrix4().makeScale(0, 0, 0);

    // Build index map once for fast O(1) lookup (hỗ trợ cả Number và String ID)
    if (!state.cellIndexMap || state.cellIndexMapMask !== maskData) {
      state.cellIndexMap = new Map();
      state.cellIndexMapMask = maskData;
      for (let i = 0; i < count; i++) {
        const c = cells[i];
        if (c) {
          state.cellIndexMap.set(c.id, i);
          state.cellIndexMap.set(String(c.id), i);
          state.cellIndexMap.set(Number(c.id), i);
        }
      }
      state._lastRenderedClaimedCount = 0;
      state._renderedCellIds = new Set();
    }

    const cellIndexMap = state.cellIndexMap;
    const curDim = state.cellDim || 0.98;
    const scaleYClaimed = 0.55;
    const scaleYUnclaimed = 0.35;

    // 🔴 ĐỌC TRỰC TIẾP TỪ ENGINE (nguồn chân lý tuyệt đối) thay vì qua React state
    const engineCellsById = bandoEngine.state.cellsById || {};
    const engineClaimedIds = Object.keys(engineCellsById);
    const engineClaimedCount = engineClaimedIds.length;
    const lastRendered = state._lastRenderedClaimedCount || 0;

    // 🔴 DEBUG: Log mỗi khi useEffect này chạy
    console.log(`%c[3D RENDERER] 🗺️ Voxel Update useEffect: engineClaimed=${engineClaimedCount}, lastRendered=${lastRendered}, gameState.claimedCount=${gameState.claimedCount}`, 'color: #3b82f6; font-weight: bold;');

    if (engineClaimedCount !== lastRendered) {
      // Có thay đổi - cần cập nhật meshes
      const renderedSet = state._renderedCellIds || new Set();
      state._renderedCellIds = renderedSet;

      if (engineClaimedCount < lastRendered || lastRendered === 0) {
        // Full reset hoặc init lần đầu: Quét toàn bộ cells
        renderedSet.clear();
        for (let i = 0; i < count; i++) {
          const cell = cells[i];
          if (!cell) continue;
          const cellIdStr = String(cell.id);
          const isClaimed = !!(engineCellsById[cell.id] ?? engineCellsById[cellIdStr] ?? engineCellsById[Number(cell.id)]);
          const wx = (cell.x - cols / 2) * 1.0;
          const wz = (cell.y - rows / 2) * 1.0;

          if (isClaimed) {
            renderedSet.add(cellIdStr);
            terrainMesh.setMatrixAt(i, zeroMatrix);

            dummy.position.set(wx, scaleYClaimed / 2, wz);
            dummy.scale.set(curDim, scaleYClaimed, curDim);
            dummy.updateMatrix();
            flagMesh.setMatrixAt(i, dummy.matrix);
          } else {
            dummy.position.set(wx, scaleYUnclaimed / 2, wz);
            dummy.scale.set(curDim, scaleYUnclaimed, curDim);
            dummy.updateMatrix();
            terrainMesh.setMatrixAt(i, dummy.matrix);
            terrainMesh.setColorAt(i, isLightTheme ? new THREE.Color(0.92, 0.94, 0.97) : new THREE.Color(0.96, 0.97, 0.99));
            flagMesh.setMatrixAt(i, zeroMatrix);
          }
        }
        console.log(`%c[3D RENDERER] 🔄 FULL PASS: Rendered ${renderedSet.size} claimed cells out of ${count} total`, 'color: #f59e0b; font-weight: bold;');
      } else {
        // Incremental update: chỉ xử lý ô mới
        let newCells = 0;
        for (let k = 0; k < engineClaimedIds.length; k++) {
          const cid = String(engineClaimedIds[k]);
          if (!renderedSet.has(cid)) {
            renderedSet.add(cid);
            const i = cellIndexMap.get(cid) ?? cellIndexMap.get(Number(cid));
            if (i !== undefined && i >= 0 && i < count) {
              const cell = cells[i];
              if (cell) {
                const wx = (cell.x - cols / 2) * 1.0;
                const wz = (cell.y - rows / 2) * 1.0;
                terrainMesh.setMatrixAt(i, zeroMatrix);

                dummy.position.set(wx, scaleYClaimed / 2, wz);
                dummy.scale.set(curDim, scaleYClaimed, curDim);
                dummy.updateMatrix();
                flagMesh.setMatrixAt(i, dummy.matrix);
                newCells++;
              }
            }
          }
        }
        if (newCells > 0) {
          console.log(`%c[3D RENDERER] ✅ INCREMENTAL: Cắm ${newCells} ô cờ MỚI lên bản đồ 3D. Tổng rendered: ${renderedSet.size}`, 'color: #22c55e; font-weight: bold;');
        }
      }

      // LUÔN đánh dấu needsUpdate cho cả hai mesh
      terrainMesh.instanceMatrix.needsUpdate = true;
      if (terrainMesh.instanceColor) terrainMesh.instanceColor.needsUpdate = true;
      flagMesh.instanceMatrix.needsUpdate = true;

      state._lastRenderedClaimedCount = engineClaimedCount;
    }

    // Cập nhật ma trận và màu sắc của Khối Chữ Ô Cờ 3D (Banner Flag Cells)
    if (state.bannerMesh && gameState.bannerCells) {
      const bCells = gameState.bannerCells;
      const bMesh = state.bannerMesh;
      bMesh.visible = gameState.showBannerCells !== false;
      const bannerDummy = state.dummy;
      const bannerClaimedColor = new THREE.Color(gameState.bannerClaimedColor || gameState.settings?.claimedCellColor || '#DA251D');
      const bannerEmpty = new THREE.Color(gameState.bannerUnclaimedColor || '#334155');

      for (let j = 0; j < bMesh.count; j++) {
        const bc = bCells[j];
        if (bc) {
          bannerDummy.position.set(bc.wx, bc.wy, bc.wz);
          bannerDummy.scale.set(1, bc.isClaimed ? 1.4 : 0.8, 1);
          bannerDummy.updateMatrix();
          bMesh.setMatrixAt(j, bannerDummy.matrix);
          bMesh.setColorAt(j, bc.isClaimed ? bannerClaimedColor : bannerEmpty);
        }
      }
      bMesh.instanceMatrix.needsUpdate = true;
      if (bMesh.instanceColor) bMesh.instanceColor.needsUpdate = true;
    }

    // Trigger Camera 3-Stage Zoom:
    // - Khi Chạy Demo Test Quà (isAutoTesting): KHÔNG zoom giật cục tới lui liên tục, giữ góc nhìn toàn cảnh mượt mà để quan sát quà và cắm cờ!
    // - Khi Chạy Thật (Live Stream): Áp dụng chuẩn chu kỳ 3 cấp (Zoom cận cảnh 4s thấy rõ lá cờ quốc kỳ 3D + Bảng tên ID -> Zoom khu vực 6s -> Zoom toàn cảnh)
    if (gameState.lastFocalTarget && state.camera && state.controls) {
      const ft = gameState.lastFocalTarget;
      const focalKey = `${ft.seq || ''}_${Math.round((ft.wx || 0) * 10)}_${Math.round((ft.wz || 0) * 10)}_${ft.username || ft.user || ''}`;
      
      if (lastFocalKeyRef.current !== focalKey) {
        lastFocalKeyRef.current = focalKey;
        if (state.focalGroup) {
          state.focalGroup.position.set(ft.wx, 0, ft.wz);
          state.focalGroup.visible = true;
        }

        // Chu kỳ Zoom 3 Cấp: Zoom Cận Cảnh (rõ lá cờ quốc kỳ 3D + Bảng tên ID) -> Zoom Vùng -> Zoom Toàn Cảnh
        state.tween = {
          from: state.camera.position.clone(),
          to: new THREE.Vector3(ft.wx, 11.5, ft.wz + 10.5),
          fromTarget: state.controls.target.clone(),
          toTarget: new THREE.Vector3(ft.wx, 4.2, ft.wz),
          regionalTo: new THREE.Vector3(ft.wx * 0.65, 80, ft.wz * 0.65 + 65),
          regionalTarget: new THREE.Vector3(ft.wx * 0.65, 0, ft.wz * 0.65),
          start: performance.now(),
          duration: 600,
          phase: 'in',
          holdDuration: 2400, // Cận cảnh sắc nét 2.4s
          holdUntil: 0
        };
      }
    }
  }, [gameState.claimedCount, gameState.cellsById, gameState._stateSeq, gameState.lastFocalTarget, gameState.activeFlagPoles, gameState.status, gameState.settings, gameState.selectedCountry, gameState.bannerCells, gameState.bannerClaimedCount, gameState.showBannerCells, gameState.bannerPos, gameState.bannerClaimedColor, gameState.bannerUnclaimedColor, gameState.bannerVoxelScale, viewMode3D, gameState.maskLoaded, isAutoTesting, isAuto247]);

  // Smart Camera Director: Luân phiên góc nhìn khi ở chế độ chờ (Chưa có người dùng tặng quà):
  // 1. Zoom gần khu vực CÓ LÁ CỜ QUỐC KỲ (10-15s, mặc định 12s) - Nhìn thấy rõ tất cả lá cờ quốc kỳ đã cắm
  // 2. Zoom toàn cảnh lãnh thổ quốc gia đó (5-10s, mặc định 7s)
  // Lưu ý: Tuyệt đối không xoay/zoom gián đoạn khi đang chạy Demo test quà
  useEffect(() => {
    if (!viewMode3D || isPopout) return;
    let standbyMode = 'flag_cluster'; // 'flag_cluster' hoặc 'overview'

    const directorInterval = setInterval(() => {
      const state = threeStateRef.current;
      if (!state.camera || !state.controls || state.tween) return;
      if (autoRotateRef.current) return;
      if (isAutoTesting || bandoEngine.isAutoTesting) return; // Bỏ qua xoay chuyển khi đang test demo

      const presets = getCameraPresetsForCountry();
      const overviewPreset = presets.overview || { pos: [0, 240, 260], target: [0, 0, 10] };

      if (standbyMode === 'flag_cluster') {
        // Giai đoạn chờ 1: Zoom Gần Cận Khu Vực CÓ LÁ CỜ QUỐC KỲ (12 giây)
        const claimedCells = Object.values(gameState.cellsById || {}).filter(Boolean);
        let targetPos = null;
        let targetLook = null;

        if (claimedCells.length > 0) {
          const maskData = bandoEngine.maskData;
          const cols = maskData?.gridCols || 300;
          const rows = maskData?.gridRows || 389;

          let sumX = 0, sumZ = 0;
          let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;

          claimedCells.forEach(c => {
            const wx = (c.x - cols / 2) * 1.0;
            const wz = (c.y - rows / 2) * 1.0;
            sumX += wx;
            sumZ += wz;
            if (wx < minX) minX = wx;
            if (wx > maxX) maxX = wx;
            if (wz < minZ) minZ = wz;
            if (wz > maxZ) maxZ = wz;
          });

          const centerWx = sumX / claimedCells.length;
          const centerWz = sumZ / claimedCells.length;
          const spanX = Math.max(15, maxX - minX);
          const spanZ = Math.max(15, maxZ - minZ);
          const maxSpan = Math.max(spanX, spanZ);

          // Camera zoom gần ôm trọn toàn bộ cụm lá cờ quốc kỳ đã cắm
          const altitude = Math.min(110, Math.max(36, maxSpan * 0.85));
          const distZ = Math.min(95, Math.max(30, maxSpan * 0.7));

          targetPos = [centerWx, altitude, centerWz + distZ];
          targetLook = [centerWx, 0, centerWz];
        } else if (gameState.lastFocalTarget && gameState.lastFocalTarget.wx !== undefined) {
          const ft = gameState.lastFocalTarget;
          targetPos = [ft.wx, 38, ft.wz + 32];
          targetLook = [ft.wx, 0, ft.wz];
        } else {
          // Khi chưa có ô nào được cắm cờ: Zoom gần vào trung tâm lãnh thổ quốc gia
          targetPos = [overviewPreset.target[0] || 0, 65, (overviewPreset.target[2] || 0) + 55];
          targetLook = [overviewPreset.target[0] || 0, 0, overviewPreset.target[2] || 0];
        }

        state.tween = {
          from: state.camera.position.clone(),
          to: new THREE.Vector3(...targetPos),
          fromTarget: state.controls.target.clone(),
          toTarget: new THREE.Vector3(...targetLook),
          start: performance.now(),
          duration: 1200,
          phase: 'in',
          holdDuration: 12000, // Giữ 12 giây cận cảnh khu vực cờ (theo chuẩn 10-15s)
          holdUntil: 0
        };

        standbyMode = 'overview';
      } else {
        // Giai đoạn chờ 2: Zoom Toàn Cảnh Bản Đồ Lãnh Thổ (7 giây)
        state.tween = {
          from: state.camera.position.clone(),
          to: new THREE.Vector3(...overviewPreset.pos),
          fromTarget: state.controls.target.clone(),
          toTarget: new THREE.Vector3(...overviewPreset.target),
          start: performance.now(),
          duration: 1300,
          phase: 'in',
          holdDuration: 7000, // Giữ 7 giây toàn cảnh lãnh thổ (theo chuẩn 5-10s)
          holdUntil: 0
        };

        standbyMode = 'flag_cluster';
      }
    }, 14000);

    return () => clearInterval(directorInterval);
  }, [viewMode3D, isPopout, gameState.lastFocalTarget, gameState.cellsById, getCameraPresetsForCountry, isAutoTesting]);


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
    const offsetX = canvas.width / 2 + pan2D.x;
    const offsetY = canvas.height / 2 + pan2D.y;

    // Background Canvas
    ctx.fillStyle = isLightTheme ? '#f8fafc' : '#090d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid Cells
    const cells = maskData.cells || [];
    const cellSide = Math.max(2, scale * 0.9);

    cells.forEach(c => {
      const px = offsetX + (c.x - cols / 2) * scale;
      const py = offsetY + (c.y - rows / 2) * scale;

      if (px + cellSide < 0 || px > canvas.width || py + cellSide < 0 || py > canvas.height) return;

      const isClaimed = !!gameState.cellsById[c.id];
      if (isClaimed) {
        ctx.fillStyle = gameState.settings.claimedCellColor || '#DA251D';
        ctx.fillRect(px, py, cellSide, cellSide);
        // Star on 2D if large enough
        if (cellSide >= 8) {
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(px + cellSide / 2, py + cellSide / 2, cellSide * 0.28, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.fillStyle = isLightTheme ? '#94a3b8' : '#334155';
        ctx.fillRect(px, py, cellSide, cellSide);
      }
    });

    // Draw Banner Text Cells on 2D
    if (gameState.showBannerCells !== false && gameState.bannerCells) {
      const bannerRed = gameState.settings.claimedCellColor || '#DA251D';
      gameState.bannerCells.forEach(bc => {
        const bpx = offsetX + bc.wx * scale * 0.8;
        const bpy = offsetY + bc.wz * scale * 0.8;
        if (bpx + cellSide >= 0 && bpx <= canvas.width && bpy + cellSide >= 0 && bpy <= canvas.height) {
          ctx.fillStyle = bc.isClaimed ? bannerRed : '#1e293b';
          ctx.fillRect(bpx, bpy, cellSide * 1.2, cellSide * 1.2);
        }
      });
    }

    // Draw 2D Landmark Labels
    (gameState.mapTexts || []).forEach(item => {
      const lx = offsetX + (item.wx + cols / 2) * scale;
      const ly = offsetY + (item.wz + rows / 2) * scale;
      if (lx >= 0 && lx <= canvas.width && ly >= 0 && ly <= canvas.height) {
        ctx.fillStyle = 'rgba(0,0,0,0.75)';
        ctx.strokeStyle = item.color || '#facc15';
        ctx.lineWidth = 2;
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeText(item.text, lx, ly);
        ctx.fillText(item.text, lx, ly);
      }
    });
  }, [viewMode3D, pan2D, zoom2D, gameState.claimedCount, isLightTheme]);

  // Lắng nghe sự kiện điều khiển camera từ Admin Modal hoặc Phím tắt
  useEffect(() => {
    const handleCameraAction = (e) => {
      const { action, payload } = e.detail || {};
      if (action === 'preset') applyCameraPreset(payload);
      if (action === 'viewMode3D') setViewMode3D(payload !== undefined ? payload : !viewMode3D);
      if (action === 'panStep' && payload) handlePanStep(payload.dx || 0, payload.dy || 0);
      if (action === 'zoomIn') handleZoomIn();
      if (action === 'zoomOut') handleZoomOut();
      if (action === 'autoRotate') handleToggleAutoRotate(payload !== undefined ? payload : null);
    };
    window.addEventListener('bando-camera-action', handleCameraAction);
    return () => window.removeEventListener('bando-camera-action', handleCameraAction);
  }, [applyCameraPreset, handlePanStep, handleZoomIn, handleZoomOut, viewMode3D, autoRotate]);

  // HÀM RENDER SÂN KHẤU LIVE SẠCH 100% (Pure Clean Stage Viewport)
  const renderCleanStage = () => (
    <div className="relative w-full h-full min-h-[360px] overflow-hidden select-none font-sans">
      {/* 3D Container or 2D Canvas */}
      {viewMode3D ? (
        <div ref={containerRef} className="w-full h-full min-h-[360px] cursor-grab active:cursor-grabbing" />
      ) : (
        <canvas 
          ref={canvas2dRef} 
          width={1280} 
          height={720} 
          className="w-full h-full min-h-[360px] cursor-move"
          onMouseDown={handleMouseDown2D}
          onMouseMove={handleMouseMove2D}
          onMouseUp={handleMouseUp2D}
          onWheel={handleWheel2D}
        />
      )}

      {/* TOP MINI STAGE HEADER (Chỉ chứa thông tin Live sạch 100% - KHÔNG CÓ NÚT BẤM - ẨN KHI Ở CHẾ ĐỘ ULTRA CLEAN GÓC MÀN HÌNH) */}
      {!isUltraCleanCornerMode && (
        <div className="absolute top-2.5 left-2.5 right-2.5 z-20 pointer-events-none animate-in fade-in duration-200">
          <div className="bg-black/75 backdrop-blur-md border border-white/15 rounded-2xl px-3 py-2 shadow-2xl flex items-center justify-between gap-2 text-white">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 via-amber-500 to-yellow-400 flex items-center justify-center text-base shadow-md shrink-0 animate-pulse">
              <span>{currentCountry?.flag || '🇻🇳'}</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider bg-gradient-to-r from-yellow-300 via-red-400 to-amber-300 bg-clip-text text-transparent truncate">
                  {gameState.settings.customMapTitle || `${currentCountry?.name || 'Việt Nam'} ${t.title}`}
                </h2>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-red-600 text-white shadow-sm shrink-0">
                  {gameState.roundId}
                </span>
              </div>
              <div className="text-[10px] text-gray-300 font-medium flex items-center gap-1.5">
                <span>{t.claimed}: <strong className="text-yellow-400 font-bold">{gameState.claimedCount.toLocaleString()}</strong>/{gameState.totalCells.toLocaleString()}</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">{gameState.percent}% map</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {gameState.combo.active && gameState.combo.count >= 2 && (
              <div className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-600 to-red-600 rounded-full text-white text-[10px] sm:text-xs font-black shadow-lg animate-bounce">
                <Flame size={12} className="text-yellow-300 animate-spin" />
                <span>x{gameState.combo.multiplier} ({gameState.combo.count}🎁)</span>
              </div>
            )}
            <div className="w-20 sm:w-28 h-2 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/20">
              <div 
                className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]"
                style={{ width: `${gameState.percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      )}

      {/* 3D Landmarks Overlay Layer */}
      <div ref={labelsLayerRef} className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {(bandoEngine.landmarks || []).map(lm => (
          <div
            key={lm.id}
            ref={el => labelRefs.current[lm.id] = el}
            className="absolute top-0 left-0 hidden flex-col items-center pointer-events-none transition-all duration-75"
            style={{ willChange: 'transform' }}
          >
            <div className={`px-2 py-0.5 rounded-full text-[10px] font-black shadow-lg border backdrop-blur-md flex items-center gap-1 whitespace-nowrap ${
              lm.id === 'hoangsa' || lm.id === 'truongsa'
                ? 'bg-red-600/90 text-yellow-300 border-yellow-300/80 animate-pulse ring-2 ring-red-500/50'
                : 'bg-black/75 text-amber-300 border-amber-400/40'
            }`}>
              <MapPin size={10} className="text-yellow-400 shrink-0" />
              <span>{lm.name}</span>
            </div>
            <div className="w-0.5 h-2 bg-yellow-400/70" />
          </div>
        ))}
      </div>

      {/* User Claim Flag Badges Floating Overlay Layer (Hiển thị Avatar, ID & Lá Cờ Quốc Kỳ) */}
      <div ref={claimBadgesLayerRef} className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
        {recentClaimBadges.map(b => (
          <div
            key={b.id}
            ref={el => badgeRefs.current[b.id] = el}
            className="absolute top-0 left-0 hidden flex-col items-center pointer-events-none transition-all duration-100 animate-in zoom-in-75 fade-in duration-150"
            style={{ willChange: 'transform' }}
          >
            <div className="relative flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white font-black text-[10px] shadow-[0_4px_20px_rgba(239,68,68,0.7)] border border-yellow-300 ring-1 ring-yellow-400/90 whitespace-nowrap drop-shadow-md">
              <span className="text-[12px] leading-none shrink-0">{b.flag || currentCountry?.flag || '🇻🇳'}</span>
              <span className="truncate max-w-[120px] font-bold text-yellow-100">@{b.username || 'Chiến Binh'}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-black/40 text-yellow-300 font-mono text-[9px] font-black border border-yellow-400/30">+{b.count || 1} Ô</span>
            </div>
            <div className="w-0.5 h-3 bg-gradient-to-b from-yellow-300 to-red-500 shadow-sm" />
          </div>
        ))}
      </div>

      {/* Bookmark Notification Banner */}
      {bookmarkNotification && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-in fade-in slide-in-from-top duration-300">
          <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black font-black text-xs shadow-2xl border border-yellow-200 flex items-center gap-1.5">
            <Sparkles size={13} className="text-black stroke-[2.5]" />
            <span>{bookmarkNotification}</span>
          </div>
        </div>
      )}

      {/* 1. TOP 10 SUPPORTERS LEADERBOARD (Ultra Transparent Glassmorphism - Bảng Vàng Top 10 Chuẩn Xác) */}
      {!isLeaderboardClosed && (
        <div 
          className={`absolute z-30 transition-all duration-100 pointer-events-auto select-none ${
            isLeaderboardMinimized ? 'w-8 overflow-hidden' : 'w-36 sm:w-40'
          }`}
          style={{
            top: `${leaderboardPos.y}px`,
            left: `${leaderboardPos.x}px`,
            transform: `scale(${leaderboardScale})`,
            transformOrigin: 'top left'
          }}
        >
          <div className="bg-black/35 backdrop-blur-[3px] hover:bg-black/55 border border-amber-500/30 hover:border-amber-400/50 rounded-xl p-1 shadow-2xl text-white transition-all">
            <div 
              className="flex items-center justify-between text-[9px] font-black text-amber-300 mb-0.5 border-b border-white/10 pb-0.5 cursor-move"
              onMouseDown={(e) => handleHudDragStart(e, 'leaderboard')}
              onTouchStart={(e) => handleHudDragStart(e, 'leaderboard')}
              title="Kéo thả để di chuyển Bảng Xếp Hạng"
            >
              {!isLeaderboardMinimized && (
                <div className="flex items-center gap-1">
                  <Trophy size={10} className="text-yellow-400 shrink-0" />
                  <span className="truncate drop-shadow uppercase text-[8.5px]">Top 10 Chiến Binh</span>
                </div>
              )}
              <div className="flex items-center gap-0.5 ml-auto">
                {!isLeaderboardMinimized && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleLeaderboardScaleChange(-0.1); }}
                      className="w-3.5 h-3.5 flex items-center justify-center rounded text-gray-300 hover:text-white hover:bg-white/20 transition-colors text-[8px]"
                      title="Thu nhỏ BXH (-10%)"
                    >
                      −
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleLeaderboardScaleChange(0.1); }}
                      className="w-3.5 h-3.5 flex items-center justify-center rounded text-gray-300 hover:text-white hover:bg-white/20 transition-colors text-[8px]"
                      title="Phóng to BXH (+10%)"
                    >
                      +
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsLeaderboardMinimized(!isLeaderboardMinimized)}
                  className="p-0.5 rounded text-gray-300 hover:text-white hover:bg-white/20 transition-colors"
                  title={isLeaderboardMinimized ? "Mở rộng BXH" : "Thu nhỏ BXH"}
                >
                  <span className="text-[9px] font-bold">{isLeaderboardMinimized ? '🏆' : '▾'}</span>
                </button>
                <button
                  onClick={() => setIsLeaderboardClosed(true)}
                  className="p-0.5 rounded text-gray-400 hover:text-red-400 hover:bg-white/20 transition-colors"
                  title="Ẩn BXH"
                >
                  <span className="text-[8px] font-bold">✕</span>
                </button>
              </div>
            </div>

            {!isLeaderboardMinimized && (
              <>
                <div className="space-y-0.5 max-h-40 overflow-y-auto custom-scrollbar">
                  {(!gameState.leaderboard || gameState.leaderboard.length === 0) ? (
                    <p className="text-[8px] text-gray-300 text-center py-2 italic">Chưa có lượt cắm cờ</p>
                  ) : (
                    gameState.leaderboard.slice(0, 10).map((user, idx) => (
                      <div key={user.userId || idx} className="flex items-center justify-between text-[8px] sm:text-[9px] bg-black/35 px-1 py-0.5 rounded border border-white/5">
                        <span className="flex items-center gap-1 font-medium truncate max-w-[78px]">
                          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center font-black text-[7.5px] ${
                            idx === 0 ? 'bg-yellow-400 text-black' : idx === 1 ? 'bg-slate-300 text-black' : idx === 2 ? 'bg-amber-600 text-white' : 'bg-white/10 text-gray-300'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="text-yellow-100 truncate font-bold text-[8.5px]">{user.username}</span>
                        </span>
                        <span className="font-mono font-black text-yellow-400 shrink-0 text-[8px]">{(user.totalCells || user.cells || 0).toLocaleString()} ô</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Corner Drag Resize Handle */}
                <div 
                  onMouseDown={handleLbCornerResizeStart}
                  onTouchStart={handleLbCornerResizeStart}
                  className="flex items-center justify-between pt-0.5 mt-0.5 border-t border-white/10 text-[6.5px] text-gray-400 select-none cursor-nwse-resize hover:text-yellow-300"
                  title="Kéo góc này để phóng to / thu nhỏ BXH"
                >
                  <span className="font-mono opacity-70">{Math.round(leaderboardScale * 100)}%</span>
                  <span className="text-[7.5px] text-yellow-400/80">⤡</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 2. BẢNG ĐIỆN QUÀ TẶNG & CẮM CỜ 3 MIỀN (Draggable / Resizable Showcase Widget - Read-only cho Live) */}
      <LiveGiftMarqueeTicker 
        mode="map" 
        onOpenSettings={() => setShowGiftConfigModal(true)} 
      />

      {/* VICTORY CELEBRATION CEREMONY / CHAMPION PODIUM */}
      {gameState.status === 'victory' && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-40 p-4 animate-in zoom-in-95 duration-300">
          <div className="text-center max-w-lg w-full p-5 sm:p-6 bg-gradient-to-b from-[#1c1917] to-[#0c0a09] border-2 border-yellow-500/80 rounded-3xl shadow-[0_0_60px_rgba(234,179,8,0.4)] text-white">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-tr from-yellow-400 via-amber-500 to-red-600 flex items-center justify-center text-3xl shadow-xl shadow-amber-500/50 animate-bounce">
              🏆
            </div>

            <h2 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-200 bg-clip-text text-transparent uppercase tracking-wider mb-1">
              BẢN ĐỒ VIỆT NAM HOÀN THÀNH!
            </h2>
            <p className="text-xs sm:text-sm text-yellow-200 font-bold mb-3">
              Chúc mừng toàn thể cộng đồng đã chung tay cắm cờ thành công!
            </p>

            {/* Victory Tabs: Quán Quân Top 1 vs Bảng Vàng Top 30 */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <button
                onClick={() => setVictoryTab('champion')}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                  victoryTab === 'champion'
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg shadow-amber-500/30'
                    : 'bg-white/10 text-gray-300 hover:text-white'
                }`}
              >
                👑 QUÁN QUÂN TOP 1
              </button>
              <button
                onClick={() => setVictoryTab('top30')}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                  victoryTab === 'top30'
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg shadow-amber-500/30'
                    : 'bg-white/10 text-gray-300 hover:text-white'
                }`}
              >
                🏅 BẢNG VÀNG TOP 30 ({gameState.leaderboard?.length || 0})
              </button>
            </div>

            {/* Tab 1: Champion Top 1 Podium */}
            {victoryTab === 'champion' && (
              <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-yellow-400/50 rounded-2xl p-4 mb-3 text-center">
                {gameState.leaderboard && gameState.leaderboard.length > 0 ? (
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-600 p-0.5 shadow-lg shadow-yellow-500/40 mb-2">
                      <div className="w-full h-full rounded-full bg-black/60 flex items-center justify-center text-xl overflow-hidden">
                        {gameState.leaderboard[0].avatar ? (
                          <img src={gameState.leaderboard[0].avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span>👑</span>
                        )}
                      </div>
                    </div>
                    <span className="text-base font-black text-yellow-300 uppercase tracking-wide">
                      {gameState.leaderboard[0].username || 'Quán Quân'}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-200 mt-0.5">
                      Đã cắm: {(gameState.leaderboard[0].totalCells || gameState.leaderboard[0].cells || 0).toLocaleString()} lá cờ Tổ Quốc
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">Tất cả người chơi đều là những anh hùng đóng góp!</p>
                )}
              </div>
            )}

            {/* Tab 2: Top 30 Scrollable */}
            {victoryTab === 'top30' && (
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 mb-3 custom-scrollbar">
                {(gameState.leaderboard || []).slice(0, 30).map((user, idx) => (
                  <div key={user.userId || idx} className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10 text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] ${
                        idx === 0 ? 'bg-yellow-400 text-black' : idx === 1 ? 'bg-slate-300 text-black' : idx === 2 ? 'bg-amber-600 text-white' : 'bg-white/10 text-gray-300'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="font-bold truncate max-w-[140px] text-white">{user.username}</span>
                    </div>
                    <span className="font-mono font-bold text-yellow-400">{(user.totalCells || user.cells || 0).toLocaleString()} ô</span>
                  </div>
                ))}
              </div>
            )}

            <div className="text-[11px] text-amber-300/80 animate-pulse">
              🔄 Tự động bắt đầu vòng mới trong giây lát...
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // THANH ĐIỀU KHIỂN CAMERA & GÓC NHÌN 3D NẰM BÊN NGOÀI KHUNG HÌNH (CHO CHẾ ĐỘ 9:16 - KHÔNG CHE PHIÊN LIVE)
  const renderExternalCameraControls = () => (
    <div className="flex flex-col gap-2 p-2.5 bg-black/60 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl text-white select-none max-w-[155px] shrink-0 animate-in fade-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
        <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
          <Compass size={12} /> Góc Nhìn 3D
        </span>
        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">9:16</span>
      </div>

      {/* 1. Quick Camera Presets */}
      <div className="space-y-1">
        <span className="text-[9px] font-bold text-gray-400 uppercase">Khu vực:</span>
        <div className="grid grid-cols-2 gap-1">
          {[
            { id: 'overview', icon: '🌐', label: 'Toàn cảnh' },
            { id: 'north', icon: '🏛️', label: 'Miền Bắc' },
            { id: 'central', icon: '🏖️', label: 'M.Trung' },
            { id: 'south', icon: '🏙️', label: 'Miền Nam' },
            { id: 'islands', icon: '🏝️', label: 'Hải Đảo' },
            { id: 'tip_camau', icon: '⛵', label: 'Cà Mau' },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => applyCameraPreset(p.id)}
              className={`px-1.5 py-1 rounded-lg text-[9px] font-bold flex items-center gap-1 transition-all truncate ${
                activeCameraPreset === p.id 
                  ? 'bg-amber-500 text-black shadow-md font-black ring-1 ring-yellow-300' 
                  : 'bg-white/5 text-gray-200 hover:bg-white/15'
              }`}
              title={p.label}
            >
              <span>{p.icon}</span>
              <span className="truncate">{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. 2D / 3D & Pan Mode Toggle */}
      <div className="space-y-1 pt-1 border-t border-white/10">
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => setViewMode3D(!viewMode3D)}
            className={`py-1 px-1 rounded-lg text-[9px] font-black transition-all flex items-center justify-center gap-1 ${
              viewMode3D 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
            }`}
          >
            <Globe size={10} className="text-yellow-300" />
            <span>{viewMode3D ? '3D' : '2D'}</span>
          </button>

          {viewMode3D && (
            <button
              onClick={() => setIsPanMode(!isPanMode)}
              className={`py-1 px-1 rounded-lg text-[9px] font-black transition-all flex items-center justify-center gap-0.5 ${
                isPanMode ? 'bg-amber-500 text-black ring-1 ring-yellow-300' : 'bg-white/10 text-gray-200 hover:bg-white/20'
              }`}
              title={isPanMode ? "Đang Pan Kéo" : "Bật Pan Kéo"}
            >
              <Move size={10} className={isPanMode ? 'text-black' : 'text-amber-300'} />
              <span>{isPanMode ? 'Pan' : 'Xoay'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. D-Pad Directional Pan Buttons */}
      <div className="space-y-1 pt-1 border-t border-white/10">
        <span className="text-[9px] font-bold text-gray-400 uppercase">Di chuyển map:</span>
        <div className="grid grid-cols-3 gap-0.5 max-w-[90px] mx-auto text-center">
          <div></div>
          <button onClick={() => handlePanStep(0, -25)} className="p-1 rounded bg-white/10 hover:bg-white/25 text-[9px] font-bold text-yellow-300" title="Lên">▲</button>
          <div></div>
          <button onClick={() => handlePanStep(-25, 0)} className="p-1 rounded bg-white/10 hover:bg-white/25 text-[9px] font-bold text-yellow-300" title="Trái">◀</button>
          <div className="flex items-center justify-center text-[8px] text-gray-500">🎯</div>
          <button onClick={() => handlePanStep(25, 0)} className="p-1 rounded bg-white/10 hover:bg-white/25 text-[9px] font-bold text-yellow-300" title="Phải">▶</button>
          <div></div>
          <button onClick={() => handlePanStep(0, 25)} className="p-1 rounded bg-white/10 hover:bg-white/25 text-[9px] font-bold text-yellow-300" title="Xuống">▼</button>
          <div></div>
        </div>
      </div>

      {/* 4. Zoom & Auto Rotate */}
      <div className="pt-1 border-t border-white/10 flex items-center justify-between gap-1">
        <div className="flex items-center gap-0.5">
          <button onClick={handleZoomIn} className="p-1 rounded bg-white/10 hover:bg-white/25 text-yellow-300" title="Zoom +">
            <ZoomIn size={11} />
          </button>
          <button onClick={handleZoomOut} className="p-1 rounded bg-white/10 hover:bg-white/25 text-yellow-300" title="Zoom -">
            <ZoomOut size={11} />
          </button>
        </div>

        {viewMode3D && (
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1 rounded text-[9px] font-bold flex items-center gap-0.5 ${autoRotate ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/15'}`}
            title="Xoay 3D"
          >
            <RotateCcw size={10} className={autoRotate ? 'animate-spin' : ''} />
            <span>{autoRotate ? 'Dừng' : 'Xoay'}</span>
          </button>
        )}
      </div>

      {/* 5. Bookmarks, Nhạc BGM, Chế Độ Sạch & Cài Đặt Game */}
      <div className="pt-1 border-t border-white/10 space-y-1">
        <button
          onClick={toggleUltraCleanCornerMode}
          className={`w-full py-1 px-1 rounded-lg text-[8.5px] font-black flex items-center justify-center gap-1 border transition-all ${
            isUltraCleanCornerMode 
              ? 'bg-emerald-600/90 border-emerald-400 text-white shadow-md' 
              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/15'
          }`}
          title="Bật/tắt chế độ lồng góc siêu sạch (Ẩn toàn bộ thanh tiêu đề to để không che video Live)"
        >
          <Sparkles size={9} className={isUltraCleanCornerMode ? 'text-yellow-300 animate-spin' : 'text-gray-400'} />
          <span>{isUltraCleanCornerMode ? '✨ Góc Siêu Sạch: BẬT' : '✨ Góc Siêu Sạch: TẮT'}</span>
        </button>

        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => setShowBookmarkManager(true)}
            className="py-1 px-1 rounded-lg text-[9px] font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 flex items-center justify-center gap-0.5 truncate"
            title="Quản lý vị trí ghim"
          >
            <BookmarkPlus size={9} />
            <span>Ghim</span>
          </button>
          <button
            onClick={() => setShowAudioModal(true)}
            className="py-1 px-1 rounded-lg text-[9px] font-bold bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 flex items-center justify-center gap-0.5 truncate"
            title="Cài đặt Nhạc nền 24/24"
          >
            <Music size={9} />
            <span>Nhạc</span>
          </button>
        </div>
        {onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            className="w-full py-1.5 px-2 rounded-lg text-[9px] font-black bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all"
          >
            <Settings size={10} />
            <span>Cài Đặt Game</span>
          </button>
        )}
      </div>
    </div>
  );

  // State cho Popover Menu Cài Đặt của Game Bản Đồ
  const [isGameMenuOpen, setIsGameMenuOpen] = useState(false);
  const gameMenuRef = useRef(null);

  // Đóng popover menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (gameMenuRef.current && !gameMenuRef.current.contains(e.target)) {
        setIsGameMenuOpen(false);
      }
    };
    if (isGameMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isGameMenuOpen]);

  // NẾU LÀ POPOUT / OVERLAY CHO TIKTOK STUDIO / OBS -> CHỈ RENDER DUY NHẤT SÂN KHẤU SẠCH 100%
  if (isPopout) {
    return (
      <div 
        className="w-full h-full relative overflow-hidden bg-[#070b14] select-none font-sans flex items-center justify-center"
        onPointerDown={handleUserGesture}
      >
        <div 
          className={`relative flex flex-col overflow-hidden transition-all duration-300 ${
            aspectRatio === '9:16'
              ? 'h-full max-h-full aspect-[9/16] w-auto max-w-full mx-auto'
              : 'w-full max-w-[1200px] h-auto max-h-full aspect-[16/9] mx-auto'
          }`}
          style={aspectRatio === '9:16' ? { aspectRatio: '9 / 16', height: '100%', maxWidth: 'calc(100vh * 9 / 16)' } : { aspectRatio: '16 / 9', width: '100%' }}
        >
          {renderCleanStage()}
        </div>
      </div>
    );
  }

  // GIAO DIỆN PHẦN MỀM CHÍNH (STREAMER VIEW): SÂN KHẤU SẠCH 100% (KHÔNG CÓ THANH CÔNG CỤ CHE KHUẤT)
  return (
    <div 
      className={`relative w-full h-full flex items-center justify-center p-2 sm:p-3 overflow-hidden select-none font-sans ${
        isLightTheme ? 'bg-slate-200 text-slate-900' : 'bg-[#05070c] text-white'
      }`}
      onPointerDown={handleUserGesture}
    >
      <div 
        className={`relative flex flex-col overflow-hidden transition-all duration-300 ${
          aspectRatio === '9:16'
            ? 'h-full max-h-full aspect-[9/16] w-auto max-w-full mx-auto rounded-2xl md:rounded-3xl border border-yellow-500/30 shadow-[0_0_50px_rgba(0,0,0,0.85)]'
            : 'w-full max-w-[1200px] h-auto max-h-full aspect-[16/9] rounded-2xl border border-yellow-500/30 shadow-[0_0_50px_rgba(0,0,0,0.85)]'
        } ${isLightTheme ? 'bg-slate-50' : 'bg-[#070b14]'}`}
        style={aspectRatio === '9:16' ? { aspectRatio: '9 / 16', maxHeight: '100%', maxWidth: 'calc(100vh * 9 / 16)' } : {}}
      >
        {/* SÂN KHẤU LIVE SẠCH NẰM Ở ĐÂY (Canvas + Top mini stage + Victory + Side panels) */}
        {renderCleanStage()}
      </div>

      {/* THANH ĐIỀU KHIỂN NẰM BÊN NGOÀI KHUNG HÌNH 9:16 (MÉ BÊN PHẢI) - KHÔNG CHE PHIÊN LIVE */}
      {aspectRatio === '9:16' && (
        <div className="hidden sm:flex flex-col ml-3 z-30 pointer-events-auto">
          {renderExternalCameraControls()}
        </div>
      )}

      {/* AUDIO & SFX SETTINGS MODAL */}
      {showAudioModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[#161a23] border border-purple-500/40 rounded-2xl max-w-md w-full p-5 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
                  <Music size={18} />
                </span>
                <div>
                  <h3 className="font-black text-sm text-white">Cài Đặt Âm Thanh & Nhạc Nền 24/24</h3>
                  <p className="text-[10px] text-gray-400">Bật/Tắt riêng Nhạc Nền BGM & Hiệu Ứng SFX cho Game</p>
                </div>
              </div>
              <button onClick={() => setShowAudioModal(false)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3.5 max-h-[70vh] overflow-y-auto custom-scrollbar pr-1">
              {/* 1. Toggle BGM, SFX & Voice AI 3-Way Switches */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    const next = bandoAudio.toggleBgm();
                    setIsBgmPlaying(next);
                  }}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    isBgmPlaying
                      ? 'bg-purple-950/70 border-purple-400 text-purple-200 shadow-md ring-1 ring-purple-400'
                      : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'
                  }`}
                >
                  <Music size={15} className={isBgmPlaying ? 'text-purple-300 animate-pulse' : 'text-gray-500'} />
                  <span className="text-[10px] font-black">{isBgmPlaying ? '🎵 BGM: BẬT' : '🎵 BGM: TẮT'}</span>
                </button>

                <button
                  onClick={() => {
                    const next = bandoAudio.toggleSfx();
                    setIsSfxMuted(!next);
                  }}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    !isSfxMuted
                      ? 'bg-amber-950/70 border-amber-400 text-amber-200 shadow-md ring-1 ring-amber-400'
                      : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'
                  }`}
                >
                  <Volume2 size={15} className={!isSfxMuted ? 'text-amber-300' : 'text-gray-500'} />
                  <span className="text-[10px] font-black">{!isSfxMuted ? '🔊 SFX: BẬT' : '🔊 SFX: TẮT'}</span>
                </button>

                <button
                  onClick={() => {
                    const next = bandoAudio.toggleVoice();
                    setIsVoiceMuted(!next);
                  }}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    !isVoiceMuted
                      ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200 shadow-md ring-1 ring-cyan-400'
                      : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'
                  }`}
                >
                  <Mic size={15} className={!isVoiceMuted ? 'text-cyan-300' : 'text-gray-500'} />
                  <span className="text-[10px] font-black">{!isVoiceMuted ? '🎙️ VOICE: BẬT' : '🎙️ VOICE: TẮT'}</span>
                </button>
              </div>

              {/* 2. Timer Mode */}
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5">Chế Độ Phát / Hẹn Giờ Nhạc:</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: '24/7', label: 'Vô Tận (24/24)' },
                    { id: '30m', label: 'Hẹn Giờ: 30 Phút' },
                    { id: '60m', label: 'Hẹn Giờ: 60 Phút' },
                    { id: '120m', label: 'Hẹn Giờ: 120 Phút' },
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setBgmTimerMode(m.id);
                        try {
                          if (bandoAudio && typeof bandoAudio.setBgmTimerMode === 'function') {
                            bandoAudio.setBgmTimerMode(m.id);
                          } else if (bandoAudio && typeof bandoAudio.setBgmTimer === 'function') {
                            bandoAudio.setBgmTimer(m.id);
                          }
                        } catch (e) {
                          console.error('Lỗi setBgmTimer:', e);
                        }
                      }}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border ${
                        bgmTimerMode === m.id
                          ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-500/40'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. BGM Volume Slider */}
              <div className="p-3 bg-black/40 rounded-xl border border-purple-500/20 space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-300">
                  <span className="flex items-center gap-1"><Music size={12} className="text-purple-400" /> Âm lượng Nhạc Nền (BGM):</span>
                  <span className="font-mono text-purple-300 font-black">{Math.round(bgmVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={bgmVolume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setBgmVolumeState(val);
                    bandoAudio.setBgmVolume(val);
                  }}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              {/* 4. SFX Volume Slider */}
              <div className="p-3 bg-black/40 rounded-xl border border-amber-500/20 space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-300">
                  <span className="flex items-center gap-1"><Volume2 size={12} className="text-amber-400" /> Âm lượng Hiệu Ứng Game (SFX):</span>
                  <span className="font-mono text-amber-300 font-black">{Math.round(sfxVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={sfxVolume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setSfxVolumeState(val);
                    bandoAudio.setSfxVolume(val);
                  }}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* 5. Voice AI Volume Slider */}
              <div className="p-3 bg-black/40 rounded-xl border border-cyan-500/20 space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-300">
                  <span className="flex items-center gap-1"><Mic size={12} className="text-cyan-400" /> Âm lượng Giọng Đọc AI (Voice):</span>
                  <span className="font-mono text-cyan-300 font-black">{Math.round(voiceVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={voiceVolume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setVoiceVolumeState(val);
                    bandoAudio.setVoiceVolume(val);
                  }}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <button
                onClick={() => setShowAudioModal(false)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs transition-all shadow-lg shadow-purple-600/30"
              >
                ✓ Hoàn Tất & Áp Dụng Cho Game
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOOKMARK MANAGER MODAL */}
      {showBookmarkManager && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[#161a23] border border-amber-500/40 rounded-2xl max-w-md w-full p-5 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <BookmarkPlus size={18} className="text-amber-400" />
                <h3 className="font-bold text-sm">Quản Lý Vị Trí Ghim Camera</h3>
              </div>
              <button onClick={() => setShowBookmarkManager(false)} className="text-gray-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar mb-4">
              {customBookmarks.map((bm) => (
                <div key={bm.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-all">
                  <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                    <span className="text-base">{bm.icon || '📍'}</span>
                    {editingBookmarkId === bm.id ? (
                      <div className="flex items-center gap-1 flex-1">
                        <input
                          type="text"
                          value={editingBookmarkName}
                          onChange={(e) => setEditingBookmarkName(e.target.value)}
                          className="bg-black/60 border border-amber-400 rounded px-2 py-0.5 text-xs text-white outline-none w-full"
                          autoFocus
                        />
                        <button
                          onClick={() => handleRenameBookmark(bm.id, editingBookmarkName)}
                          className="p-1 rounded bg-emerald-600 text-white"
                        >
                          <Check size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-white truncate">{bm.name}</span>
                        <span className="text-[9px] text-gray-400 font-mono">Pos: [{bm.pos.join(', ')}]</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleApplyBookmark(bm)}
                      className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 text-[10px] font-bold"
                    >
                      Nhảy tới
                    </button>
                    <button
                      onClick={() => {
                        setEditingBookmarkId(bm.id);
                        setEditingBookmarkName(bm.name);
                      }}
                      className="p-1 rounded text-gray-400 hover:text-white"
                      title="Đổi tên"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => handleDeleteBookmark(bm.id)}
                      className="p-1 rounded text-red-400 hover:text-red-300"
                      title="Xóa"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveCurrentCameraAsNewBookmark}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Plus size={14} /> Ghim Góc Nhìn Hiện Tại
              </button>
              <button
                onClick={handleRestoreDefaultBookmarks}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-bold"
                title="Khôi phục 3 vị trí mặc định"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CÀI ĐẶT BẢNG ĐIỆN & KHO QUÀ TẶNG CẮM CỜ 3 MIỀN */}
      <LiveGiftConfigModal
        isOpen={showGiftConfigModal}
        onClose={() => setShowGiftConfigModal(false)}
        mode="map"
        onTestGift={handleTestGiftMarquee}
      />
    </div>
  );
}
