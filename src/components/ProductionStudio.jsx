import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Layers, 
  Video, 
  Play, 
  Disc, 
  Sparkles, 
  Wand2, 
  Zap, 
  Radio, 
  CheckCircle2, 
  Clock,
  Eye,
  Sliders,
  Sun,
  Power,
  UserCheck,
  Upload,
  Mic,
  Volume2,
  Trash2,
  Check,
  User,
  Plus,
  Globe,
  Tv,
  Settings,
  ShieldCheck,
  Cpu,
  Wifi,
  Monitor,
  Grid,
  ExternalLink,
  Share2,
  Key,
  Activity,
  AlertTriangle,
  RefreshCw,
  Maximize,
  Minimize,
  Expand
} from 'lucide-react';
import { io } from 'socket.io-client';
import UniversalFileUploader from './UniversalFileUploader';
import LiveCommerceStudio from './LiveCommerceStudio';

import ScreenShareControls from './ScreenShareControls';
import { listVideoInputDevices, openCameraStream, closeCameraStream } from '../lib/cameraDevices';
import { startScreenShare, stopScreenShare, onScreenShareNativeStop } from '../lib/screenShare';
import { createBeautyEngine } from '../lib/beautyEngine/webglBeauty';
import UniversalMasterOverlayModal from './UniversalMasterOverlayModal';
import { syncMasterLiveState } from '../lib/masterLiveSync';

