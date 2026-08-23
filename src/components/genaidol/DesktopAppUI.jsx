import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { 
  Settings, CreditCard, Video, Moon, Sun, 
  MessageCircle, Play, Pause, Mic, MicOff, X, Download, Plus,
  Brain, Radio, Coins, AlertTriangle, Eye, Clock, List, Zap, AlertCircle, FileText, CheckSquare, CheckCircle,
  Gift, ShoppingBag, Sparkles, RotateCcw, Send, Trash2, Heart, Share2, UserPlus, Users, Swords, Shield, Gamepad2, Flag, MapPin,
  Smartphone, MonitorPlay, Globe, StopCircle, Power, Volume2, VolumeX, Volume1, Music
} from 'lucide-react';
import flvjs from 'flv.js';
import Hls from 'hls.js';
import WorkspaceTacVu from './WorkspaceTacVu';
import GeneralSettings from './GeneralSettings';
import ThanhToanCoin from './ThanhToanCoin';
import TokenHistoryModal from './TokenHistoryModal';
import { useToken, TOKEN_RATES } from './TokenContext';
import { useLiveCoordinator } from '../../hooks/useLiveCoordinator';
import AIAudioPlayer from './AIAudioPlayer';
import QuickResponseModal from './QuickResponseModal';
import TemplateLibraryModal from './TemplateLibraryModal';
import DanceFloorStudio from '../DanceFloorStudio';
import GameChienDau from './game/GameChienDau';
import GameChienDauAdminModal from './game/GameChienDauAdminModal';
import GameBanDoVietNam from './game/GameBanDoVietNam';
import GameBanDoAdminModal from './game/GameBanDoAdminModal';
import bandoEngine from './game/bandoGameEngine';
import bandoAudio from './game/bandoAudioEngine';
import { mapVoiceEngine, battleVoiceEngine } from './game/gameVoiceEngine';
import battleCommentary from './game/battleCommentaryEngine';
import { stopVoiceAudio } from '../../utils/voiceSyncService';
import AutoCaptchaSolver from '../AutoCaptchaSolver';
import { saveCharacterToIDB, loadAllCharactersFromIDB, deleteCharacterFromIDB } from '../../utils/idbHelper';
import { SUPPORTED_LANGUAGES, getCurrentLanguage, setCurrentLanguage, t } from '../../utils/i18n';

