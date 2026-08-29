import { handleOSDownload } from '../../utils/downloadOS';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { 
  Settings, CreditCard, Video, Moon, Sun, 
  MessageCircle, Play, Pause, Mic, MicOff, X, Download, Plus,
  Brain, Radio, Coins, AlertTriangle, Eye, Clock, List, Zap, AlertCircle, FileText, CheckSquare, CheckCircle,
  Gift, ShoppingBag, Sparkles, RotateCcw, Send, Trash2, Heart, Share2, UserPlus, Users, Swords, Shield, Gamepad2, Flag, MapPin,
  Smartphone, MonitorPlay, Globe, StopCircle, Power, Volume2, VolumeX, Volume1, Music, Tv,
  User, LogOut, Mail, Lock, Check
} from 'lucide-react';
import { supabase, syncUserToSupabase } from '../../lib/supabaseClient';
import flvjs from 'flv.js';
import Hls from 'hls.js';
import WorkspaceTacVu from './WorkspaceTacVu';
import GeneralSettings from './GeneralSettings';
import ThanhToanCoin from './ThanhToanCoin';
import TokenHistoryModal from './TokenHistoryModal';
import { useToken } from './TokenContext';
import { useLiveCoordinator } from '../../hooks/useLiveCoordinator';
import AIAudioPlayer from './AIAudioPlayer';
import QuickResponseModal from './QuickResponseModal';
import TemplateLibraryModal from './TemplateLibraryModal';
import KOLLiveDashboard from '../KOLLiveDashboard';
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
import AIVoiceModule from '../kol-live/AIVoiceModule';
import AICharacterBeautyModal from './AICharacterBeautyModal';
import UniversalMasterOverlayModal from '../UniversalMasterOverlayModal';
import { syncMasterLiveState } from '../../lib/masterLiveSync';
import { saveCharacterToIDB, loadAllCharactersFromIDB, deleteCharacterFromIDB } from '../../utils/idbHelper';
import { SUPPORTED_LANGUAGES, getCurrentLanguage, setCurrentLanguage, t } from '../../utils/i18n';
import UpdateNotificationModal, { APP_VERSION } from './UpdateNotificationModal';