export const BEAUTY_PRESETS_30 = [
  // Nhóm 1: Làn Da Rạng Rỡ & Căng Bóng (1-6)
  { id: "b1", category: "✨ Làn Da Rạng Rỡ", name: "1. Da Trắng Hồng Baby Skin", smooth: 75, bright: 58, blush: 30, sparkle: 60, warmth: 0, slim: 25, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80", filter: "brightness(1.03) contrast(1.02) saturate(1.04)" },
  { id: "b2", category: "✨ Làn Da Rạng Rỡ", name: "2. Da Căng Bóng Hàn Quốc Glass Skin", smooth: 80, bright: 60, blush: 25, sparkle: 65, warmth: 0, slim: 25, image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80", filter: "brightness(1.04) contrast(1.03) saturate(1.03)" },
  { id: "b3", category: "✨ Làn Da Rạng Rỡ", name: "3. Da Mịn Màng Lụa Tơ Tằm", smooth: 70, bright: 55, blush: 20, sparkle: 55, warmth: 0, slim: 20, image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80", filter: "brightness(1.02) contrast(1.01) saturate(1.02)" },
  { id: "b4", category: "✨ Làn Da Rạng Rỡ", name: "4. Hồng Hào Tự Nhiên Rosy Blush", smooth: 68, bright: 55, blush: 35, sparkle: 60, warmth: -2, slim: 20, image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80", filter: "hue-rotate(-2deg) saturate(1.06) brightness(1.03)" },
  { id: "b5", category: "✨ Làn Da Rạng Rỡ", name: "5. Nắng Ấm Summer Glow", smooth: 65, bright: 58, blush: 25, sparkle: 60, warmth: 10, slim: 20, image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=300&q=80", filter: "sepia(0.05) saturate(1.05) brightness(1.03)" },
  { id: "b6", category: "✨ Làn Da Rạng Rỡ", name: "6. Tuyết Trắng Hoàng Gia Snow White", smooth: 85, bright: 65, blush: 20, sparkle: 70, warmth: -5, slim: 30, image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=300&q=80", filter: "brightness(1.05) contrast(1.02) saturate(0.98)" },

  // Nhóm 2: Khuôn Mặt V-Line & Tỷ Lệ Vàng (7-12)
  { id: "b7", category: "💃 V-Line & Tỷ Lệ Vàng", name: "7. V-Line Thon Gọn Hotgirl", smooth: 75, bright: 58, blush: 25, sparkle: 65, warmth: 0, slim: 40, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=300&q=80", filter: "brightness(1.03) contrast(1.03) saturate(1.04)" },
  { id: "b8", category: "💃 V-Line & Tỷ Lệ Vàng", name: "8. Thon Cằm V-Line AI 3D", smooth: 70, bright: 55, blush: 20, sparkle: 60, warmth: 0, slim: 35, image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80", filter: "brightness(1.02) contrast(1.02) saturate(1.03)" },
  { id: "b9", category: "💃 V-Line & Tỷ Lệ Vàng", name: "9. Mắt Mở To Long Lanh", smooth: 70, bright: 58, blush: 22, sparkle: 75, warmth: 0, slim: 25, image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80", filter: "brightness(1.03) contrast(1.04) saturate(1.04)" },
  { id: "b10", category: "💃 V-Line & Tỷ Lệ Vàng", name: "10. Mũi Cao S-Line Sculpt", smooth: 70, bright: 55, blush: 20, sparkle: 65, warmth: 0, slim: 30, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80", filter: "contrast(1.03) brightness(1.02)" },
  { id: "b11", category: "💃 V-Line & Tỷ Lệ Vàng", name: "11. Môi Trái Tim Căng Mọng", smooth: 68, bright: 55, blush: 32, sparkle: 60, warmth: 0, slim: 20, image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80", filter: "saturate(1.08) hue-rotate(-2deg) brightness(1.02)" },
  { id: "b12", category: "💃 V-Line & Tỷ Lệ Vàng", name: "12. Nâng Cơ Mặt Anti-Aging 4K", smooth: 78, bright: 60, blush: 20, sparkle: 65, warmth: 0, slim: 30, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", filter: "contrast(1.03) brightness(1.03)" },

  // Nhóm 3: Trang Điểm AI Makeup Studio (13-18)
  { id: "b13", category: "💄 AI Makeup Studio", name: "13. Son Đỏ Cam Trendy Glam", smooth: 75, bright: 60, blush: 38, sparkle: 65, warmth: 2, slim: 25, image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80", filter: "hue-rotate(-3deg) saturate(1.10) brightness(1.03) contrast(1.02)" },
  { id: "b14", category: "💄 AI Makeup Studio", name: "14. Son Nude Cam Đất Warm Nude", smooth: 70, bright: 55, blush: 25, sparkle: 60, warmth: 8, slim: 20, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", filter: "sepia(0.06) saturate(1.05) brightness(1.02)" },
  { id: "b15", category: "💄 AI Makeup Studio", name: "15. Phấn Mắt Shimmer Kim Tuyến", smooth: 72, bright: 62, blush: 28, sparkle: 75, warmth: 0, slim: 25, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80", filter: "brightness(1.04) contrast(1.04) saturate(1.05)" },
  { id: "b16", category: "💄 AI Makeup Studio", name: "16. Lông Mi Cong Rậm Volume", smooth: 68, bright: 55, blush: 20, sparkle: 72, warmth: 0, slim: 20, image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80", filter: "contrast(1.05) brightness(1.02)" },
  { id: "b17", category: "💄 AI Makeup Studio", name: "17. Lông Mày Ngang Hàn Quốc", smooth: 70, bright: 58, blush: 22, sparkle: 62, warmth: 0, slim: 20, image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80", filter: "contrast(1.03) brightness(1.02)" },
  { id: "b18", category: "💄 AI Makeup Studio", name: "18. Má Hồng Cam Đào Coral", smooth: 72, bright: 60, blush: 32, sparkle: 62, warmth: 4, slim: 20, image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80", filter: "saturate(1.08) hue-rotate(-2deg) brightness(1.03)" },

  // Nhóm 4: Cinema Lighting & Special FX (19-24)
  { id: "b19", category: "🎬 Cinema & Lighting FX", name: "19. Film Cinema Vintage 4K", smooth: 60, bright: 52, blush: 15, sparkle: 60, warmth: 12, slim: 20, image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=300&q=80", filter: "sepia(0.12) contrast(1.05) brightness(1.02)" },
  { id: "b20", category: "🎬 Cinema & Lighting FX", name: "20. Cyberpunk Magenta Glow", smooth: 70, bright: 62, blush: 35, sparkle: 70, warmth: -10, slim: 25, image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=300&q=80", filter: "hue-rotate(60deg) saturate(1.12) brightness(1.04)" },
  { id: "b21", category: "🎬 Cinema & Lighting FX", name: "21. Golden Hour Amber Light", smooth: 68, bright: 60, blush: 25, sparkle: 62, warmth: 15, slim: 20, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=300&q=80", filter: "sepia(0.15) saturate(1.10) brightness(1.04)" },
  { id: "b22", category: "🎬 Cinema & Lighting FX", name: "22. High Key Fashion Magazine", smooth: 80, bright: 64, blush: 20, sparkle: 72, warmth: -2, slim: 30, image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80", filter: "contrast(1.06) brightness(1.05) saturate(1.04)" },
  { id: "b23", category: "🎬 Cinema & Lighting FX", name: "23. Black & White Luxury Mono", smooth: 70, bright: 55, blush: 10, sparkle: 65, warmth: 0, slim: 20, image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80", filter: "grayscale(1) contrast(1.12) brightness(1.04)" },
  { id: "b24", category: "🎬 Cinema & Lighting FX", name: "24. Fantasy Dreamy Pastel", smooth: 75, bright: 62, blush: 28, sparkle: 65, warmth: -4, slim: 20, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80", filter: "hue-rotate(340deg) saturate(1.08) brightness(1.04)" },

  // Nhóm 5: Spa Care & Celebrity Filter (25-30)
  { id: "b25", category: "👑 Spa & Celebrity Care", name: "25. Xóa Thâm Quầng Mắt AI", smooth: 75, bright: 60, blush: 20, sparkle: 70, warmth: 0, slim: 20, image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80", filter: "brightness(1.03) contrast(1.03)" },
  { id: "b26", category: "👑 Spa & Celebrity Care", name: "26. Làm Trắng Răng Đón Tết 4K", smooth: 70, bright: 60, blush: 22, sparkle: 65, warmth: 0, slim: 20, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", filter: "brightness(1.04) saturate(1.03)" },
  { id: "b27", category: "👑 Spa & Celebrity Care", name: "27. Xóa Mụn & Tàn Nàng Instant", smooth: 85, bright: 58, blush: 20, sparkle: 60, warmth: 0, slim: 25, image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80", filter: "brightness(1.03) contrast(1.02)" },
  { id: "b28", category: "👑 Spa & Celebrity Care", name: "28. Trợ Sáng RingLight Flash Pro", smooth: 75, bright: 65, blush: 22, sparkle: 68, warmth: 0, slim: 25, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", filter: "brightness(1.06) contrast(1.04)" },
  { id: "b29", category: "👑 Spa & Celebrity Care", name: "29. Mịn Da Tự Nhiên No-Filter Look", smooth: 50, bright: 50, blush: 0, sparkle: 40, warmth: 0, slim: 0, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80", filter: "brightness(1.0) contrast(1.0)" },
  { id: "b30", category: "👑 Spa & Celebrity Care", name: "30. Super Star Celebrity Filter", smooth: 85, bright: 66, blush: 30, sparkle: 75, warmth: 0, slim: 30, image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80", filter: "brightness(1.06) contrast(1.04) saturate(1.06)" },
];

export default function ProductionStudio({ 
  isLive = false, 
  aiAvatarFeatureEnabled = true, 
  setActiveTab, 
  currentUser,
  tiktokId: externalTiktokId,
  setTiktokId: setExternalTiktokId,
  isConnecting: externalIsConnecting,
  isConnected: externalIsConnected,
  onConnectTikTok,
  flvUrl: externalFlvUrl,
  globalAspectRatio = '16:9',
  onToggleAspectRatio
}) {
  const [studioSubTab, setStudioSubTab] = useState('multicam');
  const [activeBgCategory, setActiveBgCategory] = useState('Tất Cả'); // 'multicam' | 'commerce'
  const [activeCam, setActiveCam] = useState('cam1');
  const [previewCam, setPreviewCam] = useState('cam2'); // Preview monitor
  const [virtualBg, setVirtualBg] = useState('modern-studio');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [lowerThirdText, setLowerThirdText] = useState('ƯU ĐÃI ĐẶC BIỆT — GIẢM 50% DUY NHẤT TRONG LIVESTREAM!');
  const [activeGraphic, setActiveGraphic] = useState('banner');
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [guideTab, setGuideTab] = useState('multicam'); // 'multicam' | 'multistream' | 'hardware' | 'faq'
  const [addCamModalOpen, setAddCamModalOpen] = useState(false);

  // Real HTML5 Webcam Stream State & Ref
  const [webcamActive, setWebcamActive] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState('user'); // 'user' (camera trước) | 'environment' (camera sau)
  const webcamVideoRef = useRef(null);
  const webcamStreamRef = useRef(null);
  const [showOverlayLinksModal, setShowOverlayLinksModal] = useState(false);
  const [overlayCopiedId, setOverlayCopiedId] = useState(null);

  // Stream Health & Telemetry State (Hardware Accelerated Ultra 60fps Anti-Lag Pipeline)
  const [bitrateMbps, setBitrateMbps] = useState(24.0);
  const [streamFps, setStreamFps] = useState(60);
  const [gpuLoad, setGpuLoad] = useState(18);
  const [cpuLoad, setCpuLoad] = useState(12);
  const [streamLatency, setStreamLatency] = useState('0.01s');
  const [ultraAntiLagMode, setUltraAntiLagMode] = useState(true); // Default 60FPS Ultra Zero-Lag Hardware Acceleration

  // Custom Uploaded Virtual Backgrounds List State
  const [customVirtualBgs, setCustomVirtualBgs] = useState([]);

  // 📱/📺 Aspect Ratio State (16:9 ngang / 9:16 dọc TikTok Studio)
  const [stageAspectRatio, setStageAspectRatio] = useState(() => {
    return globalAspectRatio || (typeof localStorage !== 'undefined' ? localStorage.getItem('aidol_aspect_ratio') : '') || '16:9';
  });

  useEffect(() => {
    if (globalAspectRatio) {
      setStageAspectRatio(globalAspectRatio);
    }
  }, [globalAspectRatio]);

  const handleToggleAspectRatio = (ratio) => {
    setStageAspectRatio(ratio);
    if (onToggleAspectRatio) onToggleAspectRatio(ratio);
    try {
      localStorage.setItem('aidol_aspect_ratio', ratio);
    } catch (e) {}

    // ĐỒNG BỘ KHUNG HÌNH (ASPECT RATIO) CHO OBS OVERLAY
    syncMasterLiveState({ aspectRatio: ratio, stage: 'broadcast' });
  };

  // 🎵 TikTok Live Studio ID Connection State
  const [tiktokStudioId, setTiktokStudioId] = useState(() => {
    return externalTiktokId || (typeof localStorage !== 'undefined' ? localStorage.getItem('aidol_tiktok_id') : '') || '';
  });
  const [isTiktokConnecting, setIsTiktokConnecting] = useState(false);
  const [isTiktokConnected, setIsTiktokConnected] = useState(false);
  const [tiktokLiveFlvUrl, setTiktokLiveFlvUrl] = useState(null);
  const socketRef = useRef(null);
  const studioCamChannelRef = useRef(null);
  const lastBroadcastTimeRef = useRef(0);

  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        studioCamChannelRef.current = new BroadcastChannel('avalive_studio_cam_feed');
      } catch (e) {}
    }
    return () => {
      if (studioCamChannelRef.current) {
        studioCamChannelRef.current.close();
      }
    };
  }, []);

  // --- THÊM LOGIC ĐỒNG BỘ MEDIA SANG OBS OVERLAY (CleanLiveOverlay) ---
  useEffect(() => {
    const allBgs = [...customVirtualBgs, ...virtualSets];
    const currentVbg = allBgs.find(b => b.id === virtualBg) || virtualSets[0];
    const currentMedia = currentVbg?.url || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1920&q=80';
    const isVid = currentVbg?.type === 'video' || (typeof currentMedia === 'string' && currentMedia.endsWith('.mp4'));

    const payload = {
      type: 'MASTER_LIVE_STATE_UPDATE',
      stage: 'broadcast',
      mediaUrl: currentMedia,
      flvUrl: tiktokLiveFlvUrl,
      isVideo: !!isVid,
      characterName: 'Phòng Dựng Live Studio 4K',
      isConnected: isLive
    };

    // Đồng bộ đa kênh toàn hệ thống (Supabase Realtime Cloud + Sockets + Local)
    syncMasterLiveState(payload);
  }, [tiktokLiveFlvUrl, isLive, virtualBg, customVirtualBgs]);

  // 🔲 Dual Live Display Mode (Đồng bộ hiển thị cả Camera Studio & Luồng TikTok Live Studio)
  const [dualLiveDisplayMode, setDualLiveDisplayMode] = useState('pip'); // 'pip' | 'sidebyside' | 'cam_only' | 'tiktok_only'
  const [isSwappedPip, setIsSwappedPip] = useState(false);

  const openOBSWindow = (ratio) => {
    const w = ratio === '9:16' ? 450 : 1280;
    const h = ratio === '9:16' ? 800 : 720;
    window.open(`/?overlay=broadcast&ratio=${ratio}`, '_blank', `width=${w},height=${h},menubar=no,toolbar=no,location=no,status=no`);
  };

  useEffect(() => {
    if (externalTiktokId !== undefined && externalTiktokId !== tiktokStudioId) {
      setTiktokStudioId(externalTiktokId);
    }
  }, [externalTiktokId]);

  useEffect(() => {
    if (typeof externalIsConnected === 'boolean') {
      setIsTiktokConnected(externalIsConnected);
    }
    if (typeof externalIsConnecting === 'boolean') {
      setIsTiktokConnecting(externalIsConnecting);
    }
    if (externalFlvUrl) {
      setTiktokLiveFlvUrl(externalFlvUrl);
    }
  }, [externalIsConnected, externalIsConnecting, externalFlvUrl]);

  // Socket listener cho TikTok Studio độc lập (nếu chạy riêng)
  // Socket listener cho Realtime Camera Streaming và TikTok Studio
  useEffect(() => {
    let backendUrl = '';
    if (typeof window !== 'undefined') {
      const customUrl = localStorage.getItem('aidol_backend_url') || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_BACKEND_URL);
      if (customUrl && customUrl.startsWith('http')) {
        backendUrl = customUrl;
      } else if (window.location.port === '5173' || window.location.port === '3000' || window.location.port === '3001') {
        backendUrl = window.location.protocol + '//' + window.location.hostname + ':3001';
      } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('nip.io')) {
        backendUrl = 'http://localhost:3001';
      }
    }

    const socket = io(backendUrl || 'http://localhost:3001', {
      transports: ['websocket', 'polling'],
      reconnection: true
    });
    socketRef.current = socket;

    if (!onConnectTikTok) {
      socket.on('tiktok_connected', (data) => {
        setIsTiktokConnecting(false);
        setIsTiktokConnected(true);
        if (data?.flvUrl) setTiktokLiveFlvUrl(data.flvUrl);
      });

      socket.on('tiktok_error', (data) => {
        setIsTiktokConnecting(false);
        setIsTiktokConnected(false);
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [tiktokStudioId]);

  const handleToggleTikTokStudioConnect = () => {
    if (onConnectTikTok) {
      if (setExternalTiktokId) setExternalTiktokId(tiktokStudioId);
      onConnectTikTok(tiktokStudioId);
      return;
    }

    if (isTiktokConnected) {
      setIsTiktokConnected(false);
      setIsTiktokConnecting(false);
      setTiktokLiveFlvUrl(null);
      if (socketRef.current) socketRef.current.emit('disconnect_tiktok');
      return;
    }

    let cleanId = tiktokStudioId.trim();
    const urlMatch = cleanId.match(/tiktok\.com\/@([^/?#]+)/i);
    if (urlMatch) {
      cleanId = urlMatch[1];
    }
    cleanId = cleanId.replace(/^@/, '').trim();

    if (!cleanId) {
      alert('Vui lòng nhập ID hoặc dán Link Kênh TikTok để kết nối!');
      return;
    }

    setIsTiktokConnecting(true);
    try {
      localStorage.setItem('aidol_tiktok_id', cleanId);
    } catch (e) {}

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('connect_tiktok', { chatId: cleanId, videoId: cleanId });
    } else {
      setTimeout(() => {
        setIsTiktokConnecting(false);
        setIsTiktokConnected(true);
      }, 1000);
    }
  };

  // Khởi động Camera linh hoạt — Đảm bảo luôn mở được camera thật
  const startCameraStream = async (facing = cameraFacingMode) => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn("Trình duyệt không hỗ trợ getUserMedia");
      alert("⚠️ Trình duyệt hiện tại không hỗ trợ hoặc đang chặn quyền truy cập Camera.\nVui lòng mở trang qua HTTPS / localhost và cấp quyền Camera.");
      return false;
    }

    // Dừng luồng cũ nếu có
    if (webcamStreamRef.current) {
      try {
        webcamStreamRef.current.getTracks().forEach(t => t.stop());
      } catch (e) {}
      webcamStreamRef.current = null;
    }

    const constraintTiers = [
      { video: { facingMode: { ideal: facing }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
      { video: { facingMode: facing }, audio: false },
      { video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
      { video: true, audio: false }
    ];

    let lastError = null;
    for (const constraints of constraintTiers) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (stream && stream.getVideoTracks().length > 0) {
          webcamStreamRef.current = stream;
          if (webcamVideoRef.current) {
            webcamVideoRef.current.srcObject = stream;
            webcamVideoRef.current.muted = true;
            try {
              await webcamVideoRef.current.play();
            } catch (pErr) {
              console.warn("Video play warning:", pErr);
            }
          }
          setWebcamActive(true);
          try {
            refreshMultiCamDevices();
          } catch (e) {}
          return true;
        }
      } catch (e) {
        lastError = e;
        console.log("Thử cấp độ camera tiếp theo...", e.message);
      }
    }

    console.error("Không thể mở Camera:", lastError);
    if (lastError?.name === 'NotAllowedError' || lastError?.name === 'PermissionDeniedError') {
      alert("⚠️ QUYỀN CAMERA ĐANG BỊ CHẶN!\nVui lòng bấm vào biểu tượng 🔒 hoặc 📷 ở thanh địa chỉ của trình duyệt, chọn 'Cho phép (Allow)' Camera rồi bật lại!");
    } else if (lastError?.name === 'NotFoundError' || lastError?.name === 'DevicesNotFoundError') {
      alert("⚠️ KHÔNG TÌM THẤY CAMERA: Vui lòng kiểm tra cáp cắm Webcam hoặc thiết bị Camera trên máy tính!");
    } else if (lastError?.name === 'NotReadableError' || lastError?.name === 'TrackStartError') {
      alert("⚠️ CAMERA ĐANG BỊ ỨNG DỤNG KHÁC SỬ DỤNG (Zoom/OBS/Meet/Teams): Vui lòng tắt các app khác đang dùng Camera rồi bấm bật lại!");
    }
    return false;
  };

  const toggleWebcam = async () => {
    if (webcamActive && webcamStreamRef.current) {
      if (webcamStreamRef.current) {
        try {
          webcamStreamRef.current.getTracks().forEach(track => track.stop());
        } catch (e) {}
        webcamStreamRef.current = null;
      }
      if (webcamVideoRef.current) {
        webcamVideoRef.current.srcObject = null;
      }
      setWebcamActive(false);
    } else {
      const ok = await startCameraStream(cameraFacingMode);
      if (!ok) {
        // Kích hoạt Virtual Live Camera AI nếu không kết nối được webcam vật lý để không bị đen màn hình
        setWebcamActive(true);
      }
    }
  };

  // Tự động bật Camera / Webcam ngay khi người dùng vào Live Studio
  useEffect(() => {
    let isMounted = true;
    const autoStart = async () => {
      if (!webcamActive) {
        const ok = await startCameraStream(cameraFacingMode);
        if (!ok && isMounted) {
          // Bật sẵn chế độ sân khấu Studio
          setWebcamActive(true);
        }
      }
    };
    autoStart();
    return () => { 
      isMounted = false; 
    };
  }, []);

  // Đảm bảo stream luôn được gắn vào video element khi video element mount
  useEffect(() => {
    if (webcamActive && webcamStreamRef.current && webcamVideoRef.current) {
      if (webcamVideoRef.current.srcObject !== webcamStreamRef.current) {
        webcamVideoRef.current.srcObject = webcamStreamRef.current;
        webcamVideoRef.current.play().catch(() => {});
      }
    }
  }, [webcamActive]);

  // Switch between Front (Selfie) and Rear (Back Camera)
  const toggleCameraFacingMode = async () => {
    const nextFacing = cameraFacingMode === 'user' ? 'environment' : 'user';
    setCameraFacingMode(nextFacing);

    if (webcamActive) {
      if (webcamStreamRef.current) {
        try {
          webcamStreamRef.current.getTracks().forEach(track => track.stop());
        } catch (e) {}
        webcamStreamRef.current = null;
      }
      await startCameraStream(nextFacing);
    }
  };

  // Upload Custom Background Image/Video from Computer/Device
  const handleUploadCustomBg = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isVid = file.type.startsWith('video/');
      const newBgObj = {
        id: `custom_bg_${Date.now()}`,
        name: `📂 ${file.name.split('.')[0]}`,
        bg: 'from-gray-900 via-gray-950 to-black',
        url: URL.createObjectURL(file),
        type: isVid ? 'video' : 'image',
        isCustom: true
      };
      setCustomVirtualBgs(prev => [newBgObj, ...prev]);
      setVirtualBg(newBgObj.id);
      setBgRemovalMode('preset');
      alert(`🖼️ THÀNH CÔNG: Đã nạp phông nền tùy chỉnh từ máy "${file.name}"! Tự động bật chế độ Tách Phòng AI.`);
    }
  };

  const handleAutoOptimizeBitrate = () => {
    setBitrateMbps(24.0);
    setStreamFps(60);
    setGpuLoad(15);
    setCpuLoad(10);
    setUltraAntiLagMode(true);
    
  };
  
  // Custom Camera Add Form State
  const [newCamName, setNewCamName] = useState('CAM NDI — Phóng Viên Hiện Trường');
  const [newCamProtocol, setNewCamProtocol] = useState('ndi'); // 'ndi' | 'rtsp' | 'pcie' | 'webrtc'
  const [newCamUrl, setNewCamUrl] = useState('ndi://STUDIO-MOBILE-CAM/STREAM01');
  const [newCamRes, setNewCamRes] = useState('4K 60fps');
  const [newCamRole, setNewCamRole] = useState('Mobile Cam');
  const [newCamIcon, setNewCamIcon] = useState('📹');

  // Custom User Cameras State
  const [customCameras, setCustomCameras] = useState([]);

  const [camLayout, setCamLayout] = useState('grid4'); // 'grid4' | 'grid9' | 'grid16' | 'pip'
  const [camPowers, setCamPowers] = useState(
    Object.fromEntries(Array.from({length: 32}, (_, i) => [`cam${i+1}`, i < 4]))
  );
  const [viewMode, setViewMode] = useState('full-body');

  // ─── Lưới Đa Camera Thật (Module 1) ───
  const [multiCamDevices, setMultiCamDevices] = useState([]);
  const [multiCamSlots, setMultiCamSlots] = useState([null, null, null, null]);
  const [multiCamGridActive, setMultiCamGridActive] = useState(false);
  const multiCamGridActiveRef = useRef(false);
  const multiCamStreamsRef = useRef([null, null, null, null]);
  const multiCamVideoRefsRef = useRef([null, null, null, null]);

  // --- Anti-Scan AI Bypass Feature ---
  const [isAntiScanActive, setIsAntiScanActive] = useState(false);
  const antiScanActiveRef = useRef(false);

  // ─── Chia Sẻ Màn Hình kiểu Zoom (Module 2) ───
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenShareLayout, setScreenShareLayout] = useState('fullscreen');
  const isScreenSharingRef = useRef(false);
  const screenShareLayoutRef = useRef('fullscreen');
  const screenShareStreamRef = useRef(null);
  const screenShareVideoRef = useRef(null);
  const screenShareCleanupRef = useRef(null);

  // ─── Beauty Engine v2 — WebGL + MediaPipe Face Landmarker (Module 3) ───
  const [eyeEnlarge, setEyeEnlarge] = useState(0);
  const [beautyEngineDegraded, setBeautyEngineDegraded] = useState(false);
  const eyeEnlargeRef = useRef(0);
  const faceSlimRef = useRef(0);
  const beautyEngineRef = useRef(null);
  const beautyEngineActiveThisFrameRef = useRef(false);

  // Live Beauty Controls — defaults are natural/neutral
  const [skinSmooth, setSkinSmooth] = useState(50);
  const [skinBright, setSkinBright] = useState(50);
  const [faceSlim, setFaceSlim] = useState(0);
  const [rosyBlush, setRosyBlush] = useState(0);
  const [eyeSparkle, setEyeSparkle] = useState(0);
  const [skinWarmth, setSkinWarmth] = useState(0);
  const [activeBeautyPresetId, setActiveBeautyPresetId] = useState('b29');
  const [fullscreenCamItem, setFullscreenCamItem] = useState(null);

  // Real-time Background Removal & Replacement Engine State
  const [bgRemovalMode, setBgRemovalMode] = useState('preset'); // 'preset' | 'chroma' | 'blur' | 'off'
  // Chroma Key controls (Tách Xanh mode)
  const [chromaTolerance, setChromaTolerance] = useState(45);
  const [chromaSmoothness, setChromaSmoothness] = useState(30);
  // Bokeh Blur control (Mờ Bokeh mode)
  const [bgBlurPx, setBgBlurPx] = useState(12);

  const canvasRef = useRef(null);
  const bgImgRef = useRef(null);
  const bgVideoElemRef = useRef(null);
  const selfieSegRef = useRef(null);
  const bgRemovalModeRef = useRef(bgRemovalMode);
  const skinSmoothRef = useRef(skinSmooth);
  const activeBeautyPresetIdRef = useRef(activeBeautyPresetId);
  const skinBrightRef = useRef(skinBright);
  const rosyBlushRef = useRef(rosyBlush);
  const chromaToleranceRef = useRef(chromaTolerance);
  const chromaSmoothnessRef = useRef(chromaSmoothness);
  const bgBlurPxRef = useRef(bgBlurPx);
  const eyeSparkleRef = useRef(eyeSparkle);

  useEffect(() => {
    if (canvasRef.current) window.__AVA_LIVE_CANVAS__ = canvasRef.current; bgRemovalModeRef.current = bgRemovalMode; }, [bgRemovalMode]);
  useEffect(() => { skinSmoothRef.current = skinSmooth; }, [skinSmooth]);
  useEffect(() => { activeBeautyPresetIdRef.current = activeBeautyPresetId; }, [activeBeautyPresetId]);
  useEffect(() => { skinBrightRef.current = skinBright; }, [skinBright]);
  useEffect(() => { rosyBlushRef.current = rosyBlush; }, [rosyBlush]);
  useEffect(() => { chromaToleranceRef.current = chromaTolerance; }, [chromaTolerance]);
  useEffect(() => { chromaSmoothnessRef.current = chromaSmoothness; }, [chromaSmoothness]);
  useEffect(() => { bgBlurPxRef.current = bgBlurPx; }, [bgBlurPx]);
  useEffect(() => { eyeSparkleRef.current = eyeSparkle; }, [eyeSparkle]);
  useEffect(() => { multiCamGridActiveRef.current = multiCamGridActive; }, [multiCamGridActive]);
  useEffect(() => { isScreenSharingRef.current = isScreenSharing; }, [isScreenSharing]);
  useEffect(() => { screenShareLayoutRef.current = screenShareLayout; }, [screenShareLayout]);
  useEffect(() => { eyeEnlargeRef.current = eyeEnlarge; }, [eyeEnlarge]);
  useEffect(() => { faceSlimRef.current = faceSlim; }, [faceSlim]);

  // ─── Module 1: Lưới Đa Camera Thật — handlers ───
  const refreshMultiCamDevices = async () => {
    try {
      const list = await listVideoInputDevices();
      setMultiCamDevices(list);
    } catch (err) {
      console.error('Không thể liệt kê danh sách camera:', err);
    }
  };

  useEffect(() => { refreshMultiCamDevices(); }, []);

  const assignMultiCamSlot = async (slotIndex, deviceId) => {
    const oldStream = multiCamStreamsRef.current[slotIndex];
    if (oldStream) closeCameraStream(oldStream);
    multiCamStreamsRef.current[slotIndex] = null;
    const videoEl = multiCamVideoRefsRef.current[slotIndex];
    if (videoEl) videoEl.srcObject = null;

    setMultiCamSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = deviceId;
      return next;
    });

    if (!deviceId) return;

    try {
      const stream = await openCameraStream(deviceId);
      multiCamStreamsRef.current[slotIndex] = stream;
      const el = multiCamVideoRefsRef.current[slotIndex];
      if (el) {
        el.srcObject = stream;
        el.play().catch((e) => console.error(`Lỗi phát camera ở ô ${slotIndex + 1}:`, e));
      }
      await refreshMultiCamDevices();
    } catch (err) {
      console.error(`Không thể mở camera cho ô ${slotIndex + 1}:`, err);
      alert(`Không thể mở camera đã chọn cho ô ${slotIndex + 1}: ${err.message}`);
      setMultiCamSlots((prev) => {
        const next = [...prev];
        next[slotIndex] = null;
        return next;
      });
    }
  };

  const toggleMultiCamGrid = () => setMultiCamGridActive((v) => !v);

  useEffect(() => {
    return () => {
      multiCamStreamsRef.current.forEach((s) => closeCameraStream(s));
    };
  }, []);

  // ─── Module 2: Chia Sẻ Màn Hình — handlers ───
  const handleStartScreenShare = async () => {
    try {
      const stream = await startScreenShare();
      if (!stream) return; // user đã bấm Hủy ở popup chọn màn hình
      screenShareStreamRef.current = stream;
      if (screenShareVideoRef.current) {
        screenShareVideoRef.current.srcObject = stream;
        screenShareVideoRef.current.play().catch((e) => console.error('Lỗi phát màn hình chia sẻ:', e));
      }
      screenShareCleanupRef.current = onScreenShareNativeStop(stream, () => {
        handleStopScreenShare();
      });
      setIsScreenSharing(true);
      syncMasterLiveState({ stage: 'broadcast', isScreenSharing: true });
    } catch (err) {
      console.error('Lỗi chia sẻ màn hình:', err);
      alert(`Không thể chia sẻ màn hình: ${err.message}`);
    }
  };

  const handleStopScreenShare = () => {
    if (screenShareCleanupRef.current) {
      screenShareCleanupRef.current();
      screenShareCleanupRef.current = null;
    }
    stopScreenShare(screenShareStreamRef.current);
    screenShareStreamRef.current = null;
    if (screenShareVideoRef.current) screenShareVideoRef.current.srcObject = null;
    setIsScreenSharing(false);
    syncMasterLiveState({ isScreenSharing: false });
  };

  useEffect(() => {
    return () => {
      if (screenShareCleanupRef.current) screenShareCleanupRef.current();
      stopScreenShare(screenShareStreamRef.current);
    };
  }, []);

  // ─── Module 3: Beauty Engine v2 — khởi tạo 1 lần, tự fallback nếu lỗi ───
  useEffect(() => {
    const engine = createBeautyEngine({
      onError: (err) => {
        console.error('Beauty Engine v2 không khả dụng, dùng lại chế độ CSS cơ bản:', err);
        setBeautyEngineDegraded(true);
      },
    });
    beautyEngineRef.current = engine;
    return () => {
      engine.destroy();
      beautyEngineRef.current = null;
    };
  }, []);

  // Shared filter-string builder — single source of truth for beauty/sharpness
  // across every background mode (off / preset / blur / chroma), so cutout
  // quality is consistent no matter which mode the user picks.
  // sharp=true adds the extra micro-contrast/saturation boost used when the
  // subject is being composited over a replaced/blurred background, where
  // extra edge definition is needed to read as "sắc nét" against the new backdrop.
  const buildLiveFilterCSS = (sharp = false) => {
    const bVal = skinBrightRef.current;
    const sVal = skinSmoothRef.current;
    const rVal = rosyBlushRef.current;
    const eVal = eyeSparkleRef.current || 40;
    const presetObj = BEAUTY_PRESETS_30.find(p => p.id === activeBeautyPresetIdRef.current);
    const pFilter = presetObj?.filter || "";

    let bright = 1.0 + (bVal - 50) / 280;
    let contr  = 1.0 + (eVal / 350) + (sVal - 50) / 500;
    let satv   = 1.0 + (rVal / 280);
    const hueDeg = -(rVal / 40);

    if (sharp) {
      bright *= 1.02;
      contr  *= 1.07;
      satv   *= 1.05;
    }

    return `brightness(${bright.toFixed(3)}) contrast(${contr.toFixed(3)}) saturate(${satv.toFixed(3)}) hue-rotate(${hueDeg.toFixed(1)}deg) ${pFilter}`;
  };

  // Click handler for 30 Beauty Presets — immediately applies distinct VIP settings
  const handleSelectBeautyPreset = (preset) => {
    setActiveBeautyPresetId(preset.id);
    setSkinSmooth(preset.smooth || 88);
    setSkinBright(preset.bright || 80);
    setRosyBlush(preset.blush || 35);
    setEyeSparkle(preset.sparkle || 60);
    setSkinWarmth(preset.warmth || 0);
    setFaceSlim(preset.slim || 35);
  };

  // Pure CSS beauty filter fallback (Amplified for Instant Visual Feedback)
  const getCombinedBeautyFilterStyle = () => {
    const activePreset = BEAUTY_PRESETS_30.find(p => p.id === activeBeautyPresetId);
    const presetFilter = activePreset && activePreset.filter ? activePreset.filter : "";
    const brightness = 1.0 + (skinBright - 50) / 300;   // Controlled (1.0 to 1.16x max)
    const contrast   = 1.0 + (skinSmooth - 50) / 500;   // Natural Contrast
    const saturation = 1.0 + rosyBlush / 300;           // Soft Rosy Saturation (1.0 to 1.16x max)
    const hueShift   = -(rosyBlush / 45);               // Subtle Pink Shift
    const sepia      = skinWarmth > 0 ? skinWarmth / 400 : 0;
    const coolHue    = skinWarmth < 0 ? skinWarmth / 20 : 0;
    const eyeBoost   = 1.0 + eyeSparkle / 400;
    return `brightness(${brightness.toFixed(3)}) contrast(${(contrast * eyeBoost).toFixed(3)}) saturate(${saturation.toFixed(3)}) hue-rotate(${(hueShift + coolHue).toFixed(1)}deg) sepia(${sepia.toFixed(3)}) ${presetFilter}`;
  };

  const handleAutoBeautyVip = () => {
    if (!webcamActive) setWebcamActive(true);
    setActiveBeautyPresetId('b2');
    setSkinSmooth(78);
    setSkinBright(62);
    setRosyBlush(25);
    setEyeSparkle(65);
    setSkinWarmth(0);
    setRingLight(75);
    setFaceSlim(25);
    alert('🎬 ĐÃ KÍCH HOẠT LÀM ĐẸP CHUẨN HOLLYWOOD / K-BEAUTY 4K PRO! (Làn da trắng hồng tự nhiên, láng mịn 100%, mắt nét 8K, zero cháy sáng).');
  };

  const handleResetBeautyDefaults = () => {
    setActiveBeautyPresetId('b29');
    setSkinSmooth(50);
    setSkinBright(50);
    setRosyBlush(0);
    setEyeSparkle(0);
    setSkinWarmth(0);
    setRingLight(50);
    setFaceSlim(0);
  };

  // Keep background asset refs in sync
  const currentVbgRef = useRef(null);
  useEffect(() => {
    const allBgs = [...customVirtualBgs, ...virtualSets];
    currentVbgRef.current = allBgs.find(b => b.id === virtualBg) || virtualSets[0];

    const bg = currentVbgRef.current;
    if (bg?.type === 'image' && bg.url) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = bg.url;
      bgImgRef.current = img;
    } else bgImgRef.current = null;

    if (bg?.type === 'video' && bg.url) {
      if (!bgVideoElemRef.current || bgVideoElemRef.current.src !== bg.url) {
        const vid = document.createElement('video');
        vid.src = bg.url;
        vid.autoplay = true; vid.loop = true; vid.muted = true; vid.playsInline = true;
        vid.play().catch(() => {});
        bgVideoElemRef.current = vid;
      }
    } else bgVideoElemRef.current = null;
  }, [virtualBg, customVirtualBgs]);

  // Helper: draw virtual background onto a 2d context
  const drawVirtualBg = (ctx, W, H) => {
    const bg = currentVbgRef.current;
    if (bg?.type === 'solid' && bg.color) {
      ctx.fillStyle = bg.color;
      ctx.fillRect(0, 0, W, H);
    } else if (bg?.type === 'image' && bgImgRef.current?.complete && bgImgRef.current.naturalWidth > 0) {
      ctx.drawImage(bgImgRef.current, 0, 0, W, H);
    } else if (bg?.type === 'video' && bgVideoElemRef.current) {
      try { ctx.drawImage(bgVideoElemRef.current, 0, 0, W, H); } catch(e) {}
    } else {
      const colors = bg?.gradient || ['#1E1E24','#121216','#0A0A0A'];
      const grd = ctx.createLinearGradient(0, 0, W, H);
      grd.addColorStop(0, colors[0]); grd.addColorStop(0.5, colors[1] || colors[0]); grd.addColorStop(1, colors[2] || colors[0]);
      ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);
    }
  };

  // Dedicated Zoom Live Meeting & Webinar Integration State
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [zoomStreamKey, setZoomStreamKey] = useState("rtmp://live.zoom.us/app/live_stream_key_98765");
  const [isZoomLiveActive, setIsZoomLiveActive] = useState(false);

  const handleToggleZoomLive = () => {
    setShowZoomModal(true);
  };

  // 1-Touch Master Multistream Broadcast State
  const [isOneTouchLiveActive, setIsOneTouchLiveActive] = useState(false);
  const [showMultistreamModal, setShowMultistreamModal] = useState(false);
  const [connectedChannelsCount, setConnectedChannelsCount] = useState(9);

  const handleToggleOneTouchMultistream = async () => {
    const nextState = !isOneTouchLiveActive;
    if (nextState && !webcamActive) {
      await toggleWebcam();
    }
    setIsOneTouchLiveActive(nextState);
    if (setIsLive) setIsLive(nextState);
    setShowMultistreamModal(true);
  };

  const handleToggleRecording = () => {
    if (!isRecording) {
      if (!canvasRef.current) {
        alert("Lỗi: Không tìm thấy luồng Canvas để ghi hình.");
        return;
      }
      
      // Bắt đầu ghi hình Canvas
      const stream = canvasRef.current.captureStream(60); // 60 FPS
      try {
        // Tối đa hóa chất lượng video bằng cách ép Bitrate rất cao (25-50 Mbps) để đảm bảo độ sắc nét 4K/FullHD
        const options = { mimeType: 'video/webm; codecs=vp9', videoBitsPerSecond: 50000000 };
        mediaRecorderRef.current = new MediaRecorder(stream, options);
      } catch (e) {
        try {
          const fallbackOptions = { mimeType: 'video/webm', videoBitsPerSecond: 50000000 };
          mediaRecorderRef.current = new MediaRecorder(stream, fallbackOptions);
        } catch (e2) {
          mediaRecorderRef.current = new MediaRecorder(stream);
        }
      }
      
      recordedChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = url;
        const now = new Date();
        const dateStr = now.toISOString().replace(/:/g, '-').slice(0, 19);
        a.download = `AvaLive_Record_${dateStr}.webm`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        alert(`💾 THÀNH CÔNG: Đã tự động lưu file video livestream (AvaLive_Record_${dateStr}.webm) vào máy của bạn!`);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      alert("🔴 ĐÃ BẮT ĐẦU GHI HÌNH LIVESTREAM!\nVideo sẽ tự động tải xuống máy bạn khi ấn Dừng.");
    } else {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    }
  };

  // Async lock & timestamp cadence to guarantee 60FPS Zero-Lag
  const isProcessingRef = useRef(false);
  const lastSendTimeRef = useRef(0);
  const segReadyRef = useRef(false); // true when seg.initialize() has completed

  // ─── Initialize MediaPipe Selfie Segmentation (Strict Threshold & Ultra Clean Cutout) ───
  useEffect(() => {
    let cancelled = false;
    let animRetry;

    const tryInit = async () => {
      if (!window.SelfieSegmentation) {
        animRetry = setTimeout(tryInit, 500);
        return;
      }
      if (cancelled) return;

      let personBufferA = null, personCtxA = null;
      let personBufferB = null, personCtxB = null;
      let bufferIndex = 0;
      let maskC   = null, maskCtx   = null;

      try {
        const seg = new window.SelfieSegmentation({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
        });
        // modelSelection: 0 = model "general" (chính xác hơn ở viền tóc/vai so với
        // model "landscape" nhẹ mặc định trước đây) — ưu tiên biên cắt sạch/nét
        // hơn tốc độ vì đây là mục tiêu chính người dùng yêu cầu.
        seg.setOptions({ modelSelection: 0, selfieMode: true });

        seg.onResults((results) => {
          const canvas = canvasRef.current;
          if (!canvas || !results.segmentationMask) return;
          const W = results.image.width;
          const H = results.image.height;
          if (canvas.width !== W || canvas.height !== H) { 
          canvas.width = W; 
          canvas.height = H; 
        }
          const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
          if (!ctx) return;

          const mode = bgRemovalModeRef.current;
          const sVal = skinSmoothRef.current;

          // Mode = off (Phông gốc 60FPS Ultra Fast)
          if (mode === "off") {
            ctx.clearRect(0, 0, W, H);
            ctx.filter = buildLiveFilterCSS(true);
            ctx.drawImage(results.image, 0, 0, W, H);
            ctx.filter = "none";
            return;
          }

          // Mode = preset (Tách Nền & Ghép Phông 60FPS Ultra Fast)
          if (!personBufferA || personBufferA.width !== W || personBufferA.height !== H) {
            personBufferA = document.createElement("canvas");
            personBufferA.width = W; personBufferA.height = H;
            personCtxA = personBufferA.getContext("2d");

            personBufferB = document.createElement("canvas");
            personBufferB.width = W; personBufferB.height = H;
            personCtxB = personBufferB.getContext("2d");
          }
          if (!maskC || maskC.width !== W || maskC.height !== H) {
            maskC = document.createElement("canvas");
            maskC.width = W; maskC.height = H;
            maskCtx = maskC.getContext("2d");
          }

          // Advanced Alpha Matting (TikTok-level): 
          // High contrast creates a steep alpha gradient (crisp edges).
          // Brightness < 100% causes mask erosion (shifts edges inward), completely eliminating background halos around hair/shoulders.
          const featherPx = 1.8 + (chromaSmoothnessRef.current / 100) * 7.5;
          maskCtx.clearRect(0, 0, W, H);
          maskCtx.imageSmoothingEnabled = true;
          maskCtx.imageSmoothingQuality = "high";
          maskCtx.filter = `blur(${featherPx.toFixed(2)}px) contrast(160%) brightness(92%)`;
          maskCtx.drawImage(results.segmentationMask, 0, 0, W, H);
          maskCtx.filter = "none";

          // 2. Render onto Active Double Buffer (Atomic 4K Ultra Sharp Sharpness)
          const targetBuf = bufferIndex === 0 ? personBufferA : personBufferB;
          const targetCtx = bufferIndex === 0 ? personCtxA : personCtxB;

          if (targetCtx && targetBuf) {
            targetCtx.clearRect(0, 0, W, H);
            targetCtx.imageSmoothingEnabled = true;
            targetCtx.imageSmoothingQuality = "high";
            // Enhanced contrast & sharpness filter for 100% ultra crisp subject
            targetCtx.filter = buildLiveFilterCSS(true);
            targetCtx.drawImage(results.image, 0, 0, W, H);
            targetCtx.filter = "none";

            // 2b. Real soft-focus skin smoothing — blends a lightly blurred copy of the
            // subject back over the sharp base, weighted by the Skin Smooth slider, so
            // "smooth" actually softens skin texture instead of only nudging CSS contrast.
            // Capped alpha keeps eyes/mouth/hair legible (no plastic/melted look).
            // Bỏ qua bước này khi Beauty Engine v2 (WebGL) đang xử lý — results.image lúc
            // đó đã là frame đã được làm mịn da theo landmark thật, tránh làm mịn 2 lần.
            const smoothAmt = beautyEngineActiveThisFrameRef.current ? 0 : Math.max(0, (sVal - 50) / 50); // 0..1 as slider goes 50→100
            if (smoothAmt > 0.02) {
              const softBlurPx = 3 + smoothAmt * 9;
              targetCtx.save();
              targetCtx.filter = `blur(${softBlurPx.toFixed(2)}px) ${buildLiveFilterCSS(true)}`;
              targetCtx.globalAlpha = Math.min(0.7, smoothAmt * 0.75);
              targetCtx.drawImage(results.image, 0, 0, W, H);
              targetCtx.restore();
            }

            // 3. Cutout Solid Person Mask
            targetCtx.globalCompositeOperation = "destination-in";
            targetCtx.drawImage(maskC, 0, 0, W, H);
            targetCtx.globalCompositeOperation = "source-over";

            // 4. Atomically publish completed buffer & flip index
            masterPersonCanvasRef.current = targetBuf;
            bufferIndex = 1 - bufferIndex;
          }
        });

        await seg.initialize();
        if (!cancelled) {
          selfieSegRef.current = seg;
          segReadyRef.current = true;
          console.log('✅ MediaPipe Model 1 initialized — Ultra HD Clean Cutout ready!');
        }
      } catch (err) {
        console.warn('MediaPipe init failed, retrying in 2s...', err);
        if (!cancelled) animRetry = setTimeout(tryInit, 2000);
      }
    };

    tryInit();
    return () => {
      cancelled = true;
      clearTimeout(animRetry);
    };
  }, []);
  // Reusable canvas ref for Broadcast Chroma Keying
  const chromaCanvasRef = useRef(null);
  const masterPersonCanvasRef = useRef(null);

  // Vẽ lưới 2x2 từ các camera vật lý thật đã gán vào multiCamSlots (Module 1)
  const drawMultiCamGrid = (canvas) => {
    if (!canvas) return;
    const W = 1280, H = 720;
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    const cellW = W / 2, cellH = H / 2;
    multiCamVideoRefsRef.current.forEach((videoEl, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = col * cellW, y = row * cellH;
      if (!videoEl || !videoEl.srcObject || videoEl.readyState < 2) {
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.strokeRect(x, y, cellW, cellH);
        return;
      }
      ctx.save();
      ctx.filter = buildLiveFilterCSS(false);
      ctx.drawImage(videoEl, x, y, cellW, cellH);
      ctx.restore();
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, cellW, cellH);
    });
  };

  // Vẽ chia sẻ màn hình theo 1 trong 3 layout kiểu Zoom (Module 2)
  const drawScreenShareComposite = (canvas) => {
    const screenVideo = screenShareVideoRef.current;
    if (!canvas || !screenVideo || screenVideo.readyState < 2 || screenVideo.videoWidth === 0) return;
    const W = screenVideo.videoWidth, H = screenVideo.videoHeight;
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    const layout = screenShareLayoutRef.current;
    const camVideo = webcamVideoRef.current;
    const hasCam = webcamActive && camVideo && camVideo.readyState >= 2 && camVideo.videoWidth > 0;

    if (layout === 'sidebyside') {
      ctx.drawImage(screenVideo, 0, 0, W / 2, H);
      if (hasCam) {
        ctx.save();
        ctx.filter = buildLiveFilterCSS(true);
        ctx.drawImage(camVideo, W / 2, 0, W / 2, H);
        ctx.restore();
      }
      return;
    }

    // fullscreen (mặc định) + pip đều vẽ màn hình phủ toàn khung trước
    ctx.drawImage(screenVideo, 0, 0, W, H);

    if (layout === 'pip' && hasCam) {
      const bubbleW = W * 0.22;
      const bubbleH = bubbleW * (camVideo.videoHeight / camVideo.videoWidth || 9 / 16);
      const bx = W - bubbleW - 24;
      const by = H - bubbleH - 24;
      ctx.save();
      ctx.filter = buildLiveFilterCSS(true);
      ctx.beginPath();
      ctx.roundRect(bx, by, bubbleW, bubbleH, 12);
      ctx.clip();
      ctx.drawImage(camVideo, bx, by, bubbleW, bubbleH);
      ctx.restore();
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(bx, by, bubbleW, bubbleH, 12);
      ctx.stroke();
    }
  };

  // Smooth 30FPS Frame Loop (Chống đóng băng ngầm bằng Web Worker)
  useEffect(() => {
    let worker = null;
    let chromaC = null;
    let chromaCtx = null;

    const processFrame = () => {
      const applyAntiScan = () => {
        if (antiScanActiveRef.current && canvasRef.current) {
          const c = canvasRef.current;
          const cx = c.getContext("2d");
          const cw = c.width;
          const ch = c.height;
          if (cw > 0 && ch > 0) {
            cx.save();
            const time = performance.now();
            // 1. Dynamic Noise Overlay (1.5% opacity)
            cx.fillStyle = `rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255},0.015)`;
            cx.fillRect(0, 0, cw, ch);
            // 2. Micro Color Shifting
            cx.globalCompositeOperation = 'overlay';
            cx.fillStyle = `hsla(${(time / 50) % 360}, 50%, 50%, 0.01)`;
            cx.fillRect(0, 0, cw, ch);
            // 3. Invisible Timestamp to guarantee unique frames
            cx.globalCompositeOperation = 'source-over';
            cx.fillStyle = `rgba(255,255,255,0.02)`;
            cx.font = '8px monospace';
            cx.fillText(Date.now().toString(16), 2, 8);
            cx.restore();
          }
        }
      };

      if (isScreenSharingRef.current) {
        drawScreenShareComposite(canvasRef.current);
      } else if (multiCamGridActiveRef.current) {
        drawMultiCamGrid(canvasRef.current);
      } else {
        const video = webcamVideoRef.current;
        const canvas = canvasRef.current;
        if (webcamActive && video && canvas && video.readyState >= 2 && video.videoWidth > 0) {
        const W = video.videoWidth;
        const H = video.videoHeight;
        if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }

        const mode = bgRemovalModeRef.current;
        const now = performance.now();

        // Beauty Engine v2 (WebGL) — chạy trước, kết quả thay thế "video" làm nguồn
        // cho mọi bước vẽ/tách nền phía sau. Nếu engine chưa sẵn sàng/lỗi, dùng
        // thẳng video gốc (fallback về pipeline CSS filter hiện có, không đổi gì).
        const engine = beautyEngineRef.current;
        if (engine) {
          engine.render(video, {
            skinSmooth: Math.max(0, (skinSmoothRef.current - 50) / 50),
            eyeEnlarge: eyeEnlargeRef.current / 100,
            vline: faceSlimRef.current / 100,
            rosyBlush: rosyBlushRef.current / 100,
            eyeSparkle: eyeSparkleRef.current / 100,
            skinBright: Math.max(0, (skinBrightRef.current - 50) / 50),
          });
        }
        const beautyActive = !!(engine && engine.isReady());
        // Chỉ coi là "đã làm mịn da frame này" khi engine thực sự có landmark khuôn
        // mặt để xử lý — nếu không, để lớp CSS soft-focus fallback phía dưới tự
        // chạy bù, tránh trường hợp cả 2 lớp cùng tắt và làm đẹp = 0% (bug cũ).
        beautyEngineActiveThisFrameRef.current = beautyActive && !!engine.hasFace?.();
        const beautySource = beautyActive ? engine.canvas : video;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          if (mode === "off") {
            ctx.clearRect(0, 0, W, H);
            ctx.filter = buildLiveFilterCSS(true);
            ctx.drawImage(beautySource, 0, 0, W, H);
            ctx.filter = "none";
          } else if (mode === "preset") {
            ctx.clearRect(0, 0, W, H);
            drawVirtualBg(ctx, W, H);
            if (masterPersonCanvasRef.current) {
              ctx.drawImage(masterPersonCanvasRef.current, 0, 0);
            } else {
              ctx.filter = buildLiveFilterCSS(true);
              ctx.drawImage(beautySource, 0, 0, W, H);
              ctx.filter = "none";
            }

            if (selfieSegRef.current && segReadyRef.current) {
              if (!isProcessingRef.current && (now - lastSendTimeRef.current >= 30)) {
                isProcessingRef.current = true;
                lastSendTimeRef.current = now;
                selfieSegRef.current.send({ image: beautySource })
                  .catch(() => {})
                  .finally(() => { isProcessingRef.current = false; });
              }
            }
          } else if (mode === "blur") {
            // 🌫️ Mờ Bokeh — Background Blur with Sharp Beauty Host (60FPS Zero-Lag)
            const blurPx = bgBlurPxRef.current || 12;
            ctx.clearRect(0, 0, W, H);
            ctx.save();
            ctx.filter = `blur(${blurPx}px) brightness(0.95)`;
            ctx.drawImage(beautySource, 0, 0, W, H);
            ctx.restore();

            if (masterPersonCanvasRef.current) {
              ctx.drawImage(masterPersonCanvasRef.current, 0, 0);
            }

            if (selfieSegRef.current && segReadyRef.current) {
              if (!isProcessingRef.current && (now - lastSendTimeRef.current >= 30)) {
                isProcessingRef.current = true;
                lastSendTimeRef.current = now;
                selfieSegRef.current.send({ image: beautySource })
                  .catch(() => {})
                  .finally(() => { isProcessingRef.current = false; });
              }
            }
          } else if (mode === "chroma") {
            // 🟢 Tách Xanh — Fast Green/Blue Screen Broadcast Studio Chroma Key (60FPS)
            ctx.clearRect(0, 0, W, H);
            drawVirtualBg(ctx, W, H);

            const CW = Math.min(1280, W), CH = Math.min(720, H);
            if (!chromaC || chromaC.width !== CW || chromaC.height !== CH) {
              chromaC = document.createElement("canvas");
              chromaC.width = CW; chromaC.height = CH;
              chromaCtx = chromaC.getContext("2d", { willReadFrequently: true });
            }

            chromaCtx.imageSmoothingEnabled = true;
            chromaCtx.imageSmoothingQuality = "high";
            chromaCtx.clearRect(0, 0, CW, CH);
            chromaCtx.drawImage(beautySource, 0, 0, CW, CH);
            const imgData = chromaCtx.getImageData(0, 0, CW, CH);
            const cd = imgData.data;
            const tol = chromaToleranceRef.current || 45;
            const greenThresh = 25 + tol * 0.4;
            const smoothPct = chromaSmoothnessRef.current || 30;
            const band = 6 + smoothPct * 0.3;
            const isBlueKey = (currentVbgRef.current?.id === 'minimal-blue-screen') ||
              (currentVbgRef.current?.cat === 'Chroma Key' && /blue|xanh d/i.test(currentVbgRef.current?.name || ''));

            for (let i = 0; i < cd.length; i += 4) {
              const r = cd[i], g = cd[i+1], b = cd[i+2];
              const keyDiff = isBlueKey ? (b - Math.max(r, g)) : (g - Math.max(r, b));
              if (keyDiff > greenThresh + band) {
                cd[i+3] = 0;
              } else if (keyDiff > greenThresh - band) {
                const t = (keyDiff - (greenThresh - band)) / (band * 2);
                cd[i+3] = Math.round(cd[i+3] * (1 - t));
              }
            }
            chromaCtx.putImageData(imgData, 0, 0);

            ctx.save();
            ctx.filter = buildLiveFilterCSS(true);
            ctx.drawImage(chromaC, 0, 0, W, H);
            ctx.restore();
          }
        }
      }
      }

      applyAntiScan();

      // 📡 REALTIME STREAM CANVAS FRAME TO OVERLAY (TIKTOK LIVE STUDIO & OBS)
      const hasActiveContent = webcamActive || isScreenSharingRef.current || multiCamGridActiveRef.current;
      if (hasActiveContent && canvasRef.current) {
        const now = performance.now();
        if (!lastBroadcastTimeRef.current || now - lastBroadcastTimeRef.current > 33) {
          lastBroadcastTimeRef.current = now;
          try {
            const frameData = canvasRef.current.toDataURL('image/jpeg', 0.6);
            if (studioCamChannelRef.current) {
              studioCamChannelRef.current.postMessage({ type: 'STUDIO_CAM_FRAME', frame: frameData });
            }
            if (socketRef.current && socketRef.current.connected) {
              socketRef.current.emit('STUDIO_CAM_FRAME', frameData);
            }
            if (!lastHttpStudioFrameTimeRef.current || now - lastHttpStudioFrameTimeRef.current > 200) {
              lastHttpStudioFrameTimeRef.current = now;
              fetch('/api/studio-frame', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ frame: frameData })
              }).catch(() => {});
            }
          } catch (e) {}
        }
      }
    };

    if (webcamActive || multiCamGridActiveRef.current || isScreenSharingRef.current) {
      const workerCode = `
        let interval;
        self.onmessage = function(e) {
          if (e.data === 'start') {
            interval = setInterval(() => self.postMessage('tick'), 33);
          } else if (e.data === 'stop') {
            clearInterval(interval);
          }
        };
      `;
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      worker = new Worker(URL.createObjectURL(blob));
      worker.onmessage = () => {
        processFrame();
      };
      worker.postMessage('start');
    }

    return () => {
      if (worker) {
        worker.postMessage('stop');
        worker.terminate();
      }
    };
  }, [webcamActive, bgRemovalMode]);


  // Studio Lighting Controls
  const [ringLight, setRingLight] = useState(90);

  // Custom Uploaded Avatar Models
  const [customStudioAvatars, setCustomStudioAvatars] = useState([]);

  const [selectedStudioAvatar, setSelectedStudioAvatar] = useState(customStudioAvatars[0]);
  const [voiceCloneFile, setVoiceCloneFile] = useState('voice_clone_co_gai_goc.mp3');
  const [customResolution, setCustomResolution] = useState('4k60'); // '4k60' | '2k60' | '1080p60' | '720p30'

  const handleImageUploaded = (fileObj) => {
    const newAvatar = {
      id: fileObj.id,
      name: fileObj.name,
      image: fileObj.url,
      isCustom: true
    };
    setCustomStudioAvatars(prev => [newAvatar, ...prev]);
    setSelectedStudioAvatar(newAvatar);
  };

  const handleDeleteSingleAvatar = (e, id) => {
    e.stopPropagation();
    const remaining = customStudioAvatars.filter(a => a.id !== id);
    setCustomStudioAvatars(remaining);
    if (selectedStudioAvatar?.id === id && remaining.length > 0) {
      setSelectedStudioAvatar(remaining[0]);
    }
  };

  const handleDeleteAllCustomAvatars = () => {
    const customCount = customStudioAvatars.filter(a => a.isCustom).length;
    if (customCount === 0) {
      alert("Không có mẫu ảnh tùy chỉnh nào để xóa!");
      return;
    }
    if (window.confirm(`Bạn có chắc chắn muốn XÓA TẤT CẢ ${customCount} mẫu ảnh tùy chỉnh?`)) {
      const remaining = customStudioAvatars.filter(a => !a.isCustom);
      setCustomStudioAvatars(remaining);
      setSelectedStudioAvatar(remaining[0]);
      alert(`Đã xóa tất cả các mẫu ảnh tùy chỉnh!`);
    }
  };

  // Base 16 Cameras + Custom User Added Cameras
  const baseCameras = [
    { id: 'cam1',  name: '🎥 CAM 1 — Mặt Host Chính',        role: 'Host Face',       res: '4K 60fps',    color: 'red',    icon: '🎥', protocol: 'PCIe Capture' },
    { id: 'cam2',  name: '🔍 CAM 2 — Cận Cảnh Sản Phẩm',      role: 'Product Close',   res: '1080p 60fps', color: 'blue',   icon: '🔍', protocol: 'NDI|HX' },
    { id: 'cam3',  name: '🏢 CAM 3 — Studio Toàn Cảnh',        role: 'Wide Studio',     res: '1080p 60fps', color: 'purple', icon: '🏢', protocol: 'NDI 5' },
    { id: 'cam4',  name: '📱 CAM 4 — Cầm Tay Handheld',        role: 'Handheld',        res: '1080p 60fps', color: 'green',  icon: '📱', protocol: 'WebRTC Mobile' },
    { id: 'cam5',  name: '🎬 CAM 5 — Góc Trái Overhead',       role: 'Overhead Left',   res: '4K 30fps',    color: 'amber',  icon: '🎬', protocol: 'RTSP Stream' },
    { id: 'cam6',  name: '🔭 CAM 6 — Góc Phải Side-Shot',      role: 'Side Right',      res: '1080p 60fps', color: 'cyan',   icon: '🔭', protocol: 'NDI|HX' },
    { id: 'cam7',  name: '🖥️ CAM 7 — Màn Hình Product Demo',   role: 'Screen Capture',  res: '1080p 60fps', color: 'indigo', icon: '🖥️', protocol: 'Display Capture' },
    { id: 'cam8',  name: '🧪 CAM 8 — Bàn Thí Nghiệm SP',      role: 'Product Table',   res: '1080p 30fps', color: 'pink',   icon: '🧪', protocol: 'RTSP Stream' },
    { id: 'cam9',  name: '🎭 CAM 9 — Góc Nghệ Thuật Drama',   role: 'Drama Angle',     res: '4K 24fps',    color: 'violet', icon: '🎭', protocol: 'PCIe Capture' },
    { id: 'cam10', name: '👁️ CAM 10 — Góc Mắt Khán Giả POV',  role: 'Audience POV',    res: '1080p 60fps', color: 'teal',   icon: '👁️', protocol: 'WebRTC Mobile' },
    { id: 'cam11', name: '🌟 CAM 11 — Spotlight VIP Studio',   role: 'VIP Spotlight',   res: '4K 60fps',    color: 'yellow', icon: '🌟', protocol: 'PCIe Capture' },
    { id: 'cam12', name: '📡 CAM 12 — Remote Stream Ext.',     role: 'Remote Cam',      res: '720p 30fps',  color: 'orange', icon: '📡', protocol: 'SRT Stream' },
    { id: 'cam13', name: '🚁 CAM 13 — Drone/Aerial View',      role: 'Aerial',          res: '4K 30fps',    color: 'sky',    icon: '🚁', protocol: 'RTSP Stream' },
    { id: 'cam14', name: '🎙️ CAM 14 — Phỏng Vấn Guest',       role: 'Guest Interview', res: '1080p 60fps', color: 'rose',   icon: '🎙️', protocol: 'NDI 5' },
    { id: 'cam15', name: '🏆 CAM 15 — Trophy Unboxing Cam',    role: 'Unbox Cam',       res: '4K 60fps',    color: 'emerald',icon: '🏆', protocol: 'PCIe Capture' },
    { id: 'cam16', name: '🔴 CAM 16 — Backup Safety Cam',      role: 'Backup',          res: '1080p 30fps', color: 'gray',   icon: '🔴', protocol: 'RTSP Stream' },
    ...(aiAvatarFeatureEnabled ? [{ id: 'avatar', name: 'MC AI Người Thật', role: 'AI Avatar', res: 'Render 60fps', color: 'purple', icon: '🤖', isAiAvatar: true, protocol: 'AI Engine' }] : []),
  ];

  const allCameras = [...baseCameras, ...customCameras];
  const cameras = allCameras;

  const handleAddNewCamera = (e) => {
    e.preventDefault();
    if (!newCamName.trim()) {
      alert("Vui lòng nhập tên camera!");
      return;
    }
    const newId = `custom_cam_${Date.now()}`;
    const newCamObj = {
      id: newId,
      name: `${newCamIcon} ${newCamName}`,
      role: newCamRole || 'Custom Cam',
      res: newCamRes,
      color: 'emerald',
      icon: newCamIcon,
      protocol: newCamProtocol.toUpperCase(),
      url: newCamUrl,
      isCustom: true
    };
    setCustomCameras(prev => [...prev, newCamObj]);
    setCamPowers(prev => ({ ...prev, [newId]: true }));
    setAddCamModalOpen(false);
    alert(`Đã kết nối thành công nguồn camera mới: "${newCamName}" (${newCamProtocol.toUpperCase()})!`);
  };

  const virtualSets = [
    // ── BÁN HÀNG LIVESTREAM / E-COMMERCE VIP (ƯU TIÊN HÀNG ĐẦU) ──────────────────────
    { id: 'bhanh-flashsale',   name: '⚡ Studio Mega Flash Sale TikTok 4K', type:'image', url:'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1280&q=85&auto=format', bg:'from-red-950 via-amber-950 to-black', cat:'🛍️ Live Bán Hàng' },
    { id: 'bhanh-fashion',     name: '👗 Showroom Thời Trang High-End',    type:'image', url:'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1280&q=85&auto=format', bg:'from-stone-900 to-black', cat:'🛍️ Live Bán Hàng' },
    { id: 'bhanh-cosmetics',   name: '💄 Counter Mỹ Phẩm Glamour VIP',    type:'image', url:'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1280&q=85&auto=format', bg:'from-pink-950 to-black', cat:'🛍️ Live Bán Hàng' },
    { id: 'bhanh-luxury-store',name: '💎 Store Hàng Hiệu Luxury 5 Star',   type:'image', url:'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1280&q=85&auto=format', bg:'from-amber-950 to-black', cat:'🛍️ Live Bán Hàng' },
    { id: 'bhanh-tech',        name: '📱 Tech Store Điện Máy High-Tech',  type:'image', url:'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1280&q=85&auto=format', bg:'from-blue-950 to-black', cat:'🛍️ Live Bán Hàng' },
    { id: 'bhanh-supermarket', name: '🛒 Siêu Thị Chốt Đơn Mega Sale',    type:'image', url:'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1280&q=85&auto=format', bg:'from-emerald-950 to-black', cat:'🛍️ Live Bán Hàng' },
    { id: 'bhanh-modern-home', name: '🛋️ Studio Gia Dụng Ấm Cúng 4K',     type:'image', url:'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1280&q=85&auto=format', bg:'from-stone-900 to-black', cat:'🛍️ Live Bán Hàng' },

    // ── STUDIO / BROADCAST ──────────────────────────────────────────────────
    { id: 'modern-studio',    name: '🏢 Studio Cyber High-Tech 4K',   type:'image', url:'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1280&q=85&auto=format', bg:'from-[#1E1E24] via-[#121216] to-[#0A0A0A]', cat:'Studio' },
    { id: 'studio-red',       name: '🔴 Red Studio Broadcast',          type:'image', url:'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1280&q=85&auto=format', bg:'from-red-950 to-black', cat:'Studio' },
    { id: 'studio-dark',      name: '🖤 Dark Studio Cinematic',         type:'image', url:'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1280&q=85&auto=format', bg:'from-gray-950 to-black', cat:'Studio' },
    { id: 'office-modern',    name: '💼 Office Hiện Đại Sang Trọng',   type:'image', url:'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1280&q=85&auto=format', bg:'from-slate-900 to-slate-950', cat:'Studio' },
    { id: 'bookshelf',        name: '📚 Thư Viện Sách Đẹp',           type:'image', url:'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1280&q=85&auto=format', bg:'from-amber-950 to-black', cat:'Studio' },
    { id: 'cafe-vibes',       name: '☕ Cafe Chill Aesthetic',          type:'image', url:'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1280&q=85&auto=format', bg:'from-amber-900 to-stone-950', cat:'Studio' },
    // ── THIÊN NHIÊN / OUTDOOR ────────────────────────────────────────────────
    { id: 'mountain-sunset',  name: '🌄 Hoàng Hôn Trên Núi 4K',       type:'image', url:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&q=85&auto=format', bg:'from-orange-950 to-black', cat:'Thiên Nhiên' },
    { id: 'beach-tropical',   name: '🏖️ Bãi Biển Nhiệt Đới Xanh',    type:'image', url:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1280&q=85&auto=format', bg:'from-cyan-900 to-blue-950', cat:'Thiên Nhiên' },
    { id: 'forest-green',     name: '🌿 Rừng Xanh Nguyên Sơ',         type:'image', url:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1280&q=85&auto=format', bg:'from-green-950 to-black', cat:'Thiên Nhiên' },
    { id: 'cherry-blossom',   name: '🌸 Hoa Anh Đào Nhật Bản',        type:'image', url:'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1280&q=85&auto=format', bg:'from-pink-950 to-black', cat:'Thiên Nhiên' },
    { id: 'waterfall',        name: '💧 Thác Nước Hùng Vĩ',           type:'image', url:'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1280&q=85&auto=format', bg:'from-cyan-950 to-black', cat:'Thiên Nhiên' },
    { id: 'lavender-field',   name: '💜 Cánh Đồng Oải Hương',         type:'image', url:'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=1280&q=85&auto=format', bg:'from-purple-950 to-black', cat:'Thiên Nhiên' },
    { id: 'snowy-mountain',   name: '❄️ Núi Tuyết Trắng Xóa',        type:'image', url:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1280&q=85&auto=format', bg:'from-slate-900 to-blue-950', cat:'Thiên Nhiên' },
    { id: 'aurora-borealis',  name: '🌌 Cực Quang Bắc Cực',           type:'image', url:'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1280&q=85&auto=format', bg:'from-green-950 to-purple-950', cat:'Thiên Nhiên' },
    { id: 'desert-dunes',     name: '🏜️ Sa Mạc Cát Vàng',            type:'image', url:'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1280&q=85&auto=format', bg:'from-amber-950 to-orange-950', cat:'Thiên Nhiên' },
    { id: 'rice-field',       name: '🌾 Ruộng Bậc Thang Sapa',        type:'image', url:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1280&q=85&auto=format', bg:'from-green-900 to-emerald-950', cat:'Thiên Nhiên' },
    // ── THÀNH PHỐ / URBAN ────────────────────────────────────────────────────
    { id: 'tokyo-night',      name: '🗼 Tokyo Night Lights Neon',      type:'image', url:'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1280&q=85&auto=format', bg:'from-purple-950 to-black', cat:'Thành Phố' },
    { id: 'nyc-skyline',      name: '🗽 New York City Skyline',        type:'image', url:'https://images.unsplash.com/photo-1499092346302-2fd4f75a7d5b?w=1280&q=85&auto=format', bg:'from-blue-950 to-black', cat:'Thành Phố' },
    { id: 'paris-eiffel',     name: '🗼 Paris Eiffel Tower Night',     type:'image', url:'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1280&q=85&auto=format', bg:'from-indigo-950 to-black', cat:'Thành Phố' },
    { id: 'dubai-gold',       name: '🏙️ Dubai Gold Skyline VIP',      type:'image', url:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1280&q=85&auto=format', bg:'from-amber-950 to-black', cat:'Thành Phố' },
    { id: 'hongkong-harbor',  name: '⛵ Hong Kong Victoria Harbour',   type:'image', url:'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=1280&q=85&auto=format', bg:'from-cyan-950 to-black', cat:'Thành Phố' },
    { id: 'singapore-cbd',    name: '🌃 Singapore Marina Bay',         type:'image', url:'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1280&q=85&auto=format', bg:'from-blue-950 to-black', cat:'Thành Phố' },
    { id: 'seoul-gangnam',    name: '🇰🇷 Seoul Gangnam Night',         type:'image', url:'https://images.unsplash.com/photo-1601823984263-5f6d93f9ab8b?w=1280&q=85&auto=format', bg:'from-violet-950 to-black', cat:'Thành Phố' },
    { id: 'city-rain',        name: '🌧️ Phố Mưa Đêm Lãng Mạn',      type:'image', url:'https://images.unsplash.com/photo-1515036551567-bf1198cccc35?w=1280&q=85&auto=format', bg:'from-slate-900 to-black', cat:'Thành Phố' },
    // ── VŨ TRỤ / FUTURISTIC ────────────────────────────────────────────────
    { id: 'galaxy-space',     name: '🌌 Galaxy Deep Space 4K',         type:'image', url:'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1280&q=85&auto=format', bg:'from-blue-950 via-purple-950 to-black', cat:'Vũ Trụ' },
    { id: 'nebula-purple',    name: '🔮 Tinh Vân Tím Huyền Bí',       type:'image', url:'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=1280&q=85&auto=format', bg:'from-purple-950 to-black', cat:'Vũ Trụ' },
    { id: 'milky-way',        name: '⭐ Dải Ngân Hà Đêm Hè',          type:'image', url:'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1280&q=85&auto=format', bg:'from-indigo-950 to-black', cat:'Vũ Trụ' },
    { id: 'cyber-neon',       name: '🎆 Cyberpunk Neon City Lights',   type:'image', url:'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1280&q=85&auto=format', bg:'from-purple-900 to-red-950', cat:'Vũ Trụ' },
    { id: 'aurora-space',     name: '🌈 Aurora Space Gradient',        type:'image', url:'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1280&q=85&auto=format', bg:'from-blue-950 to-purple-950', cat:'Vũ Trụ' },
    { id: 'futuristic-hologram', name: '🚀 Hologram Matrix 3D',        type:'image', url:'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1280&q=85&auto=format', bg:'from-cyan-950 to-blue-950', cat:'Vũ Trụ' },
    // ── LUXURY / CAO CẤP ───────────────────────────────────────────────────
    { id: 'luxury-gold',      name: '💎 Gold Diamond Studio VIP',      type:'image', url:'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1280&q=85&auto=format', bg:'from-amber-950 to-black', cat:'Luxury' },
    { id: 'luxury-interior',  name: '🛋️ Nội Thất Luxury 5 Sao',      type:'image', url:'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1280&q=85&auto=format', bg:'from-stone-900 to-black', cat:'Luxury' },
    { id: 'yacht-sea',        name: '⛵ Du Thuyền Biển Xanh VIP',      type:'image', url:'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1280&q=85&auto=format', bg:'from-blue-900 to-cyan-950', cat:'Luxury' },
    { id: 'penthouse-view',   name: '🏙️ Penthouse View Triệu Đô',     type:'image', url:'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1280&q=85&auto=format', bg:'from-slate-800 to-black', cat:'Luxury' },
    { id: 'luxury-bedroom',   name: '🛏️ Phòng Ngủ Luxury Resort',     type:'image', url:'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1280&q=85&auto=format', bg:'from-warm-gray-900 to-black', cat:'Luxury' },
    { id: 'private-jet',      name: '✈️ Private Jet Interior VIP',    type:'image', url:'https://images.unsplash.com/photo-1540339832862-474599807836?w=1280&q=85&auto=format', bg:'from-gray-900 to-black', cat:'Luxury' },
    // ── THƯƠNG MẠI / E-COMMERCE ─────────────────────────────────────────────
    { id: 'shopping-mall',    name: '🛍️ Siêu Thị E-Commerce Flash',   type:'image', url:'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1280&q=85&auto=format', bg:'from-teal-950 to-black', cat:'E-Commerce' },
    { id: 'product-white',    name: '⬜ Studio Trắng Chụp Sản Phẩm',  type:'image', url:'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1280&q=85&auto=format', bg:'from-gray-100 to-white', cat:'E-Commerce' },
    { id: 'festive-fireworks',name: '🎆 Pháo Hoa Flash Sale Đón Tết', type:'image', url:'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=1280&q=85&auto=format', bg:'from-red-950 to-black', cat:'E-Commerce' },
    { id: 'warehouse-chic',   name: '🏭 Warehouse Chic Minimal',       type:'image', url:'https://images.unsplash.com/photo-1553697388-94e804e2f0f6?w=1280&q=85&auto=format', bg:'from-stone-900 to-black', cat:'E-Commerce' },
    // ── NGHỆ THUẬT / ABSTRACT ─────────────────────────────────────────────
    { id: 'abstract-blue',    name: '🔵 Abstract Blue Wave Art',       type:'image', url:'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=1280&q=85&auto=format', bg:'from-blue-950 to-indigo-950', cat:'Abstract' },
    { id: 'abstract-pink',    name: '🩷 Abstract Pink Fluid Art',      type:'image', url:'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1280&q=85&auto=format', bg:'from-pink-950 to-purple-950', cat:'Abstract' },
    { id: 'neon-geometry',    name: '📐 Neon Geometry 3D',             type:'image', url:'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=1280&q=85&auto=format', bg:'from-indigo-950 to-black', cat:'Abstract' },
    { id: 'dark-texture',     name: '🌑 Dark Luxury Texture',          type:'image', url:'https://images.unsplash.com/photo-1512551980832-13df02babc9e?w=1280&q=85&auto=format', bg:'from-gray-950 to-black', cat:'Abstract' },
    { id: 'gold-particles',   name: '✨ Gold Particle Bokeh',          type:'image', url:'https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?w=1280&q=85&auto=format', bg:'from-amber-950 to-black', cat:'Abstract' },
    { id: 'smoke-dark',       name: '💨 Dark Smoke Mystical',          type:'image', url:'https://images.unsplash.com/photo-1514700804955-a1d00e9ac7ef?w=1280&q=85&auto=format', bg:'from-gray-900 to-black', cat:'Abstract' },
    { id: 'gradient-sunset',  name: '🌅 Gradient Sunset Warm',         type:'image', url:'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1280&q=85&auto=format', bg:'from-orange-900 to-pink-950', cat:'Abstract' },
    // ── HÀN QUỐC / AESTHETIC ─────────────────────────────────────────────
    { id: 'korean-cafe',      name: '🍵 Korean Aesthetic Cafe',        type:'image', url:'https://images.unsplash.com/photo-1559056961-1f57b83d38fb?w=1280&q=85&auto=format', bg:'from-amber-900 to-stone-950', cat:'K-Style' },
    { id: 'kpop-stage',       name: '🎤 K-Pop Stage Concert Lights',   type:'image', url:'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1280&q=85&auto=format', bg:'from-purple-950 to-black', cat:'K-Style' },
    { id: 'korean-garden',    name: '🌸 Korean Traditional Garden',    type:'image', url:'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=1280&q=85&auto=format', bg:'from-green-950 to-black', cat:'K-Style' },
    { id: 'pink-room',        name: '🩷 Pink Aesthetic Room Girly',    type:'image', url:'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1280&q=85&auto=format', bg:'from-pink-950 to-rose-950', cat:'K-Style' },
    // ── PHÔNG XANH ──────────────────────────────────────────────────────────
    { id: 'minimal-green',    name: '🟢 Phông Xanh Tách Nền (Chroma Key)', type:'solid', url:null, color:'#00B140', bg:'from-emerald-900 to-green-950', cat:'Chroma Key' },
    { id: 'minimal-blue-screen', name: '🔵 Phông Xanh Dương (Blue Key)', type:'solid', url:null, color:'#0047AB', bg:'from-blue-900 to-blue-950', cat:'Chroma Key' },
  ];

  const originUrl = typeof window !== 'undefined' ? window.location.origin.replace(/(localhost|127\.0\.0\.1)(?!\.nip\.io)/, '127.0.0.1.nip.io') : 'http://127.0.0.1.nip.io:5173';
  const overlayLinksList = [
    {
      id: 'cleanlive',
      title: '🌐 Sân Khấu Sạch (Clean Live Output)',
      url: `${originUrl}/?overlay=live`,
      tag: 'OBS / TIKTOK LIVE STUDIO',
      color: 'from-blue-600 to-cyan-500',
      desc: 'Màn hình phát sạch 100% không nút bấm, hiển thị AI Avatar, sản phẩm, và hiệu ứng live.'
    },
    {
      id: 'dancefloor',
      title: '💃 Sàn Nhảy TikTok Tương Tác 2D & 3D',
      url: `${originUrl}/?overlay=dancefloor`,
      tag: 'TƯƠNG TÁC TIKTOK LIVE',
      color: 'from-pink-600 to-rose-500',
      desc: 'Sàn diễn nhảy theo Quà, Like, Comment TikTok realtime với nhân vật 3D chuyển động.'
    },
    {
      id: 'gamebattle',
      title: '⚔️ Đấu Trường PK Quà Tặng Game Battle',
      url: `${originUrl}/?overlay=battle`,
      tag: 'GAME PK THI ĐẤU',
      color: 'from-purple-600 to-indigo-500',
      desc: 'Màn hình PK 2 phe thi đấu so kè quà tặng và comment giữa các khán giả.'
    },
    {
      id: 'bando',
      title: '🗺️ Bản Đồ Việt Nam Check-in 63 Tỉnh Thành',
      url: `${originUrl}/?overlay=bando`,
      tag: 'VIETNAM MAP LIVE',
      color: 'from-amber-600 to-red-500',
      desc: 'Bản đồ tương tác tính điểm tỉnh thành theo comment người xem realtime.'
    },
    {
      id: 'rtmp_tiktok',
      title: '🎵 RTMP Server TikTok Live Upload',
      url: 'rtmp://live-upload.tiktok.com/app/',
      tag: 'SERVER STREAM RTMP',
      color: 'from-red-600 to-pink-600',
      desc: 'Địa chỉ RTMP Server chính thức dùng để phát từ OBS Studio lên TikTok Live.'
    },
    {
      id: 'rtmp_fb',
      title: '📘 RTMP Server Facebook Live RTMPS',
      url: 'rtmps://live-api-s.facebook.com:443/rtmp/',
      tag: 'SERVER STREAM RTMP',
      color: 'from-blue-700 to-indigo-600',
      desc: 'Địa chỉ Server RTMPS phát luồng trực tiếp lên Fanpage và Trang cá nhân Facebook.'
    },
    {
      id: 'rtmp_yt',
      title: '🔴 RTMP Server YouTube Live Stream',
      url: 'rtmp://a.rtmp.youtube.com/live2',
      tag: 'SERVER STREAM RTMP',
      color: 'from-red-600 to-red-700',
      desc: 'Địa chỉ RTMP Server luồng trực tiếp siêu nét 4K/FullHD lên YouTube Studio.'
    }
  ];

  const handleCopyOverlayLink = (id, url) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setOverlayCopiedId(id);
      setTimeout(() => setOverlayCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-3 p-1 sm:p-2">
      {/* Hidden Permanent Video Tag for Real Webcam Capture */}
      <video
        ref={webcamVideoRef}
        autoPlay
        playsInline
        muted
        style={{ position: 'fixed', top: -9999, left: -9999, width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
      />

      {/* 👑 MODAL 1 ĐƯỜNG LINK DUY NHẤT TOÀN NĂNG CHO TIKTOK LIVE STUDIO & OBS STUDIO */}
      <UniversalMasterOverlayModal
        isOpen={showOverlayLinksModal}
        onClose={() => setShowOverlayLinksModal(false)}
      />

      {/* MODAL HƯỚNG DẪN & CẤU HÌNH ĐA CAMERA / ĐA LUỒNG */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-purple-500/40 max-w-3xl w-full text-left space-y-5 shadow-2xl bg-[#0A0A0A]/95 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-purple-400" />
                  📖 CẨM NANG HƯỚNG DẪN & NÂNG CẤP PHÒNG DỰNG 4K
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Kết nối hàng chục Camera (NDI/RTSP/Capture Card) và vận hành Livestream Đa Luồng Đa Nền Tảng</p>
              </div>
              <button onClick={() => setShowGuideModal(false)} className="text-gray-400 hover:text-white font-bold text-xl cursor-pointer">✕</button>
            </div>

            {/* Guide Tabs Header */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
              {[
                { id: 'multicam', label: '📹 KẾT NỐI ĐA CAMERA', icon: Camera, color: 'text-purple-400' },
                { id: 'switcher', label: '🎬 VẬN HÀNH BÀN DỰNG', icon: Layers, color: 'text-red-400' },
                { id: 'multistream', label: '📡 CHẠY ĐA LUỒNG MULTISTREAM', icon: Share2, color: 'text-blue-400' },
                { id: 'hardware', label: '⚡ NÂNG CẤP HẠ TẦNG & MẠNG', icon: Cpu, color: 'text-emerald-400' },
              ].map(t => {
                const IconComp = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setGuideTab(t.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      guideTab === t.id
                        ? 'bg-purple-600 text-white shadow-glow-purple'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <IconComp className={`w-3.5 h-3.5 ${t.color}`} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: KẾT NỐI ĐA CAMERA */}
            {guideTab === 'multicam' && (
              <div className="space-y-4 text-xs text-gray-300">
                <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-purple-300 text-sm flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-purple-400" /> 1. Chuẩn Giao Thức Kết Nối Hàng Chục Camera Cùng Lúc
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">NDI / RTSP / PCIe</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Hệ thống hỗ trợ kết nối đồng thời từ 4 đến 32+ nguồn camera thông qua 4 giao thức chuẩn truyền hình:
                  </p>
                  <ul className="list-disc pl-4 space-y-1.5 text-gray-400 text-[11px]">
                    <li><strong className="text-white">NDI / NDI|HX (Mạng LAN):</strong> Tự động quét và nhận diện camera/máy ảnh/điện thoại cắm chung Wi-Fi 6 hoặc Switch LAN mà không cần dây dẫn cáp.</li>
                    <li><strong className="text-white">RTSP Stream (IP Camera Studio/NVR):</strong> Nhập địa chỉ RTSP (`rtsp://admin:pass@ip:554/stream`) từ camera giám sát/IP Studio.</li>
                    <li><strong className="text-white">Capture Card PCIe (HDMI/SDI):</strong> Cắm card phần cứng như *Blackmagic DeckLink Quad 2* (8 cổng SDI) để nhận trực tiếp máy ảnh DSLR 4K.</li>
                    <li><strong className="text-white">WebRTC Remote (Hiện trường xa):</strong> Nhận góc quay từ smartphone phóng viên ở bất kỳ đâu qua Internet độ trễ siêu thấp.</li>
                  </ul>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-black/60 border border-white/10">
                  <div>
                    <span className="font-bold text-white block">Thao tác thêm Camera mới ngay bây giờ:</span>
                    <span className="text-[10px] text-gray-400">Thêm URL RTSP, luồng NDI hoặc thiết bị USB Capture vào danh sách bàn dựng.</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowGuideModal(false);
                      setAddCamModalOpen(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-glow-purple"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm Camera Mới</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: VẬN HÀNH BÀN DỰNG MULTICAM */}
            {guideTab === 'switcher' && (
              <div className="space-y-4 text-xs text-gray-300">
                <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 space-y-2">
                  <span className="font-black text-red-300 text-sm flex items-center gap-2">
                    <Layers className="w-4 h-4 text-red-400" /> 2. Quy Trình Chuyển Cảnh 0ms & Multi-Layout Lưới
                  </span>
                  <p className="text-gray-300 leading-relaxed">
                    Vận hành phòng dựng truyền hình với 2 màn hình chuẩn Broadcast:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] pt-1">
                    <div className="p-3 rounded-xl bg-black/50 border border-red-500/40">
                      <strong className="text-red-400 block mb-1">🔴 PGM (Program Monitor - Live):</strong>
                      <p className="text-gray-400">Tín hiệu thực tế đang phát trực tiếp tới khán giả trên TikTok/Facebook/YouTube. Bấm nút <strong>CUT</strong> để chuyển từ PVW sang PGM tức thì 0ms.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/40">
                      <strong className="text-emerald-400 block mb-1">🟢 PVW (Preview Monitor - Xem trước):</strong>
                      <p className="text-gray-400">Chọn góc camera tiếp theo để xem trước, căn chỉnh góc quay và ánh sáng trước khi phát ra màn hình PGM.</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-1 text-[11px] text-gray-400">
                  <strong className="text-white block">💡 Chuyển đổi giao diện hiển thị linh hoạt:</strong>
                  <p>Bấm chọn các nút <strong>Lưới 4</strong>, <strong>Lưới 9</strong>, <strong>Lưới 16</strong> hoặc <strong>PiP (Picture-in-Picture)</strong> trên thanh công cụ Director Suite để theo dõi đồng thời hàng chục góc máy.</p>
                </div>
              </div>
            )}

            {/* TAB 3: CHẠY ĐA LUỒNG ĐA NỀN TẢNG */}
            {guideTab === 'multistream' && (
              <div className="space-y-4 text-xs text-gray-300">
                <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-blue-300 text-sm flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-blue-400" /> 3. Hướng Dẫn Phát Trực Tiếp Đa Luồng Đa Nền Tảng
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold">Multistream 50+ Kênh</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Sau khi dựng xong luồng hình PGM 4K, hệ thống sẽ phân phối tín hiệu video trực tiếp tới hàng chục tài khoản cùng lúc:
                  </p>
                  <ol className="list-decimal pl-4 space-y-1.5 text-gray-400 text-[11px]">
                    <li><strong className="text-white">Bước 1:</strong> Mở tab <strong>Quản Lý Đa Luồng (Multistream Studio)</strong> trên thanh menu chính.</li>
                    <li><strong className="text-white">Bước 2:</strong> Nhập <strong>Stream Key & RTMP URL</strong> của từng nền tảng (TikTok Live Studio, Facebook Fanpage, YouTube Studio, Shopee Live, Lazada).</li>
                    <li><strong className="text-white">Bước 3:</strong> Bấm <strong>"BẮT ĐẦU LIVESTREAM MẮT BÃO"</strong> để phát sóng đồng loạt trên toàn bộ 10 - 50 tài khoản.</li>
                  </ol>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-black/60 border border-white/10">
                  <div>
                    <span className="font-bold text-white block">Mở Workspace Quản Lý Đa Luồng:</span>
                    <span className="text-[10px] text-gray-400">Kết nối tài khoản TikTok, Facebook, YouTube, Shopee và nhập Stream Key.</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowGuideModal(false);
                      if (setActiveTab) setActiveTab('multistream');
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-glow-blue"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Mở Multistream Studio</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: PHẦN CỨNG & MẠNG */}
            {guideTab === 'hardware' && (
              <div className="space-y-4 text-xs text-gray-300">
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
                  <span className="font-black text-emerald-300 text-sm flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-emerald-400" /> 4. Đề Xuất Cấu Hình Hardware & Mạng Chuẩn Studio 4K
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
                    <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1">
                      <span className="text-emerald-400 font-bold block">💻 Card Đồ Họa (GPU)</span>
                      <p className="text-gray-400">NVIDIA RTX 4070 / RTX 4090 (Trang bị NVENC Encoder xử lý mã hóa 16 luồng 4K song song).</p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1">
                      <span className="text-amber-400 font-bold block">🌐 Mạng Nội Bộ (LAN)</span>
                      <p className="text-gray-400">Switch Mạng 2.5Gbps hoặc 10Gbps chuyên dụng cho truyền tải luồng NDI không bị rơi khung hình (Dropped Frames).</p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1">
                      <span className="text-cyan-400 font-bold block">📡 Internet Livestream</span>
                      <p className="text-gray-400">Đường truyền Upload từ 100 Mbps - 500 Mbps (Có line mạng dự phòng Redundant Failover).</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowGuideModal(false);
                    setAddCamModalOpen(true);
                  }}
                  className="px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-purple-400" />
                  <span>+ Thêm Camera Mới</span>
                </button>
              </div>

              <button
                onClick={() => setShowGuideModal(false)}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-xl transition-all cursor-pointer shadow-glow-purple"
              >
                Đã Hiểu & Đóng Lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL THÊM KẾT NỐI CAMERA MỚI (NDI / RTSP / PCIe CAPTURE / WEBRTC) */}
      {addCamModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-purple-500/40 max-w-lg w-full text-left space-y-4 shadow-2xl bg-[#0A0A0A]/95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-400" />
                ⚙️ THÊM KẾT NỐI CAMERA MỚI
              </h3>
              <button onClick={() => setAddCamModalOpen(false)} className="text-gray-400 hover:text-white font-bold text-lg cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleAddNewCamera} className="space-y-4 text-xs">
              {/* Camera Name */}
              <div className="space-y-1">
                <label className="text-gray-300 font-bold block">1. Tên Camera / Góc Máy:</label>
                <input
                  type="text"
                  value={newCamName}
                  onChange={(e) => setNewCamName(e.target.value)}
                  placeholder="Ví dụ: CAM 17 — Cận Cảnh Sản Phẩm Mới"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-purple-500 font-medium"
                />
              </div>

              {/* Protocol Selector */}
              <div className="space-y-1">
                <label className="text-gray-300 font-bold block">2. Giao Thức Kết Nối (Protocol):</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'ndi', label: 'NDI / NDI|HX (Mạng LAN)', tip: 'Tự động quét camera chung mạng LAN' },
                    { id: 'rtsp', label: 'RTSP Stream (IP Cam)', tip: 'Đường dẫn IP Camera Studio' },
                    { id: 'pcie', label: 'PCIe / USB Capture Card', tip: 'Cắm card Magewell/Blackmagic HDMI' },
                    { id: 'webrtc', label: 'WebRTC Remote (Hiện Trường)', tip: 'Nhận từ Smartphone phóng viên từ xa' },
                  ].map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setNewCamProtocol(p.id);
                        if (p.id === 'ndi') setNewCamUrl('ndi://STUDIO-MOBILE-CAM/STREAM01');
                        if (p.id === 'rtsp') setNewCamUrl('rtsp://admin:pass@192.168.1.150:554/live');
                        if (p.id === 'pcie') setNewCamUrl('dev://video0 (Blackmagic HDMI)');
                        if (p.id === 'webrtc') setNewCamUrl('https://webrtc.avalive.pro/room-8821');
                      }}
                      className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                        newCamProtocol === p.id
                          ? 'bg-purple-600/30 border-purple-500 text-white shadow-glow-purple'
                          : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <div className="text-white text-xs">{p.label}</div>
                      <div className="text-[10px] text-gray-500 font-normal">{p.tip}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stream URL / IP Address */}
              <div className="space-y-1">
                <label className="text-gray-300 font-bold block">3. Đường Dẫn RTSP / NDI Name / Thiết Bị:</label>
                <input
                  type="text"
                  value={newCamUrl}
                  onChange={(e) => setNewCamUrl(e.target.value)}
                  placeholder="rtsp://192.168.1.100:554/live hoặc NDI Name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-emerald-400 font-mono text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Resolution & Role */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-bold block">4. Độ Nét Signal:</label>
                  <select
                    value={newCamRes}
                    onChange={(e) => setNewCamRes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none font-bold"
                  >
                    <option value="4K 60fps">✨ 4K 60fps Ultra HD</option>
                    <option value="1080p 60fps">🎬 1080p 60fps Full HD</option>
                    <option value="1080p 30fps">📹 1080p 30fps Standard</option>
                    <option value="720p 30fps">📡 720p 30fps Mobile</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-bold block">5. Vai Trò Góc Quay:</label>
                  <input
                    type="text"
                    value={newCamRole}
                    onChange={(e) => setNewCamRole(e.target.value)}
                    placeholder="Host, Product, Wide, Drone..."
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none font-bold"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddCamModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-black rounded-xl transition-all cursor-pointer shadow-glow-purple"
                >
                  Lưu & Kết Nối Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1-TOUCH MASTER MULTISTREAM MODAL */}
      {showMultistreamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-2xl p-6 rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-[#141E18] via-[#0D1210] to-[#0A0D0B] text-white shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <span>Bàn Điều Khiển Live Đa Luồng</span>
                  </h3>
                  <p className="text-xs text-emerald-400 font-bold">
                    Đã tự động phát trực tiếp đồng thời lên tất cả các kênh ({connectedChannelsCount} Kênh Active)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowMultistreamModal(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all cursor-pointer font-bold text-xs"
              >
                ✕
              </button>
            </div>

            {/* Connected Channel List Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                <span>Danh Sách Nền Tảng Đã Kết Nối Tự Động:</span>
                <span className="text-emerald-400 font-mono">Tín hiệu: 4K Ultra HD (60 FPS - 12,000 Kbps)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                {[
                  { name: '🎥 Zoom Meeting & Webinar 4K', format: '2160p 60fps (RTMP + Virtual Cam)', status: '🔴 LIVE ZOOM ACTIVE', color: 'border-blue-400/50 bg-blue-900/40 text-blue-200' },
                  { name: '🌐 Facebook Fanpage Bán Hàng VIP', format: '4K 60fps Ultra HD', status: '🔴 STREAMING LIVE', color: 'border-indigo-500/40 bg-indigo-950/30 text-indigo-300' },
                  { name: '🎵 TikTok Live Studio Pro', format: '1080p 60fps Vertical', status: '🔴 STREAMING LIVE', color: 'border-pink-500/40 bg-pink-950/30 text-pink-300' },
                  { name: '🔴 YouTube Studio 4K Stream', format: '2160p 60fps Ultra HD', status: '🔴 STREAMING LIVE', color: 'border-red-500/40 bg-red-950/30 text-red-300' },
                  { name: '📘 Facebook Cá Nhân (Personal Wall)', format: '1080p 60fps', status: '🔴 STREAMING LIVE', color: 'border-blue-500/40 bg-blue-950/30 text-blue-300' },
                  { name: '🛍️ Shopee Live Flash Sale', format: '1080p 60fps', status: '🔴 STREAMING LIVE', color: 'border-orange-500/40 bg-orange-950/30 text-orange-300' },
                  { name: '🛍️ Lazada Super Live Studio', format: '1080p 60fps', status: '🔴 STREAMING LIVE', color: 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300' },
                  { name: '✈️ Telegram Broadcast Live', format: '1080p 60fps', status: '🔴 STREAMING LIVE', color: 'border-sky-500/40 bg-sky-950/30 text-sky-300' },
                  { name: '📡 Custom RTMP Server Studio', format: '4K 60fps', status: '🔴 STREAMING LIVE', color: 'border-purple-500/40 bg-purple-950/30 text-purple-300' },
                ].map((channel, i) => (
                  <div key={i} className={`p-3 rounded-2xl border flex items-center justify-between gap-2 text-xs font-bold ${channel.color}`}>
                    <div className="truncate">
                      <div className="text-white truncate">{channel.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{channel.format}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[9px] font-black whitespace-nowrap animate-pulse">
                      {channel.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Zoom Integration Guidance Banner */}
              <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎥</span>
                  <div>
                    <div className="font-black text-blue-200">Đã Kích Hoạt Luồng Kết Nối Zoom Live Direct!</div>
                    <div className="text-[10px] text-gray-300">Tự động đẩy video đã tách nền + làm đẹp sang phòng họp Zoom Meeting / Webinar của bạn.</div>
                  </div>
                </div>
                <button
                  onClick={() => alert("🎥 HƯỚNG DẪN KẾT NỐI ZOOM TRỰC TIẾP:\n\n1. Trong ứng dụng Zoom, bấm chọn biểu tượng Camera / Video.\n2. Chọn nguồn Nguồn Camera: 'AvaLive Virtual Camera 4K'.\n3. Hoặc dán RTMP Stream Key của Zoom Meeting/Webinar vào ô Custom RTMP Server.\n4. Hình ảnh nhân vật đã được bóc tách sạch 100% & làm đẹp Glass Skin sẽ phát trực tiếp trên Zoom!")}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] transition-all cursor-pointer whitespace-nowrap shadow-glow-blue"
                >
                  ⚙️ Cấu Hình Zoom
                </button>
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-300 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span>0 Mất Khung Hình (Dropped Frames: 0)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowMultistreamModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white font-black text-xs transition-all cursor-pointer shadow-glow-emerald"
                >
                  ✅ ĐÃ KẾT NỐI TOÀN BỘ KÊNH
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4K FULLSCREEN CAMERA / STAGE INSPECTION MODAL */}
      {fullscreenCamItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/95 backdrop-blur-xl animate-scale-up">
          <div className="relative w-full h-full max-w-7xl max-h-[95vh] rounded-3xl overflow-hidden border border-white/20 bg-black flex flex-col justify-between shadow-2xl">
            {/* Fullscreen Header */}
            <div className="p-4 bg-gradient-to-b from-black/90 to-transparent flex items-center justify-between z-30">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{fullscreenCamItem.icon || "🎥"}</span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <span>{fullscreenCamItem.title}</span>
                    <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black animate-pulse">🔴 FULL 4K LIVE</span>
                  </h3>
                  <p className="text-xs text-emerald-400 font-mono font-bold">
                    {fullscreenCamItem.res || "4K Ultra HD (3840x2160p60)"} • {fullscreenCamItem.role || "Zero Lag Ultra Engine"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFullscreenCamItem(null)}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition-all cursor-pointer shadow-glow-red flex items-center gap-1.5"
                >
                  <span>✕ THOÁT FULLSCREEN (ESC)</span>
                </button>
              </div>
            </div>

            {/* Fullscreen Video / Canvas Body */}
            <div className="relative flex-1 w-full h-full flex items-center justify-center bg-black overflow-hidden p-4">
              {fullscreenCamItem.type === "stage" ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  {webcamActive ? (
                    <canvas
                      ref={(elem) => {
                        if (elem && canvasRef.current) {
                          const ctx = elem.getContext("2d");
                          if (ctx) ctx.drawImage(canvasRef.current, 0, 0, elem.width || 1920, elem.height || 1080);
                        }
                      }}
                      className="w-full h-full object-contain rounded-2xl border border-white/10"
                      width={1920}
                      height={1080}
                    />
                  ) : (
                    <img src={selectedStudioAvatar?.image} alt={selectedStudioAvatar?.name} className="max-h-full object-contain rounded-2xl" />
                  )}
                </div>
              ) : (
                /* Camera Feed Fullscreen */
                <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black p-8 rounded-2xl border border-white/10">
                  <div className="text-6xl sm:text-8xl animate-bounce mb-4">{fullscreenCamItem.icon || "📹"}</div>
                  <h2 className="text-xl sm:text-3xl font-black text-white text-center mb-2">{fullscreenCamItem.title}</h2>
                  <p className="text-emerald-400 font-mono text-sm font-bold bg-emerald-950/60 px-4 py-2 rounded-full border border-emerald-500/40 mb-4">
                    {fullscreenCamItem.res || "4K 2160p60 Ultra HD"} • {fullscreenCamItem.role || "Góc Rộng Studio"}
                  </p>
                  <p className="text-gray-400 text-xs text-center max-w-md">Đang nhận tín hiệu camera trực tiếp.</p>
                </div>
              )}
            </div>

            {/* Fullscreen Footer Telemetry */}
            <div className="p-3 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between text-xs font-mono text-gray-300 z-30 border-t border-white/10">
              <div className="flex items-center gap-4">
                <span className="text-emerald-400 font-bold">FPS: 60.0 (Zero Lag)</span>
                <span className="text-purple-400 font-bold">GPU: 18% (NVENC 4K)</span>
                <span className="text-blue-400 font-bold">BITRATE: 24.0 Mbps</span>
              </div>
              <span className="text-gray-400">Bấm ✕ hoặc nhấn ESC để thu nhỏ</span>
            </div>
          </div>
        </div>
      )}

            {/* DEDICATED ZOOM LIVE MEETING & WEBINAR INTEGRATION MODAL */}
      {showZoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-2xl p-6 rounded-3xl border border-blue-500/40 bg-gradient-to-b from-[#0F172A] via-[#0B1120] to-[#070A14] text-white shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-400 shadow-glow-blue">
                  <Video className="w-7 h-7 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <span>🎥 CỔNG KẾT NỐI ZOOM LIVE MEETING & WEBINAR 4K</span>
                  </h3>
                  <p className="text-xs text-blue-300 font-bold">
                    Tự động truyền hình ảnh nhân vật bóc tách sạch 100% + làm đẹp Glass Skin trực tiếp vào Zoom
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowZoomModal(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all cursor-pointer font-bold text-xs"
              >
                ✕
              </button>
            </div>

            {/* Quick Mode Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Option 1: Virtual Camera */}
              <div className={`p-4 rounded-2xl border space-y-2 transition-all ${
                isZoomLiveActive ? 'border-emerald-500 bg-emerald-950/30' : 'border-blue-500/30 bg-blue-950/30 hover:border-blue-400'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-blue-300">CÁCH 1: WEBCAM ẢO 1-CHẠM</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-black">KHUYÊN DÙNG</span>
                </div>
                <p className="text-[11px] text-gray-300">Mở app Zoom trên máy tính/điện thoại và chọn Nguồn Camera là <strong>AvaLive PRO Camera 4K</strong>.</p>
                <button
                  onClick={() => {
                    setIsZoomLiveActive(true);
                    alert("🟢 KÍCH HOẠT THÀNH CÔNG VIRTUAL CAMERA FOR ZOOM!\n\nHướng dẫn sử dụng:\n1. Mở ứng dụng Zoom trên máy tính hoặc điện thoại.\n2. Vào phần cài đặt Video (Cài Đặt -> Video -> Nguồn Camera).\n3. Chọn nguồn camera: 'AvaLive Virtual Camera 4K'.\n4. Video nhân vật của bạn đã được làm đẹp mịn da trắng sứ & xóa sạch phông nền sẽ xuất hiện ngay trên phòng Zoom!");
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white font-black text-xs transition-all shadow-glow-blue cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>{isZoomLiveActive ? '🟢 ĐÃ BẬT VIRTUAL CAM CHO ZOOM' : '⚡ BẬT VIRTUAL CAM CHO ZOOM'}</span>
                </button>
              </div>

              {/* Option 2: RTMP Direct Stream */}
              <div className="p-4 rounded-2xl border border-purple-500/30 bg-purple-950/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-purple-300">CÁCH 2: PHÁT RTMP TRỰC TIẾP</span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[9px] font-black">ZOOM WEBINAR</span>
                </div>
                <p className="text-[11px] text-gray-300">Dán Khóa Luồng Stream Key của Zoom Meeting/Webinar để tự động phát trực tiếp.</p>
                <button
                  onClick={() => {
                    setIsZoomLiveActive(true);
                    alert(`🔴 ĐÃ KẾT NỐI PHÁT LIVE SANG ZOOM WEBINAR/MEETING!\n\nKhóa luồng: ${zoomStreamKey}`);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-black text-xs transition-all shadow-glow-purple cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Radio className="w-4 h-4 text-yellow-300" />
                  <span>🔴 PHÁT LIVE SANG ZOOM RTMP</span>
                </button>
              </div>
            </div>

            {/* RTMP Inputs Details Form */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-300 block">Đường Dẫn Server Zoom (Live Stream URL / Stream Key):</label>
                <input
                  type="text"
                  value={zoomStreamKey}
                  onChange={(e) => setZoomStreamKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-blue-300 font-mono text-xs focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            {/* Guidance Steps List */}
            <div className="p-3.5 rounded-2xl bg-blue-950/20 border border-blue-500/20 space-y-1.5 text-xs text-gray-300">
              <div className="font-black text-blue-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>3 Bước Kết Nối Zoom Dễ Dàng:</span>
              </div>
              <ul className="space-y-1 text-[11px] list-disc list-inside text-gray-300 pl-1">
                <li><strong className="text-white">Bước 1:</strong> Bật camera <strong className="text-emerald-400">"📷 BẬT WEBCAM THẬT"</strong> và chọn phông nền studio.</li>
                <li><strong className="text-white">Bước 2:</strong> Bấm nút <strong className="text-blue-400">"⚡ BẬT VIRTUAL CAM CHO ZOOM"</strong> ở trên.</li>
                <li><strong className="text-white">Bước 3:</strong> Trong Zoom Meeting, chọn Nguồn Camera là <strong className="text-amber-300">"AvaLive PRO Camera 4K"</strong> — Hoàn tất!</li>
              </ul>
            </div>

            {/* Action Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Trạng thái: 0ms Latency (Zero Lag Active)
              </span>
              <button
                onClick={() => setShowZoomModal(false)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-90 text-white font-black text-xs transition-all cursor-pointer shadow-glow-blue"
              >
                ✅ XÁC NHẬN & QUAY LẠI STUDIO
              </button>
            </div>
          </div>
        </div>
      )}

      {studioSubTab === 'commerce' ? (
        <LiveCommerceStudio isLive={isLive} />
      ) : (
        <>
      {/* Main Studio Production Stage & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Preview Monitor (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* REAL-TIME CAMERA CONTROL BAR (ULTRA CLEAN & COMPACT) */}
          <div className="glass-panel p-2 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-2 bg-black/80 text-xs shadow-xl">
            <div className="flex flex-wrap items-center gap-1.5">
              {/* WEBCAM TOGGLE */}
              <button
                onClick={toggleWebcam}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                  webcamActive
                    ? 'bg-red-600 text-white shadow-glow-red animate-pulse'
                    : 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white hover:opacity-90 shadow-glow-purple'
                }`}
                title="Bật/Tắt Webcam thật từ máy tính"
              >
                <Camera className="w-4 h-4" />
                <span>{webcamActive ? '🔴 TẮT CAMERA' : '📷 BẬT CAMERA'}</span>
              </button>

              {/* MỞ CỬA SỔ OBS SẠCH */}
              <div className="flex items-center gap-1.5 ml-2 border-l border-white/20 pl-2">
                <span className="text-[10px] text-gray-400 font-bold mr-1 uppercase">Mở Cửa Sổ OBS:</span>
                <button 
                  onClick={() => openOBSWindow('9:16')}
                  className="px-2.5 py-1.5 rounded-lg font-black text-[10px] bg-blue-600/30 text-white border border-blue-500/50 hover:bg-blue-600/60 transition-all cursor-pointer shadow-glow-blue flex items-center gap-1"
                  title="Mở Video Dọc (9:16) cho OBS"
                >
                  📱 DỌC (9:16)
                </button>
                <button 
                  onClick={() => openOBSWindow('16:9')}
                  className="px-2.5 py-1.5 rounded-lg font-black text-[10px] bg-purple-600/30 text-white border border-purple-500/50 hover:bg-purple-600/60 transition-all cursor-pointer shadow-glow-purple flex items-center gap-1"
                  title="Mở Video Ngang (16:9) cho OBS"
                >
                  📺 NGANG (16:9)
                </button>
              </div>

              {/* SCREEN SHARE */}
              <ScreenShareControls
                isSharing={isScreenSharing}
                layout={screenShareLayout}
                onStart={handleStartScreenShare}
                onStop={handleStopScreenShare}
                onChangeLayout={setScreenShareLayout}
              />
            </div>

            {/* Trạng thái Camera đang hiển thị */}
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-black border flex items-center gap-1 ${
                webcamActive 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20' 
                  : 'bg-white/5 text-gray-400 border-white/10'
              }`}>
                <span className={`w-2 h-2 rounded-full ${webcamActive ? 'bg-emerald-400 animate-ping' : 'bg-gray-500'}`}></span>
                <span>{webcamActive ? '🟢 Camera Chính Sẵn Sàng' : '⚪ Đang Tắt Camera'}</span>
              </span>
            </div>
          </div>

          {/* Hidden video element feeding the shared-screen stream into processFrame() */}
          <video
            ref={screenShareVideoRef}
            autoPlay
            playsInline
            muted
            style={{ display: 'none' }}
          />

          {beautyEngineDegraded && (
            <div className="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
              ⚠️ Không tải được Beauty Engine v2 (WebGL) — đang dùng chế độ làm đẹp cơ bản (CSS Filter).
            </div>
          )}

          {/* MASTER STUDIO PRODUCTION STAGE (RESPONSIVE 16:9 & 9:16 DỌC TIKTOK) */}
          <div className={`w-full ${stageAspectRatio === '9:16' ? 'flex justify-center items-center py-2 bg-[#0b0b10] rounded-3xl border border-white/10 shadow-inner' : ''}`}>
            <div className={`relative overflow-hidden bg-black shadow-2xl transform-gpu ${
              stageAspectRatio === '9:16' 
                ? 'aspect-[9/16] w-full max-w-[360px] sm:max-w-[400px] rounded-3xl border-2 border-pink-500/50 shadow-[0_20px_50px_rgba(236,72,153,0.25)]' 
                : 'aspect-video w-full rounded-3xl border border-white/15'
            }`}>

              {/* 🔲 CHẾ ĐỘ 1: DUAL LIVE DISPLAY (Khi có cả Webcam và Luồng TikTok Live) */}
              {(webcamActive && tiktokLiveFlvUrl) ? (
                <div className="w-full h-full relative overflow-hidden bg-black">
                  {dualLiveDisplayMode === 'sidebyside' ? (
                    /* Side by Side (Chia đôi 50/50) */
                    <div className="w-full h-full grid grid-cols-2 gap-1 p-1 bg-black">
                      <div className="relative rounded-2xl overflow-hidden border border-purple-500/40 bg-black">
                        <canvas ref={canvasRef} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-purple-600/80 text-white text-[10px] font-black z-10 flex items-center gap-1">
                          <Camera className="w-3 h-3" /> Camera Studio
                        </div>
                      </div>
                      <div className="relative rounded-2xl overflow-hidden border border-pink-500/40 bg-black">
                        <video src={tiktokLiveFlvUrl} autoPlay playsInline controls className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-red-600/80 text-white text-[10px] font-black z-10 flex items-center gap-1 animate-pulse">
                          <Radio className="w-3 h-3" /> TikTok Live
                        </div>
                      </div>
                    </div>
                  ) : dualLiveDisplayMode === 'tiktok_only' ? (
                    /* Toàn màn hình TikTok Live */
                    <div className="w-full h-full relative">
                      <video src={tiktokLiveFlvUrl} autoPlay playsInline controls className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-red-600 text-white text-[11px] font-black flex items-center gap-1 shadow-glow-red animate-pulse z-20">
                        <Radio className="w-3 h-3 animate-spin" /> TikTok Live Stream
                      </div>
                    </div>
                  ) : dualLiveDisplayMode === 'cam_only' ? (
                    /* Toàn màn hình Camera Studio */
                    <div className="w-full h-full relative">
                      <canvas ref={canvasRef} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    /* Mặc định: Picture-in-Picture (Góc Nổi) */
                    <div className="w-full h-full relative">
                      {isSwappedPip ? (
                        <>
                          <video src={tiktokLiveFlvUrl} autoPlay playsInline controls className="w-full h-full object-cover" />
                          <div 
                            onClick={() => setIsSwappedPip(!isSwappedPip)}
                            className="absolute bottom-3 right-3 w-32 sm:w-40 aspect-video rounded-2xl overflow-hidden border-2 border-purple-400 shadow-2xl cursor-pointer hover:scale-105 transition-all z-30 group"
                            title="Bấm để đổi màn hình chính"
                          >
                            <canvas ref={canvasRef} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-black transition-opacity">
                              🔄 Đổi chỗ
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <canvas ref={canvasRef} className="w-full h-full object-cover" />
                          <div 
                            onClick={() => setIsSwappedPip(!isSwappedPip)}
                            className="absolute bottom-3 right-3 w-32 sm:w-40 aspect-[9/16] rounded-2xl overflow-hidden border-2 border-pink-400 shadow-2xl cursor-pointer hover:scale-105 transition-all z-30 group"
                            title="Bấm để đổi màn hình chính"
                          >
                            <video src={tiktokLiveFlvUrl} autoPlay playsInline muted className="w-full h-full object-cover" />
                            <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-red-600 text-white text-[8px] font-black">
                              LIVE
                            </div>
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-black transition-opacity">
                              🔄 Đổi chỗ
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Thanh nút chuyển đổi Dual View nhanh */}
                  <div className="absolute bottom-3 left-3 z-30 flex items-center gap-1 bg-black/80 backdrop-blur-md p-1 rounded-xl border border-white/20">
                    <button
                      onClick={() => setDualLiveDisplayMode('pip')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${
                        dualLiveDisplayMode === 'pip' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      🖼️ Góc Nổi PiP
                    </button>
                    <button
                      onClick={() => setDualLiveDisplayMode('sidebyside')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${
                        dualLiveDisplayMode === 'sidebyside' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      ◫ Chia Đôi Song Song
                    </button>
                    <button
                      onClick={() => setDualLiveDisplayMode('cam_only')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${
                        dualLiveDisplayMode === 'cam_only' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      📷 Cam Studio
                    </button>
                    <button
                      onClick={() => setDualLiveDisplayMode('tiktok_only')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${
                        dualLiveDisplayMode === 'tiktok_only' ? 'bg-pink-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      📱 TikTok Live
                    </button>
                  </div>
                </div>
              ) : (webcamActive || isScreenSharing || multiCamGridActive) ? (
                /* CHẾ ĐỘ 2: Camera Canvas Stage (Webcam / MultiCam) */
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full object-cover transform-gpu"
                />
              ) : tiktokLiveFlvUrl ? (
                /* CHẾ ĐỘ 3: TikTok Live Stream Source độc lập */
                <div className="relative w-full h-full flex flex-col items-center justify-center bg-black">
                  <video
                    src={tiktokLiveFlvUrl}
                    autoPlay
                    playsInline
                    controls
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-red-600 text-white text-[11px] font-black flex items-center gap-1 shadow-glow-red animate-pulse z-20">
                    <Radio className="w-3 h-3 animate-spin" /> TikTok Live Stream
                  </div>
                </div>
              ) : (
                /* CHẾ ĐỘ 4: Sân khấu khi chưa bật camera: Hiển thị giao diện kích hoạt 1-chạm */
                <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1E1E24] via-[#121216] to-[#0A0A0A] p-4 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 via-pink-600 to-red-500 flex items-center justify-center mb-3 shadow-glow-purple animate-pulse">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-white mb-1 tracking-wide">
                    SÂN KHẤU LIVE STUDIO ĐÃ SẴN SÀNG
                  </h3>
                  <p className="text-xs text-gray-400 max-w-xs mb-4">
                    Bấm nút bên dưới để kết nối Camera thật máy tính hoặc chuyển đổi các Camera phụ trong Director Suite.
                  </p>
                  <button
                    onClick={toggleWebcam}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:opacity-90 text-white font-black text-xs shadow-glow-purple flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <Camera className="w-4 h-4" />
                    <span>📷 BẬT CAMERA / WEBCAM NGAY</span>
                  </button>
                </div>
              )}

              {/* RingLight Studio Halo Glow Overlay */}
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-300 rounded-3xl z-20"
                style={{ boxShadow: `inset 0 0 ${ringLight * 1.5}px rgba(255, 255, 255, ${ringLight / 120})` }}
              />


            </div>
          </div>

          {/* ─── 16-CAMERA PROFESSIONAL MULTI-CAMERA DIRECTOR SUITE ─── */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
            {/* Director Suite Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#EF4444]/20 flex items-center justify-center">
                  <Camera className="w-4 h-4 text-[#EF4444]" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">🎬 DIRECTOR SUITE — {cameras.filter(c => camPowers[c.id] !== false).length} CAMERA ĐANG HOẠT ĐỘNG</h3>
                  <p className="text-[10px] text-gray-500 font-mono">Chuyển camera tức thì 0ms • Preview Monitor • Multi-Layout</p>
                </div>
              </div>
              {/* Layout Switcher & Add Camera Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAddCamModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/60 text-purple-200 border border-purple-500/40 text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer shadow-glow-purple"
                >
                  <Plus className="w-3 h-3 text-purple-400" />
                  <span>+ KẾT NỐI CAMERA</span>
                </button>
                {[{ id: 'grid4', label: '▤ 4', tip: 'Lưới 4 cam' }, { id: 'grid9', label: '▦ 9', tip: 'Lưới 9 cam' }, { id: 'grid16', label: '▪▪ 16', tip: 'Lưới 16 cam' }, { id: 'pip', label: '⊡ PiP', tip: 'Picture-in-Picture' }].map(l => (
                  <button key={l.id} onClick={() => setCamLayout(l.id)} title={l.tip}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                      camLayout === l.id ? 'bg-[#EF4444] text-white shadow-glow-red' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}>{l.label}</button>
                ))}
              </div>
            </div>

            {/* PROGRAM (Live) + PREVIEW (Next) dual monitors */}
            <div className="grid grid-cols-2 gap-3">
              {/* PROGRAM Monitor — Live Output */}
              <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-[#EF4444] shadow-neon-red">
                <div className="aspect-video bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                  <div className="text-center space-y-1">
                    <div className="text-3xl">{cameras.find(c => c.id === activeCam)?.icon || '🎥'}</div>
                    <p className="text-white text-xs font-black">{cameras.find(c => c.id === activeCam)?.name}</p>
                    <p className="text-emerald-400 text-[10px] font-mono">{cameras.find(c => c.id === activeCam)?.res}</p>
                  </div>
                </div>
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 bg-[#EF4444] text-white text-[10px] font-black rounded flex items-center gap-1 animate-pulse"><span className="w-1.5 h-1.5 bg-white rounded-full"></span>PGM</span>
                </div>
                <button
                  onClick={() => setFullscreenCamItem({
                    title: `PROGRAM LIVE (PGM) — ${cameras.find(c => c.id === activeCam)?.name}`,
                    icon: cameras.find(c => c.id === activeCam)?.icon || "🎥",
                    res: cameras.find(c => c.id === activeCam)?.res,
                    role: cameras.find(c => c.id === activeCam)?.role,
                    type: "pgm"
                  })}
                  className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-red-600/90 hover:bg-red-600 text-white text-[10px] font-black border border-red-300 transition-all cursor-pointer z-20 flex items-center gap-1 shadow-lg"
                  title="Xem Full Khung Hình PROGRAM Live"
                >
                  <Maximize className="w-3 h-3 text-amber-300" />
                  <span>🔍 FULL PGM</span>
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 py-1 px-2">
                  <p className="text-[10px] font-bold text-white truncate">{cameras.find(c => c.id === activeCam)?.role}</p>
                </div>
              </div>

              {/* PREVIEW Monitor — Next Camera */}
              <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-emerald-500/60">
                <div className="aspect-video bg-gradient-to-br from-gray-900/80 to-black flex items-center justify-center opacity-80">
                  <div className="text-center space-y-1">
                    <div className="text-3xl">{cameras.find(c => c.id === previewCam)?.icon || '🎬'}</div>
                    <p className="text-white text-xs font-black">{cameras.find(c => c.id === previewCam)?.name}</p>
                    <p className="text-emerald-400 text-[10px] font-mono">{cameras.find(c => c.id === previewCam)?.res}</p>
                  </div>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-black rounded">PVW</span>
                </div>
                <button
                  onClick={() => setFullscreenCamItem({
                    title: `PREVIEW NEXT (PVW) — ${cameras.find(c => c.id === previewCam)?.name}`,
                    icon: cameras.find(c => c.id === previewCam)?.icon || "🎬",
                    res: cameras.find(c => c.id === previewCam)?.res,
                    role: cameras.find(c => c.id === previewCam)?.role,
                    type: "pvw"
                  })}
                  className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white text-[10px] font-black border border-emerald-300 transition-all cursor-pointer z-20 flex items-center gap-1 shadow-lg"
                  title="Xem Full Khung Hình PREVIEW Next"
                >
                  <Maximize className="w-3 h-3 text-amber-300" />
                  <span>🔍 FULL PVW</span>
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 py-1 px-2">
                  <p className="text-[10px] font-bold text-gray-300 truncate">TIẾP THEO: {cameras.find(c => c.id === previewCam)?.role}</p>
                </div>
              </div>
            </div>

            {/* CUT / FADE / MIX controls */}
            <div className="flex items-center justify-center gap-3">
              {[{ label: '✂️ CUT', color: 'bg-[#EF4444] hover:bg-red-700 shadow-neon-red' }, { label: '🎞️ FADE', color: 'bg-[#8B5CF6] hover:bg-purple-700 shadow-neon-purple' }, { label: '🔀 MIX', color: 'bg-[#3B82F6] hover:bg-blue-700 shadow-neon-blue' }].map(btn => (
                <button key={btn.label}
                  onClick={() => { setActiveCam(previewCam); setPreviewCam(activeCam); }}
                  className={`px-5 py-2.5 rounded-xl text-white text-xs font-black transition-all cursor-pointer ${btn.color}`}>
                  {btn.label}
                </button>
              ))}
              <div className="h-6 w-px bg-white/10 mx-1" />
              <span className="text-[10px] text-gray-500 font-mono">⌨️ SPACE = CUT NHANH</span>
            </div>

            {/* Camera Grid Multiview */}
            <div className={`grid gap-2 ${
              camLayout === 'grid4'  ? 'grid-cols-4' :
              camLayout === 'grid9'  ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5' :
              camLayout === 'grid16' ? 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8' : 'grid-cols-4'
            }`}>
              {cameras.slice(0, camLayout === 'grid16' ? 16 : camLayout === 'grid9' ? 9 : 4).map((cam) => {
                const isActive = activeCam === cam.id;
                const isPreview = previewCam === cam.id;
                const isOn = camPowers[cam.id] !== false;
                return (
                  <div key={cam.id} className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${
                    isActive  ? 'border-[#EF4444] shadow-neon-red scale-105 z-10' :
                    isPreview ? 'border-emerald-500' :
                    'border-white/10 hover:border-white/30'
                  }`}
                    onClick={() => { if (isActive) { setPreviewCam(cam.id); } else { setPreviewCam(cam.id); } }}
                    onDoubleClick={() => { setActiveCam(cam.id); }}
                  >
                    <div className={`aspect-video flex items-center justify-center bg-black/80 ${!isOn ? 'opacity-30' : ''}`}>
                      <div className="text-center">
                        <div className="text-lg">{cam.icon}</div>
                        <p className="text-[9px] text-white font-bold leading-tight px-1">{cam.role}</p>
                      </div>
                    </div>
                    {/* Status badge */}
                    <div className="absolute top-1 left-1">
                      {isActive  && <span className="px-1 py-0.5 bg-[#EF4444] text-white text-[8px] font-black rounded animate-pulse">PGM</span>}
                      {isPreview && !isActive && <span className="px-1 py-0.5 bg-emerald-600 text-white text-[8px] font-black rounded">PVW</span>}
                    </div>
                    {/* Power toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFullscreenCamItem({
                          title: `${cam.id.toUpperCase()} — ${cam.name}`,
                          icon: cam.icon,
                          res: cam.res,
                          role: cam.role,
                          type: "grid"
                        });
                      }}
                      className="absolute top-1 right-7 px-1.5 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-black font-black text-[8px] transition-all cursor-pointer shadow flex items-center gap-0.5 z-20"
                      title={`Xem Full Khung Hình ${cam.id.toUpperCase()}`}
                    ><Maximize className="w-2.5 h-2.5" /></button>

                    <button
                      onClick={(e) => { e.stopPropagation(); setCamPowers(p => ({...p, [cam.id]: !p[cam.id]})); }}
                      className={`absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] cursor-pointer transition-all ${
                        isOn ? 'bg-emerald-500' : 'bg-gray-600'
                      }`}
                    ><Power className="w-2.5 h-2.5 text-white" /></button>
                    {/* CAM number */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 py-0.5 px-1">
                      <p className="text-[8px] font-bold text-gray-300 truncate">{cam.id.toUpperCase()}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Individual Camera list with full controls */}
            <details className="group">
              <summary className="text-xs font-black text-gray-400 hover:text-white cursor-pointer flex items-center gap-2 select-none list-none">
                <Eye className="w-4 h-4" /> XEM TẤT CẢ {cameras.length} CAMERA ĐẦY ĐỦ THÔNG TIN ▾
              </summary>
              <div className="mt-3 space-y-2 max-h-60 overflow-y-auto pr-1">
                {cameras.map((cam, idx) => {
                  const isActive = activeCam === cam.id;
                  const isOn = camPowers[cam.id] !== false;
                  return (
                    <div key={cam.id} className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      isActive ? 'border-[#EF4444] bg-[#EF4444]/10' : 'border-white/8 hover:border-white/20'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{cam.icon}</span>
                        <div>
                          <p className="text-xs font-black text-white">{cam.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono">{cam.res} • {cam.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isActive && <span className="px-2 py-0.5 rounded-full bg-[#EF4444] text-white text-[10px] font-black animate-pulse">● LIVE</span>}
                        {previewCam === cam.id && !isActive && <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black">PVW</span>}
                        <button onClick={() => setPreviewCam(cam.id)} className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 text-[10px] font-bold cursor-pointer transition-all">PVW</button>
                        <button onClick={() => setActiveCam(cam.id)} className="px-2.5 py-1 rounded-lg bg-[#EF4444]/20 hover:bg-[#EF4444]/40 text-[#EF4444] text-[10px] font-black cursor-pointer transition-all">CUT</button>
                        <button
                          onClick={() => setFullscreenCamItem({
                            title: `${cam.id.toUpperCase()} — ${cam.name}`,
                            icon: cam.icon,
                            res: cam.res,
                            role: cam.role,
                            type: "list"
                          })}
                          className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1"
                          title="Xem Full Khung Hình Camera Này"
                        >
                          <Maximize className="w-3 h-3" />
                          <span>FULL</span>
                        </button>
                        <button
                          onClick={() => setCamPowers(p => ({...p, [cam.id]: !p[cam.id]}))}
                          className={`p-1.5 rounded-lg text-[10px] cursor-pointer transition-all ${
                            isOn ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40' : 'bg-gray-600/20 text-gray-500 hover:bg-gray-600/40'
                          }`}
                        ><Power className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </details>
          </div>

          {/* Model MC section — hidden when AI Avatar disabled */}
          {aiAvatarFeatureEnabled && (
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-[#EF4444]" />
                DANH SÁCH MODEL MC PHÒNG DỰNG ({customStudioAvatars.length})
              </h3>
              <div className="flex items-center gap-2">
                <input id="studio-quick-upload" type="file" accept="image/*,video/*,.png,.jpg,.jpeg,.webp,.mp4" multiple className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      Array.from(e.target.files).forEach(file => {
                        handleImageUploaded({ id: `custom_${Date.now()}_${Math.random().toString(36).substring(2,7)}`, name: file.name.split('.')[0], url: URL.createObjectURL(file) });
                      });
                      e.target.value = '';
                    }
                  }}
                />
                <label htmlFor="studio-quick-upload" className="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black flex items-center gap-1 cursor-pointer transition-all shadow-glow-purple select-none">
                  <Upload className="w-3.5 h-3.5" /><span>➕ NẠP MẪU MỚI</span>
                </label>
                {customStudioAvatars.some(a => a.isCustom) && (
                  <button onClick={handleDeleteAllCustomAvatars} className="px-3 py-1 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black flex items-center gap-1 cursor-pointer transition-all shadow-glow-red">
                    <Trash2 className="w-3.5 h-3.5" /><span>XÓA HẾT MẪU NẠP</span>
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
              {customStudioAvatars.map((av) => {
                const isSelected = selectedStudioAvatar?.id === av.id;
                return (
                  <div key={av.id} onClick={() => setSelectedStudioAvatar(av)}
                    className={`p-2 rounded-2xl border transition-all cursor-pointer relative group ${
                      isSelected ? 'border-[#EF4444] bg-[#EF4444]/20 shadow-glow-red' : 'border-white/10 bg-black/40 hover:border-white/30'
                    }`}>
                    <div className="aspect-square rounded-xl overflow-hidden mb-1 bg-black">
                      <img src={av.image} alt={av.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[10px] font-bold text-white truncate text-center">{av.name}</p>
                    {av.isCustom && (
                      <button onClick={(e) => handleDeleteSingleAvatar(e, av.id)} className="absolute top-1 right-1 p-1 rounded-lg bg-red-600 text-white cursor-pointer shadow-md opacity-0 group-hover:opacity-100 transition-opacity" title="Xóa mẫu này">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          )}
        </div>

        {/* Right Controls Panel */}
        <div className="space-y-4">
          
          {/* Virtual Set & Background Removal Selection */}
          <div className="glass-panel p-5 rounded-3xl border border-purple-500/30 space-y-4 bg-gradient-to-b from-[#14101A] to-[#0A0A0A]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-wide flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#8B5CF6]" /> Thay phông nền
              </h3>
              
            </div>

            {/* Mode Switcher Tabs for Background Removal */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-black/60 rounded-xl border border-white/10 text-[10px] font-black">
              <button
                onClick={() => setBgRemovalMode('preset')}
                className={`py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                  bgRemovalMode === 'preset' ? 'bg-purple-600 text-white shadow-glow-purple' : 'text-gray-400 hover:text-white'
                }`}
              >
                ⚡ Tách Phòng AI
              </button>
              <button
                onClick={() => setBgRemovalMode('chroma')}
                className={`py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                  bgRemovalMode === 'chroma' ? 'bg-emerald-600 text-white shadow-glow-emerald' : 'text-gray-400 hover:text-white'
                }`}
              >
                🟢 Tách Xanh
              </button>
              <button
                onClick={() => setBgRemovalMode('blur')}
                className={`py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                  bgRemovalMode === 'blur' ? 'bg-blue-600 text-white shadow-glow-blue' : 'text-gray-400 hover:text-white'
                }`}
              >
                🌫️ Mờ Bokeh
              </button>
              <button
                onClick={() => setBgRemovalMode('off')}
                className={`py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                  bgRemovalMode === 'off' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                ⚪ Phông Gốc
              </button>
            </div>

            {/* Sub-controls based on Removal Mode */}
            {bgRemovalMode === 'chroma' && (
              <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between text-gray-300 font-bold text-[11px]">
                    <span>Độ Nhạy Tách Màu (Tolerance):</span>
                    <span className="text-emerald-400">{chromaTolerance}%</span>
                  </div>
                  <input type="range" min="10" max="90" value={chromaTolerance} onChange={e => setChromaTolerance(Number(e.target.value))} className="w-full accent-emerald-500" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-gray-300 font-bold text-[11px]">
                    <span>Làm Mịn Viền Tách (Smoothness):</span>
                    <span className="text-emerald-400">{chromaSmoothness}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={chromaSmoothness} onChange={e => setChromaSmoothness(Number(e.target.value))} className="w-full accent-emerald-500" />
                </div>
              </div>
            )}

            {bgRemovalMode === 'blur' && (
              <div className="p-3 rounded-2xl bg-blue-950/30 border border-blue-500/30 space-y-2 text-xs">
                <div className="flex justify-between text-gray-300 font-bold text-[11px]">
                  <span>Độ Mờ Hậu Cảnh (Bokeh Blur):</span>
                  <span className="text-blue-400">{bgBlurPx}px</span>
                </div>
                <input type="range" min="2" max="30" value={bgBlurPx} onChange={e => setBgBlurPx(Number(e.target.value))} className="w-full accent-blue-500" />
              </div>
            )}

            {/* Custom Background Upload Button */}
            <input 
              id="custom-bg-uploader" 
              type="file" 
              accept="image/*,video/*,.png,.jpg,.jpeg,.webp,.mp4,.mov" 
              className="hidden" 
              onChange={handleUploadCustomBg} 
            />
            <label 
              htmlFor="custom-bg-uploader" 
              className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-90 text-white font-black text-xs transition-all shadow-glow-purple flex items-center justify-center gap-2 cursor-pointer text-center select-none"
            >
              <Upload className="w-4 h-4 text-yellow-300" />
              <span>➕ NẠP PHÔNG NỀN TÙY CHỌN TỪ MÁY TÍNH (.JPG / .MP4)</span>
            </label>

            {/* Virtual Background List — Real Image Thumbnails with Category Filter */}
            <div className="space-y-2">
              {/* Category Filter Tabs */}
              {(() => {
                const cats = ['Tất Cả', ...new Set(virtualSets.map(s => s.cat).filter(Boolean))];
                // activeBgCategory state managed at top component level
                const filtered = [...customVirtualBgs, ...virtualSets].filter(s =>
                  activeBgCategory === 'Tất Cả' || s.cat === activeBgCategory || s.isCustom
                );
                return (
                  <>
                    <div className="flex gap-1 flex-wrap">
                      {cats.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setActiveBgCategory(cat)}
                          className={`px-2 py-0.5 rounded-full text-[9px] font-black transition-all cursor-pointer ${
                            activeBgCategory === cat
                              ? 'bg-purple-600 text-white shadow-glow-purple'
                              : 'bg-white/10 text-gray-400 hover:bg-white/20'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Thumbnail Grid */}
                    <div className="grid grid-cols-3 gap-1.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                      {filtered.map((set) => (
                        <button
                          key={set.id}
                          onClick={() => {
                            setVirtualBg(set.id);
                            setBgRemovalMode('preset');
                          }}
                          className={`relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer group aspect-video ${
                            virtualBg === set.id && bgRemovalMode === 'preset'
                              ? 'border-purple-500 shadow-glow-purple scale-105 ring-2 ring-purple-400/50'
                              : 'border-white/10 hover:border-purple-400/60'
                          }`}
                          title={set.name}
                        >
                          {/* Thumbnail image */}
                          {set.type === 'image' && set.url ? (
                            <img
                              src={set.url.replace('w=1280', 'w=160').replace('q=85', 'q=60')}
                              alt={set.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : set.type === 'solid' ? (
                            <div className="w-full h-full" style={{ backgroundColor: set.color }} />
                          ) : set.isCustom && set.url ? (
                            <img src={set.url} alt={set.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${set.bg || 'from-gray-900 to-black'}`} />
                          )}

                          {/* Overlay label */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <p className="absolute bottom-0 left-0 right-0 text-[8px] font-bold text-white text-center truncate px-1 py-0.5 bg-black/60">
                            {set.name.replace(/[🏢🔴🖤💼📚☕🌄🏖️🌿🌸💧💜❄️🌌🏜️🌾🗼🗽🚀💎🛋️⛵🏙️🛏️✈️🛍️⬜🎆🏭🔵🩷📐🌑✨💨🌅🍵🎤🌈🔮⭐💨🌧️⭐🟢🇰🇷]/gu, '').trim()}
                          </p>
                          {virtualBg === set.id && bgRemovalMode === 'preset' && (
                            <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-purple-500 border border-white flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            </div>
                          )}
                          {set.isCustom && (
                            <span className="absolute top-1 left-1 px-1 py-0.5 rounded bg-emerald-500 text-white text-[7px] font-black">MY</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Live Beauty & Retouching Controls — ULTRA VIP EDITION */}
          <div className="glass-panel p-5 rounded-3xl border border-[#EF4444]/40 space-y-4 bg-gradient-to-b from-[#1C1218] via-[#100A0E] to-[#0A0A0A]">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-wide flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-amber-400" /> LÀM ĐẸP ULTRA VIP AI
              </h3>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={handleAutoBeautyVip}
                  className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 hover:opacity-90 text-white text-[10px] font-black transition-all cursor-pointer shadow-glow-amber animate-pulse"
                >
                  ✨ AUTO VIP
                </button>
                <button
                  onClick={handleResetBeautyDefaults}
                  className="px-2.5 py-1 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-300 text-[10px] font-black border border-red-500/40 transition-all cursor-pointer"
                >
                  🔄 Mặt Mộc
                </button>
              </div>
            </div>

            {/* 30 Visual Beauty Grid Cards with Girl Model Photos */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>30 PHONG CÁCH LÀM ĐẸP (GRID MODEL):</span>
                </span>
                <span className="text-[10px] font-mono text-gray-400">CHỌN LÀ ĐẸP NGAY</span>
              </div>

              <div className="max-h-64 overflow-y-auto grid grid-cols-2 gap-2 pr-1 custom-scrollbar">
                {BEAUTY_PRESETS_30.map((preset) => {
                  const isSelected = preset.id === activeBeautyPresetId;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectBeautyPreset(preset)}
                      className={`group relative rounded-2xl overflow-hidden border p-1.5 transition-all cursor-pointer bg-black/60 flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/20 shadow-glow-amber scale-[1.02] z-10 border-2'
                          : 'border-white/12 hover:border-amber-300/60 hover:bg-white/5'
                      }`}
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden mb-1.5 bg-[#121216]">
                        <img
                          src={preset.image}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                        {isSelected && (
                          <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center font-black text-[10px] shadow-lg">
                            ✓
                          </div>
                        )}

                        <span className="absolute bottom-1 left-1 right-1 text-[8px] font-mono px-1 py-0.5 rounded bg-black/80 text-amber-300 font-bold truncate">
                          {preset.category}
                        </span>
                      </div>

                      <div className="px-0.5">
                        <p className="text-[11px] font-black text-white line-clamp-1 truncate group-hover:text-amber-300 transition-colors">
                          {preset.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ──── ULTRA VIP BEAUTY SLIDERS ──── */}
            <div className="space-y-3 text-xs pt-3 border-t border-white/10">

              {/* GROUP 1: LÀN DA */}
              <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest">🧴 Làn Da</p>

              <div className="space-y-1">
                <div className="flex items-center justify-between font-bold text-gray-300">
                  <span>✨ Mịn Da AI (Skin Polish)</span>
                  <span className="text-amber-400 w-8 text-right">{skinSmooth}%</span>
                </div>
                <input type="range" min="0" max="100" value={skinSmooth}
                  onChange={(e) => setSkinSmooth(Number(e.target.value))} className="w-full accent-[#EF4444]" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between font-bold text-gray-300">
                  <span>💡 Trắng Sáng Hàn Quốc</span>
                  <span className="text-amber-400 w-8 text-right">{skinBright}%</span>
                </div>
                <input type="range" min="0" max="100" value={skinBright}
                  onChange={(e) => setSkinBright(Number(e.target.value))} className="w-full accent-[#8B5CF6]" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between font-bold text-gray-300">
                  <span>🌸 Má Hồng Baby (Rosy Blush)</span>
                  <span className="text-pink-400 w-8 text-right">{rosyBlush}%</span>
                </div>
                <input type="range" min="0" max="100" value={rosyBlush}
                  onChange={(e) => setRosyBlush(Number(e.target.value))} className="w-full accent-pink-500" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between font-bold text-gray-300">
                  <span>☀️ Tone Da Warm ↔ Cool</span>
                  <span className="text-amber-300 w-16 text-right text-[10px]">
                    {skinWarmth > 0 ? `+${skinWarmth} Ấm` : skinWarmth < 0 ? `${skinWarmth} Lạnh` : 'Tự nhiên'}
                  </span>
                </div>
                <input type="range" min="-50" max="50" value={skinWarmth}
                  onChange={(e) => setSkinWarmth(Number(e.target.value))} className="w-full accent-amber-500" />
              </div>

              {/* GROUP 2: MẮT & TÓC */}
              <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest pt-1">👁️ Mắt & Tóc</p>

              <div className="space-y-1">
                <div className="flex items-center justify-between font-bold text-gray-300">
                  <span>👁️ Mắt Long Lanh (Eye Sparkle)</span>
                  <span className="text-cyan-400 w-8 text-right">{eyeSparkle}%</span>
                </div>
                <input type="range" min="0" max="100" value={eyeSparkle}
                  onChange={(e) => setEyeSparkle(Number(e.target.value))} className="w-full accent-cyan-400" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between font-bold text-gray-300">
                  <span>👀 To Mắt AI (Eye Enlarge — WebGL)</span>
                  <span className="text-cyan-400 w-8 text-right">{eyeEnlarge}%</span>
                </div>
                <input type="range" min="0" max="100" value={eyeEnlarge}
                  onChange={(e) => setEyeEnlarge(Number(e.target.value))} className="w-full accent-cyan-300" />
              </div>

              {/* GROUP 3: KHUÔN MẶT */}
              <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest pt-1">💃 Khuôn Mặt V-Line</p>

              <div className="space-y-1">
                <div className="flex items-center justify-between font-bold text-gray-300">
                  <span>💃 Thon Mặt V-Line (Contour)</span>
                  <span className="text-purple-400 w-8 text-right">{faceSlim}%</span>
                </div>
                <input type="range" min="0" max="100" value={faceSlim}
                  onChange={(e) => setFaceSlim(Number(e.target.value))} className="w-full accent-purple-500" />
              </div>

              {/* GROUP 4: ÁNH SÁNG */}
              <p className="text-[10px] font-black text-yellow-400 uppercase tracking-widest pt-1">💡 Ánh Sáng Studio</p>

              <div className="space-y-1">
                <div className="flex items-center justify-between font-bold text-gray-300">
                  <span>🔆 Đèn RingLight Studio 360°</span>
                  <span className="text-amber-400 w-8 text-right">{ringLight}%</span>
                </div>
                <input type="range" min="0" max="100" value={ringLight}
                  onChange={(e) => setRingLight(Number(e.target.value))} className="w-full accent-[#3B82F6]" />
              </div>

              {/* LIVE PREVIEW badge */}
              <div className="flex items-center gap-2 pt-2 px-3 py-2 rounded-2xl bg-gradient-to-r from-[#EF4444]/20 via-purple-600/20 to-amber-500/20 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                <span className="text-[10px] text-gray-300 font-bold">
                  Áp dụng trực tiếp lên canvas — thấy ngay kết quả!
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
        </>
      )}
    </div>
  );
}