export default function DesktopAppUI() {
  const [activeSettingsModal, setActiveSettingsModal] = useState(null); 
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCommMode, setIsCommMode] = useState(false);
  const [currentLang, setCurrentLangState] = useState(() => getCurrentLanguage());
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [tiktokId, setTiktokId] = useState(() => {
    try {
      return localStorage.getItem('aidol_tiktok_id') || '';
    } catch (e) {
      return '';
    }
  });
  const [videoTiktokId, setVideoTiktokId] = useState(() => {
    try {
      return localStorage.getItem('aidol_video_tiktok_id') || '';
    } catch (e) {
      return '';
    }
  });
  const [flvUrl, setFlvUrl] = useState(null);
  const [isLiveAudioMuted, setIsLiveAudioMuted] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState(() => {
    try {
      return localStorage.getItem('avalive_selected_char') || null;
    } catch (e) {
      return null;
    }
  });
  const [showTokenHistory, setShowTokenHistory] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [assistantPrompt, setAssistantPrompt] = useState('');
  const [autoSimActive, setAutoSimActive] = useState(false);
  const [simTab, setSimTab] = useState('quick');
  const autoSimTimerRef = useRef(null);
  
  // Game Chiến Đấu States
  const [isGameBattleActive, setIsGameBattleActive] = useState(() => {
    try {
      return localStorage.getItem('avalive_active_stage') === 'battle';
    } catch {
      return false;
    }
  });
  const [isGameAdminOpen, setIsGameAdminOpen] = useState(false);
  const [lastGameEvent, setLastGameEvent] = useState(null);

  // Game Bản Đồ Hình Chữ S States (Mặc định hiển thị Bản Đồ Chữ S 3D tuyệt đẹp)
  const [isGameBanDoActive, setIsGameBanDoActive] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_active_stage');
      return saved ? saved === 'bando' : true;
    } catch {
      return true;
    }
  });
  const [isGameBanDoAdminOpen, setIsGameBanDoAdminOpen] = useState(false);
  const [isDanceFloorAdminOpen, setIsDanceFloorAdminOpen] = useState(false);

  // Sàn Nhảy TikTok States
  const [isDanceFloorActive, setIsDanceFloorActive] = useState(() => {
    try {
      return localStorage.getItem('avalive_active_stage') === 'dancefloor';
    } catch {
      return false;
    }
  });

  // Tỷ Lệ Khung Hình Toàn Cục (9:16 TikTok Dọc vs 16:9 OBS Ngang)
  const [globalAspectRatio, setGlobalAspectRatio] = useState(() => {
    try {
      return localStorage.getItem('avalive_global_aspect_ratio') || '9:16';
    } catch (e) {
      return '9:16';
    }
  });

  const toggleGlobalAspectRatio = () => {
    const next = globalAspectRatio === '9:16' ? '16:9' : '9:16';
    setGlobalAspectRatio(next);
    try {
      localStorage.setItem('avalive_global_aspect_ratio', next);
    } catch (e) {}
  };

  // States cho Menu Theo dõi & Realtime Overlay TikTok / OBS
  const [isMonitorDropdownOpen, setIsMonitorDropdownOpen] = useState(false);
  const [activeMonitorModal, setActiveMonitorModal] = useState(null);
  const [quickResponseActiveVideo, setQuickResponseActiveVideo] = useState(null);
  const [showOverlayModal, setShowOverlayModal] = useState(false);
  const [overlayLinkBase, setOverlayLinkBase] = useState(() => {
    return 'https://avalivepro.vercel.app';
  });
  const [copySuccessMsg, setCopySuccessMsg] = useState('');
  
  const [systemLogs, setSystemLogs] = useState([]);
  const [tiktokLogs, setTiktokLogs] = useState([]);

  const [toast, setToast] = useState(null);
  
  const [customCharacters, setCustomCharacters] = useState([]);
  const [hiddenBuiltins, setHiddenBuiltins] = useState(() => {
    try {
      const saved = localStorage.getItem('aidol_hidden_builtins');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const fileInputRef = useRef(null);
  const flvPlayerRef = useRef(null);
  const hlsPlayerRef = useRef(null);
  const flvVideoRef = useRef(null);
  const flvCanvasRef = useRef(null);
  const currentPlayingUrlRef = useRef(null);

  useEffect(() => {
    let animId;
    let timerId;
    let isMounted = true;

    const renderFrame = () => {
      if (!isMounted) return;
      const video = flvVideoRef.current;
      const canvas = flvCanvasRef.current;
      if (video && canvas && video.readyState >= 2 && video.videoWidth > 0) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }
        const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
      }
      if (video && 'requestVideoFrameCallback' in video) {
        video.requestVideoFrameCallback(renderFrame);
      } else {
        animId = requestAnimationFrame(renderFrame);
      }
    };

    const video = flvVideoRef.current;
    if (video && 'requestVideoFrameCallback' in video) {
      video.requestVideoFrameCallback(renderFrame);
    } else {
      animId = requestAnimationFrame(renderFrame);
    }

    timerId = setInterval(() => {
      const v = flvVideoRef.current;
      const c = flvCanvasRef.current;
      if (v && c && v.readyState >= 2 && v.videoWidth > 0 && !v.paused) {
        if (c.width !== v.videoWidth || c.height !== v.videoHeight) {
          c.width = v.videoWidth;
          c.height = v.videoHeight;
        }
        const ctx = c.getContext('2d', { alpha: false, desynchronized: true });
        if (ctx) {
          ctx.drawImage(v, 0, 0, c.width, c.height);
        }
      }
    }, 33);

    return () => {
      isMounted = false;
      if (animId) cancelAnimationFrame(animId);
      if (timerId) clearInterval(timerId);
    };
  }, [flvUrl]);
  const lastAiCommentTime = useRef(0);
  const lastAiGreetingTime = useRef(0);
  const [isTemplateLibraryOpen, setIsTemplateLibraryOpen] = useState(false);


  const getPlayableStreamUrl = (rawUrl) => {
    if (!rawUrl) return '';
    if (rawUrl.includes('/api/stream-proxy')) return rawUrl;
    const backendOrigin = typeof window !== 'undefined' ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3001' : window.location.origin) : 'http://localhost:3001';
    return `${backendOrigin}/api/stream-proxy?url=${encodeURIComponent(rawUrl)}`;
  };

  const attachFlvPlayer = (videoEl, url) => {
    if (!videoEl || !url) return;
    if (currentPlayingUrlRef.current === url && (flvPlayerRef.current || hlsPlayerRef.current)) {
      return;
    }
    currentPlayingUrlRef.current = url;

    try {
      if (flvPlayerRef.current) {
        try { flvPlayerRef.current.destroy(); } catch (e) {}
        flvPlayerRef.current = null;
      }
      if (hlsPlayerRef.current) {
        try { hlsPlayerRef.current.destroy(); } catch (e) {}
        hlsPlayerRef.current = null;
      }

      const streamSrc = getPlayableStreamUrl(url);
      console.log('[AvaLive Stream] 🎬 Đang phát luồng:', streamSrc);
      const isFLV = url.includes('.flv') || url.includes('pull-flv') || url.includes('/flv') || url.includes('tiktokcdn.com') || url.includes('/game/') || url.includes('/stage/') || url.includes('/stream');
      if (isFLV && flvjs.isSupported()) {
        const flvPlayer = flvjs.createPlayer({
          type: 'flv',
          isLive: true,
          hasAudio: true,
          hasVideo: true,
          url: streamSrc,
          cors: true,
          enableWorker: false,
          enableStashBuffer: false,
          stashInitialSize: 128,
          lazyLoad: false,
          seekType: 'range'
        }, {
          enableWorker: false,
          enableStashBuffer: false,
          stashInitialSize: 128,
          lazyLoad: false,
          autoCleanupSourceBuffer: true,
          autoCleanupMaxBackwardDuration: 5,
          autoCleanupMinBackwardDuration: 2,
          fixAudioTimestampGap: false
        });
        flvPlayer.attachMediaElement(videoEl);
        flvPlayer.load();
        const playPromise = flvPlayer.play();
        if (playPromise && playPromise.catch) {
          playPromise.catch(() => {
            videoEl.muted = true;
            flvPlayer.play()?.catch(err => console.warn('Lỗi play flv:', err));
          });
        }

        // Tự động kiểm tra và đảm bảo video luôn chuyển động liên tục ở thời gian thực (Live Edge)
        const liveEdgeInterval = setInterval(() => {
          if (videoEl && !videoEl.paused && videoEl.buffered && videoEl.buffered.length > 0) {
            const end = videoEl.buffered.end(videoEl.buffered.length - 1);
            const diff = end - videoEl.currentTime;
            if (diff > 2.5) {
              videoEl.currentTime = end - 0.3;
            }
          }
          if (videoEl && videoEl.paused) {
            videoEl.play()?.catch(() => {});
          }
        }, 2000);

        flvPlayer.on(flvjs.Events.ERROR, (errType, errDetail, errInfo) => {
          console.warn('[AvaLive FLV Player Error]:', errType, errDetail, errInfo);
          if (errType === flvjs.ErrorTypes.NETWORK_ERROR) {
            flvPlayer.unload();
            flvPlayer.load();
            flvPlayer.play()?.catch(() => {});
          }
        });
        flvPlayerRef.current = flvPlayer;
      } else if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: false, lowLatencyMode: true, liveSyncDurationCount: 2 });
        hls.loadSource(streamSrc);
        hls.attachMedia(videoEl);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoEl.play().catch(() => {
            videoEl.muted = true;
            videoEl.play().catch(e => console.warn('Lỗi auto-play hls:', e));
          });
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.warn('[HLS Error]:', data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                break;
            }
          }
        });
        hlsPlayerRef.current = hls;
      } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
        videoEl.src = streamSrc;
        videoEl.play().catch(() => {
          videoEl.muted = true;
          videoEl.play().catch(e => console.warn('Lỗi auto-play hls safari:', e));
        });
      } else {
        videoEl.src = streamSrc;
        videoEl.play().catch(e => console.warn('Lỗi native video play:', e));
      }
    } catch (err) {
      console.error('Lỗi khởi tạo player:', err);
    }
  };

  useEffect(() => {
    if (flvUrl && flvVideoRef.current) {
      attachFlvPlayer(flvVideoRef.current, flvUrl);
    }

    return () => {
      try {
        currentPlayingUrlRef.current = null;
        if (flvPlayerRef.current) {
          flvPlayerRef.current.destroy();
          flvPlayerRef.current = null;
        }
        if (hlsPlayerRef.current) {
          hlsPlayerRef.current.destroy();
          hlsPlayerRef.current = null;
        }
      } catch (e) {}
    };
  }, [flvUrl]);

  // Load & Sync custom characters from Unified AIDOL_DB
  const reloadCharacters = () => {
    loadAllCharactersFromIDB().then(chars => {
      const loadedChars = chars.map(c => {
        let url = c.url || c.mediaUrl;
        if (c.fileData) {
          try {
            url = URL.createObjectURL(c.fileData);
          } catch (e) {
            url = c.url || c.mediaUrl;
          }
        }
        return {
          id: c.id,
          name: c.name || 'AIDOL của tôi',
          type: c.type || 'image',
          url
        };
      });
      setCustomCharacters(loadedChars);
    });
  };

  useEffect(() => {
    reloadCharacters();
    const handleUpdate = () => reloadCharacters();
    window.addEventListener('aidol_db_updated', handleUpdate);
    return () => window.removeEventListener('aidol_db_updated', handleUpdate);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('aidol_hidden_builtins', JSON.stringify(hiddenBuiltins));
    } catch (e) {}
  }, [hiddenBuiltins]);

  useEffect(() => {
    // Luôn reset về trạng thái 0 (tắt) khi tải lại trang, chờ user bấm "Bật Tất Cả"
    setIsMasterLiveRunning(false);
    try {
      localStorage.setItem('avalive_master_live_running', 'false');
      // Reset cả bản đồ và bảng xếp hạng
      if (bandoEngine && typeof bandoEngine.resetGame === 'function') {
        bandoEngine.resetGame();
        bandoEngine.resetLeaderboard();
      }
      // Báo cho backend biết frontend vừa refresh, yêu cầu ngắt simulation nếu đang chạy
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('avalive_emergency_stop_all'));
      }
    } catch (e) {}

    const handleLang = (e) => {
      if (e.detail?.language) {
        setCurrentLangState(e.detail.language);
      }
    };
    window.addEventListener('avalive_language_changed', handleLang);
    return () => window.removeEventListener('avalive_language_changed', handleLang);
  }, []);

  const { balance, deductToken, setNotifyCallback } = useToken();
  
  // Audio Player Ref
  const audioPlayerRef = useRef(null);

  // Connection state (phải khai báo trước useEffect)
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');

  // Tích hợp Live Coordinator (Xử lý AI, Video, Idle Timer)
  const {
    activeVideoItem,
    lipSyncVideoUrl,
    viewerHistory,
    isProcessingEvent,
    handleLiveEvent,
    handleVideoEnded,
    handleActionVideoReady,
    setLipSyncVideoUrl,
    setActiveVideoItem,
    setViewerHistory
  } = useLiveCoordinator({
    isConnected: isConnected || showSimulator, // Cho phép Simulator chạy độc lập
    activeBrainPack: 'talk', // mặc định
    onVoiceReply: ({ text, action, baseVideoItem, preRecordedCat }) => {
      // Gọi AIAudioPlayer để phát giọng nói
      if (audioPlayerRef.current) {
        audioPlayerRef.current.enqueueItem(text, action);
      }
      
      // Nếu có video reaction quay sẵn thì đổi video nền ngay
      if (preRecordedCat && baseVideoItem) {
        // Tạm thời bỏ qua logic tìm video reaction (AIAudioPlayer sẽ gọi handleActionVideoReady sau khi LipSync xong)
      }
    }
  });

  // Danh sách sự kiện giả lập đa dạng
  const SIMULATION_EVENTS = [
    { type: 'VIEWER_JOIN', payload: { name: 'Thanh Nhàn (Khách mới)' } },
    { type: 'VIEWER_JOIN', payload: { name: 'Vip_HoangNam (VIP)' } },
    { type: 'GIFT', payload: { name: 'Bảo Trâm', gift: 'Hoa hồng 🌹 (1 xu)' } },
    { type: 'GIFT', payload: { name: 'Đại Gia Phố Cổ', gift: 'Tên lửa vũ trụ 🚀' } },
    { type: 'COMMENT', payload: { name: 'Minh Thảo', text: 'Chào idol, hôm nay xinh và năng lượng quá!' } },
    { type: 'COMMENT', payload: { name: 'Hải Đăng', text: 'Mẫu áo này chất liệu gì và còn size L không shop?' } },
    { type: 'COMMENT', payload: { name: 'Ngọc Mai', text: 'Sản phẩm này có voucher freeship hôm nay không ạ?' } },
    { type: 'PURCHASE', payload: { name: 'Quốc Cường', item: 'Combo 2 Áo Thun Cao Cấp' } },
    { type: 'LIKE', payload: { count: '10.000 tim' } },
    { type: 'FOLLOW', payload: { name: 'Hồng Ánh' } },
    { type: 'SHARE', payload: { name: 'Thu Hằng' } }
  ];

  // Auto-simulation timer
  useEffect(() => {
    if (autoSimActive && showSimulator) {
      autoSimTimerRef.current = setInterval(() => {
        const randomEvent = SIMULATION_EVENTS[Math.floor(Math.random() * SIMULATION_EVENTS.length)];
        handleLiveEvent(randomEvent.type, randomEvent.payload);
      }, 9000);
    } else {
      if (autoSimTimerRef.current) clearInterval(autoSimTimerRef.current);
    }
    return () => {
      if (autoSimTimerRef.current) clearInterval(autoSimTimerRef.current);
    };
  }, [autoSimActive, showSimulator]);

  // Toast helper
  const showToast = (msg, type = 'warn') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Register low-balance callback
  useEffect(() => {
    setNotifyCallback(({ message }) => showToast(message, 'warn'));
  }, [setNotifyCallback]);

  // Auto-deduct tokens when live session is active (AI Brain & Server 유지)
  useEffect(() => {
    if (!isConnected) return;
    const timer = setInterval(() => {
      deductToken(TOKEN_RATES.AI_LIVE_PER_30S || 5, 'AI LLM Brain & Duy trì Live (30s)');
    }, 30000);
    return () => clearInterval(timer);
  }, [isConnected, deductToken]);

  // Stop session when tokens run out
  useEffect(() => {
    if (isConnected && balance === 0) {
      setIsConnected(false);
      showToast('🔴 Hết token! Phiên live đã tự động dừng. Vui lòng nạp thêm token.', 'error');
    }
  }, [balance, isConnected]);

  // Connection state đã khai báo ở trên
  
  // Webcam state
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  
  // Draggable Webcam State
  const [webcamPos, setWebcamPos] = useState({ x: 800, y: 80 });
  const [isDraggingWebcam, setIsDraggingWebcam] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Set initial position based on window width to place it on the right side
    setWebcamPos({ x: window.innerWidth - 300, y: 80 });
  }, []);

  useEffect(() => {
    const handleDrag = (e) => {
      if (isDraggingWebcam) {
        setWebcamPos({
          x: e.clientX - dragStartPos.current.x,
          y: e.clientY - dragStartPos.current.y
        });
      }
    };
    const handleDragEnd = () => setIsDraggingWebcam(false);
    
    if (isDraggingWebcam) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDraggingWebcam]);

  // 🛑/▶️ Trạng thái Tắt / Bật Toàn Bộ Phiên Live Master (Mặc định ở trạng thái Chờ/Tắt, chỉ bật khi Streamer bấm)
  const [isMasterLiveRunning, setIsMasterLiveRunning] = useState(false);

  // Trạng thái Chạy Demo / Test Toàn Cục (1 Nút Duy Nhất cho tất cả Game / Idol)
  const [isGlobalDemoRunning, setIsGlobalDemoRunning] = useState(false);
  const globalDemoTimerRef = useRef(null);

  // ⚡ TRẠNG THÁI AUTO CHẠY TỰ ĐỘNG 24/24 (Hỗ trợ AI Idol, Game Chiến Đấu, Game Bản Đồ & Tự Vượt Captcha)
  const [isAuto247Running, setIsAuto247Running] = useState(false);
  const auto247TimerRef = useRef(null);

  const handleGlobalRunDemo = useCallback(() => {
    if (isGlobalDemoRunning) {
      if (globalDemoTimerRef.current) {
        clearInterval(globalDemoTimerRef.current);
        globalDemoTimerRef.current = null;
      }
      try {
        bandoEngine.stopAutoTestLoop();
        bandoEngine.stopAuto247Loop();
      } catch (e) {}
      window.dispatchEvent(new CustomEvent('global-stop-demo'));
      setIsGlobalDemoRunning(false);
      return;
    }

    setIsGlobalDemoRunning(true);

    if (isGameBanDoActive) {
      // 1. Kích hoạt Demo Game Bản Đồ Cắm Cờ (Chạy tự động liên tục vòng lặp quà tặng)
      try {
        bandoAudio.unlock();
        bandoEngine.startAutoTestLoop();
        window.dispatchEvent(new CustomEvent('bando-trigger-demo'));
      } catch (e) {
        console.error('Error starting bando demo loop:', e);
      }
    } else if (isGameBattleActive) {
      // 2. Kích hoạt Demo Game Chiến Đấu PK
      window.dispatchEvent(new CustomEvent('battle-trigger-demo'));
      globalDemoTimerRef.current = setInterval(() => {
        window.dispatchEvent(new CustomEvent('battle-trigger-demo'));
      }, 1500);
    } else {
      // 3. Kích hoạt Demo AI Idol Live
      const mockEvt = SIMULATION_EVENTS[Math.floor(Math.random() * SIMULATION_EVENTS.length)];
      handleLiveEvent(mockEvt.type, mockEvt.payload);
      globalDemoTimerRef.current = setInterval(() => {
        const rand = SIMULATION_EVENTS[Math.floor(Math.random() * SIMULATION_EVENTS.length)];
        handleLiveEvent(rand.type, rand.payload);
      }, 3500);
    }
  }, [isGlobalDemoRunning, isGameBanDoActive, isGameBattleActive, handleLiveEvent, SIMULATION_EVENTS]);

  const handleToggleAuto247 = useCallback(() => {
    const nextState = !isAuto247Running;
    setIsAuto247Running(nextState);
    try {
      localStorage.setItem('avalive_auto247', String(nextState));
    } catch {}

    if (!nextState) {
      if (auto247TimerRef.current) {
        clearInterval(auto247TimerRef.current);
        auto247TimerRef.current = null;
      }
      try {
        bandoEngine.stopAuto247Loop();
        bandoEngine.stopAutoTestLoop();
      } catch (e) {}
      return;
    }

    // Bật chế độ VẬN HÀNH THẬT 24/7 (CHỈ CẮM CỜ KHI CÓ QUÀ THẬT TỪ TIKTOK LIVE)
    try {
      bandoAudio.unlock();
      bandoEngine.stopAutoTestLoop(); // Dừng ngay mọi vòng lặp test giả lập
      bandoEngine.startAuto247Loop(); // Chạy lắng nghe Live thật 24/7
    } catch (e) {}

    if (auto247TimerRef.current) {
      clearInterval(auto247TimerRef.current);
    }

    auto247TimerRef.current = setInterval(() => {
      // 1. Tự động kiểm tra và giải Captcha định kỳ ngầm để giữ kết nối Live 24/24
      try {
        window.dispatchEvent(new CustomEvent('avalive_auto_captcha_heartbeat'));
      } catch (e) {}
      // 2. KHÔNG TỰ ĐỘNG CẮM CỜ GIẢ LẬP: Chỉ cắm cờ khi có người xem thật gửi quà thật từ TikTok Live Studio
    }, 15000);
  }, [isAuto247Running]);

  // Dừng demo và auto 24/7 khi tắt component
  useEffect(() => {
    return () => {
      if (globalDemoTimerRef.current) clearInterval(globalDemoTimerRef.current);
      if (auto247TimerRef.current) clearInterval(auto247TimerRef.current);
      try {
        bandoEngine.stopAutoTestLoop();
      } catch (e) {}
    };
  }, []);

  const ALL_CHARACTERS = {};

  // Gộp nhân vật tuỳ chỉnh tải lên bởi người dùng
  const CHARACTERS = {};
  if (Array.isArray(customCharacters)) {
    customCharacters.forEach(c => {
      if (c && c.id) {
        CHARACTERS[c.id] = { name: c.name || 'AI Idol', url: c.url, type: c.type || 'image' };
      }
    });
  }

  // Mở khóa âm thanh (chỉ unlock AudioContext ngầm, không tự ý phát nhạc khi chưa có lệnh)
  const unlockAllAudio = useCallback(async () => {
    try {
      bandoAudio.unlock();
      if (bandoAudio.ctx && bandoAudio.ctx.state === 'suspended') {
        await bandoAudio.ctx.resume();
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.resume();
      }
    } catch (e) {}
  }, []);

  const handleAudioTest = useCallback(async () => {
    await unlockAllAudio();
    bandoAudio.playWarHorn({ force: true });
    setTimeout(() => {
      mapVoiceEngine.speak('Hệ thống âm thanh nhạc nền, hiệu ứng và Voice AI đã kích hoạt sẵn sàng trên livestream!', 'game', true);
    }, 400);
    showToast('🔊 Đang phát kiểm tra âm thanh & Giọng đọc AI!', 'success');
  }, [unlockAllAudio]);

  // Tự động mở khóa audio context khi tương tác
  useEffect(() => {
    const handleGesture = () => {
      unlockAllAudio();
    };
    window.addEventListener('pointerdown', handleGesture, { once: true });
    window.addEventListener('keydown', handleGesture, { once: true });
    return () => {
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
  }, [unlockAllAudio]);

  // ⚡ SOCKET.IO REALTIME KẾT NỐI VỚI BACKEND & TIKTOK LIVE CONNECTOR
  const socketRef = useRef(null);
  const handleLiveEventRef = useRef(handleLiveEvent);
  handleLiveEventRef.current = handleLiveEvent;

  useEffect(() => {
    let backendUrl = '';
    if (typeof window !== 'undefined') {
      const customUrl = localStorage.getItem('aidol_backend_url') || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_BACKEND_URL);
      if (customUrl && customUrl.startsWith('http')) {
        backendUrl = customUrl;
      } else if (window.location.port === '5173') {
        backendUrl = window.location.protocol + '//' + window.location.hostname + ':3001';
      } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        backendUrl = 'http://localhost:3001';
      }
    }
    
    const socket = io(backendUrl || window.location.origin, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      // Đã kết nối Socket Backend
    });

    socket.on('connect_error', () => {
      // Báo lỗi nếu chạy trên cloud mà không có backend
    });

    socket.on('tiktok_connected', (data) => {
      setIsConnecting(false);
      setIsConnected(true);
      setConnectionError('');
      if (data?.flvUrl) setFlvUrl(data.flvUrl);
      const targetChan = data?.username ? `${data.username}` : 'TikTok Live';
      setToast({ type: 'success', message: `🎉 Kết nối thành công TikTok Live: ${targetChan}` });
      setTimeout(() => setToast(null), 2000);
      const timeStr = new Date().toLocaleTimeString();
      setSystemLogs(prev => [
        `[${timeStr}] 🟢 ĐÃ KẾT NỐI REAL-TIME TIKTOK LIVE: ${targetChan}`,
        `[${timeStr}] ⚡ Đang lắng nghe bình luận, quà tặng & AI Voice Commentary 24/7`,
        ...prev.slice(0, 48)
      ]);
      setTiktokLogs(prev => [
        `[${timeStr}] 🟢 Kết nối thành công TikTok Live: ${targetChan}`,
        ...prev.slice(0, 48)
      ]);
      bandoAudio.unlock();
      handleLiveEventRef.current?.('VIEWER_JOIN', { name: targetChan });
    });

    socket.on('tiktok_chat', (data) => {
      if (!data) return;
      bandoAudio.unlock();
      const timeStr = new Date().toLocaleTimeString();
      const author = data.username || data.nickname || 'Khán giả';
      const text = data.comment || '';
      setTiktokLogs(prev => [`[${timeStr}] 💬 ${author}: ${text}`, ...prev.slice(0, 49)]);
      
      // Chuyển tiếp tới Game Bản Đồ Chữ S & AI Commentary
      bandoEngine.handleUserComment(text, author);
      mapVoiceEngine.handleUserComment(text, author);
      battleVoiceEngine.handleUserComment(text, author);
      
      // Chống spam: Giới hạn AI phản hồi bình luận (chỉ đọc nội dung có ý nghĩa và cách nhau 8 giây)
      const now = Date.now();
      if (text.trim().length >= 2 && now - lastAiCommentTime.current > 8000) {
        lastAiCommentTime.current = now;
        handleLiveEventRef.current?.('COMMENT', { name: author, text });
      }
    });

    socket.on('tiktok_gift', (data) => {
      if (!data) return;
      bandoAudio.unlock();
      const timeStr = new Date().toLocaleTimeString();
      const author = data.username || data.nickname || data.uniqueId || 'Khách Live';
      const giftName = data.giftName || 'Hoa Hồng';
      const giftCount = data.repeatCount || 1;
      const diamondCount = data.diamondCount || 1;
      setTiktokLogs(prev => [`[${timeStr}] 🎁 ${author} tặng ${giftName} x${giftCount} (${diamondCount} xu)`, ...prev.slice(0, 49)]);

      // 1. Luôn kích hoạt cắm ô cờ trên Bản Đồ 3D Việt Nam
      bandoEngine.processGift({
        giftId: data.giftId,
        giftName: data.giftName,
        count: giftCount,
        diamondCount: diamondCount,
        userId: data.userId || data.uniqueId || 'tiktok_viewer',
        username: author,
        avatar: data.profilePictureUrl || ''
      });

      // 2. Chuyển tiếp Game Chiến Đấu nếu đang mở
      window.dispatchEvent(new CustomEvent('battle-trigger-gift', { detail: data }));

      // 3. Kích hoạt phản hồi Idol Live
      handleLiveEventRef.current?.('GIFT', { name: author, gift: giftName, count: giftCount });
    });

    socket.on('tiktok_like', (data) => {
      if (!data) return;
      const count = data.likeCount || 1;
      const author = data.username || 'Khán giả';
      handleLiveEventRef.current?.('LIKE', { count: `${count} tim`, name: author });
    });

    socket.on('tiktok_member', (data) => {
      if (!data) return;
      const author = data.username || data.nickname || 'Khách mới';
      
      // Chống spam: Chào hỏi người mới cách nhau ít nhất 15 giây
      const now = Date.now();
      if (now - lastAiGreetingTime.current > 15000) {
        lastAiGreetingTime.current = now;
        handleLiveEventRef.current?.('VIEWER_JOIN', { name: author });
      }
    });

    socket.on('tiktok_disconnected', () => {
      const timeStr = new Date().toLocaleTimeString();
      setTiktokLogs(prev => [`[${timeStr}] ⚠️ Mất kết nối TikTok Live`, ...prev.slice(0, 49)]);
      setIsConnected(false);
      setIsConnecting(false);
      setFlvUrl(null);
    });

    socket.on('tiktok_error', (err) => {
      const timeStr = new Date().toLocaleTimeString();
      setTiktokLogs(prev => [`[${timeStr}] ⚠️ Lỗi kết nối TikTok: ${err}`, ...prev.slice(0, 49)]);
      setIsConnecting(false);
      setToast({ type: 'error', message: `LỖI KẾT NỐI TIKTOK: ${err}` });
    });

    socket.on('tiktok_status', (data) => {
      if (!data) return;
      if (data.connected === false && !data.connecting) {
        setIsConnecting(false);
        setIsConnected(false);
        setFlvUrl(null);
        if (data.error || data.note) {
          setToast({ type: 'error', message: `Lỗi kết nối: ${data.error || data.note}` });
          if (isMasterLiveRunning) setIsMasterLiveRunning(false);
        }
      } else if (data.connected === true) {
        setIsConnecting(false);
        setIsConnected(true);
        if (data.flvUrl) setFlvUrl(data.flvUrl);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // ⚡ Gắn trình phát FLV khi URL thay đổi
  useEffect(() => {
    if (isConnected && flvUrl && flvVideoRef.current) {
      attachFlvPlayer(flvVideoRef.current, flvUrl);
    }
  }, [isConnected, flvUrl]);

  // ⚡ MASTER REALTIME BROADCAST: Đồng bộ 100% thời gian thực sang TikTok LIVE Studio / OBS Studio
  useEffect(() => {
    const stage = isGameBanDoActive ? 'bando' : isGameBattleActive ? 'battle' : 'idol';
    const char = CHARACTERS[selectedCharacter] || { url: '', type: 'image', name: 'AI Idol' };
    
    let currentMedia = char.url;
    let isVid = char.type === 'video';
    let streamFlvUrl = null;

    if (isConnected && flvUrl) {
      currentMedia = flvUrl;
      streamFlvUrl = flvUrl;
      isVid = true;
    } else if ((isConnected || showSimulator) && activeVideoItem) {
      currentMedia = activeVideoItem.mediaUrl;
      isVid = activeVideoItem.type === 'video';
    }

    const masterPayload = {
      type: 'MASTER_LIVE_STATE_UPDATE',
      stage, // 'idol' | 'battle' | 'bando'
      aspectRatio: globalAspectRatio, // '9:16' | '16:9'
      selectedCharacter,
      characterName: char.name || 'AI Idol',
      mediaUrl: currentMedia,
      flvUrl: streamFlvUrl,
      isVideo: !!isVid,
      isConnected: !!(isConnected || showSimulator),
      isDarkMode,
      currentLang,
      updatedAt: Date.now()
    };

    // 1. Lưu LocalStorage
    try {
      localStorage.setItem('avalive_master_live_state', JSON.stringify(masterPayload));
      localStorage.setItem('aidol_clean_stream_state', JSON.stringify({
        type: 'STREAM_MEDIA_UPDATE',
        mediaUrl: currentMedia,
        flvUrl: streamFlvUrl,
        isVideo: !!isVid,
        characterName: char.name || 'AI Idol',
        isConnected: !!(isConnected || showSimulator)
      }));
    } catch (e) {}

    // 2. Gửi REST API tới Backend
    const backendUrl = typeof window !== 'undefined' && window.location.port === '5173' ? 'http://localhost:3001' : '';
    fetch(`${backendUrl}/api/live-state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(masterPayload)
    }).catch(() => {});

    // 3. Gửi Socket.io Real-time tới TikTok Live Studio CEF & OBS
    if (socketRef.current) {
      socketRef.current.emit('MASTER_LIVE_STATE_UPDATE', masterPayload);
    }

    // 4. Gửi BroadcastChannel trong trình duyệt
    let masterChannel = null;
    let cleanChannel = null;

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        masterChannel = new BroadcastChannel('avalive_master_live_stream');
        masterChannel.postMessage(masterPayload);

        masterChannel.onmessage = (e) => {
          if (e.data && e.data.type === 'REQUEST_MASTER_LIVE_STATE') {
            masterChannel.postMessage({
              ...masterPayload,
              updatedAt: Date.now()
            });
          }
        };

        cleanChannel = new BroadcastChannel('avalive_clean_stream_channel');
        cleanChannel.postMessage({
          type: 'STREAM_MEDIA_UPDATE',
          mediaUrl: currentMedia,
          flvUrl: streamFlvUrl,
          isVideo: !!isVid,
          characterName: char.name || 'AI Idol',
          isConnected: !!(isConnected || showSimulator)
        });
      } catch (e) {}
    }

    return () => {
      if (masterChannel) masterChannel.close();
      if (cleanChannel) cleanChannel.close();
    };
  }, [isGameBanDoActive, isGameBattleActive, selectedCharacter, activeVideoItem, isConnected, showSimulator, globalAspectRatio, isDarkMode, currentLang, CHARACTERS, flvUrl]);

  // Trích xuất TikTok Username từ Link Live / ID / @username
  const extractTikTokUsername = (input) => {
    if (!input || typeof input !== 'string') return '';
    let str = input.trim().split('?')[0].split('#')[0];
    const matchAt = str.match(/@([a-zA-Z0-9_.-]+)/);
    if (matchAt && matchAt[1]) return matchAt[1];
    
    const parts = str.split('/').filter(Boolean);
    if (parts.length > 0) {
      const last = parts[parts.length - 1];
      if (last === 'live' && parts.length > 1) {
        return parts[parts.length - 2].replace(/^@/, '');
      }
      return last.replace(/^@/, '');
    }
    return str.replace(/^@/, '');
  };

  const handleConnect = async () => {
    if (isConnected) {
      // Dừng AI & Ngắt kết nối
      setIsConnected(false);
      setIsConnecting(false);
      setFlvUrl(null);
      if (socketRef.current) {
        socketRef.current.emit('disconnect_tiktok');
      }
      const timeStr = new Date().toLocaleTimeString();
      setSystemLogs(prev => [`[${timeStr}] 🛑 Đã dừng phiên Live & ngắt kết nối`, ...prev.slice(0, 49)]);
      setTiktokLogs(prev => [`[${timeStr}] 🛑 Phiên Live TikTok đã tạm dừng`, ...prev.slice(0, 49)]);
      return;
    }
    
    bandoAudio.unlock();
    const cleanId = extractTikTokUsername(tiktokId);
    const cleanVideoId = extractTikTokUsername(videoTiktokId);
    
    if (!cleanId && !cleanVideoId) {
      setToast({
        type: 'error',
        message: 'LỖI KẾT NỐI: Anh phải nhập ID Kênh Lấy Bình Luận hoặc Video!'
      });
      setIsConnecting(false);
      if (isMasterLiveRunning) setIsMasterLiveRunning(false);
      return;
    }

    setIsConnecting(true);
    try {
      localStorage.setItem('aidol_tiktok_id', cleanId);
      localStorage.setItem('aidol_video_tiktok_id', cleanVideoId);
    } catch (e) {}

    // 🛡️ Safety Timer: Tự động hủy trạng thái chờ sau 10s nếu máy chủ không phản hồi
    const safetyTimer = setTimeout(() => {
      setIsConnecting(prev => {
        if (prev) {
          setToast({
            type: 'error',
            message: '⚠️ Không thể kết nối tới TikTok Live / Backend! Hãy đảm bảo Server Node.js (cổng 3001) đang chạy hoặc kiểm tra đường truyền.'
          });
          return false;
        }
        return false;
      });
    }, 10000);

    const onFinish = () => clearTimeout(safetyTimer);
    if (socketRef.current) {
      socketRef.current.once('tiktok_connected', onFinish);
      socketRef.current.once('tiktok_error', onFinish);
      socketRef.current.emit('connect_tiktok', { chatId: cleanId, videoId: cleanVideoId });
    } else {
      clearTimeout(safetyTimer);
      setIsConnecting(false);
      setToast({
        type: 'error',
        message: '⚠️ Chưa kết nối tới Server Backend Live Hub! Vui lòng khởi động Server (npm run dev).'
      });
    }
  };

  // 🛑/▶️ NÚT ĐỒNG BỘ: TẮT TẤT CẢ / BẬT TẤT CẢ PHIÊN LIVE & CÁC TÍNH NĂNG
  const handleToggleMasterLive = () => {
    if (isMasterLiveRunning) {
      // --- TẮT TẤT CẢ ---
      setIsMasterLiveRunning(false);

      // 1. Tắt kết nối Live TikTok
      setIsConnected(false);
      setIsConnecting(false);
      
      // 2. Tắt các chế độ Demo & Tự động chạy
      setIsGlobalDemoRunning(false);
      setIsAuto247Running(false);

      if (globalDemoTimerRef.current) {
        clearInterval(globalDemoTimerRef.current);
        globalDemoTimerRef.current = null;
      }
      if (auto247TimerRef.current) {
        clearInterval(auto247TimerRef.current);
        auto247TimerRef.current = null;
      }

      // 3. Tắt toàn bộ âm thanh / BGM / SFX / Voice
      bandoAudio.stopAll();
      
      // 4. Dừng ngay lập tức toàn bộ Voice Commentary AI (Bản đồ + Trận đấu + Trợ lý)
      mapVoiceEngine.stopAll();
      battleVoiceEngine.stopAll();
      battleCommentary.stopAll();
      stopVoiceAudio();
      
      // 5. Dừng toàn bộ vòng lặp game, auto 24/7, demo, battle
      bandoEngine.stopAuto247Loop();
      bandoEngine.stopAutoTestLoop();
      
      // 6. Tắt player video / audio AIDOL
      if (audioPlayerRef.current) {
        try {
          audioPlayerRef.current.pause();
          audioPlayerRef.current.currentTime = 0;
        } catch (e) {}
      }
      
      // 7. Tắt toàn bộ Speech Synthesis của trình duyệt ngay lập tức
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      
      // 8. Tắt tất cả các audio / video elements đang phát trong DOM
      if (typeof document !== 'undefined') {
        const mediaElements = document.querySelectorAll('audio, video');
        mediaElements.forEach(el => {
          try {
            el.pause();
            el.currentTime = 0;
          } catch (e) {}
        });
      }

      // 9. Phát tín hiệu dừng toàn cục (BroadcastChannel, CustomEvent, LocalStorage) cho OBS/TikTok Live Studio Overlay
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('avalive_emergency_stop_all'));
        window.dispatchEvent(new CustomEvent('global-stop-demo'));
        try {
          localStorage.setItem('avalive_emergency_stop_trigger', Date.now().toString());
          localStorage.setItem('avalive_master_live_running', 'false');
        } catch (e) {}
      }

      if (typeof BroadcastChannel !== 'undefined') {
        try {
          const bc = new BroadcastChannel('avalive_master_live_stream');
          bc.postMessage({ type: 'EMERGENCY_STOP_ALL', timestamp: Date.now() });
          bc.close();
        } catch (e) {}
        try {
          const bcBando = new BroadcastChannel('avalive_bando_stage');
          bcBando.postMessage({ type: 'STOP_ALL', timestamp: Date.now() });
          bcBando.close();
        } catch (e) {}
        try {
          const bcBattle = new BroadcastChannel('avalive_gamebattle_stage');
          bcBattle.postMessage({ type: 'STOP_ALL', timestamp: Date.now() });
          bcBattle.close();
        } catch (e) {}
      }

      // Toast thông báo
      setToast({
        type: 'info',
        message: '🛑 ĐÃ TẮT TOÀN BỘ PHIÊN LIVE, GAME & ÂM THANH!'
      });
      setTimeout(() => setToast(null), 3500);

      const timeStr = new Date().toLocaleTimeString();
      setSystemLogs(prev => [
        `[${timeStr}] 🛑 ĐÃ TẮT TOÀN BỘ PHIÊN LIVE, GAME & ÂM THANH THEO LỆNH STREAMER`,
        ...prev.slice(0, 48)
      ]);
    } else {
      // --- BẬT TẤT CẢ ---
      setIsMasterLiveRunning(true);
      try {
        localStorage.setItem('avalive_master_live_running', 'true');
      } catch (e) {}

      // 1. Reset Bảng Xếp Hạng về 0 để cập nhật thông tin người tặng Live mới nhất
      try {
        bandoEngine.resetLeaderboard();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('avalive_reset_leaderboard'));
        }
      } catch (e) {}

      // 2. Mở kết nối TikTok Live nếu có username
      handleConnect();

      // 3. Mở lại Web Audio Engine, Nhạc Nền BGM & Bình Luận Viên AI
      try {
        bandoAudio.unlock();
        if (isGameBanDoActive) {
          bandoAudio.playBgmOnLive();
          mapVoiceEngine.startPeriodicCommentary(true);
        } else if (isGameBattleActive) {
          battleCommentary.startPeriodicCommentary(true);
          battleVoiceEngine.startPeriodicCommentary(true);
        }
      } catch (e) {}

      // 4. Phát tín hiệu bật lại toàn cục
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('avalive_resume_all'));
      }

      if (typeof BroadcastChannel !== 'undefined') {
        try {
          const bc = new BroadcastChannel('avalive_master_live_stream');
          bc.postMessage({ 
            type: 'RESUME_ALL', 
            stage: isGameBanDoActive ? 'bando' : (isGameBattleActive ? 'battle' : 'idol'),
            timestamp: Date.now() 
          });
          bc.close();
        } catch (e) {}
      }

      setToast({
        type: 'success',
        message: '▶️ ĐÃ BẬT TOÀN BỘ PHIÊN LIVE & CÁC TÍNH NĂNG CÀI SẴN!'
      });
      setTimeout(() => setToast(null), 3500);

      const timeStr = new Date().toLocaleTimeString();
      setSystemLogs(prev => [
        `[${timeStr}] ▶️ ĐÃ BẬT TOÀN BỘ PHIÊN LIVE & MỌI TÍNH NĂNG CÀI SẴN`,
        ...prev.slice(0, 48)
      ]);
    }
  };

  const handleStopAllLive = handleToggleMasterLive;

  const toggleWebcam = async () => {
    if (isWebcamActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setIsWebcamActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsWebcamActive(true);
      } catch (err) {
        alert("Không thể truy cập Webcam: " + err.message);
      }
    }
  };

  useEffect(() => {
    if (isWebcamActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isWebcamActive]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/AvaLive_VIP_PRO_Full_Package.zip';
    link.download = 'AvaLive_VIP_PRO_Full_Package.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportTimelineCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFFThời gian,Tên Sự kiện,Nội dung Sự kiện,Phản ứng của AI\n";
    viewerHistory.slice().reverse().forEach(row => {
      let time = row.time || '';
      let type = row.type === 'COMMENT' ? 'Bình luận' : row.type === 'GIFT' ? 'Tặng quà' : 'Vào phòng';
      let content = row.type === 'COMMENT' ? row.payload.text : row.type === 'GIFT' ? row.payload.gift : row.payload.name;
      let ai = row.ai_reply || '';
      // escape quotes
      content = content.replace(/"/g, '""');
      ai = ai.replace(/"/g, '""');
      csvContent += `"${time}","${type}","${content}","${ai}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Dong_thoi_gian_su_kien.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const charName = prompt("Nhập tên cho nhân vật (để dễ quản lý):");
      if (!charName) {
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      const url = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video/');
      const newChar = {
        id: `custom_${Date.now()}`,
        name: charName,
        url,
        type: isVideo ? 'video' : 'image'
      };
      
      // Update UI first
      setCustomCharacters(prev => [...prev, newChar]);
      setSelectedCharacter(newChar.id);

      // Save to IDB
      await saveCharacterToIDB({
        id: newChar.id,
        name: newChar.name,
        type: newChar.type,
        fileData: file
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeCustomCharacter = async (e, id) => {
    e.stopPropagation();
    setCustomCharacters(prev => prev.filter(c => c.id !== id));
    if (selectedCharacter === id) {
      setSelectedCharacter('aidol_lan_huong');
    }
    await deleteCharacterFromIDB(id);
  };

  const renderAiIdolLiveStage = () => {
    // 0. Ưu tiên phát Video Phản hồi Nhanh khẩn cấp (Override Live Screen)
    if (quickResponseActiveVideo) {
      return (
        <div className="relative w-full h-full">
          <video 
            key={quickResponseActiveVideo.url}
            src={quickResponseActiveVideo.url} 
            className="w-full h-full object-contain bg-black"
            autoPlay 
            loop={quickResponseActiveVideo.loop}
            muted={quickResponseActiveVideo.muted}
            controls={false}
            onEnded={() => {
              if (!quickResponseActiveVideo.loop) {
                setQuickResponseActiveVideo(null);
                showToast('Đã phát xong video phản hồi nhanh!', 'info');
              }
            }}
            onError={() => {
              setQuickResponseActiveVideo(null);
              showToast('Lỗi tải video phản hồi nhanh!', 'warn');
            }}
            playsInline 
          />
          <div className="absolute top-4 left-4 bg-red-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 animate-pulse z-20">
            <Zap size={14} /> ĐANG PHÁT VIDEO PHẢN HỒI: {quickResponseActiveVideo.name || 'Video Khẩn cấp'}
            <button 
              onClick={() => {
                setQuickResponseActiveVideo(null);
                showToast('Đã dừng video phản hồi!', 'warn');
              }}
              className="ml-2 bg-black/40 hover:bg-black/60 px-2 py-0.5 rounded text-[10px] text-white"
            >
              Dừng phát ✕
            </button>
          </div>
        </div>
      );
    }

    const renderMainCharacter = () => {
      if (lipSyncVideoUrl) {
        return (
          <video 
            src={lipSyncVideoUrl} 
            className="w-full h-full object-contain bg-black"
            autoPlay 
            controls={false}
            onEnded={handleVideoEnded}
            onError={() => {
              setLipSyncVideoUrl(null);
              handleVideoEnded();
            }}
            playsInline 
          />
        );
      }
      
      if (isConnected && activeVideoItem && activeVideoItem.mediaUrl) {
        return (
          <video 
            key={activeVideoItem.id || activeVideoItem.mediaUrl}
            src={activeVideoItem.mediaUrl} 
            className="w-full h-full object-contain bg-black"
            autoPlay 
            loop={!isProcessingEvent}
            controls={false}
            onEnded={handleVideoEnded}
            onError={() => {
              console.warn('Lỗi tải video nền live');
              setActiveVideoItem(null);
            }}
            playsInline 
          />
        );
      }

      const selected = CHARACTERS[selectedCharacter] || Object.values(CHARACTERS)[0];
  
      if (!selected || !selected.url) {
        return (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#101018] to-[#0a0a0f] text-white p-6 cursor-pointer border-2 border-dashed border-gray-700/60 hover:border-blue-500/80 transition-all group select-none"
          >
             <div className="w-16 h-16 rounded-2xl bg-blue-600/15 group-hover:bg-blue-600/30 border border-blue-500/30 flex items-center justify-center mb-3 text-blue-400 shadow-lg">
               <Plus size={30} />
             </div>
             <h3 className="text-base font-bold text-white mb-1">Tải Ảnh / Video Idol Của Bạn</h3>
          </div>
        );
      }
  
      if (selected.type === 'video') {
        return (
          <video 
            key={selected.url}
            src={selected.url} 
            className="w-full h-full object-contain bg-black"
            autoPlay 
            loop 
            muted 
            controls 
            playsInline 
          />
        );
      }

      return (
        <div className="relative w-full h-full flex items-center justify-center bg-[#0d0d12] overflow-hidden select-none">
          <img 
            src={selected.url} 
            className="w-full h-full object-contain drop-shadow-2xl transition-all"
            alt={selected.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </div>
      );
    };

    if (isConnected && flvUrl) {
      return (
        <div className="relative w-full h-full flex flex-col bg-black">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Video trực tiếp 60fps - Hardware Accelerated */}
            <video
              ref={flvVideoRef}
              className="w-full h-full object-contain select-none"
              style={{ background: 'black' }}
              controls={false}
              autoPlay
              muted={isLiveAudioMuted}
              playsInline
            />
          </div>
        </div>
      );
    }

    return renderMainCharacter();
  };

  const renderCharacterContent = () => {
    // -1. Chế độ Game Chiến Đấu (TikTok LIVE Battle Overlay)
    if (isGameBattleActive) {
      return (
        <GameChienDau 
          isPopout={false}
          onOpenAdmin={() => setIsGameAdminOpen(true)}
          externalLiveEvent={lastGameEvent}
          aspectRatio={globalAspectRatio}
          onToggleAspectRatio={toggleGlobalAspectRatio}
          isDarkMode={isDarkMode}
        />
      );
    }

    // -2. Chế độ Game Đất Nước Bản Đồ Hình Chữ S (Việt Nam Ghép Cờ LIVE)
    if (isGameBanDoActive) {
      return (
        <GameBanDoVietNam 
          isPopout={false}
          onOpenAdmin={() => setIsGameBanDoAdminOpen(true)}
          externalLiveEvent={lastGameEvent}
          aspectRatio={globalAspectRatio}
          onToggleAspectRatio={toggleGlobalAspectRatio}
          isDarkMode={isDarkMode}
        />
      );
    }

    // -3. Chế độ Sàn Nhảy TikTok
    // -3. Chế độ Sàn Nhảy TikTok
    if (isDanceFloorActive) {
      return (
        <div className="w-full h-full overflow-y-auto bg-black relative">
           <DanceFloorStudio 
             isLive={isMasterLiveRunning} 
             setIsLive={() => {}} 
             isAdminOpen={isDanceFloorAdminOpen}
             onCloseAdmin={() => setIsDanceFloorAdminOpen(false)}
           />
        </div>
      );
    }

    // 0. Chế độ AI Idol Livestream Video / Live Screen
    return (
      <div className={`w-full h-full flex items-center justify-center p-2 sm:p-3 overflow-hidden ${isDarkMode ? 'bg-[#05070c]' : 'bg-slate-200'}`}>
        <div 
          className={`relative flex flex-col overflow-hidden transition-all duration-300 ${
            globalAspectRatio === '9:16'
              ? 'h-full max-h-full aspect-[9/16] w-auto max-w-full mx-auto rounded-2xl md:rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.85)] bg-black'
              : 'w-full max-w-[1200px] h-auto max-h-full aspect-[16/9] rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.85)] bg-black'
          }`}
        >
          {renderAiIdolLiveStage()}
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full h-screen flex flex-col font-sans transition-colors duration-200 ${isDarkMode ? 'bg-[#0f0f13] text-white' : 'bg-slate-100 text-slate-900'}`}>
      
      {/* 1. Fake Window Title Bar (Thu nhỏ ~30% đồng đều tất cả các ô nút bấm) */}
      <div className={`flex items-center justify-between px-2 py-1 ${isDarkMode ? 'bg-[#1c1c23] border-gray-800 text-white' : 'bg-slate-200 border-slate-300 text-slate-800'} select-none z-30 border-b`}>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-blue-500 flex items-center justify-center">
            <Video size={9} className="text-white" />
          </div>
          <span className="text-[11px] font-bold truncate max-w-[220px]">
            Profile: {CHARACTERS[selectedCharacter]?.name || (Object.keys(CHARACTERS).length > 0 ? Object.values(CHARACTERS)[0]?.name : 'Live Idol Pro (Chưa đặt tên)')}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          {/* NÚT BẤM ĐỒNG BỘ: TẮT TẤT CẢ / BẬT TẤT CẢ PHIÊN LIVE & CÁC TÍNH NĂNG */}
          <button 
            onClick={handleToggleMasterLive}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black border shadow-sm transition-all active:scale-95 ${
              isMasterLiveRunning
                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white border-red-400 animate-pulse'
                : 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-500 hover:to-green-500 text-white border-emerald-400 ring-1 ring-emerald-300'
            }`}
            title={isMasterLiveRunning 
              ? "🛑 BẤM TẮT TẤT CẢ: Dừng ngay toàn bộ phiên Live, Game Chiến Đấu, Game Bản Đồ, Tắt Nhạc nền BGM, Hiệu ứng SFX và Bình Luận Viên" 
              : "▶️ BẤM BẬT TẤT CẢ: Khởi động lại toàn bộ phiên Live, AI Idol, Game, Âm thanh & Kết nối TikTok"}
          >
            {isMasterLiveRunning ? (
              <>
                <StopCircle size={11} className="text-yellow-300 shrink-0" />
                <span className="uppercase tracking-tight whitespace-nowrap">Tắt Tất Cả</span>
              </>
            ) : (
              <>
                <Play size={11} className="text-white fill-white shrink-0" />
                <span className="uppercase tracking-tight whitespace-nowrap">Bật Tất Cả</span>
              </>
            )}
          </button>

          {/* Nút Chế độ Live AI Idol */}
          <button 
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-all border shadow-xs ${
              !isGameBattleActive && !isGameBanDoActive && !isDanceFloorActive
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white border-cyan-300 shadow-cyan-500/40 ring-1 ring-cyan-400/50' 
                : (isDarkMode ? 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-900/50' : 'border-cyan-300 bg-cyan-50 text-cyan-700 hover:bg-cyan-100')
            }`}
            onClick={() => {
              setIsGameBattleActive(false);
              setIsGameBanDoActive(false);
              setIsDanceFloorActive(false);
              try { localStorage.setItem('avalive_active_stage', 'idol'); } catch (e) {}
              mapVoiceEngine.stopAll();
              battleVoiceEngine.stopAll();
              battleCommentary.stopAll();
            }}
            title="Chuyển sang màn hình Livestream AI Idol"
          >
            <Video size={10} className={!isGameBattleActive && !isGameBanDoActive && !isDanceFloorActive ? 'text-yellow-300' : 'text-cyan-400'} />
            <span className="whitespace-nowrap">Live AI Idol</span>
            {!isGameBattleActive && !isGameBanDoActive && !isDanceFloorActive && (
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping"></span>
            )}
          </button>

          {/* Nút Kích hoạt Game Chiến Đấu */}
          <button 
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-all border shadow-xs ${
              isGameBattleActive 
                ? 'bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 text-white border-purple-400 shadow-purple-500/40 ring-1 ring-purple-400/50 animate-pulse' 
                : (isDarkMode ? 'border-indigo-500/50 bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/60' : 'border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100')
            }`}
            onClick={() => {
              setIsGameBattleActive(true);
              setIsGameBanDoActive(false);
              setIsDanceFloorActive(false);
              try { localStorage.setItem('avalive_active_stage', 'battle'); } catch (e) {}
              mapVoiceEngine.stopAll();
              if (isMasterLiveRunning) {
                bandoAudio.unlock();
                battleCommentary.startPeriodicCommentary(true);
                battleVoiceEngine.startPeriodicCommentary(true);
              }
            }}
            title="Chuyển sang chế độ Game Chiến Đấu (TikTok LIVE Battle Game) trên màn hình chính"
          >
            <Swords size={10} className={isGameBattleActive ? 'text-yellow-300' : 'text-indigo-400'} />
            <span className="whitespace-nowrap">Game Chiến Đấu</span>
            {isGameBattleActive && (
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping"></span>
            )}
          </button>

          {/* Nút Cài đặt Game Chiến Đấu - Nằm KẾ BÊN Game Chiến Đấu khi đang mở */}
          {isGameBattleActive && (
            <button
              onClick={() => setIsGameAdminOpen(true)}
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-gradient-to-r from-purple-900/90 to-indigo-900/90 hover:from-purple-800 hover:to-indigo-800 text-purple-200 hover:text-white border border-purple-400/80 shadow-xs transition-all animate-in fade-in duration-200"
              title="Cài đặt Game Chiến Đấu"
            >
              <Settings size={10} className="text-yellow-300" />
              <span>Game</span>
            </button>
          )}


          {/* Nút Kích hoạt Game Ghép Cờ Bản Đồ Việt Nam (Hình Chữ S) */}
          <button 
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-all border shadow-xs ${
              isGameBanDoActive 
                ? 'bg-gradient-to-r from-red-600 via-amber-600 to-yellow-500 text-white border-yellow-300 shadow-yellow-500/40 ring-1 ring-yellow-400/50 animate-pulse' 
                : (isDarkMode ? 'border-amber-500/50 bg-amber-950/40 text-amber-300 hover:bg-amber-900/60' : 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100')
            }`}
            onClick={() => {
              setIsGameBanDoActive(true);
              setIsGameBattleActive(false);
              setIsDanceFloorActive(false);
              try { localStorage.setItem('avalive_active_stage', 'bando'); } catch (e) {}
              battleVoiceEngine.stopAll();
              battleCommentary.stopAll();
              if (isMasterLiveRunning) {
                bandoAudio.unlock();
                bandoAudio.playBgmOnLive();
                mapVoiceEngine.startPeriodicCommentary(true);
              }
            }}
            title="Chuyển sang Game Ghép Cờ Bản Đồ Việt Nam (Đất Nước Hình Chữ S) trên màn hình chính"
          >
            <Flag size={10} className={isGameBanDoActive ? 'text-yellow-200' : 'text-amber-400'} />
            <span className="whitespace-nowrap">Bản Đồ Chữ S</span>
            {isGameBanDoActive && (
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping"></span>
            )}
          </button>

          {/* Nút Cài đặt Game Bản Đồ - Nằm KẾ BÊN Game Bản Đồ khi đang mở */}
          {isGameBanDoActive && (
            <button
              onClick={() => setIsGameBanDoAdminOpen(true)}
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-gradient-to-r from-amber-900/90 to-red-900/90 hover:from-amber-800 hover:to-red-800 text-amber-200 hover:text-white border border-amber-400/80 shadow-xs transition-all animate-in fade-in duration-200"
              title="Cài đặt Game Bản Đồ"
            >
              <Settings size={10} className="text-yellow-300" />
              <span>Game</span>
            </button>
          )}

          {/* 1 Nút Chuyển Tỷ Lệ Khung Hình Toàn Cục DUY NHẤT CHO TOÀN BỘ HỆ THỐNG: 9:16 (TikTok Dọc) vs 16:9 (OBS Ngang) */}
          <button
            onClick={toggleGlobalAspectRatio}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-black transition-all border shadow-xs ${
              globalAspectRatio === '9:16'
                ? 'bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white border-pink-300 ring-1 ring-pink-400/50 shadow-pink-500/30'
                : (isDarkMode ? 'bg-white/10 hover:bg-white/20 text-cyan-300 border-white/10' : 'bg-gray-200 hover:bg-gray-300 text-slate-800 border-gray-300')
            }`}
            title={globalAspectRatio === '9:16' ? "Đang ở Khung Hình 9:16 (Chuẩn TikTok Live Dọc) — Bấm chuyển sang 16:9 (Ngang OBS/PC)" : "Đang ở Khung Hình 16:9 (Ngang OBS/PC) — Bấm chuyển sang 9:16 (Chuẩn TikTok Live Dọc)"}
          >
            <Smartphone size={10} className={globalAspectRatio === '9:16' ? 'text-yellow-300' : 'text-cyan-300'} />
            <span className="whitespace-nowrap">{globalAspectRatio === '9:16' ? '9:16 TikTok' : '16:9 OBS'}</span>
          </button>

          {/* 🌐 Bộ Chuyển Đổi 20 Ngôn Ngữ Toàn Cầu */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-all border shadow-xs ${
                isDarkMode ? 'bg-white/10 hover:bg-white/20 text-yellow-300 border-white/10' : 'bg-gray-200 hover:bg-gray-300 text-slate-900 border-gray-300'
              }`}
              title="Chuyển đổi ngôn ngữ hệ thống & Giọng đọc AI (20 Quốc Gia)"
            >
              <Globe size={11} className="text-amber-400" />
              <span className="whitespace-nowrap">{SUPPORTED_LANGUAGES.find(l => l.code === currentLang)?.flag || '🌐'} {SUPPORTED_LANGUAGES.find(l => l.code === currentLang)?.name || 'Ngôn ngữ'}</span>
            </button>
            {isLangDropdownOpen && (
              <div className={`absolute top-full right-0 mt-2 w-64 max-h-80 overflow-y-auto rounded-xl shadow-2xl border z-50 p-1.5 ${isDarkMode ? 'bg-[#1c1c23] border-gray-700 text-white' : 'bg-white border-gray-200 text-slate-800'} animate-in fade-in slide-in-from-top-2 duration-200`}>
                <div className="px-2 py-1 text-[10px] font-black uppercase text-gray-400 border-b border-gray-500/20 mb-1">
                  20 Ngôn Ngữ Quốc Tế (Đồng Bộ Giao Diện & Voice)
                </div>
                {SUPPORTED_LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setCurrentLanguage(lang.code);
                      setCurrentLangState(lang.code);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1 rounded-md text-xs font-bold transition-all flex items-center justify-between gap-2 ${
                      currentLang === lang.code
                        ? 'bg-blue-600 text-white'
                        : (isDarkMode ? 'hover:bg-white/10 text-gray-200' : 'hover:bg-gray-100 text-gray-800')
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                    <span className="text-[10px] opacity-75">{lang.code.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-0.5 rounded transition-colors ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-400 text-gray-800 hover:bg-gray-500'}`}>
            {isDarkMode ? <Sun size={10} /> : <Moon size={10} />}
          </button>

          {/* Token Widget */}
          <button
            onClick={() => setShowTokenHistory(true)}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-all border ${
              balance === 0
                ? 'bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30'
                : balance < TOKEN_RATES.LOW_BALANCE_WARN
                ? 'bg-orange-500/20 border-orange-500/40 text-orange-400 hover:bg-orange-500/30'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
            }`}
            title="Xem lịch sử Token"
          >
            {balance < TOKEN_RATES.LOW_BALANCE_WARN && <AlertTriangle size={10} />}
            <Coins size={10} />
            <span className="whitespace-nowrap">{balance.toLocaleString()}</span>
          </button>

          <button className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium transition-colors ${isDarkMode ? 'bg-[#0088cc]/20 text-[#0088cc] hover:bg-[#0088cc]/30' : 'bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc]/20'}`}>
            <MessageCircle size={10} />
            <span>Zalo</span>
          </button>

          <button onClick={() => setActiveSettingsModal('payment')} className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium transition-colors ${isDarkMode ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-green-500/10 text-green-700 hover:bg-green-500/20'}`}>
            <CreditCard size={10} />
            <span className="whitespace-nowrap">{t('payment', currentLang)}</span>
          </button>

          {/* Nút Mở Link Realtime TikTok LIVE Studio & OBS Studio - Nhỏ gọn tinh tế */}
          <button
            onClick={() => setShowOverlayModal(true)}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-cyan-600/80 hover:bg-cyan-500 text-white border border-cyan-400/50 shadow-xs transition-all hover:scale-105"
            title="Mở & Sao chép Link Live Overlay cho TikTok LIVE Studio / OBS Studio"
          >
            <Radio size={10} className="text-yellow-300 animate-pulse" />
            <span className="whitespace-nowrap">📡 Link Live</span>
          </button>

          {/* Nút Tải phần mềm (ZIP) */}
          <button 
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 text-[10px] font-bold rounded-md shadow-xs flex items-center gap-1 transition-colors"
          >
            <Download size={10} />
            <span className="whitespace-nowrap">{t('downloadZip', currentLang)}</span>
          </button>
        </div>
      </div>

      {/* 2. Top Control Bar (Thu nhỏ ~30% để không gian live to rộng) */}
      <div className={`flex items-center gap-2 px-3 py-1.5 ${isDarkMode ? 'bg-[#1a1a24]' : 'bg-gray-200'} border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-300'} z-40 shadow-sm overflow-visible whitespace-nowrap`}>
        
        {/* Left Side: Settings & Payment */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative shrink-0">
            <button 
              onClick={() => setIsSettingsDropdownOpen(!isSettingsDropdownOpen)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-colors ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            >
              <Settings size={13} />
              <span>{t('menu', currentLang)}</span>
            </button>
            
            {isSettingsDropdownOpen && (
              <div className={`absolute top-full left-0 mt-2 w-64 rounded-xl shadow-2xl border z-50 p-2 overflow-hidden ${isDarkMode ? 'bg-[#1c1c23] border-gray-700' : 'bg-white border-gray-200'} animate-in fade-in slide-in-from-top-2 duration-200`}>
                <button 
                  onClick={() => { setActiveSettingsModal('general'); setIsSettingsDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 mb-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 ${isDarkMode ? 'bg-gradient-to-r from-blue-900/40 to-blue-800/20 hover:from-blue-600 hover:to-blue-500 text-blue-100 hover:text-white border border-blue-800/50' : 'bg-blue-50 hover:bg-blue-500 text-blue-800 hover:text-white'}`}
                >
                  <Brain size={16} />
                  <span>{t('aiBrain', currentLang)}</span>
                </button>
                <button 
                  onClick={() => { setActiveSettingsModal('workspace'); setIsSettingsDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 mb-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 ${isDarkMode ? 'bg-gradient-to-r from-purple-900/40 to-purple-800/20 hover:from-purple-600 hover:to-purple-500 text-purple-100 hover:text-white border border-purple-800/50' : 'bg-purple-50 hover:bg-purple-500 text-purple-800 hover:text-white'}`}
                >
                  <Radio size={16} />
                  <span>{t('idolConnect', currentLang)}</span>
                </button>
                <button 
                  onClick={() => { setActiveSettingsModal('captcha'); setIsSettingsDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 mb-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 ${isDarkMode ? 'bg-gradient-to-r from-emerald-900/50 to-teal-800/30 hover:from-emerald-600 hover:to-teal-500 text-emerald-200 hover:text-white border border-emerald-700/60 shadow-lg' : 'bg-emerald-50 hover:bg-emerald-500 text-emerald-800 hover:text-white'}`}
                >
                  <Shield size={16} className="text-emerald-400" />
                  <span>{t('captchaBypass', currentLang)}</span>
                </button>

                {/* Đường phân cách */}
                <div className={`my-1.5 border-t ${isDarkMode ? 'border-gray-700/60' : 'border-gray-200'}`} />

                {/* 4. STUDIO (WEBCAM / LIVE STUDIO) - NẰM DƯỚI CÙNG MENU */}
                <button 
                  onClick={() => { toggleWebcam(); setIsSettingsDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2 mb-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between gap-2 ${isWebcamActive ? (isDarkMode ? 'bg-pink-600/30 hover:bg-pink-600/40 text-pink-200 border border-pink-500/60 shadow-md' : 'bg-pink-100 hover:bg-pink-200 text-pink-800 border border-pink-300') : (isDarkMode ? 'bg-gray-800/50 hover:bg-pink-900/30 text-gray-300 hover:text-pink-300 border border-gray-700/50' : 'bg-gray-50 hover:bg-pink-50 text-gray-700 hover:text-pink-700 border border-gray-200')}`}
                  title="Bật/Tắt Cửa sổ Camera Webcam Live Studio"
                >
                  <div className="flex items-center gap-2">
                    <Video size={15} className={isWebcamActive ? 'text-pink-400 animate-pulse' : 'text-gray-400'} />
                    <span>{t('studio', currentLang)}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isWebcamActive ? 'bg-pink-500 text-white' : (isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600')}`}>
                    {isWebcamActive ? t('on', currentLang) : t('off', currentLang)}
                  </span>
                </button>

                {/* 5. GIAO TIẾP (GIỌNG NÓI 2 CHIỀU AI) - NẰM DƯỚI CÙNG MENU */}
                <button 
                  onClick={() => { setIsCommMode(!isCommMode); setIsSettingsDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between gap-2 ${isCommMode ? (isDarkMode ? 'bg-red-600/30 hover:bg-red-600/40 text-red-200 border border-red-500/60 shadow-md' : 'bg-red-100 hover:bg-red-200 text-red-800 border border-red-300') : (isDarkMode ? 'bg-gray-800/50 hover:bg-red-900/30 text-gray-300 hover:text-red-300 border border-gray-700/50' : 'bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-700 border border-gray-200')}`}
                  title="Bật/Tắt Giao tiếp bằng Giọng nói 2 chiều với AI"
                >
                  <div className="flex items-center gap-2">
                    {isCommMode ? <Mic size={15} className="text-red-400 animate-pulse" /> : <MicOff size={15} className="text-gray-400" />}
                    <span>{t('communication', currentLang)}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isCommMode ? 'bg-red-500 text-white animate-pulse' : (isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600')}`}>
                    {isCommMode ? t('on', currentLang) : t('off', currentLang)}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1"></div>

        {/* Middle: Controls */}
        <div className="flex items-center justify-center gap-2 shrink-0">
          
          <div className="flex items-center gap-1.5 border-r border-gray-500/30 pr-2">
            <span className="text-xs font-medium text-gray-400">{t('characters', currentLang)}</span>
            <div className="flex items-center gap-1.5">
              {Object.keys(CHARACTERS).length === 0 ? (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md border border-dashed border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[10.5px] font-bold transition-all hover:scale-105"
                  title="Tải ảnh hoặc video nhân vật của bạn"
                >
                  <Plus size={12} />
                  <span>+ Tải Nhân Vật</span>
                </button>
              ) : (
                Object.keys(CHARACTERS).map((charId) => (
                  CHARACTERS[charId] ? (
                    <div 
                      key={charId}
                      onClick={() => {
                        setSelectedCharacter(charId);
                        try { localStorage.setItem('avalive_selected_char', charId); } catch (e) {}
                        setIsGameBattleActive(false);
                        setIsGameBanDoActive(false);
                      }}
                      className={`w-7 h-7 rounded-lg overflow-hidden cursor-pointer flex-shrink-0 relative group ${selectedCharacter === charId ? 'border-2 border-blue-500 shadow-md shadow-blue-500/30' : 'border border-gray-600 opacity-60 hover:opacity-100'}`}
                      title={CHARACTERS[charId]?.name || ''}
                    >
                      {CHARACTERS[charId]?.type === 'video' ? (
                        <video src={CHARACTERS[charId]?.url} className="w-full h-full object-cover" muted />
                      ) : (
                        <img src={CHARACTERS[charId]?.url} className="w-full h-full object-cover" alt={CHARACTERS[charId]?.name || ''} />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCustomCharacter(e, charId);
                        }}
                        className="absolute top-0 right-0 p-0.5 bg-red-600 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all duration-150 rounded-bl"
                        title={`Xoá ${CHARACTERS[charId]?.name || ''}`}
                      >
                        <X size={8} />
                      </button>
                    </div>
                  ) : null
                ))
              )}
              {Object.keys(CHARACTERS).length > 0 && (
                <button className="w-7 h-7 rounded border border-dashed border-gray-500 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer transition-colors hover:bg-gray-700/50 shrink-0" onClick={() => fileInputRef.current?.click()} title="Tải thêm nhân vật mới">
                  <Plus size={13} />
                </button>
              )}
              <button 
                className={`px-2 py-1 rounded text-xs font-medium transition-colors border ${isDarkMode ? 'border-purple-500/50 bg-purple-900/30 text-purple-300 hover:bg-purple-800/50' : 'border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
                onClick={() => setIsTemplateLibraryOpen(true)}
              >
                {t('templates', currentLang)}
              </button>
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="video/*,image/*" onChange={handleFileUpload} />
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-1 shrink-0">
            <input type="text" value={tiktokId} onChange={(e) => setTiktokId(e.target.value)} className={`w-28 px-2 py-1 rounded text-xs outline-none border ${isDarkMode ? 'bg-[#2a2a35] border-gray-700 text-white focus:border-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'}`} placeholder="ID lấy Chat" title="Nhập ID kênh TikTok của anh để đọc bình luận" />
            <input type="text" value={videoTiktokId} onChange={(e) => setVideoTiktokId(e.target.value)} className={`w-28 px-2 py-1 rounded text-xs outline-none border ${isDarkMode ? 'bg-[#2a2a35] border-gray-700 text-white focus:border-emerald-500' : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500'}`} placeholder="ID lấy Video" title="Nhập ID kênh TikTok lấy video re-stream (bỏ trống nếu lấy video kênh chính)" />
            <button onClick={handleConnect} className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-colors ${isConnected ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-500/20'}`}>
              {isConnecting ? <span className="animate-spin text-sm leading-none">↻</span> : (isConnected ? <CheckCircle size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />)}
              <span>{isConnecting ? t('connecting', currentLang) : (isConnected ? t('stopAi', currentLang) : t('connect', currentLang))}</span>
            </button>
          </div>
        </div>

        <div className="flex-1"></div>

        {/* Right Side: Toggles & Stream Window */}
        <div className="flex items-center gap-1.5 shrink-0">
          
          {/* Nút ⚡ AUTO 24/7 (Chạy Tự Động 24/24 & Tự Giải Captcha AI) */}
          <button 
            onClick={handleToggleAuto247}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black transition-all border shadow-md active:scale-95 ${
              isAuto247Running
                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white border-yellow-300 ring-2 ring-yellow-400 shadow-red-500/50 animate-pulse'
                : (isDarkMode ? 'bg-white/10 hover:bg-white/20 text-gray-200 border-white/20' : 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300')
            }`}
            title="Kích hoạt chế độ Chạy Tự Động 24/24 liên tục cho tất cả Game, Live Idol & Tự Động Giải Captcha"
          >
            <Zap size={13} className={isAuto247Running ? 'text-yellow-300 animate-spin' : 'text-amber-400'} />
            <span>{isAuto247Running ? t('auto247On', currentLang) : t('auto247Off', currentLang)}</span>
            {isAuto247Running && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            )}
          </button>

          {/* 1 Nút Chạy Demo DUY NHẤT dùng chung */}
          <button 
            onClick={handleGlobalRunDemo}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black transition-all border shadow-md active:scale-95 ${
              isGlobalDemoRunning
                ? 'bg-red-600 text-white border-yellow-300 ring-2 ring-yellow-400 animate-pulse'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-emerald-400/40 shadow-emerald-500/20'
            }`}
            title="Chạy Demo / Kiểm thử tự động quà tặng & tương tác"
          >
            <Zap size={13} className={isGlobalDemoRunning ? 'text-yellow-300 animate-bounce' : 'text-yellow-300'} />
            <span>{isGlobalDemoRunning ? t('stopDemo', currentLang) : t('runDemo', currentLang)}</span>
          </button>

          {/* Nút Test Âm Thanh & Voice AI (Nhỏ gọn, tinh tế) */}
          <button 
            onClick={handleAudioTest}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-all border shadow-xs active:scale-95 ${
              isDarkMode ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border-amber-400/30' : 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-300'
            }`}
            title="Phát thử âm thanh tù và chiến trận & Giọng nói AI để kiểm tra loa / TikTok LIVE Studio"
          >
            <Volume2 size={10} className="text-yellow-400" />
            <span className="whitespace-nowrap">Test Âm Thanh</span>
          </button>

          {/* Menu Theo dõi */}
          <div className="relative">
            <button 
              onClick={() => setIsMonitorDropdownOpen(!isMonitorDropdownOpen)} 
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${isMonitorDropdownOpen ? 'bg-orange-600 text-white' : (isDarkMode ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' : 'bg-orange-100 text-orange-700 hover:bg-orange-200')}`}>
              <Eye size={13} />
              <span>{t('monitor', currentLang)}</span>
            </button>
            {isMonitorDropdownOpen && (
              <div className={`absolute top-full right-0 mt-2 w-56 rounded-xl shadow-2xl border z-50 p-2 overflow-hidden ${isDarkMode ? 'bg-[#1c1c23] border-gray-700 text-white' : 'bg-white border-gray-200 text-slate-800'} animate-in fade-in slide-in-from-top-2 duration-200`}>
                <button onClick={() => { setActiveMonitorModal('quick_response'); setIsMonitorDropdownOpen(false); }} className={`w-full text-left px-2.5 py-1.5 mb-1 rounded text-xs font-bold transition-colors flex items-center gap-2 ${isDarkMode ? 'hover:bg-yellow-500/20 text-yellow-400' : 'hover:bg-yellow-100 text-yellow-800'}`}>
                  <Zap size={13} className="text-yellow-500" /> 
                  <span>{t('quickResponse', currentLang)}</span>
                </button>
                <button onClick={() => { setActiveMonitorModal('timeline'); setIsMonitorDropdownOpen(false); }} className={`w-full text-left px-2.5 py-1.5 mb-1 rounded text-xs font-medium transition-colors flex items-center gap-2 ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <Clock size={13} className="text-blue-400" /> 
                  <span>{t('timeline', currentLang)}</span>
                </button>
                <button onClick={() => { setActiveMonitorModal('queue'); setIsMonitorDropdownOpen(false); }} className={`w-full text-left px-2.5 py-1.5 mb-1 rounded text-xs font-medium transition-colors flex items-center gap-2 ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <List size={13} className="text-purple-400" /> 
                  <span>{t('aiQueue', currentLang)}</span>
                </button>
                <button onClick={() => { setActiveMonitorModal('tiktok_log'); setIsMonitorDropdownOpen(false); }} className={`w-full text-left px-2.5 py-1.5 mb-1 rounded text-xs font-medium transition-colors flex items-center gap-2 ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <FileText size={13} className="text-pink-400" /> 
                  <span>{t('tiktokLog', currentLang)}</span>
                </button>
                <button onClick={() => { setActiveMonitorModal('sys_log'); setIsMonitorDropdownOpen(false); }} className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-2 ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <AlertCircle size={13} className="text-orange-400" /> 
                  <span>{t('sysLog', currentLang)}</span>
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => setShowSimulator(!showSimulator)} 
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${showSimulator ? 'bg-purple-600 text-white' : (isDarkMode ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' : 'bg-purple-100 text-purple-700 hover:bg-purple-200')}`}>
            <Brain size={13} />
            <span>{t('testTools', currentLang)}</span>
          </button>

          {/* Nút Âm thanh Live nằm ngoài khung video */}
          {isConnected && flvUrl && (
            <button
              onClick={() => {
                const nextMuted = !isLiveAudioMuted;
                setIsLiveAudioMuted(nextMuted);
                if (flvVideoRef.current) flvVideoRef.current.muted = nextMuted;
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-all shadow-md ${
                isLiveAudioMuted 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30' 
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
              title={isLiveAudioMuted ? "Bật tiếng Live" : "Tắt tiếng Live"}
            >
              {isLiveAudioMuted ? <VolumeX size={13} className="text-red-400" /> : <Volume2 size={13} className="text-emerald-400 animate-pulse" />}
              <span>{isLiveAudioMuted ? "Tắt tiếng" : "Có tiếng"}</span>
            </button>
          )}
        </div>
        
      </div>

      {/* 3. Main Video Area */}
      <div className={`flex-1 relative overflow-hidden flex items-center justify-center ${isDarkMode ? 'bg-[#0f0f13]' : 'bg-white'}`}>
        
        {renderCharacterContent()}

        {/* Ẩn AIAudioPlayer đi, chỉ dùng nó để quản lý logic giọng nói ngầm */}
        <div className="hidden">
          <AIAudioPlayer 
            ref={audioPlayerRef} 
            isLive={isConnected || showSimulator} 
            currentVideoUrl={(isConnected || showSimulator) && activeVideoItem ? activeVideoItem.mediaUrl : null}
            onActionTriggered={(e) => {
              if (e.type === 'LIPSYNC_READY') handleActionVideoReady(e.videoUrl, true);
              if (e.type === 'LIPSYNC_ENDED') setLipSyncVideoUrl(null);
            }} 
          />
        </div>

        {/* Cửa sổ nổi hiển thị Webcam từ Studio (Draggable & Resizable) */}
        {isWebcamActive && (
          <div 
            className="absolute rounded-lg overflow-hidden shadow-2xl border-[2px] border-green-500 bg-black z-30 group"
            style={{ 
              left: webcamPos.x, 
              top: webcamPos.y, 
              width: '200px', 
              minWidth: '150px',
              minHeight: '100px',
              aspectRatio: '16/9',
              resize: 'both',
              position: 'absolute'
            }}
          >
            {/* Thanh tiêu đề để kéo thả */}
            <div 
              onMouseDown={handleDragStart}
              className={`w-full h-6 bg-gradient-to-r from-gray-800 to-gray-900 cursor-move flex items-center justify-between px-2 ${isDraggingWebcam ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity absolute top-0 left-0 z-40`}
            >
              <span className="text-white text-[10px] font-medium flex items-center gap-1 pointer-events-none">
                <Video size={10} />
                Studio
              </span>
              <button onClick={toggleWebcam} className="text-gray-300 hover:text-white p-0.5 hover:bg-red-500 rounded">
                <X size={12} />
              </button>
            </div>

            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover pointer-events-none" 
            />
          </div>
        )}

        {/* Cửa sổ Nổi: Công cụ Giả lập Live (Pre-Live Simulator) */}
        {showSimulator && (
          <div className={`absolute right-6 top-4 w-[420px] max-h-[90vh] flex flex-col rounded-2xl shadow-2xl z-40 animate-in fade-in slide-in-from-right-4 overflow-hidden backdrop-blur-md border ${
            isDarkMode ? 'bg-[#16161e] border-purple-500/40 text-white' : 'bg-white border-purple-300 text-slate-800'
          }`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-4 py-3 border-b ${
              isDarkMode ? 'bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border-purple-500/30 text-white' : 'bg-purple-50 border-purple-200 text-purple-900'
            }`}>
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg border ${isDarkMode ? 'bg-purple-500/20 border-purple-400/30 text-purple-300' : 'bg-purple-100 border-purple-300 text-purple-700'}`}>
                  <Brain size={16} />
                </div>
                <div>
                  <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${isDarkMode ? 'text-white' : 'text-purple-950'}`}>
                    Công cụ Giả lập Live
                  </h3>
                  <p className={`text-[10px] ${isDarkMode ? 'text-purple-200/70' : 'text-purple-700/80'}`}>Test phản hồi AI, âm thanh & video trước khi Live</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Nút bật tắt Auto Simulate */}
                <button
                  onClick={() => setAutoSimActive(!autoSimActive)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all border ${
                    autoSimActive 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/20 animate-pulse' 
                      : (isDarkMode ? 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10' : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200')
                  }`}
                  title="Tự động phát sinh người vào, bình luận, tặng quà mỗi 9s"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${autoSimActive ? 'bg-emerald-400' : 'bg-gray-500'}`}></span>
                  Auto Test: {autoSimActive ? 'BẬT' : 'TẮT'}
                </button>
                <button onClick={() => setShowSimulator(false)} className={`p-1 rounded-lg transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-slate-900 hover:bg-slate-100'}`}>
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className={`flex border-b p-1 gap-1 text-[11px] font-semibold ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
              <button
                onClick={() => setSimTab('quick')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all flex items-center justify-center gap-1 ${
                  simTab === 'quick' ? 'bg-purple-600 text-white shadow-md' : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-slate-600 hover:text-slate-900')
                }`}
              >
                <Zap size={12} /> Tương tác
              </button>
              <button
                onClick={() => setSimTab('comments')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all flex items-center justify-center gap-1 ${
                  simTab === 'comments' ? 'bg-purple-600 text-white shadow-md' : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-slate-600 hover:text-slate-900')
                }`}
              >
                <MessageCircle size={12} /> Bình luận
              </button>
              <button
                onClick={() => setSimTab('orders')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all flex items-center justify-center gap-1 ${
                  simTab === 'orders' ? 'bg-purple-600 text-white shadow-md' : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-slate-600 hover:text-slate-900')
                }`}
              >
                <ShoppingBag size={12} /> Chốt đơn
              </button>
              <button
                onClick={() => setSimTab('director')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all flex items-center justify-center gap-1 ${
                  simTab === 'director' ? 'bg-purple-600 text-white shadow-md' : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-slate-600 hover:text-slate-900')
                }`}
              >
                <Mic size={12} /> Đạo diễn
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-3 space-y-3 overflow-y-auto max-h-[300px]">
              {/* TAB 1: TƯƠNG TÁC (Khán giả, Quà, Thả tim, Follow) */}
              {simTab === 'quick' && (
                <div className="space-y-2.5">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      <Users size={11} className="text-blue-500" /> Khán giả vào phòng:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button 
                        onClick={() => handleLiveEvent('VIEWER_JOIN', { name: 'Thanh Nhàn' })}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all text-center truncate border ${isDarkMode ? 'bg-blue-500/10 hover:bg-blue-500/25 text-blue-300 border-blue-500/30' : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'}`}
                      >
                        👋 Khách mới vào
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('VIEWER_JOIN', { name: 'Vip_HoàngNam 👑' })}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all text-center truncate border ${isDarkMode ? 'bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-300 border-indigo-500/30' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'}`}
                      >
                        ⭐ VIP vào phòng
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('VIEWER_JOIN', { name: 'Bảo Trâm ❤️' })}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all text-center truncate border ${isDarkMode ? 'bg-pink-500/10 hover:bg-pink-500/25 text-pink-300 border-pink-500/30' : 'bg-pink-50 hover:bg-pink-100 text-pink-700 border-pink-200'}`}
                      >
                        ❤️ Fan cứng vào
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      <Gift size={11} className="text-amber-500" /> Tặng quà TikTok:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button 
                        onClick={() => handleLiveEvent('GIFT', { name: 'Anh Tuấn', gift: 'Hoa Hồng', count: 1 })}
                        className={`py-1.5 bg-amber-500/10 hover:bg-amber-500/25 text-amber-500 border border-amber-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate`}
                      >
                        🌹 Hoa Hồng (1 xu)
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('GIFT', { name: 'Hoàng Long VIP', gift: 'Nước Hoa Thiết Giáp', count: 50 })}
                        className={`py-1.5 bg-purple-500/10 hover:bg-purple-500/25 text-purple-400 border border-purple-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate`}
                      >
                        🛡️ Thiết Giáp (50 xu)
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('GIFT', { name: 'Đại Gia Phố Núi', gift: 'Vương Miện Hoàng Kim', count: 200 })}
                        className={`py-1.5 bg-yellow-500/10 hover:bg-yellow-500/25 text-yellow-500 border border-yellow-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate`}
                      >
                        👑 Thần Tướng (200 xu)
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('GIFT', { name: 'Thần Kiếm', gift: 'Kiếm Sấm Sét', count: 500 })}
                        className={`py-1.5 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate`}
                      >
                        ⚔️ Vạn Kiếm (500 xu)
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('GIFT', { name: 'Chủ Tịch Tập Đoàn', gift: 'Thần Long Vũ Trụ', count: 1000 })}
                        className={`col-span-2 py-1.5 bg-red-500/15 hover:bg-red-500/30 text-red-400 border border-red-500/40 rounded-lg text-[10px] font-bold transition-all text-center truncate`}
                      >
                        🐉 Giáng Long Chưởng (1000 xu)
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      <Heart size={11} className="text-red-500" /> Tương tác kênh:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button 
                        onClick={() => handleLiveEvent('LIKE', { count: '10.000 tim' })}
                        className="py-1.5 bg-red-500/10 hover:bg-red-500/25 text-red-500 border border-red-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate"
                      >
                        💖 Đạt 10.000 Tim
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('FOLLOW', { name: 'Khánh Vy' })}
                        className="py-1.5 bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-500 border border-emerald-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate"
                      >
                        ➕ Follow kênh
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('SHARE', { name: 'Minh Trang' })}
                        className="py-1.5 bg-violet-500/10 hover:bg-violet-500/25 text-violet-500 border border-violet-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate"
                      >
                        ↗️ Chia sẻ live
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BÌNH LUẬN */}
              {simTab === 'comments' && (
                <div className="space-y-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>Bình luận mẫu thường gặp:</span>
                  <div className="space-y-1.5">
                    <button 
                      onClick={() => handleLiveEvent('COMMENT', { name: 'Minh Thảo', text: 'Chào idol, hôm nay xinh và dễ thương quá!' })}
                      className={`w-full text-left p-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between border ${isDarkMode ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/20' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'}`}
                    >
                      <span>💬 "Chào idol, hôm nay xinh và dễ thương quá!"</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-emerald-500/20 text-white' : 'bg-emerald-200 text-emerald-900'}`}>Khen</span>
                    </button>
                    <button 
                      onClick={() => handleLiveEvent('COMMENT', { name: 'Hải Đăng', text: 'Mẫu này chất liệu gì và còn size L không shop?' })}
                      className={`w-full text-left p-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between border ${isDarkMode ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border-blue-500/20' : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200'}`}
                    >
                      <span>🛒 "Mẫu này chất liệu gì và còn size L không shop?"</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-blue-500/20 text-white' : 'bg-blue-200 text-blue-900'}`}>Hỏi Size</span>
                    </button>
                    <button 
                      onClick={() => handleLiveEvent('COMMENT', { name: 'Quỳnh Như', text: 'Sản phẩm này giá bao nhiêu và có freeship không ạ?' })}
                      className={`w-full text-left p-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between border ${isDarkMode ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/20' : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'}`}
                    >
                      <span>💰 "Giá bao nhiêu và có freeship không ạ?"</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-amber-500/20 text-white' : 'bg-amber-200 text-amber-900'}`}>Hỏi Giá</span>
                    </button>
                    <button 
                      onClick={() => handleLiveEvent('COMMENT', { name: 'Bảo Long', text: 'Mình 1m70 nặng 65kg mặc size nào vừa chuẩn bạn ơi?' })}
                      className={`w-full text-left p-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between border ${isDarkMode ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/20' : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-200'}`}
                    >
                      <span>📏 "Mình 1m70 nặng 65kg mặc size nào chuẩn?"</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-purple-500/20 text-white' : 'bg-purple-200 text-purple-900'}`}>Tư Vấn</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: CHỐT ĐƠN */}
              {simTab === 'orders' && (
                <div className="space-y-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>Sự kiện chốt đơn mua hàng:</span>
                  <div className="space-y-1.5">
                    <button 
                      onClick={() => handleLiveEvent('PURCHASE', { name: 'Hoàng Nam', item: '1 Áo Polo Cao Cấp' })}
                      className={`w-full text-left p-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between border ${isDarkMode ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'}`}
                    >
                      <span>🎉 Khách Hoàng Nam vừa chốt 1 Áo Polo</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-emerald-500/30 text-white' : 'bg-emerald-200 text-emerald-900'}`}>1 Đơn</span>
                    </button>
                    <button 
                      onClick={() => handleLiveEvent('PURCHASE', { name: 'Thanh Thảo VIP', item: 'Combo 2 Váy Thiết Kế Dạ Hội' })}
                      className={`w-full text-left p-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between border ${isDarkMode ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-200'}`}
                    >
                      <span>🎁 Khách Thanh Thảo vừa chốt Combo 2 Váy</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-purple-500/30 text-white' : 'bg-purple-200 text-purple-900'}`}>Combo VIP</span>
                    </button>
                    <button 
                      onClick={() => handleLiveEvent('PURCHASE', { name: 'Đoàn Khách Sỉ', item: 'Set 5 Áo Sơ Mi Hàn Quốc' })}
                      className={`w-full text-left p-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between border ${isDarkMode ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'}`}
                    >
                      <span>🔥 Khách Sỉ vừa chốt Set 5 Áo Sơ Mi</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-amber-500/30 text-white' : 'bg-amber-200 text-amber-900'}`}>Đơn Sỉ</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: ĐẠO DIỄN NHẮC THOẠI */}
              {simTab === 'director' && (
                <div className="space-y-2.5">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>Lệnh nhanh 1-chạm:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button 
                        onClick={() => handleLiveEvent('ASSISTANT_PROMPT', { prompt: 'Nhắc mọi người bấm vào giỏ hàng góc trái đang có ưu đãi lớn!' })}
                        className={`p-1.5 rounded-lg text-[10px] font-medium text-left truncate border ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'}`}
                      >
                        🛒 Giục xem giỏ hàng
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('ASSISTANT_PROMPT', { prompt: 'Nhắc voucher giảm 50k chỉ còn 3 suất duy nhất!' })}
                        className={`p-1.5 rounded-lg text-[10px] font-medium text-left truncate border ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'}`}
                      >
                        🔥 Nhắc mã còn 3 suất
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('ASSISTANT_PROMPT', { prompt: 'Cảm ơn toàn thể khán giả đang theo dõi và kêu gọi thả tim!' })}
                        className={`p-1.5 rounded-lg text-[10px] font-medium text-left truncate border ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'}`}
                      >
                        🙏 Cảm ơn khán giả
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('ASSISTANT_PROMPT', { prompt: 'Kể một câu chuyện vui hoặc hát một đoạn ngắn giao lưu!' })}
                        className={`p-1.5 rounded-lg text-[10px] font-medium text-left truncate border ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'}`}
                      >
                        🎶 Hát / Kể chuyện vui
                      </button>
                    </div>
                  </div>

                  <div className={`pt-2 border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                    <label className={`text-[10px] font-medium flex items-center gap-1 mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                      <Mic size={11} className="text-red-500" /> Nhập lệnh Đạo diễn bất kỳ:
                    </label>
                    <div className="flex gap-1.5">
                      <input 
                        type="text" 
                        value={assistantPrompt}
                        onChange={(e) => setAssistantPrompt(e.target.value)}
                        placeholder="VD: Nhắc idol giới thiệu áo sơ mi trắng..."
                        className={`flex-1 rounded-lg px-2.5 py-1.5 text-xs outline-none border ${isDarkMode ? 'bg-black/50 border-gray-700 text-white placeholder-gray-500 focus:border-red-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-red-500'}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && assistantPrompt.trim()) {
                            handleLiveEvent('ASSISTANT_PROMPT', { prompt: assistantPrompt.trim() });
                            setAssistantPrompt('');
                          }
                        }}
                      />
                      <button 
                        onClick={() => {
                          if (assistantPrompt.trim()) {
                            handleLiveEvent('ASSISTANT_PROMPT', { prompt: assistantPrompt.trim() });
                            setAssistantPrompt('');
                          }
                        }}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-red-600/30 flex items-center gap-1"
                      >
                        <Send size={11} /> Gửi
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Status processing indicator */}
              {isProcessingEvent && (
                <div className="flex items-center justify-center gap-2 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-500 text-[11px] font-semibold animate-pulse">
                  <Sparkles size={12} className="text-purple-500 animate-spin" /> AI đang suy nghĩ & chuẩn bị phản hồi...
                </div>
              )}
            </div>
            
            {/* Lịch sử sự kiện */}
            <div className={`border-t p-3 flex flex-col ${isDarkMode ? 'border-white/10 bg-black/30' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                  <List size={11} /> Lịch sử giả lập ({viewerHistory.length})
                </span>
                {viewerHistory.length > 0 && (
                  <button 
                    onClick={() => setViewerHistory([])}
                    className="text-[9px] text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 size={10} /> Xoá log
                  </button>
                )}
              </div>
              <div className="h-28 overflow-y-auto space-y-1.5 pr-1 text-[10px]">
                {viewerHistory.length === 0 ? (
                  <div className="text-gray-400 text-center py-4 italic text-[11px]">
                    Chưa có sự kiện nào. Hãy bấm một nút ở trên để thử nghiệm!
                  </div>
                ) : (
                  viewerHistory.slice().reverse().map((h, i) => (
                    <div key={i} className="bg-black/50 p-2 rounded-lg border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-gray-400">
                        <span className="font-semibold text-white">
                          [{h.time}] {h.payload?.name || 'Hệ thống'}: {h.type === 'COMMENT' ? `"${h.payload.text}"` : h.type === 'GIFT' ? `tặng ${h.payload.gift}` : h.type === 'PURCHASE' ? `đã mua ${h.payload.item}` : h.type === 'LIKE' ? 'thả tim' : h.type === 'FOLLOW' ? 'theo dõi' : h.type === 'ASSISTANT_PROMPT' ? `[Lệnh Đạo diễn]: ${h.payload.prompt}` : 'vào phòng live'}
                        </span>
                      </div>
                      {h.ai_reply && (
                        <div className="text-[#00FF66] pl-2 border-l-2 border-[#00FF66]/40 leading-relaxed font-medium">
                          ↳ AI: {h.ai_reply}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* General Settings Modal */}
      {activeSettingsModal === 'general' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
          <div className={`w-[900px] h-[700px] flex flex-col rounded-lg overflow-hidden shadow-2xl border bg-[#f0f2f5] border-gray-300`}>
            <div className={`flex items-center justify-between px-4 py-2 border-b bg-gray-200 border-gray-300`}>
              <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Settings size={14} className="text-gray-600" />
                Cấu hình AI, Giọng nói & API
              </h2>
              <button 
                onClick={() => setActiveSettingsModal(null)}
                className="hover:bg-gray-300 p-1 rounded transition-colors text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <GeneralSettings onClose={() => setActiveSettingsModal(null)} />
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal (WorkspaceTacVu / Event Manager) */}
      {activeSettingsModal === 'workspace' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className={`w-full max-w-6xl h-[95vh] flex flex-col rounded-xl overflow-hidden shadow-2xl border ${isDarkMode ? 'bg-[#141419] border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Settings className="text-blue-500" />
                Cài đặt Hệ thống Sự kiện Livestream
              </h2>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => alert("Đang kiểm tra bản cập nhật từ Admin...")}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium"
                >
                  Kiểm tra cập nhật
                </button>
                <button 
                  onClick={() => setActiveSettingsModal(null)}
                  className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto relative">
              <WorkspaceTacVu />
            </div>
          </div>
        </div>
      )}

      {/* Payment & Token Packages Modal */}
      {(activeSettingsModal === 'payment' || activeSettingsModal === 'coins') && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="w-full max-w-5xl h-[92vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-[#0f0f1a] border border-gray-800 relative">
            <button 
              onClick={() => setActiveSettingsModal(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex-1 overflow-y-auto">
              <ThanhToanCoin 
                initialTab={activeSettingsModal === 'coins' ? 'tokens' : 'subscription'} 
                onClose={() => setActiveSettingsModal(null)} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Auto Captcha Solver 24/7 Modal */}
      {activeSettingsModal === 'captcha' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-200">
          <div className="w-full max-w-5xl h-[92vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-[#0b0f19] border border-emerald-500/30 relative">
            <div className="flex items-center justify-between px-5 py-3 border-b border-emerald-500/20 bg-emerald-950/40">
              <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                <Shield size={18} className="text-emerald-400 animate-pulse" />
                <span>HỆ THỐNG VƯỢT CAPTCHA TỰ ĐỘNG 24/7 (AI CAPTCHA SOLVER)</span>
              </div>
              <button 
                onClick={() => setActiveSettingsModal(null)}
                className="p-1.5 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
                title="Đóng"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <AutoCaptchaSolver onClose={() => setActiveSettingsModal(null)} />
            </div>
          </div>
        </div>
      )}

      {/* Token History Modal */}
      {showTokenHistory && (
        <TokenHistoryModal 
          onClose={() => setShowTokenHistory(false)} 
          onOpenPayment={() => setActiveSettingsModal('coins')}
        />
      )}

      {/* ---------------- MONITOR MODALS ---------------- */}
      {activeMonitorModal === 'timeline' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className={`rounded-xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col border ${isDarkMode ? 'bg-[#1c1c24] text-white border-gray-700' : 'bg-white text-slate-800 border-slate-300'}`}>
            <div className={`flex items-center justify-between px-4 py-2.5 border-b ${isDarkMode ? 'border-gray-700 bg-[#252532]' : 'border-slate-200 bg-slate-100'}`}>
              <h2 className="text-sm font-bold flex items-center gap-2"><Clock size={16} className="text-blue-500" /> Dòng thời gian Sự kiện & Phản ứng</h2>
              <button onClick={() => setActiveMonitorModal(null)} className={`p-1 rounded transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-slate-200 text-gray-600'}`}><X size={16} /></button>
            </div>
            <div className={`flex-1 overflow-auto ${isDarkMode ? 'bg-[#16161e]' : 'bg-white'}`}>
              <table className="w-full text-sm text-left">
                <thead className={`font-semibold border-b sticky top-0 ${isDarkMode ? 'bg-[#252532] text-gray-300 border-gray-700' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                  <tr>
                    <th className="px-4 py-2 w-32 text-center text-red-400">Thời gian</th>
                    <th className="px-4 py-2 w-48 text-red-400">Tên Sự kiện</th>
                    <th className="px-4 py-2 w-1/3 text-red-400">Nội dung Sự kiện</th>
                    <th className="px-4 py-2 text-red-400">Phản ứng của AI</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-gray-800 text-gray-300' : 'divide-slate-200 text-slate-700'}`}>
                  {viewerHistory.slice().reverse().map((h, i) => (
                    <tr key={i} className={isDarkMode ? 'hover:bg-white/5 transition-colors' : 'hover:bg-blue-50 transition-colors'}>
                      <td className="px-4 py-2 text-center opacity-70">{h.time}</td>
                      <td className="px-4 py-2 font-medium">{h.type === 'COMMENT' ? 'Bình luận' : h.type === 'GIFT' ? 'Tặng quà' : 'Vào phòng'}</td>
                      <td className="px-4 py-2">{h.type === 'COMMENT' ? h.payload.text : h.type === 'GIFT' ? h.payload.gift : h.payload.name}</td>
                      <td className="px-4 py-2 text-emerald-500 font-medium">{h.ai_reply || ''}</td>
                    </tr>
                  ))}
                  {viewerHistory.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-gray-500">Chưa có sự kiện nào trong phiên live này.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className={`px-4 py-2.5 border-t flex justify-center ${isDarkMode ? 'bg-[#252532] border-gray-700' : 'bg-slate-100 border-slate-200'}`}>
              <button onClick={exportTimelineCSV} className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-medium transition-colors shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-white' : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'}`}>
                <Download size={14} className="text-purple-500" /> Xuất ra file CSV...
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Phản hồi Nhanh Trực Tiếp Trên Live */}
      <QuickResponseModal 
        isOpen={activeMonitorModal === 'quick_response'}
        onClose={() => setActiveMonitorModal(null)}
        isDarkMode={isDarkMode}
        isConnected={isConnected || showSimulator}
        audioPlayerRef={audioPlayerRef}
        handleLiveEvent={handleLiveEvent}
        onPlayLiveVideo={(videoData) => {
          setQuickResponseActiveVideo(videoData);
        }}
        onStopLiveVideo={() => {
          setQuickResponseActiveVideo(null);
        }}
        activeQuickVideo={quickResponseActiveVideo}
        showToast={showToast}
        addViewerHistory={(item) => {
          if (setViewerHistory) {
            setViewerHistory(prev => [...prev, item].slice(-10));
          }
        }}
      />

      {activeMonitorModal === 'queue' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className={`rounded-xl shadow-2xl w-[600px] h-[400px] flex flex-col border ${isDarkMode ? 'bg-[#1c1c24] text-white border-gray-700' : 'bg-white text-slate-800 border-slate-300'}`}>
            <div className={`flex items-center justify-between px-4 py-2.5 border-b ${isDarkMode ? 'border-gray-700 bg-[#252532]' : 'border-slate-200 bg-slate-100'}`}>
              <h2 className="text-sm font-bold flex items-center gap-2">
                <List size={16} className="text-blue-500" /> Giám sát Hàng đợi
              </h2>
              <button onClick={() => setActiveMonitorModal(null)} className={`p-1 rounded transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-slate-200 text-gray-600'}`}><X size={16} /></button>
            </div>
            <div className={`flex-1 overflow-auto p-4 ${isDarkMode ? 'bg-[#16161e]' : 'bg-white'}`}>
              <h3 className="text-xs font-semibold opacity-60 mb-3 uppercase">Đang xử lý / Chờ AI</h3>
              {isProcessingEvent ? (
                <div className={`p-3 border rounded-lg flex items-center gap-3 animate-pulse ${isDarkMode ? 'bg-blue-950/40 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-bold text-blue-500">Sự kiện gần nhất</div>
                    <div className="text-xs text-blue-400">Đang sinh phản hồi AI...</div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic">Hàng đợi đang trống.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeMonitorModal === 'sys_log' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className={`rounded-xl shadow-2xl w-[800px] h-[500px] flex flex-col border ${isDarkMode ? 'bg-[#1c1c24] text-white border-gray-700' : 'bg-white text-slate-800 border-slate-300'}`}>
            <div className={`flex items-center justify-between px-4 py-2.5 border-b ${isDarkMode ? 'border-gray-700 bg-[#252532]' : 'border-slate-200 bg-slate-100'}`}>
              <h2 className="text-sm font-bold flex items-center gap-2">
                <AlertCircle size={16} className="text-orange-500" /> Log Hệ thống Lỗi
              </h2>
              <button onClick={() => setActiveMonitorModal(null)} className={`p-1 rounded transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-slate-200 text-gray-600'}`}><X size={16} /></button>
            </div>
            <div className={`flex-1 overflow-auto p-4 text-sm ${isDarkMode ? 'bg-[#16161e]' : 'bg-white'}`}>
              {systemLogs.length === 0 ? (
                <div className="text-gray-500 italic flex items-center justify-center h-full">Hệ thống đang hoạt động ổn định. Chưa ghi nhận lỗi nào.</div>
              ) : (
                systemLogs.map((log, idx) => (
                  <div key={idx} className="mb-2 p-2 bg-red-500/10 border border-red-500/30 rounded">
                    <span className="opacity-70 text-xs font-mono">[{log.time}]</span> <span className="font-bold text-red-500">ERROR:</span> <span className="text-red-400">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeMonitorModal === 'tiktok_log' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className={`rounded-xl shadow-2xl w-[800px] h-[500px] flex flex-col border ${isDarkMode ? 'bg-[#1c1c24] text-white border-gray-700' : 'bg-white text-slate-800 border-slate-300'}`}>
            <div className={`flex items-center justify-between px-4 py-2.5 border-b ${isDarkMode ? 'border-gray-700 bg-[#252532]' : 'border-slate-200 bg-slate-100'}`}>
              <h2 className="text-sm font-bold flex items-center gap-2">
                <FileText size={16} className="text-pink-500" /> Log Sự kiện TikTok
              </h2>
              <button onClick={() => setActiveMonitorModal(null)} className={`p-1 rounded transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-slate-200 text-gray-600'}`}><X size={16} /></button>
            </div>
            <div className={`flex-1 overflow-auto p-4 text-sm ${isDarkMode ? 'bg-[#16161e]' : 'bg-white'}`}>
              {tiktokLogs.length === 0 ? (
                <div className="text-gray-500 italic flex items-center justify-center h-full">Đang chờ sự kiện thô từ TikTok...</div>
              ) : (
                tiktokLogs.map((log, idx) => (
                  <div key={idx} className={`mb-3 border rounded-lg p-2.5 ${isDarkMode ? 'border-gray-800 bg-gray-900/60' : 'border-slate-200 bg-slate-50'}`}>
                    <div className="text-blue-500 font-bold mb-1 border-b border-gray-500/20 pb-1">[{log.time}] {log.type}</div>
                    <pre className="opacity-80 overflow-x-auto font-mono text-xs">{JSON.stringify(log.payload, null, 2)}</pre>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Template Library Modal */}
      <TemplateLibraryModal 
        isOpen={isTemplateLibraryOpen}
        onClose={() => setIsTemplateLibraryOpen(false)}
        onAddTemplate={(newChar) => {
          setCustomCharacters(prev => [...prev, newChar]);
          setSelectedCharacter(newChar.id);
        }}
      />

      {/* Game Chiến Đấu Admin Control Modal */}
      <GameChienDauAdminModal
        isOpen={isGameAdminOpen}
        onClose={() => setIsGameAdminOpen(false)}
        onTriggerRefereeAction={(action) => {
          const names = ['Hoàng Long', 'Bảo Trâm', 'Tuấn Kiệt', 'Minh Quân', 'Khánh Linh', 'Hồng Hạnh', 'Trần Mai', 'Gia Bảo', 'Phương Thảo', 'Quang Huy', 'Thành Đạt', 'Ngọc Ánh'];
          const randName = names[Math.floor(Math.random() * names.length)];
          const t = Date.now() + Math.random();

          if (action === 'RESET_MATCH') {
            setLastGameEvent({ type: 'ADMIN_RESET', data: {}, timestamp: t });
          } else if (action === 'ADD_BLUE_20') {
            setLastGameEvent({ type: 'COMMENT', data: { nickname: randName, comment: 'xanh', score: 20 }, timestamp: t });
          } else if (action === 'ADD_RED_20') {
            setLastGameEvent({ type: 'COMMENT', data: { nickname: randName, comment: 'đỏ', score: 20 }, timestamp: t });
          } else if (action === 'ADD_BLUE_50') {
            setLastGameEvent({ type: 'ADD_TROOPS', data: { faction: 'blue', count: 50, rankTier: 1 }, timestamp: t });
          } else if (action === 'ADD_RED_50') {
            setLastGameEvent({ type: 'ADD_TROOPS', data: { faction: 'red', count: 50, rankTier: 1 }, timestamp: t });
          } else if (action === 'ADD_BLUE_100') {
            setLastGameEvent({ type: 'ADD_TROOPS', data: { faction: 'blue', count: 100, rankTier: 2 }, timestamp: t });
          } else if (action === 'ADD_RED_100') {
            setLastGameEvent({ type: 'ADD_TROOPS', data: { faction: 'red', count: 100, rankTier: 2 }, timestamp: t });
          } else if (action === 'TRIGGER_LUC_MACH_BLUE') {
            setLastGameEvent({ type: 'TRIGGER_LUC_MACH', data: { nickname: randName, faction: 'blue' }, timestamp: t });
          } else if (action === 'TRIGGER_LUC_MACH_RED') {
            setLastGameEvent({ type: 'TRIGGER_LUC_MACH', data: { nickname: randName, faction: 'red' }, timestamp: t });
          } else if (action === 'TRIGGER_DOC_CO_BLUE') {
            setLastGameEvent({ type: 'TRIGGER_DOC_CO', data: { nickname: randName, faction: 'blue' }, timestamp: t });
          } else if (action === 'TRIGGER_DOC_CO_RED') {
            setLastGameEvent({ type: 'TRIGGER_DOC_CO', data: { nickname: randName, faction: 'red' }, timestamp: t });
          } else if (action === 'TRIGGER_NHU_LAI_BLUE') {
            setLastGameEvent({ type: 'TRIGGER_NHU_LAI', data: { nickname: randName, faction: 'blue' }, timestamp: t });
          } else if (action === 'TRIGGER_NHU_LAI_RED') {
            setLastGameEvent({ type: 'TRIGGER_NHU_LAI', data: { nickname: randName, faction: 'red' }, timestamp: t });
          } else if (action === 'TRIGGER_THIEN_NGOAI_BLUE') {
            setLastGameEvent({ type: 'TRIGGER_THIEN_NGOAI', data: { nickname: randName, faction: 'blue' }, timestamp: t });
          } else if (action === 'TRIGGER_THIEN_NGOAI_RED') {
            setLastGameEvent({ type: 'TRIGGER_THIEN_NGOAI', data: { nickname: randName, faction: 'red' }, timestamp: t });
          } else if (action === 'TRIGGER_KIM_CANG_BLUE') {
            setLastGameEvent({ type: 'TRIGGER_KIM_CANG', data: { nickname: randName, faction: 'blue' }, timestamp: t });
          } else if (action === 'TRIGGER_KIM_CANG_RED') {
            setLastGameEvent({ type: 'TRIGGER_KIM_CANG', data: { nickname: randName, faction: 'red' }, timestamp: t });
          } else if (action === 'TRIGGER_VAN_KIEM_BLUE') {
            setLastGameEvent({ type: 'TRIGGER_VAN_KIEM', data: { nickname: randName, faction: 'blue' }, timestamp: t });
          } else if (action === 'TRIGGER_VAN_KIEM_RED') {
            setLastGameEvent({ type: 'TRIGGER_VAN_KIEM', data: { nickname: randName, faction: 'red' }, timestamp: t });
          } else if (action === 'TRIGGER_GIANG_LONG_BLUE') {
            setLastGameEvent({ type: 'TRIGGER_GIANG_LONG', data: { nickname: randName, faction: 'blue' }, timestamp: t });
          } else if (action === 'TRIGGER_GIANG_LONG_RED') {
            setLastGameEvent({ type: 'TRIGGER_GIANG_LONG', data: { nickname: randName, faction: 'red' }, timestamp: t });
          } else if (action === 'TRIGGER_THAI_CUC_BLUE') {
            setLastGameEvent({ type: 'TRIGGER_THAI_CUC', data: { nickname: randName, faction: 'blue' }, timestamp: t });
          } else if (action === 'TRIGGER_THAI_CUC_RED') {
            setLastGameEvent({ type: 'TRIGGER_THAI_CUC', data: { nickname: randName, faction: 'red' }, timestamp: t });
          } else if (action === 'TEST_TIER_1_BLUE') {
            setLastGameEvent({ type: 'UPGRADE_HERO', data: { nickname: randName, faction: 'blue', tier: 1 }, timestamp: t });
          } else if (action === 'TEST_TIER_1_RED') {
            setLastGameEvent({ type: 'UPGRADE_HERO', data: { nickname: randName, faction: 'red', tier: 1 }, timestamp: t });
          } else if (action === 'TEST_TIER_2_BLUE') {
            setLastGameEvent({ type: 'UPGRADE_HERO', data: { nickname: randName, faction: 'blue', tier: 2 }, timestamp: t });
          } else if (action === 'TEST_TIER_2_RED') {
            setLastGameEvent({ type: 'UPGRADE_HERO', data: { nickname: randName, faction: 'red', tier: 2 }, timestamp: t });
          } else if (action === 'TEST_TIER_3_BLUE' || action === 'UPGRADE_HERO_BLUE') {
            setLastGameEvent({ type: 'UPGRADE_HERO', data: { nickname: randName, faction: 'blue', tier: 3 }, timestamp: t });
          } else if (action === 'TEST_TIER_3_RED' || action === 'UPGRADE_HERO_RED') {
            setLastGameEvent({ type: 'UPGRADE_HERO', data: { nickname: randName, faction: 'red', tier: 3 }, timestamp: t });
          } else if (action === 'TEST_TIER_4_BLUE') {
            setLastGameEvent({ type: 'UPGRADE_HERO', data: { nickname: randName, faction: 'blue', tier: 4 }, timestamp: t });
          } else if (action === 'TEST_TIER_4_RED') {
            setLastGameEvent({ type: 'UPGRADE_HERO', data: { nickname: randName, faction: 'red', tier: 4 }, timestamp: t });
          } else if (action === 'TEST_TIER_5_BLUE') {
            setLastGameEvent({ type: 'UPGRADE_HERO', data: { nickname: randName, faction: 'blue', tier: 5 }, timestamp: t });
          } else if (action === 'TEST_TIER_5_RED') {
            setLastGameEvent({ type: 'UPGRADE_HERO', data: { nickname: randName, faction: 'red', tier: 5 }, timestamp: t });
          } else if (action === 'TRIGGER_AOE_BLUE') {
            setLastGameEvent({ type: 'GIFT', data: { nickname: randName, diamondCount: 300, faction: 'blue' }, timestamp: t });
          } else if (action === 'TRIGGER_AOE_RED') {
            setLastGameEvent({ type: 'GIFT', data: { nickname: randName, diamondCount: 300, faction: 'red' }, timestamp: t });
          } else if (action === 'SUMMON_BOSS_BLUE') {
            setLastGameEvent({ type: 'GIFT', data: { nickname: randName, diamondCount: 1500, faction: 'blue' }, timestamp: t });
          } else if (action === 'SUMMON_BOSS_RED') {
            setLastGameEvent({ type: 'GIFT', data: { nickname: randName, diamondCount: 1500, faction: 'red' }, timestamp: t });
          } else if (action === 'TRIGGER_DANCE_BLUE') {
            setLastGameEvent({ type: 'DANCE', data: { nickname: randName, faction: 'blue' }, timestamp: t });
          } else if (action === 'TRIGGER_DANCE_RED') {
            setLastGameEvent({ type: 'DANCE', data: { nickname: randName, faction: 'red' }, timestamp: t });
          } else if (action === 'TOGGLE_PAUSE') {
            setLastGameEvent({ type: 'PAUSE_TOGGLE', data: {}, timestamp: t });
          } else if (action === 'FINISH_MATCH_BLUE') {
            setLastGameEvent({ type: 'FORCE_WIN', data: { faction: 'blue' }, timestamp: t });
          } else if (action === 'FINISH_MATCH_RED') {
            setLastGameEvent({ type: 'FORCE_WIN', data: { faction: 'red' }, timestamp: t });
          }
        }}
      />

      {/* Game Ghép Cờ Bản Đồ Admin Control Modal */}
      <GameBanDoAdminModal
        isOpen={isGameBanDoAdminOpen}
        onClose={() => setIsGameBanDoAdminOpen(false)}
      />

      {/* Modal Hướng Dẫn & Sao Chép Link Overlay TikTok LIVE Studio / OBS Studio */}
      {showOverlayModal && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#181822] border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-cyan-950 via-teal-950 to-[#181822] border-b border-cyan-500/30">
              <div className="flex items-center gap-2">
                <Radio className="text-cyan-400 animate-pulse" size={18} />
                <h3 className="text-sm font-black text-white uppercase tracking-wide">
                  Tích Hợp TikTok LIVE Studio & OBS Studio Realtime
                </h3>
              </div>
              <button
                onClick={() => setShowOverlayModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body Content */}
            <div className="p-4 overflow-y-auto space-y-4 text-xs text-gray-200 custom-scrollbar">
              
              {/* Nút chọn Nền Tảng: Local 127.0.0.1 vs Web Cloud Vercel */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-gray-900/80 border border-cyan-500/40">
                <span className="font-bold text-gray-300 text-xs pl-2">Chọn nguồn đường link bạn đang dùng:</span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setOverlayLinkBase('http://127.0.0.1:5173')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${overlayLinkBase === 'http://127.0.0.1:5173' ? 'bg-cyan-600 text-white shadow-md' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                  >
                    ⚡ Local (127.0.0.1)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOverlayLinkBase('https://avalivepro.vercel.app')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${overlayLinkBase === 'https://avalivepro.vercel.app' ? 'bg-purple-600 text-white shadow-md' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                  >
                    🌐 Web Cloud (Vercel)
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200">
                <div className="font-bold flex items-center gap-1.5 mb-1 text-yellow-300">
                  <Sparkles size={14} className="text-yellow-400 animate-spin" />
                  <span>Đồng Bộ Siêu Tốc 0.00001s:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-gray-300">
                  Chỉ cần dán đường link vào mục <strong>Browser Source (Trình duyệt)</strong> trên TikTok LIVE Studio hoặc OBS Studio. Khi bạn thao tác đổi nhân vật Idol, mở Game Bản Đồ hay Game Chiến Đấu, âm thanh và quà tặng sẽ <strong>tự động đồng bộ thời gian thực</strong> lên phiên live!
                </p>
              </div>

              {/* 1. LINK MASTER ĐỒNG BỘ TOÀN NĂNG (Khuyên Dùng) */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-950/60 to-cyan-950/60 border border-cyan-400/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-cyan-300 text-xs flex items-center gap-1.5">
                    <span>⭐ LINK LIVE TOÀN NĂNG (TỰ ĐỘNG CHUYỂN CẢNH REALTIME)</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold animate-pulse">
                    Khuyên Dùng
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={`${overlayLinkBase}/overlay-live`}
                    className="flex-1 bg-black/60 border border-cyan-500/30 rounded-lg px-3 py-1.5 text-cyan-200 font-mono text-[11px] select-all outline-none"
                  />
                  <button
                    onClick={() => {
                      if (typeof navigator !== 'undefined') {
                        navigator.clipboard.writeText(`${overlayLinkBase}/overlay-live`);
                        setCopySuccessMsg('Đã sao chép Link Toàn Năng!');
                        setTimeout(() => setCopySuccessMsg(''), 3000);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors shrink-0 flex items-center gap-1 shadow-md"
                  >
                    <span>{copySuccessMsg === 'Đã sao chép Link Toàn Năng!' ? '✅ Đã Chép' : 'Sao Chép'}</span>
                  </button>
                  <button
                    onClick={() => window.open(`${overlayLinkBase}/overlay-live`, '_blank')}
                    className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 font-bold text-xs transition-colors shrink-0"
                    title="Mở tab mới xem thử"
                  >
                    Xem Thử
                  </button>
                </div>
                <p className="text-[10px] text-gray-400">
                  Tự động chuyển giữa AI Idol, Game Bản Đồ và Game Chiến Đấu theo đúng màn hình đang chạy trong phần mềm.
                </p>
              </div>

              {/* 2. CÁC LINK CHUYÊN BIỆT */}
              <div className="space-y-2.5">
                <div className="text-[11px] font-bold text-gray-300 uppercase tracking-wide">
                  Hoặc Sao Chép Link Chuyên Biệt Theo Từng Nhu Cầu:
                </div>

                {/* Link Live AI Idol */}
                <div className="p-2.5 rounded-xl bg-pink-950/30 border border-pink-500/30 flex items-center justify-between gap-2">
                  <div className="truncate flex-1">
                    <div className="font-bold text-pink-300 text-[11px] flex items-center gap-1">
                      <Video size={12} className="text-pink-400" />
                      <span>1. Live AI Idol (Idol Ảo Livestream 24/7)</span>
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono truncate">
                      {`${overlayLinkBase}/overlay-idol`}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        if (typeof navigator !== 'undefined') {
                          navigator.clipboard.writeText(`${overlayLinkBase}/overlay-idol`);
                          setCopySuccessMsg('Đã sao chép Link Live AI Idol!');
                          setTimeout(() => setCopySuccessMsg(''), 3000);
                        }
                      }}
                      className="px-3 py-1 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-bold text-[11px] transition-colors shadow-sm"
                    >
                      <span>{copySuccessMsg === 'Đã sao chép Link Live AI Idol!' ? '✅ Đã Chép' : 'Sao Chép'}</span>
                    </button>
                    <button
                      onClick={() => window.open(`${overlayLinkBase}/overlay-idol`, '_blank')}
                      className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 font-bold text-[10px]"
                      title="Xem thử tab mới"
                    >
                      Xem
                    </button>
                  </div>
                </div>

                {/* Link Bản Đồ Chuẩn */}
                <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/30 flex items-center justify-between gap-2">
                  <div className="truncate flex-1">
                    <div className="font-bold text-amber-300 text-[11px] flex items-center gap-1">
                      <Flag size={12} className="text-red-400" />
                      <span>2. Game Bản Đồ Cắm Cờ (Chuẩn Đầy Đủ)</span>
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono truncate">
                      {`${overlayLinkBase}/overlay-bando`}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        if (typeof navigator !== 'undefined') {
                          navigator.clipboard.writeText(`${overlayLinkBase}/overlay-bando`);
                          setCopySuccessMsg('Đã sao chép Link Bản Đồ!');
                          setTimeout(() => setCopySuccessMsg(''), 3000);
                        }
                      }}
                      className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] transition-colors"
                    >
                      <span>{copySuccessMsg === 'Đã sao chép Link Bản Đồ!' ? '✅ Đã Chép' : 'Sao Chép'}</span>
                    </button>
                    <button
                      onClick={() => window.open(`${overlayLinkBase}/overlay-bando`, '_blank')}
                      className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 font-bold text-[10px]"
                      title="Xem thử tab mới"
                    >
                      Xem
                    </button>
                  </div>
                </div>

                {/* Link Bản Đồ Nguồn Siêu Sạch (Lồng Góc / Ultra Clean) */}
                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between gap-2">
                  <div className="truncate flex-1">
                    <div className="font-bold text-emerald-300 text-[11px] flex items-center gap-1">
                      <Sparkles size={12} className="text-yellow-400 animate-spin" />
                      <span>3. Game Bản Đồ (✨ Nguồn Sạch Lồng Góc / Ultra Clean)</span>
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono truncate">
                      {`${overlayLinkBase}/overlay-bando-clean`}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        if (typeof navigator !== 'undefined') {
                          navigator.clipboard.writeText(`${overlayLinkBase}/overlay-bando-clean`);
                          setCopySuccessMsg('Đã sao chép Link Bản Đồ Siêu Sạch!');
                          setTimeout(() => setCopySuccessMsg(''), 3000);
                        }
                      }}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors shadow-sm"
                    >
                      <span>{copySuccessMsg === 'Đã sao chép Link Bản Đồ Siêu Sạch!' ? '✅ Đã Chép' : 'Sao Chép'}</span>
                    </button>
                    <button
                      onClick={() => window.open(`${window.location.origin}/?overlay=bando&clean=true&ratio=${globalAspectRatio}`, '_blank')}
                      className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 font-bold text-[10px]"
                      title="Xem thử tab mới"
                    >
                      Xem
                    </button>
                  </div>
                </div>

                {/* Link Chiến Đấu PK */}
                <div className="p-2.5 rounded-xl bg-black/40 border border-purple-500/30 flex items-center justify-between gap-2">
                  <div className="truncate flex-1">
                    <div className="font-bold text-purple-300 text-[11px] flex items-center gap-1">
                      <Swords size={12} className="text-yellow-400" />
                      <span>4. Game Đại Chiến PK TikTok</span>
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono truncate">
                      {`${overlayLinkBase}/?overlay=gamebattle`}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        if (typeof navigator !== 'undefined') {
                          navigator.clipboard.writeText(`${overlayLinkBase}/?overlay=gamebattle`);
                          setCopySuccessMsg('Đã sao chép Link Chiến Đấu!');
                          setTimeout(() => setCopySuccessMsg(''), 3000);
                        }
                      }}
                      className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] transition-colors shadow-sm"
                    >
                      <span>{copySuccessMsg === 'Đã sao chép Link Chiến Đấu!' ? '✅ Đã Chép' : 'Sao Chép'}</span>
                    </button>
                    <button
                      onClick={() => window.open(`${overlayLinkBase}/?overlay=gamebattle`, '_blank')}
                      className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 font-bold text-[10px]"
                      title="Xem thử tab mới"
                    >
                      Xem
                    </button>
                  </div>
                </div>

                {/* Link Sàn Nhảy TikTok */}
                <div className="p-2.5 rounded-xl bg-black/40 border border-pink-500/30 flex items-center justify-between gap-2">
                  <div className="truncate flex-1">
                    <div className="font-bold text-pink-300 text-[11px] flex items-center gap-1">
                      <Music size={12} className="text-white" />
                      <span>5. Sàn Nhảy TikTok</span>
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono truncate">
                      {`${overlayLinkBase}/?overlay=dance-floor`}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        if (typeof navigator !== 'undefined') {
                          navigator.clipboard.writeText(`${overlayLinkBase}/?overlay=dance-floor`);
                          setCopySuccessMsg('Đã sao chép Link Sàn Nhảy!');
                          setTimeout(() => setCopySuccessMsg(''), 3000);
                        }
                      }}
                      className="px-3 py-1 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-bold text-[11px] transition-colors shadow-sm"
                    >
                      <span>{copySuccessMsg === 'Đã sao chép Link Sàn Nhảy!' ? '✅ Đã Chép' : 'Sao Chép'}</span>
                    </button>
                    <button
                      onClick={() => window.open(`${overlayLinkBase}/?overlay=dance-floor`, '_blank')}
                      className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 font-bold text-[10px]"
                      title="Xem thử tab mới"
                    >
                      Xem
                    </button>
                  </div>
                </div>
              </div>

              {/* Hướng Dẫn Từng Bước */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1.5 text-[11px]">
                <div className="font-bold text-white uppercase text-[11px] mb-1">
                  🛠️ Hướng Dẫn Cài Đặt Vào TikTok LIVE Studio / OBS Studio:
                </div>
                <div className="space-y-1 text-gray-300">
                  <div>1. Mở TikTok LIVE Studio hoặc OBS Studio, bấm <strong>Thêm Nguồn (Add Source)</strong> &gt; <strong>Browser Source (Trình duyệt)</strong>.</div>
                  <div>2. Dán đường link vừa sao chép ở trên vào ô <strong>URL</strong>.</div>
                  <div>
                    3. Đặt kích thước: 
                    {globalAspectRatio === '9:16' ? (
                      <span className="text-yellow-300 font-bold"> Rộng: 1080 - Cao: 1920 (Khung Dọc 9:16)</span>
                    ) : (
                      <span className="text-yellow-300 font-bold"> Rộng: 1920 - Cao: 1080 (Khung Ngang 16:9)</span>
                    )}
                  </div>
                  <div>4. Tích chọn <strong>"Control audio via OBS"</strong> (Điều khiển âm thanh) nếu cần, rồi bấm <strong>OK</strong>.</div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-black/40 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">
                {copySuccessMsg ? <span className="text-emerald-400 font-bold">✨ {copySuccessMsg}</span> : '⚡ Tự động cập nhật realtime 100%'}
              </span>
              <button
                onClick={() => setShowOverlayModal(false)}
                className="px-4 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-bold text-xs transition-colors"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[99999] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-bold animate-in slide-in-from-top-4 duration-300 max-w-sm ${
          toast.type === 'error' ? 'bg-rose-600 text-white' : 
          toast.type === 'success' ? 'bg-emerald-600 text-white' : 
          'bg-orange-500 text-white'
        }`}>
          {toast.type === 'error' ? <AlertTriangle size={18} /> : 
           toast.type === 'success' ? <CheckCircle size={18} /> : 
           <AlertTriangle size={18} />}
          <span>{toast.message || toast.msg}</span>
          <button onClick={() => setToast(null)} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">
            <X size={14} />
          </button>
        </div>
      )}

    </div>
  );
}
