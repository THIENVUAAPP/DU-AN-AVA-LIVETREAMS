import { handleOSDownload } from '../../utils/downloadOS';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { 
  Settings, CreditCard, Video, Moon, Sun, 
  MessageCircle, Play, Pause, Mic, MicOff, X, Download, Plus,
  Brain, Radio, Coins, AlertTriangle, Eye, Clock, List, Zap, AlertCircle, FileText, CheckSquare, CheckCircle, Layers,
  Gift, ShoppingBag, ShoppingCart, Sparkles, RotateCcw, Send, Trash2, Heart, Share2, UserPlus, Users, Swords, Shield, Gamepad2, Flag, MapPin,
  Smartphone, MonitorPlay, Monitor, Globe, StopCircle, Power, Volume2, VolumeX, Volume1, Music, Tv,
  User, LogOut, Mail, Lock, Check
} from 'lucide-react';
import { supabase, syncUserToSupabase } from '../../lib/supabaseClient';
import flvjs from 'flv.js';
import Hls from 'hls.js';
import WorkspaceTacVu from './WorkspaceTacVu';
import LivestreamFlowSequencer from './LivestreamFlowSequencer';
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
import { clearGlobalSpeechQueue, getMultiAvatarConfig, isImageMedia, getChromaStyle, ALL_SYSTEM_VOICES, previewVoiceAudio, stopVoiceAudio, getDualVoiceConfig } from '../../utils/voiceSyncService';
import MultiAvatarStudioModal, { SvgChromaFilters } from './MultiAvatarStudioModal';
import AutoCaptchaSolver from '../AutoCaptchaSolver';
import AIVoiceModule from '../kol-live/AIVoiceModule';
import AICharacterBeautyModal from './AICharacterBeautyModal';
import UniversalMasterOverlayModal from '../UniversalMasterOverlayModal';
import { syncMasterLiveState, sendVideoControl } from '../../lib/masterLiveSync';
import { saveCharacterToIDB, loadAllCharactersFromIDB, deleteCharacterFromIDB, findExistingAidolByFile, cleanupDuplicateAidolItems } from '../../utils/idbHelper';
import { generateFileSignature, registerFileInRAM } from '../../utils/mediaDeduplication';
import { SUPPORTED_LANGUAGES, getCurrentLanguage, setCurrentLanguage, t } from '../../utils/i18n';
import UpdateNotificationModal, { APP_VERSION } from './UpdateNotificationModal';
import { bootstrapDefaultPresets } from '../../utils/defaultPresetsBootstrap';
import { fastStreamUpload } from '../../utils/fastStreamService';
import { setActiveMedia } from '../../utils/activeMediaStore';
import ShopeeLiveConnectModal from './ShopeeLiveConnectModal';
import autoPinProductService from '../../utils/autoPinProductService';
import { generateAiKnowledgeScript } from '../../utils/aiScriptGenerator';

const CHARACTERS = {
  default_idol: {
    id: 'default_idol',
    name: 'Idol Ngọc Nhi 👑 (4K Live 60FPS)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    type: 'video'
  }
};

// 📡 SINGLETON BROADCAST CHANNELS (Tái sử dụng vĩnh viễn, chống rò rỉ bộ nhớ khi phát nhiều giờ)
let globalMasterBc = null;
const postMasterBroadcast = (payload) => {
  try {
    if (typeof BroadcastChannel === 'undefined') return;
    if (!globalMasterBc) {
      globalMasterBc = new BroadcastChannel('avalive_master_live_stream');
    }
    globalMasterBc.postMessage(payload);
  } catch (e) {}
};

export default function DesktopAppUI() {
  // 🛑/▶️ Trạng thái Tắt / Bật Toàn Bộ Phiên Live Master
  const [isMasterLiveRunning, setIsMasterLiveRunning] = useState(false);
  const isMasterLiveRunningRef = useRef(isMasterLiveRunning);
  useEffect(() => {
    isMasterLiveRunningRef.current = isMasterLiveRunning;
  }, [isMasterLiveRunning]);

  // 📺 Trạng thái Tắt / Bật Video Xem Thử trên màn hình phần mềm
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  useEffect(() => {
    bootstrapDefaultPresets();
    try {
      cleanupDuplicateAidolItems();
      stopVoiceAudio();
      clearGlobalSpeechQueue();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (mapVoiceEngine?.stopAll) mapVoiceEngine.stopAll();
      if (battleVoiceEngine?.stopAll) battleVoiceEngine.stopAll();
      if (battleCommentary?.stopAll) battleCommentary.stopAll();
      if (bandoAudio?.stopAll) bandoAudio.stopAll();
    } catch(e) {}
  }, []);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_current_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      name: 'Khách Hàng Dùng Thử',
      email: 'khachhang@avalive.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',
      isAdmin: false,
      plan: 'Free',
      tokens: 100,
      liveMinutes: 60,
      liveTimeHours: 1
    };
  });
  const [realGmailInput, setRealGmailInput] = useState(() => {
    try { return localStorage.getItem('avalive_saved_gmail') || ''; } catch(e) { return ''; }
  });
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
        let userTokens = isSuperAdmin ? 100000 : 50000;
        let userLiveMinutes = isSuperAdmin ? 600000 : 6000;

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
        setIsGmailLoginModalOpen(false);
        setIsLoggingIn(false);
        try {
          localStorage.setItem('avalive_current_user', JSON.stringify(gUser));
          await syncUserToSupabase(gUser);
        } catch (e) {}
      }
    });

    // Bắt token từ Google OAuth Redirect nếu có trong URL Hash
    if (typeof window !== 'undefined' && window.location.hash && window.location.hash.includes('access_token')) {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        if (accessToken) {
          supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          }).then(() => {
            try {
              window.history.replaceState(null, '', window.location.pathname + window.location.search);
            } catch(e) {}
          }).catch(() => {});
        }
      } catch (e) {}
    }

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
            tokens: typeof dbUser.tokens === 'number' ? dbUser.tokens : (currentUser.tokens ?? (isSuperAdmin ? 100000 : 50000)),
            liveMinutes: typeof dbUser.live_minutes === 'number' ? dbUser.live_minutes : (currentUser.liveMinutes ?? (isSuperAdmin ? 600000 : 6000)),
            liveTimeHours: Math.round((typeof dbUser.live_minutes === 'number' ? dbUser.live_minutes : (currentUser.liveMinutes ?? (isSuperAdmin ? 600000 : 6000))) / 60)
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

  // 🔄 Lắng nghe sự kiện cập nhật tài khoản (Token, Giờ Live, Quyền Admin) toàn cục
  useEffect(() => {
    const handleUserUpdated = () => {
      try {
        const saved = localStorage.getItem('avalive_current_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          setCurrentUser(parsed);
        }
      } catch (e) {}
    };
    window.addEventListener('avalive:user_updated', handleUserUpdated);
    return () => window.removeEventListener('avalive:user_updated', handleUserUpdated);
  }, []);

  // Tự động đóng popup OAuth sau khi nhận token
  useEffect(() => {
    if (typeof window !== 'undefined' && window.opener && window.opener !== window) {
      const hash = window.location.hash || '';
      const search = window.location.search || '';
      if (hash.includes('access_token') || search.includes('code=')) {
        setTimeout(() => {
          try { window.close(); } catch(e) {}
        }, 600);
      }
    }
  }, []);

  // Lắng nghe token gửi về từ popup Google OAuth
  useEffect(() => {
    const handleOauthMessage = async (event) => {
      if (event.data?.type === 'OAUTH_CALLBACK' && event.data?.accessToken && supabase) {
        try {
          setIsLoggingIn(true);
          await supabase.auth.setSession({
            access_token: event.data.accessToken,
            refresh_token: event.data.refreshToken || ''
          });
        } catch(e) {
          console.warn('Set session error:', e);
        } finally {
          setIsLoggingIn(false);
          setIsGmailLoginModalOpen(false);
        }
      }
    };
    window.addEventListener('message', handleOauthMessage);
    return () => window.removeEventListener('message', handleOauthMessage);
  }, []);

  const handleRealGoogleOAuth = async () => {
    setIsLoggingIn(true);
    setAuthError('');
    try {
      if (!supabase) {
        throw new Error('Supabase client chưa sẵn sàng');
      }

      const isLocal = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1');
      const targetRedirect = isLocal
        ? 'https://avalivepro.vercel.app/?desktop_bridge=true'
        : window.location.origin + '/desktop';

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: targetRedirect,
          skipBrowserRedirect: true
        }
      });
      if (error) throw error;
      if (data?.url) {
        // Mở trong popup để không bao giờ làm hỏng cửa sổ ứng dụng Windows độc lập
        const popup = window.open(data.url, 'google_oauth_popup', 'width=520,height=680,menubar=no,toolbar=no');
        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
          window.location.href = data.url;
        }
      }
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
    let nameClean = realNameInput.trim() || emailClean.split('@')[0];
    let avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(emailClean)}`;

    // Kiểm tra gói bản quyền & Token & Thời gian Live trên Supabase
    let userPlan = isAdmin ? 'SUPER ADMIN ENTERPRISE VIP' : 'VIP PRO';
    let userTokens = isAdmin ? 100000 : 50000;
    let userLiveMinutes = isAdmin ? 600000 : 6000;

    try {
      if (supabase) {
        const { data: dbUser } = await supabase.from('users').select('*').eq('email', emailClean).maybeSingle();
        if (dbUser) {
          if (dbUser.name) nameClean = dbUser.name;
          if (dbUser.avatar_url) avatarUrl = dbUser.avatar_url;
          if (dbUser.plan) userPlan = dbUser.plan.toUpperCase();
          if (typeof dbUser.tokens === 'number') userTokens = dbUser.tokens;
          if (typeof dbUser.live_minutes === 'number') userLiveMinutes = dbUser.live_minutes;
          else if (typeof dbUser.liveMinutes === 'number') userLiveMinutes = dbUser.liveMinutes;
        } else {
          // Tạo mới tài khoản trên Supabase nếu chưa có
          await syncUserToSupabase({
            email: emailClean,
            name: nameClean,
            avatar: avatarUrl,
            plan: userPlan,
            tokens: userTokens
          });
        }
      }
    } catch (e) {
      console.warn('Supabase query note:', e);
    }

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
      localStorage.setItem('avalive_saved_gmail', emailClean);
      localStorage.setItem('avalive_user_tokens', userTokens.toString());
      window.dispatchEvent(new Event('avalive:user_updated'));
    } catch (e) {}

    setIsLoggingIn(false);
    setIsGmailLoginModalOpen(false);
    showToast(`✅ Đã đăng nhập: ${emailClean} (${userPlan}) - Token: ${userTokens.toLocaleString()}`, 'success');
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
      return localStorage.getItem('avalive_active_stage') || 'idol';
    } catch {
      return 'idol';
    }
  })();

  const [isLiveStudioActive, setIsLiveStudioActive] = useState(false);
  const [isGameBattleActive, setIsGameBattleActive] = useState(() => savedStage === 'battle');
  const [isGameBanDoActive, setIsGameBanDoActive] = useState(() => savedStage === 'bando');
  const [isGameAdminOpen, setIsGameAdminOpen] = useState(false);
  const [lastGameEvent, setLastGameEvent] = useState(null);
  const [isGameBanDoAdminOpen, setIsGameBanDoAdminOpen] = useState(false);
  const [isLocalSpeakerMuted, setIsLocalSpeakerMuted] = useState(() => {
    try {
      return localStorage.getItem('avalive_local_speaker_muted') === 'true';
    } catch (e) {
      return false;
    }
  });
  const isLocalSpeakerMutedRef = useRef(isLocalSpeakerMuted);
  useEffect(() => {
    isLocalSpeakerMutedRef.current = isLocalSpeakerMuted;
  }, [isLocalSpeakerMuted]);
  const [liveAudioMuted, setLiveAudioMuted] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_audio_muted');
      return saved !== null ? saved === 'true' : false;
    } catch (e) {
      return false;
    }
  });
  const [liveVolume, setLiveVolume] = useState(() => {
    try {
      const v = localStorage.getItem('avalive_video_volume');
      return v ? parseFloat(v) : 1.0;
    } catch (e) {
      return 1.0;
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
  const [isSimVoiceMuted, setIsSimVoiceMuted] = useState(false);
  const isSimVoiceMutedRef = useRef(false);
  const [simTab, setSimTab] = useState('video_live');
  const autoSimTimerRef = useRef(null);

  useEffect(() => {
    isSimVoiceMutedRef.current = isSimVoiceMuted;
  }, [isSimVoiceMuted]);

  // Lấy cấu hình Giọng đọc thực tế đang áp dụng cho Idol / Live
  const [currentVoiceConfig, setCurrentVoiceConfig] = useState(() => {
    try {
      return getDualVoiceConfig();
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    const handleVoiceUpdate = (e) => {
      if (e.detail) {
        setCurrentVoiceConfig(e.detail);
      } else {
        setCurrentVoiceConfig(getDualVoiceConfig());
      }
    };
    window.addEventListener('aidol_voice_sync_updated', handleVoiceUpdate);
    return () => window.removeEventListener('aidol_voice_sync_updated', handleVoiceUpdate);
  }, []);

  const currentActiveVoiceObj = (() => {
    try {
      const vIdol = currentVoiceConfig?.idolVoice;
      if (vIdol) {
        if (typeof vIdol === 'object' && vIdol.name) return vIdol;
        const found = ALL_SYSTEM_VOICES.find(v => v.id === vIdol);
        if (found) return found;
      }
    } catch (e) {}
    return ALL_SYSTEM_VOICES[0] || { name: 'Hoài My 👑 (Nữ Chuẩn - Bắc)' };
  })();
  const currentActiveVoiceName = currentActiveVoiceObj?.name || 'Hoài My 👑 (Nữ Chuẩn - Bắc)';

  // 👥 MULTI-AVATAR STUDIO (2–4 NHÂN VẬT) & MASTER STAGE SYNC
  const [isMasterStageSynced, setIsMasterStageSynced] = useState(() => {
    try {
      return localStorage.getItem('avalive_master_sync_active') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [multiAvatarConfig, setMultiAvatarConfig] = useState(() => {
    try {
      return getMultiAvatarConfig();
    } catch (e) {
      return { enabled: false, activeCount: 1, layout: 'auto', avatars: [] };
    }
  });
  const [showMultiAvatarStudioModal, setShowMultiAvatarStudioModal] = useState(false);
  const [activeSpeakerId, setActiveSpeakerId] = useState(null);
  const [isSpeakerActive, setIsSpeakerActive] = useState(false);

  useEffect(() => {
    const handleMultiAvatarChange = (e) => {
      if (e.detail) {
        setMultiAvatarConfig(e.detail);
      } else {
        setMultiAvatarConfig(getMultiAvatarConfig());
      }
    };

    const handleSpeakerChange = (e) => {
      const { avatarId, isSpeaking, role } = e.detail || {};
      if (isSpeaking) {
        setActiveSpeakerId(avatarId || role || 'idol');
        setIsSpeakerActive(true);
      } else {
        setIsSpeakerActive(false);
      }
    };

    const handleMasterSyncChange = (e) => {
      const isSynced = e.detail?.isSynced ?? false;
      setIsMasterStageSynced(isSynced);
      if (!isSynced) {
        setFlowSequencerOverlay(null);
      }
    };

    const handleIdleVideoUpdate = (e) => {
      const { videoUrl } = e.detail || {};
      if (videoUrl) {
        setUserLockedMediaUrl(videoUrl);
        try {
          localStorage.setItem('avalive_user_locked_media', videoUrl);
          localStorage.setItem('aidol_idle_media_url', videoUrl);
        } catch (err) {}
        const item = {
          id: `idle_${Date.now()}`,
          name: 'Video Chờ (Idle Studio)',
          mediaUrl: videoUrl,
          url: videoUrl,
          type: 'video'
        };
        setActiveVideoItem(item);
        syncMasterLiveState({
          stage: 'idol',
          mediaUrl: videoUrl,
          characterName: 'Video Chờ (Idle Studio)',
          isVideo: true,
          videoPlaybackEvent: 'play',
          isPlaying: true
        }, socketRef.current);
      }
    };

    const handleEventVideoTrigger = (e) => {
      const { videoUrl, name, eventType, isPreRecorded, muteSourceVideo } = e.detail || {};
      if (videoUrl) {
        const item = {
          id: `ev_${Date.now()}`,
          name: name || `${eventType} Video`,
          mediaUrl: videoUrl,
          url: videoUrl,
          type: 'video'
        };
        setActiveVideoItem(item);
        if (isPreRecorded) {
          // Video có sẵn âm thanh / voice -> Bật âm thanh gốc cho video
          if (desktopVideoRef.current) {
            desktopVideoRef.current.muted = muteSourceVideo === true;
            desktopVideoRef.current.volume = 1.0;
          }
        }
        syncMasterLiveState({
          stage: 'idol',
          mediaUrl: videoUrl,
          characterName: name || 'AI Idol Event',
          isVideo: true,
          videoPlaybackEvent: 'play',
          isPlaying: true
        }, socketRef.current);
      }
    };

    window.addEventListener('avalive_multi_avatar_changed', handleMultiAvatarChange);
    window.addEventListener('avalive_active_speaker_changed', handleSpeakerChange);
    window.addEventListener('avalive_speaker_change', handleSpeakerChange);
    window.addEventListener('avalive:master_sync_state_changed', handleMasterSyncChange);
    window.addEventListener('avalive:event_video_trigger', handleEventVideoTrigger);
    window.addEventListener('avalive:idle_video_updated', handleIdleVideoUpdate);
    return () => {
      window.removeEventListener('avalive_multi_avatar_changed', handleMultiAvatarChange);
      window.removeEventListener('avalive_active_speaker_changed', handleSpeakerChange);
      window.removeEventListener('avalive_speaker_change', handleSpeakerChange);
      window.removeEventListener('avalive:master_sync_state_changed', handleMasterSyncChange);
      window.removeEventListener('avalive:event_video_trigger', handleEventVideoTrigger);
      window.removeEventListener('avalive:idle_video_updated', handleIdleVideoUpdate);
    };
  }, []);

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
  const [showUpdateModal, setShowUpdateModal] = useState(() => {
    try {
      const lastSeen = localStorage.getItem('avalive_last_version');
      return lastSeen !== APP_VERSION;
    } catch (e) {
      return false;
    }
  });

  // 📜 Quản lý Phát Kịch Bản Bán Hàng Trực Tiếp Ngoài Giao Diện (Script Broadcast Controller)
  const [isScriptLiveRunning, setIsScriptLiveRunning] = useState(false);

  const [scriptTabsList, setScriptTabsList] = useState(() => {
    try {
      const pTabs = localStorage.getItem('aidol_user_script_tabs_persistent');
      if (pTabs) {
        const parsed = JSON.parse(pTabs);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      const evConf = JSON.parse(localStorage.getItem('aidol_event_configs') || '{}');
      return evConf.script_broadcast?.scriptTabs || [
        { id: 'tab_1', name: 'Kịch bản 1: Mặc Định', active: true }
      ];
    } catch (e) {
      return [{ id: 'tab_1', name: 'Kịch bản 1: Mặc Định', active: true }];
    }
  });

  // Đồng bộ danh sách tab kịch bản khi có cập nhật từ Workspace
  useEffect(() => {
    const handleScriptSync = () => {
      try {
        const pTabs = localStorage.getItem('aidol_user_script_tabs_persistent');
        if (pTabs) {
          const parsed = JSON.parse(pTabs);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setScriptTabsList(parsed);
          }
        }
      } catch (e) {}
    };
    window.addEventListener('aidol_script_updated', handleScriptSync);
    window.addEventListener('aidol_event_configs_updated', handleScriptSync);
    return () => {
      window.removeEventListener('aidol_script_updated', handleScriptSync);
      window.removeEventListener('aidol_event_configs_updated', handleScriptSync);
    };
  }, []);

  // Đảm bảo tất cả các chế độ chờ kịch bản mặc định về 0.0s (Liền mạch 0ms không ngắt quãng)
  useEffect(() => {
    try {
      const currentPause = localStorage.getItem('avalive_pause_between_sentences');
      if (currentPause === null || currentPause === '0.1' || currentPause === '0.25' || currentPause === '0.5') {
        localStorage.setItem('avalive_pause_between_sentences', '0.0');
        window.dispatchEvent(new CustomEvent('avalive_pause_between_sentences_updated', { detail: { pause: 0.0 } }));
      }
      localStorage.setItem('aidol_is_script_live_running', 'false');
      if (typeof window !== 'undefined') window.__isScriptLiveRunning = false;
    } catch (e) {}
  }, []);

  const handleToggleScriptLive = (forceState = null) => {
    const next = forceState !== null ? forceState : !isScriptLiveRunning;
    setIsScriptLiveRunning(next);
    if (typeof window !== 'undefined') window.__isScriptLiveRunning = next;
    try { localStorage.setItem('aidol_is_script_live_running', String(next)); } catch (e) {}
    
    if (next) {
      const chosen = scriptTabsList.find(t => t.active) || scriptTabsList[0];
      let scriptText = chosen?.fixedScriptText || '';
      let scriptName = chosen?.name || 'Kịch bản Idol';
      
      // Đọc cấu hình từ aidol_event_configs
      let evConf = {};
      try {
        evConf = JSON.parse(localStorage.getItem('aidol_event_configs') || localStorage.getItem('aidol_event_configs_backup') || '{}');
      } catch (e) {}

      const broadcastMode = evConf.script_broadcast?.broadcastMode || 'fixed_script';
      const isAiBrainMode = broadcastMode === 'ai_brain' || broadcastMode === 'ai_prompt';

      if (isAiBrainMode) {
        // =========================================================================
        // CHẾ ĐỘ 2: BỘ NÃO AI & TRI THỨC DOANH NGHIỆP TỰ ĐỘNG TẠO KỊCH BẢN
        // =========================================================================
        const durMin = evConf.script_broadcast?.scriptDurationMinutes || evConf.script_broadcast?.aiLiveDuration || 60;
        scriptName = `Bộ Não AI Tri Thức (${durMin} phút)`;
        scriptText = generateAiKnowledgeScript({
          companyName: evConf.script_broadcast?.companyName || 'Cửa Hàng Trực Tuyến Chính Hãng',
          productName: evConf.script_broadcast?.productName || 'Bộ Đôi Serum Tế Bào Gốc & Nước Hoa Pháp',
          productPrice: evConf.script_broadcast?.productPrice || '1.850.000đ - Flash Sale chỉ còn 890.000đ',
          promotions: evConf.script_broadcast?.promotions || 'Tặng kèm kem dưỡng mini + Freeship toàn quốc',
          keyFeatures: evConf.script_broadcast?.keyFeatures || 'Dưỡng da căng bóng mịn màng sau 7 ngày, nước hoa lưu hương 12 giờ',
          warrantyPolicy: evConf.script_broadcast?.warrantyPolicy || 'Bảo hành 1 đổi 1 trong 30 ngày, hoàn tiền 200% nếu hàng không chuẩn',
          companyKnowledgeText: evConf.script_broadcast?.companyKnowledgeText || '',
          aiLiveStyle: evConf.script_broadcast?.aiLiveStyle || 'sales_fast',
          scriptDurationMinutes: durMin,
          livePlatform: evConf.script_broadcast?.livePlatform || 'tiktok'
        });
      } else {
        // =========================================================================
        // CHẾ ĐỘ 1: KỊCH BẢN CÓ SẴN (FIXED SCRIPT - ĐỌC ĐÚNG 100% KỊCH BẢN ĐÃ CÀI ĐẶT)
        // =========================================================================
        // 1. Tìm tab kịch bản đang active trong event configs
        const confTabs = evConf.script_broadcast?.scriptTabs;
        if (Array.isArray(confTabs) && confTabs.length > 0) {
          const activeConfTab = confTabs.find(t => t.active === true) || 
            confTabs.find(t => t.id === evConf.script_broadcast?.activeScriptTabId) || 
            confTabs[0];
          if (activeConfTab) {
            scriptName = activeConfTab.name || scriptName;
            if (activeConfTab.fixedScriptText && activeConfTab.fixedScriptText.trim()) {
              scriptText = activeConfTab.fixedScriptText;
            }
          }
        }

        // 2. Tìm tab kịch bản trong persistent tabs
        if (!scriptText || !scriptText.trim()) {
          try {
            const pTabs = JSON.parse(localStorage.getItem('aidol_user_script_tabs_persistent') || '[]');
            const activePTab = pTabs.find(t => t.id === chosen?.id) || pTabs.find(t => t.active) || pTabs[0];
            if (activePTab) {
              scriptName = activePTab.name || scriptName;
              if (activePTab.fixedScriptText && activePTab.fixedScriptText.trim()) {
                scriptText = activePTab.fixedScriptText;
              }
            }
          } catch (e) {}
        }

        // 3. Dự phòng fixedScriptText trong evConf
        if ((!scriptText || !scriptText.trim()) && evConf.script_broadcast?.fixedScriptText) {
          scriptText = evConf.script_broadcast.fixedScriptText;
        }

        // 4. Dự phòng chosen từ state
        if ((!scriptText || !scriptText.trim()) && chosen?.fixedScriptText) {
          scriptText = chosen.fixedScriptText;
          scriptName = chosen.name || scriptName;
        }
      }

      if (!scriptText || !scriptText.trim()) {
        scriptText = `Chào mừng tất cả các tình yêu đã có mặt trong phiên livestream đặc biệt ngày hôm nay của shop em nha!
