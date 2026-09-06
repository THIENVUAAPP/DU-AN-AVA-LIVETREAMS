import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import flvjs from 'flv.js';
import Hls from 'hls.js';
import GameBanDoVietNam from './game/GameBanDoVietNam';
import GameBattleOverlay from './game/GameBattleOverlay';
import GameChienDau from './game/GameChienDau';
import { supabase } from '../../lib/supabaseClient';
import { loadAllAidolItems } from '../../utils/idbHelper';
import { syncMasterLiveState, getMasterLiveState, sendVideoControl } from '../../lib/masterLiveSync';
// Clean Live Overlay - Ultra HD OBS Window Capture
import bandoAudio from './game/bandoAudioEngine';

/**
 * ⚡ CỬA SỔ MASTER OVERLAY 1 LINK DUY NHẤT TOÀN NĂNG — CHO TIKTOK LIVE STUDIO & OBS STUDIO
 * - URL: ?overlay=live hoặc /overlay-live hoặc /live
 * - Đồng bộ 5 tầng: Supabase Cloud Realtime + WebSocket (Socket.io) + REST API Polling + BroadcastChannel + LocalStorage
 * - Tự động chuyển đổi giữa: AI Idol / Sàn Nhảy 3D / Game Bản Đồ 63 Tỉnh / Game Chiến Đấu PK / Live Camera Studio
 * - Hiển thị 100% VIDEO / STREAM SẠCH, không dính bất kỳ badge hay rác thông tin nào
 */
const getBackendUrl = () => {
  if (typeof window === 'undefined') return 'http://localhost:3001';
  const urlParams = new URLSearchParams(window.location.search);
  // Nếu có tham số ?backend= thì dùng luôn (override thủ công)
  const backendParam = urlParams.get('backend');
  if (backendParam) return backendParam;
  
  const hostname = window.location.hostname;
  const port = window.location.port;
  const proto = window.location.protocol;
  
  // Tunnel domains (trycloudflare.com, loca.lt, ngrok.io, v.v.)
  // => Cloudflare Tunnel PROXY MỌI REQUEST (HTTP + WebSocket) về localhost:3001 tự động
  // => PHẢI dùng same-origin (cùng domain tunnel), KHÔNG dùng localhost
  // => Vì HTTPS page → HTTP localhost = MIXED CONTENT bị chặn 100%!
  const isTunnelDomain = (
    hostname.includes('trycloudflare.com') ||
    hostname.includes('loca.lt') ||
    hostname.includes('ngrok') ||
    hostname.includes('serveo.net')
  );
  
  const isCloudDomain = (
    hostname.includes('vercel.app') ||
    hostname.includes('netlify.app')
  );
  
  if (isTunnelDomain) {
    // Same-origin: tất cả request đi qua tunnel → proxy về localhost:3001
    // WebSocket: wss://xxx.trycloudflare.com → tunnel → ws://localhost:3001
    // API: https://xxx.trycloudflare.com/api/... → tunnel → http://localhost:3001/api/...
    return `${proto}//${hostname}`;
  }
  
  if (isCloudDomain) {
    // Cloud deployment: API và WS cũng ở cùng origin
    return `${proto}//${hostname}`;
  }
  
  // Trường hợp chạy trực tiếp trên máy (localhost / IP local)
  const usePort = port && port !== '5173' && port !== '3000' ? port : '3001';
  return `http://${hostname}:${usePort}`;
};