export default function DesktopAppUI() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_current_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });
  const [realGmailInput, setRealGmailInput] = useState('');
  const [realNameInput, setRealNameInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isGmailLoginModalOpen, setIsGmailLoginModalOpen] = useState(false);

  // Lắng nghe Supabase OAuth
  useEffect(() => {
    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user?.email) {
        const emailClean = session.user.email.toLowerCase().trim();
        const isSuperAdmin = emailClean === 'quocthiencr90@gmail.com';
        
        let userPlan = isSuperAdmin ? 'SUPER ADMIN ENTERPRISE VIP' : 'VIP PRO';
        let userTokens = isSuperAdmin ? 999999999 : 50000;
        let userLiveMinutes = isSuperAdmin ? 999999 : 6000;

        try {
          const { data: dbUser } = await supabase.from('users').select('*').eq('email', emailClean).maybeSingle();
          if (dbUser) {
            if (dbUser.plan) userPlan = dbUser.plan.toUpperCase();
            if (typeof dbUser.tokens === 'number') userTokens = dbUser.tokens;
            if (typeof dbUser.live_minutes === 'number') userLiveMinutes = dbUser.live_minutes;
            else if (typeof dbUser.liveMinutes === 'number') userLiveMinutes = dbUser.liveMinutes;
          }
        } catch (e) {}

        const gUser = {
          name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
          email: emailClean,
          avatar: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(session.user.email)}`,
          isAdmin: isSuperAdmin,
          plan: userPlan,
          tokens: userTokens,
          liveMinutes: userLiveMinutes,
          liveTimeHours: Math.round(userLiveMinutes / 60)
        };
        setCurrentUser(gUser);
        try {
          localStorage.setItem('avalive_current_user', JSON.stringify(gUser));
          await syncUserToSupabase(gUser);
        } catch (e) {}
      }
    });
    return () => subscription?.unsubscribe();
  }, []);

  // Đồng bộ Realtime tài khoản & Gói bản quyền & Token từ Supabase Cloud
  useEffect(() => {
    if (!supabase || !currentUser?.email) return;
    const emailClean = currentUser.email.toLowerCase().trim();

    const refreshUserData = async () => {
      try {
        const { data: dbUser } = await supabase
          .from('users')
          .select('*')
          .eq('email', emailClean)
          .maybeSingle();

        if (dbUser) {
          const isSuperAdmin = emailClean === 'quocthiencr90@gmail.com' || dbUser.role === 'admin';
          const updatedUser = {
            ...currentUser,
            name: dbUser.name || currentUser.name,
            avatar: dbUser.avatar_url || currentUser.avatar,
            isAdmin: isSuperAdmin,
            plan: isSuperAdmin ? 'SUPER ADMIN ENTERPRISE VIP' : (dbUser.plan || currentUser.plan || 'VIP PRO'),
            tokens: typeof dbUser.tokens === 'number' ? dbUser.tokens : (currentUser.tokens || 50000),
            liveMinutes: typeof dbUser.live_minutes === 'number' ? dbUser.live_minutes : (currentUser.liveMinutes || 6000),
            liveTimeHours: Math.round((typeof dbUser.live_minutes === 'number' ? dbUser.live_minutes : (currentUser.liveMinutes || 6000)) / 60)
          };
          setCurrentUser(updatedUser);
          try { localStorage.setItem('avalive_current_user', JSON.stringify(updatedUser)); } catch (e) {}
        }
      } catch (err) {
        console.warn('Lỗi đồng bộ Supabase User:', err);
      }
    };

    refreshUserData();

    // Lắng nghe thay đổi trực tiếp từ Supabase Realtime
    let userChannel = null;
    try {
      userChannel = supabase
        .channel(`user_sync_${emailClean}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users', filter: `email=eq.${emailClean}` }, () => {
          refreshUserData();
        })
        .subscribe();
    } catch (e) {}

    return () => {
      if (userChannel) supabase.removeChannel(userChannel);
    };
  }, [currentUser?.email]);

  const handleRealGoogleOAuth = async () => {
    setIsLoggingIn(true);
    setAuthError('');
    try {
      if (!supabase) {
        throw new Error('Supabase client chưa sẵn sàng');
      }
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + window.location.pathname
        }
      });
      if (error) throw error;
    } catch (err) {
      setAuthError(err.message || 'Lỗi kết nối Google OAuth');
      setIsLoggingIn(false);
    }
  };

  const handleRealGmailSubmit = async (e) => {
    e?.preventDefault();
    if (!realGmailInput.trim()) {
      setAuthError('Vui lòng nhập địa chỉ Gmail hợp lệ!');
      return;
    }
    const emailClean = realGmailInput.trim().toLowerCase();
    if (!emailClean.includes('@')) {
      setAuthError('Địa chỉ Gmail phải chứa ký tự @!');
      return;
    }

    setIsLoggingIn(true);
    setAuthError('');

    const isAdmin = emailClean === 'quocthiencr90@gmail.com';
    const nameClean = realNameInput.trim() || emailClean.split('@')[0];
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(emailClean)}`;

    // Kiểm tra gói bản quyền & Token & Thời gian Live trên Supabase
    let userPlan = isAdmin ? 'ENTERPRISE' : 'VIP PRO';
    let userTokens = isAdmin ? 999999999 : 50000;
    let userLiveMinutes = isAdmin ? 999999 : 6000;
    try {
      if (supabase) {
        const { data: dbUser } = await supabase.from('users').select('*').eq('email', emailClean).maybeSingle();
        if (dbUser) {
          if (dbUser.plan) userPlan = dbUser.plan.toUpperCase();
          if (typeof dbUser.tokens === 'number') userTokens = dbUser.tokens;
          if (typeof dbUser.live_minutes === 'number') userLiveMinutes = dbUser.live_minutes;
          else if (typeof dbUser.liveMinutes === 'number') userLiveMinutes = dbUser.liveMinutes;
        }
      }
    } catch (e) {}

    const newUser = {
      name: nameClean,
      email: emailClean,
      avatar: avatarUrl,
      isAdmin: isAdmin,
      plan: userPlan,
      tokens: userTokens,
      liveMinutes: userLiveMinutes,
      liveTimeHours: Math.round(userLiveMinutes / 60)
    };

    setCurrentUser(newUser);
    try {
      localStorage.setItem('avalive_current_user', JSON.stringify(newUser));
      await syncUserToSupabase(newUser);
    } catch (e) {}

    setIsLoggingIn(false);
    setIsGmailLoginModalOpen(false);
  };

  const handleLogout = () => {
    if (confirm('Bạn có chắc muốn đăng xuất tài khoản Gmail này?')) {
      setCurrentUser(null);
      try {
        localStorage.removeItem('avalive_current_user');
        if (supabase) supabase.auth.signOut();
      } catch (e) {}
    }
  };

  const savedStage = (() => {
    try {
      return localStorage.getItem('avalive_active_stage') || 'bando';
    } catch {
      return 'bando';
    }
  })();

  const [isLiveStudioActive, setIsLiveStudioActive] = useState(false);
  const [isGameBattleActive, setIsGameBattleActive] = useState(() => savedStage === 'battle');
  const [isGameBanDoActive, setIsGameBanDoActive] = useState(() => savedStage === 'bando');
  const [isDanceFloorActive, setIsDanceFloorActive] = useState(() => savedStage === 'dancefloor');
  const [isGameAdminOpen, setIsGameAdminOpen] = useState(false);
  const [lastGameEvent, setLastGameEvent] = useState(null);
  const [isGameBanDoAdminOpen, setIsGameBanDoAdminOpen] = useState(false);
  const [isDanceFloorAdminOpen, setIsDanceFloorAdminOpen] = useState(false);
  const [isLocalSpeakerMuted, setIsLocalSpeakerMuted] = useState(() => {
    try {
      return localStorage.getItem('avalive_local_speaker_muted') === 'true';
    } catch (e) {
      return false;
    }
  });
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
    if (typeof window !== 'undefined') {
      return localStorage.getItem('avalive_selected_char') || '';
    }
    return '';
  });
  const [showTokenHistory, setShowTokenHistory] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [assistantPrompt, setAssistantPrompt] = useState('');
  const [autoSimActive, setAutoSimActive] = useState(false);
  const [simTab, setSimTab] = useState('quick');
  const autoSimTimerRef = useRef(null);

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

  // ✨ States cho Modal Xoá Phông & Làm Đẹp Nhân Vật AI 4K
  const [isBeautyModalOpen, setIsBeautyModalOpen] = useState(false);
  const [beautyModalImage, setBeautyModalImage] = useState(null);
  const [beautyModalCharName, setBeautyModalCharName] = useState('Nhân vật Live AI');

  const [toast, setToast] = useState(null);
  
  const [customCharacters, setCustomCharacters] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_custom_characters');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
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

    const videoEl = flvVideoRef.current;
    if (videoEl && 'requestVideoFrameCallback' in videoEl) {
      videoEl.requestVideoFrameCallback(renderFrame);
    } else {
      animId = requestAnimationFrame(renderFrame);
    }

    return () => {
      isMounted = false;
      if (animId) cancelAnimationFrame(animId);
    };
  }, [flvUrl]);
  const lastAiCommentTime = useRef(0);
  const lastAiGreetingTime = useRef(0);
  const greetedUsernamesRef = useRef(new Set());
  const thankedGiftUsersRef = useRef(new Map());
  const [isTemplateLibraryOpen, setIsTemplateLibraryOpen] = useState(false);


  const getPlayableStreamUrl = (rawUrl) => {
    if (!rawUrl) return '';
    if (rawUrl.includes('/api/stream-proxy')) return rawUrl;
    const backendOrigin = typeof window !== 'undefined' ? (window.location.port === '5173' || window.location.port === '3000' || window.location.port === '3001' ? `${window.location.protocol}//${window.location.hostname}:3001` : window.location.origin) : 'http://127.0.0.1.nip.io:3001';
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
      // Tự động xóa hoặc ẩn các nhân vật ảo mặc định cũ nếu chúng đã bị lưu vào IDB của người dùng
      const legacyIds = ['char_video_1', 'aidol_lan_huong', 'aidol_phuong_thao', 'aidol_minh_anh', 'aidol_dancer_video'];
      
      // Xoá ngầm khỏi IDB để dọn dẹp
      chars.forEach(c => {
        if (legacyIds.includes(c.id)) {
          deleteCharacterFromIDB(c.id).catch(() => {});
        }
      });
      
      const filtered = chars.filter(c => !legacyIds.includes(c.id));
      const autoBackendUrl = typeof window !== 'undefined' ? (window.location.port === '5173' || window.location.port === '3000' || window.location.port === '3001' ? `${window.location.protocol}//${window.location.hostname}:3001` : window.location.origin) : 'http://localhost:3001';

      const loadedChars = filtered.map(c => {
        let finalUrl = c.mediaUrl || c.url;
        if (!finalUrl && c.fileData) {
          try {
            finalUrl = URL.createObjectURL(c.fileData);
          } catch (e) {
            finalUrl = '';
          }
        }
        return {
          id: c.id,
          name: c.name || 'AIDOL của tôi',
          type: c.type || 'image',
          url: finalUrl,
          fileData: c.fileData
        };
      });
      setCustomCharacters(loadedChars);

      // Tự động nâng cấp fileData lên máy chủ để lấy link HTTP vĩnh viễn (chống đen màn hình trên OBS / TikTok Live Studio)
      filtered.forEach(async (c) => {
        if (c.fileData && (!c.mediaUrl || c.mediaUrl.startsWith('blob:'))) {
          try {
            const formData = new FormData();
            formData.append('file', c.fileData);
            const res = await fetch(`${autoBackendUrl}/api/upload-media`, { method: 'POST', body: formData });
            const data = await res.json();
            if (data && data.url) {
              const fullUrl = data.url.startsWith('http') ? data.url : `${autoBackendUrl}${data.url.startsWith('/') ? '' : '/'}${data.url}`;
              await saveCharacterToIDB({ ...c, mediaUrl: fullUrl, url: fullUrl });
              setCustomCharacters(prev => prev.map(item => item.id === c.id ? { ...item, url: fullUrl } : item));
            }
          } catch (e) {}
        }
      });
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

  const { balance, deductToken, setNotifyCallback, getDynamicRates } = useToken();
  
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
    const rates = getDynamicRates();
    const timer = setInterval(() => {
      deductToken(rates.AI_LIVE_PER_30S || 5, 'AI LLM Brain & Duy trì Live (30s)');
    }, 30000);
    return () => clearInterval(timer);
  }, [isConnected, deductToken, getDynamicRates]);

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
  const isMasterLiveRunningRef = useRef(isMasterLiveRunning);
  useEffect(() => {
    isMasterLiveRunningRef.current = isMasterLiveRunning;
  }, [isMasterLiveRunning]);



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
        if (socketRef.current && socketRef.current.connected) {
          socketRef.current.emit('bando_action', { type: 'TRIGGER_DEMO' });
        }
      } catch (e) {
        console.error('Error starting bando demo loop:', e);
      }
    } else if (isGameBattleActive) {
      // 2. Kích hoạt Demo Game Chiến Đấu PK
      window.dispatchEvent(new CustomEvent('battle-trigger-demo'));
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('battle_trigger_demo');
      }
      globalDemoTimerRef.current = setInterval(() => {
        window.dispatchEvent(new CustomEvent('battle-trigger-demo'));
        if (socketRef.current && socketRef.current.connected) {
          socketRef.current.emit('battle_trigger_demo');
        }
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

  // Bộ sưu tập Nhân Vật AI Idol & Video 4K Mặc Định Sắc Nét (Mỗi nhân vật 1 video riêng biệt độc quyền)
  const BUILTIN_CHARACTERS = {
    'linhanh_4k': {
      name: 'AI Idol Linh Anh (4K)',
      url: '/demo_dancer.mp4',
      type: 'video'
    },
    'aidol_greenscreen': {
      name: 'AI Idol Thời Trang (GreenScreen)',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-green-dress-41315-large.mp4',
      type: 'video'
    },
    'aidol_dance_pro': {
      name: 'AI Idol Vũ Đạo (Dance Pro)',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-dancing-in-front-of-a-camera-40742-large.mp4',
      type: 'video'
    }
  };
  
  const ALL_CHARACTERS = { ...BUILTIN_CHARACTERS };

  // Gộp nhân vật mặc định và tuỳ chỉnh tải lên bởi người dùng
  const CHARACTERS = { ...BUILTIN_CHARACTERS };
  if (Array.isArray(customCharacters)) {
    customCharacters.forEach(c => {
      if (c && c.id) {
        CHARACTERS[c.id] = { name: c.name || 'AI Idol', url: c.url, type: c.type || 'video' };
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

  // 🔇 Xử lý Bật/Tắt chế độ Tắt Loa Máy tính Cục bộ (Vẫn phát đầy đủ âm thanh 100% trên OBS & TikTok Studio)
  const handleToggleLocalSpeakerMute = useCallback(() => {
    const nextState = !isLocalSpeakerMuted;
    bandoAudio.setLocalSpeakerMute(nextState);
    setIsLocalSpeakerMuted(nextState);
    if (nextState) {
      setToast({
        type: 'success',
        message: '🔇 ĐÃ TẮT LOA MÁY TÍNH CỦA BẠN! Phiên Live trên TikTok LIVE Studio & OBS vẫn nghe thấy đầy đủ 100% bình thường.'
      });
    } else {
      setToast({
        type: 'success',
        message: '🔊 ĐÃ BẬT LẠI LOA MÁY TÍNH! Bạn và khán giả cùng nghe thấy âm thanh.'
      });
    }
  }, [isLocalSpeakerMuted]);

  // Đồng bộ trạng thái Local Mute nếu có component khác thay đổi
  useEffect(() => {
    const handleMuteSync = (e) => {
      if (e.detail && typeof e.detail.isMuted === 'boolean') {
        setIsLocalSpeakerMuted(e.detail.isMuted);
      }
    };
    window.addEventListener('avalive_local_mute_change', handleMuteSync);
    return () => window.removeEventListener('avalive_local_mute_change', handleMuteSync);
  }, []);

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
      } else if (window.location.protocol === 'file:') {
        backendUrl = 'http://localhost:3001'; // Fallback for double-clicking index.html
      }
    }
    
    const socket = io(backendUrl || (window.location.origin !== 'file://' ? window.location.origin : 'http://localhost:3001'), {
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
      if (isMasterLiveRunningRef.current) {
        bandoAudio.playBgmOnLive();
      }
      handleLiveEventRef.current?.('VIEWER_JOIN', { name: targetChan });
    });

    socket.on('tiktok_chat', (data) => {
      if (!data) return;
      bandoAudio.unlock();
      const timeStr = new Date().toLocaleTimeString();
      const author = data.username || data.nickname || 'Khán giả';
      const text = data.comment || '';
      setTiktokLogs(prev => [`[${timeStr}] 💬 ${author}: ${text}`, ...prev.slice(0, 49)]);
      
      // 1. Chuyển tiếp tới Game Bản Đồ Chữ S & Game Chiến Đấu
      try {
        bandoEngine.handleUserComment(text, author);
      } catch (e) {}

      // 2. Kích hoạt Kịch Bản Trả Lời Bình Luận & Chốt Đơn của AI Idol (theo đúng cấu trúc đã cài đặt)
      const now = Date.now();
      if (now - lastAiCommentTime.current > 2500) {
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
      const giftCount = Number(data.count || data.repeatCount) || 1;
      const diamondCount = Number(data.diamondCount) || 1;
      setTiktokLogs(prev => [`[${timeStr}] 🎁 ${author} tặng ${giftName} x${giftCount} (${diamondCount} xu)`, ...prev.slice(0, 49)]);

      // 1. Luôn kích hoạt cắm ô cờ trên Bản Đồ 3D Việt Nam (Chính xác 100% số ô theo cấu hình)
      bandoEngine.processGift({
        giftId: data.giftId,
        giftName: data.giftName,
        count: giftCount,
        diamondCount: diamondCount,
        userId: data.userId || data.uniqueId || 'tiktok_viewer',
        username: author,
        avatar: data.profilePictureUrl || '',
        msgId: data.msgId
      });

      // 2. Chuyển tiếp Game Chiến Đấu nếu đang mở
      window.dispatchEvent(new CustomEvent('battle-trigger-gift', { detail: data }));

      // 3. Kích hoạt cảm ơn quà tặng: CHỈ CẢM ƠN 1 LẦN DUY NHẤT cho mỗi lần tặng quà (tránh bị lặp lại nhiều lần do streak/combo liên tiếp)
      const now = Date.now();
      const userKey = (author || '').toLowerCase().trim();
      const giftKey = (giftName || '').toLowerCase().trim();
      const giftEventKey = `${userKey}_${giftKey}`;
      const lastThanked = thankedGiftUsersRef.current.get(giftEventKey) || 0;

      // Khử trùng lặp streak quà: Chỉ cảm ơn 1 lần duy nhất cho mỗi đợt tặng quà của món quà đó (giãn cách 4s giữa các lần tặng cùng món quà)
      if (now - lastThanked > 4000) {
        thankedGiftUsersRef.current.set(giftEventKey, now);
        if (thankedGiftUsersRef.current.size > 500) {
          const first = thankedGiftUsersRef.current.keys().next().value;
          thankedGiftUsersRef.current.delete(first);
        }
        handleLiveEventRef.current?.('GIFT', { name: author, gift: giftName, count: giftCount });
      }
    });

    socket.on('tiktok_like', (data) => {
      if (!data) return;
      const count = data.likeCount || 1;
      const author = data.username || 'Khán giả';
      handleLiveEventRef.current?.('LIKE', { count: `${count} tim`, name: author });
    });

    socket.on('tiktok_member', (data) => {
      if (!data) return;
      // Kiểm tra công tắc Tự Động Chào Khán Giả (Bật/Tắt từ Cài Đặt)
      if (mapVoiceEngine.isAutoGreetingEnabled === false) return;
      const author = data.username || data.nickname || '';
      if (!author || author === 'Khách mới' || author === 'Khán Giả') return;
      const key = author.toLowerCase().trim();
      
      // Tuyệt đối chỉ chào mỗi người dùng ĐÚNG 1 LẦN duy nhất trong suốt buổi livestream
      if (greetedUsernamesRef.current.has(key)) return;
      greetedUsernamesRef.current.add(key);
      if (greetedUsernamesRef.current.size > 500) {
        const first = greetedUsernamesRef.current.values().next().value;
        greetedUsernamesRef.current.delete(first);
      }
      
      // Chống dồn dập: Giãn cách lời chào tối thiểu 6 giây
      const now = Date.now();
      if (now - lastAiGreetingTime.current > 6000) {
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
    const stage = isGameBanDoActive 
      ? 'bando' 
      : isGameBattleActive 
      ? 'battle' 
      : isDanceFloorActive 
      ? 'dancefloor' 
      : isLiveStudioActive 
      ? 'broadcast' 
      : 'idol';

    const customMatch = (customCharacters && Array.isArray(customCharacters)) ? customCharacters.find(c => c.id === selectedCharacter) : null;
    const firstCustom = (customCharacters && Array.isArray(customCharacters) && customCharacters.length > 0) ? customCharacters[0] : null;
    const char = customMatch || CHARACTERS[selectedCharacter] || firstCustom || Object.values(CHARACTERS)[0] || { 
      url: '', 
      type: 'video', 
      name: 'Video Người Dùng' 
    };
    
    let currentMedia = char.url || (activeVideoItem?.mediaUrl) || '';
    let isVid = char.type === 'video' || (typeof currentMedia === 'string' && (currentMedia.endsWith('.mp4') || currentMedia.includes('/uploads/') || currentMedia.startsWith('http')));
    let streamFlvUrl = null;

    if (isConnected && flvUrl) {
      currentMedia = flvUrl;
      streamFlvUrl = flvUrl;
      isVid = true;
    } else if (isProcessingEvent && activeVideoItem && activeVideoItem.mediaUrl) {
      currentMedia = activeVideoItem.mediaUrl;
      isVid = activeVideoItem.type === 'video' || (typeof currentMedia === 'string' && currentMedia.endsWith('.mp4'));
    }

    const masterPayload = {
      type: 'MASTER_LIVE_STATE_UPDATE',
      stage, // 'idol' | 'battle' | 'bando' | 'dancefloor' | 'broadcast'
      aspectRatio: globalAspectRatio || '9:16', // '9:16' | '16:9'
      selectedCharacter: char.id || selectedCharacter,
      characterName: char.name || 'AI Idol',
      mediaUrl: currentMedia,
      flvUrl: streamFlvUrl,
      isVideo: !!isVid,
      isConnected: !!(isConnected || showSimulator),
      isDarkMode,
      currentLang,
      updatedAt: Date.now()
    };

    // Đồng bộ tức thì đa kênh: Supabase Cloud Realtime + Socket.io + BroadcastChannel + LocalStorage + REST API
    syncMasterLiveState(masterPayload, socketRef.current);
  }, [
    isGameBanDoActive, 
    isGameBattleActive, 
    isDanceFloorActive, 
    isLiveStudioActive, 
    selectedCharacter, 
    customCharacters,
    activeVideoItem, 
    isConnected, 
    showSimulator, 
    globalAspectRatio, 
    isDarkMode, 
    currentLang, 
    CHARACTERS, 
    flvUrl
  ]);

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

    // 🔒 Chặn double-click: Nếu đang trong quá trình kết nối thì bỏ qua
    if (isConnecting) {
      console.log('[UI] ⚠️ Đang kết nối, bỏ qua click trùng lặp.');
      return;
    }

    bandoAudio.unlock();
    const cleanId = extractTikTokUsername(tiktokId);
    const cleanVideoId = extractTikTokUsername(videoTiktokId);

    if (!cleanId && !cleanVideoId) {
      setToast({
        type: 'error',
        message: 'LỖI KẾT NỐI: Bạn phải nhập ID Kênh Lấy Bình Luận hoặc Video!'
      });
      if (isMasterLiveRunning) setIsMasterLiveRunning(false);
      return;
    }

    setIsConnecting(true);
    try {
      localStorage.setItem('aidol_tiktok_id', cleanId);
      localStorage.setItem('aidol_video_tiktok_id', cleanVideoId);
    } catch (e) {}

    // 🛡️ Safety Timer: Tự động hủy trạng thái chờ sau 20s nếu máy chủ không phản hồi (để server có đủ 15s timeout gốc kết nối TikTok)
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
    }, 20000);

    const onFinish = () => clearTimeout(safetyTimer);
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.once('tiktok_connected', onFinish);
      socketRef.current.once('tiktok_error', onFinish);
      socketRef.current.emit('connect_tiktok', { chatId: cleanId, videoId: cleanVideoId });
    } else {
      clearTimeout(safetyTimer);
      setIsConnecting(false);
      setToast({
        type: 'error',
        message: '⚠️ Chưa kết nối tới Server Backend (cổng 3001). Bạn đã chạy node backend/server.cjs chưa?'
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

      // 3. Tạm dừng toàn bộ âm thanh / BGM / SFX / Voice
      if (typeof bandoAudio.pauseAll === 'function') {
        bandoAudio.pauseAll();
      } else {
        bandoAudio.stopAll();
      }
      
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
          // KHÔNG reset currentTime để phát tiếp
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
            // KHÔNG reset currentTime để có thể phát tiếp từ chỗ đang dừng
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
    return handleOSDownload();
    
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
      const charName = prompt("Nhập tên cho nhân vật (để dễ quản lý):", "Idol Live AI Pro");
      if (!charName) {
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      const isVideo = file.type.startsWith('video/');
      let url = URL.createObjectURL(file);
      
      if (isVideo) {
        // Đẩy video lên backend nội bộ để tạo link HTTP (Giúp chạy được trên trình duyệt OBS)
        try {
          const formData = new FormData();
          formData.append('file', file);
          const autoBackendUrl = typeof window !== 'undefined' ? (window.location.port === '5173' || window.location.port === '3000' || window.location.port === '3001' ? `${window.location.protocol}//${window.location.hostname}:3001` : window.location.origin) : 'http://localhost:3001';
          
          const res = await fetch(`${autoBackendUrl}/api/upload-media`, {
            method: 'POST',
            body: formData
          });
          const data = await res.json();
          if (data && data.url) {
            let serverUrl = data.url;
            if (serverUrl.startsWith('http://') || serverUrl.startsWith('https://')) {
              url = serverUrl;
            } else {
              url = `${autoBackendUrl}${serverUrl.startsWith('/') ? '' : '/'}${serverUrl}`;
            }
          }
        } catch (error) {
          console.error("Lỗi upload video:", error);
          alert("Lỗi tải lên video! Đảm bảo server backend đang chạy (port 3001).");
        }

        // Video: Lưu trực tiếp
        const newChar = {
          id: `custom_${Date.now()}`,
          name: charName,
          url,
          type: 'video'
        };
        setCustomCharacters(prev => [...prev, newChar]);
        setSelectedCharacter(newChar.id);
        try {
          localStorage.setItem('avalive_selected_char', newChar.id);
          const savedCustom = localStorage.getItem('avalive_custom_characters');
          const list = savedCustom ? JSON.parse(savedCustom) : [];
          list.push(newChar);
          localStorage.setItem('avalive_custom_characters', JSON.stringify(list));
        } catch (e) {}
        await saveCharacterToIDB({
          id: newChar.id,
          name: newChar.name,
          type: 'video',
          fileData: file, // Vẫn lưu dự phòng vào IDB
          mediaUrl: url
        });

        // 🚀 BẮN PHÁT SÓNG REALTIME TỨC THÌ ĐẾN TIKTOK LIVE STUDIO / OBS
        syncMasterLiveState({
          stage: 'idol',
          selectedCharacter: newChar.id,
          characterName: newChar.name,
          mediaUrl: url,
          isVideo: true,
          aspectRatio: globalAspectRatio || '9:16'
        }, socketRef.current);
      } else {
        // Ảnh: Mở Modal AI Xoá Phông & Làm Đẹp Siêu Nét 4K
        setBeautyModalImage(url);
        setBeautyModalCharName(charName);
        setIsBeautyModalOpen(true);
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Hàm xử lý lưu ảnh sau khi đã qua AI Xóa Phông & Làm Đẹp
  const handleSaveBeautyProcessedImage = async (processedDataUrl) => {
    const newCharId = `custom_${Date.now()}`;
    const newChar = {
      id: newCharId,
      name: beautyModalCharName || 'Idol Live AI Pro',
      url: processedDataUrl,
      type: 'image'
    };

    setCustomCharacters(prev => [...prev, newChar]);
    setSelectedCharacter(newCharId);
    try { localStorage.setItem('avalive_selected_char', newCharId); } catch (e) {}

    // 🚀 BẮN PHÁT SÓNG REALTIME TỨC THÌ ĐẾN TIKTOK LIVE STUDIO / OBS
    syncMasterLiveState({
      stage: 'idol',
      selectedCharacter: newCharId,
      characterName: newChar.name,
      mediaUrl: processedDataUrl,
      isVideo: false,
      aspectRatio: globalAspectRatio || '9:16'
    }, socketRef.current);

    // Lưu vào IDB
    try {
      // Chuyển DataURL sang Blob
      const res = await fetch(processedDataUrl);
      const blob = await res.blob();
      await saveCharacterToIDB({
        id: newCharId,
        name: newChar.name,
        type: 'image',
        fileData: blob
      });
      showToast('✨ Đã xoá phông & làm đẹp AI thành công cho nhân vật!', 'info');
    } catch (err) {
      console.error('Lỗi lưu ảnh IDB:', err);
    }
  };

  const removeCustomCharacter = async (e, id) => {
    e.stopPropagation();
    setCustomCharacters(prev => prev.filter(c => c.id !== id));
      setSelectedCharacter(Object.keys(CHARACTERS)[0] || '');
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
      
      const customMatch = customCharacters.find(c => c.id === selectedCharacter);
      const selected = customMatch || CHARACTERS[selectedCharacter] || Object.values(CHARACTERS)[0];

      if (isProcessingEvent && activeVideoItem && activeVideoItem.mediaUrl) {
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
              console.warn('Lỗi tải video phản hồi');
              setActiveVideoItem(null);
            }}
            playsInline 
          />
        );
      }
  
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
            className="w-full h-full object-contain bg-black transform-gpu"
            style={{ transform: 'translateZ(0)', willChange: 'transform' }}
            autoPlay 
            loop 
            muted 
            controls 
            preload="auto"
            disablePictureInPicture
            playsInline 
          />
        );
      }

      return (
        <div className="relative w-full h-full flex items-center justify-center bg-[#0d0d12] overflow-hidden select-none group/charStage">
          <img 
            src={selected.url} 
            className="w-full h-full object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)] transition-all duration-300 transform group-hover/charStage:scale-[1.01]"
            style={{ imageRendering: '-webkit-optimize-contrast' }}
            alt={selected.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          
          {/* Nút Nhanh: Mở AI Làm Đẹp & Xoá Phông Siêu Sạch */}
          <button
            onClick={() => {
              setBeautyModalImage(selected.url);
              setBeautyModalCharName(selected.name || 'Idol Live AI Pro');
              setIsBeautyModalOpen(true);
            }}
            className="absolute top-4 right-4 z-30 px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 text-pink-300 border border-pink-500/50 shadow-xl backdrop-blur-md text-xs font-black flex items-center gap-1.5 transition-all opacity-80 hover:opacity-100 hover:scale-105"
            title="Mở Bộ Công Cụ AI Xoá Phông & Làm Đẹp Da 4K cho nhân vật này"
          >
            <Sparkles size={13} className="text-pink-400 animate-pulse" />
            <span>✨ Làm Đẹp AI 4K</span>
          </button>
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

  const renderGmailLoginModal = () => {
    if (!isGmailLoginModalOpen) return null;

    const displayTokens = currentUser 
      ? (currentUser.isAdmin ? 'Vô Hạn' : ((currentUser.plan === 'Free' || !currentUser.plan) ? '100' : (currentUser.tokens || 0).toLocaleString())) 
      : '0';

    const displayLiveTime = currentUser 
      ? (currentUser.isAdmin ? 'Vô Hạn' : ((currentUser.plan === 'Free' || !currentUser.plan) ? '10h' : `${Math.round((currentUser.liveMinutes || 0) / 60)}h`)) 
      : '0h';

    return (
      <div className="fixed inset-0 w-screen h-screen bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 font-sans select-none overflow-y-auto">
        <div className="relative max-w-md w-full bg-[#121420]/95 backdrop-blur-2xl border border-cyan-500/30 rounded-[32px] p-8 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <button 
            onClick={() => setIsGmailLoginModalOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>

          {/* Logo Brand */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 p-0.5 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              {currentUser ? (
                <img 
                  src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.email)}`}
                  alt="Avatar"
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#0d0e17] rounded-2xl flex items-center justify-center">
                  <Video className="w-8 h-8 text-cyan-400" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                {currentUser ? currentUser.email : 'AVALIVE VIP PRO STUDIO'}
              </h1>
              <p className="text-xs text-gray-400 mt-1 font-bold">
                {currentUser ? `Gói Hiện Tại: ${currentUser.isAdmin ? 'SUPER ADMIN' : (currentUser.plan || 'Free')}` : 'Kết Nối Gmail Đồng Bộ Bản Quyền'}
              </p>
            </div>
          </div>

          {currentUser ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-amber-500/30 rounded-2xl p-4 flex flex-col items-center gap-2">
                  <Coins className="w-6 h-6 text-amber-400" />
                  <span className="text-xs text-gray-400 font-medium">Số Dư Token</span>
                  <span className="text-lg font-black text-amber-300">{displayTokens}</span>
                </div>
                <div className="bg-white/5 border border-emerald-500/30 rounded-2xl p-4 flex flex-col items-center gap-2">
                  <Clock className="w-6 h-6 text-emerald-400" />
                  <span className="text-xs text-gray-400 font-medium">Thời Gian Live</span>
                  <span className="text-lg font-black text-emerald-300">{displayLiveTime}</span>
                </div>
              </div>
              
              {/* Nút Nâng Cấp Gói */}
              <button
                onClick={() => {
                  setIsGmailLoginModalOpen(false);
                  setActiveSettingsModal('payment');
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-98"
              >
                <Zap className="w-4 h-4 text-yellow-100" />
                <span>Bảng Giá & Nâng Cấp Gói</span>
              </button>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <Lock className="w-4 h-4" />
                <span>ĐĂNG NHẬP / ĐỔI TÀI KHOẢN GMAIL</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Nhập địa chỉ <strong>Gmail</strong> của bạn để đồng bộ gói bản quyền và lịch sử hoạt động giữa các thiết bị.
              </p>
            </div>
          )}

          {authError && (
            <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 text-xs text-left flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Nút Đăng Nhập / Đăng Xuất */}
          <div className="space-y-4 pt-2">
            {!currentUser ? (
              <button
                onClick={handleRealGoogleOAuth}
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-white hover:bg-gray-100 text-gray-900 rounded-2xl font-bold text-sm shadow-xl transition-all hover:scale-[1.02] active:scale-98 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{isLoggingIn ? '⏳ Đang Kết Nối...' : '🚀 Kết Nối Trực Tiếp Bằng Gmail (Google)'}</span>
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                  setIsGmailLoginModalOpen(false);
                }}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng Xuất Tài Khoản</span>
              </button>
            )}
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500">
            <span>Phiên Bản v{APP_VERSION}</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3" /> Bảo Mật SSL 256-bit
            </span>
          </div>
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
          <span className="text-[9px] bg-blue-600/20 text-blue-400 px-1.5 py-0.5 rounded-sm font-semibold border border-blue-500/20">
            v{APP_VERSION}
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
              !isGameBattleActive && !isGameBanDoActive && !isDanceFloorActive && !isLiveStudioActive
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white border-cyan-300 shadow-cyan-500/40 ring-1 ring-cyan-400/50' 
                : (isDarkMode ? 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-900/50' : 'border-cyan-300 bg-cyan-50 text-cyan-700 hover:bg-cyan-100')
            }`}
            onClick={() => {
              setIsGameBattleActive(false);
              setIsGameBanDoActive(false);
              setIsDanceFloorActive(false);
              setIsLiveStudioActive(false);
              try { localStorage.setItem('avalive_active_stage', 'idol'); } catch (e) {}
              mapVoiceEngine.stopAll();
              battleVoiceEngine.stopAll();
              battleCommentary.stopAll();
            }}
            title="Chuyển sang màn hình Livestream AI Idol"
          >
            <Video size={10} className={!isGameBattleActive && !isGameBanDoActive && !isDanceFloorActive && !isLiveStudioActive ? 'text-yellow-300' : 'text-cyan-400'} />
            <span className="whitespace-nowrap">Live AI Idol</span>
            {!isGameBattleActive && !isGameBanDoActive && !isDanceFloorActive && !isLiveStudioActive && (
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
              setIsLiveStudioActive(false);
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
              setIsLiveStudioActive(false);
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

          {/* Nút Mở Danh Sách Link Chia Sẻ OBS & TikTok LIVE Studio */}
          <button
            onClick={() => setShowOverlayModal(true)}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-500 text-white border border-cyan-400/80 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-400/50 transition-all active:scale-95 cursor-pointer animate-pulse"
            title="Mở Danh Sách Đường Link Chia Sẻ Màn Hình Cho OBS Studio & TikTok LIVE Studio"
          >
            <Radio size={11} className="text-yellow-300 animate-spin" />
            <span className="whitespace-nowrap uppercase tracking-tight">📡 Chia Sẻ OBS / TikTok Live</span>
          </button>

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

          {/* Nút Mở Link Realtime TikTok LIVE Studio & OBS Studio - Nhỏ gọn tinh tế */}
          <button
            onClick={() => setShowOverlayModal(true)}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-cyan-600/80 hover:bg-cyan-500 text-white border border-cyan-400/50 shadow-xs transition-all hover:scale-105"
            title="Mở & Sao chép Link Live Overlay cho TikTok LIVE Studio / OBS Studio"
          >
            <Radio size={10} className="text-yellow-300 animate-pulse" />
            <span className="whitespace-nowrap">📡 Link Live</span>
          </button>

          {/* 👑 1 Ô DUY NHẤT: LOGO TÀI KHOẢN + GÓI (GỌN GÀNG) */}
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[9.5px] shadow-xs shrink-0 ${isDarkMode ? 'bg-[#12131d]/90 border-cyan-500/30' : 'bg-white border-gray-300'}`}>
            {currentUser ? (
              <div 
                onClick={() => setIsGmailLoginModalOpen(true)}
                className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
                title="Bấm để xem chi tiết tài khoản hoặc đổi Gmail"
              >
                <img 
                  src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.email)}`}
                  alt="Avatar"
                  className="w-4 h-4 rounded-full border-2 border-cyan-400 object-cover shrink-0"
                />
                <span className="text-[9px] px-1.5 py-0.5 rounded-md font-black bg-gradient-to-r from-amber-400 to-yellow-400 text-black leading-tight shadow-md">
                  {currentUser.isAdmin ? 'SUPER ADMIN' : (currentUser.plan || 'Free')}
                </span>
              </div>
            ) : (
              <button
                onClick={() => setIsGmailLoginModalOpen(true)}
                className="flex items-center gap-1 font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                title="Đăng nhập Gmail kết nối gói bản quyền"
              >
                <User size={10} className="text-yellow-300" />
                <span className="whitespace-nowrap">🔑 Đăng Nhập Gmail</span>
              </button>
            )}

            {currentUser && (
              <>
                <div className="w-px h-3 bg-gray-600/50" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogout();
                  }}
                  title="Đăng xuất tài khoản"
                  className="text-gray-400 hover:text-red-400 transition-colors p-0.5"
                >
                  <LogOut size={9} />
                </button>
              </>

            )}
          </div>
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
          
          {/* 3 Ô NHÂN VẬT / VIDEO TẢI LÊN (CỐ ĐỊNH 3 Ô THEO YÊU CẦU) */}
          <div className="flex items-center gap-1.5 border-r border-gray-500/30 pr-2">
            <span className="text-xs font-medium text-gray-400">{t('characters', currentLang)}</span>
            <div className="flex items-center gap-1.5 py-0.5">
              {/* 3 Ô Cố Định */}
              {Array.from({ length: 3 }).map((_, index) => {
                // Ô đầu tiên mặc định là Linh Anh nếu chưa có gì, các ô sau lấy từ customCharacters tải lên
                let charItem = customCharacters[index];
                if (index === 0 && !charItem && customCharacters.length === 0) {
                  charItem = CHARACTERS['linhanh_4k'];
                }

                // Nếu ô trống, hiển thị nút bấm để tải lên
                if (!charItem) {
                  return (
                    <button
                      key={`empty_slot_${index}`}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-10 h-10 rounded-lg border-2 border-dashed border-gray-600 hover:border-cyan-400 hover:bg-cyan-500/10 flex flex-col items-center justify-center text-gray-400 hover:text-cyan-300 transition-all duration-200 cursor-pointer shrink-0 group"
                      title={`Ô ${index + 1} (Trống) — Bấm để tải video/ảnh nhân vật lên`}
                    >
                      <Plus size={16} className="group-hover:scale-125 transition-transform" />
                    </button>
                  );
                }

                const isSelected = selectedCharacter === charItem.id || (index === 0 && (!selectedCharacter && charItem.id === 'linhanh_4k'));

                return (
                  <div
                    key={charItem.id || index}
                    onClick={() => {
                      setSelectedCharacter(charItem.id);
                      try { localStorage.setItem('avalive_selected_char', charItem.id); } catch (e) {}
                      setIsGameBattleActive(false);
                      setIsGameBanDoActive(false);
                      if (charItem.url) {
                        const isVid = charItem.type === 'video' || (typeof charItem.url === 'string' && (charItem.url.endsWith('.mp4') || charItem.url.endsWith('.webm') || charItem.url.endsWith('.mov')));
                        syncMasterLiveState({
                          stage: 'idol',
                          selectedCharacter: charItem.id,
                          characterName: charItem.name || 'AI Idol',
                          mediaUrl: charItem.url,
                          isVideo: isVid,
                          aspectRatio: globalAspectRatio || '9:16'
                        }, socketRef.current);
                      }
                    }}
                    className={`w-10 h-10 rounded-lg overflow-hidden cursor-pointer flex-shrink-0 relative group transition-all ${
                      isSelected 
                        ? 'border-2 border-cyan-400 shadow-md shadow-cyan-500/40 ring-2 ring-cyan-400/50 scale-105' 
                        : 'border border-gray-600 opacity-70 hover:opacity-100 hover:border-gray-400'
                    }`}
                    title={`Ô ${index + 1}: ${charItem.name || 'Video Nhân Vật'}`}
                  >
                    {charItem.type === 'video' || (typeof charItem.url === 'string' && (charItem.url.endsWith('.mp4') || charItem.url.includes('/uploads/'))) ? (
                      <video src={charItem.url} className="w-full h-full object-cover" muted />
                    ) : (
                      <img src={charItem.url} className="w-full h-full object-cover" alt={charItem.name || ''} />
                    )}
                    
                    {/* Nút Xoá Video khỏi Ô (Chỉ hiện cho video do người dùng tải lên) */}
                    {charItem.id && charItem.id.startsWith('custom_') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCustomCharacter(e, charItem.id);
                        }}
                        className="absolute top-0 right-0 p-1 bg-red-600 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all duration-150 rounded-bl z-10"
                        title={`Xoá video tải lên ở Ô ${index + 1}`}
                      >
                        <X size={10} />
                      </button>
                    )}
                  </div>
                );
              })}

              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="video/*,image/*" 
                onChange={handleFileUpload} 
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-1 shrink-0">
            <input 
              type="text" 
              value={tiktokId} 
              onChange={(e) => setTiktokId(e.target.value)} 
              className={`w-36 px-2.5 py-1 rounded-lg text-xs font-medium outline-none border transition-all ${
                isDarkMode ? 'bg-[#2a2a35] border-gray-700 text-white focus:border-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              }`} 
              placeholder="ID Kênh TikTok..." 
              title="Nhập ID kênh TikTok của bạn để kết nối" 
            />
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

          {/* 🔇 NÚT TẮT TIẾNG LOA MÁY TÍNH (VẪN PHÁT ĐỦ ÂM THANH 100% TRÊN TIKTOK / OBS) */}
          <button 
            onClick={handleToggleLocalSpeakerMute}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black transition-all border shadow-xs active:scale-95 cursor-pointer ${
              isLocalSpeakerMuted
                ? 'bg-gradient-to-r from-purple-700 via-indigo-700 to-pink-700 text-white border-yellow-300 ring-1 ring-yellow-400 shadow-purple-500/40 animate-pulse'
                : (isDarkMode ? 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border-emerald-500/40' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-300')
            }`}
            title={
              isLocalSpeakerMuted
                ? "ĐANG TẮT TIẾNG LOA MÁY CỦA BẠN (Đỡ ồn khi ngủ/làm việc) — Khán giả trên TikTok Studio / OBS VẪN NGHE THẤY ĐẦY ĐỦ 100%!"
                : "Bấm để Tắt Loa Máy tính của bạn (cho đỡ ồn khi phát live) mà TikTok / OBS vẫn nghe đầy đủ âm thanh 100%"
            }
          >
            {isLocalSpeakerMuted ? (
              <>
                <VolumeX size={11} className="text-yellow-300" />
                <span className="whitespace-nowrap font-black">🔇 Tắt Loa Máy (Live Có Tiếng)</span>
              </>
            ) : (
              <>
                <Volume2 size={11} className="text-emerald-400" />
                <span className="whitespace-nowrap font-bold">🔊 Loa Máy: BẬT</span>
              </>
            )}
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
            <div className="p-3 space-y-3 overflow-y-auto max-h-[380px]">
              {/* TAB 1: TƯƠNG TÁC (Khán giả, Quà, Thả tim, Follow, Hội viên) */}
              {simTab === 'quick' && (
                <div className="space-y-2.5">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      <Users size={11} className="text-blue-500" /> Khán giả vào phòng:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      <button 
                        onClick={() => handleLiveEvent('VIEWER_JOIN', { name: 'Thanh Nhàn' })}
                        className={`py-1.5 px-2 rounded-lg text-[10.5px] font-medium transition-all text-center truncate border ${isDarkMode ? 'bg-blue-500/10 hover:bg-blue-500/25 text-blue-300 border-blue-500/30' : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'}`}
                      >
                        👋 Khách mới vào
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('VIEWER_JOIN', { name: 'Vip_HoàngNam 👑' })}
                        className={`py-1.5 px-2 rounded-lg text-[10.5px] font-medium transition-all text-center truncate border ${isDarkMode ? 'bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-300 border-indigo-500/30' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'}`}
                      >
                        ⭐ VIP vào phòng
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('VIEWER_JOIN', { name: 'Bảo Trâm ❤️' })}
                        className={`py-1.5 px-2 rounded-lg text-[10.5px] font-medium transition-all text-center truncate border ${isDarkMode ? 'bg-pink-500/10 hover:bg-pink-500/25 text-pink-300 border-pink-500/30' : 'bg-pink-50 hover:bg-pink-100 text-pink-700 border-pink-200'}`}
                      >
                        ❤️ Fan cứng vào
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('VIEWER_JOIN', { name: 'Chủ Tịch Tổng 💎' })}
                        className={`py-1.5 px-2 rounded-lg text-[10.5px] font-medium transition-all text-center truncate border ${isDarkMode ? 'bg-amber-500/10 hover:bg-amber-500/25 text-amber-300 border-amber-500/30' : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'}`}
                      >
                        💎 Tri kỷ / Đại gia
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      <Gift size={11} className="text-amber-500" /> Tặng quà TikTok (Tất cả các mức xu):
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                      <button 
                        onClick={() => handleLiveEvent('GIFT', { name: 'Anh Tuấn', gift: 'Hoa Hồng', count: 1 })}
                        className={`py-1.5 bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate`}
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
                        className={`py-1.5 bg-red-500/15 hover:bg-red-500/30 text-red-400 border border-red-500/40 rounded-lg text-[10px] font-bold transition-all text-center truncate`}
                      >
                        🐉 Giáng Long (1000 xu)
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('GIFT', { name: 'Tổng Giám Đốc', gift: 'Sư Tử Vàng Vũ Trụ', count: 10000 })}
                        className={`py-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-yellow-300 border border-yellow-400/50 rounded-lg text-[10px] font-black transition-all text-center truncate shadow-sm`}
                      >
                        🦁 Sư Tử (10k xu)
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('GIFT', { name: 'Đại Tướng Quân', gift: 'Mũ Trụ TikTok Universe', count: 30000 })}
                        className={`col-span-2 py-1.5 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-amber-600/30 hover:opacity-90 text-pink-300 border border-pink-400/60 rounded-lg text-[10px] font-black transition-all text-center truncate shadow-md animate-pulse`}
                      >
                        🚀 Mũ Trụ Siêu Cấp (30.000 xu)
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      <Heart size={11} className="text-red-500" /> Tương tác kênh & Cột mốc Tim:
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                      <button 
                        onClick={() => handleLiveEvent('LIKE', { count: '10.000 tim' })}
                        className="py-1.5 bg-red-500/10 hover:bg-red-500/25 text-red-500 border border-red-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate"
                      >
                        💖 10.000 Tim
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('LIKE', { count: '50.000 tim' })}
                        className="py-1.5 bg-pink-500/10 hover:bg-pink-500/25 text-pink-400 border border-pink-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate"
                      >
                        💖 50.000 Tim
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('LIKE', { count: '100.000 tim' })}
                        className="py-1.5 bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg text-[10px] font-bold transition-all text-center truncate"
                      >
                        🔥 100.000 Tim
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('FOLLOW', { name: 'Khánh Vy' })}
                        className="py-1.5 bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-500 border border-emerald-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate"
                      >
                        ➕ Follow Kênh
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('SHARE', { name: 'Minh Trang' })}
                        className="py-1.5 bg-violet-500/10 hover:bg-violet-500/25 text-violet-500 border border-violet-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate"
                      >
                        ↗️ Chia Sẻ Live
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('COMMENT', { name: 'Bảo Ngọc', text: 'Vừa đăng ký gói Hội Viên VIP của kênh nhé idol ơi!' })}
                        className="col-span-2 py-1.5 bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-[10px] font-black transition-all text-center truncate"
                      >
                        🌟 Đăng Ký Hội Viên VIP
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
                    <button 
                      onClick={() => handleLiveEvent('COMMENT', { name: 'Chiến Binh PK', text: 'Idol cố lên, anh em ơi vote quà cho idol thắng PK đi!' })}
                      className={`w-full text-left p-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between border ${isDarkMode ? 'bg-red-500/10 hover:bg-red-500/20 text-red-300 border-red-500/20' : 'bg-red-50 hover:bg-red-100 text-red-800 border-red-200'}`}
                    >
                      <span>⚔️ "Idol cố lên, vote quà cho idol thắng PK đi!"</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-red-500/20 text-white' : 'bg-red-200 text-red-900'}`}>Cổ Vũ PK</span>
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
                      <button 
                        onClick={() => handleLiveEvent('CALL_TO_ACTION', { prompt: 'Kêu gọi anh em vào trận PK đối kháng ngay!' })}
                        className={`p-1.5 rounded-lg text-[10px] font-medium text-left truncate border ${isDarkMode ? 'bg-red-500/10 hover:bg-red-500/20 text-red-300 border-red-500/30' : 'bg-red-50 hover:bg-red-100 text-red-800 border-red-200'}`}
                      >
                        ⚔️ Kích hoạt PK Đấu Trí
                      </button>
                      <button 
                        onClick={() => {
                          bandoAudio.unlock();
                          bandoAudio.playBgmOnLive();
                          handleLiveEvent('ASSISTANT_PROMPT', { prompt: 'Âm nhạc đang sôi động, cả nhà cùng quẩy và thả tim nhé!' });
                        }}
                        className={`p-1.5 rounded-lg text-[10px] font-medium text-left truncate border ${isDarkMode ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-200'}`}
                      >
                        🎵 Nhạc EDM Quẩy Live
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

      {/* VoiceStudio Modal (Phòng Thu Âm Thanh & Soạn Kịch Bản Thoại) */}
      {activeSettingsModal === 'voice_studio' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-200">
          <div className="w-full max-w-7xl h-[92vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-[#0d0d12] border border-pink-500/30 relative">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#12121a]">
              <div className="flex items-center gap-2 text-pink-400 font-black text-sm">
                <Mic size={18} className="text-pink-400 animate-pulse" />
                <span>PHÒNG THU GIỌNG NÓI & SOẠN KỊCH BẢN LIVESTREAM (VOICESTUDIO PRO)</span>
              </div>
              <button 
                onClick={() => setActiveSettingsModal(null)}
                className="p-1.5 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
                title="Đóng"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <AIVoiceModule />
            </div>
          </div>
        </div>
      )}

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

      {/* ✨ AI Character Beauty & Background Remover Modal 4K */}
      {isBeautyModalOpen && (
        <AICharacterBeautyModal
          initialImage={beautyModalImage}
          characterName={beautyModalCharName}
          onSave={handleSaveBeautyProcessedImage}
          onClose={() => setIsBeautyModalOpen(false)}
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
          try {
            localStorage.setItem('avalive_selected_char', newChar.id);
            const savedCustom = localStorage.getItem('avalive_custom_characters');
            const list = savedCustom ? JSON.parse(savedCustom) : [];
            list.push(newChar);
            localStorage.setItem('avalive_custom_characters', JSON.stringify(list));
          } catch (e) {}
          if (newChar && newChar.url) {
            syncMasterLiveState({
              stage: 'idol',
              selectedCharacter: newChar.id,
              characterName: newChar.name || 'AI Idol',
              mediaUrl: newChar.url,
              isVideo: newChar.type === 'video' || (typeof newChar.url === 'string' && (newChar.url.endsWith('.mp4') || newChar.url.includes('/uploads/') || newChar.url.includes('preview/mixkit'))),
              aspectRatio: globalAspectRatio || '9:16'
            }, socketRef.current);
          }
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

      {/* 👑 MODAL 1 ĐƯỜNG LINK DUY NHẤT TOÀN NĂNG CHO TIKTOK LIVE STUDIO & OBS STUDIO */}
      <UniversalMasterOverlayModal
        isOpen={showOverlayModal}
        onClose={() => setShowOverlayModal(false)}
      />

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

      {renderGmailLoginModal()}
      <UpdateNotificationModal />
    </div>
  );
}