Các chị đẹp ơi, ai đang lướt qua phiên live thì cho em xin một nút thả tim và một lượt chia sẻ để nhận quà mở bát đầu live nào!
Hôm nay shop em mang đến cho cả nhà một siêu phẩm cực kỳ đỉnh cao và độc quyền duy nhất trên sóng livestream!
Đó chính là Bộ Đôi Tinh Chất Serum Tế Bào Gốc Phục Hồi Da Trẻ Hóa và Nước Hoa Cao Cấp lưu hương suốt 12 giờ đồng hồ!
Chị nào mà da đang bị khô ráp, thâm sạm, không đều màu thì nhất định không được bỏ qua phiên live này nhé!
Chỉ sau đúng 7 ngày sử dụng, làn da của các chị sẽ căng bóng, mịn màng và mướt như da em bé luôn ạ!
Duy nhất trong phiên live hôm nay, giảm sốc 50% tặng kèm kem dưỡng ẩm mini và miễn phí giao hàng toàn quốc!
Bên em cam kết 100% hàng chính hãng, bảo hành 1 đổi 1 trong 30 ngày, bấm vào Giỏ Hàng góc trái săn ngay nhé!`;
      }
      
      if (audioPlayerRef.current) {
        audioPlayerRef.current.startScript(scriptText);
      }
      
      window.dispatchEvent(new CustomEvent('aidol_script_updated', {
        detail: { activeScriptTabId: chosen?.id, scriptTabs: scriptTabsList, fixedScriptText: scriptText, isPlaying: true, forceRestart: false }
      }));
      
      const count = scriptText.split(/\r?\n/).filter(Boolean).length;
      showToast(`▶️ Đang phát kịch bản: "${scriptName}" (${count} câu thoại)`, 'success');
    } else {
      if (typeof window !== 'undefined') window.__isScriptLiveRunning = false;
      try { localStorage.setItem('aidol_is_script_live_running', 'false'); } catch (e) {}
      if (audioPlayerRef.current) {
        audioPlayerRef.current.stopScript();
      }
      stopVoiceAudio();
      showToast('⏹️ Đã tạm dừng phát kịch bản bán hàng.', 'info');
    }
  };

  const handleQuickSelectScriptTab = (tabId) => {
    const updated = scriptTabsList.map(t => ({
      ...t,
      active: t.id === tabId
    }));
    const chosen = updated.find(t => t.id === tabId);
    if (!chosen) return;
    setScriptTabsList(updated);
    
    let scriptText = chosen.fixedScriptText || '';
    if (!scriptText || !scriptText.trim()) {
      try {
        const pTabs = JSON.parse(localStorage.getItem('aidol_user_script_tabs_persistent') || '[]');
        const targetPTab = pTabs.find(t => t.id === tabId);
        if (targetPTab?.fixedScriptText && targetPTab.fixedScriptText.trim()) {
          scriptText = targetPTab.fixedScriptText;
        }
      } catch (e) {}
    }
    
    try {
      localStorage.setItem('aidol_user_script_tabs_persistent', JSON.stringify(updated));
      const evConf = JSON.parse(localStorage.getItem('aidol_event_configs') || '{}');
      if (evConf.script_broadcast) {
        evConf.script_broadcast.scriptTabs = updated;
        evConf.script_broadcast.activeScriptTabId = tabId;
        evConf.script_broadcast.fixedScriptText = scriptText;
        localStorage.setItem('aidol_event_configs', JSON.stringify(evConf));
        localStorage.setItem('aidol_event_configs_backup', JSON.stringify(evConf));
      }
    } catch (e) {}
    
    window.dispatchEvent(new CustomEvent('aidol_script_updated', {
      detail: { activeScriptTabId: tabId, scriptTabs: updated, fixedScriptText: scriptText, activeTab: chosen }
    }));

    if (isScriptLiveRunning && audioPlayerRef.current) {
      audioPlayerRef.current.startScript(scriptText);
    }
    const count = (scriptText || '').split(/\r?\n/).filter(Boolean).length;
    showToast(`🎯 Đã chuyển sang kịch bản "${chosen.name}" (${count} câu thoại)!`, 'success');
  };

  // 🔒 Trạng thái video được khoá bởi người dùng (Bảo vệ không bị mất, không bị đổi ngầm)
  const [userLockedMediaUrl, setUserLockedMediaUrl] = useState(() => {
    try {
      return localStorage.getItem('avalive_user_locked_media') || null;
    } catch(e) {
      return null;
    }
  });

  const handleClearActiveVideo = async () => {
    setUserLockedMediaUrl(null);
    try { localStorage.removeItem('avalive_user_locked_media'); } catch (e) {}
    try {
      fetch('/api/clear-media', { method: 'POST' }).catch(() => {});
    } catch (e) {}
    syncMasterLiveState({
      stage: 'idol',
      mediaUrl: null,
      clearMedia: true,
      isVideo: false
    }, socketRef.current);
    showToast('Đã dừng và xóa video phát trực tiếp!', 'info');
  };

  const handleOpenWindowCapture = () => {
    // 🎯 ĐỘ PHÂN GIẢI CHUẨN CAO 1080P SẮC NÉT (CHO OBS / TIKTOK LIVE STUDIO CHỤP KHÔNG BỊ VỠ NÉT)
    const screenW = window.screen.availWidth || window.screen.width || 1920;
    const screenH = window.screen.availHeight || window.screen.height || 1080;
    const height = Math.min(1080, Math.max(720, screenH - 40));
    const width = Math.min(screenW, Math.round((height * 9) / 16));
    const left = Math.max(0, Math.round((screenW - width) / 2));
    const top = Math.max(0, Math.round((screenH - height) / 2));

    // ⚡ BÊ NGUYÊN XI 100% NGUỒN VIDEO ĐANG PHÁT TỪ PHẦN MỀM QUA WINDOW CAPTURE (0ms, 0 byte mạng, siêu nét gốc)
    let activeUrl = (desktopVideoRef.current && (desktopVideoRef.current.currentSrc || desktopVideoRef.current.src)) || currentBlobUrlRef.current || userLockedMediaUrl || '';
    if (!activeUrl && selectedCharacter && Array.isArray(customCharacters)) {
      const match = customCharacters.find(c => c.id === selectedCharacter);
      if (match) activeUrl = match.url || match.mediaUrl || '';
    }
    if (!activeUrl && Array.isArray(customCharacters) && customCharacters.length > 0) {
      const match = customCharacters[0];
      if (match) activeUrl = match.url || match.mediaUrl || '';
    }

    let curTime = 0;
    if (desktopVideoRef.current && typeof desktopVideoRef.current.currentTime === 'number' && !isNaN(desktopVideoRef.current.currentTime)) {
      curTime = desktopVideoRef.current.currentTime;
    } else if (lastPlaybackTimeRef.current > 0) {
      curTime = lastPlaybackTimeRef.current;
    }

    let serverActiveUrl = userLockedMediaUrl || '';
    if (!serverActiveUrl || serverActiveUrl.startsWith('blob:')) {
      const matchChar = customCharacters.find(c => c.id === selectedCharacter);
      if (matchChar && matchChar.mediaUrl && !matchChar.mediaUrl.startsWith('blob:')) {
        serverActiveUrl = matchChar.mediaUrl;
      } else {
        const locked = localStorage.getItem('avalive_user_locked_media');
        if (locked && !locked.startsWith('blob:')) serverActiveUrl = locked;
        const masterState = JSON.parse(localStorage.getItem('avalive_master_live_state') || '{}');
        if (!serverActiveUrl && masterState.mediaUrl && !masterState.mediaUrl.startsWith('blob:')) {
          serverActiveUrl = masterState.mediaUrl;
        }
      }
    }
    if (typeof serverActiveUrl === 'string' && serverActiveUrl.includes('/uploads/')) {
      serverActiveUrl = serverActiveUrl.substring(serverActiveUrl.indexOf('/uploads/'));
    }

    // ⚡ CHUẨN HOÁ BROADCAST URL: Tuyệt đối ưu tiên server URL (/uploads/...) để mọi trình duyệt (Chrome, Safari, Cốc Cốc, OBS, TikTok Live Studio) đều mở được 100%
    const broadcastUrl = serverActiveUrl || (activeUrl && !activeUrl.startsWith('blob:') ? activeUrl : '') || '';

    try {
      localStorage.removeItem('avalive_user_paused');
      localStorage.removeItem('avalive_window_capture_paused');
      localStorage.setItem('avalive_master_live_running', 'true');
      if (broadcastUrl) {
        localStorage.setItem('avalive_active_video_src', broadcastUrl);
        localStorage.setItem('avalive_user_locked_media', broadcastUrl);
      }
      const stateToSave = {
        stage: 'idol',
        mediaUrl: broadcastUrl,
        selectedCharacter: selectedCharacter,
        isVideo: true,
        videoPlaybackEvent: 'play',
        videoCurrentTime: curTime,
        isPlaying: true,
        aspectRatio: globalAspectRatio || '9:16'
      };
      localStorage.setItem('avalive_master_live_state', JSON.stringify(stateToSave));
    } catch (e) {}

    if (broadcastUrl) {
      syncMasterLiveState({
        stage: 'idol',
        selectedCharacter: selectedCharacter,
        mediaUrl: broadcastUrl,
        isVideo: true,
        videoPlaybackEvent: 'play',
        videoCurrentTime: curTime,
        isPlaying: true,
        aspectRatio: globalAspectRatio || '9:16'
      }, socketRef.current);
    }

    const activeBlob = currentFileBlobRef.current || window.__activeMediaBlob || (selectedCharacter && window.__activeMediaBlobMap && window.__activeMediaBlobMap.get(selectedCharacter)) || null;

    try {
      const bc = new BroadcastChannel('avalive_master_live_stream');
      bc.postMessage({
        type: 'GLOBAL_MEDIA_CHANGE',
        mediaUrl: broadcastUrl,
        blobUrl: broadcastUrl,
        fileBlob: activeBlob,
        characterId: selectedCharacter,
        isVideo: true,
        isPlaying: true,
        currentTime: curTime,
        force: true,
        source: 'desktop',
        timestamp: Date.now()
      });
      setTimeout(() => bc.close(), 100);
    } catch (err) {}

    const effectiveV = broadcastUrl || '';

    // ⚡ LƯU TRỰC TIẾP BLOB VÀ BLOB URL TRÊN WINDOW CHO CỬA SỔ WINDOW CAPTURE MỞ 0MS KHÔNG GIẬT LAG
    if (activeBlob) {
      setActiveMedia(activeBlob, 'current_active', { id: selectedCharacter, mediaUrl: broadcastUrl }).catch(() => {});
      if (selectedCharacter) setActiveMedia(activeBlob, selectedCharacter, { id: selectedCharacter, mediaUrl: broadcastUrl }).catch(() => {});
    }

    if (typeof window !== 'undefined') {
      if (activeBlob) {
        window.__activeMediaBlob = activeBlob;
        window.__activeMediaBlobMap = window.__activeMediaBlobMap || new Map();
        if (selectedCharacter) window.__activeMediaBlobMap.set(selectedCharacter, activeBlob);
        if (effectiveV) window.__activeMediaBlobMap.set(effectiveV, activeBlob);
        if (broadcastUrl) window.__activeMediaBlobMap.set(broadcastUrl, activeBlob);
      }
      const activeBlobUrl = currentBlobUrlRef.current || window.__activeMediaBlobUrl || (desktopVideoRef.current && (desktopVideoRef.current.currentSrc || desktopVideoRef.current.src)) || null;
      if (activeBlobUrl) {
        window.__activeMediaBlobUrl = activeBlobUrl;
        window.__activeMediaBlobMap = window.__activeMediaBlobMap || new Map();
        window.__activeMediaBlobMap.set(activeBlobUrl, activeBlob || activeBlobUrl);
        try { localStorage.setItem('avalive_active_video_src', activeBlobUrl); } catch (e) {}
      }
    }

    const charQuery = selectedCharacter ? `&char=${encodeURIComponent(selectedCharacter)}` : '';
    const timeQuery = curTime > 0 ? `&t=${Math.round(curTime * 100) / 100}` : '';
    const vQuery = effectiveV ? `&v=${encodeURIComponent(effectiveV)}` : '';
    const query = `${vQuery}${charQuery}${timeQuery}`;
    const origin = typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null' && !window.location.origin.startsWith('file:')
      ? window.location.origin
      : 'http://localhost:3001';
    const captureUrl = `${origin}/window-capture?mode=window_capture&sound=1&autoplay=1&fit=cover${query}`;
    
    let newWin = null;
    try {
      newWin = window.open(
        captureUrl,
        'avalive_window_capture_target',
        `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes`
      );
    } catch (err) {
      console.warn('[WindowCapture] Popup error, trying fallback:', err);
    }

    if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
      try {
        newWin = window.open(captureUrl, '_blank');
      } catch (e) {
        console.warn('[WindowCapture] Fallback _blank failed:', e);
      }
    }

    // ⚡ TRUYỀN THẲNG FILE BLOB GỐC (1GB - 20GB) VÀO CỬA SỔ CON CHO PHÉP PHÁT 0MS KHÔNG GIẬT LAG
    if (newWin) {
      try {
        newWin.__activeMediaBlob = currentFileBlobRef.current || window.__activeMediaBlob;
        newWin.__activeMediaBlobUrl = currentBlobUrlRef.current || window.__activeMediaBlobUrl;
        newWin.__activeMediaBlobMap = window.__activeMediaBlobMap;
        newWin.focus();
      } catch (e) {}
    }

    showToast('🖥️ Đã mở Cửa Sổ Live 9:16! Khung hình đồng bộ chính xác 100% với phần mềm.', 'success');
  };

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
  const socketRef = useRef(null);
  const flvPlayerRef = useRef(null);
  const hlsPlayerRef = useRef(null);
  const flvVideoRef = useRef(null);
  const flvCanvasRef = useRef(null);
  const currentPlayingUrlRef = useRef(null);
  const lastPlaybackTimeRef = useRef(0);
  const desktopVideoRef = useRef(null);
  const desktopCanvasRef = useRef(null);
  const lastTimeBroadcastRef = useRef(0);
  const isInternalAudioChangeRef = useRef(false);
  const isInternalPlaybackChangeRef = useRef(false);
  const currentFileBlobRef = useRef(null);
  const currentBlobUrlRef = useRef(null);

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
        const ctx = canvas.getContext('2d', { alpha: false });
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

  // 🔄 TỰ ĐỘNG KHÔI PHỤC VÀ ĐỒNG BỘ VIDEO TỪ BACKEND KHI MỞ LẠI PHẦN MỀM
  useEffect(() => {
    fetch('/api/live-state')
      .then(res => res.json())
      .then(data => {
        if (data && data.mediaUrl && !data.clearMedia) {
          setUserLockedMediaUrl(prev => {
            if (!prev) {
              try { localStorage.setItem('avalive_user_locked_media', data.mediaUrl); } catch (e) {}
              return data.mediaUrl;
            }
            return prev;
          });
        }
      })
      .catch(() => {});
  }, []);

  // ⚡ TỰ ĐỘNG PHÁT VIDEO LIÊN TỤC & SIÊU MƯỢT KHI MỞ HOẶC ĐỔI NHÂN VẬT (CHỐNG ĐỨNG HÌNH 100%)
  useEffect(() => {
    const vid = desktopVideoRef.current;
    if (vid) {
      vid.muted = isLocalSpeakerMuted;
      if (!isLocalSpeakerMuted) vid.volume = liveVolume || 1.0;
      
      const isManualPaused = vid.dataset.userPaused === 'true' || localStorage.getItem('avalive_user_paused') === 'true';
      if (!isManualPaused && vid.paused) {
        const playPromise = vid.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsVideoPlaying(true))
            .catch(() => {
              vid.muted = true;
              vid.play().then(() => setIsVideoPlaying(true)).catch(() => {});
            });
        }
      }
    }
  }, [selectedCharacter, userLockedMediaUrl]);

  // 🚀 ĐỒNG BỘ VIDEO TỨC THÌ 0MS CHO WINDOW CAPTURE & OBS BROWSER SOURCE
  useEffect(() => {
    let resolved = userLockedMediaUrl;
    if (!resolved || resolved.startsWith('blob:')) {
      const match = customCharacters?.find(c => c.id === selectedCharacter);
      if (match?.mediaUrl && !match.mediaUrl.startsWith('blob:')) resolved = match.mediaUrl;
      else if (match?.url && !match.url.startsWith('blob:')) resolved = match.url;
    }
    if (resolved && typeof resolved === 'string') {
      try {
        localStorage.setItem('avalive_active_video_src', resolved);
        localStorage.setItem('avalive_user_locked_media', resolved);
      } catch (e) {}
    }
  }, [selectedCharacter, userLockedMediaUrl, customCharacters]);

  // 🔊 ĐỒNG BỘ ÂM LƯỢNG & TẮT/MỞ TIẾNG TỨC THÌ (0MS DELAY - KHÔNG RESTART VIDEO - KHÔNG GIẬT HÌNH)
  useEffect(() => {
    const vid = desktopVideoRef.current;
    if (vid) {
      vid.muted = isLocalSpeakerMuted;
      if (!isLocalSpeakerMuted) {
        vid.volume = (typeof liveVolume === 'number' && liveVolume > 0) ? liveVolume : 1.0;
      }
    }
    const flv = flvVideoRef.current;
    if (flv) {
      flv.muted = isLocalSpeakerMuted;
      if (!isLocalSpeakerMuted) {
        flv.volume = (typeof liveVolume === 'number' && liveVolume > 0) ? liveVolume : 1.0;
      }
    }
    try {
      document.querySelectorAll('video').forEach(v => {
        try {
          v.muted = isLocalSpeakerMuted;
          if (!isLocalSpeakerMuted) {
            v.volume = (typeof liveVolume === 'number' && liveVolume > 0) ? liveVolume : 1.0;
          }
        } catch (e) {}
      });
      document.querySelectorAll('audio').forEach(a => {
        try {
          a.muted = isLocalSpeakerMuted;
          if (!isLocalSpeakerMuted) {
            a.volume = (typeof liveVolume === 'number' && liveVolume > 0) ? liveVolume : 1.0;
          }
        } catch (e) {}
      });
    } catch (err) {}
  }, [isLocalSpeakerMuted, liveVolume]);

  // 🛡️ BACKGROUND KEEP-ALIVE CHO PHẦN MỀM CHÍNH: CHỐNG ĐÓNG BĂNG/DỪNG VIDEO KHI CHUYỂN TAB HOẶC ẨN CỬA SỔ
  useEffect(() => {
    let wakeLock = null;
    let bgWorker = null;

    const requestWakeLock = () => {
      if ('wakeLock' in navigator && !wakeLock) {
        try {
          navigator.wakeLock.request('screen').then(s => { 
            wakeLock = s;
            s.addEventListener('release', () => { wakeLock = null; });
          }).catch(() => {});
        } catch (e) {}
      }
    };

    requestWakeLock();
    window.addEventListener('click', requestWakeLock, { passive: true, once: true });
    window.addEventListener('pointerdown', requestWakeLock, { passive: true, once: true });

    try {
      const blob = new Blob([
        "let t; self.onmessage=e=>{ if(e.data==='start'){ if(!t) t=setInterval(()=>self.postMessage('tick'), 1000); } else if(e.data==='stop'){ clearInterval(t); t=null; } };"
      ], { type: 'application/javascript' });
      bgWorker = new Worker(URL.createObjectURL(blob));
      bgWorker.onmessage = () => {
        const vid = desktopVideoRef.current;
        if (vid && document.hidden) {
          const isPaused = vid.dataset.userPaused === 'true' || localStorage.getItem('avalive_user_paused') === 'true';
          if (!isPaused && vid.paused && !vid.ended && vid.readyState >= 2) {
            vid.play().catch(() => {});
          }
        }
      };
      bgWorker.postMessage('start');
    } catch (e) {}

    const handleVisibility = () => {
      const vid = desktopVideoRef.current;
      if (!vid) return;
      const isPaused = vid.dataset.userPaused === 'true' || localStorage.getItem('avalive_user_paused') === 'true';
      if (!isPaused && vid.paused) {
        vid.play().catch(() => {});
      }
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
      window.removeEventListener('click', requestWakeLock);
      window.removeEventListener('pointerdown', requestWakeLock);
      if (bgWorker) {
        try { bgWorker.postMessage('stop'); bgWorker.terminate(); } catch (e) {}
      }
      if (wakeLock) {
        try { wakeLock.release(); } catch (e) {}
      }
    };
  }, []);
  const lastAiCommentTime = useRef(0);
  const lastAiGreetingTime = useRef(0);
  const greetedUsernamesRef = useRef(new Set());
  const thankedGiftUsersRef = useRef(new Map());
  const [isTemplateLibraryOpen, setIsTemplateLibraryOpen] = useState(false);


  const getPlayableStreamUrl = (rawUrl) => {
    if (!rawUrl) return '';
    if (rawUrl.includes('/api/stream-proxy')) return rawUrl;
    const backendOrigin = typeof window !== 'undefined' ? (window.location.port === '5173' || window.location.port === '3000' || window.location.port === '3001' ? `${window.location.protocol}//${window.location.hostname}:3001` : window.location.origin) : 'http://127.0.0.1:3001';
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
        // Nếu URL là blob: thì chắc chắn nó là của phiên cũ đã chết, phải tạo lại từ fileData!
        if ((!finalUrl || finalUrl.startsWith('blob:')) && c.fileData) {
          try {
            finalUrl = URL.createObjectURL(c.fileData);
          } catch (e) {
            finalUrl = '';
          }
        }
        const isVid = c.type === 'video' || 
          (c.fileData && c.fileData.type && c.fileData.type.startsWith('video/')) ||
          (c.mediaUrl && /\.(mp4|webm|mov|mkv|avi|m4v)(\?.*)?$/i.test(c.mediaUrl)) ||
          (c.url && /\.(mp4|webm|mov|mkv|avi|m4v)(\?.*)?$/i.test(c.url)) ||
          (c.name && /\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(c.name)) ||
          (c.name && /video|nhép|lipsync|livestream/i.test(c.name));

        const cleanName = c.name ? (c.name.length > 22 ? c.name.substring(0, 20) + '…' : c.name) : 'AIDOL của tôi';

        return {
          id: c.id,
          name: cleanName,
          type: isVid ? 'video' : (c.type || 'image'),
          url: finalUrl,
          mediaUrl: c.mediaUrl || (finalUrl && !finalUrl.startsWith('blob:') ? finalUrl : ''),
          fileData: c.fileData
        };
      });
      setCustomCharacters(loadedChars);

      if (selectedCharacter && loadedChars.some(item => item.id === selectedCharacter)) {
        const activeChar = loadedChars.find(item => item.id === selectedCharacter);
        if (activeChar && activeChar.url) {
          setUserLockedMediaUrl(activeChar.url);
          if (desktopVideoRef.current && desktopVideoRef.current.src !== activeChar.url) {
            desktopVideoRef.current.src = activeChar.url;
            desktopVideoRef.current.currentTime = 0;
            desktopVideoRef.current.dataset.userPaused = 'false';
            desktopVideoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
          }
        }
      }

      // Tự động nâng cấp fileData lên máy chủ để lấy link HTTP vĩnh viễn (chống đen màn hình trên OBS / TikTok Live Studio)
      filtered.forEach(async (c) => {
        if (c.fileData && (!c.mediaUrl || c.mediaUrl.startsWith('blob:'))) {
          try {
            const formData = new FormData();
            formData.append('file', c.fileData);
            
            const currentPort = typeof window !== 'undefined' && window.location.port ? window.location.port : '3001';
            const currentHost = typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : '127.0.0.1';
            const currentProto = typeof window !== 'undefined' && window.location.protocol ? window.location.protocol : 'http:';

            const candidateEndpoints = [
              '/api/upload-media',
              `${currentProto}//${currentHost}:${currentPort}/api/upload-media`,
              `${currentProto}//${currentHost}:3001/api/upload-media`,
              'http://127.0.0.1:3001/api/upload-media',
              'http://localhost:3001/api/upload-media'
            ];

            let uploadedServerUrl = null;
            for (const ep of candidateEndpoints) {
              try {
                const res = await fetch(ep, { method: 'POST', body: formData });
                if (res.ok) {
                  const data = await res.json();
                  if (data && data.url) {
                    let serverUrl = data.url;
                    if (serverUrl.startsWith('http://') || serverUrl.startsWith('https://')) {
                      uploadedServerUrl = serverUrl;
                    } else {
                      const baseDomain = currentHost === 'localhost' || currentHost === '127.0.0.1' ? 'http://127.0.0.1:3001' : `${currentProto}//${currentHost}:${currentPort === '5173' ? '3001' : currentPort}`;
                      uploadedServerUrl = `${baseDomain}${serverUrl.startsWith('/') ? '' : '/'}${serverUrl}`;
                    }
                    break;
                  }
                }
              } catch (err) {}
            }

            if (uploadedServerUrl) {
              await saveCharacterToIDB({ ...c, mediaUrl: uploadedServerUrl, url: uploadedServerUrl });
              setCustomCharacters(prev => {
                const updatedList = prev.map(item => item.id === c.id ? { ...item, url: uploadedServerUrl } : item);
                try { localStorage.setItem('avalive_custom_characters', JSON.stringify(updatedList)); } catch (e) {}
                return updatedList;
              });
              
              // ĐỒNG BỘ NGAY NẾU VIDEO VỪA UPLOAD LÀ VIDEO ĐANG ĐƯỢC CHỌN
              if (selectedCharacter === c.id) {
                 syncMasterLiveState({
                    mediaUrl: uploadedServerUrl,
                    videoPlaybackEvent: 'play',
                    isPlaying: true
                 }, socketRef.current);
              }
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

  // Trạng thái Chạy Demo / Test Toàn Cục (1 Nút Duy Nhất cho tất cả Game / Idol)
  const [isGlobalDemoRunning, setIsGlobalDemoRunning] = useState(false);
  const globalDemoTimerRef = useRef(null);

  // ⚡ TRẠNG THÁI AUTO CHẠY TỰ ĐỘNG 24/24 (Hỗ trợ AI Idol, Game Chiến Đấu, Game Bản Đồ & Tự Vượt Captcha)
  const [isAuto247Running, setIsAuto247Running] = useState(false);
  const auto247TimerRef = useRef(null);

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
    isConnected: isConnected || isScriptLiveRunning || isGlobalDemoRunning || isMasterLiveRunning, // Chỉ kích hoạt khi Live thực tế, Kịch bản Live hoặc Demo được người dùng chủ động bật
    activeBrainPack: 'talk', // mặc định
    onVoiceReply: ({ text, action, baseVideoItem, preRecordedCat, voiceId, voiceChannel, isTest }) => {
      unlockAllAudio();
      // Nếu đang tắt tiếng Voice Test trong Bảng Giả Lập thì không phát âm thanh test
      if (isTest && isSimVoiceMutedRef.current) return;
      // Gọi AIAudioPlayer để phát giọng nói với đúng Voice đã cài đặt cho tab sự kiện
      if (audioPlayerRef.current) {
        audioPlayerRef.current.enqueueItem(text, action, false, { voiceId, voiceChannel, isTest });
      }
      
      // Tự động phát video sự kiện (Chào hỏi, Trả lời bình luận, Tặng quà, Chốt đơn...) lên Sân Khấu Chính
      if (baseVideoItem && (baseVideoItem.mediaUrl || baseVideoItem.url)) {
        const vidUrl = baseVideoItem.mediaUrl || baseVideoItem.url;
        setActiveVideoItem(baseVideoItem);
        syncMasterLiveState({
          stage: 'idol',
          mediaUrl: vidUrl,
          characterName: baseVideoItem.name || 'AI Idol Event Video',
          isVideo: true,
          videoPlaybackEvent: 'play',
          isPlaying: true
        }, socketRef.current);
      }
    }
  });

  // 📌 SẢN PHẨM ĐANG GHIM THEO THỜI GIAN THỰC (AI & VIDEO PIN ENGINE)
  const [livePinnedProduct, setLivePinnedProduct] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_current_pinned_product');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // 🎭 OVERLAY ĐA LỚP TỪ SEQUENCER (HÌNH ẢNH / BANNER / TIÊU ĐỀ KHUYẾN MÃI)
  const [flowSequencerOverlay, setFlowSequencerOverlay] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_sequencer_overlay');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    const handlePinnedProductUpdate = (e) => {
      if (e?.detail?.product) {
        setLivePinnedProduct(e.detail.product);
      }
    };
    window.addEventListener('avalive:pin_product_updated', handlePinnedProductUpdate);
    return () => window.removeEventListener('avalive:pin_product_updated', handlePinnedProductUpdate);
  }, []);

  // Tự động nhận diện và ghim sản phẩm khi video clip của sản phẩm phát
  useEffect(() => {
    if (activeVideoItem?.mediaUrl) {
      autoPinProductService.detectAndAutoPinByVideo(activeVideoItem.mediaUrl);
    }
  }, [activeVideoItem]);

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

  // ⏱️ QUẢN LÝ THỜI GIAN LIVE VÀ TRỪ ĐIỂM TOKEN REALTIME
  useEffect(() => {
    if (!isMasterLiveRunning && !isConnected) return;

    // Định kỳ 60 giây (1 phút) trừ 1 phút phát Live cho toàn bộ tài khoản (kể cả Admin)
    const liveTimer = setInterval(() => {
      setCurrentUser(prevUser => {
        if (!prevUser) return prevUser;

        const currentMinutes = typeof prevUser.liveMinutes === 'number' ? prevUser.liveMinutes : 60;
        const newMinutes = Math.max(0, currentMinutes - 1);

        if (newMinutes <= 0 && !prevUser.isAdmin) {
          setIsMasterLiveRunning(false);
          setIsConnected(false);
          showToast('🔴 Hết thời gian phát Live! Vui lòng nâng cấp gói VIP hoặc gia hạn thêm giờ live.', 'error');
        }

        const updated = {
          ...prevUser,
          liveMinutes: newMinutes,
          liveTimeHours: Math.round(newMinutes / 60)
        };
        try {
          localStorage.setItem('avalive_current_user', JSON.stringify(updated));
          if (updated.email && updated.email !== 'khachhang@avalive.com' && supabase) {
            supabase.from('users').update({ live_minutes: newMinutes }).eq('email', updated.email.toLowerCase().trim()).then(() => {});
          }
          window.dispatchEvent(new Event('avalive:user_updated'));
        } catch (e) {}
        return updated;
      });
    }, 60000);

    return () => clearInterval(liveTimer);
  }, [isMasterLiveRunning, isConnected]);

  // Auto-deduct tokens when live session is active (AI Brain & Server)
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

  const handleDragStart = (e) => {
    setIsDraggingWebcam(true);
    dragStartPos.current = {
      x: e.clientX - webcamPos.x,
      y: e.clientY - webcamPos.y
    };
  };


  // 🎬 TỰ ĐỘNG ĐỒNG BỘ VIDEO GẦN NHẤT TỪ MÁY CHỦ KHI KHỞI CHẠY PHẦN MỀM
  useEffect(() => {
    fetch('/api/live-state')
      .then(res => res.json())
      .then(data => {
        if (data && data.mediaUrl && typeof data.mediaUrl === 'string' && !data.clearMedia && !data.mediaUrl.includes('default_idol.mp4')) {
          const remoteUrl = data.mediaUrl;
          setUserLockedMediaUrl(remoteUrl);
          try { localStorage.setItem('avalive_user_locked_media', remoteUrl); } catch (e) {}
        }
      })
      .catch(() => {});
  }, []);



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
      try {
        stopVoiceAudio();
      } catch (e) {}
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('global-stop-demo'));
        window.dispatchEvent(new CustomEvent('avalive_emergency_stop_all'));
      }
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
      }, 2500);
    } else {
      // 3. Kích hoạt Demo AI Idol Live
      unlockAllAudio();
      const mockEvt = SIMULATION_EVENTS[0];
      handleLiveEvent(mockEvt.type, { ...mockEvt.payload, isTest: true });
      globalDemoTimerRef.current = setInterval(() => {
        const rand = SIMULATION_EVENTS[Math.floor(Math.random() * SIMULATION_EVENTS.length)];
        handleLiveEvent(rand.type, { ...rand.payload, isTest: true });
      }, 6000);
    }
  }, [isGlobalDemoRunning, isGameBanDoActive, isGameBattleActive, handleLiveEvent, SIMULATION_EVENTS, unlockAllAudio]);

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
  }, [isAuto247Running]);

  const handleAudioTest = useCallback(async (role = 'game') => {
    await unlockAllAudio();
    let text = 'Hệ thống âm thanh nhạc nền, hiệu ứng và Voice AI đã kích hoạt sẵn sàng trên livestream!';
    if (role === 'idol') {
      text = 'Chào mọi người, em là Idol livestream đây ạ! Các tình yêu nghe giọng em có rõ không? Bấm vào màn hình thả tim ủng hộ em nhé!';
    } else if (role === 'manager') {
      text = 'Dạ em chào quý khách, em là trợ lý bán hàng trực tuyến! Hệ thống giỏ hàng và ưu đãi giảm giá 50% đã sẵn sàng!';
    } else {
      bandoAudio.playWarHorn({ force: true });
    }
    
    // Phát âm thanh Voice AI trực tiếp 100% chuẩn theo voice đã cấu hình
    previewVoiceAudio(role, text, { isTest: true, priority: true });
    showToast(`🔊 Đang phát kiểm tra âm thanh Giọng ${role === 'idol' ? 'Idol' : role === 'manager' ? 'Trợ lý' : 'Game'}!`, 'success');
  }, [unlockAllAudio]);

  // 🔇 Xử lý Tắt/Mở Tiếng Loa Máy Tính (Độc Lập 100%, Phiên Live & Window Capture vẫn có tiếng bình thường)
  const handleToggleLocalSpeakerMute = useCallback(() => {
    setIsLocalSpeakerMuted(prev => {
      const nextState = !prev;
      isLocalSpeakerMutedRef.current = nextState;
      try { localStorage.setItem('avalive_local_speaker_muted', nextState.toString()); } catch(e) {}

      // 1. Tắt/Mở tiếng video trên màn hình điều khiển xem trước của máy tính
      if (desktopVideoRef.current) {
        desktopVideoRef.current.muted = nextState;
        if (!nextState) {
          desktopVideoRef.current.volume = (typeof liveVolume === 'number' && liveVolume > 0) ? liveVolume : 1.0;
        }
      }
      if (flvVideoRef.current) {
        flvVideoRef.current.muted = nextState;
        if (!nextState) {
          flvVideoRef.current.volume = (typeof liveVolume === 'number' && liveVolume > 0) ? liveVolume : 1.0;
        }
      }

      // 2. Quét tất cả thẻ <video> & <audio> trên giao diện để tắt tiếng loa máy tính
      try {
        document.querySelectorAll('video').forEach(v => {
          try {
            v.muted = nextState;
            if (!nextState) {
              v.volume = (typeof liveVolume === 'number' && liveVolume > 0) ? liveVolume : 1.0;
              if (v.paused && v.dataset.userPaused !== 'true') {
                v.play().catch(() => {});
              }
            }
          } catch (err) {}
        });
        document.querySelectorAll('audio').forEach(a => {
          try {
            a.muted = nextState;
            if (!nextState) {
              a.volume = (typeof liveVolume === 'number' && liveVolume > 0) ? liveVolume : 1.0;
            }
          } catch (err) {}
        });
      } catch (err) {}

      // 3. Tắt/Mở tiếng Loa xem trước của Audio Engine máy tính
      if (bandoAudio?.setLocalSpeakerMute) bandoAudio.setLocalSpeakerMute(nextState);

      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx && window.__avaLiveAudioContext?.state === 'suspended' && !nextState) {
          window.__avaLiveAudioContext.resume().catch(() => {});
        }
      } catch(e) {}

      showToast(nextState ? '🔇 Đã tắt loa máy tính (Phiên Live vẫn phát tiếng 100%)' : '🔊 Đã mở loa máy tính', 'info');
      return nextState;
    });
  }, [liveVolume]);

  const handleSelectCharacter = useCallback((charId) => {
    const charItem = customCharacters.find(c => c.id === charId);
    if (!charItem) return;
    let charUrl = charItem.mediaUrl || charItem.url;
    setSelectedCharacter(charId);
    try { localStorage.setItem('avalive_selected_char', charId); } catch (e) {}
    setIsGameBattleActive(false);
    setIsGameBanDoActive(false);

    const memBlob = (typeof window !== 'undefined' && window.__activeMediaBlobMap && window.__activeMediaBlobMap.get(charId)) || charItem.fileData || charItem.fileBlob || (typeof window !== 'undefined' && window.__activeMediaBlob) || null;
    let fileBlob = memBlob;
    let blobUrl = fileBlob ? URL.createObjectURL(fileBlob) : ((charItem.url && charItem.url.startsWith('blob:')) ? charItem.url : null);

    if (fileBlob) {
      currentFileBlobRef.current = fileBlob;
      if (blobUrl) currentBlobUrlRef.current = blobUrl;
      setActiveMedia(fileBlob, charId, { id: charId, name: charItem.name, mediaUrl: charUrl }).catch(() => {});
      setActiveMedia(fileBlob, 'current_active', { id: charId, name: charItem.name, mediaUrl: charUrl }).catch(() => {});
      if (typeof window !== 'undefined') {
        window.__activeMediaBlob = fileBlob;
        window.__activeMediaBlobUrl = blobUrl;
        window.__activeMediaBlobMap = window.__activeMediaBlobMap || new Map();
        window.__activeMediaBlobMap.set(charItem.id, fileBlob);
        if (charUrl) window.__activeMediaBlobMap.set(charUrl, fileBlob);
        if (blobUrl) window.__activeMediaBlobMap.set(blobUrl, fileBlob);
      }
    }

    let cleanUrl = charUrl || '';
    if (typeof cleanUrl === 'string' && cleanUrl.includes('/uploads/')) {
      cleanUrl = cleanUrl.substring(cleanUrl.indexOf('/uploads/'));
    }
    if (cleanUrl) {
      setUserLockedMediaUrl(cleanUrl);
      try {
        localStorage.setItem('avalive_user_locked_media', cleanUrl);
        localStorage.setItem('avalive_active_video_src', blobUrl || cleanUrl);
      } catch (e) {}
    }

    const playSrc = blobUrl || cleanUrl;
    if (playSrc && desktopVideoRef.current) {
      desktopVideoRef.current.src = playSrc;
      desktopVideoRef.current.currentTime = 0;
      desktopVideoRef.current.dataset.userPaused = 'false';
      desktopVideoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
    }
    setIsVideoPlaying(true);

    const finalServerMediaUrl = (cleanUrl && !cleanUrl.startsWith('blob:')) ? cleanUrl : '';

    try {
      const bc = new BroadcastChannel('avalive_master_live_stream');
      bc.postMessage({
        type: 'GLOBAL_MEDIA_CHANGE',
        mediaUrl: finalServerMediaUrl || blobUrl,
        blobUrl: blobUrl,
        fileBlob: fileBlob,
        characterId: charItem.id,
        characterName: charItem.name || 'AI Idol',
        isVideo: true,
        isPlaying: true,
        currentTime: 0,
        force: true,
        source: 'desktop',
        timestamp: Date.now()
      });
      setTimeout(() => bc.close(), 100);
    } catch (e) {}

    sendVideoControl({
      action: 'play',
      currentTime: 0,
      isPlaying: true,
      force: true,
      mediaUrl: finalServerMediaUrl || blobUrl,
      timestamp: Date.now()
    }, socketRef.current);

    syncMasterLiveState({
      stage: 'idol',
      selectedCharacter: charItem.id,
      characterName: charItem.name || 'AI Idol',
      mediaUrl: finalServerMediaUrl || null,
      isVideo: true,
      videoPlaybackEvent: 'play',
      isPlaying: true,
      aspectRatio: globalAspectRatio || '9:16'
    }, socketRef.current);

    // 🚀 Nếu chưa có server URL (/uploads/...), tự động kích hoạt fastStreamUpload để lấy link server ngay trong 2ms cho TikTok Live Studio
    if (!finalServerMediaUrl && fileBlob) {
      fastStreamUpload(fileBlob, {
        onInit: ({ fileUrl }) => {
          if (fileUrl) {
            setUserLockedMediaUrl(fileUrl);
            try { localStorage.setItem('avalive_user_locked_media', fileUrl); } catch(e) {}
            syncMasterLiveState({
              stage: 'idol',
              selectedCharacter: charItem.id,
              characterName: charItem.name || 'AI Idol',
              mediaUrl: fileUrl,
              isVideo: true,
              videoPlaybackEvent: 'play',
              isPlaying: true,
              aspectRatio: globalAspectRatio || '9:16'
            }, socketRef.current);
          }
        }
      }).catch(() => {});
    }
  }, [customCharacters, globalAspectRatio]);

  // Nút Bật/Tắt Video trên màn hình phần mềm: độc lập 100%, dùng để xem thử / kiểm tra video
  const toggleDesktopVideoPlayback = useCallback(() => {
    const vid = desktopVideoRef.current;
    if (isVideoPlaying) {
      if (vid) {
        vid.pause();
        vid.dataset.userPaused = 'true';
      }
      setIsVideoPlaying(false);
      showToast('⏸️ Đã tạm dừng video xem thử trên phần mềm', 'info');
    } else {
      if (vid) {
        vid.dataset.userPaused = 'false';
        if (isLocalSpeakerMuted) {
          vid.muted = true;
        } else {
          vid.muted = false;
          vid.volume = liveVolume;
        }
        vid.play().catch(() => {
          vid.muted = true;
          vid.play().catch(() => {});
        });
      }
      setIsVideoPlaying(true);
      showToast('▶️ Đang tiếp tục phát video xem thử trên phần mềm', 'success');
    }
  }, [isVideoPlaying, isLocalSpeakerMuted, liveVolume]);

  // Phím tắt thông minh [Phím Cách / Space] điều khiển Tạm dừng / Tiếp tục Video trên khung hình
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (e.target.isContentEditable) return;
      if (isGameBattleActive || isGameBanDoActive) return;

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        toggleDesktopVideoPlayback();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleDesktopVideoPlayback, isGameBattleActive, isGameBanDoActive]);

  const toggleLiveAudioMute = useCallback(() => {
    handleToggleLocalSpeakerMute();
  }, [handleToggleLocalSpeakerMute]);

  const handleLiveVolumeChange = useCallback((newVol) => {
    setLiveVolume(newVol);
    const isMutedNow = newVol === 0;
    setLiveAudioMuted(isMutedNow);
    try {
      localStorage.setItem('avalive_video_volume', String(newVol));
      localStorage.setItem('avalive_overlay_volume', String(newVol));
      localStorage.setItem('avalive_audio_muted', String(isMutedNow));
      localStorage.setItem('avalive_overlay_audio_muted', String(isMutedNow));
    } catch (e) {}

    if (desktopVideoRef.current) {
      desktopVideoRef.current.volume = newVol;
      desktopVideoRef.current.muted = isMutedNow;
    }
    if (flvVideoRef.current) {
      flvVideoRef.current.volume = newVol;
      flvVideoRef.current.muted = isMutedNow;
    }
    try {
      document.querySelectorAll('video').forEach(v => {
        try {
          v.volume = newVol;
          v.muted = isMutedNow;
        } catch (e) {}
      });
      document.querySelectorAll('audio').forEach(a => {
        try {
          a.volume = newVol;
          a.muted = isMutedNow;
        } catch (e) {}
      });
    } catch (e) {}

    bandoAudio.setMasterVolume(newVol);
    bandoAudio.setMuted(isMutedNow);

    try {
      const bc = new BroadcastChannel('avalive_master_live_stream');
      bc.postMessage({
        type: 'GLOBAL_AUDIO_CHANGE',
        isMuted: isMutedNow,
        volume: newVol,
        source: 'desktop',
        timestamp: Date.now()
      });
      setTimeout(() => bc.close(), 100);
    } catch (e) {}

    syncMasterLiveState({
      isVideoAudioMuted: isMutedNow,
      videoVolume: newVol
    }, socketRef.current);
    sendVideoControl({
      action: 'audio_sync',
      isMuted: isMutedNow,
      volume: newVol
    }, socketRef.current);
  }, []);

  // Đồng bộ trạng thái Local Mute nếu có component khác thay đổi
  useEffect(() => {
    const handleMuteSync = (e) => {
      if (e.detail && typeof e.detail.isMuted === 'boolean') {
        setIsLocalSpeakerMuted(e.detail.isMuted);
        isLocalSpeakerMutedRef.current = e.detail.isMuted;
      }
    };
    window.addEventListener('avalive_local_mute_change', handleMuteSync);
    return () => window.removeEventListener('avalive_local_mute_change', handleMuteSync);
  }, []);

  // 🔄 ĐỒNG BỘ 2 CHIỀU KHỚP TỪNG KHUNG HÌNH GIỮA PHẦN MỀM CHÍNH VÀ CỬA SỔ WINDOW CAPTURE OBS
  useEffect(() => {
    let bc = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        bc = new BroadcastChannel('avalive_master_live_stream');
        bc.onmessage = (event) => {
          if (!event.data) return;

          // 0. Phản hồi yêu cầu lấy Video, mốc thời gian & trạng thái gốc từ Window Capture OBS vừa mở
          if (event.data.type === 'REQUEST_MASTER_LIVE_STATE' || event.data.type === 'REQUEST_CURRENT_MEDIA') {
            const vid = desktopVideoRef.current;
            const curTime = vid ? vid.currentTime : (lastPlaybackTimeRef.current || 0);
            const isPlaying = vid ? !vid.paused : isMasterLiveRunning;
            const charMatch = (customCharacters && Array.isArray(customCharacters)) ? customCharacters.find(c => c.id === selectedCharacter) : null;
            let playUrl = (charMatch ? (charMatch.mediaUrl || charMatch.url) : null) || userLockedMediaUrl || null;
            const blobUrl = (charMatch && charMatch.url && charMatch.url.startsWith('blob:')) ? charMatch.url : (currentBlobUrlRef.current || window.__activeMediaBlobUrl || null);
            let fileBlob = (charMatch && (charMatch.fileData || charMatch.fileBlob)) || currentFileBlobRef.current || window.__activeMediaBlob || (selectedCharacter && window.__activeMediaBlobMap && window.__activeMediaBlobMap.get(selectedCharacter)) || null;

            const sendResponse = (blob) => {
              if (typeof playUrl === 'string' && playUrl.includes('/uploads/')) {
                playUrl = playUrl.substring(playUrl.indexOf('/uploads/'));
              }
              try {
                bc.postMessage({
                  type: 'RESPONSE_CURRENT_MEDIA',
                  mediaUrl: playUrl,
                  blobUrl: blobUrl,
                  fileBlob: blob,
                  selectedCharacter: selectedCharacter,
                  characterId: selectedCharacter,
                  characterName: charMatch ? charMatch.name : '',
                  currentTime: curTime,
                  isPlaying: isPlaying,
                  isVideo: true,
                  force: true,
                  timestamp: Date.now()
                });
                bc.postMessage({
                  type: 'MASTER_TIME_SYNC',
                  currentTime: curTime,
                  isPlaying: isPlaying,
                  selectedCharacter: selectedCharacter,
                  mediaUrl: playUrl,
                  blobUrl: blobUrl,
                  fileBlob: blob,
                  force: true,
                  isMuted: isLocalSpeakerMuted,
                  timestamp: Date.now()
                });
              } catch (e) {}
            };

            if (fileBlob) {
              sendResponse(fileBlob);
            } else {
              loadAllAidolItems().then(items => {
                const found = items && items.find(it => (it.id && it.id === selectedCharacter) || (playUrl && it.mediaUrl === playUrl));
                sendResponse(found?.fileBlob || null);
              }).catch(() => sendResponse(null));
            }
            return;
          }

          // 1. Đồng bộ Phát / Tạm dừng 2 chiều giữa Phần Mềm và Window Capture / TikTok Live Studio
          if (event.data.type === 'GLOBAL_PLAYBACK_CHANGE') {
            if (event.data.source === 'desktop') return;
            const shouldPlay = !!event.data.isPlaying;
            isInternalPlaybackChangeRef.current = true;
            setIsMasterLiveRunning(shouldPlay);
            setIsVideoPlaying(shouldPlay);

            if (typeof event.data.currentTime === 'number' && desktopVideoRef.current) {
              try {
                if (event.data.force && Math.abs(desktopVideoRef.current.currentTime - event.data.currentTime) > 1.5) {
                  desktopVideoRef.current.currentTime = event.data.currentTime;
                }
              } catch (e) {}
            }

            if (!shouldPlay) {
              try { 
                localStorage.setItem('avalive_user_paused', 'true');
                localStorage.setItem('avalive_window_capture_paused', 'true');
              } catch (e) {}
              if (desktopVideoRef.current) {
                desktopVideoRef.current.dataset.userPaused = 'true';
                try { desktopVideoRef.current.pause(); } catch (e) {}
              }
            } else {
              try { 
                localStorage.removeItem('avalive_user_paused');
                localStorage.removeItem('avalive_window_capture_paused');
              } catch (e) {}
              if (desktopVideoRef.current) {
                desktopVideoRef.current.dataset.userPaused = 'false';
                try { desktopVideoRef.current.play().catch(() => {}); } catch (e) {}
              }
            }
            setTimeout(() => { isInternalPlaybackChangeRef.current = false; }, 300);
          }

          // 1.5. Đồng bộ đổi Video Nhân Vật tức thì từ Window Capture sang Phần Mềm
          if (event.data.type === 'GLOBAL_MEDIA_CHANGE') {
            if (event.data.source === 'desktop') return;
            const newUrl = event.data.mediaUrl;
            const newCharId = event.data.characterId || event.data.selectedCharacter;
            if (newUrl) {
              setUserLockedMediaUrl(newUrl);
              try { localStorage.setItem('avalive_user_locked_media', newUrl); } catch (e) {}
              if (newCharId) {
                setSelectedCharacter(newCharId);
                try { localStorage.setItem('avalive_selected_char', newCharId); } catch (e) {}
              }
              if (desktopVideoRef.current) {
                desktopVideoRef.current.src = newUrl;
                desktopVideoRef.current.currentTime = 0;
                desktopVideoRef.current.dataset.userPaused = 'false';
                desktopVideoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
              }
              setIsVideoPlaying(true);
              setIsMasterLiveRunning(true);
            }
          }

          // 2. Quản lý Âm Lượng & Mute đồng bộ 2 chiều
          if (event.data.type === 'GLOBAL_AUDIO_CHANGE') {
            if (event.data.source === 'desktop') return;
            const isMuted = !!event.data.isMuted;
            const vol = typeof event.data.volume === 'number' ? event.data.volume : 1;
            isInternalAudioChangeRef.current = true;
            setIsLocalSpeakerMuted(isMuted);
            isLocalSpeakerMutedRef.current = isMuted;
            setLiveAudioMuted(isMuted);
            setLiveVolume(vol);
            if (desktopVideoRef.current) {
              desktopVideoRef.current.muted = isMuted;
              if (!isMuted) {
                desktopVideoRef.current.volume = vol;
              }
            }
            if (flvVideoRef.current) {
              flvVideoRef.current.muted = isMuted;
              if (!isMuted) {
                flvVideoRef.current.volume = vol;
              }
            }
            setTimeout(() => { isInternalAudioChangeRef.current = false; }, 300);
          }

          // 2.5. Đồng bộ Âm lượng Voice AI giữa các cửa sổ
          if (event.data.type === 'GLOBAL_VOICE_VOLUME_CHANGE') {
            if (event.data.source === 'desktop') return;
            const vVol = typeof event.data.voiceVolume === 'number' ? event.data.voiceVolume : 1;
            try { localStorage.setItem('avalive_voice_volume', String(vVol)); } catch (e) {}
          }
        };
      } catch (err) {}
    }

    // Lắng nghe qua Storage Event (Dành cho đa cửa sổ trên hệ điều hành Windows)
    const handleStorage = (e) => {
      if (e.key === 'avalive_user_paused') {
        const isPaused = e.newValue === 'true';
        isInternalPlaybackChangeRef.current = true;
        setIsMasterLiveRunning(!isPaused);
        if (isPaused) {
          setIsVideoPlaying(false);
          if (desktopVideoRef.current) {
            desktopVideoRef.current.dataset.userPaused = 'true';
            try { desktopVideoRef.current.pause(); } catch (e) {}
          }
          document.querySelectorAll('video, audio').forEach(el => {
            try {
              el.dataset.userPaused = 'true';
              el.pause();
            } catch (err) {}
          });
          if (typeof bandoAudio.pauseAll === 'function') bandoAudio.pauseAll();
          if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
        } else {
          setIsVideoPlaying(true);
          if (desktopVideoRef.current) {
            desktopVideoRef.current.dataset.userPaused = 'false';
            try { desktopVideoRef.current.play().catch(() => {}); } catch (e) {}
          }
          document.querySelectorAll('video').forEach(el => {
            try {
              el.dataset.userPaused = 'false';
              el.play().catch(() => {});
            } catch (err) {}
          });
        }
        setTimeout(() => { isInternalPlaybackChangeRef.current = false; }, 300);
      }

      if (e.key === 'avalive_audio_muted' || e.key === 'avalive_local_speaker_muted') {
        const isMuted = e.newValue === 'true';
        isInternalAudioChangeRef.current = true;
        setIsLocalSpeakerMuted(isMuted);
        isLocalSpeakerMutedRef.current = isMuted;
        setLiveAudioMuted(isMuted);
        if (desktopVideoRef.current) {
          desktopVideoRef.current.muted = isMuted;
          if (!isMuted) {
            desktopVideoRef.current.volume = liveVolume || 1;
          }
        }
        if (flvVideoRef.current) {
          flvVideoRef.current.muted = isMuted;
          if (!isMuted) {
            flvVideoRef.current.volume = liveVolume || 1;
          }
        }
        setTimeout(() => { isInternalAudioChangeRef.current = false; }, 300);
      }

      if (e.key === 'avalive_video_volume') {
        const vol = parseFloat(e.newValue || '1');
        isInternalAudioChangeRef.current = true;
        setLiveVolume(vol);
        if (desktopVideoRef.current) desktopVideoRef.current.volume = vol;
        if (flvVideoRef.current) flvVideoRef.current.volume = vol;
        setTimeout(() => { isInternalAudioChangeRef.current = false; }, 300);
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      if (bc) {
        try { bc.close(); } catch (e) {}
      }
      window.removeEventListener('storage', handleStorage);
    };
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
  const handleLiveEventRef = useRef(handleLiveEvent);
  handleLiveEventRef.current = handleLiveEvent;

  const handleSimEvent = useCallback((type, payload = {}) => {
    unlockAllAudio();
    if (handleLiveEventRef.current) {
      handleLiveEventRef.current(type, { ...payload, isTest: true });
    }
  }, [unlockAllAudio]);

  // Lắng nghe sự kiện chạy test trực tiếp từ Shopee Live, Game và các Modal cấu hình
  useEffect(() => {
    const handleDirectLiveEvent = (e) => {
      const { type, data, payload } = e.detail || {};
      if (type && handleLiveEventRef.current) {
        unlockAllAudio();
        handleLiveEventRef.current(type, { ...(data || payload || {}), isTest: true });
      }
    };
    window.addEventListener('avalive_direct_live_event', handleDirectLiveEvent);
    window.addEventListener('avalive_test_event', handleDirectLiveEvent);
    return () => {
      window.removeEventListener('avalive_direct_live_event', handleDirectLiveEvent);
      window.removeEventListener('avalive_test_event', handleDirectLiveEvent);
    };
  }, [unlockAllAudio]);

  // 🎬 LẮNG NGHE ĐIỀU PHỐI TỪ CHUỖI KỊCH BẢN (SEQUENCER) ĐỒNG BỘ MÀN HÌNH CHÍNH, WINDOW CAPTURE & TIKTOK LIVE STUDIO
  // 🎬 LẮNG NGHE SỰ KIỆN TỪ CHUỖI KỊCH BẢN PHÂN ĐOẠN (LIVESTREAM FLOW SEQUENCER)
  useEffect(() => {
    const handleFlowMediaUpdate = (e) => {
      const { 
        mediaUrl, scriptText, title, actionType,
        secondaryMediaUrl, secondaryMediaPos, secondaryMediaScale, secondaryMediaTransform, secondaryMediaChromaKey,
        overlayImage, overlayImagePos, overlayImageScale, overlayImageTransform, overlayImageChromaKey,
        overlayText, overlayTextPos, overlayTextStyle, overlayTextFontFamily, overlayTextFontSize, overlayTextColor, overlayTextTransform,
        mainMediaTransform, mainMediaChromaKey, avatarTransforms,
        isMediaPinned 
      } = e.detail || {};
      const effectiveMediaUrl = mediaUrl || userLockedMediaUrl || CHARACTERS.default_idol.url;
      setIsMasterStageSynced(true);
      try { localStorage.setItem('avalive_master_sync_active', 'true'); } catch (e) {}

      setUserLockedMediaUrl(effectiveMediaUrl);
      try { localStorage.setItem('avalive_user_locked_media', effectiveMediaUrl); } catch (err) {}

      // 1. Cập nhật trạng thái Overlays Đa Lớp (Ảnh, Chữ, Video Phụ PiP, Ghim)
      const overlayData = {
        secondaryMediaUrl: secondaryMediaUrl || null,
        secondaryMediaPos: secondaryMediaPos || 'top-right',
        secondaryMediaScale: secondaryMediaScale || 40,
        secondaryMediaTransform: secondaryMediaTransform || null,
        secondaryMediaChromaKey: secondaryMediaChromaKey || null,
        overlayImage: overlayImage || null,
        overlayImagePos: overlayImagePos || 'top-left',
        overlayImageScale: overlayImageScale || 100,
        overlayImageTransform: overlayImageTransform || null,
        overlayImageChromaKey: overlayImageChromaKey || null,
        overlayText: overlayText || null,
        overlayTextPos: overlayTextPos || 'top',
        overlayTextStyle: overlayTextStyle || 'banner',
        overlayTextFontFamily: overlayTextFontFamily || 'be_vietnam',
        overlayTextFontSize: overlayTextFontSize || 20,
        overlayTextColor: overlayTextColor || '#ffffff',
        overlayTextTransform: overlayTextTransform || null,
        mainMediaTransform: mainMediaTransform || null,
        mainMediaChromaKey: mainMediaChromaKey || null,
        avatarTransforms: avatarTransforms || null,
        isMediaPinned: !!isMediaPinned
      };
      setFlowSequencerOverlay(overlayData);
      try { localStorage.setItem('avalive_sequencer_overlay', JSON.stringify(overlayData)); } catch (err) {}

      // 2. Cập nhật trực tiếp Video & Media trên Màn hình chính của Phần mềm (Sân Khấu Chính)
      if (mediaUrl) {
        setUserLockedMediaUrl(mediaUrl);
        setUserLockedMedia(mediaUrl);
      }
      if (desktopVideoRef.current && mediaUrl) {
        if (desktopVideoRef.current.src !== mediaUrl) {
          desktopVideoRef.current.src = mediaUrl;
          desktopVideoRef.current.currentTime = 0;
        } else if (!isMediaPinned) {
          desktopVideoRef.current.currentTime = 0;
        }
        desktopVideoRef.current.dataset.userPaused = 'false';
        desktopVideoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
      }
      setIsVideoPlaying(true);
      setIsMasterLiveRunning(true);

      // 3. Đồng bộ 0ms sang Cửa sổ Window Capture OBS qua BroadcastChannel
      postMasterBroadcast({
        type: 'GLOBAL_MEDIA_CHANGE',
        mediaUrl: mediaUrl,
        blobUrl: mediaUrl,
        isVideo: true,
        isPlaying: true,
        currentTime: 0,
        force: !isMediaPinned,
        source: 'sequencer',
        secondaryMediaUrl: secondaryMediaUrl || null,
        secondaryMediaPos: secondaryMediaPos || 'top-right',
        secondaryMediaScale: secondaryMediaScale || 40,
        secondaryMediaTransform: secondaryMediaTransform || null,
        secondaryMediaChromaKey: secondaryMediaChromaKey || null,
        overlayImage: overlayImage || null,
        overlayImagePos: overlayImagePos || 'top-left',
        overlayImageScale: overlayImageScale || 100,
        overlayImageTransform: overlayImageTransform || null,
        overlayImageChromaKey: overlayImageChromaKey || null,
        overlayText: overlayText || null,
        overlayTextPos: overlayTextPos || 'top',
        overlayTextStyle: overlayTextStyle || 'banner',
        overlayTextFontFamily: overlayTextFontFamily || 'be_vietnam',
        overlayTextFontSize: overlayTextFontSize || 20,
        overlayTextColor: overlayTextColor || '#ffffff',
        overlayTextTransform: overlayTextTransform || null,
        mainMediaTransform: mainMediaTransform || null,
        mainMediaChromaKey: mainMediaChromaKey || null,
        avatarTransforms: avatarTransforms || null,
        timestamp: Date.now()
      });

      // 4. Đồng bộ 0ms sang Đường Link Online HTTPS (TikTok Live Studio /live-stream) qua Backend
      syncMasterLiveState({
        stage: 'idol',
        mediaUrl: mediaUrl,
        isVideo: true,
        isPlaying: true,
        aspectRatio: globalAspectRatio || '9:16',
        stepTitle: title,
        actionType: actionType,
        secondaryMediaUrl: secondaryMediaUrl || null,
        secondaryMediaPos: secondaryMediaPos || 'top-right',
        secondaryMediaScale: secondaryMediaScale || 40,
        overlayImage: overlayImage || null,
        overlayImagePos: overlayImagePos || 'top-left',
        overlayImageScale: overlayImageScale || 100,
        overlayText: overlayText || null,
        overlayTextPos: overlayTextPos || 'top',
        overlayTextStyle: overlayTextStyle || 'banner',
        overlayTextFontFamily: overlayTextFontFamily || 'be_vietnam',
        overlayTextFontSize: overlayTextFontSize || 20,
        overlayTextColor: overlayTextColor || '#ffffff'
      }, socketRef.current);

      // 5. Tự động ghim sản phẩm giỏ hàng lên màn hình nếu phân đoạn có chứa thông tin sản phẩm
      if (e.detail?.productName) {
        const productObj = {
          name: e.detail.productName,
          price: e.detail.productPrice || 'Flash Sale Độc Quyền',
          oldPrice: e.detail.productDiscount || '',
          image: e.detail.productImg || mediaUrl,
          badge: '📌 DEAL PHÂN ĐOẠN'
        };
        setLivePinnedProduct(productObj);
        try { localStorage.setItem('avalive_current_pinned_product', JSON.stringify(productObj)); } catch (err) {}
      }

      if (title) {
        showToast(`🎬 Sequencer chuyển sang: ${title}`, 'success');
      }
    };

    const handleStopFlowSequencer = () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.stopScript();
        audioPlayerRef.current.clearQueue();
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsScriptLiveRunning(false);
      setIsMasterLiveRunning(false);
      postMasterBroadcast({
        type: 'MASTER_PLAYBACK_STATE',
        isPlaying: false,
        source: 'sequencer_stop'
      });
      syncMasterLiveState({
        isPlaying: false
      }, socketRef.current);
      showToast('⏹️ Đã dừng kịch bản chuỗi phân đoạn', 'info');
    };

    window.addEventListener('avalive:update_master_media', handleFlowMediaUpdate);
    window.addEventListener('avalive_flow_step_changed', handleFlowMediaUpdate);
    window.addEventListener('avalive:stop_flow_sequencer', handleStopFlowSequencer);
    return () => {
      window.removeEventListener('avalive:update_master_media', handleFlowMediaUpdate);
      window.removeEventListener('avalive_flow_step_changed', handleFlowMediaUpdate);
      window.removeEventListener('avalive:stop_flow_sequencer', handleStopFlowSequencer);
    };
  }, [globalAspectRatio]);

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

      // 2. 🎯 TỰ ĐỘNG BẮT TỪ KHÓA / MÃ SẢN PHẨM & GHIM SẢN PHẨM TIKTOK SHOP (shop.tiktok.com)
      try {
        autoPinProductService.detectAndAutoPinByText(text, 'viewer_comment');
        
        // ⚡ AI Smart Jump: Tự động chuyển kịch bản sang bước sản phẩm tương ứng nếu khán giả hỏi
        try {
          const rawPresets = localStorage.getItem('aidol_flow_presets');
          const activePresetId = localStorage.getItem('aidol_active_flow_preset_id');
          if (rawPresets && activePresetId) {
            const presets = JSON.parse(rawPresets);
            const activePreset = presets.find(p => p.id === activePresetId);
            if (activePreset && activePreset.steps && activePreset.steps.length > 0) {
              const lowerText = text.toLowerCase();
              const matchIdx = activePreset.steps.findIndex(s => 
                (s.productName && lowerText.includes(s.productName.toLowerCase())) ||
                (s.title && lowerText.includes(s.title.toLowerCase()))
              );
              if (matchIdx !== -1) {
                window.dispatchEvent(new CustomEvent('avalive:sequencer_smart_jump', {
                  detail: { stepIndex: matchIdx }
                }));
              }
            }
          }
        } catch (jumpErr) {}
      } catch (e) {}

      // 3. Kích hoạt Kịch Bản Trả Lời Bình Luận & Chốt Đơn của AI Idol (theo đúng cấu trúc đã cài đặt)
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
      // Kiểm tra công tắc Tự Động Chào Khán Giả từ Cài Đặt Sự Kiện
      const rawConf = localStorage.getItem('aidol_event_configs');
      if (rawConf) {
        try {
          const parsedConf = JSON.parse(rawConf);
          if (parsedConf?.welcome?.active === false) return;
        } catch (e) {}
      }
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
      : isLiveStudioActive 
      ? 'broadcast' 
      : 'idol';

    const customMatch = (customCharacters && Array.isArray(customCharacters)) ? customCharacters.find(c => c.id === selectedCharacter) : null;
    const firstCustom = (customCharacters && Array.isArray(customCharacters) && customCharacters.length > 0) ? customCharacters[0] : null;
    const char = customMatch || (selectedCharacter && CHARACTERS[selectedCharacter]) || firstCustom || (Object.keys(CHARACTERS).length > 0 ? Object.values(CHARACTERS)[0] : null) || { 
      url: '', 
      type: 'video', 
      name: 'Video Người Dùng' 
    };
    
    // Ưu tiên video nhân vật đang chọn -> video khóa người dùng -> các nguồn phản hồi
    const serverCharMedia = (char.mediaUrl && !char.mediaUrl.startsWith('blob:')) ? char.mediaUrl : ((char.url && !char.url.startsWith('blob:')) ? char.url : null);
    const lockedServerMedia = (userLockedMediaUrl && !userLockedMediaUrl.startsWith('blob:')) ? userLockedMediaUrl : null;
    let currentMedia = quickResponseActiveVideo?.url || lipSyncVideoUrl || (activeVideoItem?.mediaUrl) || serverCharMedia || lockedServerMedia || char.mediaUrl || userLockedMediaUrl || char.url || '';
    let isVid = !!userLockedMediaUrl || char.type === 'video' || (typeof currentMedia === 'string' && (currentMedia.endsWith('.mp4') || currentMedia.includes('/uploads/') || currentMedia.startsWith('http') || currentMedia.startsWith('blob:')));
    let streamFlvUrl = null;

    if (isConnected && flvUrl) {
      currentMedia = flvUrl;
      streamFlvUrl = flvUrl;
      isVid = true;
    } else if (quickResponseActiveVideo?.url) {
      currentMedia = quickResponseActiveVideo.url;
      isVid = true;
    } else if (lipSyncVideoUrl) {
      currentMedia = lipSyncVideoUrl;
      isVid = true;
    } else if (isProcessingEvent && activeVideoItem && activeVideoItem.mediaUrl) {
      currentMedia = activeVideoItem.mediaUrl;
      isVid = activeVideoItem.type === 'video' || (typeof currentMedia === 'string' && currentMedia.endsWith('.mp4'));
    }

    if (typeof currentMedia === 'string' && currentMedia.includes('/uploads/')) {
      currentMedia = currentMedia.substring(currentMedia.indexOf('/uploads/'));
    } else if (typeof currentMedia === 'string' && (currentMedia.includes('nhep_mieng.mp4') || currentMedia.includes('demo_dancer.mp4') || currentMedia.includes('default_idol.mp4'))) {
      currentMedia = null;
    }

    const masterPayload = {
      type: 'MASTER_LIVE_STATE_UPDATE',
      stage, // 'idol' | 'battle' | 'bando' | 'dancefloor' | 'broadcast'
      aspectRatio: globalAspectRatio || '9:16', // '9:16' | '16:9'
      selectedCharacter: char.id || selectedCharacter,
      characterName: quickResponseActiveVideo?.name || char.name || 'AI Idol',
      mediaUrl: currentMedia,
      flvUrl: streamFlvUrl,
      isVideo: !!isVid,
      isConnected: !!(isConnected || showSimulator),
      isPlaying: isVideoPlaying,
      isDarkMode,
      currentLang,
      updatedAt: Date.now()
    };

    // Đồng bộ tức thì đa kênh: Supabase Cloud Realtime + Socket.io + BroadcastChannel + LocalStorage + REST API
    syncMasterLiveState(masterPayload, socketRef.current);
  }, [
    isGameBanDoActive, 
    isGameBattleActive, 
    isLiveStudioActive, 
    selectedCharacter, 
    customCharacters,
    activeVideoItem, 
    userLockedMediaUrl,
    isConnected, 
    showSimulator, 
    globalAspectRatio, 
    isDarkMode, 
    currentLang, 
    CHARACTERS, 
    flvUrl,
    lipSyncVideoUrl,
    quickResponseActiveVideo
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
    let cleanId = extractTikTokUsername(tiktokId);
    let cleanVideoId = extractTikTokUsername(videoTiktokId);

    if (!cleanId && !cleanVideoId) {
      cleanId = 'avalive_studio';
      setTiktokId('avalive_studio');
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
      clearGlobalSpeechQueue();
      
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
            el.dataset.userPaused = 'true';
            el.pause();
            // KHÔNG reset currentTime để có thể phát tiếp từ chỗ đang dừng
          } catch (e) {}
        });
      }

      if (desktopVideoRef.current) {
        desktopVideoRef.current.dataset.userPaused = 'true';
        try { desktopVideoRef.current.pause(); } catch (e) {}
      }
      setIsVideoPlaying(false);

      // 9. Phát tín hiệu dừng toàn cục (BroadcastChannel, CustomEvent, LocalStorage) cho OBS/TikTok Live Studio Overlay
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('avalive_emergency_stop_all'));
        window.dispatchEvent(new CustomEvent('global-stop-demo'));
        try {
          localStorage.setItem('avalive_user_paused', 'true');
          localStorage.setItem('avalive_window_capture_paused', 'true');
          localStorage.setItem('avalive_emergency_stop_trigger', Date.now().toString());
          localStorage.setItem('avalive_master_live_running', 'false');
        } catch (e) {}
      }

      if (typeof BroadcastChannel !== 'undefined') {
        try {
          const bc = new BroadcastChannel('avalive_master_live_stream');
          bc.postMessage({ type: 'GLOBAL_PLAYBACK_CHANGE', isPlaying: false, userPaused: true, timestamp: Date.now() });
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

      sendVideoControl({
        action: 'pause',
        isPlaying: false,
        timestamp: Date.now()
      }, socketRef.current);

      syncMasterLiveState({
        videoPlaybackEvent: 'pause',
        isPlaying: false
      }, socketRef.current);

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
      setIsVideoPlaying(true);
      try {
        localStorage.removeItem('avalive_user_paused');
        localStorage.removeItem('avalive_window_capture_paused');
        localStorage.setItem('avalive_master_live_running', 'true');
      } catch (e) {}

      if (desktopVideoRef.current) {
        desktopVideoRef.current.dataset.userPaused = 'false';
        try { desktopVideoRef.current.play().catch(() => {}); } catch (e) {}
      }

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
          if (battleCommentary.isEnabled) battleCommentary.startPeriodicCommentary(true);
          if (battleVoiceEngine.isAutoEnabled) battleVoiceEngine.startPeriodicCommentary(true);
        }
      } catch (e) {}

      // 4. Phát tín hiệu bật lại toàn cục
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('avalive_resume_all'));
      }

      // 5. Tự động kích hoạt Vận hành Auto 24/7 liên tục
      setIsAuto247Running(true);
      try {
        localStorage.setItem('avalive_auto247', 'true');
        bandoEngine.stopAutoTestLoop();
        bandoEngine.startAuto247Loop();
      } catch (e) {}

      if (typeof BroadcastChannel !== 'undefined') {
        try {
          const bc = new BroadcastChannel('avalive_master_live_stream');
          bc.postMessage({ type: 'GLOBAL_PLAYBACK_CHANGE', isPlaying: true, userPaused: false, timestamp: Date.now() });
          bc.postMessage({ 
            type: 'RESUME_ALL', 
            stage: isGameBanDoActive ? 'bando' : (isGameBattleActive ? 'battle' : 'idol'),
            timestamp: Date.now() 
          });
          bc.close();
        } catch (e) {}
      }

      sendVideoControl({
        action: 'play',
        isPlaying: true,
        timestamp: Date.now()
      }, socketRef.current);

      syncMasterLiveState({
        videoPlaybackEvent: 'play',
        isPlaying: true
      }, socketRef.current);

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
      const rawName = file.name.replace(/\.[^/.]+$/, "") || "Idol Live AI Pro";
      const charName = rawName.length > 20 ? rawName.substring(0, 18) + "…" : rawName;
      const isVideo = file.type.startsWith('video/') || 
        /\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(file.name) ||
        /video|nhép|lipsync|livestream/i.test(file.name);
      const localUrl = URL.createObjectURL(file);
      const fileSig = generateFileSignature(file);

      if (isVideo) {
        // 🛡️ BƯỚC 0: KIỂM TRA TRÙNG LẶP TRONG CUSTOM CHARACTERS HOẶC INDEXEDDB
        const existingChar = customCharacters.find(c => 
          (c.fileSignature && c.fileSignature === fileSig) ||
          (c.fileSize && Number(c.fileSize) === file.size && file.size > 50000 && c.name === charName) ||
          (c.name === charName && Number(c.fileSize || 0) === file.size)
        );
        const existingIDB = !existingChar ? await findExistingAidolByFile(file) : null;
        const matchedChar = existingChar || existingIDB;

        if (matchedChar) {
          // 🎉 TÁI SỬ DỤNG 100% VIDEO ĐÃ CÓ: KHÔNG TẠO MỚI, KHÔNG NHÂN BẢN DUNG LƯỢNG
          let targetMediaUrl = (matchedChar.mediaUrl && !matchedChar.mediaUrl.startsWith('blob:')) ? matchedChar.mediaUrl : '';

          // Lưu tham chiếu Blob và signature vào RAM Cache
          registerFileInRAM(file, targetId);
          if (typeof window !== 'undefined') {
            window.__activeMediaBlob = file;
            window.__activeMediaBlobUrl = localUrl;
            window.__activeMediaBlobMap = window.__activeMediaBlobMap || new Map();
            window.__activeMediaBlobMap.set(targetId, file);
            window.__activeMediaBlobMap.set(localUrl, file);
            if (targetMediaUrl) window.__activeMediaBlobMap.set(targetMediaUrl, file);
          }

          setSelectedCharacter(targetId);
          if (targetMediaUrl) setUserLockedMediaUrl(targetMediaUrl);
          setIsVideoPlaying(true);
          lastPlaybackTimeRef.current = 0;
          currentFileBlobRef.current = file;
          currentBlobUrlRef.current = localUrl;

          if (desktopVideoRef.current) {
            desktopVideoRef.current.src = localUrl;
            desktopVideoRef.current.currentTime = 0;
            desktopVideoRef.current.dataset.userPaused = 'false';
            desktopVideoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
          }

          // 🚀 Nếu chưa có server URL (/uploads/...), gọi upload-stream-init tức thì (2ms) để lấy link server chuẩn cho TikTok Live Studio & Window Capture
          if (!targetMediaUrl) {
            fastStreamUpload(file, {
              onInit: ({ fileUrl }) => {
                if (fileUrl) {
                  setUserLockedMediaUrl(fileUrl);
                  syncMasterLiveState({
                    stage: 'idol',
                    selectedCharacter: targetId,
                    characterName: charName,
                    mediaUrl: fileUrl,
                    isVideo: true,
                    videoPlaybackEvent: 'play',
                    isPlaying: true,
                    aspectRatio: globalAspectRatio || '9:16'
                  }, socketRef.current);
                }
              }
            }).catch(() => {});
          } else {
            // Bắn broadcast đồng bộ sang Window Capture ngay lập tức 0ms với fileBlob gốc và server URL
            try {
              const bc = new BroadcastChannel('avalive_master_live_stream');
              bc.postMessage({
                type: 'GLOBAL_MEDIA_CHANGE',
                mediaUrl: targetMediaUrl,
                blobUrl: localUrl,
                fileBlob: file,
                characterId: targetId,
                characterName: charName,
                isVideo: true,
                isPlaying: true,
                currentTime: 0,
                force: true,
                source: 'desktop',
                timestamp: Date.now()
              });
              setTimeout(() => bc.close(), 100);
            } catch (err) {}

            sendVideoControl({
              action: 'play',
              currentTime: 0,
              isPlaying: true,
              mediaUrl: targetMediaUrl,
              timestamp: Date.now()
            }, socketRef.current);

            syncMasterLiveState({
              stage: 'idol',
              selectedCharacter: targetId,
              characterName: charName,
              mediaUrl: targetMediaUrl,
              isVideo: true,
              videoPlaybackEvent: 'play',
              isPlaying: true,
              aspectRatio: globalAspectRatio || '9:16'
            }, socketRef.current);
          }

          showToast(`⚡ Video "${charName}" đã có sẵn trong hệ thống! Đã kích hoạt sử dụng ngay lập tức mà không tốn dung lượng máy.`, 'success');
          return;
        }

        // ⚡ 1. NẾU LÀ VIDEO MỚI: HIỂN THỊ VÀ PHÁT TỨC THÌ 0MS TRÊN MÀN HÌNH & GIAO DIỆN
        const newCharId = `custom_${Date.now()}`;
        const tempChar = {
          id: newCharId,
          name: charName,
          url: localUrl,
          mediaUrl: localUrl,
          type: 'video',
          fileData: file,
          fileBlob: file,
          fileSize: file.size,
          fileSignature: fileSig
        };

        // Lưu tham chiếu Blob toàn cục cho Window Capture & popup con nạp tức thì 0ms
        registerFileInRAM(file, newCharId);
        setActiveMedia(file, newCharId, { name: charName, mediaUrl: localUrl, id: newCharId }).catch(() => {});
        setActiveMedia(file, 'current_active', { name: charName, mediaUrl: localUrl, id: newCharId }).catch(() => {});
        if (typeof window !== 'undefined') {
          window.__activeMediaBlob = file;
          window.__activeMediaBlobUrl = localUrl;
          window.__activeMediaBlobMap = window.__activeMediaBlobMap || new Map();
          window.__activeMediaBlobMap.set(newCharId, file);
          window.__activeMediaBlobMap.set(localUrl, file);
        }

        // Lưu ngay lập tức vào IndexedDB để Window Capture & OBS nhận fileBlob 0ms
        try {
          await saveCharacterToIDB(tempChar);
          localStorage.setItem('avalive_selected_char', newCharId);
        } catch (e) {}

        setCustomCharacters(prev => [...prev, tempChar]);
        setSelectedCharacter(newCharId);
        setIsVideoPlaying(true);
        lastPlaybackTimeRef.current = 0;
        currentFileBlobRef.current = file;
        currentBlobUrlRef.current = localUrl;

        // Kích hoạt ngay lập tức trên phần tử video Desktop trong 0ms
        if (desktopVideoRef.current) {
          desktopVideoRef.current.src = localUrl;
          desktopVideoRef.current.currentTime = 0;
          desktopVideoRef.current.dataset.userPaused = 'false';
          desktopVideoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
        }

        // Bắn broadcast cục bộ ngay lập tức để mọi tab overlay cùng máy hiển thị tức thì
        try {
          const bc = new BroadcastChannel('avalive_master_live_stream');
          bc.postMessage({
            type: 'GLOBAL_MEDIA_CHANGE',
            mediaUrl: localUrl,
            blobUrl: localUrl,
            fileBlob: file,
            characterId: newCharId,
            characterName: charName,
            isVideo: true,
            isPlaying: true,
            currentTime: 0,
            force: true,
            source: 'desktop',
            timestamp: Date.now()
          });
          setTimeout(() => bc.close(), 100);
        } catch (err) {}

        showToast(`⚡ Đã phát ngay video "${charName}" trên giao diện phần mềm!`, 'success');

        // 🚀 2. PHÁT LUỒNG SIÊU TỐC TỪNG PHẦN (FAST-STREAM PIPELINE) LÊN SERVER & TIKTOK LIVE STUDIO
        fastStreamUpload(file, {
          onInit: ({ fileUrl }) => {
            const updatedChar = {
              id: newCharId,
              name: charName,
              url: localUrl, // Giữ nguyên Blob URL cho Desktop preview siêu mượt không lag
              mediaUrl: fileUrl, // Server URL cho TikTok Live Studio & OBS
              type: 'video',
              fileData: file
            };

            // 🔒 KHOÁ CỐ ĐỊNH VIDEO CỦA NGƯỜI DÙNG: Cập nhật đường dẫn server vĩnh viễn
            setUserLockedMediaUrl(fileUrl);
            try { localStorage.setItem('avalive_user_locked_media', fileUrl); } catch (e) {}

            if (typeof window !== 'undefined') {
              window.__activeMediaBlob = file;
              window.__activeMediaBlobMap = window.__activeMediaBlobMap || new Map();
              window.__activeMediaBlobMap.set(fileUrl, file);
              window.__activeMediaBlobMap.set(newCharId, file);
              window.__activeMediaBlobMap.set(localUrl, file);
            }

            setCustomCharacters(prev => {
              const updatedList = prev.map(c => c.id === newCharId ? updatedChar : c);
              try { localStorage.setItem('avalive_custom_characters', JSON.stringify(updatedList)); } catch (e) {}
              return updatedList;
            });

            saveCharacterToIDB({
              id: newCharId,
              name: charName,
              type: 'video',
              fileData: file,
              mediaUrl: fileUrl
            }).catch(() => {});

            // 🚀 BẮN PHÁT SÓNG REALTIME VIDEO ĐẾN TIKTOK LIVE STUDIO / OBS & WINDOW CAPTURE
            try {
              const bc = new BroadcastChannel('avalive_master_live_stream');
              bc.postMessage({
                type: 'GLOBAL_MEDIA_CHANGE',
                mediaUrl: fileUrl,
                blobUrl: localUrl,
                fileBlob: file,
                characterId: newCharId,
                characterName: charName,
                isVideo: true,
                isPlaying: true,
                currentTime: 0,
                force: true,
                source: 'desktop',
                timestamp: Date.now()
              });
              setTimeout(() => bc.close(), 100);
            } catch (err) {}

            sendVideoControl({
              action: 'play',
              currentTime: 0,
              isPlaying: true,
              mediaUrl: fileUrl,
              timestamp: Date.now()
            }, socketRef.current);
            syncMasterLiveState({
              stage: 'idol',
              selectedCharacter: newCharId,
              characterName: charName,
              mediaUrl: fileUrl,
              isVideo: true,
              videoPlaybackEvent: 'play',
              isPlaying: true,
              aspectRatio: globalAspectRatio || '9:16'
            }, socketRef.current);

            showToast(`✅ Video "${charName}" đã sẵn sàng trên TikTok Live Studio!`, 'success');
          },
          onProgress: (pct) => {
            if (pct === 100) {
              showToast(`🎉 Video "${charName}" đã nạp 100% dung lượng vào hệ thống!`, 'success');
            }
          },
          onError: async (err) => {
            console.warn('[FastStream] Error, fallback to standard upload:', err);
            try {
              const formData = new FormData();
              formData.append('file', file);
              const res = await fetch('/api/upload-media', { method: 'POST', body: formData });
              if (res.ok) {
                const data = await res.json();
                if (data && data.url) {
                  const fallbackUrl = data.url.includes('/uploads/') ? data.url.substring(data.url.indexOf('/uploads/')) : data.url;
                  setUserLockedMediaUrl(fallbackUrl);
                  try { localStorage.setItem('avalive_user_locked_media', fallbackUrl); } catch (e) {}
                  try {
                    const bc = new BroadcastChannel('avalive_master_live_stream');
                    bc.postMessage({
                      type: 'GLOBAL_MEDIA_CHANGE',
                      mediaUrl: fallbackUrl,
                      blobUrl: localUrl,
                      fileBlob: file,
                      characterId: newCharId,
                      characterName: charName,
                      isVideo: true,
                      isPlaying: true,
                      currentTime: 0,
                      force: true,
                      source: 'desktop',
                      timestamp: Date.now()
                    });
                    setTimeout(() => bc.close(), 100);
                  } catch (err) {}
                  sendVideoControl({
                    action: 'play',
                    currentTime: 0,
                    isPlaying: true,
                    mediaUrl: fallbackUrl,
                    timestamp: Date.now()
                  }, socketRef.current);
                  syncMasterLiveState({
                    stage: 'idol',
                    selectedCharacter: newCharId,
                    characterName: charName,
                    mediaUrl: fallbackUrl,
                    isVideo: true,
                    videoPlaybackEvent: 'play',
                    isPlaying: true
                  }, socketRef.current);
                }
              }
            } catch(e) {}
          }
        });
      } else {
        // Ảnh: Mở Modal AI Xoá Phông & Làm Đẹp Siêu Nét 4K
        setBeautyModalImage(localUrl);
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
    const remaining = customCharacters.filter(c => c.id !== id);
    setCustomCharacters(remaining);
    try { localStorage.setItem('avalive_custom_characters', JSON.stringify(remaining)); } catch (err) {}

    if (selectedCharacter === id) {
      const nextChar = remaining.length > 0 ? remaining[0] : null;
      const nextId = nextChar ? nextChar.id : '';
      const nextUrl = nextChar ? (nextChar.url || nextChar.mediaUrl || '') : '';
      setSelectedCharacter(nextId);
      setUserLockedMediaUrl(nextUrl);
      try {
        localStorage.setItem('avalive_selected_char', nextId);
        if (nextUrl) localStorage.setItem('avalive_user_locked_media', nextUrl);
        else localStorage.removeItem('avalive_user_locked_media');
      } catch (err) {}

      syncMasterLiveState({
        stage: 'idol',
        selectedCharacter: nextId,
        mediaUrl: nextUrl,
        isVideo: !!nextUrl,
        isPlaying: !!nextUrl
      }, socketRef.current);
      sendVideoControl({
        action: nextUrl ? 'play' : 'pause',
        mediaUrl: nextUrl,
        currentTime: 0,
        force: true,
        isPlaying: !!nextUrl
      }, socketRef.current);
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
                const currentFallback = customCharacters.find(c => c.id === selectedCharacter)?.url || null;
                syncMasterLiveState({
                  stage: 'idol',
                  mediaUrl: currentFallback,
                  characterName: 'AI Idol',
                  isVideo: true,
                  videoPlaybackEvent: 'play',
                  isPlaying: true
                }, socketRef.current);
                showToast('Đã phát xong video phản hồi nhanh!', 'info');
              }
            }}
            onError={() => {
              setQuickResponseActiveVideo(null);
              const currentFallback = customCharacters.find(c => c.id === selectedCharacter)?.url || null;
              syncMasterLiveState({
                stage: 'idol',
                mediaUrl: currentFallback,
                characterName: 'AI Idol',
                isVideo: true,
                videoPlaybackEvent: 'play',
                isPlaying: true
              }, socketRef.current);
              showToast('Lỗi tải video phản hồi nhanh!', 'warn');
            }}
            playsInline 
          />
          <div className="absolute top-4 left-4 bg-red-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 animate-pulse z-20">
            <Zap size={14} /> ĐANG PHÁT VIDEO PHẢN HỒI: {quickResponseActiveVideo.name || 'Video Khẩn cấp'}
            <button 
              onClick={() => {
                setQuickResponseActiveVideo(null);
                const currentFallback = customCharacters.find(c => c.id === selectedCharacter)?.url || null;
                syncMasterLiveState({
                  stage: 'idol',
                  mediaUrl: currentFallback,
                  characterName: 'AI Idol',
                  isVideo: true,
                  videoPlaybackEvent: 'play',
                  isPlaying: true
                }, socketRef.current);
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

    // 0.1 MULTI-AVATAR STUDIO CANVAS (1-4 CHARACTERS) — CHỈ KÍCH HOẠT KHI ĐƯỢC ĐỒNG BỘ TỪ STUDIO / SEQUENCER
    if (isMasterStageSynced && multiAvatarConfig?.enabled && multiAvatarConfig?.activeCount >= 1) {
      const activeList = (multiAvatarConfig.avatars || [])
        .filter(a => a.enabled)
        .slice(0, multiAvatarConfig.activeCount)
        .map((avatar, idx) => {
          const isSpeakingNow = isSpeakerActive && (
            activeSpeakerId === avatar.id || 
            activeSpeakerId === avatar.role || 
            (avatar.id === 'avatar_1' && (activeSpeakerId === 'idol' || !activeSpeakerId))
          );
          const customMatch = (customCharacters && Array.isArray(customCharacters)) 
            ? customCharacters.find(c => c.id === selectedCharacter && (c.url || c.mediaUrl)) 
            : null;
          const fallbackUrl = customMatch?.url || userLockedMediaUrl || '';
          
          const talkSrc = avatar.talkVideo || avatar.videoUrl || avatar.mediaUrl || '';
          const idleSrc = avatar.idleVideo || avatar.videoUrl || avatar.mediaUrl || '';
          const vidSrc = isSpeakingNow 
            ? (talkSrc || idleSrc || (idx === 0 ? fallbackUrl : '')) 
            : (idleSrc || talkSrc || (idx === 0 ? fallbackUrl : ''));
          
          return {
            ...avatar,
            resolvedVidSrc: vidSrc,
            isSpeakingNow
          };
        })
        .filter(a => !!a.resolvedVidSrc); // Triệt tiêu hoàn toàn bất kỳ ô nào không có video/ảnh

      if (activeList.length > 0) {
        const isGridOnly = multiAvatarConfig.layoutMode === 'grid';
        const count = activeList.length;

        if (isGridOnly) {
          const gridClass = count === 1
            ? 'w-full h-full p-1 bg-black flex items-center justify-center'
            : count === 2 
            ? 'grid grid-cols-2 w-full h-full gap-1 p-1 bg-black'
            : count === 3 
            ? 'grid grid-cols-3 w-full h-full gap-1 p-1 bg-black'
            : 'grid grid-cols-2 grid-rows-2 w-full h-full gap-1 p-1 bg-black';

          return (
            <div className={gridClass}>
              {activeList.map((avatar) => {
                const isSpeakingNow = avatar.isSpeakingNow;
                const vidSrc = avatar.resolvedVidSrc;
                const isImg = isImageMedia(vidSrc);

                return (
                  <div 
                    key={avatar.id} 
                    className={`relative w-full h-full overflow-hidden rounded-lg bg-slate-950 flex items-center justify-center transition-all duration-300 ${
                      isSpeakingNow ? 'ring-2 ring-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.4)] z-10' : 'opacity-95'
                    }`}
                  >
                    {isImg ? (
                      <img 
                        src={vidSrc}
                        alt={avatar.name}
                        className="w-full h-full object-cover select-none pointer-events-none"
                      />
                    ) : (
                      <video
                        key={`${avatar.id}_${isSpeakingNow ? 'talk' : 'idle'}_${vidSrc}`}
                        src={vidSrc}
                        autoPlay
                        loop
                        muted={liveAudioMuted}
                        playsInline
                        controls={false}
                        className="w-full h-full object-cover bg-black select-none pointer-events-none"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          );
        }

        // Freeform Visual Studio Stage Canvas (Tái hiện 100% nguyên xi Sân Khấu Phụ khi Đồng Bộ)
        return (
          <div 
            className="relative w-full h-full overflow-hidden bg-cover bg-center"
            style={{
              backgroundColor: multiAvatarConfig.backgroundColor || '#0a0c14'
            }}
          >
            {/* Studio Transformed Background Layer */}
            {multiAvatarConfig.backgroundUrl && (
              <div
                className="absolute pointer-events-none"
                style={{
                  left: `${multiAvatarConfig.backgroundTransform?.x ?? 0}%`,
                  top: `${multiAvatarConfig.backgroundTransform?.y ?? 0}%`,
                  width: `${multiAvatarConfig.backgroundTransform?.width ?? 100}%`,
                  height: `${multiAvatarConfig.backgroundTransform?.height ?? 100}%`,
                  transform: (multiAvatarConfig.backgroundTransform?.scale && multiAvatarConfig.backgroundTransform?.scale !== 100)
                    ? `scale(${multiAvatarConfig.backgroundTransform.scale / 100})`
                    : 'none',
                  transformOrigin: 'center center',
                  zIndex: 0
                }}
              >
                <img 
                  src={multiAvatarConfig.backgroundUrl}
                  alt="Studio Background"
                  className="w-full h-full"
                  style={{
                    objectFit: multiAvatarConfig.backgroundTransform?.objectFit || 'cover',
                    filter: `${multiAvatarConfig.backgroundTransform?.blur ? `blur(${multiAvatarConfig.backgroundTransform.blur}px)` : ''} ${multiAvatarConfig.backgroundTransform?.brightness ? `brightness(${multiAvatarConfig.backgroundTransform.brightness}%)` : ''}`.trim() || 'none'
                  }}
                />
              </div>
            )}
            {/* Extra Custom Image / Media Layers */}
            {(multiAvatarConfig.extraImageLayers || []).map(layer => {
              const isImg = layer.type !== 'video' && (isImageMedia(layer.url) || !layer.type);
              const chromaStyle = getChromaStyle(layer.chromaKey);
              return (
                <div
                  key={layer.id}
                  className="absolute overflow-hidden pointer-events-none"
                  style={{
                    left: `${layer.x ?? 20}%`,
                    top: `${layer.y ?? 20}%`,
                    width: `${layer.width ?? 30}%`,
                    height: `${layer.height ?? 30}%`,
                    zIndex: layer.zIndex || 10,
                    borderRadius: `${layer.borderRadius ?? 0}px`,
                    ...chromaStyle
                  }}
                >
                  {isImg ? (
                    <img
                      src={layer.url}
                      alt={layer.name || 'Extra Layer'}
                      className="w-full h-full bg-transparent select-none"
                      style={{
                        objectFit: layer.objectFit || 'contain',
                        ...chromaStyle
                      }}
                    />
                  ) : (
                    <video
                      src={layer.url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full bg-transparent select-none"
                      style={{
                        objectFit: layer.objectFit || 'contain',
                        ...chromaStyle
                      }}
                    />
                  )}
                </div>
              );
            })}

            {activeList.map((avatar, idx) => {
              const vidSrc = avatar.resolvedVidSrc;
              const isSpeakingNow = avatar.isSpeakingNow;
              // Nếu là nhân vật đơn hoặc nhân vật 1 trên sân khấu chính: Hiển thị Full Màn Hình 100% (trừ khi có toạ độ tuỳ chỉnh riêng của multi-avatar 2-4 người)
              const isSoloOrPrimary = activeList.length === 1 || (idx === 0 && (!avatar.transform || (avatar.transform.x === 4 && avatar.transform.y === 8 && avatar.transform.width === 48)));
              const transform = isSoloOrPrimary
                ? { x: 0, y: 0, width: 100, height: 100, zIndex: 5, pose: 'stand', objectFit: 'cover', borderRadius: 0 }
                : (avatar.transform || { 
                    x: idx === 1 ? 55 : idx === 2 ? 25 : 65, 
                    y: idx === 1 ? 25 : idx === 2 ? 60 : 10, 
                    width: 42, 
                    height: 65, 
                    zIndex: 6, 
                    pose: 'stand', 
                    objectFit: 'cover',
                    borderRadius: 12
                  });
              const isImg = isImageMedia(vidSrc);
              const chromaStyle = getChromaStyle(avatar.chromaKey || multiAvatarConfig.chromaKey);

              return (
                <div 
                  key={avatar.id} 
                  className="absolute overflow-hidden transition-all duration-300 pointer-events-none"
                  style={{
                    left: `${transform.x ?? 0}%`,
                    top: `${transform.y ?? 0}%`,
                    width: `${transform.width ?? 100}%`,
                    height: `${transform.height ?? 100}%`,
                    zIndex: isSpeakingNow ? (transform.zIndex || 5) + 5 : (transform.zIndex || 5),
                    borderRadius: `${transform.borderRadius ?? 0}px`
                  }}
                >
                  <div 
                    className="w-full h-full overflow-hidden rounded-[inherit] bg-transparent"
                    style={chromaStyle}
                  >
                    {isImg ? (
                      <img
                        src={vidSrc}
                        alt={avatar.name}
                        className="w-full h-full select-none pointer-events-none bg-transparent"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: transform.objectFit || 'cover',
                          ...chromaStyle
                        }}
                      />
                    ) : (
                      <video
                        key={`${avatar.id}_${isSpeakingNow ? 'talk' : 'idle'}_${vidSrc}`}
                        src={vidSrc}
                        autoPlay
                        loop
                        muted={liveAudioMuted}
                        playsInline
                        controls={false}
                        className="w-full h-full select-none pointer-events-none bg-transparent"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: transform.objectFit || 'cover',
                          backgroundColor: 'transparent',
                          ...chromaStyle
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      }
    }

    const renderMainCharacter = () => {
      if (lipSyncVideoUrl) {
        return (
          <video 
            ref={desktopVideoRef}
            data-main-player="true"
            src={lipSyncVideoUrl} 
            className="w-full h-full object-cover bg-black"
            autoPlay
            loop
            controls={false}
            muted={liveAudioMuted}
            onEnded={handleVideoEnded}
            onError={() => {
              setLipSyncVideoUrl(null);
              handleVideoEnded();
            }}
            playsInline 
          />
        );
      }
      
      const customMatch = (customCharacters && Array.isArray(customCharacters)) 
        ? customCharacters.find(c => c.id === selectedCharacter && (c.url || c.mediaUrl)) 
        : null;
      let selected = customMatch || 
        (userLockedMediaUrl ? { id: 'locked_video', name: 'Video Đang Phát', url: userLockedMediaUrl, mediaUrl: userLockedMediaUrl, type: 'video' } : null) ||
        (selectedCharacter && CHARACTERS[selectedCharacter]?.url ? { id: selectedCharacter, ...CHARACTERS[selectedCharacter] } : null) || 
        (customCharacters.find(c => c.url || c.mediaUrl) || null) || 
        (Object.entries(CHARACTERS).find(([k, v]) => v.url)?.[1] ? { id: Object.entries(CHARACTERS).find(([k, v]) => v.url)[0], ...Object.entries(CHARACTERS).find(([k, v]) => v.url)[1] } : null) ||
        CHARACTERS.default_idol;

      if (selected) {
        const resolvedUrl = selected.url || selected.mediaUrl;
        if (resolvedUrl) {
          const isExplicitVideo = selected.type === 'video' || 
            (selected.fileData && selected.fileData.type && selected.fileData.type.startsWith('video/')) ||
            (typeof resolvedUrl === 'string' && (
              resolvedUrl.startsWith('blob:') || 
              resolvedUrl.startsWith('data:video/') || 
              resolvedUrl.match(/\.(mp4|webm|mov|mkv|avi|m4v)(\?.*)?$/i) || 
              resolvedUrl.includes('/uploads/video_') || 
              resolvedUrl.includes('/api/stream')
            )) || 
            (selected.name && /video|nhép|lipsync|livestream|mp4/i.test(selected.name));

          selected = {
            ...selected,
            url: resolvedUrl,
            mediaUrl: resolvedUrl,
            type: isExplicitVideo ? 'video' : (selected.type || 'image')
          };
        }
      }

      if (isProcessingEvent && activeVideoItem && activeVideoItem.mediaUrl) {
        return (
          <video 
            ref={desktopVideoRef}
            data-main-player="true"
            src={activeVideoItem.mediaUrl} 
            className="w-full h-full object-cover bg-black"
            autoPlay
            loop={!isProcessingEvent}
            controls={false}
            muted={liveAudioMuted}
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
        selected = CHARACTERS.default_idol;
      }
  
      if (selected.type === 'video') {
        return (
          <div className="relative w-full h-full group/videoContainer select-none overflow-hidden bg-black flex items-center justify-center">
            {/* THẺ VIDEO PREVIEW TRÊN PHẦN MỀM (TƯƠNG THÍCH HOÀN HẢO VỚI OBS WINDOW CAPTURE - KHÔNG BAO GIỜ ĐEN MÀN HÌNH) */}
            <video 
              ref={desktopVideoRef}
              data-main-player="true"
              src={selected.url} 
              className="w-full h-full object-cover bg-black cursor-pointer main-video-player"
              style={{ 
                imageRendering: 'auto'
              }}
              autoPlay
              loop 
              muted={isLocalSpeakerMuted} 
              controls={false}
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
              playsInline 
              onClick={toggleDesktopVideoPlayback}
              onError={(e) => {
                console.warn('Desktop video playback error, recovering from IDB/fileData...', e);
                const charMatch = (customCharacters && Array.isArray(customCharacters)) 
                  ? customCharacters.find(c => c.id === selectedCharacter) 
                  : null;
                if (charMatch && charMatch.fileData) {
                  try {
                    const freshUrl = URL.createObjectURL(charMatch.fileData);
                    e.currentTarget.src = freshUrl;
                    e.currentTarget.play().then(() => setIsVideoPlaying(true)).catch(() => {});
                    setUserLockedMediaUrl(freshUrl);
                    setCustomCharacters(prev => prev.map(c => c.id === charMatch.id ? { ...c, url: freshUrl } : c));
                  } catch (err) {}
                } else if (selectedCharacter && selectedCharacter.startsWith('custom_')) {
                  loadAllCharactersFromIDB().then(chars => {
                    const found = chars.find(c => c.id === selectedCharacter);
                    if (found && found.fileData) {
                      try {
                        const freshUrl = URL.createObjectURL(found.fileData);
                        if (desktopVideoRef.current) {
                          desktopVideoRef.current.src = freshUrl;
                          desktopVideoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
                        }
                        setUserLockedMediaUrl(freshUrl);
                        setCustomCharacters(prev => prev.map(c => c.id === found.id ? { ...c, url: freshUrl } : c));
                      } catch (err) {}
                    }
                  }).catch(() => {});
                }
              }}
              onTimeUpdate={(e) => {
                const curTime = e.currentTarget.currentTime;
                if (curTime > 0) {
                  lastPlaybackTimeRef.current = curTime;
                }
                // ⚡ ĐỒNG BỘ REALTIME ĐỊNH KỲ CHO TIKTOK LIVE STUDIO & OBS (BÁM SÁT REALTIME 100% TỪNG GIÂY)
                const now = Date.now();
                if (now - lastTimeBroadcastRef.current > 1000) {
                  lastTimeBroadcastRef.current = now;
                  let playUrl = selected.url;
                  if (typeof playUrl === 'string' && playUrl.startsWith('blob:')) {
                    const sMatch = customCharacters.find(c => c.id === selectedCharacter && c.mediaUrl && !c.mediaUrl.startsWith('blob:'));
                    playUrl = sMatch ? sMatch.mediaUrl : (userLockedMediaUrl && !userLockedMediaUrl.startsWith('blob:') ? userLockedMediaUrl : null);
                  }
                  if (typeof playUrl === 'string' && playUrl.includes('/uploads/')) {
                    playUrl = playUrl.substring(playUrl.indexOf('/uploads/'));
                  }
                  const syncData = {
                    action: 'time_sync',
                    currentTime: curTime,
                    isPlaying: !e.currentTarget.paused,
                    isMuted: liveAudioMuted,
                    volume: liveVolume,
                    timestamp: now
                  };
                  if (playUrl && typeof playUrl === 'string' && !playUrl.startsWith('blob:')) {
                    syncData.mediaUrl = playUrl;
                  }
                  sendVideoControl(syncData, socketRef.current);
                  // 📡 BẮN CẢ BROADCAST CHANNEL CHO CỬA SỔ LIVE 9:16 (WINDOW CAPTURE TRÊN CÙNG MÁY KHÓA CHẶT TỪNG FRAME)
                  postMasterBroadcast({
                    type: 'MASTER_TIME_SYNC',
                    currentTime: curTime,
                    isPlaying: !e.currentTarget.paused,
                    isMuted: liveAudioMuted,
                    isVideoAudioMuted: liveAudioMuted,
                    volume: liveAudioMuted ? 0 : liveVolume,
                    mediaUrl: playUrl && typeof playUrl === 'string' && !playUrl.startsWith('blob:') ? playUrl : undefined,
                    source: 'desktop',
                    timestamp: now
                  });
                }
              }}
              onLoadedMetadata={(e) => {
                const v = e.currentTarget;
                v.muted = isLocalSpeakerMuted;
                if (!isLocalSpeakerMuted) {
                  v.volume = liveVolume;
                }
                // ⚡ Khôi phục vị trí đang phát nếu người dùng đổi tab hoặc đổi stage quay lại
                if (lastPlaybackTimeRef.current && lastPlaybackTimeRef.current > 0) {
                  try {
                    v.currentTime = lastPlaybackTimeRef.current;
                  } catch (err) {}
                }
                const isManualPaused = v.dataset.userPaused === 'true';
                if (!isManualPaused) {
                  v.dataset.userPaused = 'false';
                  v.play().then(() => setIsVideoPlaying(true)).catch(() => {
                    v.muted = true;
                    v.play().then(() => setIsVideoPlaying(true)).catch(() => {});
                  });
                }
              }} 
              onCanPlay={(e) => {
                const v = e.currentTarget;
                if (v.paused && v.dataset.userPaused !== 'true') {
                  v.play().then(() => setIsVideoPlaying(true)).catch(() => {});
                }
              }}
              onCanPlayThrough={(e) => {
                const v = e.currentTarget;
                if (v.paused && v.dataset.userPaused !== 'true') {
                  v.play().then(() => setIsVideoPlaying(true)).catch(() => {});
                }
              }}
              onWaiting={(e) => {
                const v = e.currentTarget;
                if (v && v.dataset.userPaused !== 'true') {
                  const resumePlay = () => {
                    if (v.dataset.userPaused !== 'true' && v.readyState >= 3) {
                      v.play().then(() => setIsVideoPlaying(true)).catch(() => {});
                    }
                  };
                  v.addEventListener('canplay', resumePlay, { once: true });
                }
              }}
              onStalled={(e) => {
                const v = e.currentTarget;
                if (v && v.dataset.userPaused !== 'true') {
                  setTimeout(() => {
                    if (v.dataset.userPaused !== 'true' && v.readyState >= 2) {
                      v.play().then(() => setIsVideoPlaying(true)).catch(() => {});
                    }
                  }, 500);
                }
              }}
              onPlay={(e) => {
                if (isInternalPlaybackChangeRef.current) return;
                e.currentTarget.dataset.userPaused = 'false';
                setIsVideoPlaying(true);
                
                // Đồng bộ playback sang các kênh nếu phiên live đang chạy
                if (isMasterLiveRunning) {
                  const curTime = e.currentTarget.currentTime;
                  let playUrl = selected.url;
                  if (typeof playUrl === 'string' && playUrl.includes('/uploads/')) {
                    playUrl = playUrl.substring(playUrl.indexOf('/uploads/'));
                  }
                  sendVideoControl({
                    action: 'play',
                    currentTime: curTime,
                    isPlaying: true,
                    force: false,
                    mediaUrl: playUrl,
                    timestamp: Date.now()
                  }, socketRef.current);

                  syncMasterLiveState({
                    stage: 'idol',
                    mediaUrl: playUrl,
                    isVideo: true,
                    videoPlaybackEvent: 'play',
                    videoCurrentTime: curTime,
                    force: false,
                    isPlaying: true
                  }, socketRef.current);

                  try {
                    const bc = new BroadcastChannel('avalive_master_live_stream');
                    bc.postMessage({ 
                      type: 'GLOBAL_PLAYBACK_CHANGE', 
                      isPlaying: true, 
                      userPaused: false, 
                      currentTime: curTime, 
                      force: false,
                      source: 'desktop',
                      timestamp: Date.now() 
                    });
                    setTimeout(() => bc.close(), 100);
                  } catch (err) {}
                }
              }}
              onPause={(e) => {
                if (isInternalPlaybackChangeRef.current) return;
                const v = e.currentTarget;
                if (v.seeking) return;
                // Chỉ xử lý nếu đây là hành động do người dùng bấm Dừng chủ động
                const isManualPaused = v.dataset.userPaused === 'true';
                if (!isManualPaused) {
                  if (v.paused && v.readyState >= 2) {
                    v.play().catch(() => {});
                  }
                  return;
                }
                setIsVideoPlaying(false);
              }}
              onSeeked={(e) => {
                const curTime = e.currentTarget.currentTime;
                if (curTime > 0) {
                  lastPlaybackTimeRef.current = curTime;
                }
                // ⚡ ĐỒNG BỘ TỨC THÌ KHI STREAMER TUA KHUNG HÌNH (BÁM SÁT KHUNG HÌNH THỜI GIAN THẬT)
                if (!isInternalPlaybackChangeRef.current) {
                  let playUrl = selected.url;
                  if (typeof playUrl === 'string' && playUrl.includes('/uploads/')) {
                    playUrl = playUrl.substring(playUrl.indexOf('/uploads/'));
                  }
                  sendVideoControl({
                    action: 'seek',
                    currentTime: curTime,
                    isPlaying: !e.currentTarget.paused,
                    force: true,
                    mediaUrl: playUrl,
                    timestamp: Date.now()
                  }, socketRef.current);
                  syncMasterLiveState({
                    stage: 'idol',
                    mediaUrl: playUrl,
                    videoPlaybackEvent: 'seek',
                    videoCurrentTime: curTime,
                    force: true,
                    isPlaying: !e.currentTarget.paused
                  }, socketRef.current);
                }
              }}
              onEnded={(e) => {
                // Tự động chuyển bài kế tiếp trong playlist nếu có nhiều video, hoặc lặp 0ms liền mạch (24/24)
                const validVideos = Array.isArray(customCharacters) 
                  ? customCharacters.filter(c => Boolean(c.url || c.mediaUrl)) 
                  : [];
                if (validVideos.length > 1) {
                  const currentIndex = validVideos.findIndex(c => c.id === selectedCharacter);
                  const nextIndex = (currentIndex >= 0 && currentIndex < validVideos.length - 1) ? currentIndex + 1 : 0;
                  const nextChar = validVideos[nextIndex];
                  if (nextChar) {
                    handleSelectCharacter(nextChar.id);
                    return;
                  }
                }
                try {
                  e.currentTarget.currentTime = 0;
                  e.currentTarget.play().catch(() => {});
                } catch (err) {}
              }}
            />

            {/* 2 NÚT CHÌM TỰ ĐỘNG ẨN: CHỈ HIỆN KHI RÊ CHUỘT HOẶC CHẠM VÀO VIDEO (GIỮ KHUNG HÌNH 100% SẠCH SẼ & ĐẸP MẮT) */}
            <div 
              onClick={(e) => e.stopPropagation()}
              className={`absolute top-3 left-3 z-30 flex items-center gap-2 pointer-events-auto transition-all duration-200 ${
                !isVideoPlaying 
                  ? 'opacity-100' 
                  : 'opacity-0 hover:opacity-100 group-hover/videoContainer:opacity-100'
              }`}
            >
              {/* Nút 1: Tạm dừng / Tiếp tục */}
              <button
                type="button"
                onClick={toggleDesktopVideoPlayback}
                className={`pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xl border backdrop-blur-md transition-all cursor-pointer active:scale-95 select-none ${
                  isVideoPlaying
                    ? 'bg-black/60 hover:bg-black/80 text-white border-white/20'
                    : 'bg-emerald-600/90 hover:bg-emerald-500 text-white border-emerald-400/60 animate-pulse'
                }`}
                title={isVideoPlaying ? "Tạm dừng phát video [Phím tắt: Space]" : "Tiếp tục phát video [Phím tắt: Space]"}
              >
                {isVideoPlaying ? <Pause size={13} className="fill-white" /> : <Play size={13} className="fill-white" />}
                <span>{isVideoPlaying ? 'TẠM DỪNG' : 'TIẾP TỤC'}</span>
              </button>

              {/* Nút 2: Mở / Tắt Âm Thanh Toàn Diện (Đồng Bộ Cả Live & Loa Máy) */}
              <button
                type="button"
                onClick={handleToggleLocalSpeakerMute}
                className={`pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xl border backdrop-blur-md transition-all cursor-pointer active:scale-95 select-none ${
                  !isLocalSpeakerMuted
                    ? 'bg-black/70 hover:bg-black/90 text-cyan-300 border-cyan-400/30'
                    : 'bg-rose-950/85 hover:bg-rose-900 text-rose-300 border-rose-500/50'
                }`}
                title={isLocalSpeakerMuted ? "Âm thanh đang TẮT (Live & Máy) — Bấm để BẬT tiếng toàn bộ" : "Âm thanh đang BẬT (Live & Máy) — Bấm để TẮT tiếng toàn bộ"}
              >
                {!isLocalSpeakerMuted ? <Volume2 size={13} className="text-cyan-400 animate-pulse" /> : <VolumeX size={13} className="text-rose-400" />}
                <span>{!isLocalSpeakerMuted ? 'TIẾNG: ĐANG BẬT' : 'TIẾNG: ĐÃ TẮT'}</span>
              </button>
            </div>
          </div>
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
    const isIdolActive = !isGameBattleActive && !isGameBanDoActive;

    return (
      <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
        {/* -1. Chế độ Game Chiến Đấu (TikTok LIVE Battle Overlay) - CHỈ KÍCH HOẠT KHI NGƯỜI DÙNG CHỌN TAB NÀY */}
        {isGameBattleActive && (
          <div className="w-full h-full">
            <GameChienDau 
              isPopout={false}
              onOpenAdmin={() => setIsGameAdminOpen(true)}
              externalLiveEvent={lastGameEvent}
              aspectRatio={globalAspectRatio}
              onToggleAspectRatio={toggleGlobalAspectRatio}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {/* -2. Chế độ Game Đất Nước Bản Đồ Hình Chữ S (Việt Nam Ghép Cờ LIVE) - CHỈ KÍCH HOẠT KHI NGƯỜI DÙNG CHỌN TAB NÀY */}
        {isGameBanDoActive && (
          <div className="w-full h-full">
            <GameBanDoVietNam 
              isPopout={false}
              onOpenAdmin={() => setIsGameBanDoAdminOpen(true)}
              externalLiveEvent={lastGameEvent}
              aspectRatio={globalAspectRatio}
              onToggleAspectRatio={toggleGlobalAspectRatio}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {/* 0. Chế độ AI Idol Livestream Video / Live Screen (Chỉ render khi người dùng đang ở tab Idol, tối ưu 100% tài nguyên) */}
        {isIdolActive && (
          <div 
            className={`w-full h-full flex items-center justify-center p-2 sm:p-3 overflow-hidden ${isDarkMode ? 'bg-[#05070c]' : 'bg-slate-200'}`}
          >
            <div 
              className={`relative flex flex-col overflow-hidden transition-all duration-300 ${
                globalAspectRatio === '9:16'
                  ? 'h-full max-h-full aspect-[9/16] w-auto max-w-full mx-auto rounded-2xl md:rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.85)] bg-black'
                  : 'w-full max-w-[1200px] h-auto max-h-full aspect-[16/9] rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.85)] bg-black'
              }`}
            >
              {renderAiIdolLiveStage()}

              {/* LỚP 1.5: VIDEO PHỤ PIP (PICTURE-IN-PICTURE) XẾP CHỒNG TỪ SEQUENCER (ẢNH 4) */}
              {isMasterStageSynced && flowSequencerOverlay?.secondaryMediaUrl && (() => {
                const pipTrans = flowSequencerOverlay.secondaryMediaTransform || {
                  x: flowSequencerOverlay.secondaryMediaPos === 'top-left' ? 4 : flowSequencerOverlay.secondaryMediaPos === 'bottom-left' ? 4 : flowSequencerOverlay.secondaryMediaPos === 'bottom-right' ? 55 : 55,
                  y: flowSequencerOverlay.secondaryMediaPos === 'bottom-left' || flowSequencerOverlay.secondaryMediaPos === 'bottom-right' ? 70 : 4,
                  width: flowSequencerOverlay.secondaryMediaScale || 40,
                  height: 25,
                  zIndex: 25
                };
                const pipChroma = getChromaStyle(flowSequencerOverlay.secondaryMediaChromaKey);

                return (
                  <div 
                    className="absolute transition-all duration-300 pointer-events-none"
                    style={{
                      left: `${pipTrans.x}%`,
                      top: `${pipTrans.y}%`,
                      width: `${pipTrans.width}%`,
                      height: pipTrans.height ? `${pipTrans.height}%` : 'auto',
                      zIndex: pipTrans.zIndex || 25,
                      ...pipChroma
                    }}
                  >
                    <video
                      src={flowSequencerOverlay.secondaryMediaUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.85)] border-2 border-white/50 backdrop-blur-sm"
                      style={pipChroma}
                    />
                  </div>
                );
              })()}

              {/* LỚP 2: OVERLAY HÌNH ẢNH / BANNER / POSTER TỪ SEQUENCER (ẢNH 4) */}
              {isMasterStageSynced && flowSequencerOverlay?.overlayImage && (() => {
                const bannerTrans = flowSequencerOverlay.overlayImageTransform || {
                  x: flowSequencerOverlay.overlayImagePos === 'top-right' ? 65 : flowSequencerOverlay.overlayImagePos === 'bottom-left' ? 4 : flowSequencerOverlay.overlayImagePos === 'bottom-right' ? 65 : 4,
                  y: flowSequencerOverlay.overlayImagePos === 'bottom-left' || flowSequencerOverlay.overlayImagePos === 'bottom-right' ? 70 : 4,
                  width: 32,
                  height: 20,
                  zIndex: 30
                };
                const bannerChroma = getChromaStyle(flowSequencerOverlay.overlayImageChromaKey);

                return (
                  <div 
                    className="absolute pointer-events-none transition-all duration-300 animate-fadeIn"
                    style={{
                      left: `${bannerTrans.x}%`,
                      top: `${bannerTrans.y}%`,
                      width: `${bannerTrans.width}%`,
                      height: bannerTrans.height ? `${bannerTrans.height}%` : 'auto',
                      zIndex: bannerTrans.zIndex || 30,
                      ...bannerChroma
                    }}
                  >
                    <img 
                      src={flowSequencerOverlay.overlayImage} 
                      alt="Sequencer Overlay" 
                      className="w-full h-full object-contain rounded-xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                      style={bannerChroma}
                    />
                  </div>
                );
              })()}

              {/* LỚP 3: OVERLAY TIÊU ĐỀ / CHỮ NỔI BẬT TỪ SEQUENCER (ẢNH 4) */}
              {isMasterStageSynced && flowSequencerOverlay?.overlayText && (() => {
                const textTrans = flowSequencerOverlay.overlayTextTransform || {
                  x: 4,
                  y: 5,
                  width: 92,
                  zIndex: 35
                };

                return (
                  <div 
                    className="absolute pointer-events-none transition-all duration-300 animate-fadeIn"
                    style={{
                      left: `${textTrans.x}%`,
                      top: `${textTrans.y}%`,
                      width: `${textTrans.width}%`,
                      zIndex: textTrans.zIndex || 35
                    }}
                  >
                    <div 
                      className={`w-full py-1.5 px-3 rounded-2xl text-center font-black tracking-wide uppercase transition-all ${
                        flowSequencerOverlay.overlayTextStyle === 'neon_cyber' 
                          ? 'bg-slate-950/90 border border-cyan-400 text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.8)]' :
                        flowSequencerOverlay.overlayTextStyle === 'gold_luxury' 
                          ? 'bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 text-slate-950 shadow-[0_0_25px_rgba(251,191,36,0.9)] border border-yellow-200' :
                        flowSequencerOverlay.overlayTextStyle === 'gradient_rose' 
                          ? 'bg-gradient-to-r from-rose-600 via-pink-500 to-rose-600 text-white shadow-[0_0_25px_rgba(244,63,94,0.8)] border border-pink-300/40' :
                        flowSequencerOverlay.overlayTextStyle === 'minimal_dark' 
                          ? 'bg-black/85 border border-white/20 text-white backdrop-blur-md shadow-2xl' :
                          'bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white shadow-[0_0_25px_rgba(239,68,68,0.85)] border border-amber-300/50'
                      }`}
                      style={{
                        fontFamily: flowSequencerOverlay.overlayTextFontFamily === 'montserrat' ? "'Montserrat', sans-serif" :
                                    flowSequencerOverlay.overlayTextFontFamily === 'be_vietnam' ? "'Be Vietnam Pro', sans-serif" :
                                    flowSequencerOverlay.overlayTextFontFamily === 'lexend' ? "'Lexend', sans-serif" :
                                    flowSequencerOverlay.overlayTextFontFamily === 'impact' ? "Impact, sans-serif" :
                                    flowSequencerOverlay.overlayTextFontFamily === 'inter' ? "'Inter', sans-serif" :
                                    flowSequencerOverlay.overlayTextFontFamily === 'roboto' ? "'Roboto', sans-serif" :
                                    flowSequencerOverlay.overlayTextFontFamily === 'playfair' ? "'Playfair Display', serif" :
                                    flowSequencerOverlay.overlayTextFontFamily === 'anton' ? "'Anton', sans-serif" : undefined,
                        fontSize: flowSequencerOverlay.overlayTextFontSize ? `${flowSequencerOverlay.overlayTextFontSize}px` : undefined,
                        color: flowSequencerOverlay.overlayTextColor || undefined
                      }}
                    >
                      {flowSequencerOverlay.overlayText}
                    </div>
                  </div>
                );
              })()}

              {/* OVERLAY SẢN PHẨM ĐANG GHIM TỰ ĐỘNG TỪ TIKTOK SHOP (shop.tiktok.com) */}
              {livePinnedProduct && (
                <div className="absolute bottom-4 left-4 z-40 max-w-[290px] sm:max-w-[340px] pointer-events-auto transition-all animate-bounce-subtle">
                  <div className="bg-slate-950/95 backdrop-blur-md border border-rose-500/80 rounded-2xl p-2.5 shadow-[0_10px_25px_rgba(244,63,94,0.45)] text-white space-y-1.5">
                    {/* Header TikTok Shop */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-1">
                      <span className="text-[9px] font-black text-rose-400 flex items-center gap-1 uppercase tracking-wider">
                        <span>🎵 TIKTOK SHOP</span>
                        <span className="text-gray-400">• shop.tiktok.com</span>
                      </span>
                      {livePinnedProduct.triggerSource && (
                        <span className="text-[8px] font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-500/30 truncate max-w-[140px]">
                          {livePinnedProduct.triggerSource.includes('comment') ? '💬 Khách hỏi' :
                           livePinnedProduct.triggerSource.includes('video') ? '🎬 Theo video' :
                           livePinnedProduct.triggerSource.includes('sequencer') ? '⚡ Kịch bản Live' : '🔥 Auto Pin'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/20 bg-black">
                        <img src={livePinnedProduct.image} alt={livePinnedProduct.name} className="w-full h-full object-cover" />
                        <span className="absolute top-0 left-0 bg-rose-600 text-white text-[7px] font-black px-1 py-0.2 rounded-br uppercase tracking-wider">
                          {livePinnedProduct.id ? `MÃ #${livePinnedProduct.id}` : '📌 GHIM'}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <h4 className="text-[11px] font-black text-white truncate">{livePinnedProduct.name}</h4>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="text-xs font-black text-rose-400 font-mono">{livePinnedProduct.price}</span>
                          {livePinnedProduct.oldPrice && (
                            <span className="text-[9px] text-gray-400 line-through font-mono">{livePinnedProduct.oldPrice}</span>
                          )}
                        </div>
                        <div className="text-[8px] text-amber-300 font-bold flex items-center gap-1 mt-0.5">
                          <span>🔥 {livePinnedProduct.badge || 'DEAL TIKTOK SHOP'}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setLivePinnedProduct(null);
                          localStorage.removeItem('avalive_current_pinned_product');
                        }}
                        className="text-gray-400 hover:text-white p-1 rounded-md text-xs cursor-pointer self-start"
                        title="Bỏ ghim"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderGmailLoginModal = () => {
    if (!isGmailLoginModalOpen) return null;

    const displayTokens = currentUser 
      ? (typeof currentUser.tokens === 'number' 
          ? Number(currentUser.tokens).toLocaleString() 
          : ((currentUser.plan === 'Free' || !currentUser.plan) ? '100' : '100.000')) 
      : '0';

    const displayLiveTime = currentUser 
      ? (typeof currentUser.liveMinutes === 'number' 
          ? `${Math.round(currentUser.liveMinutes / 60).toLocaleString()} Giờ` 
          : ((currentUser.plan === 'Free' || !currentUser.plan) ? '1h' : '10.000 Giờ')) 
      : '0h';

    return (
      <div className="fixed inset-0 w-screen h-screen bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 font-sans select-none overflow-y-auto">
        <div className="relative max-w-md w-full bg-[#121420]/98 backdrop-blur-2xl border border-cyan-500/30 rounded-[32px] p-6 sm:p-8 shadow-2xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <button 
            onClick={() => setIsGmailLoginModalOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>

          {/* Logo Brand */}
          <div className="flex flex-col items-center gap-2.5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-pink-500 p-0.5 shadow-[0_0_30px_rgba(0,240,255,0.4)]">
              {currentUser && currentUser.email !== 'khachhang@avalive.com' ? (
                <img 
                  src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.email)}`}
                  alt="Avatar"
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#0d0e17] rounded-2xl flex items-center justify-center">
                  <Video className="w-8 h-8 text-cyan-400" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                {currentUser && currentUser.email !== 'khachhang@avalive.com' ? currentUser.email : 'AVALIVE VIP PRO STUDIO'}
              </h1>
              <p className="text-xs text-gray-400 mt-0.5 font-bold">
                {currentUser && currentUser.email !== 'khachhang@avalive.com' 
                  ? `Gói Hiện Tại: ${currentUser.isAdmin ? 'SUPER ADMIN ENTERPRISE' : (currentUser.plan || 'Gói Cơ Bản')}` 
                  : 'Đồng Bộ Bản Quyền Gmail & Quản Trị Doanh Số'}
              </p>
            </div>
          </div>

          {currentUser && currentUser.email !== 'khachhang@avalive.com' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 border border-amber-500/30 rounded-2xl p-3.5 flex flex-col items-center gap-1.5">
                  <Coins className="w-5 h-5 text-amber-400" />
                  <span className="text-[11px] text-gray-400 font-medium">Số Dư Token AI</span>
                  <span className="text-base font-black text-amber-300">{displayTokens}</span>
                </div>
                <div className="bg-white/5 border border-emerald-500/30 rounded-2xl p-3.5 flex flex-col items-center gap-1.5">
                  <Clock className="w-5 h-5 text-emerald-400" />
                  <span className="text-[11px] text-gray-400 font-medium">Thời Gian Live</span>
                  <span className="text-base font-black text-emerald-300">{displayLiveTime}</span>
                </div>
              </div>
              
              {/* Nút Kho Template Video / Ảnh Mẫu (Chỉ mở khi đã mua gói VIP / PRO) */}
              <button
                onClick={() => {
                  const isPaidPlan = currentUser.isAdmin || (currentUser.plan && currentUser.plan.toUpperCase() !== 'FREE' && currentUser.plan.toUpperCase() !== 'MIỄN PHÍ');
                  setIsGmailLoginModalOpen(false);
                  if (!isPaidPlan) {
                    setToast({
                      type: 'error',
                      message: '🔒 Kho Template Video & Ảnh Mẫu chỉ dành riêng cho tài khoản đã mua gói VIP PRO!'
                    });
                    setActiveSettingsModal('payment');
                  } else {
                    setIsTemplateLibraryOpen(true);
                  }
                }}
                className="w-full flex items-center justify-between py-2.5 px-4 bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/50 hover:to-pink-600/50 border border-purple-400/40 text-white rounded-xl font-bold text-xs shadow-md transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-pink-400" />
                  <span>🎬 Kho Template Video & Ảnh Mẫu</span>
                </div>
                {currentUser.isAdmin || (currentUser.plan && currentUser.plan.toUpperCase() !== 'FREE' && currentUser.plan.toUpperCase() !== 'MIỄN PHÍ') ? (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-black text-[9px] font-black">
                    VIP
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-300 text-[9px] font-black">
                    🔒 Mua Gói
                  </span>
                )}
              </button>

              {/* Nút Nâng Cấp Gói */}
              <button
                onClick={() => {
                  setIsGmailLoginModalOpen(false);
                  setActiveSettingsModal('payment');
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-yellow-100" />
                <span>Bảng Giá & Nâng Cấp Gói VIP</span>
              </button>

              {/* Nút Làm Mới Dữ Liệu Từ Supabase */}
              <button
                onClick={async () => {
                  setIsLoggingIn(true);
                  try {
                    if (supabase && currentUser?.email) {
                      const { data: dbUser } = await supabase.from('users').select('*').eq('email', currentUser.email.toLowerCase().trim()).maybeSingle();
                      if (dbUser) {
                        const updatedUser = {
                          ...currentUser,
                          name: dbUser.name || currentUser.name,
                          avatar: dbUser.avatar_url || currentUser.avatar,
                          plan: dbUser.plan ? dbUser.plan.toUpperCase() : currentUser.plan,
                          tokens: typeof dbUser.tokens === 'number' ? dbUser.tokens : currentUser.tokens,
                          liveMinutes: typeof dbUser.live_minutes === 'number' ? dbUser.live_minutes : currentUser.liveMinutes,
                          liveTimeHours: Math.round((typeof dbUser.live_minutes === 'number' ? dbUser.live_minutes : (currentUser.liveMinutes || 6000)) / 60)
                        };
                        setCurrentUser(updatedUser);
                        localStorage.setItem('avalive_current_user', JSON.stringify(updatedUser));
                        if (typeof dbUser.tokens === 'number') localStorage.setItem('avalive_user_tokens', dbUser.tokens.toString());
                        window.dispatchEvent(new Event('avalive:user_updated'));
                        alert('✅ Đã đồng bộ thành công dữ liệu mới nhất từ Supabase!');
                      } else {
                        alert('Đã kiểm tra: Dữ liệu tài khoản của bạn đang ở trạng thái mới nhất.');
                      }
                    }
                  } catch(e) {
                    alert('Lỗi kiểm tra dữ liệu Supabase: ' + e.message);
                  } finally {
                    setIsLoggingIn(false);
                  }
                }}
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl font-bold text-xs transition-all hover:scale-[1.02] active:scale-98 cursor-pointer disabled:opacity-50"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isLoggingIn ? 'animate-spin' : ''}`} />
                <span>{isLoggingIn ? 'Đang Kiểm Tra Supabase...' : '🔄 Làm Mới & Đồng Bộ Lại Dữ Liệu'}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                  setIsGmailLoginModalOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-bold text-xs transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đổi Tài Khoản / Đăng Xuất</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* KHỐI KẾT NỐI 1-CHẠM DUY NHẤT VỚI LOGO AVALIVE */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#121528] via-[#0f111f] to-[#181a32] border border-cyan-500/40 text-center space-y-4 shadow-xl relative overflow-hidden">
                {/* Glow decor */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Logo AvaLive Duy Nhất */}
                <div className="flex items-center justify-center">
                  <div className="relative group">
                    <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 rounded-3xl blur-xl opacity-80 group-hover:opacity-100 transition duration-500 animate-pulse" />
                    <div className="relative w-24 h-24 rounded-3xl overflow-hidden border-2 border-cyan-400/80 shadow-[0_0_40px_rgba(6,182,212,0.6)] bg-black flex items-center justify-center p-1 group-hover:scale-105 transition-all">
                      <img src="/official_logo.jpg" alt="AvaLive Logo" className="w-full h-full object-cover rounded-2xl drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-cyan-300 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-1.5">
                    <span>ĐĂNG NHẬP & KẾT NỐI TÀI KHOẢN GOOGLE</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto">
                    Kết nối trực tiếp 1-chạm với tài khoản Google đang dùng để tự động đồng bộ ngay <b>Gói VIP PRO</b>, <b>Token AI</b> và <b>Thời gian Live</b> vào phần mềm.
                  </p>
                </div>

                {authError && (
                  <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold text-left">
                    ⚠️ {authError}
                  </div>
                )}

                {/* NÚT BẤM 1-CHẠM DUY NHẤT KẾT NỐI TRỰC TIẾP GOOGLE */}
                <button
                  type="button"
                  onClick={handleRealGoogleOAuth}
                  disabled={isLoggingIn}
                  className="w-full py-4 px-6 bg-white hover:bg-gray-50 text-gray-900 rounded-2xl font-black text-sm shadow-2xl shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-3 border border-gray-100"
                >
                  <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>{isLoggingIn ? '⏳ ĐANG KẾT NỐI GOOGLE...' : 'KẾT NỐI TRỰC TIẾP VỚI GOOGLE (1-CHẠM)'}</span>
                </button>
              </div>

              {/* Lựa chọn dùng miễn phí */}
              <button
                type="button"
                onClick={() => {
                  if (!currentUser) {
                    const guestUser = {
                      name: 'Khách Hàng AvaLive',
                      email: 'khachhang@avalive.com',
                      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',
                      isAdmin: false,
                      plan: 'Free',
                      tokens: 100,
                      liveMinutes: 600,
                      liveTimeHours: 10
                    };
                    setCurrentUser(guestUser);
                    try { localStorage.setItem('avalive_current_user', JSON.stringify(guestUser)); } catch (e) {}
                  }
                  setIsGmailLoginModalOpen(false);
                }}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl font-medium text-xs border border-white/5 transition-colors cursor-pointer"
              >
                🎁 Tiếp Tục Dùng Bản Dùng Thử (100 Token)
              </button>
            </div>
          )}

          {authError && (
            <div className="p-2.5 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 text-xs text-left flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

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
      <div className={`flex items-center justify-between px-2 py-1 ${isDarkMode ? 'bg-[#1c1c23] border-gray-800 text-white' : 'bg-slate-200 border-slate-300 text-slate-800'} select-none z-50 border-b`}>
        <div className="flex items-center gap-2 shrink-0 max-w-[40%]">
          <div className="relative flex items-center justify-center shrink-0 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-lg blur-xs opacity-75 group-hover:opacity-100 transition animate-pulse"></div>
            <div className="relative w-5 h-5 rounded-md overflow-hidden border border-cyan-300/60 shadow-[0_0_10px_rgba(6,182,212,0.5)] bg-black">
              <img src="/official_logo.jpg" alt="AvaLive Logo" className="w-full h-full object-cover" />
            </div>
          </div>
          <span 
            className="text-[11px] font-black tracking-tight truncate max-w-[130px] sm:max-w-[180px] bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent"
            title={CHARACTERS[selectedCharacter]?.name || (Object.keys(CHARACTERS).length > 0 ? Object.values(CHARACTERS)[0]?.name : 'Live Idol Pro')}
          >
            Profile: {CHARACTERS[selectedCharacter]?.name || (Object.keys(CHARACTERS).length > 0 ? Object.values(CHARACTERS)[0]?.name : 'Live Idol Pro (Chưa đặt tên)')}
          </span>
          <button
            onClick={() => setShowUpdateModal(true)}
            className="text-[9px] bg-gradient-to-r from-blue-600/30 to-indigo-600/30 hover:from-blue-600/50 hover:to-indigo-600/50 text-cyan-300 px-1.5 py-0.5 rounded font-black border border-cyan-500/40 cursor-pointer flex items-center gap-1 transition-all hover:scale-105 shadow-xs shrink-0"
            title="Bấm để xem thông báo cập nhật mới nhất & tải bản cài đặt"
          >
            <Sparkles size={9} className="text-yellow-400 animate-pulse" />
            <span>v{APP_VERSION} Mới Nhất</span>
          </button>
        </div>
        
        <div className="flex items-center gap-1.5 flex-nowrap overflow-x-auto scrollbar-none shrink-0">
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

          {/* NÚT LIVE AI IDOL (ĐẶT KẾ BÊN NÚT BẬT TẤT CẢ THEO YÊU CẦU) */}
          <button 
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black transition-all border shadow-sm cursor-pointer ${
              !isGameBattleActive && !isGameBanDoActive && !isLiveStudioActive
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white border-cyan-300 shadow-cyan-500/40 ring-1 ring-cyan-400/50' 
                : (isDarkMode ? 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-900/50' : 'border-cyan-300 bg-cyan-50 text-cyan-700 hover:bg-cyan-100')
            }`}
            onClick={() => {
              setIsGameBattleActive(false);
              setIsGameBanDoActive(false);
              setIsLiveStudioActive(false);
              try { localStorage.setItem('avalive_active_stage', 'idol'); } catch (e) {}
              mapVoiceEngine.stopAll();
              battleVoiceEngine.stopAll();
              battleCommentary.stopAll();
              syncMasterLiveState({ stage: 'idol' }, socketRef.current); postMasterBroadcast({ type: 'GLOBAL_STAGE_CHANGE', stage: 'idol' });
            }}
            title="Chuyển sang màn hình Livestream AI Idol"
          >
            <Video size={11} className={!isGameBattleActive && !isGameBanDoActive && !isLiveStudioActive ? 'text-yellow-300 animate-pulse' : 'text-cyan-400'} />
            <span className="whitespace-nowrap uppercase tracking-tight">Live AI Idol</span>
            {!isGameBattleActive && !isGameBanDoActive && !isLiveStudioActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            )}
          </button>





          {/* Nút Cài đặt Nhanh Game khi Game đang mở trên màn hình */}
          {isGameBattleActive && (
            <button
              onClick={() => setIsGameAdminOpen(true)}
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-gradient-to-r from-purple-900/90 to-indigo-900/90 hover:from-purple-800 hover:to-indigo-800 text-purple-200 hover:text-white border border-purple-400/80 shadow-xs transition-all animate-in fade-in duration-200"
              title="Cài đặt Game Chiến Đấu"
            >
              <Settings size={10} className="text-yellow-300" />
              <span>⚙️ Game Chiến Đấu</span>
            </button>
          )}

          {isGameBanDoActive && (
            <button
              onClick={() => setIsGameBanDoAdminOpen(true)}
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-gradient-to-r from-amber-900/90 to-red-900/90 hover:from-amber-800 hover:to-red-800 text-amber-200 hover:text-white border border-amber-400/80 shadow-xs transition-all animate-in fade-in duration-200"
              title="Cài đặt Game Bản Đồ"
            >
              <Settings size={10} className="text-yellow-300" />
              <span>⚙️ Game Bản Đồ</span>
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
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold transition-all border shadow-xs cursor-pointer active:scale-95 ${
                isLangDropdownOpen
                  ? 'bg-amber-600 text-white border-amber-400 ring-2 ring-amber-400/40'
                  : (isDarkMode ? 'bg-white/10 hover:bg-white/20 text-yellow-300 border-white/20' : 'bg-gray-100 hover:bg-gray-200 text-slate-800 border-gray-300')
              }`}
              title="Chuyển đổi ngôn ngữ hệ thống & Giọng đọc AI (20 Quốc Gia)"
            >
              <Globe size={13} className="text-amber-400 shrink-0" />
              <span className="whitespace-nowrap font-bold">
                {SUPPORTED_LANGUAGES.find(l => l.code === currentLang)?.flag || '🌐'} {SUPPORTED_LANGUAGES.find(l => l.code === currentLang)?.name || 'Ngôn ngữ'}
              </span>
            </button>
          </div>

          <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-0.5 rounded transition-colors ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-400 text-gray-800 hover:bg-gray-500'}`}>
            {isDarkMode ? <Sun size={10} /> : <Moon size={10} />}
          </button>

          {/* Nút Mở Link Realtime TikTok LIVE Studio & OBS Studio (Cloudflare Tunnel) */}
          <button
            onClick={() => {
              setShowOverlayModal(true);
            }}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold border shadow-xs transition-all hover:scale-105 cursor-pointer bg-cyan-600/80 hover:bg-cyan-500 text-white border-cyan-400/50"
            title="Mở & Sao chép Link Live Overlay Cloudflare Tunnel cho TikTok LIVE Studio / OBS Studio"
          >
            <Radio size={10} className="text-yellow-300 animate-pulse" />
            <span className="whitespace-nowrap">📡 Link Live</span>
          </button>

          {/* 👑 1 Ô DUY NHẤT: LOGO TÀI KHOẢN + GÓI + SỐ DƯ TOKEN & THỜI GIAN LIVE */}
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[9.5px] shadow-xs shrink-0 ${isDarkMode ? 'bg-[#12131d]/90 border-cyan-500/30' : 'bg-white border-gray-300'}`}>
            {currentUser ? (
              <div 
                onClick={() => setIsGmailLoginModalOpen(true)}
                className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
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
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              title="Mở Bảng Menu Chức Năng Ava Live"
            >
              <Settings size={14} className="animate-spin-slow" />
              <span className="tracking-wide font-black uppercase">{t('menu', currentLang)}</span>
            </button>

            {isSettingsDropdownOpen && (
              <div className={`absolute top-full left-0 mt-2 w-72 rounded-2xl shadow-2xl border z-50 p-2.5 overflow-hidden ${isDarkMode ? 'bg-[#181824]/98 border-gray-700 text-white shadow-black/80' : 'bg-white border-gray-200 text-slate-800 shadow-xl'} animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-xl`}>
                
                {/* 0. LUỒNG LIVE IDOL 1-4 AVATAR */}
                <button 
                  type="button"
                  onMouseDown={(e) => { 
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveSettingsModal('workspace_sequencer'); 
                    setIsSettingsDropdownOpen(false); 
                  }}
                  onClick={(e) => { 
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveSettingsModal('workspace_sequencer'); 
                    setIsSettingsDropdownOpen(false); 
                  }}
                  className={`w-full text-left px-3 py-2 mb-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between gap-2.5 cursor-pointer ${isDarkMode ? 'bg-gradient-to-r from-rose-950/70 to-pink-900/50 hover:from-rose-600 hover:to-pink-600 text-rose-100 hover:text-white border border-rose-700/60 shadow-md' : 'bg-rose-50 hover:bg-rose-500 text-rose-800 hover:text-white border border-rose-200'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers size={16} className="text-rose-400 shrink-0" />
                    <span className="font-black uppercase tracking-tight">🎬 Luồng Live Idol 1-4 Avatar</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-black bg-rose-600 text-white shadow-xs">MỚI</span>
                </button>

                {/* 1. BỘ NÃO AI */}
                <button 
                  onClick={() => { setActiveSettingsModal('general'); setIsSettingsDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2 mb-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${isDarkMode ? 'bg-gradient-to-r from-blue-900/40 to-blue-800/20 hover:from-blue-600 hover:to-blue-500 text-blue-100 hover:text-white border border-blue-800/50' : 'bg-blue-50 hover:bg-blue-500 text-blue-800 hover:text-white'}`}
                >
                  <Brain size={16} className="text-yellow-300 animate-pulse shrink-0" />
                  <span>🧠 {t('aiBrain', currentLang)}</span>
                </button>

                {/* 2. KẾT NỐI IDOL */}
                <button 
                  onClick={() => { setActiveSettingsModal('workspace_events'); setIsSettingsDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2 mb-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${isDarkMode ? 'bg-gradient-to-r from-purple-900/40 to-purple-800/20 hover:from-purple-600 hover:to-purple-500 text-purple-100 hover:text-white border border-purple-800/50' : 'bg-purple-50 hover:bg-purple-500 text-purple-800 hover:text-white'}`}
                >
                  <Radio size={16} className="text-purple-400 shrink-0" />
                  <span>{t('idolConnect', currentLang)}</span>
                </button>

                {/* 3. KẾT NỐI SHOPEE LIVE */}
                <button 
                  onClick={() => { setActiveSettingsModal('shopee_live'); setIsSettingsDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2 mb-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between gap-2.5 ${isDarkMode ? 'bg-gradient-to-r from-orange-950/60 to-amber-900/40 hover:from-orange-600 hover:to-amber-600 text-orange-200 hover:text-white border border-orange-700/60 shadow-md' : 'bg-orange-50 hover:bg-orange-500 text-orange-800 hover:text-white border border-orange-200'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag size={16} className="text-[#EE4D2D] shrink-0" />
                    <span>KẾT NỐI SHOPEE LIVE (URL & KEY)</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-black bg-[#EE4D2D] text-white shadow-xs">MỚI</span>
                </button>

                {/* 4. VƯỢT CAPTCHA */}
                <button 
                  onClick={() => { setActiveSettingsModal('captcha'); setIsSettingsDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2 mb-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${isDarkMode ? 'bg-gradient-to-r from-emerald-900/50 to-teal-800/30 hover:from-emerald-600 hover:to-teal-500 text-emerald-200 hover:text-white border border-emerald-700/60 shadow-lg' : 'bg-emerald-50 hover:bg-emerald-500 text-emerald-800 hover:text-white'}`}
                >
                  <Shield size={16} className="text-emerald-400 shrink-0" />
                  <span>{t('captchaBypass', currentLang)}</span>
                </button>

                {/* Đường phân cách */}
                <div className={`my-1.5 border-t ${isDarkMode ? 'border-gray-700/60' : 'border-gray-200'}`} />

                {/* 5. GAME CHIẾN ĐẤU */}
                <button 
                  onClick={() => {
                    setIsGameBattleActive(true);
                    setIsGameBanDoActive(false);
                    setIsLiveStudioActive(false);
                    try { localStorage.setItem('avalive_active_stage', 'battle'); } catch (e) {}
                    mapVoiceEngine.stopAll();
                    if (isMasterLiveRunning) {
                      bandoAudio.unlock();
                      if (battleCommentary.isEnabled) battleCommentary.startPeriodicCommentary(true);
                      if (battleVoiceEngine.isAutoEnabled) battleVoiceEngine.startPeriodicCommentary(true);
                    }
                    syncMasterLiveState({ stage: 'battle' }, socketRef.current); 
                    postMasterBroadcast({ type: 'GLOBAL_STAGE_CHANGE', stage: 'battle' });
                    setIsSettingsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 mb-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between gap-2.5 ${
                    isGameBattleActive 
                      ? (isDarkMode ? 'bg-gradient-to-r from-purple-900/60 to-indigo-900/60 text-yellow-300 border border-purple-400' : 'bg-purple-100 text-purple-900 border border-purple-300')
                      : (isDarkMode ? 'bg-purple-950/40 hover:bg-purple-900/60 text-purple-200 border border-purple-800/40' : 'bg-purple-50 hover:bg-purple-500 text-purple-800 hover:text-white')
                  }`}
                  title="Chuyển sang chế độ Game Chiến Đấu (TikTok LIVE Battle Game)"
                >
                  <div className="flex items-center gap-2.5">
                    <Swords size={16} className="text-purple-400 shrink-0" />
                    <span>Game Chiến Đấu (PK TikTok Live)</span>
                  </div>
                  {isGameBattleActive && <span className="text-[9px] px-1.5 py-0.5 rounded font-black bg-emerald-500 text-white">ĐANG CHẠY</span>}
                </button>

                {/* 6. BẢN ĐỒ CHỮ S */}
                <button 
                  onClick={() => {
                    setIsGameBanDoActive(true);
                    setIsGameBattleActive(false);
                    setIsLiveStudioActive(false);
                    try { localStorage.setItem('avalive_active_stage', 'bando'); } catch (e) {}
                    battleVoiceEngine.stopAll();
                    battleCommentary.stopAll();
                    if (isMasterLiveRunning) {
                      bandoAudio.unlock();
                      bandoAudio.playBgmOnLive();
                      mapVoiceEngine.startPeriodicCommentary(true);
                    }
                    syncMasterLiveState({ stage: 'bando' }, socketRef.current); 
                    postMasterBroadcast({ type: 'GLOBAL_STAGE_CHANGE', stage: 'bando' });
                    setIsSettingsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 mb-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between gap-2.5 ${
                    isGameBanDoActive 
                      ? (isDarkMode ? 'bg-gradient-to-r from-amber-900/60 to-red-900/60 text-yellow-300 border border-yellow-400' : 'bg-amber-100 text-amber-900 border border-amber-300')
                      : (isDarkMode ? 'bg-amber-950/40 hover:bg-amber-900/60 text-amber-200 border border-amber-800/40' : 'bg-amber-50 hover:bg-amber-500 text-amber-800 hover:text-white')
                  }`}
                  title="Chuyển sang Game Ghép Cờ Bản Đồ Việt Nam (Đất Nước Hình Chữ S)"
                >
                  <div className="flex items-center gap-2.5">
                    <Flag size={16} className="text-amber-400 shrink-0" />
                    <span>Bản Đồ Chữ S (Ghép Cờ Việt Nam)</span>
                  </div>
                  {isGameBanDoActive && <span className="text-[9px] px-1.5 py-0.5 rounded font-black bg-emerald-500 text-white">ĐANG CHẠY</span>}
                </button>

                {/* 7. LIVE AI IDOL (MÀN HÌNH ĐƠN) */}
                <button 
                  onClick={() => {
                    setIsGameBattleActive(false);
                    setIsGameBanDoActive(false);
                    setIsLiveStudioActive(false);
                    try { localStorage.setItem('avalive_active_stage', 'idol'); } catch (e) {}
                    mapVoiceEngine.stopAll();
                    battleVoiceEngine.stopAll();
                    battleCommentary.stopAll();
                    syncMasterLiveState({ stage: 'idol' }, socketRef.current); 
                    postMasterBroadcast({ type: 'GLOBAL_STAGE_CHANGE', stage: 'idol' });
                    setIsSettingsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 mb-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between gap-2.5 ${
                    !isGameBattleActive && !isGameBanDoActive && !isLiveStudioActive 
                      ? (isDarkMode ? 'bg-gradient-to-r from-blue-900/60 to-indigo-900/60 text-cyan-300 border border-blue-400' : 'bg-blue-100 text-blue-900 border border-blue-300')
                      : (isDarkMode ? 'bg-blue-950/40 hover:bg-blue-900/60 text-blue-200 border border-blue-800/40' : 'bg-blue-50 hover:bg-blue-500 text-blue-800 hover:text-white')
                  }`}
                  title="Chuyển về màn hình Livestream AI Idol Đơn"
                >
                  <div className="flex items-center gap-2.5">
                    <Video size={16} className="text-blue-400 shrink-0" />
                    <span>Live AI Idol (Màn Hình Đơn)</span>
                  </div>
                  {!isGameBattleActive && !isGameBanDoActive && !isLiveStudioActive && <span className="text-[9px] px-1.5 py-0.5 rounded font-black bg-blue-500 text-white">CHÍNH</span>}
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
              {/* Ô Nhân Vật (Linh hoạt số lượng 3, 5, 10...) */}
              {Array.from({ length: Math.max(3, customCharacters.length + 1) }).map((_, index) => {
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
                      let serverUrl = (charItem.mediaUrl && !charItem.mediaUrl.startsWith('blob:')) 
                        ? charItem.mediaUrl 
                        : (charItem.url && !charItem.url.startsWith('blob:') ? charItem.url : null);
                      if (!serverUrl && typeof charItem.url === 'string' && charItem.url.includes('/uploads/')) {
                        serverUrl = charItem.url.substring(charItem.url.indexOf('/uploads/'));
                      }
                      if (!serverUrl) {
                        try {
                          const locked = localStorage.getItem('avalive_user_locked_media');
                          if (locked && !locked.startsWith('blob:')) serverUrl = locked;
                        } catch(e) {}
                      }

                      let charUrl = serverUrl || charItem.url || charItem.mediaUrl;
                      if ((!charUrl || charUrl.startsWith('blob:')) && charItem.fileData) {
                        try {
                          charUrl = URL.createObjectURL(charItem.fileData);
                          charItem.url = charUrl;
                          setCustomCharacters(prev => prev.map(c => c.id === charItem.id ? { ...c, url: charUrl } : c));
                        } catch(e) {}
                      }
                      if (!charUrl) {
                        fileInputRef.current?.click();
                        return;
                      }
                      setSelectedCharacter(charItem.id);
                      try { localStorage.setItem('avalive_selected_char', charItem.id); } catch (e) {}
                      setIsGameBattleActive(false);
                      setIsGameBanDoActive(false);
                      if (charUrl) {
                        let cleanUrl = charUrl;
                        if (typeof cleanUrl === 'string' && cleanUrl.includes('/uploads/')) {
                          cleanUrl = cleanUrl.substring(cleanUrl.indexOf('/uploads/'));
                        }
                        let broadcastUrl = serverUrl || (cleanUrl.includes('/uploads/') ? cleanUrl : '');
                        if (typeof broadcastUrl === 'string' && broadcastUrl.includes('/uploads/')) {
                          broadcastUrl = broadcastUrl.substring(broadcastUrl.indexOf('/uploads/'));
                        }
                        const isVid = charItem.type === 'video' || (charItem.fileData?.type?.startsWith('video/')) || (typeof cleanUrl === 'string' && (cleanUrl.startsWith('blob:') || cleanUrl.endsWith('.mp4') || cleanUrl.endsWith('.webm') || cleanUrl.endsWith('.mov') || cleanUrl.includes('/uploads/') || cleanUrl.includes('/api/stream')));
                        if (broadcastUrl) {
                          setUserLockedMediaUrl(broadcastUrl);
                          try { localStorage.setItem('avalive_user_locked_media', broadcastUrl); } catch (e) {}
                        }

                        // ⚡ NẾU CHƯA CÓ SERVER URL MÀ CÓ FILE DỮ LIỆU -> NẠP LÊN SERVER NGAY LẬP TỨC
                        if (!broadcastUrl && charItem.fileData) {
                          try {
                            const formData = new FormData();
                            formData.append('file', charItem.fileData);
                            fetch('/api/upload-media', { method: 'POST', body: formData })
                              .then(r => r.json())
                              .then(d => {
                                if (d && d.url) {
                                  const u = d.url.includes('/uploads/') ? d.url.substring(d.url.indexOf('/uploads/')) : d.url;
                                  charItem.mediaUrl = u;
                                  setUserLockedMediaUrl(u);
                                  try { localStorage.setItem('avalive_user_locked_media', u); } catch(e) {}
                                  syncMasterLiveState({ stage: 'idol', mediaUrl: u, isVideo: true, isPlaying: true }, socketRef.current);
                                  sendVideoControl({ action: 'play', mediaUrl: u, isPlaying: true }, socketRef.current);
                                  try {
                                    const bc2 = new BroadcastChannel('avalive_master_live_stream');
                                    bc2.postMessage({ type: 'GLOBAL_MEDIA_CHANGE', mediaUrl: u, isVideo: true, isPlaying: true, force: true, timestamp: Date.now() });
                                    setTimeout(() => bc2.close(), 100);
                                  } catch(e) {}
                                }
                              }).catch(() => {});
                          } catch(e) {}
                        }

                        // ⚡ 1. CẬP NHẬT TRÌNH CHIẾU GIAO DIỆN PHẦN MỀM NGAY LẬP TỨC
                        if (desktopVideoRef.current) {
                          desktopVideoRef.current.src = cleanUrl;
                          desktopVideoRef.current.currentTime = 0;
                          desktopVideoRef.current.dataset.userPaused = 'false';
                          desktopVideoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
                        }
                        setIsVideoPlaying(true);
                        // Giữ nguyên trạng thái phiên Live hiện tại, không tự động kích hoạt BẬT TẤT CẢ khi streamer chỉ chọn xem trước nhân vật

                        // ⚡ 2. PHÁT SÓNG REALTIME BROADCAST CHANNEL ĐỒNG BỘ 100% CỬA SỔ LIVE / TIKTOK STUDIO
                        try {
                          const bc = new BroadcastChannel('avalive_master_live_stream');
                          bc.postMessage({
                            type: 'GLOBAL_MEDIA_CHANGE',
                            mediaUrl: broadcastUrl || cleanUrl,
                            characterId: charItem.id,
                            characterName: charItem.name || 'AI Idol',
                            isVideo: isVid,
                            isPlaying: true,
                            currentTime: 0,
                            force: true,
                            source: 'desktop',
                            timestamp: Date.now()
                          });
                          bc.postMessage({
                            type: 'GLOBAL_PLAYBACK_CHANGE',
                            isPlaying: true,
                            currentTime: 0,
                            force: true,
                            source: 'desktop',
                            timestamp: Date.now()
                          });
                          setTimeout(() => bc.close(), 100);
                        } catch (e) {}

                        // ⚡ 3. GỬI TÍN HIỆU WEBSOCKET & SUPABASE MASTER LIVE STATE
                        sendVideoControl({
                          action: 'play',
                          currentTime: 0,
                          force: true,
                          isPlaying: true,
                          mediaUrl: broadcastUrl,
                          timestamp: Date.now()
                        }, socketRef.current);
                        syncMasterLiveState({
                          stage: 'idol',
                          selectedCharacter: charItem.id,
                          characterName: charItem.name || 'AI Idol',
                          mediaUrl: broadcastUrl || undefined,
                          isVideo: isVid,
                          videoPlaybackEvent: 'play',
                          videoCurrentTime: 0,
                          isPlaying: true,
                          aspectRatio: globalAspectRatio || '9:16'
                        }, socketRef.current);
                        showToast(`🎬 Đã phát video "${charItem.name || 'Nhân Vật'}" đồng bộ lên TikTok Live Studio!`, 'success');
                      }
                    }}
                    className={`w-10 h-10 rounded-lg overflow-hidden cursor-pointer flex-shrink-0 relative group transition-all ${
                      isSelected 
                        ? 'border-2 border-cyan-400 shadow-md shadow-cyan-500/60 ring-2 ring-cyan-400/50 scale-105' 
                        : 'border border-gray-600 opacity-70 hover:opacity-100 hover:border-gray-400'
                    }`}
                    title={`Ô ${index + 1}: ${charItem.name || 'Video Nhân Vật'}${isSelected ? ' (Đang phát Live)' : ''}`}
                  >
                    {isSelected && (
                      <div className="absolute top-0.5 left-0.5 px-1 py-0.2 bg-cyan-500 text-[7px] font-extrabold text-black rounded z-20 shadow-sm leading-tight uppercase">
                        Live
                      </div>
                    )}
                    {charItem.type === 'video' || (charItem.fileData?.type?.startsWith('video/')) || (typeof charItem.url === 'string' && (charItem.url.startsWith('blob:') || charItem.url.endsWith('.mp4') || charItem.url.includes('/uploads/') || charItem.url.includes('/api/stream'))) || (charItem.name && /video|nhép|lipsync|livestream/i.test(charItem.name)) ? (
                      <div className="w-full h-full relative bg-gray-800 flex items-center justify-center">
                        <video 
                          src={charItem.url} 
                          className="w-full h-full object-cover absolute inset-0 pointer-events-none" 
                          muted 
                          playsInline 
                          preload="metadata" 
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] font-medium text-white truncate px-0.5 text-center leading-tight py-0.5 z-10 pointer-events-none max-w-[42px]">
                          {charItem.name || 'Video'}
                        </div>
                      </div>
                    ) : (
                      <img src={charItem.url} className="w-full h-full object-cover pointer-events-none" alt={charItem.name || ''} />
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
        <div className="flex items-center gap-1.5 shrink-0 flex-nowrap overflow-visible relative z-40">

          {/* 📜 CHỌN KỊCH BẢN IDOL PHÁT SÓNG TRỰC TIẾP (KỊCH BẢN 1, 2, 3...) */}
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-500/40 rounded-lg px-2 py-1 shadow-sm">
            <Layers size={13} className="text-blue-400 shrink-0" />
            <select
              value={scriptTabsList.find(t => t.active)?.id || scriptTabsList[0]?.id || 'tab_1'}
              onChange={(e) => handleQuickSelectScriptTab(e.target.value)}
              className="bg-transparent text-xs font-bold text-blue-200 outline-none cursor-pointer max-w-[130px] truncate"
              title="Chọn kịch bản Idol phát sóng trực tiếp trên livestream thật 100% (Không phải demo)"
            >
              {scriptTabsList.map((tab, idx) => (
                <option key={tab.id} value={tab.id} className="bg-slate-900 text-white font-medium">
                  {tab.name || `Kịch bản ${idx + 1}`}
                </option>
              ))}
            </select>
          </div>

          {/* 📜 NÚT PHÁT KỊCH BẢN LIVE THẬT 100% (KHÔNG PHẢI DEMO) */}
          <button
            type="button"
            onClick={() => handleToggleScriptLive()}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all border shadow-sm cursor-pointer active:scale-95 ${
              isScriptLiveRunning
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-white border-emerald-400 shadow-emerald-500/40 animate-pulse'
                : 'bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white border-blue-400/50 shadow-indigo-500/20'
            }`}
            title={isScriptLiveRunning ? "Kịch bản đang phát sóng trực tiếp trên Live thật 100% — Bấm để Tạm Dừng" : "Bắt đầu phát kịch bản bán hàng đã chọn lên Livestream thật 100% (OBS / TikTok Live Studio), đọc lần lượt từ câu đầu đến câu cuối"}
          >
            <Play size={12} fill={isScriptLiveRunning ? "currentColor" : "none"} className={isScriptLiveRunning ? "text-yellow-300 animate-spin" : "text-white"} />
            <span className="whitespace-nowrap font-bold">{isScriptLiveRunning ? '🟢 Đang Phát Kịch Bản Live' : '▶️ Phát Kịch Bản Live'}</span>
          </button>

          {/* 🔊 NÚT TẮT / MỞ TIẾNG LOA MÁY TÍNH (PHIÊN LIVE VẪN CÓ TIẾNG 100%) */}
          <button 
            onClick={handleToggleLocalSpeakerMute}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border shadow-sm active:scale-95 cursor-pointer ${
              isLocalSpeakerMuted
                ? 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border-rose-500/50'
                : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-500/50'
            }`}
            title={
              isLocalSpeakerMuted
                ? "Loa máy tính: ĐÃ TẮT (Phiên Live & Window Capture vẫn có tiếng 100%) — Bấm để Mở lại loa máy"
                : "Loa máy tính: ĐANG BẬT — Bấm để Tắt loa máy tính (chống ồn)"
            }
          >
            {isLocalSpeakerMuted ? (
              <>
                <VolumeX size={13} className="text-rose-400" />
                <span className="whitespace-nowrap font-bold">Loa Máy: Tắt</span>
              </>
            ) : (
              <>
                <Volume2 size={13} className="text-emerald-400 animate-pulse" />
                <span className="whitespace-nowrap font-bold">Loa Máy: Mở</span>
              </>
            )}
          </button>

          {/* Menu Theo dõi */}
          <div className="relative">
            <button 
              onClick={() => setIsMonitorDropdownOpen(!isMonitorDropdownOpen)} 
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-all border shadow-sm ${
                isMonitorDropdownOpen 
                  ? 'bg-orange-600 text-white border-orange-400 shadow-orange-500/30 ring-2 ring-orange-400/40' 
                  : (isDarkMode ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border-orange-500/30' : 'bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-300')
              }`}
            >
              <Eye size={13} className="text-orange-400" />
              <span>{t('monitor', currentLang)}</span>
            </button>
            {isMonitorDropdownOpen && (
              <>
                {/* Backdrop bắt click bên ngoài để đóng */}
                <div 
                  className="fixed inset-0 z-[8999]" 
                  onClick={() => setIsMonitorDropdownOpen(false)} 
                />
                <div className={`absolute top-full right-0 mt-2 w-72 rounded-2xl shadow-2xl border z-[9999] p-2.5 overflow-hidden ${isDarkMode ? 'bg-[#181824]/98 border-orange-500/40 text-white shadow-black/80' : 'bg-white border-gray-200 text-slate-800 shadow-xl'} animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl`}>
                  <div className="px-2.5 py-1.5 border-b border-white/10 mb-1.5 flex items-center justify-between text-[11px] font-black text-orange-400">
                    <span className="flex items-center gap-1"><Eye size={13} /> TRUNG TÂM THEO DÕI LIVE</span>
                    <span className="text-[10px] bg-orange-500/20 px-2 py-0.5 rounded-full text-orange-300 font-mono">
                      {viewerHistory.length} Sự kiện
                    </span>
                  </div>

                  <button onClick={() => { setActiveMonitorModal('quick_response'); setIsMonitorDropdownOpen(false); }} className={`w-full text-left px-3 py-2 mb-1 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${isDarkMode ? 'hover:bg-yellow-500/20 text-yellow-300' : 'hover:bg-yellow-50 text-yellow-800'}`}>
                    <div className="flex items-center gap-2.5">
                      <Zap size={16} className="text-yellow-400 group-hover:scale-110 transition-transform shrink-0" /> 
                      <div>
                        <div>{t('quickResponse', currentLang)}</div>
                        <div className="text-[10px] text-gray-400 font-normal">Kích hoạt thoại & video phản hồi 1-chạm</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-black bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">1-Chạm</span>
                  </button>

                  <button onClick={() => { setActiveMonitorModal('timeline'); setIsMonitorDropdownOpen(false); }} className={`w-full text-left px-3 py-2 mb-1 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${isDarkMode ? 'hover:bg-blue-500/20 text-blue-300' : 'hover:bg-blue-50 text-blue-800'}`}>
                    <div className="flex items-center gap-2.5">
                      <Clock size={16} className="text-blue-400 group-hover:scale-110 transition-transform shrink-0" /> 
                      <div>
                        <div>{t('timeline', currentLang)}</div>
                        <div className="text-[10px] text-gray-400 font-normal">Lịch sử bình luận, quà tặng & phản hồi AI</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">{viewerHistory.length}</span>
                  </button>

                  <button onClick={() => { setActiveMonitorModal('queue'); setIsMonitorDropdownOpen(false); }} className={`w-full text-left px-3 py-2 mb-1 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${isDarkMode ? 'hover:bg-purple-500/20 text-purple-300' : 'hover:bg-purple-50 text-purple-800'}`}>
                    <div className="flex items-center gap-2.5">
                      <List size={16} className="text-purple-400 group-hover:scale-110 transition-transform shrink-0" /> 
                      <div>
                        <div>{t('aiQueue', currentLang)}</div>
                        <div className="text-[10px] text-gray-400 font-normal">Hàng đợi AI sinh câu thoại & giọng nói</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isProcessingEvent ? 'bg-amber-500/20 text-amber-300 animate-pulse' : 'bg-emerald-500/20 text-emerald-300'}`}>
                      {isProcessingEvent ? 'Đang xử lý...' : 'Sẵn sàng'}
                    </span>
                  </button>

                  <button onClick={() => { setActiveMonitorModal('tiktok_log'); setIsMonitorDropdownOpen(false); }} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${isDarkMode ? 'hover:bg-pink-500/20 text-pink-300' : 'hover:bg-pink-50 text-pink-800'}`}>
                    <div className="flex items-center gap-2.5">
                      <FileText size={16} className="text-pink-400 group-hover:scale-110 transition-transform shrink-0" /> 
                      <div>
                        <div>{t('tiktokLog', currentLang)}</div>
                        <div className="text-[10px] text-gray-400 font-normal">Log sự kiện thô từ TikTok Live Connector</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isConnected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-700 text-gray-400'}`}>
                      {isConnected ? '🟢 Đang Live' : '⚪ Chưa kết nối'}
                    </span>
                  </button>
                </div>
              </>
            )}
    </div>

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
            isScriptRunning={isScriptLiveRunning}
            currentVideoUrl={(isScriptLiveRunning || isConnected || showSimulator) && activeVideoItem ? activeVideoItem.mediaUrl : null}
            onActionTriggered={(e) => {
              if (e.type === 'LIPSYNC_READY') handleActionVideoReady(e.videoUrl, true);
              if (e.type === 'LIPSYNC_ENDED') {
                setLipSyncVideoUrl(null);
                handleVideoEnded();
              }
              if (e.type === 'SPEECH_ENDED') {
                setLipSyncVideoUrl(null);
                handleVideoEnded();
              }
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
          <div className={`absolute right-6 top-4 w-[430px] max-h-[90vh] flex flex-col rounded-2xl shadow-2xl z-40 animate-in fade-in slide-in-from-right-4 overflow-hidden backdrop-blur-md border ${
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
                    ⚡ Mô Hình Live & Demo (Test)
                  </h3>
                  <p className={`text-[10px] ${isDarkMode ? 'text-purple-200/70' : 'text-purple-700/80'}`}>Chạy test tương tác, bình luận, quà tặng & Voice AI</p>
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

            {/* 🎤 BANNER HIỂN THỊ TÊN VOICE ĐANG DÙNG & NÚT BẬT/TẮT VOICE TEST TRỰC TIẾP */}
            <div className={`px-3 py-2 border-b flex items-center justify-between gap-2 ${isDarkMode ? 'bg-purple-950/40 border-purple-500/20 text-purple-200' : 'bg-purple-50 border-purple-200 text-purple-900'}`}>
              <div className="flex items-center gap-1.5 text-xs truncate max-w-[210px]">
                <Mic size={13} className="text-purple-400 shrink-0" />
                <div className="truncate">
                  <div className="text-[9px] text-purple-400 uppercase font-black">Giọng Đang Hoạt Động:</div>
                  <div className="font-bold text-[11px] truncate text-yellow-400" title={currentActiveVoiceName}>
                    {currentActiveVoiceName}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    unlockAllAudio();
                    const sampleText = currentActiveVoiceObj?.sampleText || 'Chào mừng các bạn đã đến với phiên livestream hôm nay!';
                    previewVoiceAudio(currentActiveVoiceObj, sampleText, { isTest: true, priority: true });
                    showToast(`🔊 Đang phát thử giọng: ${currentActiveVoiceName}`, 'success');
                  }}
                  className="px-2 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-black transition-all flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                  title="Phát thử giọng đọc mẫu trực tiếp để kiểm tra độ trong trẻo tự nhiên"
                >
                  <Play size={10} /> Thử Giọng
                </button>
                <button
                  onClick={() => setIsSimVoiceMuted(prev => !prev)}
                  className={`px-2 py-1 rounded text-[10px] font-black transition-all flex items-center gap-1 border shadow-sm active:scale-95 cursor-pointer ${
                    isSimVoiceMuted
                      ? 'bg-red-500/20 text-red-400 border-red-500/40 hover:bg-red-500/30 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                  }`}
                  title={isSimVoiceMuted ? "Voice Test đang TẮT — Bấm để BẬT tiếng khi test" : "Voice Test đang BẬT — Bấm để TẮT tiếng khi test"}
                >
                  {isSimVoiceMuted ? <VolumeX size={11} className="text-red-400" /> : <Volume2 size={11} className="text-emerald-400 animate-pulse" />}
                  <span>{isSimVoiceMuted ? "Tắt Tiếng" : "Bật Tiếng"}</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className={`flex border-b p-1 gap-1 text-[11px] font-semibold ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
              <button
                onClick={() => setSimTab('video_live')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all flex items-center justify-center gap-1 ${
                  simTab === 'video_live' ? 'bg-blue-600 text-white shadow-md' : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-slate-600 hover:text-slate-900')
                }`}
              >
                <Video size={12} /> Live Video
              </button>
              <button
                onClick={() => setSimTab('ai_idol')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all flex items-center justify-center gap-1 ${
                  simTab === 'ai_idol' ? 'bg-purple-600 text-white shadow-md' : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-slate-600 hover:text-slate-900')
                }`}
              >
                <Sparkles size={12} /> AI Idol
              </button>
              <button
                onClick={() => setSimTab('checkout')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all flex items-center justify-center gap-1 ${
                  simTab === 'checkout' ? 'bg-emerald-600 text-white shadow-md' : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-slate-600 hover:text-slate-900')
                }`}
              >
                <ShoppingCart size={12} /> Chốt Đơn
              </button>
              <button
                onClick={() => setSimTab('ai_assistant')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all flex items-center justify-center gap-1 ${
                  simTab === 'ai_assistant' ? 'bg-red-600 text-white shadow-md' : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-slate-600 hover:text-slate-900')
                }`}
              >
                <Brain size={12} /> Chuyên AI
              </button>
              <button
                onClick={() => setSimTab('shopee_live')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all flex items-center justify-center gap-1 ${
                  simTab === 'shopee_live' ? 'bg-[#EE4D2D] text-white shadow-md' : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-slate-600 hover:text-slate-900')
                }`}
              >
                <ShoppingBag size={12} /> Shopee
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-3 space-y-3 overflow-y-auto max-h-[420px]">
              
              {/* TAB 1: LIVE VIDEO (Trả lời bình luận, Chào người mới, Cảm ơn tặng quà) */}
              {simTab === 'video_live' && (
                <div className="space-y-3">
                  {/* Bình luận */}
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      <MessageCircle size={11} className="text-blue-500" /> Bình luận cơ bản:
                    </span>
                    <div className="grid grid-cols-1 gap-1.5">
                      <button onClick={() => handleSimEvent('COMMENT', { name: 'Khán Giả 1', text: 'Chào idol, hôm nay xinh quá!' })} className={`text-left p-1.5 rounded-lg text-[10px] font-medium transition-all flex justify-between border ${isDarkMode ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border-blue-500/20' : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200'}`}>
                        <span>💬 "Chào idol, hôm nay xinh quá!"</span>
                      </button>
                      <button onClick={() => handleSimEvent('COMMENT', { name: 'Khán Giả 2', text: 'Live mượt quá shop ơi!' })} className={`text-left p-1.5 rounded-lg text-[10px] font-medium transition-all flex justify-between border ${isDarkMode ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border-blue-500/20' : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200'}`}>
                        <span>💬 "Live mượt quá shop ơi!"</span>
                      </button>
                    </div>
                  </div>

                  {/* Chào hỏi */}
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      <Users size={11} className="text-emerald-500" /> Chào hỏi người mới:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button onClick={() => handleSimEvent('VIEWER_JOIN', { name: 'Khách Mới 1' })} className={`py-1.5 px-2 rounded-lg text-[10px] font-medium transition-all text-center border ${isDarkMode ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                        👋 Khách mới vào
                      </button>
                      <button onClick={() => handleSimEvent('VIEWER_JOIN', { name: 'Fan Cứng 👑' })} className={`py-1.5 px-2 rounded-lg text-[10px] font-medium transition-all text-center border ${isDarkMode ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                        ⭐ Fan Cứng vào
                      </button>
                    </div>
                  </div>

                  {/* Tặng quà */}
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      <Gift size={11} className="text-amber-500" /> Cảm ơn Tặng quà:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button onClick={() => handleSimEvent('GIFT', { name: 'Người Hâm Mộ', gift: 'Hoa Hồng', count: 1 })} className={`py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-[10px] font-medium transition-all text-center`}>
                        🌹 Hoa Hồng (1 xu)
                      </button>
                      <button onClick={() => handleSimEvent('GIFT', { name: 'Đại Gia', gift: 'Thiết Giáp', count: 50 })} className={`py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded-lg text-[10px] font-medium transition-all text-center`}>
                        🛡️ Thiết Giáp (50 xu)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: AI IDOL (Tất cả sự kiện tương tác chuẩn) */}
              {simTab === 'ai_idol' && (
                <div className="space-y-3">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      <Users size={11} className="text-purple-500" /> Khán giả vào phòng:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      <button onClick={() => handleSimEvent('VIEWER_JOIN', { name: 'Thanh Nhàn' })} className={`py-1.5 px-2 rounded-lg text-[10.5px] font-medium transition-all text-center truncate border ${isDarkMode ? 'bg-purple-500/10 hover:bg-purple-500/25 text-purple-300 border-purple-500/30' : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'}`}>👋 Khách mới</button>
                      <button onClick={() => handleSimEvent('VIEWER_JOIN', { name: 'Vip_HoàngNam 👑' })} className={`py-1.5 px-2 rounded-lg text-[10.5px] font-medium transition-all text-center truncate border ${isDarkMode ? 'bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-300 border-indigo-500/30' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'}`}>⭐ VIP vào</button>
                      <button onClick={() => handleSimEvent('VIEWER_JOIN', { name: 'Bảo Trâm ❤️' })} className={`py-1.5 px-2 rounded-lg text-[10.5px] font-medium transition-all text-center truncate border ${isDarkMode ? 'bg-pink-500/10 hover:bg-pink-500/25 text-pink-300 border-pink-500/30' : 'bg-pink-50 hover:bg-pink-100 text-pink-700 border-pink-200'}`}>❤️ Fan cứng</button>
                      <button onClick={() => handleSimEvent('VIEWER_JOIN', { name: 'Chủ Tịch Tổng 💎' })} className={`py-1.5 px-2 rounded-lg text-[10.5px] font-medium transition-all text-center truncate border ${isDarkMode ? 'bg-amber-500/10 hover:bg-amber-500/25 text-amber-300 border-amber-500/30' : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'}`}>💎 Đại gia</button>
                    </div>
                  </div>

                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      <Gift size={11} className="text-amber-500" /> Tặng quà TikTok (Tất cả các mức xu):
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                      <button onClick={() => handleSimEvent('GIFT', { name: 'Anh Tuấn', gift: 'Hoa Hồng', count: 1 })} className={`py-1.5 bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate`}>🌹 Hoa Hồng (1 xu)</button>
                      <button onClick={() => handleSimEvent('GIFT', { name: 'Hoàng Long VIP', gift: 'Nước Hoa Thiết Giáp', count: 50 })} className={`py-1.5 bg-purple-500/10 hover:bg-purple-500/25 text-purple-400 border border-purple-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate`}>🛡️ Thiết Giáp (50)</button>
                      <button onClick={() => handleSimEvent('GIFT', { name: 'Đại Gia Phố Núi', gift: 'Vương Miện Hoàng Kim', count: 200 })} className={`py-1.5 bg-yellow-500/10 hover:bg-yellow-500/25 text-yellow-500 border border-yellow-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate`}>👑 Thần Tướng (200)</button>
                      <button onClick={() => handleSimEvent('GIFT', { name: 'Thần Kiếm', gift: 'Kiếm Sấm Sét', count: 500 })} className={`py-1.5 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate`}>⚔️ Vạn Kiếm (500)</button>
                      <button onClick={() => handleSimEvent('GIFT', { name: 'Chủ Tịch Tập Đoàn', gift: 'Thần Long Vũ Trụ', count: 1000 })} className={`py-1.5 bg-red-500/15 hover:bg-red-500/30 text-red-400 border border-red-500/40 rounded-lg text-[10px] font-bold transition-all text-center truncate`}>🐉 Giáng Long (1000)</button>
                      <button onClick={() => handleSimEvent('GIFT', { name: 'Tổng Giám Đốc', gift: 'Sư Tử Vàng Vũ Trụ', count: 10000 })} className={`py-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-yellow-300 border border-yellow-400/50 rounded-lg text-[10px] font-black transition-all text-center truncate shadow-sm`}>🦁 Sư Tử (10k xu)</button>
                      <button onClick={() => handleSimEvent('GIFT', { name: 'Đại Tướng Quân', gift: 'Mũ Trụ TikTok Universe', count: 30000 })} className={`col-span-2 py-1.5 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-amber-600/30 hover:opacity-90 text-pink-300 border border-pink-400/60 rounded-lg text-[10px] font-black transition-all text-center truncate shadow-md animate-pulse`}>🚀 Mũ Trụ Siêu Cấp (30k)</button>
                    </div>
                  </div>

                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      <Heart size={11} className="text-red-500" /> Tương tác kênh & Cột mốc Tim:
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                      <button onClick={() => handleSimEvent('LIKE', { count: '10.000 tim' })} className="py-1.5 bg-red-500/10 hover:bg-red-500/25 text-red-500 border border-red-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate">💖 10k Tim</button>
                      <button onClick={() => handleSimEvent('LIKE', { count: '50.000 tim' })} className="py-1.5 bg-pink-500/10 hover:bg-pink-500/25 text-pink-400 border border-pink-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate">💖 50k Tim</button>
                      <button onClick={() => handleSimEvent('FOLLOW', { name: 'Khánh Vy' })} className="py-1.5 bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-500 border border-emerald-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate">➕ Follow Kênh</button>
                      <button onClick={() => handleSimEvent('SHARE', { name: 'Minh Trang' })} className="py-1.5 bg-violet-500/10 hover:bg-violet-500/25 text-violet-500 border border-violet-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate">↗️ Chia Sẻ Live</button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CHỐT ĐƠN */}
              {simTab === 'checkout' && (
                <div className="space-y-3">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>Các bình luận hỏi mua hàng:</span>
                    <div className="space-y-1.5">
                      <button onClick={() => handleSimEvent('COMMENT', { name: 'Hải Đăng', text: 'Mẫu này chất liệu gì và còn size L không shop?' })} className={`w-full text-left p-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between border ${isDarkMode ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border-blue-500/20' : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200'}`}>
                        <span>🛒 "Mẫu này chất liệu gì và còn size L không shop?"</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-blue-500/20 text-white' : 'bg-blue-200 text-blue-900'}`}>Hỏi Size</span>
                      </button>
                      <button onClick={() => handleSimEvent('COMMENT', { name: 'Quỳnh Như', text: 'Sản phẩm này giá bao nhiêu và có freeship không ạ?' })} className={`w-full text-left p-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between border ${isDarkMode ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/20' : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'}`}>
                        <span>💰 "Giá bao nhiêu và có freeship không ạ?"</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-amber-500/20 text-white' : 'bg-amber-200 text-amber-900'}`}>Hỏi Giá</span>
                      </button>
                      <button onClick={() => handleSimEvent('COMMENT', { name: 'Bảo Long', text: 'Mình 1m70 nặng 65kg mặc size nào vừa chuẩn bạn ơi?' })} className={`w-full text-left p-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between border ${isDarkMode ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/20' : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-200'}`}>
                        <span>📏 "Mình 1m70 nặng 65kg mặc size nào chuẩn?"</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-purple-500/20 text-white' : 'bg-purple-200 text-purple-900'}`}>Tư Vấn</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 mt-2 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>Sự kiện khách đã chốt đơn:</span>
                    <div className="space-y-1.5">
                      <button onClick={() => handleSimEvent('PURCHASE', { name: 'Hoàng Nam', item: '1 Áo Polo Cao Cấp' })} className={`w-full text-left p-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between border ${isDarkMode ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'}`}>
                        <span>🎉 Khách Hoàng Nam vừa chốt 1 Áo Polo</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-emerald-500/30 text-white' : 'bg-emerald-200 text-emerald-900'}`}>1 Đơn</span>
                      </button>
                      <button onClick={() => handleSimEvent('PURCHASE', { name: 'Thanh Thảo VIP', item: 'Combo 2 Váy Thiết Kế Dạ Hội' })} className={`w-full text-left p-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between border ${isDarkMode ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-200'}`}>
                        <span>🎁 Khách Thanh Thảo vừa chốt Combo 2 Váy</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-purple-500/30 text-white' : 'bg-purple-200 text-purple-900'}`}>Combo VIP</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: CHUYÊN AI & VOICE */}
              {simTab === 'ai_assistant' && (
                <div className="space-y-3">
                  {/* Trợ lý & Đạo diễn */}
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>Bộ não AI & Trợ lý Đạo Diễn:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button onClick={() => handleSimEvent('ASSISTANT_PROMPT', { prompt: 'Nói một câu chào mừng hài hước để hâm nóng không khí!' })} className={`p-1.5 rounded-lg text-[10px] font-medium text-left truncate border ${isDarkMode ? 'bg-red-500/10 hover:bg-red-500/20 text-red-300 border-red-500/20' : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'}`}>
                        🔥 Hâm nóng không khí
                      </button>
                      <button onClick={() => handleSimEvent('ASSISTANT_PROMPT', { prompt: 'Nhắc mọi người bấm vào giỏ hàng đang có mã giảm giá!' })} className={`p-1.5 rounded-lg text-[10px] font-medium text-left truncate border ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'}`}>
                        🛒 Nhắc xem giỏ hàng
                      </button>
                      <button onClick={() => handleSimEvent('ASSISTANT_PROMPT', { prompt: 'Hãy kể một câu chuyện vui ngắn 10 giây' })} className={`p-1.5 rounded-lg text-[10px] font-medium text-left truncate border ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'}`}>
                        🎶 Kể chuyện vui
                      </button>
                      <button onClick={() => handleSimEvent('CALL_TO_ACTION', { prompt: 'Kêu gọi thả tim để mở khóa quà tặng!' })} className={`p-1.5 rounded-lg text-[10px] font-medium text-left truncate border ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'}`}>
                        🙏 Kêu gọi thả tim
                      </button>
                    </div>

                    <div className={`mt-2 flex gap-1.5`}>
                      <input 
                        type="text" value={assistantPrompt} onChange={(e) => setAssistantPrompt(e.target.value)}
                        placeholder="VD: Nhắc idol giới thiệu..."
                        className={`flex-1 rounded-lg px-2 py-1 text-xs outline-none border ${isDarkMode ? 'bg-black/50 border-gray-700 text-white placeholder-gray-500 focus:border-red-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-red-500'}`}
                        onKeyDown={(e) => { if (e.key === 'Enter' && assistantPrompt.trim()) { handleSimEvent('ASSISTANT_PROMPT', { prompt: assistantPrompt.trim() }); setAssistantPrompt(''); } }}
                      />
                      <button onClick={() => { if (assistantPrompt.trim()) { handleSimEvent('ASSISTANT_PROMPT', { prompt: assistantPrompt.trim() }); setAssistantPrompt(''); } }} className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1">
                        <Send size={11} /> Gửi
                      </button>
                    </div>
                  </div>

                  {/* Lựa chọn Voice ưa dùng */}
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1 mt-2 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      <Volume2 size={11} className="text-cyan-500" /> Chọn nhanh Voice Ưa Dùng:
                    </span>
                    <div className="grid grid-cols-1 gap-1.5">
                      <button onClick={() => handleAudioTest('idol')} className={`p-1.5 rounded-lg text-[11px] font-medium text-left border flex items-center justify-between ${isDarkMode ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200'}`}>
                        <span className="flex items-center gap-1.5">🎤 Voice Idol (Bình luận & Chốt đơn)</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-blue-500/20 text-white' : 'bg-blue-200 text-blue-900'}`}>Test</span>
                      </button>
                      <button onClick={() => handleAudioTest('manager')} className={`p-1.5 rounded-lg text-[11px] font-medium text-left border flex items-center justify-between ${isDarkMode ? 'bg-red-500/10 hover:bg-red-500/20 text-red-300 border-red-500/30' : 'bg-red-50 hover:bg-red-100 text-red-800 border-red-200'}`}>
                        <span className="flex items-center gap-1.5">💬 Voice Trợ Lý AI</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-red-500/20 text-white' : 'bg-red-200 text-red-900'}`}>Test</span>
                      </button>
                      <button onClick={() => handleAudioTest('game')} className={`p-1.5 rounded-lg text-[11px] font-medium text-left border flex items-center justify-between ${isDarkMode ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-200'}`}>
                        <span className="flex items-center gap-1.5">🎮 Voice Đạo Diễn / Game</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-purple-500/20 text-white' : 'bg-purple-200 text-purple-900'}`}>Test</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SHOPEE LIVE (URL & Key & Chốt Đơn) */}
              {simTab === 'shopee_live' && (
                <div className="space-y-3">
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-orange-500/10 border-orange-500/30 text-orange-200' : 'bg-orange-50 border-orange-200 text-orange-900'}`}>
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5 text-[#EE4D2D]">
                        <ShoppingBag size={14} /> Shopee Live Kết Nối RTMP
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {localStorage.getItem('avalive_shopee_connected') === 'true' ? '🟢 Đã kết nối luồng Shopee Live' : '⚪ Chưa kết nối (Bấm cài đặt để nhập Key)'}
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveSettingsModal('shopee_live')}
                      className="px-2.5 py-1 bg-[#EE4D2D] hover:bg-[#d83f20] text-white rounded-lg text-[10px] font-bold shadow-xs transition-all flex items-center gap-1"
                    >
                      <span>Cài đặt URL & Key</span>
                    </button>
                  </div>

                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      <ShoppingCart size={11} className="text-[#EE4D2D]" /> Giả lập Khách Chốt Đơn Shopee:
                    </span>
                    <div className="space-y-1.5">
                      <button 
                        onClick={() => handleSimEvent('PURCHASE', { name: 'Ngọc Mai VIP 🛍️', item: 'Combo 2 Set Váy Thiết Kế Shopee Mall' })} 
                        className={`w-full text-left p-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between border ${isDarkMode ? 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border-orange-500/30' : 'bg-orange-50 hover:bg-orange-100 text-orange-800 border-orange-200'}`}
                      >
                        <span>🛒 Khách Ngọc Mai chốt Combo Váy Shopee Mall</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-[#EE4D2D] text-white">599k</span>
                      </button>
                      <button 
                        onClick={() => handleSimEvent('PURCHASE', { name: 'Thanh Hằng 👑', item: 'Áo Thun Polo Shopee Live Hỏa Tốc' })} 
                        className={`w-full text-left p-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between border ${isDarkMode ? 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border-orange-500/30' : 'bg-orange-50 hover:bg-orange-100 text-orange-800 border-orange-200'}`}
                      >
                        <span>🛒 Khách Thanh Hằng chốt Áo Thun Shopee</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-[#EE4D2D] text-white">250k</span>
                      </button>
                      <button 
                        onClick={() => handleSimEvent('COMMENT', { name: 'Minh Thư', text: 'Shop ơi có voucher giảm 50k của Shopee Live không ạ?' })} 
                        className={`w-full text-left p-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between border ${isDarkMode ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/20' : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'}`}
                      >
                        <span>🎟️ "Shop ơi có voucher Shopee Live không?"</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-amber-500 text-white">Voucher</span>
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-200">
          <div className="w-full max-w-7xl h-[92vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-[#0d0d12] border border-pink-500/30 relative">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#12121a]">
              <div className="flex items-center gap-2 text-pink-400 font-black text-sm">
                <Mic size={18} className="text-pink-400 animate-pulse" />
                <span>PHÒNG THU GIỌNG NÓI & SOẠN KỊCH BẢN LIVESTREAM (VOICESTUDIO PRO)</span>
              </div>
              <button 
                onClick={() => setActiveSettingsModal(null)}
                className="p-1.5 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
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
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-md p-2 md:p-3 animate-in fade-in zoom-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveSettingsModal(null);
          }}
        >
          <div className="w-[98vw] max-w-[1720px] h-[96vh] max-h-[98vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl border bg-[#f8fafc] border-gray-300">
            <div className="flex items-center justify-between px-6 py-3 border-b bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300 shrink-0">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <Settings size={18} className="text-blue-600" />
                Cấu hình AI, Giọng nói & API
              </h2>
              <button 
                onClick={() => setActiveSettingsModal(null)}
                className="hover:bg-gray-300/80 p-1.5 rounded-lg transition-colors text-gray-600 hover:text-gray-900 cursor-pointer"
                title="Đóng (Bấm để quay lại phần mềm)"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <GeneralSettings onClose={() => setActiveSettingsModal(null)} />
            </div>
          </div>
        </div>
      )}

      {/* 🎬 DEDICATED FULL-SCREEN MODAL: LUỒNG LIVE IDOL 1-4 AVATAR & KỊCH BẢN PHÂN ĐOẠN 24/7 */}
      {activeSettingsModal === 'workspace_sequencer' && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-1 sm:p-2 animate-in fade-in zoom-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveSettingsModal(null);
          }}
        >
          <div className="w-full h-full max-w-[1760px] max-h-[98vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-[#0b0f19] border border-rose-500/30 relative">
            <div className="flex items-center justify-between px-5 py-2.5 border-b border-rose-500/20 bg-gradient-to-r from-rose-950/70 via-[#131022] to-indigo-950/70 shrink-0">
              <div className="flex items-center gap-2.5 text-rose-400 font-black text-sm">
                <Layers size={18} className="text-rose-400 animate-pulse" />
                <span className="tracking-wide">🎬 LUỒNG LIVE IDOL 1–4 AVATAR & KỊCH BẢN PHÂN ĐOẠN 24/7</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">Studio Pro 60FPS</span>
              </div>
              <button 
                type="button"
                onClick={() => setActiveSettingsModal(null)}
                className="p-1.5 rounded-lg bg-white/10 text-white/70 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                title="Đóng bảng luồng live"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <LivestreamFlowSequencer />
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal (WorkspaceTacVu / Event Manager) */}
      {(activeSettingsModal === 'workspace' || activeSettingsModal === 'workspace_events') && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-2 md:p-3 animate-in fade-in zoom-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveSettingsModal(null);
          }}
        >
          <div className={`w-[98vw] max-w-[1720px] h-[97vh] max-h-[98vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl border ${isDarkMode ? 'bg-[#141419] border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`flex items-center justify-between px-6 py-3.5 border-b shrink-0 ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Settings className="text-blue-500" />
                <span>
                  {activeSettingsModal === 'workspace_events' 
                    ? 'Cài đặt Sự kiện & Kịch bản Tương tác Livestream' 
                    : 'Cài đặt Hệ thống Sự kiện Livestream'}
                </span>
              </h2>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => alert("Đang kiểm tra bản cập nhật từ Admin...")}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium cursor-pointer"
                >
                  Kiểm tra cập nhật
                </button>
                <button 
                  onClick={() => setActiveSettingsModal(null)}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto relative">
              <WorkspaceTacVu 
                key={activeSettingsModal}
                defaultEventId={activeSettingsModal === 'workspace_events' ? 'welcome' : 'flow_sequencer'} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Payment & Token Packages Modal */}
      {(activeSettingsModal === 'payment' || activeSettingsModal === 'coins') && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveSettingsModal(null);
          }}
        >
          <div className="w-full max-w-5xl h-[92vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-[#0f0f1a] border border-gray-800 relative">
            <button 
              onClick={() => setActiveSettingsModal(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
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
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveSettingsModal(null);
          }}
        >
          <div className="w-full max-w-5xl h-[92vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-[#0b0f19] border border-emerald-500/30 relative">
            <div className="flex items-center justify-between px-5 py-3 border-b border-emerald-500/20 bg-emerald-950/40">
              <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                <Shield size={18} className="text-emerald-400 animate-pulse" />
                <span>HỆ THỐNG VƯỢT CAPTCHA TỰ ĐỘNG 24/7 (AI CAPTCHA SOLVER)</span>
    </div>
              <button 
                onClick={() => setActiveSettingsModal(null)}
                className="p-1.5 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
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

      {/* Shopee Live Connect Modal (RTMP URL & Stream Key) */}
      <ShopeeLiveConnectModal
        isOpen={activeSettingsModal === 'shopee_live'}
        onClose={() => setActiveSettingsModal(null)}
        isDarkMode={isDarkMode}
      />

      {/* 👥 MultiAvatarStudioModal (Studio 2–4 Avatar) */}
      <MultiAvatarStudioModal
        isOpen={showMultiAvatarStudioModal}
        onClose={() => setShowMultiAvatarStudioModal(false)}
      />

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
          if (videoData && videoData.url) {
            syncMasterLiveState({
              stage: 'idol',
              mediaUrl: videoData.url,
              characterName: videoData.name || 'Video Phản Hồi',
              isVideo: true,
              videoPlaybackEvent: 'play',
              isPlaying: true
            }, socketRef.current);
          }
        }}
        onStopLiveVideo={() => {
          setQuickResponseActiveVideo(null);
          const currentFallback = customCharacters.find(c => c.id === selectedCharacter)?.url || null;
          syncMasterLiveState({
            stage: 'idol',
            mediaUrl: currentFallback,
            characterName: 'AI Idol',
            isVideo: true,
            videoPlaybackEvent: 'play',
            isPlaying: true
          }, socketRef.current);
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
        currentUser={currentUser}
        onOpenLogin={() => setIsGmailLoginModalOpen(true)}
        activeMediaUrl={userLockedMediaUrl || (customCharacters.find(c => c.id === selectedCharacter)?.mediaUrl || customCharacters.find(c => c.id === selectedCharacter)?.url) || CHARACTERS[selectedCharacter]?.url || ''}
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

      {/* 🌐 MODAL CHỌN 20 NGÔN NGỮ QUỐC TẾ NỔI LỚP TRÊN CÙNG (Z-[9999999]) TUYỆT ĐỐI KHÔNG BỊ CHE */}
      {isLangDropdownOpen && (
        <div className="fixed inset-0 z-[9999999] flex items-start justify-end p-2 sm:p-4 pt-11 pointer-events-none">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs pointer-events-auto" 
            onClick={() => setIsLangDropdownOpen(false)} 
          />
          <div className={`relative pointer-events-auto w-84 max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl border p-3 ${
            isDarkMode ? 'bg-[#181824] border-amber-500/50 text-white shadow-black/90' : 'bg-white border-gray-300 text-slate-800 shadow-2xl'
          } animate-in fade-in zoom-in-95 duration-150`}>
            <div className="px-2.5 py-1.5 text-xs font-black uppercase text-amber-400 border-b border-white/10 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">🌐 20 NGÔN NGỮ QUỐC TẾ</span>
              <button 
                type="button" 
                onClick={() => setIsLangDropdownOpen(false)}
                className="text-gray-400 hover:text-white p-0.5 rounded cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
            <div className="space-y-1">
              {SUPPORTED_LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setCurrentLanguage(lang.code);
                    setCurrentLangState(lang.code);
                    setIsLangDropdownOpen(false);

                    // Đồng bộ giọng đọc AI mặc định theo ngôn ngữ mới
                    const voiceMap = {
                      vi: 'free_vi_female',
                      en: 'en-US-JennyNeural',
                      zh: 'zh-CN-XiaoxiaoNeural',
                      ja: 'ja-JP-NanamiNeural',
                      ko: 'ko-KR-SunHiNeural',
                      fr: 'fr-FR-DeniseNeural',
                      es: 'es-ES-ElviraNeural',
                      th: 'th-TH-PremwadeeNeural',
                      pt: 'pt-BR-FranciscaNeural',
                      de: 'de-DE-KatjaNeural',
                      it: 'it-IT-ElsaNeural',
                      ru: 'ru-RU-SvetlanaNeural',
                      ar: 'ar-SA-ZariyahNeural',
                      id: 'id-ID-GadisNeural',
                      hi: 'hi-IN-SwaraNeural',
                      tr: 'tr-TR-EmelNeural',
                      pl: 'pl-PL-ZofiaNeural',
                      nl: 'nl-NL-FennaNeural',
                      tl: 'fil-PH-AngeloNeural',
                      ms: 'ms-MY-YasminNeural'
                    };
                    const targetVoice = voiceMap[lang.code] || 'free_vi_female';
                    try {
                      localStorage.setItem('avalive_default_voice_id', targetVoice);
                      window.dispatchEvent(new CustomEvent('avalive_default_voice_changed', { detail: { voiceId: targetVoice } }));
                      postMasterBroadcast({ type: 'GLOBAL_LANGUAGE_CHANGE', language: lang.code });
                    } catch (e) {}

                    showToast(`🌐 Đã chuyển sang ${lang.name} (${lang.flag}) & Đồng bộ giọng đọc AI`, 'success');
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    currentLang === lang.code
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md ring-1 ring-white/20'
                      : (isDarkMode ? 'hover:bg-white/10 text-gray-200' : 'hover:bg-gray-100 text-gray-800')
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-xl">{lang.flag}</span>
                    <span className="flex flex-col">
                      <span className="font-bold leading-tight">{lang.name}</span>
                      <span className="text-[10px] opacity-65 font-normal">{lang.country}</span>
                    </span>
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    currentLang === lang.code ? 'bg-white/20 text-white' : 'bg-black/20 text-gray-400'
                  }`}>
                    {lang.code.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {renderGmailLoginModal()}
      <UpdateNotificationModal 
        isOpen={showUpdateModal} 
        onClose={() => {
          setShowUpdateModal(false);
          try {
            localStorage.setItem('avalive_last_version', APP_VERSION);
          } catch (e) {}
        }} 
      />
    </div>
  );
}
