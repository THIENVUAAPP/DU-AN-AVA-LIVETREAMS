import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Play, Pause, RotateCcw, Shield, Sparkles, Trophy, Flame, 
  MapPin, Flag, Eye, EyeOff, Volume2, VolumeX, Maximize2, Zap, Star,
  Compass, Award, ChevronRight, Layers, CheckCircle2, AlertTriangle, 
  MonitorPlay, Sun, Moon, Move, ZoomIn, ZoomOut, Search, Globe, Navigation, Compass as CompassIcon,
  Sliders, Settings, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RefreshCw,
  Bookmark, BookmarkPlus, BookmarkCheck, Edit2, Trash2, Plus, Save, Check, X, Crosshair,
  Crown, Medal, Music, Clock, Smartphone
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

// Function tạo Texture Quốc Kỳ siêu sắc nét, rực rỡ, đẳng cấp cho từng ô pixel/voxel 3D
function createCountryFlagTexture(countryCode = 'vietnam') {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (countryCode === 'japan') {
    // 🇯🇵 Nhật Bản: Nền trắng ngà siêu nét + Viền khối + Mặt trời đỏ rực rỡ
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, 250, 250);
    ctx.fillStyle = '#BC002D';
    ctx.beginPath();
    ctx.arc(128, 128, 76, 0, Math.PI * 2);
    ctx.fill();
  } else if (countryCode === 'korea') {
    // 🇰🇷 Hàn Quốc: Nền trắng + Âm Dương Thái Cực
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, 250, 250);
    ctx.fillStyle = '#CD2E3A';
    ctx.beginPath();
    ctx.arc(128, 128, 72, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#0047A0';
    ctx.beginPath();
    ctx.arc(128, 128, 72, 0, Math.PI);
    ctx.fill();
  } else if (countryCode === 'usa') {
    // 🇺🇸 Mỹ: Sọc đỏ trắng + Góc xanh sao
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#B22234';
    for (let s = 0; s < 7; s++) {
      ctx.fillRect(0, s * 36.5, 256, 18.25);
    }
    ctx.fillStyle = '#3C3B6E';
    ctx.fillRect(0, 0, 110, 110);
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(55, 55, 24, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // 🇻🇳 VIỆT NAM (Mặc định): Nền đỏ cờ thắm hoàng gia + Viền khối vàng hổ phách + Ngôi sao vàng 5 cánh chuẩn tỷ lệ sắc nét tuyệt đối
    const redGrad = ctx.createLinearGradient(0, 0, 256, 256);
    redGrad.addColorStop(0, '#DA251D');
    redGrad.addColorStop(1, '#B91C1C');
    ctx.fillStyle = redGrad;
    ctx.fillRect(0, 0, 256, 256);

    // Viền khối 3D tạo chiều sâu chắc chắn cho từng khối voxel
    ctx.strokeStyle = '#7F1D1D';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, 248, 248);

    // Viền ánh kim vàng nhẹ bên trong tăng độ sang trọng
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 8, 240, 240);

    // Ngôi sao vàng 5 cánh chuẩn tỷ lệ hình học quốc kỳ, sắc sảo từ mọi góc nhìn
    const cx = 128, cy = 128, outerR = 82, innerR = 33;
    
    // Gradient vàng hoàng kim rực rỡ
    const goldGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, outerR);
    goldGrad.addColorStop(0, '#FFFBEB');
    goldGrad.addColorStop(0.3, '#FDE047');
    goldGrad.addColorStop(1, '#EAB308');
    
    ctx.fillStyle = goldGrad;
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

    // Viền nét vàng đậm định hình cánh sao
    ctx.strokeStyle = '#CA8A04';
    ctx.lineWidth = 2;
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
}) {
  const [gameState, setGameState] = useState(() => bandoEngine.state);
  const [viewMode3D, setViewMode3D] = useState(true);
  const [isAutoTesting, setIsAutoTesting] = useState(false);
  const [autoTestStep, setAutoTestStep] = useState(0);
  const [showSidePanels, setShowSidePanels] = useState(true);
  const [activeCameraPreset, setActiveCameraPreset] = useState('overview');
  const [autoRotate, setAutoRotate] = useState(() => bandoEngine.state.autoRotate || false);
  const [isPanMode, setIsPanMode] = useState(false);
  const [recentClaimBadges, setRecentClaimBadges] = useState([]);
  const [victoryTab, setVictoryTab] = useState('champion'); // 'champion' | 'top30'
  const [isAuto247, setIsAuto247] = useState(() => bandoEngine.isAuto247Running);
  const [isBgmLoop, setIsBgmLoop] = useState(() => bandoAudio.isBgmLoop);
  const [isBgmPlaying, setIsBgmPlaying] = useState(() => bandoAudio.bgmPlaying);
  const [bgmTimerMode, setBgmTimerMode] = useState(() => bandoAudio.bgmTimerMode || '24/7');
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [bgmVolume, setBgmVolumeState] = useState(() => bandoAudio.bgmVolume);
  const [sfxVolume, setSfxVolumeState] = useState(() => bandoAudio.sfxVolume);
  const [isLiveCleanMode, setIsLiveCleanMode] = useState(isPopout);
  const [aspectRatio, setAspectRatio] = useState(() => {
    try {
      return localStorage.getItem('avalive_map_aspect_ratio') || '16:9';
    } catch (e) {
      return '16:9';
    }
  });
  const isLightTheme = gameState.settings?.theme === 'light';

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
      setIsAuto247(bandoEngine.isAuto247Running);
      if (newState.autoRotate !== undefined) {
        setAutoRotate(newState.autoRotate);
      }
      if (newState.cameraPreset) {
        setActiveCameraPreset(newState.cameraPreset);
      }

      // Khi reset vòng chơi mới, dọn sạch toàn bộ huy hiệu cũ trên bản đồ
      if (lastEvt && (lastEvt.type === 'ROUND_RESET' || lastEvt.type === 'RESET')) {
        setRecentClaimBadges([]);
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
    const handleBgmStatus = (e) => {
      setIsBgmPlaying(e.detail?.playing ?? bandoAudio.bgmPlaying);
    };

    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    window.addEventListener('bando-bgm-status', handleBgmStatus);

    const handleTriggerDemo = () => {
      const mockUsers = ['Minh Trí', 'Thanh Hằng', 'Bảo Long', 'Hồng Nhung', 'Khánh An', 'Tuấn Kiệt', 'Đức Anh', 'Hương Giang'];
      const mockGifts = [
        { id: 'flag', name: 'Lá Cờ Tổ Quốc', cells: 1, diamondCount: 1 },
        { id: 'rose', name: 'Hoa Hồng', cells: 5, diamondCount: 1 },
        { id: 'hat', name: 'Nón Lá Việt Nam', cells: 20, diamondCount: 10 },
        { id: 'heart', name: 'Trái Tim Yêu Nước', cells: 50, diamondCount: 50 },
        { id: 'dragon', name: 'Thần Long Việt Nam', cells: 200, diamondCount: 1000 }
      ];
      const randUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      const randGift = mockGifts[Math.floor(Math.random() * mockGifts.length)];
      
      bandoAudio.unlock();
      bandoEngine.handleGift({
        userId: 'demo_' + Math.floor(Math.random() * 10000),
        username: randUser,
        avatar: '',
        giftId: randGift.id,
        giftName: randGift.name,
        count: 1,
        diamondCount: randGift.diamondCount,
      });
    };

    window.addEventListener('bando-trigger-demo', handleTriggerDemo);

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('bando-bgm-status', handleBgmStatus);
      window.removeEventListener('bando-trigger-demo', handleTriggerDemo);
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
    const cellDim = Math.min(0.94, Math.max(0.35, 0.88 * Math.sqrt(15125 / count)));
    state.cellDim = cellDim;
    const boxGeo = new THREE.BoxGeometry(cellDim, 1, cellDim);
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

      const scaleY = isClaimed ? 1.75 : 0.16;
      const posY = scaleY / 2;

      const curDim = state.cellDim || 0.88;
      dummy.position.set(wx, posY, wz);
      dummy.scale.set(curDim, scaleY, curDim);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);

      if (isClaimed) {
        // Ô đã cắm cờ (người xem tặng quà): Lắp lá cờ quốc kỳ 3D vươn cao, màu đỏ thắm đậm sắc nét tuyệt đối
        instancedMesh.setColorAt(i, new THREE.Color(1.0, 1.0, 1.0));
      } else {
        // Ô nền lãnh thổ CHƯA cắm cờ: Tối mờ sâu, chìm hẳn xuống dưới, chỉ thấy mờ mờ bóng dáng lãnh thổ
        instancedMesh.setColorAt(i, isLightTheme ? new THREE.Color(0.12, 0.09, 0.10) : new THREE.Color(0.08, 0.06, 0.07));
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
        const intersects = raycaster.intersectObject(state.instancedMesh);
        if (intersects.length > 0) {
          const hit = intersects[0];
          const instanceId = hit.instanceId;
          bandoAudio.unlock();
          bandoAudio.playCellPop();

          bandoEngine.handleGift({
            userId: 'streamer_host',
            username: '🌟 Chủ Phòng Live',
            avatar: '',
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

    return () => {
      state.disposed = true;
      if (state.animFrameId) cancelAnimationFrame(state.animFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handleDomPointerDown);
      renderer.domElement.removeEventListener('pointerup', handleDomPointerUp);
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
        bandoEngine.handleGift({
          userId: 'streamer_host',
          username: '🌟 Chủ Phòng Live',
          avatar: '',
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
      const scaleY = isClaimed ? 1.75 : 0.16;
      const posY = scaleY / 2;
      const wx = (cell.x - cols / 2) * 1.0;
      const wz = (cell.y - rows / 2) * 1.0;

      const curDim = state.cellDim || 0.88;
      dummy.position.set(wx, posY, wz);
      dummy.scale.set(curDim, scaleY, curDim);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);

      if (isClaimed) {
        // Ô đã cắm cờ (người xem tặng quà): Lắp lá cờ quốc kỳ 3D vươn cao, màu đỏ thắm đậm sắc nét tuyệt đối
        instancedMesh.setColorAt(i, new THREE.Color(1.0, 1.0, 1.0));
      } else {
        // Ô nền lãnh thổ CHƯA cắm cờ: Tối mờ sâu, chìm hẳn xuống dưới, chỉ thấy mờ mờ bóng dáng lãnh thổ
        instancedMesh.setColorAt(i, isLightTheme ? new THREE.Color(0.12, 0.09, 0.10) : new THREE.Color(0.08, 0.06, 0.07));
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
        // Ô đã cắm cờ (Tặng quà): Cờ đỏ thắm tươi #DA251D, sắc nét tuyệt đối
        ctx.fillStyle = '#DA251D';
        ctx.fillRect(cx, cy, cellSize, cellSize);

        // Ngôi sao vàng mini ở trung tâm ô pixel
        if (cellSize >= 3.0) {
          ctx.fillStyle = '#FFFF00';
          const r = cellSize * 0.32;
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
        // Ô nền CHƯA cắm cờ: Tối mờ sâu, chìm hẳn xuống dưới
        ctx.fillStyle = isLightTheme ? 'rgba(120, 20, 25, 0.10)' : 'rgba(40, 10, 12, 0.22)';
        ctx.fillRect(cx, cy, cellSize, cellSize);

        // Chỉ khi zoom rất gần mới vẽ sao mờ trên nền
        if (cellSize >= 7.0) {
          ctx.fillStyle = isLightTheme ? 'rgba(180, 100, 10, 0.15)' : 'rgba(150, 90, 10, 0.15)';
          const r = cellSize * 0.20;
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
        ctx.lineWidth = 2;
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeText(item.text, lx, ly);
        ctx.fillText(item.text, lx, ly);
      }
    });
  }, [viewMode3D, pan2D, zoom2D, gameState.claimedCount, isLightTheme]);

  // HÀM RENDER SÂN KHẤU LIVE SẠCH 100% (Pure Clean Stage Viewport)
  const renderCleanStage = () => (
    <div className="relative w-full h-full overflow-hidden select-none font-sans">
      {/* 3D Container or 2D Canvas */}
      {viewMode3D ? (
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      ) : (
        <canvas 
          ref={canvas2dRef} 
          width={1280} 
          height={720} 
          className="w-full h-full cursor-move"
          onMouseDown={handleMouseDown2D}
          onMouseMove={handleMouseMove2D}
          onMouseUp={handleMouseUp2D}
          onWheel={handleWheel2D}
        />
      )}

      {/* TOP MINI STAGE HEADER (Chỉ chứa thông tin Live sạch 100% - KHÔNG CÓ NÚT BẤM) */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-20 pointer-events-none">
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

      {/* User Claim Flag Badges Floating Overlay Layer */}
      <div ref={claimBadgesLayerRef} className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
        {recentClaimBadges.map(b => (
          <div
            key={b.id}
            ref={el => badgeRefs.current[b.id] = el}
            className="absolute top-0 left-0 hidden flex-col items-center pointer-events-none transition-all duration-100 animate-in zoom-in-50 fade-in duration-200"
            style={{ willChange: 'transform' }}
          >
            <div className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white font-black text-[11px] shadow-2xl border border-yellow-300 ring-2 ring-yellow-400/60 whitespace-nowrap">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs overflow-hidden border border-white/40 shrink-0">
                {b.avatar ? (
                  <img src={b.avatar} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                ) : (
                  <span>👤</span>
                )}
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[10px] text-yellow-200 font-bold truncate max-w-[90px]">{b.username}</span>
                <span className="text-[9px] text-white flex items-center gap-0.5">
                  🇻🇳 +{b.giftCells} ô {b.multiplier > 1 && <strong className="text-yellow-300">x{b.multiplier}</strong>}
                </span>
              </div>
            </div>
            <div className="w-0.5 h-3 bg-gradient-to-b from-yellow-400 to-transparent" />
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
                      Đã cắm: {gameState.leaderboard[0].cells?.toLocaleString() || 0} lá cờ Tổ Quốc
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
                    <span className="font-mono font-bold text-yellow-400">{user.cells} ô</span>
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

  // NẾU LÀ POPOUT / OVERLAY CHO TIKTOK STUDIO / OBS $\rightarrow$ CHỈ RENDER DUY NHẤT SÂN KHẤU SẠCH 100%
  if (isPopout) {
    return (
      <div 
        className="w-full h-full relative overflow-hidden bg-[#070b14] select-none font-sans"
        onPointerDown={handleUserGesture}
      >
        {renderCleanStage()}
      </div>
    );
  }

  // GIAO DIỆN PHẦN MỀM CHÍNH (STREAMER VIEW): TÁCH RỜI THANH QUẢN TRỊ BÊN NGOÀI KHUNG LIVE
  return (
    <div 
      className={`relative w-full h-full flex flex-col font-sans select-none transition-colors duration-300 ${
        isLightTheme ? 'bg-slate-100 text-slate-900' : 'bg-[#05070c] text-white'
      } overflow-hidden`}
      onPointerDown={handleUserGesture}
    >
      {/* 1. OUTER TOP HOST CONTROL BAR (Nằm bên ngoài khung live) */}
      <div className={`relative z-20 flex items-center justify-between px-3 py-2 border-b shrink-0 gap-2 flex-wrap sm:flex-nowrap shadow-sm ${
        isLightTheme ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#0d1017] border-white/10 text-white'
      }`}>
        {/* Left Side: Title & Status */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-red-600 via-amber-500 to-yellow-400 flex items-center justify-center text-sm shadow-md">
            <span>{currentCountry?.flag || '🇻🇳'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-wider bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
              {gameState.settings.customMapTitle || `${currentCountry?.name || 'Việt Nam'} ${t.title}`}
            </span>
            <span className="text-[10px] text-gray-400">
              Vòng {gameState.roundId} • {gameState.percent}% ({gameState.claimedCount.toLocaleString()}/{gameState.totalCells.toLocaleString()})
            </span>
          </div>
        </div>

        {/* Right Side: Host Management Controls */}
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {/* Nút Chuyển Tỷ Lệ Khung Hình: 9:16 (TikTok Dọc) vs 16:9 (OBS Ngang) */}
          <button
            onClick={handleToggleAspectRatio}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition-all border flex items-center gap-1 shadow-sm ${
              aspectRatio === '9:16'
                ? 'bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white border-pink-300 ring-2 ring-pink-400/50 shadow-pink-500/30'
                : isLightTheme
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-700 border-slate-300'
                : 'bg-white/10 hover:bg-white/20 text-cyan-300 border-white/10'
            }`}
            title={aspectRatio === '9:16' ? "Đang ở Khung Hình 9:16 (Chuẩn TikTok Live Dọc) — Bấm chuyển sang 16:9 (Ngang OBS/PC)" : "Đang ở Khung Hình 16:9 (Ngang OBS/PC) — Bấm chuyển sang 9:16 (Chuẩn TikTok Live Dọc)"}
          >
            <Smartphone size={13} className={aspectRatio === '9:16' ? 'text-yellow-300' : 'text-cyan-300'} />
            <span>{aspectRatio === '9:16' ? '📱 9:16 TikTok' : '🖥️ 16:9 OBS'}</span>
          </button>

          {/* Nút Mở Nhạc Nền 24/24 */}
          <div className="flex items-center rounded-lg border border-purple-500/40 bg-purple-950/40 p-0.5 shadow-sm">
            <button
              onClick={(e) => {
                e.stopPropagation();
                bandoAudio.ensureContext();
                const playing = bandoAudio.toggleBgm();
                setIsBgmPlaying(playing);
              }}
              className={`px-2 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                isBgmPlaying
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/30'
                  : 'text-purple-300 hover:text-white hover:bg-white/10'
              }`}
              title={isBgmPlaying ? `Nhạc nền đang PHÁT — Bấm để TẠM DỪNG` : "Bấm để MỞ NHẠC NỀN ngay"}
            >
              <Music size={12} className={isBgmPlaying ? 'text-yellow-300 fill-yellow-300 animate-pulse' : 'text-gray-400'} />
              <span>{isBgmPlaying ? `Nhạc ${bgmTimerMode}` : 'Mở Nhạc'}</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAudioModal(true);
              }}
              className="p-1 rounded-md text-purple-300 hover:text-white hover:bg-purple-800/50 transition-all border-l border-purple-400/20"
              title="Cài Đặt Nhạc Nền 24/24 & Hẹn Giờ"
            >
              <Sliders size={12} />
            </button>
          </div>

          {/* Nút Auto 24/7 */}
          <button
            onClick={() => {
              bandoEngine.toggleAuto247();
              setIsAuto247(bandoEngine.isAuto247Running);
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition-all border flex items-center gap-1 shadow-md ${
              isAuto247
                ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 text-white border-emerald-300 ring-2 ring-emerald-400 animate-pulse shadow-emerald-500/40'
                : isLightTheme
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-700 border-slate-300'
                : 'bg-white/10 hover:bg-white/20 text-yellow-300 border-white/10'
            }`}
            title="Bật/Tắt Tự Động 24/24"
          >
            <Zap size={12} className={isAuto247 ? 'text-yellow-300 fill-yellow-300 animate-bounce' : 'text-yellow-400'} />
            <span>{isAuto247 ? '⚡ 24/7: BẬT' : '⚡ Auto 24/7'}</span>
          </button>

          {/* Sáng / Tối */}
          <button
            onClick={() => {
              const nextTheme = gameState.settings?.theme === 'light' ? 'dark' : 'light';
              bandoEngine.setTheme(nextTheme);
            }}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1 ${
              isLightTheme ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-indigo-950/70 text-indigo-200 border-indigo-500/40'
            }`}
            title={isLightTheme ? "Chuyển sang Nền Tối" : "Chuyển sang Nền Sáng"}
          >
            {isLightTheme ? <Sun size={13} className="text-amber-600" /> : <Moon size={13} className="text-indigo-400" />}
          </button>

          {/* 3D / 2D */}
          <button
            onClick={() => setViewMode3D(!viewMode3D)}
            className="px-2 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 bg-white/10 hover:bg-white/20 text-gray-200 border-white/10"
            title={viewMode3D ? "Chuyển sang 2D" : "Chuyển sang 3D"}
          >
            <Layers size={13} />
            <span>{viewMode3D ? '3D' : '2D'}</span>
          </button>

          {/* Xoay / Tĩnh */}
          <button
            onClick={handleToggleAutoRotate}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1 ${
              autoRotate ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-white/10 text-gray-300 border-white/10'
            }`}
            title={autoRotate ? "Bản đồ đang xoay — Bấm để Đứng yên" : "Bấm để Tự động xoay"}
          >
            <RefreshCw size={13} className={autoRotate ? 'animate-spin' : ''} />
            <span>{autoRotate ? 'Xoay' : 'Tĩnh'}</span>
          </button>

          {/* Bảng Bên Hông */}
          <button
            onClick={() => setShowSidePanels(!showSidePanels)}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all border ${
              showSidePanels ? 'bg-white/10 text-gray-200 border-white/10' : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
            }`}
            title={showSidePanels ? "Ẩn bảng bên hông" : "Hiện bảng bên hông"}
          >
            {showSidePanels ? <Eye size={13} /> : <EyeOff size={13} />}
          </button>

          {/* Toàn Cảnh */}
          <button
            onClick={handleResetOverview}
            className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              activeBookmarkId === 'overview'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-gray-200'
            }`}
            title="Quay về góc nhìn Toàn Cảnh"
          >
            <span>🏠 Toàn Cảnh</span>
          </button>

          {/* Ghim & Vị trí Camera */}
          {customBookmarks.slice(0, 3).map((bm) => (
            <button
              key={bm.id}
              onClick={() => handleApplyBookmark(bm)}
              className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeBookmarkId === bm.id
                  ? 'bg-gradient-to-r from-red-600 to-yellow-500 text-white shadow-md font-black border border-yellow-300'
                  : 'bg-white/5 hover:bg-white/15 text-gray-300'
              }`}
              title={bm.name}
            >
              <span>{bm.icon || '📍'}</span>
              <span>{bm.shortName || bm.name}</span>
            </button>
          ))}

          <button
            onClick={() => setShowBookmarkManager(prev => !prev)}
            className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all"
            title="Ghim / Quản lý vị trí camera"
          >
            <BookmarkPlus size={13} />
          </button>

          {/* Nút Bàn Cờ Mới (Đặt lên trên Top Bar) */}
          <button
            onClick={() => bandoEngine.resetRound()}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 flex items-center gap-1 transition-colors"
            title="Làm mới bàn cờ về trạng thái ban đầu"
          >
            <RotateCcw size={13} />
            <span>Bàn cờ mới</span>
          </button>

          {/* Admin Modal Shortcut */}
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="px-2.5 py-1.5 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/40 text-xs font-black flex items-center gap-1 transition-all"
              title="Mở Bảng Quản trị Admin"
            >
              <Settings size={13} />
              <span>Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. CENTER LIVE STAGE VIEWPORT (Khung hình Live Sạch 100% - Chiều cao tối đa trọn vẹn 9:16 & 16:9) */}
      <div className="flex-1 w-full h-full flex items-center justify-center p-1 sm:p-2 overflow-hidden bg-[#04060a]">
        <div 
          className={`relative flex flex-col overflow-hidden transition-all duration-300 ${
            aspectRatio === '9:16'
              ? 'w-full max-w-[440px] h-full max-h-[96%] aspect-[9/16] rounded-2xl md:rounded-3xl border border-yellow-500/30 shadow-[0_0_50px_rgba(0,0,0,0.85)] bg-[#070b14]'
              : 'w-full max-w-[1200px] h-auto max-h-full aspect-[16/9] rounded-2xl border border-yellow-500/30 shadow-[0_0_50px_rgba(0,0,0,0.85)] bg-[#070b14]'
          }`}
        >
          {/* SÂN KHẤU LIVE SẠCH NẰM Ở ĐÂY (Canvas + Top mini stage + Victory + Side panels) */}
          {renderCleanStage()}
        </div>
      </div>

      {/* AUDIO SETTINGS MODAL */}
      {showAudioModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[#161a23] border border-purple-500/40 rounded-2xl max-w-sm w-full p-5 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Music size={18} className="text-purple-400" />
                <h3 className="font-bold text-sm">Cài Đặt Nhạc Nền 24/24</h3>
              </div>
              <button onClick={() => setShowAudioModal(false)} className="text-gray-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5">Chế Độ Phát / Hẹn Giờ:</label>
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
                        bandoAudio.setBgmTimer(m.id);
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

              <div>
                <div className="flex justify-between text-xs font-bold text-gray-300 mb-1">
                  <span>Âm lượng Nhạc Nền (BGM):</span>
                  <span className="font-mono text-purple-300">{Math.round(bgmVolume * 100)}%</span>
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

              <div>
                <div className="flex justify-between text-xs font-bold text-gray-300 mb-1">
                  <span>Âm lượng Hiệu Ứng (SFX):</span>
                  <span className="font-mono text-cyan-300">{Math.round(sfxVolume * 100)}%</span>
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
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            </div>

            <div className="mt-5">
              <button
                onClick={() => setShowAudioModal(false)}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors"
              >
                Xong / Đóng
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
    </div>
  );
}