export default function CleanLiveOverlay({ customStyle = {} }) {
  const overlayVideoRef = useRef(null);
  const blobUrlMapRef = useRef(new Map());
  const [masterState, setMasterState] = useState(() => {
    let saved = null;
    try {
      const raw = localStorage.getItem('avalive_master_live_state');
      if (raw) saved = JSON.parse(raw);
    } catch (e) {}

    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const pathname = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
    const overlayParam = urlParams ? urlParams.get('overlay') : '';
    const ratioParam = urlParams ? urlParams.get('ratio') : (saved?.aspectRatio || '9:16');
    const directVideoUrl = urlParams ? urlParams.get('v') : null;
    
    let defaultStage = 'idol'; // Mặc định AI Idol
    if (overlayParam === 'bando' || overlayParam === 'vietnam_map' || overlayParam === 'map' || pathname.includes('/bando')) defaultStage = 'bando';
    else if (overlayParam === 'gamebattle' || overlayParam === 'battle' || overlayParam === 'game' || pathname.includes('/battle')) defaultStage = 'battle';
    else if (overlayParam === 'dancefloor' || overlayParam === 'dance' || overlayParam === 'dance-floor' || pathname.includes('/dance')) defaultStage = 'dancefloor';
    else if (overlayParam === 'avatar' || overlayParam === 'idol' || pathname.includes('/idol')) defaultStage = 'idol';
    else if (overlayParam === 'broadcast' || overlayParam === 'studio' || pathname.includes('/studio')) defaultStage = 'broadcast';
    else if (saved && saved.stage) {
      defaultStage = saved.stage;
    }

    return {
      stage: defaultStage, // 'idol' | 'dancefloor' | 'battle' | 'bando' | 'broadcast'
      aspectRatio: ratioParam || '9:16',
      mediaUrl: directVideoUrl || (saved?.mediaUrl && !saved.mediaUrl.includes('nhep_mieng.mp4') && !saved.mediaUrl.includes('demo_dancer.mp4') && !saved.mediaUrl.includes('default_idol.mp4') ? saved.mediaUrl : null),
      flvUrl: directVideoUrl || saved?.flvUrl || null,
      isVideo: saved?.isVideo !== false,
      selectedCharacter: saved?.selectedCharacter || '',
      characterName: saved?.characterName || 'AvaLive VIP PRO',
      isConnected: true,
      isSpeaking: saved?.isSpeaking || false,
      speechText: saved?.speechText || '',
      isDarkMode: true,
      currentLang: 'vi'
    };
  });

  const socketRef = useRef(null);
  const lastLoadedMediaUrlRef = useRef(null);
  const lastUserActionTimeRef = useRef(0);

  // 🎯 KIỂM TRA CHÍNH XÁC XEM NGƯỜI DÙNG CÓ CHỦ ĐỘNG BẤM TẠM DỪNG HAY KHÔNG (TRÁNH CHROMIUM BỊ THROTTLED / NGẮT NHẦM KHI CHUYỂN TAB)
  const checkIfUserPaused = () => {
    try {
      if (localStorage.getItem('avalive_user_paused') === 'true') return true;
      if (localStorage.getItem('avalive_window_capture_paused') === 'true') return true;
    } catch (e) {}
    if (overlayVideoRef.current && overlayVideoRef.current.dataset && overlayVideoRef.current.dataset.userPaused === 'true') return true;
    if (masterState.videoPlaybackEvent === 'pause') return true;
    if (masterState.isPlaying === false) return true;
    return false;
  };

  const [liveEvent, setLiveEvent] = useState(null);
  const [isVideoAudioMuted, setIsVideoAudioMuted] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_overlay_audio_muted');
      return saved !== null ? saved === 'true' : false; // Mặc định mở tiếng để phát âm thanh
    } catch (e) {
      return false;
    }
  });
  const [videoVolume, setVideoVolume] = useState(() => {
    try {
      const v = localStorage.getItem('avalive_overlay_volume');
      return v ? parseFloat(v) : 1.0;
    } catch (e) {
      return 1.0;
    }
  });
  const [isPlayingState, setIsPlayingState] = useState(() => {
    try {
      return localStorage.getItem('avalive_user_paused') !== 'true';
    } catch (e) {
      return true;
    }
  });
  const isWindowCapture = typeof window !== 'undefined' ? (() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === 'window_capture' || params.get('capture') === '1' || window.location.pathname.includes('/window-capture');
  })() : false;

  const [isControlDockCollapsed, setIsControlDockCollapsed] = useState(() => {
    try {
      return localStorage.getItem('avalive_window_capture_dock_collapsed') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [hasAutoplayStarted, setHasAutoplayStarted] = useState(false);
  const [showCaptureTip, setShowCaptureTip] = useState(false);

  // ⚡ CLICK / TOUCH / INTERACT UNLOCK: Mở khóa âm thanh và kích hoạt phát ngay khi người dùng chạm vào cửa sổ
  useEffect(() => {
    const handleInteractUnlock = () => {
      setHasAutoplayStarted(true);
      const vid = overlayVideoRef.current;
      if (vid) {
        if (vid.paused && localStorage.getItem('avalive_user_paused') !== 'true') {
          vid.play().catch(() => {});
        }
        if (!isVideoAudioMuted) {
          vid.muted = false;
          vid.volume = videoVolume;
        }
      }
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx && window.__avaLiveAudioContext?.state === 'suspended') {
          window.__avaLiveAudioContext.resume().catch(() => {});
        }
      } catch (e) {}
    };

    window.addEventListener('pointerdown', handleInteractUnlock);
    window.addEventListener('click', handleInteractUnlock);
    window.addEventListener('keydown', handleInteractUnlock);
    return () => {
      window.removeEventListener('pointerdown', handleInteractUnlock);
      window.removeEventListener('click', handleInteractUnlock);
      window.removeEventListener('keydown', handleInteractUnlock);
    };
  }, [isVideoAudioMuted, videoVolume]);

  const [objectFitState, setObjectFitState] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_overlay_fit');
      if (saved === 'contain' || saved === 'cover') return saved;
    } catch (e) {}
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    return params?.get('fit') === 'contain' ? 'contain' : 'cover';
  });
  const isInternalAudioChangeRef = useRef(false);
  const isInternalPlaybackChangeRef = useRef(false);

  // 1. TẠM DỪNG / TIẾP TỤC PHÁT (Play / Pause) — Tác động tức thì mọi video và đồng bộ 2 chiều sang Phần Mềm Chính
  const togglePlayPause = () => {
    lastUserActionTimeRef.current = Date.now();
    const nextPlay = !isPlayingState;
    setIsPlayingState(nextPlay);

    const allMedia = document.querySelectorAll('video, audio');
    if (!nextPlay) {
      // Streamer bấm TẠM DỪNG: DỪNG HẲN 100%, KHÔNG TỰ ĐỘNG PHÁT LẠI
      try { 
        localStorage.setItem('avalive_user_paused', 'true');
        localStorage.setItem('avalive_window_capture_paused', 'true');
      } catch (e) {}
      allMedia.forEach(v => {
        try {
          v.dataset.userPaused = 'true';
          v.pause();
        } catch (e) {}
      });
      if (typeof bandoAudio.pauseAll === 'function') bandoAudio.pauseAll();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      const curTime = overlayVideoRef.current ? overlayVideoRef.current.currentTime : 0;
      setMasterState(prev => ({ ...prev, videoPlaybackEvent: 'pause', videoCurrentTime: curTime, isPlaying: false }));
      syncMasterLiveState({ videoPlaybackEvent: 'pause', videoCurrentTime: curTime, isPlaying: false }, socketRef.current);
      sendVideoControl({ action: 'pause', isPlaying: false, currentTime: curTime }, socketRef.current);

      // Bắn tín hiệu sang Phần Mềm Chính để dừng đồng thời
      try {
        const bc = new BroadcastChannel('avalive_master_live_stream');
        bc.postMessage({ type: 'GLOBAL_PLAYBACK_CHANGE', isPlaying: false, userPaused: true, currentTime: curTime, source: 'overlay', timestamp: Date.now() });
        setTimeout(() => bc.close(), 100);
      } catch (e) {}
    } else {
      // Streamer bấm TIẾP TỤC:
      try { 
        localStorage.removeItem('avalive_user_paused');
        localStorage.removeItem('avalive_window_capture_paused');
      } catch (e) {}
      allMedia.forEach(v => {
        try {
          v.dataset.userPaused = 'false';
          v.muted = isVideoAudioMuted;
          if (!isVideoAudioMuted) v.volume = videoVolume;
          v.play().catch(() => {
            v.muted = true;
            v.play().catch(() => {});
          });
        } catch (e) {}
      });
      const curTime = overlayVideoRef.current ? overlayVideoRef.current.currentTime : 0;
      setMasterState(prev => ({ ...prev, videoPlaybackEvent: 'play', videoCurrentTime: curTime, isPlaying: true }));
      syncMasterLiveState({ videoPlaybackEvent: 'play', videoCurrentTime: curTime, isPlaying: true }, socketRef.current);
      sendVideoControl({ action: 'play', isPlaying: true, currentTime: curTime }, socketRef.current);

      // Bắn tín hiệu sang Phần Mềm Chính để tiếp tục phát đồng thời
      try {
        const bc = new BroadcastChannel('avalive_master_live_stream');
        bc.postMessage({ type: 'GLOBAL_PLAYBACK_CHANGE', isPlaying: true, userPaused: false, currentTime: curTime, source: 'overlay', timestamp: Date.now() });
        setTimeout(() => bc.close(), 100);
      } catch (e) {}
    }
  };

  // 2. BẬT / TẮT ÂM THANH (Mute / Unmute HD) — Đồng bộ tức thì cả Window Capture và Phần Mềm Chính
  const toggleAudioMute = () => {
    lastUserActionTimeRef.current = Date.now();
    const nextMuted = !isVideoAudioMuted;
    setIsVideoAudioMuted(nextMuted);
    try { 
      localStorage.setItem('avalive_audio_muted', String(nextMuted));
      localStorage.setItem('avalive_overlay_audio_muted', String(nextMuted));
      localStorage.setItem('avalive_global_audio_muted', String(nextMuted));
      localStorage.setItem('avalive_local_speaker_muted', String(nextMuted));
    } catch (e) {}

    const allMedia = document.querySelectorAll('video, audio');
    allMedia.forEach(el => {
      try {
        el.muted = nextMuted;
        if (!nextMuted) {
          el.volume = videoVolume > 0 ? videoVolume : 1.0;
        }
      } catch (e) {}
    });

    bandoAudio.setLocalSpeakerMute(nextMuted);
    bandoAudio.setMuted(nextMuted);

    // Kích hoạt Web Audio API nếu trình duyệt đang treo AudioContext
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        if (!window.__avaLiveAudioContext) {
          window.__avaLiveAudioContext = new AudioCtx();
        }
        if (window.__avaLiveAudioContext.state === 'suspended' && !nextMuted) {
          window.__avaLiveAudioContext.resume().catch(() => {});
        }
      }
    } catch (e) {}

    // Bắn tín hiệu sang Phần Mềm Chính để tắt / mở tiếng đồng bộ
    try {
      const bc = new BroadcastChannel('avalive_master_live_stream');
      bc.postMessage({ type: 'GLOBAL_AUDIO_CHANGE', isMuted: nextMuted, volume: videoVolume, source: 'overlay', timestamp: Date.now() });
      setTimeout(() => bc.close(), 100);
    } catch (e) {}

    syncMasterLiveState({
      isVideoAudioMuted: nextMuted,
      videoVolume: videoVolume
    }, socketRef.current);
  };

  // 3. ĐIỀU CHỈNH ÂM LƯỢNG (Volume Slider) — Cập nhật mượt mà 0% -> 100% đồng bộ 2 chiều
  const handleVolumeChange = (newVol) => {
    lastUserActionTimeRef.current = Date.now();
    setVideoVolume(newVol);
    try { 
      localStorage.setItem('avalive_video_volume', String(newVol));
      localStorage.setItem('avalive_overlay_volume', String(newVol));
      localStorage.setItem('avalive_global_volume', String(newVol));
    } catch (e) {}

    const isMutedNow = newVol === 0;
    if (isMutedNow !== isVideoAudioMuted) {
      setIsVideoAudioMuted(isMutedNow);
      try { 
        localStorage.setItem('avalive_audio_muted', String(isMutedNow));
        localStorage.setItem('avalive_overlay_audio_muted', String(isMutedNow));
        localStorage.setItem('avalive_global_audio_muted', String(isMutedNow));
      } catch (e) {}
    }

    const allMedia = document.querySelectorAll('video, audio');
    allMedia.forEach(el => {
      try {
        el.volume = newVol;
        el.muted = isMutedNow;
      } catch (e) {}
    });

    bandoAudio.setMasterVolume(newVol);
    bandoAudio.setMuted(isMutedNow);

    // Bắn tín hiệu sang Phần Mềm Chính để chỉnh âm lượng đồng bộ
    try {
      const bc = new BroadcastChannel('avalive_master_live_stream');
      bc.postMessage({ type: 'GLOBAL_AUDIO_CHANGE', isMuted: isMutedNow, volume: newVol, source: 'overlay', timestamp: Date.now() });
      setTimeout(() => bc.close(), 100);
    } catch (e) {}

    syncMasterLiveState({
      videoVolume: newVol,
      isVideoAudioMuted: isMutedNow
    }, socketRef.current);
  };

  // 4. CHUYỂN ĐỔI SÂN KHẤU TỨC THÌ (Idol AI / Bản Đồ / Chiến Đấu / Studio 4K) — 1-Click đồng bộ không giật lag
  const handleStageSwitch = (newStage) => {
    lastUserActionTimeRef.current = Date.now();
    setMasterState(prev => ({ ...prev, stage: newStage }));
    try {
      localStorage.setItem('avalive_active_stage', newStage);
    } catch (e) {}

    // Đồng bộ chuẩn 5 tầng với timestamp mới nhất Date.now() để chống Polling server đè ngược lại
    syncMasterLiveState({ stage: newStage }, socketRef.current);

    // Kích hoạt ngay camera Studio nếu chuyển sang Studio 4K
    if (newStage === 'broadcast' || newStage === 'studio') {
      if (navigator.mediaDevices?.getUserMedia && !overlayWebcamStreamRef.current) {
        navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false })
          .then(stream => {
            overlayWebcamStreamRef.current = stream;
            if (overlayWebcamVideoRef.current) {
              overlayWebcamVideoRef.current.srcObject = stream;
            }
            setOverlayCamActive(true);
          })
          .catch(() => {});
      }
    }
  };

  // 5. CHUYỂN ĐỔI CHẾ ĐỘ HIỂN THỊ (Fit: Phủ Kín / Fit: Vừa Vặn)
  const toggleFitMode = () => {
    lastUserActionTimeRef.current = Date.now();
    setObjectFitState(prev => {
      const nextFit = prev === 'cover' ? 'contain' : 'cover';
      try { localStorage.setItem('avalive_overlay_fit', nextFit); } catch (e) {}
      return nextFit;
    });
  };

  // 6. CHUYỂN ĐỔI TỶ LỆ KHUNG HÌNH (9:16 Dọc vs 16:9 Ngang) — Cố định khung hình chuẩn OBS
  const toggleAspectRatio = () => {
    lastUserActionTimeRef.current = Date.now();
    const currentRatio = masterState.aspectRatio || '9:16';
    const nextRatio = currentRatio === '9:16' ? '16:9' : '9:16';
    setMasterState(prev => ({ ...prev, aspectRatio: nextRatio }));
    try { localStorage.setItem('avalive_active_aspect_ratio', nextRatio); } catch (e) {}
    syncMasterLiveState({ aspectRatio: nextRatio }, socketRef.current);
  };

  // 5. PHÍM TẮT THÔNG MINH (HOTKEYS) — Tiện lợi cho Streamer điều khiển nhanh
  useEffect(() => {
    if (!isWindowCapture) return;
    const handleKeyDown = (e) => {
      // Bỏ qua nếu đang gõ input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      const key = e.key.toLowerCase();
      if (key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (key === 'm') {
        e.preventDefault();
        toggleAudioMute();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleVolumeChange(Math.min(1.0, Math.round((videoVolume + 0.05) * 100) / 100));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleVolumeChange(Math.max(0.0, Math.round((videoVolume - 0.05) * 100) / 100));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWindowCapture, isPlayingState, isVideoAudioMuted, videoVolume]);
  const [localDbItems, setLocalDbItems] = useState([]);
  const [hasStudioFrame, setHasStudioFrame] = useState(false);
  const studioImageRef = useRef(null);

  const updateStudioFrame = (frameData) => {
    if (frameData) {
      if (!hasStudioFrame) setHasStudioFrame(true);
      if (studioImageRef.current) {
        studioImageRef.current.src = frameData;
      }
    }
  };

  // Tải danh sách item từ IndexedDB của cửa sổ này để tái tạo Blob URL cục bộ
  useEffect(() => {
    loadAllAidolItems().then(items => {
      if (Array.isArray(items) && items.length > 0) {
        setLocalDbItems(items);
      }
    }).catch(() => {});

    const handleDbUpdate = () => {
      loadAllAidolItems().then(items => {
        if (Array.isArray(items) && items.length > 0) {
          setLocalDbItems(items);
        }
      }).catch(() => {});
    };
    window.addEventListener('aidol_db_updated', handleDbUpdate);
    return () => window.removeEventListener('aidol_db_updated', handleDbUpdate);
  }, []);

  // 📷 Webcam Stream Support cho OBS Studio & TikTok Live Studio
  const [overlayCamActive, setOverlayCamActive] = useState(() => {
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    return urlParams?.get('cam') === '1' || urlParams?.get('webcam') === 'true';
  });
  const overlayWebcamVideoRef = useRef(null);
  const overlayWebcamStreamRef = useRef(null);

  const toggleOverlayCam = async () => {
    if (overlayCamActive) {
      if (overlayWebcamStreamRef.current) {
        overlayWebcamStreamRef.current.getTracks().forEach(t => t.stop());
        overlayWebcamStreamRef.current = null;
      }
      setOverlayCamActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        overlayWebcamStreamRef.current = stream;
        if (overlayWebcamVideoRef.current) {
          overlayWebcamVideoRef.current.srcObject = stream;
        }
        setOverlayCamActive(true);
      } catch (err) {
        console.warn('Overlay Camera notice:', err.message);
      }
    }
  };

  useEffect(() => {
    if (overlayCamActive && overlayWebcamVideoRef.current && overlayWebcamStreamRef.current) {
      overlayWebcamVideoRef.current.srcObject = overlayWebcamStreamRef.current;
    }
  }, [overlayCamActive]);

  useEffect(() => {
    return () => {
      if (overlayWebcamStreamRef.current) {
        overlayWebcamStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // ⚡ ANTI-OCCLUSION & ANTI-FREEZE KEEP-ALIVE ENGINE CHO TIKTOK LIVE STUDIO & OBS WINDOW CAPTURE
  // Khắc phục triệt để lỗi đứng hình khi cửa sổ bị che khuất hoặc không nằm đè lên trên
  useEffect(() => {
    // 1. Silent Web Audio API Heartbeat: Báo cho Chromium biết cửa sổ đang phát âm thanh ngầm
    // khiến Chromium KHÔNG BAO GIỜ ngắt / đóng băng tiến trình dù bị che khuất hoặc nằm dưới
    let audioCtx = null;
    let osc = null;
    const startAudioKeepAlive = () => {
      try {
        const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
        if (AudioCtxClass && !audioCtx) {
          audioCtx = new AudioCtxClass();
          osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          gain.gain.value = 0.00001; // Âm lượng siêu nhỏ không thể nghe thấy
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume().catch(() => {});
        }
      } catch (e) {}
    };
    startAudioKeepAlive();
    window.addEventListener('click', startAudioKeepAlive, { once: true });
    window.addEventListener('focus', startAudioKeepAlive);

    // 2. Spoof Document Visibility: Đánh lừa Chromium để luôn báo cửa sổ đang hiển thị chính
    try {
      Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
      Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
    } catch (e) {}

    // 3. Wake Lock: Chống tắt màn hình / sleep máy
    if ('wakeLock' in navigator) {
      navigator.wakeLock.request('screen').catch(() => {});
    }

    return () => {
      if (osc) {
        try { osc.stop(); } catch (e) {}
      }
      if (audioCtx) {
        try { audioCtx.close(); } catch (e) {}
      }
      window.removeEventListener('focus', startAudioKeepAlive);
    };
  }, []);

  useEffect(() => {
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const isCapture = urlParams?.get('mode') === 'window_capture' || urlParams?.get('capture') === '1';
    if (isCapture) {
      document.title = '[AvaLive VIP PRO] - Cửa Sổ Live 9:16 (Window Capture)';
      document.documentElement.style.background = '#000000';
      document.body.style.background = '#000000';
    } else {
      document.title = 'AVA Live Output (Realtime Master Overlay) — TikTok LIVE Studio / OBS';
      document.documentElement.style.background = 'transparent';
      document.body.style.background = 'transparent';
    }

    // 5 TẦNG ĐỒNG BỘ: KẾT NỐI VÀ TỰ ĐỘNG PHỤC HỒI
    let isSubscribed = true;

    // ⚡ XỬ LÝ ĐIỀU KHIỂN VIDEO REAL-TIME KHÓA CHẶT LOCKSTEP VỚI PHẦN MỀM CHÍNH
    const handleVideoPlaybackControl = (control) => {
      if (!control) return;
      const vid = overlayVideoRef.current || document.querySelector('video');
      const action = control.action || control.videoPlaybackEvent;
      const targetTime = typeof control.currentTime === 'number' ? control.currentTime : control.videoCurrentTime;
      const isPlaying = control.isPlaying !== undefined ? control.isPlaying : action === 'play';

      // 1. Đồng bộ URL media nếu có file mới được chọn trên phần mềm
      if (control.mediaUrl) {
        let cleanMediaUrl = control.mediaUrl;
        if (typeof cleanMediaUrl === 'string' && cleanMediaUrl.includes('/uploads/')) {
          cleanMediaUrl = cleanMediaUrl.substring(cleanMediaUrl.indexOf('/uploads/'));
        }
        setMasterState(prev => {
          let prevClean = prev.mediaUrl;
          if (typeof prevClean === 'string' && prevClean.includes('/uploads/')) {
            prevClean = prevClean.substring(prevClean.indexOf('/uploads/'));
          }
          if (prevClean !== cleanMediaUrl) {
            return { ...prev, mediaUrl: cleanMediaUrl, isVideo: true };
          }
          return prev;
        });
      }

      if (!vid) return;

      // 2. Đồng bộ Pause / Play / Tua / Nhịp tim thời gian thực
      if (action === 'pause' || isPlaying === false) {
        try {
          localStorage.setItem('avalive_user_paused', 'true');
          localStorage.setItem('avalive_window_capture_paused', 'true');
        } catch (e) {}
        vid.dataset.userPaused = 'true';
        setMasterState(prev => ({ ...prev, isPlaying: false, videoPlaybackEvent: 'pause' }));
        if (!vid.paused) {
          try { vid.pause(); } catch (e) {}
        }
        setIsPlayingState(false);
      } else if (action === 'play' || isPlaying === true) {
        try {
          localStorage.removeItem('avalive_user_paused');
          localStorage.removeItem('avalive_window_capture_paused');
        } catch (e) {}
        vid.dataset.userPaused = 'false';
        setMasterState(prev => ({ ...prev, isPlaying: true, videoPlaybackEvent: 'play' }));
        vid.muted = isVideoAudioMuted;
        if (!isVideoAudioMuted) vid.volume = videoVolume;
        // CHỈ TUA KHI CÓ LỆNH ÉP BUỘC (ĐỔI VIDEO MỚI HOẶC CHỦ ĐỘNG TUA)
        if (control.force && typeof targetTime === 'number' && !isNaN(targetTime)) {
          try { vid.currentTime = targetTime; } catch (e) {}
        }
        if (vid.paused) {
          vid.play().catch(() => {
            vid.muted = true;
            vid.play().catch(() => {});
          });
        }
        setIsPlayingState(true);
      } else if (action === 'seek' || action === 'user_restart') {
        // CHỈ TUA KHI LÀ LỆNH ÉP BUỘC RÕ RÀNG TỪ NGƯỜI DÙNG HOẶC RESTART
        if ((control.force || action === 'user_restart') && typeof targetTime === 'number' && !isNaN(targetTime)) {
          try { vid.currentTime = targetTime; } catch (e) {}
        }
      } else if (action === 'time_sync') {
        // TUYỆT ĐỐI KHÔNG TUA KHI ĐANG PHÁT BÌNH THƯỜNG - TRÁNH LẶP LẠI VÀ CHỚP NHẢY
        if (control.force && typeof targetTime === 'number' && !isNaN(targetTime)) {
          try { vid.currentTime = targetTime; } catch (e) {}
        }
        if (isPlaying && vid.paused && localStorage.getItem('avalive_user_paused') !== 'true') {
          vid.play().catch(() => {});
          setIsPlayingState(true);
        } else if (!isPlaying && !vid.paused) {
          try { vid.pause(); } catch (e) {}
          setIsPlayingState(false);
        }
      }

      // 3. Đồng bộ Mute & Volume tức thì nếu có trong control payload
      if (typeof control.isMuted === 'boolean') {
        setIsVideoAudioMuted(control.isMuted);
        if (vid) vid.muted = control.isMuted;
        bandoAudio.setLocalSpeakerMute(control.isMuted);
        bandoAudio.setMuted(control.isMuted);
      }
      if (typeof control.volume === 'number') {
        setVideoVolume(control.volume);
        if (vid && !isVideoAudioMuted) vid.volume = control.volume;
        bandoAudio.setMasterVolume(control.volume);
      }
    };

    const applyMasterState = (data) => {
      if (!data) return;

      // 🎬 ĐỒNG BỘ PLAY / PAUSE / TIME LẬP TỨC THEO PHẦN MỀM GỐC
      const vid = overlayVideoRef.current || document.querySelector('video');
      if (data.isPlaying === false || data.videoPlaybackEvent === 'pause') {
        try {
          localStorage.setItem('avalive_user_paused', 'true');
          localStorage.setItem('avalive_window_capture_paused', 'true');
        } catch (e) {}
        if (vid) {
          vid.dataset.userPaused = 'true';
          if (!vid.paused) {
            try { vid.pause(); } catch (e) {}
          }
        }
        setIsPlayingState(false);
      } else if (data.isPlaying === true || data.videoPlaybackEvent === 'play') {
        try {
          localStorage.removeItem('avalive_user_paused');
          localStorage.removeItem('avalive_window_capture_paused');
        } catch (e) {}
        if (vid) {
          vid.dataset.userPaused = 'false';
          vid.muted = isVideoAudioMuted;
          if (!isVideoAudioMuted) vid.volume = videoVolume;
          // TUYỆT ĐỐI KHÔNG TUA THỜI GIAN TRONG POLLING ĐỊNH KỲ — ĐỂ VIDEO CHẠY LIÊN TỤC KHÔNG BỊ KHỞI ĐỘNG LẠI
          if (vid.paused) {
            vid.play().catch(() => {
              vid.muted = true;
              vid.play().catch(() => {});
            });
          }
        }
        setIsPlayingState(true);
      }

      // Đồng bộ Âm thanh & Âm lượng từ Phần Mềm Chính
      if (typeof data.isVideoAudioMuted === 'boolean') {
        setIsVideoAudioMuted(data.isVideoAudioMuted);
        bandoAudio.setLocalSpeakerMute(data.isVideoAudioMuted);
        bandoAudio.setMuted(data.isVideoAudioMuted);
      }
      if (typeof data.videoVolume === 'number') {
        setVideoVolume(data.videoVolume);
        bandoAudio.setMasterVolume(data.videoVolume);
      }

      if (data.tunnelUrl) {
        try { localStorage.setItem('avalive_tunnel_url', data.tunnelUrl); } catch (e) {}
      }

      setMasterState(prev => {
        // Kiểm tra xem có trường dữ liệu quan trọng nào thực sự thay đổi không
        let hasDiff = false;
        const keys = ['stage', 'aspectRatio', 'mediaUrl', 'flvUrl', 'isVideo', 'selectedCharacter', 'characterName', 'isPlaying', 'isDarkMode', 'tunnelUrl'];
        for (const k of keys) {
          if (data[k] !== undefined && data[k] !== prev[k]) {
            hasDiff = true;
            break;
          }
        }
        if (data.videoPlaybackEvent && data.videoPlaybackEvent !== 'time_sync' && data.videoPlaybackEvent !== prev.videoPlaybackEvent) {
          hasDiff = true;
        }
        if (data.force && data.videoPlaybackEvent === 'seeked' && data.videoCurrentTime !== undefined) {
          hasDiff = true;
        }

        if (!hasDiff) return prev; // Không thay đổi thì giữ nguyên reference, tránh kích hoạt re-render

        const next = { ...prev, ...data };

        // URL Parameter & Path Override check (nếu link là link chuyên dụng của 1 dự án thì cố định dự án đó)
        const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const pathname = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
        const overlayParam = urlParams ? urlParams.get('overlay') : '';
        if (overlayParam === 'bando' || overlayParam === 'vietnam_map' || overlayParam === 'map' || pathname.includes('/bando')) {
          next.stage = 'bando';
        } else if (overlayParam === 'gamebattle' || overlayParam === 'battle' || overlayParam === 'game' || pathname.includes('/battle')) {
          next.stage = 'battle';
        } else if (overlayParam === 'dancefloor' || overlayParam === 'dance' || overlayParam === 'dance-floor' || pathname.includes('/dance')) {
          next.stage = 'dancefloor';
        } else if (overlayParam === 'avatar' || overlayParam === 'idol' || pathname.includes('/idol')) {
          next.stage = 'idol';
        } else if (overlayParam === 'broadcast' || overlayParam === 'studio' || pathname.includes('/studio')) {
          next.stage = 'broadcast';
        }
        
        // Cập nhật lại IDB nếu nhân vật thay đổi (vì sự kiện tải file không bắn chéo cửa sổ được)
        if (prev.selectedCharacter !== next.selectedCharacter) {
           loadAllAidolItems().then(items => {
             if (Array.isArray(items) && items.length > 0) setLocalDbItems(items);
           }).catch(() => {});
        }
        
        return next;
      });
    };

    // 1. SUPABASE REALTIME CLOUD BROADCAST
    let supabaseChannel = null;
    try {
      if (supabase && typeof supabase.channel === 'function') {
        supabaseChannel = supabase.channel('avalive_master_live_realtime', {
          config: { broadcast: { self: true } }
        });

        supabaseChannel.on('broadcast', { event: 'MASTER_LIVE_STATE_UPDATE' }, (payload) => {
          if (payload?.payload) {
            applyMasterState(payload.payload);
          }
        });

        supabaseChannel.on('broadcast', { event: 'VIDEO_PLAYBACK_CONTROL' }, (payload) => {
          if (payload?.payload) {
            handleVideoPlaybackControl(payload.payload);
          }
        });

        supabaseChannel.on('broadcast', { event: 'LIVE_EVENT' }, (payload) => {
          if (payload?.payload) {
            setLiveEvent(payload.payload);
          }
        });

        supabaseChannel.subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            supabaseChannel.send({
              type: 'broadcast',
              event: 'REQUEST_MASTER_LIVE_STATE'
            }).catch(() => {});
          }
        });
      }
    } catch (e) {
      console.warn('[Overlay] Supabase Realtime note:', e.message);
    }

    // Xoá Fast Preload Media sau khi React đã mount và chuẩn bị phát video thật (tránh màn hình đen 0.5s)
    setTimeout(() => {
      const preload = document.getElementById('fast-preload-media');
      if (preload) {
        preload.style.transition = 'opacity 0.3s ease';
        preload.style.opacity = '0';
        setTimeout(() => preload.remove(), 300);
      }
    }, 800);

    // 2. HTTP REST API POLING
    const fetchLiveState = () => {
      const endpoint = getBackendUrl() ? `${getBackendUrl()}/api/live-state` : '/api/live-state';
      fetch(endpoint)
        .then(res => res.json())
        .then(data => {
          if (data && data.stage) {
            applyMasterState(data);
          }
        })
        .catch(() => {});
    };
    fetchLiveState();
    
    // Polling nhịp tim nền dự phòng (2s/lần, không spam mạng để chống giật lag video)
    const httpPollInterval = setInterval(fetchLiveState, 2000);

    // 3. WEBSOCKET REALTIME (SOCKET.IO)
    let socket = null;
    try {
      socket = io(getBackendUrl(), {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000
      });
      socketRef.current = socket;

      socket.on('connect', () => {
        socket.emit('REQUEST_MASTER_LIVE_STATE');
      });

      // ⚡ Nhận lệnh điều khiển video trực tiếp tức thì 0ms từ phần mềm chính
      socket.on('VIDEO_PLAYBACK_CONTROL', (control) => {
        if (control) handleVideoPlaybackControl(control);
      });

      socket.on('MASTER_LIVE_STATE_UPDATE', (data) => {
        if (data) applyMasterState(data);
      });

      socket.on('LIVE_EVENT', (data) => {
        if (data) setLiveEvent({ ...data, _ts: Date.now() });
      });

      socket.on('battle_event', (data) => {
        if (data) setLiveEvent({ ...data, _ts: Date.now() });
      });

      socket.on('tiktok_gift', (data) => {
        if (!data) return;
        setLiveEvent({
          type: 'GIFT',
          data: {
            giftId: data.giftId,
            giftName: data.giftName,
            count: data.repeatCount || data.count || 1,
            diamondCount: data.diamondCount || 1,
            userId: data.userId || data.uniqueId || 'tiktok_guest',
            username: data.nickname || data.username || data.uniqueId || 'Khách Live',
            avatar: data.profilePictureUrl || data.avatar || '',
            regionTarget: data.regionTarget || null,
            faction: data.faction || (Math.random() < 0.5 ? 'blue' : 'red')
          },
          _ts: Date.now()
        });
      });

      socket.on('tiktok_chat', (data) => {
        if (!data) return;
        const text = data.comment || data.text || '';
        const author = data.nickname || data.username || data.uniqueId || 'Khán Giả';
        const userId = data.userId || data.uniqueId || 'chat_user';
        const avatar = data.profilePictureUrl || data.avatar || '';
        setLiveEvent({
          type: 'COMMENT',
          data: { comment: text, text, username: author, nickname: author, userId, avatar },
          _ts: Date.now()
        });
      });

      socket.on('bando_sync', (data) => {
        if (data) setLiveEvent({ type: 'BANDO_SYNC', data, _ts: Date.now() });
      });

      socket.on('battle_sync', (data) => {
        if (data) setLiveEvent({ type: 'BATTLE_SYNC', data, _ts: Date.now() });
      });

      socket.on('STUDIO_CAM_FRAME', (frameData) => {
        if (frameData) updateStudioFrame(frameData);
      });
    } catch (err) {
      console.warn('Socket.io note:', err);
    }

    // 4. BROADCAST CHANNELS
    let masterChannel = null;
    let bandoChannel = null;
    let battleChannel = null;
    let cleanChannel = null;
    let studioCamBc = null;
    let videoControlBc = null;

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        videoControlBc = new BroadcastChannel('avalive_video_control');
        videoControlBc.onmessage = (e) => {
          if (e.data) {
            handleVideoPlaybackControl(e.data);
          }
        };

        studioCamBc = new BroadcastChannel('avalive_studio_cam_feed');
        studioCamBc.onmessage = (e) => {
          if (e.data?.frame) {
            updateStudioFrame(e.data.frame);
          }
        };

        masterChannel = new BroadcastChannel('avalive_master_live_stream');
        masterChannel.onmessage = (event) => {
          if (event.data) {
            if (event.data.type === 'EMERGENCY_STOP_ALL') {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('avalive_emergency_stop_all'));
                if (window.speechSynthesis) window.speechSynthesis.cancel();
              }
              const mediaElements = document.querySelectorAll('audio, video');
              mediaElements.forEach(el => { try { el.pause(); el.currentTime = 0; } catch (e) {} });
              setIsPlayingState(false);
            } else if (event.data.type === 'MASTER_TIME_SYNC') {
              const masterTime = event.data.currentTime;
              const isMasterPlaying = !!event.data.isPlaying;
              const v = overlayVideoRef.current;
              if (v && typeof masterTime === 'number' && !isNaN(masterTime)) {
                if (event.data.force) {
                  try {
                    v.currentTime = masterTime;
                  } catch (e) {}
                }
                if (isMasterPlaying) {
                  v.dataset.userPaused = 'false';
                  if (v.paused && localStorage.getItem('avalive_user_paused') !== 'true') {
                    v.play().catch(() => {});
                  }
                  setIsPlayingState(true);
                } else {
                  v.dataset.userPaused = 'true';
                  if (!v.paused) {
                    v.pause();
                  }
                  setIsPlayingState(false);
                }
              }
              if (typeof event.data.isMuted === 'boolean') {
                setIsVideoAudioMuted(event.data.isMuted);
                bandoAudio.setLocalSpeakerMute(event.data.isMuted);
                bandoAudio.setMuted(event.data.isMuted);
              }
            } else if (event.data.type === 'GLOBAL_PLAYBACK_CHANGE') {
              if (event.data.source === 'overlay') return;
              const shouldPlay = !!event.data.isPlaying;
              isInternalPlaybackChangeRef.current = true;
              setIsPlayingState(shouldPlay);
              setMasterState(prev => ({
                ...prev,
                videoPlaybackEvent: shouldPlay ? 'play' : 'pause',
                isPlaying: shouldPlay
              }));

              if (event.data.force && typeof event.data.currentTime === 'number' && overlayVideoRef.current) {
                try {
                  overlayVideoRef.current.currentTime = event.data.currentTime;
                } catch (e) {}
              }

              if (!shouldPlay) {
                try { 
                  localStorage.setItem('avalive_user_paused', 'true'); 
                  localStorage.setItem('avalive_window_capture_paused', 'true');
                } catch (e) {}
                const allMedia = document.querySelectorAll('video, audio');
                allMedia.forEach(v => {
                  try {
                    v.dataset.userPaused = 'true';
                    v.pause();
                  } catch (e) {}
                });
                if (typeof bandoAudio.pauseAll === 'function') bandoAudio.pauseAll();
              } else {
                try { 
                  localStorage.removeItem('avalive_user_paused'); 
                  localStorage.removeItem('avalive_window_capture_paused');
                } catch (e) {}
                const allMedia = document.querySelectorAll('video, audio');
                allMedia.forEach(v => {
                  try {
                    v.dataset.userPaused = 'false';
                    v.muted = isVideoAudioMuted;
                    if (!isVideoAudioMuted) v.volume = videoVolume;
                    v.play().catch(() => {});
                  } catch (e) {}
                });
              }
              setTimeout(() => { isInternalPlaybackChangeRef.current = false; }, 300);
            } else if (event.data.type === 'GLOBAL_AUDIO_CHANGE') {
              if (event.data.source === 'overlay') return;
              const isMuted = !!event.data.isMuted;
              const vol = typeof event.data.volume === 'number' ? event.data.volume : videoVolume;
              isInternalAudioChangeRef.current = true;
              setIsVideoAudioMuted(isMuted);
              setVideoVolume(vol);
              try {
                localStorage.setItem('avalive_audio_muted', isMuted ? 'true' : 'false');
                localStorage.setItem('avalive_video_volume', vol.toString());
              } catch (e) {}
              const allMedia = document.querySelectorAll('video, audio');
              allMedia.forEach(el => {
                try {
                  el.muted = isMuted;
                  el.volume = vol;
                } catch (e) {}
              });
              bandoAudio.setLocalSpeakerMute(isMuted);
              bandoAudio.setMuted(isMuted);
              bandoAudio.setMasterVolume(vol);
              setTimeout(() => { isInternalAudioChangeRef.current = false; }, 300);
            } else if (event.data.type === 'GLOBAL_MEDIA_CHANGE') {
              if (event.data.source === 'overlay') return;
              const newUrl = event.data.mediaUrl;
              if (newUrl) {
                let cleanUrl = newUrl;
                if (typeof cleanUrl === 'string' && cleanUrl.includes('/uploads/')) {
                  cleanUrl = cleanUrl.substring(cleanUrl.indexOf('/uploads/'));
                }
                try {
                  localStorage.removeItem('avalive_user_paused');
                  localStorage.removeItem('avalive_window_capture_paused');
                  localStorage.setItem('avalive_user_locked_media', cleanUrl);
                } catch (e) {}

                setMasterState(prev => ({
                  ...prev,
                  mediaUrl: cleanUrl,
                  selectedCharacter: event.data.characterId || prev.selectedCharacter,
                  characterName: event.data.characterName || prev.characterName,
                  stage: 'idol',
                  isVideo: event.data.isVideo !== false,
                  isPlaying: true,
                  videoPlaybackEvent: 'play',
                  videoCurrentTime: 0
                }));

                const v = overlayVideoRef.current;
                if (v) {
                  v.dataset.userPaused = 'false';
                  v.src = cleanUrl;
                  v.currentTime = 0;
                  v.muted = isVideoAudioMuted;
                  if (!isVideoAudioMuted) v.volume = videoVolume;
                  v.play().catch(() => {
                    v.muted = true;
                    v.play().catch(() => {});
                  });
                }
                setIsPlayingState(true);
              }
            } else if (event.data.type === 'MASTER_LIVE_STATE_UPDATE' || event.data.stage) {
              applyMasterState(event.data);
            } else if (event.data.type === 'LIVE_EVENT') {
              setLiveEvent(event.data.payload);
            }
          }
        };

        masterChannel.postMessage({ type: 'REQUEST_MASTER_LIVE_STATE' });

        bandoChannel = new BroadcastChannel('avalive_bando_stage');
        bandoChannel.onmessage = (e) => {
          if (e.data?.lastEvent) setLiveEvent(e.data.lastEvent);
        };

        battleChannel = new BroadcastChannel('avalive_gamebattle_stage');
        battleChannel.onmessage = (e) => {
          if (e.data?.type === 'LIVE_EVENT') setLiveEvent(e.data.payload);
        };

        cleanChannel = new BroadcastChannel('avalive_clean_stream_channel');
        cleanChannel.onmessage = (e) => {
          if (e.data?.type === 'STREAM_MEDIA_UPDATE') {
            setMasterState(prev => ({
              ...prev,
              mediaUrl: e.data.mediaUrl,
              flvUrl: e.data.flvUrl,
              isVideo: e.data.isVideo,
              characterName: e.data.characterName,
              isConnected: e.data.isConnected
            }));
          }
        };
      } catch (err) {}
    }

    // 5. POLLING REALTIME STUDIO CAM FRAME (Truyền hình thời gian thực cho OBS & TikTok Live Studio)
    const frameInterval = setInterval(() => {
      const pathname = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
      const isStudio = pathname.includes('/studio') || window.location.search.includes('studio') || window.location.search.includes('broadcast') || masterState?.stage === 'broadcast' || masterState?.stage === 'studio' || masterState?.isScreenSharing;
      if (!isStudio) return;

      const endpoint = getBackendUrl() ? `${getBackendUrl()}/api/studio-frame?t=${Date.now()}` : `/api/studio-frame?t=${Date.now()}`;
      fetch(endpoint, { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (data && data.frame) {
            updateStudioFrame(data.frame);
          }
        })
        .catch(() => {});
    }, 100);

    // 5. LOCAL STORAGE SYNC
    const handleStorage = (e) => {
      if (e.key === 'avalive_user_paused') {
        const isPaused = e.newValue === 'true';
        setIsPlayingState(!isPaused);
        const allMedia = document.querySelectorAll('video, audio');
        allMedia.forEach(v => {
          try {
            if (isPaused) {
              v.dataset.userPaused = 'true';
              v.pause();
            } else {
              v.dataset.userPaused = 'false';
              v.play().catch(() => {});
            }
          } catch (err) {}
        });
        if (isPaused && typeof bandoAudio.pauseAll === 'function') bandoAudio.pauseAll();
      } else if (e.key === 'avalive_audio_muted' || e.key === 'avalive_local_speaker_muted') {
        const isMuted = e.newValue === 'true';
        setIsVideoAudioMuted(isMuted);
        const allMedia = document.querySelectorAll('video, audio');
        allMedia.forEach(el => {
          try { el.muted = isMuted; } catch (err) {}
        });
        bandoAudio.setLocalSpeakerMute(isMuted);
        bandoAudio.setMuted(isMuted);
      } else if (e.key === 'avalive_video_volume') {
        const vol = parseFloat(e.newValue || '1');
        setVideoVolume(vol);
        const allMedia = document.querySelectorAll('video, audio');
        allMedia.forEach(el => {
          try { el.volume = vol; } catch (err) {}
        });
        bandoAudio.setMasterVolume(vol);
      } else if (e.key === 'avalive_master_live_state' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          applyMasterState(parsed);
        } catch (err) {}
      } else if (e.key === 'aidol_clean_stream_state' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setMasterState(prev => ({
            ...prev,
            mediaUrl: parsed.mediaUrl,
            flvUrl: parsed.flvUrl,
            isVideo: parsed.isVideo,
            characterName: parsed.characterName,
            isConnected: parsed.isConnected
          }));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorage);

    // 6. HEARTBEAT POLLING
    let lastUpdatedTimestamp = 0;
    const pollInterval = setInterval(() => {
      try {
        const saved = localStorage.getItem('avalive_master_live_state');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.updatedAt && parsed.updatedAt > lastUpdatedTimestamp) {
            lastUpdatedTimestamp = parsed.updatedAt;
            applyMasterState(parsed);
          }
        }
      } catch (e) {}

      const endpoint = getBackendUrl() ? `${getBackendUrl()}/api/live-state` : '/api/live-state';
      fetch(endpoint)
        .then(r => r.json())
        .then(data => {
          if (data && data.updatedAt && data.updatedAt > lastUpdatedTimestamp) {
            lastUpdatedTimestamp = data.updatedAt;
            applyMasterState(data);
          }
        })
        .catch(() => {});
    }, 1500);

    return () => {
      clearInterval(httpPollInterval);
      clearInterval(frameInterval);
      clearInterval(pollInterval);
      if (supabaseChannel) supabaseChannel.unsubscribe();
      if (socket) socket.disconnect();
      socketRef.current = null;
      if (studioCamBc) studioCamBc.close();
      if (videoControlBc) videoControlBc.close();
      if (masterChannel) masterChannel.close();
      if (bandoChannel) bandoChannel.close();
      if (battleChannel) battleChannel.close();
      if (cleanChannel) cleanChannel.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const flvVideoRef = useRef(null);
  const flvPlayerRef = useRef(null);
  const hlsPlayerRef = useRef(null);

  const isStreamUrl = (u) => typeof u === 'string' && (u.endsWith('.flv') || u.endsWith('.m3u8') || u.includes('.flv?') || u.includes('.m3u8?') || u.includes('pull-flv'));
  const activeStreamUrl = masterState.flvUrl && isStreamUrl(masterState.flvUrl) ? masterState.flvUrl : null;

  const attachFlvPlayer = (videoEl, url) => {
    if (!videoEl || !url) return;
    try {
      if (flvPlayerRef.current) {
        flvPlayerRef.current.destroy();
        flvPlayerRef.current = null;
      }
      if (hlsPlayerRef.current) {
        hlsPlayerRef.current.destroy();
        hlsPlayerRef.current = null;
      }

      if (url.includes('.m3u8') || url.includes('/hls')) {
        if (Hls.isSupported()) {
          const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(url);
          hls.attachMedia(videoEl);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoEl.play().catch(() => {});
          });
          hlsPlayerRef.current = hls;
        } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
          videoEl.src = url;
          videoEl.play().catch(() => {});
        }
      } else if (flvjs.isSupported()) {
        const flvPlayer = flvjs.createPlayer({
          type: 'flv',
          url: url,
          isLive: true,
          cors: true,
          enableWorker: true,
          enableStashBuffer: false,
          stashInitialSize: 128
        });
        flvPlayer.attachMediaElement(videoEl);
        flvPlayer.load();
        flvPlayer.play().catch(() => {});
        flvPlayerRef.current = flvPlayer;
      }
    } catch (e) {
      console.warn('[Overlay Player error]:', e);
    }
  };

  useEffect(() => {
    if (activeStreamUrl && flvVideoRef.current) {
      attachFlvPlayer(flvVideoRef.current, activeStreamUrl);
    }
    return () => {
      if (flvPlayerRef.current) {
        try { flvPlayerRef.current.destroy(); } catch (e) {}
        flvPlayerRef.current = null;
      }
      if (hlsPlayerRef.current) {
        try { hlsPlayerRef.current.destroy(); } catch (e) {}
        hlsPlayerRef.current = null;
      }
    };
  }, [activeStreamUrl]);

  // 🎬 ĐỒNG BỘ TUA (SEEK) THỜI GIAN THỰC KHI CÓ LỆNH FORCE TỪ PHẦN MỀM
  useEffect(() => {
    const v = overlayVideoRef.current;
    if (!v) return;
    if (masterState.force && masterState.videoPlaybackEvent === 'seeked' && typeof masterState.videoCurrentTime === 'number') {
      try { v.currentTime = masterState.videoCurrentTime; } catch (e) {}
    }
  }, [masterState.videoPlaybackEvent, masterState.videoCurrentTime, masterState.force]);

  // 🔊 CẬP NHẬT ÂM LƯỢNG & MUTE RIÊNG BIỆT (TUYỆT ĐỐI KHÔNG CAN THIỆP PLAY/PAUSE)
  useEffect(() => {
    const allMedia = document.querySelectorAll('video, audio');
    allMedia.forEach(el => {
      try {
        el.muted = isVideoAudioMuted;
        if (!isVideoAudioMuted) {
          el.volume = videoVolume;
        }
      } catch (e) {}
    });
  }, [isVideoAudioMuted, videoVolume]);

  // Tự động kích hoạt Camera khi mở chế độ Studio (phải nằm trước các early return để tuân thủ React Rules of Hooks)
  useEffect(() => {
    const pathname = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
    const isStudioRoute = masterState.stage === 'broadcast' || masterState.stage === 'studio' || pathname.includes('/studio');
    
    if (isStudioRoute) {
      if (!overlayWebcamStreamRef.current && typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false })
          .then(stream => {
            overlayWebcamStreamRef.current = stream;
            if (overlayWebcamVideoRef.current) {
              overlayWebcamVideoRef.current.srcObject = stream;
            }
            setOverlayCamActive(true);
          })
          .catch(err => {
            console.warn('[Studio Camera] Notice:', err.message);
          });
      }
    } else {
      // STOP NATIVE CAMERA WHEN LEAVING STUDIO MODE TO PREVENT OVERRIDING
      if (overlayWebcamStreamRef.current) {
        overlayWebcamStreamRef.current.getTracks().forEach(track => {
          try { track.stop(); } catch (e) {}
        });
        overlayWebcamStreamRef.current = null;
      }
      if (overlayWebcamVideoRef.current) {
        overlayWebcamVideoRef.current.srcObject = null;
      }
      setOverlayCamActive(false);
    }
  }, [masterState.stage]);

  // 🎯 WINDOW SURFACE INVALIDATOR & ANTI-THROTTLING
  // Giúp OBS/TikTok Studio bắt được hình khi dùng Window Capture, kể cả khi Chrome bị ẩn (minimized/background).
  useEffect(() => {
    const antiSleepDiv = document.createElement('div');
    antiSleepDiv.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;pointer-events:none;opacity:0.001;z-index:99999;background:white;';
    document.body.appendChild(antiSleepDiv);
    
    let frameCount = 0;
    const invalidate = () => {
      frameCount++;
      antiSleepDiv.style.background = frameCount % 2 === 0 ? '#000000' : '#ffffff';
    };

    // Web Worker Lightweight Keep-Alive (Không ngốn CPU, giữ video hoạt động mượt 60FPS)
    let bgWorker = null;
    try {
      const blob = new Blob([
        "let t; self.onmessage=e=>{ if(e.data==='start'){ if(!t) t=setInterval(()=>self.postMessage('tick'), 1000); } else if(e.data==='stop'){ clearInterval(t); t=null; } };"
      ], { type: 'application/javascript' });
      bgWorker = new Worker(URL.createObjectURL(blob));
      let tickCounter = 0;
      bgWorker.onmessage = () => {
        invalidate();
        tickCounter++;
        if (tickCounter % 2 === 0) {
          const isUserPaused = checkIfUserPaused();
          if (!isUserPaused) {
            const videos = document.querySelectorAll('video');
            videos.forEach(v => {
              if (v.paused && !v.ended && v.readyState >= 2 && v.dataset.userPaused !== 'true') {
                v.play().catch(() => {});
              }
            });
          }
        }
      };
      bgWorker.postMessage('start');
    } catch (e) {}

    return () => {
      if (bgWorker) {
        try { bgWorker.postMessage('stop'); bgWorker.terminate(); } catch (e) {}
      }
      if (antiSleepDiv.parentNode) antiSleepDiv.parentNode.removeChild(antiSleepDiv);
    };
  }, []);

  // Helper giải mã URL media chính xác (tôn trọng 100% video/nhân vật người dùng chọn)
  const resolveActiveMedia = () => {
    let candidateUrl = masterState.mediaUrl || null;
    let isVideo = masterState.isVideo !== false;

    // 1. Ưu tiên số 1: Trực tiếp từ masterState.mediaUrl (được Dashboard bắn sang thời gian thực)
    if (masterState.mediaUrl) {
      candidateUrl = masterState.mediaUrl;
    } else if (masterState.selectedCharacter && localDbItems.length > 0) {
      const match = localDbItems.find(i => i.id === masterState.selectedCharacter);
      if (match && (match.mediaUrl || match.url)) {
        candidateUrl = match.mediaUrl || match.url;
      }
    }

    // 2. Kiểm tra trong danh sách custom characters người dùng đã tải lên
    if (!candidateUrl) {
      try {
        const customRaw = localStorage.getItem('avalive_custom_characters');
        if (customRaw) {
          const customList = JSON.parse(customRaw);
          const customFound = customList.find(c => c.id === masterState.selectedCharacter);
          if (customFound && (customFound.url || customFound.mediaUrl)) {
            candidateUrl = customFound.url || customFound.mediaUrl;
          }
        }
      } catch (e) {}
    }

    // 2.5. Kiểm tra video đã được người dùng chọn phát cố định (Persistent Lock)
    if (!candidateUrl) {
      try {
        const locked = localStorage.getItem('avalive_user_locked_media');
        if (locked && typeof locked === 'string') {
          candidateUrl = locked;
        }
      } catch (e) {}
    }

    // 3. Khôi phục Blob URL từ IndexedDB nếu là video tùy chỉnh, và dùng Cache để không tạo URL mới liên tục
    if (typeof candidateUrl === 'string' && candidateUrl.startsWith('blob:')) {
      const charId = masterState.selectedCharacter || candidateUrl;
      if (blobUrlMapRef.current && blobUrlMapRef.current.has(charId)) {
        candidateUrl = blobUrlMapRef.current.get(charId);
      } else {
        const match = localDbItems.find(i => i.id === masterState.selectedCharacter);
        if (match && match.fileBlob) {
          try {
            candidateUrl = URL.createObjectURL(match.fileBlob);
            if (blobUrlMapRef.current) blobUrlMapRef.current.set(charId, candidateUrl);
          } catch (e) {}
        } else if (match && (match.mediaUrl || match.url) && !match.mediaUrl?.startsWith('blob:')) {
          candidateUrl = match.mediaUrl || match.url;
        } else {
          candidateUrl = null;
        }
      }
    }

    // 4. Tuyệt đối loại bỏ video nền cũ nếu có trong cache
    if (typeof candidateUrl === 'string' && (candidateUrl.includes('nhep_mieng.mp4') || candidateUrl.includes('demo_dancer.mp4') || candidateUrl.includes('default_idol.mp4'))) {
      candidateUrl = null;
    }

    // 5. Chuẩn hoá tuyệt đối URL cho HTTPS Overlay (TikTok Live Studio / OBS Browser Source)
    if (typeof candidateUrl === 'string') {
      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
      const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';

      // Loại bỏ tiền tố http/https lặp lại
      if (candidateUrl.includes('http://') && candidateUrl.lastIndexOf('http://') > 0) {
        candidateUrl = candidateUrl.substring(candidateUrl.lastIndexOf('http://'));
      } else if (candidateUrl.includes('https://') && candidateUrl.lastIndexOf('https://') > 0) {
        candidateUrl = candidateUrl.substring(candidateUrl.lastIndexOf('https://'));
      }

      // Chuẩn hoá đường dẫn file upload sang origin hiện tại hoặc Cloudflare Tunnel (Tránh Mixed Content và CORS 100%)
      const tunnelBase = masterState.tunnelUrl || (typeof window !== 'undefined' && (localStorage.getItem('avalive_tunnel_url') || (JSON.parse(localStorage.getItem('avalive_tunnel_data') || '{}')?.tunnelUrl))) || null;

      if (candidateUrl.includes('/uploads/')) {
        const pathPart = candidateUrl.substring(candidateUrl.indexOf('/uploads/'));
        if (currentOrigin.includes('vercel.app') && tunnelBase) {
          candidateUrl = `${tunnelBase.replace(/\/$/, '')}${pathPart}`;
        } else {
          candidateUrl = currentOrigin ? `${currentOrigin}${pathPart}` : pathPart;
        }
      } else if (candidateUrl.startsWith('/')) {
        if (currentOrigin.includes('vercel.app') && tunnelBase && (candidateUrl.endsWith('.mp4') || candidateUrl.endsWith('.webm') || candidateUrl.endsWith('.mov'))) {
          candidateUrl = `${tunnelBase.replace(/\/$/, '')}${candidateUrl}`;
        } else {
          candidateUrl = currentOrigin ? `${currentOrigin}${candidateUrl}` : candidateUrl;
        }
      } else if (isHttps && candidateUrl.startsWith('http://')) {
        try {
          const parsed = new URL(candidateUrl);
          if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1' || parsed.hostname.includes('nip.io')) {
            if (currentOrigin.includes('vercel.app') && tunnelBase) {
              candidateUrl = `${tunnelBase.replace(/\/$/, '')}${parsed.pathname}${parsed.search}`;
            } else {
              candidateUrl = `${currentOrigin}${parsed.pathname}${parsed.search}`;
            }
          }
        } catch (e) {}
      }
    }

    // 6. Xác định chính xác video hay ảnh
    if (typeof candidateUrl === 'string') {
      const lower = candidateUrl.toLowerCase();
      if (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mov') || lower.includes('/uploads/')) {
        isVideo = true;
      } else if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.webp')) {
        isVideo = false;
      }
    }

    // 7. TUYỆT ĐỐI KHÔNG DÙNG VIDEO NỀN MẶC ĐỊNH KHI CHƯA YÊU CẦU: NẾU KHÔNG CÓ URL HOẶC URL LÀ RÁC/NULL -> TRẢ VỀ NULL
    if (!candidateUrl || candidateUrl.includes('mixkit.co') || candidateUrl.includes('default_idol.mp4')) {
      candidateUrl = null;
      isVideo = false;
    }

    return { url: candidateUrl, isVideo };
  };

  const activeMedia = resolveActiveMedia();

  // 🕒 24/7 CONTINUOUS PLAYBACK WATCHDOG (TỰ ĐỘNG PHỤC HỒI & PHÁT LIÊN TỤC 24/24 KHI STREAMING)
  useEffect(() => {
    const watchdogTimer = setInterval(() => {
      const vid = overlayVideoRef.current;
      if (!vid || !activeMedia.url || !activeMedia.isVideo) return;

      // Nếu streamer đã bấm tạm dừng thì TUYỆT ĐỐI KHÔNG TỰ ĐỘNG PHÁT LẠI
      const isUserPaused = checkIfUserPaused();
      if (isUserPaused) return;

      if (vid.paused && !vid.seeking) {
        vid.muted = isVideoAudioMuted;
        if (!isVideoAudioMuted) vid.volume = videoVolume;
        vid.play().then(() => setIsPlayingState(true)).catch(() => {
          vid.muted = true;
          vid.play().then(() => setIsPlayingState(true)).catch(() => {});
        });
      }
    }, 2000);

    return () => clearInterval(watchdogTimer);
  }, [isVideoAudioMuted, videoVolume, activeMedia.url]);

  // 🖼️ HỖ TRỢ CHẾ ĐỘ CỬA SỔ NỔI (PICTURE-IN-PICTURE)
  const togglePip = async () => {
    const v = overlayVideoRef.current;
    if (!v) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled && !v.disablePictureInPicture) {
        await v.requestPictureInPicture();
      }
    } catch (err) {
      console.warn('[CleanLiveOverlay] Picture-in-Picture error:', err);
    }
  };

  // ⌨️ PHÍM TẮT TIỆN LỢI CHO WINDOW CAPTURE: H (Ẩn/Hiện Điều Khiển), Space (Play/Pause), M (Mute/Unmute)
  useEffect(() => {
    if (!isWindowCapture) return;
    const handleKeyDown = (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.key === 'h' || e.key === 'H') {
        setIsControlDockCollapsed(prev => {
          const next = !prev;
          try { localStorage.setItem('avalive_window_capture_dock_collapsed', String(next)); } catch (err) {}
          return next;
        });
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleAudioMute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWindowCapture, isPlayingState, isVideoAudioMuted, videoVolume]);

  // 🛡️ BACKGROUND KEEP-ALIVE & ANTI-THROTTLING: GIỮ LUỒNG VIDEO CHẠY LIÊN TỤC KHI CHUYỂN TAB HOẶC ẨN CỬA SỔ
  // Khởi tạo một lần duy nhất khi mount để AudioContext không bao giờ bị đóng ngắt giữa chừng
  useEffect(() => {
    let keepAliveAudioCtx = null;
    let oscillatorNode = null;
    let gainNode = null;
    let wakeLockSentinel = null;

    const startKeepAlive = () => {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          if (!keepAliveAudioCtx || keepAliveAudioCtx.state === 'closed') {
            keepAliveAudioCtx = new AudioCtx();
            oscillatorNode = keepAliveAudioCtx.createOscillator();
            gainNode = keepAliveAudioCtx.createGain();
            // Âm thanh dưới ngưỡng nghe (0.00001) với tần số 20Hz để Chromium nhận dạng tab phát âm thanh liên tục
            oscillatorNode.frequency.value = 20;
            gainNode.gain.value = 0.00001;
            oscillatorNode.connect(gainNode);
            gainNode.connect(keepAliveAudioCtx.destination);
            oscillatorNode.start();
          }
          if (keepAliveAudioCtx.state === 'suspended') {
            keepAliveAudioCtx.resume().catch(() => {});
          }
        }
      } catch (e) {}

      if ('wakeLock' in navigator && !wakeLockSentinel) {
        try {
          navigator.wakeLock.request('screen').then(sentinel => {
            wakeLockSentinel = sentinel;
          }).catch(() => {});
        } catch (e) {}
      }
    };

    startKeepAlive();
    window.addEventListener('click', startKeepAlive);
    window.addEventListener('pointerdown', startKeepAlive);
    window.addEventListener('touchstart', startKeepAlive);

    // Bắt sự kiện chuyển tab hoặc thu nhỏ cửa sổ
    const handleVisibilityChange = () => {
      const vid = overlayVideoRef.current;
      if (!vid) return;

      const isUserPaused = checkIfUserPaused();
      if (!isUserPaused && vid.paused) {
        vid.play().catch(() => {
          vid.muted = true;
          vid.play().catch(() => {});
        });
      }

      if (document.visibilityState === 'visible') {
        if (!wakeLockSentinel && 'wakeLock' in navigator) {
          navigator.wakeLock.request('screen').then(s => { wakeLockSentinel = s; }).catch(() => {});
        }
        if (keepAliveAudioCtx && keepAliveAudioCtx.state === 'suspended') {
          keepAliveAudioCtx.resume().catch(() => {});
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
      window.removeEventListener('click', startKeepAlive);
      window.removeEventListener('pointerdown', startKeepAlive);
      window.removeEventListener('touchstart', startKeepAlive);
      if (oscillatorNode) {
        try { oscillatorNode.stop(); oscillatorNode.disconnect(); } catch (e) {}
      }
      if (gainNode) {
        try { gainNode.disconnect(); } catch (e) {}
      }
      if (keepAliveAudioCtx) {
        try { keepAliveAudioCtx.close(); } catch (e) {}
      }
      if (wakeLockSentinel) {
        try { wakeLockSentinel.release(); } catch (e) {}
      }
    };
  }, []);

  // Đồng bộ MediaSession trạng thái phát
  useEffect(() => {
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.playbackState = isPlayingState ? 'playing' : 'paused';
        navigator.mediaSession.metadata = new MediaMetadata({
          title: 'AvaLive VIP PRO - Window Capture 60FPS',
          artist: 'AvaLive Master Studio',
          album: 'Live TikTok Studio / OBS'
        });
      } catch (e) {}
    }
  }, [isPlayingState]);

  // 🎬 TỰ ĐỘNG PHÁT NGAY KHI ĐỔI VIDEO / NHÂN VẬT TỪ PHẦN MỀM (0MS DELAY)
  useEffect(() => {
    const vid = overlayVideoRef.current;
    if (vid && activeMedia.url && activeMedia.isVideo) {
      const isUserPaused = checkIfUserPaused();
      if (!isUserPaused) {
        vid.dataset.userPaused = 'false';
        vid.muted = !hasAutoplayStarted ? true : isVideoAudioMuted;
        if (!isVideoAudioMuted && hasAutoplayStarted) vid.volume = videoVolume;
        
        // CHỈ GỌI vid.load() KHI URL THỰC SỰ THAY ĐỔI
        // TUYỆT ĐỐI KHÔNG GỌI vid.load() KHI CHUYỂN TAB ĐỂ TRÁNH RESET 0:00 HOẶC MẤT VIDEO
        const isNewUrl = lastLoadedMediaUrlRef.current !== activeMedia.url;
        if (isNewUrl) {
          lastLoadedMediaUrlRef.current = activeMedia.url;
          try { vid.load(); } catch (e) {}
        }

        const playPromise = vid.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlayingState(true);
            if (!hasAutoplayStarted) {
              setHasAutoplayStarted(true);
              if (!isVideoAudioMuted) {
                setTimeout(() => {
                  try { vid.muted = false; vid.volume = videoVolume; } catch (e) {}
                }, 150);
              }
            }
          }).catch(() => {
            vid.muted = true;
            vid.play().then(() => setIsPlayingState(true)).catch(() => {});
          });
        }
      }
    }
  }, [activeMedia.url, isVideoAudioMuted, videoVolume, masterState.videoPlaybackEvent, masterState.isPlaying]);

  // 4 SÂN KHẤU: ĐƯỢC LỒNG TRONG KHUNG PHÁT SÓNG SẠCH 100% CỐ ĐỊNH TỈ LỆ
  // BÊN TRÊN LÀ THANH ĐIỀU KHIỂN NGOẠI KHUNG (NẰM NGOÀI KHUNG HÌNH LIVE ĐỂ KHÔNG CHÈN VÀO OBS)
  const currentStage = masterState.stage || 'idol';
  const ratio = masterState.aspectRatio || '9:16';

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden flex flex-col bg-black select-none font-sans">
      {/* 👑 KHUNG QUẢN TRỊ WINDOW CAPTURE NGOẠI VI RIÊNG BIỆT (NẰM HOÀN TOÀN MÉ NGOÀI - TUYỆT ĐỐI KHÔNG CHE KHUNG LIVE) */}
      {isWindowCapture && !isControlDockCollapsed && (
        <>
        <header className="w-full shrink-0 bg-[#0c0f17]/95 backdrop-blur-md border-b border-cyan-500/30 px-3 sm:px-4 py-2 z-40 flex items-center justify-between gap-3 shadow-2xl transition-all duration-200">
          {/* Trạng thái Live & Khung hình */}
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-black text-white tracking-wider uppercase">
                  WINDOW CAPTURE (60FPS)
                </span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 border border-cyan-400/40 text-[9px] font-bold text-cyan-300">
                  v1.6.3
                </span>
              </div>
              <span className="text-[9.5px] text-emerald-400/90 font-medium">
                ⚡ Giữ luồng chạy liên tục 24/7 khi đổi tab
              </span>
            </div>
          </div>

          {/* Cụm nút điều khiển Quản trị */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* 1. NÚT PHÁT / TẠM DỪNG */}
            <button
              onClick={togglePlayPause}
              className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all transform active:scale-95 ${
                isPlayingState
                  ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/30 animate-pulse'
              }`}
              title="Phím tắt: Space (Dấu cách)"
            >
              <span>{isPlayingState ? '⏸️ Tạm Dừng' : '▶️ Tiếp Tục Phát'}</span>
            </button>

            {/* 2. NÚT BẬT / TẮT TIẾNG */}
            <button
              onClick={toggleAudioMute}
              className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all transform active:scale-95 ${
                !isVideoAudioMuted
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-500/30'
                  : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
              }`}
              title="Phím tắt: Phím M"
            >
              <span>{!isVideoAudioMuted ? `🔊 Đang Bật Tiếng (${Math.round(videoVolume * 100)}%)` : '🔇 Đang Tắt Tiếng'}</span>
            </button>

            {/* 3. THANH TRƯỢT ÂM LƯỢNG */}
            <div className="hidden md:flex items-center gap-1.5 bg-white/5 px-2.5 py-1.2 rounded-xl border border-white/10">
              <span className="text-[10px] text-gray-400 font-mono">Vol</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isVideoAudioMuted ? 0 : videoVolume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-16 lg:w-20 h-1 accent-cyan-400 cursor-pointer"
                title="Âm lượng video"
              />
            </div>

            {/* 4. CHẾ ĐỘ CỬA SỔ NỔI (PiP) */}
            <button
              onClick={togglePip}
              className="hidden sm:flex px-2.5 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-bold items-center gap-1 cursor-pointer transition-all"
              title="Mở video nổi trên màn hình máy tính"
            >
              <span>🖼️ Cửa Sổ Nổi (PiP)</span>
            </button>

            {/* 5. TỈ LỆ KHUNG HÌNH FIT */}
            <button
              onClick={() => {
                const nextFit = objectFitState === 'cover' ? 'contain' : 'cover';
                setObjectFitState(nextFit);
                try { localStorage.setItem('avalive_overlay_fit', nextFit); } catch (e) {}
              }}
              className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-medium cursor-pointer transition-all"
              title="Chuyển đổi Tràn Viền / Vừa Khung"
            >
              <span>📐 {objectFitState === 'cover' ? 'Tràn Viền' : 'Vừa Khung'}</span>
            </button>

            {/* 6. NÚT ẨN BẢNG ĐIỀU KHIỂN */}
            <button
              onClick={() => {
                setIsControlDockCollapsed(true);
                try { localStorage.setItem('avalive_window_capture_dock_collapsed', 'true'); } catch (e) {}
              }}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black flex items-center gap-1.5 border border-white/20 cursor-pointer transition-all hover:border-cyan-400/50"
              title="Ẩn bảng điều khiển để khung phát 100% video live (Phím tắt: H)"
            >
              <span>👁️ Ẩn Bảng Điều Khiển</span>
            </button>
          </div>
        </header>
        {/* ✂️ BẢNG VẠCH CẮT CÁCH LY AN TOÀN CHO OBS / TIKTOK LIVE STUDIO (CÁCH XA KHUNG 9:16) */}
        <div className="w-full shrink-0 bg-[#06080d] border-b-2 border-dashed border-amber-500/50 py-2.5 px-3 sm:px-4 flex items-center justify-between text-[11px] text-amber-300 select-none shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-sm">✂️</span>
            <span className="font-mono font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
              KHOẢNG CẮT CÁCH LY AN TOÀN CHO OBS / TIKTOK LIVE STUDIO
            </span>
            <span className="hidden md:inline text-[10.5px] text-gray-400 font-normal">
              (Kéo crop mép trên đến dải này để tách biệt 100% thanh điều khiển khỏi khung Live 9:16)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-cyan-300/90 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
              Khung video 9:16 bắt đầu bên dưới ⬇️
            </span>
          </div>
        </div>
        </>
      )}

      {/* NÚT THU GỌN NGOẠI VI: KHI ĐÃ ẨN BẢNG ĐIỀU KHIỂN, NÚT GỌN NÀY CHO PHÉP MỞ LẠI BẤT KỲ LÚC NÀO */}
      {isWindowCapture && isControlDockCollapsed && (
        <button
          onClick={() => {
            setIsControlDockCollapsed(false);
            try { localStorage.setItem('avalive_window_capture_dock_collapsed', 'false'); } catch (e) {}
          }}
          className="fixed top-2 right-2 z-50 px-2.5 py-1 rounded-xl bg-black/75 hover:bg-black/95 text-cyan-300 hover:text-cyan-100 border border-cyan-500/40 text-[11px] font-bold backdrop-blur-md shadow-2xl flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-all cursor-pointer"
          title="Bấm để hiện lại bảng điều khiển (Phím tắt: H)"
        >
          <span>👁️ Hiện Điều Khiển (H)</span>
        </button>
      )}

      {/* KHUNG PHÁT SÓNG SẠCH 100% (CHUẨN 9:16 HOẶC 16:9 - SIÊU SẮC NÉT OBS / TIKTOK STUDIO, 100% NGUYÊN BẢN KHÔNG DÍNH BẤT KỲ GIAO DIỆN NÀO) */}
      <main className={`w-full flex-1 min-h-0 relative overflow-hidden flex items-center justify-center bg-black transition-all duration-200 ${
        isWindowCapture && !isControlDockCollapsed ? 'p-3 sm:p-5 pt-3 pb-3' : ''
      }`}>
        <div 
          className={`relative flex items-center justify-center overflow-hidden transition-all duration-200 ${
            !isWindowCapture
              ? 'w-full h-full'
              : ratio === '9:16'
                ? 'h-full aspect-[9/16] w-auto max-w-full'
                : 'w-full aspect-[16/9] h-auto max-h-full'
          } ${isWindowCapture && !isControlDockCollapsed ? 'ring-1 ring-cyan-500/30 rounded-lg shadow-[0_0_40px_rgba(0,0,0,0.85)]' : ''}`}
          style={
            !isWindowCapture
              ? { width: '100%', height: '100%' }
              : ratio === '9:16' 
                ? { 
                    aspectRatio: '9 / 16', 
                    height: '100%', 
                    maxWidth: '100%' 
                  } 
                : { aspectRatio: '16 / 9', width: '100%', maxHeight: '100%' }
          }
        >
          {/* SÂN KHẤU 1: LIVE AI IDOL (CHỈ RENDER KHI Ở TAB IDOL ĐỂ TỐI ƯU 100% TÀI NGUYÊN) */}
          {currentStage === 'idol' && (
            <div className="w-full h-full absolute inset-0 flex items-center justify-center overflow-hidden bg-black">
            {activeMedia.url && activeMedia.isVideo ? (
              <>
                <video
                  ref={overlayVideoRef}
                  key="avalive_overlay_main_video"
                  src={activeMedia.url}
                  autoPlay={true}
                  loop
                  muted={!hasAutoplayStarted ? true : isVideoAudioMuted}
                  defaultMuted={true}
                  playsInline
                  controls={false}
                  preload="auto"
                  disableRemotePlayback
                  onLoadedMetadata={(e) => {
                    const v = e.currentTarget;
                    const isUserPaused = checkIfUserPaused();
                    if (!isUserPaused) {
                      v.dataset.userPaused = 'false';
                      v.muted = !hasAutoplayStarted ? true : isVideoAudioMuted;
                      const p = v.play();
                      if (p !== undefined) {
                        p.then(() => {
                          setIsPlayingState(true);
                          if (!isVideoAudioMuted && !hasAutoplayStarted) {
                            setTimeout(() => {
                              try { v.muted = false; v.volume = videoVolume; } catch (err) {}
                            }, 150);
                          }
                        }).catch(() => {
                          v.muted = true;
                          v.play().then(() => setIsPlayingState(true)).catch(() => {});
                        });
                      }
                    } else {
                      v.dataset.userPaused = 'true';
                      v.pause();
                      setIsPlayingState(false);
                    }
                  }}
                  onPlay={() => {
                    setIsPlayingState(true);
                    if (!hasAutoplayStarted) {
                      setHasAutoplayStarted(true);
                      if (!isVideoAudioMuted) {
                        setTimeout(() => {
                          const v = overlayVideoRef.current;
                          if (v) {
                            try { v.muted = false; v.volume = videoVolume; } catch (e) {}
                          }
                        }, 150);
                      }
                    }
                  }}
                  onPause={() => {
                    const isUserPaused = checkIfUserPaused();
                    if (isUserPaused) {
                      setIsPlayingState(false);
                    } else {
                      // Ngăn chặn Chromium tự ngắt video khi chuyển tab hoặc cửa sổ bị che khuất
                      const v = overlayVideoRef.current;
                      if (v && !isUserPaused) {
                        v.play().catch(() => {
                          v.muted = true;
                          v.play().catch(() => {});
                        });
                      }
                    }
                  }}
                  onCanPlay={(e) => {
                    const v = e.currentTarget;
                    const isUserPaused = checkIfUserPaused();
                    if (!isUserPaused && v.paused) {
                      v.dataset.userPaused = 'false';
                      v.muted = !hasAutoplayStarted ? true : isVideoAudioMuted;
                      const p = v.play();
                      if (p !== undefined) {
                        p.then(() => setIsPlayingState(true)).catch(() => {
                          v.muted = true;
                          v.play().then(() => setIsPlayingState(true)).catch(() => {});
                        });
                      }
                    } else if (isUserPaused) {
                      v.dataset.userPaused = 'true';
                      v.pause();
                    }
                  }}
                  onWaiting={() => {
                    const v = overlayVideoRef.current;
                    const isUserPaused = checkIfUserPaused();
                    if (v && !isUserPaused) {
                      v.play().catch(() => {
                        v.muted = true;
                        v.play().catch(() => {});
                      });
                    }
                  }}
                  onStalled={() => {
                    const v = overlayVideoRef.current;
                    const isUserPaused = checkIfUserPaused();
                    if (v && !isUserPaused) {
                      v.play().then(() => setIsPlayingState(true)).catch(() => {
                        v.muted = true;
                        v.play().then(() => setIsPlayingState(true)).catch(() => {});
                      });
                    }
                  }}
                  onEnded={(e) => {
                    e.currentTarget.currentTime = 0;
                    const isUserPaused = checkIfUserPaused();
                    if (!isUserPaused) {
                      e.currentTarget.play().then(() => setIsPlayingState(true)).catch(() => {
                        e.currentTarget.muted = true;
                        e.currentTarget.play().then(() => setIsPlayingState(true)).catch(() => {});
                      });
                    } else {
                      e.currentTarget.pause();
                    }
                  }}
                  onError={(e) => {
                    console.warn('[CleanLiveOverlay] Tải lại nguồn video...');
                    const v = e.currentTarget;
                    if (v && !v.dataset.retried) {
                      v.dataset.retried = 'true';
                      setTimeout(() => { try { v.load(); v.play().catch(() => {}); } catch(err){} }, 500);
                    }
                  }}
                  className="w-full h-full select-none absolute inset-0 transform-gpu"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: objectFitState || 'cover',
                    transform: 'translateZ(0)',
                    WebkitTransform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    imageRendering: '-webkit-optimize-contrast',
                    willChange: 'transform'
                  }}
                />
              </>
            ) : activeStreamUrl ? (
              <video
                ref={flvVideoRef}
                key={activeStreamUrl}
                autoPlay
                muted={isVideoAudioMuted}
                playsInline
                className="w-full h-full select-none bg-black absolute inset-0 transform-gpu block"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: objectFitState || 'cover',
                  transform: 'translateZ(0)',
                  WebkitTransform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  imageRendering: '-webkit-optimize-contrast',
                  willChange: 'transform'
                }}
              />
            ) : activeMedia.url ? (
              <img 
                src={activeMedia.url} 
                className="w-full h-full select-none absolute inset-0"
                style={{ width: '100%', height: '100%', objectFit: objectFitState || 'cover', imageRendering: '-webkit-optimize-contrast' }}
                alt="AI Idol"
              />
            ) : (
              <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#07080d] via-[#0d1017] to-[#040508] text-center p-6 select-none">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-pink-600 via-rose-600 to-red-600 flex items-center justify-center mb-5 shadow-2xl shadow-rose-500/30 animate-pulse">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">SẴN SÀNG PHÁT LUỒNG (9:16)</h3>
                <p className="text-gray-400 text-xs mt-2 max-w-xs leading-relaxed">
                  Vui lòng tải lên hoặc chọn video trên phần mềm để bắt đầu phát trực tiếp
                </p>
                <div className="mt-4 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[11px] text-cyan-300 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Đang kết nối Realtime với phần mềm AvaLive...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SÂN KHẤU 2: GAME BẢN ĐỒ VIỆT NAM (CẮM CỜ 63 TỈNH THÀNH) - CHỈ MOUNT KHI BẬT TAB BẢN ĐỒ */}
        {(currentStage === 'bando' || currentStage === 'vietnam_map' || currentStage === 'map') && (
          <div className="w-full h-full absolute inset-0 overflow-hidden bg-transparent select-none pointer-events-auto">
            <GameBanDoVietNam 
              isPopout={true}
              aspectRatio={ratio}
              externalLiveEvent={liveEvent}
              isDarkMode={masterState.isDarkMode !== false}
            />
          </div>
        )}

        {/* SÂN KHẤU 3: GAME CHIẾN ĐẤU PK ĐẠI CHIẾN - CHỈ MOUNT KHI BẬT TAB CHIẾN ĐẤU */}
        {(currentStage === 'battle' || currentStage === 'gamebattle' || currentStage === 'game') && (
          <div className="w-full h-full absolute inset-0 overflow-hidden bg-transparent select-none pointer-events-auto">
            <GameChienDau 
              isPopout={true}
              aspectRatio={ratio}
              externalLiveEvent={liveEvent}
              isDarkMode={masterState.isDarkMode !== false}
            />
          </div>
        )}

        {/* SÂN KHẤU 4: PHÒNG DỰNG LIVE STUDIO 4K - CHỈ MOUNT KHI BẬT TAB STUDIO */}
        {(currentStage === 'broadcast' || currentStage === 'studio') && (
          <div className="w-full h-full absolute inset-0 overflow-hidden bg-black flex items-center justify-center select-none">
            {overlayCamActive ? (
              <video
                ref={(el) => {
                  overlayWebcamVideoRef.current = el;
                  if (el && overlayWebcamStreamRef.current && el.srcObject !== overlayWebcamStreamRef.current) {
                    el.srcObject = overlayWebcamStreamRef.current;
                  }
                }}
                autoPlay
                playsInline
                muted={isVideoAudioMuted}
                className="w-full h-full select-none scale-x-[-1] bg-black transform-gpu block"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: objectFitState || 'cover',
                  transform: 'translateZ(0)',
                  WebkitTransform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  imageRendering: '-webkit-optimize-contrast',
                  willChange: 'transform'
                }}
              />
            ) : hasStudioFrame ? (
              <img
                ref={studioImageRef}
                alt="Live Studio Realtime Camera Stream"
                className="w-full h-full select-none bg-black transform-gpu"
                style={{ width: '100%', height: '100%', objectFit: objectFitState || 'cover' }}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#0F1016] via-[#151824] to-[#0A0A0F] text-center p-6 select-none">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center mb-4 shadow-2xl shadow-blue-500/30 animate-pulse">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-black text-white tracking-wide">PHÒNG DỰNG LIVE STUDIO 4K</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">Góc máy Camera đang chờ tín hiệu kết nối từ Bảng điều khiển Studio...</p>
                <div className="mt-4 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10.5px] font-black flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>TÍN HIỆU LIVE STUDIO SẴN SÀNG</span>
                </div>
              </div>
            )}
          </div>
        )}
        </div>
      </main>

      {/* Animation Styles */}
      <style>{`
        @keyframes idolBreathing {
          0%, 100% { transform: scale(1) translateY(0px); }
          50% { transform: scale(1.015) translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
